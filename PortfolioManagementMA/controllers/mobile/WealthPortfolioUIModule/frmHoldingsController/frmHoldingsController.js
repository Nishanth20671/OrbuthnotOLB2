define({
    //segmentRowDataId : [],
  sortByCustomData: "",
  segResponse: {},
  totalValue: "",
  selectedRicCode: "",
  ISINCode:"",
  holdingsId:"",
  
    init: function() {
        this.view.preShow = this.preShow;
        var navManager = applicationManager.getNavigationManager();
        var currentForm = navManager.getCurrentForm();
        applicationManager.getPresentationFormUtility().initCommonActions(this, "YES", currentForm);
        this.initActions();
      	
    },
    preShow: function() {
      try{
      this.flag = true;
      var navManager = applicationManager.getNavigationManager();
      navManager.setCustomInfo("holdingsPage", this.flag);
      scope_WealthPresentationController.searchInstrumentForm = "frmHoldings";
      this.flag = false;
      this.view.flxAdditionalOptions.setVisibility(false);
      this.sortByCustomData = navManager.getCustomInfo("frmSortBy");
      
      var configManager = applicationManager.getConfigurationManager();
      if(configManager.getBaseCurrency() === 'EUR'){
      this.view.segmentDetailsWealth.setEuroFlow(true);
    }
      else{
         this.view.segmentDetailsWealth.setEuroFlow(false);
      }
      this.view.segmentDetailsWealth.getHoldingsTopDetails(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioDetails);
      
      var params = {
                "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
                "navPage": "Holdings",
                "sortBy": (applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueHoldings === "")?"description":applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueHoldings,
                "searchByInstrumentName": " ",
            }
      this.view.segmentDetailsWealth.setContext(params);
         var data = {};
             navManager.setCustomInfo("frmInstrumentDetails", data);
  			 navManager.setCustomInfo("frmPortfolioDetails", false);
           
          
        if (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone") {
            this.view.flxHeader.isVisible = true;
        } else {
            this.view.flxHeader.isVisible = false;
        }
        
        this.view.flxAdditionalOptions.isVisible = false;
      this.checkPermission("Holdings");
      if(configManager.isMicroAppPresent("WealthOrderMA"))
        {
         	this.view.segmentDetailsWealth.setVisibleActionImage(true);
		}
      else
        {
			this.view.segmentDetailsWealth.setVisibleActionImage(false);
        }
      }catch(err) {
        this.setError(err, "preShow");
      }
      
    },
  
      dummyFunc: function(param, dets) {
        try{
        var data = {};
            //var rowIndex = param.rowIndex;
            var holdings = dets.rowdetails;
            //var id = holdings.ISIN;
            holdings.totalValue = dets.totalValue;
            data.response = holdings;
            // this.segmentRowDataId = id;
            this.selectedRicCode = holdings.RICCode;
            this.ISINCode = holdings.ISIN;
            this.holdingsId = holdings.holdingsId;
        scope_WealthPresentationController.applicationId=holdings.application;
        var navManager = applicationManager.getNavigationManager();
        navManager.setCustomInfo("frmInstrumentDetails", data);
            this.setUpActionSheet("Holdings");
        this.checkPermission("Holdings");
        if(holdings.isAdvisory && holdings.isSecurityAsset===false){
          this.view.flxAccounts.isVisible=false;
          this.view.flxReport.isVisible=false; 
        }else{
          this.view.flxAccounts.isVisible=true;
          this.view.flxReport.isVisible=true;   
        }
        if(holdings.application==="DX")
          {
              this.view.flxAccounts.isVisible=false;
              this.view.flxReport.isVisible=false;
          }
        else
          {
              this.view.flxAccounts.isVisible=true;
              this.view.flxReport.isVisible=true;
          }
             if(scope_WealthPresentationController.isAdvisory)
              {
                this.view.flxAccounts.setVisibility(false);
                this.view.flxReport.setVisibility(false);
              }
        }catch(err) {
        this.setError(err, "dummyFunc");
      } 
        },
    initActions: function() {
      try{
       this.view.segmentDetailsWealth.onActionButtonClicked = this.dummyFunc;
      this.view.segmentDetailsWealth.onRequestStart = function() {
        applicationManager.getPresentationUtility().showLoadingScreen();
      };
      this.view.segmentDetailsWealth.onRequestEnd = function() {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
      };
        this.view.flxMore.onTouchEnd = this.onClickMoreOptions;
        this.view.customHeader.flxBack.onTouchEnd = this.navigateCustomBack;
      
       this.view.segmentDetailsWealth.onRowClickEvent = this.onHoldingsSelect;
      }catch(err) {
        this.setError(err, "initActions");
      } 
    },
  onHoldingsSelect:function(){

  },
    
    onClickMoreOptions: function() {
      try{
       this.view.flxHeader.setEnabled(false);
      this.view.flxScroll.setEnabled(false);
      this.view.flxScroll.enableScrolling = false;
      this.checkPermission("MoreOptions");
        this.setUpActionSheet("MoreOptions");
      }catch(err) {
        this.setError(err, "onClickMoreOptions");
      } 
    },
    setUpActionSheet: function(triggerPoint) {
      try{
        if (triggerPoint === "Holdings") {
            this.view.flxAccounts.isVisible = true;
            this.view.lblPerformance.text = kony.i18n.getLocalizedString("i18n.wealth.view");
            this.view.lblAccounts.text = kony.i18n.getLocalizedString("i18n.wealth.buy");
            this.view.lblReport.text = kony.i18n.getLocalizedString("i18n.wealth.sell");
            this.view.flxPerformance.onTouchEnd = this.onClickView;
            this.view.flxAccounts.onTouchEnd = this.onClickBuy;
            this.view.flxReport.onTouchEnd = this.onClickSell;
            this.view.flxCancelOption.onTouchEnd = this.onClickHoldingsCancel;
        } else {
            this.view.flxAccounts.isVisible = false;
            this.view.lblPerformance.text =  kony.i18n.getLocalizedString("i18n.wealth.downloadHoldings");
            this.view.lblReport.text = kony.i18n.getLocalizedString("i18n.wealth.sortBy");
            //this.view.flxPerformance.onTouchEnd = this.onClickDownloadTxns;
            this.view.flxPerformance.onTouchEnd =this.nav;
            this.view.flxReport.onTouchEnd = this.onClickSortBy;
            this.view.flxCancelOption.onTouchEnd = this.onClickCancel;
        }
        this.view.flxAdditionalOptions.isVisible = true;
      }catch(err) {
        this.setError(err, "setUpActionSheet");
      } 
    },
  nav: function()
  {
    try{
    this.view.flxHeader.setEnabled(true);
    this.view.flxScroll.setEnabled(true);
    this.view.flxScroll.enableScrolling = true; //[IW-3773] - Ayush Raj
    var navMan = applicationManager.getNavigationManager();
    // IW-3693 - Bhuvaneshwaran - Starts
    scope_WealthPresentationController.searchInst=this.view.segmentDetailsWealth.getCriteriaObjValue().searchByInstrumentName;
    //IW-3693 - ends
    navMan.navigateTo("frmDownload");
    }catch(err) {
        this.setError(err, "nav");
      } 
  },
    onClickView: function() {
      try{
       this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").instrumentDetailsEntry = true;
        this.callOnNavigate('view');
      this.flag = false;
      var navManager = applicationManager.getNavigationManager();
      navManager.setCustomInfo("holdingsPage", this.flag);
      }catch(err) {
        this.setError(err, "onClickView");
      } 
    },
    onClickBuy: function() {
      try{
       this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
        this.callOnNavigate('buy');
      }catch(err) {
        this.setError(err, "onClickBuy");
      } 
    },
    onClickSell: function() {
      try{
      this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
        this.callOnNavigate('sell');
      }catch(err) {
        this.setError(err, "onClickSell");
      } 
    },
    callOnNavigate: function(selectedHoldings) {
      try{
        applicationManager.getModulesPresentationController("WealthPortfolioUIModule").searchEntryPoint = false;
        var navManager = applicationManager.getNavigationManager();
      scope_WealthPresentationController.isFrmWatchlist = false;
      scope_WealthOrderPresentationController.navForm = "frmHoldings";
      var param = {
        "ISINCode": this.ISINCode?this.ISINCode:'',
        "RICCode": this.selectedRicCode?this.selectedRicCode:'',
        "instrumentId" : this.holdingsId
      };
      if(scope_WealthPresentationController.applicationId){
        param.application=scope_WealthPresentationController.applicationId;
      }
        var selData = {
            'selHoldings': selectedHoldings,
           // 'response': this.segResponse.response
        };
        navManager.setCustomInfo("frmHoldings", selData);
        //var controller = applicationManager.getPresentationUtility().getController('frmPlaceOrder', true);
        //controller.watchlistFlow = null;
      scope_WealthOrderPresentationController.isFrmWatchlist = false;
       scope_WealthPresentationController.watchlistFlow=null;
        var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.getInstrumentDetails(param);
      }catch(err) {
        this.setError(err, "callOnNavigate");
      } 
    },
    onClickHoldingsCancel: function() {
      try{
       this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
      this.view.flxScroll.enableScrolling = true;
        this.view.flxAdditionalOptions.isVisible = false;
      }catch(err) {
        this.setError(err, "onClickHoldingsCancel");
      } 
    },
	onClickDownloadTxns: function() {
      try{
       this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
      this.view.flxScroll.enableScrolling = true; //[IW-3773] - Ayush Raj
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams = this.view.segmentDetailsWealth.getCriteriaObjValue(); 
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams.navPage = "Holdings";
      var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.getDownloadList(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams);
        kony.print("test"+applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams);
      }catch(err) {
        this.setError(err, "onClickDownloadTxns");
      } 
      },
   onClickDownloadMessage:function(base64String,filename)
  {
    try 
    {  
       this.view.flxPopup.setVisibility(false);
       this.view.flxAdditionalOptions.isVisible = false;
       this.view.socialshare.shareWithBase64(base64String,filename);
    }catch(error){
   
      applicationManager.getPresentationUtility().dismissLoadingScreen();
    }
  },
    onClickCancel: function() {
      try{
      this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
      this.view.flxScroll.enableScrolling = true; //[IW-3773] - Ayush Raj
        this.view.flxAdditionalOptions.isVisible = false;
      }catch(err) {
        this.setError(err, "onClickCancel");
      } 
    },
    navigateCustomBack: function() {
       var navMan = applicationManager.getNavigationManager();
      navMan.navigateTo("frmPortfolioDetails");
      },
    onClickSortBy: function() {
      try{
      this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.setEnabled(true);
      this.view.flxScroll.enableScrolling = true; //[IW-3773] - Ayush Raj
        var data = {};
       // data.searchText = this.view.tbxSearch.text;
        var navManager = applicationManager.getNavigationManager();
        if (applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueHoldings == "") {
            data.sortByValue = "description";
            navManager.setCustomInfo("frmHoldings", data);
        } else {
            data.sortByValue = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").sortByValueHoldings;
            navManager.setCustomInfo("frmHoldings", data);
        }
        var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.commonFunctionForNavigation("frmSortBy");
      }catch(err) {
        this.setError(err, "onClickSortBy");
      } 
    },
  checkPermission: function(triggerPoint){
    try{
     var configManager = applicationManager.getConfigurationManager();
        if (triggerPoint === "Holdings") {
            let holdingsViewPermission = false;
            let holdingsBuyPermission =false;
            let holdingsSellPermission =false;
            var getPermissionDetails = JSON.parse(this.view.segmentDetailsWealth.getFeaturesAndPermissions());
            if (typeof getPermissionDetails !== "undefined") {
                if (getPermissionDetails.view.length > 0) {
                    holdingsViewPermission = configManager.checkAtLeastOnePermission(getPermissionDetails.view);
                    this.view.flxPerformance.isVisible = holdingsViewPermission;
                }
                if (getPermissionDetails.buy.length > 0) {
                    holdingsBuyPermission = configManager.checkAtLeastOnePermission(getPermissionDetails.buy);
                    this.view.flxAccounts.isVisible = holdingsBuyPermission;
                }
                if (getPermissionDetails.sell.length > 0) {
                    holdingsSellPermission = configManager.checkAtLeastOnePermission(getPermissionDetails.sell);
                    this.view.flxReport.isVisible = holdingsSellPermission;
                }
            }
          
            if (holdingsSellPermission!==true && holdingsBuyPermission!==true && holdingsViewPermission!==true) {
                this.view.segmentDetailsWealth.setVisibleActionImage(false);
             }
           else {
               this.view.segmentDetailsWealth.setVisibleActionImage(true);
              }
        } else {
            this.view.flxReport.isVisible = true;
            this.view.flxPerformance.isVisible = true;
        }
    }catch(err) {
        this.setError(err, "checkPermission");
      } 
  },
  setError: function(errorMsg, method) {
      var scope = this;
      var errorObj = {
        "method" : method,
        "error": errorMsg
      };
      var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.onError(errorObj);
    }
  

});
