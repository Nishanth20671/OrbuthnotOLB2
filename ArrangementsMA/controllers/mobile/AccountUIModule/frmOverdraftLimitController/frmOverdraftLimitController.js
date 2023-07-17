define({ 

 //Type your controller code here 
  
  onNavigate: function()
  {
    this.view.CopyTextField0b68ada8a4afe4b.text="";
    this.view.CopyTextField0a19cee3181694e.text="";
  },
  flxBack_onClick: function()
  {
     var accountMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"HomepageMA","moduleName":"AccountsUIModule"});
      accountMod.presentationController.showDashboard();
		   },
  btnonClick: function()
  {
    var ntf=new kony.mvc.Navigation("AccountUIModule/frmOverDraftAcknowledgement");
           ntf.navigate();
  }
  
  
  

 });