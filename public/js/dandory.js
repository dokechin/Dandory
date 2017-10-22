function dishes2tasks(dishes,kitchen){
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
      tasks.push({id : index, duration : step.duration, dependsOn : dependsOn, resources : kitchen.mappingKitchenResource(step.resources)});
      index++;
    });
    lastIndex = index;
  });  
  return tasks;
}
