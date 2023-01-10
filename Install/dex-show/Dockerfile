FROM node:latest
RUN apt -y update && apt -y upgrade && apt install -y man vim xz-utils wget sudo curl screen cron
WORKDIR /opt/build
COPY dex-show/init-start.sh /opt/init-start.sh
COPY dex-show/restart.sh /opt/restart.sh
COPY dex-show/restart-ws.sh /opt/restart-ws.sh
COPY dex-show/one_consumer.sh /opt/one_consumer.sh
RUN sed -i -e "s/\r//" /opt/init-start.sh
RUN sed -i -e "s/\r//" /opt/restart.sh
RUN sed -i -e "s/\r//" /opt/restart-ws.sh
RUN sed -i -e "s/\r//" /opt/one_consumer.sh
RUN chmod -R 777 /opt/init-start.sh
RUN chmod -R 777 /opt/restart.sh
RUN chmod -R 777 /opt/restart-ws.sh
RUN chmod -R 777 /opt/one_consumer.sh
CMD date >> /opt/testLog/dex-show.md && /opt/init-start.sh >> /opt/testLog/dex-show.md 2>&1 && while true;do sleep 3000;done
