define({
  init : function(){
    var navManager = applicationManager.getNavigationManager();
    var currentForm = navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
  },
  preshow : function(){
    if(applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone"){
      this.view.flxHeader.isVisible = true;
    }
    else{
      this.view.flxHeader.isVisible = false;
    }
    this.view.imgTermsAccepted.src="tickmarkbox.png";
    this.view.btnContinue.setEnabled(false);
    this.view.btnContinue.skin = "sknBtna0a0a0SSPReg26px";
    this.view.btnContinue.onClick = this.navigateToBankLogin;
    this.view.flxCheckBox.onClick=this.toggleCheckBox;
    var navManager = applicationManager.getNavigationManager();
    var data = navManager.getCustomInfo({"appName" : "AccAggregationMA", "friendlyName" : "ExternalAccountsUIModule/frmExternalAccountsTermsAndConditions"});
    this.setData(data);
    this.view.customHeader.flxBack.onClick = this.navigateCustomBack;
    var currentForm = navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().logFormName(currentForm);
    applicationManager.getPresentationUtility().dismissLoadingScreen();
  },
  goBack: function(){
    var navManager = applicationManager.getNavigationManager();
    navManager.goBack();
  },
  navigateToBankLogin: function()
  {
    applicationManager.getPresentationUtility().showLoadingScreen();
    var externalAccountMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "ExternalAccountsUIModule",
        "appName": "AccAggregationMA"
    });
    externalAccountMod.presentationController.giveTermsAndConditionsConsent();
  },
  navigateCustomBack: function () {
    new kony.mvc.Navigation({"appName" : "HomepageMA", "friendlyName" : "AccountsUIModule/frmUnifiedDashboard"}).navigate();
  },
  setData: function(data)
  {
    //on iOS due to wkWebview, thie initial scale factor is not 1. hence setting it using meta tag as suggested by platform team.
    var initialScaleFactorTag = "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">";
    this.view.brwTrc.htmlString = initialScaleFactorTag + data.termsAndConditionsContent;
  },  
  toggleCheckBox:function()
  {
    if(this.view.imgTermsAccepted.src==="tickmarkbox.png")
    {
      this.view.imgTermsAccepted.src="a.png";
      this.view.btnContinue.setEnabled(true);
      this.view.btnContinue.skin = "sknBtn055BAF26px";
    }
    else
    {
      this.view.imgTermsAccepted.src="tickmarkbox.png";
      this.view.btnContinue.setEnabled(false);
      this.view.btnContinue.skin = "sknBtna0a0a0SSPReg26px";
    }
  },
});