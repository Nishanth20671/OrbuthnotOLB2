define(['FormControllerUtility', 'CommonUtilities', 'ViewConstants', 'OLBConstants'], function(FormControllerUtility, CommonUtilities, ViewConstants, OLBConstants) {
     
    var orientationHandler = new OrientationHandler();
    return {
        profileAccess: "",
        init: function() {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = this.onBreakpointChange;

            this.presenter = applicationManager.getModulesPresentationController({ 'appName': 'BillPayMA', 'moduleName': 'BillPaymentUIModule' });
            this.view.btnbacktopayeelist.onClick = function () {
                kony.mvc.getNavigationManager().navigate({
                    context: this,
                    params: {
                        "refreshComponent": false
                    },
                    callbackModelConfig: {
                        managePayees: true
                    }
                });
            }.bind(this);
            this.view.flxAddPayee.onClick = function() {
                this.presenter.showBillPaymentScreen({
                    context: "AddPayee"
                })
            }.bind(this);
            this.view.flxMakeOneTimePayment.onClick = function() {
                this.presenter.showBillPaymentScreen({
                    context: "MakeOneTimePayment"
                })
            }.bind(this);
        },
        onBreakpointChange: function(form, width) {
            var scopeObj = this;
            FormControllerUtility.setupFormOnTouchEnd(width);
            
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
            this.view.CustomPopup.onBreakpointChangeComponent(scopeObj.view.CustomPopup, width);
            this.view.deletePopup.onBreakpointChangeComponent(scopeObj.view.deletePopup, width);
        },
        preShow: function() {
            this.profileAccess = applicationManager.getUserPreferencesManager().profileAccess;
            this.view.customheadernew.activateMenu("Bill Pay", "My Payee List");
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['flxHeader', 'flxFooter']);
            this.view.imgSortFrom.toolTip = kony.i18n.getLocalizedString("i18n.payments.sortByBillDate");
            this.view.imgSortDate.toolTip = kony.i18n.getLocalizedString("i18n.payments.sortByPaidDate");
            this.view.imgSortFromAccount.toolTip = kony.i18n.getLocalizedString("i18n.payments.sortByAccount");
            this.view.btnbacktopayeelist.toolTip = kony.i18n.getLocalizedString("i18n.Transfers.BACKTOPAYEELIST");
            
        },
        postShow: function() {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
            applicationManager.executeAuthorizationFramework(this);
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
            if (viewModel.data && viewModel.payeeActivities) {
                this.bindViewActivityData(viewModel.data, viewModel.payeeActivities);
            }
            if (viewModel.billDueData) {
                this.bindTotalEbillAmountDue(viewModel.billDueData);
            }
        },
        /**
         * Method to handle and display bill payment activity data.
         * @param {object} data contains header data i.e. payee name and account number
         * @param {object} response contains payment activities data
         */
        bindViewActivityData: function(data, response) {
            var scopeObj = this;
            //if(configurationManager.isCombinedUser === "true"){
            if (this.profileAccess === "both") {
                this.view.flxFromUser.setVisibility(true);
                this.view.lblFromUser.text = data.isBusinessPayee === "1" ? "r" : "s";
            }
            CommonUtilities.setText(scopeObj.view.lblAccountName, data.payeeName, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblAccountHolder, data.payeeAccountNumber ? data.payeeAccountNumber : " ", CommonUtilities.getaccessibilityConfig());
            if (response.length === 0) {
                CommonUtilities.setText(scopeObj.view.lblAmountDeducted, kony.i18n.getLocalizedString("i18n.common.NA"), CommonUtilities.getaccessibilityConfig());
                scopeObj.view.flxSegment.setVisibility(false);
                scopeObj.view.flxNoRecords.setVisibility(true);
                this.view.flxFormContent.forceLayout();
                return;
            }
            scopeObj.view.flxSegment.setVisibility(true);
            scopeObj.view.flxNoRecords.setVisibility(false);
            var totalAmount = response[0].billPaidAmount ? scopeObj.formatAmount(response[0].billPaidAmount, false, applicationManager.getFormatUtilManager().getCurrencySymbol(response[0].transactionCurrency)) : kony.i18n.getLocalizedString("i18n.common.none");
            var dataMap = {
                "lblDate": "lblDate",
                "flxbills": "flxbills",
                "btnBills": "btnBills",
                "lblpaiddate": "lblpaiddate",
                "lblFrom": "lblFrom",
                "flxActivityUser": "flxActivityUser",
                "lblActivityUser": "lblActivityUser",
                "lblAmount": "lblAmount",
                "lblStatus": "lblStatus",
                "lblFromHeader": "lblFromHeader",
                "lblAmountHeader": "lblAmountHeader",
                "lblAmount1": "lblAmount",
                "lblSeparator": "lblSeparator"
            };
            response = response.map(function(dataItem, index) {
                var payeeNickName = dataItem.payeeNickName ? dataItem.payeeNickName : kony.i18n.getLocalizedString("i18n.common.none");
                var fromAccountName = dataItem.fromAccountName ? dataItem.fromAccountName : kony.i18n.getLocalizedString("i18n.common.none");
                var billGeneratedDate = dataItem.billGeneratedDate ? dataItem.billGeneratedDate : kony.i18n.getLocalizedString("i18n.common.none");
                return {
                    "lblDate": dataItem.billGeneratedDate ? scopeObj.getDateFromDateString(dataItem.billGeneratedDate, "YYYY-MM-DDTHH:MM:SS") : kony.i18n.getLocalizedString("i18n.common.none"),
                    "flxbills": {
                        "onClick": applicationManager.getConfigurationManager().canViewPastEBills === 'true' && dataItem.eBillStatus == 1 ? scopeObj.viewEBill.bind(scopeObj, {
                            "billGeneratedDate": dataItem.billGeneratedDate ? scopeObj.getDateFromDateString(dataItem.billGeneratedDate, "YYYY-MM-DDTHH:MM:SS") : kony.i18n.getLocalizedString("i18n.common.none"),
                            "amount": dataItem.billDueAmount ? scopeObj.formatAmount(dataItem.billDueAmount, false, applicationManager.getFormatUtilManager().getCurrencySymbol(dataItem.transactionCurrency)) : kony.i18n.getLocalizedString("i18n.common.none"),
                            "ebillURL": dataItem.ebillURL
                        }) : null
                    },
                    "btnBills": {
                        "text": scopeObj.formatBillString(payeeNickName, fromAccountName, scopeObj.getDateFromDateString(billGeneratedDate, "YYYY-MM-DDTHH:MM:SS"))
                    },
                    "lblpaiddate": dataItem.billPaidDate ? scopeObj.getDateFromDateString(dataItem.billPaidDate, "YYYY-MM-DDTHH:MM:SS") : kony.i18n.getLocalizedString("i18n.common.none"),
                    "lblFrom": dataItem.fromAccountName ? CommonUtilities.getAccountDisplayName({
                        name: dataItem.fromAccountName,
                        accountID: dataItem.fromAccountNumber,
                        Account_id: dataItem.fromAccountNumber
                    }) : kony.i18n.getLocalizedString("i18n.common.none"),
                    "flxActivityUser": {
                        "isVisible": (applicationManager.getUserPreferencesManager().isSingleCustomerProfile === false) ? true : false
                        //"isVisible": (configurationManager.isCombinedUser === "true")? true : false
                    },
                    "lblActivityUser": {
                        "text": scopeObj.presenter.isBusinessAccount(dataItem.fromAccountNumber) === "true" ? "r" : "s", //dataItem.isBusinessPayee === "1" ? "r" : "s"
                    },
                    "lblAmount": dataItem.amount ? scopeObj.formatAmount(dataItem.amount, false, applicationManager.getFormatUtilManager().getCurrencySymbol(dataItem.transactionCurrency)) : kony.i18n.getLocalizedString("i18n.common.none"),
                    "lblStatus": dataItem.statusDescription ? dataItem.statusDescription : kony.i18n.getLocalizedString("i18n.common.none"),
                    "template": (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) ? "flxBillPaymentActivityMobile" : "flxBillPaymentActivity",
                    "lblSeparator": {
                        "isVisible": index !== response.length - 1
                    }
                };
            });
            CommonUtilities.setText(scopeObj.view.lblAmountDeducted, totalAmount, CommonUtilities.getaccessibilityConfig());
            scopeObj.view.segTransferActivity.widgetDataMap = dataMap;
            scopeObj.view.segTransferActivity.setData(response);
            scopeObj.view.flxFormContent.forceLayout();
        },
        /**
         * used to show the dueBills count and totalDueBills Amount
         * @param {object} dueBills contains the no of bills and totalBillDueAmount
         */
        bindTotalEbillAmountDue: function(dueBills) {
            var scopeObj = this;
            if (dueBills && dueBills.count === 0) {
                scopeObj.view.flxTotalEbillAmountDue.setVisibility(false);
            } else {
                scopeObj.view.flxTotalEbillAmountDue.setVisibility(true);
                CommonUtilities.setText(scopeObj.view.lblBills, dueBills.count + " " + kony.i18n.getLocalizedString("i18n.billPay.eBills"), CommonUtilities.getaccessibilityConfig());
                CommonUtilities.setText(scopeObj.view.lblEbillAmountDueValue, scopeObj.formatAmount(String(dueBills.totalDueAmount)), CommonUtilities.getaccessibilityConfig());
            }
            scopeObj.view.forceLayout();
        },
        /**
         * used to convert the CalenderFormat Date from string formated date
         */
        getDateFromDateString: function(dateString, inputFormat) {
            var fu = applicationManager.getFormatUtilManager();
            var dateObj = fu.getDateObjectfromString(dateString, inputFormat);
            var outputDate = fu.getFormatedDateString(dateObj, fu.getApplicationDateFormat());
            return outputDate;
        },
        /**
         * used to format the amount
         */
        formatAmount: function(amount, currencySymbolNotRequired, currencySymbol) {
            return this.presenter.formatAmount(amount, currencySymbolNotRequired);
        },
        /**
         * returns formatted string with Account name, Month, year
         */
        formatBillString: function(payeeNickName, fromAccountName, billDate) {
            var monthString = kony.i18n.getLocalizedString("i18n.common.none");
            var year = kony.i18n.getLocalizedString("i18n.common.none");
            if (billDate !== "") {
                var dateObj = applicationManager.getFormatUtilManager().getDateObjectFromCalendarString(billDate, applicationManager.getFormatUtilManager().getDateFormat());
                monthString = dateObj.getMonth() + 1;
                year = dateObj.getFullYear();
            }
            return payeeNickName.split(' ')[0] + '-' + fromAccountName.split(' ')[0] + '-' + monthString + '-' + year;
        },
        /**
         * used to show the permission based UI
         */
        showAddPayeeOption: function() {
            this.view.flxAddPayee.setVisibility(true);
        },
        /**
         * used to hide the permission based UI
         */
        hideAddPayeeOption: function() {
            this.view.flxAddPayee.setVisibility(false);
        },
        /**
         * used to show the permission based UI
         */
        showOneTimePaymentOption: function() {
            this.view.flxMakeOneTimePayment.setVisibility(true);
        },
        /**
         * used to hide the permission based UI
         */
        hideOneTimePaymentOption: function() {
            this.view.flxMakeOneTimePayment.setVisibility(false);
        }
    };
});