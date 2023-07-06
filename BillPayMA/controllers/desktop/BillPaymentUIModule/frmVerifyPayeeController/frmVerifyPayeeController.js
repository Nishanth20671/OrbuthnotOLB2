define(['FormControllerUtility', 'CommonUtilities', 'ViewConstants', 'OLBConstants'], function(FormControllerUtility, CommonUtilities, ViewConstants, OLBConstants) {
     
    return {
        profileAccess: "",
        init: function() {
            var scopeObj = this;
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.initActions();
            this.view.onBreakpointChange = function() {
                scopeObj.onBreakpointChange(kony.application.getCurrentBreakpoint());
            };
        },
        preShow: function() {
            this.profileAccess = applicationManager.getUserPreferencesManager().profileAccess;
            this.view.customheadernew.activateMenu("Bill Pay", "Add Payee");
            this.view.CustomPopupCancel.btnYes.onClick = this.viewallpayeesbtnaction;
            this.view.CustomPopupCancel.btnNo.onClick = this.hideCancelPopup;
            this.view.CustomPopupCancel.flxCross.onClick = this.hideCancelPopup;
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['flxHeader', 'flxFooter']);
            this.view.btnConfirm.toolTip = kony.i18n.getLocalizedString("i18n.common.confirm");
            this.view.btnModify.toolTip = kony.i18n.getLocalizedString("i18n.common.modifiy");
            this.view.btnCancel.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
        },
        postShow: function() {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
        },
        initActions: function() {
            this.presenter = applicationManager.getModulesPresentationController({ 'appName': 'BillPayMA', 'moduleName': 'BillPaymentUIModule' });
        },
        onBreakpointChange: function(form, width) {
            var scopeObj = this;
            FormControllerUtility.setupFormOnTouchEnd(width);
            
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
            this.view.CustomPopupLogout.onBreakpointChangeComponent(scopeObj.view.CustomPopupLogout, width);
            this.view.CustomPopupCancel.onBreakpointChangeComponent(scopeObj.view.CustomPopupCancel, width);
        },
        /** updates the present Form based on required function.
         * @param {list} viewModel used to load a view
         */
        updateFormUI: function(viewModel) {
            if (viewModel.isLoading === true) {
                FormControllerUtility.showProgressBar(this.view);
            } else if (viewModel.isLoading === false) {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (viewModel.payeeConfirmDetails) {
                this.prePopulateConfirmPayeeDetails(viewModel.payeeConfirmDetails, viewModel.frm);
            }
        },
        /**
         * used to show the payee details  screen on confirmation screen
         * @param {object} completePayeeDetails payee details
         */
        prePopulateConfirmPayeeDetails: function(completePayeeDetails, frm) {
            var scopeObj = this;
            CommonUtilities.setText(scopeObj.view.lblBillerValue, completePayeeDetails.billerName, CommonUtilities.getaccessibilityConfig());
            scopeObj.view.rtxBillerAddress.text = completePayeeDetails.billerAddress;
            if (completePayeeDetails.accountNumber === "") {
                CommonUtilities.setText(scopeObj.view.lblBillerAccNumValue, kony.i18n.getLocalizedString("i18n.common.NotAvailable"), CommonUtilities.getaccessibilityConfig());
            } else {
                CommonUtilities.setText(scopeObj.view.lblBillerAccNumValue, completePayeeDetails.accountNumber, CommonUtilities.getaccessibilityConfig());
            }
            CommonUtilities.setText(scopeObj.view.lblNicknameValue, completePayeeDetails.payeeNickName, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblNameOnBillValue, completePayeeDetails.nameOnBill, CommonUtilities.getaccessibilityConfig());
            //if(applicationManager.getConfigurationManager().isCombinedUser === "true"){
            if (this.profileAccess === "both") {
                scopeObj.view.lblIcon.setVisibility(true);
                scopeObj.view.flxIcon.setVisibility(false);
                //this.view.lblIcon
                if (completePayeeDetails.isBusinessPayee === "1") { //kony.i18n.getLocalizedString("i18n.Enroll.PersonalBanking")){
                    CommonUtilities.setText(scopeObj.view.lblIcon, "r");
                } else {
                    CommonUtilities.setText(scopeObj.view.lblIcon, "s");
                }
            }
            scopeObj.view.btnCancel.onClick = function() {
                scopeObj.showCancelPopup();
            };
            scopeObj.view.btnModify.onClick = function () {
                kony.mvc.getNavigationManager().navigate({
                    context: this
                });
            }.bind(this);
            scopeObj.view.btnConfirm.onClick = function() {
                if (scopeObj.view.flxContractsComponent.isVisible) {
                    scopeObj.cif = scopeObj.view.screenConfirm.createCIFDataForAddBenificiary(scopeObj.view.screenConfirm.segContracts.data);
                    scopeObj.cifSegData = scopeObj.view.screenConfirm.segContracts.data;
                } else {
                    scopeObj.cif = completePayeeDetails.cif;
                }
                scopeObj.presenter.addPayeeDetails(frm, scopeObj.cif, scopeObj.cifSegData);
            };

            if (completePayeeDetails.contractsData && completePayeeDetails.contractsData.length > 0) {
                scopeObj.view.flxContractsComponent.setVisibility(true);
				scopeObj.view.flxActions.top = "0dp";
				scopeObj.view.flxHorizontalLine.width = "100%";
                scopeObj.setContractsData(completePayeeDetails.contractsData);
            } else {
				scopeObj.view.flxActions.top = "20dp";
				scopeObj.view.flxHorizontalLine.width = "96%";
                scopeObj.view.flxContractsComponent.setVisibility(false)
            }
        },

        setContractsData: function(data) {
            this.view.screenConfirm.setConfirmScreenContractsData(data);
        },
        /**
         * show or hide cancel popup
         */
        showCancelPopup: function() {
            var scopeObj = this;
            scopeObj.view.flxDialogs.setVisibility(true);
            scopeObj.view.flxCancelPopup.setVisibility(true);
            scopeObj.view.CustomPopupCancel.btnYes.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
                scopeObj.presenter.showBillPaymentScreen({
                    context: "BulkPayees",
                    loadBills: true
                });
            };
            scopeObj.view.CustomPopupCancel.btnNo.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
            }
            scopeObj.view.CustomPopupCancel.flxCross.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
            }
        }
    };
});