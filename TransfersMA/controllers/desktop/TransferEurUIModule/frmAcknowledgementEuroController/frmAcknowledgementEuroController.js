define(['FormControllerUtility', 'CommonUtilities', 'ViewConstants', 'OLBConstants', 'jspdf', 'jspdf_plugin_autotable'], function (FormControllerUtility, CommonUtilities, ViewConstants, OLBConstants, jsPDF, jspdf_plugin_autotable) {
     

    return {
        init: function () {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function () { };
            this.view.onBreakpointChange = this.onBreakpointChange;
            this.presenter = applicationManager.getModulesPresentationController({ "appName": "TransfersMA", "moduleName": "TransferEurUIModule" });
        },
        onBreakpointChange: function (form, width) {
            var scope = this;
            this.view.CustomPopupLogout.onBreakpointChangeComponent(scope.view.CustomPopupLogout, width);
            FormControllerUtility.setupFormOnTouchEnd(width);
           
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
        },
        /**
         * Method to set formatted beneficiary address
         * @param {Object} data - beneficiary data
         */
        setFormattedAddress: function (data) {
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
                CommonUtilities.setText(scopeObj.view.lblAddress3, strings.filter(function (string) {
                    if (string) {
                        return true;
                    }
                    return false;
                }).join(', '), CommonUtilities.getaccessibilityConfig());
            }
            scopeObj.view.forceLayout();
        },
        preShow: function () {
            this.view.flxUploadFailureMsg.isVisible = false;
            this.view.lblUploadFailureMsg.text = "";
            this.view.btnHome.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.Home");
            this.view.btnNewPayment.toolTip = kony.i18n.getLocalizedString("i18n.TransfersEur.NewPayment");
            this.view.btnSaveBeneficiary.toolTip = kony.i18n.getLocalizedString("i18n.TransfersEur.SaveBeneficiary");
            this.view.btnDownloadReceipt.toolTip = kony.i18n.getLocalizedString("i18n.TransfersEur.DownloadReceipt");

        },
        postShow: function () {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.frame.height - this.view.flxFooter.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
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
            } else if (viewModel.transferAcknowledge) {
                this.updateAckUI(viewModel.transferAcknowledge);
            }
            if (viewModel.showAddBeneficiaryAck) {
                this.showSuccessScreen(viewModel.showAddBeneficiaryAck);
            } else if (viewModel.serverError) {
                this.showErrorScreen(viewModel.serverError);
            } else {
                this.view.flxFailureMsg.setVisibility(false);
                this.view.flxSuccessMsg.setVisibility(false);
            }
            if (viewModel.downloadError) {
                this.showDownloadError(viewModel.downloadError);
            }
        },
        isScheduled: function (data) {
            var sendonDateObject = applicationManager.getFormatUtilManager().getDateObjectFromCalendarString(data.sendOnDate, "dd/mm/yyyy");
            return data.frequency !== "Once" || sendonDateObject.getTime() > CommonUtilities.getServerDateObject().getTime();
        },
        getFromAccountName: function (fromAccount) {
            const accName = fromAccount.accountName || fromAccount.AccountName || fromAccount.nickName;
            const accId = fromAccount.accountID || fromAccount.account_id || fromAccount.Account_id;
            return accName ? (accName + "...." + CommonUtilities.getLastFourDigit(accId)) : accId;
        },
        getToAccountName: function (toAccount) {
            var accountName = toAccount.beneficiaryName || toAccount.nickName || toAccount.AccountName
            var nameToShow = "";
            if (accountName) {
                nameToShow = accountName + "...." + CommonUtilities.getLastFourDigit(toAccount.accountNumber || toAccount.accountID);
            } else {
                nameToShow = toAccount.accountID;
            }
            return nameToShow;
        },
        showSuccessScreen: function (data) {
            this.view.flxSuccessMsg.setVisibility(true);
            this.view.btnSaveBeneficiary.setEnabled(true);
            this.view.lblSuccessmesg.text = kony.i18n.getLocalizedString("i18n.TransfersEur.Beneficiary") + " " + data.beneficiaryName + " " + kony.i18n.getLocalizedString("i18n.payments.beneficiarySuccessMsg") + " " + data.beneficiaryId;
            this.view.flxFailureMsg.setVisibility(false);
            this.view.btnSaveBeneficiary.setVisibility(false);
        },
        showErrorScreen: function (data) {
            this.view.flxFailureMsg.setVisibility(true);
            this.view.flxSuccessMsg.setVisibility(false);
            this.view.btnSaveBeneficiary.skin = "sknBtnffffffBorder0273e31pxRadius2px";
            this.view.btnSaveBeneficiary.setVisibility(true);
            this.view.btnSaveBeneficiary.setEnabled(true);
            this.view.lblFailureMsg.text = kony.i18n.getLocalizedString("i18n.payments.beneficiaryFailureMsg");
        },
        showDownloadError: function (response) {
            if (response.errorMessage) {
                this.view.flxFailureMsg.setVisibility(true);
                this.view.flxSuccessMsg.setVisibility(false);
                this.view.lblFailureMsg.text = response.errorMessage;
            }
        },
      toggleDownloadReportPopup: function(flag) {
        this.view.flxDialogs.setVisibility(flag);
        this.view.flxDownloadReportPopup.setVisibility(flag);
      },
        updateAckUI: function (viewModel) {
            var scopeObj = this;
            const breakPoint = kony.application.getCurrentBreakpoint();
            var data = viewModel.transferData;
            // if (data.isInsufficientFundsTransfer) {
            //     this.view.flxSuccess.setVisibility(false);
            //     this.view.flxAwaitingFunds.setVisibility(true);
            //     CommonUtilities.setText(this.view.lblAwaitingFundsReferenceNumberValue, data.referenceId, CommonUtilities.getaccessibilityConfig());
            //     CommonUtilities.setText(this.view.lblMoveSufficientFunds, kony.i18n.getLocalizedString("i18n.Transfers.MoveSufficientFundsMessage") + data.fromAccount.nickName + "..." + data.fromAccount.accountID + ".", CommonUtilities.getaccessibilityConfig());
            // } else {
            this.view.flxSuccess.setVisibility(true);
            this.view.flxAwaitingFunds.setVisibility(false);
            CommonUtilities.setText(this.view.lblRefrenceNumberValue, data.referenceId, CommonUtilities.getaccessibilityConfig());
            // }
          this.view.btnClose.onClick = this.toggleDownloadReportPopup.bind(scopeObj,false);
          this.view.btnDownloadCancel.onClick = this.toggleDownloadReportPopup.bind(scopeObj,false);
          this.view.btnDownloadReceipt.onClick =this.toggleDownloadReportPopup.bind(scopeObj,true);
          this.view.btnProceed.onClick = function() {
            scopeObj.toggleDownloadReportPopup(false);
            scopeObj.presenter.downloadReport(viewModel.transferData)
          };            
            if (data.isOwnAccount) {
                this.view.ImgAcknowledged.top = breakPoint <= 1024 ? "30dp" : "100dp";
                this.showOwnAccountFields();
            } else {
                this.view.ImgAcknowledged.top = breakPoint <= 1024 ? "30dp" : "10dp";
                this.showExternalAccountFields(data);
            }
            if (viewModel.chargesDetails && viewModel.chargesDetails.length > 0) {
                this.view.flxFeeBreakdown.setVisibility(true);
                var charges = viewModel.chargesDetails;
                this.setSegmentData(charges);
            } else {
                this.view.flxFeeBreakdown.setVisibility(false);
            }
            this.view.flxSupportingDocumentsValue.removeAll();
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
            this.view.lblAccountNumberValue.text = data.toAccount.accountNumber || data.toAccount.accountID || data.fromAccount.account_id;
            this.view.lblSWIFTBICValue.text = data.swiftCode;
            this.view.rtxBankAddressValue.text = bankCountry;
            this.view.lblAmountValue.text = CommonUtilities.formatCurrencyWithCommas(data.amount, false, data.currency);

            if (kony.application.getCurrentBreakpoint() <= 1024) {
                this.view.btnDownloadReceipt.setVisibility(false);
            } else {
                this.view.btnDownloadReceipt.setVisibility(true);
            }
            if (data.successfulUploads.length > 0) {
                for (var i = 0; i < data.successfulUploads.length; i++) {
                    var lblSupportingDocumentNameSuccess = new kony.ui.Label({
                        "id": "lblSupportingDocumentNameSuccess" + i,
                        "isVisible": true,
                        "left": "1%",
                        "top": "3px",
                        "skin": "sknLabelSSP42424215pxBorder",
                        "zIndex": 1,
                        "text": data.successfulUploads[i]
                    }, {
                        "contentAlignment": constants.CONTENT_ALIGN_CENTER,
                        "padding": [2, 0, 2, 0],
                        "paddingInPixel": false
                    }, {});
                    this.view.flxSupportingDocumentsValue.add(lblSupportingDocumentNameSuccess);
                }
            }
            if (data.failedUploads.length > 0) {
                this.view.flxUploadFailureMsg.isVisible = true;
                var failedDocs = data.failedUploads.join();
                if (data.failedUploads.length === 1) {
                    this.view.lblUploadFailureMsg.text = kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentUploadErrorMsg") + "\"" + failedDocs + "\"";
                } else {
                    this.view.lblUploadFailureMsg.text = kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentUploadErrorMsg2") + "\"" + failedDocs + "\"";
                }
                for (var i = 0; i < data.failedUploads.length; i++) {
                    var flxDocumentNameFailed = new kony.ui.FlexContainer({
                        "autogrowMode": kony.flex.AUTOGROW_HEIGHT,
                        "clipBounds": false,
                        "id": "flxDocumentNameSuccess" + i,
                        "isVisible": true,
                        "layoutType": kony.flex.FLOW_HORIZONTAL,
                        "left": "1%",
                        "top": "3px",
                        "maxWidth": "100%",
                        "skin": "sknFlxffffffBorder4px",
                        "isVisible": true,
                        "zIndex": 1
                    }, {}, {});
                    var img = new kony.ui.Image2({
                        "id": "image" + i,
                        "isVisible": true,
                        "src": "aa_password_error.png",
                        "height": "17dp",
                        "width": "17dp",
                        "left": "10px"
                    }, {
                        widgetAlignment: constants.WIDGET_ALIGN_MIDDLE_LEFT
                    }, {});
                    var lblSupportingDocumentNameFailed = new kony.ui.Label({
                        "id": "lblSupportingDocumentNameFailed" + i,
                        "isVisible": true,
                        "skin": "sknLabelSSPFF000015Px",
                        "zIndex": 1,
                        "right": "10px",
                        "text": data.failedUploads[i]
                    }, {
                        "contentAlignment": constants.CONTENT_ALIGN_CENTER
                    }, {});
                    flxDocumentNameFailed.add(img);
                    flxDocumentNameFailed.add(lblSupportingDocumentNameFailed);
                    this.view.flxSupportingDocumentsValue.add(flxDocumentNameFailed);
                }
            }
            if (data.failedUploads.length === 0 && data.successfulUploads.length === 0) {
                var lblSupportingDocumentName = new kony.ui.Label({
                    "id": "lblSupportingDocumentName",
                    "isVisible": true,
                    "left": "1%",
                    "top": "3px",
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
            this.view.forceLayout();
            this.view.lblAmountValue.text = CommonUtilities.formatCurrencyWithCommas(data.amount, false, data.currency);
            if (viewModel.totalAmount) {
                this.view.flxTotalDebit.setVisibility(true);
                this.view.lblTotalDebitValue.text = CommonUtilities.formatCurrencyWithCommas(viewModel.totalAmount, false, data.fromAccount.currencyCode);
            } else {
                this.view.flxTotalDebit.setVisibility(false);
            }
            if (viewModel.exchangeRate && (data.currency !== data.fromAccount.currencyCode)) {
                this.view.flxExchangeRate.setVisibility(true);
                if (data.quoteCurrency === data.fromAccount.currencyCode) {
                    this.view.lblExchangeRateValue.text = '1.00 ' + data.fromAccount.currencyCode + ' = ' + viewModel.exchangeRate + ' ' + data.currency;
                } else if (data.quoteCurrency === data.currency) {
                    this.view.lblExchangeRateValue.text = '1.00 ' + data.currency + ' = ' + viewModel.exchangeRate + ' ' + data.fromAccount.currencyCode;
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
            this.view.lblCurrencyValue.text = data.currency;
            this.view.forceLayout();
            this.view.lblPaymentMethodKey.text = kony.i18n.getLocalizedString("i18n.TransfersEur.PaymentMethod");
            this.view.lblPaymentMethodValue.text = data.paymentMethod;
            if (data.oneTimePayment) {
                this.view.btnSaveBeneficiary.setVisibility(true);
                this.view.btnSaveBeneficiary.skin = "sknBtnffffffBorder0273e31pxRadius2px";
                this.view.btnSaveBeneficiary.setEnabled(true);
            } else {
                this.view.btnSaveBeneficiary.setVisibility(false);
            }
            if (data.status !== "Pending") {
                if (data.isRecurring) {
                    CommonUtilities.setText(this.view.lblSuccessMessage, kony.i18n.getLocalizedString("i18n.TransfersEur.ScheduledTransactionMessage"), CommonUtilities.getaccessibilityConfig());
                } else {
                    CommonUtilities.setText(this.view.lblSuccessMessage, kony.i18n.getLocalizedString("i18n.Transfers.AcknowledgementSuccessMessage"), CommonUtilities.getaccessibilityConfig());
                }
            } else {
                CommonUtilities.setText(this.view.lblSuccessMessage, kony.i18n.getLocalizedString("i18n.transfers.approvalAck"), CommonUtilities.getaccessibilityConfig());
            }
            if (data.isOwnAccount && (data.toAccount.accountType === "Loan" || data.toAccount.accountType === "CreditCard")) {
                this.view.flxPaymentType.setVisibility(true);
                CommonUtilities.setText(this.view.lblPaymentTypeValue, data.paymentType, CommonUtilities.getaccessibilityConfig());
            } else {
                this.view.flxPaymentType.setVisibility(false);
            }
            if (data.isOwnAccount && data.toAccount.accountType === "CreditCard") {
                this.view.lblCreditCardPaymentMessage.setVisibility(true);
            } else {
                this.view.lblCreditCardPaymentMessage.setVisibility(false);
            }
            if (data.EndingVisbility || !data.creditValueDate) {
                this.view.flxCreditDate.setVisibility(false);
            } else {
                this.view.flxCreditDate.setVisibility(true);
                CommonUtilities.setText(this.view.lblCreditDateValue, data.creditValueDate, CommonUtilities.getaccessibilityConfig());
            }
            var addBenificiaryData = {
                "IBAN": data.toAccount.IBAN,
                "accountNumber": data.toAccount.accountNumber,
                "bankCountry": data.toAccount.bankCountry,
                "bankName": data.toAccount.bankName,
                "beneficiaryName": data.toAccount.beneficiaryName,
                "isInternationalAccount": data.toAccount.isInternationalAccount,
                "isSameBankAccount": data.toAccount.isSameBankAccount,
                "currencyCode": data.toAccount.currencyCode,
                "nickName": data.toAccount.nickName,
                "swiftCode": data.toAccount.swiftCode,
                "zipcode": data.postCode,
                "addressLine1": data.addressLine1,
                "addressLine2": data.addressLine2,
                "country": data.country,
                "isVerified": "true",
                "city": data.city
            };
            this.view.btnSaveBeneficiary.onClick = function () {
                if (applicationManager.getUserPreferencesManager().isSingleCustomerProfile) {
                    scopeObj.presenter.addBeneficiaryDetails(addBenificiaryData, scopeObj.view.id);
                } else {
                    applicationManager.getRecipientsManager().fetchContractDetails(data.serviceName, function (response) {
                        var contracts = response.contracts;
                        var contractId;
                        var coreCustomerId = data.fromAccount.coreCustomerId;
                        for (const contract of contracts) {
                            for (const contractCustomer of contract.contractCustomers) {
                                if (contractCustomer.coreCustomerId === coreCustomerId) {
                                    contractId = contract.contractId;
                                    break;
                                }
                            }
                            if (contractId) break;
                        }
                        if (contractId) {
                            addBenificiaryData.cif = JSON.stringify([{ contractId: contractId, coreCustomerId: coreCustomerId }]);
                        }
                        scopeObj.presenter.addBeneficiaryDetails(addBenificiaryData, scopeObj.view.id);
                    }, function () {
                        scopeObj.presenter.addBeneficiaryDetails(addBenificiaryData, scopeObj.view.id);
                    });
                }
                CommonUtilities.disableButton(scopeObj.view.btnSaveBeneficiary);
            }
            this.view.btnNewPayment.onClick = function () {
                if (data.isOwnAccount) {
                    applicationManager.getModulesPresentationController("TransferEurUIModule").showTransferScreen({
                        context: "MakePaymentOwnAccounts"
                    });
                } else {
                    applicationManager.getModulesPresentationController("TransferEurUIModule").showTransferScreen({
                        context: "MakePayment"
                    });
                }
            }
            this.view.btnHome.onClick = function () {
                var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ "moduleName": "AccountsUIModule", "appName": "HomepageMA" });
                accountsModule.presentationController.showAccountsDashboard();
            }
            // this.view.lblRefrenceNumberValue.text = viewModel.transferData.accountFrom.accountName;
            //this.view.lblBalanceValue.text = CommonUtilities.formatCurrencyWithCommas(viewModel.transferData.accountFrom.availableBalance, false, viewModel.transferData.accountFrom.currencyCode);

            this.getPayedByValue(data);

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
        showOwnAccountFields: function () {
            var scopeObj = this;
            scopeObj.view.customheadernew.activateMenu("EUROTRANSFERS", "Transfer Between Accounts");
            CommonUtilities.setText(scopeObj.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.hamburger.transfers"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblAcknowledgement, kony.i18n.getLocalizedString("i18n.transfers.Acknowledgementlbl"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblBeneficiaryKey, kony.i18n.getLocalizedString("i18n.common.To") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPaymentReferenceKey, kony.i18n.getLocalizedString("i18n.TransfersEur.TransferReference") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.btnNewPayment, kony.i18n.getLocalizedString("i18n.transfers.makeanothertransfereuro"), CommonUtilities.getaccessibilityConfig());
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
        showExternalAccountFields: function (data) {
            var scopeObj = this;
            scopeObj.view.customheadernew.activateMenu("EUROTRANSFERS", "Make a Payment");
            CommonUtilities.setText(scopeObj.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.AccountsDetails.PAYMENTS"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblAcknowledgement, kony.i18n.getLocalizedString("i18n.AccountsDetails.PAYMENTS"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblBeneficiaryKey, kony.i18n.getLocalizedString("i18n.TransfersEur.Beneficiary") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblPaymentReferenceKey, kony.i18n.getLocalizedString("i18n.TransfersEur.PaymentReference") + ":", CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.btnNewPayment, kony.i18n.getLocalizedString("i18n.TransfersEur.NewPayment"), CommonUtilities.getaccessibilityConfig());
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
                CommonUtilities.setText(scopeObj.view.lblPaymentMediumValue, data.paymentMedium, CommonUtilities.getaccessibilityConfig());
            } else {
                scopeObj.view.flxPaymentMedium.setVisibility(false);
            }
            scopeObj.view.flxAccountNumber.setVisibility(false);
            scopeObj.view.flxPaymentMethod.setVisibility(true);
            scopeObj.view.flxCurrency.setVisibility(false);
            scopeObj.view.flxFeesPaidBy.setVisibility(true);
            scopeObj.view.flxBeneficiaryNickname.setVisibility(true);
            scopeObj.view.flxBeneficiaryAddress.setVisibility(true);
        },

        getPayedByValue: function (data) {
            var scopeObj = this;
            var payedByi18 = '';

            if (data.isPaidBy !== '') {
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

                CommonUtilities.setText(scopeObj.view.lblFeesPaidByValue, kony.i18n.getLocalizedString(payedByi18), CommonUtilities.getaccessibilityConfig());
            } else {
                this.view.flxFeesPaidBy.setVisibility(false);
            }
        },

        downloadPDF: function (viewModel) {
            /**
             * jsPDF - https://github.com/MrRio/jsPDF.
             * docs - http://raw.githack.com/MrRio/jsPDF/master/docs/
             */
            var createPDF = jsPDF.jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                putOnlyUsedFonts: true,
                floatPrecision: 16 // or "smart", default is 16
            });
            var data = viewModel.transferData;
            /**
             * jsPDF - https://github.com/MrRio/jsPDF.
             * docs - http://raw.githack.com/MrRio/jsPDF/master/docs/
             */
            var bankAddress = kony.i18n.getLocalizedString("i18n.kony.bankaddress");
            var bankAddressParts = bankAddress.split('<br>');
            var tableHeader = kony.i18n.getLocalizedString("i18n.billPay.TransactionDetails");
            var row11 = kony.i18n.getLocalizedString("i18n.transfers.RefrenceNumber") + ":";
            var row12 = kony.i18n.getLocalizedString("i18n.transfers.lblFrom") + ":";
            var row13 = this.view.lblBeneficiaryKey.text;
            if (data.paymentMethod != "Within Bank") {
                var row15 = this.view.lblSWIFTBICKey.text;
                var row16 = kony.i18n.getLocalizedString("i18n.transfers.bankAddress") + ":";

                var row25 = data.swiftCode || "-";
                var row26 = ((data.toAccount.bankName) ? data.toAccount.bankName + ((data.toAccount.bankCountry) ? ", " + data.toAccount.bankCountry : "") : "-");

                var row112 = kony.i18n.getLocalizedString("i18n.TransfersEur.FeesPaidBy") + ":";
                if (data.isPaidBy !== '') {
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
                    var row212 = kony.i18n.getLocalizedString(payedByi18);
                }
            };
            var row17 = kony.i18n.getLocalizedString("i18n.transfers.lblAmount") + ":";
            if (!!data.paymentMedium) {
                var row116 = kony.i18n.getLocalizedString("i18n.TransfersEur.PaymentMedium") + ":";
                var row216 = data.paymentMedium || "-";
            }
            var row18 = kony.i18n.getLocalizedString("i18n.TransfersEur.TotalDebit") + ":";
            if (viewModel.exchangeRate && (data.currency !== data.fromAccount.currencyCode)) {
                var row19 = this.view.lblExchangeRateKey.text;
                var row29 = this.view.lblExchangeRateValue.text;
            }
            if (viewModel.chargesDetails && viewModel.chargesDetails.length > 0) {
                var charges = viewModel.chargesDetails;
                var row110 = [(kony.i18n.getLocalizedString("i18n.TransfersEur.FeeBreakdown") + ":"), '', '', ''];
                var row210 = [];
                row210.push(row110);
                for (let k = 0; k < charges.length; k++) {
                    const newRow = ["			 " + charges[k].chargeName, CommonUtilities.formatCurrencyWithCommas(charges[k].chargeAmount, true, charges[k].chargeCurrency) + " " + charges[k].chargeCurrency, '', ''];
                    row210.push(newRow);
                }
            };
            var row111 = this.view.lblSendOnKey.text;
            var row113 = this.view.lblPaymentReferenceKey.text;
            var row114 = kony.i18n.getLocalizedString("i18n.TransfersEur.BeneficiaryNickname") + ":";
            var row115 = kony.i18n.getLocalizedString("i18n.TransfersEur.BeneficiaryAddress") + ":";
            var row117 = kony.i18n.getLocalizedString("i18n.transfers.lblFrequency") + ":";
            var row118 = kony.i18n.getLocalizedString("i18n.TransfersEur.SupportingDocuments") + ":";
            var row119 = this.view.lblPaymentMethodKey.text;
            var row21 = data.referenceId;
            var row22 = data.fromAccount.nickName + "-" + data.fromAccount.accountID;
            var row23 = this.getToAccountName(data.toAccount);
            var row27 = CommonUtilities.formatCurrencyWithCommas(data.amount, true, data.currency) + " " + data.currency;
            var row28 = CommonUtilities.formatCurrencyWithCommas(viewModel.totalAmount, true, data.fromAccount.currencyCode) + " " + data.fromAccount.currencyCode;
            var row211 = data.sendOnDate || "-";
            var row213 = data.paymentReference || "-";
            var row214 = data.toAccount.nickName || "";
            var row215 = data.addressLine1 ? (data.addressLine1 + ((data.addressLine2) ? ', ' + data.addressLine2 : '')) : '-';
            var row217 = data.frequency;
            var row218 = "";
            if (data.supportedDocuments.length > 0) {
                for (var i = 0; i < data.supportedDocuments.length; i++) {
                    row218 += data.supportedDocuments[i];
                    if (i !== data.supportedDocuments.length - 1) row218 += "\n";
                }
            } else {
                row218 = "None";
            }
            var row219 = data.paymentMethod;
            var row220 = ((data.city) ? data.city : '') + ((data.country) ? ', ' + data.country : '') + ((data.postCode) ? ', ' + data.postCode : '');
            if (data.frequency !== "Once") {
                var row221 = kony.i18n.getLocalizedString("i18n.PayAPerson.EndingOn");
                var row222 = data.endOnDate;
            }
            var row223 = this.view.lblCreditDateKey.text;
            var row224 = data.creditValueDate;
            createPDF.addImage(this.view.customheadernew.flxLogoAndActions.flxLogoAndActionsWrapper.imgKony._kwebfw_.view.lastChild.currentSrc, "png", 15, 15, 50, 20, "NONE", 0);
            createPDF.line(10, 65, 200, 65);
            createPDF.setFontSize(12);
            createPDF.text(bankAddressParts, 15, 40);
            createPDF.setFontSize(16);
            createPDF.text(tableHeader, 15, 75);
            createPDF.line(10, 85, 200, 85);
            createPDF.line(10, 10, 200, 10);
            createPDF.line(200, 10, 200, 287);
            createPDF.line(200, 287, 10, 287);
            createPDF.line(10, 287, 10, 10);
            createPDF.autoTable({
                theme: ['plain'],
                startY: 83,
                head: [
                    ['', '', '', '']
                ],
                body: [
                    [row11, row21, '', ''],
                    [row12, row22, '', ''],
                    [row13, row23, '', ''],
                    ...((this.view.flxPaymentMethod.isVisible === true) ? [
                        [row119, row219, '', '']
                    ] : []),
                    ...((data.paymentMethod != "Within Bank") ? [
                        [row15, row25, '', '']
                    ] : []),
                    ...((data.paymentMethod != "Within Bank") ? [
                        [row16, row26, '', '']
                    ] : []),
                    [row17, row27, '', ''],
                    ...((this.view.flxPaymentMedium.isVisible === true) ? [
                        [row116, row216, '', '']
                    ] : []),
                    ...((this.view.flxTotalDebit.isVisible === true) ? [
                        [row18, row28, '', '']
                    ] : []),
                    ...(viewModel.exchangeRate && (data.currency !== data.fromAccount.currencyCode) ? [
                        [row19, row29, '', '']
                    ] : []),
                    ...((viewModel.chargesDetails && viewModel.chargesDetails.length) ? row210 : []),
                    ...((data.paymentMethod != "Within Bank") ? [
                        [row112, row212, '', '']
                    ] : []),
                    ...((this.view.flxFrequency.isVisible === true) ? [
                        [row117, row217, '', '']
                    ] : []),
                    [row111, row211, '', ''],
                    ...((data.frequency !== 'Once') ? [
                        [row221, row222, '', '']
                    ] : []),
                    ...((!data.EndingVisbility && data.creditValueDate) ? [
                        [row223, row224, '', '']
                    ] : []),
                    [row118, row218, '', ''],
                    [row113, row213, '', ''],
                    [row114, row214, '', ''],
                    [row115, row215, '', ''],
                    ['  ', row220, '', '']
                    // ...
                ],
            });
            createPDF.save(data.referenceId + ".pdf"); // generating the pdf file
        },

        setSegmentData: function (data) {

            for (var i = 0; i < data.length; i++) {
                data[i].amountCurrency = CommonUtilities.formatCurrencyWithCommas(data[i].chargeAmount, false, data[i].chargeCurrency);
            }

            this.view.sgmFeeBreakdown.widgetDataMap = this.getWidgetDataMap();
            this.view.sgmFeeBreakdown.setData(data);

        },

        getWidgetDataMap: function () {
            var map = {
                lblChargeName: "chargeName",
                lblChargeValue: "amountCurrency",
            };
            return map;
        },
    };
});