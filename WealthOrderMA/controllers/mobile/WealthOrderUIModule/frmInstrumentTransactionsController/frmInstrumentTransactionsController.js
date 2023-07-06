define({ 
sortByCustomData : "",
segValue:{},
dateRange : [],
init : function(){
    var navManager = applicationManager.getNavigationManager();
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
 //this.view.lblPreviousDays.text=kony.i18n.getLocalizedString("i18n.wealth.previous30Days");
  },
  preShow:function(){
     this.view.flxAdditionalOptions.setVisibility(false);
    var navManager=applicationManager.getNavigationManager();
     this.sortByCustomData = navManager.getCustomInfo("frmSortBy");
     this.dateRange = scope_WealthPresentationController.selectedDateRangeDetails;
     this.view.segmentDetailsWealth.setLblPreviousDays(this.dateRange);
     var instrTransactions = applicationManager.getModulesPresentationController("WealthOrderUIModule").getInstrumentTransactions();
     this.view.lblInstrumentName.text = instrTransactions.instrumentName;
     var arr=this.view.lblInstrumentName.text.split('');
     if (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone") { 
          if(arr.length>27){
            this.view.flxInstrumentInfo.height = "100dp";
          }
          else{
            this.view.flxInstrumentInfo.height = "80dp";
            this.view.lblInstrumentName.top = "10dp";
          }
        } else {
            if(arr.length>22){
              this.view.flxInstrumentInfo.height = "100dp";
            }
          else{
            this.view.flxInstrumentInfo.height = "80dp";
            this.view.lblInstrumentName.top = "10dp";
          }
        }
    this.view.lblInstrumentSymbol.text = instrTransactions.ISINcode;
      var configManager = applicationManager.getConfigurationManager();
      if(configManager.getBaseCurrency() === 'EUR'){
      this.view.segmentDetailsWealth.setEuroFlow(true);
    }
      else{
         this.view.segmentDetailsWealth.setEuroFlow(false);
      }
	  if(scope_WealthPresentationController.portfolioId === "")
	  {
        scope_WealthPresentationController.portfolioId = scope_WealthPresentationController.watchlistPortfolioId;
      }
       var params = {
                "portfolioId": scope_WealthPresentationController.portfolioId,
                "startDate": this.dateRange.startDate,
                "endDate": this.dateRange.endDate,
                "instrumentId":instrTransactions.instrumentId,
                "sortBy": (scope_WealthPresentationController.sortByValueInstrumentTrans === "")?"tradeDate":scope_WealthPresentationController.sortByValueInstrumentTrans,
                "sortOrder":"asc",
                "downloadFormat": "pdf"
            };  
    if(params.sortBy == "tradeDate" || params.sortBy == "valueDate")
       params.sortOrder = "desc"
    this.view.segmentDetailsWealth.setContext(params);
    if(applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone"){
      this.view.flxHeader.isVisible = true;
    }
    else{
      this.view.flxHeader.isVisible = false;
    }
    this.view.flxAdditionalOptions.setVisibility(false);
    navManager.setCustomInfo("frmPortfolioDetails", false);
    this.initActions();
  },
  initActions:function(){
    this.view.segmentDetailsWealth.onRowClickEvent = this.onTransactionSelect;
    this.view.segmentDetailsWealth.onMoveToDateRange   = this.timePeriod;
    this.view.customHeader.flxSearch.onTouchEnd = this.moreOptions;
    this.view.flxCancelOption.onTouchEnd = this.onCancel;
    this.view.flxSortBy.onTouchEnd = this.onClickSortBy;
    this.view.flxDownloadTransactions.onTouchEnd = this.onClickDownloadTxns;
    this.view.customHeader.flxBack.onClick =this.onBack;
    this.view.segmentDetailsWealth.onRequestEnd = function() {
      applicationManager.getPresentationUtility().dismissLoadingScreen();
    };
	this.view.segmentDetailsWealth.onRequestStart = function() {
      applicationManager.getPresentationUtility().showLoadingScreen();
    };
	this.checkPermission();
  },

  moreOptions:function(){
    this.view.flxScroll.enableScrolling = false;
    this.view.flxScroll.setEnabled(false);
    this.view.flxHeader.setEnabled(false);
    this.view.flxAdditionalOptions.setVisibility(true);
	this.view.lblDownloadTransactions.text = kony.i18n.getLocalizedString("i18n.wealth.downloadTransactions");
	this.view.lblSortyBy.text = kony.i18n.getLocalizedString("i18n.wealth.sortBy");
  },
  onCancel:function(){
    this.view.flxScroll.enableScrolling = true;
    this.view.flxScroll.setEnabled(true);
    this.view.flxHeader.setEnabled(true);
    this.view.flxAdditionalOptions.setVisibility(false);
  },
 
  onClickSortBy: function(){
     this.view.flxScroll.setEnabled(true);
     this.view.flxHeader.setEnabled(true);
     this.view.flxScroll.enableScrolling = true; //[IW-3773] - Ayush Raj
     var data={};
    var navManager = applicationManager.getNavigationManager();
    if(scope_WealthPresentationController.sortByValueInstrumentTrans == ""){
      data.sortByValue="tradeDate";
      navManager.setCustomInfo("frmInstrumentTransactions", data);
    }
    else{
      data.sortByValue = scope_WealthPresentationController.sortByValueInstrumentTrans;
      navManager.setCustomInfo("frmInstrumentTransactions", data);
    }
    navManager.navigateTo("frmOrderSortBy");
	},
    onBack : function () {
      var navManager = applicationManager.getNavigationManager();
      navManager.navigateTo("frmInstrumentDetails");
  },
    timePeriod: function(){
      var navManager = applicationManager.getNavigationManager();
      var dateFlag = scope_WealthPresentationController.selectedDateRangeDetails;
      var selectedValue = this.view.segmentDetailsWealth.getPreviousDaysText();
      var dataSet = {};
      var period;
      if(selectedValue == "Previous 30 days"){
        period ="previous30DaysSelected";
      }
      else if(selectedValue == "3 Months"){
        period ="3MonthsSelected";
      }
      else if(selectedValue == "6 Months"){
        period ="6MonthsSelected";
      }
      else if(selectedValue == "Last year"){
        period ="lastYearSelected";
      }
      else{
        period ="freeDateSelected";
      }
      dataSet.flag = dateFlag.flag;
      dataSet.selectedDays = period ;
      navManager.setCustomInfo('frmInstrumentTransactions', dataSet);
      navManager.navigateTo("frmOrderDateRange");
  },

 
  onTransactionSelect:function(rowData){
     var navManager=applicationManager.getNavigationManager();
     var data={};
//     var rowIndexValue=context.rowIndex;
     var transaction = rowData.row;
     data.response=transaction;
     data.response.referenceCurrency =  rowData.row.referenceCurrency;
     navManager.setCustomInfo("frmViewTransactionDetails", data);
     navManager.navigateTo("frmOrderViewTransactionDetails");
  },
	onClickDownloadTxns: function() {
       this.view.flxScroll.setEnabled(true);
    this.view.flxHeader.setEnabled(true);
      this.view.flxScroll.enableScrolling = true; //[IW-3773] - Ayush Raj
      scope_WealthPresentationController.downloadParams = this.view.segmentDetailsWealth.getCriteriaObjValue(); 
      scope_WealthPresentationController.downloadParams.navPage = "InstrumentTransactions";
      scope_WealthPresentationController.downloadParams.downloadFormat="pdf";
      var wealthOrderModule = applicationManager.getModulesPresentationController("WealthOrderUIModule");
        wealthOrderModule.getWatchDownloadList(scope_WealthPresentationController.downloadParams);
        kony.print("test"+scope_WealthPresentationController.downloadParams);
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
   checkPermission: function(){
    var configManager = applicationManager.getConfigurationManager();
    var getPermissionDetails = JSON.parse(this.view.segmentDetailsWealth.getFeaturesAndPermissions());
    var transDetailViewPermission=false;
    if(typeof getPermissionDetails !=="undefined")
      {
        if (getPermissionDetails.viewDetails.length > 0) {
        transDetailViewPermission = configManager.checkAtLeastOnePermission(getPermissionDetails.viewDetails);
        this.view.segmentDetailsWealth.onRowClickEvent = transDetailViewPermission ? this.onTransactionSelect : "";
     }
        
      }
    
    
  },

});