function showWebkitNotification(icon, title, text) {
	if (window.webkitNotifications.checkPermission > 0) {
		window.webkitNotifications.requestPermission(function () { showWebkitNotification(icon, title, text); });
	} else {
		webkitNotifications.createNotification(icon, title, text).show();
	}
}

var CURRENT_MILITARY_STATUS = {}, CURRENT_DIPLOMACY_STATUS = {}
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		//sender.tab.url - адрес вида "http://s13.ru.ikariam.com/index.php?"
		var senderName = sender.tab.url.split('/')[2];
		switch (request.query) {
			case "set diplomacy status":
				CURRENT_DIPLOMACY_STATUS[senderName] = request.diplomacyStatus;
				break;

			case "get diplomacy status":
				sendResponse({ answer: CURRENT_DIPLOMACY_STATUS[senderName] });
				break;

			case "set military status":
				CURRENT_MILITARY_STATUS[senderName] = request.militaryStatus;
				break;

			case "get military status":
				sendResponse({ answer: CURRENT_MILITARY_STATUS[senderName] });
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

