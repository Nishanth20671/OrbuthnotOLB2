define("ArrangementsMA/AccountsUIModule/userfrmMortgageAccountDetailsController", ['CommonUtilities', 'ViewConstants', 'FormControllerUtility', 'OLBConstants', 'CampaignUtility'], function(CommonUtilities, ViewConstants, FormControllerUtility, OLBConstants, CampaignUtility) {
    var orientationHandler = new OrientationHandler();
    return {
        plansData: {},
        accountDetails: {},
        isAccountsOpened: true,
        fromScroll: false,
        param: {},
        onNavigate: function() {
            this.view.quicklinks.onError = this.onError;
            this.setQuicklinks();
        },
        updateFormUI: function(uiData) {
            //alert('ok');
            if (uiData) {
                if (uiData.showLoadingIndicator) {
                    if (uiData.showLoadingIndicator.status === true) {
                        FormControllerUtility.showProgressBar(this.view)
                    }
                }
                if (uiData.details) {
                    account1 = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                        "moduleName": "AccountsUIModule",
                        "appName": "ArrangementsMA"
                    }).presentationController.currentAccount;
                    this.setData(uiData.details, account1);
                }
                if (uiData.plans) {
                    this.plans(uiData.plans)
                }
            }
        },
        initFrmAccountDetails: function() {
            var self = this;
            var formatUtil = applicationManager.getFormatUtilManager();
            var OLBConstants = applicationManager.getConfigurationManager().OLBConstants;
            var today = new Date();
            var specialCharactersSet = "~#^|$%&*!@()_-+=}{][/|?><`':;\"\\";
            var alphabetsSet = "abcdefghijklmnopqrstuvwxyz";
            this.view.onBreakpointChange = this.onBreakpointChange;
            // this.loadAccountModule().presentationController.getMortgage();
        },
        loadAccountModule: function() {
            return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AccountsUIModule");
        },
        //Type your controller code here 
        preshowFrmMortgageAccountDetails: function() {
            var scopeObj = this;
            var params = {};
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['flxHeader', 'flxMain', 'flxFooter', "flxAccountTypesAndInfo", "flxPropertyAndTerm", "flxMortgageSummary", "flxMortgageInformation"]);
            //var tokenParams = kony.sdk.getCurrentInstance().tokens[OLBConstants.IDENTITYSERVICENAME].provider_token.params.security_attributes;
            var userPermissionsList = applicationManager.getConfigurationManager().getUserPermissions();
            if(typeof(userPermissionsList)==="string"){
                userPermissionsList = JSON.parse(userPermissionsList);
            }
            var userPermissions = Array.from(userPermissionsList);
            this.view.customheader.forceCloseHamburger();
            params.entitlement = {};
            params.entitlement.features = applicationManager.getConfigurationManager().getUserFeatures();
            params.entitlement.permissions = userPermissions;
            this.param = params;
            this.view.quicklinks.setParentScopeAndEntitlements(this, params.entitlement);
            this.view.quicklinks.onError = this.onError;
            this.view.accountTransactionList.onError = this.onError;
            this.view.customheader.customhamburger.activateMenu("ACCOUNTS", "My Accounts");
            //this.setQuicklinks();
            this.view.lblInfo.toolTip = kony.i18n.getLocalizedString("i18n.mortgage.outstandingDescription");
            this.view.imgInfo.toolTip = kony.i18n.getLocalizedString("i18n.mortgage.outstandingDescription");
            this.view.accountListMenu.isVisible = false;
            mortgageDetails = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountServicesUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.mortgageDetails;
            mortgagePlans = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountServicesUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.mortgagePlans;
            accountList = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountsUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.accountList;
            //this.setData(mortgageDetails, account1);
            this.plans(mortgagePlans, scopeObj);
            width = kony.application.getCurrentBreakpoint();
            this.onBreakpointHandler(width);
            this.setDataForDropDown(accountList);
            this.view.imgAccountTypes.isVisible = true;
            this.view.accountListMenu.isVisible = false;
            scopeObj.view.accountTypes.isVisible = false;
            this.view.flxThree.onTouchEnd = function() {
                scopeObj.view.quicklinks.isVisible = !scopeObj.view.quicklinks.isVisible;
                scopeObj.view.accountList.top = scopeObj.view.accountList.top == "750dp" ? "10dp" : "750dp";
            };
            this.view.flxAccountTypes.onClick = function() {
                scopeObj.view.accountTypes.isVisible = !scopeObj.view.accountTypes.isVisible
            };
            this.view.accountList.flxClosedPlan.onTouchEnd = function() {
                scopeObj.view.accountList.segAccounts.setData(scopeObj.plansData.closedPlansData);
            };
            // this.view.accountList.flxActivePlan.onTouchEnd = function() {
            //     scopeObj.view.accountList.segAccounts.setData(scopeObj.plansData.activePlansData);
            // }
            this.view.accountTypes.segAccountTypes.onRowClick = this.showMortgageFacility.bind(this, this.view.accountTypes.segAccountTypes.selectedRowItems);
            this.view.lblShowIcon.onTouchEnd = function(mortgageDetails) {
                mortgageDetails = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "AccountServicesUIModule",
                    "appName": "ArrangementsMA"
                }).presentationController.mortgageDetails;
                if (scopeObj.view.lblShowIcon.text == 'i') {
                    scopeObj.view.lblShowIcon.text = 'h';
                    scopeObj.view.lblAccountNumberValue.text = mortgageDetails.accountNumber;
                } else {
                    scopeObj.view.lblShowIcon.text = 'i';
                    scopeObj.view.lblAccountNumberValue.text = "****" + mortgageDetails.accountNumber.slice(-4);;
                }
            }
            this.view.lblShowIcon2.onTouchEnd = function(mortgageDetails) {
                mortgageDetails = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "AccountServicesUIModule",
                    "appName": "ArrangementsMA"
                }).presentationController.mortgageDetails;
                if (scopeObj.view.lblShowIcon2.text == 'i') {
                    if (orientationHandler.isDesktop || orientationHandler.isTablet) {
                        if (mortgageDetails.iBAN.length > 20) {
                            scopeObj.view.flxiBan2.isVisible = true;
                            scopeObj.view.lblIBANValue.text = mortgageDetails.iBAN.substr(0, 20);
                            scopeObj.view.lblIBANValue2.text = mortgageDetails.iBAN.substr(20, );
                            scopeObj.view.lblShowIcon2.isVisible = false;
                            scopeObj.view.lblShowIcon3.text = 'h';
                        } else {
                            scopeObj.view.lblIBANValue.text = mortgageDetails.iBAN;
                            scopeObj.view.lblShowIcon2.text = 'h';
                        }
                    } else {
                        scopeObj.view.lblShowIcon2.text = 'h';
                        scopeObj.view.lblIBANValue.text = mortgageDetails.iBAN;
                    }
                } else {
                    scopeObj.view.lblShowIcon2.text = 'i';
                    scopeObj.view.lblIBANValue.text = "****" + mortgageDetails.iBAN.slice(-4);
                }
            }
            this.view.accountTypes.segAccountTypes.onScrolling = function() {
                scopeObj.fromScroll = true;
            };
            scopeObj.checkPermissionForDay();
            this.view.flxImgDropdown.onTouchEnd = function() {
                scopeObj.view.lblDropdown.text = scopeObj.view.lblDropdown.text == 'O' ? 'P' : 'O';
                scopeObj.view.flxUpdateContent.isVisible = !scopeObj.view.flxUpdateContent.isVisible;
            };
            this.view.segUpdate.onRowClick = this.showChangeRepaymentPage.bind(this.view.segUpdate.selectedRowItems);
            scopeObj.view.flxUpdateContent.isVisible = true;
            scopeObj.view.flxUpdateContent.isVisible = false;
           // this.view.flxUpdateFacilityMain.top = "465dp";
            this.view.flxFooter.top = "700dp";
            //this.view.accountList.segAccounts.onRowClick = this.showPlanDetails.bind(this.view.accountList.segAccounts);
            this.view.accountTypes.segAccountTypes.onScrolling = function() {
                scopeObj.fromScroll = true;
            };
            this.view.lblShowIcon3.onTouchEnd = function() {
                mortgageDetails = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "AccountServicesUIModule",
                    "appName": "ArrangementsMA"
                }).presentationController.mortgageDetails;
                scopeObj.view.lblShowIcon2.isVisible = true;
                scopeObj.view.lblShowIcon2.text = 'i';
                scopeObj.view.lblIBANValue.text = "****" + mortgageDetails.iBAN.slice(-4);
                scopeObj.view.flxiBan2.isVisible = false;
            };
          if (orientationHandler.isMobile || kony.application.getCurrentBreakpoint() === 640) {
            this.view.flxUpdateFacilityMain.top = "120dp";
          }
        },
        postShowFrmMortgageAccountDetails: function() {
            applicationManager.getNavigationManager().applyUpdates(this);
            this.view.customheader.forceCloseHamburger();
        },
        checkPermissionForDay: function() {
            var data = [];
            if (this.param.entitlement.permissions.indexOf("CHANGE_REPAYMENT_DAY-VIEW") == "-1" && this.param.entitlement.permissions.indexOf("EARLY_PARTIAL_REPAYMENT-VIEW") == "-1") {
                this.view.flxUpdateFacilityMain.isVisible = false;
                // data = [{
                //     lblAction: 'Remove Co Borrower'
                // }];
            } 
           else if (this.param.entitlement.permissions.indexOf("CHANGE_REPAYMENT_DAY-VIEW") == "-1" || this.param.entitlement.permissions.indexOf("EARLY_PARTIAL_REPAYMENT-VIEW") == "-1") {
                 if(this.param.entitlement.permissions.indexOf("CHANGE_REPAYMENT_DAY-VIEW") == "-1"){
                    data = [{
                        lblUsers: 'Partial Repayment'
                    }];
                 }
                 else{
                    data = [{
                        lblUsers: 'Change Repayment Day'
                    }];
                 }
            }
           else {
                data = [{
                    lblUsers: 'Change Repayment Day'
                },
                {
                    lblUsers: 'Partial Repayment'

                }];
                // {
                //     lblAction: 'Remove Co Borrower'
                // }];
            }
            this.view.segUpdate.setData(data);
        },
        showPartialRepaymentTnCPage: function (sgData) {
            if (sgData.selectedRowItems[0].lblUsers == "Partial Repayment") {
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "AccountsUIModule",
                    "appName": "ArrangementsMA"
                }).presentationController.isFromMortgage = 1;
                kony.application.showLoadingScreen();
                var navMan = applicationManager.getNavigationManager();
                var configManager = applicationManager.getConfigurationManager();
                navMan.navigateTo({
                    "appName": "ArrangementsMA",
                    "friendlyName": "MortgageServicesUIModule/frmPartialRepaymentTermsAndCond"
                });
            }
            kony.application.dismissLoadingScreen();
        },
        setDataForDropDown: function(accountList) {
            var mortgageAccounts = accountList.filter(function(account) {
                return account.accountType == "mortgageFacility"
            })
            var data = []
            mortgageAccounts.forEach(function(account) {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                let a = {
                    lblSeparator: account,
                    lblUsers: account.accountName + "..." + (account.accountID.substr(-4))
                }
                data.push(a);
            })
            this.view.accountTypes.segAccountTypes.setData(data);;
        },
        onBreakpointHandler: function(width) {
            if (orientationHandler.isDesktop) {
                this.view.quicklinks.top = "397px";
                this.view.quicklinks.left = "897px";
                this.view.accountList.left = "6.2%";
                this.view.accountList.top = "397px";
                //this.view.flxUpdateFacilityMain.top = "465dp";
                this.view.flxUpdateFacilityMain.left = "897dp";
            };
            if (orientationHandler.isTablet) {
                this.view.flxUpdateFacilityMain.top = "663dp";
                this.view.flxUpdateFacilityMain.left = "392dp";
                this.view.flxUpdateFacilityMain.width = "352dp";
            }
        },
        setData: function(account, account1) {
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            const today = new Date();
            const yyyy = today.getFullYear();
            let mm = today.getMonth() + 1; // Months start at 0!
            let dd = today.getDate();
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            day = dd + '/' + mm + '/' + yyyy;
            CommonUtilities.setText(this.view.flexRight.lblAsOf, kony.i18n.getLocalizedString("i18n.accounts.AsOf") + " " + day);
            CommonUtilities.setText(this.view.lblAccountTypes, account1.AccountName + "..." + (account1.accountID.substr(-4)), accessibilityConfig);
            this.view.lblOutstandingBalance.text = kony.i18n.getLocalizedString("kony.mb.dashboard.TotalOutstandingBalance");
            this.view.lblBalance.text = CommonUtilities.formatCurrencyWithCommas(account.totalOutstandingBalance, false, account.currency);
            this.view.lblField1.text = kony.i18n.getLocalizedString("i18n.mortgageAccount.CommitmentAmount");
            this.view.lblField1Value.text = CommonUtilities.formatCurrencyWithCommas(account.commitmentAmount, false, account.currency);
            //this.view.lblField1Value.text=account.commitmentAmount;
            this.view.lblField2.text = kony.i18n.getLocalizedString("i18n.mortgageAccount.UtilisedAmount");
            this.view.lblField2Value.text = CommonUtilities.formatCurrencyWithCommas(account.utilisedAmount, false, account.currency) + ' of ' + CommonUtilities.formatCurrencyWithCommas(account.commitmentAmount, false, account.currency);
            this.view.lblField3.text = kony.i18n.getLocalizedString("i18n.mortgageAccount.TotalPaidtoDate");
            this.view.lblField3Value.text = CommonUtilities.formatCurrencyWithCommas(account.totalPaidAmount, false, account.currency);
            //this.view.lblField3Value.text=account.totalPaid;
            this.view.lblField4.text = kony.i18n.getLocalizedString("i18n.mortgageAccount.HomeOwnership");
            this.view.lblField4Value.text = account.homeOwnership + "%";
            this.view.lblPropertyAddress.text = kony.i18n.getLocalizedString("i18n.mortgageAccount.PropertyAddress");
            this.view.lblPropertyAddressValue.text = account.propertyAddress;
            this.view.lblPropertyType.text = kony.i18n.getLocalizedString("i18n.mortgageAccount.PropertyType");
            this.view.lblPropertyTypeValue.text = account.propertyType;
            this.view.lblCommitmentTerm.text = kony.i18n.getLocalizedString("i18n.mortgageAccount.CommitmentTerm");
            this.view.lblCommitmentTermValue.text = account.commitmentTerm;
            this.view.lblEffectiveDate.text = kony.i18n.getLocalizedString("i18n.mortgageAccount.EffectiveDate");
            this.view.lblEffectiveDateValue.text = this.getFormattedDate(account.effectiveDate);
            this.view.lblMaturityDate.text = kony.i18n.getLocalizedString("i18n.mortgageAccount.MaturityDate");
            this.view.lblMaturityDateValue.text = this.getFormattedDate(account.maturityDate);
            this.view.lblAccountNumber.text = kony.i18n.getLocalizedString("i18n.mortgageAccount.AccountNumber");
            this.view.lblAccountNumberValue.text = "****" + account.accountNumber.slice(-4);
            this.view.lblIBAN.text = kony.i18n.getLocalizedString("i18n.WireTransfer.IBAN") + ":";
            this.view.lblIBANValue.text = account.iBAN ? "****" + account.iBAN.slice(-4) : kony.i18n.getLocalizedString("i18n.common.NA");
            this.view.lblShowIcon2.isVisible = true;
            if (kony.sdk.isNullOrUndefined(account.iBAN)) {
                this.view.lblShowIcon2.isVisible = false;
            }
            this.view.segCoBorrower.widgetDataMap = {
                "lblCoBorrower": "lblCoBorrower",
                "lblCoBorrowerValue": "lblCoBorrowerValue"
            };
            var customers = account.ownership;
            customers = JSON.parse(customers);
            var data = [];
            a = customers.filter(function(customer) {
                return customer.customerRole == "OWNER"
            });
            data[0] = {
                'template': (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? "flxCoBorrowerMobile" : "flxCoBorrower",
                lblCoBorrower: "Primary Borrower:",
                lblCoBorrowerValue: a[0].customerName
            }
            b = customers.indexOf(a[0])
            customers.splice(b, 1)
            customers.forEach(function(customer, index) {
                let b = {
                    'template': (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? "flxCoBorrowerMobile" : "flxCoBorrower",
                    lblCoBorrower: "Co-Borrower" + ' ' + String(index + 1) + ':',
                    lblCoBorrowerValue: customer.customerName
                };
                data.push(b);
            });
            this.view.segCoBorrower.setData(data);
            FormControllerUtility.hideProgressBar(this.view);
        },
        setQuicklinks: function() {
            if (orientationHandler.isMobile) {
                var param = [{
                    "linkText": 'View Documents',
                    "linkCTA": {
                        "level": "Form",
                        "method": "actionViewDocument",
                        "context": "",
                        "entitlement": ["VIEW_DOCUMENTS"]
                    },
                    "accessibilityConfig": {},
                    "visibility": true
                }, {
                    "linkText": 'Raise a Request',
                    "linkCTA": {
                        "level": "Form",
                        "method": "actionRaiseARequest",
                        "context": "",
                        "entitlement": ["MESSAGES_CREATE_OR_REPLY"]
                    },
                    "accessibilityConfig": {},
                    "visibility": true
                }, {
                    "linkText": 'Change Repayment Day',
                    "linkCTA": {
                        "level": "Form",
                        "method": "showRepaymentDayForMobile",
                        "context": "",
                        "entitlement": ["CHANGE_REPAYMENT_DAY-VIEW"]
                    },
                    "accessibilityConfig": {},
                    "visibility": true
                },{
                    "linkText": 'Partial Repayment',
                    "linkCTA": {
                        "level": "Form",
                        "method": "showPartialRepaymentForMobile",
                        "context": "",
                        "entitlement": ["EARLY_PARTIAL_REPAYMENT-VIEW"]
                    },
                    "accessibilityConfig": {},
                    "visibility": true
                }];
            } else {
                var param = [{
                    "linkText": 'View Documents',
                    "linkCTA": {
                        "level": "Form",
                        "method": "actionViewDocument",
                        "context": "",
                        "entitlement": ["VIEW_DOCUMENTS"]
                    },
                    "accessibilityConfig": {},
                    "visibility": true
                }, {
                    "linkText": 'Raise a Request',
                    "linkCTA": {
                        "level": "Form",
                        "method": "actionRaiseARequest",
                        "context": "",
                        "entitlement": ["MESSAGES_CREATE_OR_REPLY"]
                    },
                    "accessibilityConfig": {},
                    "visibility": true
                }]
            }
            this.view.quicklinks.setContext(param);
        },
        showPartialRepaymentForMobile: function() {
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountsUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.isFromMortgage = 1;
            kony.application.showLoadingScreen();
            var navMan = applicationManager.getNavigationManager();
            var configManager = applicationManager.getConfigurationManager();
            navMan.navigateTo({
                "appName": "ArrangementsMA",
                "friendlyName": "MortgageServicesUIModule/frmPartialRepaymentTermsAndCond"
            });
            kony.application.dismissLoadingScreen();
        },
        plans: function(mortgagePlans, scopeObj) {
            this.plansData['activePlansData'] = [
                [{
                        CopyimgMenu0a97e7ab1e83140: 'contextual_menu.png',
                        template: (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? "flxTempPlanMobile" : "flxTempPlan",
                        CopyimgThreeDotIcon0eac906fccd3d43: 'O',
                        lblClosedPlans: {
                            text: 'Closed Loans',
                            isVisible: false
                        },
                        lblTransactionHeader: {
                            text: 'Loans',
                            skin: 'sknlbl424242bold15px'
                        },
                        flxActiveSeparator: {
                            isVisible: false
                        },
                        flxClosedSeparator: {
                            isVisible: false
                        }
                    },
                    []
                ]
            ];
            this.plansData['closedPlansData'] = [
                [{
                        CopyimgMenu0a97e7ab1e83140: 'contextual_menu.png',
                        template: (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? "flxTempPlanMobile" : "flxTempPlan",
                        CopyimgThreeDotIcon0eac906fccd3d43: 'O',
                        lblClosedPlans: 'Closed Loans',
                        lblTransactionHeader: {
                            text: 'Active Loans'
                        },
                        flxActiveSeparator: {
                            isVisible: false
                        },
                        flxClosedSeparator: {
                            isVisible: true
                        }
                    },
                    []
                ]
            ];
            scopeObj = this;
            this.view.accountList.segAccounts.widgetDataMap = {
                "lblAccountName": "lblAccountName",
                "lblRoleIcon": "lblRoleIcon",
                "lblFavoriteIcon": "lblFavoriteIcon",
                "imgBankIcon": "imgBankIcon",
                "flxFavorite": "flxFavorite",
                "flxBankIcon": "flxBankIcon",
                "lblBankIcon": "lblBankIcon",
                "lblAccountType": "lblAccountType",
                "lblAvailableBalanceValue": "lblAvailableBalanceValue",
                "lblAvailableBalanceTitle": "lblAvailableBalanceTitle",
                "imgThreeDotIcon": "imgThreeDotIcon",
                "flxMenu": "flxMenu",
                "flxAccountRoleType": "flxAccountRoleType",
                "lblAccountRoleType": "lblAccountRoleType",
                "lblAccountTypeHeader": "lblAccountTypeHeader",
                "flxDropDown": "flxDropDown",
                "lblDropDown": "lblDropDown",
                "lblSeperator": "lblSeperator",
                "lblBottomSeperator": "lblBottomSeperator",
                "lblTopSeperator": "lblTopSeperator",
                "flxAccountsRowWrapper": "flxAccountsRowWrapper",
                "flxNoResultsFound": "flxNoResultsFound",
                "lblNoResultsFound": "lblNoResultsFound",
                "imgNoResultsFound": "imgNoResultsFound",
                "lblTotalAccountsTitle": "lblTotalAccountsTitle",
                "lblTotalAccountsValue": "lblTotalAccountsValue",
                "lblTotalBalanceTitle": "lblTotalBalanceTitle",
                "lblTotalBalanceValue": "lblTotalBalanceValue",
                "flxRowTotalAccountsGroupBalance": "flxRowTotalAccountsGroupBalance",
                "flxRowTotalAccountsGroupBalanceMobile": "flxRowTotalAccountsGroupBalanceMobile",
                "imgExternalAlert": "imgExternalAlert",
                "lblCurrentBalanceValue": "lblCurrentBalanceValue",
                "lblCurrentBalanceTitle": "lblCurrentBalanceTitle",
                "lblAccountTypeNumber": "lblAccountTypeNumber",
                "flxAvailableBalance": "flxAvailableBalance",
                "flxCurrentBalance": "flxCurrentBalance",
                "flxClosedSeparator": "flxClosedSeparator",
                "flxActiveSeparator": "flxActiveSeparator",
                "account": "account",
                "accountType": "accountType",
                "lblTransactionHeader": "lblTransactionHeader",
                "lblClosedPlans": "lblClosedPlans",
                "flxPlansRowWrapperMobile": "flxPlansRowWrapperMobile",
                "flxMenu": "flxMenu",
                "imgThreeDotIcon": "imgThreeDotIcon"
            };
            if (!(mortgagePlans == undefined)) {
                accounts = mortgagePlans;
                var count = 0;
                accounts.forEach(function(account) {
                    account.accountType = "mortgageFacility";
                    if (account.arrangementstatus == "CURRENT") {
                        count += 1;
                        var dataobject = {
                            template: (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? "flxPlansRowTempMobile" : "flxPlansRowTemplate",
                            lblAccountName: {
                                skin: (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? 'ICSknBBLabelSSP42424213px' : 'sknSSP42424215Px',
                                text: account.accountName + "..." + account.accountID.substr(-4)
                            },
                            lblAvailableBalanceTitle: kony.i18n.getLocalizedString("i18n.accounts.RemainingBalance"),
                            lblAvailableBalanceValue: CommonUtilities.formatCurrencyWithCommas(account.commitmentAmount, false, account.currency),
                            flxCurrentBalance: {
                                "isVisible": true
                            },
                            flxFavorite: {
                                isVisible: false
                            },
                            lblCurrentBalanceValue: {
                                skin: (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? 'ICSknBBLabelSSP42424213px' : 'sknlbl424242SSPReg24px',
                                text: CommonUtilities.formatCurrencyWithCommas(account.utilisedAmount, false, account.currency),
                                isVisible: true
                            },
                            lblCurrentBalanceTitle: {
                                text: kony.i18n.getLocalizedString("i18n.mortgageAccount.UtilisedAmount"),
                                isVisible: true
                            },
                            lblSeperator: {
                                "isVisible": true
                            },
                            lblFavoriteIcon: {
                                isVisible: false
                            },
                            lblAccountType: "Mortgage",
                            flxMenu: {
                                isVisible: false
                            },
                            flxPlansRowWrapperMobile: {
                                "height": (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? "100dp" : "78dp"
                            },
                            flxMenu: {
                                "isVisible": true
                            },
                            imgThreeDotIcon: {
                                "isVisible": true
                            },
                            "onAccountClick": scopeObj.onAccountSelection.bind(scopeObj, account),
                            "onQuickActions": scopeObj.openQuickActions.bind(scopeObj, account),
                            'account': account
                                //"onAccountClick": scopeObj.showPlanDetails.bind(scopeObj,account)
                        }
                        scopeObj.plansData.activePlansData[0][1].push(dataobject);
                    } else {
                        dataobject = {
                            template: (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? "flxPlansRowTempMobile" : "flxPlansRowTemplate",
                            lblAccountName: {
                                skin: (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? 'ICSknBBLabelSSP42424213px' : 'sknSSP42424215Px',
                                text: account.accountName + "..." + account.accountNumber.substr(-4)
                            },
                            lblAvailableBalanceTitle: kony.i18n.getLocalizedString("i18n.accounts.RemainingBalance"),
                            lblAvailableBalanceValue: CommonUtilities.formatCurrencyWithCommas(account.commitmentAmount, false, account.currency),
                            flxCurrentBalance: {
                                "isVisible": false
                            },
                            flxFavorite: {
                                isVisible: false
                            },
                            lblCurrentBalanceValue: CommonUtilities.formatCurrencyWithCommas(account.utilisedAmount, false, account.currency),
                            lblCurrentBalanceTitle: kony.i18n.getLocalizedString("i18n.mortgageAccount.UtilisedAmount"),
                            lblSeperator: {
                                "isVisible": true
                            },
                            lblFavoriteIcon: {
                                isVisible: false
                            },
                            lblAccountType: "Mortgage Plan",
                            flxMenu: {
                                isVisible: false
                            },
                            flxPlansRowWrapperMobile: {
                                "height": "78dp"
                            },
                            'account': account
                                //"onAccountClick": scopeObj.showPlanDetails.bind(scopeObj, account)
                        }
                        scopeObj.plansData.closedPlansData[0][1].push(dataobject);
                    }
                    return this.plansData;
                });
                if (orientationHandler.isDesktop) {
                    if (count === 1) {
                        this.view.flxFooter.top = 624 + count * 50 + "dp";
                    } else {
                        this.view.flxFooter.top = 574 + count * 50 + "dp";
                    }
                }
                if (kony.application.getCurrentBreakpoint() === 1024) {
                    this.view.flxFooter.top = 900 + count * 50 + "dp";
                }
                if (orientationHandler.isMobile || kony.application.getCurrentBreakpoint() === 640) {
                  this.view.flxFooter.top = 1150 + count * 50 + "dp";
                }
                this.view.accountList.segAccounts.setData(scopeObj.plansData.activePlansData);
                FormControllerUtility.hideProgressBar(this.view);
            }
        },
        actionFAQ: function() {
            if (applicationManager.getConfigurationManager().isMicroAppPresent("AboutUsMA")) {
                var InformationContentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "appName": "AboutUsMA",
                    "moduleName": "InformationContentUIModule"
                });
                InformationContentModule.presentationController.showFAQs();
            }
        },
        actionViewDocument: function() {
            this.accountDetails.formattedAccountNumber = this.view.lblAccountTypes.text;
            FormControllerUtility.showProgressBar(this.view);
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                moduleName: "AccountServicesUIModule",
                appName: "ArrangementsMA"
            }).presentationController.setFormData(this.accountDetails);
        },
        actionRaiseARequest: function() {
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                moduleName: "AlertsMsgsUIModule",
                appName: "SecureMessageMA"
            }).presentationController.showAlertsPage("hamburgerMenu", {
                show: "Messages"
            });
        },
        showMortgageFacility: function(dummy, segData) {
            account = segData.selectedRowItems[0].lblSeparator;
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountsUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.showMortgageDetails(account);
        },
        onAccountSelection: function(account) {
            var navMan = applicationManager.getNavigationManager();
            navMan.setCustomInfo("mortgageLoanDetails", account.utilisedAmount);
            FormControllerUtility.showProgressBar(this.view);
            if (applicationManager.getConfigurationManager().isMicroAppPresent("ArrangementsMA")) {
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "AccountsUIModule",
                    "appName": "ArrangementsMA"
                }).presentationController.showAccountDetails(account);
            } else {
                FormControllerUtility.hideProgressBar(this.view);
            }
        },
        openQuickActions: function(account) {
            scopeObj = this;
            a = [{
                "lblUsers": {
                    "text": "Change Repayment Account",
                    "toolTip": "Change Repayment Account",
                    "accessibilityconfig": {
                        "a11yLabel": "Change Repayment Account"
                    }
                },
                "lblSeparator": "lblSeparator",
                "flxAccountTypes": {
                    "onTouchEnd": scopeObj.changeAccount.bind(a, account)
                }
            }, {
                "lblUsers": {
                    "text": "Partial Repayment",
                    "toolTip": "Partial Repayment",
                    "accessibilityconfig": {
                        "a11yLabel": "Partial Repayment"
                    }
                },
                "lblSeparator": "lblSeparator",
                "flxAccountTypes": {
                    "onTouchEnd": scopeObj.partialRepayment.bind(a, account)
                }
            }];
            if (this.param.entitlement.permissions.indexOf("CHANGE_REPAYMENT_ACCOUNT-VIEW") == "-1" && this.param.entitlement.permissions.indexOf("EARLY_PARTIAL_REPAYMENT-VIEW") == "-1") {
                this.view.accountListMenu.flxAccountListActionsSegment.isVisible = false;
            }
            else if (this.param.entitlement.permissions.indexOf("EARLY_PARTIAL_REPAYMENT-VIEW") == "-1") {
                a = [a[0]];
            }
            else if (this.param.entitlement.permissions.indexOf("CHANGE_REPAYMENT_ACCOUNT-VIEW") == "-1") {
                a = [a[1]];
            }
            this.view.accountListMenu.segAccountListActions.setData(a);
        },
        changeAccount: function(account, a) {
            var navMan = applicationManager.getNavigationManager();
            var configManager = applicationManager.getConfigurationManager();
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountServicesUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.repaymentAccount = account;
            navMan.navigateTo({
                "appName": "ArrangementsMA",
                "friendlyName": "MortgageServicesUIModule/frmChangeRepaymentAccountNew"
            });
        },
        partialRepayment: function(account, a){
            var navMan = applicationManager.getNavigationManager();
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountServicesUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.repaymentAccount = account;
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountsUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.isFromMortgage = 0;
            navMan.navigateTo({
                "appName": "ArrangementsMA",
                "friendlyName": "MortgageServicesUIModule/frmPartialRepaymentTermsAndCond"
            });
        },
        showRepaymentDayForMobile: function() {
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountsUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.isFromMortgage = 1;
            kony.application.showLoadingScreen();
            var navMan = applicationManager.getNavigationManager();
            var configManager = applicationManager.getConfigurationManager();
            navMan.navigateTo({
                "appName": "ArrangementsMA",
                "friendlyName": "AccountsUIModule/frmChangeRepaymentDay"
            });
        },
        showChangeRepaymentPage: function(sgData) {
            if (sgData.selectedRowItems[0].lblUsers == "Change Repayment Day") {
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "AccountsUIModule",
                    "appName": "ArrangementsMA"
                }).presentationController.isFromMortgage = 1;
                kony.application.showLoadingScreen();
                var navMan = applicationManager.getNavigationManager();
                var configManager = applicationManager.getConfigurationManager();
                navMan.navigateTo({
                    "appName": "ArrangementsMA",
                    "friendlyName": "AccountsUIModule/frmChangeRepaymentDay"
                });
            } else {
                this.showPartialRepaymentTnCPage(sgData);
            }
        },
        showPlanDetails: function(segData) {
            account = segData.selectedRowItems[0].account;
            var navMan = applicationManager.getNavigationManager();
            navMan.setCustomInfo("mortgageLoanDetails", account.utilisedAmount);
            FormControllerUtility.showProgressBar(this.view);
            if (applicationManager.getConfigurationManager().isMicroAppPresent("ArrangementsMA")) {
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "AccountsUIModule",
                    "appName": "ArrangementsMA"
                }).presentationController.showAccountDetails(account);
            } else {
                FormControllerUtility.hideProgressBar(this.view);
            }
        },
        onBreakpointChange: function() {
            this.FormTouchEnd();
            mortgageDetails = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountServicesUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.mortgageDetails;
            mortgagePlans = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountServicesUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.mortgagePlans;
            if (!(mortgagePlans == undefined)) this.plans(mortgagePlans);
            account1 = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountsUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.currentAccount;
            if (!(mortgagePlans == undefined)) this.setData(mortgageDetails, account1);
        },
        FormTouchEnd: function() {
            self = this;
            this.view.onTouchEnd = function() {
                self.hidePopUps();
            };
        },
        hidePopUps: function() {
            self = this;
            if (this.view.accountTypes.isVisible === false && this.isAccountsOpened === true) {
                this.isAccountsOpened = false;
            } else if (this.view.accountTypes.isVisible === true && this.isAccountsOpened === false) {
                setTimeout(function() {
                    if (!self.fromScroll) {
                        self.view.accountTypes.isVisible = false;
                        self.isAccountsOpened = true;
                    }
                    self.fromScroll = false;
                }, "17ms");
            }
        },
        getFormattedDate: function(date) {
            if (date.indexOf("-") == "-1") {
                var newDate = date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2);
                return CommonUtilities.getFrontendDateString(newDate);
            } else {
                return CommonUtilities.getFrontendDateString(date);
            }
        },
        showServerError: function(status) {},
        onError: function() {
            FormControllerUtility.hideProgressBar(this.view);
        }
    };
});