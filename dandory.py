# -*- coding: utf-8 -*-
import os
from flask import Flask, jsonify, request
import json

app = Flask(__name__, static_url_path='', static_folder='./public')

@app.route('/schedule', methods=['POST'])
def schedule():
    data = json.loads(request.data)
    print data
    name = "Hello World"
    return name

# main
if __name__ == "__main__":
    # Flaskのマッピング情報を表示
    print app.url_map
    app.run(host=os.getenv("APP_ADDRESS", 'localhost'), \
    port=os.getenv("APP_PORT", 3000))