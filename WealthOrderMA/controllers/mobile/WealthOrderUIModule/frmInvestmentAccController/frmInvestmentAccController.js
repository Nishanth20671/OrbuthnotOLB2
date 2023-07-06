define(['CommonUtilities'],function(CommonUtilities){
  return{
  preShow: function () {
    if (applicationManager.getPresentationFormUtility().getDeviceName() === "iPhone") {
      this.view.flxHeader.setVisibility(false);
    }
    var navigationMan = applicationManager.getNavigationManager();
    var data = {};
    data =  navigationMan.getCustomInfo('frmUnifiedDashboard');
    var temp = data.response;
    this.loadInvestmentAccounts(temp.PortfolioList);
   },
  init: function () {
    var navManager = applicationManager.getNavigationManager();
    var currentForm = navManager.getCurrentForm();
     applicationManager.getPresentationFormUtility().initCommonActions(this,"YES",currentForm);
  
   },
  postShow: function () {
     this.initActions();
   
  //scope_WealthPresentationController.instrumentAcc=true;
  },
  onBack: function () {
   var navMan = applicationManager.getNavigationManager();
     navMan.navigateTo("frmPlaceOrder");
  },
 initActions: function() {
        this.view.segInvestmentAccounts.onRowClick = this.onInvestmentClick;
    this.view.customHeader.flxBack.onTouchEnd = this.onBack;
  
    },
    loadInvestmentAccounts: function(respData) {
        var investmentAccData = [];
        var dataFromResponse = respData.portfolioList;
        for (var list in dataFromResponse) {
            var storeData;
            var forUtility = applicationManager.getFormatUtilManager();
            var maskAccountName = CommonUtilities.truncateStringWithGivenLength(dataFromResponse[list].accountName + "....", 26) + CommonUtilities.getLastFourDigit(dataFromResponse[list].accountNumber);
            var profitLossAmount = forUtility.formatAmountandAppendCurrencySymbol(dataFromResponse[list].unRealizedPLAmount, dataFromResponse[list].referenceCurrency);
            var accountBal = forUtility.formatAmountandAppendCurrencySymbol(dataFromResponse[list].marketValue, dataFromResponse[list].referenceCurrency);
          if(scope_WealthPresentationController.isTapIntegration || dataFromResponse[list].unRealizedPLPercentage === "" || dataFromResponse[list].unRealizedPLPercentage === undefined){
            var plAmt = profitLossAmount;
          }
          else{
            if (dataFromResponse[list].unRealizedPL === "L"){
              plAmt = "-" + profitLossAmount + "(" + dataFromResponse[list].unRealizedPLPercentage + "%" + ")"
            }
            else{
              plAmt = "+" + profitLossAmount + "(" + dataFromResponse[list].unRealizedPLPercentage + "%" + ")"
            }
          }
			if(dataFromResponse[list].investmentType === "Advisory"){
            continue;
          }else{
            if (dataFromResponse[list].unRealizedPL === "L") {
                storeData = {
                    accountName: maskAccountName,
                    profitLossAmt: {
                        "skin": "sknIblEE0005SSPsb45px",
                        "text": plAmt
                    },
                    accountBalance: accountBal,
                    imageAccountType: {
                        "src": "personalaccount.png",
                        isVisible: true
                    },
                    imageBank: {
                        isVisible: false
                    },
                     accountType: "Investment",
                    portfolioId:dataFromResponse[list].portfolioId,
                    isJoint:  {isVisible: JSON.parse(dataFromResponse[list].isJointAccount)}
                }
            } else {
                storeData = {
                    accountName: maskAccountName,
                    profitLossAmt: {
                        "skin": "sknIbl2f8523SSPsb45px",
                        "text": plAmt
                    },
                    accountBalance: accountBal,
                    imageAccountType: {
                        "src": "personalaccount.png",
                        isVisible: true
                    },
                    imageBank: {
                        isVisible: false
                    },
                     accountType: "Investment",
                  portfolioId:dataFromResponse[list].portfolioId,
                  isJoint: {isVisible: JSON.parse(dataFromResponse[list].isJointAccount)}
                }
			}
           }
            investmentAccData.push(storeData);
        }
        this.view.segInvestmentAccounts.widgetDataMap = {
            lblAccountName: "accountName",
            lblAccountBal: "profitLossAmt",
            lblAccountBalValue: "accountBalance",
            imgAccountType: "imageAccountType",
            flxBankIcon: "imageBank",
            lblBankName: "accountType",
            dummylbl:"portfolioId",
            lblJoint: "isJoint"
        };
        this.view.segInvestmentAccounts.data = investmentAccData;
    },
    onInvestmentClick: function() {
        var rowIndex = this.view.segInvestmentAccounts.selectedRowIndex[1];
        var rowData = this.view.segInvestmentAccounts.data[rowIndex];
      scope_WealthPresentationController.isJointAccount = rowData.isJoint.isVisible;
    //    var wealthMod = applicationManager.getModulesPresentationController("WealthModule");
      scope_WealthPresentationController.instrumentAcc=true;
       var navMan = applicationManager.getNavigationManager();
      
       var data = navMan.getCustomInfo('frmInvestmentAcc');
       // var accName = data.lblAccountName;
       // var accBal = data.lblAccountBalValue;
      if(kony.sdk.isNullOrUndefined(data)){
        var data={};
        data.lblAccountName=rowData.accountName;
        data.portfolioId = rowData.portfolioId;

      }else{
         data.lblAccountName = rowData.accountName;
         data.portfolioId = rowData.portfolioId;  
      }
      scope_WealthPresentationController.portfolioIdUpdate =  data.lblAccountName;
      navMan.setCustomInfo('frmInvestmentAcc',data);
      scope_WealthOrderPresentationController.onSelectPortfolioId=rowData.portfolioId;
        // var marketName = rowData.marketName;
        // var ricId = rowData.RICCode;
        //var prevdata = navigationMan.getCustomInfo('frmPlaceOrder');
        var params = {
            "portfolioId": rowData.portfolioId,
            "navPage": "Holdings",
            "sortBy": "description",
            "searchByInstrumentName": ""
        }
        navMan.setCustomInfo('frmInvestmentAccPortfolio',rowData.portfolioId);
        var wealthModule = applicationManager.getModulesPresentationController("WealthOrderUIModule");
        wealthModule.getHoldings(params);
    }
};
});