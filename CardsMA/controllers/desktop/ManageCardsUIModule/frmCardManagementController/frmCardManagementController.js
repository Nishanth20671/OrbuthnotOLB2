define(['CommonUtilities', 'CommonUtilities', 'OLBConstants', 'ViewConstants', 'FormControllerUtility', 'CampaignUtility'], function(CommonUtilities, CommonUtilities2, OLBConstants, ViewConstants, FormControllerUtility, CampaignUtility) {
    var orientationHandler = new OrientationHandler();
    var searchSeg = true;
    return {
        /**
         * Globals for storing travel-notification,card-image, status-skin mappings.
         */
        notificationObject: {},
        cardImages: {},
        countries: {},
        states: {},
        cities: {},
        selectedCountry: {},
        statusSkinsLandingScreen: {},
        statusSkinsDetailsScreen: {},
        travelNotificationDataMap: {},
        actionPermissionMap: {},
        campaigns: [],
        travelPlanDestinationList:{},
        profileAccess: "",
        /**
         * Form lifecycle method.
         */
        formPreShowFunction: function() {
            var scopeObj = this;
            this.profileAccess = applicationManager.getUserPreferencesManager().profileAccess;
            FormControllerUtility.updateWidgetsHeightInInfo(this, ['flxContainer', 'customheader', 'flxFooter', 'flxHeader', 'flxMain', 'btnfindCVV', 'flxCardCVV', 'flxActivateContent', 'flxCVVPopup','flxFormContent']);
            this.view.onBreakpointChange = function() {
                scopeObj.onBreakpointChange(kony.application.getCurrentBreakpoint());
            };
            //this.onBreakpointChange(kony.application.getCurrentBreakpoint());
            this.view.customheader.forceCloseHamburger();
            this.initializeCards();
            this.updateHamburgerMenu();
            applicationManager.getLoggerManager().setCustomMetrics(this, false, "Cards");
            this.initRightContainer();
			this.restrictCharactersSet();
            //this.ShowAllCards();
            // this.hideAllCardManagementViews();
            this.setTravelNotificationActions();
            var dateformat = applicationManager.getFormatUtilManager().getDateFormat();
            this.view.calFrom.dateFormat = dateformat;
            this.view.calTo.dateFormat = dateformat;
            CommonUtilities.disableOldDaySelection(this.view.calFrom);
            CommonUtilities.disableOldDaySelection(this.view.calTo);
            this.view.calFrom.hidePreviousNextMonthDates = true;
            this.view.calTo.hidePreviousNextMonthDates = true;
            FormControllerUtility.disableButton(this.view.btnCardsContinue);
            this.view.flxDownload.setVisibility(false); // TODO: implementation in next sprint,currently hidding the view
            this.view.flxMyCardsView.setVisibility(false);
            this.view.flxTermsAndConditions.setVisibility(false);
            this.view.flxMangeTravelPlans.setVisibility(true);
            applicationManager.getNavigationManager().applyUpdates(this);
            this.view.myCards.txtSearch.onKeyUp = this.searchCards;
            this.view.myCards.txtSearch.onTouchStart = this.searchCards;
            this.view.myCards.flxClearBtn.onTouchStart = function() {
                scopeObj.view.myCards.flxClearBtn.setVisibility(false);
                scopeObj.view.myCards.txtSearch.text = "";
                scopeObj.view.myCards.flxSearchSegment.setVisibility(false);
                this.view.myCards.flxAccountName.setVisibility(false);
            };
            this.view.myCards.flxAccountName.setVisibility(false);
            this.view.myCards.segSearch.onRowClick = this.searchSegOnRowClick;
            this.view.myCards.imgCross.onTouchStart = this.ShowAllCards;
            CampaignUtility.fetchPopupCampaigns();
        },

        init: function() {
            FormControllerUtility.setRequestUrlConfig(this.view.brwBodyTnC);
        },

        setTravelNotificationActions: function() {
            this.showContactUsNavigation();
        },
        /**
         * initializeCards - Method to initialize the globals.
         */
        initializeCards: function() {
            this.initializeCardImages();
            this.initializeStatusSkins();
        },
        /**
         * initializeStatusSkins - Method to initialize the status skins in globals.
         */
        initializeStatusSkins: function() {
            this.statusSkinsLandingScreen['Active'] = ViewConstants.SKINS.CARDS_ACTIVE_STATUS_LANDING;
            this.statusSkinsLandingScreen['Locked'] = ViewConstants.SKINS.CARDS_LOCKED_STATUS_LANDING;
            this.statusSkinsLandingScreen['Reported Lost'] = ViewConstants.SKINS.CARDS_REPORTED_LOST_STATUS_LANDING;
            this.statusSkinsLandingScreen['Replace Request Sent'] = ViewConstants.SKINS.CARDS_REPLACE_REQUEST_SENT_STATUS_LANDING;
            this.statusSkinsLandingScreen['Replaced'] = ViewConstants.SKINS.CARDS_REPLACE_REQUEST_SENT_STATUS_LANDING;
            this.statusSkinsLandingScreen['Cancel Request Sent'] = ViewConstants.SKINS.CARDS_CANCEL_REQUEST_SENT_STATUS_LANDING;
            this.statusSkinsLandingScreen['Cancelled'] = ViewConstants.SKINS.CARDS_CANCELLED_STATUS_LANDING;
            this.statusSkinsLandingScreen['Inactive'] = ViewConstants.SKINS.CARDS_INACTIVE_STATUS_LANDING;
            this.statusSkinsDetailsScreen['Active'] = ViewConstants.SKINS.CARDS_ACTIVE_STATUS_DETAILS;
            this.statusSkinsDetailsScreen['Locked'] = ViewConstants.SKINS.CARDS_LOCKED_STATUS_DETAILS;
            this.statusSkinsDetailsScreen['Reported Lost'] = ViewConstants.SKINS.CARDS_REPORTED_LOST_STATUS_DETAILS;
            this.statusSkinsDetailsScreen['Replace Request Sent'] = ViewConstants.SKINS.CARDS_REPLACE_REQUEST_SENT_STATUS_DETAILS;
            this.statusSkinsDetailsScreen['Replaced'] = ViewConstants.SKINS.CARDS_REPLACE_REQUEST_SENT_STATUS_DETAILS;
            this.statusSkinsDetailsScreen['Cancel Request Sent'] = ViewConstants.SKINS.CARDS_CANCEL_REQUEST_SENT_STATUS_DETAILS;
            this.statusSkinsDetailsScreen['Cancelled'] = ViewConstants.SKINS.CARDS_CANCELLED_STATUS_DETAILS;
            this.statusSkinsLandingScreen['Issued'] = ViewConstants.SKINS.CARDS_ISSUED_STATUS_LANDING;
            this.statusSkinsLandingScreen['NearingExpiry'] = ViewConstants.SKINS.CARDS_ACTIVE_STATUS_LANDING;
            this.statusSkinsDetailsScreen['Expired'] = ViewConstants.SKINS.CARDS_LOCKED_STATUS_DETAILS;
        },
        /**
         * initializeCardImages - Method to initialize the card images in globals.
         */
        initializeCardImages: function() {
            this.cardImages['My Platinum Credit Card'] = ViewConstants.IMAGES.PREMIUM_CLUB_CREDITS;
            this.cardImages['Gold Debit Card'] = ViewConstants.IMAGES.GOLDEN_CARDS;
            this.cardImages['Premium Club Credit Card'] = ViewConstants.IMAGES.PLATINUM_CARDS;
            this.cardImages['Shopping Card'] = ViewConstants.IMAGES.SHOPPING_CARDS;
            this.cardImages['Petro Card'] = ViewConstants.IMAGES.PETRO_CARDS;
            this.cardImages['Eazee Food Card'] = ViewConstants.IMAGES.EAZEE_FOOD_CARDS;
            this.cardImages['Freedom Credit Card'] = ViewConstants.IMAGES.PREMIUM_CLUB_CREDITS;
            this.cardImages['visa'] = ViewConstants.IMAGES.PREMIUM_CLUB_CREDITS;
        },
        changeLimitWithdrawal: function(card) {
            /**
             * Method to update the card limit value for Withdrawal
             */
            this.view.lblSetWithdrawalLimitSlider.text = "";
            var selValue = this.view.limitWithdrawalSlider.selectedValue;
            selValue = CommonUtilities.formatCurrencyWithCommas(selValue, false, card.currencyCode);
            this.view.lblSetWithdrawalLimitSlider.text = selValue;
        },

        restoreDefaultsWithdrawalLim: function(card) {
            var prevValue = this.view.limitPrevWithdrawalSlider.selectedValue;
            this.view.limitWithdrawalSlider.selectedValue = parseInt(prevValue);
            prevValue = CommonUtilities.formatCurrencyWithCommas(prevValue, false, card.currencyCode);
            this.view.lblSetWithdrawalLimitSlider.text = prevValue;
        },
        changeLimitPurchase: function(card) {
            /**
             * Method to update the card limit value for Purchase
             */
            this.view.lblSetPurchaseLimitSlider.text = "";
            var selValue = this.view.limitPurchaseSlider.selectedValue;
            selValue = CommonUtilities.formatCurrencyWithCommas(selValue, false, card.currencyCode);
            this.view.lblSetPurchaseLimitSlider.text = selValue;
        },
        restoreDefaultsPurchaseLim: function(card) {
            var prevValue = this.view.limitPrevPurchaseSlider.selectedValue;
            this.view.limitPurchaseSlider.selectedValue = parseInt(prevValue);
            prevValue = CommonUtilities.formatCurrencyWithCommas(prevValue, false, card.currencyCode);
            this.view.lblSetPurchaseLimitSlider.text = prevValue;
        },
        initLimitsSliders: function(card) {
            /**
             * Method to initialize the values for card limits sliders
             */
            withdrawalLimit = card.dailyWithdrawalLimit;
            this.view.lblSetWithdrawalLimitSlider.text = withdrawalLimit;
            withdrawalLimit = CommonUtilities.deFormatAmount(withdrawalLimit);

            withdrawalMinLimit = card.withdrawalMinLimit;
            withdrawalMaxLimit = card.withdrawalMaxLimit;
            withdrawalStepLimit = card.withdrawalStepLimit;
            withdrawalMinLimit == undefined || withdrawalMinLimit == null ? withdrawalMinLimit = 0 : withdrawalMinLimit;
            Number(withdrawalLimit) < Number(withdrawalMinLimit) ? withdrawalLimit = withdrawalMinLimit : withdrawalLimit;
            withdrawalMaxLimit == 0 || withdrawalMaxLimit == undefined || withdrawalMaxLimit == null ? withdrawalMaxLimit = 5000 : withdrawalMaxLimit;
            withdrawalStepLimit == 0 || withdrawalStepLimit == undefined || withdrawalStepLimit == null ? withdrawalStepLimit = 50 : withdrawalStepLimit;

            purchaseLimit = card.purchaseLimit;
            this.view.lblSetPurchaseLimitSlider.text = purchaseLimit;
            purchaseLimit = CommonUtilities.deFormatAmount(purchaseLimit);

            purchaseMinLimit = card.purchaseMinLimit;
            purchaseMaxLimit = card.purchaseMaxLimit;
            purchaseStepLimit = card.purchaseStepLimit;
            purchaseMinLimit == undefined || purchaseMinLimit == null ? purchaseMinLimit = 0 : purchaseMinLimit;
            Number(purchaseLimit) < Number(purchaseMinLimit) ? purchaseLimit = purchaseMinLimit : purchaseLimit;
            purchaseMaxLimit == 0 || purchaseMaxLimit == undefined || purchaseMaxLimit == null ? purchaseMaxLimit = 5000 : purchaseMaxLimit;
            purchaseStepLimit == 0 || purchaseStepLimit == undefined || purchaseStepLimit == null ? purchaseStepLimit = 50 : purchaseStepLimit;

            this.view.limitWithdrawalSlider.max = parseInt(withdrawalMaxLimit);
            this.view.limitWithdrawalSlider.selectedValue = parseInt(withdrawalLimit);
            this.view.limitWithdrawalSlider.min = parseInt(withdrawalMinLimit);
            this.view.limitWithdrawalSlider.step = parseInt(withdrawalStepLimit);
            this.view.limitPrevWithdrawalSlider.max = parseInt(withdrawalMaxLimit);
            this.view.limitPrevWithdrawalSlider.selectedValue = parseInt(withdrawalLimit);
            this.view.limitPrevWithdrawalSlider.min = parseInt(withdrawalMinLimit);

            this.view.limitPurchaseSlider.max = parseInt(purchaseMaxLimit);
            this.view.limitPurchaseSlider.selectedValue = parseInt(purchaseLimit);
            this.view.limitPurchaseSlider.min = parseInt(purchaseMinLimit);
            this.view.limitPurchaseSlider.step = parseInt(purchaseStepLimit);
            this.view.limitPrevPurchaseSlider.max = parseInt(purchaseMaxLimit);
            this.view.limitPrevPurchaseSlider.selectedValue = parseInt(purchaseLimit);
            this.view.limitPrevPurchaseSlider.min = parseInt(purchaseMinLimit);

            this.setCardLimitsSliders(card);

        },
        updateCardLimits: function(card) {
            /**
             * Method to update the card limitis sliders values
             */
            withdrawalLimit = this.view.lblSetWithdrawalLimitSlider.text;
            withdrawalLimit = CommonUtilities.deFormatAmount(withdrawalLimit);
            purchaseLimit = this.view.lblSetPurchaseLimitSlider.text;
            purchaseLimit = CommonUtilities.deFormatAmount(purchaseLimit);
            this.view.lblWithdrawalLimitValue.text = this.view.lblSetWithdrawalLimitSlider.text;
            this.view.lblPurchaseLimitValue.text = this.view.lblSetPurchaseLimitSlider.text;
            if (this.view.flxDailyWithdrawalLimit.isVisible) {
                params = {
                    "cardId": card.cardId,
                    "withdrawalLimit": withdrawalLimit,
                    "card": card
                };
                if(CommonUtilities.getSCAType()!=0)
                params.isMFARequired = card.isMFARequired;
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.updateWithdrawalLimit(params);
               
            }
            if (this.view.flxDailyPurchaseLimit.isVisible) {
                params = {
                    "cardId": card.cardId,
                    "purchaseLimit": purchaseLimit,
                    "card": card
                };
                if(CommonUtilities.getSCAType()!=0)
                params.isMFARequired = card.isMFARequired;
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.updatePurchaseLimit(params);
            }

        },
        setCardLimitsSliders: function(card) {
            /**
             * Method to manage the sliders for updating the card limits
             */
           /* this.view.btnRestoreDefaults.onClick = () => {
                this.restoreDefaultsWithdrawalLim(card);
                this.restoreDefaultsPurchaseLim(card);
            }; */
            this.view.btnRestoreWithdrawlDefaults.onClick = () => {
                this.restoreDefaultsWithdrawalLim(card);
               // this.restoreDefaultsPurchaseLim(card);
            }; 
            this.view.btnRestorePurchaseDefaults.onClick = () => {
                //this.restoreDefaultsWithdrawalLim(card);
                this.restoreDefaultsPurchaseLim(card);
            }; 

            this.view.limitWithdrawalSlider.onSlide = () => {
                this.changeLimitWithdrawal(card);
            };
            this.view.limitPurchaseSlider.onSlide = () => {
                this.changeLimitPurchase(card);
            };
        },
        /**
         * Method to initialize the actions and tooltips for right side flex.
         */
        initRightContainer: function() {
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblActivateNewCard, kony.i18n.getLocalizedString("i18n.footer.contactUs"), accessibilityConfig);
            this.view.lblActivateNewCard.toolTip = kony.i18n.getLocalizedString("i18n.footer.contactUs");
            CommonUtilities.setText(this.view.lblApplyForNewCard, kony.i18n.getLocalizedString("i18n.CardManagement.ApplyForNewCard"), accessibilityConfig);
            this.view.lblApplyForNewCard.toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.ApplyForNewCard");
            var infoContentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName" :"AboutUsMA","moduleName" : "InformationContentUIModule"});
            this.view.flxActivateNewCard.onClick = infoContentModule.presentationController.showContactUsPage.bind(infoContentModule.presentationController);
            this.view.lblRequestANewCard.toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.RequestNewCard");
          	this.view.flxRequestANewCard.onClick = function() {
				 applicationManager.getPresentationUtility().showLoadingScreen();
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToNewCardFlow();
            };
        },
        /**
         * Form lifecycle method.
         */
        PostShowfrmCardManagement: function() {
            this.view.customheader.imgKony.setFocus(true);
            var context1 = {
                "widget": this.view.calFrom,
                "anchor": "bottom"
            };
            this.view.calFrom.setContext(context1);
            context1 = {
                "widget": this.view.calTo,
                "anchor": "bottom"
            };
            this.view.calTo.setContext(context1);
            context1 = {
                "widget": this.view.CardLockVerificationStep.calFrom1,
                "anchor": "bottom"
            };
            this.view.CardLockVerificationStep.calFrom1.setContext(context1);
            context1 = {
                "widget": this.view.CardLockVerificationStep.calTo1,
                "anchor": "bottom"
            };
            this.view.CardLockVerificationStep.calTo1.setContext(context1);
            this.setTravelNotificationDataMap();
            this.setActionPermissionMap();
            applicationManager.executeAuthorizationFramework(this);
            this.AdjustScreen();
        },

        removeActionDelete: function() {
            //   delete this.travelNotificationDataMap["btnAction2"];  don't remove function
        },

        removeActionUpdate: function() {
            delete this.travelNotificationDataMap["btnAction1"];
            this.view.flxMangeTravelPlans.setVisibility(false);
            this.view.flxCardAccounts.forceLayout();
        },

        removeActionLockCard: function() {
            delete this.actionPermissionMap["CARD_MANAGEMENT_LOCK_CARD"];
        },

        removeActionReplaceCard: function() {
            delete this.actionPermissionMap["CARD_MANAGEMENT_REPLACE_CARD"];
        },

        removeActionReportLost: function() {
            delete this.actionPermissionMap["CARD_MANAGEMENT_REPORT_CARD_STOLEN"];
        },

        removeActionChangePin: function() {
            delete this.actionPermissionMap["CARD_MANAGEMENT_CHANGE_PIN"];
        },

        removeActionCancelCard: function() {
            delete this.actionPermissionMap["CARD_MANAGEMENT_CANCEL_CARD"];
        },

        removeActionUnlockCard: function() {
            delete this.actionPermissionMap["CARD_MANAGEMENT_UNLOCK_CARD"];
        },

        checkForNAOPermission: function() {
            applicationManager.executeAuthorizationFramework(this, "NAO");
        },

        removeActionApplyForNewCards: function() {
            this.view.myCards.flxApplyForCards.setVisibility(false);
        },

        hideManageTravelPlans: function() {
            this.view.flxMangeTravelPlans.setVisibility(false);
        },


        doNotRemoveActions: function() {

        },

        setActionPermissionMap: function() {
            this.actionPermissionMap = {
                "CARD_MANAGEMENT_LOCK_CARD": kony.i18n.getLocalizedString("i18n.CardManagement.LockCard"),
                "CARD_MANAGEMENT_REPLACE_CARD": kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.requestReplaceCard"),
                "CARD_MANAGEMENT_REPORT_CARD_STOLEN": kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost"),
                "CARD_MANAGEMENT_CHANGE_PIN": kony.i18n.getLocalizedString("i18n.CardManagement.ChangePin"),
                "CARD_MANAGEMENT_CANCEL_CARD": kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard"),
                "CARD_MANAGEMENT_UNLOCK_CARD": kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCard"),
                "CARD_MANAGEMENT_SET_LIMITS": kony.i18n.getLocalizedString("i18n.CardManagement.SetLimits"),
                "CARD_MANAGEMENT_ISSUED_CARD": kony.i18n.getLocalizedString("i18n.CardManagement.ActivateCard")
            }
        },

        getValidActions: function() {
            var scope = this;
            return Object.keys(scope.actionPermissionMap).map(function(key) {
                return scope.actionPermissionMap[key];
            });
        },

        setTravelNotificationDataMap: function() {
            this.travelNotificationDataMap = {
                "flxActions": "flxActions",
                "lblSeparator1": "lblSeparator1",
                "lblCardHeader": "lblCardHeader",
                "lblCardId": "lblCardId",
                "lblCardStatus": "lblCardStatus",
                "lblIdentifier": "lblIdentifier",
                "flxCollapse": "flxCollapse",
                "imgCollapse": "imgCollapse",
                "imgChevron": "imgChevron",
                "lblKey1": "lblKey1",
                "rtxValue1": "rtxValue1",
                "lblKey2": "lblKey2",
                "rtxValue2": "rtxValue2",
                "flxDestination1": "flxDestination1",
                "flxDestination2": "flxDestination2",
                "flxDestination3": "flxDestination3",
                "flxDestination4": "flxDestination4",
                "flxDestination5": "flxDestination5",
                "lblDestination1": "lblDestination1",
                "rtxDestination1": "rtxDestination1",
                "lblDestination2": "lblDestination2",
                "rtxDestination2": "rtxDestination2",
                "lblDestination3": "lblDestination3",
                "rtxDestination3": "rtxDestination3",
                "lblDestination4": "lblDestination4",
                "rtxDestination4": "rtxDestination4",
                "lblDestination5": "lblDestination5",
                "rtxDestination5": "rtxDestination5",
                "lblKey4": "lblKey4",
                "rtxValue4": "rtxValue4",
                "lblKey5": "lblKey5",
                "rtxValue5": "rtxValue5",
                "lblKey6": "lblKey6",
                "rtxValueA": "rtxValueA",
                "btnAction1": "btnAction1",
                "btnAction2": "btnAction2"
            };
        },

        /**
         * showIncorrectSecureAnswersFlex: This function enables the incorrect security answers flex.
         */
        showIncorrectSecurityAnswersFlex: function() {
            CommonUtilities.hideProgressBar(this.view);
            this.view.CardLockVerificationStep.flxWarningMessage.setVisibility(true);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardLockVerificationStep.lblWarning, kony.i18n.getLocalizedString("i18n.MFA.EnteredSecurityQuestionsDoesNotMatch"), accessibilityConfig);
            this.view.forceLayout();
        },
        /**
         * showSecurityQuestionsScreen - Shows the screen where user can enter secure access code and verify.
         * @param {Array} - Security Questions array.
         * @param {params} contains the params object.
         * @param {String} action - contains the action to be performed.
         */
        showSecurityQuestionsScreen: function(securityQuestions, params, action) {
            var self = this;
            if (action === kony.i18n.getLocalizedString("i18n.CardManagement.LockCard")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.LockCardSecurityQuestions"));
            } else if (action === kony.i18n.getLocalizedString("i18n.CardManagement.ChangePin") || action === "Offline_Change_Pin") {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.ChangePinSecurityQuestions"));
            } else if (action === kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCard")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCardSecurityQuestions"));
            } else if (action === kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.LostOrStolenCardSecurityQuestions"));
            } else if (action === kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.requestReplaceCard")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.ReplaceCardSecurityQuestions"));
            } else if (action === kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.cardsManagement.cancelVerification"));
            }
            this.view.CardLockVerificationStep.flxWarningMessage.setVisibility(false);
            FormControllerUtility.disableButton(this.view.CardLockVerificationStep.confirmButtons.btnConfirm);
            this.view.CardLockVerificationStep.flxVerifyByOptions.setVisibility(false);
            this.view.CardLockVerificationStep.flxVerifyBySecureAccessCode.setVisibility(false);
            this.view.CardLockVerificationStep.flxVerifyBySecurityQuestions.setVisibility(true);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardLockVerificationStep.lblAnswerSecurityQuestion1, securityQuestions[0].Question, accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.lblAnswerSecurityQuestion2, securityQuestions[1].Question, accessibilityConfig);
            this.view.CardLockVerificationStep.tbxAnswers1.text = "";
            this.view.CardLockVerificationStep.tbxAnswers2.text = "";
            this.view.forceLayout();
            this.view.CardLockVerificationStep.tbxAnswers1.onKeyUp = function() {
                if (self.view.CardLockVerificationStep.tbxAnswers1.text === "" || self.view.CardLockVerificationStep.tbxAnswers2.text === "" || CommonUtilities.isCSRMode()) {
                    FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                } else {
                    FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                }
            };
            this.view.CardLockVerificationStep.tbxAnswers2.onKeyUp = function() {
                if (self.view.CardLockVerificationStep.tbxAnswers1.text === "" || self.view.CardLockVerificationStep.tbxAnswers2.text === "" || CommonUtilities.isCSRMode()) {
                    FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                } else {
                    FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                }
            };
            var buttonsJSON = {
                'btnConfirm': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.ProfileManagement.Verify"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.ProfileManagement.Verify")
                },
                'btnModify': {
                    'isVisible': false,
                    'text': kony.i18n.getLocalizedString("i18n.common.modifiy"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.common.modifiy")
                },
                'btnCancel': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.transfers.Cancel")
                },
            };
            this.alignConfirmButtons(buttonsJSON);
            this.view.CardLockVerificationStep.confirmButtons.btnCancel.onClick = this.showMFAScreen.bind(this, params, action);
            if (CommonUtilities.isCSRMode()) {
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = FormControllerUtility.disableButtonActionForCSRMode();
            } else {
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = function() {
                    self.view.CardLockVerificationStep.flxWarningMessage.setVisibility(false);
                    var questionAnswers = [];
                    questionAnswers.push({
                        'questionId': securityQuestions[0].SecurityQuestion_id,
                        'customerAnswer': self.view.CardLockVerificationStep.tbxAnswers1.text
                    }, {
                        'questionId': securityQuestions[1].SecurityQuestion_id,
                        'customerAnswer': self.view.CardLockVerificationStep.tbxAnswers2.text
                    });
                    params.questionAnswers = questionAnswers;
                    FormControllerUtility.showProgressBar(self.view);
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.verifySecurityQuestionAnswers(params, action);
                };
            }
            CommonUtilities.hideProgressBar(self.view);
        },
        getSelectedAddressId: function() {
            var i = 0;
            var addresses = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.fetchUserAddresses();
            if (this.view.CardLockVerificationStep.lblAddressCheckBox1.text === "M") i = 0;
            if (this.view.CardLockVerificationStep.lblAddressCheckBox2.text === "M") i = 1;
            if (this.view.CardLockVerificationStep.lblAddressCheckBox3.text === "M") i = 2;
            return addresses[i].addressId;
            //return kony.mvc.MDAApplication.getSharedInstance().appContext.address[i].Address_id;
        },
        updateFormUI: function(viewPropertiesMap) {
            if (viewPropertiesMap.cards) {
                this.showCards();
                //this.setCardsData(this.constructCardsViewModel(viewPropertiesMap.cards));
            }
            if (viewPropertiesMap.searchPerformed) {
                if (viewPropertiesMap.searchFrom == "AccountsDashboard") {
                    this.showSelectedCardDetails(viewPropertiesMap.searchResults, "AccountsDashboard")
                } else {
                    this.showSearchResultsOfCards(viewPropertiesMap.searchResults);
                }
                //this.setCardsData(this.constructCardsViewModel(viewPropertiesMap.cards));
            }
            if (viewPropertiesMap.secureAccessCode) {
                this.showSecureAccessCodeScreen(viewPropertiesMap.params, viewPropertiesMap.action);
            }
            if (viewPropertiesMap.progressBar === true) {
                FormControllerUtility.showProgressBar(this.view);
                this.hideServerError();
            } else if (viewPropertiesMap.progressBar === false) {
                CommonUtilities.hideProgressBar(this.view);
                this.hideServerError();
            }
            if (viewPropertiesMap.showIncorrectCVV) {
                this.showErrorCVV(viewPropertiesMap.card);
            }
            if (viewPropertiesMap.serverError) {
                CommonUtilities.hideProgressBar(this.view);
                this.showServerError(viewPropertiesMap.serverError);
            }
            if (viewPropertiesMap.serverDown) {
                CommonUtilities.hideProgressBar(this.view);
                CommonUtilities.showServerDownScreen();
            }
            if (viewPropertiesMap.sideMenu) {
                this.updateHamburgerMenu(viewPropertiesMap.sideMenu);
            }
            if (viewPropertiesMap.incorrectSecureAccessCode) {
                this.showIncorrectSecureAccessCodeFlex();
            }
            if (viewPropertiesMap.TndCSuccessLockCard) {
                this.showTermsAndConditionsSuccessScreenLockCard(viewPropertiesMap.TndCSuccessLockCard);
            }
            if (viewPropertiesMap.TndCSuccessCancelCard) {
                this.showTermsAndConditionsSuccessScreenCancelCard(viewPropertiesMap.TndCSuccessCancelCard);
            }
            if (viewPropertiesMap.travelNotificationsList) {
                applicationManager.executeAuthorizationFramework(this, "updateTravelNotifications");
                this.showTravelNotifications(viewPropertiesMap.travelNotificationsList.TravelRequests);
            }
            if (viewPropertiesMap.actionAcknowledgement) {
                this.showAcknowledgementScreen(viewPropertiesMap.card, viewPropertiesMap.actionAcknowledgement);
            }
            if (viewPropertiesMap.AddNewTravelPlan) {
                this.showAddNewTravelPlan(viewPropertiesMap);
            }
            if (viewPropertiesMap.notificationAcknowledgement) {
                this.showTravelNotificationAcknowledgement(viewPropertiesMap.notificationAcknowledgement);
            }
            if (viewPropertiesMap.eligibleCards) {
                this.showSelectCardScreen(viewPropertiesMap.eligibleCards);
            }
            if (viewPropertiesMap.travelStatus) {
                this.showCards();
                this.showCardsStatus(viewPropertiesMap.travelStatus);
                this.view.myCards.flxAccountName.setVisibility(false);
                applicationManager.executeAuthorizationFramework(this, "applyForNewCards");
            }
            if (viewPropertiesMap.securityQuestions) {
                this.showSecurityQuestionsScreen(viewPropertiesMap.securityQuestions, viewPropertiesMap.card, viewPropertiesMap.action);
            }
            if (viewPropertiesMap.incorrectSecurityAnswers) {
                this.showIncorrectSecurityAnswersFlex();
            }
            if (viewPropertiesMap.notificationDeleted) {
                this.deleteNotificationSuccess();
            }
            if (viewPropertiesMap.isPrintCancelled) {
                this.showAcknowledgementOnPrintCancel();
            }
            if (viewPropertiesMap.campaign) {
                this.campaigns = viewPropertiesMap.campaign;
            }
            if (viewPropertiesMap.setAccountsForCards) {
                this.showAccountsForNewCard(viewPropertiesMap.setAccountsForCards);
            }
            if (viewPropertiesMap.setCardProductDetails) {
                this.showCardProductDetails(viewPropertiesMap.setCardProductDetails, viewPropertiesMap.accountData);
            }
            if (viewPropertiesMap.setDataToAcknowledgement) {
                this.showAcknowledgementScreenForApplyCard(viewPropertiesMap.setDataToAcknowledgement);
            }
            if (viewPropertiesMap.cardLimitAcknowledgement) {
                this.showNewCardLimitAcknowledgement(viewPropertiesMap);
            }
        },
        /**
         * showErrorCVV - Method that shows incorrect cvv code screen.
         * @param {Object} - card object.
         */
        showErrorCVV: function(card) {
            CommonUtilities.hideProgressBar(this.view);
            this.view.tbxCVVNumber.text = "";
            card.oldCVV = "";
            card.cvv = "";
            this.view.tbxCVVNumber.secureTextEntry = true;
            this.view.imgViewCVV.src = "eye_hide.png";
            FormControllerUtility.disableButton(this.view.btnContinue2);
            this.setCVVScreen(card);
            this.view.flxCardCVV.setVisibility(true);
            this.view.flxIncorrectCVV.setVisibility(true);
            this.view.forceLayout();
            this.setCVVpopUpUI();
            this.AdjustScreen();
        },
        /**
         * AdjustScreen - Method that sets the height of footer properly.
         */
        AdjustScreen: function() {
          
            this.view.forceLayout();
            var mainheight = 0;
            var screenheight = kony.os.deviceInfo().screenHeight;
           mainheight = this.view.customheader.info.frame.height + this.view.flxMain.info.frame.height;
            var diff = screenheight - mainheight;
            if (mainheight < screenheight) {
                diff = diff - this.view.flxFooter.info.frame.height;
                if (diff > 0) {
                    this.view.flxFooter.top = mainheight + diff - 60 + "dp";                 
                } else {
                    this.view.flxFooter.top = mainheight - 60 + "dp";
                }
            } else {
                this.view.flxFooter.top = mainheight - 60 + "dp";
            }
            this.view.forceLayout();
        },
        /**
         * Method that hides all other flexes except the Cards segment.
         * @param {Array} - Array of JSON objects of cards.
         */
        showCards: function(cards) {
            var self = this;
            this.hideAllCardManagementViews();
            this.view.flxTermsAndConditions.setVisibility(true);
            this.showContactUsNavigation();
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblManageTravelPlans, kony.i18n.getLocalizedString('i18n.CardManagement.ManageTravelPlans'), accessibilityConfig);
            this.view.lblManageTravelPlans.toolTip = kony.i18n.getLocalizedString('i18n.CardManagement.ManageTravelPlans');
            this.view.flxMangeTravelPlans.onClick = self.fetchTravelNotifications;
            this.view.forceLayout();
            //kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.fetchCardsStatus(cards);
        },
        /**
         *  Method that hides all flexes in frmCardManagement.
         */
        hideAllCardManagementViews: function() {
            this.view.flxAcknowledgment.setVisibility(false);
            this.view.flxActivateCard.setVisibility(false);
            this.view.flxCardVerification.setVisibility(false);
            this.view.flxMyCardsView.setVisibility(false);
            this.view.flxTermsAndConditions.setVisibility(false);
            this.view.breadcrumb.setVisibility(false);
            this.view.flxTravelPlan.setVisibility(false);
            this.view.flxConfirm.setVisibility(false);
            this.view.myCards.flxNoError.setVisibility(false);
            this.view.myCards.segMyCards.setVisibility(false);
            this.view.flxEligibleCardsButtons.setVisibility(false);
            this.view.flxCardDetailsMobile.setVisibility(false);
            this.view.flxSetCardLimits.setVisibility(false);
            this.view.flxCardLimits.setVisibility(false);
            this.view.flxSetCardLimitsOverview.setVisibility(false);
            this.view.flxSetCardLimitsNew.setVisibility(false);
            this.view.flxCVVPopup.setVisibility(false);
            this.view.flxCardCVV.setVisibility(false);
            this.view.flxNewcard.setVisibility(false);
        },
        /**
         *  Method to navigate to contactus.
         */
        showContactUsNavigation: function() {
            this.view.flxRequestANewCard.setVisibility(false);
            this.view.myCards.flxRequestANewCard.setVisibility(false);
            this.view.flxCardAccounts.top = "0dp";
            this.view.flxApplyForNewCard.setVisibility(false);
            this.view.lblActivateNewCard.onTouchEnd = function() {
                var informationContentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("InformationContentModule");
                informationContentModule.presentationController.showContactUsPage();
            };
        },
        /**
         * Method to call function of presenter to fetch travel notifications
         */
        fetchTravelNotifications: function() {
            FormControllerUtility.showProgressBar(this.view);
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.fetchTravelNotifications();
        },
        /**
         * This function shows the masked Secure Access Code on click of the eye icon
         * @param {Object} - The textbox widget of the Secure Access Code.
         */
        toggleSecureAccessCodeMasking: function(widgetId) {
            widgetId.secureTextEntry = !(widgetId.secureTextEntry);
        },
        /**
         *Shows the screen where user can enter secure access code and verify.
         * @param {Object} - card object
         * @param {String} action - contains the action to be performed.
         */
        showSecureAccessCodeScreen: function(params, action) {
            var self = this;
            if (action === kony.i18n.getLocalizedString("i18n.CardManagement.LockCard")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.LockCardSecureAccessCode"));
            } else if (action === kony.i18n.getLocalizedString("i18n.CardManagement.ChangePin") || action === "Offline_Change_Pin") {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.ChangePinSecureAccessCode"));
            } else if (action === kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCard")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCardSecureAccessCode"));
            } else if (action === kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.LostOrStolenCardSecureAccessCode"));
            } else if (action === kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.requestReplaceCard")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.ReplaceCardSecureAccessCode"));
            } else if (action === kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.cardsManagement.cancelVerification"));
            }
            this.hideServerError();
            FormControllerUtility.disableButton(this.view.CardLockVerificationStep.confirmButtons.btnConfirm);
            this.view.CardLockVerificationStep.lblWarningSecureAccessCode.setVisibility(false);
            this.view.CardLockVerificationStep.flxVerifyByOptions.setVisibility(false);
            this.view.CardLockVerificationStep.flxVerifyBySecureAccessCode.setVisibility(true);
            this.view.CardLockVerificationStep.tbxCVV.text = "";
            this.view.CardLockVerificationStep.tbxCVV.secureTextEntry = false;
            this.view.CardLockVerificationStep.imgViewCVV.setVisibility(false);
            this.view.forceLayout();
            this.view.CardLockVerificationStep.imgViewCVV.onTouchStart = this.toggleSecureAccessCodeMasking.bind(this, this.view.CardLockVerificationStep.tbxCVV);
            this.view.CardLockVerificationStep.tbxCVV.onKeyUp = function() {
                if (!self.isValidSecureAccessCode(self.view.CardLockVerificationStep.tbxCVV.text) || CommonUtilities.isCSRMode()) {
                    FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                } else {
                    FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                }
            };
            var buttonsJSON = {
                'btnConfirm': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.ProfileManagement.Verify"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.ProfileManagement.Verify")
                },
                'btnModify': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.login.ResendOtp"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.login.ResendOtp")
                },
                'btnCancel': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.transfers.Cancel")
                },
            };
            this.alignConfirmButtons(buttonsJSON);
            var resendOtpTimer;
            this.view.CardLockVerificationStep.confirmButtons.btnCancel.onClick = function() {
                clearTimeout(resendOtpTimer);
                self.view.forceLayout();
                self.view.CardLockVerificationStep.lblWarningSecureAccessCode.setVisibility(false);
                self.showMFAScreen(params, action);
            };
            FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnModify);
            resendOtpTimer = setTimeout(
                function() {
                    FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnModify);
                }, 5000);
            this.view.CardLockVerificationStep.confirmButtons.btnModify.onClick = function() {
                FormControllerUtility.showProgressBar(self.view);
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.sendSecureAccessCode(params, action);
                self.view.CardLockVerificationStep.lblWarningSecureAccessCode.setVisibility(true);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(self.view.CardLockVerificationStep.lblWarningSecureAccessCode, kony.i18n.getLocalizedString("i18n.MFA.ResentOTPMessage"), accessibilityConfig);
                FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnModify);
                resendOtpTimer = setTimeout(
                    function() {
                        FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnModify);
                    }, 5000);
                self.view.forceLayout();
            };
            if (CommonUtilities.isCSRMode()) {
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = FormControllerUtility.disableButtonActionForCSRMode();
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.skin = FormControllerUtility.disableButtonSkinForCSRMode();
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.focusSkin = FormControllerUtility.disableButtonSkinForCSRMode();
            } else {
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = function() {
                    clearTimeout(resendOtpTimer);
                    FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnModify);
                    var enteredAccessCode = self.view.CardLockVerificationStep.tbxCVV.text;
                    params.enteredAccessCode = enteredAccessCode;
                    FormControllerUtility.showProgressBar(self.view);
                    self.view.CardLockVerificationStep.lblWarningSecureAccessCode.setVisibility(false);
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.verifySecureAccessCode(params, action);
                    self.view.forceLayout();
                };
            }
            self.view.forceLayout();
        },


        showTermsAndConditionsSuccessScreenLockCard: function(TnCcontent) {
            //CommonUtilities.disableButton(this.view.CardLockVerificationStep.confirmButtons.btnConfirm);
            // this.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon.text = OLBConstants.FONT_ICONS.CHECBOX_UNSELECTED;
            this.view.CardLockVerificationStep.CardActivation.flxIAgree.setVisibility(true);
            if (TnCcontent.contentTypeId === OLBConstants.TERMS_AND_CONDITIONS_URL) {
                this.view.CardLockVerificationStep.CardActivation.btnTermsAndConditions.onClick = function() {
                    window.open(TnCcontent.termsAndConditionsContent);
                }
            } else {
                this.setTnCDATASection(TnCcontent.termsAndConditionsContent);
            }
            this.view.flxClose.onClick = this.hideTermsAndConditionPopUp;
        },
        showTermsAndConditionsSuccessScreenCancelCard: function(TnCcontent) {
            // CommonUtilities.disableButton(this.view.CardLockVerificationStep.confirmButtons.btnConfirm);
            // this.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon.text = OLBConstants.FONT_ICONS.CHECBOX_UNSELECTED;
            this.view.CardLockVerificationStep.WarningMessage.flxIAgree.setVisibility(true);
            if (TnCcontent.contentTypeId === OLBConstants.TERMS_AND_CONDITIONS_URL) {
                this.view.CardLockVerificationStep.WarningMessage.btnTermsAndConditions.onClick = function() {
                    window.open(TnCcontent.termsAndConditionsContent);
                }
            } else {
                this.setTnCDATASection(TnCcontent.termsAndConditionsContent);
            }
            this.view.flxClose.onClick = this.hideTermsAndConditionPopUp;
        },
        showTermsAndConditionPopUp: function() {
            var height = this.view.flxHeader.info.frame.height + this.view.flxContainer.info.frame.height + this.view.flxFooter.info.frame.height;
            this.view.flxTermsAndConditionsPopUp.height = height + "dp";
            this.view.flxTermsAndConditionsPopUp.setVisibility(true);
        },
        hideTermsAndConditionPopUp: function() {
            this.view.flxTermsAndConditionsPopUp.setVisibility(false);
            FormControllerUtility.setHtmlToBrowserWidget(this, this.view.brwBodyTnC, "");
        },

        setTnCDATASection: function(content) {
            this.view.rtxTC.text = content;
            this.view.flxTCContents.isVisible = false;
            FormControllerUtility.setHtmlToBrowserWidget(this, this.view.brwBodyTnC, content);
        },
        toggleTnC: function(widget, buttonWidget) {
            CommonUtilities.toggleFontCheckbox(widget);
            if (widget.text === OLBConstants.FONT_ICONS.CHECBOX_UNSELECTED)
                CommonUtilities.disableButton(buttonWidget);
            else
                CommonUtilities.enableButton(buttonWidget);
        },
        /**
         * This function enables the incorrect OTP flex.
         */
        showIncorrectSecureAccessCodeFlex: function() {
            CommonUtilities.hideProgressBar(this.view);
            FormControllerUtility.enableButton(this.view.CardLockVerificationStep.confirmButtons.btnModify);
            this.view.CardLockVerificationStep.lblWarningSecureAccessCode.setVisibility(true);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardLockVerificationStep.lblWarningSecureAccessCode, kony.i18n.getLocalizedString("i18n.MFA.EnteredSecureAccessCodeDoesNotMatch"), accessibilityConfig);
            this.view.CardLockVerificationStep.tbxCVV.text = "";
            this.view.forceLayout();
        },
        /**
         *  Method to show error flex.
         * @param {String} - Error message to be displayed.
         */
        showServerError: function(errorMsg) {
            this.view.flxDowntimeWarning.setVisibility(true);
            if (errorMsg.errorMessage && errorMsg.errorMessage != "") {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.rtxDowntimeWarning, errorMsg.errorMessage, accessibilityConfig);
            } else {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.rtxDowntimeWarning, errorMsg, accessibilityConfig);
            }
            this.view.CardLockVerificationStep.confirmButtons.btnModify.setVisibility(false);
            if (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet)
                this.view.CardLockVerificationStep.confirmButtons.btnCancel.right = '26.5%';
            else
                this.view.CardLockVerificationStep.confirmButtons.btnCancel.right = '16.5%';
            this.view.CardLockVerificationStep.confirmButtons.height = "100dp";
            this.view.rtxDowntimeWarning.setFocus(true);
            this.view.flxMyCardsView.setVisibility(false);
            this.AdjustScreen();
        },
        /**
         * Method to hide error flex.
         */
        hideServerError: function() {
            this.view.flxDowntimeWarning.setVisibility(false);
        },
        /**
         * Method that updates Hamburger Menu.
         * @param {Object} sideMenuModel - contains the side menu view model.
         */
        updateHamburgerMenu: function() {
            this.view.customheader.customhamburger.activateMenu("ACCOUNTS", "Card Management");
        },
        /**
         * Method to navigate to travel notifications screen
         * @param {Object} - travelNotifications object
         */
        showTravelNotifications: function(travelNotifications) {
            var self = this;
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblManageTravelPlans, kony.i18n.getLocalizedString('i18n.CardManagement.AddNewTravelPlan'), accessibilityConfig);
            this.view.lblManageTravelPlans.toolTip = kony.i18n.getLocalizedString('i18n.CardManagement.AddNewTravelPlan');
            this.view.flxMangeTravelPlans.onClick = self.navigateToAddTravelNotification.bind(this);
            this.setBreadCrumbAndHeaderDataTravelPlan();
            this.hideAllCardManagementViews();
            this.view.flxMyCardsView.setVisibility(true);
            this.view.flxTravelPlan.setVisibility(false);
            this.view.flxMyCards.setVisibility(true);
            this.view.flxRightBar.setVisibility(true);
            this.setTravelNotificationsData(travelNotifications);
        },
        /**
         * Method to navigate to creat travel notifications screen
         */
        navigateToAddTravelNotification: function() {
            var self = this;
            FormControllerUtility.showProgressBar(this.view);
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.AddNewTravelPlan();
            this.view.lblManageTravelPlans.toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.AddNewTravelPlan");
        },
        /**
         * Method to set breadcrumb and header data for Travel plan
         */
        setBreadCrumbAndHeaderDataTravelPlan: function() {
            var self = this;
            this.view.breadcrumb.setVisibility(false);
            this.view.breadcrumb.setBreadcrumbData([{
                'text': kony.i18n.getLocalizedString("i18n.CardManagement.MyCards"),
                'callback': kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.fetchCardsList.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController)
            }, {
                'text': kony.i18n.getLocalizedString("i18n.CardManagement.ManageTravelPlans"),
                'callback': null
            }]);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.myCards.lblMyCardsHeader, kony.i18n.getLocalizedString("i18n.CardManagement.ManageTravelPlans"), accessibilityConfig);
        },
        /**
         * Method to set travel notifications data.
         */
        setTravelNotificationsData: function(travelNotifications) {
            var self = this;
            if (travelNotifications == undefined || travelNotifications.lengh == 0) {
                self.showNoTravelNotificationScreen();
            } else {
                self.view.myCards.segMyCards.setVisibility(true);
                self.view.myCards.flxSearch.setVisibility(false);
                var widgetDataMap = this.travelNotificationDataMap;
                var flxCardSkin = (kony.application.getCurrentBreakpoint() === 640) ? "sknFlxffffffRoundedBorder" : "slfBoxffffffB1R5";
                var segData = travelNotifications.map(function(dataItem) {
                    var destinations = self.returnDestinationsArray(dataItem.destinations);
                    return {
                        "flxActions": {
                            "isVisible": true
                        },
                        "lblSeparator1": " ",
                        "lblIdentifier": {
                            "text": " ",
                            "accessibilityconfig": {
                                "a11yLabel": " "
                            }
                        },
                        "lblCardHeader": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.requestId"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.requestId")
                            }
                        },
                        "lblCardId": {
                            "text": dataItem.notificationId,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.notificationId
                            }
                        },
                        "lblCardStatus": {
                            "text": dataItem.status,
                            "skin": self.statusSkinsLandingScreen[dataItem.status]?self.statusSkinsLandingScreen[dataItem.status]:self.statusSkinsDetailsScreen[dataItem.status],
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.status
                            }
                        },
                        "flxCollapse": {
                            "isVisible": true,
                            "onClick": self.changeNotificationRowTemplate
                        },
                        "imgCollapse": {
                            "src": ViewConstants.IMAGES.ARRAOW_DOWN,
                            "accessibilityconfig": {
                                "a11yLabel": "View Transaction Details"
                            }
                        },
                        "lblKey1": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.travelStartDate"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.travelStartDate")
                            }
                        },
                        "rtxValue1": {
                            "text": self.returnFrontendDate(dataItem.startDate),
                            "accessibilityconfig": {
                                "a11yLabel": self.returnFrontendDate(dataItem.startDate)
                            }
                        },
                        "lblKey2": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.travelEndDate"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.travelEndDate")
                            }
                        },
                        "rtxValue2": {
                            "text": self.returnFrontendDate(dataItem.endDate),
                            "accessibilityconfig": {
                                "a11yLabel": self.returnFrontendDate(dataItem.endDate)
                            }
                        },
                        "flxDestination1": {
                            "isVisible": destinations[0] ? true : false
                        },
                        "lblDestination1": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.destination1"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.destination1")
                            }
                        },
                        "rtxDestination1": destinations[0],
                        "flxDestination2": {
                            "isVisible": destinations[1] ? true : false
                        },
                        "lblDestination2": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.destination2"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.destination2")
                            }
                        },
                        "rtxDestination2": destinations[1],
                        "flxDestination3": {
                            "isVisible": destinations[2] ? true : false
                        },
                        "lblDestination3": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.destination3"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.destination3")
                            }
                        },
                        "rtxDestination3": destinations[2],
                        "flxDestination4": {
                            "isVisible": destinations[3] ? true : false
                        },
                        "lblDestination4": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.destination4"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.destination4")
                            }
                        },
                        "rtxDestination4": destinations[3],
                        "flxDestination5": {
                            "isVisible": destinations[4] ? true : false
                        },
                        "lblDestination5": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.destination5"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.destination5")
                            }
                        },
                        "rtxDestination5": destinations[4],
                        "lblKey4": {
                            "text": kony.i18n.getLocalizedString("i18n.ProfileManagement.PhoneNumber"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.PhoneNumber")
                            }
                        },
                        "rtxValue4": {
                            "text": dataItem.contactNumber,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.contactNumber
                            }
                        },
                        "lblKey5": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.additionalInfo"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.additionalInfo")
                            }
                        },
                        "rtxValue5": {
                            "text": dataItem.additionalNotes!==undefined && dataItem.additionalNotes.length >= 1 ? dataItem.additionalNotes : kony.i18n.getLocalizedString("i18n.common.none"),
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.additionalNotes!==undefined && dataItem.additionalNotes.length >= 1 ? dataItem.additionalNotes : kony.i18n.getLocalizedString("i18n.common.none")
                            }
                        },
                        "lblKey6": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.selectedCards"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.selectedCards")
                            }
                        },
                        "rtxValueA": {
                            "text": self.returnCardDisplayName(dataItem.cardNumber),
                            "accessibilityconfig": {
                                "a11yLabel": self.returnCardDisplayName(dataItem.cardNumber)
                            }
                        },
                        "btnAction1": {
                            "skin": dataItem.status === 'Expired' ? "sknBtnSSP3343A817PxBg0CSR" : "sknBtnSecondaryNoBorderSSP4176a415px",
                            "text": kony.i18n.getLocalizedString("i18n.billPay.Edit"),
                            "onClick": dataItem.status === 'Expired' ? null : self.editTravelNotification.bind(self, dataItem)
                        },
                        "btnAction2": {
                            "skin": dataItem.status === 'Expired' ? "sknBtnSSP3343A817PxBg0CSR" : "sknBtnSecondaryNoBorderSSP4176a415px",
                            "text": kony.i18n.getLocalizedString("i18n.transfers.deleteExternalAccount"),
                            "onClick": dataItem.status === 'Expired' ? null : self.deleteNotification.bind(self, dataItem.notificationId)
                        },
                        "flxMyCards": {
                            "clipBounds": false,
                            "skin": flxCardSkin,
                            "onClick": self.viewCardDetailsMobile
                        },
                        "imgChevron": "arrow_left_grey.png",
                        "template": "flxTravelNotificationsCollapsed"
                    };
                });
                this.view.myCards.segMyCards.widgetDataMap = widgetDataMap;
                this.view.myCards.segMyCards.setData(segData);
            }
            this.view.forceLayout();
            this.AdjustScreen();
            // this.view.flxFooter.top = "700dp";
            CommonUtilities.hideProgressBar(this.view);
        },
        /**
         * Method to show no travel notification screen
         */
        showNoTravelNotificationScreen: function() {
            this.view.myCards.flxNoError.setVisibility(true);
            this.view.myCards.flxNoError.skin = "slfBoxffffffB1R5";
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.myCards.lblNoCardsError, kony.i18n.getLocalizedString('i18n.CardsManagement.NoTravelNotificationError'), accessibilityConfig);
            CommonUtilities.setText(this.view.myCards.btnApplyForCard, kony.i18n.getLocalizedString("i18n.CardManagement.BackToCards"), accessibilityConfig);
            this.view.myCards.flxApplyForCards.setVisibility(true);
            this.view.myCards.btnApplyForCard.toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.BackToCards");
            this.view.myCards.btnApplyForCard.onClick = function() {
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards();
            }

            this.AdjustScreen();
        },
        /**
         * Method to be called after success of delete Notification to refresh and load notification list
         */
        deleteNotificationSuccess: function() {
            this.fetchTravelNotifications();
        },
        /**
         * Method to return cards names with line break for manage travel plan
         * @param {String} cards Cards names seperated by comma
         * @returns {String} cards name seperated by line break
         */
        returnCardDisplayName: function(cards) {
            return cards.replace(/,/g, "<br/>");
        },
        /**
         * Method to return frontend date for Travel Plan
         * @param {Date} date in yyyy-mm-dd format
         * @returns {String} dateString which has date in frontend date format
         */
        returnFrontendDate: function(date) {
            var dateString = CommonUtilities.getFrontendDateString(date);
            return dateString;
        },
        /**
         * changeRowTemplateMethod to toggle row template(btween selected and unselected templates for Travel Notifications) for selected row of segment
         */
        changeNotificationRowTemplate: function() {
            var index = this.view.myCards.segMyCards.selectedRowIndex;
            var rowIndex = index[1];
            var data = this.view.myCards.segMyCards.data;
            for (var i = 0; i < data.length; i++) {
                if (i === rowIndex) {
                    if (data[i].template === "flxTravelNotificationsCollapsed") {
                        data[i].imgCollapse = {
                            "src": ViewConstants.IMAGES.ARRAOW_UP,
                            "accessibilityconfig": {
                                "a11yLabel": "View Details"
                            }
                        };
                        data[i].template = "flxTravelNotificationsExpanded";
                    } else {
                        data[i].imgCollapse = {
                            "src": ViewConstants.IMAGES.ARRAOW_DOWN,
                            "accessibilityconfig": {
                                "a11yLabel": "View Details"
                            }
                        };
                        data[i].template = "flxTravelNotificationsCollapsed";
                    }
                } else {
                    data[i].imgCollapse = {
                        "src": ViewConstants.IMAGES.ARRAOW_DOWN,
                        "accessibilityconfig": {
                            "a11yLabel": "View Details"
                        }
                    };
                    data[i].template = "flxTravelNotificationsCollapsed";
                }
            }
            this.view.myCards.segMyCards.setData(data);
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * Method to return array of destinations from a string seperated by '-'
         * @param {String} destinations Destination seperated by '-'
         * @returns {Array} array that stores destinations
         */
        returnDestinationsArray: function(destinations) {
            var array = [];
            destinations.split('-').forEach(function(destination) {
                array.push(destination);
            })
            return array;
        },
        /**
         * Method to show edit travel notification screen
         * @param {Object} - notification object
         */
        editTravelNotification: function(data) {
            var self = this;
            this.notificationObject.requestId = data.notificationId;
            this.notificationObject.isEditFlow = true;
            self.navigateToAddTravelNotification();
            self.getBackendCards(data.cardNumber);
            this.view.lblRequestID.setVisibility(true);
            this.view.lblRequestNo.setVisibility(true);
            this.view.segDestinations.setVisibility(true);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
			FormControllerUtility.disableButton(this.view.btnCardsContinue);
            CommonUtilities.setText(this.view.lblRequestID, kony.i18n.getLocalizedString('i18n.CardManagement.requestId'), accessibilityConfig);
            CommonUtilities.setText(this.view.lblRequestNo, data.notificationId, accessibilityConfig);
            this.view.calFrom.dateComponents = this.getDateComponent(self.returnFrontendDate(data.startDate));
            this.view.calTo.dateComponents = this.getDateComponent(self.returnFrontendDate(data.endDate));
            this.view.txtPhoneNumber.text = data.contactNumber;
            this.view.txtareaUserComments.text = data.additionalNotes;
            this.setDestinations(data.destinations);
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * Method to get already selected cards for edit travel notification
         * @param {Object} - cards object
         */
        getBackendCards: function(data) {
            var cardNumber, cards = [];
            if (data) {
                if (data.indexOf(",")) {
                    data = data.split(",");
                    data.map(function(dataItem) {
                        cardNumber = dataItem.substring(dataItem.length - OLBConstants.MASKED_CARD_NUMBER_LENGTH, dataItem.length);
                        cards.push({
                            "number": cardNumber
                        });
                    });
                } else {
                    data.map(function(dataItem) {
                        cardNumber = dataItem.substring(dataItem.length - OLBConstants.MASKED_CARD_NUMBER_LENGTH, dataItem.length);
                        cards.push({
                            "number": cardNumber
                        });
                    });
                }
                this.notificationObject.selectedcards = cards;
            }
        },
        /**
         * Method to set destinations for edit travel notification
         * @param {Object} - locationsObject
         */
        setDestinations: function(data) {
            var self = this;
            var destinations = [];
            if (data) {
                var dataMap = {
                    "lblDestination": "lblDestination",
                    "lblPlace": "lblPlace",
                    "lblAnotherDestination": "lblAnotherDestination",
                    "lblSeparator2": "lblSeparator2",
                    "imgClose": "imgClose",
                    "flxClose":"flxClose",
                    "flxSelectDestination":"flxSelectDestination"
                };
                if (data.indexOf("-") > 0) {
                    data = data.split("-");
                    data.forEach(function(dataItem) {
                        var segData = {
                            "lblDestination": {
                                "text": kony.i18n.getLocalizedString('i18n.CardManagement.destination'),
                                "accessibilityconfig": {
                                    "a11yLabel": kony.i18n.getLocalizedString('i18n.CardManagement.destination')
                                }
                            },
                            "lblPlace": {
                                "text": dataItem,
                                "accessibilityconfig": {
                                    "a11yLabel": dataItem
                                }
                            },
                            "imgClose": {
                                 "src": "icon_close_grey.png"
                                //"onTouchEnd": self.removeAddressFromList.bind(self)
                            },
                          "flxClose":{
                         "isVisible": true,
                         "onClick": self.removeAddressFromList.bind(self)
                       },
                            "lblSeparator2": "a"
                        };
                        destinations.push(segData);
                    })
                } else {
                    var segData = {
                        "lblDestination": kony.i18n.getLocalizedString('i18n.CardManagement.destination'),
                        "lblPlace": {
                            "text": data,
                            "accessibilityconfig": {
                                "a11yLabel": data
                            }
                        },
                        "imgClose": {
                             "src": "icon_close_grey.png"
                            //"onTouchEnd": self.removeAddressFromList.bind(self)
                        },
                        "flxClose":{
                        "isVisible": true,
                        "onClick": self.removeAddressFromList.bind(self)
                       },
                        "lblSeparator2": "a"
                    };
                    destinations.push(segData);
                }
                this.view.segDestinations.widgetDataMap = dataMap;
                destinations.forEach(function(item, value) {
                    item.lblDestination = kony.i18n.getLocalizedString("i18n.CardManagement.destination") + " " + (value + 1);
                })
                this.travelPlanDestinationList=destinations;
                this.view.segDestinations.setData(destinations);
            }
            this.validateTravelPlanData();
        },
        /**
         * Method to remove address from the list of address for create/edit travel notification
         */
        removeAddressFromList: function() {
            var self = this;
            var index = this.view.segDestinations.selectedRowIndex;
            if (index) {
                this.view.segDestinations.removeAt(index[1]);
            }
            var data = this.view.segDestinations.data;
            data.forEach(function(item, value) {
                item.lblDestination = {
                    "text": kony.i18n.getLocalizedString("i18n.CardManagement.destination") + " " + (value + 1),
                    "accessibilityconfig": {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.destination") + " " + (value + 1)
                    }
                };
            });
            this.view.segDestinations.setData(data);
            self.validateTravelPlanData();
        },
        /**
         * Method to validate the data entered by user for creating/editing travel notification
         */
        validateTravelPlanData: function() {
            var self = this;
            var validationUtilityManager = applicationManager.getValidationUtilManager();
            if (this.view.txtPhoneNumber.text !== "") {
                if (validationUtilityManager.isValidPhoneNumber(this.view.txtPhoneNumber.text) && this.view.txtPhoneNumber.text.length == 10 && this.view.segDestinations.data.length > 0) {
                    FormControllerUtility.enableButton(this.view.btnContinue);
                } else {
                    FormControllerUtility.disableButton(this.view.btnContinue);
                }
            } else {
                FormControllerUtility.disableButton(this.view.btnContinue);
            }
        },
        /**
         * Method to get date component
         * @param {string} - Date string
         * @returns {Object} - dateComponent Object
         */
        getDateComponent: function(dateString) {
            var dateObj = applicationManager.getFormatUtilManager().getDateObjectFromCalendarString(dateString, (applicationManager.getFormatUtilManager().getDateFormat()).toUpperCase());
            return [dateObj.getDate(), dateObj.getMonth() + 1, dateObj.getFullYear()];
        },
        /**
         * Shows the acknowledgement screen based on the action.
         * @param {Object} - card object.
         * @param {String} - contains the actino to be performed.
         */
        showAcknowledgementScreen: function(card, action) {
            if (action === kony.i18n.getLocalizedString("i18n.CardManagement.ActivateCard")) {
                var self = this;
                CommonUtilities.hideProgressBar(self.view);
                var accountDetails = applicationManager.getAccountManager().getInternalAccountByID(card.maskedAccountNumber);
                this.hideAllCardManagementViews();
                this.view.ConfirmDialog.confirmButtons.setVisibility(false);
                this.view.flxAcknowledgment.setVisibility(true);
                this.view.ConfirmDialog.flxDestination.setVisibility(false);
                this.view.ConfirmDialog.flxSelectCards.setVisibility(false);
                this.view.btnRequestReplacement.setVisibility(false);
                this.view.btnBackToCards.skin = "sknBtnffffffBorder0273e31pxRadius2px";
                this.view.btnRequestReplacement.skin = "sknBtnffffffBorder0273e31pxRadius2px";
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                if (card.isExpiring === "0") {
                    CommonUtilities.setText(this.view.lblCardAcknowledgement, kony.i18n.getLocalizedString("i18n.CardManagement.ActivateACard"), accessibilityConfig);
                    CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, kony.i18n.getLocalizedString("i18n.CardManagement.CardActivated"), accessibilityConfig);
                    CommonUtilities.setText(this.view.ConfirmDialog.confirmHeaders.lblHeading, kony.i18n.getLocalizedString("i18n.CardManagement.NewCardDetails"), accessibilityConfig);
                    this.view.Acknowledgement.lblUnlockCardMessage.setVisibility(false);
                    this.view.Acknowledgement.btnLearnAbout.setVisibility(false);
                } else {
                    CommonUtilities.setText(this.view.lblCardAcknowledgement, kony.i18n.getLocalizedString("i18n.CardManagement.ActivateRenewalCard"), accessibilityConfig);
                    CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, kony.i18n.getLocalizedString("i18n.CardManagement.RenewedCardActivated"), accessibilityConfig);
                    CommonUtilities.setText(this.view.ConfirmDialog.confirmHeaders.lblHeading, kony.i18n.getLocalizedString("i18n.CardManagement.CardDetails"), accessibilityConfig);
                    CommonUtilities.setText(this.view.Acknowledgement.lblUnlockCardMessage, kony.i18n.getLocalizedString("i18n.CardManagement.CutOldCard"), accessibilityConfig);
                    this.view.Acknowledgement.lblUnlockCardMessage.setVisibility(true);
                    this.view.Acknowledgement.btnLearnAbout.setVisibility(true);
                }
                CommonUtilities.setText(this.view.Acknowledgement.lblRequestID, kony.i18n.getLocalizedString("i18n.CardManagement.requestId"), accessibilityConfig);
                CommonUtilities.setText(this.view.Acknowledgement.lblRefrenceNumber, card.orderId, accessibilityConfig);
                CommonUtilities.setText(this.view.Acknowledgement.btnLearnAbout, kony.i18n.getLocalizedString("i18n.CardManagement.LearnMore"), accessibilityConfig);
                this.view.Acknowledgement.lblRequestID.setVisibility(true);
                this.view.Acknowledgement.lblRefrenceNumber.setVisibility(true);
                CommonUtilities.setText(this.view.Acknowledgement.confirmHeaders.lblHeading, kony.i18n.getLocalizedString("i18n.transfers.Acknowledgement"), accessibilityConfig);
                this.view.btnBackToCards.toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.GoToMyDashboard");
                CommonUtilities.setText(this.view.btnBackToCards, kony.i18n.getLocalizedString("i18n.CardManagement.GoToMyDashboard"), accessibilityConfig);
                this.view.btnBackToCards.onClick = function() {
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AccountsUIModule", "appName" : "HomepageMA"}).presentationController.showAccountsDashboard();
                }
                this.view.Acknowledgement.btnLearnAbout.onClick = function() {
                    window.open("https://www.google.com/");
                };
                this.view.flxPrint.setVisibility(false);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardHolder.lblKey, kony.i18n.getLocalizedString("i18n.CardManagement.Card"), accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardName.lblKey, kony.i18n.getLocalizedString("i18n.ChequeBookReq.account"), accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueValidThrough.lblKey, kony.i18n.getLocalizedString("i18n.CardManagement.NameOnCard"), accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardHolder.lblValue, card.productName + " - " + card.maskedCardNumber, accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardName.lblValue, card.maskedNickNameAndNumber, accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueValidThrough.lblValue, card.cardHolder, accessibilityConfig);
                this.view.ConfirmDialog.keyValueCardHolder.setVisibility(true);
                this.view.ConfirmDialog.keyValueCardName.setVisibility(true);
                this.view.ConfirmDialog.keyValueValidThrough.setVisibility(true);
                this.view.ConfirmDialog.keyValueServiceProvider.setVisibility(false);
                this.view.ConfirmDialog.keyValueCreditLimit.setVisibility(false);
                this.view.ConfirmDialog.keyValueAvailableCredit.setVisibility(false);
                this.view.btnRequestReplacement.setVisibility(true);
                this.view.btnRequestReplacement.toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.GoToMyCards");
                CommonUtilities.setText(this.view.btnRequestReplacement, kony.i18n.getLocalizedString("i18n.CardManagement.GoToMyCards"), accessibilityConfig);
                this.view.btnRequestReplacement.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
                this.AdjustScreen();
            } else {
                this.showCardOperationAcknowledgement(card, action);
            }

        },
        /**
         * Shows the acknowledgement screen based on the action.
         * @param {Object} - card object.
         * @param {String} - contains the actino to be performed.
         */
        showCardOperationAcknowledgement: function(card, action) {
            var self = this;
            CommonUtilities.hideProgressBar(self.view);
            this.hideAllCardManagementViews();
            this.view.ConfirmDialog.confirmButtons.setVisibility(false);
            this.view.flxAcknowledgment.setVisibility(true);
            this.view.Acknowledgement.btnLearnAbout.setVisibility(false);
            this.view.ConfirmDialog.flxDestination.setVisibility(false);
            this.view.ConfirmDialog.flxSelectCards.setVisibility(false);
            this.view.btnRequestReplacement.setVisibility(false);
            switch (action) {
                case kony.i18n.getLocalizedString("i18n.CardManagement.LockCard"): {
                    this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.LockCardAcknowledgement"));
                    var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                    CommonUtilities.setText(this.view.lblCardAcknowledgement, kony.i18n.getLocalizedString("i18n.CardManagement.LockCard"), accessibilityConfig);
                    CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, kony.i18n.getLocalizedString("i18n.CardManagement.AckMessage1"), accessibilityConfig);
                    this.view.Acknowledgement.lblUnlockCardMessage.setVisibility(true);
                    CommonUtilities.setText(this.view.Acknowledgement.lblUnlockCardMessage, kony.i18n.getLocalizedString("i18n.CardManagement.AckMessage2"), accessibilityConfig);
                    this.view.Acknowledgement.lblRequestID.setVisibility(true);
                    this.view.Acknowledgement.lblRefrenceNumber.setVisibility(true);
                    break;
                }
                case "Offline_Change_Pin": {
                    this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.ChangePinAcknowledgement"));
                    var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                    CommonUtilities.setText(this.view.lblCardAcknowledgement, kony.i18n.getLocalizedString("i18n.CardManagement.ChangeCardPin"), accessibilityConfig);
                    CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, card.cardType === 'Debit' ? kony.i18n.getLocalizedString("i18n.CardManagement.SuccessfulChangePinAckMessage") : kony.i18n.getLocalizedString("i18n.CardManagement.SucessfulChangePinRequestAckMessage"), accessibilityConfig);
                    this.view.Acknowledgement.lblUnlockCardMessage.setVisibility(false);
                    this.view.Acknowledgement.lblRequestID.setVisibility(false);
                    this.view.Acknowledgement.lblRefrenceNumber.setVisibility(false);
                    break;
                }
                case kony.i18n.getLocalizedString("i18n.CardManagement.ChangePin"): {
                    this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.ChangePinAcknowledgement"));
                    var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                    CommonUtilities.setText(this.view.lblCardAcknowledgement, kony.i18n.getLocalizedString("i18n.CardManagement.ChangeCardPin"), accessibilityConfig);
                    CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, card.cardType === 'Debit' ? kony.i18n.getLocalizedString("i18n.CardManagement.SuccessfulChangePinAckMessage") : kony.i18n.getLocalizedString("i18n.CardManagement.SucessfulChangePinRequestAckMessage"), accessibilityConfig);
                    this.view.Acknowledgement.lblUnlockCardMessage.setVisibility(false);
                    this.view.Acknowledgement.lblRequestID.setVisibility(true);
                    this.view.Acknowledgement.lblRefrenceNumber.setVisibility(true);
                    break;
                }
                case kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCard"): {
                    this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCardAcknowledgement"));
                    var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                    CommonUtilities.setText(this.view.lblCardAcknowledgement, kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCard"), accessibilityConfig);
                    CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, kony.i18n.getLocalizedString("i18n.CardManagement.SuccessfulUnlockCardAckMessage"), accessibilityConfig);
                    this.view.Acknowledgement.lblUnlockCardMessage.setVisibility(false);
                    this.view.Acknowledgement.lblRequestID.setVisibility(true);
                    this.view.Acknowledgement.lblRefrenceNumber.setVisibility(true);
                    break;
                }
                case kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost"): {
                    this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.LostOrStolenCardAcknowledgement"));
                    var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                    CommonUtilities.setText(this.view.lblCardAcknowledgement, kony.i18n.getLocalizedString("i18n.CardManagement.LostOrStolenLower"), accessibilityConfig);
                    CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, kony.i18n.getLocalizedString("i18n.CardManagement.SucessfulRequestAckMessage"), accessibilityConfig);
                    this.view.Acknowledgement.lblUnlockCardMessage.setVisibility(false);
                    CommonUtilities.setText(this.view.btnRequestReplacement, kony.i18n.getLocalizedString("i18n.CardManagement.RequestReplacement"), accessibilityConfig);
                    this.view.btnRequestReplacement.toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.RequestReplacement");
                    this.view.btnRequestReplacement.setVisibility(true);
                    this.view.btnRequestReplacement.onClick = function() {
                        self.replaceCard(card);
                    };
                    this.view.Acknowledgement.lblRequestID.setVisibility(true);
                    this.view.Acknowledgement.lblRefrenceNumber.setVisibility(true);
                    break;
                }
                case kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.requestReplaceCard"): {
                    this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.ReplaceCardAcknowledgement"));
                    var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                    CommonUtilities.setText(this.view.lblCardAcknowledgement, kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.requestReplaceCard"), accessibilityConfig);
                    CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, kony.i18n.getLocalizedString("i18n.CardManagement.SucessfulRequestAckMessage"), accessibilityConfig);
                    this.view.Acknowledgement.lblUnlockCardMessage.setVisibility(false);
                    this.view.Acknowledgement.lblRequestID.setVisibility(true);
                    this.view.Acknowledgement.lblRefrenceNumber.setVisibility(true);
                    break;
                }
                case kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard"): {
                    this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.cardsManagement.cancelAck"));
                    var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                    CommonUtilities.setText(this.view.lblCardAcknowledgement, kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard"), accessibilityConfig);
                    CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, kony.i18n.getLocalizedString("i18n.cardsManagement.cancelMsg"), accessibilityConfig);
                    this.view.Acknowledgement.lblUnlockCardMessage.setVisibility(false);
                    this.view.Acknowledgement.lblRequestID.setVisibility(true);
                    this.view.Acknowledgement.lblRefrenceNumber.setVisibility(true);
                    break;
                }
            }
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.Acknowledgement.confirmHeaders.lblHeading, kony.i18n.getLocalizedString("i18n.transfers.Acknowledgement"), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.confirmHeaders.lblHeading, kony.i18n.getLocalizedString("i18n.CardManagement.CardDetails"), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardHolder.lblKey, kony.i18n.getLocalizedString("i18n.CardManagement.CardHolder"), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardHolder.lblValue, card.cardHolder, accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardName.lblKey, kony.i18n.getLocalizedString("i18n.CardManagement.CardNumber"), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardName.lblValue, card.maskedCardNumber, accessibilityConfig);
            this.view.ConfirmDialog.keyValueValidThrough.setVisibility(false);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueValidThrough.lblKey, kony.i18n.getLocalizedString("i18n.CardManagement.ValidThrough"), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueValidThrough.lblValue, card.validThrough, accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueServiceProvider.lblKey, kony.i18n.getLocalizedString("i18n.CardManagement.ServiceProvider"), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueServiceProvider.lblValue, card.serviceProvider, accessibilityConfig);
            CommonUtilities.setText(this.view.Acknowledgement.lblRequestID, kony.i18n.getLocalizedString("i18n.CardManagement.requestId"), accessibilityConfig);
            CommonUtilities.setText(this.view.Acknowledgement.lblRefrenceNumber, card.orderId, accessibilityConfig);
            this.view.ConfirmDialog.keyValueCardHolder.setVisibility(true);
            this.view.ConfirmDialog.keyValueCardName.setVisibility(true);
            this.view.ConfirmDialog.keyValueServiceProvider.setVisibility(true);
            //if(applicationManager.getConfigurationManager().isCombinedUser === "true"){
            if (applicationManager.getUserPreferencesManager().isSingleCustomerProfile === false) {
                this.view.ConfirmDialog.keyValueName.setVisibility(true);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueName.lblKey, kony.i18n.getLocalizedString("i18n.CardManagement.cardName"), accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueName.lblValue, card.productName, accessibilityConfig);
                this.view.ConfirmDialog.keyValueName.lblIcon.text = card.isTypeBusiness === "1" ? "r" : "s"
            } else {
                this.view.ConfirmDialog.keyValueName.setVisibility(false);
            }
            if (card.cardType === 'Credit') {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                this.view.ConfirmDialog.keyValueAvailableCredit.setVisibility(true);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueCreditLimit.lblKey, kony.i18n.getLocalizedString("i18n.accountDetail.creditLimit"), accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueCreditLimit.lblValue, card.creditLimit, accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueAvailableCredit.lblKey, kony.i18n.getLocalizedString("i18n.accountDetail.availableCredit"), accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueAvailableCredit.lblValue, card.availableCredit, accessibilityConfig);
            } else if (card.cardType === 'Debit') {
                this.view.ConfirmDialog.keyValueAvailableCredit.setVisibility(false);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueCreditLimit.lblKey, kony.i18n.getLocalizedString("i18n.CardManagement.WithdrawalLimit"), accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueCreditLimit.lblValue, card.dailyWithdrawalLimit, accessibilityConfig);
            }
			this.view.btnBackToCards.setVisibility(true);
            this.view.ConfirmDialog.keyValueCreditLimit.setVisibility(true);
            this.view.btnBackToCards.toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.BackToCards");
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.btnBackToCards, kony.i18n.getLocalizedString("i18n.CardManagement.BackToCards"), accessibilityConfig);
            this.view.flxPrint.onClick = this.printAcknowlegement;
            this.view.btnBackToCards.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
            this.AdjustScreen();
        },
        /**
         *  Entry point for replace card flow.
         * @param {Object} - card object.
         */
        cancelCard: function(card) {
            this.showCancelCardView();
            this.setCancelCardButtonsActions(card);
            this.setCardDetails(card);
            this.view.forceLayout();
            this.AdjustScreen();
        },
        showCancelCardView: function() {
            this.hideAllCardManagementViews();
            this.hideAllCardManagementRightViews();
            this.view.flxCardVerification.setVisibility(true);
            this.view.CardLockVerificationStep.setVisibility(true);
            this.view.CardLockVerificationStep.flxLeft.setVisibility(true);
            this.view.CardLockVerificationStep.flxWarning2.setVisibility(true);
            this.view.CardLockVerificationStep.flxCardReplacement.setVisibility(true);
            this.view.CardLockVerificationStep.lblUpgrade.setVisibility(false);
            this.view.CardLockVerificationStep.flxAddresslabel.setVisibility(false);
            this.view.CardLockVerificationStep.flxAddress.setVisibility(false);
            FormControllerUtility.disableButton(this.view.CardLockVerificationStep.confirmButtons.btnConfirm);
            CommonUtilities.setCheckboxState(false, this.view.CardLockVerificationStep.CardActivation.imgChecbox);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardLockVerificationStep.confirmHeaders.lblHeading, kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.WarningMessage.rtxWarningText1, kony.i18n.getLocalizedString("i18n.cardsManagement.cancelWarn1"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.WarningMessage.rtxWarningText2, kony.i18n.getLocalizedString("i18n.cardsManagement.cancelWarn2"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.WarningMessage.rtxWarningText3, kony.i18n.getLocalizedString("i18n.cardsManagement.cancelWarn3"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.WarningMessage.rtxWarningText4, kony.i18n.getLocalizedString("i18n.cardsManagement.cancelWarn4"), accessibilityConfig);
            this.view.CardLockVerificationStep.lblReason2.setVisibility(true);
            this.view.CardLockVerificationStep.lbxReason2.setVisibility(true);
            this.view.CardLockVerificationStep.WarningMessage.flxIAgree.setVisibility(true);
            CommonUtilities.setCheckboxState(false, this.view.CardLockVerificationStep.WarningMessage.imgChecbox);
            CommonUtilities.setText(this.view.CardLockVerificationStep.lblReason2, kony.i18n.getLocalizedString("i18n.CardManagement.PleaseEnterTheReasonMessage"), accessibilityConfig);
            var reasonMasterData = [];
            reasonMasterData.push(["Reason1", kony.i18n.getLocalizedString("i18n.cardManagement.privacy")]);
            reasonMasterData.push(["Reason2", kony.i18n.getLocalizedString("i18n.cardsManagement.annualCharges")]);
            reasonMasterData.push(["Reason3", kony.i18n.getLocalizedString("i18n.cardsManagement.others")]);
            this.view.CardLockVerificationStep.lbxReason2.masterData = reasonMasterData;
            this.view.CardLockVerificationStep.lbxReason2.selectedKey = "Reason1";
            this.view.forceLayout();
            this.AdjustScreen();
        },
        setCancelCardButtonsActions: function(card) {
            var self = this;
            var buttonsJSON = {
                'btnConfirm': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString('i18n.common.proceed'),
                    'toolTip': kony.i18n.getLocalizedString('i18n.common.proceed')
                },
                'btnModify': {
                    'isVisible': false,
                    'text': kony.i18n.getLocalizedString("i18n.common.modifiy"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.common.modifiy")
                },
                'btnCancel': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
                },
            };
            this.alignConfirmButtons(buttonsJSON);
            this.view.CardLockVerificationStep.confirmButtons.btnCancel.onClick = function() {
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards();
            };
            if (CommonUtilities.isCSRMode()) {
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = CommonUtilities.disableButtonActionForCSRMode();
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.skin = CommonUtilities.disableButtonSkinForCSRMode();
            } else {
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = function() {
                    var params = {
                        'card': card,
                        'Action': 'Cancel Card',
                        'Reason': self.view.CardLockVerificationStep.lbxReason2.selectedKeyValue[1],
                        'notes': ""
                    };
                    self.initMFAFlow.call(self, params, kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard"));
                }.bind(this);
            }
            this.view.CardLockVerificationStep.WarningMessage.flxCheckbox.onTouchEnd = function() {
                CommonUtilities.toggleCheckBox(self.view.CardLockVerificationStep.WarningMessage.imgChecbox);
                if (CommonUtilities.isChecked(self.view.CardLockVerificationStep.WarningMessage.imgChecbox)) {
                    FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    CommonUtilities.setCheckboxState(true, self.view.CardLockVerificationStep.WarningMessage.imgChecbox);
                } else {

                    FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    CommonUtilities.setCheckboxState(false, self.view.CardLockVerificationStep.WarningMessage.imgChecbox);
                }
            };
            this.setCheckBoxToggleProperty();
            this.AdjustScreen();
            this.view.forceLayout();
        },
        setCheckBoxToggleProperty: function() {
            var self = this;
            this.view.CardLockVerificationStep.WarningMessage.btnTermsAndConditions.onClick = function() {
                self.view.flxTermsAndConditionsPopUp.height = (self.view.flxMain.info.frame.height + 355) + "dp";
                self.view.flxTC.top = "100dp";
                self.view.flxTermsAndConditionsPopUp.setVisibility(true);
                self.view.lblTermsAndConditions.setFocus(true);
                if (CommonUtilities.isChecked(self.view.CardLockVerificationStep.WarningMessage.imgChecbox)) {
                    CommonUtilities.setLblCheckboxState(true, self.view.lblTCContentsCheckboxIcon);
                } else {
                    CommonUtilities.setLblCheckboxState(false, self.view.lblTCContentsCheckboxIcon);
                }
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.showTermsAndConditionsCancelCard();
            };
            this.view.btnCancel.onClick = function() {
                self.view.flxTermsAndConditionsPopUp.setVisibility(false);
            };
            this.view.flxClose.onClick = function() {
                self.view.flxTermsAndConditionsPopUp.setVisibility(false);
            };
            this.view.flxTCContentsCheckbox.onClick = function() {
                CommonUtilities.toggleFontCheckbox(self.view.lblTCContentsCheckboxIcon);
            };
            this.view.btnSave.onClick = function() {
                if (CommonUtilities.isFontIconChecked(self.view.lblTCContentsCheckboxIcon)) {
                    FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    CommonUtilities.setCheckboxState(true, self.view.CardLockVerificationStep.WarningMessage.imgChecbox);
                } else {
                    FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    CommonUtilities.setCheckboxState(false, self.view.CardLockVerificationStep.WarningMessage.imgChecbox);
                }
                self.view.flxTermsAndConditionsPopUp.setVisibility(false);
            };
        },
        /**
         *  Entry point for replace card flow.
         * @param {Object} - card object.
         */
        replaceCard: function(card) {
            this.showCardReplacementView();
            this.setCardDetails(card);
            this.showCardReplacementGuildlines(card);
            this.setMobileHeader(kony.i18n.getLocalizedString("i18n.CardManagement.cardReplacement"));
            this.view.forceLayout();
            this.AdjustScreen();
            this.view.CardLockVerificationStep.confirmHeaders.lblHeading.setFocus(true);
        },
        /**
         * Method to show replaced card details
         */
        showCardReplacementView: function() {
            this.hideAllCardManagementViews();
            this.hideAllCardManagementRightViews();
            this.view.flxCardVerification.setVisibility(true);
            this.view.CardLockVerificationStep.setVisibility(true);
            this.view.CardLockVerificationStep.flxLeft.setVisibility(true);
            this.view.CardLockVerificationStep.flxCardReplacement.setVisibility(true);
            this.view.CardLockVerificationStep.lblUpgrade.setVisibility(false);
            this.view.flxTermsAndConditions.setVisibility(true);
            this.view.CardLockVerificationStep.WarningMessage.flxIAgree.setVisibility(false);
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * Method to show guidelines card replacement.
         * @param {Object} - card object
         */
        showCardReplacementGuildlines: function(card) {
            var self = this;
            var isPrimaryAvailable = false;
            this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.cardReplacement"));
            CommonUtilities.setText(this.view.CardLockVerificationStep.WarningMessage.rtxWarningText1, kony.i18n.getLocalizedString("i18n.CardManagement.replaceCardGuidline1"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.WarningMessage.rtxWarningText2, kony.i18n.getLocalizedString("i18n.CardManagement.replaceCardGuidline2"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.WarningMessage.rtxWarningText3, kony.i18n.getLocalizedString("i18n.CardManagement.replaceCardGuidline3"), accessibilityConfig);
            this.view.CardLockVerificationStep.WarningMessage.flxWarningText4.setVisibility(false);
            this.view.CardLockVerificationStep.lblReason2.setVisibility(false);
            this.view.CardLockVerificationStep.lbxReason2.setVisibility(false);
            this.view.CardLockVerificationStep.lblUpgrade.setVisibility(false);
            this.view.CardLockVerificationStep.flxAddresslabel.setVisibility(true);
            this.view.CardLockVerificationStep.flxAddress.setVisibility(true);
            this.view.CardLockVerificationStep.tbxNoteOptional.text = "";
            this.view.CardLockVerificationStep.tbxNoteOptional.maxTextLength = OLBConstants.NOTES_LENGTH;
            this.view.CardLockVerificationStep.lblReason2.setVisibility(true);
            this.view.CardLockVerificationStep.lbxReason2.setVisibility(true);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardLockVerificationStep.lblReason2, kony.i18n.getLocalizedString("i18n.CardsManagement.replaceReason"), accessibilityConfig);
            var reasonMasterData = [];
            reasonMasterData.push(["Reason1", kony.i18n.getLocalizedString("i18n.CardsManagement.replaceReason1")]);
            reasonMasterData.push(["Reason2", kony.i18n.getLocalizedString("i18n.CardsManagement.damageCard")]);
            reasonMasterData.push(["Reason3", kony.i18n.getLocalizedString("i18n.cardsManagement.others")]);
            this.view.CardLockVerificationStep.lbxReason2.masterData = reasonMasterData;
            this.view.CardLockVerificationStep.lbxReason2.selectedKey = "Reason1";
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardLockVerificationStep.lblAddress, kony.i18n.getLocalizedString("i18n.CardManagement.addressforcards"), accessibilityConfig);
            var addressObject = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.fetchUserAddresses();
            var addressArray = [];
            for (var addressIndex = 0; addressIndex < 3; addressIndex = addressIndex + 1) { //To reset all the radio buttons to off state.
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                this.view.CardLockVerificationStep["lblAddressCheckBox" + (addressIndex + 1)].text = "L";
                this.view.CardLockVerificationStep["lblAddressCheckBox" + (addressIndex + 1)].skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
            }
            if (addressObject) {
                addressObject.forEach(function(dataItem) {
                    var finalData;
					if (dataItem.AddressLine1 !== "" && dataItem.AddressLine1 !== undefined && dataItem.AddressLine1 !== null) finalData = dataItem.AddressLine1;
                    if (dataItem.AddressLine2 && finalData !== undefined) finalData = finalData + "," + dataItem.AddressLine2;
					else finalData = dataItem.AddressLine2;
					if(dataItem.CityName)
						finalData= finalData+","+dataItem.CityName;
					if(dataItem.CountryName)
						finalData= finalData+","+dataItem.CountryName;
					if(dataItem.ZipCode)
						finalData= finalData+","+dataItem.ZipCode;
					addressArray.push(finalData);
                });
            }
            if (addressObject) {
                for (var addressIndex = 0; addressIndex < addressObject.length && addressIndex < 3; addressIndex = addressIndex + 1) {
                    if (addressObject[addressIndex].isPrimary == "true") {
                        var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                        isPrimaryAvailable = true;
                        this.view.CardLockVerificationStep["lblAddressCheckBox" + (addressIndex + 1)].text = "M";
                        this.view.CardLockVerificationStep["lblAddressCheckBox" + (addressIndex + 1)].skin = "sknlblOLBFonts0273E420pxOlbFontIcons";
                        this.view.CardLockVerificationStep["lblAddressCheckBox" + (addressIndex + 1)].toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.PrimaryAddress");
                    } else {
                        var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                        this.view.CardLockVerificationStep["lblAddressCheckBox" + (addressIndex + 1)].text = "L";
                        this.view.CardLockVerificationStep["lblAddressCheckBox" + (addressIndex + 1)].skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
                        this.view.CardLockVerificationStep["lblAddressCheckBox" + (addressIndex + 1)].toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.SecondaryAddress");
                    }
                }
            }
            if (!isPrimaryAvailable) {
                this.view.CardLockVerificationStep.lblAddressCheckBox1.text = "M";
                this.view.CardLockVerificationStep.lblAddressCheckBox1.skin = "sknlblOLBFonts0273E420pxOlbFontIcons";
            }
            if (addressArray[0]) {
                this.view.CardLockVerificationStep.rtxAddress1.setVisibility(true);
                this.view.CardLockVerificationStep.flxAddressCheckbox1.setVisibility(true);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.CardLockVerificationStep.rtxAddress1, addressArray[0], accessibilityConfig);
            } else {
                this.view.CardLockVerificationStep.flxAddress.setVisibility(false);
                this.view.CardLockVerificationStep.flxAddresslabel.setVisibility(false);
                this.view.CardLockVerificationStep.rtxAddress1.setVisibility(false);
                this.view.CardLockVerificationStep.flxAddressCheckbox1.setVisibility(false);
            }
            if (addressArray[1]) {
                this.view.CardLockVerificationStep.rtxAddress2.setVisibility(true);
                this.view.CardLockVerificationStep.flxAddressCheckbox2.setVisibility(true);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.CardLockVerificationStep.rtxAddress2, addressArray[1], accessibilityConfig);
            } else {
                this.view.CardLockVerificationStep.flxAddressCheckbox2.setVisibility(false);
                this.view.CardLockVerificationStep.rtxAddress2.setVisibility(false);
            }
            if (addressArray[2]) {
                this.view.CardLockVerificationStep.rtxAddress3.setVisibility(true);
                this.view.CardLockVerificationStep.flxAddressCheckbox3.setVisibility(true);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.CardLockVerificationStep.rtxAddress3, addressArray[2], accessibilityConfig);
            } else {
                this.view.CardLockVerificationStep.flxAddressCheckbox3.setVisibility(false);
                this.view.CardLockVerificationStep.rtxAddress3.setVisibility(false);
            }
            var checkBoxArray = [];
            checkBoxArray.push({
                'flex1': this.view.CardLockVerificationStep.flxAddressCheckbox1,
                'flex2': this.view.CardLockVerificationStep.flxAddressCheckbox2,
                'flex3': this.view.CardLockVerificationStep.flxAddressCheckbox3
            });
            this.view.CardLockVerificationStep.flxAddressCheckbox1.onTouchEnd = this.onRadioButtonSelection.bind(this, checkBoxArray);
            this.view.CardLockVerificationStep.flxAddressCheckbox2.onTouchEnd = this.onRadioButtonSelection.bind(this, checkBoxArray);
            this.view.CardLockVerificationStep.flxAddressCheckbox3.onTouchEnd = this.onRadioButtonSelection.bind(this, checkBoxArray);
            var buttonsJSON = {
                'btnConfirm': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString('i18n.common.proceed'),
                    'toolTip': kony.i18n.getLocalizedString('i18n.common.proceed')
                },
                'btnModify': {
                    'isVisible': false,
                    'text': kony.i18n.getLocalizedString("i18n.common.modifiy"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.common.modifiy")
                },
                'btnCancel': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
                },
            };
            this.alignConfirmButtons(buttonsJSON);
            this.view.CardLockVerificationStep.confirmButtons.btnCancel.onClick = function() {
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards();
            };
            if (CommonUtilities.isCSRMode()) {
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = CommonUtilities.disableButtonActionForCSRMode();
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.skin = CommonUtilities.disableButtonSkinForCSRMode();
            } else {
                if (this.view.CardLockVerificationStep.flxAddress.isVisible === true) {
                    FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = function() {
                        var params = {
                            'card': card,
                            'userName': kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.getUserName(),
                            'CardAccountNumber': card.maskedCardNumber,
                            'CardAccountName': card.maskedAccountNumber,
                            'AccountType': 'CARD',
                            'RequestCode': 'REPLACEMENT',
                            'Channel': OLBConstants.Channel,
                            'Address_id': self.getSelectedAddressId(),
                            'AdditionalNotes': self.view.CardLockVerificationStep.tbxNoteOptional.text,
                            'reason': self.view.CardLockVerificationStep.lbxReason2.selectedKeyValue[1]
                        };
                        self.initMFAFlow.call(self, params, kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.requestReplaceCard"));
                    }.bind(this);
                } else {
                    this.showServerError("The logged-in user does not have any addresses");
                    this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = CommonUtilities.disableButtonActionForCSRMode();
                    this.view.CardLockVerificationStep.confirmButtons.btnConfirm.skin = CommonUtilities.disableButtonSkinForCSRMode();
                }
            }
            this.AdjustScreen();
        },
        /**
         * Method to reset skin to calendar
         */
        setSkinToCalendar: function() {
            this.view.calFrom.skin = ViewConstants.SKINS.COMMON_CALENDAR_NOERROR;
            this.view.calTo.skin = ViewConstants.SKINS.COMMON_CALENDAR_NOERROR;
            this.view.lblWarningTravelPlan.setVisibility(false);
            this.AdjustScreen();
        },
        /**
         * Method to show creat travel notifications screen
         * @param {Object} - country , region(states) , city object
         */
        showAddNewTravelPlan: function(locationData) {
            var self = this;
            this.setSkinToCalendar();
            if (locationData) {
                if (locationData.country) {
                    this.setCountryObject(locationData.country);
                }
                if (locationData.states) {
                    this.setStatesObject(locationData.states);
                }
                if (locationData.city) {
                    this.setCitiesObject(locationData.city)
                }
            }
            if (self.view.lblManageTravelPlans.text === kony.i18n.getLocalizedString('i18n.CardManagement.AddNewTravelPlan')) {
                self.view.flxMyCards.setVisibility(false);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(self.view.lblMyCardsHeader, kony.i18n.getLocalizedString('i18n.CardManagement.CreateTravelPlan'), accessibilityConfig);
                self.view.lblRequestID.setVisibility(false);
                self.view.lblRequestNo.setVisibility(false);
                self.view.flxTravelPlan.setVisibility(true);
                this.view.lblWarningTravelPlan.setVisibility(false);
                this.view.calFrom.dateFormat = applicationManager.getFormatUtilManager().getDateFormat();
                this.view.calTo.dateFormat = applicationManager.getFormatUtilManager().getDateFormat();
                this.view.calFrom.onSelection = self.setSkinToCalendar;
                this.view.calTo.onSelection = self.setSkinToCalendar;
                this.view.flxOtherDestinations.setVisibility(false);
                FormControllerUtility.disableButton(this.view.btnContinue);
                this.setDefaultDataForNotifications();
                this.view.lblAnotherDestination.skin = 'skn3343a8labelSSPRegular40Pr';
                this.view.txtPhoneNumber.onKeyUp = self.validateTravelPlanData.bind(this);
                CommonUtilities.setText(this.view.btnCancel1, kony.i18n.getLocalizedString("i18n.transfers.Cancel"), accessibilityConfig);
                this.view.btnCancel1.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
                this.view.btnCancel1.onClick = function() {
                    if (self.notificationObject.isEditFlow) {
                        self.notificationObject.isEditFlow = false;
                    }
                    self.fetchTravelNotifications();
                }
                CommonUtilities.setText(this.view.btnContinue, kony.i18n.getLocalizedString("i18n.common.proceed"), accessibilityConfig);
                this.view.btnContinue.toolTip = kony.i18n.getLocalizedString("i18n.common.proceed");
                this.view.btnContinue.onClick = function() {
                    if (self.validateDateRange()) {
                        FormControllerUtility.showProgressBar(self.view);
                        self.view.lblWarningTravelPlan.setVisibility(false);
                        self.getDetailsOfNotification(self.notificationObject.isEditFlow);
                        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.getEligibleCards();
                    } else {
                        self.view.lblWarningTravelPlan.setVisibility(true);
                        var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                        CommonUtilities.setText(self.view.lblWarningTravelPlan, kony.i18n.getLocalizedString('i18n.CardManagement.invalidDateError'), accessibilityConfig);
                        self.view.calFrom.skin = ViewConstants.SKINS.SKNFF0000CAL;
                        self.view.calTo.skin = ViewConstants.SKINS.SKNFF0000CAL;
                    }
                }
                this.view.flxDestinationList.setVisibility(false);
                this.setFlowActions();
                this.view.forceLayout();
                this.AdjustScreen();
                CommonUtilities.hideProgressBar(this.view)
            }
        },
        /**
         * Method to set countryObject for create/edit travel notification
         * @param {Object} - countryObject
         */
        setCountryObject: function(countryList) {
            var self = this
            countryList.forEach(
                function(element) {
                    self.countries[element.id] = {
                        "name": element.Name
                    }
                })
        },
        /**
         * Method to set statesObject for create/edit travel notification
         * @param {Object} - stateObject(regionObject)
         */
        setStatesObject: function(stateList) {
            var self = this
            stateList.forEach(
                function(element) {
                    self.states[element.id] = {
                        "name": element.Name,
                        "country_id": element.Country_id
                    }
                })
        },
        /**
         * Method to set cityObject for create/edit travel notification
         * @param {Object} - cityObject
         */
        setCitiesObject: function(cityList) {
            var self = this
            cityList.forEach(
                function(element) {
                    self.cities[element.id] = {
                        "name": element.Name,
                        "state_id": element.Region_id,
                        "country_id": element.Country_id
                    }
                })
        },
        /**
         * Method to set default data for create/edit travel notification
         */
        setDefaultDataForNotifications: function() {
            var self = this;
            if (this.notificationObject.isEditFlow === true) {
                this.view.flxOtherDestinations.setVisibility(true);
                this.view.segDestinations.setData(JSON.parse(JSON.stringify(this.travelPlanDestinationList)))
                this.view.lblRequestID.setVisibility(true);
                this.view.lblRequestNo.setVisibility(true);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.lblManageTravelPlans, kony.i18n.getLocalizedString('i18n.CardManagement.AddNewTravelPlan'), accessibilityConfig);
                this.view.lblManageTravelPlans.toolTip = kony.i18n.getLocalizedString('i18n.CardManagement.AddNewTravelPlan');
                this.view.flxMangeTravelPlans.onClick = function() {
                    self.notificationObject.isEditFlow = false;
                    self.navigateToAddTravelNotification();
                }
                CommonUtilities.setText(this.view.lblMyCardsHeader, kony.i18n.getLocalizedString('i18n.CardManagement.editTravelPlan'), accessibilityConfig);
                self.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString('i18n.CardManagement.editTravelPlan'));
                FormControllerUtility.enableButton(this.view.btnContinue);
            } else {
                this.view.txtDestination.text = "";
                this.view.txtPhoneNumber.text = "";
                this.view.txtareaUserComments.text = "";
                this.view.segDestinations.setData([]);
                this.view.segDestinationList.setData([]);
                this.notificationObject.selectedcards = [];
                this.blockFutureDateSelection(self.view.calFrom);
                CommonUtilities.blockFutureDate(this.view.calTo, 60, kony.os.date());
                this.view.calFrom.dateComponents = self.getDateComponents(kony.os.date(applicationManager.getFormatUtilManager().getDateFormat()));
                this.view.calTo.dateComponents = self.getDateComponents(kony.os.date(applicationManager.getFormatUtilManager().getDateFormat()));
                this.view.calFrom.dateEditable = false;
                this.view.calTo.dateEditable = false;
                this.view.txtPhoneNumber.placeholder = kony.i18n.getLocalizedString("i18n.PayAPerson.EnterPhoneNumber");
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.lblManageTravelPlans, kony.i18n.getLocalizedString('i18n.CardManagement.ManageTravelPlans'), accessibilityConfig);
                this.view.lblManageTravelPlans.toolTip = kony.i18n.getLocalizedString('i18n.CardManagement.ManageTravelPlans');
                this.view.flxMangeTravelPlans.onClick = self.fetchTravelNotifications.bind(this);
                self.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString('i18n.CardManagement.CreateTravelPlan'));
            }
        },
        getDateComponents: function(dateString) {
            var dateObj = applicationManager.getFormatUtilManager().getDateObjectFromCalendarString(dateString, (applicationManager.getFormatUtilManager().getDateFormat()).toUpperCase())
            return [dateObj.getDate(), dateObj.getMonth() + 1, dateObj.getFullYear()];
        },
        /**
         * Method to block future date selection for create/edit travel notification screen
         * @param {Object} - widget reference
         */
        blockFutureDateSelection: function(widgetId) {
            CommonUtilities.blockFutureDate(this.view.calFrom, 60, kony.os.date());
        },
        setBreadCrumbAndHeaderDataForCardOperation: function(header) {
            this.view.breadcrumb.setVisibility(false);
            this.view.breadcrumb.setBreadcrumbData([{
                'text': kony.i18n.getLocalizedString("i18n.CardManagement.ManageCard"),
                'callback': kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController)
            }, {
                'text': header,
                'callback': null
            }]);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardLockVerificationStep.confirmHeaders.lblHeading, header, accessibilityConfig);
        },
        /**
         * Method to get details of the notification for creating/updating travel notification
         */
        getDetailsOfNotification: function(isEditFlow) {
            var self = this;
            var selectedcards = self.notificationObject.selectedcards;
            var requestId = this.notificationObject.requestId;
            self.notificationObject = {
                'fromDate': this.view.calFrom.formattedDate,
                'toDate': this.view.calTo.formattedDate,
                'phone': this.view.txtPhoneNumber.text,
                'notes': this.view.txtareaUserComments.text,
                'locations': self.getSelectedLocations()
            };
            if (selectedcards) {
                self.notificationObject.selectedcards = selectedcards;
            }
            if (isEditFlow) {
                self.notificationObject.isEditFlow = isEditFlow;
                self.notificationObject.requestId = requestId
            }
            return self.notificationObject;
        },
        /**
         * Method to get selected locations for create/edit travel notification
         * @returns {Object} selectedLocations object
         */
        getSelectedLocations: function() {
            var locationArray = this.view.segDestinations.data;
            var selectedLocations = [];
            for (var key in locationArray) {
                selectedLocations.push(locationArray[key].lblPlace.text);
            }
            return selectedLocations;
        },
        /**
         * Method to set country,regions(states),city in drop down for create/edit travel notification
         */
        setFlowActions: function() {
            var scope = this;
            this.view.txtDestination.onKeyUp = function() {
                scope.showTypeAhead();
            };
            this.view.segDestinationList.onRowClick = function() {
                var rowNo = scope.view.segDestinationList.selectedRowIndex[1];
                var dest = scope.view.segDestinationList.data[rowNo].lblListBoxValues;
                scope.view.txtDestination.text = dest.text;
                scope.view.txtDestination.onKeyUp = function() {
                    scope.showTypeAhead();
                    if (dest === scope.view.txtDestination.text) {
                        scope.enableAddButton();
                    } else {
                        scope.disableAddButton();
                    }
                }
                scope.enableAddButton();
                scope.view.flxDestinationList.setVisibility(false);
                scope.view.txtDestination.setFocus();
            };
        },
        /**
         * Method to show country,regions(states),city in drop down for create/edit travel notification
         */
        showTypeAhead: function() {
            var countryData = [];
            var newData = {};
            var stateId;
            var countryId;
            var key;
            var dataMap = {
                "flxCustomListBox": "flxCustomListBox",
                "lblListBoxValues": "lblListBoxValues"
            };
            var tbxText = this.toTitleCase(this.view.txtDestination.text);
            if (tbxText.length > 2) {
                for (key in this.cities) {
                    if (this.cities[key].name.indexOf('' + tbxText) === 0) {
                        stateId = this.cities[key].state_id;
                        countryId = this.cities[key].country_id;
                        newData = {
                            "countryId": countryId,
                            "lblListBoxValues": {
                                "text": this.countries[countryId].name + ", " + this.states[stateId].name + ", " + this.cities[key].name,
                                "accessibilityconfig": {
                                    "a11yLabel": this.countries[countryId].name + ", " + this.states[stateId].name + ", " + this.cities[key].name
                                }
                            },
                            "template": "flxCustomListBox"
                        };
                        countryData.push(newData);
                    }
                }
                for (key in this.states) {
                    if (this.states[key].name.indexOf('' + tbxText) === 0) {
                        countryId = this.states[key].country_id;
                        newData = {
                            "countryId": countryId,
                            "lblListBoxValues": {
                                "text": this.countries[countryId].name + ", " + this.states[key].name,
                                "accessibilityconfig": {
                                    "a11yLabel": this.countries[countryId].name + ", " + this.states[key].name
                                }
                            },
                            "template": "flxCustomListBox"
                        };
                        countryData.push(newData);
                    }
                }
                for (key in this.countries) {
                    if (this.countries[key].name.indexOf('' + tbxText) === 0) {
                        newData = {
                            "countryId": countryId,
                            "lblListBoxValues": {
                                "text": "" + this.countries[key].name,
                                "accessibilityconfig": {
                                    "a11yLabel": "" + this.countries[key].name
                                }
                            },
                            "template": "flxCustomListBox"
                        };
                        countryData.push(newData);
                    }
                }
                this.view.segDestinationList.widgetDataMap = dataMap;
                this.view.segDestinationList.setData(countryData);
                this.view.flxDestinationList.setVisibility(true);
                if (this.view.lblWarningTravelPlan.isVisible === true)
                    this.view.flxDestinationList.top = 275 + "dp";
                else if (this.view.lblRequestID.isVisible === true && this.view.lblRequestNo.isVisible === true)
                    this.view.flxDestinationList.top = 320 + "dp";
                else
                    this.view.flxDestinationList.top = 245 + "dp";
                this.view.forceLayout();
            } else {
                this.view.flxDestinationList.setVisibility(false);
            }
        },
        /**
         * Method to enable Add button on create/edit travel notification screen
         */
        enableAddButton: function() {
            var self = this;
            if (this.view.segDestinations.data.length < applicationManager.getConfigurationManager().numberOfLocations) {
                this.view.lblAnotherDestination.skin = "skn3343a8labelSSPRegular";
                this.view.flxAddFeatureRequestandimg.onClick = self.addAddressTOList;
            }
        },
        /**
         * Method to disable Add button on create/edit travel notification screen
         */
        disableAddButton: function() {
            this.view.lblAnotherDestination.skin = 'skn3343a8labelSSPRegular40Pr';
            this.view.flxAddFeatureRequestandimg.onClick = null;
        },
        /**
         * changeRowTemplate - Method to toggle row template(btween selected and unselected templates for My Cards) for selected row of segment
         */
        changeRowTemplate: function(dataItem) {
            var index = this.view.myCards.segMyCards.selectedRowIndex;
            var rowIndex = index[1];
            var data = this.view.myCards.segMyCards.data;
            for (var i = 0; i < data.length; i++) {
                if (i == rowIndex) {
                    if (data[i].template == "flxMyCardsCollapsed") {
                        data[i].flxDetailsRow3 = {
                                "isVisible": true
                            },
                            data[i].flxDetailsRow4 = {
                                "isVisible": true
                            },
                            data[i].imgCollapse = {
                                "src": ViewConstants.IMAGES.ARRAOW_UP,
                                "accessibilityconfig": {
                                    "a11yLabel": "View Details"
                                }
                            };
                        data[i].template = "flxMyCardsExpanded";
                    } else {
                        data[i].flxDetailsRow3 = {
                                "isVisible": dataItem && (dataItem.cardStatus === "Issued" || dataItem.isExpiring === '1') ? false : true
                            },
                            data[i].flxDetailsRow4 = {
                                "isVisible": false
                            },
                            data[i].imgCollapse = {
                                "src": ViewConstants.IMAGES.ARRAOW_DOWN,
                                "accessibilityconfig": {
                                    "a11yLabel": "View Details"
                                }
                            };
                        data[i].template = (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) ? "flxMyCardsCollapsedMobile" : "flxMyCardsCollapsed";
                    }
                }
                //               else {
                //                     data[i].imgCollapse = {
                //                         "src":ViewConstants.IMAGES.ARRAOW_DOWN,
                //                         "accessibilityconfig":{
                //                             "a11yLabel":"View Details"
                //                         }
                //                     };
                //                     data[i].template = kony.application.getCurrentBreakpoint()==640?"flxMyCardsCollapsedMobile":"flxMyCardsCollapsed";
                //                 }
            }
            this.view.myCards.segMyCards.setDataAt(data[rowIndex], rowIndex, index[0]);
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * Method that hides all right side flexes in frmCardManagement.
         */
        hideAllCardManagementRightViews: function() {
            this.view.CardLockVerificationStep.flxVerifyByOptions.setVisibility(false);
            this.view.CardLockVerificationStep.flxVerifyBySecureAccessCode.setVisibility(false);
            this.view.CardLockVerificationStep.flxVerifyBySecurityQuestions.setVisibility(false);
            this.view.CardLockVerificationStep.flxDeactivateCard.setVisibility(false);
            this.view.CardLockVerificationStep.flxTravelNotification.setVisibility(false);
            this.view.CardLockVerificationStep.flxChangeCardPin.setVisibility(false);
            this.view.CardLockVerificationStep.flxConfirmPIN.setVisibility(false);
            this.view.CardLockVerificationStep.flxCardReplacement.setVisibility(false);
        },
        /**
         * Method to show pop up for delete notification and register onClicks for custom pop up
         * @param {String} notificationId id of notification that is to be deleted
         */
        deleteNotification: function(notificationId) {
            var self = this;
            this.view.flxAlert.setVisibility(true);
            this.view.CustomAlertPopup.lblHeading.setFocus(true);
            var height = this.view.customheader.info.frame.height + this.view.flxMain.info.frame.height + this.view.flxFooter.info.frame.height;
            this.view.flxAlert.height = height + "dp";
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CustomAlertPopup.lblPopupMessage, kony.i18n.getLocalizedString("i18n.CardManagement.deleteTravelMsg") + " " + notificationId + " ?", accessibilityConfig);
            CommonUtilities.setText(this.view.CustomAlertPopup.lblHeading, kony.i18n.getLocalizedString("i18n.transfers.deleteExternalAccount"), accessibilityConfig);
            this.view.CustomAlertPopup.lblHeading.setFocus(true);
            this.view.CustomAlertPopup.btnYes.onClick = function() {
                FormControllerUtility.showProgressBar(self.view);
                self.view.flxAlert.setVisibility(false);
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.deleteNotification(notificationId);
            };
            this.view.CustomAlertPopup.flxCross.onClick = function() {
                self.view.flxAlert.isVisible = false;
            };
            this.view.CustomAlertPopup.btnNo.onClick = function() {
                self.view.flxAlert.isVisible = false;
            };
            this.view.forceLayout();
        },
        /**
         * Method to validate fromDate and toDate for create/edit travel notification screen
         */
        validateDateRange: function() {
            var startDateObject = applicationManager.getFormatUtilManager().getDateObjectFromCalendarString(this.view.calFrom.formattedDate, applicationManager.getFormatUtilManager().getDateFormat().toUpperCase());
            var endDateObject = applicationManager.getFormatUtilManager().getDateObjectFromCalendarString(this.view.calTo.formattedDate, applicationManager.getFormatUtilManager().getDateFormat().toUpperCase());
            if (startDateObject < endDateObject) {
                return true;
            }
            return false;
        },
        /**
         * Method to show cards selection screen
         * @param {Object} - cards object
         */
        showSelectCardScreen: function(cards) {
            var self = this;
            //var combinedUser = applicationManager.getConfigurationManager().isCombinedUser==="true";
            var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            var internationEligibleCards = [];
            if (this.isInternationalPlan()) {
                cards.forEach(function(item) {
                    if (item.isInternational == "true")
                        internationEligibleCards.push(item);
                });
                cards = internationEligibleCards;
            }
            if (cards.length > 0) {
                this.view.myCards.flxNoError.setVisibility(false);
                this.view.flxMyCards.setVisibility(true);
                this.view.flxMyCards.top = "0dp";
                var flxCardSkin = (kony.application.getCurrentBreakpoint() === 640) ? "sknFlxffffffRoundedBorder" : "slfBoxffffffB1R5";
                // this.view.flxMyCards.skin= flxCardSkin;
                this.view.flxEligibleCardsButtons.skin = flxCardSkin;
                this.view.myCards.segMyCards.setVisibility(true);
                this.view.myCards.lblMyCardsHeader.left = "20dp";
                this.view.flxTravelPlan.setVisibility(false);
                var widgetDataMap = {
                    "imgCard": "imgCard",
                    "lblTravelNotificationEnabled": "lblTravelNotificationEnabled",
                    "flxCheckBox": "flxCheckBox",
                    "lblCheckBox": "lblCheckBox",
                    "flxCardDetails": "flxCardDetails",
                    "flxDetailsRow1": "flxDetailsRow1",
                    "flxDetailsRow2": "flxDetailsRow2",
                    "flxDetailsRow3": "flxDetailsRow3",
                    "lblKey1": "lblKey1",
                    "lblKey2": "lblKey2",
                    "lblKey3": "lblKey3",
                    "rtxValue1": "rtxValue1",
                    "rtxValue2": "rtxValue2",
                    "rtxValue3": "rtxValue3",
                    "lblSeparator2": "lblSeparator2",
                    "lblSeperator3": "lblSeperator3",
                    "lblCardsSeperator": "lblCardsSeperator",
                    "imgChevron": "imgChevron",
                    "flxIcon": "flxIcon",
                    "imgIcon": "imgIcon"
                };
                var cardSegData = [];
                var card = {};
                cards.forEach(function(dataItem) {
                    card = {
                        "lblCardsSeperator": {
                            "text": ".",
                            "height": "105px"
                        },
                        "lblSeperator3": {
                            "text": "a",
                            "height": "1"
                        },
                        "imgCard": {
                            "src": self.getImageForCard(dataItem.cardProductName),
                        },
                        "flxCheckBox": {
                            "onTouchEnd": function(eventobj, xcord, ycord, context) {
                                self.toggleSelectedCardCheckbox(context)
                            }.bind(self)
                        },
                        //                         "flxCheckBox": {
                        //                             "onClick": self.toggleSelectedCardCheckbox.bind(self),
                        //                         },
                        "lblCheckBox": {
                            "text": self.isCardSelected(dataItem),
                            "accessibilityconfig": {
                                "a11yLabel": self.isCardSelected(dataItem)
                            }
                        },
                        "lblKey1": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.cardName"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.cardName")
                            }
                        },
                        "lblKey2": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.CardNumber"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.CardNumber")
                            }
                        },
                        "lblKey3": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.internationalEligible"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.internationalEligible")
                            }
                        },
                        "rtxValue1": {
                            "text": dataItem.cardProductName,
                            //"left": combinedUser ? "215dp" : "184dp" ,
                            "left": this.profileAccess === "both" ? "215dp" : "184dp",
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.cardProductName
                            }
                        },
                        "rtxValue2": {
                            "text": dataItem.maskedCardNumber,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.maskedCardNumber
                            }
                        },
                        "rtxValue3": {
                            "text": dataItem.isInternational === "false" ? kony.i18n.getLocalizedString('i18n.common.no') : kony.i18n.getLocalizedString('i18n.common.yes'),
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.isInternational === "false" ? kony.i18n.getLocalizedString('i18n.common.no') : kony.i18n.getLocalizedString('i18n.common.yes')
                            }
                        },
                        "flxIcon": {
                            //"isVisible": combinedUser
                            "isVisible": this.profileAccess === "both" ? true : false
                        },
                        "imgIcon": {
                            "text": dataItem.isTypeBusiness === "1" ? "r" : "s"
                        },
                        "template": "flxSelectFromEligibleCards"
                    };
                    cardSegData.push(card);
                });
                this.view.myCards.segMyCards.widgetDataMap = widgetDataMap;
                this.view.myCards.segMyCards.setData(cardSegData);
                this.view.flxEligibleCardsButtons.setVisibility(true);
                this.view.myCards.flxApplyForCards.setVisibility(false);
                this.view.btnCardsCancel.onClick = this.showNotificationToModify.bind(this);
                self.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString('i18n.CardManagement.ManageTravelPlans'));
                this.view.btnCardsContinue.onClick = function() {
                    self.getSelectedCards();
                    self.showConfirmationScreen(self.notificationObject);
                }
            } else {
                this.view.myCards.flxNoError.setVisibility(true);
                this.view.myCards.flxNoError.skin = "slfBoxffffffB1R5";
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.myCards.lblNoCardsError, kony.i18n.getLocalizedString('i18n.CardManagement.noInternationalCardError'), accessibilityConfig);
                this.view.flxMyCards.setVisibility(true);
                this.view.flxMyCards.top = "0dp";
                this.view.flxMyCards.skin = "slfbox";
                this.view.myCards.segMyCards.setVisibility(false);
                this.view.flxTravelPlan.setVisibility(false);
                this.view.myCards.flxApplyForCards.setVisibility(true);
                this.view.flxEligibleCardsButtons.setVisibility(false);
                this.view.myCards.btnApplyForCard.setVisibility(true);
                CommonUtilities.setText(this.view.myCards.btnApplyForCard, kony.i18n.getLocalizedString("i18n.transfers.Cancel"), accessibilityConfig);
                this.view.myCards.btnApplyForCard.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
                this.view.myCards.btnApplyForCard.onClick = this.showNotificationToModify.bind(this);
            }
            this.view.forceLayout();
            this.AdjustScreen();
            CommonUtilities.hideProgressBar(this.view);
        },
        /**
         * Method to get selected cards for creating/editing travel notification
         */
        getSelectedCards: function() {
            var cards = this.view.myCards.segMyCards.data;
            var selectedcards = []
            cards.forEach(function(dataItem) {
                if (dataItem.lblCheckBox.text === "C") {
                    if (this.profileAccess === "both") {
                        //if(applicationManager.getConfigurationManager().isCombinedUser === "true"){
                        if (dataItem.imgIcon.text === "s" || dataItem.imgIcon.text === "r") {
                            selectedcards.push({
                                "name": dataItem.rtxValue1.text,
                                "number": dataItem.rtxValue2.text,
                                "icon": dataItem.imgIcon.text
                            });
                        }
                    } else {
                        selectedcards.push({
                            "name": dataItem.rtxValue1.text,
                            "number": dataItem.rtxValue2.text
                        });
                    }
                }
            });
            this.notificationObject.selectedcards = selectedcards;
        },
        /**
         * Method to check if travel notification is international travel notification
         */
        isInternationalPlan: function() {
            var userCountry;
            var Country = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.fetchUserAddresses();
            Country.forEach(function(dataItem) {
                if (dataItem.isPrimary === "true") userCountry = dataItem.CountryName;
            });
            var selectedCountries = this.notificationObject.locations.map(function(item) {
                var arr = item.split(",");
                return arr[0];
            });
            for (var key in selectedCountries) {
                if (selectedCountries[key] === userCountry) return false;
            }
            return true;
        },
        /**
         * Method to show confirmation screen for create/edit travel notification
         */
        showConfirmationScreen: function(data) {
            var self = this;
            var cards = "";
            this.view.flxConfirmBody.top = "2dp";
            this.view.flxActivateCard.setVisibility(false);
            this.view.flxAcknowledgment.setVisibility(false);
            this.view.flxCardVerification.setVisibility(false);
            this.view.flxMyCardsView.setVisibility(false);
            this.view.flxConfirm.setVisibility(true);
            this.view.flxDestination2.setVisibility(false);
            this.view.flxDestination3.setVisibility(false);
            this.view.flxDestination4.setVisibility(false);
            this.view.flxDestination5.setVisibility(false);
            this.view.flxErrorMessage.setVisibility(false);
            this.view.flxConfirmHeading.setVisibility(true);
            this.view.lblSeparator5.setVisibility(false);
            this.view.flxDownload.setVisibility(false);
            self.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString('i18n.CardManagement.manageTravelPlanConfirmation'));
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblKey1, kony.i18n.getLocalizedString('i18n.CardManagement.SelectedStartDate'), accessibilityConfig);
            CommonUtilities.setText(this.view.rtxValue1, data.fromDate, accessibilityConfig);
            CommonUtilities.setText(this.view.lblKey2, kony.i18n.getLocalizedString('i18n.CardManagement.SelectedEndDate'), accessibilityConfig);
            CommonUtilities.setText(this.view.rtxValue2, data.toDate, accessibilityConfig);
            CommonUtilities.setText(this.view.lblDestination1, kony.i18n.getLocalizedString('i18n.CardManagement.SelectedDestination1'), accessibilityConfig);
            CommonUtilities.setText(this.view.rtxDestination1, data.locations[0], accessibilityConfig);
            if (data.locations[1]) {
                this.view.flxDestination2.setVisibility(true);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.lblDestination2, kony.i18n.getLocalizedString('i18n.CardManagement.SelectedDestination2'), accessibilityConfig);
                CommonUtilities.setText(this.view.rtxDestination2, data.locations[1], accessibilityConfig);
            }
            if (data.locations[2]) {
                this.view.flxDestination3.setVisibility(true);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.lblDestination3, kony.i18n.getLocalizedString('i18n.CardManagement.SelectedDestination3'), accessibilityConfig);
                CommonUtilities.setText(this.view.rtxDestination3, data.locations[2], accessibilityConfig);
            }
            if (data.locations[3]) {
                this.view.flxDestination4.setVisibility(true);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.lblDestination4, kony.i18n.getLocalizedString('i18n.CardManagement.SelectedDestination4'), accessibilityConfig);
                CommonUtilities.setText(this.view.rtxDestination4, data.locations[3], accessibilityConfig);
            }
            if (data.locations[4]) {
                this.view.flxDestination5.setVisibility(true);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.lblDestination5, kony.i18n.getLocalizedString('i18n.CardManagement.SelectedDestination5'), accessibilityConfig);
                CommonUtilities.setText(this.view.rtxDestination5, data.locations[4], accessibilityConfig);
            }
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblKey5, kony.i18n.getLocalizedString('i18n.ProfileManagement.PhoneNumber'), accessibilityConfig);
            CommonUtilities.setText(this.view.rtxValue5, data.phone, accessibilityConfig);
            CommonUtilities.setText(this.view.lblKey6, kony.i18n.getLocalizedString('i18n.CardManagement.AddInformation'), accessibilityConfig);
            CommonUtilities.setText(this.view.rtxValue6, data.notes, accessibilityConfig);
            CommonUtilities.setText(this.view.lblKey4, kony.i18n.getLocalizedString('i18n.CardManagement.selectedCards'), accessibilityConfig);
            var cardSegData = [];
            for (var i = 0; i < data.selectedcards.length; i++) {
                if (data.selectedcards[i].icon) {
                    if (data.selectedcards[i].icon == "s" || data.selectedcards[i].icon == "r") {
                        var card = {};
                        data.selectedcards.forEach(function(dataItem) {
                            card = {
                                "lblValue": {
                                    "text": dataItem.name + "-" + dataItem.number
                                },
                                "lblIcon": {
                                    "text": dataItem.icon,
                                    "Skin": "sknLblOLBFontIconsvs"
                                }
                            };
                        });
                        cardSegData.push(card);
                    }
                }
            }
            if (cardSegData.length > 0) {
                this.view.segSelectedCards.setData(cardSegData);
                this.view.rtxValueA.setVisibility(false);
                this.view.flxCards.setVisibility(true);
            } else {
                data.selectedcards.map(function(dataItem) {
                    cards = cards + dataItem.name + "-" + dataItem.number + "<br/>";
                });
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.rtxValueA, cards, accessibilityConfig);
                this.view.rtxValueA.setVisibility(true);
                this.view.flxCards.setVisibility(false);
            }
            //             data.selectedcards.map(function(dataItem) {
            //                 cards = cards + dataItem.name + "-" + dataItem.number + "<br/>";
            //             });
            //             var accessibilityConfig=CommonUtilities.getaccessibilityConfig();
            // 			CommonUtilities.setText(this.view.rtxValueA, cards, accessibilityConfig);
            CommonUtilities.setText(this.view.btnCancelPlan, kony.i18n.getLocalizedString("i18n.transfers.Cancel"), accessibilityConfig);
            this.view.btnCancelPlan.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
            this.view.btnCancelPlan.onClick = function() {
                self.showPopUp();
            }
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.btnModify, kony.i18n.getLocalizedString('i18n.common.modifiy'), accessibilityConfig);
            this.view.btnModify.toolTip = kony.i18n.getLocalizedString('i18n.common.modifiy');
            this.view.btnModify.onClick = this.showNotificationToModify.bind(this);
            CommonUtilities.setText(this.view.btnConfirm, kony.i18n.getLocalizedString('i18n.common.confirm'), accessibilityConfig);
            this.view.btnConfirm.toolTip = kony.i18n.getLocalizedString('i18n.common.confirm');
            if (this.notificationObject.isEditFlow) {
                this.view.btnConfirm.onClick = function() {
                    FormControllerUtility.showProgressBar(self.view);
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.updateTravelNotifications(self.notificationObject);
                }
            } else {
                this.view.btnConfirm.onClick = function() {
                    FormControllerUtility.showProgressBar(self.view);
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.createTravelNotification(self.notificationObject);
                }
            }
            this.view.forceLayout();
            this.AdjustScreen();
        },
      
        /**
         * Method to show confirmation pop up for create/edit travel notification
         */
        showPopUp: function() {
            var self = this;
            this.view.flxAlert.height = this.view.flxHeader.info.frame.height + this.view.flxMain.info.frame.height + this.view.flxFooter.info.frame.height + "dp";
            this.view.flxAlert.setVisibility(true);
            this.view.CustomAlertPopup.lblHeading.setFocus(true);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CustomAlertPopup.lblPopupMessage, kony.i18n.getLocalizedString('i18n.CardManagement.cancelCreateMsg'), accessibilityConfig);
            this.view.CustomAlertPopup.btnYes.onClick = function() {
                self.view.flxAlert.setVisibility(false);
                self.notificationObject = {};
                self.fetchTravelNotifications();
            }
            this.view.CustomAlertPopup.btnNo.onClick = function() {
                self.view.flxAlert.setVisibility(false);
            }
            this.view.CustomAlertPopup.flxCross.onClick = function() {
                self.view.flxAlert.setVisibility(false);
            }
        },
        /**
         * Method to show create/edit travel notification for modification
         */
        showNotificationToModify: function() {
            this.view.txtDestination.text = "";
            this.view.flxDowntimeWarning.setVisibility(false);
            this.view.lblRequestID.setVisibility(false);
            this.view.lblRequestNo.setVisibility(false);
            this.view.flxConfirm.setVisibility(false);
            this.view.flxMyCards.setVisibility(false);
            this.view.myCards.btnApplyForCard.setVisibility(false);
            this.view.flxTravelPlan.setVisibility(true);
            this.view.flxOtherDestinations.setVisibility(true);
            this.view.flxMyCardsView.setVisibility(true);            
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * Method to validate whether a card is selected or not
         * @param {Object} - cards object
         */
        isCardSelected: function(dataItem) {
            var self = this;
            var cardNumber = dataItem.maskedCardNumber;
            var selectedcards = this.notificationObject.selectedcards;
            var txt = "D";
            if (selectedcards) {
                selectedcards.forEach(function(data) {
                    if (data.number === cardNumber) {
                        txt = "C";
                        FormControllerUtility.enableButton(self.view.btnCardsContinue);
                    }
                });
            } else {
                txt = "D";
            }
            return txt;
        },
        /**
         * Method to get the image for a given card product.
         * @param {String} - card product name.
         * @returns {String} - Name of image file.
         */
        getImageForCard: function(cardProductName) {
            if (cardProductName && this.cardImages[cardProductName])
                return this.cardImages[cardProductName];
            return ViewConstants.IMAGES.PLATINUM_CARDS;
        },
        /**
         * Method to handle selection of cards on card selection screen
         */
        toggleSelectedCardCheckbox: function(context) {
            var self = this;
            var selectedRowIndex = context.rowIndex;
            var data = this.view.myCards.segMyCards.data;
            for (var index = 0; index < data.length; index++) {
                if (index === selectedRowIndex) {
                    if (data[index].lblCheckBox.text === "C") {
                        data[index].lblCheckBox.text = "D";
                    } else {
                        data[index].lblCheckBox.text = "C";
                    }
                }                
            }
			this.view.myCards.segMyCards.setData(data);
            self.checkContinue(data);
        },
        /**
         * Method to enable continue button,if any of the card is selected
         * @param {Object} - cards data
         */
        checkContinue: function(data) {
            var enable = false;
            data.forEach(function(dataItem) {
                if (dataItem.lblCheckBox.text === "C")
                    enable = true;
            })
            if (enable) {
                FormControllerUtility.enableButton(this.view.btnCardsContinue)
            } else {
                FormControllerUtility.disableButton(this.view.btnCardsContinue)
            }
        },
        /**
         * Method to add selected address to the list of address for create/edit travel notification
         */
        addAddressTOList: function() {
            if (this.view.txtDestination.text !== "") {
                this.view.flxOtherDestinations.setVisibility(true);
                var self = this;
                var dataMap = {
                    "lblDestination": "lblDestination",
                    "lblPlace": "lblPlace",
                    "lblAnotherDestination": "lblAnotherDestination",
                    "lblSeparator2": "lblSeparator2",
                    "imgClose": "imgClose",
                    "flxClose":"flxClose",
                    "flxSelectDestination":"flxSelectDestination"
                };
                var data = [{
                    "lblDestination": kony.i18n.getLocalizedString('i18n.CardManagement.destination'),
                    "lblPlace": {
                        "text": this.view.txtDestination.text,
                        "accessibilityconfig": {
                            "a11yLabel": this.view.txtDestination.text
                        }
                    },
                    "imgClose": {
                        "src": "icon_close_grey.png"
                        //"onTouchEnd": self.removeAddressFromList
                    },
                    "flxClose":{
                    "isVisible": true,
                    "onClick": self.removeAddressFromList
                    },
                    "lblSeparator2": "a"
                }];
                data[0].lblDestination = kony.i18n.getLocalizedString("i18n.CardManagement.destination") + " " + (this.view.segDestinations.data.length + 1);
                this.view.segDestinations.widgetDataMap = dataMap;
                this.view.segDestinations.addAll(data);
                this.view.txtDestination.text = "";
                self.disableAddButton();
                this.validateTravelPlanData();
            }
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * showCardsStatus - Method that hides all other flexes except the Cards segment.
         * @param {Array} - Array of card ids.
         */
        showCardsStatus: function(cards) {
            var self = this;
            this.setCardsData(cards);
            this.view.flxMyCardsView.setVisibility(true);
            this.view.flxMyCards.setVisibility(true);
            this.view.myCards.setVisibility(true);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.myCards.lblMyCardsHeader, kony.i18n.getLocalizedString("i18n.CardManagement.MyCards"), accessibilityConfig);
            this.view.flxMyCards.skin = "slFbox";
            this.view.forceLayout();
            this.AdjustScreen();
            CampaignUtility.showCampaign(this.campaigns, this.view, "flxMain");
            this.campaigns = [];
            CommonUtilities.hideProgressBar(this.view);
        },
        /**
         * setCardsData - Method that binds the cards data to the segment.
         * @param {Array} - Array of JSON objects of cards.
         */
        setCardsData: function(cards) {
            //var combinedUser = applicationManager.getConfigurationManager().isCombinedUser==="true";
            var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            var isMobile = (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile);
            if (cards.data && cards.data.length <= 0) {
                if (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile || kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) {
                    this.view.flxRightBar.setVisibility(false);
                } else {
                    this.view.flxRightBar.setVisibility(true);
                }
                this.showCardsNotAvailableScreen();
            } else {
                var self = this;
                self.view.myCards.flxSearch.setVisibility(true);
                var flxCardSkin = (kony.application.getCurrentBreakpoint() === 640) ? "sknFlxffffffRoundedBorder" : "slfBoxffffffB1R5";
                var dataMap = {
                    "btnAction1": "btnAction1",
                    "btnAction2": "btnAction2",
                    "btnAction3": "btnAction3",
                    "btnAction4": "btnAction4",
                    "btnAction5": "btnAction5",
                    "btnAction6": "btnAction6",
                    "btnAction7": "btnAction7",
                    "btnAction8": "btnAction8",
                    "flxActions": "flxActions",
                    "flxBlankSpace1": "flxBlankSpace1",
                    "flxBlankSpace2": "flxBlankSpace2",
                    "flxCardDetails": "flxCardDetails",
                    "flxCardHeader": "flxCardHeader",
                    "flxCardImageAndCollapse": "flxCardImageAndCollapse",
                    "lblCardsSeperator": "lblCardsSeperator",
                    "flxCollapse": "flxCollapse",
                    "flxDetailsRow1": "flxDetailsRow1",
                    "flxDetailsRow10": "flxDetailsRow10",
                    "flxDetailsRow2": "flxDetailsRow2",
                    "flxDetailsRow3": "flxDetailsRow3",
                    "flxDetailsRow4": "flxDetailsRow4",
                    "flxDetailsRow5": "flxDetailsRow5",
                    "flxDetailsRow6": "flxDetailsRow6",
                    "flxDetailsRow7": "flxDetailsRow7",
                    "flxDetailsRow8": "flxDetailsRow8",
                    "flxDetailsRow9": "flxDetailsRow9",
                    "flxMyCards": "flxMyCards",
                    "flxExpiry": "flxExpiry",
                    "imgInfo": "imgInfo",
                    "flxExpiryMessage": "flxExpiryMessage",
                    "lblExpiryMessage": "lblExpiryMessage",
                    "btnActivateNow": "btnActivateNow",
                    "btnActivate": "btnActivate",
                    "flxMyCardsExpanded": "flxMyCardsExpanded",
                    "flxRowIndicatorColor": "flxRowIndicatorColor",
                    "lblIdentifier": "lblIdentifier",
                    "lblSeparator1": "lblSeparator1",
                    "lblSeparator2": "lblSeparator2",
                    "lblSeperator": "lblSeperator",
                    "imgCard": "imgCard",
                    "imgCollapse": "imgCollapse",
                    "lblChevron": "lblChevron",
                    "lblCardHeader": "lblCardHeader",
                    "lblCardStatus": "lblCardStatus",
                    "lblTravelNotificationEnabled": "lblTravelNotificationEnabled",
                    "lblKey1": "lblKey1",
                    "lblKey10": "lblKey10",
                    "lblKey2": "lblKey2",
                    "lblKey3": "lblKey3",
                    "lblKey4": "lblKey4",
                    "lblKey5": "lblKey5",
                    "lblKey6": "lblKey6",
                    "lblKey7": "lblKey7",
                    "lblKey8": "lblKey8",
                    "lblKey9": "lblKey9",
                    "rtxValue1": "rtxValue1",
                    "rtxValue10": "rtxValue10",
                    "rtxValue2": "rtxValue2",
                    "rtxValue3": "rtxValue3",
                    "rtxValue4": "rtxValue4",
                    "rtxValue5": "rtxValue5",
                    "rtxValue6": "rtxValue6",
                    "rtxValue7": "rtxValue7",
                    "rtxValue8": "rtxValue8",
                    "rtxValue9": "rtxValue9",
                    "segMyCardsExpanded": "segMyCardsExpanded",
                    "flxIcon": "flxIcon",
                    "imgIcon": "imgIcon"
                };
                var cardsSegmentData = [];
                var card = {};
                cards.data = this.constructCardsViewModel(cards.data);
                var travelStatusData = cards.status;
                for (var i = 0; i < cards.data.length; i++) {
                    var dataItem = cards.data[i];
                    card = {
                        "lblCardsSeperator": {
                            "text": ".",
                            "height": "105px"
                        },
                        "flxCollapse": {
                            "isVisible": dataItem.cardStatus === "Issued" ? false : true,
                            "onClick": self.changeRowTemplate.bind(self, dataItem)
                        },
                        "flxRowIndicatorColor": {
                            "height": "190Px",
                            "skin": "sknFlxF4BA22"
                        },
                        "lblSeperator": ".",
                        "lblSeparator1": ".",
                        "lblSeparator2": ".",
                        "imgCard": {
                            "src": self.getImageForCard(dataItem.productName),
                        },
                        "imgCollapse": {
                            "src": ViewConstants.IMAGES.ARRAOW_DOWN,
                            "accessibilityconfig": {
                                "a11yLabel": "View Details"
                            }
                        },
                        "lblCardHeader": {
                            "text": dataItem.productName,
                            //"left": combinedUser ? (isMobile ? "30dp" : "70dp") :(isMobile? "0dp": "40dp"),
                            "left": this.profileAccess === "both" ? (isMobile ? "30dp" : "70dp") : (isMobile ? "0dp" : "40dp"),
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.productName
                            }
                        },
                        "lblCardStatus": {
                            "text": (dataItem.isExpiring === '1' && dataItem.cardStatus === "Active") ? kony.i18n.getLocalizedString("i18n.CardManagement.NearingExpiry") : self.geti18nDrivenString(dataItem.cardStatus),
                            "skin": (dataItem.isExpiring === '1' && dataItem.cardStatus === "Active") ? self.statusSkinsLandingScreen["NearingExpiry"] : self.statusSkinsLandingScreen[dataItem.cardStatus],
                            "accessibilityconfig": {
                                "a11yLabel": (dataItem.isExpiring === '1' && dataItem.cardStatus === "Active") ? kony.i18n.getLocalizedString("i18n.CardManagement.NearingExpiry") : self.geti18nDrivenString(dataItem.cardStatus)
                            }
                        },
                        "template": (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) ? "flxMyCardsCollapsedMobile" : "flxMyCardsCollapsed",
                        "flxExpiry": {
                            "isVisible": dataItem.isExpiring === '1' ? true : false
                        },
                        "btnActivateNow": {
                            "onClick": self.activateCard.bind(self, cards.data[i])
                        },
                        "btnActivate": {
                            "isVisible": dataItem.cardStatus === "Issued" ? true : false,
                            "onClick": self.activateCard.bind(self, cards.data[i])
                        },
                        "flxDetailsRow1": {
                            "isVisible": true
                        },
                        "flxDetailsRow2": {
                            "isVisible": dataItem.cardStatus === "Issued" ? false : true
                        },
                        "flxDetailsRow3": {
                            "isVisible": (dataItem.cardStatus === "Issued" || dataItem.isExpiring === '1') ? false : true
                        },
                        "flxDetailsRow4": {
                            "isVisible": false
                        },
                        "flxDetailsRow5": {
                            "isVisible": dataItem.cardStatus === "Issued" ? false : true
                        },
                        "flxDetailsRow6": {
                            "isVisible": dataItem.cardStatus === "Issued" ? false : true
                        },
                        "flxDetailsRow7": {
                            "isVisible": dataItem.cardStatus === "Issued" ? false : true
                        },
                        "flxDetailsRow8": {
                            "isVisible": dataItem.secondaryCardHolder && dataItem.cardStatus !== "Issued" ? true : false
                        },
                        "flxDetailsRow9": {
                            "isVisible": false
                        },
                        "lblKey1": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.CardNumber"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.CardNumber")
                            }
                        },
                        "lblKey10": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.productName"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.productName")
                            }
                        },
                        "lblKey4": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.ValidThrough"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.ValidThrough")
                            }
                        },
                        "lblKey2": {
                            "text": dataItem.cardType === 'Debit' ? kony.i18n.getLocalizedString("i18n.CardManagement.DailyWithdrawalLimit") : kony.i18n.getLocalizedString("i18n.accountDetail.availableCredit"),
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.cardType === 'Debit' ? kony.i18n.getLocalizedString("i18n.CardManagement.DailyWithdrawalLimit") : kony.i18n.getLocalizedString("i18n.accountDetail.availableCredit")
                            }
                        },
                        "lblKey5": {
                            "text": dataItem.cardType === 'Debit' ? kony.i18n.getLocalizedString("i18n.transfers.accountName") : kony.i18n.getLocalizedString("i18n.accountDetail.creditLimit"),
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.cardType === 'Debit' ? kony.i18n.getLocalizedString("i18n.transfers.accountName") : kony.i18n.getLocalizedString("i18n.accountDetail.creditLimit")
                            }
                        },
                        "lblKey6": {
                            "text": dataItem.cardType === 'Debit' ? kony.i18n.getLocalizedString("i18n.common.accountNumber") : kony.i18n.getLocalizedString("i18n.CardManagement.BillingAddress"),
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.cardType === 'Debit' ? kony.i18n.getLocalizedString("i18n.common.accountNumber") : kony.i18n.getLocalizedString("i18n.CardManagement.BillingAddress")
                            }
                        },
                        "lblKey7": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.ServiceProvider"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.ServiceProvider")
                            }
                        },
                        "lblKey8": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.CardHolder"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.CardHolder")
                            }
                        },
                        "lblKey9": {
                            "text": kony.i18n.getLocalizedString("i18n.CardManagement.SecondaryHolder"),
                            "accessibilityconfig": {
                                "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.SecondaryHolder")
                            }
                        },
                        "lblKey3": {
                            "text": dataItem.cardType === 'Debit' ? kony.i18n.getLocalizedString("i18n.CardManagement.DailyPurchaseLimit") : "Reward Points" + ":",
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.cardType === 'Debit' ? kony.i18n.getLocalizedString("i18n.CardManagement.DailyPurchaseLimit") : "Reward Points" + ":"
                            }
                        },
                        "rtxValue1": {
                            "text": dataItem.maskedCardNumber,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.maskedCardNumber
                            }
                        },
                        "rtxValue10": {
                            "text": dataItem.productName,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.productName
                            }
                        },
                        "rtxValue4": {
                            "text": dataItem.validThrough,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.validThrough
                            }
                        },
                        "rtxValue2": {
                            "text": dataItem.cardType === 'Debit' ? dataItem.dailyWithdrawalLimit : dataItem.availableCredit,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.cardType === 'Debit' ? dataItem.dailyWithdrawalLimit : dataItem.availableCredit
                            }
                        },
                        "rtxValue5": {
                            "text": dataItem.cardType === 'Debit' ? dataItem.accountName : dataItem.creditLimit,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.cardType === 'Debit' ? dataItem.accountName : dataItem.creditLimit
                            }
                        },
                        "rtxValue6": {
                            "text": dataItem.cardType === 'Debit' ? dataItem.maskedAccountNumber : dataItem.billingAddress,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.cardType === 'Debit' ? dataItem.maskedAccountNumber : dataItem.billingAddress
                            }
                        },
                        "rtxValue7": {
                            "text": dataItem.serviceProvider,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.serviceProvider
                            }
                        },
                        "rtxValue8": {
                            "text": dataItem.cardHolder,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.cardHolder
                            }
                        },
                        "rtxValue9": {
                            "text": dataItem.secondaryCardHolder,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.secondaryCardHolder
                            }
                        },
                        "rtxValue3": {
                            "text": dataItem.cardType === 'Debit' ? dataItem.purchaseLimit : dataItem.rewardsPoint,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.cardType === 'Debit' ? dataItem.purchaseLimit : dataItem.rewardsPoint
                            }
                        },
                        "lblTravelNotificationEnabled": {
                            "text": cards.status[i].status.toLowerCase() === "yes" ? kony.i18n.getLocalizedString('i18n.CardManagement.TravelNotificationsEnabled') : "",
                            "accessibilityconfig": {
                                "a11yLabel": cards.status[i].status.toLowerCase() === "yes" ? kony.i18n.getLocalizedString('i18n.CardManagement.TravelNotificationsEnabled') : ""
                            }
                        },
                        "flxMyCards": {
                            "clipBounds": false,
                            "skin": flxCardSkin,
                            "onClick": dataItem.cardStatus === "Issued" ? null : self.viewCardDetailsMobile
                        },
                        "lblChevron": {
                            "isVisible": dataItem.cardStatus === "Issued" ? false : true,
                            "skin": "sknLblrightArrowFontIcon0273E3"
                        },
                        "flxIcon": {
                            "isVisible": this.profileAccess === "both"

                        },
                        "imgIcon": {
                            "text": dataItem.isTypeBusiness === "1" ? "r" : "s"
                        }
                    };
                    var actionButtonIndex;
                    for (var index = 0; index < dataItem.actions.length; index++) {
                        actionButtonIndex = Number(index) + 1;
                        card['btnAction' + actionButtonIndex] = self.getActionButton(dataItem, dataItem.actions[index]);
                    }
                    cardsSegmentData.push(card);
                }
                this.view.myCards.segMyCards.widgetDataMap = dataMap;
                this.view.myCards.segMyCards.setData(cardsSegmentData);
                this.view.flxNewcard.setVisibility(false);
                this.view.myCards.segMyCards.setVisibility(true);
                this.view.flxRequestANewCard.setVisibility(true);
                if (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile || kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) {
                    this.view.flxRightBar.setVisibility(false);
                    this.view.myCards.flxRequestANewCard.setVisibility(true);
                } else {
                    this.view.flxRightBar.setVisibility(true);
                    this.view.flxCardAccounts.top = "10dp";
                }
                this.view.myCards.flxRequestANewCard.onClick = function() {
                    applicationManager.getPresentationUtility().showLoadingScreen();
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToNewCardFlow();
                };
            }
        },
        /**
         * showCardsNotAvailableScreen - Method to show no cards screen.
         */
        showCardsNotAvailableScreen: function() {
            this.view.flxMyCardsView.setVisibility(true);
            this.view.myCards.segMyCards.setVisibility(false);
            this.view.myCards.flxNoError.setVisibility(true);
            this.view.myCards.flxNoError.skin = "slfBoxffffffB1R5";
            this.view.myCards.flxApplyForCards.setVisibility(true);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            if (applicationManager.getConfigurationManager().checkUserPermission("CARD_MANAGEMENT_CREATE_CARD_REQUEST") )
                CommonUtilities.setText(this.view.myCards.lblNoCardsError, kony.i18n.getLocalizedString('i18n.CardsManagement.NocardsError'), accessibilityConfig);
            else
                CommonUtilities.setText(this.view.myCards.lblNoCardsError, kony.i18n.getLocalizedString('i18n.CardsManagement.GetPermissionsToApplyForCard'), accessibilityConfig);

            CommonUtilities.setText(this.view.myCards.btnApplyForCard, kony.i18n.getLocalizedString("i18n.CardManagement.ApplyNow"), accessibilityConfig);

            this.view.myCards.btnApplyForCard.onClick = function() {
                //                 var naoModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("NAOModule");
                //                 naoModule.presentationController.showNewAccountOpening();
                applicationManager.getPresentationUtility().showLoadingScreen();
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToNewCardFlow();
            };
        },
        /**
         * getActionButton - Method to get a JSON for action button based on the action.
         * @param {Object, String} - card object.
         * @param {String} actino - contains the action to be performed.
         * @returns {Object} - JSON with text and onclick function for the button.
         */
        getActionButton: function(card, action) {
            return {
                'text': action,
                'toolTip': action,
                'onClick': this.getAction(card, action),
                'isVisible': true,
                'accessibilityconfig': {
                    'a11yLabel': action
                }
            };
        },
        /**
         * getAction - Method that actually returns the action to the action.
         * @param {Object, String} - card object .
         * @param {String} action - contains the action to be performed.
         * @returns {function} - Action for the given name.
         */
        getAction: function(card, action) {
            switch (action) {
                case kony.i18n.getLocalizedString("i18n.CardManagement.LockCard"): {
                    return this.lockCard.bind(this, card);
                }
                case kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCard"): {
                    return this.unlockCard.bind(this, card);
                }
                case kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.requestReplaceCard"): {
                    return this.replaceCard.bind(this, card);
                }
                case kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost"): {
                    return this.reportLost.bind(this, card);
                }
                case kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard"): {
                    return this.cancelCard.bind(this, card);
                }
                case kony.i18n.getLocalizedString("i18n.CardManagement.ChangePin"): {
                    return this.changePin.bind(this, card);
                }
                case kony.i18n.getLocalizedString("i18n.CardManagement.SetLimits"): {
                    return this.setLimits.bind(this, card);
                }
                case kony.i18n.getLocalizedString("i18n.CardManagement.ActivateCard"): {
                    return this.activateCard.bind(this, card);
                }
            }
        },
        restrictCharactersSet: function() {
            var scope = this;
            var specialCharactersSet = "!@#&*_'-.~^|$%()+=}{][/|?,><`:;\"\\";
            var numeric = "0123456789";
            var alphabetsSet = "abcdefghijklmnopqrstuvwxyz";
            scope.view.tbxCVVNumber.restrictCharactersSet = specialCharactersSet + alphabetsSet + alphabetsSet.toUpperCase();
            scope.view.tbxEnterCardPIN.restrictCharactersSet = specialCharactersSet + alphabetsSet + alphabetsSet.toUpperCase();
            scope.view.tbxConfirmCardPIN.restrictCharactersSet = specialCharactersSet + alphabetsSet + alphabetsSet.toUpperCase();
            scope.view.CardLockVerificationStep.tbxCurrentPIN.restrictCharactersSet = specialCharactersSet + alphabetsSet + alphabetsSet.toUpperCase();
            scope.view.CardLockVerificationStep.tbxNewPIN.restrictCharactersSet = specialCharactersSet + alphabetsSet + alphabetsSet.toUpperCase();
            scope.view.CardLockVerificationStep.tbxConfirmPIN.restrictCharactersSet = specialCharactersSet + alphabetsSet + alphabetsSet.toUpperCase();
            scope.view.tbxNameOnCard.restrictCharactersSet = numeric;
        },
        isValidCVV: function(cvv) {
            if (cvv.length !== 3) return false;
            var regex = new RegExp('^[0-9]+$');
            return regex.test(cvv);
        },
        /**
         * Entry point for Activate new card and Renewal Card flow.
         * @param {Object} - card object.
         */
        activateCard: function(card) {
            this.hideAllCardManagementViews();
            this.hideAllCardManagementRightViews();
            // this.setCardDetails(card);
            FormControllerUtility.disableButton(this.view.btnContinue2);
            var scope = this;
            scope.restrictCharactersSet();
            scope.view.tbxCVVNumber.text = "";
            scope.view.tbxCVVNumber.secureTextEntry = true;
            scope.view.imgViewCVV.src = "eye_hide.png";
            card.oldCVV = "";
            card.cvv = "";
            this.view.imgViewCVV.onTouchStart = function() {
                scope.view.tbxCVVNumber.secureTextEntry = !scope.view.tbxCVVNumber.secureTextEntry;
                if (scope.view.imgViewCVV.src === "eye_hide.png")
                    scope.view.imgViewCVV.src = "eye_show.png";
                else
                    scope.view.imgViewCVV.src = "eye_hide.png";
            };
            this.toggleSecureAccessCodeMasking.bind(this, this.view.tbxCVVNumber);
            this.view.tbxCVVNumber.onKeyUp = function() {
                if (!scope.isValidCVV(scope.view.tbxCVVNumber.text)) {
                    FormControllerUtility.disableButton(scope.view.btnContinue2);
                } else {
                    FormControllerUtility.enableButton(scope.view.btnContinue2);
                }
            };
            this.view.btnfindCVV.onClick = function() {
                scope.view.flxCVVPopup.setVisibility(true);
                scope.view.forceLayout();
                scope.setCVVpopUpUI();
                scope.AdjustScreen();
            };
            this.view.CVVInfo.flxCross.onClick = function() {
                scope.view.flxCVVPopup.setVisibility(false);
            };
            this.view.btnCancel2.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblCardNumber, kony.i18n.getLocalizedString("i18n.CardManagement.EnterCVV"), accessibilityConfig);
            this.view.flxIncorrectCVV.setVisibility(false);
            if (CommonUtilities.getSCAType()!=0) 
            this.setCVVScreenSCA(card);
            else
            this.setCVVScreen(card);
            this.view.flxCardCVV.setVisibility(true);
            this.view.forceLayout();
            this.AdjustScreen();
            this.view.lblActivateCardHeader.setFocus(true);
        },
        setCVVpopUpUI: function() {
            this.view.flxCVVPopup.top = (this.view.flxMain.info.frame.y + this.view.flxCardCVV.info.frame.y + this.view.flxActivateContent.info.frame.y + this.view.btnfindCVV.info.frame.y - this.view.flxCVVPopup.info.frame.height) + "dp";
            this.view.forceLayout();
        },
        /**
         * Set the CVV screen based on Expiry Flag
         * @param {Object} - card object.
         */
        setCVVScreen: function(card,isMFARequired) {
            var scope = this;
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            if (card.isExpiring === "0") {
                CommonUtilities.setText(this.view.lblActivateCardHeader, kony.i18n.getLocalizedString("i18n.CardManagement.ActivateACard"), accessibilityConfig);
                CommonUtilities.setText(this.view.lblHeader, kony.i18n.getLocalizedString("i18n.CardManagement.CVVPIN"), accessibilityConfig);
                CommonUtilities.setText(this.view.lblCVV, kony.i18n.getLocalizedString("i18n.CardManagement.ActivateCVVOnBackOfCard"), accessibilityConfig);
                this.view.btnContinue2.onClick = function() {
                    card.cvv = scope.view.tbxCVVNumber.text;
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.activateCard(card, kony.i18n.getLocalizedString("i18n.CardManagement.ActivateCard"),isMFARequired);
                };
            } else {
                CommonUtilities.setText(this.view.lblActivateCardHeader, kony.i18n.getLocalizedString("i18n.CardManagement.ActivateRenewalCard"), accessibilityConfig);
                CommonUtilities.setText(this.view.lblHeader, kony.i18n.getLocalizedString("i18n.CardManagement.CurrentCardCVV"), accessibilityConfig);
                CommonUtilities.setText(this.view.lblCVV, kony.i18n.getLocalizedString("i18n.CardManagement.CVVOnBackOfCard"), accessibilityConfig);
                this.view.btnContinue2.onClick = function() {
                    if (card.oldCVV === "") {
                        card.oldCVV = scope.view.tbxCVVNumber.text;
                        scope.view.tbxCVVNumber.text = "";
                        scope.view.tbxCVVNumber.secureTextEntry = true;
                        scope.view.flxCVVPopup.setVisibility(false);
                        scope.view.imgViewCVV.src = "eye_hide.png";
                        CommonUtilities.setText(scope.view.lblHeader, kony.i18n.getLocalizedString("i18n.CardManagement.RenewalCardCVV"), accessibilityConfig);
                        CommonUtilities.setText(scope.view.lblCVV, kony.i18n.getLocalizedString("i18n.CardManagement.CVVCode"), accessibilityConfig);
                    } else {
                        card.cvv = scope.view.tbxCVVNumber.text;
                        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.activateCard(card, kony.i18n.getLocalizedString("i18n.CardManagement.ActivateCard"),isMFARequired);
                    }
                };
            }
        },
        /**
         * Entry point for lock card flow.
         * @param {Object} - card object.
         */
        lockCard: function(card) {
            this.showLockCardView();
            this.setCardDetails(card);
            this.showLockCardGuidelines(card);
            this.setMobileHeader(kony.i18n.getLocalizedString("i18n.CardManagement.LockCard"))
            this.view.forceLayout();
            this.AdjustScreen();
            this.view.CardLockVerificationStep.confirmHeaders.lblHeading.setFocus(true);
        },
        /**
         * Sets the UI for lock card flow.
         */
        showLockCardView: function() {
            this.hideAllCardManagementViews();
            this.hideAllCardManagementRightViews();
            this.view.flxCardVerification.setVisibility(true);
            this.view.CardLockVerificationStep.setVisibility(true);
            this.view.CardLockVerificationStep.flxLeft.setVisibility(true);
            this.view.CardLockVerificationStep.flxDeactivateCard.setVisibility(true);
            this.view.flxTermsAndConditions.setVisibility(true);
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * Binds the card details.
         * @param {Object} - Card object.
         */
        setCardDetails: function(card) {
            var self = this;
            //var combinedUser = applicationManager.getConfigurationManager().isCombinedUser === "true";
            var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            var isMobile = (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            //if(combinedUser){
            if (this.profileAccess === "both") {
                this.view.CardLockVerificationStep.cardDetails.flxIcon.isVisible = isMobile ? false : true;
                this.view.CardLockVerificationStep.cardDetails.flxHeaderIcon.isVisible = isMobile ? true : false;
                this.view.CardLockVerificationStep.cardDetails.imgIcon.text = (card.isTypeBusiness === "1") ? "r" : "s";
                this.view.CardLockVerificationStep.cardDetails.imgHeaderIcon.text = (card.isTypeBusiness === "1") ? "r" : "s";
                this.view.CardLockVerificationStep.cardDetails.lblCardName.left = "60dp";
                this.view.CardLockVerificationStep.cardDetails.lblCardHeader.left = "120dp";
            }
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.lblCardName, card.productName, accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.lblCardStatus, self.geti18nDrivenString(card.cardStatus), accessibilityConfig);
            this.view.CardLockVerificationStep.cardDetails.lblCardStatus.skin = self.statusSkinsDetailsScreen[card.cardStatus];
            this.view.CardLockVerificationStep.cardDetails.imgCard.src = this.getImageForCard(card.productName);
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.lblKey1, kony.i18n.getLocalizedString("i18n.CardManagement.CardNumber"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.rtxValue1, card.maskedCardNumber, accessibilityConfig);
            this.view.CardLockVerificationStep.cardDetails.flxDetailsRow2.setVisibility(false);
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.lblKey2, kony.i18n.getLocalizedString("i18n.CardManagement.ValidThrough"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.rtxValue2, card.validThrough, accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.lblKey3, card.cardType === 'Debit' ? kony.i18n.getLocalizedString("i18n.CardManagement.DailyPurchaseLimit") : kony.i18n.getLocalizedString("i18n.accountDetail.creditLimit"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.rtxValue3, card.cardType === 'Debit' ? card.dailyWithdrawalLimit : card.creditLimit, accessibilityConfig);

            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.lblKey3, card.cardType === 'Debit' ? kony.i18n.getLocalizedString("i18n.CardManagement.DailyPurchaseLimit") : kony.i18n.getLocalizedString("i18n.accountDetail.creditLimit"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.rtxValue3, card.cardType === 'Debit' ? card.purchaseLimit : card.creditLimit, accessibilityConfig);

            this.view.CardLockVerificationStep.cardDetails.flxDetailsRow4.setVisibility(card.cardType === 'Credit');
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.lblKey4, kony.i18n.getLocalizedString("i18n.accountDetail.availableCredit"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.rtxValue4, card.availableCredit, accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.lblCardHeader, card.productName, accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.rtxValueMobile, card.maskedCardNumber, accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.cardDetails.lblCardStatusMobile, self.geti18nDrivenString(card.cardStatus), accessibilityConfig);
            this.view.CardLockVerificationStep.cardDetails.lblCardStatusMobile.skin = self.statusSkinsDetailsScreen[card.cardStatus];
        },
        /**
         * geti18nDrivenString - Returns i18n driven string for card status
         * @param {String} - card status.
         * @returns {String}  - i18n driven card status.
         */
        geti18nDrivenString: function(cardStatus) {
            if (cardStatus === OLBConstants.CARD_STATUS.Active) {
                return kony.i18n.getLocalizedString("i18n.CardManagement.ACTIVE");
            }
            if (cardStatus === OLBConstants.CARD_STATUS.Inactive) {
                return kony.i18n.getLocalizedString("i18n.CardManagement.inactive");
            }
            if (cardStatus === OLBConstants.CARD_STATUS.Cancelled) {
                return kony.i18n.getLocalizedString("i18n.CardManagement.cancelled");
            }
            if (cardStatus === OLBConstants.CARD_STATUS.ReportedLost) {
                return kony.i18n.getLocalizedString("i18n.CardManagement.reportedCardLost");
            }
            if (cardStatus === OLBConstants.CARD_STATUS.ReplaceRequestSent) {
                return kony.i18n.getLocalizedString("i18n.CardManagement.replaceRequestSent");
            }
            if (cardStatus === OLBConstants.CARD_STATUS.CancelRequestSent) {
                return kony.i18n.getLocalizedString("i18n.CardManagement.cancelRequestSent");
            }
            if (cardStatus === OLBConstants.CARD_STATUS.Locked) {
                return kony.i18n.getLocalizedString("i18n.CardManagement.locked");
            }
            if (cardStatus === OLBConstants.CARD_STATUS.Replaced) {
                return kony.i18n.getLocalizedString("i18n.CardManagement.replaced");
            }
            if (cardStatus === OLBConstants.CARD_STATUS.Issued) {
                return kony.i18n.getLocalizedString("i18n.CardManagement.PendingActivation");
            }
        },
        /**
         * Method to enable terms and conditions on lock card.
         */
        EnableTermsAndConditionsForLockCards: function() {
            var self = this;
            this.view.CardLockVerificationStep.CardActivation.btnTermsAndConditions.toolTip = kony.i18n.getLocalizedString("i18n.common.TnC");
            this.view.CardLockVerificationStep.CardActivation.btnTermsAndConditions.onClick = function() {
                self.view.flxTermsAndConditionsPopUp.height = (self.view.flxMain.info.frame.height + 320) + "dp";
                self.view.flxTermsAndConditionsPopUp.isVisible = true;
                self.view.lblTermsAndConditions.setFocus(true);
                if (CommonUtilities.isFontIconChecked(self.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon)) {
                    CommonUtilities.setLblCheckboxState(true, self.view.lblTCContentsCheckboxIcon);
                } else {
                    CommonUtilities.setLblCheckboxState(false, self.view.lblTCContentsCheckboxIcon);
                }
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.showTermsAndConditionsLockCard();

            };
            this.view.btnCancel.onClick = function() {
                self.view.flxTermsAndConditionsPopUp.isVisible = false;
            };
            this.view.flxClose.onClick = function() {
                self.view.flxTermsAndConditionsPopUp.isVisible = false;
            };
            this.view.flxTCContentsCheckbox.onClick = function() {
                CommonUtilities.toggleFontCheckbox(self.view.lblTCContentsCheckboxIcon);
            };
            this.view.btnSave.onClick = function() {
                if (CommonUtilities.isFontIconChecked(self.view.lblTCContentsCheckboxIcon)) {
                    FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    CommonUtilities.setLblCheckboxState(true, self.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon);
                } else {
                    FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    CommonUtilities.setLblCheckboxState(false, self.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon);
                }
                self.view.flxTermsAndConditionsPopUp.isVisible = false;
            };
        },
        /**
         * showLockCardGuidelines - Shows the guidelines for Locking a card and sets flow actions.
         * @param {Object} - card object.
         */
        showLockCardGuidelines: function(card) {
            var self = this;
            self.EnableTermsAndConditionsForLockCards();
            this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.LockCard"));
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardLockVerificationStep.CardActivation.lblWarning, kony.i18n.getLocalizedString("i18n.CardManagement.LockingCard").replace('$CardType', card.cardType.toLowerCase()).replace('$CardNumber', card.maskedCardNumber), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.CardActivation.lblIns1, kony.i18n.getLocalizedString("i18n.CardManagement.LockedCardGuideline1"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.CardActivation.lblIns2, kony.i18n.getLocalizedString("i18n.CardManagement.LockedCardGuideline2"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.CardActivation.lblIns3, kony.i18n.getLocalizedString("i18n.CardManagement.LockedCardGuideline3"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.CardActivation.lblIns4, kony.i18n.getLocalizedString("i18n.CardManagement.LockedCardGuideline4"), accessibilityConfig);
            var buttonsJSON = {
                'btnConfirm': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString('i18n.common.proceed'),
                    'toolTip': kony.i18n.getLocalizedString('i18n.common.proceed')
                },
                'btnModify': {
                    'isVisible': false,
                    'text': kony.i18n.getLocalizedString("i18n.common.modifiy"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.common.modifiy")
                },
                'btnCancel': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.transfers.Cancel")
                },
            };
            this.alignConfirmButtons(buttonsJSON);
            FormControllerUtility.disableButton(this.view.CardLockVerificationStep.confirmButtons.btnConfirm);
            CommonUtilities.setLblCheckboxState(false, this.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon);
            this.view.CardLockVerificationStep.CardActivation.flxCheckbox.onTouchEnd = function() {
                CommonUtilities.toggleFontCheckbox(self.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon);
                if (CommonUtilities.isFontIconChecked(self.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon)) {
                    FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    CommonUtilities.setLblCheckboxState(true, self.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon);
                } else {
                    FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    CommonUtilities.setLblCheckboxState(false, self.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon);
                }
            };
            var params = {
                'card': card
            };
            this.view.CardLockVerificationStep.confirmButtons.btnCancel.onClick = function() {
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards();
            };
            if (CommonUtilities.isCSRMode()) {
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = CommonUtilities.disableButtonActionForCSRMode();
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.skin = CommonUtilities.disableButtonSkinForCSRMode();
            } else {
                this.view.CardLockVerificationStep.CardActivation.flxCheckbox.onTouchEnd = function() {
                    CommonUtilities.toggleFontCheckbox(self.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon);
                    if (CommonUtilities.isFontIconChecked(self.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon)) {
                        FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                        CommonUtilities.setLblCheckboxState(true, self.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon);
                    } else {
                        FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                        CommonUtilities.setLblCheckboxState(false, self.view.CardLockVerificationStep.CardActivation.lblRememberMeIcon);
                    }
                }.bind(this);
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = self.initMFAFlow.bind(this, params, kony.i18n.getLocalizedString("i18n.CardManagement.LockCard"));
            }
        },
        alignConfirmButtons: function(buttonsJSON) {
            if (buttonsJSON.btnModify.isVisible) {
                this.view.CardLockVerificationStep.confirmButtons.btnCancel.left = '30.33%';
                if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile)
                    this.view.CardLockVerificationStep.confirmButtons.height = "170dp";
                else
                    this.view.CardLockVerificationStep.confirmButtons.height = "120dp";
            } else {
                if (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) this.view.CardLockVerificationStep.confirmButtons.btnCancel.right = '26.5%';
                else this.view.CardLockVerificationStep.confirmButtons.btnCancel.right = '16.5%';
                this.view.CardLockVerificationStep.confirmButtons.height = "120dp";
            }
            this.view.CardLockVerificationStep.confirmButtons.btnConfirm.setVisibility(buttonsJSON.btnConfirm.isVisible);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardLockVerificationStep.confirmButtons.btnConfirm, buttonsJSON.btnConfirm.text, accessibilityConfig);
            this.view.CardLockVerificationStep.confirmButtons.btnConfirm.toolTip = buttonsJSON.btnConfirm.toolTip;
            this.view.CardLockVerificationStep.confirmButtons.btnModify.setVisibility(buttonsJSON.btnModify.isVisible);
            CommonUtilities.setText(this.view.CardLockVerificationStep.confirmButtons.btnModify, buttonsJSON.btnModify.text, accessibilityConfig);
            this.view.CardLockVerificationStep.confirmButtons.btnModify.toolTip = buttonsJSON.btnModify.toolTip;
            this.view.CardLockVerificationStep.confirmButtons.btnCancel.setVisibility(buttonsJSON.btnCancel.isVisible);
            CommonUtilities.setText(this.view.CardLockVerificationStep.confirmButtons.btnCancel, buttonsJSON.btnCancel.text, accessibilityConfig);
            this.view.CardLockVerificationStep.confirmButtons.btnCancel.toolTip = buttonsJSON.btnCancel.toolTip;
            this.view.forceLayout();
        },
        /**
         * unlockCard - Entry point for unlock card flow.
         * @param {Object} - card object.
         */
        unlockCard: function(card) {
            this.showUnlockCardGuidelines(card);
            this.view.forceLayout();
        },
        /**
         * showUnlockCardViewAndShowMFAScreen - Sets the UI for unlock card flow.
         * @param {Object} params - contains the card details.
         * @param {String} action - contains the action to be performed.
         */
        showUnlockCardViewAndShowMFAScreen: function(params, action) {
            this.hideAllCardManagementViews();
            this.hideAllCardManagementRightViews();
            this.view.flxActivateCard.setVisibility(false);
            this.view.flxCardVerification.setVisibility(true);
            this.view.CardLockVerificationStep.setVisibility(true);
            this.view.CardLockVerificationStep.flxLeft.setVisibility(true);
            this.view.CardLockVerificationStep.flxVerifyByOptions.setVisibility(true);
            this.view.flxTermsAndConditions.setVisibility(true);
            this.setCardDetails(params.card);
            this.showMFAScreen(params, kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCard"));
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * Method used to show the unlock card guidelines screen.
         * @param {Object} card - contains the card object.
         */
        showUnlockCardGuidelines: function(card) {
            var self = this;
            this.hideAllCardManagementViews();
            this.hideAllCardManagementRightViews();
            this.view.flxActivateCard.setVisibility(true);
            this.view.flxTermsAndConditions.setVisibility(true);
            self.EnableTermsAndConditionsForUnLockCards();
            this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCard"));
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardActivation.lblWarning, kony.i18n.getLocalizedString("i18n.CardManagement.UnlockingCard").replace('$CardType', card.cardType.toLowerCase()).replace('$CardNumber', card.maskedCardNumber), accessibilityConfig);
            CommonUtilities.setText(this.view.CardActivation.lblHeading2, kony.i18n.getLocalizedString("i18n.CardManagement.BenefitsOfUnlockingTheCard"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardActivation.lblIns1, kony.i18n.getLocalizedString("i18n.CardManagement.UnlockBenefit1"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardActivation.lblIns2, kony.i18n.getLocalizedString("i18n.CardManagement.UnlockBenefit2"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardActivation.lblIns3, kony.i18n.getLocalizedString("i18n.CardManagement.UnlockBenefit3"), accessibilityConfig);
            this.view.CardActivation.flxFour.setVisibility(false);
            FormControllerUtility.disableButton(this.view.CardActivation.btnProceed);
            CommonUtilities.setLblCheckboxState(false, this.view.CardActivation.lblRememberMeIcon);
            this.view.CardActivation.btnCancel.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
            this.view.CardActivation.btnProceed.toolTip = kony.i18n.getLocalizedString("i18n.common.proceed");
            if (CommonUtilities.isCSRMode()) {
                this.view.CardActivation.btnProceed.onClick = CommonUtilities.disableButtonActionForCSRMode();
                this.view.CardActivation.btnProceed.skin = CommonUtilities.disableButtonSkinForCSRMode();
            } else {
                this.view.CardActivation.flxCheckbox.onTouchEnd = function() {
                    CommonUtilities.toggleFontCheckbox(self.view.CardActivation.lblRememberMeIcon);
                    if (CommonUtilities.isFontIconChecked(self.view.CardActivation.lblRememberMeIcon)) {
                        FormControllerUtility.enableButton(self.view.CardActivation.btnProceed);
                        CommonUtilities.setLblCheckboxState(true, self.view.lblTCContentsCheckboxIcon);
                    } else {
                        FormControllerUtility.disableButton(self.view.CardActivation.btnProceed);
                        CommonUtilities.setLblCheckboxState(false, self.view.lblTCContentsCheckboxIcon);
                    }
                }.bind(this);
                this.view.CardActivation.btnProceed.onClick = function() {
                    var params = {
                        'card': card
                    };
                    self.initMFAFlow.call(self, params, kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCard"));
                }.bind(this);
            }
            this.AdjustScreen();
			this.view.CardActivation.lblHeader.setFocus(true);
        },
        /**
         * EnableTermsAndConditionsForUnLockCards - Method to enable terms and conditions on unlock card.
         */
        EnableTermsAndConditionsForUnLockCards: function() {
            var self = this;
            this.view.CardActivation.btnTermsAndConditions.onClick = function() {
                self.view.flxTermsAndConditionsPopUp.height = (self.view.flxMain.info.frame.height + 270) + "dp";
                self.view.flxTermsAndConditionsPopUp.isVisible = true;
                self.view.lblTermsAndConditions.setFocus(true);
                if (CommonUtilities.isFontIconChecked(self.view.CardActivation.lblRememberMeIcon)) {
                    CommonUtilities.setLblCheckboxState(true, self.view.lblTCContentsCheckboxIcon);
                } else {
                    CommonUtilities.setLblCheckboxState(false, self.view.lblTCContentsCheckboxIcon);
                }
            };
            this.view.btnCancel.onClick = function() {
                self.view.flxTermsAndConditionsPopUp.isVisible = false;
            };
            this.view.flxClose.onClick = function() {
                self.view.flxTermsAndConditionsPopUp.isVisible = false;
            };
            this.view.flxTCContentsCheckbox.onClick = function() {
                CommonUtilities.toggleFontCheckbox(self.view.lblTCContentsCheckboxIcon);
            };
            this.view.btnSave.onClick = function() {
                if (CommonUtilities.isFontIconChecked(self.view.lblTCContentsCheckboxIcon)) {
                    CommonUtilities.setLblCheckboxState(true, self.view.CardActivation.lblRememberMeIcon);
                    FormControllerUtility.enableButton(self.view.CardActivation.btnProceed);
                } else {
                    FormControllerUtility.disableButton(self.view.CardActivation.btnProceed);
                    CommonUtilities.setLblCheckboxState(false, self.view.CardActivation.lblRememberMeIcon);
                }
                self.view.flxTermsAndConditionsPopUp.isVisible = false;
            };
        },
        /**
         * Method used as the entry point for report lost screen.
         * @param {Object} card - contains the card object.
         */
        reportLost: function(card) {
            this.showReportLostView();
            this.setCardDetails(card);
            this.showReportLostGuidelines(card);
            this.setMobileHeader(kony.i18n.getLocalizedString("i18n.CardManagement.ReportLostOrStolen"));
            this.AdjustScreen();
            this.view.forceLayout();
            this.view.CardLockVerificationStep.confirmHeaders.lblHeading.setFocus(true);
        },
        /**
         * Method used to show report lost view.
         */
        showReportLostView: function() {
            this.hideAllCardManagementViews();
            this.hideAllCardManagementRightViews();
            this.view.flxCardVerification.setVisibility(true);
            this.view.CardLockVerificationStep.setVisibility(true);
            this.view.CardLockVerificationStep.flxLeft.setVisibility(true);
            this.view.CardLockVerificationStep.flxCardReplacement.setVisibility(true);
            this.view.flxTermsAndConditions.setVisibility(true);
            this.view.CardLockVerificationStep.WarningMessage.flxIAgree.setVisibility(false);
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * Method used to set report card lost guidelines.
         */
        showReportLostGuidelines: function(card) {
            var self = this;
            this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.LostOrStolen"));
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardLockVerificationStep.confirmHeaders.lblHeading, kony.i18n.getLocalizedString("i18n.CardManagement.ReportLostOrStolen"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.WarningMessage.rtxWarningText1, kony.i18n.getLocalizedString("i18n.CardManagement.ReportLostOrStolenGuideline1"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.WarningMessage.rtxWarningText2, kony.i18n.getLocalizedString("i18n.CardManagement.ReportLostOrStolenGuideline2"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.WarningMessage.rtxWarningText3, kony.i18n.getLocalizedString("i18n.CardManagement.ReportLostOrStolenGuideline3"), accessibilityConfig);
            this.view.CardLockVerificationStep.WarningMessage.flxWarningText4.setVisibility(false);
            this.view.CardLockVerificationStep.lblReason2.setVisibility(true);
            CommonUtilities.setText(this.view.CardLockVerificationStep.lblReason2, kony.i18n.getLocalizedString("i18n.CardManagement.PleaseEnterTheReasonMessage"), accessibilityConfig);
            this.view.CardLockVerificationStep.lbxReason2.setVisibility(true);
            var reasonsMasterData = [];
            reasonsMasterData.push([OLBConstants.CARD_REPORTLOST_REASON.LOST, kony.i18n.getLocalizedString("kony.mb.cardManage.Lost")], [OLBConstants.CARD_REPORTLOST_REASON.STOLEN, kony.i18n.getLocalizedString("kony.mb.cardManage.Stolen")]);
            this.view.CardLockVerificationStep.lbxReason2.masterData = reasonsMasterData;
            this.view.CardLockVerificationStep.lbxReason2.selectedKey = OLBConstants.CARD_REPORTLOST_REASON.LOST;
            this.view.CardLockVerificationStep.tbxNoteOptional.text = "";
            this.view.CardLockVerificationStep.tbxNoteOptional.maxTextLength = OLBConstants.NOTES_LENGTH;
            this.view.CardLockVerificationStep.lblUpgrade.setVisibility(false);
            this.view.CardLockVerificationStep.flxAddresslabel.setVisibility(false);
            this.view.CardLockVerificationStep.flxAddress.setVisibility(false);
            var buttonsJSON = {
                'btnConfirm': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString('i18n.common.proceed'),
                    'toolTip': kony.i18n.getLocalizedString('i18n.common.proceed')
                },
                'btnModify': {
                    'isVisible': false,
                    'text': kony.i18n.getLocalizedString("i18n.common.modifiy"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.common.modifiy")
                },
                'btnCancel': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.transfers.Cancel")
                },
            };
            this.alignConfirmButtons(buttonsJSON);
            this.view.CardLockVerificationStep.confirmButtons.btnCancel.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
            if (CommonUtilities.isCSRMode()) {
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = CommonUtilities.disableButtonActionForCSRMode();
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.skin = CommonUtilities.disableButtonSkinForCSRMode();
            } else {
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = function() {
                    var params = {
                        'card': card,
                        'Reason': self.view.CardLockVerificationStep.lbxReason2.selectedKey,
                        'notes': self.view.CardLockVerificationStep.tbxNoteOptional.text
                    };
                    self.initMFAFlow.call(self, params, kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost"));
                }.bind(this);
            }
        },
        /**
         * Method used as entry point method for change pin flow.
         * @param {Object} card - contains the card object.
         */
        changePin: function(card) {
            this.showChangePinView();
            this.setCardDetails(card);
            if (card.cardType === 'Credit') {
                this.startOfflineChangePinFlow(card);
            } else if (card.cardType === 'Debit') {
                this.startOnlineChangePinFlow(card);
            }
            this.setMobileHeader(kony.i18n.getLocalizedString("i18n.CardManagement.ChangePin"))
            this.view.forceLayout();
            this.AdjustScreen();
            this.view.CardLockVerificationStep.confirmHeaders.lblHeading.setFocus(true);
        },
        /**
         * Method used to show change pin view.
         */
        showChangePinView: function() {
            this.hideAllCardManagementViews();
            this.view.flxCardVerification.setVisibility(true);
            this.view.CardLockVerificationStep.setVisibility(true);
            this.view.CardLockVerificationStep.flxLeft.setVisibility(true);
            this.view.flxTermsAndConditions.setVisibility(true);
            this.view.CardLockVerificationStep.WarningMessage.flxIAgree.setVisibility(false);
            this.view.CardLockVerificationStep.Copywarning0b8a8390f76a040.flxIAgree.setVisibility(false);
            this.view.CardLockVerificationStep.warning.flxIAgree.setVisibility(false);
            this.AdjustScreen();
        },
        /**
         * Method used to start online change pin flow.
         * @param {Object} card - contains the card object.
         */
        startOnlineChangePinFlow: function(card) {
            var self = this;
            this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.ChangeCardPin"));
            this.hideAllCardManagementRightViews();
            this.view.CardLockVerificationStep.flxConfirmPIN.right = "";
            this.view.CardLockVerificationStep.flxConfirmPIN.setVisibility(true);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardLockVerificationStep.warning.rtxWarningText1, kony.i18n.getLocalizedString("i18n.CardManagement.OnlineChangePinGuideline1"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.warning.rtxWarningText2, kony.i18n.getLocalizedString("i18n.CardManagement.OnlineChangePinGuideline2"), accessibilityConfig);
            this.view.CardLockVerificationStep.warning.flxWarningText3.setVisibility(false);
            this.view.CardLockVerificationStep.warning.flxWarningText4.setVisibility(false);
            this.view.CardLockVerificationStep.lblReason.setVisibility(false);
            this.view.CardLockVerificationStep.lbxReason.setVisibility(false);
            this.view.CardLockVerificationStep.tbxCurrentPIN.text = "";
            this.view.CardLockVerificationStep.tbxNewPIN.text = "";
            this.view.CardLockVerificationStep.imgNewPIN.setVisibility(false);
            this.view.CardLockVerificationStep.tbxConfirmPIN.text = "";
            this.view.CardLockVerificationStep.imgConfirmPIN.setVisibility(false);
            this.view.CardLockVerificationStep.tbxNote.text = "";
            this.view.CardLockVerificationStep.tbxNote.maxTextLength = OLBConstants.NOTES_LENGTH;
            this.view.CardLockVerificationStep.tbxConfirmPIN.secureTextEntry = false;
            FormControllerUtility.disableButton(this.view.CardLockVerificationStep.confirmButtons.btnConfirm);
            var buttonsJSON = {
                'btnConfirm': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.common.proceed"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.common.proceed")
                },
                'btnModify': {
                    'isVisible': false,
                    'text': kony.i18n.getLocalizedString("i18n.common.modifiy"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.common.modifiy")
                },
                'btnCancel': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.transfers.Cancel")
                },
            };
            this.alignConfirmButtons(buttonsJSON);
            this.view.CardLockVerificationStep.confirmButtons.btnCancel.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
            if (CommonUtilities.isCSRMode()) {
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = CommonUtilities.disableButtonActionForCSRMode();
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.skin = CommonUtilities.disableButtonSkinForCSRMode();
            } else {
                this.view.CardLockVerificationStep.tbxCurrentPIN.onKeyUp = function() {
                   this.hideServerError();
                    var enteredPin = self.view.CardLockVerificationStep.tbxCurrentPIN.text;
                    if (self.isValidPin(enteredPin) && self.isValidPin(self.view.CardLockVerificationStep.tbxNewPIN.text) && self.view.CardLockVerificationStep.tbxNewPIN.text === self.view.CardLockVerificationStep.tbxConfirmPIN.text) {
                        FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    } else {
                        FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    }
                }.bind(this);
                this.view.CardLockVerificationStep.tbxNewPIN.onKeyUp = function() {
               this.hideServerError();
                    var enteredPin = self.view.CardLockVerificationStep.tbxNewPIN.text;
                    if (self.isValidPin(enteredPin) && self.isValidPin(self.view.CardLockVerificationStep.tbxCurrentPIN.text) && enteredPin === self.view.CardLockVerificationStep.tbxConfirmPIN.text) {
                        FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    } else {
                        FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    }
                    if (self.isValidPin(enteredPin) && enteredPin === self.view.CardLockVerificationStep.tbxConfirmPIN.text) {
                        self.view.CardLockVerificationStep.imgConfirmPIN.setVisibility(true);
                        self.view.CardLockVerificationStep.imgConfirmPIN.src = 'success_green.png';
                        self.view.forceLayout();
                    } else {
                        self.view.CardLockVerificationStep.imgConfirmPIN.setVisibility(false);
                    }
                    if (self.isValidPin(enteredPin)) {
                        self.view.CardLockVerificationStep.imgNewPIN.setVisibility(true);
                        self.view.CardLockVerificationStep.imgNewPIN.src = 'success_green.png';
                        self.view.forceLayout();
                    } else {
                        self.view.CardLockVerificationStep.imgNewPIN.setVisibility(false);
                    }
                }.bind(this);
                this.view.CardLockVerificationStep.tbxConfirmPIN.onKeyUp = function() {
                    this.hideServerError();
                    var enteredPin = self.view.CardLockVerificationStep.tbxConfirmPIN.text;
                    if (self.isValidPin(enteredPin) && self.isValidPin(self.view.CardLockVerificationStep.tbxCurrentPIN.text) && enteredPin === self.view.CardLockVerificationStep.tbxNewPIN.text) {
                        FormControllerUtility.enableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    } else {
                        FormControllerUtility.disableButton(self.view.CardLockVerificationStep.confirmButtons.btnConfirm);
                    }
                    if (self.isValidPin(enteredPin) && enteredPin === self.view.CardLockVerificationStep.tbxNewPIN.text) {
                        self.view.CardLockVerificationStep.imgConfirmPIN.setVisibility(true);
                        self.view.CardLockVerificationStep.imgConfirmPIN.src = 'success_green.png';
                        self.view.forceLayout();
                    } else {
                        self.view.CardLockVerificationStep.imgConfirmPIN.setVisibility(false);
                    }
                }.bind(this);
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = function() {
                    var params = {
                        'card': card,
                        'reason': self.view.CardLockVerificationStep.lbxReasonPinChange.selectedKey,
                        'notes': self.view.CardLockVerificationStep.tbxNote.text,
                        'newPin': self.view.CardLockVerificationStep.tbxConfirmPIN.text,
                        'pinNumber':self.view.CardLockVerificationStep.tbxCurrentPIN.text
                    };
                    self.initMFAFlow(params, kony.i18n.getLocalizedString("i18n.CardManagement.ChangePin"));
                }.bind(this);
            }
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * Method used to check if the entered pin is valid or not.
         * @param {String} pin - contains the entered pin.
         */
        isValidPin: function(pin) {
            var regex = new RegExp('^[0-9]{4,4}$');
            if (regex.test(pin)) {
                for (var i = 1; i < pin.length; i++) {
                    if (Number(pin[i]) - 1 !== Number(pin[i - 1])) {
                        return true;
                    }
                }
            }
            return false;
        },
        /**
         * Method used to start teh offline change pin flow.
         * @param {Object} card - contains the card object.
         */
        startOfflineChangePinFlow: function(card) {
            var self = this;
            var selectedOption = "E-mail ID";
            this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.ChangeCardPin"));
            this.hideAllCardManagementRightViews();
            this.view.CardLockVerificationStep.flxChangeCardPin.setVisibility(true);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardLockVerificationStep.Copywarning0b8a8390f76a040.rtxWarningText1, kony.i18n.getLocalizedString("i18n.CardManagement.OfflineChangePinGuideline1"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.Copywarning0b8a8390f76a040.rtxWarningText2, kony.i18n.getLocalizedString("i18n.CardManagement.OfflineChangePinGuideline2"), accessibilityConfig);
            this.view.CardLockVerificationStep.Copywarning0b8a8390f76a040.flxWarningText3.setVisibility(false);
            this.view.CardLockVerificationStep.Copywarning0b8a8390f76a040.flxWarningText4.setVisibility(false);
            var reasonsMasterData = [];
            reasonsMasterData.push([OLBConstants.CARD_CHANGE_PIN_REASON.PIN_COMPROMISED, OLBConstants.CARD_CHANGE_PIN_REASON.PIN_COMPROMISED]);
            reasonsMasterData.push([OLBConstants.CARD_CHANGE_PIN_REASON.FORGOT_PIN, OLBConstants.CARD_CHANGE_PIN_REASON.FORGOT_PIN]);
            reasonsMasterData.push([OLBConstants.CARD_CHANGE_PIN_REASON.OTHER, OLBConstants.CARD_CHANGE_PIN_REASON.OTHER]);
            this.view.CardLockVerificationStep.lbxReasonPinChange.masterData = reasonsMasterData;
            this.view.CardLockVerificationStep.lbxReasonPinChange.selectedKey = OLBConstants.CARD_CHANGE_PIN_REASON.PIN_COMPROMISED;
            this.view.CardLockVerificationStep.tbxNotePinChange.text = "";
            this.view.CardLockVerificationStep.tbxNotePinChange.maxTextLength = OLBConstants.NOTES_LENGTH;
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.CardLockVerificationStep.lblOption1, kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailId"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.lblOption2, kony.i18n.getLocalizedString("i18n.ProfileManagement.PhoneNumbers"), accessibilityConfig);
            CommonUtilities.setText(this.view.CardLockVerificationStep.lblOption3, kony.i18n.getLocalizedString("i18n.ProfileManagement.postalAddress"), accessibilityConfig);
            this.view.CardLockVerificationStep.lblCheckBox1.skin = ViewConstants.SKINS.CARD_RADIOBTN_LABEL_SELECTED;
            this.view.CardLockVerificationStep.lblCheckBox1.text = "M";
            this.view.CardLockVerificationStep.lblCheckBox2.skin = ViewConstants.SKINS.CARDS_RADIOBTN_LABEL_UNSELECTED;
            this.view.CardLockVerificationStep.lblCheckBox2.text = "L";
            this.view.CardLockVerificationStep.lblCheckBox3.skin = ViewConstants.SKINS.CARDS_RADIOBTN_LABEL_UNSELECTED;
            this.view.CardLockVerificationStep.lblCheckBox3.text = "L";
            this.view.CardLockVerificationStep.rtxRegisteredOption.text = kony.i18n.getLocalizedString("i18n.CardManagement.RegisteredEmailID") + " " + applicationManager.getUserPreferencesManager().getUserEmail();;
            this.view.CardLockVerificationStep.flxCheckBox1.onTouchEnd = function() {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                self.view.CardLockVerificationStep.lblCheckBox1.skin = ViewConstants.SKINS.CARD_RADIOBTN_LABEL_SELECTED;
                self.view.CardLockVerificationStep.lblCheckBox1.text = "M";
                self.view.CardLockVerificationStep.lblCheckBox2.skin = ViewConstants.SKINS.CARDS_RADIOBTN_LABEL_UNSELECTED;
                self.view.CardLockVerificationStep.lblCheckBox2.text = "L";
                self.view.CardLockVerificationStep.lblCheckBox3.skin = ViewConstants.SKINS.CARDS_RADIOBTN_LABEL_UNSELECTED;
                self.view.CardLockVerificationStep.lblCheckBox3.text = "L";
                selectedOption = "E-mail ID";
                self.view.CardLockVerificationStep.rtxRegisteredOption.text = kony.i18n.getLocalizedString("i18n.CardManagement.RegisteredEmailID") + " " + applicationManager.getUserPreferencesManager().getUserEmail();;
            };
            this.view.CardLockVerificationStep.flxCheckBox2.onTouchEnd = function() {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                self.view.CardLockVerificationStep.lblCheckBox1.skin = ViewConstants.SKINS.CARDS_RADIOBTN_LABEL_UNSELECTED;
                self.view.CardLockVerificationStep.lblCheckBox1.text = "L";
                self.view.CardLockVerificationStep.lblCheckBox2.skin = ViewConstants.SKINS.CARD_RADIOBTN_LABEL_SELECTED;
                self.view.CardLockVerificationStep.lblCheckBox2.text = "M";
                self.view.CardLockVerificationStep.lblCheckBox3.skin = ViewConstants.SKINS.CARDS_RADIOBTN_LABEL_UNSELECTED;
                self.view.CardLockVerificationStep.lblCheckBox3.text = "L";
                selectedOption = "Phone No";
                self.view.CardLockVerificationStep.rtxRegisteredOption.text = kony.i18n.getLocalizedString("i18n.CardManagement.RegisteredPhoneNo") + " " + applicationManager.getUserPreferencesManager().getUserPhone();
            };
            this.view.CardLockVerificationStep.flxCheckBox3.onTouchEnd = function() {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                self.view.CardLockVerificationStep.lblCheckBox1.skin = ViewConstants.SKINS.CARDS_RADIOBTN_LABEL_UNSELECTED;
                self.view.CardLockVerificationStep.lblCheckBox1.text = "L";
                self.view.CardLockVerificationStep.lblCheckBox2.skin = ViewConstants.SKINS.CARDS_RADIOBTN_LABEL_UNSELECTED;
                self.view.CardLockVerificationStep.lblCheckBox2.text = "L";
                self.view.CardLockVerificationStep.lblCheckBox3.skin = ViewConstants.SKINS.CARD_RADIOBTN_LABEL_SELECTED;
                self.view.CardLockVerificationStep.lblCheckBox3.text = "M";
                selectedOption = 'Postal Address';
                self.view.CardLockVerificationStep.rtxRegisteredOption.text = kony.i18n.getLocalizedString("i18n.CardManagement.RegisteredAddress") + " " + card.billingAddress;
            };
            var buttonsJSON = {
                'btnConfirm': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.common.proceed"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.common.proceed")
                },
                'btnModify': {
                    'isVisible': false,
                    'text': kony.i18n.getLocalizedString("i18n.common.modifiy"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.common.modifiy")
                },
                'btnCancel': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.transfers.Cancel")
                },
            };
            this.alignConfirmButtons(buttonsJSON);
            FormControllerUtility.enableButton(this.view.CardLockVerificationStep.confirmButtons.btnConfirm);
            this.view.CardLockVerificationStep.confirmButtons.btnCancel.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
            this.view.CardLockVerificationStep.confirmButtons.btnCancel.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
            if (CommonUtilities.isCSRMode()) {
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = CommonUtilities.disableButtonActionForCSRMode();
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.skin = CommonUtilities.disableButtonSkinForCSRMode();
            } else {
                this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = function() {
                    var params = {
                        'card': card,
                        'CardAccountNumber': card.maskedCardNumber,
                        'CardAccountName': card.productName,
                        'RequestReason': self.view.CardLockVerificationStep.lbxReasonPinChange.selectedKey,
                        'AdditionalNotes': self.view.CardLockVerificationStep.tbxNotePinChange.text,
                        'AccountType': 'CARD',
                        'RequestCode': 'NEW_PIN',
                        'Channel': OLBConstants.CHANNEL_DESKTOP
                    };
                    if (selectedOption === 'Postal Address') {
                        params['Address_id'] = self.getSelectedAddressId();
                    } else if (selectedOption === "Phone No") {
                        var contactNumbers = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.fetchUserPhoneNumbers();
                        params['communication_id'] = contactNumbers.filter(function(item) {
                            return item.isPrimary === "true"
                        })[0].id;
                    } else {
                        var emailids = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.fetchUserEmailIds();
                        params['communication_id'] = emailids.filter(function(item) {
                            return item.isPrimary === "true"
                        })[0].id;
                    }
                    self.initMFAFlow(params, "Offline_Change_Pin");
                }.bind(this);
            }
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * Method used as entry point method for set limits flow.
         * @param {Object} card - contains the card object.
         */
        setLimits: function(card) {
            this.initLimitsSliders(card);
            this.setCardLimitsGoToManageCards();
            this.editCardLimit();
            this.setCardLimitGoBackToCardLimits(card);
            this.setCardLimitShowConfirm(card);
            this.showSetCardLimitsOverviewView();
            this.view.lblCardName.text = card.productName;
            this.view.rtxCardNr.text = card.maskedCardNumber;
            this.view.lblWithdrawalLimitValue.text = card.dailyWithdrawalLimit;
            this.view.lblPurchaseLimitValue.text = card.purchaseLimit;
          	this.view.btnEditLimitWithdrawal.toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.EditLimit");
            this.view.btnEditLimitPurchase.toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.EditLimit");
            this.setMobileHeader(kony.i18n.getLocalizedString("i18n.CardManagement.SetCardLimits"));
            this.view.lblContactUsLimits.onTouchEnd = function() {
                var informationContentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "appName": "AboutUsMA",
                    "moduleName": "InformationContentUIModule"
                });
                informationContentModule.presentationController.showContactUsPage();
            };
            this.view.lblContactUs.onTouchEnd = function() {
                var informationContentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "appName": "AboutUsMA",
                    "moduleName": "InformationContentUIModule"
                });
                informationContentModule.presentationController.showContactUsPage();
            };
            this.view.forceLayout();
            this.AdjustScreen();
            this.view.lblSetCardLimitsHeader.setFocus(true);
        },
        /**
         * Sets the UI for set limits Overview flow.
         */
        showSetCardLimitsOverviewView: function() {
            this.hideAllCardManagementViews();
            this.view.rtxCardNr.setVisibility(true);
            this.view.btnRestoreWithdrawlDefaults.setVisibility(false);
            this.view.btnRestorePurchaseDefaults.setVisibility(false);
            //this.view.btnRestoreDefaults.setVisibility(false);
            this.view.flxSetCardLimits.setVisibility(true);
            this.view.flxCardLimits.setVisibility(true);
            this.view.flxSetCardLimitsOverview.setVisibility(true);
            this.view.flxRightBarSetCardLimits.setVisibility(true);
            this.view.forceLayout();
            this.AdjustScreen();
            this.view.lblSetCardLimitsHeader.setFocus(true);
        },
        /**
         * Sets the UI for set limits go to Manage Cards.
         */
        setCardLimitsGoToManageCards: function() {
          	this.view.btnBack.toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.Back");
            this.view.btnBack.onClick = () => {
                this.hideAllCardManagementViews();
                this.showCards();
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards();
            };
            this.view.btnManageCards.onClick = () => {
                this.hideAllCardManagementViews();
                this.showCards();
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards();
            };
        },
        /**
         * Sets the UI for set limits New flow.
         */
        showSetCardLimitsNewView: function(res) {
            this.hideAllCardManagementViews();
            var isMirrorLayoutEnabled = CommonUtilities2.isMirrorLayoutEnabled();
            //this.view.rtxCardNr.setVisibility(false);
            this.view.flxSetCardLimits.setVisibility(true);
            this.view.flxCardLimits.setVisibility(true);
            this.view.flxSetCardLimitsNew.setVisibility(true);
           if(res==="withdrawl"){
             this.view.btnRestoreWithdrawlDefaults.setVisibility(true);
             this.view.btnRestoreWithdrawlDefaults.toolTip = kony.i18n.getLocalizedString('i18n.CardManagement.RestoreDefaults');
             this.view.btnRestorePurchaseDefaults.setVisibility(false);            
           }
           if(res==="purchase"){             
             this.view.btnRestorePurchaseDefaults.right = "2.1%";
             if(isMirrorLayoutEnabled) {
               this.view.btnRestorePurchaseDefaults.width = "";
               this.view.btnRestorePurchaseDefaults.right = "";
             }
             this.view.btnRestorePurchaseDefaults.setVisibility(true);
             this.view.btnRestorePurchaseDefaults.toolTip = kony.i18n.getLocalizedString('i18n.CardManagement.RestoreDefaults');
             this.view.btnRestoreWithdrawlDefaults.setVisibility(false);
           }
            //this.view.btnRestoreDefaults.setVisibility(true);
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * Sets the UI for set limits Edit Limit.
         */
        editCardLimit: function() {
          var res;
            this.view.btnEditLimitWithdrawal.onClick = () => {
                res="withdrawl";
                this.showSetCardLimitsNewView(res);
                this.view.limitPrevWithdrawalSlider.selectedValue = this.view.limitWithdrawalSlider.selectedValue;
                this.view.flxDailyWithdrawalLimit.setVisibility(true);
                this.view.flxDailyPurchaseLimit.setVisibility(false);
            };
            this.view.btnEditLimitPurchase.onClick = () => {
               res="purchase";
                this.showSetCardLimitsNewView(res);
                this.view.limitPrevPurchaseSlider.selectedValue = this.view.limitPurchaseSlider.selectedValue;
                this.view.flxDailyWithdrawalLimit.setVisibility(false);
                this.view.flxDailyPurchaseLimit.setVisibility(true);
            };
        },
        /**
         * Sets the UI for set limits go to Card limits.
         */
        setCardLimitGoBackToCardLimits: function(card) {
            this.view.confirmButtons.btnCancel.toolTip = kony.i18n.getLocalizedString('i18n.konybb.common.cancel');
            this.view.confirmButtons.btnCancel.onClick = () => {
                this.restoreDefaultsWithdrawalLim(card);
                this.restoreDefaultsPurchaseLim(card);
                this.showSetCardLimitsOverviewView();
            };
            this.view.btnBackToCardLimits.onClick = () => {
                this.showSetCardLimitsOverviewView();
            };
        },
        /**
         * Sets the UI for set limits Confirm.
         */
        setCardLimitShowConfirm: function(card) {
          	this.view.confirmButtons.btnConfirm.toolTip = kony.i18n.getLocalizedString('i18n.common.confirm');
            this.view.confirmButtons.btnConfirm.onClick = () => {
                this.hideAllCardManagementViews();
                applicationManager.getPresentationUtility().showLoadingScreen();
                if(CommonUtilities.getSCAType()==0)
                this.updateCardLimits(card);
                else
                this.updateCardLimitsSCA(card);
                //            this.showNewCardLimitAcknowledgement(card);
            };
        },
        //ADDING SCA CODE
        setCVVScreenSCA: function(card) {
            FormControllerUtility.showProgressBar(this.view);
            let rmsComponent = new com.temenos.infinity.sca.rmsComponent({"appName" : "ResourcesHIDMA"});
      let scopeObj = this;
      let appSessionId = "";
            if(OLBConstants.CLIENT_PROPERTIES && OLBConstants.CLIENT_PROPERTIES.SCA_RISK_ASSESSMENT && OLBConstants.CLIENT_PROPERTIES.SCA_RISK_ASSESSMENT.toUpperCase() === "TRUE")
             appSessionId = applicationManager.getRmsSessionID();
                 this.action = "CARD_MANAGEMENT_ACTIVATE_CARD";
                
                rmsComponent.rmsActionSuccess = function(output) {
					FormControllerUtility.hideProgressBar(this.view);
                   if (output.userBlock == "true") {
                     var errorMessage = kony.i18n.getLocalizedString("kony.sca.rms.userBlock");
                     var viewProperties = {};
                     viewProperties.serverError = errorMessage;
                     viewProperties.progressBar = false;
                     scopeObj.updateFormUI(viewProperties);
                   }
                   else {
                    this.stepUp = output.stepUp;
                    scopeObj.setCVVScreen(card,this.stepUp);
                   }
                 };
                 rmsComponent.rmsActionFailure = function(output){
                    FormControllerUtility.hideProgressBar(this.view);
                   this.stepUp = "true";
                   scopeObj.setCVVScreen(card,this.stepUp);
                 };
         
                 rmsComponent.rmsActionCreate(this.action, appSessionId);
               
                 
             },
        updateCardLimitsSCA : function(card){
            FormControllerUtility.showProgressBar(this.view);
      let rmsComponent = new com.temenos.infinity.sca.rmsComponent({"appName" : "ResourcesHIDMA"});
      let scopeObj = this;
            var rmsaction = "";
            if (this.view.flxDailyWithdrawalLimit.isVisible)
              rmsaction = "WITHDRAWAL";
            else
              rmsaction = "PURCHASE";
            rmsaction = "CARD_MANAGEMENT_UPDATE_"+rmsaction;
            let appSessionId = "";
            if(OLBConstants.CLIENT_PROPERTIES && OLBConstants.CLIENT_PROPERTIES.SCA_RISK_ASSESSMENT && OLBConstants.CLIENT_PROPERTIES.SCA_RISK_ASSESSMENT.toUpperCase() === "TRUE")
             appSessionId = applicationManager.getRmsSessionID();
            rmsComponent.rmsActionSuccess = function(output) {
                FormControllerUtility.hideProgressBar(this.view);
              if (output.userBlock == "true") {
                 var errorMessage = kony.i18n.getLocalizedString("kony.sca.rms.userBlock");
                      var viewProperties = {};
                      viewProperties.serverError = errorMessage;
                      viewProperties.progressBar = false;
                      scopeObj.updateFormUI(viewProperties);
              }
              else {
                var stepUp = output.stepUp;
                card.isMFARequired = stepUp;
                scopeObj.updateCardLimits(card);
              }
            };
            rmsComponent.rmsActionFailure = function(output){
            FormControllerUtility.hideProgressBar(this.view);
              var stepUp = "true";
              card.isMFARequired = stepUp;
              scopeObj.updateCardLimits(card);
            };
    
            rmsComponent.rmsActionCreate(rmsaction, appSessionId);
          },
          initMFAFlow: function(params, action) {
            FormControllerUtility.showProgressBar(this.view);
            var rmsaction = action;
            let scopeObj = this;
            let rmsComponent = new com.temenos.infinity.sca.rmsComponent({
                "appName": "ResourcesHIDMA"
            });
            let appSessionId = "";
            if (OLBConstants.CLIENT_PROPERTIES && OLBConstants.CLIENT_PROPERTIES.SCA_RISK_ASSESSMENT && OLBConstants.CLIENT_PROPERTIES.SCA_RISK_ASSESSMENT.toUpperCase() === "TRUE") appSessionId = applicationManager.getRmsSessionID();
            rmsaction = rmsaction.replace(/ /g, "_");
            switch (rmsaction) {
                case "Report_Lost":
                    rmsaction = "Report_Card_Stolen";
                    break;
                case "Offline_Change_Pin":
                    rmsaction = "Change_Pin";
                    break;
                 deafult: rmsaction = rmsaction;
            }
            rmsaction = "CARD_MANAGEMENT_" + rmsaction;
            rmsComponent.rmsActionSuccess = function(output){
                FormControllerUtility.hideProgressBar(this.view);
                if (output.userBlock == "true") {
                    var errorMessage = kony.i18n.getLocalizedString("kony.sca.rms.userBlock");
                    var viewProperties = {};
                    viewProperties.serverError = errorMessage;
                    viewProperties.progressBar = false;
                    scopeObj.updateFormUI(viewProperties);
                } else {
                    this.stepUp = output.stepUp;
                    params.isMFARequired = this.stepUp;
                    scopeObj.initSCARMSflow(params, action);
                }
            };
            rmsComponent.rmsActionFailure = function(output){
                FormControllerUtility.hideProgressBar(this.view);
                this.stepUp = "true";
                params.isMFARequired = this.stepUp;
                scopeObj.initSCARMSflow(params, action);
            };
            rmsComponent.rmsActionCreate(rmsaction, appSessionId);
        },
          initSCARMSflow: function(params,action){ 
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.verifySecureAccessCodeSuccess(params, action);
        },
        /**
         * Method to show acknowledgement for new card limit 
         * @param {Object} - notification object
         */
        showNewCardLimitAcknowledgement: function(response) {
            var data = this.notificationObject;
            this.hideAllCardManagementViews();
            // Acknowledgment
            this.view.flxAcknowledgment.setVisibility(true);
            this.view.Acknowledgement.btnLearnAbout.setVisibility(false);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblCardAcknowledgement, kony.i18n.getLocalizedString('i18n.CardManagement.SetCardLimits'), accessibilityConfig);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            if (this.view.flxDailyWithdrawalLimit.isVisible) {
                CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, kony.i18n.getLocalizedString('i18n.CardManagement.YourDailyWithdrawalLimitHasBeenUpdated'), accessibilityConfig);
            };
            if (this.view.flxDailyPurchaseLimit.isVisible) {
                CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, kony.i18n.getLocalizedString('i18n.CardManagement.YourDailyPurchaseLimitHasBeenUpdated'), accessibilityConfig);
            };
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.Acknowledgement.lblRequestID, kony.i18n.getLocalizedString('i18n.CardManagement.requestId'), accessibilityConfig);
            this.view.Acknowledgement.lblRefrenceNumber.text = response.orderId; //response.data.request_id;
            this.view.Acknowledgement.lblUnlockCardMessage.setVisibility(false);
            this.view.Acknowledgement.lblRequestID.setVisibility(true);
            this.view.Acknowledgement.lblRefrenceNumber.setVisibility(true);
            // Card details
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.ConfirmDialog.confirmHeaders.lblHeading, kony.i18n.getLocalizedString('i18n.CardManagement.YourCardDetails'), accessibilityConfig);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardHolder.lblKey, kony.i18n.getLocalizedString('i18n.CardManagement.Card'), accessibilityConfig);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardName.lblKey, kony.i18n.getLocalizedString('i18n.ChequeBookReq.account'), accessibilityConfig);
            if (this.view.flxDailyWithdrawalLimit.isVisible) {
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueCreditLimit.lblKey, kony.i18n.getLocalizedString('i18n.CardManagement.NewDailyWithdrawalLimit'), accessibilityConfig);
                this.view.ConfirmDialog.keyValueCreditLimit.lblValue.text = this.view.lblSetWithdrawalLimitSlider.text;
                //CommonUtilities.formatCurrencyWithCommas(this.view.limitWithdrawalSlider.selectedValue,"","$");
            }
            if (this.view.flxDailyPurchaseLimit.isVisible) {
                CommonUtilities.setText(this.view.ConfirmDialog.keyValueCreditLimit.lblKey, kony.i18n.getLocalizedString('i18n.CardManagement.NewDailyPurchaseLimit'), accessibilityConfig);
                this.view.ConfirmDialog.keyValueCreditLimit.lblValue.text = this.view.lblSetPurchaseLimitSlider.text;
                //CommonUtilities.formatCurrencyWithCommas(this.view.limitPurchaseSlider.selectedValue,"","$"); 
            }
            this.view.ConfirmDialog.keyValueCardHolder.lblValue.text = response.card.productName + " " + response.card.maskedCardNumber;
            this.view.ConfirmDialog.keyValueCardName.lblValue.text = response.card.accountName + " " + response.card.maskedAccountNumber;
            this.view.ConfirmDialog.confirmButtons.setVisibility(false);
            this.view.ConfirmDialog.keyValueValidThrough.setVisibility(false);
            this.view.ConfirmDialog.keyValueServiceProvider.setVisibility(false);
            this.view.ConfirmDialog.keyValueCardName.lblColon.setVisibility(false);
            this.view.ConfirmDialog.keyValueAvailableCredit.setVisibility(false);
            this.view.ConfirmDialog.keyValueCreditLimit.lblColon.setVisibility(false);
            this.view.flxPrint.setVisibility(false);
            // Actions
            this.view.btnBackToCards.setVisibility(false);
            this.view.btnManageCards.setVisibility(true);
            this.view.btnManageCards.toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.ManageCards");
            this.view.btnBackToCardLimits.setVisibility(true);
            this.view.btnBackToCardLimits.toolTip = kony.i18n.getLocalizedString("i18n.CardManagement.BackToCardLimits");
            this.notificationObject = {};
            CommonUtilities.hideProgressBar(this.view);
            applicationManager.getPresentationUtility().dismissLoadingScreen();
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * Method used to change the text to title case.
         * @param {String} str - string to be changed to title case.
         */
        toTitleCase: function(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        },
        /**
         * Method used to change the radio button selection in the replace card flow.
         * @param {Object} radioButtons - contains the radio buttons list.
         * @param {Object} selectedradioButton - contains the raido button selected widget Object.
         */
        onRadioButtonSelection: function(radioButtons, selectedradioButton) {
            if (selectedradioButton.widgets()["0"].id === "lblAddressCheckBox1") {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                this.view.CardLockVerificationStep.lblAddressCheckBox1.text = "M";
                this.view.CardLockVerificationStep.lblAddressCheckBox1.skin = "sknlblOLBFonts0273E420pxOlbFontIcons";
                this.view.CardLockVerificationStep.lblAddressCheckBox2.text = "L";
                this.view.CardLockVerificationStep.lblAddressCheckBox2.skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
                this.view.CardLockVerificationStep.lblAddressCheckBox3.text = "L";
                this.view.CardLockVerificationStep.lblAddressCheckBox3.skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
            }
            if (selectedradioButton.widgets()["0"].id === "lblAddressCheckBox2") {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                this.view.CardLockVerificationStep.lblAddressCheckBox2.text = "M";
                this.view.CardLockVerificationStep.lblAddressCheckBox2.skin = "sknlblOLBFonts0273E420pxOlbFontIcons";
                this.view.CardLockVerificationStep.lblAddressCheckBox1.text = "L";
                this.view.CardLockVerificationStep.lblAddressCheckBox1.skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
                this.view.CardLockVerificationStep.lblAddressCheckBox3.text = "L";
                this.view.CardLockVerificationStep.lblAddressCheckBox3.skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
            }
            if (selectedradioButton.widgets()["0"].id === "lblAddressCheckBox3") {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                this.view.CardLockVerificationStep.lblAddressCheckBox3.text = "M";
                this.view.CardLockVerificationStep.lblAddressCheckBox3.skin = "sknlblOLBFonts0273E420pxOlbFontIcons";
                this.view.CardLockVerificationStep.lblAddressCheckBox1.text = "L";
                this.view.CardLockVerificationStep.lblAddressCheckBox1.skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
                this.view.CardLockVerificationStep.lblAddressCheckBox2.text = "L";
                this.view.CardLockVerificationStep.lblAddressCheckBox2.skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
            }
        },
        /**
         * Validates given secure access code.
         * @param {String} secureaccesscode - contains the secure access code entered in form.
         */
        isValidSecureAccessCode: function(secureaccesscode) {
            if (secureaccesscode.length !== OLBConstants.OTPLength) return false;
            var regex = new RegExp('^[0-9]+$');
            return regex.test(secureaccesscode);
        },
        /**
         * Method to show travel notification acknowledgement for create/update travel notification
         * @param {Object} - notification object
         */
        showTravelNotificationAcknowledgement: function(response) {
            var self = this;
            var data = this.notificationObject;
            var cards = "";
            self.hideAllCardManagementViews();
            this.view.flxPrint.setVisibility(false);
            this.view.flxPrint.setVisibility(false);
            this.view.ConfirmDialog.keyValueCreditLimit.setVisibility(false);
            this.view.ConfirmDialog.keyValueAvailableCredit.setVisibility(false);
            this.view.flxAcknowledgment.setVisibility(true);
            this.view.Acknowledgement.lblRequestID.setVisibility(false);
            this.view.Acknowledgement.lblRefrenceNumber.setVisibility(false);
            this.view.Acknowledgement.btnLearnAbout.setVisibility(false);
            self.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString('i18n.CardManagement.manageTravelPlanAcknowledgement'));
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblCardAcknowledgement, kony.i18n.getLocalizedString('i18n.CardManagement.travelNotification'), accessibilityConfig);
            if (this.notificationObject.isEditFlow) {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, kony.i18n.getLocalizedString('i18n.CardManagement.travelNotificationUpdateMsg'), accessibilityConfig);
                CommonUtilities.setText(this.view.Acknowledgement.lblUnlockCardMessage, kony.i18n.getLocalizedString('i18n.CardManagement.requestId') + this.notificationObject.requestId, accessibilityConfig);
            } else {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, kony.i18n.getLocalizedString('i18n.CardManagement.travelNotificationCreatationMsg'), accessibilityConfig);
                CommonUtilities.setText(this.view.Acknowledgement.lblUnlockCardMessage, kony.i18n.getLocalizedString('i18n.CardManagement.requestId') + response.data.request_id, accessibilityConfig);
            }
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.ConfirmDialog.confirmHeaders.lblHeading, kony.i18n.getLocalizedString('i18n.CardManagement.travelDetails'), accessibilityConfig);
            this.view.ConfirmDialog.flxDestination.setVisibility(true);
            this.view.ConfirmDialog.flxSelectCards.setVisibility(true);
            this.view.ConfirmDialog.flxDestination2.setVisibility(false);
            this.view.ConfirmDialog.flxDestination3.setVisibility(false);
            this.view.ConfirmDialog.flxDestination4.setVisibility(false);
            this.view.ConfirmDialog.flxDestination5.setVisibility(false);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardHolder.lblKey, kony.i18n.getLocalizedString('i18n.CardManagement.SelectedStartDate'), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardHolder.lblValue, data.fromDate, accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardName.lblKey, kony.i18n.getLocalizedString('i18n.CardManagement.SelectedEndDate'), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardName.lblValue, data.toDate, accessibilityConfig);
            this.view.ConfirmDialog.flxDestination1.text = kony.i18n.getLocalizedString('i18n.CardManagement.SelectedDestination1');
            CommonUtilities.setText(this.view.ConfirmDialog.rtxDestination1, data.locations[0], accessibilityConfig);
            if (data.locations[1]) {
                this.view.ConfirmDialog.flxDestination2.setVisibility(true);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.ConfirmDialog.lblDestination2, kony.i18n.getLocalizedString('i18n.CardManagement.SelectedDestination2'), accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.rtxDestination2, data.locations[1], accessibilityConfig);
            }
            if (data.locations[2]) {
                this.view.ConfirmDialog.flxDestination3.setVisibility(true);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.ConfirmDialog.lblDestination3, kony.i18n.getLocalizedString('i18n.CardManagement.SelectedDestination3'), accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.rtxDestination3, data.locations[2], accessibilityConfig);
            }
            if (data.locations[3]) {
                this.view.ConfirmDialog.flxDestination4.setVisibility(true);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.ConfirmDialog.lblDestination4, kony.i18n.getLocalizedString('i18n.CardManagement.SelectedDestination4'), accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.rtxDestination4, data.locations[3], accessibilityConfig);
            }
            if (data.locations[4]) {
                this.view.ConfirmDialog.flxDestination5.setVisibility(true);
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.ConfirmDialog.lblDestination5, kony.i18n.getLocalizedString('i18n.CardManagement.SelectedDestination5'), accessibilityConfig);
                CommonUtilities.setText(this.view.ConfirmDialog.rtxDestination5, data.locations[4], accessibilityConfig);
            }
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            this.view.ConfirmDialog.keyValueValidThrough.setVisibility(true);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueValidThrough.lblKey, kony.i18n.getLocalizedString('i18n.ProfileManagement.PhoneNumber'), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueValidThrough.lblValue, data.phone, accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueServiceProvider.lblKey, kony.i18n.getLocalizedString('i18n.CardManagement.AddInformation'), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueServiceProvider.lblValue, data.notes, accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.lblKey6, kony.i18n.getLocalizedString('i18n.CardManagement.selectedCards'), accessibilityConfig);
            var cardSegData = [];
            for (var i = 0; i < data.selectedcards.length; i++) {
                if (data.selectedcards[i].icon) {
                    if (data.selectedcards[i].icon == "s" || data.selectedcards[i].icon == "r") {
                        var card = {};
                        data.selectedcards.forEach(function(dataItem) {
                            card = {
                                "lblValue": {
                                    "text": dataItem.name + "-" + dataItem.number
                                },
                                "lblIcon": {
                                    "text": dataItem.icon,
                                    "Skin": "sknLblOLBFontIconsvs"
                                }
                            };
                        });
                        cardSegData.push(card);
                    }
                }
            }
            if (cardSegData.length > 0) {
                this.view.ConfirmDialog.segSelectedCards.setData(cardSegData);
                this.view.ConfirmDialog.rtxValueA.setVisibility(false);
                this.view.ConfirmDialog.flxCards.setVisibility(true);
            } else {
                data.selectedcards.map(function(dataItem) {
                    cards = cards + dataItem.name + "-" + dataItem.number + "<br/>";
                });
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.ConfirmDialog.rtxValueA, cards, accessibilityConfig);
                this.view.ConfirmDialog.rtxValueA.setVisibility(true);
                this.view.ConfirmDialog.flxCards.setVisibility(false);
            }
            //             data.selectedcards.map(function(dataItem) {
            //                 cards = cards + dataItem.name + "-" + dataItem.number + "<br/>";
            //             });
            //             var accessibilityConfig=CommonUtilities.getaccessibilityConfig();
            // 			CommonUtilities.setText(this.view.ConfirmDialog.rtxValueA, cards, accessibilityConfig);
            this.view.btnBackToCards.setVisibility(true);
            this.view.btnRequestReplacement.setVisibility(true);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.btnRequestReplacement, kony.i18n.getLocalizedString('i18n.CardManagement.BackToCards'), accessibilityConfig);
            this.view.btnRequestReplacement.toolTip = kony.i18n.getLocalizedString('i18n.CardManagement.BackToCards');
            this.view.btnRequestReplacement.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
            this.view.btnBackToCards.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
            CommonUtilities.setText(this.view.btnBackToCards, kony.i18n.getLocalizedString('i18n.CardManagement.goToTravelPlan'), accessibilityConfig);
            this.view.btnBackToCards.toolTip = kony.i18n.getLocalizedString('i18n.CardManagement.goToTravelPlan');
            this.view.btnBackToCards.onClick = function() {
                self.fetchTravelNotifications();
            }
            this.notificationObject = {};
            CommonUtilities.hideProgressBar(this.view);
            this.view.forceLayout();
            this.AdjustScreen();
        },
        /**
         * Shows the MFA Options available.
         * @param {Object} - card object .
         * @param {String} action - contains the action to be performed.
         */
        showMFAScreen: function(params, action) {
            var self = this;
            if (action === kony.i18n.getLocalizedString("i18n.CardManagement.LockCard")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.LockCardVerification"));
            } else if (action === kony.i18n.getLocalizedString("i18n.CardManagement.ChangePin") || action === "Offline_Change_Pin") {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.ChangePinVerification"));
            } else if (action === kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCard")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCardVerification"));
            } else if (action === kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.LostOrStolenVerification"));
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.CardLockVerificationStep.confirmHeaders.lblHeading, kony.i18n.getLocalizedString("i18n.CardManagement.LostOrStolenCardVerification"), accessibilityConfig);
            } else if (action === kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.requestReplaceCard")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.CardManagement.ReplaceCardVerification"));
            } else if (action === kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard")) {
                this.setBreadCrumbAndHeaderDataForCardOperation(kony.i18n.getLocalizedString("i18n.cardsManagement.cancelVerification"));
            }
            this.hideServerError();
            this.view.flxTermsAndConditions.setVisibility(false);
            var selectedMFAOption = OLBConstants.MFA_OPTIONS.SECURE_ACCESS_CODE;
            self.view.CardLockVerificationStep.imgUsernameVerificationcheckedRadio.src = ViewConstants.IMAGES.ICON_RADIOBTN_ACTIVE;
            self.view.CardLockVerificationStep.imgUsernameVerificationcheckedRadioOption2.src = ViewConstants.IMAGES.ICON_RADIOBTN;
            if (applicationManager.getConfigurationManager().isSecurityQuestionConfigured === "true") {
                this.view.CardLockVerificationStep.flxUsernameVerificationOption2.setVisibility(true);
            } else {
                this.view.CardLockVerificationStep.flxUsernameVerificationOption2.setVisibility(false);
            }
            this.hideAllCardManagementRightViews();
            this.view.CardLockVerificationStep.flxVerifyByOptions.setVisibility(true);
            FormControllerUtility.enableButton(this.view.CardLockVerificationStep.confirmButtons.btnConfirm);
            this.view.CardLockVerificationStep.flxUsernameVerificationRadioOption1.onTouchEnd = function() {
                self.view.CardLockVerificationStep.imgUsernameVerificationcheckedRadio.src = ViewConstants.IMAGES.ICON_RADIOBTN_ACTIVE;
                self.view.CardLockVerificationStep.imgUsernameVerificationcheckedRadioOption2.src = ViewConstants.IMAGES.ICON_RADIOBTN;
                selectedMFAOption = OLBConstants.MFA_OPTIONS.SECURE_ACCESS_CODE;
            };
            this.view.CardLockVerificationStep.flxUsernameVerificationRadiobtnOption2.onTouchEnd = function() {
                self.view.CardLockVerificationStep.imgUsernameVerificationcheckedRadio.src = ViewConstants.IMAGES.ICON_RADIOBTN;
                self.view.CardLockVerificationStep.imgUsernameVerificationcheckedRadioOption2.src = ViewConstants.IMAGES.ICON_RADIOBTN_ACTIVE;
                selectedMFAOption = OLBConstants.MFA_OPTIONS.SECURITY_QUESTIONS;
            };
            var buttonsJSON = {
                'btnConfirm': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString('i18n.common.proceed'),
                    'toolTip': kony.i18n.getLocalizedString('i18n.common.proceed')
                },
                'btnModify': {
                    'isVisible': false,
                    'text': kony.i18n.getLocalizedString("i18n.common.modifiy"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.common.modifiy")
                },
                'btnCancel': {
                    'isVisible': true,
                    'text': kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
                    'toolTip': kony.i18n.getLocalizedString("i18n.transfers.Cancel")
                },
            };
            this.alignConfirmButtons(buttonsJSON);
            this.view.CardLockVerificationStep.confirmButtons.btnCancel.onClick = function() {
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards();
            };
            this.view.CardLockVerificationStep.confirmButtons.btnConfirm.onClick = function() {
                if (selectedMFAOption === OLBConstants.MFA_OPTIONS.SECURE_ACCESS_CODE) {
                    FormControllerUtility.showProgressBar(self.view);
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.sendSecureAccessCode(params, action);
                } else if (selectedMFAOption === OLBConstants.MFA_OPTIONS.SECURITY_QUESTIONS) {
                    FormControllerUtility.showProgressBar(self.view);
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.fetchSecurityQuestions(params, action);
                }
            };
            this.AdjustScreen();
        },
        /**
         * Returns the contact for which the isPrimary flag is true. Expects only one of the contacts to be primary. If there are more than one, returns the last.
         * @param {Array} - Array of contacts.
         */
        getPrimaryContact: function(contacts) {
            var primaryContact = "";
            contacts.forEach(function(item) {
                if (item.isPrimary === "true") {
                    primaryContact = item.Value;
                }
            });
            return primaryContact;
        },
        constructCardsViewModel: function(cards) {
            var self = this;
            var cardsViewModel = [];
            cards.forEach(function(card) {
                if (card.cardType === "Debit") {
                    cardsViewModel.push(self.getDebitCardViewModel(card));
                } else if (card.cardType === "Credit") {
                    cardsViewModel.push(self.getCreditCardViewModel(card));
                }
            });
            return cardsViewModel;
        },
        /**
         * getDebitCardViewModel - Generates a viewModel for the given debit card.
         * @param {Object} - Debit card object.
         * @returns {Object}  - constructed view model for debit card.
         */
        getDebitCardViewModel: function(debitCard) {
            var mfaManager = applicationManager.getMFAManager();
            var formatUtil = applicationManager.getFormatUtilManager();
            mfaManager.setServiceId("SERVICE_ID_40");
            var debitCardViewModel = [];
            var debitCardActions = [];
            debitCardViewModel.cardId = debitCard.cardId;
            debitCardViewModel.cardType = debitCard.cardType;
            debitCardViewModel.cardStatus = debitCard.cardStatus;
            debitCardViewModel.cardNumber = debitCard.cardNumber;
            debitCardViewModel.maskedCardNumber = formatUtil.formatCardNumber(debitCard.maskedCardNumber);
            debitCardViewModel.productName = debitCard.cardProductName;
            debitCardViewModel.validThrough = this.getValidThroughForCard(debitCard.expiryDate);
            debitCardViewModel.dailyWithdrawalLimit = CommonUtilities.formatCurrencyWithCommas(debitCard.withdrawlLimit, false, debitCard.currencyCode);
            debitCardViewModel.purchaseLimit = CommonUtilities.formatCurrencyWithCommas(debitCard.purchaseLimit, false, debitCard.currencyCode);
            debitCardViewModel.withdrawalMinLimit = debitCard.withdrawalMinLimit;
            debitCardViewModel.withdrawalMaxLimit = debitCard.withdrawalMaxLimit;
            debitCardViewModel.withdrawalStepLimit = debitCard.withdrawalStepLimit;
            debitCardViewModel.purchaseMinLimit = debitCard.purchaseMinLimit;
            debitCardViewModel.purchaseMaxLimit = debitCard.purchaseMaxLimit;
            debitCardViewModel.purchaseStepLimit = debitCard.purchaseStepLimit;
            debitCardViewModel.accountName = debitCard.accountName;
            debitCardViewModel.maskedAccountNumber = debitCard.maskedAccountNumber;
            debitCardViewModel.serviceProvider = debitCard.serviceProvider;
            debitCardViewModel.cardHolder = debitCard.cardHolderName;
            debitCardViewModel.secondaryCardHolder = debitCard.secondaryCardHolder;
            debitCardViewModel.isTypeBusiness = debitCard.isTypeBusiness;
            debitCardViewModel.isExpiring = debitCard.isExpiring;
            debitCardViewModel.currencyCode = debitCard.currencyCode;
            debitCardViewModel.accountNumber = debitCard.accountNumber;
			debitCardViewModel.maskedNickNameAndNumber = debitCard.maskedNickNameAndNumber;
            switch (debitCard.cardStatus) {
                case "Active": {
                    debitCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.LockCard"));
                    debitCardActions.push(kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.requestReplaceCard"));
                    debitCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost"));
                    debitCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.SetLimits"));
                    debitCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.ChangePin"));
                    break;
                }
                case "Locked": {
                    debitCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCard"));
                    debitCardActions.push(kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.requestReplaceCard"));
                    debitCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost"));
                    break;
                }
                case "Reported Lost": {
                    //TODO:
                    break;
                }
                case "Replaced": {
                    debitCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost"));
                    break;
                }
                case "Replace Request Sent": {
                    debitCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost"));
                    break;
                }
                case "Issued": {
                    debitCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.ActivateCard"));
                    break;
                }
                default: {
                    break;
                }
            }
            var validActions = this.getValidActions();
            debitCardActions = debitCardActions.filter(function(action) {
                return validActions.indexOf(action) > -1;
            });
            debitCardViewModel.actions = debitCardActions;
            return debitCardViewModel;
        },
        /**
         * getValidThroughForCard - Generates a validThrough/expiry date for a given timestamp.
         * @param {String} - Expiry Date Timestamp.
         * @returns {String}  - Expiry Date in mm/yy format.
         */
        getValidThroughForCard: function(expiryDate) {
            if (expiryDate === null || expiryDate === undefined || expiryDate === "")
                return "";
            expiryDate = expiryDate.split('T')[0];
            expiryDate = expiryDate.split('-');
            return expiryDate[1] + '/' + expiryDate[0].slice(2);
        },
        /**
         * getCreditCardViewModel - Generates a viewModel for the given credit card.
         * @param {Object} - credit card object.
         * @returns {Object}  - constructed view model for credit card.
         */
        getCreditCardViewModel: function(creditCard) {
            var mfaManager = applicationManager.getMFAManager();
            var formatUtil = applicationManager.getFormatUtilManager();
            var creditCardViewModel = [];
            var creditCardActions = [];
            creditCardViewModel.cardId = creditCard.cardId;
            creditCardViewModel.cardType = creditCard.cardType;
            creditCardViewModel.cardStatus = creditCard.cardStatus;
            creditCardViewModel.cardNumber = creditCard.cardNumber;
            creditCardViewModel.maskedCardNumber = formatUtil.formatCardNumber(creditCard.maskedCardNumber);
            creditCardViewModel.productName = creditCard.cardProductName;
            creditCardViewModel.validThrough = this.getValidThroughForCard(creditCard.expiryDate);
            creditCardViewModel.creditLimit = CommonUtilities.formatCurrencyWithCommas(creditCard.creditLimit, false, creditCard.currencyCode);
            creditCardViewModel.availableCredit = CommonUtilities.formatCurrencyWithCommas(creditCard.availableCredit, false, creditCard.currencyCode);
            creditCardViewModel.dailyWithdrawalLimit = CommonUtilities.formatCurrencyWithCommas(creditCard.withdrawlLimit, false, creditCard.currencyCode);
            creditCardViewModel.purchaseLimit = CommonUtilities.formatCurrencyWithCommas(creditCard.purchaseLimit, false, creditCard.currencyCode);
            creditCardViewModel.withdrawalMinLimit = creditCard.withdrawalMinLimit;
            creditCardViewModel.withdrawalMaxLimit = creditCard.withdrawalMaxLimit;
            creditCardViewModel.withdrawalStepLimit = creditCard.withdrawalStepLimit;
            creditCardViewModel.purchaseMinLimit = creditCard.purchaseMinLimit;
            creditCardViewModel.purchaseMaxLimit = creditCard.purchaseMaxLimit;
            creditCardViewModel.purchaseStepLimit = creditCard.purchaseStepLimit;
            creditCardViewModel.serviceProvider = creditCard.serviceProvider;
            creditCardViewModel.cardHolder = creditCard.cardHolderName;
            creditCardViewModel.secondaryCardHolder = creditCard.secondaryCardHolderName;
            creditCardViewModel.isExpiring = creditCard.isExpiring;
            creditCardViewModel.billingAddress = creditCard.billingAddress;
            creditCardViewModel.accountName = creditCard.accountName;
            creditCardViewModel.maskedAccountNumber = creditCard.maskedAccountNumber;
            creditCardViewModel.rewardsPoint = creditCard.rewardsPoint;
            creditCardViewModel.isTypeBusiness = creditCard.isTypeBusiness;
            creditCardViewModel.currencyCode = creditCard.currencyCode;
            switch (creditCard.cardStatus) {
                case "Active": {
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.LockCard"));
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.requestReplaceCard"));
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost"));
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.SetLimits"));
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.ChangePin"));
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard"));
                    break;
                }
                case "Locked": {
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.UnlockCard"));
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.Accounts.ContextualActions.requestReplaceCard"));
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost"));
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard"));
                    break;
                }
                case "Reported Lost": {
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard"));
                    break;
                }
                case "Replaced": {
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost"));
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard"));
                    break;
                }
                case "Replace Request Sent": {
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.reportedLost"));
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.cardsManagement.cancelCard"));
                    break;
                }
                case "Issued": {
                    creditCardActions.push(kony.i18n.getLocalizedString("i18n.CardManagement.ActivateCard"));
                    break;
                }
                default: {
                    break;
                }
            }
            var validActions = this.getValidActions();
            creditCardActions = creditCardActions.filter(function(action) {
                return validActions.indexOf(action) > -1;
            });
            creditCardViewModel.actions = creditCardActions;
            return creditCardViewModel;
        },
        /**
         * onBreakpointChange : Handles ui changes on .
         * @member of {frmCardManagementController}
         * @param {integer} width - current browser width
         * @return {}
         * @throws {}
         */
        onBreakpointChange: function(width) {
            kony.print('on breakpoint change');
            orientationHandler.onOrientationChange(this.onBreakpointChange);
            this.view.customheader.onBreakpointChangeComponent(width);
            this.setupFormOnTouchEnd(width);
            var scope = this;
            this.view.CustomPopupLogout.onBreakpointChangeComponent(scope.view.CustomPopupLogout, width);
            this.view.CustomAlertPopup.onBreakpointChangeComponent(scope.view.CustomAlertPopup, width);
            var data;
            this.view.breadcrumb.setVisibility(false);
            var responsiveFonts = new ResponsiveFonts();
            this.view.flxTravelPlan.skin = "slFbox";
            this.AdjustScreen();
            if (width === 640 || orientationHandler.isMobile) {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.customheader.lblHeaderMobile, "My Cards", accessibilityConfig);
                responsiveFonts.setMobileFonts();
                this.view.CardLockVerificationStep.cardDetails.skin = "slFbox";
                this.view.CardLockVerificationStep.confirmButtons.btnCancel.skin = "sknBtnffffffBorder0273e31pxRadius2px";
                this.view.btnBackToCardLimits.left = "0%";
                this.view.btnManageCards.left = "0%";
                data = this.view.myCards.segMyCards.data;
                if (data !== undefined) {
                    data.forEach(function(e) {
                        e.template = "flxMyCardsCollapsedMobile";
                        e.flxMyCards = {
                            "clipBounds": false,
                            "skin": "sknFlxffffffRoundedBorder",
                            "onClick": scope.viewCardDetailsMobile
                        }
                    });
                    scope.view.myCards.segMyCards.setData(data);
                }
                scope.view.flxMyCardsView.isVisible = true;
            } else {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.customheader.lblHeaderMobile, "", accessibilityConfig);
                responsiveFonts.setDesktopFonts();
                data = this.view.myCards.segMyCards.data;
                if (data !== undefined) {
                    data.forEach(function(e) {
                        e.template = "flxMyCardsCollapsed";
                        e.flxCollapse = {
                            //   "isVisible": e.cardStatus === "Issued" ? false : true,
                            "onClick": scope.changeRowTemplate
                        }
                    });
                    scope.view.myCards.segMyCards.setData(data);
                }
            }
            this.AdjustScreen();
        },
        hideSearchSegPopup: function() {
            var currFormObj = kony.application.getCurrentForm();
            if ((currFormObj.myCards.flxSearchSegment.isVisible === true && searchSeg === true)) {
                searchSeg = false;
            } else if ((currFormObj.myCards.flxSearchSegment.isVisible === true && searchSeg === false)) {
                setTimeout(function() {
                    currFormObj.myCards.flxSearchSegment.setVisibility(false);
                    searchSeg = true;
                }, "17ms");
            }
        },
        setupFormOnTouchEnd: function(width) {
            var self = this;
            if (width == 640) {
                this.view.onTouchEnd = function() {
                    self.hideSearchSegPopup();
                }
                this.nullifyPopupOnTouchStart();
            } else {
                if (width == 1024) {
                    this.view.onTouchEnd = function() {
                        self.hideSearchSegPopup();
                    }
                    this.nullifyPopupOnTouchStart();
                } else {
                    this.view.onTouchEnd = function() {
                        hidePopups();
                        self.hideSearchSegPopup();
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
        /**
         * viewCardDetailsMobile : Goes to view card details flex, mobile only function
         * @member of {frmCardManagementController}
         * @param {}
         * @return {}
         * @throws {}
         */
        viewCardDetailsMobile: function() {
            //var combinedUser = applicationManager.getConfigurationManager().isCombinedUser === "true";
            var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            if (kony.application.getCurrentBreakpoint() != 640 || !orientationHandler.isMobile) {
                return;
            }
            if (this.view.flxCardDetailsMobile.isVisible == true) {
                return;
            }
            var scope = this;
            var index = this.view.myCards.segMyCards.selectedRowIndex;
            var rowIndex = index[1];
            var data = [];
            data.push(this.view.myCards.segMyCards.data[rowIndex]);
            data[0].template = "flxMyCardsExpandedMobile"
            data[0].flxMyCards = {
                "onClick": null
            };
            data[0].flxDetailsRow1 = {
                "isVisible": false
            };
            data[0].flxDetailsRow4 = {
                "isVisible": true
            };
            data[0].flxBlankSpace2 = {
                "isVisible": true
            };
            data[0].lblCardHeader = {
                //"left": combinedUser ? "125dp" :"95dp",
                "left": this.profileAccess === "both" ? "125dp" : "95dp",
                "text": data[0].lblCardHeader.text
            };
            if (data[0].btnAction1 != undefined) {
                var action1 = data[0].btnAction1.onClick;
                data[0].btnAction1 = {
                    "isVisible": true,
                    "text": data[0].btnAction1.text,
                    "onClick": function() {
                        scope.view.flxCardDetailsMobile.isVisible = false;
                        action1();
                        scope.view.flxHeader.setFocus(true);
                        scope.AdjustScreen();
                    }
                };
            } else {
                data[0].btnAction1 = {
                    "isVisible": false
                }
            }
            if (data[0].btnAction2 != undefined) {
                var action2 = data[0].btnAction2.onClick;
                data[0].btnAction2 = {
                    "isVisible": true,
                    "text": data[0].btnAction2.text,
                    "onClick": function() {
                        scope.view.flxCardDetailsMobile.isVisible = false;
                        action2();
                        scope.view.flxHeader.setFocus(true);
                        scope.AdjustScreen();
                    }
                };
            } else {
                data[0].btnAction2 = {
                    "isVisible": false
                }
            }
            if (data[0].btnAction3 != undefined) {
                var action3 = data[0].btnAction3.onClick;
                data[0].btnAction3 = {
                    "isVisible": true,
                    "text": data[0].btnAction3.text,
                    "onClick": function() {
                        scope.view.flxCardDetailsMobile.isVisible = false;
                        action3();
                        scope.view.flxHeader.setFocus(true);
                        scope.AdjustScreen();
                    }
                };
            } else {
                data[0].btnAction3 = {
                    "isVisible": false
                }
            }
            if (data[0].btnAction4 != undefined) {
                var action4 = data[0].btnAction4.onClick;
                data[0].btnAction4 = {
                    "isVisible": true,
                    "text": data[0].btnAction4.text,
                    "onClick": function() {
                        scope.view.flxCardDetailsMobile.isVisible = false;
                        action4();
                        scope.view.flxHeader.setFocus(true);
                        scope.AdjustScreen();
                    }
                };
            } else {
                data[0].btnAction4 = {
                    "isVisible": false
                }
            }
            if (data[0].btnAction5 != undefined) {
                var action5 = data[0].btnAction5.onClick;
                data[0].btnAction5 = {
                    "isVisible": true,
                    "text": data[0].btnAction5.text,
                    "onClick": function() {
                        scope.view.flxCardDetailsMobile.isVisible = false;
                        action5();
                        scope.AdjustScreen();
                    }
                };
            } else {
                data[0].btnAction5 = {
                    "isVisible": false
                }
            }
            if (data[0].btnAction6 != undefined) {
                var action6 = data[0].btnAction6.onClick;
                data[0].btnAction6 = {
                    "isVisible": true,
                    "text": data[0].btnAction6.text,
                    "onClick": function() {
                        scope.view.flxCardDetailsMobile.isVisible = false;
                        action6();
                        scope.AdjustScreen();
                    }
                };
            } else {
                data[0].btnAction6 = {
                    "isVisible": false
                }
            }
            if (data[0].btnAction7 != undefined) {
                var action7 = data[0].btnAction7.onClick;
                data[0].btnAction7 = {
                    "isVisible": true,
                    "text": data[0].btnAction7.text,
                    "onClick": function() {
                        scope.view.flxCardDetailsMobile.isVisible = false;
                        action7();
                        scope.AdjustScreen();
                    }
                };
            } else {
                data[0].btnAction7 = {
                    "isVisible": false
                }
            }
            if (data[0].btnAction8 != undefined) {
                var action8 = data[0].btnAction8.onClick;
                data[0].btnAction8 = {
                    "isVisible": true,
                    "text": data[0].btnAction8.text,
                    "onClick": function() {
                        scope.view.flxCardDetailsMobile.isVisible = false;
                        action8();
                        scope.AdjustScreen();
                    }
                };
            } else {
                data[0].btnAction8 = {
                    "isVisible": false
                }
            }
            data[0].flxBlankSpace2 = {
                "height": "5dp"
            }
            data[0].flxBlankSpace = {
                "height": "5dp"
            }
            var dataMap = {
                "btnAction1": "btnAction1",
                "btnAction2": "btnAction2",
                "btnAction3": "btnAction3",
                "btnAction4": "btnAction4",
                "btnAction5": "btnAction5",
                "btnAction6": "btnAction6",
                "btnAction7": "btnAction7",
                "btnAction8": "btnAction8",
                "flxActions": "flxActions",
                "flxBlankSpace1": "flxBlankSpace1",
                "flxBlankSpace2": "flxBlankSpace2",
                "flxBlankSpace": "flxBlankSpace",
                "flxCardDetails": "flxCardDetails",
                "flxCardHeader": "flxCardHeader",
                "flxCardImageAndCollapse": "flxCardImageAndCollapse",
                "lblCardsSeperator": "lblCardsSeperator",
                "flxCollapse": "flxCollapse",
                //  "flxDetailsRow1": "flxDetailsRow1",
                "flxDetailsRow10": "flxDetailsRow10",
                "flxDetailsRow2": "flxDetailsRow2",
                "flxDetailsRow3": "flxDetailsRow3",
                "flxDetailsRow4": "flxDetailsRow4",
                "flxDetailsRow5": "flxDetailsRow5",
                "flxDetailsRow6": "flxDetailsRow6",
                "flxDetailsRow7": "flxDetailsRow7",
                "flxDetailsRow8": "flxDetailsRow8",
                "flxDetailsRow9": "flxDetailsRow9",
                "flxMyCards": "flxMyCards",
                "flxMyCardsExpanded": "flxMyCardsExpanded",
                "flxRowIndicatorColor": "flxRowIndicatorColor",
                "lblIdentifier": "lblIdentifier",
                "lblSeparator1": "lblSeparator1",
                "lblSeparator2": "lblSeparator2",
                "lblSeperator": "lblSeperator",
                "imgCard": "imgCard",
                "imgCollapse": "imgCollapse",
                "lblCardHeader": "lblCardHeader",
                "lblCardStatus": "lblCardStatus",
                "lblTravelNotificationEnabled": "lblTravelNotificationEnabled",
                //     "lblKey1": "lblKey1",
                "lblKey10": "lblKey10",
                "lblKey2": "lblKey2",
                "lblKey3": "lblKey3",
                "lblKey4": "lblKey4",
                "lblKey5": "lblKey5",
                "lblKey6": "lblKey6",
                "lblKey7": "lblKey7",
                "lblKey8": "lblKey8",
                "lblKey9": "lblKey9",
                "rtxValue1": "rtxValue1",
                "rtxValue10": "rtxValue10",
                "rtxValue2": "rtxValue2",
                "rtxValue3": "rtxValue3",
                "rtxValue4": "rtxValue4",
                "rtxValue5": "rtxValue5",
                "rtxValue6": "rtxValue6",
                "rtxValue7": "rtxValue7",
                "rtxValue8": "rtxValue8",
                "rtxValue9": "rtxValue9",
                "flxIcon": "flxIcon",
                "imgIcon": "imgIcon"
            };
            this.view.segCardDetails.widgetDataMap = dataMap;
            this.view.segCardDetails.setData(data);
            this.view.flxBackToCards.onClick = function() {
                scope.view.flxMyCardsView.isVisible = true;
                scope.view.flxCardDetailsMobile.isVisible = false;
                kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards();
            }
            this.view.flxHeader.setFocus(true);
            this.view.flxMyCardsView.isVisible = false;
            this.view.flxCardDetailsMobile.isVisible = true;
            this.AdjustScreen();
        },
        showAcknowledgementOnPrintCancel: function() {
            var self = this;
            this.hideAllCardManagementViews();
            this.view.ConfirmDialog.confirmButtons.setVisibility(false);
            this.view.flxAcknowledgment.setVisibility(true);
            this.view.ConfirmDialog.flxDestination.setVisibility(false);
            this.view.ConfirmDialog.flxSelectCards.setVisibility(false);
            this.view.btnRequestReplacement.setVisibility(false);
            this.view.btnBackToCards.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
            this.AdjustScreen();
        },
        printAcknowlegement: function() {
            var acknowledgementData = [];
            acknowledgementData.push({
                key: kony.i18n.getLocalizedString('i18n.common.status'),
                value: this.view.Acknowledgement.lblCardTransactionMessage.text
            });
            acknowledgementData.push({
                key: this.view.ConfirmDialog.keyValueCardHolder.lblKey.text,
                value: this.view.ConfirmDialog.keyValueCardHolder.lblValue.text,
            })
            acknowledgementData.push({
                key: this.view.ConfirmDialog.keyValueCardName.lblKey.text,
                value: this.view.ConfirmDialog.keyValueCardName.lblValue.text
            })
            acknowledgementData.push({
                key: this.view.ConfirmDialog.keyValueValidThrough.lblKey.text,
                value: this.view.ConfirmDialog.keyValueValidThrough.lblValue.text,
            })
            acknowledgementData.push({
                key: this.view.ConfirmDialog.keyValueServiceProvider.lblKey.text,
                value: this.view.ConfirmDialog.keyValueServiceProvider.lblValue.text
            })
            acknowledgementData.push({
                key: this.view.ConfirmDialog.keyValueCreditLimit.lblKey.text,
                value: this.view.ConfirmDialog.keyValueCreditLimit.lblValue.text
            })
            acknowledgementData.push({
                key: this.view.ConfirmDialog.keyValueAvailableCredit.lblKey.text,
                value: this.view.ConfirmDialog.keyValueAvailableCredit.lblValue.text
            })
            var tableList = [{
                tableHeader: kony.i18n.getLocalizedString("i18n.transfers.Acknowledgement"),
                tableRows: acknowledgementData
            }]
            var viewModel = {
                moduleHeader: this.view.lblCardAcknowledgement.text,
                tableList: tableList
            };
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.showPrintPage({
                printKeyValueGroupModel: viewModel
            });
        },
        setMobileHeader: function(text) {
            if (kony.application.getCurrentBreakpoint() === 640) {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.customheader.lblHeaderMobile, text, accessibilityConfig);
            } else {
                var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
                CommonUtilities.setText(this.view.customheader.lblHeaderMobile, "", accessibilityConfig);
            }
        },
        searchCards: function() {
            if (this.view.myCards.txtSearch.text.length > 0) {
                this.view.myCards.flxClearBtn.setVisibility(true)
            }
            var searchString = this.view.myCards.txtSearch.text;
            var presentationController = applicationManager.getModulesPresentationController("ManageCardsUIModule");
            presentationController.searchAccounts(searchString, "frmCardManagement");
        },
        showSearchResultsOfCards: function(data) {
            this.view.myCards.segSearch.widgetDataMap = {
                "flxSearchAccounts": "flxSearchAccounts",
                "lblAccountName": "maskedNickNameAndNumber",
                "cardDetails": "data"
            }
            this.view.myCards.flxSearchSegment.setVisibility(true);
            if (data.length > 0) {
                this.view.myCards.segSearch.setVisibility(true);
                this.view.myCards.flxNoResultsSearch.setVisibility(false);
                this.view.myCards.segSearch.setData(data);
                this.view.myCards.flxSearchSegment.enableScrolling=true;

            } else {
                this.view.myCards.segSearch.setVisibility(false);
                this.view.myCards.flxNoResultsSearch.setVisibility(true);
                this.view.myCards.flxSearchSegment.enableScrolling=false;
            }
        },
        clearSearchItems: function() {
            this.view.myCards.flxSearchSegment.setVisibility(false);
            this.view.myCards.flxClearBtn.setVisibility(false);
            this.view.myCards.txtSearch.text = "";
        },
        searchSegOnRowClick: function() {
            var presentationController = applicationManager.getModulesPresentationController("ManageCardsUIModule");
            var cardsData = presentationController.getAllCardsByAccountNumber(this.view.myCards.segSearch.selectedRowItems[0].accountNumber);
            this.showSelectedCardDetails(cardsData, "SearchClick");
        },
        showSelectedCardDetails: function(selectedAccountNumber, requestFrom) {
            var presentationController = applicationManager.getModulesPresentationController("ManageCardsUIModule");
          if(selectedAccountNumber && selectedAccountNumber.length>0){
            if (requestFrom == "SearchClick" || requestFrom == "AccountsDashboard") {
                this.view.myCards.lblAccountName.text = (selectedAccountNumber && selectedAccountNumber[0].maskedNickNameAndNumber) ? selectedAccountNumber[0].maskedNickNameAndNumber :
                    (selectedAccountNumber[0].maskedAccountNumber) ? selectedAccountNumber[0].maskedAccountNumber : "";
                this.view.myCards.flxAccountName.setVisibility(true);
            }
            var selectedCardDetails = {
                "data": selectedAccountNumber,
                "status": presentationController.CardStatus
            };
            this.clearSearchItems();
            this.showCardsStatus(selectedCardDetails);
          } else{
            this.showCardsNotAvailableScreen();
            CommonUtilities.hideProgressBar(this.view);
            this.AdjustScreen();
          }
        },
        ShowAllCards: function() {
            this.view.myCards.flxAccountName.setVisibility(false);
            var presentationController = applicationManager.getModulesPresentationController("ManageCardsUIModule");
            this.showSelectedCardDetails(presentationController.allCardsData, "AllCards");
        },

        showAccountsForNewCard: function(accountsData) {
            var savings = [];
            var checkings = [];
            if(accountsData && accountsData[1])
                 savings = accountsData[1];
            if(accountsData && accountsData[0])
                 checkings = accountsData[0];
            var accountsDataMerged = checkings.concat(savings);
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            this.view.flxTravelPlan.setVisibility(false);
            this.view.flxMyCards.setVisibility(false);
            this.view.flxRightBar.setVisibility(false);
            this.view.flxTermsAndConditions.setVisibility(false);
            this.view.flxNewcard.setVisibility(true);
            CommonUtilities.setText(this.view.lblNewCardHeader, "", accessibilityConfig);
            CommonUtilities.setText(this.view.lblNewCardHeader, kony.i18n.getLocalizedString("i18n.CardManagement.selectAccountForCard"), accessibilityConfig);
            this.view.flxCardProductsSegments.setVisibility(false);
            this.view.flxCardBody.setVisibility(false);
            this.view.flxAccountsSegments.setVisibility(true);
            var dataMap = {
                "flxMyCardsAccountListItem": "flxMyCardsAccountListItem",
                "flxMyCardsAccountListItemMobile": "flxMyCardsAccountListItemMobile",
                "flxAccountNameWrapper": "flxAccountNameWrapper",
                "lblAccountName": "lblAccountName",
                "lblAccount": "lblAccount",
                "lblseprator": "lblseprator",
                "imgCollapse": "imgCollapse",
                "segMyCardsAccountListItem": "segMyCardsAccountListItem"
            };
            var cardsAccountsSegmentData = [];
            var accounts = {};
            for (var i = 0; i < accountsDataMerged.length; i++) {
                var dataItem = accountsDataMerged[i];
                    accounts = {
                        "flxAccountNameWrapper": {
                            "isVisible": true
                        },
                        "lblAccountName": {
                            "text": dataItem.nickName + " ...." + dataItem.accountID.substring(dataItem.accountID.length-4),//CommonUtilities.mergeAccountNameNumber(dataItem.nickName, dataItem.accountID), //data.nickName + " "+ CommonUtilities.accountNumberMask(data.accountID),
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.nickName + " ...." + dataItem.accountID.substring(dataItem.accountID.length-4),//CommonUtilities.mergeAccountNameNumber(dataItem.nickName, dataItem.accountID), //data.nickName + " "+ CommonUtilities.accountNumberMask(data.accountID),
                            }
                        },
                        "lblAccount": {
                            "text": dataItem.accountType,
                            "accessibilityconfig": {
                                "a11yLabel": dataItem.accountType,
                            }
                        },
                        "imgCollapse": {
                            "src": "pagination_blue.png",
                        },
                        "template": (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) ? "flxMyCardsAccountListItemMobile" : "flxMyCardsAccountListItem",
                        "lblseprator": {
                            "isVisible": true,
                            "text": "."
                        }
                    };
                cardsAccountsSegmentData.push(accounts);
            }
            this.view.segAccounts.widgetDataMap = dataMap;
            if (cardsAccountsSegmentData.length > 0) {
                if (cardsAccountsSegmentData[cardsAccountsSegmentData.length - 1].lblseprator) {
                    cardsAccountsSegmentData[cardsAccountsSegmentData.length - 1].lblseprator.isVisible = false;
                }
            }
            this.view.segAccounts.setData(cardsAccountsSegmentData);
            this.view.segAccounts.onRowClick = this.navigateToNewCardList.bind(this, accountsData);
            this.view.btnCancelAccount.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
            this.view.forceLayout();
            this.AdjustScreen();
        },

        navigateToNewCardList: function(accountsData) {
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            var selectedAccountData = this.getAccountsData(accountsData);
            if(selectedAccountData.availableBalance.slice(0,1)==="-"){
            this.view.flxDowntimeWarning.setVisibility(true);
            CommonUtilities.setText(this.view.rtxDowntimeWarning, kony.i18n.getLocalizedString("i18n.CardManagement.NegativeBalance"), accessibilityConfig);
            }else{
            this.view.flxDowntimeWarning.setVisibility(false);
            var data = this.view.segAccounts.selectedRowItems[0];
            var accountType = data.lblAccount.text;
            var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule");
            manageCardsModule.presentationController.getSelectCardProducts(accountType, selectedAccountData);
            } 
        },

        getAccountsData: function(data) {
            var index = this.view.segAccounts.selectedRowIndex[1];
            var noOfCheckingAccounts = data[0].length;
            if (index >= 0 && index < noOfCheckingAccounts) {
                return data[0][index];
            } else
                return data[1][index % noOfCheckingAccounts];
        },

        showCardProductDetails: function(cardProductDetails, selectedAccountData) {
            var scope = this;
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            this.view.flxTravelPlan.setVisibility(false);
            this.view.flxMyCards.setVisibility(false);
            this.view.flxRightBar.setVisibility(false);
            this.view.flxTermsAndConditions.setVisibility(false);
            this.view.flxNewcard.setVisibility(true);
            CommonUtilities.setText(this.view.lblNewCardHeader, "", accessibilityConfig);
            CommonUtilities.setText(this.view.lblNewCardHeader, kony.i18n.getLocalizedString("i18n.CardManagement.selectCardForAccount"), accessibilityConfig);
            this.view.flxCardBody.setVisibility(false);
            this.view.flxAccountsSegments.setVisibility(false);
            this.view.flxCardProductsSegments.setVisibility(true);
            var dataMap = {
                "flxCardProducts": "flxCardProducts",
                "flxCardProductsMobile": "flxCardProductsMobile",
                "flxMyCards": "flxMyCards",
                "flxProductDetails": "flxProductDetails",
                "flxCardImage": "flxCardImage",
                "imgCard": "imgCard",
                "flxCardDetails": "flxCardDetails",
                "lblCardHeader": "lblCardHeader",
                "lblCardValue1": "lblCardValue1",
                "lblCardValue2": "lblCardValue2",
                "rtxValue": "rtxValue",
                "flxRepresentative": "flxRepresentative",
                "lblRepresentativeheader": "lblRepresentativeheader",
                "flxRepresentativeKeyValue": "flxRepresentativeKeyValue",
                "lblKey1": "lblKey1",
                "lblValue1": "lblValue1",
                "flxPurchaseKeyvalue": "flxPurchaseKeyvalue",
                "lblKey2": "lblKey2",
                "lblValue2": "lblValue2",
                "flxCreditLimitKeyvalue": "flxCreditLimitKeyvalue",
                "lblKey3": "lblKey3",
                "lblValue3": "lblValue3",
                "lblSeparator2": "lblSeparator2",
                "btnSelect": "btnSelect",
                "segMyCardProductDetails": "segMyCardProductDetails"
            };
            var cardsProductDetailsSegmentData = [];
            var productDetails = {};
            for (var i = 0; i < cardProductDetails.cardProducts.length; i++) {
                var dataItem = cardProductDetails.cardProducts[i];
                productDetails = {
                    "flxMyCards": {
                        "isVisible": true
                    },
                    "flxProductDetails": {
                        "isVisible": true
                    },
                    "flxCardImage": {
                        "isVisible": true
                    },
                    "imgCard": {
                        "src": this.getCardImage(dataItem.productName),
                    },
                    "flxCardDetails": {
                        "isVisible": true
                    },
                    "lblCardHeader": {
                        "text": dataItem.productName,
                        "accessibilityconfig": {
                            "a11yLabel": dataItem.productName,
                        }
                    },
                    "lblCardValue1": {
                        "text": dataItem.featureDescription,
                        "accessibilityconfig": {
                            "a11yLabel": dataItem.featureDescription,
                        }
                    },
                    "rtxValue": {
                        "text": dataItem.featureOverview,
                        "accessibilityconfig": {
                            "a11yLabel": dataItem.featureOverview,
                        }
                    },
                    "flxRepresentative": {
                        "isVisible": true
                    },
                    "lblRepresentativeheader": {
                        "text": kony.i18n.getLocalizedString("i18n.CardManagement.RepresentativeExample"),
                        "accessibilityconfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.CardManagement.RepresentativeExample"),
                        }
                    },
                    "flxRepresentativeKeyValue": {
                        "isVisible": true
                    },
                    "lblKey1": {
                        "text": dataItem.representativeLabel1,
                        "accessibilityconfig": {
                            "a11yLabel": dataItem.representativeLabel1,
                        }
                    },
                    "lblValue1": {
                        "text": dataItem.representativeValue1,
                        "accessibilityconfig": {
                            "a11yLabel": dataItem.representativeValue1,
                        }
                    },
                    "flxPurchaseKeyvalue": {
                        "isVisible": true
                    },
                    "lblKey2": {
                        "text": dataItem.representativeLabel2,
                        "accessibilityconfig": {
                            "a11yLabel": dataItem.representativeLabel2,
                        }
                    },
                    "lblValue2": {
                        "text": dataItem.representativeValue2,
                        "accessibilityconfig": {
                            "a11yLabel": dataItem.representativeValue2,
                        }
                    },
                    "flxCreditLimitKeyvalue": {
                        "isVisible": true
                    },
                    "lblKey3": {
                        "text": dataItem.representativeLabel3,
                        "accessibilityconfig": {
                            "a11yLabel": dataItem.representativeLabel3,
                        }
                    },
                    "lblValue3": {
                        "text": dataItem.representativeValue3,
                        "accessibilityconfig": {
                            "a11yLabel": dataItem.representativeValue3,
                        }
                    },
                    "lblSeparator2": ".",
                    "template": (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) ? "flxCardProductsMobile" : "flxCardProducts",
                    "btnSelect": {
                        "text": kony.i18n.getLocalizedString("i18n.NUO.Select"),
                        "onClick": scope.showSetPinScreen.bind(scope, dataItem, selectedAccountData),
                        "accessibilityconfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.NUO.Select"),
                        }
                    },
                };
                cardsProductDetailsSegmentData.push(productDetails);
            }
            this.view.segCardProducts.widgetDataMap = dataMap;
            this.view.segCardProducts.setData(cardsProductDetailsSegmentData);
            this.view.btnCancelCard.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
            this.view.forceLayout();
            this.AdjustScreen();
        },
        getCardImage: function(cardProductName) {
            var cards = {
                "Classic Cashback Card": 'golden_card.png',
                "Rewards Priority Card": 'petro_card.png',
                "Shop@Ease Platinum Card": 'platinum_card.png',
                "Maverick Debit Card": 'shopping_card.png'
            };
            if (cards[cardProductName] !== null || cards[cardProductName] !== undefined)
                return cards[cardProductName];
            else return 'platinum_card.png';
        },
        navigatetoCardsProductDetails: function() {
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            CommonUtilities.setText(this.view.lblNewCardHeader, "", accessibilityConfig);
            CommonUtilities.setText(this.view.lblNewCardHeader, kony.i18n.getLocalizedString("i18n.CardManagement.selectCardForAccount"), accessibilityConfig);
            this.view.flxCardBody.setVisibility(false);
            this.view.flxAccountsSegments.setVisibility(false);
            this.view.flxCardProductsSegments.setVisibility(true);
            this.AdjustScreen();
        },
        validationFields: function() {
          var i = this.view.tbxEnterCardPIN.text;
          var j = this.view.tbxConfirmCardPIN.text
          var isValidtbxEnterCardPin = this.isValidPin(i);
          var isValidtbxConfirmCardPIN = this.isValidPin(j) ;
          if(!isValidtbxEnterCardPin || !isValidtbxConfirmCardPIN)
          {   
            if (i.length ==4 || j.length ==4)
            {
              this.view.lblWarning.setVisibility(!0);    
            this.view.lblWarning.text =  kony.i18n.getLocalizedString("konyolb.cards.debitpinerr");
            }
            else
              this.view.lblWarning.setVisibility(0);
           }
            if (this.view.tbxNameOnCard.text && isValidtbxEnterCardPin && isValidtbxConfirmCardPIN) {
               this.view.lblWarning.setVisibility(0);  
                FormControllerUtility.enableButton(this.view.btnNewCardContinue);
            } else {
                FormControllerUtility.disableButton(this.view.btnNewCardContinue);
            }
        },
        showSetPinScreen: function(selectedCardProductDetails, selectedAccountData) {
            var self = this;
            var account = this.view.segAccounts.selectedRowItems[0];
            var accountValue = account.lblAccountName.text;
            var card = selectedCardProductDetails.productName;
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            var amount = selectedAccountData.availableBalance;
            if (isNaN(amount.slice(0, 1))) {
                amount = amount.substring(1);
            } else {
                amount = amount;
            }
            this.view.flxTravelPlan.setVisibility(false);
            this.view.flxMyCards.setVisibility(false);
            this.view.flxRightBar.setVisibility(false);
            this.view.flxTermsAndConditions.setVisibility(false);
            this.view.flxNewcard.setVisibility(true);
            CommonUtilities.setText(this.view.lblNewCardHeader, "", accessibilityConfig);
            this.setMobileHeader("");
            CommonUtilities.setText(this.view.lblNewCardHeader, kony.i18n.getLocalizedString("i18n.CardManagement.NewCardRequest"), accessibilityConfig);
            this.view.flxAccountsSegments.setVisibility(false);
            this.view.flxCardProductsSegments.setVisibility(false);
            this.view.flxCardBody.setVisibility(true);
            CommonUtilities.setText(this.view.lblAccountvalue, accountValue, accessibilityConfig);
            CommonUtilities.setText(this.view.lblCardValue, card, accessibilityConfig);
            self.restrictCharactersSet();
            this.view.tbxNameOnCard.text = "";
            this.view.tbxEnterCardPIN.text = "";
            this.view.tbxConfirmCardPIN.text = "";
            this.validationFields();
            this.view.tbxNameOnCard.onTextChange = this.validationFields;
            this.view.tbxEnterCardPIN.onTextChange = this.validationFields;
            this.view.tbxConfirmCardPIN.onTextChange = this.validationFields;
            this.view.btnNewCardCancel.onClick = self.navigatetoCardsProductDetails.bind(self);
            this.view.btnNewCardContinue.onClick = function() {
                var manageCardsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule");
                if (self.view.tbxEnterCardPIN.text !== self.view.tbxConfirmCardPIN.text) {
                    self.view.lblWarning.text = kony.i18n.getLocalizedString("i18n.CardManagement.errorMessageForPin");
                    self.view.lblWarning.setVisibility(true);
                } else {
                    self.view.lblWarning.setVisibility(false);
                    var address = manageCardsModule.presentationController.getBillingAddress();
                    if(address === ""){
                        self.view.flxDowntimeWarning.setVisibility(true);
                        CommonUtilities.setText(self.view.rtxDowntimeWarning, kony.i18n.getLocalizedString("i18n.CardManagement.AddAddress"), accessibilityConfig);
                    }
                    else{
                    self.view.flxDowntimeWarning.setVisibility(false);
                    var cardsObj = {
                        pinNumber: self.view.tbxConfirmCardPIN.text,
                        accountId: selectedAccountData.accountID,
                        cardProductName: self.view.lblCardValue.text,
                        withdrawlLimit: selectedCardProductDetails.withdrawlLimit,
                        purchaseLimit: selectedCardProductDetails.purchaseLimit,
                        cardHolderName: self.view.tbxNameOnCard.text,
                        currentBalance: applicationManager.getFormatUtilManager().deFormatAmount(amount),
                        availableBalance: applicationManager.getFormatUtilManager().deFormatAmount(amount),
                        billingAddress: address,
                        // currencyCode:
                        accountType: selectedCardProductDetails.accountType,
                        bankName: selectedAccountData.bankName,
                        accountName: selectedAccountData.accountName,
                        accountBalanceType: selectedAccountData.accountBalanceType,
                        withdrawalMinLimit: selectedCardProductDetails.withdrawalMinLimit,
                        withdrawalMaxLimit: selectedCardProductDetails.withdrawalMaxLimit,
                        withdrawalStepLimit: selectedCardProductDetails.withdrawalStepLimit,
                        purchaseMinLimit: selectedCardProductDetails.purchaseMinLimit,
                        purchaseMaxLimit: selectedCardProductDetails.purchaseMaxLimit,
                        cardDisplayName: self.view.tbxNameOnCard.text
                    }

                    manageCardsModule.presentationController.applyNewCard(cardsObj);
                    }
                }
            };
            this.view.forceLayout();
            this.AdjustScreen();
        },

        showAcknowledgementScreenForApplyCard: function(cardDetails) {
            var self = this;
            var account = this.view.segAccounts.selectedRowItems[0];
            var accountValue = account.lblAccountName.text;
            var card = cardDetails.productName;
            var nameOncard = self.view.tbxNameOnCard.text;
            var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
            this.view.flxMyCardsView.setVisibility(false);
            this.view.flxAcknowledgment.setVisibility(true);
            CommonUtilities.setText(this.view.lblCardAcknowledgement, "", accessibilityConfig);
            CommonUtilities.setText(this.view.lblCardAcknowledgement, kony.i18n.getLocalizedString("i18n.CardManagement.NewCardRequest"), accessibilityConfig);
            CommonUtilities.setText(this.view.Acknowledgement.lblCardTransactionMessage, cardDetails.message, accessibilityConfig);
            if (cardDetails.orderId) {
                this.view.Acknowledgement.lblRequestID.setVisibility(true);
                this.view.Acknowledgement.lblRefrenceNumber.setVisibility(true);
                CommonUtilities.setText(this.view.Acknowledgement.lblRequestID, kony.i18n.getLocalizedString("i18n.CardManagement.requestId"), accessibilityConfig);
                CommonUtilities.setText(this.view.Acknowledgement.lblRefrenceNumber, cardDetails.orderId, accessibilityConfig);
            } else {
                this.view.Acknowledgement.lblRequestID.setVisibility(false);
                this.view.Acknowledgement.lblRefrenceNumber.setVisibility(false);
            }
            CommonUtilities.setText(this.view.Acknowledgement.lblUnlockCardMessage, kony.i18n.getLocalizedString("i18n.CardManagement.receivemessage"), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.confirmHeaders.lblHeading, "", accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.confirmHeaders.lblHeading, kony.i18n.getLocalizedString("i18n.CardManagement.cardReuestDetails"), accessibilityConfig);
            this.view.ConfirmDialog.keyValueName.setVisibility(false);
            this.view.ConfirmDialog.flxDestination.setVisibility(false);
            this.view.ConfirmDialog.keyValueServiceProvider.setVisibility(false);
            this.view.ConfirmDialog.flxSelectCards.setVisibility(false);
            this.view.ConfirmDialog.keyValueCreditLimit.setVisibility(false);
            this.view.ConfirmDialog.keyValueAvailableCredit.setVisibility(false);
            this.view.ConfirmDialog.confirmButtons.setVisibility(false);
            this.view.btnManageCards.setVisibility(false);
            this.view.btnBackToCardLimits.setVisibility(false);
            this.view.flxPrint.setVisibility(false);
            this.view.ConfirmDialog.keyValueCardHolder.setVisibility(true);
            this.view.ConfirmDialog.keyValueCardName.setVisibility(true);
            this.view.ConfirmDialog.keyValueValidThrough.setVisibility(true);
            this.view.btnBackToCards.setVisibility(true);
            this.view.btnRequestReplacement.setVisibility(true);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardHolder.lblKey, kony.i18n.getLocalizedString("i18n.ChequeBookReq.account"), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardName.lblKey, kony.i18n.getLocalizedString("i18n.CardManagement.Card"), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueValidThrough.lblKey, kony.i18n.getLocalizedString("i18n.CardManagement.NameOnCard"), accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardHolder.lblValue, accountValue, accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueCardName.lblValue, card, accessibilityConfig);
            CommonUtilities.setText(this.view.ConfirmDialog.keyValueValidThrough.lblValue, nameOncard, accessibilityConfig);
            this.view.btnBackToCards.skin = "sknBtnffffffBorder0273e31pxRadius2px";
            this.view.btnRequestReplacement.skin = "sknBtnffffffBorder0273e31pxRadius2px";
            if(kony.application.getCurrentBreakpoint() === 1366 && kony.i18n.getCurrentLocale() === "ar_AE"){
              this.view.btnBackToCards.right="10dp";
              this.view.btnRequestReplacement.right="23.6%";
            }
            CommonUtilities.setText(this.view.btnBackToCards, kony.i18n.getLocalizedString("i18n.CardManagement.GoToMyDashboard"), accessibilityConfig);
            CommonUtilities.setText(this.view.btnRequestReplacement, kony.i18n.getLocalizedString("i18n.CardManagement.GoToMyCards"), accessibilityConfig);
            this.view.btnBackToCards.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AccountsUIModule", "appName" : "HomepageMA"}).presentationController.showAccountsDashboard.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "AccountsUIModule", "appName" : "HomepageMA"}).presentationController);
            this.view.btnRequestReplacement.onClick = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController.navigateToManageCards.bind(kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ManageCardsUIModule").presentationController);
            this.AdjustScreen();
        }

    };
});