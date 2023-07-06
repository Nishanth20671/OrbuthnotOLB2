define(['FormControllerUtility', 'CommonUtilities'], function (FormControllerUtility, CommonUtilities) {  
  return {
    init: function () {
      this.view.preShow = this.preShow;
      this.view.postShow = this.postShow;
      this.view.onDeviceBack = function () { };
      this.view.onBreakpointChange = this.onBreakpointChange;
      this.view.onHide = this.onHide;
      this.ManageActivitiesPresenter = applicationManager.getModulesPresentationController({"appName" : "TransfersMA", "moduleName" : "ManageActivitiesUIModule"});
    },
    onBreakpointChange: function (form, width) {
      FormControllerUtility.setupFormOnTouchEnd(width);
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
    },
    /**
	* @api : onNavigate
 	* gets invoked as soon as the control comes to the form
	* @return : NA
	*/
    onNavigate: function (param) {
      this.view.UnifiedTransfer.setContext(param);
      this.view.UnifiedTransfer.onError = this.onError;
      this.view.UnifiedTransfer.onCancelTransfer = this.onCancelTransfer;
      this.view.UnifiedTransfer.showErrorMessage = this.showErrorMessage;
      this.view.UnifiedTransfer.createTransfer = this.createTransfer;
    },
    preShow: function () {
      var scope = this;
      this.view.flxFormContent.doLayout = function () {
        if(this.view.flxFooter.info.height!== undefined){
          this.view.flxMain.minHeight = this.view.flxFormContent.frame.height - this.view.flxFooter.info.height + "dp";
        }
      }.bind(this);
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter']);
      this.view.customheadernew.activateMenu("UNIFIEDTRANSFER", "");
      this.view.flxTransferOption1.onTouchStart = this.showTransferScreen.bind(this, "Same Bank");
      this.view.flxTransferOption2.onTouchStart = this.showTransferScreen.bind(this, "Domestic Transfer");
      this.view.flxTransferOption3.onTouchStart = this.showTransferScreen.bind(this, "International Transfer");
      this.view.flxTransferOption4.onTouchStart = this.showTransferScreen.bind(this, "Pay a Person");
      scope.view.GenericMessageNew.closepopup = function() {
        scope.view.flxTransferError.setVisibility(false);
      }
    },
    postShow: function () {
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
      applicationManager.getNavigationManager().applyUpdates(this);
      applicationManager.executeAuthorizationFramework(this);
    },
    onHide: function() {
      this.view.flxTransferError.setVisibility(false);
      this.view.UnifiedTransfer.unsubscribeStore();
    },
    /**
     * updateFormUI - the entry point method for the form controller.
     * @param {Object} viewModel - it contains the set of view properties and keys.
     */
    updateFormUI: function (viewModel) {
      if (viewModel.isLoading === true) {
        FormControllerUtility.showProgressBar(this.view);
      } else if (viewModel.isLoading === false) {
        FormControllerUtility.hideProgressBar(this.view);
      }
    },
    /**
     * @api : onError
     * Error thrown from catch block in component and shown on the form
     * @return : NA
     */
    onError: function (err) {
     kony.print(JSON.stringify(err));
    },
    onCancelTransfer: function(context) {
      var self = this;
      var navManager = kony.mvc.getNavigationManager();
      if (context === "Edit") {
          self.ManageActivitiesPresenter.showTransferScreen({
              context: "ScheduledPayments"
          });
      } else if (context === "Repeat") {
          self.ManageActivitiesPresenter.showTransferScreen({
              context: "PastPayments"
          });
      } else {
          var obj = {
              context: this,
              callbackModelConfig: {
                  "frm": "frmUTFLanding",
                  "appName": "TransfersMA"
              }
          };
          navManager.navigate(obj);
      }
  },
    showErrorMessage: function (errorObj) {
      var scope = this;
      scope.view.flxTransferError.setVisibility(true);
      var error = {
        dbpErrMsg:
          errorObj.errorMessage || errorObj.dbpErrMsg || errorObj.errmsg
      };
      this.view.GenericMessageNew.setContext(error);
    },
    createTransfer: function (collectionObj,param) {
      var context = {
        "Transaction": collectionObj.Collection["Transaction"],
        "Recipients": collectionObj.Collection["Recipients"],
        "BankDetails": collectionObj.Collection["BankDetails"],
        "transferFlow": param.transferFlow
      };
      var navManager = kony.mvc.getNavigationManager();
      var obj = {
        context: this,
        params:context,
        callbackModelConfig:{"frm":"frmUTFDomesticTransferConfirmation",
        "appName":"TransfersMA" }
      };
      navManager.navigate(obj);
    },
    showTransferScreen: function(transferType){
      var frmName = "";
      switch (transferType) {
        case "Same Bank":
          frmName = "frmUTFSameBankTransfer";
          break;
        case "Domestic Transfer":
          frmName = "frmUTFDomesticTransfer";
          break;
        case "International Transfer":
          frmName = "frmUTFInternationalTransfer";
          break;
        case "Pay a Person":
           frmName = "frmUTFP2PTransfer";
          break;
      }
      var context = {
        "transferType": transferType
      };
      var navManager = kony.mvc.getNavigationManager();
      var obj = {
        context: this,
        params: context,
        callbackModelConfig:{"frm":frmName,
        "appName": "TransfersMA" }
      };
      navManager.navigate(obj);
    },
    showSameBankTransferOption: function() {
      this.view.flxTransferOption1.setVisibility(true);
    },
    hideSameBankTransferOption: function() {
      this.view.flxTransferOption1.setVisibility(false);
    },
    showDomesticTransferOption: function() {
      this.view.flxTransferOption2.setVisibility(true);
    },
    hideDomesticTransferOption: function() {
      this.view.flxTransferOption2.setVisibility(false);
    },
    showInternationalTransferOption: function() {
      this.view.flxTransferOption3.setVisibility(true);
    },
    hideInternationalTransferOption: function() {
      this.view.flxTransferOption3.setVisibility(false);
    },
    showP2PTransferOption: function() {
      this.view.flxTransferOption4.setVisibility(true);
    },
    hideP2PTransferOption: function() {
      this.view.flxTransferOption4.setVisibility(false);
    }
  };
});