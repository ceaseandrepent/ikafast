(function () {

var getBuildingPlateSpan = function (buildingObj) {
	var buildingLevel = buildingObj.className.match(/[0-9]+$/);
	if (isNaN(buildingLevel) || buildingLevel == null) {
		return '';
	} else {
		buildingLevel = buildingLevel[0];
	}

	var spanStyle = "'font-weight: bold;" 
				  + "background: blue;" 
				  + "color: white;" 
				  + "opacity: 0.5;" 
				  + "border-radius: 16px;" 
				  + "border: solid 4px white;" 
				  + "padding: 8px;'";

	return "<span style=" + spanStyle
		   + ">" + buildingLevel
		   + "</span>";
}

var getBuildingPlateDiv = function (buildingObj, positionNo) {
	return "<div id='building_plate_" + positionNo +  "' style='position:relative; top:" + 0.7 * buildingObj.clientHeight + "px; left:" + 0.7 * buildingObj.clientWidth + "px;'></div>";
}

var cityNameAtPreviousChecking, currentCityName;
var updateBuildingsPlates = function() {

	currentCityName = document.getElementById('js_cityBread').innerText;
	if (currentCityName != cityNameAtPreviousChecking) {
		for (var i = 0; i <= 17; i++) {
			document.getElementById('building_plate_' + i).innerHTML
			= getBuildingPlateSpan(document.getElementById('position' + i));
		}
		cityNameAtPreviousChecking = currentCityName;
	}
	return setTimeout(function() { updateBuildingsPlates(); }, 3000);
}

for (var i = 0; i <= 17; i++) {
	var tmp = document.getElementById('position' + i);
	tmp.innerHTML += getBuildingPlateDiv(tmp, i);
}

updateBuildingsPlates();

}());
