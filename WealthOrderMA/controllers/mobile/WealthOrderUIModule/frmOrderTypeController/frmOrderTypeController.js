define({
  
  init: function () {
      var scopeObj=this;
		var navManager = applicationManager.getNavigationManager();
		var currentForm = navManager.getCurrentForm();
		applicationManager.getPresentationFormUtility().initCommonActions(scopeObj, "YES", currentForm, scopeObj.navigateCustomBack);
	},
	preShow: function () {
		if (applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone") {
			this.view.flxHeader.setVisibility(false);
		}
		this.initActions();
		this.view.btnSave.onClick = this.continueOnClick;
		this.view.customHeader.flxBack.onTouchEnd = this.onBack;
		this.view.flxMarket.onClick = this.onClickMarket;
		this.view.flxLimit.onClick = this.onClickLimit;
		this.view.flxStopLoss.onClick = this.onClickStopLoss;
		this.view.flxStopLimit.onClick = this.onClickStopLimit;
	},
	
	postShow: function () {

		var navMan = applicationManager.getNavigationManager();
		var previousForm = navMan.getCustomInfo("frmInstrumentOrder");

		if (previousForm.orderType === "Market") {
			this.onClickMarket();
		} else if (previousForm.orderType === "Stop Loss") {
			this.onClickStopLoss();
		} else if (previousForm.orderType === "Stop Limit") {
			this.onClickStopLimit();
		} else {
			this.onClickLimit();
		}
	},
	onBack: function () {
// 		var navigationMan = applicationManager.getNavigationManager();
// 		navigationMan.goBack();
      var navMan = applicationManager.getNavigationManager();
navMan.navigateTo("frmInstrumentOrder");
	},
	initActions: function () {
		//To be added
	},

	onClickMarket: function () {
		this.view.flxMarket.skin = "sknflxGreen0ba407a4468e045";
		this.view.imgSelectMarket.setVisibility(true);
		this.view.flxLimit.skin = "sknflxBlueE0de121f9cae5843";
		this.view.imgSelectLimit.setVisibility(false);
		this.view.flxStopLoss.skin = "sknflxBlueE0de121f9cae5843";
		this.view.imgSelectStopLoss.setVisibility(false);
		this.view.flxStopLimit.skin = "sknflxBlueE0de121f9cae5843";
		this.view.imgSelectStopLimit.setVisibility(false);
	},
	onClickLimit: function () {
		this.view.flxMarket.skin = "sknflxBlueE0de121f9cae5843";
		this.view.imgSelectMarket.setVisibility(false);
		this.view.flxLimit.skin = "sknflxGreen0ba407a4468e045";
		this.view.imgSelectLimit.setVisibility(true);
		this.view.flxStopLoss.skin = "sknflxBlueE0de121f9cae5843";
		this.view.imgSelectStopLoss.setVisibility(false);
		this.view.flxStopLimit.skin = "sknflxBlueE0de121f9cae5843";
		this.view.imgSelectStopLimit.setVisibility(false);
	},
	onClickStopLoss: function () {
		this.view.flxMarket.skin = "sknflxBlueE0de121f9cae5843";
		this.view.imgSelectMarket.setVisibility(false);
		this.view.flxLimit.skin = "sknflxBlueE0de121f9cae5843";
		this.view.imgSelectLimit.setVisibility(false);
		this.view.flxStopLoss.skin = "sknflxGreen0ba407a4468e045";
		this.view.imgSelectStopLoss.setVisibility(true);
		this.view.flxStopLimit.skin = "sknflxBlueE0de121f9cae5843";
		this.view.imgSelectStopLimit.setVisibility(false);
	},
	onClickStopLimit: function () {
		this.view.flxMarket.skin = "sknflxBlueE0de121f9cae5843";
		this.view.imgSelectMarket.setVisibility(false);
		this.view.flxLimit.skin = "sknflxBlueE0de121f9cae5843";
		this.view.imgSelectLimit.setVisibility(false);
		this.view.flxStopLoss.skin = "sknflxBlueE0de121f9cae5843";
		this.view.imgSelectStopLoss.setVisibility(false);
		this.view.flxStopLimit.skin = "sknflxGreen0ba407a4468e045";
		this.view.imgSelectStopLimit.setVisibility(true);
	},
	continueOnClick: function () {
       scope_WealthOrderPresentationController.instrumentOrder=true;
		var orderType;
		var navManager = applicationManager.getNavigationManager();
		if (this.view.imgSelectMarket.isVisible == true) {
			orderType = this.view.lblMarket.text;
		} else if (this.view.imgSelectLimit.isVisible == true) {
			orderType = this.view.lblLimit.text;
		} else if (this.view.imgSelectStopLoss.isVisible == true) {
			orderType = this.view.lblStopLoss.text;
		} else {
			orderType = this.view.lblStopLimit.text;
		}
		var orderTypeDetails = navManager.getCustomInfo("frmInstrumentOrder");
		orderTypeDetails.orderType = orderType;
        if(orderTypeDetails.orderModeType !== undefined || orderTypeDetails.orderModeType !== null){
            orderTypeDetails.orderModeType = orderType;
        }
		navManager.setCustomInfo("frmInstrumentOrder", orderTypeDetails);
		navManager.navigateTo('frmInstrumentOrder');
	}

});
