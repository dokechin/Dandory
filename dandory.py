# -*- coding: utf-8 -*-
import os
import time
import functools
from flask import Flask, jsonify, request
import json
from pyschedule import Scenario, solvers, plotters                         
from operator import ior
from pprint import pprint

app = Flask(__name__, static_url_path='', static_folder='./public')

@app.route('/schedule', methods=['POST'])
def schedule():
    data = request.get_json()

    duration_sum = 0
    for task in data['tasks']:
        duration_sum += task['duration']

    S = Scenario('hello_pyschedule',horizon=duration_sum)
    resources = {}
    for resource in data['resources']:
        resources[resource['id']] = S.Resource(resource['id'])
    # Create tasks
    tasks = {}
    for task in data['tasks']:
        tasks[task['id']] = S.Task(task['id'], task['duration'])
        for resource in task['resources']:
            if isinstance(resource, list):
                tasks[task['id']] += functools.reduce(ior, list(map(lambda x: resources[x],resource)))
            else:
                tasks[task['id']] += resources[resource]

    # Setting dependsOn
    for task in data['tasks']:
        print('id' + task['id'])
        if 'dependsOn' in task:
            for depend in task['dependsOn']:
                S+= tasks[str(depend)] < tasks[task['id']]

    # Solve and print solution
    S.use_makespan_objective()
    solvers.mip.solve(S,msg=1)

    # Print the solution
    resTasks = []
    now = int(time.time())
    for t in S.tasks():
        if (t.name == 'MakeSpan'):
            break
        print (t.start_value)
        resTasks.append({
            'earlyStart' : (now + (t.start_value * 60)),
            'earlyFinish' : (now + (t.start_value + t.length) * 60),
            'resources' : list(map(lambda x : x.name, t.resources))})

    return jsonify({'start' : now, 'end' : now + (S.tasks()[-1].start_value) * 60, 'tasks' : resTasks})

# main
if __name__ == "__main__":
    # Flaskのマッピング情報を表示
    app.logger.debug(app.url_map)
    app.run(host=os.getenv("APP_ADDRESS", 'localhost'), \
    port=os.getenv("APP_PORT", 3000))