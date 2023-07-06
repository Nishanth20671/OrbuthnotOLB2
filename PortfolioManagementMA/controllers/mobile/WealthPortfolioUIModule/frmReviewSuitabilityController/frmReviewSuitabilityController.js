/* eslint-disable */
define([],function(){

  return {
    onNavigate: function() {
      this.view.preShow = this.preShow;
      this.view.flxProceedButton.onTouchEnd = this.onClickProceed;
      this.view.customHeader.btnRight.onClick = this.onCancelClick;
      this.view.suitabilityReview.onRequestStart = function() {
        applicationManager.getPresentationUtility().showLoadingScreen();
      };
      this.view.suitabilityReview.onRequestEnd = function() {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
      };
    },
    preShow: function() {
      //[IW-3846 - Sarah]
      var navManager = applicationManager.getNavigationManager();
      var data = navManager.setCustomInfo("frmRevSuitability", true);
      //code added till here
      this.view.flxProceed.setVisibility(true);
      this.view.suitabilityReview.setVisibility(false);
      this.view.title = kony.i18n.getLocalizedString("i18n.wealth.suitabilityProfile");
      if (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone") {
        this.view.flxHeader.isVisible = true;
      } else {
        this.view.flxHeader.isVisible = false;
      }
    },
    onClickProceed:function(){
      this.view.flxProceed.setVisibility(false);
      this.view.suitabilityReview.setVisibility(true);
      var navManager = applicationManager.getNavigationManager();
      var firstuser = navManager.getCustomInfo("frmFirstUserBoolean");
      var params = {
        "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
        "portfolioServiceType": "Advisory"
      }
        this.view.suitabilityReview.setContext(params,this.navToChooseStrategy, firstuser);
    },
    onCancelClick:function(){
      this.view.suitabilityReview.onCancel();
      var navManager = applicationManager.getNavigationManager();
      var data = navManager.getCustomInfo("frmFirstUserBoolean");
      if(data !== undefined){
        data = undefined;
        navManager.setCustomInfo("frmFirstUserBoolean", data);
        //var navManager = applicationManager.getNavigationManager();
            new kony.mvc.Navigation({
                "appName": "PortfolioManagementMA",
                "friendlyName": "frmPortfolioDetails"
            }).navigate();
      }else{
        //var navManager = applicationManager.getNavigationManager();
            new kony.mvc.Navigation({
                "appName": "PortfolioManagementMA",
                "friendlyName": "frmStrategyAllocation"
            }).navigate();
      }
    },
    navToChooseStrategy:function(){
      var navManager = applicationManager.getNavigationManager();
            new kony.mvc.Navigation({
                "appName": "PortfolioManagementMA",
                "friendlyName": "frmChangeStrategy"
            }).navigate();
    }
  }

});