#!/bin/bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
for item in $(cat /proc/1/environ | tr '\0' '\n');do echo "export ${item}" >>  /etc/environment;done
sed -i "$ a source /etc/environment" ~/.bashrc
sed -i "$ a source /etc/environment" /etc/screenrc
#echo "* * * * * /opt/one_consumer.sh" >> ~/init-crontab
echo "*/5 * * * * /opt/restart.sh" >> ~/init-crontab
echo "0 0 * * * /opt/restart-ws.sh" >> ~/init-crontab
crontab ~/init-crontab
rm -rf ~/init-crontab
service cron restart
/opt/restart-ws.sh
/opt/restart.sh
echo "end" >> /opt/test.md