/**
 * Description of Module representing a Confirm form.
 * @module frmOneTimePaymentConfirmController
 */
define(['CommonUtilities', 'OLBConstants', 'ViewConstants', 'FormControllerUtility'], function(CommonUtilities, OLBConstants, ViewConstants, FormControllerUtility) {
     
    return /** @alias module:frmOneTimePaymentConfirmController */ {
        /**
         * updateFormUI - the entry point method for the form controller.
         * @param {Object} uiDataMap - it contains the set of view properties and keys.
         */
        profileAccess: "",
        updateFormUI: function(uiDataMap) {
            if (uiDataMap.isLoading === true) {
                FormControllerUtility.showProgressBar(this.view);
            } else if (uiDataMap.isLoading === false) {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (uiDataMap.serverError) {
                this.view.rtxDowntimeWarning.text = uiDataMap.serverError;
                this.view.flxDowntimeWarning.setVisibility(true);
                this.view.flxFormContent.forceLayout();
            }
            if (uiDataMap.payABill) {
                this.bindSingleBillPayData(uiDataMap.payABill);
                this.bindTnCData(uiDataMap.payABill.TnCcontentTransfer);
            }
        },
        init: function() {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = this.onBreakpointChange;
            this.presenter = applicationManager.getModulesPresentationController({ 'appName': 'BillPayMA', 'moduleName': 'BillPaymentUIModule' });
        },
        onBreakpointChange: function(form, width) {
            var scopeObj = this;
            FormControllerUtility.setupFormOnTouchEnd(width);
            
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
            this.view.CustomPopup.onBreakpointChangeComponent(scopeObj.view.CustomPopup, width);
            this.view.CancelPopup.onBreakpointChangeComponent(scopeObj.view.CancelPopup, width);
        },
        preShow: function() {
            this.profileAccess = applicationManager.getUserPreferencesManager().profileAccess;
            this.view.customheadernew.activateMenu("Bill Pay", "Make One Time Payment");
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['flxHeader', 'flxFooter']);
            this.view.imgCloseWarning.toolTip = kony.i18n.getLocalizedString("i18n.common.close");
            this.view.btnTermsAndConditions.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.TermsAndConditions");
            this.view.btnConfirm.toolTip = kony.i18n.getLocalizedString("i18n.common.confirm");
            this.view.btnModify.toolTip = kony.i18n.getLocalizedString("i18n.common.modifiy");
            this.view.btnCancel.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
            this.view.imgClose.toolTip = kony.i18n.getLocalizedString("i18n.common.close");
          this.view.rtxTC.setVisibility(!CommonUtilities.isMirrorLayoutEnabled())
            this.view.rtxTCArabic.setVisibility(CommonUtilities.isMirrorLayoutEnabled())

        },
        postShow: function() {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
        },
        /**
         * bind one time billPay Data values
         * @param {object} data
         */
        bindSingleBillPayData: function(data) {
            var scopeObj = this;
            var transactionCurrency = applicationManager.getFormatUtilManager().getCurrencySymbol(data.transactionCurrency);
            if (data.statusOfDefaultAccountSetUp === true) {
                scopeObj.view.flxWarning.setVisibility(true);
                CommonUtilities.setText(this.view.lblWarning, data.defaultAccountBillPay + kony.i18n.getLocalizedString("i18n.billPay.setDefaultPopUpConfirmBillPayee"), CommonUtilities.getaccessibilityConfig());
            } else {
                scopeObj.view.flxWarning.setVisibility(false);
            }
            this.view.imgCloseWarning.onTouchEnd = function() {
                scopeObj.view.flxWarning.setVisibility(false);
                scopeObj.view.forceLayout();
            };
            CommonUtilities.setText(scopeObj.view.lblFromValue, data.payFrom, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblToValue, data.payeeName, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblAmountKey, kony.i18n.getLocalizedString("i18n.transfers.lblAmount") + "(" + transactionCurrency + ")" +":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblAmountValue, data.amount, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPaymentDateValue, data.sendOn, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblDeliverByValue, data.deliveryDate, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblFrequencyValue, data.frequencyType, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblNotesValue, data.notes, CommonUtilities.getaccessibilityConfig());
            //if(applicationManager.getConfigurationManager().isCombinedUser === "true"){
            if (this.profileAccess === "both") {
                this.view.flxFromIcon.setVisibility(true);
                //this.view.flxToIcon.setVisibility(true);
                //this.view.lblToIcon.setVisibility(true);
                this.view.lblFromIcon.setVisibility(true);
                this.view.lblFromIcon.text = scopeObj.presenter.isBusinessAccount(data.fromAccountNumber) === "true" ? "r" : "s";
            }
            scopeObj.view.btnCancel.onClick = function() {
                scopeObj.showCancelPopup();
            };
            scopeObj.view.btnModify.onClick = function () {
                kony.mvc.getNavigationManager().navigate({
                    context: this,
                    callbackModelConfig: {
                        oneTimePayment: true
                    }
                });
            }.bind(this);
            scopeObj.view.btnConfirm.onClick = function() {
                if ((data.gettingFromOneTimePayment && CommonUtilities.isCSRMode()) || (data.isScheduleEditFlow && CommonUtilities.isCSRMode())) {
                    scopeObj.viewbtnConfirm.skin = CommonUtilities.disableButtonSkinForCSRMode();
                    scopeObj.view.btnConfirm.hoverSkin = CommonUtilities.disableButtonSkinForCSRMode();
                    scopeObj.view.btnConfirm.focusSkin = CommonUtilities.disableButtonSkinForCSRMode();
                } else {
                    FormControllerUtility.showProgressBar(this.view);
                    data.languageAmount = data.amount;
                    var deformatedAmount = this.deformatAmount(data.amount);
                    data.amount = deformatedAmount;
                    scopeObj.presenter.checkMFAForOneTimePayment(data);
                }
            }.bind(this);
            scopeObj.view.flxContent.forceLayout();
        },
        /**
         * used to get the amount
         * @param {number} amount amount
         * @returns {number} amount
         */
        deformatAmount: function(amount) {
            return applicationManager.getFormatUtilManager().deFormatAmount(amount);
        },
        /**
         * used to bind Terms and condition data on Activation screen
         * @param {object} TnCcontent bill pay supported sccounts
         */
        bindTnCData: function(TnCcontent) {
            var scopeObj = this;
            if (TnCcontent.alreadySigned) {
                scopeObj.view.flxCheckBoxTnC.setVisibility(false);
            } else {
                CommonUtilities.disableButton(scopeObj.view.btnConfirm);
                scopeObj.view.imgCheckBox.src = ViewConstants.IMAGES.UNCHECKED_IMAGE;
                scopeObj.view.flxImgCheckBox.onClick = this.toggleCheckBox.bind(scopeObj);
                scopeObj.view.flxCheckBoxTnC.setVisibility(true);
                if (TnCcontent.contentTypeId === OLBConstants.TERMS_AND_CONDITIONS_URL) {
                    scopeObj.view.btnTermsAndConditions.onClick = function() {
                        window.open(TnCcontent.termsAndConditionsContent);
                    }
                } else {
                    scopeObj.view.btnTermsAndConditions.onClick = function() {
                        scopeObj.view.flxDialogs.setVisibility(true);
                        scopeObj.view.flxTermsAndConditionsPopUp.setVisibility(true);
                    };
                    scopeObj.view.rtxTC.text = TnCcontent.termsAndConditionsContent;
                    /*  if (document.getElementById("iframe_brwBodyTnC").contentWindow.document.getElementById("viewer")) {
                        document.getElementById("iframe_brwBodyTnC").contentWindow.document.getElementById("viewer").innerHTML = TnCcontent.termsAndConditionsContent;
                      } else {
                        if (!document.getElementById("iframe_brwBodyTnC").newOnload) {
                          document.getElementById("iframe_brwBodyTnC").newOnload = document.getElementById("iframe_brwBodyTnC").onload;
                        }
                        document.getElementById("iframe_brwBodyTnC").onload = function () {
                          document.getElementById("iframe_brwBodyTnC").newOnload();
                          document.getElementById("iframe_brwBodyTnC").contentWindow.document.getElementById("viewer").innerHTML = TnCcontent.termsAndConditionsContent;
                        };
                      } */
                }
                scopeObj.view.flxClose.onClick = function() {
                    scopeObj.view.flxDialogs.setVisibility(false);
                    scopeObj.view.flxTermsAndConditionsPopUp.setVisibility(false);
                };
            }
        },
        /**
         * used to toggle checkbox and confirm button
         */
        toggleCheckBox: function() {
            var scopeObj = this;
            if (scopeObj.view.imgCheckBox.src === ViewConstants.IMAGES.UNCHECKED_IMAGE) {
                scopeObj.view.imgCheckBox.src = ViewConstants.IMAGES.CHECKED_IMAGE;
                CommonUtilities.enableButton(scopeObj.view.btnConfirm);
            } else {
                scopeObj.view.imgCheckBox.src = ViewConstants.IMAGES.UNCHECKED_IMAGE;
                CommonUtilities.disableButton(scopeObj.view.btnConfirm);
            }
        },
        /**
         * show or hide cancel popup
         */
        showCancelPopup: function() {
            var scopeObj = this;
            scopeObj.view.flxDialogs.setVisibility(true);
            scopeObj.view.flxCancelPopup.setVisibility(true);
            scopeObj.view.CancelPopup.btnYes.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
                scopeObj.presenter.showBillPaymentScreen({
                    context: "BulkPayees",
                    loadBills: true
                });
            };
            scopeObj.view.CancelPopup.btnNo.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
            };
            scopeObj.view.CancelPopup.flxCross.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
            };
        },
    };
});