define(['CommonUtilities'], function(CommonUtilities) {

  return{

    onNavigate: function(){
      this.view.postShow = this.postShow;
    },

    postShow: function(){
      if(applicationManager.getPresentationFormUtility().getDeviceName()==="iPhone"){
        this.view.flxHeader.setVisibility(false);
        this.view.flxContent.top = "0dp";
      }
      this.initActions();

      var reqParams = {
        "portfolioId": applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId,
        "portfolioServiceType": "Advisory"
      } ;
     
      this.view.strategyAllocation.setContext(reqParams);

      //       var portfolioId = applicationManager.getModulesPresentationController("WealthPortfolioUIModule").portfolioId;

      //       let params = 
      //           {
      //             "portfolioId": portfolioId,
      //             "portfolioServiceType": "Advisory",
      //             "navPage": "Portfolio"
      //           };
      //       this.view.AllocationCheck.setContext(params);

    },

    initActions: function(){
      this.view.customHeader.flxBack.onClick =this.backOnClick; 
    },


    backOnClick: function(){
      var navigationMan = applicationManager.getNavigationManager();
      navigationMan.goBack();
    },

  }
});