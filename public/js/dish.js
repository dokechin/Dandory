var dish1 = {
	name : '秋刀魚の塩焼き',
	steps : [
	  {name : '塩をまぶす', duration : 1, content : '秋刀魚に塩をひとつまみ振ります', resources : ['料理人','作業台']},
	  {name : '染み込ませる', dependsOn : [0], duration : 15, content : '冷蔵庫で十五分塩を染み込ませます', resources : ["冷蔵庫"]},
	  {name : '焼く', dependsOn : [1], duration : 7, content : 'グリルで中火で焼きます' , resources : ['グリル']}
  ]};
  
  var dish2 = {
	name : '味噌汁',
	steps : [
	  {name : '野菜を切る', duration : 3, content : '一口サイズに野菜を切ります', resources : ['料理人','作業台']},
	  {name : '煮る', dependsOn : [0], duration : 5, content: '野菜がやわらなくなるまで煮ます', resources : ['コンロ']},
	  {name : '味噌を溶く', dependsOn : [1], duration : 2, content : '火を止めてから、味噌を入れます', resources : ['料理人','コンロ']}
  ]};
  
  var dish3 = {
	name : 'カレーライス',
	steps : [
	  {name : '野菜を切る', duration : 10, content : '一口サイズに野菜を切ります', resources : ['料理人','作業台']},
	  {name : '肉野菜を炒める', dependsOn : [0], duration : 5, content : '鍋で炒める', resources : ['料理人','コンロ']},
	  {name : '煮る', dependsOn : [1], duration : 10, content: '野菜がやわらなくなるまで煮ます', resources : ['コンロ']},
	  {name : 'カレールーを溶かす', dependsOn : [2], duration : 5, content : '火を止めてから、カレールーを入れます', resources : ['料理人','コンロ']}
  ]};
    
  var dishes = [dish1, dish2,dish3];