FROM clojure:alpine

ENV APP_SRC=/usr/src/app
RUN mkdir -p ${APP_SRC}

RUN apk --update add redis

RUN mkdir -p ${APP_SRC}
WORKDIR ${APP_SRC}
COPY project.clj ${APP_SRC}
RUN lein deps
COPY . ${APP_SRC}
RUN lein uberjar

COPY start.sh ${APP_SRC}

RUN mv ${APP_SRC}/target/uberjar/sh-api.jar .
RUN rm -rf ${APP_SRC}/target/*

EXPOSE 3000

CMD ["./start.sh"]
