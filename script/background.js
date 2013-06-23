function showWebkitNotification(icon, title, text) {
	if (window.webkitNotifications.checkPermission > 0) {
		window.webkitNotifications.requestPermission(function () { showWebkitNotification(icon, title, text); });
	} else {
		webkitNotifications.createNotification(icon, title, text).show();
	}
}

var CURRENT_MILITARY_STATUS = 0; // 0 - for 'normal', 1 - for active, 2 - for alert
var CURRENT_DIPLOMACY_STATUS = false;
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		//sender.tab.url - адрес вида "http://s13.ru.ikariam.com/index.php?"
		switch (request.query) {
			case "set diplomacy status":
				CURRENT_DIPLOMACY_STATUS = request.diplomacyStatus;
				break;

			case "get diplomacy status":
				sendResponse({ answer: CURRENT_DIPLOMACY_STATUS });
				break;

			case "set military status":
				CURRENT_MILITARY_STATUS = request.militaryStatus;
				break;

			case "get military status":
				sendResponse({ answer: CURRENT_MILITARY_STATUS });
				break;

			case "webkit notification":
				showWebkitNotification(
					request.notificationIcon,
					request.notificationTitle,
					request.notificationText
				);
				break;

			default:
				break;
		}
	}
);

