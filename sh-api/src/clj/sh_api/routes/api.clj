(ns sh-api.routes.api
    (:require [compojure.core :refer [defroutes GET context]]
      [ring.util.http-response :as response]
      [org.httpkit.client :as http]
      [clojure.tools.logging :as log]
      [jsonista.core :as json]
      [taoensso.carmine :as car :refer [wcar]]
      [sh-api.sni :refer [sni-configure]]
      [clojure.core.async :as async :refer [<! timeout chan go]]))

(def sni-client (http/make-client {:ssl-configurer sni-configure}))

(declare init-cache)

(declare fetch-products-from-api)

(declare mapper)

(def condition (atom true))

(defn hours
      "Converts hours -> milliseconds"
      [n] (* n 36e5))

(def run-every (hours 1/60))

(defn schedule-work []
      (log/info "_*_ BIG-COMMERCE API CACHE :: FETCHING DATA _*_")
      (init-cache))

(defn evaluating-condition []
      @condition)

(defn stop-periodic-function []
      (reset! condition false))

(go
  (while (evaluating-condition)
         (<! (timeout run-every))
         (schedule-work)))

(def server1-conn {:pool {} :spec {:uri "redis://127.0.0.1:6379"}})

(defmacro wcar* [& body] `(car/wcar server1-conn ~@body))

(defn init-cache []
      (log/info "_*_ BIG-COMMERCE API CACHE :: STARTED _*_")
      (prn "fetching...")
      (log/info "_*_ BIG-COMMERCE API CACHE :: COMPLETED _*_"))

(def mapper
  (json/object-mapper
    {:decode-key-fn keyword
     :encode-key-fn name}))

;; `${baseAPIUrl}/products?page=${page}&limit=${limit}&filter=[${this.filterNewItems}]`

(defn fetch-products-from-api [page]
  (let [endpoint "https://hi1q1w1kij.execute-api.us-east-1.amazonaws.com/dev/serverless-dev-getProducts"
        options {:query-params {:page page}
                 :client sni-client}]
       (let [{:keys [error body]} @(http/get endpoint options)]
            (if-not error
              {:body body}
              {:error error}))))

;
(defn products-handler [{query-params :query-params}]
  (let [redis-data (wcar* (car/get (str "/products/" (:page query-params))))]
    (response/ok (json/read-value "{}" mapper))))

(defroutes api-routes
  (context "/api" []
    (GET "/products" {params :params} products-handler)))

