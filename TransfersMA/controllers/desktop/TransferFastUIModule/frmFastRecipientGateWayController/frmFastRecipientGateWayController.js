define(['FormControllerUtility', 'CommonUtilities', 'ViewConstants', 'OLBConstants', 'CampaignUtility'], function (FormControllerUtility, CommonUtilities, ViewConstants, OLBConstants, CampaignUtility) {
     
    return {
        init: function () {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function () { };
            this.view.onBreakpointChange = this.onBreakpointChange;
            this.view.btnDBXAccountkProceed.toolTip = kony.i18n.getLocalizedString("i18n.common.proceed");
            this.view.btnExternalAccountProceed.toolTip = kony.i18n.getLocalizedString("i18n.common.proceed");
            this.view.btnInternationalAccountlProceed.toolTip = kony.i18n.getLocalizedString("i18n.common.proceed");
            this.view.btnRecipientrProceed.toolTip = kony.i18n.getLocalizedString("i18n.common.proceed");
            this.view.btnActivatePayAPersonProceed.toolTip = kony.i18n.getLocalizedString("i18n.PayAPerson.activatePayAPerson");
            var scopeObj = this;
            scopeObj.transfersFastPresentationController = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("TransferFastUIModule").presentationController;
            scopeObj.view.flxDBXAccount.onTouchStart = function () {
                scopeObj.transfersFastPresentationController.showTransferScreen({
                    initialView: "addDBXAccount"
                });
            };
            scopeObj.view.flxExternalAccount.onTouchStart = function () {
                scopeObj.transfersFastPresentationController.showTransferScreen({
                    initialView: "addExternalAccount"
                });
            };
            scopeObj.view.flxInternationalAccount.onTouchStart = function () {
                scopeObj.transfersFastPresentationController.showTransferScreen({
                    initialView: "addInternationalAccount"
                });
            };
            scopeObj.view.flxRecipient.onTouchStart = function () {
                scopeObj.transfersFastPresentationController.showTransferScreen({
                    initialView: "addRecipient"
                });
            };
            scopeObj.view.btnActivatePayAPersonProceed.onClick = function () {
                scopeObj.transfersFastPresentationController.showTransferScreen({
                    activateRecipient: true
                });
            }
        },
        preShow: function () {
            var scopeObj = this;
            var payApersonEligibility = applicationManager.getUserPreferencesManager().checkP2PEligibilityForUser();
            if (applicationManager.getConfigurationManager().checkUserPermission("P2P_VIEW")) {
                if (payApersonEligibility !== 'Activated' && applicationManager.getConfigurationManager().checkUserPermission("P2P_ACTIVATE")) {
                    scopeObj.view.flxRecipient.setVisibility(false);
                    scopeObj.view.flxActivatePayAPerson.setVisibility(true);
                } else if (payApersonEligibility === 'Activated' && applicationManager.getConfigurationManager().checkUserPermission("P2P_CREATE_RECEPIENT")) {
                    scopeObj.view.flxRecipient.setVisibility(true);
                    scopeObj.view.flxActivatePayAPerson.setVisibility(false);
                }
            } else {
                scopeObj.view.flxRecipient.setVisibility(false);
                scopeObj.view.flxActivatePayAPerson.setVisibility(false);
            }
            scopeObj.view.customheadernew.activateMenu("FASTTRANSFERS", "Add Infinity Accounts");
            CampaignUtility.fetchPopupCampaigns();
            scopeObj.view.forceLayout();
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['flxHeader', 'flxFooter', 'flxMain']);
        },
        postShow: function () {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
            applicationManager.executeAuthorizationFramework(this);
        },
        onBreakpointChange: function (form, width) {
            var scope = this;
            FormControllerUtility.setupFormOnTouchEnd(width);
           
            this.view.customheadernew.onBreakpointChangeComponent();
            this.view.customfooternew.onBreakpointChangeComponent();
            this.view.CustomPopup.onBreakpointChangeComponent(scope.view.CustomPopup, width);
        },
        /**
         * updateFormUI - the entry point method for the form controller.
         * @param {Object} viewModel - it contains the set of view properties and keys.
         */
        updateFormUI: function (viewModel) {
            if (viewModel.isLoading === true) {
                FormControllerUtility.showProgressBar(this.view);
            } else if (viewModel.isLoading === false) {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (viewModel.campaign) {
                CampaignUtility.showCampaign(viewModel.campaign, this.view, "flxMain");
            }
        },
        showInternalAccFlx: function () {
            this.view.flxDBXAccount.setVisibility(true);
        },
        hideInternalAccFlx: function () {
            this.view.flxDBXAccount.setVisibility(false);
        },
        showExternalAccFlx: function () {
            this.view.flxExternalAccount.setVisibility(true);
        },
        hideExternalAccFlx: function () {
            this.view.flxExternalAccount.setVisibility(false);
        },
        showInternationalAccFlx: function () {
            this.view.flxInternationalAccount.setVisibility(true);
        },
        hideInternationalAccFlx: function () {
            this.view.flxInternationalAccount.setVisibility(false);
        }
    };
});