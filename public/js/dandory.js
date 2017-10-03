var menu1 = {
  name : '秋刀魚の塩焼き',
  dandoryes : [
    {name : '塩をまぶす', resource : '作業台',start : 0,  end : 5},
    {name : '染み込ませる', resource : '冷蔵庫',start : 5,  end : 20},
    {name : '焼く', resource : 'グリル',start : 20, end : 27}
]};

var menu2 = {
  name : '味噌汁',
  dandoryes : [
    {name : '野菜を切る', resource : 'まな板',start : 0,  end : 5},
    {name : '煮る', resource : 'コンロ',start : 5,  end : 10},
    {name : '味噌を溶く', resource : 'コンロ',start : 10, end : 13}
]};

var menus = [menu1, menu2];

var app4 = new Vue({
    el: '#app',
    data: {
      menus : menus,
      selectedIndex : [],
      timeline : null
    },
    created : function(){
      var container = document.getElementById('visualization');
      this.timeline = new vis.Timeline(container);      
    },
    methods: {
      renderTimeline : function(){
      var selectedMenus = [];
      for(var i=0;i<this.selectedIndex.length;i++){
      selectedMenus.push(menus[this.selectedIndex[i]]);
      }
          
      var now = moment().milliseconds(0);
      
        var resources = {};
      
        var index = 0;
        selectedMenus.forEach(function (menu){
          menu.dandoryes.forEach(function (dandory){
            if (!resources.hasOwnProperty(dandory.resource)){
              resources[dandory.resource] = index++;
            }
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
        var items = new vis.DataSet();
        var dandoryIndex = 0;
        selectedMenus.forEach(function (menu){
          menu.dandoryes.forEach(function (dandory){
            var start = now.clone().add(dandory.start, 'minutes');
            var end = now.clone().add(dandory.end, 'minutes');
            var group = resources[dandory.resource];
            items.add({
              id: dandoryIndex++,
              group: group,
              content: dandory.name,
              start: start,
              end: end,
              type: 'range'
            });
          });
        });
      
        // create visualization
        var options = {
          groupOrder: 'content'
        };
        this.timeline.setOptions(options);
        this.timeline.setGroups(groups);
        this.timeline.setItems(items);
        this.timeline.fit();
        this.timeline.redraw();
            
    }
  }
  });

