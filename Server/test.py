#!/usr/bin/env python
import os
import pika
import numpy as np
import json
import mysql.connector
import traceback

class WithMysql:

    def __init__(self):
        self.__host = "127.0.0.1"
        self.__port = "3306"
        self.__user = "root"
        self.__passwd = "231510622abc"
        self.__database = "crawler"
        self.__charset = "utf8mb4"

    def __enter__(self):
        print("ready connect...")
        print( self.__host )
        print( self.__user )
        print( self.__passwd )
        print( self.__database )
        print( self.__charset )
        self.__db = mysql.connector.connect(
            host = self.__host,
            port = self.__port,
            user = self.__user,
            passwd = self.__passwd,
            database = self.__database,
            charset = self.__charset
        )
        self.__cursor = self.__db.cursor(buffered=True,dictionary=True)
        print("connect success...")
        return self.__cursor

    def __exit__(self,type,value,trace):
        #处理事务
        if type is None:
            print("commit...")
            self.__db.commit()
        else:
            print("rollback...")
            self.__db.rollback()
        #关闭连接
        print("close...")
        self.__cursor.close()
        self.__db.close()

class WithRabbitmq:
    def __init__(self,vhost="/"):
        self.__host = "127.0.0.1"
        self.__port = "5670"
        self.__vhost = vhost
        self.__user = "dream"
        self.__passwd = "231510622abc"
        
    def __enter__(self):
        print("ready connect...")
        certificate = pika.PlainCredentials(username = self.__user, password = self.__passwd, erase_on_connect = False)
        connectionParam = pika.ConnectionParameters(host = self.__host,port = self.__port,virtual_host = self.__vhost,credentials=certificate)
        self.__connection = pika.BlockingConnection(connectionParam)
        #信道
        self.__channel = self.__connection.channel()
        print("connect success...")
        return self.__channel

    def __exit__(self,type,value,trace):
        #关闭连接
        print("close...")
        self.__channel.close()
        self.__connection.close()

if __name__ == "__main__":
    try:
        with WithRabbitmq() as rabbit:
            with WithMysql() as cur:
                exchange_name = 'amq.topic'
                keyword = "PancakePairsEvents"
                queue_name = '{keyword}_queue'.format(keyword=keyword)
                result = rabbit.queue_declare(queue_name, exclusive=False,durable=True,passive=False,auto_delete=False)
                rabbit.queue_bind( exchange=exchange_name, routing_key=keyword, queue=queue_name  )
                # sql = """
                #     SELECT * FROM `pair` WHERE 1
                # """
                # cur.execute(sql)
                # data = cur.fetchall()
                # d = set([item["pairs_id"] for item in data ]) 
                b = set(np.array( list( range(500) ),dtype=np.int32 ))
                #setData = np.array( list(b-d),dtype=int )
                #print( d )
                for item in b:
                    rabbit.basic_publish(exchange=exchange_name, routing_key=keyword,body= json.dumps({
                        "pairsId":int(item),
                        "contract": "0xBCfCcbde45cE874adCB698cC183deBcF17952812",
                    }) )
                print( b )
    except Exception as e:
        print( e )
        traceback.format_exc()
    finally:
        print( "mysql测试" )
'''
        with WithRabbitmq() as rabbit:
            with WithMysql() as cur:
                sql = """
                    SELECT pairs_id FROM `sp_new_pairs` WHERE `platform` = "PancakeV1"
                """
                cur.execute(sql)
                data = cur.fetchall()
                d = set([item["pairs_id"] for item in data ]) 
                b = set(np.array( list( range(145559) ),dtype=np.int32 ))
                setData = np.array( list(b-d),dtype=int )
                exchange_name = 'amq.topic'
                keyword = "PancakeV1NewPairsEvents"
                queue_name = '{keyword}_queue'.format(keyword=keyword)
                #rabbit.exchange_declare(exchange=exchange_name, exchange_type='fanout',passive=False,durable=True,auto_delete=False)
                result = rabbit.queue_declare(queue_name, exclusive=False,durable=True,passive=False,auto_delete=False)
                rabbit.queue_bind( exchange=exchange_name, routing_key=keyword, queue=queue_name  )
                for item in setData:
                    rabbit.basic_publish(exchange=exchange_name, routing_key=keyword,body= json.dumps({
                        "platform":"PancakeV1",
                        "pairsId":int(item),
                        "contract": "0xBCfCcbde45cE874adCB698cC183deBcF17952812",
                        "allPairsAbi": '{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"allPairs","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}',
                        "pairsToken0Abi": '{"constant":true,"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}',
                        "pairsToken1Abi": '{"constant":true,"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}',
                        "symbolAbi": '{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}',
                        "decimalsAbi": '{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"}'
                    }) )
                ##print("发送消息成功")
                ##for index,item in np.ndenumerate(setData):
                    #print( "{} ---- {}".format(index,item) )
                print( '缺失值数量为：{};'.format( len(setData) ) )
    except Exception as e:
        print( e )
        traceback.format_exc()
    finally:
        print( "rabbitmq测试" )
'''