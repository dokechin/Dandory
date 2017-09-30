  var menu1 = {
    name : '秋刀魚の塩焼き',
    dandoryes : [
      {name : '塩をまぶす', resource : 'まな板',start : 0,  end : 5},
      {name : '染み込ませる', resource : '冷蔵庫',start : 5,  end : 20},
      {name : '焼く', resource : 'グリル',start : 20, end : 27}
  ]};
  var menus = [menu1];

  var now = moment().milliseconds(0);

  var resources = {};

  var index = 0;
  menus.forEach(function (menu){
    console.log(menu);
    menu.dandoryes.forEach(function (dandory){
      if (!resources.hasOwnProperty(dandory.resource)){
        resources[dandory.resource] = index++;
      }
    });
  });

  var itemCount = 20;

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
  menus.forEach(function (menu){
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
  var container = document.getElementById('visualization');
  var options = {
    groupOrder: 'content',
    margin: {
        item : {
            horizontal : -25
        }
    }
  };

  var timeline = new vis.Timeline(container);
  timeline.setOptions(options);
  timeline.setGroups(groups);
  timeline.setItems(items);
