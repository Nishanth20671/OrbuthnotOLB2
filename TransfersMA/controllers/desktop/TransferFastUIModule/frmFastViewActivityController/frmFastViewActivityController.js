define(['CommonUtilities', 'OLBConstants', 'ViewConstants', 'FormControllerUtility'], function (CommonUtilities, OLBConstants, ViewConstants, FormControllerUtility) {
     
    return {
        profileAccess: "",
        init: function () {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function () { };
            this.view.onBreakpointChange = this.onBreakpointChange;
            this.view.lblAddBankAccount.toolTip = kony.i18n.getLocalizedString("i18n.FastTransfers.AddDBXAccount");
            this.view.lblAddKonyAccount.toolTip = kony.i18n.getLocalizedString("i18n.FastTransfers.AddExternalAccount");
            this.view.lblAddInternationalAccount.toolTip = kony.i18n.getLocalizedString("i18n.FastTransfers.AddInternationalAccount");
            this.view.lblAddRecipient.toolTip = kony.i18n.getLocalizedString("i18n.FastTransfers.AddPersonToPersonRecipient");
            this.view.lblBackToManageRecipients.toolTip = kony.i18n.getLocalizedString("i18n.FastTransfers.BackToManageRecipient");
            var scopeObj = this;
            scopeObj.transfersFastPresentationController = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("TransferFastUIModule").presentationController;
            this.view.flxAddBankAccount.setVisibility(applicationManager.getConfigurationManager().checkUserPermission("INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT"));
            this.view.flxAddBankAccount.onClick = function () {
                scopeObj.transfersFastPresentationController.showTransferScreen({
                    initialView: "addDBXAccount"
                });
            }
            this.view.flxAddKonyAccount.setVisibility(applicationManager.getConfigurationManager().checkUserPermission("INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT"));
            this.view.flxAddKonyAccount.onClick = function () {
                scopeObj.transfersFastPresentationController.showTransferScreen({
                    initialView: "addExternalAccount"
                });
            }
            this.view.flxAddInternationalAccount.setVisibility(applicationManager.getConfigurationManager().checkUserPermission("INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT"));
            this.view.flxAddInternationalAccount.onClick = function () {
                scopeObj.transfersFastPresentationController.showTransferScreen({
                    initialView: "addInternationalAccount"
                });
            }
            this.view.flxAddReciepient.setVisibility(applicationManager.getConfigurationManager().checkUserPermission("P2P_CREATE_RECEPIENT"));
            this.view.flxAddReciepient.onClick = function () {
                scopeObj.transfersFastPresentationController.showTransferScreen({
                    initialView: "addRecipient"
                });
            }
            this.fastTransferPC = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("TransferFastUIModule").presentationController;
            this.viewTransactionsSortMap = [{
                name: "fromAccountName",
                imageFlx: this.view.flximgdatemod,
                clickContainer: this.view.flxdatemod
            }, {
                name: "transactionDate",
                imageFlx: this.view.flxfromaccountimgmod,
                clickContainer: this.view.flxfromaccountmod
            }];
        },
        onBreakpointChange: function (form, width) {
            var scope = this
            FormControllerUtility.setupFormOnTouchEnd(width);
           
            this.view.customheadernew.onBreakpointChangeComponent();
            this.view.customfooternew.onBreakpointChangeComponent();
            this.view.CustomPopup.onBreakpointChangeComponent(scope.view.CustomPopup, width);
            this.view.CustomPopupLogout.onBreakpointChangeComponent(scope.view.CustomPopupLogout, width);
        },
        preShow: function () {
            this.profileAccess = applicationManager.getUserPreferencesManager().profileAccess;
            this.view.customheadernew.activateMenu("FASTTRANSFERS", "Transfer Money");
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['customheader', 'flxMainContainer', 'flxHeader', 'flxFooter']);
        },
        postShow: function () {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
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
            }
            if (viewModel.viewTransactionsData) {
                this.setAccountActivity(viewModel.viewTransactionsData);
            }
            if (viewModel.noMoreRecords) {
                this.showNoMoreRecords();
            }
            if (viewModel.headerData) {
                this.updateHeader(viewModel.headerData)
            }
        },
        /**
         * postShow Actions
         */
        postShowActions: function () {
            applicationManager.getNavigationManager().applyUpdates(this);
        },
        /**
         * showNoMoreRecords - Handles zero records scenario in navigation.
         */
        showNoMoreRecords: function () {
            this.view.tablePagination.imgPaginationNext.src = ViewConstants.IMAGES.PAGINATION_NEXT_INACTIVE;
            this.view.tablePagination.flxPaginationNext.onClick = function () { };
            kony.ui.Alert(kony.i18n.getLocalizedString("i18n.navigation.norecordsfound"));
            FormControllerUtility.hideProgressBar(this.view);
        },
        updateHeader: function (data) {
            CommonUtilities.setText(this.view.lblAccountName, data.accountName, CommonUtilities.getaccessibilityConfig());
            //CommonUtilities.setText(this.view.lblAccountHolder, viewModel[len - 1].accountNumber , CommonUtilities.getaccessibilityConfig());
            this.view.flxBackToManageRecipients.onTouchStart = data.onCallbackManagerPayee;
            this.view.flxFormContent.forceLayout();
        },
        setAccountActivity: function (viewModel) {
            var orientationHandler = new OrientationHandler();
            var configurationManager = applicationManager.getConfigurationManager();
            var widgetDataMap = {
                "flxAmount": "flxAmount",
                "flxDate": "flxDate",
                "flxFrom": "flxFrom",
                "flxRunningBalance": "flxRunningBalance",
                "flxSort": "flxSort",
                "flxStatus": "flxStatus",
                "lblAmount": "lblAmount",
                "lblDate": "lblDate",
                "imgIcon": "imgIcon",
                "flxIcon": "flxIcon",
                "lblFrom": "lblFrom",
                "lblpaiddate": "lblpaiddate",
                "lblRunningBalance": "lblRunningBalance",
                "lblStatus": "lblStatus",
                "lblAmount1": "lblAmount1",
                "lblAmountHeader": "lblAmountHeader",
                "lblSeparator": "lblSeparator"
            };
            var data = [];
            if (viewModel.noTransaction) {
                this.view.flxSegment.isVisible = false;
                this.view.flxNoRecords.isVisible = true;
                this.view.rtxNoRecords.text = kony.i18n.getLocalizedString("i18n.PFM.YouHaveNotDoneAnyTransactions");
                CommonUtilities.setText(this.view.lblAmountDeducted, kony.i18n.getLocalizedString("i18n.common.NA"), CommonUtilities.getaccessibilityConfig());
            } else {
                this.setViewTransactionsPagination(viewModel.data, viewModel.config);
                this.sortFlex();
                FormControllerUtility.updateSortFlex(this.viewTransactionsSortMap, viewModel.config);
                for (const record of viewModel.data) {
                    data.push({
                        "lblAmount": {
                            "text": CommonUtilities.formatCurrencyWithCommas(Math.abs(record.amount)),
                            "accessibilityconfig": {
                                "a11yLabel": CommonUtilities.formatCurrencyWithCommas(Math.abs(record.amount)),
                            }
                        },
                        "lblDate": {
                            "text": record.transactionDate.slice(),
                            "accessibilityconfig": {
                                "a11yLabel": record.transactionDate.slice(),
                            }
                        },
                        "lblFrom": {
                            "text": (record.fromAccountName || record.fromNickName) + "..." + record.fromAccountNumber.slice(-4),
                            "left": configurationManager.isCombinedUser === "true" && !(kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? "25dp" : "6dp",
                            "accessibilityconfig": {
                                "a11yLabel": (record.fromAccountName || record.fromNickName) + "..." + record.fromAccountNumber.slice(-4),
                            }
                        },
                        "lblStatus": {
                            "text": record.statusDescription,
                            "accessibilityconfig": {
                                "a11yLabel": record.statusDescription,
                            }
                        },
                        "lblpaiddate": {
                            "text": CommonUtilities.getFrontendDateString(record.transactionDate),
                            "accessibilityconfig": {
                                "a11yLabel": CommonUtilities.getFrontendDateString(record.transactionDate),
                            }
                        },
                        "lblAmount1": {
                            "text": CommonUtilities.formatCurrencyWithCommas(Math.abs(record.amount)),
                            "accessibilityconfig": {
                                "a11yLabel": CommonUtilities.formatCurrencyWithCommas(Math.abs(record.amount)),
                            }
                        },
                        "lblAmountHeader": {
                            "text": "Running Balance",
                            "accessibilityconfig": {
                                "a11yLabel": "Running Balance",
                            }
                        },
                        "lblSeparator": {
                            "text": "lblSeparator",
                            "accessibilityconfig": {
                                "a11yLabel": "lblSeparator",
                            }
                        },
                        "lblFromHeader": {
                            "text": "From:",
                            "accessibilityconfig": {
                                "a11yLabel": "From",
                            }
                        },
                        "imgIcon": {
                            //"isVisible": configurationManager.isCombinedUser==="true" ? true :false,
                            "isVisible": this.profileAccess === "both" ? true : false,
                            "text": this.displayIcon(record.fromAccountNumber),
                        },
                        "flxIcon": {
                            //"isVisible": configurationManager.isCombinedUser==="true"? true : false
                            "isVisible": this.profileAccess === "both" ? true : false
                        },
                        "template": (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) ? "flxFastTransferActivityMobile" : "flxFastTransferActivity",
                    });
                }
                var amountDeducted = (viewModel.data[0].totalAmount !== null) ? viewModel.data[0].totalAmount : viewModel.data[0].amountTransferedTillNow;
                CommonUtilities.setText(this.view.lblAmountDeducted, CommonUtilities.formatCurrencyWithCommas(amountDeducted), CommonUtilities.getaccessibilityConfig());
                this.view.segTransferActivity.widgetDataMap = widgetDataMap;
                this.view.segTransferActivity.setData(data);
                this.view.flxSegment.isVisible = true;
                this.view.flxNoRecords.isVisible = false;
            }
            this.view.forceLayout();
        },
        displayIcon: function (accountNumber) {
            const accounts = applicationManager.getAccountManager().getInternalAccounts() || [];
            for (const account of accounts) {
                if (account.accountID === accountNumber) return account.isBusinessAccount === "true" ? "r" : "s";
            }
            return "s";
        },
        /**Configure Sort Flex
         * @param  {string} tab Type of tab and shows sort flex
         */
        sortFlex: function (config) {
            FormControllerUtility.setSortingHandlers(this.viewTransactionsSortMap, this.onViewTransactionsSortClickHandler, this);
            CommonUtilities.Sorting.updateSortFlex(this.viewTransactionsSortMap, config);
        },
        /** On Past Transactions Sort click handler.
         * @param  {object} event object
         * @param  {object} data New Sorting Data
         */
        onViewTransactionsSortClickHandler: function (event, data) {
            if (this.fastTransferPC.isP2PActivityView()) {
                this.fastTransferPC.showSelectedP2PTransactions(null, data);
            } else {
                this.fastTransferPC.showSelectedAccountTransactions(null, data);
            }
        },
        /**
         * Configure Paginations for View Transfers
         * @param {object} config configuration to show pagination
         */
        setViewTransactionsPagination: function (transactions, config) {
            this.setPaginationPreviousView(config);
            this.setPaginationNextView();
            this.view.tablePagination.lblPagination.text = (config.offset + 1) + "-" + (config.offset + transactions.length) + " " + kony.i18n.getLocalizedString("i18n.common.transactions");
            if (transactions.length < ViewConstants.MAGIC_NUMBERS.LIMIT) {
                this.view.tablePagination.flxPaginationNext.onClick = function () { };
                this.view.tablePagination.imgPaginationNext.src = ViewConstants.IMAGES.PAGINATION_NEXT_INACTIVE;
            }
        },
        /**Configure pagination for previous button for Past transfers
         * @param {object} config pagination values
         */
        setPaginationPreviousView: function (config) {
            var scopeObj = this;
            if (config.offset <= 0) {
                this.view.tablePagination.flxPaginationPrevious.onClick = function () { };
                this.view.tablePagination.imgPaginationPrevious.src = ViewConstants.IMAGES.PAGINATION_BACK_INACTIVE;
            } else {
                this.view.tablePagination.flxPaginationPrevious.onClick = function () {
                    scopeObj.getPreviousViewTransactions(config);
                };
                this.view.tablePagination.imgPaginationPrevious.src = ViewConstants.IMAGES.PAGINATION_BACK_ACTIVE;
            }
        },
        /**
         * Configure Pagination for Next Button Of Past Transfers
         */
        setPaginationNextView: function () {
            var scopeObj = this;
            this.view.tablePagination.flxPaginationNext.onClick = function () {
                scopeObj.getNextViewTransactions();
            };
            this.view.tablePagination.imgPaginationNext.src = ViewConstants.IMAGES.PAGINATION_NEXT_ACTIVE;
        },
        /**Called when Pagination is triggered for next Past Tranctions
         */
        getNextViewTransactions: function () {
            this.view.tablePagination.imgPaginationPrevious.src = ViewConstants.IMAGES.PAGINATION_BACK_ACTIVE;
            this.fastTransferPC.fetchNextViewTransactions();
        },
        /**Called when previos button is triggered from pagination
         * @returns {object} config configuration values for pagination
         */
        getPreviousViewTransactions: function (config) {
            if (config.offset >= ViewConstants.MAGIC_NUMBERS.LIMIT) {
                this.fastTransferPC.fetchPreviousViewTransactions();
            } else {
                this.view.tablePagination.imgPaginationPrevious.src = ViewConstants.IMAGES.PAGINATION_BACK_INACTIVE;
            }
        },
        AdjustScreen: function () {
            var mainheight = 0;
            var screenheight = kony.os.deviceInfo().screenHeight;
            mainheight = this.view.customheader.info.frame.height + this.view.flxMainContainer.info.frame.height;
            var diff = screenheight - mainheight;
            if (mainheight < screenheight) {
                diff = diff - this.view.flxFooter.info.frame.height;
                if (diff > 0) {
                    this.view.flxFooter.top = mainheight + diff + ViewConstants.POSITIONAL_VALUES.DP;
                } else {
                    this.view.flxFooter.top = mainheight + ViewConstants.POSITIONAL_VALUES.DP;
                }
            } else {
                this.view.flxFooter.top = mainheight + ViewConstants.POSITIONAL_VALUES.DP;
            }
            this.view.forceLayout();
        },
        setRecipientActivity: function () { }
    };
});