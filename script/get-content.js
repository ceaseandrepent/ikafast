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
var updateBuildingPlatesContinuously = function(msInterval) {
	currentCityName = document.getElementById('js_cityBread').innerText;
	if (currentCityName != cityNameAtPreviousChecking) {
		for (var i = 0; i <= 17; i++) {
			document.getElementById('building_plate_' + i).innerHTML
			= getBuildingPlateSpan(document.getElementById('position' + i));
		}
		cityNameAtPreviousChecking = currentCityName;
	}
	return setTimeout(function() { updateBuildingPlatesContinuously(msInterval); }, msInterval);
}

function injectInfoGatherer() {
	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.innerText = "(function() { function updateCitiesInfo() { var containerId = 'ikafast_city_info_for_transporter'; var container = document.getElementById(containerId); if (!container) { container = document.createElement('div'); container.setAttribute('id', containerId); container.setAttribute('style', 'display:none;'); document.getElementsByTagName('body')[0].appendChild(container); } container.innerHTML = JSON.stringify(dataSetForView.relatedCityData); } function updateAllyId() { var containerId = 'ikafast_ally_id'; var container = document.getElementById(containerId); if (!container) { container = document.createElement('div'); container.setAttribute('id', containerId); container.setAttribute('style', 'display:none;'); document.getElementsByTagName('body')[0].appendChild(container); } hasAlly ?  container.innerHTML = dataSetForView.avatarAllyId : container.innerHTML = -1; } updateAllyId(); updateCitiesInfo(); }());";
	document.getElementsByTagName('body')[0].appendChild(script);
}

function createTransporterWindow(jsonFormattedCitiesData) {
	var citiesData = JSON.parse(jsonFormattedCitiesData);
	var transporterTable = document.createElement('table');
	transporterTable.setAttribute('id', 'ikafast_transporter_window');
	transporterTable.style.background = '#FEF5D5';
	transporterTable.style.border = '4px solid';
	transporterTable.style.bottom = '0px';
	transporterTable.style.boxShadow = '0 0 35px #732C0F';
	transporterTable.style.color = '#732C0F';
	transporterTable.style.display = 'block';
	transporterTable.style.fontWeight = 'bold';
	transporterTable.style.left = '0px';
	transporterTable.style.opacity = '0.5';
	transporterTable.style.padding = '4px';
	transporterTable.style.position = 'absolute';
	transporterTable.style.zIndex = '65000';

	transporterTable.addEventListener('mouseover', function() {
		this.style.opacity = '1';
	});
	transporterTable.addEventListener('mouseout', function() {
		this.style.opacity = '0.5';
	});

	function getCityRow(cityObj) {
		var relationshipStyle;
		switch (cityObj.relationship) {
			case "ownCity":
				relationshipStyle = "";
				break;
			case "deployedCities":
				relationshipStyle = " style='background:rgba(0,255,0,0.5);'";
				break;
			case "occupiedCities":
				relationshipStyle = " style='background:rgba(255,0,0,0.5);'";
				break;
		}
		return "<tr" + relationshipStyle + "><td>" + cityObj.coords + "</td><td>" + cityObj.name + "</td>"
		     + "<td><img src=\'"
		     + chrome.extension.getURL('imgs/army.png')
		     + "\' onclick=\"ajaxHandlerCall(\'?view=deployment&amp;deploymentType=army&amp;destinationCityId="
		     + cityObj.id + "\');\" onmouseover=\"this.style.opacity=\'0.5\';\" onmouseout=\"this.style.opacity=\'1\';\"><img src=\'"
		     + chrome.extension.getURL('imgs/fleet.png')
		     + "\' onclick=\"ajaxHandlerCall(\'?view=deployment&amp;deploymentType=fleet&amp;destinationCityId="
		     + cityObj.id + "\');\" onmouseover=\"this.style.opacity=\'0.5\';\" onmouseout=\"this.style.opacity=\'1\';\"><img src=\'"
		     + chrome.extension.getURL('imgs/res.png')
		     + "\' onclick=\"ajaxHandlerCall(\'?view=transport&amp;destinationCityId="
		     + cityObj.id + "\');\" onmouseover=\"this.style.opacity=\'0.5\';\" onmouseout=\"this.style.opacity=\'1\';\"></td></tr>";
	}

	var tableRows = "<tr style='text-align:right;font-size:12px;'><td></td><td></td><td onmouseover=\"this.style.textDecoration=\'underline\';\" onmouseout=\"this.style.textDecoration=\'none\';\" onclick=\"this.offsetParent.style.display=\'none\';\">закрыть</td></tr>";
	for (var propertyName in citiesData) {
		if (citiesData[propertyName].hasOwnProperty('name')) {
			tableRows += getCityRow(citiesData[propertyName]);
		}
	}

	transporterTable.innerHTML = tableRows;
	document.getElementsByTagName('body')[0].appendChild(transporterTable);
}

function addSideMenuEntries() {
	if (document.getElementsByClassName('menu_slots').length == 0) {
		return;
	}
	var menuEntryNo = 7;
	function getTitleHtml(titleText) {
		return "<div class=\"name\"><span class=\"namebox\">" + titleText + "</span></div>"
	}
	function getClassName(No) {
		return "expandable slot" + No;
	}
	function addMenuEntry(title, imageName, func) {
		var menuEntry = document.createElement('li');
		menuEntry.setAttribute('class', getClassName(menuEntryNo++));
		menuEntry.setAttribute('style', 'display:inline-block;width:53px;');
		menuEntry.innerHTML = "<div class=\"image\" style=\"background:url(\'" + chrome.extension.getURL('imgs/' + imageName) + "\') no-repeat 0 0;\"></div>";
		menuEntry.innerHTML += getTitleHtml(title);
		typeof(func) == "function" ?
			menuEntry.addEventListener('click', func) :
			menuEntry.setAttribute('onclick', func);
		menuEntry.addEventListener('mouseover', function() { this.style.width = "199px"; });
		menuEntry.addEventListener('mouseout', function() { this.style.width = "53px"; });
		var sideMenu = document.getElementsByClassName('menu_slots')[0];
		sideMenu.insertBefore(menuEntry, sideMenu.firstChild);
	}

	addMenuEntry('Транспортировщик', 'transporter.png', function() {
		var transporter = document.getElementById('ikafast_transporter_window');
		transporter.style.display == "none" ?
			transporter.style.display = "block" :
			transporter.style.display = "none";
	});

	var allyId = document.getElementById('ikafast_ally_id').innerText;
	if (allyId != -1) {
		addMenuEntry('Общее сообщение', 'ally_message.png',
			"ajaxHandlerCall('?view=sendIKMessage&msgType=51&allyId="
			+ allyId + "'); return false;"
		);
	}

}

function getRealmName(realmNo) {
	var realms = { "s1": "alpha", "s2": "beta", "s3": "gamma", "s4": "delta", "s5": "epsilon", "s6": "zeta", "s7": "eta", "s8": "theta", "s9": "iota", "s10": "kappa", "s11": "lambda", "s12": "mu", "s13": "nu", "s14": "xi", "s15": "omicron", "s16": "pi", "s17": "rho", "s18": "sigma", "s19": "tau", "s21": "upsilon", "s22": "phi", "s23": "chi", "s24": "psi", "s25": "omega" }
	return realms[realmNo];
}

function checkMilitaryStatus() {
	var faceOfTheGeneral = document.getElementById('js_GlobalMenu_military');
	var realm = getRealmName(location.href.split('/')[2].split('.')[0]);

	switch (faceOfTheGeneral.className) {
		case "normalactive":
			chrome.extension.sendMessage({ query: "get military status" },
				function(response) {
					var currentMilitaryStatus = response.answer;
					if (currentMilitaryStatus != 1) {
						chrome.extension.sendMessage({
							query: "set military status",
							militaryStatus: 1
						});
						chrome.extension.sendMessage({
							query: "webkit notification",
							notificationIcon: chrome.extension.getURL('imgs/general_active.png'),
							notificationText: "Получен доклад о военных действиях!",
							notificationTitle: "Икариам, мир " + realm
						});
					}
				}
			);
			break;

		case "normalalert":
			chrome.extension.sendMessage({ query: "get military status" },
				function(response) {
					var currentMilitaryStatus = response.answer;
					if (currentMilitaryStatus != 2) {
						chrome.extension.sendMessage({
							query: "set military status",
							militaryStatus: 2
						});
						chrome.extension.sendMessage({
							query: "webkit notification",
							notificationIcon: chrome.extension.getURL('imgs/general_alert.png'),
							notificationText: "ВНИМАНИЕ! Враг угрожает Вашей Империи!",
							notificationTitle: "Икариам, мир " + realm
						});
					}
				}
			);
			break;

		default:
			chrome.extension.sendMessage({
				query: "set military status",
				militaryStatus: 0
			});
	}
}

function checkMilitaryStatusContinuously(msInterval) {
	checkMilitaryStatus();
	return setTimeout(function() { checkMilitaryStatusContinuously(msInterval); }, msInterval);
}

function checkDiplomacyStatus() {
	var faceOfTheDiplomat = document.getElementById('js_GlobalMenu_diplomacy');
	var realm = getRealmName(location.href.split('/')[2].split('.')[0]);

	if (faceOfTheDiplomat.className == "normalactive") {
		chrome.extension.sendMessage({ query: "get diplomacy status" },
			function(response) {
				var currentDiplomacyStatus = response.answer;
				if (!currentDiplomacyStatus) {
					chrome.extension.sendMessage({
						query: "set diplomacy status",
						diplomacyStatus: true
					});
					chrome.extension.sendMessage({
						query: "webkit notification",
						notificationIcon: chrome.extension.getURL('imgs/diplomat_active.png'),
						notificationText: "Получено сообщение!",
						notificationTitle: "Икариам, мир " + realm
					});
				}
			}
		);
	} else {
		chrome.extension.sendMessage({
			query: "set diplomacy status",
			diplomacyStatus: false
		});
	}
}

function checkDiplomacyStatusContinuously(msInterval) {
	checkDiplomacyStatus();
	return setTimeout(function() { checkDiplomacyStatusContinuously(msInterval); }, msInterval);
}

// creates buildings' plates __without levels__!
if (document.getElementById('position0')) {
	var tmp;
	for (var i = 0; i <= 17; i++) {
		tmp = document.getElementById('position' + i);
		tmp.innerHTML += getBuildingPlateDiv(tmp, i);
	}
	updateBuildingPlatesContinuously(3000);
}

injectInfoGatherer();
createTransporterWindow(document.getElementById('ikafast_city_info_for_transporter').innerText);
addSideMenuEntries();
checkMilitaryStatusContinuously(7000);
checkDiplomacyStatusContinuously(9000);

/*
(function() {
	function updateCitiesInfo() {
		var containerId = 'ikafast_city_info_for_transporter';
		var container = document.getElementById(containerId);
		if (!container) {
			container = document.createElement('div');
			container.setAttribute('id', containerId);
			container.setAttribute('style', 'display:none;');
			document.getElementsByTagName('body')[0].appendChild(container);
		}
		container.innerHTML = JSON.stringify(dataSetForView.relatedCityData);
	}

	function updateAllyId() {
		var containerId = 'ikafast_ally_id';
		var container = document.getElementById(containerId);
		if (!container) {
			container = document.createElement('div');
			container.setAttribute('id', containerId);
			container.setAttribute('style', 'display:none;');
			document.getElementsByTagName('body')[0].appendChild(container);
		}
		hasAlly ?
			container.innerHTML = dataSetForView.avatarAllyId :
			container.innerHTML = -1;
	}

	updateAllyId();
	updateCitiesInfo();
}());
*/
