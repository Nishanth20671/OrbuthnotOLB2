define(['FormControllerUtility', 'CommonUtilities', 'ViewConstants', 'OLBConstants'], function(FormControllerUtility, CommonUtilities, ViewConstants, OLBConstants) {
     
    return {
        init: function() {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.ManageActivitiesPresenter = applicationManager.getModulesPresentationController({"appName" : "TransfersMA", "moduleName" : "ManageActivitiesUIModule"});
            this.euroPresenter =   applicationManager.getModulesPresentationController({"appName" : "TransfersMA", "moduleName" : "TransferEurUIModule"});
            this.view.onBreakpointChange = this.onBreakpointChange;
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
            var self = this;
			this.view.GenericMessageNew1.setVisibility(false);
			this.view.flxInsufficientFundsWarning.setVisibility(false);
            this.view.flxSupportingDocumentsValue.removeAll();
            this.view.flxSupportingDocumentsValue.setVisibility(true);
            this.view.flxPaymentActivities.onClick = function() {
                self.ManageActivitiesPresenter.showTransferScreen({
                    context: "ScheduledPayments"
                });
            };
            this.view.flxManageBeneficiaries.onClick = function() {
                self.ManageActivitiesPresenter.showTransferScreen({
                    context: "ManageBeneficiaries"
                });
            };
            this.view.btnContinue.toolTip = kony.i18n.getLocalizedString("i18n.unifiedBeneficiary.Continue");
            this.view.btnModify.toolTip = kony.i18n.getLocalizedString("i18n.common.modifiy");
            this.view.btnCancel.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
        },
        postShow: function() {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.frame.height - this.view.flxFooter.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);

            //add colon to labels - fix for responsive purposes
            CommonUtilities.setText(this.view.lblFromKey, kony.i18n.getLocalizedString("i18n.transfers.lblFrom") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblAccountNumberKey, kony.i18n.getLocalizedString("i18n.common.accountNumber") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblPaymentTypeKey, kony.i18n.getLocalizedString("i18n.TransfersEur.PaymentType") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblPaymentMethodKey, kony.i18n.getLocalizedString("i18n.TransfersEur.PaymentMethod") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblSWIFTBICKey, kony.i18n.getLocalizedString("i18n.TransfersEur.SWIFTBIC") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblBankAddressKey, kony.i18n.getLocalizedString("i18n.transfers.bankAddress") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblCurrencyKey, kony.i18n.getLocalizedString("i18n.common.Currency") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblAmountKey, kony.i18n.getLocalizedString("i18n.transfers.lblAmount") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblExchangeRateKey, kony.i18n.getLocalizedString("i18n.TransfersEur.ExchangeRate") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblPaymentMediumKey, kony.i18n.getLocalizedString("i18n.TransfersEur.PaymentMedium") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblFeeBreakdownKey, kony.i18n.getLocalizedString("i18n.TransfersEur.FeeBreakdown") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblTotalDebitKey, kony.i18n.getLocalizedString("i18n.TransfersEur.TotalDebit") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblFeesPaidByKey, kony.i18n.getLocalizedString("i18n.TransfersEur.FeesPaidBy") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblFrequencyKey, kony.i18n.getLocalizedString("i18n.transfers.lblFrequency") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblSendOnKey, kony.i18n.getLocalizedString("i18n.TransfersEur.SendOn") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblEndingOnKey, kony.i18n.getLocalizedString("i18n.PayAPerson.EndingOn") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblSupportingDocumentsKey, kony.i18n.getLocalizedString("i18n.TransfersEur.SupportingDocuments") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblBeneficiaryNicknameKey, kony.i18n.getLocalizedString("i18n.TransfersEur.BeneficiaryNickname") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblBeneficiaryAddressKey, kony.i18n.getLocalizedString("i18n.TransfersEur.BeneficiaryAddress") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(this.view.lblCreditDateKey, kony.i18n.getLocalizedString("i18n.Transfers.CreditValueDate") + ":", CommonUtilities.getaccessibilityConfig());
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
          if (viewModel.confirmDetails) {
                this.confirmDetails(viewModel);
                this.setSegmentData(viewModel.chargesList);
            }
			if (viewModel.details) {
               if(!viewModel.details.messageDetails)return;
				this.view.GenericMessageNew1.setContext(viewModel.details);
				this.view.GenericMessageNew1.setVisibility(true);
				this.view.flxInsufficientFundsWarning.setVisibility(true);
          }
        },
        getFromAccountName: function(fromAccount) {
            const accName = fromAccount.accountName || fromAccount.AccountName || fromAccount.nickName;
            const accId = fromAccount.accountID || fromAccount.account_id || fromAccount.Account_id;
            return accName ? (accName + "...." + CommonUtilities.getLastFourDigit(accId)) : accId;
        },
        getToAccountName: function(toAccount) {
            var accountName = toAccount.beneficiaryName || toAccount.nickName || toAccount.AccountName;
            var nameToShow = "";
            if (accountName) {
                nameToShow = accountName + "...." + CommonUtilities.getLastFourDigit(toAccount.accountNumber || toAccount.accountID);
            } else {
                nameToShow = toAccount.accountNumber;
            }
            return nameToShow;
        },
        confirmDetails: function(allData) {
            var self = this;
            var formatUtilManager = applicationManager.getFormatUtilManager();
            var data = allData.confirmDetails;
            //this.view.flxInsufficientFundsWarning.setVisibility(data.isInsufficientFundsTransfer || false);
            if (data.isOwnAccount) {
                this.showOwnAccountFields();
            } else {
                this.showExternalAccountFields(data);
            }
            var bankname = data.toAccount.bankName ? data.toAccount.bankName : "-";
            var bankCountry = (data.toAccount.bankCountry || "-");
            if (bankname === "-") {
                bankCountry = bankCountry;
            } else if (bankCountry === "-") {
                bankCountry = bankname
            } else {
                bankCountry = data.toAccount.bankName + ", " + bankCountry;
            }
            this.view.lblFromValue.text = this.getFromAccountName(data.fromAccount);
            this.view.lblBeneficiaryValue.text = this.getToAccountName(data.toAccount);
            this.view.lblAccountNumberValue.text = data.toAccount.accountNumber || data.toAccount.accountID;
            this.view.lblSWIFTBICValue.text = data.swiftCode;
            this.view.rtxBankAddressValue.text = bankCountry;
            this.view.lblAmountValue.text = CommonUtilities.formatCurrencyWithCommas(data.amount, false, data.currency);
            if (allData.exchangeRate && (data.currency !== data.fromAccount.currencyCode)) {
                this.view.flxExchangeRate.setVisibility(true);
                if (allData.details.quoteCurrency === data.fromAccount.currencyCode) {
                    this.view.lblExchangeRateValue.text = '1.00 ' + data.fromAccount.currencyCode + ' = ' + allData.exchangeRate + ' ' + data.currency;
                } else if (allData.details.quoteCurrency === data.currency) {
                    this.view.lblExchangeRateValue.text = '1.00 ' + data.currency + ' = ' + allData.exchangeRate + ' ' + data.fromAccount.currencyCode;
                }
            } else {
                this.view.flxExchangeRate.setVisibility(false);
            }
            this.view.lblFrequencyValue.text = data.frequency;
            this.view.lblSendOnValue.text = data.sendOnDate;
            this.view.flxEndingDate.setVisibility(data.EndingVisbility);
            this.view.lblEndingOnValue.setVisibility(data.EndingVisbility);
            this.view.lblEndingOnValue.text = data.endOnDate || "-";
            this.view.lblPaymentReferenceValue.text = data.paymentReference || "-";
            this.view.lblBeneficiaryNicknameValue.text = data.toAccount.nickName || "-";
            this.view.lblPaymentMethodValue.text = data.paymentMethod;
            this.view.lblCurrencyValue.text = data.currency;
            if (data.supportedDocuments.length > 0) {
                for (var i = 0; i < data.supportedDocuments.length; i++) {
                    var lblSupportingDocumentName = new kony.ui.Label({
                        "id": "lblSupportingDocumentName" + i,
                        "isVisible": true,
                        "skin": "sknLabelSSP42424215pxBorder",
                        "zIndex": 1,
                        "top": "0px",
                        "left": "3%",
                        "text": data.supportedDocuments[i]
                    }, {
                        "contentAlignment": constants.CONTENT_ALIGN_CENTER,
                        "padding": [2, 0, 2, 0],
                        "paddingInPixel": false
                    }, {});
                    this.view.flxSupportingDocumentsValue.add(lblSupportingDocumentName);
                }
            } else {
                var lblSupportingDocumentName = new kony.ui.Label({
                    "id": "lblSupportingDocumentName",
                    "isVisible": true,
                    "top": "0px",
                    "left":kony.application.getCurrentBreakpoint() === 640 ? "0%" :"3%",
                    "skin": "ICSknSSP42424215Px",
                    "zIndex": 1,
                    "text": kony.i18n.getLocalizedString("i18n.common.none")
                }, {
                    "contentAlignment": constants.CONTENT_ALIGN_CENTER,
                    "padding": [0, 0, 0, 0],
                    "paddingInPixel": false
                }, {});
                this.view.flxSupportingDocumentsValue.add(lblSupportingDocumentName);
            }
            if (data.isPaidBy !== '') {

                var payedByi18 = '';

                switch (data.isPaidBy) {
                    case 'OUR':
                        payedByi18 = "i18n.TransfersEur.Me";
                        break;
                    case 'SHA':
                        payedByi18 = "i18n.TransfersEur.Both5050";
                        break;
                    case 'BEN':
                        payedByi18 = "i18n.TransfersEur.Beneficiary";
                        break;
                }
                CommonUtilities.setText(this.view.lblFeesPaidByValue, kony.i18n.getLocalizedString(payedByi18), CommonUtilities.getaccessibilityConfig());

            } else
                this.view.flxFeesPaidBy.setVisibility(false);
            if (allData.totalAmount) { 
                this.view.flxTotalDebit.setVisibility(true); 
                this.view.lblTotalDebitValue.text = CommonUtilities.formatCurrencyWithCommas(allData.totalAmount, false, data.fromAccount.currencyCode);
            } else { 
                this.view.flxTotalDebit.setVisibility(false); 
            }

            if (data.isOwnAccount && (data.toAccount.accountType === "Loan" || data.toAccount.accountType === "CreditCard")) {
                this.view.flxPaymentType.setVisibility(true);
                CommonUtilities.setText(this.view.lblPaymentTypeValue, data.paymentType, CommonUtilities.getaccessibilityConfig());
            } else {
                this.view.flxPaymentType.setVisibility(false);
            }
            if (data.EndingVisbility || !allData.creditValueDate) {
                this.view.flxCreditDate.setVisibility(false);
            } else {
                this.view.flxCreditDate.setVisibility(true);
                data.creditValueDate = formatUtilManager.getFormatedDateString(formatUtilManager.getDateObjectfromString(allData.creditValueDate), "d/m/Y");
                CommonUtilities.setText(this.view.lblCreditDateValue, data.creditValueDate, CommonUtilities.getaccessibilityConfig());
            }
			data.totalAmount = kony.sdk.isNullOrUndefined(allData.totalAmount) ? "" : allData.totalAmount;
            data.transactionCurrency = kony.sdk.isNullOrUndefined(allData.currency) ? "" : allData.currency;
            data.transactionAmount = kony.sdk.isNullOrUndefined(allData.exchangeRate) ? data.amount : (data.amount*allData.exchangeRate);
            data.transactionAmount = Number((Math.floor(data.transactionAmount * 100) / 100))
            data.serviceCharge = this.getTotalCharges(allData.chargesList);
            data.quoteCurrency = allData.hasOwnProperty("details") ? allData.details.quoteCurrency : "";
            this.view.btnContinue.onClick = this.createTransactionRequestSCA.bind(this, data);
            this.view.btnCancel.onClick = this.showCancelPopup.bind(this, data.isEditMode);
            this.view.btnModify.onClick = function() {
                FormControllerUtility.showProgressBar(this.view);
                if (data.isOwnAccount) {
                    self.euroPresenter.showTransferScreen({
                        context: "MakePaymentOwnAccounts",
                        modifyTransaction: data
                    });
                } else {
                    self.euroPresenter.showTransferScreen({
                        context: "MakePayment",
                        modifyTransaction: data
                    });
                }
            }
            this.view.forceLayout();
        },
        //function call to check SCAType and SCAEnfore
        createTransactionRequestSCA: function(data) {
			let self=this;
            //if SCAType is 0 , sca is excluded
            if(OLBConstants.SCAType && OLBConstants.SCAType == 0){
                data.isMFARequired = "false";
                 this.postTransaction(data);
            }
            else{
                FormControllerUtility.showProgressBar(this.view);
                this.view.flxLoading.setVisibility(true);
                  this.action = data.serviceName;
                  let appSessionId  = "";
                  let rmsComponent = new com.temenos.infinity.sca.rmsComponent({"appName" : "ResourcesHIDMA"});
                  if (OLBConstants.CLIENT_PROPERTIES && OLBConstants.CLIENT_PROPERTIES.SCA_RISK_ASSESSMENT && OLBConstants.CLIENT_PROPERTIES.SCA_RISK_ASSESSMENT.toUpperCase() === "TRUE") appSessionId = applicationManager.getRmsSessionID();
                    rmsComponent.rmsActionSuccess = function(output) {
                        if (output.userBlock == "true") {
                            var errorMessage = kony.i18n.getLocalizedString("kony.sca.rms.userBlock");
                            var serverErrorResponse = {
                                errorMessage: errorMessage,
                                dbpErrMsg: errorMessage
                            };
                            var outputMessage = {
                                errorMessage: errorMessage,
                                serverErrorRes: serverErrorResponse
                            };
                            self.euroPresenter.createTransferErrorCallback(data, outputMessage);
                        } else {
                            data.isMFARequired = output.stepUp;
                            FormControllerUtility.hideProgressBar(this.view);
                            self.postTransaction(data);
                        }
                    };
                    rmsComponent.rmsActionFailure = function(output){
                        data.isMFARequired = "true";
                        FormControllerUtility.hideProgressBar(this.view);
                        self.postTransaction(data);
                    };
                    
                    rmsComponent.rmsActionCreate(this.action, appSessionId);
                }
            
              
        },
        /**
         * Method to get sum of all types of charge
         */

        getTotalCharges: function(chargesData) {
            var totalCharge = 0;
            if (kony.sdk.isNullOrUndefined(chargesData) || !Array.isArray(chargesData))
                return totalCharge;
            for (var i = 0; i < chargesData.length; i++) {
                totalCharge = totalCharge + (!kony.sdk.isNullOrUndefined(chargesData[i].chargeAmount) ? chargesData[i].chargeAmount : 0);
            }
            totalCharge = Number((Math.floor(totalCharge * 100) / 100))
            return totalCharge
        },
        /**
         * Method to show the Transfers related fields
         */
        showOwnAccountFields: function() {
            var scopeObj = this;
            scopeObj.view.customheadernew.activateMenu("EUROTRANSFERS", "Transfer Between Accounts");
            scopeObj.view.flxNewPayment.onClick = function() {
                scopeObj.euroPresenter.showTransferScreen({
                    context: "MakePaymentOwnAccounts"
                });
            };
            CommonUtilities.setText(scopeObj.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.hamburger.transfers"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblNewPayment, kony.i18n.getLocalizedString("i18n.TransfersEur.NewTransferbetweenAccounts"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblConfirm, kony.i18n.getLocalizedString("i18n.hamburger.transfers"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPaymentActivities, kony.i18n.getLocalizedString("i18n.FastTransfer.TransferActivities"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPaymentReferenceKey, kony.i18n.getLocalizedString("i18n.TransfersEur.TransferReference") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblBeneficiaryKey, kony.i18n.getLocalizedString("i18n.common.To") + ":", CommonUtilities.getaccessibilityConfig());
            scopeObj.view.flxManageBeneficiaries.setVisibility(false);
            scopeObj.view.flxAccountNumber.setVisibility(false);
            scopeObj.view.flxPaymentMethod.setVisibility(false);
            scopeObj.view.flxSWIFTBIC.setVisibility(false);
            scopeObj.view.flxBankAddress.setVisibility(false);
            scopeObj.view.flxCurrency.setVisibility(true);
            scopeObj.view.flxPaymentMedium.setVisibility(false);
            scopeObj.view.flxFeesPaidBy.setVisibility(false);
            scopeObj.view.flxBeneficiaryNickname.setVisibility(false);
            scopeObj.view.flxBeneficiaryAddress.setVisibility(false);
        },

        setFormattedAddress: function(data) {
            var scopeObj = this;
            if (!data.addressLine1 && !data.addressLine2 && !data.city && !data.postCode && !data.country) {
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
            if (!data.city && !data.postCode && !data.country) {
                scopeObj.view.lblAddress3.setVisibility(false);
            } else {
                scopeObj.view.lblAddress3.setVisibility(true);
                var strings = [data.city, data.country, data.postCode];
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
         * Method to show the Payments related fields
         */
        showExternalAccountFields: function(data) {
            var scopeObj = this;
            scopeObj.view.customheadernew.activateMenu("EUROTRANSFERS", "Make a Payment");
            scopeObj.view.flxNewPayment.onClick = function() {
                scopeObj.euroPresenter.showTransferScreen({
                    context: "MakePayment"
                })
            };
            CommonUtilities.setText(scopeObj.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.AccountsDetails.PAYMENTS"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblNewPayment, kony.i18n.getLocalizedString("i18n.TransfersEur.NewPayment"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblConfirm, kony.i18n.getLocalizedString("i18n.AccountsDetails.PAYMENTS"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPaymentActivities, kony.i18n.getLocalizedString("i18n.TransfersEur.PaymentActivities"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPaymentReferenceKey, kony.i18n.getLocalizedString("i18n.TransfersEur.PaymentReference") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblBeneficiaryKey, kony.i18n.getLocalizedString("i18n.TransfersEur.Beneficiary") + ":", CommonUtilities.getaccessibilityConfig());
            this.setFormattedAddress(data);
            if (data.toAccount && data.toAccount.isSameBankAccount === "true") {
                scopeObj.view.flxSWIFTBIC.setVisibility(false);
                scopeObj.view.flxBankAddress.setVisibility(false);
            } else {
                scopeObj.view.flxSWIFTBIC.setVisibility(true);
                scopeObj.view.flxBankAddress.setVisibility(true);
            }
            if (data.toAccount && data.toAccount.isInternationalAccount === "false" && data.toAccount.isSameBankAccount === "false" && data.frequency === "Once") {
                scopeObj.view.flxPaymentMedium.setVisibility(true);
                CommonUtilities.setText(this.view.lblPaymentMediumValue, data.paymentMedium, CommonUtilities.getaccessibilityConfig());
            } else {
                scopeObj.view.flxPaymentMedium.setVisibility(false);
            }
            scopeObj.view.flxManageBeneficiaries.setVisibility(true);
            scopeObj.view.flxAccountNumber.setVisibility(false);
            scopeObj.view.flxPaymentMethod.setVisibility(true);
            scopeObj.view.flxCurrency.setVisibility(false);
            scopeObj.view.flxFeesPaidBy.setVisibility(true);
            scopeObj.view.flxBeneficiaryNickname.setVisibility(true);
            scopeObj.view.flxBeneficiaryAddress.setVisibility(true);
        },
        postTransaction: function(data) {
            if (data.isEditMode && data.isScheduled) {
                this.euroPresenter.editTransaction(data);
            } else {
                this.euroPresenter.createTransaction(data);
            }
        },
        /**
         * Method to show or hide Cancel Popup
         */
        showCancelPopup: function(isEditMode) {
            var scopeObj = this;
            scopeObj.view.flxDialogs.setVisibility(true);
            scopeObj.view.flxCancelPopup.setVisibility(true);
            scopeObj.view.CustomPopupCancel.btnYes.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
                if (isEditMode) {
                    scopeObj.ManageActivitiesPresenter.showTransferScreen({
                        context: "ScheduledPayments"
                    });
                } else {
                    
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AccountsUIModule", "appName" : "HomepageMA"}).presentationController.showAccountsDashboard();
                }
            };
            scopeObj.view.CustomPopupCancel.btnNo.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
            };
            scopeObj.view.CustomPopupCancel.flxCross.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
            };
        },
        setSegmentData: function(data) {
            if (data && data.length > 0) {
                this.view.flxFeeBreakdown.setVisibility(true);
                this.view.sgmFeeBreakdown.widgetDataMap = this.getWidgetDataMap();
                this.view.sgmFeeBreakdown.setData(data);
            } else {
                this.view.flxFeeBreakdown.setVisibility(false);
                this.view.forceLayout();
            }
        },
        getWidgetDataMap: function() {
            var map = {
                lblChargeName: "chargeName",
                lblChargeValue: "amountCurrency",
            };
            return map;
        },

    };
});