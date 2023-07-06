define({
  primaryName: "",
  secondaryName: "",
  //Type your controller code here
  /**
   * init is called when the form is loaded , initialisation happen here
   */
  init: function () {
    var scope = this;
    this.view.preShow = this.preShowForm;
    this.view.postShow = this.postShowForm;
    applicationManager.getPresentationFormUtility().initCommonActions(this, "NO", this.view.id, scope.navigateCustomBack);
    this.presenter = applicationManager.getModulesPresentationController({ "moduleName": "AccountSweepsUIModule", "appName": "AccountSweepsMA" });
    this.navManager = applicationManager.getNavigationManager();
  },

  /***
   * OnNavigate is called when the form is navigated after init
   */
  onNavigate: function () {},

  /***
   * navigateCustomBack is triggered native/ ios back event
   */
  navigateCustomBack: function () {
    this.presenter.commonFunctionForgoBack();
  },

  /***
   * native/ios cancel event
   */
  cancelOnClick: function () {
    this.presenter.cancelCommon("frmAccountSweepsDashBoard");
  },
  /**
   * preShowForm is called when the form is pre loaded
   */
  preShowForm: function () {
    let scope = this;
    if (kony.os.deviceInfo().name === "iPhone") {
      this.view.flxHeader.isVisible = false;
    } else {
      this.view.flxHeader.isVisible = true;
    }
    scope.initActions();
  },

  /**
   * postShowForm is called when the form is post loaded
   */
  postShowForm: function () {},

  /**
   * initActions has all form action declarations
   */
  initActions: function () {
    this.view.customHeader.btnRight.onClick = this.cancelOnClick;
    this.view.customHeader.flxBack.onTouchStart = this.navigateCustomBack;
    this.presenter.getVerifyScreenData();
    this.view.btnContinue.onClick = this.onContinue;
  },

  setVerifyDetails: function () {
    var context = this.presenter.getAccountSweepsObject();
    //this.navManager.setEntryPoint("frmCreateVerifyDetails", "frmCreateVerifyDetails")
    let sweepflow = this.navManager.getEntryPoint("AccountSweepsFlow");
    if (sweepflow !== "Edit") {
      this.view.lblPrimaryAccountValue.text = context.processedPrimaryName;
      this.view.flxFromAccountImage.isVisible = true;
      this.view.lblPrimaryAccountValue.setEnabled(true);
      this.view.lblPrimaryAccountValue.onTouchStart = this.navigateToPrimaryOrSecondaryForm.bind(
        this,
        "frmAccountSweepsPrimaryAccount"
      );
      this.view.lblPrimaryAccountValue.skin = "sknMMBlueLabel";
      this.view.lblPrimaryAccountValue.right = "50dp";
    } else {
      this.view.lblPrimaryAccountValue.text = context.processedPrimaryName;
      this.view.flxFromAccountImage.isVisible = false;
      this.view.lblPrimaryAccountValue.setEnabled(false);
      this.view.lblPrimaryAccountValue.skin =
        "sknLbl424242SSP93prSansRegularPro";
      this.view.lblPrimaryAccountValue.right = "20dp";
    }
    this.view.lblSecondaryAccountValue.text = context.processedSecondaryName;
    this.view.lblHeaderValue.text = context.sweepType;
    this.setSweepCondition(
      context,
      context.processedPrimaryName,
      context.processedSecondaryName
    );
    this.view.lblFrequencyValue.text = context.frequency;
    this.view.lblStartingFromValue.text = context.startDate;
    this.view.lblEndDateValue.text = this.presenter.isEmptyNullUndefined(context.endDate) ? kony.i18n.getLocalizedString("i18n.accountsweeps.endManually") : context.endDate;
    this.view.lblSecondaryAccountValue.onTouchStart =  this.navigateToPrimaryOrSecondaryForm.bind(this,"frmAccountSweepsSecondaryAccount");
    this.view.lblHeaderValue.onTouchStart = this.navigateToForm.bind(this,"frmSweepsAmount");
    this.view.lblFrequencyValue.onTouchStart = this.navigateToForm.bind(this,"frmSweepsStartFrequency");
    this.view.lblStartingFromValue.onTouchStart = this.navigateToForm.bind(this,"frmSweepsStartingFrom");
    this.view.lblEndDateValue.onTouchStart = this.navigateToForm.bind(this,"frmSweepsEndDate");
  },

  setSweepCondition: function(context, primary, secondary) {
    var forUtility = applicationManager.getFormatUtilManager();
    this.view.rtxSweepCondition.isVisible = true;
    if(context.sweepType === kony.i18n.getLocalizedString("i18n.signatory.above")){
      this.view.rtxSweepCondition.text = "If the balance in" + " " + primary + " " + "goes <b>above" + " " + forUtility.getCurrencySymbol(context.currencyCode) + context.processedAboveSweepAmount + "</b>"+ " " + "then <b>transfer excess</b> amount to" + " " + secondary;
      this.view.flxSweep.isVisible = false;
    } else if(context.sweepType === kony.i18n.getLocalizedString("i18n.accountsweeps.below")) {
      this.view.rtxSweepCondition.text = "If the balance in" + " " + primary + " " + "goes <b>below" + " " + forUtility.getCurrencySymbol(context.currencyCode) + context.processedBelowSweepAmount + "</b>" + " " + "then <b>topup</b> amount from" + " " + secondary;
      this.view.flxSweep.isVisible = false;
    } else {
      this.view.rtxSweepCondition.text = "If the balance in" + " " + primary + " " + ":";
      this.view.flxSweep.isVisible = true;
      this.view.rtxCondition2.text = "goes <b>above" + " " +  forUtility.getCurrencySymbol(context.currencyCode) + context.processedAboveSweepAmount + "</b>"+ " " + "then <b>transfer excess</b> amount to" + " " + secondary;
      this.view.rtxCondition1.text = "goes <b>below" + " " +  forUtility.getCurrencySymbol(context.currencyCode) + context.processedBelowSweepAmount + "</b>"+ " " + "then <b>topup</b> amount from" + " " + secondary;
    }
  },

  onContinue: function () {
    let sweepflow = this.navManager.getEntryPoint("AccountSweepsFlow");
    sweepflow !== "Edit"
      ? this.presenter.createSweep()
      : this.presenter.editSweep();
  },

  navigateToForm: function(formName) {
    this.navManager.navigateTo(formName);
  },
  navigateToPrimaryOrSecondaryForm: function(formName) {
    this.presenter.isSecondaryEdit = true;
    this.navManager.navigateTo(formName);
  }

});