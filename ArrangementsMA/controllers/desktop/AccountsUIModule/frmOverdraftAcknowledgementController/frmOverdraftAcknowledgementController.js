define({ 

 //Type your controller code here 
navToDashBoard:function()
  {
    var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "HomepageMA", "moduleName" : "AccountsUIModule"});
        accountsModule.presentationController.showAccountsDashboard();
  }
 });