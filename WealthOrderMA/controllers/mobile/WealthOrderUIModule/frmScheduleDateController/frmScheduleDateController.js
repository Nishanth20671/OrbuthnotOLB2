define({
  init: function () {
    var scope=this;
    var currentFormObject = kony.application.getCurrentForm();
    var currentForm=currentFormObject.id;
    applicationManager.getPresentationFormUtility().initCommonActions(this, "CALLBACK", currentForm, scope.navigateCustomBack);
  },
  preShow: function() {
    if (kony.os.deviceInfo().name === "iPhone") {
      this.view.flxHeader.isVisible = false;
    }
    this.view.customCalendar.preShow();
    this.view.customCalendar.selectedDate = '';
    this.view.customCalendar.triggerContinueAction = false;
    var startDate = new Date();
    var todayDate = (startDate.getMonth() + 1) + "/" + startDate.getDate() + "/" + startDate.getFullYear();
    this.view.customCalendar.setFirstEnabledDate(todayDate);
    this.view.customCalendar.setSelectedDate(todayDate);
    this.initActions();
  },
  initActions: function() {
    var scope = this;
    this.view.btnContinue.onClick = this.continueAction;
    this.view.customHeader.flxBack.onClick = this.onBack;
  },
  onBack: function () {
	 var navigationMan = applicationManager.getNavigationManager();
	 navigationMan.goBack();
  },
  continueAction: function() {
    var navMan=applicationManager.getNavigationManager();
    var wealthMod = applicationManager.getModulesPresentationController("WealthOrderUIModule");
     if(wealthMod.getVerifyFlow()){
            navMan.navigateTo("frmConvertCurrencyVerify");
      }else{
            navMan.navigateTo("frmConvertCurrency");
      }
  },
  postShow: function() {
    //To be added
  }
});