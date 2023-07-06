define({
    /*
        This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    AS_AppEvents_h604502f2d7c45eeb1a109cf404583a6: function AS_AppEvents_h604502f2d7c45eeb1a109cf404583a6(eventobject) {
        var self = this;
        applicationManager.applicationMode = "Mobile";
    },
    AS_AppEvents_cd80895e26d641059d66f958254daf07: function AS_AppEvents_cd80895e26d641059d66f958254daf07(eventobject) {
        var self = this;
        _kony.mvc.initCompositeApp(true);
        var ApplicationManager = require('ApplicationManager');
        applicationManager = ApplicationManager.getApplicationManager();
    }
});