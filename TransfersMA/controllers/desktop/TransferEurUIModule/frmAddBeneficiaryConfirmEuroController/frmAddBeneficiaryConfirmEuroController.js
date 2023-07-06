define(['FormControllerUtility', 'CommonUtilities', 'ViewConstants', 'OLBConstants'], function(FormControllerUtility, CommonUtilities, ViewConstants, OLBConstants) {
     
 	return {
        init: function() {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = this.onBreakpointChange;
            this.euroPresenter =   applicationManager.getModulesPresentationController({"appName" : "TransfersMA", "moduleName" : "TransferEurUIModule"});
            this.ManageActivitiesPresenter = applicationManager.getModulesPresentationController({"appName" : "TransfersMA", "moduleName" : "ManageActivitiesUIModule"});
        },
        onBreakpointChange: function(form, width) {
            var scope = this;
            this.view.CustomPopupLogout.onBreakpointChangeComponent(scope.view.CustomPopupLogout, width);
            this.view.CustomPopupCancel.onBreakpointChangeComponent(scope.view.CustomPopupCancel, width);
            FormControllerUtility.setupFormOnTouchEnd(width);
           
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
        },
        preShow: function() {
            this.view.customheadernew.activateMenu("EUROTRANSFERS", "Manage Beneficiaries");
            this.view.btnConfirm.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Confirm");
            this.view.btnModify.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Modify");
            this.view.btnCancel.toolTip = kony.i18n.getLocalizedString("i18n.unifiedBeneficiary.Cancel");
        },
        postShow: function() {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.frame.height - this.view.flxFooter.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
        },
        /**
         * updateFormUI - the entry point method for the form controller.
         * @param {Object} viewModel - it contains the set of view properties and keys.
         */
        updateFormUI: function(viewModel) {
            if (viewModel.isLoading === true) {
                FormControllerUtility.showProgressBar(this.view);
            } else if (viewModel.isLoading === false) {
                FormControllerUtility.hideProgressBar(this.view);
            } else {
                this.setBeneficiaryData(viewModel);
            }
        },
        /**
         * Method to set beneficiary data for confirmation
         * @param {Object} data beneficiary data
         */
        setBeneficiaryData: function(data) {
            var scopeObj = this;
            scopeObj.setFormattedAddress(data);
            var payment_method;
            if ((data.isInternationalAccount === false || data.isInternationalAccount === "false") && (data.isSameBankAccount === false || data.isSameBankAccount === "false")) {
                payment_method = "Domestic";
            } else if ((data.isInternationalAccount === true || data.isInternationalAccount === "true") && (data.isSameBankAccount === false || data.isSameBankAccount === "false")) {
                payment_method = "International";
            } else if ((data.isInternationalAccount === false || data.isInternationalAccount === "false") && (data.isSameBankAccount === true || data.isSameBankAccount === "true")) {
                payment_method = "Within Bank";
            }
            var bankDetails = "-";
            if (data.bankName || data.bankCountry) {
                bankDetails = [data.bankName, data.bankCountry].filter(function(string) {
                    if (string) {
                        return true;
                    }
                    return false;
                }).join(', ');
            }
            if (data.isSameBankAccount || JSON.parse(data.isSameBankAccount)) {
                scopeObj.view.flxSwiftCode.setVisibility(false);
                scopeObj.view.flxBank.setVisibility(false);
            } else {
                scopeObj.view.flxSwiftCode.setVisibility(true);
                scopeObj.view.flxBank.setVisibility(true);
            }
            CommonUtilities.setText(scopeObj.view.lblAccountNumberValue, data.accountNumber, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblSwiftCodeValue, data.swiftCode ? data.swiftCode : "-", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblBankValue, bankDetails, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblNameValue, data.beneficiaryName, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblNicknameValue, data.nickName ? data.nickName : "-", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPhoneNumberValue, data.phone ? data.phone : "-", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblEmailAddressValue, data.email ? data.email : "-", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPaymentMethodKey, kony.i18n.getLocalizedString("i18n.TransfersEur.PaymentMethod"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPaymentMethodValue, payment_method, CommonUtilities.getaccessibilityConfig());
            scopeObj.view.forceLayout();
            scopeObj.view.btnCancel.onClick = function() {
                scopeObj.showCancelPopup(data.isEdit);
            };
            scopeObj.view.btnConfirm.onClick = function() {
                if (scopeObj.view.flxContractsComponent.isVisible) {
                    data.cif = scopeObj.view.screenConfirm.createCIFDataForAddBenificiary(scopeObj.view.screenConfirm.segContracts.data);
                    data.cifSegData = scopeObj.view.screenConfirm.segContracts.data;
                }
                scopeObj.euroPresenter.addBeneficiaryDetails(data, "frmAddBeneficiaryAcknowledgementEuro");
            };
            if (data.isEdit) {
                scopeObj.view.lblAddBeneficiary.text = kony.i18n.getLocalizedString("i18n.TransfersEur.EditBeneficiary");
                scopeObj.view.btnConfirm.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.Save");
                scopeObj.view.btnConfirm.onClick = function() {
                    scopeObj.euroPresenter.saveChangedBeneficiaryDetails(data, data.editedField);
                    data.cifSegData = scopeObj.view.screenConfirm.segContracts.data;
                };
            } else {
                scopeObj.view.lblAddBeneficiary.text = kony.i18n.getLocalizedString("i18n.TransfersEur.AddNewBeneficiary");
                scopeObj.view.btnConfirm.text = kony.i18n.getLocalizedString("i18n.transfers.Confirm");
                scopeObj.view.btnConfirm.onClick = function() {
                    if (scopeObj.view.flxContractsComponent.isVisible) {
                        data.cif = scopeObj.view.screenConfirm.createCIFDataForAddBenificiary(scopeObj.view.screenConfirm.segContracts.data);
                        data.cifSegData = scopeObj.view.screenConfirm.segContracts.data;
                    }
                    scopeObj.euroPresenter.addBeneficiaryDetails(data, "frmAddBeneficiaryAcknowledgementEuro");
            };
            }

          	scopeObj.view.btnModify.onClick = function() {
            	scopeObj.euroPresenter.showView("frmAddBeneficiaryEuro", {
              		"modifyBeneficiary": data
            	});
            // applicationManager.getNavigationManager().navigateTo("frmAddBeneficiaryEuro");
          };
            if (data.contractsData && data.contractsData.length > 0) {
                scopeObj.view.flxContractsComponent.setVisibility(true);
				scopeObj.view.flxButtons.top = "0dp";
				scopeObj.view.flxHorizontalLine2.width = "100%";
                scopeObj.setContractsData(data.contractsData);
            } else {
				scopeObj.view.flxButtons.top = "30dp";
				scopeObj.view.flxHorizontalLine2.width = "96%";
                scopeObj.view.flxContractsComponent.setVisibility(false)
            }
        },

        setContractsData: function(data) {
            this.view.screenConfirm.setConfirmScreenContractsData(data);
        },
        /**
         * Method to set formatted beneficiary address
         * @param {Object} data - beneficiary data
         */
        setFormattedAddress: function(data) {
            var scopeObj = this;
            if (!data.addressLine1 && !data.addressLine2 && !data.city && !data.zipcode && !data.country) {
                scopeObj.view.lblAddress1.setVisibility(true);
                scopeObj.view.lblAddress2.setVisibility(false);
                scopeObj.view.lblAddress3.setVisibility(false);
                CommonUtilities.setText(scopeObj.view.lblAddress1, "-", CommonUtilities.getaccessibilityConfig());
                return;
            }
            if (!data.addressLine1) {
                scopeObj.view.lblAddress1.setVisibility(false);
            } else {
                scopeObj.view.lblAddress1.setVisibility(true);
                CommonUtilities.setText(scopeObj.view.lblAddress1, data.addressLine1, CommonUtilities.getaccessibilityConfig());
            }
            if (!data.addressLine2) {
                scopeObj.view.lblAddress2.setVisibility(false);
            } else {
                scopeObj.view.lblAddress2.setVisibility(true);
                CommonUtilities.setText(scopeObj.view.lblAddress2, data.addressLine2, CommonUtilities.getaccessibilityConfig());
            }
            if (!data.city && !data.zipcode && !data.country) {
                scopeObj.view.lblAddress3.setVisibility(false);
            } else {
                scopeObj.view.lblAddress3.setVisibility(true);
                var strings = [data.city, data.country, data.zipcode];
                CommonUtilities.setText(scopeObj.view.lblAddress3, strings.filter(function(string) {
                    if (string) {
                        return true;
                    }
                    return false;
                }).join(', '), CommonUtilities.getaccessibilityConfig());
            }
            scopeObj.view.forceLayout();
        },
        /**
         * show or hide cancel popup
         */
        showCancelPopup: function(isEdit) {
            var scopeObj = this;
            scopeObj.view.flxDialogs.setVisibility(true);
            scopeObj.view.flxCancelPopup.setVisibility(true);
            if (isEdit === true) {
                scopeObj.view.CustomPopupCancel.lblPopupMessage.text = kony.i18n.getLocalizedString("i18n.payments.editingBeneficiary");
            } else {
                scopeObj.view.CustomPopupCancel.lblPopupMessage.text = kony.i18n.getLocalizedString("i18n.TransfersEur.AddBeneficiaryCancelMessage");
            }
            scopeObj.view.CustomPopupCancel.btnYes.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
                scopeObj.ManageActivitiesPresenter.showTransferScreen({
                    context: "ManageBeneficiaries"
                });
            };
            scopeObj.view.CustomPopupCancel.btnNo.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
            };
            scopeObj.view.CustomPopupCancel.flxCross.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
            };
        }
    };
});