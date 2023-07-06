define(['FormControllerUtility'],function(FormControllerUtility){

  return {
    onNavigate:function(params) {
      var scope = this;
      this.view.SavePayee.setContext(params,scope); 
    },
     /**
     * preShow
     * @api : preShow    
     * @return : NA
     */
   preShow : function(){
    this.view.flxFormContent.doLayout = function () {
      if(this.view.flxFooter.info.height!== undefined){
        this.view.flxMain.minHeight = this.view.flxFormContent.frame.height - this.view.flxFooter.info.height + "dp";
      }
    }.bind(this);
     FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter','flxMain','flxLogout']);
     this.view.customheadernew.activateMenu("UNIFIEDTRANSFER", "");
  
   },
    postShow: function() {
      this.view.SavePayee.height = "700dp";
      this.view.SavePayee.height = kony.flex.USE_PREFERRED_SIZE;
      this.view.forceLayout();
    },
    cancelSaveYes: function() {
       var navManager = kony.mvc.getNavigationManager();
       var obj = {
          context: this,
          callbackModelConfig:{"frm":"frmUTFLanding",
          "appName":"TransfersMA" }
        };
       navManager.navigate(obj);  
    },

    newTransfer: function() {
       var navManager = kony.mvc.getNavigationManager();
       var obj = {
          context: this,
          callbackModelConfig:{"frm":"frmUTFLanding",
          "appName":"TransfersMA" }
        };
       navManager.navigate(obj);
    },

    listAccounts: function() {
      new kony.mvc.Navigation({
        "appName": "HomepageMA",
        "friendlyName": "AccountsUIModule/frmDashboard"
      }).navigate();
    },
    updateFormUI: function(viewModel) {
      if (viewModel.isLoading === true) {
        FormControllerUtility.showProgressBar(this.view);
      } else if (viewModel.isLoading === false) {
        FormControllerUtility.hideProgressBar(this.view);
      }
    }

  };
});

