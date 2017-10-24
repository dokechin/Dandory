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
      cookingTime : null,
      endingTime: null
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

        var selectedDishes = [];
        for(var i=0;i<this.selectedIndex.length;i++){
          selectedDishes.push(dishes[this.selectedIndex[i]]);
        }

        var kitchen = new Kitchen(this.human, this.stove, this.microwave, this.oven, this.grill, this.counter);

        var tasks = kitchen.getTasksForDish(selectedDishes);
        var resources = kitchen.getResourcesForDish(selectedDishes);
        now = moment().milliseconds(0);
        var s = schedule.create(tasks, kitchen.getResourcesWithIdForDish(selectedDishes), null, new Date());
        
        // cooking minutes
        this.cookingTime = (s.end - s.start) / (1000 * 60);
        this.endingTime = moment(s.end).format('HH:mm:ss');

        // create a data set with groups
        var resourceIndex = {};
        var groupCount = resources.length;
        var groups = new vis.DataSet();
        for (var g = 0; g < groupCount; g++) {
          groups.add({id: g, content: resources[g]});
          resourceIndex[resources[g]] = g;
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

