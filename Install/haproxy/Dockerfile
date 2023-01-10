FROM rabbitmq:3-management

RUN apt -y update && apt -y upgrade && apt install -y vim sudo screen haproxy nginx cron curl
RUN rm -rf /etc/nginx/nginx.conf
COPY ./haproxy/init-start.sh /opt/init-start.sh
COPY ./haproxy/.erlang.cookie /root/.erlang.cookie
COPY ./haproxy/haproxy.cnf /opt/haproxy.cnf
COPY ./haproxy/one_consumer.sh /opt/one_consumer.sh
RUN chmod -R 400 /root/.erlang.cookie
RUN sed -i -e "s/\r//" /opt/init-start.sh
RUN sed -i -e "s/\r//" /opt/haproxy.cnf
RUN sed -i -e "s/\r//" /opt/one_consumer.sh
RUN chmod -R 777 /opt/init-start.sh
RUN chmod -R 777 /opt/one_consumer.sh
EXPOSE 5670
EXPOSE 35672
EXPOSE 35674
EXPOSE 9999
EXPOSE 9527
EXPOSE 27149
CMD date >> /opt/testLog/dex-haproxy.md && /opt/init-start.sh >> /opt/testLog/dex-haproxy.md 2>&1 && while true; do sleep 3000;done