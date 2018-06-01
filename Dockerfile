FROM openjdk:7u121-alpine

# 1. maven environment
ENV MAVEN_VERSION="3.5.3" \
    M2_HOME=/usr/lib/mvn

RUN apk add --update wget && \
  cd /tmp && \
  wget "http://ftp.unicamp.br/pub/apache/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz" && \
  tar -zxvf "apache-maven-$MAVEN_VERSION-bin.tar.gz" && \
  mv "apache-maven-$MAVEN_VERSION" "$M2_HOME" && \
  ln -s "$M2_HOME/bin/mvn" /usr/bin/mvn && \
  apk del wget && \
  rm /tmp/* /var/cache/apk/*

# 2. use vertx base Dockerfile for Vertx 2.1.6
COPY docker_resource/vert.x-2.1.6 /usr/local/vert.x-2.1.6
RUN apk add --update bash && rm -rf /var/cache/apk/* \
    && ls /usr/local/vert.x-2.1.6/bin/ \
    && chmod +x /usr/local/vert.x-2.1.6/bin/vertx

# Set vertx 2.1.6 path
ENV VERTX_HOME /usr/local/vert.x-2.1.6
ENV PATH $VERTX_HOME/bin:$PATH

# Set the location of the verticles
ENV VERTICLE_HOME /usr/local/verticles
WORKDIR $VERTICLE_HOME

EXPOSE 8080

COPY . $VERTICLE_HOME/

# Copy your verticle to the container
COPY $VERTICLE_FILE $VERTICLE_HOME/

RUN mvn -version && \
    echo $PATH && \
    ls /usr/local/vert.x-2.1.6/bin/ && \
    ls /usr/local/verticles

# Launch the verticle
ENTRYPOINT ["sh", "-c"]
CMD ["vertx runmod de.appsist.service~gateway~2.4.1 -conf ./config_adwisar.json"]




