/**
 * Description of Module representing a Confirm form.
 * @module frmMakeOneTimePayeeController
 */
define(['CommonUtilities', 'OLBConstants', 'ViewConstants', 'FormControllerUtility', 'CampaignUtility'], function(CommonUtilities, OLBConstants, ViewConstants, FormControllerUtility, CampaignUtility) {
     
    var orientationHandler = new OrientationHandler();

    return /** @alias module:frmMakeOneTimePayeeController */ {
        profileAccess: "",
        init: function() {
            var scopeObj = this;
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = this.onBreakpointChange;
            this.presenter = applicationManager.getModulesPresentationController({ 'appName': 'BillPayMA', 'moduleName': 'BillPaymentUIModule' });
            this.initActions();
        },
        preShow: function() {
            this.profileAccess = applicationManager.getUserPreferencesManager().profileAccess;
            this.view.customheadernew.activateMenu("Bill Pay", "Make One Time Payment");
            CampaignUtility.fetchPopupCampaigns();
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['flxHeader', 'flxFooter', 'flxMain']);
            this.view.btnNext.toolTip = kony.i18n.getLocalizedString("i18n.common.next");
            this.view.btnCancel.toolTip = kony.i18n.getLocalizedString("i18n.konybb.common.cancel");
        },
        postShow: function() {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
            applicationManager.executeAuthorizationFramework(this);
        },

        /**
         * used perform the initialize activities.
         *
         */
        initActions: function() {
            this.view.btnNext.onClick = this.goToSerchedBillerDetails.bind(this);
            this.view.btnCancel.onClick = this.goToPreviousForm.bind(this);
            this.view.flxBillPayActivities.onClick = function() {
                this.presenter.showBillPaymentScreen({
                    context: "History",
                    loadBills: true
                })
            }.bind(this);
            if (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) {
                this.view.tbxName.placeholder = kony.i18n.getLocalizedString("i18n.BillPay.SearchforPayee");
                this.view.txtAccountNumber.placeholder = kony.i18n.getLocalizedString("i18n.addPayee.RelationshipNumberPlaceholder");
            } else {
                this.view.tbxName.placeholder = kony.i18n.getLocalizedString("i18n.BillPay.SearchforPayeebyCompanyNameExATTorComcast");
                this.view.txtAccountNumber.placeholder = kony.i18n.getLocalizedString("i18n.AddPayee.EnterAccountNumberasit");
            }
        },

        onBreakpointChange: function(form, width) {
            var scopeObj = this;
            FormControllerUtility.setupFormOnTouchEnd(width);
            
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
            this.view.CustomPopupLogout.onBreakpointChangeComponent(scopeObj.view.CustomPopupLogout, width);
            this.view.CustomPopupCancel.onBreakpointChangeComponent(scopeObj.view.CustomPopupCancel, width);
        },

        /** @alias module:frmMakeOneTimePayeeController */
        /** updates the present Form based on required function.
         * @param {list} uiDataMap used to load a view
         */
        updateFormUI: function(uiDataMap) {
            if (uiDataMap.isLoading) {
                FormControllerUtility.showProgressBar(this.view);
            } else {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (uiDataMap.initOneTimePayee) {
                this.callbackModelConfig = uiDataMap.callbackModelConfig;
                this.initOneTimePayee();
            }
            if (uiDataMap.registeredPayeeList) {
                this.updateRegisteredPayees(uiDataMap.registeredPayeeList);
            }
            if (uiDataMap.billersList) {
                this.showPayeeList(uiDataMap.billersList);
            }
            if (uiDataMap.billerDetails) {
                this.selectPayeeName(uiDataMap.billerDetails);
            }
            if (uiDataMap.isInvalidPayee) {
                this.enterCorrectBillerName();
            }
            if (uiDataMap.errorInAddingPayee) {
                this.showAddPayeeErrorMessage(uiDataMap.errorInAddingPayee);
            }
            if (uiDataMap.serverError) {
                this.view.rtxDowntimeWarning.text = uiDataMap.serverError;
                this.view.flxDowntimeWarning.setVisibility(true);
                this.view.flxFormContent.forceLayout();
            }
            if (uiDataMap.campaign) {
                CampaignUtility.showCampaign(uiDataMap.campaign, this.view, "flxMain");
            }
        },

        /**
         * higlightBoxes
         */
        higlightBoxes: function() {
            for (var i = 0; i < arguments.length; i++) {
                arguments[i].skin = 'sknTbxSSPffffff15PxBorderFF0000opa50';
            }
        },
        /**
         * normalizeBoxes
         */
        normalizeBoxes: function() {
            for (var i = 0; i < arguments.length; i++) {
                arguments[i].skin = ViewConstants.SKINS.SKNTBXLAT0FFFFFF15PXBORDER727272OPA20;
            }
        },
        /**
         * used to show the payee
         * @param {list} payeeList list of payees
         */
        showPayeeList: function(payeeList) {
            this.view.segPayeesName.widgetDataMap = {
                "flxNewPayees": "flxNewPayees",
                "lblNewPayees": "lblNewPayees"
            };
            if (payeeList.length > 0) {
                this.view.segPayeesName.setData(this.createNewPayeeModel(payeeList));
                this.view.flxPayeeList.isVisible = true;
                this.view.forceLayout();
            } else {
                this.view.flxPayeeList.isVisible = false;
                this.view.forceLayout();
            }

        },
        /**
         * used to navigate the previous form (On click on Cancel)
         */
        goToPreviousForm: function () {
            if (kony.application.getPreviousForm().id !== "frmMakeOneTimePayment" && this.callbackModelConfig) {
                kony.mvc.getNavigationManager().navigate({
                    context: this,
                    callbackModelConfig: this.callbackModelConfig
                });
            } else {
                this.presenter.showBillPaymentScreen({
                    context: "BulkPayees"
                });
            }
        },
        /**
         * used to navigate the history tab(On click on RightBar)
         */
        navigateToBillPayHistoryTab: function() {
            var scopeObj = this;
            scopeObj.presenter.showBillPaymentScreen({
                context: "History",
                loadBills: true
            });
        },
        /**
         * used to create the new payee
         *  @param {list} billerList list of billers
         * @returns {object} list of billers
         */
        createNewPayeeModel: function(billerList) {
            return billerList.map(function(biller) {
                return {
                    "lblNewPayees":{
                        "text": biller.billerName,
                        "skin": "ICSknLbl42424215PX"
                    },
                    "flxNewPayees": {
                        "onClick": biller.onBillerSelection
                    }
                };
            }).reduce(function(p, e) {
                return p.concat(e);
            }, []);
        },

        /**
         * one time payment payee initialise screen
         */
        initOneTimePayee: function() {
            this.initializePayeeInformation();
            this.registerWidgetActions();
            this.resetPayeeInformation();
            this.accountNumberAvailable = true;
        },
        /**
         * used to initilize the payee information
         */
        initializePayeeInformation: function() {
            FormControllerUtility.disableButton(this.view.btnNext);
        },
        /**
         * used to register the widget actions
         */
        registerWidgetActions: function() {
            var scopeObj = this;
            [this.view.txtZipCode, this.view.txtAccountNumber, this.view.txtAccountNumberAgain, this.view.txtmobilenumber].forEach(function(element) {
                element.onKeyUp = scopeObj.checkIfAllSearchFieldsAreFilled;
                element.text = "";
            });
            this.view.tbxName.onKeyUp = CommonUtilities.debounce(scopeObj.callOnKeyUp.bind(scopeObj), OLBConstants.FUNCTION_WAIT, false);
        },
        /**
         * used to validates the on key up information
         */
        callOnKeyUp: function() {
            var scopeObj = this;
            scopeObj.presenter.fetchBillerListForOneTimePayment(this.view.tbxName.text);
            this.checkIfAllSearchFieldsAreFilled();
        },
        /**
         * used to validates the all payee search fields
         */
        checkIfAllSearchFieldsAreFilled: function() {
            var validationUtilityManager = applicationManager.getValidationUtilManager();
            if (this.view.txtmobilenumber.isVisible === true) {
                if (this.view.tbxName.text.trim() && this.view.txtZipCode.text.trim() && this.view.txtAccountNumber.text.trim() && this.view.txtAccountNumberAgain.text.trim() && (this.view.txtmobilenumber.text.trim() && validationUtilityManager.phoneNumberRegex.test(this.view.txtmobilenumber.text.trim()))) {
                    FormControllerUtility.enableButton(this.view.btnNext);
                } else {
                    FormControllerUtility.disableButton(this.view.btnNext);
                }
            } else {
                if (this.view.tbxName.text.trim() && this.view.txtZipCode.text.trim() && this.view.txtAccountNumber.text.trim() && this.view.txtAccountNumberAgain.text.trim()) {
                    FormControllerUtility.enableButton(this.view.btnNext);
                } else {
                    FormControllerUtility.disableButton(this.view.btnNext);
                }
            }
        },
        /**
         * used to set the payee widget Map
         * @param {list} registeredPayees list of payees
         */
        updateRegisteredPayees: function(registeredPayees) {
            this.view.segRegisteredPayees.widgetDataMap = {
                "flxRegistered": "flxRegistered",
                "lblCustomer": "lblCustomer",
                "lblAmount": "lblAmount",
                "lblDate": "lblDate",
                "btnViewDetails": "btnViewDetails",
                "btnPayBills": "btnPayBills",
                "lblHorizontalLine": "lblHorizontalLine",
                "lblIcon": "lblIcon",
                "flxIcon": "flxIcon"
            };
            if (registeredPayees.length === 0) {
                this.view.flxRegisteredPayees.setVisibility(false);
            } else {
                const regPayeeFlexHeight = registeredPayees.length * 120 + 50;
                this.view.flxRegisteredPayees.height = regPayeeFlexHeight > 537 ? "537dp" : regPayeeFlexHeight + "dp";
                this.view.flxRegisteredPayees.setVisibility(true);
                this.view.segRegisteredPayees.setData(this.createRegisteredPayeesSegmentModel(registeredPayees));
            }
            this.view.forceLayout();
        },
        /**
         * used to show the  list of all payees
         * @param {list} payees list of payees
         * @returns {object} payees object
         */
        createRegisteredPayeesSegmentModel: function(payees) {
            return payees.map(function(payee) {
                return {
                    "lblCustomer": payee.payeeName,
                    "lblHorizontalLine": "A",
                    "lblDate": CommonUtilities.getFrontendDateString(payee.lastPaidDate),
                    "lblAmount": CommonUtilities.formatCurrencyWithCommas(payee.lastPaidAmount),
                    "btnViewDetails": {
                        text: kony.i18n.getLocalizedString("i18n.common.ViewDetails"),
                        isVisible: applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_VIEW_PAYEES"),
                        onClick: payee.onViewDetailsClick
                    },
                    "btnPayBills": {
                        text: kony.i18n.getLocalizedString("i18n.Pay.PayBills"),
                        isVisible: applicationManager.getConfigurationManager().checkUserPermission("BILL_PAY_CREATE"),
                        onClick: payee.onPayBillsClick
                    },
                    "lblIcon": {
                        isVisible: this.profileAccess === "both" ? true : false,
                        //isVisible: applicationManager.getConfigurationManager().isCombinedUser === "true" ? true : false,
                        text: payee.isBusinessPayee === "1" ? "r" : "s"
                    },
                    "flxIcon": {
                        isVisible: false, //this.profileAccess === "both" ? true : false
                        //isVisible : applicationManager.getConfigurationManager().isCombinedUser === "true" ? true : false
                    }
                };
            }).reduce(function(p, e) {
                return p.concat(e);
            }, []);
        },
        /**
         * used to select the payee name
         * @param {object} viewModel object
         */
        selectPayeeName: function(viewModel) {
            this.view.tbxName.text = viewModel.billerName;
            this.view.flxPayeeList.isVisible = false
            this.setDynamicFields(viewModel.billerCategoryName);
            this.checkIfAllSearchFieldsAreFilled();
            this.view.forceLayout();
        },
        /**
         * used to set the payee data dynamicllay
         * @param {object} billerCategory billerCategory
         */
        setDynamicFields: function(billerCategory) {
            if (billerCategory == 'Credit Card' || billerCategory == 'Utilities') {
                this.doDynamicChangesAccordingToCategory(kony.i18n.getLocalizedString("i18n.common.accountNumber"),
                    kony.i18n.getLocalizedString("i18n.common.AccountNumberPlaceholder"), {
                        'fieldHolds': 'AccountNumber'
                    },
                    kony.i18n.getLocalizedString("i18n.addPayee.ConfirmRelationshipNumber"),
                    kony.i18n.getLocalizedString("i18n.addPayee.ConfirmRelationshipNumber")
                );
            } else if (billerCategory == 'Phone') {
                this.doDynamicChangesAccordingToCategory(kony.i18n.getLocalizedString("i18n.common.accountNumber"),
                    kony.i18n.getLocalizedString("i18n.addPayee.RelationshipNumberPlaceholder"), {
                        'fieldHolds': 'RelationshipNumber'
                    },
                    kony.i18n.getLocalizedString("i18n.addPayee.ConfirmRelationshipNumber"),
                    kony.i18n.getLocalizedString("i18n.addPayee.ConfirmRelationshipNumber"),
                    kony.i18n.getLocalizedString("i18n.common.MobilePhone"),
                    kony.i18n.getLocalizedString("i18n.common.MobilePhonePlaceholder"), {
                        'fieldHolds': 'MobileNumber'
                    });
            } else if (billerCategory == 'Insurance') {
                this.doDynamicChangesAccordingToCategory(kony.i18n.getLocalizedString("i18n.common.accountNumber"),
                    kony.i18n.getLocalizedString("i18n.common.AccountNumberPlaceholder"), {
                        'fieldHolds': 'AccountNumber'
                    },
                    kony.i18n.getLocalizedString("i18n.addPayee.ConfirmRelationshipNumber"),
                    kony.i18n.getLocalizedString("i18n.addPayee.ConfirmRelationshipNumber"),
                    kony.i18n.getLocalizedString("i18n.addPayee.PolicyNumber"),
                    kony.i18n.getLocalizedString("i18n.addPayee.PolicyNumberPlaceholder"), {
                        'fieldHolds': 'PolicyNumber'
                    });
            }
        },
        /**
         * used to change the fields according to category.
         * @param {string} displaylabel1 label information
         * @param {string} placeholder1  place holder information
         * @param {string} info1 description
         * @param {string} displaylabel2 label information
         * @param {string} placeholder2  place holder information
         * @param {string} displaylabel3 label information
         * @param {string} placeholder3  place holder information
         * @param {string} info3 description
         */
        doDynamicChangesAccordingToCategory: function(displaylabel1, placeholder1, info1, displaylabel2, placeholder2, displaylabel3, placeholder3, info3) {
            CommonUtilities.setText(this.view.lblAccountNumber, displaylabel1, CommonUtilities.getaccessibilityConfig());
            //this.view.txtAccountNumber.placeholder = placeholder1;
            this.view.txtAccountNumber.info = info1;
            CommonUtilities.setText(this.view.lblAccountNumberAgain, displaylabel2, CommonUtilities.getaccessibilityConfig());
            this.view.txtAccountNumberAgain.placeholder = placeholder2;
            if (displaylabel3 !== undefined && placeholder3 !== undefined && info3 !== undefined) {
                CommonUtilities.setText(this.view.lblmobilenumeber, displaylabel3, CommonUtilities.getaccessibilityConfig());
                this.view.txtmobilenumber.placeholder = placeholder3;
                this.view.txtmobilenumber.info = info3;
                this.view.lblmobilenumeber.isVisible = true;
                this.view.txtmobilenumber.isVisible = true;
                this.view.flxmobilenumber.isVisible = true;
            } else {
                this.view.lblmobilenumeber.isVisible = false;
                this.view.txtmobilenumber.isVisible = false;
                this.view.flxmobilenumber.isVisible = false;
            }

        },
        /**
         * reset the payee information Onclick of Reset Button
         */
        resetPayeeInformation: function() {
            this.view.lblNotMatching.isVisible = false;
            this.view.flxMisMatch.isVisible = false;
            this.view.tbxName.text = "";
            this.view.txtZipCode.text = "";
            this.view.txtAccountNumber.text = "";
            this.view.txtAccountNumberAgain.text = "";
            this.view.txtmobilenumber.text = "";
            this.normalizeBoxes(this.view.txtAccountNumber, this.view.txtAccountNumberAgain);
            FormControllerUtility.disableButton(this.view.btnNext);
            this.view.forceLayout();
        },

        /**
         * used to search the biller details(Onclick of btnNext)
         */
        goToSerchedBillerDetails: function() {
            var manuallyAddedPayee = {};
            this.view.flxMisMatch.isVisible = false;
            if (this.handleErrorInBillerSearch()) {
                manuallyAddedPayee.isManualUpdate = false;
                this.view.flxPayeeList.isVisible = false;
                if (this.view.txtAccountNumber.info.fieldHolds === 'AccountNumber') {
                    manuallyAddedPayee.accountNumber = this.view.txtAccountNumber.text;
                    if (this.view.txtmobilenumber.isVisible) {
                        if (this.view.txtmobilenumber.info.fieldHolds === 'PolicyNumber') {
                            manuallyAddedPayee.policyNumber = this.view.txtmobilenumber.text;
                        }
                    }
                } else if (this.view.txtAccountNumber.info.fieldHolds === 'RelationshipNumber') {
                    manuallyAddedPayee.relationShipNumber = this.view.txtAccountNumber.text;
                    manuallyAddedPayee.mobileNumber = this.view.txtmobilenumber.text;
                }
                manuallyAddedPayee.billerName = this.view.tbxName.text;
                manuallyAddedPayee.zipCode = this.view.txtZipCode.text;
                this.presenter.navigateToOneTimePayment(manuallyAddedPayee);
            }
        },
        /**
         * used to handle the error schenarion in biller search
         * @returns {boolean} status
         */
        handleErrorInBillerSearch: function() {
            var response = this.validateSearchedPayeeDetails();
            if (response === 'VALIDATION_SUCCESS') {
                this.normalizeBoxes(this.view.txtAccountNumber, this.view.txtAccountNumberAgain);
                this.view.lblNotMatching.isVisible = false;
                return true;
            } else if (response === 'IDENTITY_NUMBER_MISMATCH') {
                if (this.view.txtAccountNumber.info.fieldHolds === 'AccountNumber') {
                    CommonUtilities.setText(this.view.lblNotMatching, kony.i18n.getLocalizedString("i18n.addPayee.AccountNumberMismatch"), CommonUtilities.getaccessibilityConfig());
                } else if (this.view.txtAccountNumber.info.fieldHolds === 'RelationshipNumber') {
                    CommonUtilities.setText(this.view.lblNotMatching, kony.i18n.getLocalizedString("i18n.addPayee.RelationshipNumberMismatch"), CommonUtilities.getaccessibilityConfig());
                }
                this.view.flxMisMatch.isVisible = false;
                this.view.lblNotMatching.isVisible = true;
                FormControllerUtility.disableButton(this.view.btnNext);
                this.higlightBoxes(this.view.txtAccountNumber, this.view.txtAccountNumberAgain);
                this.view.forceLayout();
                return false;
            } else if (response === 'NO_BILLER_SELECTED_FROM_LIST') {
                CommonUtilities.setText(this.view.lblNotMatching, kony.i18n.getLocalizedString("i18n.addPayee.SelectBiller"), CommonUtilities.getaccessibilityConfig());
                this.view.flxMisMatch.isVisible = false;
                this.view.lblNotMatching.isVisible = true;
                FormControllerUtility.disableButton(this.view.btnNext);
                this.view.forceLayout();
                return false;
            }
        },
        /**
         * used to validate the payee details
         * @returns {string} status of payee validation
         */
        validateSearchedPayeeDetails: function() {
            var identityNumber = this.view.txtAccountNumber.text;
            var duplicateIdentityNumber = this.view.txtAccountNumberAgain.text;
            if (this.view.txtAccountNumber.info === undefined) {
                return 'NO_BILLER_SELECTED_FROM_LIST';
            } else {
                if (identityNumber === duplicateIdentityNumber) {
                    return 'VALIDATION_SUCCESS';
                } else {
                    return 'IDENTITY_NUMBER_MISMATCH';
                }
            }
        },
        /**
         * validate  the biller Name
         */
        enterCorrectBillerName: function() {
            this.view.rtxMisMatch.text = kony.i18n.getLocalizedString("i18n.addPayee.SelectBiller");
            this.view.lblNotMatching.isVisible = false;
            this.view.flxMisMatch.isVisible = true;
            FormControllerUtility.disableButton(this.view.btnNext);
            this.view.forceLayout();
        },
        /**
         * used to show the add payee error message
         * @param {string} msg error message
         */
        showAddPayeeErrorMessage: function(msg) {
            this.view.rtxMisMatch.text = msg;
            this.view.flxMisMatch.isVisible = true;
        },
        /**
         * used to show the permission based UI
         */
        showHistoryOption: function() {
            this.view.flxBillPayActivities.setVisibility(true);
        },

        /**
         * used to hide the permission based UI
         */
        hideHistoryOption: function() {
            this.view.flxBillPayActivities.setVisibility(false);
        }
    };
});