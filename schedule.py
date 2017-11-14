from bottle import route, run, request
from bottle import static_file
from pyschedule import Scenario, solvers, plotters                         
from operator import ior
import time
@route('/schedule', method= 'POST')
def schedule():
    now = int(time.time())
    S = Scenario('hello_pyschedule',horizon=10)
    data = request.json

    print data

    # Create resource dicrionary
    resources = {}
    for resource in data.resources:
        resources[resource] = S.Resource(resource.id,1 if resource.isNotReservable else 100)
    # Create tasks
    tasks = {}
    for task in data.steps:
        tasks[task.id] = S.Task(task.name, task.duration)
        for resource in task.resources:
            if hasattr(resource, "__len__"):
                tasks[task.id] += reduce(ior, resource)
            else:
                tasks[task.id] += resource

    # Setting dependsOn
    for task in data.steps:
        if hasattr(task, 'dependsOn'):
            for depend in task.dependsOn:
                S+= tasks[depend] < tasks[task.id]

    # Solve and print solution
    S.use_makespan_objective()
    solvers.mip.solve(S,msg=1)

    # Print the solution
    resTasks = []
    for t in S.tasks():
        resTasks += {
            earlyStart : now + t.start_value,
            earlyFinish : now + t.start_value + t.length,
            resources : t.resources}

    rv = {start : now, end : S.tasks[-1].start_value, tasks : resTasks}
    return dict(data=rv)


@route('/<file_path:path>')
def static(file_path):
    return static_file(file_path, root='./public')

run(host='localhost',port=3000, debug=True)
