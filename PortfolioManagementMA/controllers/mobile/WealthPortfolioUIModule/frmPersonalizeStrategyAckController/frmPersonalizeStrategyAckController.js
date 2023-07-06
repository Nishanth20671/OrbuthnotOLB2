define({


  onNavigate: function(){
	this.view.preShow = this.preShow;
    this.initActions();
  },
  initActions: function(){
    this.view.customHeader.flxSearch.onClick = this.onClickFlexPopup;
    this.view.flxCancel.onClick = this.onClickCancel;
    this.view.btnReviewStrategy.onClick = this.navigateStrategyAllocation;
    this.view.btnPersonalStrategy.onClick = this.navPersonalizedStrategy;
  },

  preShow: function() 
  {
    //var navManager = applicationManager.getNavigationManager();
    //var response = navManager.getCustomInfo('frmRecommendedStrategy');
    //this.view.lblActiveStatus.text = "Your recommended strategy is" + " " +  response.recStrategyName  + " " ;
    if(applicationManager.getPresentationFormUtility().getDeviceName()==="iPhone"){
      this.view.flxHeader.setVisibility(false);
    }

  },  

  navigateStrategyAllocation: function()
  {
    var navMan = applicationManager.getNavigationManager();     
    navMan.navigateTo("frmStrategyAllocation");
  },
  navPersonalizedStrategy: function()
  {
    var navMan = applicationManager.getNavigationManager();     
    navMan.navigateTo("frmPersonalizeStrategy");
  },

  onClickFlexPopup: function()
  {
    /*
    this.view.flxAdditionalOptions.isVisible = true;
    this.view.btnReviewStrategy.isVisible= false;
    */
  },

  onClickCancel: function()
  {
    this.view.flxAdditionalOptions.isVisible = false;  
    this.view.btnReviewStrategy.isVisible= true;
  }

});