#!/bin/bash
exit;
step=2 #间隔的秒数，不能大于60
for (( i = 0; i < 60; i=(i+step) )); do
{
    #交易
    curl http://127.0.0.1:9527/consumer
    curl http://127.0.0.1:9527/consumer
    curl http://127.0.0.1:9527/consumer

}&
    sleep $step

done
exit