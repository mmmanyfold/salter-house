(ns sh-api.sni
    (:import
      [java.net URI]
      [javax.net.ssl
       SNIHostName SNIServerName SSLEngine SSLParameters]))

(defn sni-configure
      [^SSLEngine ssl-engine ^URI uri]
      (let [^SSLParameters ssl-params (.getSSLParameters ssl-engine)]
               (.setServerNames ssl-params [(SNIHostName. (.getHost uri))])
               (.setSSLParameters ssl-engine ssl-params)))
