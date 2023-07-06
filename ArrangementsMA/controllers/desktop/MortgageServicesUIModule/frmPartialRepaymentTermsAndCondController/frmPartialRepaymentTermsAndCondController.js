define("ArrangementsMA/MortgageServicesUIModule/userfrmPartialRepaymentTermsAndCondController", ['CommonUtilities', 'ViewConstants', 'FormControllerUtility', 'OLBConstants', 'CampaignUtility'], function(CommonUtilities, ViewConstants, FormControllerUtility, OLBConstants, CampaignUtility) {

  //Type your controller code here

  var orientationHandler = new OrientationHandler();
  var mortgageAccDetails = undefined;
  var details = undefined;
  return {

    frmPreShow: function() {
      var navMan = applicationManager.getNavigationManager();
      var scope = this;
      mortgageDetails = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AccountServicesUIModule",
        "appName": "ArrangementsMA"
      }).presentationController.mortgageDetails;
      mortgagePlans = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AccountServicesUIModule",
        "appName": "ArrangementsMA"
      }).presentationController.mortgagePlans;
      currAccount = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AccountsUIModule",
        "appName": "ArrangementsMA"
      }).presentationController.currentAccount;
      loanAccount = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AccountServicesUIModule",
        "appName": "ArrangementsMA"
      }).presentationController.repaymentAccount;
      val = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AccountsUIModule",
        "appName": "ArrangementsMA"
      }).presentationController.isFromMortgage;
      if (kony.application.getPreviousForm().id === "frmAccountsDetails") {
        details = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
          "moduleName": "AccountsUIModule",
          "appName": "ArrangementsMA"
        }).presentationController.accountDetails;
      } else if (val === 1) {
        //no service call
      } else {
        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
          "moduleName": "AccountsUIModule",
          "appName": "ArrangementsMA"
        }).presentationController.showMortgageAccountDetails(loanAccount);
      }
      kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AccountsUIModule",
        "appName": "ArrangementsMA"
      }).presentationController.getTermsAndConditions();
      var formTemplateContext = {
        "sessionTimeOut": {
          "timer": 4
        },
        "breadCrumbBack": {
          "flag": false
        }
      }
      if(orientationHandler.isMobile){
            this.view.formTemplate12.flxContentTCCenter.parent.parent.parent.parent.flxMain.flxPageTitleMain.isVisible = false;
       }
      this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.flxTermsAndCondition.flxTermsNoteSection.flxNoteSection2.flxNotes.flxNotes2.isVisible = false;
      this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.flxTermsAndCondition.flxTermsNoteSection.flxNoteSection2.flxNotes.flxNotes3.isVisible = false;
      this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.flxTermsAndCondition.flxTermsNoteSection.flxNoteSection2.flxNotes.flxNotes4.isVisible = false;
      this.view.formTemplate12.setContext(formTemplateContext);
      this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.imgCheckbox.src = "inactivecheckbox.png";
      this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.btnContinue.skin = "sknBtnE2E9F0radius2";
      this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.btnContinue.setEnabled(false);
      this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.btnCancel.onClick = this.backToFacility;
      if (val === 1){
        this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.btnContinue.onClick = this.navSelect;
      } else {
        this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.btnContinue.onClick = this.navSimulation;
      }
      this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.flxTerms.onClick = this.handleVisibilityOfPopup.bind(this);
      this.view.formTemplate12.flxContentPopup.flxPopUp.flxTC.flxTermsAndConditionsHeader.flxClose.onClick = function() {
        scope.view.formTemplate12.flxContentPopup.flxPopUp.setVisibility(false);
        scope.view.formTemplate12.flxContentPopup.isVisible = false;
      }
      this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.flxCheckboxImage.onClick = this.imgCheckBox.bind(this);
    },
    updateFormUI: function (uiData) {
      if (uiData) {
        if (uiData.showLoadingIndicator) {
          if (uiData.showLoadingIndicator.status === true) {
            FormControllerUtility.showProgressBar(this.view)
          } else {
            FormControllerUtility.hideProgressBar(this.view)
          }
        }
        if(uiData.TnCresponse) {
          this.view.formTemplate12.flxContentPopup.flxPopUp.flxTC.flxTCContents.rtxTC.text = uiData.TnCresponse.termsAndConditionsContent;
        }
        if (uiData.mortgageAccDetails) {
          mortgageAccDetails = uiData.mortgageAccDetails;
          this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.lblUserAccount.text = "(" + mortgageAccDetails[0].accountName + " - " + mortgageAccDetails[0].accountID.substr(-4) + ")";
        }
      }
    },
    postShow: function () {
      applicationManager.getNavigationManager().applyUpdates(this);
      if (details !== undefined) {
        this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.lblUserAccount.text = "(" + details.Accounts[0].accountName + " - " + details.Accounts[0].accountID.substr(-4) + ")";
      } else if (mortgageAccDetails !== undefined){
        this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.lblUserAccount.text = "(" + mortgageAccDetails[0].accountName + " - " + mortgageAccDetails[0].accountID.substr(-4) + ")";
      } 
      if (val === 1){
        this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.lblUserAccount.text = "(" + currAccount.accountName + " - " + currAccount.accountID.substr(-4) + ")";
      }
    },
    handleVisibilityOfPopup: function() {
      if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
        this.view.formTemplate12.flxContentPopup.flxPopUp.flxTC.width = "75%";
        this.view.formTemplate12.flxContentPopup.flxPopUp.flxTC.top = "105dp";
        this.view.formTemplate12.flxContentPopup.flxPopUp.flxTC.flxTCContents.height = "460dp";
      }
      this.view.formTemplate12.flxContentPopup.flxPopUp.setVisibility(true);
      this.view.formTemplate12.flxContentPopup.flxPopUp.flxTC.flxTCContents.setVisibility(true);
      this.view.formTemplate12.flxContentPopup.isVisible = true;
    },
    imgCheckBox: function() {
      if (this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.imgCheckbox.src == "inactivecheckbox.png") {
        this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.imgCheckbox.src = "activecheckbox.png";
        this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.btnContinue.skin = "sknBtn293276radius3";
        this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.btnContinue.setEnabled(true);
      } else {
        this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.imgCheckbox.src = "inactivecheckbox.png";
        this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.btnContinue.skin = "sknBtnE2E9F0radius2";
        this.view.formTemplate12.flxContentTCCenter.flxContentMain.flxPartialRepayment.flxPartialPaymentSection.TermsAndCondition.btnContinue.setEnabled(false);
      }
    },
    backToFacility: function () {
      var navMan = applicationManager.getNavigationManager();
            navMan.navigateTo({
                "appName": "HomepageMA",
                "friendlyName": "AccountsUIModule/frmDashboard"
            });
    },
    navSelect: function() {
      var navMan = applicationManager.getNavigationManager();
      navMan.setCustomInfo("accountModifyFlow", false);
      navMan.navigateTo({
        "appName": "ArrangementsMA",
        "friendlyName": "MortgageServicesUIModule/frmRepaymentLoanSelect"
      });
    },
    navSimulation: function () {
      var navMan = applicationManager.getNavigationManager();
      navMan.setCustomInfo("accountModifyFlow", false);
      kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AccountServicesUIModule",
        "appName": "ArrangementsMA"
      }).presentationController.repaymentAccount = loanAccount;
      if (mortgageAccDetails !== undefined) {
        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
          "moduleName": "AccountsUIModule",
          "appName": "ArrangementsMA"
        }).presentationController.mortgageAccDetails = mortgageAccDetails;
      } else {
        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
          "moduleName": "AccountsUIModule",
          "appName": "ArrangementsMA"
        }).presentationController.mortgageAccDetails = details.Accounts;
      }
      navMan.navigateTo({
        "appName": "ArrangementsMA",
        "friendlyName": "MortgageServicesUIModule/frmRepaymentSimulation"
      });
    }
  }

});