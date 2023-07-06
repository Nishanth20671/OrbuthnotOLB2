define({
  keypadString:'0.00',
  isPeriodUsed : false,
  timerCounter: 0,
  init : function(){
    var navManager = applicationManager.getNavigationManager();
    var currentForm = navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
  },
  preShow: function(){
    if(applicationManager.getPresentationFormUtility().getDeviceName()==="iPhone"){
      // this.view.flxHeader.isVisible = false;
      this.view.flxHeader.setVisibility(false);
      this.view.flxMainContainer.top="0dp";
    }
    this.view.lblNote.text=kony.i18n.getLocalizedString("kony.tab.common.Note")+" "+kony.i18n.getLocalizedString("i18n.wealth.approximateAmountNote");
    var wealthOrderMod = applicationManager.getModulesPresentationController("WealthOrderUIModule");
     var data= wealthOrderMod.getWealthObject();
    if(scope_WealthPresentationController.convertCurrency ===true&&scope_WealthPresentationController.verify===false){
      scope_WealthPresentationController.convertCurrency =false;
this.keypadString='0.00';
        }else{
          this.keypadString=data.sellAmount;
        }
      this.view.flxKeypad.isVisible=false;
    this.view.imgClear.isVisible=false;
    this.view.flxButton.isVisible=true;
    //this.view.imgFrom.isVisible=false;
    //this.view.imgTo.isVisible=false;
    
  },
  postShow: function(){
     this.initActions();
    this.setUIData();
    var data=scope_WealthPresentationController.currencyRate;
    this.marketRate=data.marketRate;
    this.updateAmountValue();
    this.view.lblNote.text="Note: "+kony.i18n.getLocalizedString("i18n.wealth.approximateAmountNote");    
    if (data.marketRate){
      this.view.lblCurrency1.text= "1 "+this.view.lblFrom.text+" equals "+data.marketRate+' '+this.view.lblTo.text;
    }else {
      this.view.lblCurrency1.text= "1 "+this.view.lblFrom.text+" equals "+' '+this.view.lblTo.text;
    }
   // this.onNavigateFromSelectCurrency();
    //this.view.imgFrom.src="https://transferwise.com/public-resources/assets/flags/rectangle/usd.png";
  },
  setUIData:function(){
    var scope=this;
     var wealthOrderMod = applicationManager.getModulesPresentationController("WealthOrderUIModule");
     var data= wealthOrderMod.getWealthObject();
      
    var navManager = applicationManager.getNavigationManager();
     var formatUtil=applicationManager.getFormatUtilManager();
    var currencyData = navManager.getCustomInfo("frmSelectCurrency");
    var fromCurrency=currencyData.fromCurrencyDetails;
    var toCurrency=currencyData.toCurrencyDetails;
    //this.view.lblFrom.text=fromCurrency.lblCurrencyType.split('-')[0].trim();
    this.view.lblFrom.text=data.sellCurrency;
   // this.view.imgFrom.src=fromCurrency.imgFlag.src;
   // this.view.imgTo.src=toCurrency.imgFlag.src;
   this.view.imgFrom.src= scope_WealthPresentationController.fromCurrencyFlag;
    this.view.imgTo.src=scope_WealthPresentationController.toCurrencyFlag;
//this.view.lblTo.text=toCurrency.lblCurrencyType.split('-')[0].trim();
    this.view.lblTo.text=data.buyCurrency;
    if(fromCurrency.balance){
     // this.view.lblBalance1.text=formatUtil.formatAmountandAppendCurrencySymbol(fromCurrency.balance,this.view.lblFrom.text);
    this.view.lblBalance1.text=scope_WealthPresentationController.fromAccountBalance;
        }
     if(toCurrency.balance){
      //this.view.lblBalance2.text=formatUtil.formatAmountandAppendCurrencySymbol(toCurrency.balance,this.view.lblTo.text);
       this.view.lblBalance2.text=scope_WealthPresentationController.toAccountBalance;
       
    }else{
      this.view.lblBalance2.text=formatUtil.formatAmountandAppendCurrencySymbol("0.00",this.view.lblTo.text);

    }
    if(currencyData.existing===true){
      scope.view.imgExchange.enable=true;
    }else{
      scope.view.imgExchange.enable=false;
    }
  },
  setReference : function(amount){
    if(amount==="0.00")
    {
       this.keypadString = '0.00';
    }
    else
      {
      this.keypadString=amount;
      }
  },
  onNavigateFromSelectCurrency:function(){
    var navManager = applicationManager.getNavigationManager();
    var currencyData = navManager.getCustomInfo("frmSelectCurrency");
    if(!kony.sdk.isNullOrUndefined(currencyData)){
      if(currencyData.formName=== "frmSelectCurrency"){
        currencyData.formName="frmConvertCurrency"
        if(currencyData.fromCurrency===true){
          this.view.imgFrom.src=currencyData.currencyDetails.imgFlag;
          this.view.lblFrom.text=currencyData.currencyDetails.lblCurrencyType.split("-")[0].trim();
        }else{
          this.view.imgTo.src=currencyData.currencyDetails.imgFlag;
          this.view.lblTo.text=currencyData.currencyDetails.lblCurrencyType.split("-")[0].trim();
        }

        if(this.view.lblFrom.text===this.view.lblTo.text){
            this.view.btnContinue.skin = "sknBtnOnBoardingInactive";
            this.view.btnContinue.setEnabled(false);
           this.view.lblError.isVisible=true;
        
         
    }else{
      if(this.keypadString==="0.00"){
        this.view.btnContinue.skin = "sknBtnOnBoardingInactive";
            this.view.btnContinue.setEnabled(false);
      }else{
       this.view.btnContinue.skin = "sknBtn0095e4RoundedffffffSSP26px";
      this.view.btnContinue.setEnabled(true);
      }
       this.view.lblError.isVisible=false;
      
        this.getMarketRate();
    }
      }
    }
  },

  initActions: function(){
    this.view.btnContinue.onClick =this.continueOnClick;
    this.view.customHeader.btnRight.onClick =this.cancelOnClick;
    this.view.customHeader.flxBack.onClick =this.backOnClick;
   // this.view.flxFrom.onClick = this.currencyClick.bind(this,0);
   // this.view.flxTo.onClick = this.currencyClick.bind(this,1); 
    this.view.imgExchange.onTouchEnd=this.onSwitchCurrency;
    
    this.view.flxAmountWrapper.onClick = this.toggleKeypad.bind(this,1);
    this.view.flxDone.onClick = this.toggleKeypad.bind(this,0);
    this.view.flxShowChart.onClick = this.showChart;
    
    // Convert Now toggle
    this.view.btnTglConvertNow.onClick = this.onToggleConversionPreference.bind(this, 0);
    this.view.btnTglScheduleLater.onClick = this.onToggleConversionPreference.bind(this, 1);
    
    this.view.flxScheduleOn.onClick = this.onScheduleLater;
    this.view.imgClear.onTouchEnd=this.clearData;
  },
  clearData:function(){
    this.keypadString='0.00';
    this.view.lblAmount.text='0.00';
    this.calculateAmount();
  },
  onSwitchCurrency:function(){
     var formatUtil=applicationManager.getFormatUtilManager();
     var tempText=this.view.lblFrom.text;
    var tempImage=this.view.imgFrom.src;
    var tempBalance=this.view.lblBalance1.text;
    this.view.lblFrom.text=this.view.lblTo.text;
    this.view.imgFrom.src=this.view.imgTo.src;
    this.view.lblBalance1.text=this.view.lblBalance2.text;
    this.view.lblTo.text=tempText;
    this.view.imgTo.src=tempImage;
    this.view.lblBalance2.text=tempBalance;
    this.getMarketRate();
    var wealthMod = applicationManager.getModulesPresentationController("WealthOrderUIModule");
    wealthMod.setSellCurrency(this.view.lblFrom.text);
    wealthMod.setBuyCurrency(this.view.lblTo.text);
    scope_WealthPresentationController.fromCurrencyFlag=this.view.imgFrom.src;
      scope_WealthPresentationController.toCurrencyFlag=this.view.imgTo.src;
    scope_WealthPresentationController.fromAccountBalance=this.view.lblBalance1.text;
      scope_WealthPresentationController.toAccountBalance=this.view.lblBalance2.text;
  },
  getMarketRate:function(){
    var curr1=this.view.lblFrom.text.substr(0,3);
    var currency1=curr1.toUpperCase();
    var curr2=this.view.lblTo.text.substr(0,3);
    var currency2=curr2.toUpperCase();
    var result=currency1+currency2
    var wealthMod = applicationManager.getModulesPresentationController("WealthOrderUIModule");
    var param={
      "currencyPairs":result,
      "portfolioId": scope_WealthPresentationController.portfolioId
    };
    wealthMod.getCurrencyRate(param);
  },
  setCurrencyData:function(data){
    this.marketRate=data.marketRate;
    this.view.lblCurrency1.text= "1 "+this.view.lblFrom.text+" equals "+data.marketRate+' '+this.view.lblTo.text;
    this.calculateAmount();
     this.view.lblError.isVisible=false;
    this.view.flxAmountWrapper.skin="flxBlueFocus";

  },
  currencyClick: function(option){
    var navMan=applicationManager.getNavigationManager();
     var wealthMod = applicationManager.getModulesPresentationController("WealthOrderUIModule");
    var formatUtil=applicationManager.getFormatUtilManager();
    var param={
      "buyCurrency":this.view.lblTo.text,
      "sellCurrency":this.view.lblFrom.text,
      "buyAmount":formatUtil.deFormatAmount(this.view.lblCurrency.text.split(" ")[0]),
      "sellAmount":formatUtil.deFormatAmount((this.view.lblAmount.text).replace(/,/g, ''))
    }
    wealthMod.setCurrencyData(param);
    var fromCurrency;

    if(option===0){
      fromCurrency=true;
    }else{
      fromCurrency=false;
    }
    var currencyData = navMan.getCustomInfo("frmSelectCurrency");
    if(kony.sdk.isNullOrUndefined(currencyData)){
      var currencyData={};
      currencyData.fromCurrency=fromCurrency;
    }else{
      currencyData.fromCurrency=fromCurrency;
    }
    navMan.setCustomInfo("frmSelectCurrency", currencyData);

    navMan.navigateTo("frmSelectCurrency");
  },

  cancelOnClick:function()
  {
 var params = {"portfolioId":scope_WealthPresentationController.portfolioId,"navPage":"Portfolio","graphDuration":"OneY"};
  var wealthOrderModule = applicationManager.getModulesPresentationController("WealthOrderUIModule");
  wealthOrderModule.getPortfolioAndGraphDetails(params);
  },
  backOnClick:function(){
   var navMan=applicationManager.getNavigationManager();
   
    if(scope_WealthPresentationController.verify===true){
        scope_WealthPresentationController.verify=false;
    
      navMan.navigateTo('frmConvertCurrencyVerify');
    }else{
      // navMan.goBack();
	  navMan.navigateTo('frmToCurrency');
    
    }
  
  },
  continueOnClick :function()
  {
     scope_WealthPresentationController.verify=false;
   
    var formatUtil=applicationManager.getFormatUtilManager();
    var navManager=applicationManager.getNavigationManager();
    var currencyData = navManager.getCustomInfo("frmSelectCurrency");
    var fromCurrency=currencyData.fromCurrencyDetails;
   var toCurrency=currencyData.toCurrencyDetails;
    var checkbalance=parseFloat(fromCurrency.balance);
    var enteredAmount=parseFloat(formatUtil.deFormatAmount((this.view.lblAmount.text).replace(/,/g, '')));
   if(enteredAmount>checkbalance){
     this.view.lblError.isVisible=true;
     this.view.flxAmountWrapper.skin="sknFlxBgFFFFFFBrF54B5E1pxR3px";
     this.view.lblError.text="You don't have sufficient balance to make this order";
   }else{
    var wealthMod = applicationManager.getModulesPresentationController("WealthOrderUIModule");
    
    var param={
     // "buyCurrency":this.view.lblTo.text,
     // "sellCurrency":this.view.lblFrom.text,
      "buyAmount":formatUtil.deFormatAmount(this.view.lblCurrency.text.split(" ")[0]),
      "sellAmount":formatUtil.deFormatAmount((this.view.lblAmount.text).replace(/,/g, ''))
    }
    wealthMod.setCurrencyData(param);
    wealthMod.currency = this.view.lblFrom.text;
    wealthMod.amount = checkbalance.toString()-formatUtil.deFormatAmount((this.view.lblAmount.text).replace(/,/g, ''));
    if(scope_WealthPresentationController.addCurrency===true){
      wealthMod.newAccount={
      "accountName":"Newly created A/c",
      "balance":formatUtil.deFormatAmount(this.view.lblCurrency.text.split(" ")[0]),
      "currency":toCurrency.lblCurrencyType.split('-')[0].trim(),
       "currencyName":toCurrency.lblCurrencyType.split('-')[1].trim(),
        "referenceCurrencyValue":"964.1",
        "accountNumber":this.randomNumber(4)
    }; 
    }else{
      wealthMod.newAccount={};
    }
    
    
      var navMan=applicationManager.getNavigationManager();
//       if(wealthMod.getVerifyFlow()){
        navMan.navigateTo("frmConvertCurrencyVerify");

//       }else{
//         navMan.navigateTo("frmCurrencyChart");
//       }
   }
  },
  randomNumber: function (length) {
    var text = "";
    var possible = "123456789";
    for (var i = 0; i < length; i++) {
      var sup = Math.floor(Math.random() * possible.length);
      text += i > 0 && sup === i ? "0" : possible.charAt(sup);
    }
    return text;
  },
  // Toggle keypad and disable Confirm button
  toggleKeypad : function(enableKeypad) {
    this.view.lblError.isVisible=false;
    this.view.flxAmountWrapper.skin="flxBlueFocus";
    this.view.flxKeypad.setVisibility(!!enableKeypad);
    this.view.flxButton.setVisibility(!!!enableKeypad);
    this.view.imgClear.isVisible=!!enableKeypad;
    this.view.flxMainContainer.height = enableKeypad ? '53%' : '84%';
  },
  
  showChart : function() {
    var wealthMod = applicationManager.getModulesPresentationController("WealthOrderUIModule");
    var formatUtil=applicationManager.getFormatUtilManager();
    var param={
    //  "buyCurrency":this.view.lblTo.text,
     // "sellCurrency":this.view.lblFrom.text,
      "buyAmount":formatUtil.deFormatAmount(this.view.lblCurrency.text.split(" ")[0]),
      "sellAmount":formatUtil.deFormatAmount((this.view.lblAmount.text).replace(/,/g, ''))
    }
    wealthMod.setCurrencyData(param);
   // wealthMod.setSellCurrency(this.view.lblFrom.text);
   // wealthMod.setBuyCurrency(this.view.lblTo.text);

    var navMan=applicationManager.getNavigationManager();
    navMan.navigateTo("frmCurrencyChart");
  },
  
  onToggleConversionPreference: function (option) {
    let activeSkin = 'sknBtnFFFFFFBdr10px';
    let inactiveSkin = 'sknbtn000000SSPSemiBold15px';
    if (!option) {
      this.view.btnTglConvertNow.skin = activeSkin;
      this.view.btnTglScheduleLater.skin = inactiveSkin;
      this.view.flxScheduleOn.setVisibility(false);
     scope_WealthPresentationController.convertNowFlow=true;
      this.view.flxSeparator.isVisible=true;
    } else {
      this.view.btnTglConvertNow.skin = inactiveSkin;
      this.view.btnTglScheduleLater.skin = activeSkin;
      this.view.flxScheduleOn.setVisibility(true);
     scope_WealthPresentationController.convertNowFlow=false;
      this.view.flxSeparator.isVisible=false;
    }
  },
  
  onScheduleLater : function () {
    var navManager = applicationManager.getNavigationManager();
    navManager.navigateTo("frmScheduleDate");
  },
  
  setCurrencyBalances : function(curr1,curr2) {
    this.view.lblBalance1.text = curr1;
    this.view.lblBalance2.text = curr2;
  },
  
  setKeypadChar: function (char) {
    if(char==='.'){
      if(this.isPeriodUsed===false){
        this.isPeriodUsed = true;
      }else{
        return;
      }
    }
    var temp=this.keypadString.split(".")[0];
    if(temp.length<9){
      this.keypadString = this.keypadString + char;
      var firstChar = this.keypadString[0];
      this.keypadString = this.keypadString.split("");
      for(var i=1; i<this.keypadString.length; i++){
        if(this.keypadString[i]==='.'){
          this.keypadString[i-1] = this.keypadString[i+1];
          i++;
        }else{
          this.keypadString[i-1]=this.keypadString[i];
        }
      }
      this.keypadString = this.keypadString.join("");
      this.keypadString = this.keypadString.substr(0, this.keypadString.length-1);
      if(firstChar!=='0'){
        this.keypadString = firstChar + this.keypadString;
      }
      this.updateAmountValue();
    }
  },
  clearKeypadChar: function () {
    if(this.keypadString ==='0.00') return;
    this.keypadString = this.keypadString.split("");
    for(var i=this.keypadString.length-2; i>=0; i--){
      if(this.keypadString[i]==='.'){
        this.keypadString[i+1] = this.keypadString[i-1];
        i--;
      }else{
        this.keypadString[i+1] = this.keypadString[i];
      }
    }
    this.keypadString = this.keypadString.join("");
    this.keypadString = this.keypadString.substr(1);
    if(this.keypadString[0]==='.'){
      this.keypadString = '0'+ this.keypadString;
    }
    this.updateAmountValue();
  },
  updateAmountValue: function(){
    if(this.keypadString==='0.00'){
      this.view.btnContinue.skin = "sknBtnOnBoardingInactive";
      this.view.btnContinue.setEnabled(false);
      this.view.lblAmount.text = this.view.keypad.formatAmount(this.keypadString);
    }else{
      var keypadStringCommas = '';
      var beforeDecimal = this.keypadString.split('.')[0];
      var afterDecimal = this.keypadString.split('.')[1];
      if(beforeDecimal.length>3){
        var withCommas = (beforeDecimal.length)/3;
        var withoutCommas = (beforeDecimal.length)%3;
        var temp = '';
        if(withoutCommas!=0){
          temp = beforeDecimal.substr(0, withoutCommas)+',';
        }
        for(var i = withoutCommas; i<beforeDecimal.length; i+=3){
          temp+=beforeDecimal.substr(i, 3)+',';
        }
        beforeDecimal = temp.substr(0, temp.length-1);
      }
      keypadStringCommas = beforeDecimal + '.'+afterDecimal;
      if(this.view.lblFrom.text===this.view.lblTo.text){
          this.view.btnContinue.skin = "sknBtnOnBoardingInactive";
            this.view.btnContinue.setEnabled(false);
      }else{
        this.view.btnContinue.skin = "sknBtn0095e4RoundedffffffSSP26px";
      this.view.btnContinue.setEnabled(true);
      }
      
      this.view.lblAmount.text = this.view.keypad.formatAmount(keypadStringCommas);
    }
    this.calculateAmount();
  },
  calculateAmount:function(){
    if(this.keypadString==="0.00"){
      this.view.lblCurrency.text="0.00 "+this.view.lblTo.text;
    }else{
      var formatUtil=applicationManager.getFormatUtilManager();
      var amount=parseFloat(formatUtil.deFormatAmount((this.view.lblAmount.text).replace(/,/g, '')));
      var amount1=parseFloat(this.marketRate);
      var result=amount*amount1;

      this.view.lblCurrency.text=formatUtil.formatAmount(result)+" "+this.view.lblTo.text;
    }
  }

});
