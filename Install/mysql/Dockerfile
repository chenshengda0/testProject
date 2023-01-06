FROM mysql:latest
COPY ./mysql/my.cnf /etc/mysql/conf.d/my.cnf
COPY ./mysql/crawler.sql /docker-entrypoint-initdb.d/crawler.sql
COPY ./mysql/init-start.sh /docker-entrypoint-initdb.d/init-start.sh
RUN sed -i -e "s/\r//" /etc/mysql/conf.d/my.cnf
RUN sed -i -e "s/\r//" /docker-entrypoint-initdb.d/init-start.sh
RUN chmod 0444 /etc/mysql/conf.d/my.cnf
RUN chmod 0777 /docker-entrypoint-initdb.d/init-start.sh
RUN chmod 0777 /docker-entrypoint-initdb.d/crawler.sql
