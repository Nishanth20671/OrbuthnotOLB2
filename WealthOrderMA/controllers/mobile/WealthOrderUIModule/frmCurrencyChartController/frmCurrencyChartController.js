define({
  init: function () {
    var navManager = applicationManager.getNavigationManager();
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
  },
  preShow: function () {
    if(applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone"){
      this.view.customHeader.setVisibility(true);
    }
    else{
      this.view.customHeader.setVisibility(false);
    }
      this.view.investmentLineChart.currentFilter='1M';
  },

  postShow: function () {
    this.view.btnProceed.onClick = this.onSubmit;

    this.initActions();
  },

  initActions:function(){
    this.view.customHeader.flxBack.onClick = this.onBack;
    this.view.customHeader.btnRight.onClick = this.onCancel;

    this.view.btnTglConvertNow.onClick = this.onToggleConversionPreference.bind(this, 0);
    this.view.btnTglScheduleLater.onClick = this.onToggleConversionPreference.bind(this, 1);
    this.view.flxScheduleOn.onClick = this.onScheduleLater;
    var wealthMod = applicationManager.getModulesPresentationController("WealthOrderUIModule");
    let data = wealthMod.getWealthObject();

    this.setConversionData(data);
    let filterValues = Object.keys(this.chartFilters).map(key => this.chartFilters[key]);
    this.view.investmentLineChart.setChartFilters(filterValues);
    var formatUtil=applicationManager.getFormatUtilManager();
    this.view.investmentLineChart.currencySymbol = formatUtil.getCurrencySymbol(data.buyCurrency);
    this.onFilterChanged(this.view.investmentLineChart.currentFilter);
 
  },


  // Called when chart filter changed - Mapped in onFilterChange event on CHart Component
  onFilterChanged : function (filter) {
    //     var wealthMod = applicationManager.getModulesPresentationController("WealthModule");
    //     wealthMod.getHistoricalCurrencyData('USDGBP',filter);
    var wealthMod = applicationManager.getModulesPresentationController("WealthOrderUIModule");
    let data = wealthMod.getWealthObject();
    wealthMod.getHistoricalCurrencyData(data.sellCurrency+''+data.buyCurrency,filter);
  },

  setChartData : function(data) {
    this.view.investmentLineChart.setChartData(data,null,null,this.chartConfig,"CURRENCY");
  },

  extractChartData : function(data) {
    let xAxisLabels = [];
    let dataPoints = [];
    data.forEach((h,i) => {
      let key = Object.keys(h)[0];
      xAxisLabels.push(key);
      dataPoints.push(h[key]);
    });

    return {
      dataPoints,
      xAxisLabels
    };
  },

  setFilterData : function(filter,histData=null) {
    if(histData!==null) {
      let chartData = this.extractChartData(histData);
      this.view.investmentLineChart.setChartData.call(this,chartData.dataPoints,chartData.xAxisLabels,null,this.chartConfig);
    } else {
      var XaxisArray = [];
      var YaxisArray = [];
      var data = [];
      var maxVal = 0;
      if (filter === this.chartFilters.ONE_MONTH) {
        XaxisArray = ['5', '10', '15', '20', '25', '30'];
        YaxisArray = [0, 10, 20, 50, 60, 100, 120];
        data = [10, 40, 69, 90, 5, 120];
        maxVal = Math.max.apply(null,data)+20;
      }
      else if (filter === this.chartFilters.ONE_YEAR) {
        XaxisArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        YaxisArray = [0, 500, 1000, 1500, 2000, 2500, 5000];
        data = [0, 1000, 500, 2000, 1000, 5000, 2000, 2500, 1500, 2000, 1000, 500];
        maxVal = Math.max.apply(null,data)+200;
      }
      else if (filter === this.chartFilters.FIVE_YEARS) {
      }
      else if (filter === this.chartFilters.YTD) {
      }
      this.view.investmentLineChart.setChartData(data,XaxisArray,null,this.chartConfig);
    }

  },

  chartFilters: {
    ONE_MONTH:'1M',
    ONE_YEAR:'1Y',
    FIVE_YEARS:'5Y',
    YTD:'YTD',    
  },

  chartConfig : {
    lineColor : '#2F8523',
    areaColor : '#2F8523'
  },

  onToggleConversionPreference: function (option) {
    let activeSkin = 'sknBtnFFFFFFBdr10px';
    let inactiveSkin = 'sknbtn000000SSPSemiBold15px';
    var wealthMod = applicationManager.getModulesPresentationController("WealthModule");
    if (!option) {
      this.view.btnTglConvertNow.skin = activeSkin;
      this.view.btnTglScheduleLater.skin = inactiveSkin;
      this.view.flxScheduleOn.setVisibility(false);
      wealthMod.setConvertNowFlow(true);
    } else {
      this.view.btnTglConvertNow.skin = inactiveSkin;
      this.view.btnTglScheduleLater.skin = activeSkin;
      this.view.flxScheduleOn.setVisibility(true);
      wealthMod.setConvertNowFlow(false);
    }
  },

  setCurrencyBalances : function(curr1,curr2) {
    this.view.lblBalance1.text = curr1;
    this.view.lblBalance2.text = curr2;
  },

  setConversionData : function(data) {
    var wealthMod = applicationManager.getModulesPresentationController("WealthOrderUIModule");
    var dataRate = scope_WealthPresentationController.currencyRate.marketRate;
    if (dataRate){
      this.view.flxConvertedCurrency.text = dataRate + ' ' + data.buyCurrency;
    }else {
      this.view.flxConvertedCurrency.text = data.buyCurrency;
    }
    this.view.flxOrigCurrency.text = '1 '+data.sellCurrency+' equals';


    let date = new Date();
    let options = {month: 'short',hour:'numeric',minute:'numeric',timeZone:'UTC',timeZoneName:'short'};
//     let dateString = date.toLocaleDateString('en-US', options);
    let rest = date.toLocaleTimeString('en-US',options);
    var rest1=rest.split(',');
    this.view.flxConversionTimestamp.text = 'As of'+rest1[1]+' '+rest1[0]+' '+date.getUTCDate();
  },
  onScheduleLater : function () {
    var navManager = applicationManager.getNavigationManager();
    navManager.navigateTo("frmScheduleDate");
  },

  onSubmit: function () {
    var navManager = applicationManager.getNavigationManager();
    navManager.navigateTo("frmConvertCurrencyVerify");
  },

  onBack : function(){
    var navigationMan=applicationManager.getNavigationManager();
    navigationMan.goBack();
  },

  onCancel : function() {
    //var navigationMan = applicationManager.getNavigationManager();
  var nav=  new kony.mvc.Navigation({"appName" : "PortfolioManagementMA", "friendlyName" : "frmPortfolioDetails"}).navigate();
   // navigationMan.navigateTo('frmPortfolioDetails');
  },
});