define(['FormControllerUtility', 'ViewConstants', 'CommonUtilities', 'OLBConstants', 'CampaignUtility'], function(FormControllerUtility, viewConstants, CommonUtilities2, OLBConstants, CampaignUtility) {
    return {
        updateFormUI: function(viewModel) {
            if (viewModel.showProgressBar) {
                FormControllerUtility.showProgressBar(this.view);
            } else if (viewModel.hideProgressBar) {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (viewModel.onServerDownError) {
                this.showServerDownMessage(true);
            } else {
                this.showServerDownMessage(false);
            }
            if (viewModel.getMonths) {
                FormControllerUtility.hideProgressBar(this.view);
                this.addMonthsToDonutDropDown(viewModel.getMonths);
            }
            if (viewModel.getYears) {
                this.addYearsToBarChartDropDown(viewModel.getYears);
            }
            if (viewModel.showMonthlyDonutChart) {
                this.addDonut(viewModel.showBothDonutCharts, viewModel.monthlySpending, viewModel.totalCashSpent);
            }
            if (viewModel.hideflex) {
                this.naviagetToPFMLandingForm();
            }
            if (viewModel.showPFMAccounts) {
                this.setPFMAccounts(viewModel.pfmAccounts);
            }
            if (viewModel.showYearlyBarChart) {
                FormControllerUtility.hideProgressBar(this.view);
                this.addBarChart(viewModel.yearlySpending);
            }
            if (viewModel.showYearlyBudgetChart) {
                FormControllerUtility.hideProgressBar(this.view);
                this.addStackedBarChart(viewModel.yearlyBudgetData);
            }
            if (viewModel.showMonthlyCategorizedTransactions) {
                FormControllerUtility.hideProgressBar(this.view);
                this.setMonthlyCategorizedTransactions(viewModel.monthlyCategorizedTransactions);
            }
            if (viewModel.unCategorizedIdTransactionList) {
                this.setDataForUnCategorizedTransactions(viewModel.unCategorizedIdTransactionList.data, viewModel.unCategorizedIdTransactionList.config);
            }
            if (viewModel.bulkUpdateTransactionList) {
                this.setBulkUpdateTransactionData(viewModel.bulkUpdateTransactionList);
            }
            if (viewModel.categoryList) {
                this.setCategoryList(viewModel.categoryList);
            }
            if (viewModel.campaign) {
                CampaignUtility.showCampaign(viewModel.campaign, this.view, "flxContainer");
            }
        },
        /**
         * showServerDownMessage - function to handle serverdown message
         * @member of {frmPayAPersonController}
         * @param {boolean} toShow- true : display message, false: hide message
         * @returns {}
         * @throws {}
         */
        showServerDownMessage: function(toShow) {
            if (toShow) {
                FormControllerUtility.hideProgressBar(this.view);
                this.view.flxDowntimeWarning.setVisibility(true);
                this.view.rtxDowntimeWarning.setFocus(true);
                this.view.rtxDowntimeWarning.text = kony.i18n.getLocalizedString("i18n.common.OoopsServerError");
                this.view.imgDowntimeWarning.src = OLBConstants.IMAGES.SERVER_DOWN_IMAGE;
                this.view.forceLayout();
            } else if (this.view.flxDowntimeWarning.isVisible === true) {
                this.view.flxDowntimeWarning.setVisibility(false);
            }
        },
        /**
         * setP2PBreadcrumbData - sets the breadcrumb value across the pay a person .
         * @member of {frmPayAPersonController}
         * @param {array} an array of JSONs of breadcrums with text and callback as fields. (can send an array of length 3 at max).
         * @returns {}
         * @throws {}
         */
        setPFMBreadcrumbData: function(breadCrumbArray) {
            var self = this;
            self.view.breadcrumb.setBreadcrumbData(breadCrumbArray);
        },
        /**
         * naviagetToPFMLandingForm - used to navigate the pfmLanding Form.
         * @member of {frmPayAPersonController}
         * @param {array} an array of JSONs of breadcrums with text and callback as fields. (can send an array of length 3 at max).
         * @returns {}
         * @throws {}
         */
        naviagetToPFMLandingForm: function() {
            var self = this;
            self.setPFMBreadcrumbData([{
                text: kony.i18n.getLocalizedString("i18n.topmenu.accounts"),
                skin: viewConstants.SKINS.BREADCRUM,
                toolTip: kony.i18n.getLocalizedString("i18n.topmenu.accounts"),
                callback: function() {
                    FormControllerUtility.showProgressBar(self.view);
                    var presenter = self.getPFMPresentationController();
                    presenter.naviageteToAccountLandingPage();
                }
            }, {
                text: kony.i18n.getLocalizedString("i18n.accounts.PersonalFinanceManagement"),
                skin: viewConstants.SKINS.BREADCRUM2,
                toolTip: kony.i18n.getLocalizedString("i18n.accounts.PersonalFinanceManagement")
            }]);
            self.view.flxPFMContainers.setVisibility(true);
            self.view.flexCategorizedMonthlySpending.setVisibility(false);
            this.view.flxUncategorizedTransactions.setVisibility(false);
            self.view.forceLayout();
            self.AdjustScreen(40);
        },
        /**
         * setMonthlyCategorizedTransactions : used to set the monthly transactions.
         * @member of {frmPersonalFinanceManagementController}
         * @param {transactions} /get All transactions data
         * @returns {}
         * @throws {}
         */
        setMonthlyCategorizedTransactions: function(transactions) {
            var self = this;
            var isMirrorLayoutEnabled = CommonUtilities2.isMirrorLayoutEnabled();
            this.view.flexCategorizedMonthlySpending.setVisibility(true);
            this.view.flxPFMContainers.setVisibility(false);
            if (transactions) {
                var dataMap = {
                    "lblIdentifier": "lblIdentifier",
                    "lblSeparator": "lblSeparator",
                    "lblTotal": "lblTotal",
                    "lblTotalValue": "lblTotalValue",
                    "lblTransactionHeader": "lblTransactionHeader",
                    "imgCategoryDropdown": "imgCategoryDropdown",
                    "imgDropdown": "imgDropdown",
                    "lblAmount": "lblAmount",
                    "lblCategory": "lblCategory",
                    "lblDate": "lblDate",
                    "lblDescription": "lblDescription",
                    "lblSeparator2": "lblSeparator2",
                    "lblFrom": "lblFrom",
                    "lblFromValue": "lblFromValue",
                    "lblNoteTitle": "lblNoteTitle",
                    "lblNoteValue": "lblNoteValue",
                    "lblToValuetitle": "lblToValuetitle",
                    "lblToValue": "lblToValue",
                    "flxActions": "flxActions",
                    "flxIdentifier": "flxIdentifier",
                    "flxDescription": "flxDescription",
                    "flxCategory": "flxCategory",
                    "flxToTitle": "flxToTitle",
                    "flxToValueTitle": "flxToValueTitle",
                    "flxFrom": "flxFrom",
                    "flxDetailData": "flxDetailData",
                    "flxDetailHeaderTwo": "flxDetailHeaderTwo",
                    "flxDetailDataTwo": "flxDetailDataTwo",
                    "template": "template"
                }
                var categoryTransactionsData = [];
                var categoryTransactions = transactions.map(function(dataItem) {
                    var categoryMainTransactions = [];
                    var category = {
                        "lblIdentifier": {
                            "skin": self.getCategorySkin(dataItem.header.categoryName).skin,
                            "left": isMirrorLayoutEnabled ? "1.5%" : "3%"
                        },
                        "lblSeparator": "Label",
                        "lblTotal": kony.i18n.getLocalizedString("i18n.CheckImages.Total"),
                        "lblTotalValue": dataItem.header.totalAmount,
                        "lblTransactionHeader": dataItem.header.categoryName
                    };
                    categoryMainTransactions.push(category);
                    var categoryTransactionsArray = dataItem.transactionobj.map(function(trans) {
                        return {
                            "imgCategoryDropdown": viewConstants.IMAGES.ARROW_DOWN,
                            "flxActions": "flxActions",
                            "imgDropdown": viewConstants.IMAGES.ARROW_DOWN,
                            "lblAmount": trans.displayAmount,
                            "lblCategory": trans.categoryName,
                            "lblDate": trans.transactionDate,
                            "flxDescription": {
                              "right": isMirrorLayoutEnabled ? "11%" : "30%",
                              "left": isMirrorLayoutEnabled ? "40%" : "33%"
                            },
                            "flxCategory": {
                              "right": isMirrorLayoutEnabled ? "40%" : "5%",
                              "left": "0%"
                            },
                            "lblDescription": trans.transactionDescription,
                            "lblSeparator": "a",
                            "lblSeparator2": " a",
                            "lblFrom": kony.i18n.getLocalizedString("i18n.transfers.lblFrom"),
                            "lblFromValue": CommonUtilities2.getAccountDisplayName({
                                name: trans.fromAccountName,
                                accountID: trans.fromAccountNumber,
                                nickName: trans.fromNickName,
                                Account_id: trans.fromAccountNumber
                            }),
                            "flxToTitle": {
                              "left": isMirrorLayoutEnabled ? "20%" : "15%"
                            },
                            "flxToValueTitle": {
                              "left": isMirrorLayoutEnabled ? "20%" : "15%"
                            },
                            "flxFrom": {
                              "left": isMirrorLayoutEnabled ? "3%" : "6%"
                            },
                            "flxDetailData": {
                              "left": isMirrorLayoutEnabled ? "3%" : "5.7%"
                            },
                            "flxDetailHeaderTwo": {
                              "left": isMirrorLayoutEnabled ? "3%" : "5%"
                            },
                            "flxDetailDataTwo": {
                              "left": isMirrorLayoutEnabled ? "3%" : "5%"
                            },
                            "lblNoteTitle": kony.i18n.getLocalizedString("i18n.transfers.Description"),
                            "lblNoteValue": trans.transactionNotes,
                            "lblToValuetitle": kony.i18n.getLocalizedString("i18n.StopCheckPayments.To"),
                            "lblToValue": trans.toAccountName ? trans.toAccountName : "",
                            "flxIdentifier": "flxIdentifier",
                            "lblIdentifier": "lblIdentifier",
                            "template": "flxSegTransactionsContainerUnselected"
                        }
                    });
                    if (kony.application.getCurrentBreakpoint() === 640) {
                        for (var i = 0; i < categoryTransactionsArray.length; i++) {
                            categoryTransactionsArray[i].template = "flxSegTransactionsContainerUnselectedMobile";
                        }
                    }
                    categoryMainTransactions.push(categoryTransactionsArray);
                    categoryTransactionsData.push(categoryMainTransactions);
                });
				
                this.view.CategorizedMonthlySpending.segTransactions.setVisibility(true);
                this.view.CategorizedMonthlySpending.flxNoTransactions.setVisibility(false);
                this.view.CategorizedMonthlySpending.segTransactions.widgetDataMap = dataMap;
                this.view.CategorizedMonthlySpending.segTransactions.setData(categoryTransactionsData);
                if (isMirrorLayoutEnabled) {
                  this.view.CategorizedMonthlySpending.flxSortDate.left = "7%";
                }
                self.AdjustScreen(30);
            } else {
              this.view.CategorizedMonthlySpending.segTransactions.setVisibility(false);
              this.view.CategorizedMonthlySpending.flxNoTransactions.setVisibility(true);
              this.view.CategorizedMonthlySpending.rtxNoPaymentMessage.text=kony.i18n.getLocalizedString("i18n.accounts.noTransactionFound");

              self.AdjustScreen();
            }
            this.adjustFlxFooter();
            this.view.forceLayout();
        },
        /**
         * setPFMAccounts : used to update the accounts segment.
         * @member of {frmPersonalFinanceManagementController}
         * @param {accounts} /get All accounts data
         * @returns {}
         * @throws {}
         */
        setPFMAccounts: function(accounts) {
            var self = this;          
            if (accounts) {
                if (accounts.length > 0) {
                    var dataMap = {
                        "lblIdentifier": "lblIdentifier",
                        "lblAccountName": "lblAccountName",
                        "lblAccountNumber": "lblAccountNumber",
                        "lblAvailableBalanceTitle": "lblAvailableBalanceTitle",
                        "lblAvailableBalanceValue": "lblAvailableBalanceValue",
                        "lblCreditKey": "lblCreditKey",
                        "lblCreditValue": "lblCreditValue",
                        "lblDebitKey": "lblDebitKey",
                        "lblDebitValue": "lblDebitValue",
                        "lblSeparator": "lblSeparator",
                        "lblSepeartor2": "lblSepeartor2",
                        "lblSeperator3": "lblSeperator3",
                        "flxCredit": "flxCredit",
                        "flxDebit": "flxDebit"
                    };
                    accounts = accounts.map(function(dataItem) {
                        var currencySymbol = applicationManager.getFormatUtilManager().getCurrencySymbol(dataItem.currencyCode);
                        var balanceKey = self.getAccountSkinAndTitle(dataItem).balanceKey;
                        var left = "-0.03%";
                        var right = "0dp";
                        var breakpoint = kony.application.getCurrentBreakpoint();
                        if (breakpoint === 640) {
                            left = right = "40dp";
                        }
                        return {
                            "lblIdentifier": {
                                "skin": self.getAccountSkinAndTitle(dataItem).skin,
                                "text": ""
                            },
                            "lblAccountName": dataItem.accountName,
                            "lblAccountNumber": {
                                "text": (breakpoint !== 640) ? dataItem.accountID : dataItem.accountID.substr(0, 7) + "...." + dataItem.accountID.substr(-4),
                                "skin": viewConstants.SKINS.LABEL_GREY_15PX
                            },
                            "lblAvailableBalanceTitle": {
                                "text": self.getAccountSkinAndTitle(dataItem).balanceTitle,
                                "skin": (breakpoint === 640) ? viewConstants.SKINS.LABEL_GREY_13PX : viewConstants.SKINS.LABEL_GREY_15PX
                            },
                            "lblAvailableBalanceValue": dataItem[balanceKey],
                            "lblCreditKey": kony.i18n.getLocalizedString("i18n.pfm.totalCredit"),
                            "lblCreditValue": CommonUtilities2.formatCurrencyWithCommas(dataItem.totalCredits, false, currencySymbol),
                            "lblDebitKey": kony.i18n.getLocalizedString("i18n.pfm.totalDebit"),
                            "lblDebitValue": CommonUtilities2.formatCurrencyWithCommas(dataItem.totalDebits, false, currencySymbol),
                            "lblSeparator": "a",
                            "lblSepeartor2": "a",
                            "lblSeperator3": "a",
                            "flxCredit": {
                                "right": right
                            },
                            "flxDebit": {
                                "left": left
                            }
                        }
                    });
                    this.view.segAccounts.widgetDataMap = dataMap;
                    this.view.flxMySpendingWrapperAccounts.setVisibility(true);
                    this.view.flxAccounts.setVisibility(false);
                    this.view.segAccounts.setVisibility(true);
                    this.view.segAccounts.setData(accounts);
                } else {
                    this.view.flxMySpendingWrapperAccounts.setVisibility(false);
                    this.view.flxAccounts.flxNoAccounts.lblNoAccounts.text = kony.i18n.getLocalizedString("i18n.pfm.nopfmAccounts");
                    this.view.flxAccounts.setVisibility(true);
                }
            }
        },
        /**
         * getCategorySkin : Method for used to get category skin.
         * @member of {frmPersonalFinanceManagementController}
         * @param {categoryName}
         * @returns {}
         * @throws {}
         */
        getCategorySkin: function(categoryName) {
            var categoryTypeConfig = {
                'Home': {
                    skin: viewConstants.SKINS.PFM_CATEGORY_HOME
                },
                'Auto & Transport': {
                    skin: viewConstants.SKINS.PFM_CATEGORY_AUTO_TRANSPORT
                },
                'Financial': {
                    skin: viewConstants.SKINS.PFM_CATEGORY_FINANCIAL
                },
                'Food & Dining': {
                    skin: viewConstants.SKINS.PFM_CATEGORY_FOOD_DINING
                },
                'Bills & Utilities': {
                    skin: viewConstants.SKINS.PFM_CATEGORY_BILLS_UTILITIES
                },
                'Travel': {
                    skin: viewConstants.SKINS.PFM_CATEGORY_TRAVEL
                },
                'Health & Fitness': {
                    skin: viewConstants.SKINS.PFM_CATEGORY_HEALTH_FITNESS
                },
                'Education': {
                    skin: viewConstants.SKINS.PFM_CATEGORY_EDUCATION
                },
                'Other': {
                    skin: viewConstants.SKINS.PFM_CATEGORY_OTHER
                },
                'Default': {
                    skin: viewConstants.SKINS.PFM_CATEGORY_DEFAULT
                }
            }
            if (categoryTypeConfig[categoryName]) {
                return categoryTypeConfig[categoryName];
            } else {
                return categoryTypeConfig.Default;
            }
        },
        /**
         * getAccountSkinAndTitle : Method for used to get Account skin and balance title.
         * @member of {frmPersonalFinanceManagementController}
         * @param {monthsWithYear} /Month Array
         * @returns {} get all list of Years.
         * @throws {}
         */
        getAccountSkinAndTitle: function(account) {
            var accountTypeConfig = {};
            accountTypeConfig[applicationManager.getTypeManager().getAccountTypeBackendValue(OLBConstants.ACCOUNT_TYPE.SAVING)] = {
                skin: viewConstants.SKINS.PAYDUE_ACCOUNT_SAVINGS,
                balanceKey: 'availableBalance',
                balanceTitle: kony.i18n.getLocalizedString('i18n.accounts.availableBalance')
            };
            accountTypeConfig[applicationManager.getTypeManager().getAccountTypeBackendValue(OLBConstants.ACCOUNT_TYPE.CHECKING)] = {
                skin: viewConstants.SKINS.PAYDUE_ACCOUNT_CHECKING,
                balanceKey: 'availableBalance',
                balanceTitle: kony.i18n.getLocalizedString('i18n.accounts.availableBalance')
            };
            accountTypeConfig[applicationManager.getTypeManager().getAccountTypeBackendValue(OLBConstants.ACCOUNT_TYPE.CREDITCARD)] = {
                skin: viewConstants.SKINS.PAYDUE_ACCOUNT_CREDITCARD,
                balanceKey: 'currentBalance',
                balanceTitle: kony.i18n.getLocalizedString('i18n.accounts.currentBalance')
            };
            accountTypeConfig[applicationManager.getTypeManager().getAccountTypeBackendValue(OLBConstants.ACCOUNT_TYPE.DEPOSIT)] = {
                skin: viewConstants.SKINS.ACCOUNT_DETAILS_IDENTIFIER_DEPOSIT,
                balanceKey: 'currentBalance',
                balanceTitle: kony.i18n.getLocalizedString('i18n.accounts.currentBalance')
            };
            accountTypeConfig[applicationManager.getTypeManager().getAccountTypeBackendValue(OLBConstants.ACCOUNT_TYPE.MORTGAGE)] = {
                skin: viewConstants.SKINS.ACCOUNT_DETAILS_IDENTIFIER_DEPOSIT,
                balanceKey: 'currentBalance',
                balanceTitle: kony.i18n.getLocalizedString('i18n.accounts.currentBalance'),
            };
            accountTypeConfig[applicationManager.getTypeManager().getAccountTypeBackendValue(OLBConstants.ACCOUNT_TYPE.LOAN)] = {
                skin: viewConstants.SKINS.PFM_ACCOUNTS_LOAN,
                balanceKey: 'outstandingBalance',
                balanceTitle: kony.i18n.getLocalizedString('i18n.accounts.outstandingBalance'),
            };
            accountTypeConfig['Default'] = {
                skin: viewConstants.SKINS.PAYDUE_ACCOUNT_SAVINGS,
                balanceKey: 'availableBalance',
                balanceTitle: kony.i18n.getLocalizedString('i18n.accounts.availableBalance'),
            }
            if (accountTypeConfig[account.accountType]) {
                return accountTypeConfig[account.accountType];
            } else {
                return accountTypeConfig.Default;
            }
        },
        /**
         * addMonthsToDonutDropDown : Method for used to add All Months based on year selection.
         * @member of {frmPersonalFinanceManagementController}
         * @param {monthsWithYear} /Month Array
         * @returns {} get all list of Years.
         * @throws {}
         */
        addMonthsToDonutDropDown: function(monthsWithYear) {
            var year = monthsWithYear.year;

            function convertMonthToKeyValue(month) {
                var monthWithYear = month;
                return [(monthsWithYear.pfmMonths.indexOf(month) + 1).toString(), month + "    " + year];
            }
            var monthsObj = monthsWithYear.pfmMonths;
            monthsWithYear.pfmMonths = Object.keys(monthsObj).map(function(e) {
                return monthsObj[e]
            });
            this.view.lstSelectMonth.masterData = monthsWithYear.pfmMonths.map(convertMonthToKeyValue).reverse();
            this.view.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lstSelectMonth.masterData = monthsWithYear.pfmMonths.map(convertMonthToKeyValue).reverse();
            this.view.lstSelectMonth.onSelection = this.onMonthDropSelect.bind(this);
            this.view.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lstSelectMonth.onSelection = this.onCategoryMonthDropSelect.bind(this);
            this.view.lstSelectMonth.selectedKey = this.view.lstSelectMonth.masterData[0][0];
            this.view.lblHeaderBudget.text = kony.i18n.getLocalizedString("i18n.PFM.Budget2018") + "   " + this.view.lstSelectMonth.selectedKeyValue[1];
        },
        /**
         * addYearsToBarChartDropDown : Method for used to add All Years.
         * @member of {frmPersonalFinanceManagementController}
         * @param {years} /Year Array
         * @returns {} get all list of Years.
         * @throws {}
         */
        addYearsToBarChartDropDown: function(years) {
            function convertYearToKeyValue(year) {
                return [year.toString(), year];
            }
            this.view.lstSelectPeriod.masterData = years.map(convertYearToKeyValue);
            this.view.lstSelectPeriod.onSelection = this.onYearDropSelect.bind(this);
            this.view.lstSelectPeriod.selectedKey = this.view.lstSelectPeriod.masterData[0][0];
        },
        onCategoryMonthDropSelect: function() {
            var presenter = this.getPFMPresentationController();
            var year=this.view.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lstSelectMonth.selectedKeyValue[1].split(" ").splice(-1);
            presenter.getMonthlyCategorizedTransactions(this.view.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lstSelectMonth.selectedKey,year[0]);
            presenter.getMonthlySpending(false, this.view.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lstSelectMonth.selectedKey, this.view.lstSelectPeriod.selectedKey);
        },
        /**
         * onMonthDropSelect : Method for used to update the monthly chart.
         * @member of {frmPersonalFinanceManagementController}
         * @param {}
         * @returns {}.
         * @throws {}
         */
        onMonthDropSelect: function() {
            this.view.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lstSelectMonth.selectedKey = this.view.lstSelectMonth.selectedKey;
            var presenter = this.getPFMPresentationController();
            presenter.getMonthlySpending(true, this.view.lstSelectMonth.selectedKey, this.view.lstSelectPeriod.selectedKey);
            presenter.getPFMBudgetChart(this.view.lstSelectMonth.selectedKey, this.view.lstSelectPeriod.selectedKey);
            presenter.getPFMRelatedAccounts(this.view.lstSelectMonth.selectedKey, this.view.lstSelectPeriod.selectedKey);
        },
        /**
         * onYearDropSelect : Method for used to update the yearly chart and monthly chart and
         * budget chart.
         * @member of {frmPersonalFinanceManagementController}
         * @param {}
         * @returns {}.
         * @throws {}
         */
        onYearDropSelect: function() {
            var presenter = this.getPFMPresentationController();
            presenter.getYearlySpending(this.view.lstSelectPeriod.selectedKey);
            presenter.selectYear(this.view.lstSelectPeriod.selectedKey);
            presenter.getMonthlySpending(true, this.view.lstSelectMonth.selectedKey, this.view.lstSelectPeriod.selectedKey);
            presenter.getPFMBudgetChart(this.view.lstSelectMonth.selectedKey, this.view.lstSelectPeriod.selectedKey);
            presenter.getPFMRelatedAccounts(this.view.lstSelectMonth.selectedKey, this.view.lstSelectPeriod.selectedKey);
        },
        /**
         * initActions : Used to initlize the chart widgets.
         * @member of {frmPersonalFinanceManagementController}
         * @param {}
         * @returns {}.
         * @throws {}
         */
        initActions: function() {
            var scopeObj = this;
            this.view.onBreakpointChange = function() {
                scopeObj.onBreakpointChange(kony.application.getCurrentBreakpoint());
            };
//             this.initlizeDonutChart();  //getcurrentBreakpoint is returning -1          
//             this.initlizeBarChart();
//             this.initlizeStackedBarChart();
            this.view.flxMySpendingWrapper.onclick = this.navigateToMonthlyTransactionsPage.bind(this, null);
            this.view.flxUncategorizedTransactions.setVisibility(false);
        },
        /**
         * presShow : Used to Preshow.
         * @member of {frmPersonalFinanceManagementController}
         * @param {}
         * @returns {}.
         * @throws {}
         */
        preShow: function() {
            var scopeObj = this;
            FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxContainer', 'customheader', 'flxFooter','flxFormContent']);
            applicationManager.getLoggerManager().setCustomMetrics(this, false, "PFM");
            this.view.customheader.forceCloseHamburger();
            this.view.flexCategorizedMonthlySpending.setVisibility(false);
            this.view.flxPFMContainers.setVisibility(true);
            this.view.flxUncategorizedTransactions.setVisibility(false);
            this.view.customheader.customhamburger.activateMenu("ACCOUNTS", "PFM");
            this.view.CommonHeader.lblHeading.text = kony.i18n.getLocalizedString("i18n.accounts.PersonalFinanceManagement");
            this.view.CustomPopup.flxCross.onClick = function() {
                scopeObj.view.flxLogout.left = "-100%";
            };
            this.view.CustomPopup.btnYes.onClick = function() {
                var authModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AuthModule");
                var context = {
                    "action": "Logout"
                };
                authModule.presentationController.doLogout(context);
                scopeObj.view.flxLogout.left = "-100%";
            };
            this.view.CustomPopup.btnNo.onClick = function() {
                scopeObj.view.flxLogout.left = "-100%";
            };
            this.view.customheader.headermenu.btnLogout.onClick = function() {
                scopeObj.view.CustomPopup.lblHeading.text = kony.i18n.getLocalizedString("i18n.common.logout");
                scopeObj.view.CustomPopup.lblPopupMessage.text = kony.i18n.getLocalizedString("i18n.common.LogoutMsg");
                //var height = scopeObj.view.flxHeader.frame.height + scopeObj.view.flxMainWrapper.frame.height;
                //scopeObj.view.flxLogout.height = height + "dp";
                scopeObj.view.flxLogout.left = "0%";
                scopeObj.view.CustomPopup.lblHeading.setFocus(true);
            };
            applicationManager.getNavigationManager().applyUpdates(this);
            this.adjustFlxFooter();
            CampaignUtility.fetchPopupCampaigns();
        },
        /**
         * poshShow : Used to show Postshow.
         * @member of {frmPersonalFinanceManagementController}
         * @param {}
         * @returns {}..skin
         * @throws {}
         */
        postShow: function() {
         
            this.view.customheader.flxHamburgerBack.height = this.view.flxHeader.info.frame.height + this.view.flxContainer.info.frame.height + this.view.flxFooter.info.frame.height + "dp";
            this.view.customheader.flxHamburgerBack.setVisibility(false);
            this.view.CommonHeader.flxHeader.skin = viewConstants.SKINS.BLANK_SKIN_FLEX;
            this.view.CommonHeader.flxSeperator.isVisible = false;
            this.view.customheader.imgKony.setFocus(true);
            this.view.CategorizedMonthlySpending.CommonHeader.flxSeperator.isVisible = false;
            this.view.CategorizedMonthlySpending.CommonHeader.lblHeading.skin = "bbSknLbl424242SSP20Px";
            this.view.TransactionsUnCategorized.CommonHeader.flxSeperator.isVisible = true;
            this.view.TransactionsUnCategorized.CommonHeader.flxHeader.skin = viewConstants.SKINS.BLANK_SKIN_FLEX;
            this.view.CommonHeader.btnRequest.onClick = this.showUnCategorizedTransactions;
            this.view.btnBack.onClick = this.naviagetToPFMLandingForm;
            this.view.CommonHeader.btnRequest.text = kony.i18n.getLocalizedString("i18n.PFM.ViewUncategorizedTransactions");
            this.view.CommonHeader.btnRequest.toolTip = kony.i18n.getLocalizedString("i18n.PFM.ViewUncategorizedTransactions");
            var scopeObj = this;
            this.view.TransactionsUnCategorized.btnCancel.onClick = function() {
                scopeObj.showUnCategorizedTransactions();
            };
            this.view.flxChart.onClick = function() {
                scopeObj.view.lblHeaderMobileView.isVisible = false;
                scopeObj.view.flexCategorizedMonthlySpending.setVisibility(true);
                scopeObj.setBreadCrumbData();
                scopeObj.view.CategorizedMonthlySpending.CommonHeaderTransactions.btnRequest.setVisibility(false);
                scopeObj.view.forceLayout();
            };
            this.view.flxDonutChart.onClick = function() {
                scopeObj.view.lblHeaderMobileView.isVisible = false;
                scopeObj.view.flexCategorizedMonthlySpending.setVisibility(true);
                scopeObj.setBreadCrumbData();
                scopeObj.view.CategorizedMonthlySpending.CommonHeaderTransactions.btnRequest.setVisibility(false);
                scopeObj.view.forceLayout();
            };
            this.view.TransactionsUnCategorized.CommonHeader.btnRequest.onClick = function() {
                scopeObj.view.flxUncategorizedTransactions.setVisibility(true);
                scopeObj.view.TransactionsUnCategorized.CommonHeader.btnRequest.setVisibility(false);
                scopeObj.view.TransactionsUnCategorized.flxSort.setVisibility(false);
                scopeObj.view.TransactionsUnCategorized.flxSortBulkUpdate.setVisibility(true);
                scopeObj.view.TransactionsUnCategorized.flxNoTransactions.setVisibility(false);
                scopeObj.view.TransactionsUnCategorized.flxPagination.setVisibility(false);
                scopeObj.view.TransactionsUnCategorized.flxSeparatorSort.setVisibility(true);
                scopeObj.view.TransactionsUnCategorized.flxButtons.setVisibility(true);
                scopeObj.view.customheader.flxHamburgerBack.height = scopeObj.view.flxHeader.info.frame.height + scopeObj.view.flxContainer.info.frame.height + scopeObj.view.flxFooter.info.frame.height + "dp";
                var presenter = scopeObj.getPFMPresentationController();
                presenter.showBulkUpdateTransaction();
                scopeObj.view.forceLayout();
                scopeObj.AdjustScreen();
            };
            if (CommonUtilities2.isCSRMode()) {
                this.view.TransactionsUnCategorized.btnDownload.onClick = FormControllerUtility.disableButtonActionForCSRMode();
                this.view.TransactionsUnCategorized.btnDownload.skin = FormControllerUtility.disableButtonSkinForCSRMode();
                this.view.TransactionsUnCategorized.btnDownload.focusSkin = FormControllerUtility.disableButtonSkinForCSRMode();
                this.view.TransactionsUnCategorized.btnDownload.hoverSkin = FormControllerUtility.disableButtonSkinForCSRMode();
            } else {
                this.view.TransactionsUnCategorized.btnDownload.onClick = function() {
                    scopeObj.view.flxPFMAssignCategory.setVisibility(true);
                    scopeObj.view.forceLayout();
                    scopeObj.view.flxPFMAssignCategory.height = scopeObj.view.flxFooter.info.frame.height + scopeObj.view.flxFooter.info.frame.y + "dp";
                    if (kony.application.getCurrentBreakpoint() === 640) {
                        scopeObj.view.flxPFMAssignCategory.height = scopeObj.view.flxHeader.info.frame.height + scopeObj.view.flxContainer.info.frame.height + scopeObj.view.flxFooter.info.frame.height + "dp";
                    };
					var defaultValue= scopeObj.view.AssignCategory.lbxSelectFormat.masterData[0][0];
					scopeObj.view.AssignCategory.lbxSelectFormat.selectedKey=  defaultValue;
                    scopeObj.view.AssignCategory.lblHeader.setFocus(true);
                    scopeObj.view.forceLayout();
                };
            }
            this.view.AssignCategory.flxCross.onClick = function() {
                scopeObj.view.flxPFMAssignCategory.setVisibility(false);
                scopeObj.view.forceLayout();
            };
            this.view.flxBulkUpdate.onClick = function() {
                scopeObj.view.flexCategorizedMonthlySpending.isVisible = false;
                scopeObj.view.flxUncategorizedTransactions.top = "20dp";
                scopeObj.view.flxUncategorizedTransactions.isVisible = true;
                scopeObj.view.TransactionsUnCategorized.isVisible = true;
                scopeObj.view.CommonHeaderUncategorized.isVisible = true;
                scopeObj.view.TransactionsUnCategorized.flxSort.isVisible = false;
                scopeObj.view.TransactionsUnCategorized.flxSortBulkUpdate.isVisible = false;
                scopeObj.view.TransactionsUnCategorized.flxButtons.isVisible = true;
                scopeObj.view.TransactionsUnCategorized.flxHeaderUncategorized.isVisible = false;
                scopeObj.AdjustScreen();
                scopeObj.view.forceLayout();
            };
            this.view.AssignCategory.btnCancel.onClick = this.BackToUnCategorized;
            this.view.AssignCategory.btnDownload.onClick = function() {
                var presenter = scopeObj.getPFMPresentationController();
                presenter.bulkUpdateCategory(scopeObj.getSelectedTransactions());
                scopeObj.view.flxPFMAssignCategory.setVisibility(false);
                if (scopeObj.view.TransactionsUnCategorized.flxCheckbox.lblCheckBox.text === viewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                    scopeObj.setDataForUnCategorizedTransactions([]);
                    scopeObj.view.flxDowntimeWarning.rtxDowntimeWarning.text = kony.i18n.getLocalizedString('i18n.PFM.BulkBiillPaySuccessMessage') + " " + scopeObj.view.AssignCategory.lbxSelectFormat.selectedKeyValue[1] + " " + kony.i18n.getLocalizedString('i18n.billPay.category');
                    scopeObj.view.flxDowntimeWarning.imgDowntimeWarning.src = OLBConstants.IMAGES.SUCCESS_IMAGE;
                    scopeObj.view.flxDowntimeWarning.setVisibility(true);
                } else {
                    scopeObj.removedSelectedRows();
                }
            };
            this.view.TransactionsUnCategorized.flxCheckbox.onClick = function() {
                var i;
                if (scopeObj.view.TransactionsUnCategorized.flxCheckbox.lblCheckBox.text === viewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                    scopeObj.view.TransactionsUnCategorized.flxCheckbox.lblCheckBox.text = viewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
                    scopeObj.view.TransactionsUnCategorized.flxCheckbox.lblCheckBox.skin = viewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
                    var data = kony.application.getCurrentForm().TransactionsUnCategorized.segTransactions.data;
                    for (i = 0; i < data.length; i++) {
                        data[i].lblCheckBox.text = viewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
                        data[i].lblCheckBox.skin = viewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
                    }
                    scopeObj.disableButton(scopeObj.view.TransactionsUnCategorized.btnDownload);
                    if (kony.application.getCurrentBreakpoint() === 640) {
                        for (i = 0; i < data.length; i++) {
                            data[i].template = "flxPFMUnCategorizedTransactionsMobile";
                        }
                    };
                    kony.application.getCurrentForm().TransactionsUnCategorized.segTransactions.setData(data);
                } else {
                    var data1 = kony.application.getCurrentForm().TransactionsUnCategorized.segTransactions.data;
                    scopeObj.view.TransactionsUnCategorized.flxCheckbox.lblCheckBox.text = viewConstants.FONT_ICONS.CHECBOX_SELECTED;
                    scopeObj.view.TransactionsUnCategorized.flxCheckbox.lblCheckBox.skin = viewConstants.SKINS.CHECKBOX_SELECTED_SKIN;
                    for (i = 0; i < data1.length; i++) {
                        data1[i].lblCheckBox.text = viewConstants.FONT_ICONS.CHECBOX_SELECTED;
                        data1[i].lblCheckBox.skin = viewConstants.SKINS.CHECKBOX_SELECTED_SKIN;
                    }
                    if (!CommonUtilities2.isCSRMode()) {
                        scopeObj.enableButton(scopeObj.view.TransactionsUnCategorized.btnDownload);
                    }
                    if (kony.application.getCurrentBreakpoint() === 640) {
                        for (i = 0; i < data1.length; i++) {
                            data1[i].template = "flxPFMUnCategorizedTransactionsMobile";
                        }
                    };
                    kony.application.getCurrentForm().TransactionsUnCategorized.segTransactions.setData(data1);
                }
            };
            this.view.breadcrumb.btnBreadcrumb1.text = kony.i18n.getLocalizedString("i18n.topmenu.accounts");
            this.view.breadcrumb.btnBreadcrumb1.toolTip = kony.i18n.getLocalizedString("i18n.topmenu.accounts");
            this.view.breadcrumb.lblBreadcrumb2.setVisibility(false);
            this.view.breadcrumb.btnBreadcrumb2.setVisibility(true);
            this.view.breadcrumb.btnBreadcrumb2.text = kony.i18n.getLocalizedString("i18n.accounts.PersonalFinanceManagement");
            this.view.breadcrumb.btnBreadcrumb2.skin = viewConstants.SKINS.BREADCRUM2;
            this.view.breadcrumb.btnBreadcrumb2.toolTip = kony.i18n.getLocalizedString("i18n.accounts.PersonalFinanceManagement");
            this.view.breadcrumb.imgBreadcrumb2.setVisibility(false);
            this.view.breadcrumb.btnBreadcrumb2.onClick = null;
            this.view.customheader.topmenu.btnHamburger.skin = "btnHamburgerskn";
            this.view.customheader.topmenu.flxaccounts.skin = viewConstants.SKINS.PFM_FLXACCOUNTS_SKIN;
            this.view.customheader.topmenu.flxTransfersAndPay.skin = viewConstants.SKINS.BLANK_SKIN_FLEX;
            this.view.breadcrumb.lblBreadcrumb3.setVisibility(false);
            FormControllerUtility.hideProgressBar(this.view); 
            this.AdjustScreen();
            
        },
        /**
         * setCategoryList : Method for used update list box with categories.
         * @member of {frmPersonalFinanceManagementController}
         * @param {categoryList} /category Array
         * @returns {}
         * @throws {}
         */
        setCategoryList: function(categoryList) {
            var mapCategoryList = function(data) {
                if (data.categoryName !== OLBConstants.UNCATEGORISED) {
                    return [data.categoryId.toString(), data.categoryName];
                }
            };
            categoryList = categoryList.filter(function(data) {
                if (data.categoryName !== OLBConstants.UNCATEGORISED) {
                    return data;
                }
            });
            this.view.AssignCategory.lbxSelectFormat.masterData = categoryList.map(mapCategoryList);
        },
        /**
         * showUnCategorizedTransactions : Method for show UnCategorized Transactions widget
         * @member of {frmPersonalFinanceManagementController}
         * @param {}
         * @returns {}
         * @throws {}
         */
        showUnCategorizedTransactions: function() {
            FormControllerUtility.showProgressBar(this.view);
            this.view.flexCategorizedMonthlySpending.setVisibility(false);
            this.view.flxUncategorizedTransactions.setVisibility(true);
            this.view.TransactionsUnCategorized.CommonHeader.btnRequest.setVisibility(true);
            this.view.TransactionsUnCategorized.CommonHeader.btnRequest.text = kony.i18n.getLocalizedString("i18n.PFM.BulkUpdate");
            this.view.TransactionsUnCategorized.CommonHeader.btnRequest.toolTip = kony.i18n.getLocalizedString("i18n.PFM.BulkUpdate");
            this.view.TransactionsUnCategorized.flxSort.setVisibility(true);
            this.view.TransactionsUnCategorized.CommonHeader.lblHeading.skin = "sknSSP42424215Px";
            this.view.TransactionsUnCategorized.flxSortBulkUpdate.setVisibility(false);
            this.view.TransactionsUnCategorized.flxNoTransactions.setVisibility(false);
            this.view.TransactionsUnCategorized.flxPagination.setVisibility(false);
            this.view.TransactionsUnCategorized.flxSeparatorSort.setVisibility(false);
            this.view.TransactionsUnCategorized.flxButtons.setVisibility(false);
            this.view.flxPFMContainers.setVisibility(false);
            this.setBreadCrumbData();
            if (kony.application.getCurrentBreakpoint() === 640) {
                var self = this;
                self.view.flexCategorizedMonthlySpending.isVisible = true;
                self.view.CategorizedMonthlySpending.flxSegmentContainer.isVisible = false;
                self.view.flxUncategorizedTransactions.isVisible = true;
                self.view.TransactionsUnCategorized.isVisible = true;
                self.view.CategorizedMonthlySpending.btnUnCategorized.skin = viewConstants.SKINS.PFM_CATEGORIZEDMONTHLYSPENDING_BTNUNCATEGORIXED;
                self.view.CategorizedMonthlySpending.btnCategorized.skin = viewConstants.SKINS.PFM_CATEGORIZEDMONTHLYSPENDING_BTNCATEGORIZED;
                self.view.TransactionsUnCategorized.flxSortBulkUpdate.isVisible = true;
                self.view.TransactionsUnCategorized.flxSort.isVisible = false;
                self.view.TransactionsUnCategorized.flxSegmentContainer.isVisible = true;
                self.view.TransactionsUnCategorized.flxPagination.isVisible = false;
                self.view.TransactionsUnCategorized.flxButtons.isVisible = false;
                this.view.TransactionsUnCategorized.flxSegmentContainer.top = "0dp"
            }
            this.adjustFlxFooter();
            this.view.forceLayout();
            var presenter = this.getPFMPresentationController();
           if(this.view.CategorizedMonthlySpending.lstSelectMonth.selectedKey==null)
			{
				presenter.fetchUnCategorizedTransations(this.view.lstSelectMonth.selectedKey, this.view.lstSelectPeriod.selectedKey);
				
			}
			else{
			
				presenter.fetchUnCategorizedTransations(this.view.CategorizedMonthlySpending.lstSelectMonth.selectedKey, this.view.lstSelectPeriod.selectedKey);
				this.view.CategorizedMonthlySpending.lstSelectMonth.selectedKey=null
			}
},
        /**
         This method is used to adjust the alignement of footer with respect to the
         dimensions of the elements in the flxContainer
        **/
        adjustFlxFooter: function() {
            // this.view.CustomFooterMain.flxFooterMenu.width = "90%";
            // this.view.CustomFooterMain.lblCopyright.width = "90%";
            // this.view.CustomFooterMain.lblCopyright.centerX = "51%";
            // var breakpoint = kony.application.getCurrentBreakpoint();
            // var width = "";
            // if (breakpoint !== 640) {
            //   	if (this.view.flxPFMContainers.isVisible) {
            // 	    width = "100%";
            //   	} else {
            // 		width = "90%";
            // 		if(breakpoint === 1024){
            //   			this.view.CustomFooterMain.centerX ="54%";
            //   			this.view.CustomFooterMain.lblCopyright.centerX = "47.5%";
            // 		}
            // 	}
            // }
            // this.view.flxFooter.width = width;
        },
        /**
         * createViewModelForUnCategorizedTransaction : method for create datamap
         * @member of {frmPersonalFinanceManagementController}
         * @param {data} /array of transactions
         * @returns {}
         * @throws {}
         */
        createViewModelForUnCategorizedTransaction: function(data) {
            return {
                lblAmount: data.transactionAmount,
                lblDate: data.transactionDate,
                lblDescription: data.transactionDescription,
                lblDescriptionModeData: data.transactionDescription,
                lblFromAccount: kony.i18n.getLocalizedString("i18n.transfers.fromAccount"),
                lblFromAccountData: CommonUtilities2.mergeAccountNameNumber(data.fromAccountName, data.fromAccountNumber),
                lblTo: data.toAccountName,
                lblToAccount: kony.i18n.getLocalizedString("i18n.PayAPerson.ToAccount"),
                lblToAccountData: data.toAccountName,
                template: "flxPFMUnCategorizedTransactions",
                "lblIdentifier": {
                    "skin": viewConstants.SKINS.PFM_LBLIDENTIFIER
                },
                "lblCategory": "Select Category",
                "imgCategoryDropdown": viewConstants.IMAGES.ARROW_DOWN,
                "imgDropdown": viewConstants.IMAGES.ARROW_DOWN,
                "lblSeparator": "lblSeparator",
                "lblSeparator2": "lblSeparator2"
            }
        },
        /**
         * setBreadCrumbData : method for handle setBreadCrumbData for uncategorized transactions
         * @member of {frmPersonalFinanceManagementController}
         * @param {}
         * @returns {}
         * @throws {}
         */
        setBreadCrumbData: function(categorizedFlow) {
            this.view.breadcrumb.btnBreadcrumb1.text = kony.i18n.getLocalizedString("i18n.topmenu.accounts");
            this.view.breadcrumb.btnBreadcrumb1.toolTip = kony.i18n.getLocalizedString("i18n.topmenu.accounts");
            this.view.breadcrumb.lblBreadcrumb2.setVisibility(false);
            this.view.breadcrumb.btnBreadcrumb2.setVisibility(true);
            this.view.breadcrumb.btnBreadcrumb2.text = kony.i18n.getLocalizedString("i18n.accounts.PersonalFinanceManagement");
            this.view.breadcrumb.btnBreadcrumb2.toolTip = kony.i18n.getLocalizedString("i18n.accounts.PersonalFinanceManagement");
            this.view.breadcrumb.btnBreadcrumb2.toolTip = kony.i18n.getLocalizedString("i18n.accounts.PersonalFinanceManagement");
            this.view.breadcrumb.btnBreadcrumb2.skin = viewConstants.SKINS.BREADCRUM;
            this.view.breadcrumb.btnBreadcrumb2.onClick = this.showPFMLanding;
            this.view.breadcrumb.btnBreadcrumb2.onClick = this.naviagetToPFMLandingForm;
            this.view.breadcrumb.imgBreadcrumb2.setVisibility(true);
            if (categorizedFlow) {
                this.view.breadcrumb.lblBreadcrumb3.text = kony.i18n.getLocalizedString("i18n.accounts.categorizedMonthlySpending");
                this.view.breadcrumb.lblBreadcrumb3.toolTip = kony.i18n.getLocalizedString("i18n.accounts.categorizedMonthlySpending");
                this.view.breadcrumb.lblBreadcrumb3.setVisibility(true);
            } else {
                this.view.breadcrumb.lblBreadcrumb3.text = kony.i18n.getLocalizedString("i18n.PFM.UncategorizedTransactions");
                this.view.breadcrumb.lblBreadcrumb3.toolTip = kony.i18n.getLocalizedString("i18n.PFM.UncategorizedTransactions");
                this.view.breadcrumb.lblBreadcrumb3.setVisibility(true);
            }
        },
        /**
         * setDataForUnCategorizedTransactions : method to set data for uncategorized tranasactions
         * @member of {frmPersonalFinanceManagementController}
         * @param {Array} data - transactions data
         * @returns {}
         * @throws {}
         */
        setDataForUnCategorizedTransactions: function(data, config) {
            var self = this;
            var isMirrorLayoutEnabled = CommonUtilities2.isMirrorLayoutEnabled();
            if (data.length === 0) {
                this.view.TransactionsUnCategorized.flxNoTransactions.setVisibility(true);
                this.view.TransactionsUnCategorized.flxButtons.isVisible = false;
                this.view.TransactionsUnCategorized.CommonHeader.btnRequest.setVisibility(false);
                this.view.TransactionsUnCategorized.segTransactions.setVisibility(false);
                this.view.TransactionsUnCategorized.flxSortBulkUpdate.setVisibility(false);
                this.view.TransactionsUnCategorized.flxSort.setVisibility(false);
                FormControllerUtility.hideProgressBar(this.view);
                self.AdjustScreen(40);
                return;
            } else {
                this.view.TransactionsUnCategorized.flxSort.setVisibility(true);
                this.view.TransactionsUnCategorized.flxSortBulkUpdate.setVisibility(false);
                this.view.TransactionsUnCategorized.flxNoTransactions.setVisibility(false);
                this.view.TransactionsUnCategorized.CommonHeader.btnRequest.setVisibility(true);
                this.view.TransactionsUnCategorized.segTransactions.setVisibility(true);
            }
            var widgetMap = {
                "flxActions": "flxActions",
                "flxAmount": "flxAmount",
                "flxCategory": "flxCategory",
                "flxDate": "flxDate",
                "flxDescription": "flxDescription",
                "flxDescription1": "flxDescription1",
                "flxDetail": "flxDetail",
                "flxDetailData": "flxDetailData",
                "flxDetailHeader": "flxDetailHeader",
                "flxDetailDescription": "flxDetailDescription",
                "flxDescriptionMode": "flxDescriptionMode",
                "flxDescriptionModeData": "flxDescriptionModeData",
                "flxDropdown": "flxDropdown",
                "flxFromAccount": "flxFromAccount",
                "flxFromAccountData": "flxFromAccountData",
                "flxIdentifier": "flxIdentifier",
                "flxInformation": "flxInformation",
                "flxLeft": "flxLeft",
                "flxPFMUnCategorizedTransactionSelected": "flxPFMUnCategorizedTransactionSelected",
                "flxPFMUnCategorizedTransactionsSelected": "flxPFMUnCategorizedTransactionsSelected",
                "flxRight": "flxRight",
                "flxSegDisputedTransactionRowWrapper": "flxSegDisputedTransactionRowWrapper",
                "flxTo": "flxTo",
                "flxToAccount": "flxToAccount",
                "flxToAccountData": "flxToAccountData",
                "flxWrapper": "flxWrapper",
                "imgCategoryDropdown": "imgCategoryDropdown",
                "imgDropdown": "imgDropdown",
                "lblAmount": "lblAmount",
                "lblCategory": "lblCategory",
                "lblDate": "lblDate",
                "lblDescription": "lblDescription",
                "lblDescription1": "lblDescription1",
                "lblFromAccount": "lblFromAccount",
                "lblFromAccountData": "lblFromAccountData",
                "lblDescriptionMode": "lblDescriptionMode",
                "lblDescriptionModeData": "lblDescriptionModeData",
                "lblIdentifier": "lblIdentifier",
                "lblSeparator": "lblSeparator",
                "lblSeparator2": "lblSeparator2",
                "lblTo": "lblTo",
                "lblToAccount": "lblToAccount",
                "lblToAccountData": "lblToAccountData"
            };
            data = data.map(this.createViewModelForUnCategorizedTransaction);
            this.view.TransactionsUnCategorized.segTransactions.widgetDataMap = widgetMap;
            if (kony.application.getCurrentBreakpoint() === 640) {
                for (var i = 0; i < data.length; i++) {
                    data[i].template = "flxPFMUnCategorizedTransactionsMobile";
                }
            };
            this.view.TransactionsUnCategorized.segTransactions.setData(data);
            var sortMap = [{
                    name: 'transactionDate',
                    imageFlx: this.view.TransactionsUnCategorized.flxSort.flxSortSixColumn.flxLeft.flxSortDate.imgSortDate,
                    clickContainer: this.view.TransactionsUnCategorized.flxSort.flxSortSixColumn.flxLeft.flxSortDate
                },
                {
                    name: 'amount',
                    imageFlx: this.view.TransactionsUnCategorized.flxSort.flxSortSixColumn.flxRight.flxSortAmount.imgSortAmount,
                    clickContainer: this.view.TransactionsUnCategorized.flxSort.flxSortSixColumn.flxRight.flxSortAmount
                }
            ];
            if (isMirrorLayoutEnabled) {
              this.view.TransactionsUnCategorized.flxSort.flxSortSixColumn.flxLeft.flxSortDate.left = "1%";
            }
            CommonUtilities2.Sorting.setSortingHandlers(sortMap, self.onCategorizedTransactionsSorting.bind(self), self);
            CommonUtilities2.Sorting.updateSortFlex(sortMap, config);
            FormControllerUtility.hideProgressBar(this.view);
            this.view.forceLayout();
            self.AdjustScreen(50);
        },
        /**
         * onCategorizedTransactionsSorting: Handler for Make Categorized Transactions Sorting
         * @member {frmPersonalFinanceManagementController}
         * @param {object} event - Event Object
         * @param {object} data - Updated Config
         * @returns {}
         * @throws {}
         */
        onCategorizedTransactionsSorting: function(event, data) {
            var presenter = this.getPFMPresentationController();
            presenter.fetchUnCategorizedTransations(null, null, data);
        },
        /**
         * AdjustScreen : method to adjust screen after load data
         * @member of {frmPersonalFinanceManagementController}
         * @param {}
         * @returns {}
         * @throws {}
         */
        AdjustScreen: function(data) {
            this.view.forceLayout();
            var mainheight = 0;
            var screenheight = kony.os.deviceInfo().screenHeight;
            mainheight =this.view.flxContainer.info.frame.height;
            var diff = screenheight - mainheight;
          if (kony.application.getCurrentBreakpoint() === 1024) {
                this.view.flxFooter.top = (mainheight-30) + "dp";
            } else
            if (mainheight < screenheight) {
                diff = diff - this.view.flxFooter.info.frame.height;
                if (diff > 0)
                    this.view.flxFooter.top = mainheight + diff + "dp";
                else
                    this.view.flxFooter.top = mainheight + "dp";
            } else {
               if(data!==null&&data!==""&&data!==undefined){
					this.view.flxFooter.top = mainheight - data + "dp";
				} else{					 
                    this.view.flxFooter.top = mainheight -80 + "dp";             
				}
            }
            this.view.forceLayout();
            this.initializeResponsiveViews();
        },
        /**
         * initlizeStackedBarChart : Method for used to Initilize the stacked Bar Chart Data.
         * @member of {frmPersonalFinanceManagementController}
         * @param {} /bar chart Data
         * @returns {} get all list of Years.
         * @throws {}
         */
        initlizeStackedBarChart: function() {
            var isMirrorLayoutEnabled = CommonUtilities2.isMirrorLayoutEnabled();
            var data = [];
            var options = {
                displayAnnotations: true,
                colors: ['green', 'red'],
                isStacked: true,
               
                height: 400,
                legend: 'none',
                annotations: {
                    alwaysOutside: true,
                    startup: true,
                    highContrast: true
                },
            };
            if (kony.application.getCurrentBreakpoint() === 640) {
                options.width = 400;
            } else if (kony.application.getCurrentBreakpoint() === 1024) {
                options.width = 400;
				options.height=600;
            } else if (kony.application.getCurrentBreakpoint() === 1366) {
                options.width = 450;
            }
            var StackedBarChart = new kony.ui.CustomWidget({
                "id": "stackedBarchart",
                "isVisible": true,
                "left": "1dp",
                "top": "1dp",
                "width": isMirrorLayoutEnabled ? "470dp" : "550dp",
                "height": "400dp",
                "zIndex": 1
            }, {
                "padding": [0, 0, 0, 0],
                "paddingInPixel": false
            }, {
                "widgetName": "StackedBarChart",
                "chartData": data,
                "chartProperties": options,
                "OnClickOfBar": function(data) {
                    //alert(data);
                }
            });
            this.view.flxBudget2018WrapperdataUnavailable.setVisibility(false);
            this.view.flxMySpendingWrapperBudget.setVisibility(true);
            this.view.flxMySpendingWrapperBudget.add(StackedBarChart);
        },
        /**
         * initlizeBarChart : Method for used to Initilize the Bar Chart Data.
         * @member of {frmPersonalFinanceManagementController}
         * @param {} /bar chart Data
         * @returns {} get all list of Years.
         * @throws {}
         */
        initlizeBarChart: function() {
            var self = this;
            var isMirrorLayoutEnabled = CommonUtilities2.isMirrorLayoutEnabled();
            var selectedYear=self.view.lstSelectPeriod.selectedKey;    
            var data = [];
            var options = {
                title: '',
                height: 500,
                width: isMirrorLayoutEnabled ? "500dp" : "550dp",
                chartArea: {
                    top: 20
                },
                legend: {
                    position: 'none'
                },
                annotations: {
                    alwaysOutside: 'true',
                    textStyle: {
                        color: '#000000'
                    }
                },
                bars: 'horizontal',
                hAxis: {
                    minValue: 0,
                    ticks: []
                },
                vAxis: {
                    basecolor: 'red',
                    minValue: 0,
                    ticks: [0, 45]
                },
                bar: {
                    groupWidth: "45%"
                },
                colors: ["#3284E5"]
            };
            if (kony.application.getCurrentBreakpoint() === 640) {
                options.width = 320;
            } else if (kony.application.getCurrentBreakpoint() === 1024) {
                options.width = 300;
            } else if (kony.application.getCurrentBreakpoint() === 1366) {
                options.width = 450;
            }
            var BarChart = new kony.ui.CustomWidget({
                "id": "barchart",
                "isVisible": true,
                "left": "1dp",
                "top": "1dp",
                "width": isMirrorLayoutEnabled ? "500dp" : "600dp",
                "height": "400dp",
                "zIndex": 1
            }, {
                "padding": [0, 0, 0, 0],
                "paddingInPixel": false
            }, {
                "widgetName": "BarChart",
                "chartData": data,
                "chartProperties": options,
                "selectedYear":selectedYear,
                "OnClickOfBar": function(monthId) {
                  selectedYear=self.view.lstSelectPeriod.selectedKey;      
                  if (kony.application.getCurrentBreakpoint() === 640) {
                    self.view.CategorizedMonthlySpending.CommonHeader.lblHeading.skin = "bbSknLbl424242SSP20Px";
                        self.CategorizedbtnTransactionsMobile();
                        self.navigateToMonthlyTransactionsPage(monthId,selectedYear);
                        self.view.CategorizedMonthlySpending.btnCategorized.onClick = function() {
                            var scopeObj = self;
                            scopeObj.CategorizedbtnTransactionsMobile();
                            scopeObj.navigateToMonthlyTransactionsPage(monthId,selectedYear);
                            scopeObj.view.CategorizedMonthlySpending.flxTabs.isVisible = true;
                            scopeObj.view.forceLayout();
                        };
                        self.view.CategorizedMonthlySpending.btnUnCategorized.onClick = function() {
                            var scopeObj = self;
                            scopeObj.showUnCategorizedTransactions();
                            scopeObj.view.CategorizedMonthlySpending.flxTabs.isVisible = true;
                            scopeObj.view.forceLayout();
                        };
                        self.view.CategorizedMonthlySpending.flxTabs.isVisible = true;
                    } else {
                        self.navigateToMonthlyTransactionsPage(monthId,selectedYear);
                        self.view.CategorizedMonthlySpending.flxTabs.isVisible = false;
                    }
                }
            });
            this.view.flxChart.setVisibility(true);
            this.view.flxChart.add(BarChart);
        },
        initlizeDonutChartForCategory: function() {
            var self = this;
		    var isMirrorLayoutEnabled = CommonUtilities2.isMirrorLayoutEnabled();
            var data = [];
            var options = {
                legend: {
                    position: 'top',
                    fontSize: 16,
                    maxLines: 4
                },
                height: 370,
                width: 370,
                title: '',
                pieHole: 0.5,
                pieSliceText: 'none',
                toolTip: {
                    text: 'percentage'
                },
                colors: ["#FEDB64", "#E87C5E", "#6753EC", "#E8A75E", "#3645A7", "#04B6DF", "#8ED174", "#D6B9EA", "#B160DC", "#23A8B1"]
            };
            var donutChart = new kony.ui.CustomWidget({
                "id": "donutChart",
                "isVisible": true,
                "left": "1dp",
                "top": "0dp",
                "width": isMirrorLayoutEnabled ? "420dp" : "600dp",
                "height": "390dp",
                "zIndex": 1
            }, {
                "padding": [0, 0, 0, 0],
                "paddingInPixel": false
            }, {
                "widgetName": "DonutChart",
                "chartData": data,
                "chartProperties": options,
                "OnClickOfPie": function(data) {}
            });
            this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.setVisibility(true);
            this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.flxDonutChart.add(donutChart);
        },
        /**
         * initlizeDonutChart : Method for used to Initilize the Donut Chart Data.
         * @member of {frmPersonalFinanceManagementController}
         * @param {} /bar chart Data
         * @returns {} get all list of Years.
         * @throws {}
         */
        initlizeDonutChart: function() {
            var self = this;
            var data = [];
            var isMirrorLayoutEnabled = CommonUtilities2.isMirrorLayoutEnabled();
            var options = {
                height: 330,
                width: isMirrorLayoutEnabled ? "420dp" : "600dp",
                position: 'top',
                title: '',
                pieHole: 0.6,
                pieSliceText: 'none',
                toolTip: {
                    text: 'percentage'
                },
                colors: ["#FEDB64", "#E87C5E", "#6753EC", "#E8A75E", "#3645A7", "#04B6DF", "#8ED174", "#D6B9EA", "#B160DC", "#23A8B1"]
            };
            if (kony.application.getCurrentBreakpoint() === 640) {
                options.height = 320;
                options.width = 480;
                options.chartArea = {
                    right: 120,
                    left: 30
                }
            } else if (kony.application.getCurrentBreakpoint() === 1366) {
                options.height = 320;
                options.width = 450;
                options.chartArea = {
                    right: 120,
                    left: 30
                }
            } else if (kony.application.getCurrentBreakpoint() === 1024) {
                options.height = 320;
                options.width = 300;
            }
            var donut = new kony.ui.CustomWidget({
                "id": "donut",
                "isVisible": true,
                "left": "1dp",
                "top": "0dp",
                "width": isMirrorLayoutEnabled ? "420dp" : "600dp",
                "height": "350dp",
                "zIndex": 1
            }, {
                "padding": [0, 0, 0, 0],
                "paddingInPixel": false
            }, {
                "widgetName": "DonutChart",
                "chartData": data,
                "chartProperties": options,
                "OnClickOfPie": function(data) {
                    if (kony.application.getCurrentBreakpoint() === 640) {
                        self.view.CategorizedMonthlySpending.CommonHeader.lblHeading.skin = "bbSknLbl424242SSP20Px";
                        self.CategorizedbtnTransactionsMobile();
                        self.navigateToMonthlyTransactionsPage();
                        self.view.CategorizedMonthlySpending.btnCategorized.onClick = function() {
                            var scopeObj = self;
                            scopeObj.CategorizedbtnTransactionsMobile();
                            scopeObj.navigateToMonthlyTransactionsPage();
                            scopeObj.view.CategorizedMonthlySpending.flxTabs.isVisible = true;
                            scopeObj.view.TransactionsUnCategorized.flxButtons.isVisible = false;
                            scopeObj.view.forceLayout();
                        };
                        self.view.CategorizedMonthlySpending.btnUnCategorized.onClick = function() {
                            var scopeObj = self;
                            scopeObj.showUnCategorizedTransactions();
                            scopeObj.view.CategorizedMonthlySpending.flxTabs.isVisible = true;
                            scopeObj.view.TransactionsUnCategorized.flxButtons.isVisible = false;
                            scopeObj.view.forceLayout();
                        };
                        self.view.CategorizedMonthlySpending.flxTabs.isVisible = true;
                    } else {
                        self.navigateToMonthlyTransactionsPage();
                        self.view.CategorizedMonthlySpending.flxTabs.isVisible = false;
                    }
                    self.view.forceLayout();
                }
            });
            this.view.flxMySpendingWrapper.flxDonutChart.add(donut);
        },
        /**
         * navigateToMonthlyTransactionsPage : Method for used to naviagate the monthly transactions page.
         * @member of {frmPersonalFinanceManagementController}
         * @param {}
         * @returns {} get all list of Years.
         * @throws {}
         */
        navigateToMonthlyTransactionsPage: function(monthId,yearId) {
            var self = this;
            this.setBreadCrumbData(true);
            this.view.flexCategorizedMonthlySpending.setVisibility(true);
            this.view.flxPFMContainers.setVisibility(false);
            this.view.CategorizedMonthlySpending.flxTabs.isVisible = false;
            this.view.CategorizedMonthlySpending.CommonHeader.btnRequest.setVisibility(false);
            // this.view.CategorizedMonthlySpending.CommonHeader.btnRequest.text = kony.i18n.getLocalizedString("i18n.PFM.ViewUncategorizedTransactions");            
            // this.view.CategorizedMonthlySpending.CommonHeader.btnRequest.onClick = this.showUnCategorizedTransactions;
            this.view.CategorizedMonthlySpending.CommonHeaderTransactions.btnRequest.text = kony.i18n.getLocalizedString("i18n.PFM.ViewUncategorizedTransactions");
            this.view.CategorizedMonthlySpending.CommonHeaderTransactions.btnRequest.toolTip = kony.i18n.getLocalizedString("i18n.PFM.ViewUncategorizedTransactions");
            this.view.CategorizedMonthlySpending.CommonHeaderTransactions.btnRequest.onClick = this.showUnCategorizedTransactions;
            var presenter = this.getPFMPresentationController();
            if (monthId) {
                this.view.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lstSelectMonth.selectedKey = monthId;
                presenter.getMonthlyCategorizedTransactions(monthId,yearId);
                presenter.getMonthlySpending(false, monthId, this.view.lstSelectPeriod.selectedKey);
            } else {
                this.view.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lstSelectMonth.selectedKey = this.view.lstSelectMonth.selectedKey;
                yearId = this.view.lstSelectPeriod.selectedKey;
                presenter.getMonthlyCategorizedTransactions(this.view.lstSelectMonth.selectedKey,yearId);
                presenter.getMonthlySpending(false, this.view.lstSelectMonth.selectedKey, this.view.lstSelectPeriod.selectedKey);
            }
            this.view.forceLayout();
        },
        /**
         * addBarChart : Method for used to update the stacked bar Chart Data.
         * @member of {frmPersonalFinanceManagementController}
         * @param {pfmBarChartData} /bar chart Data
         * @returns {} get all list of Years.
         * @throws {}
         */
        addBarChart: function(pfmBarChartData) {
            if (pfmBarChartData.length != 0) {
                this.view.flxChart.setVisibility(true);
              if (( this.view.flxChart.barchart)===undefined) {
                this.initlizeBarChart();
              }

                this.view.flxChart.barchart.chartData = pfmBarChartData;
                this.view.flxNoTransactions.setVisibility(false);
            } else {
                this.view.flxChart.setVisibility(false);
                this.view.flxNoTransactions.setVisibility(true);
            }
            this.view.forceLayout();
        },
        /**
         * addStackedBarChart : Method for used to update the stacked bar Chart Data.
         * @member of {frmPersonalFinanceManagementController}
         * @param {pfmBudgetChartData} /bar chart Data
         * @returns {} get all list of Years.
         * @throws {}
         */
        addStackedBarChart: function(pfmBudgetChartData) {
            this.view.lblHeaderBudget.text = kony.i18n.getLocalizedString("i18n.PFM.Budget2018") + "   " + this.view.lstSelectMonth.selectedKeyValue[1];
            if (pfmBudgetChartData.length != 0) {
                this.view.flxMySpendingWrapperBudget.setVisibility(true);
                this.view.flxBudget2018WrapperdataUnavailable.setVisibility(false);
              if((this.view.flxMySpendingWrapperBudget.stackedBarchart)===undefined)
				{
					this.initlizeStackedBarChart();					 
				}
                this.view.flxMySpendingWrapperBudget.stackedBarchart.chartData = pfmBudgetChartData;
            } else {
                this.view.flxMySpendingWrapperBudget.setVisibility(false);
                this.view.flxBudget2018WrapperdataUnavailable.setVisibility(true);
                //this.view.flxMySpendingWrapperdataUnavailable.setVisibility(true);
            }
            this.view.forceLayout();
        },
        /**
         * addDonut : Method for used to update the  Donut Chart.
         * @member of {frmPersonalFinanceManagementController}
         * @param {pfmChartData} /bar chart Data
         * @returns {} get all list of Years.
         * @throws {}
         */
        addDonut: function(showBothDonutCharts, pfmChartData, totalCashSpent) {
            if (pfmChartData.length != 0) {
                if (showBothDonutCharts) {
                    this.view.flxMySpendingWrapper.setVisibility(true);
                    this.view.flxMySpendingWrapper.flxDonutChart.setVisibility(true);
                    this.view.flxMySpendingWrapper.flxNoTransactionsMySpending.setVisibility(false);
                    this.view.flxMySpendingWrapper.lblOverallSpendingMySpending.setVisibility(true);
                    this.view.flxMySpendingWrapper.lblOverallSpendingAmount.setVisibility(true);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lblOverallSpendingAmount.setVisibility(true);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lblOverallSpending.setVisibility(true);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.flxMySpendingWrapperdataUnavailableSpending.setVisibility(false);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.flxDonutChart.setVisibility(true);
                    this.view.flxMySpendingWrapper.lblOverallSpendingAmount.text = totalCashSpent;
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lblOverallSpendingAmount.text = totalCashSpent;
                   if(this.view.flxMySpendingWrapper.flxDonutChart.donut===undefined)
					{
						this.initlizeDonutChart();						
					}
                  this.view.flxMySpendingWrapper.flxDonutChart.donut.chartData = pfmChartData;
                } else {                  
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lblOverallSpendingAmount.setVisibility(true);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lblOverallSpending.setVisibility(true);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.flxMySpendingWrapperdataUnavailableSpending.setVisibility(false);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.flxDonutChart.setVisibility(true);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lblOverallSpendingAmount.text = totalCashSpent;
                    if(!(this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.flxDonutChart.donutChart))
                    {
                      this.initlizeDonutChartForCategory(); 
                    }
                  this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.flxDonutChart.donutChart.chartData = pfmChartData;
                }
            } else {
                if (showBothDonutCharts) {
                    var isMirrorLayoutEnabled = CommonUtilities2.isMirrorLayoutEnabled();
                    this.view.flxMySpendingWrapper.flxNoTransactionsMySpending.setVisibility(true);
                    this.view.flxMySpendingWrapper.flxNoTransactionsMySpending.lblImgMySpending.width = "30%";
                    if (isMirrorLayoutEnabled) {
                      this.view.flxMySpendingWrapper.flxNoTransactionsMySpending.flxNoTransactionInfo.width = "75%";
                    } else {
                      this.view.flxMySpendingWrapper.flxNoTransactionsMySpending.flxNoTransactionInfo.width = "100%";
                    }
                    this.view.flxMySpendingWrapper.flxNoTransactionsMySpending.flxNoTransactionInfo.centerX = "50%";
                    this.view.flxMySpendingWrapper.flxDonutChart.setVisibility(false);
                    this.view.flxMySpendingWrapper.lblOverallSpendingMySpending.setVisibility(false);
                    this.view.flxMySpendingWrapper.lblOverallSpendingAmount.setVisibility(false);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lblOverallSpendingAmount.setVisibility(false);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lblOverallSpending.setVisibility(false);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.flxMySpendingWrapperdataUnavailableSpending.setVisibility(true);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.flxDonutChart.setVisibility(false);
                } else {
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lblOverallSpendingAmount.setVisibility(false);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.lblOverallSpending.setVisibility(false);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.flxMySpendingWrapperdataUnavailableSpending.setVisibility(true);
                    this.view.flxMainContainer.flexCategorizedMonthlySpending.CategorizedMonthlySpending.flxDonutChart.setVisibility(false);
                }
            }
            this.view.forceLayout();
        },
        /**
         * createViewModelForBulkUpdate : Method for used to create view model for bulkupdate
         * @member of {frmPersonalFinanceManagementController}
         * @param {jsonobject} data - view model object
         * @returns {} get all list of Years.
         * @throws {}
         */
        createViewModelForBulkUpdate: function(data) {
            var self = this;
            return {
                lblCheckBox: {
                    "text": viewConstants.FONT_ICONS.CHECBOX_UNSELECTED,
                    "skin": viewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN
                },
                template: "flxPFMBulkUpdateTransaction",
                lblAmount: data.transactionAmount,
                lblDate: data.transactionDate,
                lblDescription: data.transactionDescription,
                lblFromAccount: kony.i18n.getLocalizedString("i18n.transfers.fromAccount"),
                lblFromAccountData: CommonUtilities2.getAccountDisplayName({
                    name: data.fromAccountName,
                    accountID: data.fromAccountNumber,
                    nickName: data.fromNickName,
                    Account_id: data.fromAccountNumber
                }),
                lblTo: data.toAccountName,
                lblToAccount: kony.i18n.getLocalizedString("i18n.PayAPerson.ToAccount"),
                lblToAccountData: data.toAccountName,
                lblIdentifier: {
                    skin: viewConstants.SKINS.PFM_LBLIDENTIFIER
                },
                imgCategoryDropdown: viewConstants.IMAGES.ARROW_DOWN,
                imgDropdown: viewConstants.IMAGES.ARROW_DOWN,
                lblSeparator: "lblSeparator",
                lblSeparator2: "lblSeparator2",
                flxCheckbox: {
                    onClick: self.toggleCheckBox
                },
                transactionId: data.transactionId,
                categoryId: data.categoryId
            }
        },
        /**
         * setBulkUpdateTransactionData : Method for used to set bulk update the transaction
         * @member of {frmPersonalFinanceManagementController}
         * @param {Array} transaction List
         * @returns {}
         * @throws {}
         */
        setBulkUpdateTransactionData: function(transactionList) {
            var BulkTransactionData = {
                "flxAmount": "flxAmount",
                "flxCheckbox": "flxCheckbox",
                "flxDate": "flxDate",
                "flxDescription": "flxDescription",
                "flxDetail": "flxDetail",
                "flxDetailData": "flxDetailData",
                "flxDetailHeader": "flxDetailHeader",
                "flxDropdown": "flxDropdown",
                "flxFromAccount": "flxFromAccount",
                "flxFromAccountData": "flxFromAccountData",
                "flxIdentifier": "flxIdentifier",
                "flxInformation": "flxInformation",
                "flxLeft": "flxLeft",
                "flxPFMBulkUpdateTransactions": "flxPFMBulkUpdateTransactions",
                "flxPFMBulkUpdateTransactionsSelected": "flxPFMBulkUpdateTransactionsSelected",
                "flxRight": "flxRight",
                "flxSegDisputedTransactionRowWrapper": "flxSegDisputedTransactionRowWrapper",
                "flxTo": "flxTo",
                "flxToAccount": "flxToAccount",
                "flxToAccountData": "flxToAccountData",
                "flxWrapper": "flxWrapper",
                "lblCheckBox": "lblCheckBox",
                "imgDropdown": "imgDropdown",
                "lblAmount": "lblAmount",
                "lblDate": "lblDate",
                "lblDescription": "lblDescription",
                "lblFromAccount": "lblFromAccount",
                "lblFromAccountData": "lblFromAccountData",
                "lblIdentifier": "lblIdentifier",
                "lblSeparator": "lblSeparator",
                "lblSeparator2": "lblSeparator2",
                "lblTo": "lblTo",
                "lblToAccount": "lblToAccount",
                "lblToAccountData": "lblToAccountData"
            };
            this.view.TransactionsUnCategorized.segTransactions.widgetDataMap = BulkTransactionData;
            this.view.TransactionsUnCategorized.segTransactions.setData(transactionList.map(this.createViewModelForBulkUpdate));
            var BulkData = transactionList.map(this.createViewModelForBulkUpdate);
            if (kony.application.getCurrentBreakpoint() === 640) {
                for (var i = 0; i < BulkData.length; i++) {
                    BulkData[i].template = "flxPFMBulkUpdateTransactionMobile";
                }
            };
            this.view.TransactionsUnCategorized.flxCheckbox.lblCheckBox.text = viewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
            this.view.TransactionsUnCategorized.flxCheckbox.lblCheckBox.skin = viewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
            this.disableButton(this.view.TransactionsUnCategorized.btnDownload);
            this.view.forceLayout();
        },
        /**
         * removedSelectedRows : Method used to removed Selected Rows
         * @member of {frmPersonalFinanceManagementController}
         * @param {}
         * @returns {}
         * @throws {}
         */
        removedSelectedRows: function() {
			var i =0;
			while (i<this.view.TransactionsUnCategorized.segTransactions.data.length) {
				if (this.view.TransactionsUnCategorized.segTransactions.data[i].lblCheckBox.text === viewConstants.FONT_ICONS.CHECBOX_SELECTED) {
					this.view.TransactionsUnCategorized.segTransactions.removeAt(i);
				}
				else i++;
			}
		},
        /**
         * toggleCheckBox : Method used to toggle check box
         * @member of {frmPersonalFinanceManagementController}
         * @param {}
         * @returns {}
         * @throws {}
         */
        toggleCheckBox: function() {
            var index = this.view.TransactionsUnCategorized.segTransactions.selectedRowIndex[1];
            var data = this.view.TransactionsUnCategorized.segTransactions.data;
            if (data.length === 0) return;
            var selectedRowCount = 0;
            for (var i = 0; i < data.length; i++) {
                if (i == index) {
                    if (data[i].lblCheckBox.text === viewConstants.FONT_ICONS.CHECBOX_UNSELECTED) {
                        data[i].lblCheckBox.text = viewConstants.FONT_ICONS.CHECBOX_SELECTED;
                        data[i].lblCheckBox.skin = viewConstants.SKINS.CHECKBOX_SELECTED_SKIN;
                    } else {
                        data[i].lblCheckBox.text = viewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
                        data[i].lblCheckBox.skin = viewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
                    }
                }
                if (data[i].lblCheckBox.text === viewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                    selectedRowCount++;
                }
            }
            this.view.TransactionsUnCategorized.segTransactions.setDataAt(data[index], index);
            if (selectedRowCount === data.length) {
                this.view.TransactionsUnCategorized.flxCheckbox.lblCheckBox.text = viewConstants.FONT_ICONS.CHECBOX_SELECTED;
                this.view.TransactionsUnCategorized.flxCheckbox.lblCheckBox.skin = viewConstants.SKINS.CHECKBOX_SELECTED_SKIN;
            } else if (this.view.TransactionsUnCategorized.flxCheckbox.lblCheckBox.text === viewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                this.view.TransactionsUnCategorized.flxCheckbox.lblCheckBox.text = viewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
                this.view.TransactionsUnCategorized.flxCheckbox.lblCheckBox.skin = viewConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
            }
            if (selectedRowCount > 0 && !CommonUtilities2.isCSRMode()) {
                this.enableButton(this.view.TransactionsUnCategorized.btnDownload);
            } else {
                this.disableButton(this.view.TransactionsUnCategorized.btnDownload);
            }
        },
        /**
         * getSelectedTransactions : Method to get selected rows from segment
         * @member of {frmPersonalFinanceManagementController}
         * @param {}
         * @returns {Array} list of rows
         * @throws {}
         */
        getSelectedTransactions: function() {
            var categoryId = this.view.AssignCategory.lbxSelectFormat.selectedKey;
            var data = this.view.TransactionsUnCategorized.segTransactions.data;
            var selectedRows = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].lblCheckBox.text === viewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                    selectedRows.push({
                        transactionId: data[i].transactionId,
                        categoryId: categoryId
                    });
                }
            }
            return selectedRows;
        },
        /**
         * disableButton - Disable button
         * @member frmPersonalFinanceManagementController
         * @param {Object} button
         * @returns {void} - None
         * @throws {void} - None
         */
        disableButton: function(button) {
            button.setEnabled(false);
            button.skin = viewConstants.SKINS.LOCATE_BTNSHARESEND;
            button.hoverSkin = viewConstants.SKINS.LOCATE_BTNSHARESEND;
            button.focusSkin = viewConstants.SKINS.LOCATE_BTNSHARESEND;
        },
        /**
         * enableButton - Enable button
         * @member frmPersonalFinanceManagementController
         * @param {Object} button
         * @returns {void} - None
         * @throws {void} - None
         */
        enableButton: function(button) {
            button.setEnabled(true);
            button.skin = viewConstants.SKINS.PFM_BTN_SKIN;
            button.hoverSkin = viewConstants.SKINS.PFM_BTN_SKIN;
            button.focusSkin = viewConstants.SKINS.PFM_BTN_SKIN;
        },
        orientationHandler: null,
        onBreakpointChange: function(width) {
            kony.print('on breakpoint change');
            var scope = this;
            if (this.orientationHandler === null) {
                this.orientationHandler = new OrientationHandler();
            }
            this.orientationHandler.onOrientationChange(this.onBreakpointChange);
            this.view.customheader.onBreakpointChangeComponent(width);
            this.view.CustomPopup.onBreakpointChangeComponent(scope.view.CustomPopup, width);
            this.setupFormOnTouchEnd(width);
            var self = this;
            var views;
            var responsiveFonts = new ResponsiveFonts();
            if (width === 640) {
                this.view.flexCategorizedMonthlySpending.height = "1400dp";
                views = Object.keys(this.responsiveViews);
                views.forEach(function(e) {
                    self.view[e].isVisible = self.responsiveViews[e];
                });
                this.view.flxBulkUpdate.isVisible = true;
                this.view.customheader.flxHamburgerBack.height = this.view.flxHeader.info.frame.height + this.view.flxContainer.info.frame.height + this.view.flxFooter.info.frame.height + "dp";
                this.view.flxHeader.height = "50dp";
                this.view.customheader.lblHeaderMobileView.isVisible = false;
                this.view.CommonHeader.isVisible = false;
                this.view.CategorizedMonthlySpending.flxTabs.isVisible = true;
                this.view.CategorizedMonthlySpending.flxContainer.skin = viewConstants.SKINS.BLANK_SKIN_FLEX;
                this.view.CategorizedMonthlySpending.flxTransactions.skin = viewConstants.SKINS.BLANK_SKIN_FLEX;
                this.view.customheader.lblHeaderMobile.text = "Personal Finance Management";
                this.view.customheader.lblHeaderMobileView.onTouchEnd = this.showUnCategorizedTransactions;
                this.view.customheader.lblHeaderMobileView.text = "View";
                this.view.customheader.lblHeaderMobileView.height = "25dp";
                this.view.flxContainer.top = "0dp";
                this.view.CategorizedMonthlySpending.CommonHeaderTransactions.isVisible = false;
                this.view.CommonHeaderUncategorized.isVisible = false;
                this.view.TransactionsUnCategorized.flxHeaderUncategorized.isVisible = false;
                this.view.TransactionsUnCategorized.flxSort.isVisible = false;
                this.view.TransactionsUnCategorized.flxSortBulkUpdate.isVisible = false;
                this.view.flxUncategorizedTransactions.skin = ""
                this.view.TransactionsUnCategorized.skin = ""
                this.view.TransactionsUnCategorized.flxNoTransactions.skin = ""
                responsiveFonts.setMobileFonts();
                this.view.CommonHeaderUncategorized.lblHeading.skin = "sknSSP42424215Px";
            } else {
                views = Object.keys(this.responsiveViews);
                views.forEach(function(e) {
                    self.view[e].isVisible = self.responsiveViews[e];
                });
                this.view.flxBulkUpdate.isVisible = false;
                this.view.CategorizedMonthlySpending.flxTabs.isVisible = false;
                this.view.TransactionsUnCategorized.flxNoTransactions.width = "100%";
                this.view.TransactionsUnCategorized.skin = viewConstants.SKINS.PFM_TRANSACTIONSUNCATEGORIZED;
                this.view.customheader.flxHamburgerBack.height = this.view.flxHeader.info.frame.height + this.view.flxContainer.info.frame.height + this.view.flxFooter.info.frame.height + "dp";
                this.view.flxHeader.height = "0dp";
                this.view.CommonHeader.isVisible = true;
                this.view.CategorizedMonthlySpending.CommonHeaderTransactions.isVisible = true;
                this.view.flxContainer.top = "0dp";
                this.view.customheader.lblHeaderMobileView.isVisible = false;
                this.view.customheader.lblHeaderMobile.isVisible = false;
                this.view.TransactionsUnCategorized.flxSort.isVisible = true;
                this.view.TransactionsUnCategorized.flxSortBulkUpdate.isVisible = true;
                responsiveFonts.setDesktopFonts();
                this.view.CommonHeaderUncategorized.lblHeading.skin = "bbSknLbl424242SSP20Px";
				   }
            this.view.breadcrumb.isVisible = false;
            this.view.forceLayout();
            this.AdjustScreen();
            this.view.forceLayout();
        },
        setupFormOnTouchEnd: function(width) {
            if (width == 640) {
                this.view.onTouchEnd = function() {}
                this.nullifyPopupOnTouchStart();
            } else {
                if (width == 1024) {
                    this.view.onTouchEnd = function() {}
                    this.nullifyPopupOnTouchStart();
                } else {
                    this.view.onTouchEnd = function() {
                       // hidePopups();
                    }
                }
                var userAgent = kony.os.deviceInfo().userAgent;
                if (userAgent.indexOf("iPad") != -1) {
                    this.view.onTouchEnd = function() {}
                    this.nullifyPopupOnTouchStart();
                } else if (userAgent.indexOf("Android") != -1 && userAgent.indexOf("Mobile") == -1) {
                    this.view.onTouchEnd = function() {}
                    this.nullifyPopupOnTouchStart();
                }
            }
        },
        nullifyPopupOnTouchStart: function() {},
        CategorizedbtnTransactionsMobile: function() {
            this.view.CategorizedMonthlySpending.flxTabs.isVisible = true;
            this.view.CategorizedMonthlySpending.flxSegmentContainer.isVisible = true;
            this.view.CategorizedMonthlySpending.segTransactions.isVisible = true;
            this.view.CategorizedMonthlySpending.flxNoTransactions.isVisible = false;
            this.view.flxUncategorizedTransactions.isVisible = false;
            this.view.CategorizedMonthlySpending.btnCategorized.skin = viewConstants.SKINS.PFM_CATEGORIZEDMONTHLYSPENDING_BTNUNCATEGORIXED;
            this.view.CategorizedMonthlySpending.btnUnCategorized.skin = viewConstants.SKINS.PFM_CATEGORIZEDMONTHLYSPENDING_BTNCATEGORIZED;
        },
        BackToUnCategorized: function() {
            this.view.flxPFMAssignCategory.setVisibility(false);
            this.view.forceLayout();
            /*this.view.flxPFMAssignCategory.setVisibility(false);
            this.view.flexCategorizedMonthlySpending.isVisible = true;
            this.view.CommonHeaderUncategorized.isVisible = false;
            this.view.flxUncategorizedTransactions.top = "-623dp";
            this.view.TransactionsUnCategorized.flxButtons.isVisible = false;
            this.view.TransactionsUnCategorized.flxHeaderUncategorized.isVisible = false;
            this.showUnCategorizedTransactions();
            this.view.CategorizedMonthlySpending.flxTabs.isVisible = true;
            this.AdjustScreen();
            this.view.forceLayout();
            */
        },
        getPFMPresentationController: function() {
            var PFMModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule('PersonalFinanceManagementUIModule');
            if (PFMModule) {
                return PFMModule.presentationController;
            } else {
                return null;
            }
        },
        responsiveViews: {},
        initializeResponsiveViews: function() {
            this.responsiveViews["flxDowntimeWarning"] = this.isViewVisible("flxDowntimeWarning");
            this.responsiveViews["flxPFMContainers"] = this.isViewVisible("flxPFMContainers");
            this.responsiveViews["flexCategorizedMonthlySpending"] = this.isViewVisible("flexCategorizedMonthlySpending");
            this.responsiveViews["flxUncategorizedTransactions"] = this.isViewVisible("flxUncategorizedTransactions");
            this.responsiveViews["flxPFMAssignCategory"] = this.isViewVisible("flxPFMAssignCategory");
        },
        isViewVisible: function(container) {
            if (this.view[container].isVisible) {
                return true;
            } else {
                return false;
            }
        },
    };
});