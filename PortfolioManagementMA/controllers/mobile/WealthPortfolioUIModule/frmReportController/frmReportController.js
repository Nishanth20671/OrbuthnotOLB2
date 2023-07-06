define({
// reportTypeData: {},
 dateRange: {},
 reportData:"",
  downloadData:[],
  format:"",
  init: function(){
      this.view.preShow = this.preShow;
      var navManager = applicationManager.getNavigationManager();
      var currentForm = navManager.getCurrentForm();
      applicationManager.getPresentationFormUtility().initCommonActions(this, "YES", currentForm);
 },
  preShow: function(){ 
    try{
     var navManager = applicationManager.getNavigationManager();
   // this.reportTypeData = navManager.getCustomInfo("frmReportType");
    this.reportData = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportData;
  // if(this.reportTypeData === undefined){
    if(applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportType == ""){
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportType = this.reportData.response.reportTypeList[0].reportType;
      applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportParams =this.reportData.response.reportTypeList[0].downloadParams;
     }
  //  else{
    this.view.lblAccSummary.text = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportType;
  //  }
     if(navManager.getCustomInfo("frmDownload")==="csv"){
      this.format="csv";
      this.view.lblDownFormat.text="CSV";
    }else if(navManager.getCustomInfo("frmDownload")==="xlsx"){
      this.format="xlsx";
      this.view.lblDownFormat.text="EXCEL (xlsx)";
    }else{
       this.format="pdf";
       this.view.lblDownFormat.text="PDF";
    }
    this.dateRange = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").selectedDateRangeDetails;
    this.setLblPreviousDays();
       if (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone") {
            this.view.flxHeader.isVisible = true;
        } else {
            this.view.flxHeader.isVisible = false;
        }
    this.view.flxTimePeriod.setVisibility(true);
    this.view.flxReportType.setVisibility(true);
    this.view.segDownload.setVisibility(false);
    
    var data = this.reportData.response.downloadTypeList;
   this.downloadData=[];
    for(var list in data){
     var storeData ={
       //IW-3768 Bhuvaneshwaran - Strats
      docName : data[list].downloadParams.downloadType,
       //IW-3768 - Ends
      downloadParams : data[list].downloadParams
     };
     this.downloadData.push(storeData);
    }
    
    this.view.segDownload.widgetDataMap = {lblType: "docName"};
    this.view.segDownload.removeAll();
    this.view.segDownload.setData(this.downloadData);
    
    if(kony.application.getPreviousForm().id==='frmPortfolioDetails'){
    this.view.lblDownFormat.text="PDF";}

    this.initActions();
    this.checkPermissions();
      
    }catch(err) {
        this.setError(err, "preShow");
      } 
  },
  initActions: function(){
    try{
    this.view.customHeader.btnRight.onClick = this.goBack;
    this.view.customHeader.flxBack.onClick = this.goBack;
    this.view.btnTglReport.skin = "sknBtnFFFFFFSSPSB15px";
    this.view.btnTglStatement.skin = "sknbtn000000SSPSB15px";
    this.view.flxBtn.setVisibility(true);
    this.view.flxPreviousDays.onTouchEnd = this.showDatePicker;
    this.view.flxAccountSummary.onTouchEnd = this.showReportTypes;
    this.view.btnTglReport.onClick = this.reportStatementToggle.bind(this, this.view.btnTglReport);
    this.view.btnTglStatement.onClick = this.reportStatementToggle.bind(this, this.view.btnTglStatement);
    this.view.btnGetReport.onClick = this.downloadStatement;
    this.view.segDownload.onRowClick = this.downloadStatementinSeg;
    this.view.flxDownload.onTouchEnd=this.nav;
    }
     catch(err){
       this.setError(err, "initActions");
     }
  },
  nav: function(){
    try{
    var navMan = applicationManager.getNavigationManager();
    navMan.navigateTo("frmDownload");
    }catch(err){
      this.setError(err,"nav");
    }
  },
    setLblPreviousDays:function(){
      try{
     var forUtility = applicationManager.getFormatUtilManager();
      if(this.dateRange){
    if(this.dateRange.selectedPeriod=="previous30DaysSelected"){
      this.view.lblPreviousDays.text=kony.i18n.getLocalizedString("i18n.wealth.previous30Days");
    }else if(this.dateRange.selectedPeriod=="3MonthsSelected"){
      this.view.lblPreviousDays.text=kony.i18n.getLocalizedString("i18n.wealth.threeMonths");
    }else if(this.dateRange.selectedPeriod=="6MonthsSelected"){
       this.view.lblPreviousDays.text=kony.i18n.getLocalizedString("i18n.wealth.sixMonths");
    }else if(this.dateRange.selectedPeriod=="lastYearSelected"){
       this.view.lblPreviousDays.text=kony.i18n.getLocalizedString("i18n.wealth.lastYear");
    }else{
      var startDateObj=this.dateRange.startDate.split("-");
        var formattedstartDate=startDateObj[1] +"/"+ startDateObj[2] +"/"+ startDateObj[0];
       var endDateObj=this.dateRange.endDate.split("-");
         var formattedendDate=endDateObj[1] +"/"+ endDateObj[2] +"/"+ endDateObj[0];
      this.view.lblPreviousDays.text=formattedstartDate + " - " + formattedendDate;
    }
      }else{
         this.view.lblPreviousDays.text = kony.i18n.getLocalizedString("i18n.wealth.previous30Days"); 
      }
      }catch(err){
        this.setError(err, "setLblPreviousDays");
      }
  },
  reportStatementToggle: function(widgetInfo){
    try{
    let skin1 = this.view.btnTglReport.skin;
    let skin2 = this.view.btnTglStatement.skin;
    this.view.btnTglReport.skin = (skin1 ===  "sknBtnFFFFFFSSPSB15px") ? "sknbtn000000SSPSB15px":"sknBtnFFFFFFSSPSB15px";
    this.view.btnTglStatement.skin = (skin2 ===  "sknBtnFFFFFFSSPSB15px") ? "sknbtn000000SSPSB15px":"sknBtnFFFFFFSSPSB15px";
    if(widgetInfo.id === "btnTglReport"){
      this.loadReport();
    }
    else{
      this.loadStatement();
    }
    }catch(err){
      this.setError(err, "reportStatementToggle");
    }
  },
  goBack: function(){
    try{
 		var params = {
                "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
                "navPage": "Portfolio",
                "graphDuration": "OneM"
            };
            var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
            wealthModule.getPortfolioAndGraphDetails(params);
    }catch(err){
       this.setError(err, "goBack");
    }
  },
  loadReport: function(){
    try{
    this.view.flxTimePeriod.setVisibility(true);
    this.view.flxReportType.setVisibility(true);
    this.view.segDownload.setVisibility(false);
    this.view.flxBtn.setVisibility(true);
    this.view.flxFormatType.setVisibility(true);
    }catch(err){
       this.setError(err, "loadReport");
    }
  },
  loadStatement: function(){
    try{
    this.view.flxTimePeriod.setVisibility(false);
    this.view.flxReportType.setVisibility(false);
   
    
    this.view.segDownload.setVisibility(true);
    this.view.flxBtn.setVisibility(false);
    this.view.flxFormatType.setVisibility(false);
    }catch(err){
       this.setError(err, "loadStatement");
    }
  },
  downloadStatementinSeg: function(){
    try{
     var rowIndex = this.view.segDownload.selectedRowIndex[1];
        let downloadTypeParams = this.downloadData[rowIndex].downloadParams;
     applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams={};
    applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams.navPage="Reports";
	    applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams.downloadFormat="pdf"; //IW-3772 Bharath
     var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.getDownloadList(downloadTypeParams);
    }catch(err){
        this.setError(err, "downloadStatementinSeg");
      }
  },
  downloadStatement: function(){
    try{
           let downloadParams=applicationManager.getModulesPresentationController("WealthPortfolioUIModule").reportParams;
         applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams={};
		 downloadParams.accountId = scope_WealthPresentationController.accountNumber;
         downloadParams.downloadFormat=this.format;
    applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams.navPage="Reports";
    applicationManager.getModulesPresentationController("WealthPortfolioUIModule").downloadParams.downloadFormat=this.format;
     var wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        wealthModule.getDownloadList(downloadParams);
    }catch(err){
      this.setError(err, "downloadStatement");
    }
   
  },
   onClickDownloadMessage:function(base64String,filename)
  {
    try 
    {  
       this.view.socialshare.shareWithBase64(base64String,filename);
    }catch(error){
   applicationManager.getPresentationUtility().dismissLoadingScreen();
    }
  },
  showDatePicker: function(){
    try{
    var navManager = applicationManager.getNavigationManager();
    //  var selectedValue = this.view.lblPrevio =usDays.text;
      var selectedValue = this.view.lblPreviousDays.text;
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
      //  dataSet.searchValue = this.view.tbxSearch.text;
        dataSet.selectedDays = period;
        navManager.setCustomInfo('frmReport', dataSet);
        navManager.navigateTo("frmDateRange");
    }catch(err){
      this.setError(err, "showDatePicker");
    }
  },
  showReportTypes: function(){
    try{
        var navManager = applicationManager.getNavigationManager();
    //    navManager.navigateTo("frmReportType");
   // var data;
   // data.reportTypeData = this.reportTypeData;
    navManager.setCustomInfo("frmReportType",this.reportData.response.reportTypeList);
    navManager.navigateTo("frmReportType");
    }catch(err){
       this.setError(err, "showReportTypes");
    }
  },
  
  checkPermissions:function(){
    try{
    let generateReportPermission = applicationManager.getConfigurationManager().checkUserPermission("WEALTH_REPORT_MANAGEMENT_REPORT_CREATE");
    this.view.flxBtn.setVisibility(generateReportPermission);
    this.view.flxTimePeriod.setVisibility(generateReportPermission);
    this.view.flxReportType.setVisibility(generateReportPermission);

    let downloadStatementPermission = applicationManager.getConfigurationManager().checkUserPermission("WEALTH_REPORT_MANAGEMENT_REPORT_DOWNLOAD");

    if(generateReportPermission && downloadStatementPermission){
      this.view.lblCommon.setVisibility(false);
      this.view.flxReport.setVisibility(generateReportPermission);
      this.view.flxStatement.setVisibility(downloadStatementPermission);
    }else{
      this.view.lblCommon.setVisibility(true);
      this.view.flxReport.setVisibility(false);
      this.view.flxStatement.setVisibility(false);
      this.view.segDownload.setVisibility(downloadStatementPermission);
      this.view.lblCommon.text = generateReportPermission ? "Generate Report" : "Download Statement" ;
    }
    }catch(err){
       this.setError(err, "checkPermissions");
    }

  },
  /**
	* @api : setError
	* triggered as a error call back for any service
    * @arg1: errorMsg {String} - error message
    * @arg2: method {String} - method from which error message is received
	* @return : NA
	*/
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