function dishes2resources(dishes){
  var resources = {};
  var index = 0;
  dishes.forEach(function (dish){
    dish.steps.forEach(function (step){
      step.resources.forEach(function(resource){
        if (!resources.hasOwnProperty(resource)){
          resources[resource] = index++;
        }
      });
    });
  });
  var res = new Array();
　for( var key in resources){
    res.push({id : key});
  }
  return res;
}

function dishes2tasks(dishes){
  var tasks = new Array();
  var index = 0;
  var lastIndex = 0;
  dishes.forEach(function (dish){
    dish.steps.forEach(function (step){
      var dependsOn = new Array();
      if (step.hasOwnProperty('dependsOn')){
        step.dependsOn.forEach(function (depend){
          dependsOn.push(depend + lastIndex);
        });
      }
      tasks.push({id : index, duration : step.duration, dependsOn : dependsOn, resources : step.resources});
      index++;
    });
    lastIndex = index;
  });  
  return tasks;
}
