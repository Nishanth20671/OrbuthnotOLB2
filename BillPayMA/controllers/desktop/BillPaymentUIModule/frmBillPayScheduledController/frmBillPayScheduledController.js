/**
 * Description of Module representing a Confirm form.
 * @module frmBillPayScheduledController
 */
define(['CommonUtilities', 'OLBConstants', 'ViewConstants', 'FormControllerUtility'], function(CommonUtilities, OLBConstants, ViewConstants, FormControllerUtility) {
     
    var orientationHandler = new OrientationHandler();
    return /** @alias module:frmBillPayScheduledController */ {
        /** updates the present Form based on required function.
         * @param {uiDataMap[]} uiDataMap
         */
        profileAccess: "",
        updateFormUI: function(uiDataMap) {
            if (uiDataMap.isLoading) {
                FormControllerUtility.showProgressBar(this.view);
            } else {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (uiDataMap.scheduledBills && uiDataMap.sortingInputs) {
                this.bindScheduleBills(uiDataMap.scheduledBills);
                this.initializeSearchAndFilterActions(uiDataMap.scheduledBills);
                FormControllerUtility.updateSortFlex(this.scheduledSortMap, uiDataMap.sortingInputs);
            }
            if (uiDataMap.serverError) {
                this.setServerError(uiDataMap.serverError);
            }
            if (uiDataMap.billDueData) {
                this.bindTotalEbillAmountDue(uiDataMap.billDueData);
            }
        },
        init: function() {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = this.onBreakpointChange;
            this.presenter = applicationManager.getModulesPresentationController({ 'appName': 'BillPayMA', 'moduleName': 'BillPaymentUIModule' });
            this.initActions();
        },
        preShow: function() {
            this.profileAccess = applicationManager.getUserPreferencesManager().profileAccess;
            this.view.customheadernew.activateMenu("Bill Pay", "Pay a Bill");
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['flxHeader', 'flxFooter']);
            this.view.flxDowntimeWarning.setVisibility(false);
            this.view.imgSearch.toolTip = kony.i18n.getLocalizedString("i18n.serviceRequests.Search");
            this.view.btnAllPayees.toolTip = kony.i18n.getLocalizedString("i18n.billPay.AllPayees");
            this.view.btnPayementDue.toolTip = kony.i18n.getLocalizedString("i18n.billPay.PaymentDue");
            this.view.btnScheduled.toolTip = kony.i18n.getLocalizedString("i18n.billPay.scheduled");
            this.view.btnHistory.toolTip = kony.i18n.getLocalizedString("i18n.kony.BulkPayments.bulkPaymentHistory");
            this.view.btnManagePayee.toolTip = kony.i18n.getLocalizedString("i18n.billPay.ManagePayee");
            this.view.txtSearch.toolTip = kony.i18n.getLocalizedString("i18n.payments.searchtooltip");
            this.view.imgSortDate.toolTip = kony.i18n.getLocalizedString("i18n.payments.sortByDate");
            this.view.imgPayeeSort.toolTip = kony.i18n.getLocalizedString("i18n.payments.sortByPayee");
            this.view.imgBillPaySort.toolTip = kony.i18n.getLocalizedString("i18n.payments.sortByBillAmount");
            this.view.imgSchedledAmountSort.toolTip = kony.i18n.getLocalizedString("i18n.payments.sortByAmount");
            this.view.lblScheduleAPayment.toolTip = kony.i18n.getLocalizedString("i18n.billPay.ScheduleAPayment");
            this.view.imgInfo.toolTip = kony.i18n.getLocalizedString("kony.mb.NAO.Info");
            this.view.imgCancel.toolTip = kony.i18n.getLocalizedString("i18n.common.close");
            this.view.imgZoom.toolTip = kony.i18n.getLocalizedString("i18n.payments.zoom");
            this.view.imgDownload.toolTip = kony.i18n.getLocalizedString("i18n.common.Download");
            this.view.imgFlip.toolTip = kony.i18n.getLocalizedString("i18n.payments.flip");
        },
        /**
         * used perform the initialize activities.
         *
         */
        initActions: function() {
            var scopeObj = this;
            scopeObj.setScheduledSorting();
            //scopeObj.view.flxFiltersList.onClick = scopeObj.onFiltersBtnClick.bind(scopeObj);
            scopeObj.setTabActions();
        },
        /**
         * used to perform the post show activities
         *
         */
        postShow: function() {
            var scopeObj = this;
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
            applicationManager.executeAuthorizationFramework(this);
            this.accessibilityFocusSetup();
        },
        /**
         * Set foucs handlers for skin of parent flex on input focus 
         */
        accessibilityFocusSetup: function() {
            let widgets = [
                [this.view.txtSearch, this.view.flxtxtSearchandClearbtn]
            ]
            for (let i = 0; i < widgets.length; i++) {
                CommonUtilities.setA11yFoucsHandlers(widgets[i][0], widgets[i][1], this)
            }
        },
        /**
         * used to load the  due payements
         * @param {object} dueBills due bills
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
         * sorting configurations to billPay
         */
        setScheduledSorting: function() {
            var scopeObj = this;
            scopeObj.scheduledSortMap = [{
                    name: 'scheduledDate',
                    imageFlx: scopeObj.view.imgSortDate,
                    clickContainer: scopeObj.view.flxScheduledDateWrapper
                },
                {
                    name: 'nickName',
                    imageFlx: scopeObj.view.imgPayeeSort,
                    clickContainer: scopeObj.view.flxScheduledPayeeWrapper
                },
                {
                    name: 'billDueAmount',
                    imageFlx: scopeObj.view.imgBillPaySort,
                    clickContainer: scopeObj.view.flxBillAmountWrapper
                },
                {
                    name: 'amount',
                    imageFlx: scopeObj.view.imgSchedledAmountSort,
                    clickContainer: scopeObj.view.flxScheduledAmountWrapper
                },
            ];
            FormControllerUtility.setSortingHandlers(scopeObj.scheduledSortMap, scopeObj.onScheduledSortClickHandler, scopeObj);
        },

        /**
         * used to bind schedule Bills
         * @param {object} scheduledBills scheduled bills
         */
        bindScheduleBills: function(scheduledBills) {
            var scopeObj = this;
            scopeObj.view.flxNoPayment.setVisibility(false);
            scopeObj.view.flxSegmentContainer.setVisibility(true);
            scopeObj.view.flxHorizontalLine.setVisibility(true);
            scopeObj.view.flxHorizontalLine2.setVisibility(true);
            //if(configurationManager.isCombinedUser === "true"){
            if (applicationManager.getUserPreferencesManager().isSingleCustomerProfile === false) {
                scopeObj.view.flxScheduledSearch.setVisibility(true);
                if (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) {
                    scopeObj.view.flxFiltersList.setVisibility(false);
                    scopeObj.view.flxtxtSearchandClearbtn.right = "3.5%";
                }
            } else {
                scopeObj.view.flxScheduledSearch.setVisibility(false);
            }
            if (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) {
                scopeObj.view.flxBillPayScheduled.setVisibility(false);
            } else {
                scopeObj.view.flxBillPayScheduled.setVisibility(true);
            }
            if (scheduledBills.length === 0) {
                scopeObj.showNoPayementDetails({
                    noPaymentMessageI18Key: "i18n.billPay.noPaymentScheduleMessage",
                    showActionMessageI18Key: "i18n.billPay.ScheduleAPayment"
                });
                this.view.flxScheduledSearch.setVisibility(false);
            } else {
                var dataMap = {
                    "lblIdentifier": "lblIdentifier",
                    "lblSeperatorone": "lblSeperatorone",
                    "lblSeparator": "lblSeparator",
                    "lblDropdown": "lblDropdown",
                    "flxDropdown": "flxDropdown",
                    "lblDate": "lblDate",
                    "lblPayeeName": "lblPayeeName",
                    "lblBillDueAmount": "lblBillDueAmount",
                    "lblPaidAmount": "lblPaidAmount",
                    "btnEdit": "btnEdit",
                    "lblRefrenceNumber": "lblRefrenceNumber",
                    "lblRefrenceNumberValue": "lblRefrenceNumberValue",
                    "lblSentFrom": "lblSentFrom",
                    "lblSentFromValue": "lblSentFromValue",
                    "lblNotes": "lblNotes",
                    "lblNotesValue": "lblNotesValue",
                    "btnCancel": "btnCancel",
                    "btnEbill": "btnEbill",
                    "flxCombinedEbill": "flxCombinedEbill",
                    "btnCombinedEbill": "btnCombinedEbill",
                    "flxRecurrenceNumber": "flxRecurrenceNumber",
                    "lblRecurrenceNo": "lblRecurrenceNo",
                    "lblRecurrenceNoValue": "lblRecurrenceNoValue",
                    "flxFrequency": "flxFrequency",
                    "lblFrequencyTitle": "lblFrequencyTitle",
                    "lblFrequencyValue": "lblFrequencyValue",
                    "flxCancelSeries": "flxCancelSeries",
                    "btnCancelSeries": "btnCancelSeries",
                    "flxIdentifier": "flxIdentifier",
                    "flxBillPaymentScheduledSelected": "flxBillPaymentScheduledSelected",
                    "flxBillPaymentScheduledSelectedMobile": "flxBillPaymentScheduledSelectedMobile",
                    "lblIcon": "lblIcon",
                    "lblFromIcon": "lblFromIcon",
                    "flxPayeeIcon": "flxPayeeIcon",
                    "flxFromIcon": "flxFromIcon",
                    "flxEdit": "flxEdit",
                    "flxAction": "flxAction",
                    "flxPaidAmount": "flxPaidAmount"
                };
                scheduledBills = scheduledBills.map(function(dataItem) {
                    dataItem.payeeName = dataItem.payeeNickName || dataItem.payeeName;
                    dataItem.paidAmount = dataItem.amount;
                    dataItem.notes = dataItem.transactionsNotes || "";
                    dataItem.referenceNumber = dataItem.referenceId;
                    dataItem.lastPaidAmount = dataItem.billPaidAmount;
                    dataItem.lastPaidDate = dataItem.billPaidDate;
                    dataItem.eBillStatus = dataItem.eBillEnable;
                    dataItem.billDueDate = dataItem.billDueDate;
                    dataItem.dueAmount = scopeObj.formatAmount(dataItem.billDueAmount, false, applicationManager.getFormatUtilManager().getCurrencySymbol(dataItem.transactionCurrency));
                    dataItem.payeeNickname = dataItem.payeeName;
                    dataItem.sendOn = dataItem.scheduledDate;
                    dataItem.isScheduleEditFlow = true;
                    var dataObject = {
                        "lblDropdown": ViewConstants.FONT_ICONS.CHEVRON_DOWN,
                        "flxDropdown": {
                            onClick: scopeObj.handleSegmentRowView.bind(scopeObj)
                        },
                        "lblSeparatorBottom": {
                            "text": " "
                        },
                        "lblIdentifier": {
                            "text": " ",
                            "skin": "sknffffff15pxolbfonticons"
                        },
                        "flxIdentifier": {
                            "skin": "sknFlxIdentifier"
                        },
                        "flxBillPaymentScheduledSelected": {
                            "height": "50dp",
                            "skin": "sknflxffffffnoborder"
                        },
                        "flxBillPaymentScheduledSelectedMobile": {
                            "height": "80dp",
                            "skin": "sknflxffffffnoborder"
                        },
                        "flxEdit": {
                            "isVisible": false
                        },
                        "lblDate": {
                            "text": scopeObj.getDateFromDateString(dataItem.scheduledDate, "YYYY-MM-DDTHH:MM:SS"),
                            "accessibilityconfig": {
                                "a11yLabel": scopeObj.getDateFromDateString(dataItem.scheduledDate, "YYYY-MM-DDTHH:MM:SS")
                            }
                        },
                        "lblPayeeName": {
                            "text": dataItem.payeeName,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.payeeName
                            }
                          
                        },
                        "lblBillDueAmount": {
                            "text": scopeObj.formatAmount(dataItem.billDueAmount, false, applicationManager.getFormatUtilManager().getCurrencySymbol(dataItem.transactionCurrency)),
                            "accessibilityconfig": {
                                "a11yLabel": scopeObj.formatAmount(dataItem.billDueAmount, false, applicationManager.getFormatUtilManager().getCurrencySymbol(dataItem.transactionCurrency))
                            },
                          "left": CommonUtilities.isMirrorLayoutEnabled() ? "" : "50px",
                          "right": CommonUtilities.isMirrorLayoutEnabled() ? "78px" : "",
                        },
                        "lblPaidAmount": {
                            "text": scopeObj.formatAmount(dataItem.paidAmount, false, applicationManager.getFormatUtilManager().getCurrencySymbol(dataItem.transactionCurrency)),
                            "accessibilityconfig": {
                                "a11yLabel": scopeObj.formatAmount(dataItem.paidAmount, false, applicationManager.getFormatUtilManager().getCurrencySymbol(dataItem.transactionCurrency))
                            },
                          "left": CommonUtilities.isMirrorLayoutEnabled() ? "12px" : "72px",
                          },
                        "btnEdit": {
                            "text": kony.i18n.getLocalizedString("i18n.billPay.Edit"),
                            "onClick": function() {
                                dataItem.onCancel = function() {
                                    kony.mvc.getNavigationManager().navigate({
                                        context: this,
                                        callbackModelConfig: {
                                            scheduled: true
                                        }
                                    });
                                };
                                scopeObj.presenter.showBillPaymentScreen({
                                    "sender": null,
                                    "context": 'PayABill',
                                    "loadBills": true,
                                    "data": dataItem
                                });
                            },
                            "isVisible": applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_CREATE")
                        },
                        "lblSeparator": "A",
                        "lblSeperatorone": "A",
                        "lblRefrenceNumber": {
                            "text": kony.i18n.getLocalizedString("i18n.transfers.RefrenceNumber"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.transfers.RefrenceNumber")
                            }
                        },
                        "lblRefrenceNumberValue": {
                            "text": dataItem.referenceNumber,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.referenceNumber
                            }
                        },
                        "lblSentFrom": kony.i18n.getLocalizedString("i18n.billPay.sentFrom"),
                        "lblSentFromValue": {
                            "text": CommonUtilities.getAccountDisplayName({
                                name: dataItem.fromAccountName,
                                accountID: dataItem.fromAccountNumber,
                                nickName: dataItem.fromNickName,
                                Account_id: dataItem.fromAccountNumber
                            }),
                            "accessibilityconfig": {
                                "a11yLabel": CommonUtilities.getAccountDisplayName({
                                    name: dataItem.fromAccountName,
                                    accountID: dataItem.fromAccountNumber,
                                    nickName: dataItem.fromNickName,
                                    Account_id: dataItem.fromAccountNumber
                                })
                            }
                        },
                        "lblNotes": {
                            "text": kony.i18n.getLocalizedString("i18n.transfers.Description"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.transfers.Description")
                            }
                        },
                        "lblNotesValue": {
                            "text": dataItem.notes ? dataItem.notes : kony.i18n.getLocalizedString("i18n.common.none"),
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.notes ? dataItem.notes : kony.i18n.getLocalizedString("i18n.common.none")
                            }
                        },
                        "lblFrequencyTitle": {
                            "text": kony.i18n.getLocalizedString("i18n.transfers.lblFrequency"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.transfers.lblFrequency"),
                            }
                        },
                        "lblFrequencyValue": {
                            "text": dataItem.frequencyType ? dataItem.frequencyType : kony.i18n.getLocalizedString("i18n.common.none"),
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.frequencyType ? dataItem.frequencyType : kony.i18n.getLocalizedString("i18n.common.none")
                            }
                        },
                        "flxRecurrenceNumber": {
                            "isVisible": dataItem.frequencyType === OLBConstants.TRANSACTION_RECURRENCE.ONCE ? false : true
                        },
                        "lblRecurrenceNo": {
                            "text": kony.i18n.getLocalizedString("i18n.accounts.recurrence"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.accounts.recurrence"),
                            }
                        },
                        "lblRecurrenceNoValue": {
                            "text": dataItem.recurrenceDesc ? dataItem.recurrenceDesc : "-",
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.recurrenceDesc ? dataItem.recurrenceDesc : "-"
                            }
                        },
                        "btnCancel": {
                            "text": dataItem.frequencyType === OLBConstants.TRANSACTION_RECURRENCE.ONCE ? kony.i18n.getLocalizedString("i18n.transfers.Cancel") : kony.i18n.getLocalizedString("i18n.common.cancelThisOccurrence"),
                            "toolTip": dataItem.frequencyType === OLBConstants.TRANSACTION_RECURRENCE.ONCE ? kony.i18n.getLocalizedString("i18n.transfers.Cancel") : kony.i18n.getLocalizedString("i18n.common.cancelThisOccurrence"),
                            "onClick": CommonUtilities.isCSRMode() ? CommonUtilities.disableButtonActionForCSRMode() : dataItem.frequencyType === OLBConstants.TRANSACTION_RECURRENCE.ONCE ? scopeObj.onScheduledCancelBtnClick.bind(scopeObj, dataItem) : scopeObj.onCancelOccurrence.bind(scopeObj, dataItem),
                            "isVisible": CommonUtilities.isCSRMode() ? true : applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_CREATE")
                        },
                        "btnCancelSeries": {
                            "text": kony.i18n.getLocalizedString("i18n.common.cancelSeries"),
                            "toolTip": kony.i18n.getLocalizedString("i18n.common.cancelSeries"),
                            "onClick": CommonUtilities.isCSRMode() ? CommonUtilities.disableButtonActionForCSRMode() : scopeObj.onScheduledCancelBtnClick.bind(scopeObj, dataItem),
                            "isVisible": dataItem.frequencyType === OLBConstants.TRANSACTION_RECURRENCE.ONCE ? false : (CommonUtilities.isCSRMode() ? true : applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_CREATE"))
                        },
                        "lblIcon": {
                            "text": dataItem.isBusinessPayee === "1" ? "r" : "s",
                            // "isVisible": applicationManager.getConfigurationManager().isCombinedUser === "true" ? true : false
                            "isVisible": this.profileAccess === "both" ? true : false
                        },
                        "lblFromIcon": {
                            "text": scopeObj.presenter.isBusinessAccount(dataItem.fromAccountNumber) === "true" ? "r" : "s",
                            //"isVisible": applicationManager.getConfigurationManager().isCombinedUser === "true" ? true : false
                            "isVisible": scopeObj.profileAccess === "both" ? true : false
                        },
                        "flxPayeeIcon": {
                            //"isVisible": applicationManager.getConfigurationManager().isCombinedUser === "true" ? true : false
                            "isVisible": false //this.profileAccess === "both" ? true : false
                        },
                        "flxFromIcon": {
                            //"isVisible": applicationManager.getConfigurationManager().isCombinedUser === "true" ? true : false
                            "isVisible": scopeObj.profileAccess === "both" ? true : false
                        },
                        "btnEbill": {
                            "text": dataItem.eBillStatus == 1 ? kony.i18n.getLocalizedString("i18n.billPay.viewEBill") : '',
                            "onClick": dataItem.eBillStatus == 1 ? scopeObj.viewEBill.bind(scopeObj, {
                                "billGeneratedDate": scopeObj.getDateFromDateString(dataItem.billGeneratedDate, "YYYY-MM-DDTHH:MM:SS"),
                                "amount": scopeObj.formatAmount(dataItem.billDueAmount, false, applicationManager.getFormatUtilManager().getCurrencySymbol(dataItem.transactionCurrency)),
                                "ebillURL": dataItem.ebillURL
                            }) : null,
                            //"isVisible" : applicationManager.getConfigurationManager().isCombinedUser === "true" ?((kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile === true) ? false : (CommonUtilities.isCSRMode() ? true : applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_VIEW_PAYEES"))) :(CommonUtilities.isCSRMode() ? true : applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_VIEW_PAYEES"))
                            "isVisible": this.profileAccess === "both" ? ((kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile === true) ? false : (CommonUtilities.isCSRMode() ? true : applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_VIEW_PAYEES"))) : (CommonUtilities.isCSRMode() ? true : applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_VIEW_PAYEES"))
                        },
                        "flxCombinedEbill": {
                            //"isVisible" : (applicationManager.getConfigurationManager().isCombinedUser === "true" && (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile === true)) 	? true : false
                            "isVisible": (this.profileAccess === "both" && (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile === true)) ? true : false
                        },
                        "btnCombinedEbill": {
                            "text": dataItem.eBillStatus == 1 ? kony.i18n.getLocalizedString("i18n.billPay.viewEBill") : '',
                            "onClick": dataItem.eBillStatus == 1 ? scopeObj.viewEBill.bind(scopeObj, {
                                "billGeneratedDate": scopeObj.getDateFromDateString(dataItem.billGeneratedDate, "YYYY-MM-DDTHH:MM:SS"),
                                "amount": scopeObj.formatAmount(dataItem.billDueAmount, false, applicationManager.getFormatUtilManager().getCurrencySymbol(dataItem.transactionCurrency)),
                                "ebillURL": dataItem.ebillURL
                            }) : null,
                            "isVisible": (CommonUtilities.isCSRMode() ? true : applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_VIEW_PAYEES")) && (applicationManager.getConfigurationManager().isCombinedUser === "true")
                        },
                        "flxAction": {
                            "right": (kony.application.getCurrentBreakpoint() === 1366 ||kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet || orientationHandler.isDesktop) ? "50dp" : "15dp"
                        },
                        "flxPaidAmount": {
                            "width": "161px"
                        },
                        "template": (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) ? "flxBillPaymentScheduledSelectedMobile" : "flxBillPaymentScheduledSelected"
                    };
                    if (CommonUtilities.isCSRMode()) {
                        dataObject.btnCancel.skin = CommonUtilities.disableSegmentButtonSkinForCSRMode(15);
                    }
                    return dataObject;
                });
                scopeObj.view.segmentBillpay.widgetDataMap = dataMap;
                scopeObj.view.segmentBillpay.setData(scheduledBills);
            }
            scopeObj.view.forceLayout();
        },

        /**
         * used to show the no payees flow.
         * @param {message} message used to show the no message message on the page
         */
        showNoPayementDetails: function(message) {
            var scopeObj = this;
            if (message) {
                scopeObj.view.flxNoPayment.setVisibility(true);
                scopeObj.view.flxSegmentContainer.setVisibility(false);
                scopeObj.view.flxBillPayScheduled.setVisibility(false);
                scopeObj.view.flxHorizontalLine.setVisibility(false);
                scopeObj.view.flxHorizontalLine2.setVisibility(false);
                scopeObj.view.rtxNoPaymentMessage.text = kony.i18n.getLocalizedString(message.noPaymentMessageI18Key);
                if (message.showActionMessageI18Key) {
                    scopeObj.view.lblScheduleAPayment.setVisibility(false);
                    CommonUtilities.setText(scopeObj.view.lblScheduleAPayment, kony.i18n.getLocalizedString(message.showActionMessageI18Key), CommonUtilities.getaccessibilityConfig());
                }
            }
        },

        /**
         * used to format the amount
         * @param {string} amount amount
         * @param {boolean} currencySymbolNotRequired currency symbol required
         * @returns {string} formated amount
         */
        formatAmount: function(amount, currencySymbolNotRequired, currencySymbol) {
            if (currencySymbolNotRequired) {
                return applicationManager.getFormatUtilManager().formatAmount(amount);
            } else {
                return applicationManager.getFormatUtilManager().formatAmountandAppendCurrencySymbol(amount, currencySymbol);
            }
        },

        /**
         * On Scheduled sort Click handler
         * @param {object} event
         * @param {object} data
         */
        onScheduledSortClickHandler: function(event, data) {
            var scopeObj = this;
            FormControllerUtility.showProgressBar(this.view);
            scopeObj.presenter.fetchScheduledBills(data);
        },


        /**
         * method to handle the cancel the schedule transaction actvity.
         * @param {object} dataItem dataItem
         */
        onScheduledCancelBtnClick: function(dataItem) {
            var scopeObj = this;
            var params = {
                transactionId: dataItem.transactionId,
                transactionType: dataItem.transactionType
            };
            var obj = {
                dialogueHeader: kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
                dialogueText: kony.i18n.getLocalizedString("I18n.billPay.QuitTransactionMsg"),
                dialogueAction: scopeObj.deleteScheduledTransaction.bind(scopeObj, params)
            }
            scopeObj.showPopUp(obj);
        },
        /**
         * Method to handle transaction cancel occurrence action
         * @param {object} data object
         */
        onCancelOccurrence: function(data) {
            var scopeObj = this;
            var obj = {
                dialogueHeader: kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
                dialogueText: kony.i18n.getLocalizedString("i18n.common.cancelOccurrenceMessage"),
                dialogueAction: scopeObj.cancelScheduledTransactionOccurrence.bind(scopeObj, {
                    transactionId: data.referenceNumber
                })
            }
            scopeObj.showPopUp(obj);
        },
        /**
         *  method to handle the delete the schedule transaction.
         *  @param {object} params params
         */
        cancelScheduledTransactionOccurrence: function(data) {
            var self = this;
            FormControllerUtility.showProgressBar(self.view);
            self.presenter.cancelScheduledTransactionOccurrence(data);
        },
        /**
         *  method to handle the delete the schedule transaction.
         *  @param {object} params params
         */
        deleteScheduledTransaction: function(params) {
            var scopeObj = this;
            scopeObj.presenter.deleteScheduledTransaction(params);
        },

        /**
         * executes and displays the error flex in landing page.
         * @param {boolean} isError used to display the flex
         * @param {object} erroObj  get the exact error mesage
         */
        /**
         * executes and displays the error flex in landing page.
         * @param {boolean} isError used to display the flex
         * @param {object} erroObj  get the exact error mesage
         */
        setServerError: function(erroObj) {
            var scopeObj = this;
            scopeObj.view.flxDowntimeWarning.setVisibility(true);
            if (erroObj.errorMessage) {
                scopeObj.view.rtxDowntimeWarning.text = erroObj.errorMessage;
            } else {
                scopeObj.view.rtxDowntimeWarning.text = kony.i18n.getLocalizedString("i18n.common.OoopsServerError");
            }
            FormControllerUtility.hideProgressBar(scopeObj.view);
            scopeObj.view.forceLayout();
        },
        /** 
         * used to set the popup.
         * @param {obj} obj
         */
        showPopUp: function(obj) {
            var scopeObj = this;
            CommonUtilities.setText(scopeObj.view.CustomPopupCancel.lblHeading, obj.dialogueHeader, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.CustomPopupCancel.lblPopupMessage, obj.dialogueText, CommonUtilities.getaccessibilityConfig());
            scopeObj.view.flxDialogs.setVisibility(true);
            scopeObj.view.flxCancelPopup.setVisibility(true);
            scopeObj.view.CustomPopupCancel.btnYes.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                obj.dialogueAction();
            };
            scopeObj.view.CustomPopupCancel.btnNo.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
            }
            scopeObj.view.CustomPopupCancel.flxCross.onClick = function() {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxCancelPopup.setVisibility(false);
            }
        },


        /**
         * used to convert the CalenderFormat Date
         * @param {String} dateString string formated date
         * @param {string} inputFormat input format
         * @returns {string} outputDate output date
         */
        getDateFromDateString: function(dateString, inputFormat) {
            var fu = applicationManager.getFormatUtilManager();
            var dateObj = fu.getDateObjectfromString(dateString, inputFormat);
            var outputDate = fu.getFormatedDateString(dateObj, fu.getApplicationDateFormat());
            return outputDate;
        },

        /**
         * used to set the actions
         */
        setTabActions: function() {
            this.view.btnAllPayees.onClick = this.loadAllPayees.bind(this);
            this.view.btnPayementDue.onClick = this.loadPayementDues.bind(this);
            this.view.btnScheduled.onClick = this.loadScheduleBills.bind(this);
            this.view.btnHistory.onClick = this.loadBillPayHistory.bind(this);
            this.view.btnManagePayee.onClick = this.loadManagePayees.bind(this);
            this.view.flxAddPayee.onClick = this.loadAddPayee.bind(this);
            this.view.flxMakeOneTimePayment.onClick = this.loadOneTimePayement.bind(this);
        },

        /**
         * used to load the Bulk Payees
         */
        loadAllPayees: function() {
            var scopeObj = this;
            scopeObj.presenter.showBillPaymentScreen({
                context: "BulkPayees",
                loadBills: true
            });
        },

        /**
         * used to load the Due Payements
         */
        loadPayementDues: function() {
            var scopeObj = this;
            scopeObj.presenter.showBillPaymentScreen({
                context: "DueBills",
                loadBills: true
            });
        },

        /**
         * used to load the scheduled bills
         */
        loadScheduleBills: function() {
            var scopeObj = this;
            scopeObj.presenter.showBillPaymentScreen({
                context: "ScheduleBills",
                loadBills: true
            });
        },

        /**
         * used to load the bill pay history
         */
        loadBillPayHistory: function() {
            var scopeObj = this;
            scopeObj.presenter.showBillPaymentScreen({
                context: "History",
                loadBills: true
            });
        },

        /**
         * used to load the manage payees
         */
        loadManagePayees: function() {
            var scopeObj = this;
            scopeObj.presenter.showBillPaymentScreen({
                context: "ManagePayees",
                loadBills: true
            });
        },

        /**
         * used to load the Payee Module
         */
        loadAddPayee: function() {
            var scopeObj = this;
            scopeObj.presenter.showBillPaymentScreen({
                context: "AddPayee"
            });
        },

        /**
         * used to load the Payee Module
         */
        loadOneTimePayement: function() {
            var scopeObj = this;
            scopeObj.presenter.showBillPaymentScreen({
                context: "MakeOneTimePayment",
                callbackModelConfig: {
                    scheduled: true
                }
            });
        },
        /**
         * method to view the ebill.
         * @param {object} viewModel ebill information
         */
        viewEBill: function(viewModel) {
            var scopeObj = this;
            if (viewModel) {
                var nonValue = kony.i18n.getLocalizedString("i18n.common.none");
                CommonUtilities.setText(scopeObj.view.lblPostDateValue, viewModel.billGeneratedDate || nonValue, CommonUtilities.getaccessibilityConfig());
                CommonUtilities.setText(scopeObj.view.lblAmountValue, viewModel.amount || nonValue, CommonUtilities.getaccessibilityConfig());
                scopeObj.view.flxMemo.setVisibility(false);
                scopeObj.view.imgEBill.src = viewModel.ebillURL;
                if (viewModel.ebillURL) {
                    scopeObj.view.flxDownload.onClick = scopeObj.downloadFile.bind(scopeObj, {
                        'url': viewModel.ebillURL
                    });
                    scopeObj.view.flxDownload.setVisibility(true);
                } else {
                    scopeObj.view.flxDownload.setVisibility(false);
                    scopeObj.view.flxDownload.onClick = null;
                }
                this.view.imgZoom.setVisibility(false);
                this.view.imgFlip.setVisibility(false);
                this.view.flxDialogs.setVisibility(true);
                this.view.flxViewEbillPopup.setVisibility(true);
                scopeObj.view.lblTransactions1.setFocus(true);
            }
            scopeObj.view.flxImgCancel.onClick = function() {
                scopeObj.view.flxViewEbillPopup.setVisibility(false);
                scopeObj.view.flxDialogs.setVisibility(false);
            };
        },
        /**
         * method to download the e-bill page.
         * @param {object} data information
         */
        downloadFile: function(data) {
            if (data) {
                CommonUtilities.downloadFile({
                    'url': data.url,
                    'filename': kony.i18n.getLocalizedString('i18n.billPay.Bill')
                })
            }
        },

        /**
         * Need to remove
         */
        onScheduledSegmentRowClick: function() {
            var scopeObj = this;
            var index = scopeObj.view.segmentBillpay.selectedRowIndex[1];
            var data = scopeObj.view.segmentBillpay.data;
            for (var i = 0; i < data.length; i++) {
                if (i === index) {
                    if (data[index].template == "flxBillPayScheduled" || data[index].template == "flxBillPayScheduledMobile") {
                        data[index].imgDropdown = ViewConstants.IMAGES.CHEVRON_UP;
                        data[index].template = (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) ? "flxBillPayScheduledSelectedMobile" : "flxBillPayScheduledSelected";
                    } else {
                        data[index].imgDropdown = ViewConstants.IMAGES.ARRAOW_DOWN;
                        data[index].template = (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) ? "flxBillPayScheduledMobile" : "flxBillPayScheduled";
                    }
                } else {
                    data[i].imgDropdown = ViewConstants.IMAGES.ARRAOW_DOWN;
                    data[i].template = (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) ? "flxBillPayScheduledMobile" : "flxBillPayScheduled";
                }
            }
            scopeObj.view.segmentBillpay.setData(data);
        },
        //UI Code
        /**
         * onBreakpointChange : Handles ui changes on .
         * @member of {frmConfirmtransferController}
         * @param {integer} width - current browser width
         * @return {}
         * @throws {}
         */
        onBreakpointChange: function(form, width) {
            var scopeObj = this;
            FormControllerUtility.setupFormOnTouchEnd(width);
            
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
            this.view.CustomPopupLogout.onBreakpointChangeComponent(scopeObj.view.CustomPopupLogout, width);
            this.view.CustomPopupCancel.onBreakpointChangeComponent(scopeObj.view.CustomPopupCancel, width);
        },

        /**
         * used to show the permission based UI
         */
        showAllCreatePayeeOptions: function() {
            this.view.btnAllPayees.setVisibility(true);
            this.view.btnPayementDue.setVisibility(true);
            this.view.btnScheduled.setVisibility(true);
            this.view.flxMakeOneTimePayment.setVisibility(true);
        },

        /**
         * used to hide the permission based UI
         */
        hideAllCreatePayeeOptions: function() {
            this.view.btnAllPayees.setVisibility(false);
            this.view.btnPayementDue.setVisibility(false);
            this.view.btnScheduled.setVisibility(false);
            this.view.flxMakeOneTimePayment.setVisibility(false);
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
        showManagePayeeOption: function() {
            this.view.btnManagePayee.setVisibility(true);
        },

        /**
         * used to hide the permission based UI
         */
        hideManagePayeeOption: function() {
            this.view.btnManagePayee.setVisibility(false);
        },


        /**
         * used to show the permission based UI
         */
        showHistoryOption: function() {
            this.view.btnHistory.setVisibility(true);
        },

        /**
         * used to hide the permission based UI
         */
        hideHistoryOption: function() {
            this.view.btnHistory.setVisibility(false);
        },

        /*
         * method to display the types of payees list
         */
        onFiltersBtnClick: function() {
            this.view.accountTypesBillPaySchedule.setVisibility(!this.view.accountTypesBillPaySchedule.isVisible);
            this.view.accountTypesBillPaySchedule.skin = "slfBoxffffffB1R5";
            this.view.accountTypesBillPaySchedule.flxAccountTypesSegment.skin = "slfBoxffffffB1R5";
            // this.view.accountTypesBillPaySchedule.segAccountTypes.rowSkin = "slfBoxffffffB1R5";
        },

        /*
         * Method to initialize search and filter actions
         */
        initializeSearchAndFilterActions: function(scheduledBills) {
            this.initializeFilterSegments();
            this.view.txtSearch.text = "";
            this.view.flxClearBtn.setVisibility(false);
            this.view.flxClearBtn.onClick = this.onSearchClearBtnClick.bind(this, scheduledBills);
            this.view.txtSearch.onKeyUp = this.onTxtSearchKeyUp.bind(this);
            this.view.txtSearch.onDone = this.onSearchBtnClick.bind(this, scheduledBills);
            this.view.btnConfirm.onClick = this.onSearchBtnClick.bind(this, scheduledBills);
            this.view.flxFiltersList.onClick = this.onFiltersBtnClick.bind(this);
            this.view.accountTypesBillPaySchedule.segAccountTypes.onRowClick = this.onFilterSelection.bind(this, scheduledBills);
            //this.view.accountTypesBillPaySchedule.segAccountTypes.onRowClick = function(eventobject, sectionIndex, rowIndex){     
            //this.onFilterSelection(eventobject, sectionIndex, rowIndex, scheduledBills);
            //}.bind(this);
        },

        /*
         * Method to add data to filter segment
         */
        initializeFilterSegments: function() {
            // this.view.a = this.view.LisiBox1.masterData[0]; 

            //this.view.accountTypesBillPaySchedule.setVisibility(true);
            var data = [
            {
                    "flxAccountTypes":{
                        "height":"40dp"
                    },
                    "lblSeparator":{
                        "text":"lblSeparator",
                        "isVisible":true
                    },
                    "lblUsers": {
                        "text":"All Payees",
                        "left":"10dp"
                    }
                },
                {
                    "flxAccountTypes":{
                        "height":"40dp"
                    },
                    "lblSeparator":{
                        "text":"lblSeparator",
                        "isVisible":true
                    },
                    "lblUsers": {
                        "text":"Personal Payees",
                        "left":"10dp"
                    }
                },
                {
                    "flxAccountTypes":{
                        "height":"40dp"
                    },
                    "lblSeparator":{
                        "text":"lblSeparator",
                        "isVisible":true
                    },
                    "lblUsers": {
                        "text":"Business Payees",
                        "left":"10dp"
                    }
                }
            ];
            this.view.accountTypesBillPaySchedule.segAccountTypes.widgetDataMap = {
                "lblUsers": "lblUsers",
                "flxAccountTypes":"flxAccountTypes",
                "lblSeparator":"lblSeparator"
            };
            this.view.accountTypesBillPaySchedule.height="120dp";
            this.view.accountTypesBillPaySchedule.segAccountTypes.setData(data);
            this.view.lblType.text = this.view.accountTypesBillPaySchedule.segAccountTypes.data[0].lblUsers.text;

        },

        /*
         * Method to process segment ui based on selected filter
         */
        onFilterSelection: function(scheduledBills) {
            var scopeObj = this;
            //var segData = this.view.accountTypesBillPaySchedule.segAccountTypes.data;
            //accounts = context.recipients;    
            this.view.accountTypesBillPaySchedule.setVisibility(false);
            var data = scopeObj.getSearchAndFilterData(scheduledBills);
            // context.recipients = data;
            this.bindScheduleBills(data);
            scopeObj.view.forceLayout();
        },

        /**
         * method used to enable or disable the clear button.
         */
        onTxtSearchKeyUp: function() {
            var scopeObj = this;
            var searchKeyword = scopeObj.view.txtSearch.text.trim();
            if (searchKeyword.length > 0) {
                scopeObj.view.flxClearBtn.setVisibility(true);
            } else {
                scopeObj.view.flxClearBtn.setVisibility(false);
            }
            this.view.flxtxtSearchandClearbtn.forceLayout();
        },

        /**
         * method used to clear search
         */
        onSearchClearBtnClick: function(scheduledBills) {
            var scopeObj = this;

            scopeObj.view.txtSearch.text = "";
            scopeObj.view.flxClearBtn.setVisibility(false);
            //var data = scopeObj.getSearchAndFilterData(scheduledBills);
            this.bindScheduleBills(scheduledBills);
            // context.recipients = data;
            //this.bindScheduleBills(data);     
        },

        /**
         * method to handle the search account functionality
         */
        onSearchBtnClick: function(scheduledBills) {
            var scopeObj = this;
            // accounts = context.recipients;    
            var data = scopeObj.getSearchAndFilterData(scheduledBills);
            // context.recipients = data;
            this.bindScheduleBills(data);
            scopeObj.view.forceLayout();
        },

        /**
         * method to get data from search and filter values
         */
        getSearchAndFilterData: function(scheduledBills) {
            var scopeObj = this;
            this.view.lblType.text = (this.view.accountTypesBillPaySchedule.segAccountTypes.selectedRowItems !== null && this.view.accountTypesBillPaySchedule.segAccountTypes.selectedRowItems.length !== 0) ? this.view.accountTypesBillPaySchedule.segAccountTypes.selectedRowItems[0].lblUsers.text : this.view.accountTypesBillPaySchedule.segAccountTypes.data[0].lblUsers.text;

            var filterQuery = this.view.lblType.text;
            var searchQuery = scopeObj.view.txtSearch.text.trim();

            if (filterQuery.includes("All Payees")) {
                var accountlist = [];
                accountlist = scheduledBills;
                //all accounts will be shown      
            } else if (filterQuery.includes("Personal Payees")) {
                //        accounts = accounts.filter(accounts.type==="Individual");
                var accountlist = [];
                for (i = 0; i < scheduledBills.length; i++) {
                    if (scheduledBills[i].isBusinessPayee === "0") {
                        accountlist.push(scheduledBills[i]);
                        //accountlist = JSON.stringify(accounts[i]);
                    }
                }
                scheduledBills = accountlist;
            } else if (filterQuery.includes("Business Payees")) {
                //accounts = accounts.filter(this.isBusinessAccount);
                var accountlist = [];
                for (i = 0; i < scheduledBills.length; i++) {
                    if (scheduledBills[i].isBusinessPayee === "1") {
                        accountlist.push(scheduledBills[i]);
                        //accountlist = JSON.stringify(accounts[i]);
                    }
                }
                scheduledBills = accountlist;
            }
            if (searchQuery !== "") {
                // var data = scopeObj.getDataWithSections(accounts);
                var data = scheduledBills;
                var searchresults = [];
                if (!kony.sdk.isNullOrUndefined(searchQuery) && searchQuery !== "") {

                    var j = 0;
                    for (var i = 0; i < data.length; i++) {
                        var rowdata = null;
                        if ((data[i].amount && data[i].amount.toUpperCase().indexOf(searchQuery.toUpperCase()) !== -1) ||
                            (data[i].payeeName && data[i].payeeName.toUpperCase().indexOf(searchQuery.toUpperCase()) !== -1) ||
                            (data[i].billDueAmount && data[i].billDueAmount.toUpperCase().indexOf(searchQuery.toUpperCase()) !== -1)) {
                            rowdata = data[i];
                        }
                        if (kony.sdk.isNullOrUndefined(rowdata)) {
                            //data[i][1][0].flxAccountsRowWrapper["isVisible"] = false;
                            //data[i][1][0].flxNoResultsFound["isVisible"] = true;
                            data[i].isNoRecords = true;
                            data[i].lblNoResultsFound = {
                                "text": kony.i18n.getLocalizedString("i18n.FastTransfers.NoResultsFound")
                            };
                            var noRecordsData = data[i];
                            //data[i] = [];
                            if (data[i].isNoRecords === false) {
                                searchresults[j].push(noRecordsData);
                                j++;
                            }
                        } else {
                            //data[i] = [];
                            searchresults[j] = rowdata;
                            j++;
                        }
                    }
                }
                return searchresults;
            } else {
                return scheduledBills;
            }
        },
        /**
         * Method to handle the segment row view on click of dropdown
         */
        handleSegmentRowView: function () {
            var scopeObj = this;
            const rowIndex = scopeObj.view.segmentBillpay.selectedRowIndex[1];
            const data = scopeObj.view.segmentBillpay.data;
            var pre_val;
            var requiredView = [];
            const collapsedView = ["O", false, "sknFlxIdentifier", "sknffffff15pxolbfonticons", { "Mobile": "80dp", "Default": "50dp" }, "sknflxffffffnoborder"];
            const expandedView = ["P", true, "sknflxBg4a90e2op100NoBorder", "sknSSP4176a415px", { "Mobile": "360dp", "Default": "220dp" }, "slFboxBGf8f7f8B0"];
            if (previous_index_schedule === rowIndex) {
                requiredView = data[rowIndex].lblDropdown === "P" ? collapsedView : expandedView;
                this.toggleSegmentRowView(rowIndex, requiredView);
            } else {
                if (previous_index_schedule >= 0) {
                    pre_val = previous_index_schedule;
                    this.toggleSegmentRowView(pre_val, collapsedView);
                }
                pre_val = rowIndex;
                this.toggleSegmentRowView(rowIndex, expandedView);
            }
            previous_index_schedule = rowIndex;
        },
        /**
         * Method to toggle the segment row view
         * @param {Number} index - index of segment row to toggle
         * @param {Array} viewData - data which need to be assigned to toggled view
         */
        toggleSegmentRowView: function (index, viewData) {
            var scopeObj = this;
            var data = scopeObj.view.segmentBillpay.data;
            data[index].lblDropdown = viewData[0];
            data[index].flxIdentifier.isVisible = viewData[1];
            data[index].flxIdentifier.skin = viewData[2];
            data[index].lblIdentifier.skin = viewData[3];
            data[index].flxBillPaymentScheduledSelected.height = viewData[4]['Default'];
            data[index].flxBillPaymentScheduledSelected.skin = viewData[5];
            data[index].flxBillPaymentScheduledSelectedMobile.height = viewData[4]['Mobile'];
            data[index].flxBillPaymentScheduledSelectedMobile.skin = viewData[5];
            data[index].flxEdit.isVisible = viewData[1];
            scopeObj.view.segmentBillpay.setDataAt(data[index], index);
        }

    }
});