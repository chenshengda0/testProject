Tue Jan 10 09:16:04 UTC 2023
sed: can't read /var/lib/rabbitmq/.bashrc: No such file or directory
0
1
Enabling plugins on node rabbit@dex-haproxy:
rabbitmq_web_stomp
The following plugins have been configured:
  rabbitmq_management
  rabbitmq_management_agent
  rabbitmq_prometheus
  rabbitmq_stomp
  rabbitmq_web_dispatch
  rabbitmq_web_stomp
Applying plugin configuration to rabbit@dex-haproxy...
The following plugins have been enabled:
  rabbitmq_stomp
  rabbitmq_web_stomp

set 6 plugins.
Offline change; changes will take effect at broker restart.
2
Enabling plugins on node rabbit@dex-haproxy:
rabbitmq_web_stomp_examples
The following plugins have been configured:
  rabbitmq_management
  rabbitmq_management_agent
  rabbitmq_prometheus
  rabbitmq_stomp
  rabbitmq_web_dispatch
  rabbitmq_web_stomp
  rabbitmq_web_stomp_examples
Applying plugin configuration to rabbit@dex-haproxy...
The following plugins have been enabled:
  rabbitmq_web_stomp_examples

set 7 plugins.
Offline change; changes will take effect at broker restart.
Stopping rabbit application on node rabbit@dex-haproxy ...
3
Starting node rabbit@dex-haproxy ...
 * Restarting periodic command scheduler cron
 * Stopping periodic command scheduler cron
   ...done.
 * Starting periodic command scheduler cron
   ...done.
init-start end
