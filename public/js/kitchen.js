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
			this.human.push("料理人" + i);
		}
		this.stove = new Array();
		for (var i=0;i<this.countStove;i++){
			this.stove.push("コンロ" + i);
		}
		this.microwave = new Array();
		for (var i= 0;i<this.countMicrowave;i++){
			this.microwave.push("電子レンジ" + i);
		}
		this.oven = new Array();
		for (var i= 0;i<this.countOven;i++){
			this.oven.push("オーブン" + i);
		}
		this.grill = new Array();
		for (var i= 0;i<this.countGrill;i++){
			this.grill.push("グリル" + i);
		}
		this.counter = new Array();
		for (var i= 0;i<this.countCounter;i++){
			this.counter.push("作業台" + i);
		}
		this.refrigerator = ["冷蔵庫"];
	
		this.resourceHash["料理人"] =  this.human;
		this.resourceHash["コンロ"] =  this.stove;
		this.resourceHash["電子レンジ"] =  this.microwave;
		this.resourceHash["オーブン"] =  this.oven;
		this.resourceHash["グリル"] =  this.grill;
		this.resourceHash["作業台"] =  this.counter;
		this.resourceHash["冷蔵庫"] = this.refrigerator;
		
		this.resources = this.human.concat(this.range).concat(this.microwave).concat(this.oven).concat(this.grill).concat(this.board).concat(this.refrigerator);
	
		this.resourcesWithId = new Array();
		this.resourcesIndex = {};
		var resourcesWithId = this.resourcesWithId;
		var resourcesIndex = this.resourcesIndex;
		var index = 0;
		this.resources.forEach(function(resource){
			resourcesWithId.push({id : resource});
			resourcesIndex[resource] = index++;
		});
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
			kitchenResourcesWithId.push({id : resource, isNotReservable : isNotReservable});
		});
		return kitchenResourcesWithId;
	}

	getTasksForDish(dishes){
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
				tasks.push({id : index, duration : step.duration, minSchedule: step.duration, dependsOn : dependsOn, resources : that.mappingKitchenResource(step.resources)});
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
			kitchenResources.push(that.getResource(resource));
		});
		return kitchenResources;
	}

}