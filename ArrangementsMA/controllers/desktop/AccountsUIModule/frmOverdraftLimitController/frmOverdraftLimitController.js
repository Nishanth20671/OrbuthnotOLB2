define({ 

 //Type your controller code here 
onNavigate: function()
{
this.view.txtNewLimit.text="";
this.view.CopytxtNewLimit0e7dc6384d16040.text="";
},
  btnSend_onClick: function()
  {



                    var requestParam = {
                        "files": "",//scopeObj.fileObject,
                        "categoryid": "RCID_INCREASELOANAMOUNT",//scopeObj.view.NotficationsAndMessages.listbxCategory.selectedKey,
                        "subject": "Increase Loan Amount",
                        "description": "Current limit: 100"+"\nNew limit: "+this.view.txtNewLimit.text,
                        "isTradeModule": undefined
                    };
                    this.loadAlertsMessagesModule().presentationController.createNewRequestOrMessage(requestParam);
              


    var ntf=new kony.mvc.Navigation("AccountsUIModule/frmOverdraftAcknowledgement");
    ntf.navigate();

  },

          loadAlertsMessagesModule: function() {
            return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AlertsMsgsUIModule");
        },
  

 });