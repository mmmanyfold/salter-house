(ns sh-api.routes.api
    (:require [compojure.core :refer [defroutes GET context]]
      [ring.util.http-response :as response]
      [org.httpkit.client :as http]
      [clojure.tools.logging :as log]
      [jsonista.core :as json]
      [taoensso.carmine :as car :refer [wcar]]
      [clojure.core.async :as async :refer [<! timeout chan go]]))

(declare init-cache)

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
      (prn "....")
      (log/info "_*_ BIG-COMMERCE API CACHE :: COMPLETED _*_"))

(def mapper
  (json/object-mapper
    {:decode-key-fn keyword
     :encode-key-fn name}))

;(defn fetch-products-from-api
;      "retrieve all items available for given resource table based on :offset"
;      [resource & [offset]]
;      (let [endpoint ""
;            options {:query-params (when offset {:offset offset})}]
;           (let [{:keys [error body]} @(http/get endpoint options)]
;                (if-not error
;                        {:error error}))))

(defn products-handler [req]
  ;redis-data (wcar* (car/get path-info))]
  (let []
   (response/ok {:test "foo"})))

(defroutes api-routes
  (context "/api" []
    (GET "/products" {params :params} products-handler)))

