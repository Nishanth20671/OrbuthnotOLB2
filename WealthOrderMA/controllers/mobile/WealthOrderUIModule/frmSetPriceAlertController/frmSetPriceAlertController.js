define(['CommonUtilities'],function(CommonUtilities){ 	

  var navManager;
  var wtchLstRsp;
  var slctdInstDet;
  var currencySymbol;
  var condition;
  var alertValue;
  var crntInstDet;
  var instrumentISIN;

  const BTN_ENABLE_SKIN = "sknBtn0095e4RoundedffffffSSP26px";
  const BTN_DISABLE_SKIN = "sknlblEAEBF1SSPSemiBold72727215px";

  const LBL_POSITIVE_VALUE_SKIN = "sknIbl2f8523SSPsb45px";
  const LBL_NEGATIVE_VALUE_SKIN = "sknIblEE0005SSPsb45px";
  const MSG_ALERT_SUCCESS = "Alert successfully set";
  const MSG_ALERT_UPDATE_SUCCESS = "Alert successfully Modified";

  return{
    onNavigate: function()
    {
      this.view.preShow= this.preShow;
      this.view.postShow= this.postShow;
    },
    preShow: function(){
      if (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone") {
        this.view.flxHeader.isVisible = true;
      } else {
        this.view.flxHeader.isVisible = false;
        this.view.flxSetPriceAlert.top = "0dp";
      }
    },   

    postShow: function(){

      //Retrieve details from Watchlist form
      navManager = applicationManager.getNavigationManager();
      wtchLstRsp = navManager.getCustomInfo('segDet'); 
      slctdInstDet = navManager.getCustomInfo('frmInstrumentDetails'); 
      crntInstDet = slctdInstDet.response;

      //reset if any flex popup enabled in previous sessions
      this.view.flxPopupParent.setVisibility(false);

      this.setInitialUI();
      this.setInitialUIAlertCondAndValues();

      this.view.customHeader.flxBack.setVisibility(false);
      this.view.customHeader.btnRight.onTouchEnd = this.navigateToWatchList;
      this.view.btnSet.onTouchEnd = this.saveAlert;
      this.view.btnDone.onClick = this.navigateToWatchList;

      this.view.flxAlertPriceCondition.onTouchEnd = this.openalertCondition;
      this.view.flxAddAlertPrice.onTouchEnd = this.openAlertValue;

      this.view.flxNo.onTouchEnd = this.closePopup;

      this.view.flxYes.onTouchEnd = function(){
        scope_WealthPresentationController.instruList[instrumentISIN] = undefined;
        var navMan = applicationManager.getNavigationManager();
        scope_WealthPresentationController.tempAlert=undefined;
        navMan.navigateTo('frmWatchlist');
      };

      this.view.btnRemoveAlert.onClick = this.showAlertRemoveConfirmation;
      this.view.btnModify.onClick = this.updateAlert;

    },

    /*
    * Set the initial UI - Top card
    */
    setInitialUI: function() {

      var instDetail = slctdInstDet.response;

      this.view.lblName.text = instDetail.instrumentName;
      this.view.lblId.text = instDetail.ISINCode + " | " + instDetail.exchange;
      instrumentISIN = instDetail.ISINCode;

      var formatUtil = applicationManager.getFormatUtilManager();
      currencySymbol = formatUtil.getCurrencySymbol(instDetail.referenceCurrency); 
      this.view.lblLatestPrice.text = currencySymbol + instDetail.lastRate;


      if(instDetail.percentageChange === "" || instDetail.percentageChange === undefined || instDetail.percentageChange === null) {
        this.view.lblChangeValue.text = "";
      } else {
        this.view.lblChangeValue.text = instDetail.percentageChange + "%" ;
        if (instDetail.percentageChange > 0) {
          this.view.lblChangeValue.skin = LBL_POSITIVE_VALUE_SKIN;
          this.view.lblChangeValue.text = "+" + instDetail.percentageChange + "%" ;
        } else if (instDetail.percentageChange < 0) {
          this.view.lblChangeValue.skin = LBL_NEGATIVE_VALUE_SKIN;
        } else {
          this.view.lblChangeValue.skin = LBL_POSITIVE_VALUE_SKIN;
        }
      }
    },


    setInitialUIAlertCondAndValues: function(){

      var alertDetails = scope_WealthPresentationController.instruList[instrumentISIN];
      var tempAlertDetails = scope_WealthPresentationController.tempAlert;

      if(alertDetails){
        this.view.flxModifyButton.setVisibility(true);
        this.view.flxSetAlertButton.setVisibility(false);

        //Values set already so modify logic
        this.view.lblSelectCondition.text = alertDetails.alertCondition;
        this.view.lblAdd.text = alertDetails.alertValue;

        //temp alert is set which means values are modified, so need to enable modify button and set mdoified values
        if(tempAlertDetails) {

          //Modify logic and values are changed
          this.view.lblSelectCondition.text = tempAlertDetails.alertCondition ? tempAlertDetails.alertCondition : this.view.lblSelectCondition.text;
          this.view.lblAdd.text = tempAlertDetails.alertValue ? tempAlertDetails.alertValue : this.view.lblAdd.text;

          if(alertDetails.alertCondition !== tempAlertDetails.alertCondition || alertDetails.alertValue !== tempAlertDetails.alertValue) {
            CommonUtilities.enableButton( this.view.btnModify);
            this.view.btnModify.skin = BTN_ENABLE_SKIN;
            this.view.btnModify.focusSkin = BTN_ENABLE_SKIN;
          }

        } else {
          CommonUtilities.disableButton( this.view.btnModify);
          this.view.btnModify.skin = BTN_DISABLE_SKIN;
          this.view.btnModify.focusSkin = BTN_DISABLE_SKIN;
        }
      } else {
        
        this.view.flxModifyButton.setVisibility(false);
        this.view.flxSetAlertButton.setVisibility(true);
        
        //if temp alert has value then values are available but not set
        if(tempAlertDetails) {
          this.view.lblSelectCondition.text = tempAlertDetails.alertCondition ?  tempAlertDetails.alertCondition : "Select Condition";
          this.view.lblAdd.text = tempAlertDetails.alertValue ?  tempAlertDetails.alertValue : "Add";

          if(tempAlertDetails.alertCondition && tempAlertDetails.alertValue && tempAlertDetails.alertCondition!=="Select Condition" && tempAlertDetails.alertValue!=="" ) {
            CommonUtilities.enableButton(this.view.btnSet);
            this.view.btnSet.skin = BTN_ENABLE_SKIN;
            this.view.btnSet.focusSkin = BTN_ENABLE_SKIN;
          }
        } else {
          //alert to be set for the frst time Or values temporarily available not set fully
          this.view.lblSelectCondition.text = "Select Condition";
          this.view.lblAdd.text = "Add";
          CommonUtilities.disableButton(this.view.btnSet);
          this.view.btnSet.skin = BTN_DISABLE_SKIN;
          this.view.btnSet.focusSkin = BTN_DISABLE_SKIN;
        }
      }

      this.view.lblAdd.text = (this.view.lblAdd.text=== "Add") ? "Add" : (currencySymbol + " " + this.view.lblAdd.text);
    },

    saveAlert: function(){

      var alertDetails = {};
      alertDetails.alertCondition = this.view.lblSelectCondition.text;
      alertDetails.alertValue = this.view.lblAdd.text.slice(2);
      scope_WealthPresentationController.instruList[instrumentISIN]  = alertDetails;

      //Show pop up : successfully set price alert
      this.view.lblAlert.text = MSG_ALERT_SUCCESS;
      this.view.flxConfirmationContainer.setVisibility(false);
      this.view.flxConfAlt.setVisibility(false);
      this.view.flxPopupParent.setVisibility(true);
      this.view.flxPopup.setVisibility(true);

      scope_WealthPresentationController.tempAlert = undefined;

    },

    updateAlert: function() {

      var alertDetails = {};
      alertDetails.alertCondition = this.view.lblSelectCondition.text;
      alertDetails.alertValue = this.view.lblAdd.text.slice(2);
      scope_WealthPresentationController.instruList[instrumentISIN]  = alertDetails;

      //Show pop up : successfully updated the price alert
      this.view.lblAlert.text = MSG_ALERT_UPDATE_SUCCESS;
      this.view.flxConfirmationContainer.setVisibility(false);
      this.view.flxConfAlt.setVisibility(false);
      this.view.flxPopupParent.setVisibility(true);
      this.view.flxPopup.setVisibility(true);

      scope_WealthPresentationController.tempAlert=undefined;
    },

    showAlertRemoveConfirmation: function(){

      this.view.flxPopupParent.setVisibility(true);
      this.view.flxConfAlt.setVisibility(false);
      this.view.flxPopup.setVisibility(false);
      this.view.flxConfirmationContainer.setVisibility(true);

      this.view.lblMsg.text = 'Are you sure you want to Cancel "' + slctdInstDet.response.instrumentName + '" Instrument?';
    },

    navigateToWatchList: function() {
      scope_WealthPresentationController.tempAlert=undefined;
      var navMan = applicationManager.getNavigationManager();
      navMan.navigateTo('frmWatchlist');
    },

    openalertCondition: function() {
      this.navToSetValue(1);
    },
    openAlertValue: function() {
      this.navToSetValue(3);
      //this.navToSetValue(2);
    },

    navToSetValue:function(cardNumber) {

      var reqValues = {
        "alertCondition" :  this.view.lblSelectCondition.text,
        "alertValue" : (this.view.lblAdd.text=== "Add") ? "" : this.view.lblAdd.text,
        "currencySymbol" : currencySymbol,
        "cardNumber" : cardNumber
      };
      var navManager = applicationManager.getNavigationManager();
      wtchLstRsp = navManager.setCustomInfo('tempAlertDetails', reqValues);
      navManager.navigateTo('frmSetPriceValue');
    },
    closePopup: function() {
      this.view.flxPopupParent.setVisibility(false);
    }
  };
});