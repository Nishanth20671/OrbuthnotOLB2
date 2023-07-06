define([], function() {

  return{
    onNavigate:function(){
      this.view.preShow = this.preShow;
      this.initActions();
    },
    
    preShow:function(){
      var navManager = applicationManager.getNavigationManager();
      this.view.flxAdditionalOptions.setVisibility(false);
      this.view.flxButton.setVisibility(true);
      var data = navManager.getCustomInfo('frmChangeStrategy');
      //[IW-3846 - Sarah]
      var rev = navManager.getCustomInfo('frmRevSuitability');
      this.view.title = "Acknowledgement";
      if(rev === true){
        this.view.lblActiveStatus.text = "Your strategy is " + data;
        navManager.setCustomInfo("frmRevSuitability", false);
      }
      else{
      this.view.lblActiveStatus.text = "Your new strategy is " + data;
      }
      //code added till here
      if (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone") {
      this.view.flxHeader.isVisible = true;
        this.view.customHeader.flxSearch.isVisible = true;
        this.view.customHeader.imgSearch.src = "morewhite.png";
        this.view.customHeader.btnRight.isVisible = false;
    } else {
      this.view.flxHeader.isVisible = false;
    }
    },
    
    initActions:function(){
      this.view.btnReviewStrategy.onClick = this.navToReview;
      this.view.btnChangeStrategy.onClick = this.navToChangeStr;
      this.view.customHeader.imgSearch.onTouchEnd = this.setUpActionSheet;
      //this.view.customHeader.btnRight.onClick = this.setUpActionSheet;
    },
    
    navToReview:function(){
      var navManager = applicationManager.getNavigationManager();
      navManager.navigateTo("frmStrategyAllocation");
    },
    
    navToChangeStr:function(){
      var navManager = applicationManager.getNavigationManager();
      navManager.navigateTo("frmChangeStrategy");
    },
    
    setUpActionSheet: function() {
      /*
      this.view.flxButton.setVisibility(false);
      this.view.lblPerformance.text =  "Download";
      //this.view.flxPerformance.onTouchEnd = this.onClickDownloadTxns;
      this.view.flxCancelOption.onTouchEnd = this.onClickCancel;
      this.view.flxAdditionalOptions.isVisible = true;
      */
  },

  /*onClickDownloadTxns: function() {
    this.view.flxAdditionalOptions.isVisible = false;
    alert("Downloaded Strategy");
  },*/
  
  onClickCancel: function() {
    this.view.flxButton.setVisibility(true);
    this.view.flxAdditionalOptions.isVisible = false;
  },
    
  }
  
});