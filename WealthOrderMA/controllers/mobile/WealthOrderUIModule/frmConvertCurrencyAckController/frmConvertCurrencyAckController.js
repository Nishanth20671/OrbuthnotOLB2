define({

  init: function () {
    var navManager = applicationManager.getNavigationManager();
    var currentForm = navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
    this.view.preShow=this.preShow;
    this.view.postShow=this.postShow;
  },

  preShow: function () {
    if (kony.os.deviceInfo().name === "iPhone") {
      this.view.flxHeader.isVisible = false;
      this.view.flxFullScroll.top='0dp';
    }
    this.initActions();
  },
  initActions: function () {
    this.view.btnView.onClick = this.onViewOrder;
    this.view.btnClose.onClick = this.onClose;
  },
  postShow:function(){
  this.setUIData();
  },
 setUIData: function () {

        var wealthMod = applicationManager.getModulesPresentationController("WealthOrderUIModule");
     var formatUtil=applicationManager.getFormatUtilManager();
     var data= wealthMod.getWealthObject();
    var currency1=data.sellCurrency.substr(0,3);
      var currency2=data.buyCurrency.substr(0,3);
      this.view.lblFromVal.text=data.sellCurrency;
      this.view.lblFromAmountVal.text=formatUtil.formatAmountandAppendCurrencySymbol(data.sellAmount,currency1);
      this.view.lblToVal.text=data.buyCurrency;
      this.view.lblToAmountVal.text=formatUtil.formatAmountandAppendCurrencySymbol(data.buyAmount,currency2);
		if (scope_WealthPresentationController.convertNowFlow === true) {

			this.view.lblOption.text = kony.i18n.getLocalizedString("i18n.wealth.convertNow");
			
          var today = new Date();
          this.view.lblDate.text = String(today.getMonth() + 1).padStart(2, '0') + '/' +String(today.getDate()).padStart(2, '0') + '/'+ today.getFullYear();
      

		} else {
			this.view.lblOption.text = kony.i18n.getLocalizedString("i18n.wealth.scheduledon");
			
		}

	},
  onViewOrder: function(){
    var sortByValue = undefined; 
        var data = {};
        data.response = sortByValue;
        var navManager = applicationManager.getNavigationManager();	
        navManager.setCustomInfo("frmPortfolioDetails", true);
        navManager.setCustomInfo("frmSortBy", data);
		//applicationManager.getModulesPresentationController("WealthPortfolioUIModule").isFrmWatchlist=false;
		//applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueOrders = "";
        new kony.mvc.Navigation({"appName" : "PortfolioManagementMA", "friendlyName" : "frmOrders"}).navigate();
  },
  onClose: function(){
 var wealthMod = applicationManager.getModulesPresentationController("WealthOrderUIModule");
 wealthMod.setVerifyFlow(false);
 wealthMod.clearWealthData();
     var params = {"portfolioId":scope_WealthPresentationController.portfolioId,"navPage":"Portfolio","graphDuration":"OneY"};
  wealthMod.getPortfolioAndGraphDetails(params);
    
  }

});
