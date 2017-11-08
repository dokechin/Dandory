var dish1 = {
	name : '秋刀魚の塩焼き',
	ingredients : [
	  {name : 'さんま', amount : 1, unit : '匹'},		
	  {name : '塩',    amount : 1, unit : '小さじ'},
	  {name : 'すだち', amount : "1/2", unit : '個'},
	  {name : '大根', amount : 15, unit : 'グラム'}
	],
	steps : [
	  {name : '塩をまぶす', duration : 0.5, content : '秋刀魚に塩をひとつまみ振ります', resources : ['料理人','作業台'], proportional : { b : 2 }},
	  {name : '染み込ませる', dependsOn : [0], duration : 15, content : '冷蔵庫で十五分塩を染み込ませます', resources : ["冷蔵庫"], constant : true},
	  {name : '焼く', dependsOn : [1], duration : 7, content : 'グリルで中火で焼きます' , resources : ['グリル'], constant : true}
  ]};
  
  var dish2 = {
	name : '味噌汁',
	ingredients : [
	  {name : '味噌', amount : 16, unit : 'グラム'},
	  {name : '水',    amount : 160, unit : 'cc'},
	  {name : '豆腐', amount : "1/8", unit : '丁'},
	  {name : '乾燥わかめ', amount : 1, unit : 'グラム'},
	  {name : '長ネギ', amount : 3, unit : 'グラム'}
	],
	steps : [
	  {name : '野菜を切る', duration : 3, content : '一口サイズに野菜を切ります', resources : ['料理人','作業台']},
	  {name : '煮る', dependsOn : [0], duration : 5, content: '野菜がやわらなくなるまで煮ます', resources : ['コンロ'], constant : true},
	  {name : '味噌を溶く', dependsOn : [1], duration : 2, content : '火を止めてから、味噌を入れます', resources : ['料理人','コンロ'], constant : true }
  ]};
  
  var dish3 = {
	name : 'カレーライス',
	ingredients : [
	{name : '鶏もも肉', amount : 60, unit : 'グラム'},
	{name : '玉ねぎ',    amount : "1/2", unit : '個'},
	{name : 'サラダ油', amount : 1, unit : '大さじ'},
	{name : '水', amount : 150, unit : 'cc'},
	{name : 'カレールー', amount : 20, unit : 'グラム'},
	{name : '白飯', amount : 150, unit : 'グラム'}
],
steps : [
	  {name : '野菜を切る', duration : 2, content : '一口サイズに野菜を切ります', resources : ['料理人','作業台']},
	  {name : '肉野菜を炒める', dependsOn : [0], duration : 5, content : '鍋で炒める', resources : ['料理人','コンロ'], constant : true},
	  {name : '煮る', dependsOn : [1], duration : 10, content: '野菜がやわらなくなるまで煮ます', resources : ['コンロ'], constant : true },
	  {name : 'ルーを溶かす', dependsOn : [2], duration : 5, content : '火を止めてから、カレールーを入れます', resources : ['料理人','コンロ'], constant : true}
  ]};

	var dish4 = {
		name : 'ポテトサラダ',
		ingredients : [
		{name : 'じゃがいも', amount : 1, unit : '個'},
		{name : 'にんじん',    amount : "1/8", unit : '本'},
		{name : 'きゅうり', amount : "1/4", unit : '本'},
		{name : 'ハム', amount : 1, unit : '枚'},
		{name : '塩', amount : 0.5, unit : 'グラム'},
		{name : 'こしょう', amount : 0.2, unit : 'グラム'},
		{name : 'マヨネーズ', amount : 1, unit : '小さじ'},
		{name : '酢', amount : 1, unit : '小さじ'}
	],
	steps : [
			{name : '材料を切る', duration : 2, content : 'じゃがいもを洗い、半分に切ります。にんじんは皮をむき一口大に切ります。ハムを適当に切ります。', resources : ['料理人','作業台']},
			{name : 'じゃがいもを茹でる', dependsOn : [0], duration : 10, content : '鍋でじゃがいもを柔らかくなるまで茹でます', resources : ['コンロ'], constant : true},
			{name : 'にんじんを茹でる', dependsOn : [0], duration : 5, content: 'にんじんを茹でます', resources : ['コンロ'], constant : true },
			{name : 'じゃがいもを潰す', dependsOn : [1], duration : 1, content : 'じゃがいもを潰します', resources : ['料理人','作業台']},
			{name : '混ぜる', dependsOn : [2,3], duration : 1, content : 'じゃがいも、にんじん、ハムを混ぜて。調味料で味を整えます。', resources : ['料理人','作業台']}
		]};
	
  var dishes = [dish1, dish2, dish3, dish4];