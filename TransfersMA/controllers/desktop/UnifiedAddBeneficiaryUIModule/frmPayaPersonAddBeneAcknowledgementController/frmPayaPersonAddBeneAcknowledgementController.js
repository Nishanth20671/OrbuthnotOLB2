define(['FormControllerUtility'], function (FormControllerUtility) {
  return {
    init: function () {
      this.view.preShow = this.preShow;
      this.view.postShow = this.postShow;
      this.view.onDeviceBack = function () { };
      this.view.onBreakpointChange = this.onBreakpointChange;
    },
    preShow: function () {
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain']);
    },
    postShow: function () {
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
      applicationManager.getNavigationManager().applyUpdates(this);
      this.view.customheadernew.activateMenu("UNIFIEDTRANSFER", "");
    },
    onBreakpointChange: function (form, width) {
      FormControllerUtility.setupFormOnTouchEnd(width);
     
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
    },
    /**
     * @api : onNavigate
     * called when the application gets navigated to the respective form
     * @return : NA
     */
    onNavigate: function (context) {
      if (!kony.sdk.isNullOrUndefined(context.params)) {
        context = context.params;
      }
      var scope = this;
      this.view.TransferAcknowledgement.setContext(context, scope);
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
     * @api : transferActivities
     * navigates to transfers activities screen
     * @return : NA
     */
    transferActivities: function () {
      if (applicationManager.getConfigurationManager().getDeploymentGeography() === "EUROPE") {
        applicationManager.getModulesPresentationController({
          "moduleName": "ManageActivitiesUIModule",
          "appName": "TransfersMA"
        }).showTransferScreen({ context: "PastPayments" });
      }
      else {
        applicationManager.getModulesPresentationController({
          "moduleName": "TransferFastUIModule",
          "appName": "TransfersMA"
        }).showTransferScreen({ initialView: "PastPayments" });
      }
    },
    /**
     * @api : newTransfer
     * navigates to landing screen
     * @return : NA
     */
    newTransfer: function () {
      //       var scope=this;
      //       var obj = {
      //         "context": scope,
      //         "params": {
      //         },
      //         "callbackModelConfig": {
      //           "newTransfer":true
      //         }
      //       };
      //       var navManager = kony.mvc.getNavigationManager();
      //       navManager.navigate(obj);
      new kony.mvc.Navigation({
        "appName": "TransfersMA",
        "friendlyName": "frmUTFLanding"
      }).navigate();
    },
  };

});