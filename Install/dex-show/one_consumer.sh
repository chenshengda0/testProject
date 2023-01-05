#!/bin/bash
step=3 #间隔的秒数，不能大于60
for (( i = 0; i < 60; i=(i+step) )); do
{
    #交易
    curl http://127.0.0.1:9527

} &
    sleep $step

done
exit