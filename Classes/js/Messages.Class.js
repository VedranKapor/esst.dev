export class Messages {
    static ShowSuccessMessage(message) {
        let theme = 'bootstrap';
        $("#jqxNotification").jqxNotification({ browserBoundsOffset: 50, opacity: 0.9, autoClose: false, autoCloseDelay: 3000, showCloseButton: false, template: "success", width: '45%', theme: theme });
        $("#jqxNotificationContent").text(message);
        $("#jqxNotificationContent").text(window.lang.translate(message));
        $("#jqxNotification").jqxNotification("open");
        return true;
    } 
    static ShowErrorMessage(message) {
        let theme = 'bootstrap';
        $("#jqxNotification").jqxNotification({ browserBoundsOffset: 50, opacity: 0.9, autoClose: false, autoCloseDelay: 3000, showCloseButton: false, template: "error", width: '45%', theme: theme });
        $("#jqxNotificationContent").text(message);
        $("#jqxNotificationContent").text(window.lang.translate(message));
        $("#jqxNotification").jqxNotification("open");
        return true;
    }
    static ShowInfoMessage(message) {
        let theme = 'bootstrap';
        $("#jqxNotification").jqxNotification({ browserBoundsOffset: 50, opacity: 0.9, autoClose: true, autoCloseDelay: 3000, showCloseButton: false, template: "info", width: '45%', theme: theme });
        $("#jqxNotificationContent").text(message);
        $("#jqxNotificationContent").text(window.lang.translate(message));
        $("#jqxNotification").jqxNotification("open");
        return true;
    }
    static ShowWarningMessage(message) {
        let theme = 'bootstrap';
        $("#jqxNotification").jqxNotification({ browserBoundsOffset: 50, opacity: 0.9, autoClose: true, autoCloseDelay: 3000, showCloseButton: false, template: "warning", width: '45%', theme: theme });
        $("#jqxNotificationContent").text(message);
        $("#jqxNotification").jqxNotification("open");
        return true;
    }
    static CloseAll() {
        $('#jqxNotification').jqxNotification('closeAll');
        return true;
    }
}

export class Loader {
    static On() {
        $('#loadermain').show();
    }
    static Off() {
        $('#loadermain').hide();
    }
}