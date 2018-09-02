(ns user
  (:require [sh-api.config :refer [env]]
            [clojure.spec.alpha :as s]
            [expound.alpha :as expound]
            [mount.core :as mount]
            [sh-api.core :refer [start-app]]))

(alter-var-root #'s/*explain-out* (constantly expound/printer))

(defn start []
  (mount/start-without #'sh-api.core/repl-server))

(defn stop []
  (mount/stop-except #'sh-api.core/repl-server))

(defn restart []
  (stop)
  (start))


