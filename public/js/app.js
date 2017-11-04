var now;

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
        var s = schedule.create(tasks, resourcesWithId, null, new Date());
    
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
        var resourceIndex = {};
        var groupCount = resources.length;
        var groups = new vis.DataSet();
        for (var g = 0; g < groupCount; g++) {
          groups.add({id: g, content: resources[g].name, order : resources[g].order});
          resourceIndex[resources[g].name] = g;
        }
      
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
            var schedule = st.schedule;
            st.schedule[0].resources.forEach(function (resource){
              var group = resourceIndex[resource];
              var itemColor = color(dishIndex);
              
              items.add({
                id: itemIndex++,
                group: group,
                title: step.content,
                content: step.name,
                start: start,
                end: end,
                type: 'range',
                style: "background-color: " + itemColor + ";"
              });
            });
            taskIndex++;
          });
        });
      
        // create visualization
        var options = {
          showCurrentTime: false,
          editable: {
            add: false,         // add new items by double tapping
            updateTime: true,  // drag items horizontally
            updateGroup: false, // drag items from one group to another
            remove: false,       // delete an item by tapping the delete button top right
            overrideItems: false  // allow these options to override item.editable
          }
        };
        this.timeline.setOptions(options);
        this.timeline.setGroups(groups);
        this.timeline.setItems(this.items);
        this.timeline.fit();
        this.timeline.redraw();
            
    }
  }
  });

