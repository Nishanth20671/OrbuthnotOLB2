define({
    /*
        This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    AS_AppEvents_cd71a8f80846470687c2322f2481b79a: function AS_AppEvents_cd71a8f80846470687c2322f2481b79a(eventobject) {
        var self = this;
        kony.mvc.MDAApplication.getSharedInstance().appContext.deeplinkUrl = {
            deeplinkpath: eventobject.deeplinkpath,
            formID: eventobject.formID,
        };
    },
    AS_AppEvents_ebdc0eb19a134c76b4277f410bc45ca4: function AS_AppEvents_ebdc0eb19a134c76b4277f410bc45ca4(eventobject) {
        var self = this;
        _kony.mvc.initCompositeApp(true);
        var ApplicationManager = require('ApplicationManager');
        applicationManager = ApplicationManager.getApplicationManager();
    }
});