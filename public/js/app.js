var now;

var app = new Vue({
    el: '#app',
    data: {
      menus : dishes,
      selectedIndex : [],
      timeline : null
    },
    created : function(){
      var container = document.getElementById('visualization');
      this.timeline = new vis.Timeline(container);      
    },
    methods: {
      start : function(){

        console.log("start called");
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
      
        var selectedDishes = [];
        for(var i=0;i<this.selectedIndex.length;i++){
          selectedDishes.push(dishes[this.selectedIndex[i]]);
       }

       var resources = dishes2resources(selectedDishes);
       var tasks = dishes2tasks(selectedDishes);
       var s = schedule.create(tasks, resources, null, new Date());
      
        var resources = {};
      
        var index = 0;
        selectedDishes.forEach(function (dish){
          dish.steps.forEach(function (step){
            step.resources.forEach(function(resource){
              if (!resources.hasOwnProperty(resource)){
                resources[resource] = index++;
              }
            });
          });
        });
            
        // create a data set with groups
        var names = Object.keys(resources);
        var groupCount = names.length;
        var groups = new vis.DataSet();
        for (var g = 0; g < groupCount; g++) {
          groups.add({id: g, content: names[g]});
        }
      
        // create a dataset with items
        this.items = new vis.DataSet();
        var items = this.items;
        var itemIndex = 0;
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        var taskIndex = 0;
        selectedDishes.forEach(function (dish,dishIndex){
          dish.steps.forEach(function (step){
            var st = s.scheduledTasks[taskIndex];            
            var start = moment(st.earlyStart, 'x');
            var end = moment(st.earlyFinish, 'x');
            step.resources.forEach(function (resource){
              var group = resources[resource];
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
          groupOrder: 'content',
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

