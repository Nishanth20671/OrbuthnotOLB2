define({
  keypadString: '0.00',
  isPeriodUsed: false,
  timerCounter: 0,
  init : function(){
    var navManager = applicationManager.getNavigationManager();
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
  },
  preShow: function() {
    if (applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone") {
      this.view.flxHeader.isVisible = false;
    }
    var navManager = applicationManager.getNavigationManager();
    var data = navManager.getCustomInfo({"appName" : "AccAggregationMA", "friendlyName" : "ExternalAccountsUIModule/frmBankLogin"});
    var url=data.connect_url;
    var urlConf = {
      URL: url, 
      requestMethod:"GET"
    };
    this.view.brwInline.requestURLConfig =urlConf;
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().logFormName(currentForm);
    applicationManager.getPresentationUtility().dismissLoadingScreen();
  },
  initActions: function() {
    this.view.customHeader.flxBack.onClick = function() {
      var navMan=applicationManager.getNavigationManager();
      navMan.goBack();
    };
    this.view.brwInline.handleRequest = handleRequestCallback;
  },
  handleRequestCallback: function(browserWidget,params)
  {
    kony.print("handleRequest event triggered");
    kony.print(params);
    kony.print("Original URL" + params ["originalURL"]);
    kony.print("Request Method" + params ["requestMethod"]);
    kony.print("Header" + JSON.stringify(params["header"]));

    //Ignore this request and continue loading other URLs.
    //   return false; //If false is returned, platform will load the originalurl in the browser widget.

  }
});