
#! /usr/bin/env python3
# -*- coding: utf-8 -*-
from flask import Flask, request
from flask import abort, jsonify, make_response
from configparser import ConfigParser
import pymysql
import logging
import json
import urllib

app = Flask(__name__, 
            static_folder='static', 
            static_url_path='')
app.config['JSON_AS_ASCII'] = False     # 解决 jsonify 中文编码问题

logging.basicConfig(level=logging.INFO, 
                    filename='./log.txt',
                    format='%(asctime)s - %(filename)s[line:%(lineno)d] - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

cfg = ConfigParser()
cfg.read("config.ini")


def connect(db_host, db_user, db_pass, db_name):
    try:
        db = pymysql.connect(host=db_host, user=db_user, passwd=db_pass, db=db_name, port=3306, charset='utf8mb4')
    except Exception as err:
        logger.error("flask cant connect to db.")
        exit(0)

    return db


db_host = cfg.get('db', 'DB_HOST')
db_user = cfg.get('db', 'DB_USER')
db_pass = cfg.get('db', 'DB_PASS')
db_name = cfg.get('db', 'DB_NAME')
db = connect(db_host, db_user, db_pass, db_name)
cursor = db.cursor()


def get_where_clause_from_query_string(request):
    # 从 request 中解析出 where 子句
    if not request.query_string:
        return ''

    query = request.query_string
    if type(query) == bytes:
        query = query.decode()
    query = urllib.parse.unquote(query)
    kvs = query.split('&')
    
    temp = []
    for kv in kvs:
        k = kv.split('=')[0]
        v = kv.split('=')[1]
        temp.append('{}="{}"'.format(k, v))
    where_clause = ' WHERE ' + ' AND '.join(temp)
    return where_clause


@app.route('/api/v1.0/<tb_name>', methods=['HEAD'])
def get_description(tb_name):
    # 获取表的字段名及属性
    sql = "select COLUMN_NAME from information_schema.COLUMNS where table_name='{}' and table_schema = '{}'".format(tb_name, db_name)
    #sql = "SHOW COLUMNS FROM {}".format(tb_name)
    try:
        logger.info(sql)
        cursor.execute(sql)
        rows = cursor.fetchall()
    except Exception as err:
        logger.error(err)
        resp = make_response()
        resp.headers['status'] = 'fail'
        return resp

    resp = make_response()
    resp.headers['columns'] = json.dumps(rows)      # 将python字典 转化为 json字符串
    resp.headers['Access-Control-Expose-Headers'] = 'columns'   # 允许访问
    return resp


@app.route('/api/v1.0/<tb_name>', methods=['GET'])
def get_all_records(tb_name):
    # （根据条件）获取表中的所有记录
    sql = "SELECT * FROM {}".format(tb_name)
    sql += get_where_clause_from_query_string(request)
    try:
        logger.info(sql)
        cursor.execute(sql)
        rows = cursor.fetchall()
    except Exception as err:
        logger.error(err)
        return jsonify({'status': 'fail'})

    return jsonify(rows)


@app.route('/api/v1.0/<tb_name>', methods=['POST'])
def add_one_record(tb_name):
    # 增加一条记录
    if not request.json:
        abort(400)

    sql = """INSERT INTO {} ({}) VALUES ({})
    """.format(tb_name, ','.join(request.json.keys()), ','.join(map(lambda x: '"' + x + '"', request.json.values())))
    try:
        logger.info(sql)
        cursor.execute(sql)
        db.commit()
    except Exception as err:
        db.rollback()
        logger.error(err)
        return jsonify({'status': 'fail'})

    return jsonify(request.json)


@app.route('/api/v1.0/<tb_name>', methods=['PUT'])
def update_one_record(tb_name):
    # （根据条件）更新一条记录
    # 如果有多条符合，全部更新
    if not request.query_string or not request.json:
        abort(400)

    where_clause = get_where_clause_from_query_string(request)
    temp = []
    for k in request.json:
        temp.append('{}="{}"'.format(k, request.json[k]))
    update_str = ','.join(temp)
    sql = "UPDATE {} SET {}".format(tb_name, update_str)
    sql += where_clause
    try:
        logger.info(sql)
        cursor.execute(sql)
        db.commit()
    except Exception as err:
        db.rollback()
        logger.error(err)
        return jsonify({'status': 'fail'})

    return jsonify({'status': 'ok'})


@app.route('/api/v1.0/<tb_name>', methods=['DELETE'])
def delete_some_record(tb_name):
    # （根据条件）删除一些记录
    if not request.query_string:
        abort(400)
    
    where_clause = get_where_clause_from_query_string(request)
    sql = "DELETE FROM {}".format(tb_name)
    sql += where_clause
    try:
        logger.info(sql)
        cursor.execute(sql)
        db.commit()
    except Exception as err:
        db.rollback()
        logger.error(err)
        return jsonify({'status': 'fail'})

    return jsonify({'status': 'ok'})


@app.route('/api/this/is/a/secret/entrypoint', methods=['POST'])
def execute_sql():
    # 执行 sql
    if 'sql' not in request.headers:
        abort(400)      # param missing

    sql = request.headers['sql']
    if type(sql) == bytes:
        sql = sql.decode()
    sql = urllib.parse.unquote(sql)
    try:
        logger.info(sql)
        cursor.execute(sql)
        rows = cursor.fetchall()
        db.commit()
    except Exception as err:
        db.rollback()
        logger.error(err)
        return jsonify({'status': 'fail'})

    return jsonify(rows)


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


@app.errorhandler(400)
def param_err(error):
    return make_response(jsonify({'error': 'Params missing'}), 400)


if __name__ == '__main__':
    HOST = cfg.get('server', 'HOST')
    PORT = cfg.get('server', 'PORT')
    app.run(host=HOST, port=PORT, debug=True)
