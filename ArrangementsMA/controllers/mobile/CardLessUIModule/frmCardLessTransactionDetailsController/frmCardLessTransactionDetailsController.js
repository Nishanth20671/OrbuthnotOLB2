define({
  hasWithdrawCashFeature: false,
  init : function(){
    var navManager =applicationManager.getNavigationManager();
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
  },
  onNavigate:function(obj)
  {
    var MenuHandler = applicationManager.getMenuHandler();
    var navMan=applicationManager.getNavigationManager();
    var transactionData =navMan.getCustomInfo("frmCardLessTransactionDetails");
    var deviceUtilManager =applicationManager.getDeviceUtilManager();
    var isIphone = deviceUtilManager.isIPhone();
    var configManager = applicationManager.getConfigurationManager();
    this.hasWithdrawCashFeature = configManager.checkUserPermission("WITHDRAW_CASH_CARDLESS_CASH");
    var isBusinessUser = configManager.isCombinedUser === "true" || configManager.isSMEUser === "true";
    this.view.flxHamburger.setVisibility(false);
    if(transactionData.isScheduled!==undefined && transactionData.isScheduled!== null && transactionData.isScheduled=== "true")
    {
      this.view.customHeader.btnRight.setVisibility(true);
      this.view.customHeader.btnRight.onClick = this.btnEditOnClick;
      if (isIphone)
      {
        var rightBarButtonItem = new kony.ui.BarButtonItem({
          type: constants.BAR_BUTTON_TITLE,
          style: constants.BAR_ITEM_STYLE_PLAIN,
          enabled: true,
          action: this.btnEditOnClick,
          tintColor: "FFFFFF00",
          metaData: {
            title: "Edit"
          }
        });
        this.view.setRightBarButtonItems({items:[rightBarButtonItem],animated:true});
      }
    }
    else {
      this.view.customHeader.btnRight.setVisibility(false);
      if (isIphone)
      {
        var rightBarButtonItem = new kony.ui.BarButtonItem({
          type: constants.BAR_BUTTON_TITLE,
          style: constants.BAR_ITEM_STYLE_PLAIN,
          enabled: true,
          action: {},
          tintColor: "FFFFFF00",
          metaData: {
            title: ""
          }
        });
        this.view.setRightBarButtonItems({items:[rightBarButtonItem],animated:true});
      }
    }

    
    if(transactionData.transactionType==="CheckWithdrawal")
    {
      if(transactionData.statusDescription === "Pending")
        this.renderViewForCheckWithdrawl('pending');
      else
        this.renderViewForCheckWithdrawl();
      this.bindDataForCheckWithdrawl(transactionData);
    }
    if(transactionData.transactionType==="Deposit")
    {
      if(transactionData.statusDescription === "Pending")
        this.renderViewForCheckDeposit('pending');
      else
        this.renderViewForCheckDeposit();
      this.bindDataForCheckDeposit(transactionData);
    }
    if(transactionData.transactionType==="Cardless")
    {
      if(transactionData.cashWithdrawalTransactionStatus  === "pending")
        this.renderViewForCashWithdrawal('pending');
      else
        this.renderViewForCashWithdrawal();
      this.bindDataForCashWithdrawl(transactionData);
      //this.bindDataForQRCashWithdrawl(transactionData);
    }

    if(transactionData.transactionType==="Interest" || transactionData.transactionType==="Tax" || transactionData.transactionType==="POS" || transactionData.transactionType==="InternetTransaction" || transactionData.transactionType==="CardPayment" || transactionData.transactionType==="Fee" || transactionData.transactionType==="Credit" || transactionData.transactionType==="Wire" || transactionData.transactionType==="Others")
    {
      this.renderViewForNewTranscationsTypes();
      this.bindDataForNewTranscations(transactionData);
    }
    var navManager =applicationManager.getNavigationManager();
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().logFormName(currentForm);
    var Mod = navManager.getEntryPoint("frmCardLessTransactionDetails");
    var scope = this;

    if(Mod === "Accounts"|| Mod === "AdvanceSearch")
      MenuHandler.setUpHamburgerForForm(scope,configManager.constants.MENUACCOUNTS);
    else if(Mod === "Transfers" || Mod === "ManageTransferRecipient")
      MenuHandler.setUpHamburgerForForm(scope,configManager.constants.MENUTRANSFERS);
    else if(Mod === "Deposits")
      MenuHandler.setUpHamburgerForForm(scope,configManager.constants.MENUCHECKDEPOSIT);
    else if(Mod === "CardLess")
      MenuHandler.setUpHamburgerForForm(scope,configManager.constants.MENUCARDLESS);
    this.view.flxButtonsTrans.forceLayout();
    this.view.customHeader.imgBack.src = "backbutton.png";
    applicationManager.getPresentationUtility().dismissLoadingScreen();
  },
  setupNavBarSkinForiPhone : function () {
    if (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone") return;
    try{
      var titleBarAttributes = this.view.titleBarAttributes;
      titleBarAttributes["tintColor"] = "003e7500";
      titleBarAttributes["translucent"] = false;
      this.view.titleBarAttributes = titleBarAttributes;
    }
    catch(er){
    }
  },

  bindDataForTransfer:function(transactionData)
  {
    var transactionObj = applicationManager.getTransactionManager();
    var frequencyTypes= transactionObj.getAvailableFrequencyType();
    var formatUtil = applicationManager.getFormatUtilManager();
    this.view.lblTransferValue.text = transactionData.amount;
    var name = "";
    if(transactionData.transactionType==="InternalTransfer"){
      if (transactionData.toNickName === null || transactionData.toNickName === undefined) {
        name = transactionData.toAccountName;
      } else {
        name = transactionData.toNickName;
      }
      this.view.lblTransferredToValueTrans.text = applicationManager.getPresentationUtility().formatText(name, 10, transactionData.toAccountNumber, 4);
    }
    else{
      this.view.lblTransferredToValueTrans.text = transactionData.toAccountName;
    }
    if (transactionData.fromNickName === null || transactionData.fromNickName === undefined) {
      name = transactionData.fromAccountName;
    } else {
      name = transactionData.fromNickName;
    }
    this.view.lblTransferredFromValueTrans.text = applicationManager.getPresentationUtility().formatText(name, 10, transactionData.fromAccountNumber, 4);
    if(transactionData.toAccountType)
      this.view.lblAccTypeTrans.text = transactionData.toAccountType;
    else
      this.view.lblAccTypeTrans.text = "";
    this.view.lblAccTypeFromTrans.text = transactionData.fromAccountType;
    this.view.lblDescValueTrans.text = transactionData.description;
    this.view.lblTransDateValueTrans.text=transactionData.scheduledDate;
    this.view.lblFreqTransValue.text = transactionData.frequencyType;
    if(transactionData.recurrenceDesc!==undefined && transactionData.recurrenceDesc!== null  && transactionData.recurrenceDesc!=="0")
    {
      this.view.lblRecurrenceValueTrans.text = transactionData.recurrenceDesc;
      this.view.flxRecurrenceTrans.setVisibility(true);
    }
    else
      this.view.flxRecurrenceTrans.setVisibility(false);
    if(transactionData.isScheduled === "true" && transactionData.frequencyType!==frequencyTypes.ONCE)
    {
      this.view.btnCancelThisOccurenceTrans.setVisibility(true);
      this.view.btnCancelSeriesTrans.setVisibility(true);
      this.view.btnCancelTransactionTrans.setVisibility(false);
    }
    else
    {
      this.view.btnCancelThisOccurenceTrans.setVisibility(false);
      this.view.btnCancelSeriesTrans.setVisibility(false);
    }
    if(kony.sdk.isNullOrUndefined(transactionData.IBAN)){
      this.view.flxIBAN.setVisibility(false);
    }
    else{
      this.view.lblIBANValue.text = formatUtil.formatIBAN(transactionData.IBAN);
      this.view.flxIBAN.setVisibility(true);
    }
    if(kony.sdk.isNullOrUndefined(transactionData.transactionCurrency)){
      this.view.flxCurrencyTransfer.setVisibility(false);
    }
    else{
      this.view.lblCurrencyValueTransfer.text = transactionData.transactionCurrency;
      this.view.flxCurrencyTransfer.setVisibility(true);
    }
    if(kony.sdk.isNullOrUndefined(transactionData.convertedAmount)){
      this.view.flxConvertedAmount.setVisibility(false);
    }
    else{
      this.view.lblConvertedValue.text = transactionData.convertedAmount;
      this.view.flxConvertedAmount.setVisibility(true);
    }
    if(kony.sdk.isNullOrUndefined(transactionData.feeCurrency) || kony.sdk.isNullOrUndefined(transactionData.fee)){
      this.view.flxTransactionFeeTransfer.setVisibility(false);
    }
    else{
      if(!kony.sdk.isNullOrUndefined(transactionData.fee)&&Number(transactionData.fee)>0){
        this.view.lblTransactionFeeValueTransfer.text = formatUtil.formatAmountandAppendCurrencySymbol(transactionData.fee,transactionData.feeCurrency);
        this.view.flxTransactionFeeTransfer.setVisibility(true);
      }
      else
        this.view.flxTransactionFeeTransfer.setVisibility(false);
    }
    this.view.lblReferenceNoValueTrans.text = transactionData.transactionId;
    this.view.lblNotesValueTrans.text = transactionData.transactionsNotes;
    this.view.btnRepeatTransactionTrans.onClick = this.repeatTrans;
    this.view.btnCancelTransactionTrans.onClick = this.cancelTransactionTrans;
    this.view.btnCancelThisOccurenceTrans.onClick = this.cancelRecurrenceTrans;
    this.view.btnCancelSeriesTrans.onClick = this.cancelSerieTrans;
  },
  cancelSerieTrans:function()
  {
    var basicConfig={
      "alertType": constants.ALERT_TYPE_CONFIRMATION,
      "message": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.cancelSeries"),
      "yesLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertYes"),
      "noLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertNo"),
      //  "message": "Do you wish to continue?",
      "alertHandler": this.cancelTrans
    };
    applicationManager.getPresentationUtility().showAlertMessage(basicConfig,{});
  },
  cancelTransactionTrans:function()
  {
    var basicConfig={
      "alertType": constants.ALERT_TYPE_CONFIRMATION,
      "message": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.AreyousuredoyouwanttocancelTransaction?"),
      "yesLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertYes"),
      "noLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertNo"),
      //  "message": "Do you wish to continue?",
      "alertHandler": this.cancelTrans
    };
    applicationManager.getPresentationUtility().showAlertMessage(basicConfig,{});
  },
  cancelTrans:function(response)
  {
    if(response===true)
    {
      applicationManager.getPresentationUtility().showLoadingScreen();
      var navMan=applicationManager.getNavigationManager();
      var transactionData =navMan.getCustomInfo("frmCardLessTransactionDetails");
      var transModPresentationController = applicationManager.getModulesPresentationController("TransferModule");
      var transMode=   transModPresentationController.getTypeByAction(transactionData.serviceName);
      transModPresentationController.transactionMode=transMode;
      transModPresentationController.deleteTransaction(transactionData);
    }
  },
  cancelRecurrenceTrans:function()
  {
    var basicConfig={
      "alertType": constants.ALERT_TYPE_CONFIRMATION,
      "yesLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertYes"),
      "noLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertNo"),
      "message": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.cancelOccurence"),
      "alertHandler": this.cancelRecTrans
    };
    applicationManager.getPresentationUtility().showAlertMessage(basicConfig,{});
  },
  cancelRecTrans:function(response)
  {
    if(response===true)
    {
      applicationManager.getPresentationUtility().showLoadingScreen();
      var navMan=applicationManager.getNavigationManager();
      var transactionData =navMan.getCustomInfo("frmCardLessTransactionDetails");
      var transModPresentationController = applicationManager.getModulesPresentationController("TransferModule");
      var transMode=   transModPresentationController.getTypeByAction(transactionData.serviceName);
      transModPresentationController.transactionMode=transMode;
      transModPresentationController.deleteRecurrenceTransaction(transactionData);
    }
  },
  repeatTrans:function()
  {
    var navMan=applicationManager.getNavigationManager();
    var transactionData =navMan.getCustomInfo("frmCardLessTransactionDetails");
    var transModPresentationController = applicationManager.getModulesPresentationController("TransferModule");
    transModPresentationController.repeatTransfer(transactionData);
  },
  bindDataForNewTranscations:function(transactionData)
  {
    var self =this;
    this.view.lblAddedTransactionPaymentType.text = transactionData.transactionType;
    this.view.lblLoanAmountTransactionType.text = transactionData.amount;
    if(transactionData.statusDescription!==undefined && transactionData.statusDescription!== null)
      this.view.lblStatus.text = (transactionData.statusDescription).charAt(0).toUpperCase()+ (transactionData.statusDescription).slice(1);
    this.view.lblDescValueTransactionType.text = transactionData.description;
    this.view.lblTransTyptDateValue.text=transactionData.scheduledDate;
    this.view.lblReferenceNoValueTransactionType.text = transactionData.transactionId;
    this.view.lblTransactionTypeNotesValue.text = transactionData.transactionsNotes;
    this.view.lblTransactionTypeMAinValue.text = transactionData.transactionType;
  },
  bindDataForCheckDeposit:function(transactionData)
  {
    var self =this;
    this.view.lblCheckDepositValue.text = transactionData.amount;
    if(transactionData.statusDescription!==undefined && transactionData.statusDescription!== null)
      this.view.lblSuccessfulCD.text = (transactionData.statusDescription).charAt(0).toUpperCase()+ (transactionData.statusDescription).slice(1);
    this.view.lblCheckNumberValue.text = transactionData.checkNumber;
    this.view.lblDepositToValue.text = transactionData.toAccountName;
    this.view.lblDescValueCD.text = transactionData.description;
    this.view.lblDepositDateValue.text=transactionData.scheduledDate;
    this.view.lblRefNoValue.text = transactionData.transactionId;
    var notes = "";
    if (transactionData.hasOwnProperty("transactionsNotes")) {
      notes =  transactionData.transactionsNotes;
    }
    else {
      notes = "-";
    }
    this.view.lblCDNotes.text = notes;
    var data =
        [
          {
            lblFront:applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.checkDeposit.front"),
            lblBack:applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.checkDeposit.back"),
            imgFront:{
              "src":"checksmall.png",
              "onTouchEnd":this.imgFrontOnTouchEnd.bind(self,{})
            },
            imgBack:{
              "src":"checksmall.png",
              "onTouchEnd":this.imgBackOnTouchEnd.bind(self,{})
            }
          }
        ];
    this.view.segCheckImages.setData(data);
    if(data.length > 1)
    {
      this.view.segCheckImages.needPageIndicator = true;
    }else{
      this.view.segCheckImages.needPageIndicator = false;
    }
    this.view.forceLayout();
  },
  bindDataForCheckWithdrawl:function(transactionData)
  {
    var self =this;
    this.view.lblCheckDeposit.text = transactionData.transactionType;
    this.view.lblCheckDepositValue.text = transactionData.amount;
    if(transactionData.statusDescription!==undefined && transactionData.statusDescription!== null)
      this.view.lblSuccessfulCD.text = (transactionData.statusDescription).charAt(0).toUpperCase()+ (transactionData.statusDescription).slice(1);
    this.view.lblCheckNumberValue.text = transactionData.checkNumber;
    this.view.lblDepositToValue.text = transactionData.toAccountName;
    this.view.lblDescValueCD.text = transactionData.description;
    this.view.lblDepositDateValue.text=transactionData.scheduledDate;
    this.view.lblRefNoValue.text = transactionData.transactionId;
    var notes = "";
    if (transactionData.hasOwnProperty("transactionsNotes")) {
      notes =  transactionData.transactionsNotes;
    }
    else {
      notes = "-";
    }
    this.view.lblCDNotes.text = notes;
    var data =
        [
          {
            lblFront:applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.checkDeposit.front"),
            lblBack:applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.checkDeposit.back"),
            imgFront:{
              "src":"checksmall.png",
              "onTouchEnd":this.imgFrontOnTouchEnd.bind(self,{})
            },
            imgBack:{
              "src":"checksmall.png",
              "onTouchEnd":this.imgBackOnTouchEnd.bind(self,{})
            }
          },
          {
            lblFront:applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.checkDeposit.front"),
            lblBack:applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.checkDeposit.back"),
            imgFront:{
              "src":"checksmall.png",
              "onTouchEnd":this.imgFront1onTouchEnd.bind(self,{})
            },
            imgBack:{
              "src":"checksmall.png",
              "onTouchEnd":this.imgBack1onTouchEnd.bind(self,{})
            }
          }
        ];
    this.view.segCheckImages.setData(data);
    if(data.length > 1)
    {
      this.view.segCheckImages.needPageIndicator = true;
    }else{
      this.view.segCheckImages.needPageIndicator = true;
    }
    this.view.forceLayout();
  },
  bindDataForCashWithdrawl:function(transactionData)
  {
    try{
      var navManager = applicationManager.getNavigationManager();
      var custominfoInt = navManager.getCustomInfo("frmDashboard");
      var accounts = custominfoInt.accountData;
      var configurationManager = applicationManager.getConfigurationManager();
      if(transactionData.cashlessMode == "Self")
        this.view.flxShareWithdrawCode.setVisibility(false);
      else{
        this.view.flxShareWithdrawCode.setVisibility(true);
        this.view.flxMsg.onClick=this.showMsg;
        this.view.flxMail.onClick=this.showMail;
      }
      if(transactionData.cashWithdrawalTransactionStatus == "pending")
      {
        this.view.btnFindNearByAtm.onClick=this.findNearByATM;
        this.view.lblCashWithdrawalCodeVal.text =transactionData.cashlessOTP;
        this.view.lblExpiresIn.text = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.cardLess.ExpiresIn")+transactionData.cashlessOTPValidDate;
      }
      this.view.lblConvertedValue.text = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.cardLess.Dollar");
      this.view.lblCurrencyValueTransfer.text = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.cardLess.Dollar");
      this.view.lblCurrencyValue.text = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.cardLess.Dollar");
      this.view.lblAccTypeCW.text = transactionData.fromAccountType;
      this.view.lblCash.text = transactionData.amount;
      this.view.lblSuccessfulCW.text = (transactionData.cashWithdrawalTransactionStatus).charAt(0).toUpperCase() + (transactionData.cashWithdrawalTransactionStatus).slice(1);
      this.view.lblFromValue.text = transactionData.fromAccountName;
      this.view.lblDescValueCW.text = transactionData.description;
      this.view.lblDateValue.text=transactionData.scheduledDate;
      this.view.lblRefNoCWValue.text = transactionData.transactionId;
      this.view.lblNotesValueCW.text = transactionData.transactionsNotes;
      this.view.btnCancelTransactionCW.onClick=this.cancelTransactionCW;

      if( configurationManager.isCombinedUser === "true"){
        var obj = {};
        if(accounts.length > 0 ){
          var obj = accounts.find(o => o.accountID === transactionData.fromAccountNumber);
          this.view.imgBankType.isVisible = true;
          this.view.lblFromValue.left ="45dp";
          if( obj.isBusinessAccount === "true"){
            this.view.imgBankType.src = "businessaccount.png";
          }else{
            this.view.imgBankType.src = "personalaccount.png";
          }
        }else {
          this.view.imgBankType.isVisible = false;
          this.view.lblFromValue.left ="20dp";
        }
      }else {
        this.view.imgBankType.isVisible = false;
        this.view.lblFromValue.left ="20dp";
      }
    }catch(e){
      kony.print("Exception in e"+e);
    }
  },
  bindDataForQRCashWithdrawl:function(transactionData)
  {
    this.view.flxShareWithdrawCode.setVisibility(false);
    this.view.lblCashWithdrawalCodeVal.setVisibility(false);
    this.view.flxCashWithdrawal.flxCashWithdrawCode.flxQRCode.setVisibility(true);
    this.view.flxCashWithdrawal.flxCashWithdrawCode.flxQRCode.onClick = this.qrOnClick;
    if(transactionData.cashWithdrawalTransactionStatus == "pending")
    {
      this.view.lblExpiresIn.text = applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.cardLess.ExpiresIn")+transactionData.cashlessOTPValidDate;
      this.view.btnFindNearByAtm.onClick=this.findNearByATM;
    }
    this.view.lblAccTypeCW.text = transactionData.fromAccountType;
    this.view.lblCash.text = transactionData.amount;
    this.view.lblSuccessfulCW.text = (transactionData.cashWithdrawalTransactionStatus).charAt(0).toUpperCase()+ (transactionData.cashWithdrawalTransactionStatus).slice(1);
    this.view.lblFromValue.text = transactionData.fromAccountName;
    this.view.lblDescValueCW.text = transactionData.description;
    this.view.lblDateValue.text=transactionData.scheduledDate;
    this.view.lblRefNoCWValue.text = transactionData.transactionId;
    this.view.lblNotesValueCW.text = transactionData.transactionsNotes;
    this.view.btnCancelTransactionCW.onClick=this.cancelTransactionCW;
  },
  qrOnClick:function(){
    var cardLessModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("CardLessUIModule");
    cardLessModule.presentationController.invokeQRCodeFunctionality();
  },
  findNearByATM:function(){
    var scope=this;
    var locateUsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
      "moduleName": "LocateUsUIModule",
      "appName": "AboutUsMA"
    });
    locateUsModule.presentationController.presentLocateUsView(true,scope);
  },
  cancelTransactionCW:function()
  {
    var basicConfig={
      "alertType": constants.ALERT_TYPE_CONFIRMATION,
      "yesLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertYes"),
      "noLabel": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.common.AlertNo"),
      "message": applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.AreyousuredoyouwanttocancelTransaction?"),
      "alertHandler": this.cardlessCancel
    };
    applicationManager.getPresentationUtility().showAlertMessage(basicConfig,{});
  },
  // Cancel Cardless transactions
  cardlessCancel:function(response){
    if(response===true)
    {
      var navMan=applicationManager.getNavigationManager();
      var transactionData =navMan.getCustomInfo("frmCardLessTransactionDetails");
      var record={};
      record.transactionId=transactionData.transactionId;
      record.fromAccountNumber=  transactionData.fromAccountNumber;
      record.transactionType = "Cardless";
      var cLMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName": "ArrangementsMA", "moduleName": "CardLessUIModule"});
      cLMod.presentationController.deleteCardlessTransaction(record);
    }
  },

  renderViewForNewTranscationsTypes:function()
  {
    this.view.flxAddedTransactionTypes.setVisibility(true);
    this.view.flxAddedTransactionTypes.setContentOffset({x:0,y:0});
    this.view.flxCashWithdrawal.setVisibility(false);
    this.view.flxBillPay.setVisibility(false);
    this.view.flxCheckDeposit.setVisibility(false);
    this.view.flxTransfers.setVisibility(false);
    this.view.flxP2P.setVisibility(false);
    this.view.flxLoans.setVisibility(false);
    this.view.flxWireTransfer.setVisibility(false);
    this.view.forceLayout();
  },
  renderViewForWireTransfer:function(viewMode)
  {
    if(viewMode==='pending')
    {
      this.view.btnCancelTransaction.setVisibility(true);
      this.view.btnDisputetTransaction.setVisibility(false);
      this.view.btnRepeatTransaction.setVisibility(false);
      this.view.flxWireTransfer.forceLayout();
    }
    else
    {
      this.view.btnCancelTransaction.setVisibility(false);
      this.view.btnDisputetTransaction.setVisibility(true);
      this.view.btnRepeatTransaction.setVisibility(true);
      this.view.flxWireTransfer.forceLayout();
    }
    this.view.flxWireTransfer.setVisibility(true);
    this.view.flxWireTransfer.setContentOffset({x:0,y:0});
    this.view.flxCashWithdrawal.setVisibility(false);
    this.view.flxBillPay.setVisibility(false);
    this.view.flxCheckDeposit.setVisibility(false);
    this.view.flxTransfers.setVisibility(false);
    this.view.flxP2P.setVisibility(false);
    this.view.flxLoans.setVisibility(false);
    this.view.flxAddedTransactionTypes.setVisibility(false);
  },
  renderViewForCashWithdrawal:function(viewMode)
  {
    if(viewMode === "pending")
    {
      this.view.flxCashWithdrawCode.setVisibility(true);
      this.view.btnCancelTransactionCW.setVisibility(this.hasWithdrawCashFeature);
      this.view.btnSeeWithdrawCash.onClick = function(){kony.application.openURL("https://youtu.be/UGJMk5_ZNrk");};
    }
    else
    {
      this.view.btnCancelTransactionCW.setVisibility(false);
      this.view.flxCashWithdrawCode.setVisibility(false);
    }
    this.view.customHeader.btnRight.setVisibility(false);
    this.view.flxWireTransfer.setVisibility(false);
    this.view.flxCashWithdrawal.setVisibility(true);
    this.view.flxMainCashWithdraw.setContentOffset({x:0,y:0});
    this.view.flxBillPay.setVisibility(false);
    this.view.flxCheckDeposit.setVisibility(false);
    this.view.flxTransfers.setVisibility(false);
    this.view.flxP2P.setVisibility(false);
    this.view.flxLoans.setVisibility(false);
    this.view.flxAddedTransactionTypes.setVisibility(false);
    this.view.forceLayout();
  },
  renderViewForBillPay:function(viewMode)
  {
    var navManager = applicationManager.getNavigationManager();
    var Mod = navManager.getEntryPoint("frmCardLessTransactionDetails");
    if(viewMode==='pending')
    {
      this.view.btnRepeatTransBP.setVisibility(false);
      this.view.btnDisputetTransBP.setVisibility(false);
      this.view.btnCancelTransactionBP.setVisibility(false);
      this.view.flxBillPay.forceLayout();
    }
    else if(viewMode==='pending1')
    {
      this.view.btnRepeatTransBP.setVisibility(false);
      this.view.btnDisputetTransBP.setVisibility(false);
      this.view.btnCancelTransactionBP.setVisibility(false);
      this.view.flxBillPay.forceLayout();
    }
    else{
      this.view.btnRepeatTransBP.setVisibility(true);
      if(Mod === "Accounts")
        this.view.btnDisputetTransBP.setVisibility(true);
      else
        this.view.btnDisputetTransBP.setVisibility(false);
      this.view.btnCancelTransactionBP.setVisibility(false);
      this.view.flxBillPay.forceLayout();
    }
    this.view.flxWireTransfer.setVisibility(false);
    this.view.flxCashWithdrawal.setVisibility(false);
    this.view.flxBillPay.setVisibility(true);
    this.view.flxBillPay.setContentOffset({x:0,y:0});
    this.view.flxCheckDeposit.setVisibility(false);
    this.view.flxTransfers.setVisibility(false);
    this.view.flxP2P.setVisibility(false);
    this.view.flxLoans.setVisibility(false);
    this.view.flxAddedTransactionTypes.setVisibility(false);
    this.view.forceLayout();
  },
  renderViewForCheckDeposit:function(viewMode)
  {
    //     cancel and dispute transaction in not implemented
    this.view.btnCancelTransactionCD.setVisibility(false);
    this.view.btnDisputetCD.setVisibility(false);
    this.view.flxCheckDeposit.forceLayout();
    //     if(viewMode==='pending')
    //       {
    //        this.view.btnCancelTransactionCD.setVisibility(true);
    //        this.view.btnDisputetCD.setVisibility(false);
    //        this.view.flxCheckDeposit.forceLayout();
    //       }
    //     else
    //       {
    //        this.view.btnCancelTransactionCD.setVisibility(false);
    //        this.view.btnDisputetCD.setVisibility(true);
    //        this.view.flxCheckDeposit.forceLayout();
    //       }
    this.view.flxWireTransfer.setVisibility(false);
    this.view.flxCashWithdrawal.setVisibility(false);
    this.view.flxBillPay.setVisibility(false);
    this.view.flxCheckDeposit.setVisibility(true);
    this.view.flxCheckDeposit.setEnabled(true);
    this.view.flxCheckDeposit.enableScrolling=true;
    this.view.flxCheckDeposit.setContentOffset({x:0,y:0});
    this.view.flxTransfers.setVisibility(false);
    this.view.flxP2P.setVisibility(false);
    this.view.flxLoans.setVisibility(false);
    this.view.flxAddedTransactionTypes.setVisibility(false);
    this.view.flxCheckZoomView.setVisibility(false);
    this.view.forceLayout();
  },
  renderViewForCheckWithdrawl:function(viewMode)
  {
    //     cancel and dispute transaction in not implemented
    this.view.btnCancelTransactionCD.setVisibility(false);
    this.view.btnDisputetCD.setVisibility(false);
    this.view.flxCheckDeposit.forceLayout();
    //     if(viewMode==='pending')
    //       {
    //        this.view.btnCancelTransactionCD.setVisibility(true);
    //        this.view.btnDisputetCD.setVisibility(false);
    //        this.view.flxCheckDeposit.forceLayout();
    //       }
    //     else
    //       {
    //        this.view.btnCancelTransactionCD.setVisibility(false);
    //        this.view.btnDisputetCD.setVisibility(true);
    //        this.view.flxCheckDeposit.forceLayout();
    //       }
    this.view.flxWireTransfer.setVisibility(false);
    this.view.flxCashWithdrawal.setVisibility(false);
    this.view.flxBillPay.setVisibility(false);
    this.view.flxCheckDeposit.setVisibility(true);
    this.view.flxCheckDeposit.setContentOffset({x:0,y:0});
    this.view.flxTransfers.setVisibility(false);
    this.view.flxP2P.setVisibility(false);
    this.view.flxLoans.setVisibility(false);
    this.view.flxAddedTransactionTypes.setVisibility(false);
    this.view.forceLayout();
  },
  registerActions:function(){
    this.view.segCheckImages["widgetSkin"] = "sknSegffffff";
    this.view.segCheckImages.pageSkin = "sknManageCardsPage";
    //this.view.flxFrontImg.onClick= this.imgFrontOnTouchEnd;
    //this.view.flxBackImg.onClick= this.imgBackOnTouchEnd;
    this.view.flxCross.onClick=this.flxCrossOnClick;
    this.view.customHeader.flxBack.onClick=function()
    {
      var navMan=applicationManager.getNavigationManager();
      navMan.goBack();
    };
    if(applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone"){
      this.view.flxHeader.isVisible = true;
      this.view.flxFooter.isVisible=false;
    }
    else{
      this.view.flxHeader.isVisible = false;
      this.view.flxFooter.isVisible=true;
    }
    this.flxCrossOnClick();
    this.view.flxButtonsTrans.forceLayout();
    this.setupNavBarSkinForiPhone();
  },
  imgFrontOnTouchEnd:function(data){
    var navMan=applicationManager.getNavigationManager();
    var transactionData =navMan.getCustomInfo("frmCardLessTransactionDetails");
    if(transactionData.transactionType==="CheckWithdrawal"){
      this.view.imgCheckZoom.src = transactionData.frontImage1;
    }else{
      this.view.imgCheckZoom.src = transactionData.checkImage;
    }
    this.view.flxCheckZoomView.setVisibility(true);
    this.view.flxHeader.setEnabled(false);
    this.view.flxCheckDeposit.setEnabled(false);
    this.view.flxCheckDeposit.enableScrolling=false;
    this.setGesture();
    //this.view.flxFooter.setEnabled(false);
    this.view.forceLayout();
  },
  imgBackOnTouchEnd:function(){
    var navMan=applicationManager.getNavigationManager();
    var transactionData =navMan.getCustomInfo("frmCardLessTransactionDetails");
    if(transactionData.transactionType==="CheckWithdrawal"){
      this.view.imgCheckZoom.src = transactionData.backImage1;
    }else{
      this.view.imgCheckZoom.src = transactionData.checkImageBack;
    }
    this.view.flxCheckZoomView.setVisibility(true);
    this.view.flxHeader.setEnabled(false);
    this.view.flxCheckDeposit.setEnabled(false);
    this.view.flxCheckDeposit.enableScrolling=false;
    this.setGesture();
    //this.view.flxFooter.setEnabled(false);
    this.view.forceLayout();
  },
  imgFront1onTouchEnd:function(data){
    var navMan=applicationManager.getNavigationManager();
    var transactionData =navMan.getCustomInfo("frmCardLessTransactionDetails");
    this.view.imgCheckZoom.src = transactionData.frontImage2;
    this.view.flxCheckZoomView.setVisibility(true);
    this.view.flxHeader.setEnabled(false);
    this.view.flxCheckDeposit.setEnabled(false);
    this.view.flxCheckDeposit.enableScrolling=false;
    this.setGesture();
    //this.view.flxFooter.setEnabled(false);
    this.view.forceLayout();
  },
  imgBack1onTouchEnd:function(){
    var navMan=applicationManager.getNavigationManager();
    var transactionData =navMan.getCustomInfo("frmCardLessTransactionDetails");
    this.view.imgCheckZoom.src = transactionData.backImage2;
    this.view.flxCheckZoomView.setVisibility(true);
    this.view.flxHeader.setEnabled(false);
    this.view.flxCheckDeposit.setEnabled(false);
    this.view.flxCheckDeposit.enableScrolling=false;
    this.setGesture();
    //this.view.flxFooter.setEnabled(false);
    this.view.forceLayout();
  },
  setGesture : function(){
    var self = this;
    this.view.flxCheckZoomView.addGestureRecognizer(constants.GESTURE_TYPE_SWIPE, {
      fingers: 1
    }, function(widgetRef, gestureInfo, context) {
      var navMan=applicationManager.getNavigationManager();
      var transactionData =navMan.getCustomInfo("frmCardLessTransactionDetails");
      if(gestureInfo.swipeDirection === 1.0){
        self.view.imgCheckZoom.src =  transactionData.checkImageBack;
      }
      else if(gestureInfo.swipeDirection === 2.0){
        self.view.imgCheckZoom.src =  transactionData.checkImage;
      }
    });
  },
  flxCrossOnClick:function(){
    this.view.flxCheckZoomView.setVisibility(false);
    this.view.flxHeader.setEnabled(true);
    this.view.flxCheckDeposit.setEnabled(true);
    this.view.flxCheckDeposit.enableScrolling=true;
    //this.view.flxFooter.setEnabled(true);
    this.view.forceLayout();
  },
  renderViewForTransfer:function(viewMode)
  {
    var navManager = applicationManager.getNavigationManager();
    if(viewMode==='pending')
    {
      this.view.btnCancelTransactionTrans.setVisibility(true);
      this.view.btnDisputetTransactionTrans.setVisibility(false);
      this.view.btnRepeatTransactionTrans.setVisibility(false);
    }
    else if(viewMode==='pending1')
    {
      this.view.btnCancelTransactionTrans.setVisibility(false);
      this.view.btnDisputetTransactionTrans.setVisibility(false);
      this.view.btnRepeatTransactionTrans.setVisibility(false);
    }
    else
    {
      var Mod = navManager.getEntryPoint("frmCardLessTransactionDetails");
      this.view.btnCancelTransactionTrans.setVisibility(false);
      if(Mod === "Accounts")
        this.view.btnDisputetTransactionTrans.setVisibility(true);
      else
        this.view.btnDisputetTransactionTrans.setVisibility(false);
      this.view.btnRepeatTransactionTrans.setVisibility(true);
    }
    this.view.flxWireTransfer.setVisibility(false);
    this.view.flxCashWithdrawal.setVisibility(false);
    this.view.flxBillPay.setVisibility(false);
    this.view.flxCheckDeposit.setVisibility(false);
    this.view.flxTransfers.setVisibility(true);
    this.view.flxTransfers.setContentOffset({x:0,y:0});
    this.view.flxP2P.setVisibility(false);
    this.view.flxLoans.setVisibility(false);
    this.view.flxAddedTransactionTypes.setVisibility(false);
  },
  renderViewForP2P:function(viewMode)
  {
    if(viewMode==='pending')
    {
      this.view.btnCancelTransactionP2P.setVisibility(true);
      this.view.btnDisputetTransactionP2P.setVisibility(false);
      this.view.btnRepeatTransactionP2P.setVisibility(false);
    }
    else if(viewMode==='pending1')
    {
      this.view.btnCancelTransactionP2P.setVisibility(false);
      this.view.btnDisputetTransactionP2P.setVisibility(false);
      this.view.btnRepeatTransactionP2P.setVisibility(false);
    }
    else
    {      
      var Mod = navManager.getEntryPoint("frmCardLessTransactionDetails");
      this.view.btnCancelTransactionP2P.setVisibility(false);
      if(Mod === "Accounts")
        this.view.btnDisputetTransactionP2P.setVisibility(true);
      else
        this.view.btnDisputetTransactionP2P.setVisibility(false);
      this.view.btnRepeatTransactionP2P.setVisibility(true);
    }
    this.view.flxWireTransfer.setVisibility(false);
    this.view.flxCashWithdrawal.setVisibility(false);
    this.view.flxBillPay.setVisibility(false);
    this.view.flxCheckDeposit.setVisibility(false);
    this.view.flxTransfers.setVisibility(false);
    this.view.flxP2P.setVisibility(true);
    this.view.flxP2P.setContentOffset({x:0,y:0});
    this.view.flxLoans.setVisibility(false);
    this.view.flxAddedTransactionTypes.setVisibility(false);
  },
  renderViewForLoans:function(viewMode)
  {
    if(viewMode==='pending')
    {
      this.view.btnCancelTransactionLoans.setVisibility(false);
      this.view.btnRepeatTransactionLoans.setVisibility(false);
    }
    else if(viewMode==='pending1')
    {
      this.view.btnCancelTransactionLoans.setVisibility(false);
      this.view.btnRepeatTransactionLoans.setVisibility(false);
    }
    else
    {
      this.view.btnCancelTransactionLoans.setVisibility(false);
      this.view.btnRepeatTransactionLoans.setVisibility(false);
    }
    this.view.flxWireTransfer.setVisibility(false);
    this.view.flxCashWithdrawal.setVisibility(false);
    this.view.flxBillPay.setVisibility(false);
    this.view.flxCheckDeposit.setVisibility(false);
    this.view.flxTransfers.setVisibility(false);
    this.view.flxAddedTransactionTypes.setVisibility(false);
    this.view.flxP2P.setVisibility(false);
    this.view.flxLoans.setVisibility(true);
    this.view.flxLoans.setContentOffset({x:0,y:0});
  },
  btnEditOnClick: function()
  {
    var navMan=applicationManager.getNavigationManager();
    applicationManager.getPresentationUtility().showLoadingScreen();
    var transactionData =navMan.getCustomInfo("frmCardLessTransactionDetails");
    if(transactionData.transactionType === "P2P")
    {
      var navMan=applicationManager.getNavigationManager();
      var payeeMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("PayAPersonModule");
      payeeMod.presentationController.setTransactionObject(transactionData);
    }
    else if(transactionData.transactionType === "BillPay"){
      var navMan=applicationManager.getNavigationManager();
      var billpayMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("BillPayModule");
      billpayMod.presentationController.setTransactionObject(transactionData);
    }
    else
    {
      var navMan=applicationManager.getNavigationManager();
      var transferModulePresentationController = applicationManager.getModulesPresentationController("TransferModule");
      transferModulePresentationController.setTransactionObject(transactionData);
    }
  },
  showMsg:function()
  {
    var navMan=applicationManager.getNavigationManager();
    var cardlessTxnDetails =navMan.getCustomInfo("frmCardLessTransactionDetails");
    var userPrefObj=applicationManager.getUserPreferencesManager();
    var contact={};
    contact.email=userPrefObj.getUserEmail();
    contact.phone=userPrefObj.getUserPhone();
    if(contact.phone){
      kony.phone.sendSMS(cardlessTxnDetails.cashlessPhone,"Dear "+cardlessTxnDetails.cashlessPersonName+", You have received "+cardlessTxnDetails.amount+" from mobile "+contact.phone+". To withdraw cash, please enter the Withdrawal Code - "+cardlessTxnDetails.cashlessOTP+" and 4-digit Secure Code shared by the sender at the ATM.");
    }
    else if(contact.email){
      kony.phone.sendSMS(cardlessTxnDetails.cashlessPhone,"Dear "+cardlessTxnDetails.cashlessPersonName+", You have received "+cardlessTxnDetails.amount+" from email "+contact.email+". To withdraw cash, please enter the Withdrawal Code - "+cardlessTxnDetails.cashlessOTP+" and 4-digit Secure Code shared by the sender at the ATM.");
    }
    else{
      kony.phone.sendSMS(cardlessTxnDetails.cashlessPhone,"Dear "+cardlessTxnDetails.cashlessPersonName+", You have received "+cardlessTxnDetails.amount+". To withdraw cash, please enter the Withdrawal Code - "+cardlessTxnDetails.cashlessOTP+" and 4-digit Secure Code shared by the sender at the ATM.");
    }
  },
  bindGenericError: function (errorMsg) {
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    var scopeObj = this;
    applicationManager.getDataProcessorUtility().showToastMessageError(scopeObj, errorMsg);
  },
  showMail:function()
  {
    var navMan=applicationManager.getNavigationManager();
    var cardlessTxnDetails =navMan.getCustomInfo("frmCardLessTransactionDetails");
    var userPrefObj=applicationManager.getUserPreferencesManager();
    var contact={};
    contact.email=userPrefObj.getUserEmail();
    contact.phone=userPrefObj.getUserPhone();
    if(!(cardlessTxnDetails.cashlessEmail !== null && cardlessTxnDetails.cashlessEmail !== undefined)){
      cardlessTxnDetails.cashlessEmail = "";
    }
    if(contact.email){
      kony.phone.openEmail([cardlessTxnDetails.cashlessEmail],[],[],"Cardless Cash Withdrawal","Dear "+cardlessTxnDetails.cashlessPersonName+", You have received "+cardlessTxnDetails.amount+" from email "+contact.email+". To withdraw cash, please enter the Withdrawal Code - "+cardlessTxnDetails.cashlessOTP+" and 4-digit Secure Code shared by the sender at the ATM.");
    }
    else if(contact.phone){
      kony.phone.openEmail([cardlessTxnDetails.cashlessEmail],[],[],"Cardless Cash Withdrawal","Dear "+cardlessTxnDetails.cashlessPersonName+", You have received "+cardlessTxnDetails.amount+" from mobile "+contact.phone+". To withdraw cash, please enter the Withdrawal Code - "+cardlessTxnDetails.cashlessOTP+" and 4-digit Secure Code shared by the sender at the ATM.");
    }
    else{
      kony.phone.openEmail([cardlessTxnDetails.cashlessEmail],[],[],"Cardless Cash Withdrawal","Dear "+cardlessTxnDetails.cashlessPersonName+", You have received "+cardlessTxnDetails.amount+". To withdraw cash, please enter the Withdrawal Code - "+cardlessTxnDetails.cashlessOTP+" and 4-digit Secure Code shared by the sender at the ATM.");
    }
  }
});