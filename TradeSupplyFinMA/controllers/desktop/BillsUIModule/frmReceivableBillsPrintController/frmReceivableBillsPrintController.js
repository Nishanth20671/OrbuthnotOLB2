define(['OLBConstants', 'FormControllerUtility', 'CommonUtilities'], function (OLBConstants, FormControllerUtility, CommonUtilities) {
    let navData;
    let presenter;
    let previousForm;
    const NA = kony.i18n.getLocalizedString("i18n.common.NA");
    let billOverViewArray = [],
        cancellationDetailsArray = [],
        billDetailsArray = [],
        amountAndAccountArray = [],
        buyerArray = [],
        goodsAndShipmentArray = [],
        documentsMessageToBankArray = [];
    let headerBoldSkin = 'ICSknlbl424242SSP15pxSemibold';
    let statusInLowerCase;
    let billConstants;
    return {
        /**
         * @api : onNavigate
         * Will execute when navigation came from another form
         * @arg : param - Obj - Data used to load in UI
         * @return : NA
         */
        onNavigate: function (data) {
            var scope = this;
            try {
                navData = data.navData;
                previousForm = data.previousFormName;
                statusInLowerCase = navData.status.toLowerCase();
            } catch (err) {
                var errorObj = {
                    "method": "onNavigate",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :init
         * Sets the initial actions for form
         * @arg : NA
         * @return : NA
         */
        init: function () {
            var scope = this;
            try {
                presenter = applicationManager.getModulesPresentationController({ appName: 'TradeSupplyFinMA', moduleName: 'BillsUIModule' });
                billConstants = OLBConstants.BILLS_STATUS;
                this.view.preShow = this.preShow;
                this.view.postShow = this.postShow;
            } catch (err) {
                var errorObj = {
                    "method": "init",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :preShow
         * Performs the actions required before rendering form
         * @arg : NA
         * @return : NA
         */
        preShow: function () {
            var scope = this;
            try {
                scope.renderHeaderDetails();
                scope.setSegWidgetDataMap();
                scope.appendResponses();
            }
            catch (err) {
                var errorObj = {
                    "method": "preShow",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :postShow
         * Performs the actions required after rendering form
         * @arg : NA
         * @return : NA
         */
        postShow: function () {
            var scope = this;
            try {
                kony.os.print();
                // timeout is required to allow print popup to be visible.
                setTimeout(function () {
                    scope.afterPrintCallback();
                }, "17ms");
            } catch (err) {
                var errorObj = {
                    "method": "postShow",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :afterPrintCallback
         * It'll trigger after print is initiated
         * @arg : NA
         * @return : NA
         */
        afterPrintCallback: function () {
            var scope = this;
            try {
                new kony.mvc.Navigation({
                    "appName": "TradeSupplyFinMA",
                    "friendlyName": `BillsUIModule/${previousForm}`
                }).navigate(navData);
            }
            catch (err) {
                var errorObj = {
                    "method": "afterPrintCallback",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :renderHeaderDetails
         * Loading the header/title
         * @arg : NA
         * @return : NA
         */
        renderHeaderDetails: function () {
            var scope = this;
            try {
                let currentLocale = kony.i18n.getCurrentLocale;
                let userObject = applicationManager.getUserPreferencesManager().getUserObj();
                scope.view.lblUserName.text = (userObject.userfirstname && userObject.LastName) ? userObject.userfirstname + " " + userObject.LastName : NA;
                scope.view.lblAddress3.text = userObject.phone ? userObject.phone : NA;
                scope.view.lblBankNameValue.text = userObject.bankName ? userObject.bankName : NA;
                scope.view.flxEmailValue.text = userObject.email ? userObject.email : NA;
                scope.view.lblTermsAndCond.text = currentLocale === "ar_AE" ?
                    `${kony.i18n.getLocalizedString("i18n.TradeFinance.amendmentsTermsandConditions")} :${kony.i18n.getLocalizedString("i18n.Transfers.Terms&Conditions")}`
                    :
                    `${kony.i18n.getLocalizedString("i18n.Transfers.Terms&Conditions")}: ${kony.i18n.getLocalizedString("i18n.TradeFinance.amendmentsTermsandConditions")}`
                // As per UX team's suggestion, hard coding below values
                let address1 = "Ohio/West Virginia Markets";
                let address2 = "P O Box 260180";
                scope.view.lblAddress1.text = address1;
                scope.view.lblAddress2.text = address2;
                scope.view.lblCustomerCareValue.text = "10000020000";
                scope.view.flxAddressValue1.text = address1 + " " + address2;
                scope.view.flxWebsiteValue.text = "dbxdigitalbanking.com";
                scope.view.lblTitle.text = currentLocale === "ar_AE" ?
                    `${kony.i18n.getLocalizedString("i18n.TradeSupplyFinance.singleApplication")} - ${kony.i18n.getLocalizedString("i18n.TradeFinance.ReceivableFinancing")}` :
                    `${kony.i18n.getLocalizedString("i18n.TradeFinance.ReceivableFinancing")} - ${kony.i18n.getLocalizedString("i18n.TradeSupplyFinance.singleApplication")}`;
            } catch (err) {
                var errorObj = {
                    "method": "renderHeaderDetails",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api : setSegWidgetDataMap
         * Settingup the segments widget datamap
         * @arg: NA
         * @return : NA
         */
        setSegWidgetDataMap: function () {
            var scope = this;
            try {
                scope.view.segRecords.widgetDataMap = {
                    flxDetails: 'flxDetails',
                    flxKey: 'flxKey',
                    lblKey: 'lblKey',
                    lblReviewValue: 'lblReviewValue',
                    flxValue: 'flxValue',
                    lblValue: 'lblValue',
                    flxMain: 'flxMain',
                };
            } catch (err) {
                var errorObj = {
                    "method": "setSegWidgetDataMap",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :appendResponses
         * Appending all responses at one place
         * @arg1 {name} : Response to load data
         * @return : NA
         */
        appendResponses: function () {
            var scope = this;
            try {
                scope.renderBillOverview();
                (statusInLowerCase == billConstants.SUBMITTED_TO_BANK.toLowerCase() && navData.cancellationStatus) && scope.rendercancellationDetails();
                scope.renderBillDetails();
                scope.renderAmountAndAccount();
                scope.renderBuyer();
                scope.renderGoodsAndShipment();
                scope.renderDocumentsMessageToBank();
                let printSegData = [
                    ...billOverViewArray,
                    ...cancellationDetailsArray,
                    ...billDetailsArray,
                    ...amountAndAccountArray,
                    ...buyerArray,
                    ...goodsAndShipmentArray,
                    ...documentsMessageToBankArray
                ];
                scope.view.segRecords.setData(printSegData);
            } catch (err) {
                var errorObj = {
                    "method": "appendResponses",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :renderBillOverview
         * Rendering bill overview
         * @arg1 : NA
         * @return : NA
         */
        renderBillOverview: function () {
            var scope = this;
            try {
                billOverViewArray = [
                    {
                        lblKey: {
                            text: presenter.renderI18nKeys('i18n.TradeSupplyFinance.billOverview', false),
                            skin: headerBoldSkin
                        },
                        flxValue: {
                            isVisible: false
                        }
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.billReferenceWithColon', false),
                        lblValue: navData.billReference ? navData.billReference : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeFinance.updatedOnWithColon', false),
                        lblValue: navData.updatedOn ? presenter.formatUtilManager.getFormattedCalendarDate(navData.updatedOn) : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.serviceRequests.Status:', false),
                        lblValue: {
                            text: navData.status ? navData.status : NA,
                            skin: headerBoldSkin
                        }
                    }
                ];
                billConstants.REJECTED.toLowerCase() == statusInLowerCase && billOverViewArray.push(
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeFinance.reasonForRejectionWithColon', false),
                        lblValue: navData.reasonForRejection ? navData.reasonForRejection : NA
                    }
                );
                (navData.hasOwnProperty('reasonForReturn')) &&
                    billOverViewArray.push(
                        {
                            lblKey: presenter.renderI18nKeys('i18n.TradeFinance.reasonForReturnedWithColon', false),
                            lblValue: navData.reasonForReturn ? navData.reasonForReturn : NA
                        }
                    );
            } catch (err) {
                var errorObj = {
                    "method": "renderBillOverview",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :rendercancellationDetails
         * Rendering cancellation details
         * @arg1 : NA
         * @return : NA
         */
        rendercancellationDetails: function () {
            var scope = this;
            try {
                cancellationDetailsArray = [
                    {
                        flxDetails: {
                            top: '20dp'
                        },
                        lblKey: {
                            text: presenter.renderI18nKeys('i18n.TradeSupplyFinance.cancellationDetails', false),
                            skin: headerBoldSkin
                        },
                        flxValue: {
                            isVisible: false
                        }
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.cancellationStatusWithColon', false),
                        lblValue: navData.cancellationStatus ? navData.cancellationStatus : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.reasonforCancellationWithColon', false),
                        lblValue: navData.reasonForCancellation ? navData.reasonForCancellation : NA
                    },
                ];
                scope.processDocsResponse(cancellationDetailsArray, 'cancellationDocuments', 'i18n.TradeSupplyFinance.cancellationDocumentsOptionalWithColon');
            } catch (err) {
                var errorObj = {
                    "method": "rendercancellationDetails",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :renderBillDetails
         * Rendering bill details
         * @arg1 : NA
         * @return : NA
         */
        renderBillDetails: function () {
            var scope = this;
            try {
                billDetailsArray = [
                    {
                        flxDetails: {
                            top: '20dp'
                        },
                        lblKey: {
                            text: presenter.renderI18nKeys('kony.mb.BillPay.BillDetails', false),
                            skin: headerBoldSkin
                        },
                        flxValue: {
                            isVisible: false
                        }
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.billNameOptionalWithColon', false),
                        lblValue: navData.billName ? navData.billName : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.billNumberWithColon', false),
                        lblValue: navData.billNumber ? navData.billNumber : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.billDateWithColon', false),
                        lblValue: navData.billDate ? presenter.formatUtilManager.getFormattedCalendarDate(navData.billDate) : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeFinance.billTypeWithColon', false),
                        lblValue: navData.billType ? navData.billType : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.payments.dueDateWithColon', false),
                        lblValue: navData.dueDate ? presenter.formatUtilManager.getFormattedCalendarDate(navData.dueDate) : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeFinance.paymentTermsWithColon', false),
                        lblValue: navData.paymentTerms ? navData.paymentTerms : NA
                    }
                ];
            } catch (err) {
                var errorObj = {
                    "method": "renderBillDetails",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :renderAmountAndAccount
         * Rendering amount and account
         * @arg1 : NA
         * @return : NA
         */
        renderAmountAndAccount: function () {
            var scope = this;
            try {
                amountAndAccountArray = [
                    {
                        flxDetails: {
                            top: '20dp'
                        },
                        lblKey: {
                            text: presenter.renderI18nKeys('i18n.TradeSupplyFinance.amountAmpersandAccount', false),
                            skin: headerBoldSkin
                        },
                        flxValue: {
                            isVisible: false
                        }
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.wealth.amountColon', false),
                        lblValue: (navData.currency && navData.amount) ? `${navData.currency} ${applicationManager.getFormatUtilManager().formatAmount(navData.amount)}` : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.accountReceivableWithColon', false),
                        lblValue: navData.receivableAccount ? scope.morphAcNumber(navData.receivableAccount) : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.needFinance', true),
                        lblValue: navData.requestFinance ? navData.requestFinance : NA
                    }
                ];
            } catch (err) {
                var errorObj = {
                    "method": "renderAmountAndAccount",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :renderBuyer
         * Rendering buyer details
         * @arg1 : NA
         * @return : NA
         */
        renderBuyer: function () {
            var scope = this;
            try {
                buyerArray = [
                    {
                        flxDetails: {
                            top: '20dp'
                        },
                        lblKey: {
                            text: presenter.renderI18nKeys('i18n.TradeFinance.buyer', false),
                            skin: headerBoldSkin
                        },
                        flxValue: {
                            isVisible: false
                        }
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.buyerNameWithColon', false),
                        lblValue: navData.buyerName ? navData.buyerName : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.buyerAddressWithColon', false),
                        lblValue: navData.buyerAddress ? navData.buyerAddress : NA
                    }
                ];
            } catch (err) {
                var errorObj = {
                    "method": "renderBuyer",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :renderGoodsAndShipment
         * Rendering Goods And Shipment
         * @arg1 : NA
         * @return : NA
         */
        renderGoodsAndShipment: function () {
            var scope = this;
            try {
                goodsAndShipmentArray = [
                    {
                        flxDetails: {
                            top: '20dp'
                        },
                        lblKey: {
                            text: presenter.renderI18nKeys('i18n.TradeSupplyFinance.goodsAndShipment', false),
                            skin: headerBoldSkin
                        },
                        flxValue: {
                            isVisible: false
                        }
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.goodsDescriptionWithColon', false),
                        lblValue: navData.goodsDescription ? navData.goodsDescription : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.shipmentDateWithColon', false),
                        lblValue: navData.shipmentDate ? presenter.formatUtilManager.getFormattedCalendarDate(navData.shipmentDate) : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.shipmentAndTrackingWithColon', false),
                        lblValue: navData.shipmentTrackingDetails ? navData.shipmentTrackingDetails : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.countryOfOriginWithColon', false),
                        lblValue: navData.countryOfOrigin ? navData.countryOfOrigin : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.countryOfDestinationWithColon', false),
                        lblValue: navData.countryOfDestination ? navData.countryOfDestination : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.modeOfShipmentOptionalWithColon', false),
                        lblValue: navData.modeOfShipment ? navData.modeOfShipment : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.portOfLoadingOptionalWithColon', false),
                        lblValue: navData.portOfLoading ? ((new Date(navData.portOfLoading)).getTime() > 0 ? presenter.formatUtilManager.getFormattedCalendarDate(navData.portOfLoading) : navData.portOfLoading) : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.portOfDischargeOptionalWithColon', false),
                        lblValue: navData.portOfDischarge ? ((new Date(navData.portOfDischarge)).getTime() > 0 ? presenter.formatUtilManager.getFormattedCalendarDate(navData.portOfDischarge) : navData.portOfDischarge) : NA
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.finalDestinationOptionalWithColon', false),
                        lblValue: navData.finalDestination ? navData.finalDestination : NA
                    }
                ];
            } catch (err) {
                var errorObj = {
                    "method": "renderGoodsAndShipment",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :renderDocumentsMessageToBank
         * Rendering Documents Message To Bank
         * @arg1 : NA
         * @return : NA
         */
        renderDocumentsMessageToBank: function () {
            var scope = this;
            try {
                documentsMessageToBankArray = [
                    {
                        flxDetails: {
                            top: '20dp'
                        },
                        lblKey: {
                            text: presenter.renderI18nKeys('i18n.TradeSupplyFinance.documentsAndMessageToBank', false),
                            skin: headerBoldSkin
                        },
                        flxValue: {
                            isVisible: false
                        }
                    },
                    {
                        lblKey: presenter.renderI18nKeys('i18n.TradeFinance.messageToBankOptionalWithColon', false),
                        lblValue: navData.messageToBank ? navData.messageToBank : NA
                    }
                ];
                scope.processDocsResponse(documentsMessageToBankArray, 'uploadedDocuments', 'i18n.TradeFinance.uploadedDocumentsWithColon');
            } catch (err) {
                var errorObj = {
                    "method": "renderDocumentsMessageToBank",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api : morphAcNumber
         * Morphing the account numbers based on response
         * @arg: err - object based on error
         * @return : NA
         */
        morphAcNumber: function (inputAcID) {
            var scope = this;
            try {
                let accountList = applicationManager.getConfigurationManager().userAccounts;
                for (let i = 0; i < accountList.length; i++) {
                    if (accountList[i].accountID == inputAcID) {
                        return CommonUtilities.mergeAccountNameNumber(accountList[i].nickName || accountList[i].accountName, accountList[i].accountID);
                    }
                }
                return NA;
            } catch (err) {
                var errorObj = {
                    "method": "morphAcNumber",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * @api :processDocsResponse
         * Processing docs data to print in UI
         * @arg : NA
         * @return : NA
         */
        processDocsResponse: function (arrayToAppend, key, i18n) {
            var scope = this;
            try {
                if (navData[key]) {
                    const cancellationDocuments = JSON.parse(navData[key].replace(/'/g, '"'));
                    for (let i = 0; i < cancellationDocuments.length; i++) {
                        [arrayToAppend].push({
                            lblKey: {
                                text: i === 0 ? presenter.renderI18nKeys(i18n, false) : ''
                            },
                            lblValue: cancellationDocuments[i].documentName || NA,
                            flxMain: {
                                height: (i === cancellationDocuments.length - 1) ? '40dp' : '30dp'
                            }
                        });
                    }
                }
            } catch (err) {
                var errorObj = {
                    "method": "processDocsResponse",
                    "error": err
                };
                scope.onError(errorObj);
            }
        },

        /**
         * Entry point method for the form controller
         * @param {Object} viewModel - it contains the set of view properties and keys.
         */
        updateFormUI: function (viewModel) {
            if (viewModel.isLoading === true) {
                FormControllerUtility.showProgressBar(this.view);
            } else if (viewModel.isLoading === false) {
                FormControllerUtility.hideProgressBar(this.view);
            }
        },

        /**
         * @api : onError
         * Error thrown from catch block in component and shown on the form
         * @arg: err - object based on error
         * @return : NA
         */
        onError: function (err) {
            let errMsg = JSON.stringify(err);
            errMsg.level = "frmReceivableBillsPrint";
            // kony.ui.Alert(errMsg);
        },
    };
});
