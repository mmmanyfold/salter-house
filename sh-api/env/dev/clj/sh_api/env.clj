(ns sh-api.env
  (:require [selmer.parser :as parser]
            [clojure.tools.logging :as log]
            [sh-api.dev-middleware :refer [wrap-dev]]))

(def defaults
  {:init
   (fn []
     (parser/cache-off!)
     (log/info "\n-=[sh-api started successfully using the development profile]=-"))
   :stop
   (fn []
     (log/info "\n-=[sh-api has shut down successfully]=-"))
   :middleware wrap-dev})
