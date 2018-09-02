(ns sh-api.env
  (:require [clojure.tools.logging :as log]))

(def defaults
  {:init
   (fn []
     (log/info "\n-=[sh-api started successfully]=-"))
   :stop
   (fn []
     (log/info "\n-=[sh-api has shut down successfully]=-"))
   :middleware identity})
