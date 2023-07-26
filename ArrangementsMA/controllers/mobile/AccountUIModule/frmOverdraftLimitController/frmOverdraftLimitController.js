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
    
             
           
    var description="Current limit: 100"+"\nNew limit: "+this.view.CopyTextField0b68ada8a4afe4b.text;
                 var data = {
      "files" : "",
      "requestsubject" : "Increase Loan Amount",//this.view.tbxSubject.text,
      "messagedescription" : Base64.encode(encodeURI(description)),
      "requestcategory_id" : "RCID_INCREASELOANAMOUNT",
      "isNativeApplication": true
    };
    var navMan = applicationManager.getNavigationManager();
          navMan.setCustomInfo("OverDraftLimit",true);
    var msgModule=kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "SecureMessageMA", "moduleName" : "MessagesUIModule"});
    msgModule.presentationController.createNewMessage(data);
    

//     var ntf=new kony.mvc.Navigation("AccountUIModule/frmOverDraftAcknowledgement");
//            ntf.navigate();
  },

            loadAlertsMessagesModule: function() {
            return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AlertsMsgsUIModule");
        },
  
  
  
  

 });