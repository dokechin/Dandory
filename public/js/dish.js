var dish1 = {
	id   : 1,
	name : '秋刀魚の塩焼き',
	image : "img/sanma.png",
	ingredients : [
	  {name : '秋刀魚', amount : 1, unit : '匹'},		
	  {name : '塩',    amount : "1/2", unit : '小さじ'},
	  {name : 'すだち', amount : "1/2", unit : '個'},
	  {name : '大根', amount : 15, unit : 'グラム'}
	],
	steps : [
	  {name : '塩をまぶす', duration : "(person * 0.5 + 2)", content : '秋刀魚に塩をひとつまみ振ります', resources : ['料理人','作業台']},
	  {name : '大根をおろす', duration : "(person * 0.5 + 1)", content : '大根をおろします', resources : ['料理人','作業台']},
	  {name : 'すだちを切る', duration : "(person * 0.2 + 1)", content : 'すだちを半分に切ります', resources : ['料理人','作業台']},
	  {name : '染み込ませる', dependsOn : [0], duration : "15", content : '冷蔵庫で15分塩を染み込ませます', resources : ["冷蔵庫"]},
	  {name : '焼く', dependsOn : [3], duration : "10", content : 'グリルで中火で焼きます' , resources : ['グリル']}
  ]};
  
  var dish2 = {
		id   : 2,
		name : '味噌汁',
	image : "img/miso_soup.png",	
	ingredients : [
	  {name : '味噌', amount : 16, unit : 'グラム'},
	  {name : '水',    amount : 160, unit : 'cc'},
	  {name : '豆腐', amount : "1/8", unit : '丁'},
	  {name : 'だしの素', amount : "1/3", unit : '小さじ'},
	  {name : '乾燥わかめ', amount : 1, unit : 'グラム'},
	  {name : '長ネギ', amount : 3, unit : 'グラム'}
	],
	steps : [
	  {name : '材料を切る', duration : "(person * 0.2 + 1)", content : '豆腐を小口切り、長ネギをみじん切りにします', resources : ['料理人','作業台']},
	  {name : '煮る', duration : "5", content: '鍋に水を沸かし、だしの素、乾燥わかめを加えます', resources : ['コンロ']},
	  {name : '豆腐を加える', dependsOn : [0, 1], duration : "1", content: '豆腐を鍋に入れます', resources : ['コンロ','料理人']},
	  {name : '味噌を溶く', dependsOn : [2], duration : "2", content : '火を止めてから、味噌、長ネギを入れます', resources : ['料理人','コンロ']}
  ]};
  
  var dish3 = {
		id   : 3,
		name : 'カレーライス',
	image : "img/curry_rice.png",	
	ingredients : [
	{name : '鶏もも肉', amount : 60, unit : 'グラム'},
	{name : '玉ねぎ',    amount : "1/2", unit : '個'},
	{name : 'にんじん',    amount : "1/8", unit : '本'},
	{name : 'じゃがいも',    amount : "1/2", unit : '個'},
	{name : 'サラダ油', amount : 1, unit : '大さじ'},
	{name : '水', amount : 150, unit : 'cc'},
	{name : 'カレールー', amount : 20, unit : 'グラム'},
	{name : '白飯', amount : 150, unit : 'グラム'}
],
steps : [
	  {name : '野菜を切る', duration : "(person + 1)", content : '一口サイズに野菜を切ります', resources : ['料理人','作業台']},
	  {name : '肉野菜を炒める', dependsOn : [0], duration : "5", content : '鍋で炒める', resources : ['料理人','コンロ']},
	  {name : '煮る', dependsOn : [1], duration : "15", content: '野菜が柔らかくなるまで煮ます', resources : ['コンロ']},
	  {name : 'ルーを溶かす', dependsOn : [2], duration : "5", content : '火を止めてから、カレールーを入れます', resources : ['料理人','コンロ']}
  ]};

	var dish4 = {
		id   : 4,		
		name : 'ポテトサラダ',
		image : "img/potato_salad.png",		
		ingredients : [
		{name : 'じゃがいも', amount : 1, unit : '個'},
		{name : 'にんじん',    amount : "1/8", unit : '本'},
		{name : 'きゅうり', amount : "1/4", unit : '本'},
		{name : 'ハム', amount : 1, unit : '枚'},
		{name : '塩', amount : 0.5, unit : 'グラム'},
		{name : 'こしょう', amount : 0.2, unit : 'グラム'},
		{name : 'マヨネーズ', amount : 1, unit : '大さじ'},
		{name : '酢', amount : 1, unit : '小さじ'}
	],
	steps : [
			{name : '材料を切る', duration : "(person * 1.5)" , content : 'じゃがいもを洗い、半分に切ります。にんじんは皮をむき一口大に切ります。きゅうりを輪切りにします。ハムを適当に切ります', resources : ['料理人','作業台']},
			{name : 'きゅうりを塩もみする', dependsOn : [0], duration : "1" , content : 'きゅうりを塩もみします', resources : ['料理人','作業台']},
			{name : 'じゃがいもを茹でる', dependsOn : [0], duration : "17" , content : '鍋でじゃがいもを柔らかくなるまで茹でます', resources : ['コンロ']},
    		{name : 'にんじんを茹でる', dependsOn : [0], duration : "5" , content: 'にんじんを茹でます', resources : ['コンロ']},
			{name : 'じゃがいもを潰す', dependsOn : [2], duration : "(person * 0.5 + 1)" , content : 'じゃがいもの皮をむき潰します', resources : ['料理人','作業台']},
			{name : '混ぜる', dependsOn : [1,3,4], duration : "1", content : 'じゃがいも、にんじん、きゅうり、ハムを混ぜて、調味料で味を整えます', resources : ['料理人','作業台']}
]};


  var dishes = [dish1, dish2, dish3, dish4];