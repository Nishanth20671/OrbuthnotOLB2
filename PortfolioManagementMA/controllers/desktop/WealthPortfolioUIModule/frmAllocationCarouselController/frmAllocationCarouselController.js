var portfolioId = "";
define(['ViewConstants'], function(ViewConstants) {
  return {
    
    
 //Type your controller code here
  preShow: function(){
    this.view.onTouchEnd = this.onFormTouchEnd;
    var wealthModule = applicationManager.getModulesPresentationController
    ("WealthPortfolioUIModule");
    this.portfolioId=wealthModule.getPortfolioId();
    var userId = applicationManager.getUserPreferencesManager().getUserId();
    var labels=['Dec', 'Jan', 'Feb', 'March','April'];
    var data=[[-50, 25, 35,-28,42]];
    var orientationHandler = new OrientationHandler();
   //this.view.allocationCarousel.createBarChart(labels,data);
        var parm ={
          "objectServiceName": "PortfolioServicing",
          "operationName": "getAllocation",
          "objectName": "PortfolioDetails",
          "Criteria": { "portfolioId": this.portfolioId},                    
    };
      var sectorParm ={
        "objectServiceName": "PortfolioServicing",
        "operationName": "getPortfolioHoldings",
        "objectName": "PortfolioDetails",
        "Criteria" : { "portfolioId" : this.portfolioId,
                     "userId":userId,
                     "fieldOrder":"fieldOrder",
                     "navPage":"Holdings",
                     "sortBy":"description",
                     "pageSize":1000,
                     "pageOffset":0,
                     "sortOrder":"ASC",
                     "isEuro":"isEuro"}   
      
    };
    this.view.allocationCarousel.setServiceParm(parm,sectorParm);
    },
    onFormTouchEnd:function(){
     var currFormObj = kony.application.getCurrentForm();
       if (currFormObj.customheadernew.flxContextualMenu.isVisible === true) {  
    setTimeout(function() {
     currFormObj.customheadernew.flxContextualMenu.setVisibility(false);
     currFormObj.customheadernew.flxTransfersAndPay.skin = ViewConstants.SKINS.BLANK_SKIN_TOPMENU;
      currFormObj.customheadernew.imgLblTransfers.text = "O";
      }, "17ms")
                                                                            }
     }
  };
 });
