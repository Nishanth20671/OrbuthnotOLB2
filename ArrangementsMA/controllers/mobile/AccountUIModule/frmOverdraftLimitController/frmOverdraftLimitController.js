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
    
              var requestParam = {
                        "files": "",//scopeObj.fileObject,
                        "categoryid": "RCID_INCREASELOANAMOUNT",//scopeObj.view.NotficationsAndMessages.listbxCategory.selectedKey,
                        "subject": "Increase Loan Amount",
                        "description": "Current limit: 100"+"\nNew limit: "+this.view.CopyTextField0b68ada8a4afe4b.text,
                        "isTradeModule": undefined
                    };
                    this.loadAlertsMessagesModule().presentationController.createNewRequestOrMessage(requestParam);
                


    var ntf=new kony.mvc.Navigation("AccountUIModule/frmOverDraftAcknowledgement");
           ntf.navigate();
  },

            loadAlertsMessagesModule: function() {
            return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AlertsMsgsUIModule");
        },
  
  
  
  

 });