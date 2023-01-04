#!/bin/bash
step=3 #间隔的秒数，不能大于60
for (( i = 0; i < 60; i=(i+step) )); do
{
    #交易
    node /Users/chenshengda/Desktop/project/testProject/Install/build/consumer.js

} &
    sleep $step

done
exit