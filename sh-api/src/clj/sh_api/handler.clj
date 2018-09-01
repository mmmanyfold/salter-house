(ns sh-api.handler
  (:require [sh-api.middleware :as middleware]
            [sh-api.routes.services :refer [service-routes]]
            [compojure.core :refer [routes wrap-routes]]
            [ring.util.http-response :as response]
            [compojure.route :as route]
            [sh-api.env :refer [defaults]]
            [mount.core :as mount]
            [sh-api.routes.api :refer [api-routes]]))

(mount/defstate init-app
  :start ((or (:init defaults) identity))
  :stop  ((or (:stop defaults) identity)))

(mount/defstate app
  :start
  (middleware/wrap-base
    (routes
          (-> #'api-routes (wrap-routes middleware/wrap-formats))
          #'service-routes
          (route/not-found
             "page not found"))))

