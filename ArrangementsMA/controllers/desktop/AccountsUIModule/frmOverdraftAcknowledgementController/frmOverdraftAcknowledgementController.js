define({ 

 //Type your controller code here 
navToDashBoard:function()
  {
    var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "HomepageMA", "moduleName" : "AccountsUIModule"});
        accountsModule.presentationController.showAccountsDashboard();
  },
  onNavigate: function(requestParam)
  {
	
      
//     var ntf=new kony.mvc.Navigation("AccountsUIModule/frmOverdraftAcknowledgement");
//     ntf.navigate(requestParam);

  }
 });