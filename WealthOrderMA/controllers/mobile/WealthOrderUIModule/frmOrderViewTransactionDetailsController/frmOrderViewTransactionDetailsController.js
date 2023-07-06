define({ 

 init : function(){
    var navManager = applicationManager.getNavigationManager();
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
 
  },
  preShow:function(){
    if(applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone"){
      this.view.flxHeader.isVisible = true;
    }
    else{
      this.view.flxHeader.isVisible = false;
    }
   var navManager = applicationManager.getNavigationManager();
   var transactionDetail = navManager.getCustomInfo("frmViewTransactionDetails");
   var transDetail=transactionDetail.response;
   this.view.flxInstrument.setVisibility(false);
   var forUtility = applicationManager.getFormatUtilManager();
  var tradeDateObj=forUtility.getDateObjectfromString(transDetail.tradeDate);
  var valueDateObj=forUtility.getDateObjectfromString(transDetail.valueDate);
  var formattedTradeDate=forUtility.getFormatedDateString(tradeDateObj, forUtility.getApplicationDateFormat());
  var formattedValueDate=forUtility.getFormatedDateString(valueDateObj, forUtility.getApplicationDateFormat());
  transDetail.instrumentAmount = forUtility.deFormatAmount(transDetail.instrumentAmount);
  var formattedAmount= forUtility.formatAmountandAppendCurrencySymbol(transDetail.instrumentAmount, transDetail.referenceCurrency);
  transDetail.limitPrice = forUtility.deFormatAmount(transDetail.limitPrice);
  var formattedPriceVal = forUtility.formatAmountandAppendCurrencySymbol(transDetail.limitPrice, transDetail.instrumentCurrency);
  transDetail.netAmount = forUtility.deFormatAmount(transDetail.netAmount);
  var formattedNetAmount= forUtility.formatAmountandAppendCurrencySymbol(transDetail.netAmount, transDetail.instrumentCurrency);
  transDetail.fees = forUtility.deFormatAmount(transDetail.fees);
  var formattedfees= forUtility.formatAmountandAppendCurrencySymbol(transDetail.fees, transDetail.feesCurrency);
  transDetail.total = forUtility.deFormatAmount(transDetail.total);
  var formattedTotal= forUtility.formatAmountandAppendCurrencySymbol(transDetail.total, transDetail.referenceCurrency);
  this.view.lblTradeDateVal.text=formattedTradeDate;
  this.view.lblTypeVal.text=formattedValueDate;
  this.view.lblQuantityVal.text=transDetail.orderType;
  this.view.lblPriceVal.text=transDetail.quantity;
  this.view.lblAmountVal.text=formattedPriceVal;
  this.view.lblExcahangeRateVal.text=formattedAmount;
  this.view.lblnstrAmountVal.text=Number(transDetail.exchangeRate).toFixed(2);
  this.view.lblValueDateVal.text=formattedNetAmount;
  this.view.lblFeesVal.text=formattedfees;
  this.view.lblTotalVal.text=formattedTotal;
  this.view.lblTradeDate.text=kony.i18n.getLocalizedString("i18n.wealth.tradeDate");
  this.view.lblType.text=kony.i18n.getLocalizedString("i18n.wealth.valueDate");
  this.view.lblQuantity.text=kony.i18n.getLocalizedString("i18n.wealth.type");
  this.view.lblPrice.text=kony.i18n.getLocalizedString("i18n.wealth.quantity");
  this.view.lblAmount.text=kony.i18n.getLocalizedString("i18n.wealth.price");
  this.view.lblExchangeRate.text=kony.i18n.getLocalizedString("i18n.wealth.amount");
  this.view.lblnstrAmount.text=kony.i18n.getLocalizedString("i18n.wealth.exchangeRate");
  this.view.lblValueDate.text=kony.i18n.getLocalizedString("i18n.wealth.amountInstr");
  this.view.lblFees.text=kony.i18n.getLocalizedString("i18n.wealth.fees");
  this.view.lblTotal.text=kony.i18n.getLocalizedString("i18n.wealth.total");
  this.initActions();
  },
  initActions:function(){
    this.view.customHeader.flxBack.onTouchEnd = this.onBack;
  },
   postShow:function(){
  
},
   onBack : function () {
    var navigationMan=applicationManager.getNavigationManager();
    navigationMan.navigateTo("frmInstrumentTransactions");
  },
 });