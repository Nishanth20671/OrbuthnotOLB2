define(['FormControllerUtility', 'CommonUtilities', 'ViewConstants', 'OLBConstants'], function(FormControllerUtility, CommonUtilities, ViewConstants, OLBConstants) {
     
    return {
        profileAccess: "",
        init: function() {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = this.onBreakpointChange;

            this.presenter = applicationManager.getModulesPresentationController({ 'appName': 'BillPayMA', 'moduleName': 'BillPaymentUIModule' });
        },
        responsiveViews: {},
        initializeResponsiveViews: function() {
            this.responsiveViews["flxDialogs"] = this.view.flxDialogs.isVisible;
            this.responsiveViews["flxTermsAndConditionsPopUp"] = this.view.flxTermsAndConditionsPopUp.isVisible;
        },
        onBreakpointChange: function(form, width) {
            var scopeObj = this;
            FormControllerUtility.setupFormOnTouchEnd(width);
            
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
            this.view.CustomPopup.onBreakpointChangeComponent(scopeObj.view.CustomPopup, width);
            this.view.CancelPopup.onBreakpointChangeComponent(scopeObj.view.CancelPopup, width);
            views = Object.keys(this.responsiveViews);
            views.forEach(function(e) {
                scopeObj.view[e].isVisible = scopeObj.responsiveViews[e];
            });
        },
        preShow: function() {
            this.profileAccess = applicationManager.getUserPreferencesManager().profileAccess;
            this.view.customheadernew.activateMenu("Bill Pay", "Pay A Bill");
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['flxHeader', 'flxFooter']);
            this.view.btnConfirm.toolTip = kony.i18n.getLocalizedString("i18n.common.confirm");
            this.view.btnModify.toolTip = kony.i18n.getLocalizedString("i18n.common.modifiy");
            this.view.btnCancel.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
            this.view.imgCloseWarning.toolTip = kony.i18n.getLocalizedString("i18n.common.close");
            this.view.imgClose.toolTip = kony.i18n.getLocalizedString("this.view.imgClose");
          this.view.rtxTC.setVisibility(!CommonUtilities.isMirrorLayoutEnabled())
            this.view.rtxTCArabic.setVisibility(CommonUtilities.isMirrorLayoutEnabled())
        },
        postShow: function() {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
            this.initializeResponsiveViews();
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
            }
            if (viewModel.payABill && viewModel.TnCcontentTransfer) {
                this.bindSingleBillPayData(viewModel.payABill);
                this.bindTnCData(viewModel.TnCcontentTransfer);
            }
        },
        /**
         * bind single billPay Data values
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
            if (data.frequencyType !== "Once" && data.hasHowLong === "ON_SPECIFIC_DATE" || data.frequencyType !== "Once" && data.hasHowLong === "NO_OF_RECURRENCES") {
                scopeObj.view.flxEndDate.setVisibility(true);
                CommonUtilities.setText(scopeObj.view.lblDeliverByKey, kony.i18n.getLocalizedString("i18n.billPay.DeliveryIn"), CommonUtilities.getaccessibilityConfig());
            } else {
                scopeObj.view.flxEndDate.setVisibility(false);
                CommonUtilities.setText(scopeObj.view.lblDeliverByKey, kony.i18n.getLocalizedString("i18n.billPay.DeliveryBy"), CommonUtilities.getaccessibilityConfig());
            }
            //           if(configurationManager.isCombinedUser){
            //              scopeObj.view.lblFromoIcon.isVisible = true;
            //             scopeObj.view.lblToIcon.isVisible = true;
            //           }else{
            //             scopeObj.view.lblToIcon.isVisible = false;
            //             scopeObj.view.lblFromIcon.isVisible = false;
            //           }
            CommonUtilities.setText(scopeObj.view.lblFromValue, data.payFrom, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblToValue, data.payeeName, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblAmountKey, kony.i18n.getLocalizedString("i18n.transfers.lblAmount") + "(" + transactionCurrency + ")", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblAmountValue, data.amount, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPaymentDateKey, kony.i18n.getLocalizedString("i18n.billPay.PaymentDate"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPaymentDateValue, data.sendOn, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblDeliverByValue, data.deliveryDate, CommonUtilities.getaccessibilityConfig());
            if (data.frequencyType !== "Once" && data.hasHowLong === "ON_SPECIFIC_DATE") {
                CommonUtilities.setText(scopeObj.view.lblPaymentDateKey, kony.i18n.getLocalizedString("i18n.transfers.start_date"), CommonUtilities.getaccessibilityConfig());
                CommonUtilities.setText(scopeObj.view.lblEndDateKey, kony.i18n.getLocalizedString("i18n.transfers.end_date"), CommonUtilities.getaccessibilityConfig());
                CommonUtilities.setText(scopeObj.view.lblEndDateValue, data.frequencyEndDate, CommonUtilities.getaccessibilityConfig());
            } else if (data.frequencyType !== "Once" && data.hasHowLong === "NO_OF_RECURRENCES") {
                CommonUtilities.setText(scopeObj.view.lblPaymentDateKey, kony.i18n.getLocalizedString("i18n.transfers.send_on"), CommonUtilities.getaccessibilityConfig());
                CommonUtilities.setText(scopeObj.view.lblEndDateKey, kony.i18n.getLocalizedString("i18n.transfers.lblNumberOfRecurrences"), CommonUtilities.getaccessibilityConfig());
                CommonUtilities.setText(scopeObj.view.lblEndDateValue, data.numberOfRecurrences, CommonUtilities.getaccessibilityConfig());
            }
            CommonUtilities.setText(scopeObj.view.lblFrequencyValue, data.frequencyType, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblNotesValue, data.notes, CommonUtilities.getaccessibilityConfig());
            scopeObj.view.btnCancel.onClick = function() {
                scopeObj.showCancelPopup();
            };
            scopeObj.view.btnModify.onClick = function () {
                kony.mvc.getNavigationManager().navigate({
                    context: this,
                    callbackModelConfig: {
                        payABill: true
                    }
                });
            }.bind(this);
            scopeObj.view.btnConfirm.onClick = function() {
                data.languageAmount = data.amount;
                var deformatedAmount = applicationManager.getFormatUtilManager().deFormatAmount(data.amount);
                data.amount = deformatedAmount;
                scopeObj.presenter.checkMFASingleBillPay(data);
            };
            //if(applicationManager.getConfigurationManager().isCombinedUser === "true"){
            if (this.profileAccess === "both") {
                scopeObj.view.flxFromIcon.setVisibility(true);
                scopeObj.view.flxToIcon.setVisibility(false);
                scopeObj.view.lblFromIcon.setVisibility(true);
                scopeObj.view.lblToIcon.setVisibility(true);
                CommonUtilities.setText(scopeObj.view.lblFromIcon, scopeObj.presenter.isBusinessAccount(data.fromAccountNumber) === "true" ? "r" : "s");
                CommonUtilities.setText(scopeObj.view.lblToIcon, data.isBusinessPayee === "1" ? "r" : "s");

            } else {
                scopeObj.view.flxFromIcon.setVisibility(false);
                scopeObj.view.flxToIcon.setVisibility(false);
                scopeObj.view.lblToIcon.setVisibility(false);
                scopeObj.view.lblFromIcon.setVisibility(false);
            }
            scopeObj.view.flxContent.forceLayout();
            scopeObj.view.forceLayout();
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
                        scopeObj.initializeResponsiveViews();
                    };
                    scopeObj.view.rtxTC.text = TnCcontent.termsAndConditionsContent;
                    /* if (document.getElementById("iframe_brwBodyTnC").contentWindow.document.getElementById("viewer")) {
                         document.getElementById("iframe_brwBodyTnC").contentWindow.document.getElementById("viewer").innerHTML = TnCcontent.termsAndConditionsContent;
                     } else {
                         if (!document.getElementById("iframe_brwBodyTnC").newOnload) {
                             document.getElementById("iframe_brwBodyTnC").newOnload = document.getElementById("iframe_brwBodyTnC").onload;
                         }
                         document.getElementById("iframe_brwBodyTnC").onload = function () {
                             document.getElementById("iframe_brwBodyTnC").newOnload();
                             document.getElementById("iframe_brwBodyTnC").contentWindow.document.getElementById("viewer").innerHTML = TnCcontent.termsAndConditionsContent;
                         };
                     }*/
                }
                scopeObj.view.flxClose.onClick = function() {
                    scopeObj.view.flxDialogs.setVisibility(false);
                    scopeObj.view.flxTermsAndConditionsPopUp.setVisibility(false);
                    scopeObj.initializeResponsiveViews();
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
            }
            scopeObj.view.CancelPopup.flxCross.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
            }
        }
    };
});