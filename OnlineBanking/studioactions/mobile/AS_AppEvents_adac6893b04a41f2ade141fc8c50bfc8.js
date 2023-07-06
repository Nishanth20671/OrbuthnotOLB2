function AS_AppEvents_adac6893b04a41f2ade141fc8c50bfc8(eventobject) {
    var self = this;
    _kony.mvc.initCompositeApp(true);
    var ApplicationManager = require('ApplicationManager');
    applicationManager = ApplicationManager.getApplicationManager();
    kony.application.setApplicationBehaviors({
        'rtlMirroringInWidgetPropertySetter': true
    });
    try {
        // require('objectSvcMeta.js');
        applicationManager.preappInitCalls();
        var sm = applicationManager.getStorageManager();
        var config = applicationManager.getConfigurationManager();
        config.configurations.setItem('CURRENCYCODE', 'USD');
        var langObjFromStorage = sm.getStoredItem("langObj");
        if (!kony.sdk.isNullOrUndefined(langObjFromStorage)) {
            config.configurations.setItem("LOCALE", config.locale[langObjFromStorage.language]);
            config.configurations.setItem('DATEFORMAT', config.frontendDateFormat[config.getLocale()]);
        } else {
            config.configurations.setItem("LOCALE", "en_US");
            config.configurations.setItem('DATEFORMAT', config.frontendDateFormat["en_US"]);
        }
        kony.i18n.setCurrentLocaleAsync(config.configurations.getItem("LOCALE"), function() {}, function() {});
        config.setStartupLocaleAndDateFormat();
    } catch (err) {
        alert(err);
    }
}