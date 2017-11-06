var IngredientDictionary = [
	{ id : 100001, name : "さんま", unit : "匹"},
	{ id : 100002, name : "鶏もも肉", unit : "グラム", conv : {"枚" : 300}},	

	{ id : 200001, name : "豆腐", unit : "丁", conv : {"グラム" : "1/300"}},
	{ id : 200002, name : "乾燥わかめ", unit : "グラム"},
	{ id : 200003, name : "ハム", unit : "枚"},
	{ id : 200004, name : "白飯", unit : "グラム", conv : {"茶碗" : "150"}},
	
	{ id : 300001, name : "大根", unit : "本" , conv :{"グラム": "1/1000"}},
	{ id : 300002, name : "長ネギ", unit : "本" , conv :{"グラム": "1/100"}},
	{ id : 300003, name : "玉ねぎ", unit : "個" , conv :{"グラム": "1/200"}},
	{ id : 300004, name : "じゃがいも", unit : "グラム" , conv :{"個": 120}},
	{ id : 300005, name : "にんじん", unit : "本", conv :{"グラム": "1/150"}},
	{ id : 300006, name : "きゅうり", unit : "本", conv :{"グラム": "1/100"}},
	
	{ id : 400001, name : "すだち", unit : "個"},
	
	{ id : 500001, name : "塩",   unit : "グラム", conv : {"小さじ" : 6, "大さじ" : 18}},
	{ id : 500001, name : "こしょう",   unit : "グラム", conv : {"小さじ" : 3, "大さじ" : 9}},
	{ id : 500001, name : "マヨネーズ",   unit : "グラム", conv : {"小さじ" : 4, "大さじ" : 12}},
	{ id : 500001, name : "酢",   unit : "ml", conv : {"小さじ" : 5, "大さじ" : 15}},
	{ id : 500002, name : "砂糖", unit : "グラム", conv : {"小さじ" : 3, "大さじ" : 9}},
	{ id : 500003, name : "味噌", unit : "グラム", conv : {"小さじ" : 6, "大さじ" : 18}},
	{ id : 500004, name : "水", unit : "ml", conv : {"小さじ" : 5, "大さじ" : 15, "cc" : 1}},
	{ id : 500005, name : "サラダ油", unit : "ml", conv : {"小さじ" : 5, "大さじ" : 15, "cc" : 1}},
	{ id : 500006, name : "カレールー",   unit : "グラム"},
];

class IngredientSummary {
	
	constructor(name) {
		this.name = name;
		var found = -1;
		for(var i=0;i<IngredientDictionary.length;i++){
			if (IngredientDictionary[i].name == name){
				this.id = IngredientDictionary[i].id;
				this.conv = IngredientDictionary[i].conv;
				this.unit = IngredientDictionary[i].unit;
				found = i;
				break;
			}
		}
		if (found == -1){
			console.debug( name + "not found");
		}
		this.total_value = math.eval("0");
		this.total = math.eval("0");
		
	}		
		
	addIngredient(unit, amount, person){
		if (unit == this.unit){
			this.total_value = math.chain(this.total_value).add( math.eval(amount  + "*" + person)).done();
		}
		else {
			if (this.conv.hasOwnProperty(unit)){
				this.total_value = math.chain(this.total_value).add( math.eval (this.conv[unit] + "*"  + amount + "*"  + person)).done();
			}
			else{
				console.debug( this.name + " has not unit " + unit);
			}				
		}
		if (this.unit !="ml" && this.unit !="グラム"){
			if (!math.isInteger(this.total_value)){
				var num = math.floor(this.total_value);
				var fraction_part = this.total_value - num;
				if (num > 1){
					this.total = num + " " + math.format(math.fraction(fraction_part), {fraction: 'ratio'});
				}
				else{
					this.total = math.format(math.fraction(fraction_part), {fraction: 'ratio'});
				}
			}
			else{
				this.total = this.total_value;
			}
		}
		else{
			this.total = this.total_value;
		}
		console.log(this.total);
	}	
}
