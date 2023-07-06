define({
    /*
        This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    AS_AppEvents_j58ba9e21dad43ca9d4b99f2104e25bf: function AS_AppEvents_j58ba9e21dad43ca9d4b99f2104e25bf(eventobject) {
        var self = this;
        try {
            applicationManager.postAppInitiate();
            applicationManager.applicationMode = "Mobile";
            kony.application.setApplicationProperties({
                // "statusBarForegroundColor": "000000"
            });
            //   var registrationManager = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
            //     "moduleName": "RegistrationManager",
            //     "appName": "AuthenticationMA"
            //   }).businessController;
            //   registrationManager.setEventTracking();
        } catch (err) {
            throw GlobalExceptionHandler.addMessageAndActionForException(err, "kony.error.App_Initialisation_Failed", GlobalExceptionHandler.ActionConstants.BLOCK, arguments.callee.name);
        }
    },
    AS_AppEvents_adac6893b04a41f2ade141fc8c50bfc8: function AS_AppEvents_adac6893b04a41f2ade141fc8c50bfc8(eventobject) {
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
});