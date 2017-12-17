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

        var tasks = kitchen.getTasksForDish(this.selectedDishes, that.person);
        var resources = kitchen.getResourcesForDish(this.selectedDishes);
        var resourcesWithId = kitchen.getResourcesWithIdForDish(this.selectedDishes);

        axios.post('/schedule', {tasks: tasks, resources: resourcesWithId})
        .then(function (response) {

        console.log(response)

        s = response.data;
        // cooking minutes
        if (s.start){
          that.cookingTime = (s.end - s.start) /60;
          that.endingTime = moment(s.end * 1000).format('HH:mm:ss');
        }
        else{
          that.cookingTime = 0;
          that.endingTime = null;          
        }

        // create a data set with groups
        var dishIndex = {};
        var dishResourceIndex = {};
        var groupCount = that.selectedDishes.length;
        var groups = new vis.DataSet();
        for (var g = 0; g < groupCount; g++) {

          var cooks = kitchen.getResourceNames("料理人");
          var nested = new Array();

          dishResourceIndex[that.selectedDishes[g].name] = {};
        
          for (var i = 0 ;i<cooks.length;i++){
            dishResourceIndex[that.selectedDishes[g].name][cooks[i]] =  ((g + 1) * 100 + i);
            groups.add({id: ((g + 1) * 100 + i), content: cooks[i]});
            nested.push(((g + 1) * 100 + i));
          }
          dishResourceIndex[that.selectedDishes[g].name]["その他"] =  ((g + 1) * 100 + cooks.length + 1);         
          groups.add({id: ((g + 1) * 100 + cooks.length + 1), content: "その他"});
          nested.push(((g + 1) * 100 + cooks.length + 1));

          groups.add({id: g, content: that.selectedDishes[g].name, nestedGroups : nested});
          dishIndex[that.selectedDishes[g].name] = g;
        }
        // create a dataset with items
        that.items = new vis.DataSet();
        var items = that.items;
        var itemIndex = 0;
        var taskIndex = 0;
        that.selectedDishes.forEach(function (dish,dishIndex){
          dish.steps.forEach(function (step){
            var st = s.tasks[taskIndex];            
            var start = moment(st.earlyStart * 1000, 'x');
            var end = moment(st.earlyFinish * 1000, 'x');
            var schedule = st.schedule;
            var humanResourceName = getHumanResourceName(st.resources);
            var nonHumanResource = getNonHumanResource(st.resources);
            
            items.add({
              id: itemIndex++,
              group: dishResourceIndex[dish.name][humanResourceName],
              title: step.content,
              content: step.name　+ nonHumanResource,
              start: start,
              end: end,
              type: 'range'
            });

            taskIndex++;
          });
        });
      
        // create visualization
        var options = {
          showCurrentTime: false,
          zoomable : false
        };
        that.timeline.setOptions(options);
        that.timeline.setGroups(groups);
        that.timeline.setItems(that.items);
        that.timeline.fit();
        that.timeline.redraw();

      })
        .catch(function (error) {
          console.log(error);
        });    
      },
      multiply_ingredient : function(amount, unit, person){
          
        var total = math.eval(amount + "*"  + person);
        console.log(amount + unit + '*' + person);
            
        if (unit !="ml" && unit !="グラム"){
          if (!math.isInteger(total)){
            var num = math.floor(total);
            var fraction_part = total - num;
            console.log('num' + num);
            console.log('fraction_part' + fraction_part);
            
            if (num >= 1){
              total = num + " " + math.format(math.fraction(fraction_part), {fraction: 'ratio'});
            }
            else{
              total = math.format(math.fraction(fraction_part), {fraction: 'ratio'});
            }
          }
        }

        if (unit == '小さじ' || unit == '大さじ'){
          return unit + ' ' + total;
        }
        else{
          return total + ' ' + unit;		
        }
      }   
    }
  });

