/* eslint-disable */
define([],function(){
 return { 
  onNavigate: function(){
    this.view.preShow =  this.preShow;
    var navManager = applicationManager.getNavigationManager();
    var currentForm=navManager.getCurrentForm();
    applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
    
  },
  
  preShow:function(){
    this.initActions();
  },
  initActions: function(){
    
    this.view.addRemoveSearch.showVisibleSearchWatch = function(){
    var navManager = applicationManager.getNavigationManager();
        navManager.navigateTo("frmWatchlist");
    }
    this.view.addRemoveSearch.viewInstrumentDetails = function(data){
      var navManager = applicationManager.getNavigationManager();
         
      navManager.setCustomInfo("frmWatchlistsegParam", data);
        navManager.navigateTo("frmWatchlist");
    }
  },     
 };
});
