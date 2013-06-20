function wipeCommas(str) {
	var res = [];
	for (var i = 0; i < str.length; i++) {
		if (str[i] == ',') {
			continue;
		}
		else {
			res += str[i];
		}
	}
	return parseInt(res);
}

function getAndSendResourceDataOnce() {
	var warehouses = document.getElementsByClassName('warehouse');
	var savedFromRobberyResourcesAmount = 100;
	for (var i = 0; i < warehouses.length; i++) {
		savedFromRobberyResourcesAmount += parseInt(warehouses[i].className.match(/[0-9]+$/)[0]) * 480;
	}

	var currentTime = new Date();

	Resource = {}
	Resource.type      = "resources";
	Resource.realm     = document.location.href.split('/')[2];
	Resource.timestamp = currentTime.getTime();
	Resource.city      = document.getElementById('js_cityBread').innerText;
	Resource.wood      = wipeCommas(document.getElementById('js_GlobalMenu_wood').innerText);
	Resource.wine      = wipeCommas(document.getElementById('js_GlobalMenu_wine').innerText);
	Resource.marble    = wipeCommas(document.getElementById('js_GlobalMenu_marble').innerText);
	Resource.glass     = wipeCommas(document.getElementById('js_GlobalMenu_crystal').innerText);
	Resource.sulfur    = wipeCommas(document.getElementById('js_GlobalMenu_sulfur').innerText);

	Resource.woodPerHour   = parseInt(document.getElementById('js_GlobalMenu_resourceProduction').innerText);
	Resource.winePerHour   = parseInt(document.getElementById('js_GlobalMenu_production_wine').innerText);
	Resource.marblePerHour = parseInt(document.getElementById('js_GlobalMenu_production_marble').innerText);
	Resource.glassPerHour  = parseInt(document.getElementById('js_GlobalMenu_production_crystal').innerText);
	Resource.sulfurPerHour = parseInt(document.getElementById('js_GlobalMenu_production_sulfur').innerText);

	Resource.savedFromRobbery = savedFromRobberyResourcesAmount;

	chrome.extension.sendMessage(Resource);
}

var CITY_INFO_AT_PREVIOUS_CHECK = '';
function checkAndUpdateContinuously(msInterval) {
	var cityInfo = document.getElementById('js_cityBread').innerText
	             + document.getElementById('js_GlobalMenu_wood').innerText
	             + document.getElementById('js_GlobalMenu_wine').innerText
	             + document.getElementById('js_GlobalMenu_marble').innerText
	             + document.getElementById('js_GlobalMenu_crystal').innerText
	             + document.getElementById('js_GlobalMenu_sulfur').innerText
	             + document.getElementById('js_GlobalMenu_resourceProduction').innerText
	             + document.getElementById('js_GlobalMenu_production_wine').innerText
	             + document.getElementById('js_GlobalMenu_production_marble').innerText
	             + document.getElementById('js_GlobalMenu_production_crystal').innerText
	             + document.getElementById('js_GlobalMenu_production_sulfur').innerText;
	if (CITY_INFO_AT_PREVIOUS_CHECK != cityInfo) {
		getAndSendResourceDataOnce();
		CITY_INFO_AT_PREVIOUS_CHECK = cityInfo;
	}
	setTimeout(function() { checkAndUpdateContinuously(msInterval); }, msInterval);
}

function injectInfoGatherer() {
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.innerText = "(function() { function updateWineConsumption() { var containerId = 'warehouse_mastery_wine_consumption_' + dataSetForView.relatedCityData[dataSetForView.relatedCityData.selectedCity].name; var container = document.getElementById(containerId); if (!container) { container = document.createElement('div'); container.setAttribute('id', containerId); container.setAttribute('style', 'display:none;'); document.getElementsByTagName('body')[0].appendChild(container); } container.innerHTML = dataSetForView.wineSpendings; } updateWineConsumption(); }());";
	document.getElementsByTagName('body')[0].appendChild(script);
}

function getAndSendWineConsumptionRate() {
	WineConsumption = {}
	WineConsumption.type = "wine_consumption";
	WineConsumption.realm = document.location.href.split('/')[2];
	WineConsumption.cityName = document.getElementById('js_cityBread').innerText;
	WineConsumption.rate = document.getElementById('warehouse_mastery_wine_consumption_' + WineConsumption.cityName).innerText * -1;
	chrome.extension.sendMessage(WineConsumption);
}

injectInfoGatherer();
getAndSendWineConsumptionRate();
checkAndUpdateContinuously(900);

/*
(function() {
	function updateWineConsumption() {
		var containerId = 'warehouse_mastery_wine_consumption_'
		                + dataSetForView.relatedCityData[dataSetForView.relatedCityData.selectedCity].name;
		var container = document.getElementById(containerId);
		if (!container) {
			container = document.createElement('div');
			container.setAttribute('id', containerId);
			container.setAttribute('style', 'display:none;');
			document.getElementsByTagName('body')[0].appendChild(container);
		}
		container.innerHTML = dataSetForView.wineSpendings;
	}

	updateWineConsumption();
}());
*/
