var now;

function getHumanResourceName(resources){
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var col = d3.rgb("#ffffff");
  for (var i=0;i<resources.length;i++){
    if (resources[i].substring(0,3) == "料理人"){
      var index = Number(resources[i].substr(3,1));
      return resources[i];
    } 
  }
  return "その他";
}

function getNonHumanResource(resources){
  var nonHumanResources = new Array();
  resources.forEach(function(resource){
    if (resource.substring(0,3) != "料理人"){
        nonHumanResources.push(resource);
    } 
  });
  if (nonHumanResources.length > 0){
    return "[" + nonHumanResources.join(",") + "]"; 
  }
  return "";
}

var app = new Vue({
    el: '#app',
    data: {
      human : 1,
      stove : 2,
      microwave : 1,
      oven : 1,
      grill : 1,
      counter : 1,
      menus : dishes,
      selectedIndex : [],
      timeline : null,
      cookingTime : 0,
      endingTime: null,
      selectedDishes: [],
      person: 4,
      show : false,
      ingredientSums : []
    },
    created : function(){
      var container = document.getElementById('visualization');
      this.timeline = new vis.Timeline(container);      
    },
    methods: {
      start : function(){

        var current = moment().milliseconds(0);
        var past =  current - now;
        now = current;

        var updateItems = new vis.DataSet();
        
        this.items.forEach(function(item){
          item.start = item.start.add(past,'milliseconds');
          item.end = item.end.add(past,'milliseconds');
          updateItems.add(item);
        });
        this.timeline.setOptions({showCurrentTime : true});
        this.timeline.setCurrentTime(now);
        this.timeline.setItems(updateItems);
        this.timeline.fit();
        this.timeline.redraw();
      },
      renderTimeline : function(){
        
        this.selectedDishes = [];
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        
        for(var i=0;i<this.selectedIndex.length;i++){
          var dish = JSON.parse(JSON.stringify(dishes[this.selectedIndex[i]]));
          dish['style'] = {color : color(i)};
          dish['show'] = false;
          this.selectedDishes.push(dish);
        }

        this.selectedDishes.sort(function(a,b){
          return a.id - b.id;
        });

        var ingredientSum = {};
        var that = this;
        this.selectedDishes.forEach(function(dish){
          dish.ingredients.forEach(function(ingredient){
            if(ingredientSum.hasOwnProperty(ingredient.name)){
              ingredientSum[ingredient.name].addIngredient(ingredient.unit, ingredient.amount, that.person);
            }
            else{
              var sum = new IngredientSummary(ingredient.name);
              sum.addIngredient(ingredient.unit, ingredient.amount, that.person);
              ingredientSum[ingredient.name] = sum;
            }
          });
        });
        this.ingredientSums = new Array();
        for( prop in ingredientSum){
          this.ingredientSums.push(ingredientSum[prop]);
        }
        this.ingredientSums.sort(function(a,b){
          return a.id - b.id;
        });

        var kitchen = new Kitchen(this.human, this.stove, this.microwave, this.oven, this.grill, this.counter);

        // Task total time depends on dish order. 
        var permutationDishes = this.selectedDishes.permutation(this.selectedDishes.length);

        var bestIndex = 0;
        var minTime = -1;
        permutationDishes.forEach( function (dishes, index){
          var tasks = kitchen.getTasksForDish(dishes, that.person);
          var resources = kitchen.getResourcesForDish(dishes);
          var resourcesWithId = kitchen.getResourcesWithIdForDish(dishes);
          now = moment().milliseconds(0);
          var s = schedule.create(tasks, resourcesWithId, null, new Date());
          if (minTime == -1 || s.end - s.start < minTime){
            minTime = s.end - s.start;
            bestIndex = index;
          }
        });
 
        var tasks = kitchen.getTasksForDish(permutationDishes[bestIndex], that.person);
        var resources = kitchen.getResourcesForDish(permutationDishes[bestIndex]);
        var resourcesWithId = kitchen.getResourcesWithIdForDish(permutationDishes[bestIndex]);
        now = moment().milliseconds(0);

        console.log(tasks);
        console.log(resourcesWithId);

        var s = schedule.create(tasks, resourcesWithId, null, new Date());

        console.log(s);
    
        // cooking minutes
        if (s.start){
          this.cookingTime = (s.end - s.start) / (1000 * 60);
          this.endingTime = moment(s.end).format('HH:mm:ss');
        }
        else{
          this.cookingTime = 0;
          this.endingTime = null;          
        }

        // create a data set with groups
        var dishIndex = {};
        var dishResourceIndex = {};
        var groupCount = this.selectedDishes.length;
        var groups = new vis.DataSet();
        for (var g = 0; g < groupCount; g++) {

          var cooks = kitchen.getResourceNames("料理人");
          var nested = new Array();

          dishResourceIndex[this.selectedDishes[g].name] = {};
        
          for (var i = 0 ;i<cooks.length;i++){
            dishResourceIndex[this.selectedDishes[g].name][cooks[i]] =  ((g + 1) * 100 + i);
            groups.add({id: ((g + 1) * 100 + i), content: cooks[i]});
            nested.push(((g + 1) * 100 + i));
          }
          dishResourceIndex[this.selectedDishes[g].name]["その他"] =  ((g + 1) * 100 + cooks.length + 1);         
          groups.add({id: ((g + 1) * 100 + cooks.length + 1), content: "その他"});
          nested.push(((g + 1) * 100 + cooks.length + 1));

          groups.add({id: g, content: this.selectedDishes[g].name, nestedGroups : nested});
          dishIndex[this.selectedDishes[g].name] = g;
        }
        console.log(dishResourceIndex);
        // create a dataset with items
        this.items = new vis.DataSet();
        var items = this.items;
        var itemIndex = 0;
        var taskIndex = 0;
        permutationDishes[bestIndex].forEach(function (dish,dishIndex){
          dish.steps.forEach(function (step){
            var st = s.scheduledTasks[taskIndex];            
            var start = moment(st.earlyStart, 'x');
            var end = moment(st.earlyFinish, 'x');
            console.log(step.name + "start" + start.format() + "end" + end.format());
            var schedule = st.schedule;
            var humanResourceName = getHumanResourceName(st.schedule[0].resources);
            var nonHumanResource = getNonHumanResource(st.schedule[0].resources);
            
            items.add({
              id: itemIndex++,
              group: dishResourceIndex[dish.name][humanResourceName],
              title: step.content,
              content: step.name　+ nonHumanResource,
              start: start,
              end: end,
              type: 'range'
            });

            //              style: "background-color: " + itemColor + ";"

            taskIndex++;
          });
        });
      
        // create visualization
        var options = {
          showCurrentTime: false,
          zoomable : false
        };
        this.timeline.setOptions(options);
        this.timeline.setGroups(groups);
        this.timeline.setItems(this.items);
        this.timeline.fit();
        this.timeline.redraw();
            
    }
  }
  });

