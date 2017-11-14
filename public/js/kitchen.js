class Kitchen {

	constructor(countHuman,countStove,countMicrowave,countOven,countGrill,countCounter) {

		this.countHuman = countHuman;
		this.countStove = countStove;
		this.countMicrowave = countMicrowave;
		this.countOven = countOven;
		this.countGrill = countGrill;
		this.countCounter = countCounter;
		this.resourceHash = {};

		this.human = new Array();
		for (var i= 0;i<this.countHuman;i++){
			this.human.push({ name : "料理人" + (i + 1), order : (100 + i + 1 )});
		}
		this.stove = new Array();
		for (var i=0;i<this.countStove;i++){
			this.stove.push({ name : "コンロ" + (i + 1), order : (200 + i + 1)});
		}
		this.microwave = new Array();
		for (var i= 0;i<this.countMicrowave;i++){
			this.microwave.push({ name : "電子レンジ" + (i + 1), order : (300 + i + 1)});
		}
		this.oven = new Array();
		for (var i= 0;i<this.countOven;i++){
			this.oven.push({ name : "オーブン" + (i + 1), order : (400 + i + 1)});
		}
		this.grill = new Array();
		for (var i= 0;i<this.countGrill;i++){
			this.grill.push({ name : "グリル" + (i + 1), order : (500 + i + 1)});
		}
		this.counter = new Array();
		for (var i= 0;i<this.countCounter;i++){
			this.counter.push( { name : "作業台" + (i + 1), order : (600 + i + 1)});
		}
		this.refrigerator = [{name : "冷蔵庫", order : 701}];
	
		this.resourceHash["料理人"] =  this.human;
		this.resourceHash["コンロ"] =  this.stove;
		this.resourceHash["電子レンジ"] =  this.microwave;
		this.resourceHash["オーブン"] =  this.oven;
		this.resourceHash["グリル"] =  this.grill;
		this.resourceHash["作業台"] =  this.counter;
		this.resourceHash["冷蔵庫"] = this.refrigerator;
		
		this.resources = this.human.concat(this.range).concat(this.microwave).concat(this.oven).concat(this.grill).concat(this.board).concat(this.refrigerator);
	
		this.resourcesIndex = {};
		var resourcesIndex = this.resourcesIndex;
		var index = 0;
		this.resources.forEach(function(resource){
			resourcesIndex[resource] = index++;
		});
	}

	getResourceNames(name){
		var resources = new Array();
		this.resourceHash[name].forEach(function(res){
			resources.push(res.name);
		});
		return resources;
	}

	getResource(name){
		return this.resourceHash[name];
	}

	getResourcesWithIdForDish(dishes){
		var kitchenResourcesWithId = new Array();
		var resources = this.getResourcesForDish(dishes);
		resources.forEach(function (resource){
			var isNotReservable = false;
			if (resource == '冷蔵庫'){
				isNotReservable = true;
			}
			kitchenResourcesWithId.push({id : resource.name, isNotReservable : isNotReservable});
		});
		return kitchenResourcesWithId;
	}

	getTasksForDish(dishes, person){
		var tasks = new Array();
		var index = 0;
		var lastIndex = 0;
		var that = this;
		dishes.forEach(function (dish){
		  dish.steps.forEach(function (step){
				var dependsOn = new Array();
				if (step.hasOwnProperty('dependsOn')){
				  step.dependsOn.forEach(function (depend){
						dependsOn.push(depend + lastIndex);
					});
				}
				var duration = 0;
				if (step.hasOwnProperty('constant')){
					duration = step.duration;
				}
				else{
					var b = 0;
					if(step.hasOwnProperty('proportional')){
						if (step.proportional.hasOwnProperty('b')){
							b = step.proportional.b;
						}
					}
					duration = step.duration * person + b;
				}
				tasks.push({id : index, duration : duration, minSchedule: duration, dependsOn : dependsOn, resources : that.mappingKitchenResource(step.resources)});
				index++;
		  });
		  lastIndex = index;
		});  
		return tasks;
	}

	getResourcesForDish(dishes){
		var resources = {};
		dishes.forEach(function (dish){
			dish.steps.forEach(function (step){
			  step.resources.forEach(function(resource){
					if (!resources.hasOwnProperty(resource)){
						resources[resource] = 1;
					}
			  });
			});
		});  
		var res = new Array();
		for (var resource in resources){
			var kitchenResources = this.getResource(resource);
			kitchenResources.forEach(function(kitchenResource){
				res.push(kitchenResource);					
			});
		}
		return res;
	}

	getResourceIndex(name){
		return this.resourcesIndex[name];
	}

	mappingKitchenResource(resources){
		var that = this;
		var kitchenResources = new Array();
		resources.forEach(function (resource){
			kitchenResources.push(that.getResourceNames(resource));
		});
		return kitchenResources;
	}

}