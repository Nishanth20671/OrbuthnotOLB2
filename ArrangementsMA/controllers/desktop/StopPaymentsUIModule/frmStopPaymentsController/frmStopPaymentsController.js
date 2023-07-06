/**
 * Module representing a StopCheckPayements.
 * @module frmStopPaymentsController
 */
define(['CommonUtilities', 'OLBConstants', 'FormControllerUtility', 'ViewConstants', 'CampaignUtility'], function(CommonUtilities, OLBConstants, FormControllerUtility, ViewConstants, CampaignUtility) {
  var TypeofStopCheque = "";
  var LandingSelectedAccount = "";
  var LandingSelectedAccountName = "";
  var orientationHandler = new OrientationHandler();
  var hasStopPaymentFeat = false;
  var hasChequeRequestFeat = false;
  var hasViewChequesFeat = false;
  var hasRevokeStopPaymentFeat = false;
  var hasCreateStopPaymentPerm = false;
  var hasCreateChequeBookPerm = false;
  var paymentType = "stopchequePayment";
  var stopCheckError={};
  return {
    scopeObjGlobal: this,
    bankDate: "",
    isSingleCustomerProfile: true,
    primaryCustomerId: [],
    profileAccess: "",
    checkBookOrderFromAccount:"",

    /**
         * frmStopPaymentsInitAction : Form Init acpretion handler
         */
    frmStopPaymentsInitAction: function() {
      var scopeObj = this;
      FormControllerUtility.setRequestUrlConfig(this.view.brwBodyTnC);
      scopeObj.presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"ArrangementsMA", "moduleName":"StopPaymentsUIModule"}).presentationController;
      FormControllerUtility.updateWidgetsHeightInInfo(this, ['flxHeader', 'flxFooter', 'flxContainer', 'flxDowntimeWarning', 'lblDowntimeWarning', 'imgAccountTypes']);
      this.view.onBreakpointChange = function() {
        scopeObj.onBreakpointChange(kony.application.getCurrentBreakpoint());
      };
      //this.view.ConfirmDetailsSingleMultiple.skin="slfBoxffffffB1R5";
      //this.view.ConfirmPage.skin="slfBoxffffffB1R5";
      // this.view.flxSinglePayConfirm.skin="slfBoxffffffB1R5";
      //this.view.MyRequestsTabs.flxSearchContent.setVisibility(false);

      this.view.MyRequestsTabs.skin = "slFbox";
      this.view.flxSuccessMessageStopCheck.clipBounds = false;

      this.setFormActions();
      this.setFooter();
      this.clearData();
      this.renderCalendars();
      this.view.lblSingleMultipleChecks.text = kony.i18n.getLocalizedString("i18n.StopPayments.SingleCheck");
      this.view.MyRequestsTabs.lblStatusDC.text = kony.i18n.getLocalizedString("i18n.billPay.Status");
      this.view.btnViewRequests.toolTip = CommonUtilities.changedataCase(kony.i18n.getLocalizedString("i18n.StopCheckPayments.ViewRequests"));
      this.view.btnBackToAccoutnDetails.toolTip = kony.i18n.getLocalizedString("i18n.ViewStatements.BackToAccountDetails");
      //this.view.MyRequestsTabs.flxBody.minHeight = "500dp";
      this.AdjustScreen();
    },
    /**
         * getPageHeight : Return Page height.
         * @return {string} height
         */
    getPageHeight: function() {
      var footerHeight = this.view.flxFooter.frame.height + (this.view.flxFooter.frame.y - (this.view.flxHeader.frame.height + this.view.flxContainer.frame.height));
      var height = this.view.flxHeader.frame.height + this.view.flxContainer.frame.height + footerHeight;
      return height;
    },
    /**
         * clearData : clear dummy/sample data.
         */
    clearData: function() {
      var scopeObj = this;
      scopeObj.view.MyRequestsTabs.segTransactions.setData([]);
      scopeObj.view.segConfirmDetails.setData([]);
    },
    /**
         * setFooter : set form footer.
         */
    setFooter: function() {
      this.view.flxFooter.setVisibility(true);
    },
    /**
         * Method to load and return Stop payements
         * @returns {object} Stop Payements Module object.
         */
    loadStopPaymentsModule: function() {
      return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"ArrangementsMA", "moduleName":"StopPaymentsUIModule"});
    },
    /**
         * postShowfrmStopCheckPayments : Form postShow action handler
         */
    postShowfrmStopCheckPayments: function() {
      this.AdjustScreen();
      this.view.customheadernew.activateMenu("ACCOUNTS", "Stop Payment Requests");
      this.view.customheadernew.forceCloseHamburger();
      this.view.customheadernew.flxAccounts.skin = "sknFlxFFFFFbrdr3343a8";
      this.view.customheadernew.flxContextualMenu.setVisibility(false);
      this.view.customheadernew.flxTransfersAndPay.skin = ViewConstants.SKINS.BLANK_SKIN_FLEX;
      this.view.lblPrintACK.onTouchEnd = this.showStopChecksPrintPage.bind(this);
      var scopeObj = this;
      this.view.btnNew.setVisibility(true);
      if (kony.application.getCurrentBreakpoint() === 640) {
        this.view.customheadernew.btnHamburgerNew.onClick = function() {
          scopeObj.view.btnNew.setVisibility(false);
        };
        this.view.customheadernew.flxClose.onTouchStart = function() {
          scopeObj.view.btnNew.setVisibility(true);
        };
      }
      applicationManager.executeAuthorizationFramework(this);
      this.view.lblStopPayments.text = kony.i18n.getLocalizedString("i18n.olb.chequeManagement.chequeManagement");
      this.view.MyRequestsTabs.lblSortDescription.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.ChequeNumber");
      this.view.btnViewMyCheques.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.ViewMyCheques");
      this.view.lblSingleMultipleChecks.text = kony.i18n.getLocalizedString("i18n.StopPayments.SingleCheck");
      this.view.MyRequestsTabs.SearchContainer.lblChequeCount.text = 50 + " " + kony.i18n.getLocalizedString("i18n.accounts.checks");
      this.view.MyRequestsTabs.lblSortPayeename.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.DisputedChecksMobile");
      this.view.MyRequestsTabs.lblChequeNumber.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.ChequeNumber");
      this.view.MyRequestsTabs.SearchContainer.lblSearchContent.text = kony.i18n.getLocalizedString("i18n.ChequeSearch.olderCheque");
      applicationManager.getNavigationManager().applyUpdates(this);
    },
    checkForAddStopCheckRequestPermission: function() {
      applicationManager.executeAuthorizationFramework(this, "addStopCheckRequestPermission");
    },

    removeNewStopCheckRequestButton: function() {
      this.view.MyRequestsTabs.btnAddNewStopCheckPayments.setVisibility(false);
      this.view.btnNew.setVisibility(false);
    },

    removeViewDisputedTransactionsButton: function() {
      this.view.btnViewDisputedTransactions.setVisibility(false);

    },
    removeViewStopCheckRequestsButton: function() {
      this.view.btnViewDisputedChecks.setVisibility(false);
    },
    removeViewMyChequesRequestsButton: function() {
      this.view.btnMyCheques.setVisibility(false);
    },

    dontRemoveActions: function() {
      return;
    },

    showPrintPage: function() {
      var stopTransctionData = [];
      stopTransctionData.push({
        key: kony.i18n.getLocalizedString("i18n.common.status"),
        value: this.view.acknowledgmentMyRequests.lblTransactionMessage.text
      });
      stopTransctionData.push({
        key: this.view.lblAccountKey.text,
        value: this.view.lblAccountValue.text
      });
      stopTransctionData.push({
        key: this.view.lblChequeBooksKey.text,
        value: this.view.lblChequeBooksValue.text
      });
      stopTransctionData.push({
        key: this.view.lblFeeKey.text,
        value: this.view.lblFeeValue.text
      });
      stopTransctionData.push({
        key: this.view.lblDeliveryType.text,
        value: this.view.lblDeliveryTypeValue.text
      });
      stopTransctionData.push({
        key: this.view.lblAddressKey.text,
        value: this.view.lblAddressValue.text
      });
      stopTransctionData.push({
        key: this.view.lblNotesKey.text,
        value: this.view.lblNotesValue.text
      });
      stopTransctionData.push({
        key: this.view.lblExtra1.text,
        value: this.view.lblExtra1Value.text
      });
      stopTransctionData.push({
        key: this.view.lblExtra2.text,
        value: this.view.lblExtra2Value.text
      });
      stopTransctionData.push({
        key: this.view.acknowledgmentMyRequests.lblRefrenceNumber.text,
        value: this.view.acknowledgmentMyRequests.lblRefrenceNumberValue.text
      });
      var printCallback = function() {
        applicationManager.getNavigationManager().navigateTo({"appName":"ArrangementsMA", "friendlyName":"frmStopPayments"});
        applicationManager.getNavigationManager().updateForm({
          disputeTransactionResponse: {
            isDataBindedAlready: true,
            isPrintTransaction : true
          }
        }, "frmStopPayments");
      }
      var viewModel = {
        moduleHeader: this.view.lblBillPayAcknowledgement.text,
        tableList: [{
          tableHeader: this.view.lblHeadingACK.text,
          tableRows: stopTransctionData
        }],
        printCallback: printCallback
      }
      this.loadStopPaymentsModule().presentationController.showPrintPage({
        printKeyValueGroupModel: viewModel
      });
    },
    showStopChecksPrintPage: function() {
      var stopChecksData = [];
      stopChecksData.push({
        key: kony.i18n.getLocalizedString("i18n.common.status"),
        value: this.view.lblSuccessAck.text
      });
      stopChecksData.push({
        key: this.view.lblreferenceno.text,
        value: this.view.lblReferenceNumber2.text
      });
      stopChecksData.push({
        key: this.view.lblReason.text,
        value: this.view.rtxReason.text
      });
      stopChecksData.push({
        key: this.view.lblDescription.text,
        value: this.view.rtxDescription.text
      });
      var row = this.view.segConfirmDetails.data[0];
      stopChecksData.push({
        key: row.lblFrom1,
        value: row.rtxFrom1
      });
      stopChecksData.push({
        key: row.lblPayee1,
        value: row.rtxPayee1
      });
      stopChecksData.push({
        key: row.lblDate1,
        value: row.rtxDate1.text || row.rtxDate1
      });
      if (row.rtxAmount1) {
        stopChecksData.push({
          key: row.lblAmount1,
          value: row.rtxAmount1.text || row.rtxAmount1
        });
      }
      if (row.rtxNotes1) {
        stopChecksData.push({
          key: row.lblNotes1,
          value: row.rtxNotes1.text || row.rtxNotes1
        });
      }
      var printCallback = function() {
        applicationManager.getNavigationManager().navigateTo({"appName":"ArrangementsMA", "friendlyName":"frmStopPayments"});
        applicationManager.getNavigationManager().updateForm({
          successStopCheckRequest: {
            isDataBindedAlready: true
          }
        }, "frmStopPayments");
      }
      var viewModel = {
        moduleHeader: this.view.lblHeader.text,
        tableList: [{
          tableHeader: this.view.lblConfirmHeader.text,
          tableRows: stopChecksData
        }],
        printCallback: printCallback
      }
      this.loadStopPaymentsModule().presentationController.showPrintPage({
        printKeyValueGroupModel: viewModel
      });
    },
    /**
         * Form preShow action handler
         */
    preShowStopPayments: function() {
      var scopeObj = this;
      this.isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
      this.primaryCustomerId = applicationManager.getUserPreferencesManager().primaryCustomerId;
      this.profileAccess = applicationManager.getUserPreferencesManager().profileAccess;
      LandingSelectedAccount = "";
      this.setUserPermissions();
      this.view.flxSegmentFrom.setVisibility(false);
      //FormControllerUtility.updateWidgetsHeightInInfo(this, ['flxHeader', 'flxFooter', 'flxContainer', 'flxDowntimeWarning', 'lblDowntimeWarning','imgAccountTypes']);
      var currBreakpoint = kony.application.getCurrentBreakpoint();
      applicationManager.getLoggerManager().setCustomMetrics(this, false, "Stop Payments");
      //this.view.ConfirmDetailsSingleMultiple.skin="slfBoxffffffB1R5";
      this.view.MyRequestsTabs.flxTabsSeperator3.setVisibility(false);
      //this.view.ConfirmPage.skin="slfBoxffffffB1R5";
      this.view.calDateOfIssue.hidePreviousNextMonthDates = true;
      this.view.MyRequestsTabs.btnDisputedTrnsactions.setVisibility(false);
      this.view.MyRequestsTabs.btnDisputedChecks.setVisibility(false);
      this.view.MyRequestsTabs.btnMyCheques.setVisibility(false);
      //this.view.MyRequestsTabs.flxSearchContent.setVisibility(false);
      //this.view.MyRequestsTabs.flxSearchContainer.setVisibility(false);
      this.showAccountName();
      this.view.flxAccountTypes.onTouchStart = function() {
        if (scopeObj.view.accountTypes.isVisible) {
          scopeObj.view.accountTypes.origin = true;
          // if (kony.application.getCurrentBreakpoint() === 640 || kony.application.getCurrentBreakpoint() == 1024) {

          //scopeObj.view.lblDropDown.src = ViewConstants.IMAGES.ARRAOW_DOWN;
          //scopeObj.view.accountTypes.isVisible = false;  

          //}			 
        }
      }
      this.view.flxAccountTypes.onClick = function() {
        if (currBreakpoint === 640 || orientationHandler.isMobile) {
          flag = 0;
        }
        //scopeObj.view.accountActionsMobile.setVisibility(false);
        scopeObj.alignAccountTypesToAccountSelectionImg();
        scopeObj.showAccountTypes();
      };
      //this.view.MyRequestsTabs.flxSearchResults.setVisibility(false);

      CampaignUtility.fetchPopupCampaigns();
      scopeObj.postShowfrmStopCheckPayments();
    },
    /**
         * AdjustScreen : Ui team proposed method to handle screen aligment
         */
    AdjustScreen: function() {
      this.view.forceLayout();
      // rewrite footer positioning
      var mainHeight = this.view.flxContainer.info.frame.height;
      var headerHeight = this.view.flxHeader.info.frame.height;
      if(headerHeight === 0) {
        headerHeight = 122;
      }
      var footerHeight = this.view.flxFooter.frame.height;
      if(footerHeight === 0) {
        footerHeight = 150;
      }
      var screenHeight = kony.os.deviceInfo().screenHeight;
      // get page inner space without header and footer
      var innerContentSpace = screenHeight - headerHeight - footerHeight;
      //check actual content height and adjust
      if(innerContentSpace > mainHeight) {
        this.view.flxFooter.top = innerContentSpace + "dp";
      } else {
        this.view.flxFooter.top = mainHeight + "dp";
      }
      // popup camapign check added to fix AAC-7564
      if (this.view.campaignpopup && this.view.campaignpopup.isVisible) {
        let popupheight = parseInt(this.view.campaignpopup.height.replace("dp", ""));
        let pageheight = parseInt(this.view.flxFooter.top.replace("dp", "")) + 150;
        if (popupheight < pageheight) {
          this.view.campaignpopup.flxpopup.top = this.view.flxHeader.frame.height + "dp";
          this.view.campaignpopup.height = pageheight + "dp";
          this.view.campaignpopup.forceLayout();
        }
      }
      this.view.forceLayout();
    },
    /**
         * setBreadcrumb :Resets Bread crumb state
         * @param {Array} viewModel , Breadcrumb lables object array { lable , toolTip}
         */
    setBreadcrumb: function(viewModel) {
      var scopeObj = this;
      if (viewModel && viewModel.length > 1) {
        scopeObj.view.breadcrumb.setBreadcrumbData([{
          text: viewModel[0].label
        }, {
          text: viewModel[1].label
        }]);
        scopeObj.view.breadcrumb.btnBreadcrumb1.toolTip = viewModel[0].toolTip;
        scopeObj.view.breadcrumb.lblBreadcrumb2.toolTip = viewModel[1].toolTip;
      }
    },
    /**
         * setFormActions : Method to bind all action in form
         */
    setFormActions: function() {
      var scopeObj = this;
      scopeObj.view.MyRequestsTabs.btnAddNewStopCheckPayments.onClick = scopeObj.btnAddNewStopCheckPaymentsClickHandler.bind(scopeObj);
      scopeObj.view.MyRequestsTabs.btnNewChequeBookRequests.onClick = scopeObj.btnNewChequeBookRequestsClickHandler.bind(scopeObj);
      scopeObj.view.MyRequestsTabs.btnDisputedChecks.onClick = scopeObj.disputedChecksTabClickHandler.bind(scopeObj);
      scopeObj.view.MyRequestsTabs.btnMyCheques.onClick = scopeObj.myChequesTabClickHandler.bind(scopeObj);
      scopeObj.view.MyRequestsTabs.btnDisputedTrnsactions.onClick = scopeObj.disputedTransactionsTabClickHandler.bind(scopeObj);
      scopeObj.view.btnViewDisputedTransactions.onClick = scopeObj.btnViewDisputedTransactionsClickHandler.bind(scopeObj);
      scopeObj.view.btnStopChequeRequests.onClick = scopeObj.btnViewDisputedTransactionsClickHandler.bind(scopeObj);
      scopeObj.view.btnViewDisputedTransactions.toolTip = CommonUtilities.changedataCase(kony.i18n.getLocalizedString("i18n.StopCheckPayments.ViewDisputedTransactions"));
      scopeObj.view.btnViewDisputedChecks.onClick = scopeObj.btnViewDisputedChecks.bind(scopeObj);
      scopeObj.view.btnViewMyChequesRight.onClick = scopeObj.btnViewDisputedChecks.bind(scopeObj);
      scopeObj.view.btnViewDisputedChecks.toolTip = CommonUtilities.changedataCase(kony.i18n.getLocalizedString("i18n.StopCheckPayments.ViewDisputedChecks"));
      scopeObj.view.btnViewMyCheques.onClick = scopeObj.btnViewMyChequesClickHandler.bind(scopeObj);
      scopeObj.view.btnViewChequeBookRequestRight.onClick = scopeObj.btnViewMyChequesClickHandler.bind(scopeObj);
      scopeObj.view.flxRadioBtnSingle.onClick = scopeObj.onSingleOrMultipleRadioButtonClick.bind(scopeObj);
      scopeObj.view.flxRadioBtnSeries.onClick = scopeObj.onSeriesRadioButtonClick.bind(scopeObj);
      scopeObj.view.flxTCCheckboxContents.onClick = scopeObj.onTCCClickHanlder.bind(scopeObj);
      scopeObj.view.btnTAndC.onClick = scopeObj.onTandCBtnClickHandler.bind(scopeObj);
      scopeObj.view.flxTCContentsCheckbox.onClick = scopeObj.onTandContentCheckBoxClickHandler.bind(scopeObj);
      scopeObj.view.btnSave.onClick = scopeObj.onTandContentSaveClickHandler.bind(scopeObj);
      scopeObj.view.btnCancel.onClick = scopeObj.setTermsAndConditionsPopupState.bind(scopeObj, false);
      scopeObj.view.flxClose.onClick = scopeObj.setTermsAndConditionsPopupState.bind(scopeObj, false);
      scopeObj.view.tbxFirstCheckNo.onTextChange = scopeObj.onSeriesLastCheck2TextChange.bind(scopeObj);
      scopeObj.view.tbxLastCheckNo.onTextChange = scopeObj.onSeriesLastCheckTextChange.bind(scopeObj);
      scopeObj.view.tbxCheckNo.onTextChange = scopeObj.onSeriesLastCheck2TextChange.bind(scopeObj);
      scopeObj.view.tbxFirstCheckNo.onKeyUp = scopeObj.updateStopChekFormContinueBtnState.bind(scopeObj);
      scopeObj.view.tbxLastCheckNo.onKeyUp = scopeObj.updateStopChekFormContinueBtnState.bind(scopeObj);
      scopeObj.view.tbxCheckNo.onKeyUp = scopeObj.updateStopChekFormContinueBtnState.bind(scopeObj);
      scopeObj.view.tbxDescription.onKeyUp = scopeObj.updateStopChekFormContinueBtnState.bind(scopeObj);
      scopeObj.view.tbxPayee.onKeyUp = scopeObj.updateStopChekFormContinueBtnState.bind(scopeObj);
      scopeObj.view.tbxCheckNumber.onKeyUp = scopeObj.updateStopChekFormContinueBtnState.bind(scopeObj);
      scopeObj.view.tbxDescrip.onKeyUp = scopeObj.updateStopChekFormContinueBtnState.bind(scopeObj);
      FormControllerUtility.wrapAmountField(scopeObj.view.tbxAmount)
        .onKeyUp(scopeObj.updateStopChekFormContinueBtnState.bind(scopeObj));
      scopeObj.view.imgCloseDowntimeWarning.onTouchEnd = function() {
        scopeObj.setServerError(false);
      };
      this.view.CancelStopCheckPayments.flxCross.onClick = function() {
        scopeObj.view.flxLogoutStopCheckPayment.setVisibility(false);
        scopeObj.view.flxDialogs.setVisibility(false);
      };
      this.view.CancelStopCheckPayments.btnNo.onClick = function() {
        scopeObj.view.flxLogoutStopCheckPayment.setVisibility(false);
        scopeObj.view.flxDialogs.setVisibility(false);
      };
      this.view.flxAnotherAddCheck.onClick = function() {
        scopeObj.noOfClonedChecks++;
        var newCheck = scopeObj.view.flxSingleMultiplechecksWrapper.clone(scopeObj.noOfClonedChecks);
        scopeObj.view.flxStopCheckPaymentSeriesMultiple.addAt(newCheck, 3);
      };


    },
    hideAccountTypes : function() {
      this.view.accountTypes.isVisible = false;
      this.view.lblDropDown.text = "O";
    },
    alignAccountTypesToAccountSelectionImg: function() {
      var getNumber = function(str) {
        if (str.length > 2) {
          return Number(str.substring(0, str.length - 2));
        }
        return 0;
      };
      var topImgCenter = this.view.imgAccountTypes.info.frame.x + (this.view.imgAccountTypes.info.frame.width / 2);
      var bottomImgLeftPos = (topImgCenter - (getNumber(this.view.accountTypes.imgToolTip.width) / 2));
      this.view.accountTypes.imgToolTip.left = bottomImgLeftPos + ViewConstants.POSITIONAL_VALUES.DP;
    },

    setMyRequestTabsBtnSkin: function(SelectBtn, UnselectBtn1, UnselectBtn2) {
      var scopeObj = this;
      SelectBtn.skin = "sknBtnAccountSummarySelected";
      //  SelectBtn.hoverSkin = "sknBtnAccountSummarySelectedHover";
      UnselectBtn1.skin = "sknBtnAccountSummaryUnselected";
      UnselectBtn2.skin = "sknBtnAccountSummaryUnselected";
      UnselectBtn1.hoverSkin = "sknBtnAccountSummaryUnselectedHover";
      UnselectBtn2.hoverSkin = "sknBtnAccountSummaryUnselectedHover";

      if (kony.application.getCurrentBreakpoint() === 640 || kony.application.getCurrentBreakpoint() === 1024) {
        SelectBtn.hoverSkin = OLBConstants.SKINS.STOPPAYMENTS_SELECT_TAB;
        UnselectBtn1.hoverSkin = OLBConstants.SKINS.STOPPAYMENTS_UNSELECT_TAB;
        UnselectBtn2.hoverSkin = OLBConstants.SKINS.STOPPAYMENTS_UNSELECT_TAB;
        scopeObj.view.MyRequestsTabs.btnDisputedTrnsactions.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.DisputedTransactionsMobile");
        scopeObj.view.MyRequestsTabs.btnDisputedChecks.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.DisputedChecksMobile");
      }
      if (kony.application.getCurrentBreakpoint() === 640 ) {
        SelectBtn.hoverSkin = "sknBtnAccountSummarySelectedMod-hover";
        UnselectBtn1.hoverSkin = "sknBtnAccountSummaryUnselected-hover";
        UnselectBtn2.hoverSkin = "sknBtnAccountSummaryUnselected-hover";
        SelectBtn.focusSkin = "sknBtnAccountSummarySelectedMod-hover";
        UnselectBtn1.focusSkin = "sknBtnAccountSummaryUnselected-hover";
        UnselectBtn2.focusSkin = "sknBtnAccountSummaryUnselected-hover";
      }
    },
    /**
         * setDisputedTransactionTabUI: Method to set My requests Disputed Transactions tab UI
         */
    setDisputedTransactionTabUI: function() {
      var scopeObj = this
      scopeObj.checkForPermissions();
      scopeObj.setMyRequestTabsBtnSkin(scopeObj.view.MyRequestsTabs.btnDisputedTrnsactions, scopeObj.view.MyRequestsTabs.btnDisputedChecks, scopeObj.view.MyRequestsTabs.btnMyCheques);
      scopeObj.ShowAllSeperators();
      scopeObj.view.MyRequestsTabs.flxTabsSeperator3.setVisibility(false);
      scopeObj.view.MyRequestsTabs.flxSort.setVisibility(true);
      if (hasCreateStopPaymentPerm) {
        scopeObj.view.MyRequestsTabs.btnAddNewStopCheckPayments.setVisibility(true);
        scopeObj.view.MyRequestsTabs.btnNewChequeBookRequests.setVisibility(false);
      }
      //scopeObj.view.MyRequestsTabs.flxSearchContainer.setVisibility(false);
      //scopeObj.view.MyRequestsTabs.flxSearchResults.setVisibility(false);
      scopeObj.view.MyRequestsTabs.flxSortDisputedChecks.setVisibility(false);
      scopeObj.view.MyRequestsTabs.btnNewChequeBookRequests.setVisibility(false);
      scopeObj.view.MyRequestsTabs.flxMyCheques.setVisibility(false);
      scopeObj.view.MyRequestsTabs.lblSortDate.setFocus(true);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContainer.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
      if (kony.application.getCurrentBreakpoint() === 640) {
        scopeObj.view.flxAccounts.top = "10dp";
        scopeObj.view.accountTypes.isVisible = false;
        scopeObj.view.customheadernew.lblHeaderMobile.text = kony.i18n.getLocalizedString("i18n.olb.chequeManagement.chequeManagement");
        scopeObj.view.MyRequestsTabs.btnChequeBookRequestsMobile.setVisibility(false);
        scopeObj.view.MyRequestsTabs.btnStopChequeRequestsMobile.setVisibility(true);
        scopeObj.view.MyRequestsTabs.btnAddNewStopCheckPayments.setVisibility(false);
        scopeObj.view.MyRequestsTabs.btnNewChequeBookRequests.setVisibility(false);
      }
      //else if (kony.application.getCurrentBreakpoint() === 1024) {
      //scopeObj.setDisputedTransactionBPBtns();
      //}
      scopeObj.view.forceLayout();
      scopeObj.AdjustScreen();
    },

    /**
         * setDisputedChecksTabUI: Method to set My requests Disputed Checks tab UI **/
    setDisputedChecksTabUI: function() {
      var scopeObj = this;
      scopeObj.checkForPermissions();
      scopeObj.setMyRequestTabsBtnSkin(scopeObj.view.MyRequestsTabs.btnDisputedChecks, scopeObj.view.MyRequestsTabs.btnDisputedTrnsactions, scopeObj.view.MyRequestsTabs.btnMyCheques);
      scopeObj.ShowAllSeperators();
      scopeObj.view.MyRequestsTabs.flxSortDisputedChecks.setVisibility(true);
// check on account level permissions.
      var configManager = applicationManager.getConfigurationManager();
	  var chequeBookReqViewPerm = configManager.checkAccountAction(LandingSelectedAccount,"CHEQUE_BOOK_REQUEST_VIEW");
	  var chequeBookReqCreatePerm = configManager.checkAccountAction(LandingSelectedAccount,"CHEQUE_BOOK_REQUEST_CREATE");
      if (!chequeBookReqViewPerm && !chequeBookReqCreatePerm) {
        scopeObj.view.MyRequestsTabs.btnDisputedChecks.setVisibility(false);   
      } else {
        scopeObj.view.MyRequestsTabs.btnDisputedChecks.setVisibility(true);   
	  }
      if (chequeBookReqCreatePerm) {
        scopeObj.view.MyRequestsTabs.btnNewChequeBookRequests.setVisibility(true);   
      } else {
        scopeObj.view.MyRequestsTabs.btnNewChequeBookRequests.setVisibility(false);   
	  }

      //scopeObj.view.MyRequestsTabs.flxSortDisputedChecks.setVisibility(true);
      scopeObj.view.MyRequestsTabs.flxSort.setVisibility(false);
      scopeObj.view.MyRequestsTabs.flxMyCheques.setVisibility(false);
      scopeObj.view.MyRequestsTabs.btnAddNewStopCheckPayments.setVisibility(false);
      scopeObj.view.MyRequestsTabs.lblSortDateDC.setFocus(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContainer.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
      if (kony.application.getCurrentBreakpoint() === 640) {
        scopeObj.view.flxAccounts.top = "10dp";
        scopeObj.view.accountTypes.isVisible = false;
        scopeObj.view.customheadernew.lblHeaderMobile.text = kony.i18n.getLocalizedString("i18n.olb.chequeManagement.chequeManagement");
        scopeObj.view.MyRequestsTabs.btnChequeBookRequestsMobile.setVisibility(true);
        scopeObj.view.MyRequestsTabs.btnStopChequeRequestsMobile.setVisibility(false);
        scopeObj.view.MyRequestsTabs.btnAddNewStopCheckPayments.setVisibility(false);
        scopeObj.view.MyRequestsTabs.btnNewChequeBookRequests.setVisibility(false);
        scopeObj.view.MyRequestsTabs.flxSortDisputedChecks.setVisibility(false);
      }
      /** else if (kony.application.getCurrentBreakpoint() === 1024) {
              scopeObj.setDisputedChecksBPBtns();
            } **/
      scopeObj.view.forceLayout();
      scopeObj.AdjustScreen();
    },
    /**
         * setMyChequesTabUI: Method to set My requests My Cheques tab UI
         */
    setMyChequesTabUI: function(viewModel) {
      var scopeObj = this;
      scopeObj.checkForPermissions();
      scopeObj.view.MyRequestsTabs.btnMyCheques.setVisibility(true);
      scopeObj.setMyRequestTabsBtnSkin(scopeObj.view.MyRequestsTabs.btnMyCheques, scopeObj.view.MyRequestsTabs.btnDisputedChecks, scopeObj.view.MyRequestsTabs.btnDisputedTrnsactions);
      scopeObj.ShowAllSeperators();
      scopeObj.view.MyRequestsTabs.flxMyCheques.setVisibility(true);
      scopeObj.view.MyRequestsTabs.flxSortDisputedChecks.setVisibility(false);
      scopeObj.view.MyRequestsTabs.flxSort.setVisibility(false);
      if (hasCreateStopPaymentPerm) {
        this.view.MyRequestsTabs.btnAddNewStopCheckPayments.setVisibility(true);
        this.view.MyRequestsTabs.btnNewChequeBookRequests.setVisibility(false);
      }
      scopeObj.view.MyRequestsTabs.btnNewChequeBookRequests.setVisibility(false);
      scopeObj.view.MyRequestsTabs.lblSortDateDC.setFocus(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContainer.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.ImgSearchIcon.onTouchEnd = scopeObj.setChequeSearchUI;
      if (kony.application.getCurrentBreakpoint() === 640) {
        scopeObj.view.flxAccounts.top = "10dp";
        scopeObj.view.accountTypes.isVisible = false;
        scopeObj.view.customheadernew.lblHeaderMobile.text = kony.i18n.getLocalizedString("i18n.olb.chequeManagement.chequeManagement");
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContainer.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
        scopeObj.view.MyRequestsTabs.btnChequeBookRequestsMobile.setVisibility(false);
        scopeObj.view.MyRequestsTabs.btnStopChequeRequestsMobile.setVisibility(true);
        scopeObj.view.MyRequestsTabs.btnAddNewStopCheckPayments.setVisibility(false);
        scopeObj.view.MyRequestsTabs.flxMyCheques.setVisibility(false);
        scopeObj.view.MyRequestsTabs.btnNewChequeBookRequests.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.lblShowing.text = kony.i18n.getLocalizedString("i18n.ChequeSearch.ShowingRecent") + " 10 Cheques" + kony.i18n.getLocalizedString("i18n.ChequeSearch.olderCheque");
        scopeObj.view.MyRequestsTabs.SearchContainer.flxMainContainer.skin = "slfBoxffffffB1R5";
        scopeObj.view.MyRequestsTabs.SearchContainer.ImgSearchIcon.onTouchEnd = scopeObj.setChequeSearchUI;
      } else if (kony.application.getCurrentBreakpoint() === 1024) {
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContainer.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.ImgSearchIcon.onTouchEnd = scopeObj.setChequeSearchUI;
      }
      //used view model to set selected account
      if (viewModel) {
        scopeObj.setStopChecksFormAccountsDropdown({
          selectedValue: viewModel.accountID
        });
        scopeObj.view.lblChequeBookRequests.isVisible = false;
        scopeObj.view.lblStopPayments.setVisibility(true);
        scopeObj.view.flxAccounts.setVisibility(true);
        scopeObj.savedSelectedAccount = viewModel.accountID;
        if (scopeObj.savedSelectedAccount !== undefined && scopeObj.savedSelectedAccount !== null) {
          this.ChangeShowAccountName();
        }
        if (!hasStopPaymentFeat && !hasChequeRequestFeat) {
          scopeObj.view.MyRequestsTabs.btnMyCheques.skin = "sknBtnAccountSummaryUnselected";
        }
      }
      scopeObj.view.forceLayout();
      scopeObj.AdjustScreen();
    },

    loadStopPaymentModule: function() {
      return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"ArrangementsMA", "moduleName":"StopPaymentsUIModule"});
    },

    createAccountListSegmentsModel: function(account) {
      return {
        "lblUsers": {
          "text": CommonUtilities.getAccountName(account),
          "toolTip": CommonUtilities.changedataCase(CommonUtilities.getAccountName(account))
        },
        "lblSeparator": "Separator",
        "flxAccountTypes": {
          "onClick": this.loadStopPaymentModule().presentationController.showAccountDetails.bind(this.loadStopPaymentModule().presentationController, account)
        },
        "flxAccountTypesMobile": {
          "onClick": this.loadStopPaymentModule().presentationController.showAccountDetails.bind(this.loadStopPaymentModule().presentationController, account)
        },
        template: kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile ? "flxAccountTypesMobile" : "flxAccountTypes"
      };
    },

    updateAccountList: function(accountList) {
      var accounts = accountList.map(this.createAccountListSegmentsModel);
      var dataMap = {
        "flxAccountTypes": "flxAccountTypes",
        "flxAccountTypesMobile": "flxAccountTypesMobile",
        "lblSeparator": "lblSeparator",
        "lblUsers": "lblUsers"
      };
      this.view.accountTypes.segAccountTypes.widgetDataMap = dataMap;
      this.view.accountTypes.segAccountTypes.setData(accounts);
      this.view.accountTypes.forceLayout();
      this.AdjustScreen();
    },

        showAccountName: function() {
            var accountsList = this.loadStopPaymentsModule().presentationController.getAccounts();
            if (accountsList && accountsList.length > 0) {
                //accountsList[0].processedName = accountsList[0].accountName + "..." + accountsList[0].accountID;
              accountsList[0].processedName = accountsList[0].accountName;
                this.view.lblAccountTypes.text = accountsList[0].processedName;
                LandingSelectedAccount = accountsList[0].accountID;
                var transObj = applicationManager.getTransactionsListManager();
                transObj.setTransactionAttribute("fromAccountNumber", accountsList[0].accountID);
                transObj.setTransactionAttribute("accountCurrencyCode", applicationManager.getFormatUtilManager().getCurrencySymbol(accountsList[0].currencyCode));
            }
        },

    showAccountTypes: function() {
      //if (this.view.accountTypes.origin) {
      //this.view.accountTypes.origin = false;
      //return;
      //}
      // var widgetDatamap={
      // //	"sectionheadertemplate" : "flxAccountTypes2",
      // //"rowtemplate" :"flxAccountTypes",
      // "headerAccountName" : "headerAccountName",
      // "accountName" :"processedName"
      // }
      // var segData=[];
      // var sectionHeaderData={};
      // var combinedData=[];
      // var accountsList=this.loadStopPaymentsModule().presentationController.getAccounts();
      // var savingsList=[];
      // var checkingList=[];
      // var x="";
      // for(var i=0;i<accountsList.length;i++){
      // var name = "";
      //     if (accountsList[i].nickName){
      //       name = accountsList[i].accountName;
      // //this.view.lbxSearchTab=name;
      //     } else {
      //       name = accountsList[i].nickName;
      // //this.view.lbxSearchTab=name;
      //     }    
      // accountsList[i].processedName=name+accountsList[i].accountID;
      // if(accountsList[i].accountType==="Checking"){
      // checkingList.push(accountsList[i]);

      // }
      // else{
      // savingsList.push(accountsList[i]);
      // //this.view.lbxSearchTab=savingsList[i];
      // }
      // }
      // for(var i=0;i<accountsList.length;i++){
      // x=accountsList[0];
      // }
      // this.view.lbxSearchTab=x;

      // sectionHeaderData["headerAccountName"] ="My Savings Account";
      // combinedData.push(sectionHeaderData);
      // combinedData.push(checkingList);
      // sectionHeaderData["headerAccountName"] ="My Checking Account";
      // combinedData.push(sectionHeaderData);
      // combinedData.push(savingsList);
      // segData.push(combinedData);
      //sectionHeaderData["headerAccountName"] ="My Checking";
      //combinedData.push(sectionHeaderData1);
      //combinedData.push({"accountName":"test checking123"});
      //combinedData.push({"accountName":"my check123"});
      //segData.push(combinedData);

      //if (this.view.accountTypes.origin) {
      //this.view.accountTypes.origin = false;
      //return;
      //}
      this.view.imgAccountTypes.isVisible = false;
      var widgetDatamap = {
        //	"sectionheadertemplate" : "flxAccountTypes2",
        //"rowtemplate" :"flxAccountTypes",
        "headerAccountName": "headerAccountName",
        "lblUsers": "processedName"
      }
      this.view.accountTypes.segAccountTypes.onRowClick = this.segAccountTypesRowClick;
      var segData = [];


      var accountsList = this.loadStopPaymentsModule().presentationController.getAccounts();
      //if(applicationManager.getConfigurationManager().isCombinedUser === "true"|| applicationManager.getConfigurationManager().isSMEUser === "true"){
      this.view.accountTypes.segAccountTypes.rowTemplate = "flxRowDefaultAccounts";
      this.view.accountTypes.segAccountTypes.sectionHeaderTemplate = "flxTransfersFromListHeader";
      this.view.accountTypes.segAccountTypes.widgetDataMap = {
        "flxTransfersFromListHeader" : "flxTransfersFromListHeader",
        "lblTransactionHeader": "lblTransactionHeader",
        "imgDropDown": "imgDropDown",
        "flxDropDown": "flxDropDown",
        "lblTopSeperator" : "lblTopSeperator",
        "lblDefaultAccountIcon": "lblDefaultAccountIcon",
        "lblDefaultAccountName": "lblDefaultAccountName",
        "flxRowDefaultAccounts": "flxRowDefaultAccounts",
        "lblSeparator": "lblSeparator",
        "accountId": "accountId",
        "lblAccountRoleType":"lblAccountRoleType"
      };
      var widgetFromData = this.isSingleCustomerProfile ? this.getDataWithAccountTypeSections(accountsList) : this.getDataWithSections(accountsList);
      this.view.accountTypes.segAccountTypes.setData(widgetFromData);
      this.AdjustScreen();
      //       }
      //       else{
      //         var savingsList = [];
      //         var checkingList = [];
      //         //var x = "";
      //         for (var i = 0; i < accountsList.length; i++) {
      //           var name = "";
      //           if (accountsList[i].nickName) {
      //             name = accountsList[i].accountName;
      //             //this.view.lbxSearchTab=name;
      //           } else {
      //             name = accountsList[i].nickName;
      //             //this.view.lbxSearchTab=name;
      //           }
      //           var lblUsersProcessedName = this.formatText(name,10,accountsList[i].accountID,4);
      //           accountsList[i].processedName = {"text":lblUsersProcessedName,"toolTip":lblUsersProcessedName};
      //           if (accountsList[i].accountType === "Checking") {
      //             checkingList.push(accountsList[i]);
      //           } else {
      //             savingsList.push(accountsList[i]);
      //             //this.view.lbxSearchTab=savingsList[i];
      //           }
      //         }
      //         //this.view.lblAccountTypes.text=accountsList[0].processedName;

      //         var i=0;
      //         while(++i<=2){
      //           var sectionHeaderData = {};
      //           var combinedData = [];
      //           if(i==1){
      //             sectionHeaderData["headerAccountName"] = {"text":"My Savings Account","toolTip":"My Savings Account"};
      //             combinedData.push(sectionHeaderData);
      //             combinedData.push(savingsList);
      //             segData.push(combinedData);
      //           }
      //           else{

      //             sectionHeaderData["headerAccountName"] = {"text":"My Checking Account","toolTip":"My Checking Account"};
      //             combinedData.push(sectionHeaderData);
      //             combinedData.push(checkingList);
      //             segData.push(combinedData);

      //           }
      //         }
      //         this.view.accountTypes.segAccountTypes.widgetDataMap=widgetDatamap;
      //         this.view.accountTypes.segAccountTypes.setData(segData);
      //         this.view.forceLayout();
      //       }
      if (this.view.accountTypes.isVisible === false) {
        //this.view.imgAccountTypes.src = ViewConstants.IMAGES.ARRAOW_UP;
        this.view.lblDropDown.text = "P";
        if (this.view.flxDowntimeWarning.isVisible === true) {
          this.view.accountTypes.top = 60 + this.view.flxDowntimeWarning.info.frame.height + 10 + ViewConstants.POSITIONAL_VALUES.DP;
        } else {
          this.view.accountTypes.top = "80dp";
          this.view.lblStopPayments.setVisibility(true);
        }
        //if (kony.application.getCurrentBreakpoint() > 640 && !(orientationHandler.isMobile)) {
        //this.view.accountTypes.left = (this.view.flxMain.frame.x + this.view.StopCheckPaymentSeriesMultiple.frame.x + 0) + "dp";
        //}
        this.view.accountTypes.isVisible = true;
      } else {

        this.view.accountTypes.isVisible = false;
        //this.view.imgAccountTypes.src = ViewConstants.IMAGES.ARRAOW_DOWN;
        this.view.lblDropDown.text = "O";
      }
      this.view.forceLayout();
    },
    segAccountTypesRowClick: function() {
      accountNameDisplay = "";
      if (Array.isArray(this.view.accountTypes.segAccountTypes.data[0])) {
        var secindex = Math.floor(this.view.accountTypes.segAccountTypes.selectedRowIndex[0]);
        var rowindex = Math.floor(this.view.accountTypes.segAccountTypes.selectedRowIndex[1]);
        var frmaccdata = this.view.accountTypes.segAccountTypes.data[secindex][1][rowindex];
        if (kony.application.getCurrentBreakpoint() === 640) {
          this.view.lblAccountTypes.text = frmaccdata.accountName + "..." + frmaccdata.accountID;
        } else {
          this.view.lblAccountTypes.text = frmaccdata.processedName;
        }
        accountNameDisplay = frmaccdata.processedName;
        LandingSelectedAccount = frmaccdata.accountID;
        var transObj = applicationManager.getTransactionsListManager();
        transObj.setTransactionAttribute("fromAccountNumber", frmaccdata.accountID);
        transObj.setTransactionAttribute("accountCurrencyCode", applicationManager.getFormatUtilManager().getCurrencySymbol(frmaccdata.currencyCode));
      }
      this.view.lblAccountTypes.text = accountNameDisplay;
      this.view.accountTypes.isVisible = false;
      //this.view.imgAccountTypes.src = ViewConstants.IMAGES.ARRAOW_DOWN;
      this.view.lblDropDown.text = "O";
	// if there are no permission on the account for view & create cheque book request, show the stopchequePayment tab
      var configManager = applicationManager.getConfigurationManager();
	  var chequeBookReqViewPerm = configManager.checkAccountAction(LandingSelectedAccount,"CHEQUE_BOOK_REQUEST_VIEW");
	  var chequeBookReqCreatePerm = configManager.checkAccountAction(LandingSelectedAccount,"CHEQUE_BOOK_REQUEST_CREATE");
      if (paymentType === "chequeBookRequests" && !chequeBookReqViewPerm && !chequeBookReqCreatePerm) {
        paymentType = "stopchequePayment"    
      }
      if(paymentType === "stopchequePayment")
        this.disputedTransactionsTabClickHandler();
      if(paymentType === "chequeBookRequests")
        this.disputedChecksTabClickHandler();
      if(paymentType === "viewMyCheques")
        this.myChequesTabClickHandler();

      accountNameDisplay = "";
      var accountName = '';
      if (applicationManager.getConfigurationManager().isCombinedUser === "true" || applicationManager.getConfigurationManager().isSMEUser === "true") {
        if (Array.isArray(this.view.accountTypes.segAccountTypes.data[0])) {
          var secindex = Math.floor(this.view.accountTypes.segAccountTypes.selectedRowIndex[0]);
          var rowindex = Math.floor(this.view.accountTypes.segAccountTypes.selectedRowIndex[1]);
          var frmaccdata = this.view.accountTypes.segAccountTypes.data[secindex][1][rowindex];
          accountName = CommonUtilities.mergeAccountNameNumber(frmaccdata.lblDefaultAccountName.text, frmaccdata.accountID);
        }
      }
      if (Array.isArray(this.view.accountTypes.segAccountTypes.data[0])) {
        var secindex = Math.floor(this.view.accountTypes.segAccountTypes.selectedRowIndex[0]);
        var rowindex = Math.floor(this.view.accountTypes.segAccountTypes.selectedRowIndex[1]);
        var frmaccdata = this.view.accountTypes.segAccountTypes.data[secindex][1][rowindex];
        if (kony.application.getCurrentBreakpoint() === 640) {
          if (applicationManager.getConfigurationManager().isCombinedUser === "true" || applicationManager.getConfigurationManager().isSMEUser === "true") {
            this.view.lblAccountTypes.text = accountName;
          } else {
            this.view.lblAccountTypes.text = frmaccdata.accountName + "..." + frmaccdata.accountID;
          }
        } else {
          this.view.lblAccountTypes.text = kony.sdk.isNullOrUndefined(frmaccdata.processedName) ? accountName : frmaccdata.processedName;
        }
        accountNameDisplay = kony.sdk.isNullOrUndefined(frmaccdata.processedName) ? accountName : frmaccdata.processedName;
        var currencyCode = this.getCurrencyCode(frmaccdata);
        LandingSelectedAccount = frmaccdata.accountID;
        var transObj = applicationManager.getTransactionsListManager();
        transObj.setTransactionAttribute("fromAccountNumber", frmaccdata.accountID);
        transObj.setTransactionAttribute("accountCurrencyCode", currencyCode);
      }
      this.view.lblAccountTypes.text = accountNameDisplay;
      this.view.accountTypes.isVisible = false;
      //this.view.imgAccountTypes.src = ViewConstants.IMAGES.ARRAOW_DOWN;
      this.view.lblDropDown.text = "O";
    },

    getCurrencyCode: function(frmaccdata) {
      var currencycode = "";
      if (applicationManager.getConfigurationManager().isCombinedUser === "true" || applicationManager.getConfigurationManager().isSMEUser === "true") {
        var accountId = frmaccdata.accountID;
        var accounts = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AccountsModule").presentationController.accounts;
        for (var i = 0; i < accounts.length; i++) {
          if (accounts[i].accountID === accountId) {
            currencyCode = applicationManager.getFormatUtilManager().getCurrencySymbol(accounts[i].currencyCode);
          }
        }
      } else {
        currencyCode = applicationManager.getFormatUtilManager().getCurrencySymbol(frmaccdata.currencyCode);
      }
      return currencyCode;
    },

    formatText: function(accountName, noOfChars, accountNumber, beginIndex) {
      var truncatedAccName = "";
      var truncatedAccNum = "";
      var formattedAccName = "";
      if (accountName && accountNumber && accountName.length > noOfChars) {
        truncatedAccName = accountName.substring(0, noOfChars - 1);
      } else {
        truncatedAccName = accountName;
      }
      if (accountNumber && accountNumber.length > beginIndex) {
        truncatedAccNum = accountNumber.substr(accountNumber.length - beginIndex);
      } else {
        if (accountNumber) {
          truncatedAccNum = accountNumber;
        }
      }
      if (truncatedAccNum) {
        formattedAccName = truncatedAccName + "..." + truncatedAccNum;
      } else {
        formattedAccName = truncatedAccName;
      }
      return formattedAccName;
    },

    //     setDisputedChecksTabUI: function () {
    //       var scopeObj = this;
    //       scopeObj.checkForPermissions();
    //       scopeObj.view.MyRequestsTabs.btnDisputedTrnsactions.skin = OLBConstants.SKINS.STOPPAYMENTS_UNSELECT_TAB;
    //       scopeObj.view.MyRequestsTabs.btnDisputedTrnsactions.hoverSkin = OLBConstants.SKINS.STOPPAYMENTS_UNSELECT_HOVER;
    //       scopeObj.view.MyRequestsTabs.btnDisputedChecks.skin = OLBConstants.SKINS.STOPPAYMENTS_SELECT_TAB;
    //       scopeObj.ShowAllSeperators();
    //       scopeObj.view.MyRequestsTabs.flxTabsSeperator1.setVisibility(false);
    //       scopeObj.view.MyRequestsTabs.flxSortDisputedChecks.setVisibility(true);
    //       //scopeObj.view.MyRequestsTabs.flxSearchContent.setVisibility(false);
    //       //scopeObj.view.MyRequestsTabs.lblSearchContent.text= kony.i18n.getLocalizedString("i18n.ChequeSearch.ShowingRecent")+" 20 "+ kony.i18n.getLocalizedString("i18n.accounts.checks")+kony.i18n.getLocalizedString("i18n.ChequeSearch.olderCheque");

    //       //scopeObj.view.MyRequestsTabs.imgSearchIcon.onclick = scopeObj.setChequeSearchUI;
    //       scopeObj.view.MyRequestsTabs.flxSort.setVisibility(false);
    //       scopeObj.view.MyRequestsTabs.lblSortDateDC.setFocus(true);
    //       scopeObj.view.forceLayout();
    //     },
    intialSearchUI: function() {
      var scopeObj = this;
      scopeObj.view.MyRequestsTabs.SearchContainer.flxChequeNumberRange.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxAmountRange.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.btnChequeRemoveRange.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.btnAddChequeRange.setVisibility(true);
      scopeObj.view.MyRequestsTabs.SearchContainer.btnAmountRemoveRange.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.btnAddAmountRange.setVisibility(true);
      scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.text = "";
      scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.text = "";
      scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.text = "";
      scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.text = "";
      scopeObj.view.MyRequestsTabs.SearchContainer.txtKeyword.text = "";
      var transObj = applicationManager.getTransactionsListManager().getTransactionObject();
      scopeObj.view.MyRequestsTabs.SearchContainer.lblCurrencySymbolFrom.text = transObj.accountCurrencyCode;
      scopeObj.view.MyRequestsTabs.SearchContainer.lblCurrencySymbolTo.text = transObj.accountCurrencyCode;
      scopeObj.view.MyRequestsTabs.SearchContainer.lstbxTransactionType.selectedKey = "lstAllStatus";
      scopeObj.searchResultsTurnoff();
    },

    setChequeSearchUI: function() {
      var scopeObj = this;
      scopeObj.intialSearchUI();
      scopeObj.view.MyRequestsTabs.SearchContainer.lblByTransactionType.text = kony.i18n.getLocalizedString("i18n.ChequeSearch.byStatusType");
      scopeObj.view.MyRequestsTabs.SearchContainer.lblByKeyword.text = kony.i18n.getLocalizedString("i18n.ChequeSearch.byPayeeName");
      scopeObj.view.MyRequestsTabs.SearchContainer.lblByCheckNumber.text = kony.i18n.getLocalizedString("i18n.AccountsDetails.ByCheckNumber");
      scopeObj.view.MyRequestsTabs.SearchContainer.lblAmountRange.text = kony.i18n.getLocalizedString("i18n.ChequeSearch.byAmount");
      scopeObj.view.MyRequestsTabs.SearchContainer.btnChequeRemoveRange.text = kony.i18n.getLocalizedString("i18n.ChequeSearch.removeRange");
      scopeObj.view.MyRequestsTabs.SearchContainer.btnAmountRemoveRange.text = kony.i18n.getLocalizedString("i18n.ChequeSearch.removeRange");
      scopeObj.view.MyRequestsTabs.SearchContainer.btnAddChequeRange.text = kony.i18n.getLocalizedString("i18n.ChequeSearch.addRange");
      scopeObj.view.MyRequestsTabs.SearchContainer.btnAddAmountRange.text = kony.i18n.getLocalizedString("i18n.ChequeSearch.addRange");

      scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContainer.setVisibility(true);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(false);

      scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch.onClick = scopeObj.setChequeSearchResultsUI.bind(scopeObj);

      /* to get the serach data */
      scopeObj.searchData = {};
      scopeObj.searchResult = [];
      scopeObj.chequeAddFlag = false;
      scopeObj.amountAddFlag = false;
      scopeObj.view.MyRequestsTabs.SearchContainer.lstbxTransactionType.onSelection = function() {

        if (scopeObj.view.MyRequestsTabs.SearchContainer.lstbxTransactionType.selectedKeyValue[1] === "All Status") {
          scopeObj.searchData.searchStatusType = "";
        }
        if (scopeObj.view.MyRequestsTabs.SearchContainer.lstbxTransactionType.selectedKeyValue[1] === "Issued") {
          scopeObj.searchData.searchStatusType = "ISSUED";
        }
        if (scopeObj.view.MyRequestsTabs.SearchContainer.lstbxTransactionType.selectedKeyValue[1] === "Cleared ") {
          scopeObj.searchData.searchStatusType = "CLEARED";
        }
        if (scopeObj.view.MyRequestsTabs.SearchContainer.lstbxTransactionType.selectedKeyValue[1] === "Returned") {
          scopeObj.searchData.searchStatusType = "RETURNED";
        }
        if (scopeObj.view.MyRequestsTabs.SearchContainer.lstbxTransactionType.selectedKeyValue[1] === "Stopped") {
          scopeObj.searchData.searchStatusType = "STOPPED";
        }
        if (scopeObj.view.MyRequestsTabs.SearchContainer.lstbxTransactionType.selectedKeyValue[1] !== "All Status") {
          FormControllerUtility.enableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
        } else {
          if (scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.text !== "" || scopeObj.view.MyRequestsTabs.SearchContainer.txtKeyword.text !== "" || scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.text !== "" || scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.text !== "" || scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.text !== "") {

            FormControllerUtility.enableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);

          } else {
            FormControllerUtility.disableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
          }

        }

      };
      scopeObj.view.MyRequestsTabs.SearchContainer.txtKeyword.onTextChange = function() {
        if (scopeObj.view.MyRequestsTabs.SearchContainer.txtKeyword.text !== "") {
          scopeObj.searchData.payeeName = scopeObj.view.MyRequestsTabs.SearchContainer.txtKeyword.text;
          FormControllerUtility.enableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
        } else {
          scopeObj.searchData.payeeName = "";
          FormControllerUtility.disableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
        }
      }
      //to Add cheque range enable the next flex
      scopeObj.view.MyRequestsTabs.SearchContainer.btnAddChequeRange.onClick = function() {
        scopeObj.chequeAddFlag = true;
        scopeObj.view.MyRequestsTabs.SearchContainer.flxChequeNumberRange.setVisibility(true);
        scopeObj.view.MyRequestsTabs.SearchContainer.btnChequeRemoveRange.setVisibility(true);
        scopeObj.view.MyRequestsTabs.SearchContainer.btnAddChequeRange.setVisibility(false);
      };
      scopeObj.view.MyRequestsTabs.SearchContainer.btnAddAmountRange.onClick = function() {
        scopeObj.amountAddFlag = true;
        scopeObj.view.MyRequestsTabs.SearchContainer.flxAmountRange.setVisibility(true);
        scopeObj.view.MyRequestsTabs.SearchContainer.btnAmountRemoveRange.setVisibility(true);
        scopeObj.view.MyRequestsTabs.SearchContainer.btnAddAmountRange.setVisibility(false);
      };
      scopeObj.view.MyRequestsTabs.SearchContainer.btnChequeRemoveRange.onClick = function() {
        scopeObj.chequeAddFlag = false;
        scopeObj.view.MyRequestsTabs.SearchContainer.flxChequeNumberRange.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.btnAddChequeRange.setVisibility(true);
        scopeObj.view.MyRequestsTabs.SearchContainer.btnChequeRemoveRange.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.text = "";
        scopeObj.searchData.chequeNumberRange = "";
      };
      scopeObj.view.MyRequestsTabs.SearchContainer.btnAmountRemoveRange.onClick = function() {
        scopeObj.amountAddFlag = false;
        scopeObj.view.MyRequestsTabs.SearchContainer.flxAmountRange.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.btnAddAmountRange.setVisibility(true);
        scopeObj.view.MyRequestsTabs.SearchContainer.btnAmountRemoveRange.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.text = "";
        scopeObj.searchData.amountRange = "";
      };
      scopeObj.view.MyRequestsTabs.SearchContainer.btnCancel.onClick = function() {
        scopeObj.myChequesTabClickHandler();
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContainer.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(true);
        scopeObj.intialSearchUI();
        scopeObj.clearSearchData();
      };
      /* validitiy of Cheque Number */
      var ValidNumber = function(checkumber) {
        var checkNumberReg = /^\d+$/;
        return checkNumberReg.test(checkumber);
      };
      /*Validity of Cheque Number 1 */
      scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.onTextChange = function() {
        if (scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.text !== "") {
          if (!ValidNumber(scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.text)) {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            FormControllerUtility.disableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
          } else {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.skin = "skntbxffffffBordere3e3e3SSP15px424242";
            FormControllerUtility.enableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
          }
        }

      };
      scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.onTextChange = function() {
        if (scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.text !== "") {
          var ChequeNumber1 = scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.text;
          var ChequeNumber2 = scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.text;
          if (!ValidNumber(ChequeNumber2)) {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            FormControllerUtility.disableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);

          } else {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.skin = "skntbxffffffBordere3e3e3SSP15px424242";
            FormControllerUtility.enableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
          }
          if (Number(ChequeNumber2) < Number(ChequeNumber1)) {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            FormControllerUtility.disableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);

          } else if (ChequeNumber1 === ChequeNumber2) {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            FormControllerUtility.disableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
          } else {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.skin = "skntbxffffffBordere3e3e3SSP15px424242";
            scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.skin = "skntbxffffffBordere3e3e3SSP15px424242";
            FormControllerUtility.enableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
          }
        }

      };
      scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.onTextChange = function() {
        if (scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.text !== "") {
          var str = scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.text;
          var amount = str.replace(/\./g, "");
          if (!ValidNumber(amount)) {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            FormControllerUtility.disableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
          } else {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.skin = "skntbxffffffBordere3e3e3SSP15px424242";
            FormControllerUtility.enableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
          }
        }

      };
      scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.onTextChange = function() {
        if (scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.text !== "") {
          var str = scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.text;
          var amount = str.replace(/\./g, "");
          var amount1 = scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.text;
          var amount2 = scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.text;
          if (!ValidNumber(amount)) {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            FormControllerUtility.disableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
          } else {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.skin = "skntbxffffffBordere3e3e3SSP15px424242";
            FormControllerUtility.enableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
          }
          if (amount2 < amount1) {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            FormControllerUtility.disableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
          } else if (amount2 === amount1) {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            FormControllerUtility.disableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
          } else {
            scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.skin = "skntbxffffffBordere3e3e3SSP15px424242";
            scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.skin = "skntbxffffffBordere3e3e3SSP15px424242";
            FormControllerUtility.enableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
          }
        }

      };
      if (scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.text !== "" || scopeObj.view.MyRequestsTabs.SearchContainer.txtKeyword.text !== "" || scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.text !== "" || scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.text !== "" || scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.text !== "") {

        FormControllerUtility.enableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);

      } else {
        if (scopeObj.view.MyRequestsTabs.SearchContainer.lstbxTransactionType.selectedKeyValue[1] !== "All Status") {
          FormControllerUtility.enableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
        } else {
          FormControllerUtility.disableButton(scopeObj.view.MyRequestsTabs.SearchContainer.btnSearch);
        }

      }
      scopeObj.AdjustScreen();
    },

    setChequeSearchResultsUI: function() {

      var scopeObj = this;
      scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContainer.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(true);

      /* fteching the data of chequeNumber */
      if (scopeObj.chequeAddFlag) {
        var ChequeNumber1 = scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.text;
        var ChequeNumber2 = scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.text;
        if (Number(ChequeNumber2) < Number(ChequeNumber1)) {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContainer.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
        }
        if (ChequeNumber2 !== "" && ChequeNumber2 !== null && ChequeNumber2 !== undefined) {
          scopeObj.searchData.chequeNumberRange = ChequeNumber1 + "-" + ChequeNumber2;
        } else {
          scopeObj.searchData.chequeNumber = ChequeNumber1;
        }
      } else {
        scopeObj.searchData.chequeNumber = scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.text;
      }

      /* fetch data of AMount Range */
      if (scopeObj.amountAddFlag) {
        var amount1 = scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.text;
        var amount2 = scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.text;
        if (amount2 < amount1) {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContainer.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
        }
        if (amount2 !== "" && amount2 !== null && amount2 !== undefined) {
          scopeObj.searchData.amountRange = amount1 + "-" + amount2;
        } else {
          scopeObj.searchData.amount = amount1;
        }
      } else {
        scopeObj.searchData.amount = scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.text;
      }


      if (scopeObj.searchData.searchStatusType !== "" &&
          scopeObj.searchData.searchStatusType !== null &&
          scopeObj.searchData.searchStatusType !== undefined) {
        scopeObj.searchResult.push("1");
        if (kony.application.getCurrentBreakpoint() === 640) {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxKeywordWrapper.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblKeywordValueM.text = scopeObj.searchData.searchStatusType;
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.lblKeywordTitle.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblKeywordValue.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelKeyword.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblKeywordValue.text = scopeObj.searchData.searchStatusType;
        }

      }
      if (scopeObj.searchData.amount !== "" &&
          scopeObj.searchData.amount !== null &&
          scopeObj.searchData.amount !== undefined) {
        scopeObj.searchResult.push("1");
        if (kony.application.getCurrentBreakpoint() === 640) {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxAmountRangeWrapper.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblAmountRangeValueM.text = scopeObj.searchData.amount;
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.lblAmountRangeTitle.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblAmountRangeValue.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelAmountRange.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblAmountRangeValue.text = scopeObj.searchData.amount;
        }
      }
      if (scopeObj.searchData.amountRange !== "" && scopeObj.searchData.amountRange !== null && scopeObj.searchData.amountRange !== undefined) {
        scopeObj.searchResult.push("1");
        if (kony.application.getCurrentBreakpoint() === 640) {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxAmountRangeWrapper.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblAmountRangeValueM.text = scopeObj.searchData.amountRange;
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.lblAmountRangeTitle.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblAmountRangeValue.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelAmountRange.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblAmountRangeValue.text = scopeObj.searchData.amountRange;
        }
      }
      if (scopeObj.searchData.payeeName !== "" &&
          scopeObj.searchData.payeeName !== null &&
          scopeObj.searchData.payeeName !== undefined) {
        scopeObj.searchResult.push("1");
        if (kony.application.getCurrentBreakpoint() === 640) {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxCheckNumberWrapper.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblCheckNumberValueM.text = scopeObj.searchData.payeeName;
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.lblCheckNumberTitle.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblCheckNumberValue.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelCheckNumber.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblCheckNumberValue.text = scopeObj.searchData.payeeName;
        }

      }
      if (scopeObj.searchData.chequeNumber !== "" &&
          scopeObj.searchData.chequeNumber !== null &&
          scopeObj.searchData.chequeNumber !== undefined) {
        scopeObj.searchResult.push("1");
        if (kony.application.getCurrentBreakpoint() === 640) {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxTypeWrapper.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblTypeValueM.text = scopeObj.searchData.chequeNumber;
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.lblTypeTitle.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblTypeValue.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblTypeValue.text = scopeObj.searchData.chequeNumber;
          scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelType.setVisibility(true);
        }
      }
      if (scopeObj.searchData.chequeNumberRange !== "" && scopeObj.searchData.chequeNumberRange !== null && scopeObj.searchData.chequeNumberRange !== undefined) {
        scopeObj.searchResult.push("1");
        if (kony.application.getCurrentBreakpoint() === 640) {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxTypeWrapper.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblTypeValueM.text = scopeObj.searchData.chequeNumberRange;
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.lblTypeTitle.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblTypeValue.setVisibility(true);
          scopeObj.view.MyRequestsTabs.SearchContainer.lblTypeValue.text = scopeObj.searchData.chequeNumberRange;
          scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelType.setVisibility(true);
        }
      }

      scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelKeyword.onClick = function() {
        scopeObj.searchResult.pop();
        scopeObj.searchData.searchStatusType = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.lstbxTransactionType.selectedKey = "lstAllStatus";
        scopeObj.view.MyRequestsTabs.SearchContainer.lblKeywordTitle.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.lblKeywordValue.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelKeyword.setVisibility(false);
        if (scopeObj.searchResult.length > 0) {
          scopeObj.loadStopPaymentsModule().presentationController.showSearchDetails(scopeObj.searchData);
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(true);
          scopeObj.myChequesTabClickHandler();
        }
      };
      scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelKeywordM.onClick = function() {
        scopeObj.searchResult.pop();
        scopeObj.searchData.searchStatusType = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.lstbxTransactionType.selectedKey = "lstAllStatus";
        scopeObj.view.MyRequestsTabs.SearchContainer.flxKeywordWrapper.setVisibility(false);
        if (scopeObj.searchResult.length > 0) {
          scopeObj.loadStopPaymentsModule().presentationController.showSearchDetails(scopeObj.searchData);
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(true);
          scopeObj.myChequesTabClickHandler();
        }
      };
      scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelType.onClick = function() {
        scopeObj.searchResult.pop();
        scopeObj.searchData.chequeNumber = "";
        scopeObj.searchData.chequeNumberRange = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.lblTypeTitle.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.lblTypeValue.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelType.setVisibility(false);
        if (scopeObj.searchResult.length > 0) {
          scopeObj.loadStopPaymentsModule().presentationController.showSearchDetails(scopeObj.searchData);
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(true);
          scopeObj.myChequesTabClickHandler();
        }
      };
      scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelTypeM.onClick = function() {
        scopeObj.searchResult.pop();
        scopeObj.searchData.chequeNumber = "";
        scopeObj.searchData.chequeNumberRange = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.flxTypeWrapper.setVisibility(false);
        if (scopeObj.searchResult.length > 0) {
          scopeObj.loadStopPaymentsModule().presentationController.showSearchDetails(scopeObj.searchData);
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(true);
          scopeObj.myChequesTabClickHandler();
        }
      };
      scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelCheckNumber.onClick = function() {
        scopeObj.searchResult.pop();
        scopeObj.searchData.payeeName = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtKeyword.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.lblCheckNumberTitle.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.lblCheckNumberValue.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelCheckNumber.setVisibility(false);
        if (scopeObj.searchResult.length > 0) {
          scopeObj.loadStopPaymentsModule().presentationController.showSearchDetails(scopeObj.searchData);
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(true);
          scopeObj.myChequesTabClickHandler();
        }
      };

      scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelCheckNumberM.onClick = function() {
        scopeObj.searchResult.pop();
        scopeObj.searchData.payeeName = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtKeyword.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.flxCheckNumberWrapper.setVisibility(false);
        if (scopeObj.searchResult.length > 0) {
          scopeObj.loadStopPaymentsModule().presentationController.showSearchDetails(scopeObj.searchData);
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(true);
          scopeObj.myChequesTabClickHandler();
        }
      };
      scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelAmountRange.onClick = function() {
        scopeObj.searchResult.pop();
        scopeObj.searchData.amount = "";
        scopeObj.searchData.amountRange = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.lblAmountRangeTitle.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.lblAmountRangeValue.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelAmountRange.setVisibility(false);
        if (scopeObj.searchResult.length > 0) {
          scopeObj.loadStopPaymentsModule().presentationController.showSearchDetails(scopeObj.searchData);
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(true);
          scopeObj.myChequesTabClickHandler();
        }
      };
      scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelAmountRangeM.onClick = function() {
        scopeObj.searchResult.pop();
        scopeObj.searchData.amount = "";
        scopeObj.searchData.amountRange = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.flxAmountRangeWrapper.setVisibility(false);
        if (scopeObj.searchResult.length > 0) {
          scopeObj.loadStopPaymentsModule().presentationController.showSearchDetails(scopeObj.searchData);
        } else {
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
          scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(true);
          scopeObj.myChequesTabClickHandler();
        }
      };
      scopeObj.view.MyRequestsTabs.SearchContainer.btnModifySearch.onClick = function() {
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContainer.setVisibility(true);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(false);
        scopeObj.searchResultsTurnoff();
        scopeObj.AdjustScreen();
      };
      scopeObj.view.MyRequestsTabs.SearchContainer.btnClearSearch.onClick = function() {
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContainer.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchResults.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(true);
        scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberFrom.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtCheckNumberTo.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeFrom.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtAmountRangeTo.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.txtKeyword.text = "";
        scopeObj.view.MyRequestsTabs.SearchContainer.lstbxTransactionType.selectedKey = "lstAllStatus";
        scopeObj.clearSearchData();
        scopeObj.searchResultsTurnoff();
        scopeObj.myChequesTabClickHandler();
      };
      scopeObj.loadStopPaymentsModule().presentationController.showSearchDetails(scopeObj.searchData);
      scopeObj.AdjustScreen();
    },
    clearSearchData: function() {
      var scopeObj = this;
      scopeObj.searchData.chequeNumber = "";
      scopeObj.searchData.payeeName = "";
      scopeObj.searchData.amount = "";
      scopeObj.searchData.searchStatusType = "";
      scopeObj.searchData.chequeNumberRange = "";
      scopeObj.searchData.amountRange = "";
    },

    searchResultsTurnoff: function() {
      var scopeObj = this;
      scopeObj.view.MyRequestsTabs.SearchContainer.lblKeywordTitle.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.lblKeywordValue.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelKeyword.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.lblTypeTitle.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.lblTypeValue.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelType.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.lblAmountRangeTitle.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.lblAmountRangeValue.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelAmountRange.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.lblCheckNumberTitle.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.lblCheckNumberValue.setVisibility(false);
      scopeObj.view.MyRequestsTabs.SearchContainer.flxCancelCheckNumber.setVisibility(false);
      if (kony.application.getCurrentBreakpoint() === 640) {
        scopeObj.view.MyRequestsTabs.SearchContainer.flxKeywordWrapper.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxTypeWrapper.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxAmountRangeWrapper.setVisibility(false);
        scopeObj.view.MyRequestsTabs.SearchContainer.flxCheckNumberWrapper.setVisibility(false);
      }
    },
    checkForPermissions: function() {
      var scopeObj = this;
      var configManager = applicationManager.getConfigurationManager();
      if (hasStopPaymentFeat)
        scopeObj.view.MyRequestsTabs.btnDisputedTrnsactions.setVisibility(true);

	//if no permission on view and create cheque book request, the tab for ChequeBook is not visible.
  	  var chequeBookReqViewPerm = configManager.checkAccountAction(LandingSelectedAccount,"CHEQUE_BOOK_REQUEST_VIEW");
	  var chequeBookReqCreatePerm = configManager.checkAccountAction(LandingSelectedAccount,"CHEQUE_BOOK_REQUEST_CREATE");
	  if (!chequeBookReqViewPerm && !chequeBookReqCreatePerm) {
        scopeObj.view.MyRequestsTabs.btnDisputedChecks.setVisibility(false);   
      } else {
        scopeObj.view.MyRequestsTabs.btnDisputedChecks.setVisibility(true);   
	  }	
      if (hasViewChequesFeat)
        scopeObj.view.MyRequestsTabs.btnMyCheques.setVisibility(true);
	
	  if (chequeBookReqCreatePerm) {
		this.view.MyRequestsTabs.btnNewChequeBookRequests.setVisibility(true);   
	  } else {
		this.view.MyRequestsTabs.btnNewChequeBookRequests.setVisibility(false);   
	  }

      if (hasCreateStopPaymentPerm) {
        this.view.MyRequestsTabs.btnAddNewStopCheckPayments.setVisibility(true);
        this.view.MyRequestsTabs.btnNewChequeBookRequests.setVisibility(false);
      }
    },

    /* Set user permissions */
    setUserPermissions: function() {
      var scopeObj = this;
      var configManager = applicationManager.getConfigurationManager();

      hasStopPaymentFeat = configManager.checkUserFeature("STOP_PAYMENT_REQUEST");
      hasChequeRequestFeat = configManager.checkUserFeature("CHEQUE_BOOK_REQUEST");
      hasViewChequesFeat = configManager.checkUserFeature("VIEW_CHEQUES");
      hasRevokeStopPaymentFeat = configManager.checkUserFeature("REVOKE_STOP_PAYMENT_REQUEST");
      hasCreateStopPaymentPerm = configManager.checkUserPermission("STOP_PAYMENT_REQUEST_CREATE");
      hasCreateChequeBookPerm = configManager.checkUserPermission("CHEQUE_BOOK_REQUEST_CREATE");
    },

    /**
         * ShowAllSeperators
         */
    ShowAllSeperators: function() {
      // this.view.MyRequestsTabs.flxTabsSeperator1.setVisibility(true);
      // this.view.MyRequestsTabs.flxTabsSeperator2.setVisibility(true);
      // this.view.MyRequestsTabs.flxTabsSeperator3.setVisibility(true);
      this.view.forceLayout();
    },
    /**
         * showDisputeTransactionDetail : update flexes visibility w.r.t dispute transaction form
         */
    showDisputeTransactionDetail: function() {
      this.hideAll();
      this.setBreadcrumb([{
        label: kony.i18n.getLocalizedString("i18n.topmenu.accounts"),
        toolTip: kony.i18n.getLocalizedString("i18n.topmenu.accounts")
      },
                          {
                            label: kony.i18n.getLocalizedString("i18n.accounts.disputeTransaction"),
                            toolTip: kony.i18n.getLocalizedString("i18n.accounts.disputeTransaction")
                          },
                         ]);
      this.view.lblStopPayments.setVisibility(true);
      this.view.flxDisputeTransactionDetail.setVisibility(true);
      this.AdjustScreen();
    },
    /**
         * showStopCheckPaymentsSeriesMultiple : update flexes visibility w.r.t stop checks form
         */
    showStopCheckPaymentsSeriesMultiple: function() {
      var scopeObj = this;
      scopeObj.hideAll();
      this.view.accountTypes.setVisibility(false);
      this.view.flxAccounts.setVisibility(false);
      scopeObj.view.lblChequeBookRequests.setVisibility(true);
      scopeObj.view.flxDisputedTransactionDetail.setVisibility(true);
      scopeObj.view.flxDisputedTransactionDetails.setVisibility(true);
      scopeObj.view.flxStopCheckPaymentSeriesMultiple.setVisibility(true);
      scopeObj.view.flxActionsDisputeTransactionDetails.setVisibility(true);
      scopeObj.view.btnViewDisputedTransactions.setVisibility(hasStopPaymentFeat);
      scopeObj.view.btnViewDisputedChecks.setVisibility(hasChequeRequestFeat);
      scopeObj.view.btnViewMyCheques.setVisibility(hasViewChequesFeat);
      scopeObj.view.forceLayout();
    },
    /**
         * hideAll : Method to show hide all flexes in form
         */
    hideAll: function() {
      //this.view.flxAccounts.setVisibility(false);
      this.view.flxActionsDisputeTransactionDetails.setVisibility(false);
      this.view.flxDowntimeWarning.setVisibility(false);
      this.view.flxDisputedTransactionDetail.setVisibility(false);
      this.view.flxStopCheckPaymentSeriesMultiple.setVisibility(false);
      if (kony.application.getCurrentBreakpoint() >= 1366) {
        this.view.flxDisputedTransactionDetails.height = "750px";
      }
      this.view.flxDisputeTransactionDetail.setVisibility(false);
      this.view.lblStopPayments.setVisibility(false);
      this.view.flxMyRequestsTabs.setVisibility(false);
      this.view.flxRequestChequeBookDetail.setVisibility(false);
      this.view.flxConfirmDetailsSingleMultiple.setVisibility(false);
      this.view.flxConfirmDialog.setVisibility(false);
      this.view.lblChequeBookRequests.setVisibility(false);
      this.view.flxSinglePayConfirm.setVisibility(false);
      this.view.flxAcknowledgement.setVisibility(false);
      this.view.flxLoading.setVisibility(false);
      this.view.flxPrintACK.setVisibility(false);
      this.setValidationErrorMessageState(false);
      //this.view.MyRequestsTabs.flxSearchContent.setVisibility(false);
      //this.view.MyRequestsTabs.flxSearchContainer.setVisibility(false);
      //this.view.MyRequestsTabs.flxSearchResults.setVisibility(false);
      this.view.forceLayout();
    },
    /**
         * shouldUpdateUI : Method to decide whether view model is defined or not
         * @param {object} viewModel, view model object
         * @return {bolean} true/false , whether view model is defined or not
         */
    shouldUpdateUI: function(viewModel) {
      return viewModel !== undefined && viewModel !== null;
    },
    /**
         * updateFormUI : Method to update form UI w.r.t view data called by presentUserInterface
         * @param {obejct} stopPayementsView  view model object
         */
    updateFormUI: function(stopPayementsView) {
      var scopeObj = this;
      if (stopPayementsView.progressBar !== undefined) {
        if (stopPayementsView.progressBar) {
          scopeObj.setServerError(false);
          FormControllerUtility.showProgressBar(scopeObj.view);
        } else {
          FormControllerUtility.hideProgressBar(scopeObj.view);
        }
      } else {
        if (stopPayementsView.serverError) {
          scopeObj.setServerError(stopPayementsView.serverError);
        } else if (stopPayementsView.stopChecksFormData) {
          scopeObj.showStopChecksForm(stopPayementsView.stopChecksFormData);

        } else if (stopPayementsView.ChequeBookFormData) {
          scopeObj.showRequestChequeBookForm(stopPayementsView.ChequeBookFormData);
        } else if (stopPayementsView.stopChecksFormAccounts) {
          scopeObj.setStopChecksFormAccountsDropdown({
            "ddnList": stopPayementsView.stopChecksFormAccounts
          });
        } else if (stopPayementsView.disputeTransactionObject) {
          scopeObj.showDisputeTransactionDetailPage(stopPayementsView.disputeTransactionObject);
        } else if (stopPayementsView.successStopCheckRequest) {
          scopeObj.showStopChekRequestAcknowledgment(stopPayementsView.successStopCheckRequest);
        } else if (stopPayementsView.disputeTransactionResponse) {
          scopeObj.showConfirmationDisputeTransaction(stopPayementsView.disputeTransactionResponse);
        } else if (stopPayementsView.myRequests) {
          scopeObj.showMyRequests(stopPayementsView.myRequests);
          applicationManager.executeAuthorizationFramework(this, "addNewStopCheckRequest");
        } else if (stopPayementsView.stopCheckRequestsViewModel && hasStopPaymentFeat) {
          scopeObj.disputedTransactionsTabClickHandler()
        } else if (stopPayementsView.viewDisputedRequestsResponse) {
          scopeObj.showDisputeTransactionsRequests(stopPayementsView.viewDisputedRequestsResponse);
        } else if (stopPayementsView.cancelStopCheckAction) {
          scopeObj.showCancelStopRequestUI(stopPayementsView.cancelStopCheckAction);
        } else if (stopPayementsView.TnCcontent) {
          scopeObj.bindTnCData(stopPayementsView.TnCcontent);
        } else if (stopPayementsView.stopCheckRequestsViewModel && hasChequeRequestFeat) {
          scopeObj.disputedChecksTabClickHandler();
        } else if (stopPayementsView.myChequesViewModel && hasViewChequesFeat) {
          scopeObj.myChequesTabClickHandler();
        } else if(stopPayementsView.emptyAccounts){
          scopeObj.showErrorForEmptyAccounts();
        }
      }
      if (stopPayementsView.bankDate) {
        this.setBankDate(stopPayementsView.bankDate);
      }
      if (stopPayementsView.accountList) {
        this.updateAccountList(stopPayementsView.accountList);
      }
      if (stopPayementsView.campaign) {
        CampaignUtility.showCampaign(stopPayementsView.campaign, this.view, "flxContainer");
      }
      scopeObj.AdjustScreen();
    },

    /**
        * for empty accounts showing error message
        */
    showErrorForEmptyAccounts: function(){
      this.view.flxDowntimeWarning.setVisibility(true);
      this.view.lblDowntimeWarning.text=kony.i18n.getLocalizedString("i18n.ChequeBookReq.EmptyAccountsErrorMsg");
    }, 
    /**
         * bindDisputeTransactionRequestsData : set widget data map for dispute transactions view requests
         * @param {Array} disputeTransactionRequests transactions view model
         */
    bindDisputeTransactionRequestsData: function(disputeTransactionRequests) {
      var scopeObj = this;
      var break_point = kony.application.getCurrentBreakpoint();
      var widgetDataMap = {
        "lblIdentifier": "lblIdentifier",
        "lblSeparator2": "lblSeparator2",
        "lblSeperator2": "lblSeperator2",
        "lblSeparator": "lblSeparator",
        "lblSeparatorActions": "lblSeparatorActions",
        "imgDropDown": "imgDropDown",
        "lblDate": "lblDate",
        "lblDate1": "lblDate1",
        "btnCancelRequests": "btnCancelRequests",
        "btnSendAMessage": "btnSendAMessage",
        "lblDescription": "lblDescription",
        "lblFromAccount": "lblFromAccount",
        "lblFromAccountData": "lblFromAccountData",
        "lblDateOfDescriptionKey": "lblDateOfDescriptionKey",
        "lblDateOfDescriptionValue": "lblDateOfDescriptionValue",
        "lblReasonKey": "lblReasonKey",
        "lblReasonValue": "lblReasonValue",
        "lblReferenceNo": "lblReferenceNo",
        "lblToAccount": "lblToAccount",
        "lblToAccountData": "lblToAccountData",
        "CopylblFrequencyTitle0c4e7bef1ab0c44": "CopylblFrequencyTitle0c4e7bef1ab0c44",
        "lblTransactionTypeValue": "lblTransactionTypeValue",
        "lblDesciptionKey": "lblDesciptionKey",
        "lblDescriptionValue": "lblDescriptionValue",
        "lblAmountKey": "lblAmountKey",
        "lblStatus": "lblStatus",
        "flxDropdown": "flxDropdown",
        "lblDescriptionHeading": "lblDescriptionHeading",
        "lblToAccount2": "lblToAccount2",
        "lblToAccountData2": "lblToAccountData2",
        "lblToAccountData1": "lblToAccountData1",
        "lblAmount": "lblAmount",
        "lblTransactionDetails": "lblTransactionDetails",
        "lblToAccount1": "lblToAccount1"
      };
      var dataMap = disputeTransactionRequests.map(function(requestObj) {
        return {
          "template": "flxDisputedTransactionsUnSelected",
          "imgDropDown": OLBConstants.IMAGES.ARRAOW_DOWN,
          "flxDropdown": "flxDropdown",
          "lblDate": requestObj.disputeDate,
          "btnSendAMessage": {
            "text": kony.i18n.getLocalizedString("i18n.StopCheckPayments.SENDMessage"),
            "toolTip": CommonUtilities.changedataCase(kony.i18n.getLocalizedString("i18n.StopCheckPayments.SENDMessage")),
            "onClick": requestObj.onSendMessageAction ? requestObj.onSendMessageAction : null,
            "isVisible": (applicationManager.getConfigurationManager().checkUserPermission("MESSAGES_CREATE") && requestObj.onSendMessageAction) ? true : false
          },
          "btnCancelRequests": {
            "isVisible": (applicationManager.getConfigurationManager().checkUserPermission("DISPUTE_TRANSACTIONS_MANAGE") && requestObj.onCancelRequest) ? true : false,
            "text": kony.i18n.getLocalizedString("i18n.StopPayments.CANCELREQUEST"),
            "toolTip": CommonUtilities.changedataCase(kony.i18n.getLocalizedString("i18n.StopPayments.CANCELREQUEST")),
            "onClick": requestObj.onCancelRequest
          },
          "lblDescription": requestObj.transactionDesc,
          "lblIdentifier": "lblIdentifier",
          "lblSeparator2": "lblSeparator2",
          "lblSeperator2": "lblSeperator2",
          "lblSeparator": "lblSeparator",
          "lblSeparatorActions": "lblSeparatorActions",
          "lblFromAccount": kony.i18n.getLocalizedString("i18n.transfers.fromAccount"),
          "lblFromAccountData": requestObj.fromAccount,
          "lblDateOfDescriptionKey": kony.i18n.getLocalizedString("i18n.StopCheckPayments.DateOfTransaction"),
          "lblDateOfDescriptionValue": requestObj.transactionDate,
          "lblReasonKey": kony.i18n.getLocalizedString("i18n.StopCheckPayments.Reason"),
          "lblReasonValue": requestObj.disputeReason,
          "lblReferenceNo": requestObj.transactionId,
          "lblToAccount": kony.i18n.getLocalizedString("i18n.PayAPerson.ToAccount"),
          "lblToAccountData": requestObj.toAccountName,
          "CopylblFrequencyTitle0c4e7bef1ab0c44": kony.i18n.getLocalizedString("i18n.accounts.TransactionType"),
          "lblTransactionTypeValue": requestObj.transactionType,
          "lblDesciptionKey": kony.i18n.getLocalizedString("i18n.StopPayments.Description"),
          "lblDescriptionValue": requestObj.disputeDescription,
          "lblAmount": requestObj.amount,
          "lblStatus": requestObj.disputeStatus,
          "lblDate1": requestObj.disputeDate,
          "lblDescriptionHeading": "Description",
          "lblAmountKey": "Amount",
          "lblToAccount1": "To:",
          "lblToAccount2": "Billpay-",
          "lblToAccountData2": requestObj.toAccountName,
          "lblToAccountData1": requestObj.toAccountName,
          "lblTransactionDetails": "Transaction Details"
        };
      });
      scopeObj.view.MyRequestsTabs.segTransactions.widgetDataMap = widgetDataMap;
      if (break_point == 640) {
        for (var i = 0; i < dataMap.length; i++) {
          dataMap[i].template = "flxDisputedTransactionsUnSelectedMobile";
        }
      }
      scopeObj.view.MyRequestsTabs.segTransactions.setData(dataMap);
      if (CommonUtilities.isPrintEnabled()) {
        scopeObj.view.flxPrintACK.setVisibility(true);
      } else {
        scopeObj.view.flxPrintACK.setVisibility(false);
      }
      scopeObj.view.MyRequestsTabs.segTransactions.setVisibility(true);
      scopeObj.view.forceLayout();
      scopeObj.AdjustScreen();
    },
    /**
         * bindDisputeTransactionReasonsDropdown : Method to bind Stop checks form reasons dropdown
         * @param {object} viewModel dropdown view model
         */
    bindDisputeTransactionReasonsDropdown: function(viewModel) {
      var scopeObj = this;
      if (viewModel && viewModel.list.length) {
        scopeObj.view.lstBoxSelectReasonForDisputeTransaction.masterData = viewModel.list.map(function(reason) {
          return [reason.id, reason.name];
        });
      }
    },
    /**
         * setDisputeTransactionReasonsDropdown : Method to set dispute transaction reasons dropdown
         * @param {object} viewModel - dropdown view model
         */
    setDisputeTransactionReasonsDropdown: function(viewModel) {
      var scopeObj = this;
      if (viewModel && viewModel.ddnList && viewModel.ddnList.length) {
        scopeObj.bindDisputeTransactionReasonsDropdown({
          list: viewModel.ddnList
        });
      }
      scopeObj.view.lstBoxSelectReasonForDispute.selectedKey = viewModel.selectedValue || scopeObj.savedSeriesCheckReason || scopeObj.view.lbxSelectReasonNew.masterData[0][0];
    },
    /**
         * showConfirmationDisputeTransaction : Method to show showConfirmationDisputeTransaction
         * @param {object} viewModel response
         */
    showConfirmationDisputeTransaction: function(viewModel) {
      var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
      var combinedUser = (applicationManager.getConfigurationManager().isCombinedUser === "true");
      this.hideAll();
      if(viewModel.isPrintTransaction){
        this.view.flxConfirmDialog.setVisibility(false);
        this.view.flxAcknowledgementDetails.setVisibility(true);
      }else{
        this.view.flxConfirmDialog.setVisibility(true);
        this.view.flxAcknowledgementDetails.setVisibility(false);
      } 
      this.view.flxAcknowledgement.setVisibility(true);
      this.view.flxAcknowledgementMain.setVisibility(true);
      if (viewModel.isDataBindedAlready) {
        return;
      }
      //if(combinedUser){
      if (this.profileAccess === "both") {
        this.view.flxIcon.setVisibility(true);
        this.view.flxIcon.left = "34%";
        this.view.lblIcon.text = viewModel.values.isBusinessAccount === "true" ? "r" : "s";
        this.view.flxBankNameValue.left = "39%";
      }
      this.view.customheadernew.lblHeaderMobile.text = this.view.lblBillPayAcknowledgement.text;
      this.view.lblHeader.text = kony.i18n.getLocalizedString("i18n.transfers.Acknowledgement");
      this.view.lblHeading.text = kony.i18n.getLocalizedString("i18n.transfers.YourTransactionDetails");
      this.view.btnMakeTransfer.text = kony.i18n.getLocalizedString("i18n.ViewStatements.BackToAccountDetails");
      this.view.btnAddAnotherAccount.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.ViewRequests");
      this.view.btnMakeTransfer.toolTip = kony.i18n.getLocalizedString("i18n.ViewStatements.BackToAccountDetails");
      this.view.btnAddAnotherAccount.toolTip = kony.i18n.getLocalizedString("i18n.StopCheckPayments.ViewRequests");
      this.view.acknowledgmentMyRequests.confirmHeaders.lblHeading.text = kony.i18n.getLocalizedString("i18n.transfers.Acknowledgement");
      this.view.lblBillPayAcknowledgement.text = kony.i18n.getLocalizedString("i18n.StoCheckPayment.DisputeTransactionAck");
      this.view.acknowledgmentMyRequests.lblTransactionMessage.text = kony.i18n.getLocalizedString("i18n.stopChecks.DisputeSuccessMsg");
      this.setBreadcrumb([{
        label: kony.i18n.getLocalizedString("i18n.topmenu.accounts"),
        toolTip: kony.i18n.getLocalizedString("i18n.topmenu.accounts")
      },
                          {
                            label: kony.i18n.getLocalizedString("i18n.StoCheckPayment.DisputeTransactionAck"),
                            toolTip: kony.i18n.getLocalizedString("i18n.StoCheckPayment.DisputeTransactionAck")
                          }
                         ]);
      this.view.lblRoutingNumberValue.text = viewModel.values.amount || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.lblDescriptionValue.text = viewModel.values.description || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.lblAccountNumberValue.text = viewModel.values.notes || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.lblBankNameValue.text = viewModel.values.fromAccountNumber || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.lblAccountNickNameValue.text = viewModel.values.referenceNumber || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.lblDeliveryByValue.text = viewModel.values.reason || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.lblCountryNameValue.text = viewModel.values.toAccount || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.lblAccountTypeValue.text = viewModel.values.date || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.lblBenificiaryNameValue.text = viewModel.values.types || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.btnMakeTransfer.onClick = viewModel.values.onBacktoAccountDetails;
      var self = this;
      this.view.btnAddAnotherAccount.onClick = function() {
        var viewModel = {
          selectTab: OLBConstants.DISPUTED_TRANSACTIONS
        };
        self.loadStopPaymentsModule().presentationController.showMyRequests(viewModel);
      };
    },
    /**
         * showDisputeTransactionDetailPage : Method to show showDisputeTransactionDetailPage
         * @param {object} viewModel object
         */
    showDisputeTransactionDetailPage: function(viewModel) {
      var self = this;
      var isBusinessAccount = "false";
      var accounts = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"appName":"ArrangementsMA", "moduleName":"AccountsUIModule"}).presentationController.accounts;
      //var combinedUser = applicationManager.getConfigurationManager().isCombinedUser === "true";
      var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
      this.showDisputeTransactionDetail();
      Disputeflag = 1;
      this.setDisputeTransactionReasonsDropdown({
        ddnList: self.loadStopPaymentsModule().presentationController.getdisputeTransactionReasonsListViewModel(),
        selectedValue: viewModel.checkReason || null
      });
      for (i = 0; i < accounts.length; i++) {
        if (accounts[i].accountID === viewModel.data.accountNumber)
          isBusinessAccount = accounts[i].isBusinessAccount
          }
      //if (combinedUser) {
      if (this.profileAccess === "both") {
        this.view.flxIcon1.setVisibility(true);
        this.view.lblIcon1.text = isBusinessAccount === "true" ? "r" : "s";
        this.view.lblValue1.left = "5%";
        this.view.flxIcon1.left = "26%";
      }
      this.view.txtBoxDescription.text = "";
      this.view.lblKey3.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.Amount($)");
      this.view.lblValue1.text = viewModel.data.fromAccountNumber || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.lblValue2.text = viewModel.data.toAccount || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.lblValue3.text = viewModel.data.amount || kony.i18n.getLocalizedString("i18n.common.none");
      var date = viewModel.data.date;
      this.view.lblValue4.text = date || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.lblValue5.text = viewModel.data.types || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.lblValue6.text = viewModel.data.referenceNumber || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.lblValue7.text = viewModel.data.notes || kony.i18n.getLocalizedString("i18n.common.none");
      this.view.txtBoxDescription.maxTextLength = OLBConstants.NOTES_MAX_LENGTH;
      this.view.btnModifyDetails.onClick = viewModel.onCancel;
      this.view.btnConfirmDetails.onClick = function() {
        var input = {
          fromAccountNumber: viewModel.data.fromAccountNumber,
          toAccount: viewModel.data.toAccount,
          amount: viewModel.data.amount,
          date: viewModel.data.date,
          types: viewModel.data.types || kony.i18n.getLocalizedString("i18n.common.none"),
          referenceNumber: viewModel.data.referenceNumber,
          notes: viewModel.data.notes || kony.i18n.getLocalizedString("i18n.common.none"),
          reason: self.view.lstBoxSelectReasonForDisputeTransaction.selectedkeyvalue[1],
          description: self.view.txtBoxDescription.text,
          onBacktoAccountDetails: viewModel.onBacktoAccountDetails || null,
          isBusinessAccount: isBusinessAccount
        };
        self.onBtnContinueDisputeTransaction(input, viewModel.onCancel);
        self.AdjustScreen();
      };
    },
    /**
         * onBtnContinueDisputeTransaction : Method to show confirmation page for dispute a transaction
         * @param {object} input input
         * @param {function} onCancelAction onCancel Action
         */
    onBtnContinueDisputeTransaction: function(input, onCancelAction) {
      var orientationHandler = new OrientationHandler();
      //var combinedUser = applicationManager.getConfigurationManager().isCombinedUser === "true";
      var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile
      var isMobile = ((kony.application.getCurrentBreakpoint() === 640) || orientationHandler.isMobile);
      var isTablet = ((kony.application.getCurrentBreakpoint() === 1024) || orientationHandler.isTablet);
      this.view.lblStopPayments.setVisibility(false);
      this.view.customheadernew.lblHeaderMobile.text = this.view.lblHeader.text;
      this.view.flxDisputedTransactionDetail.setVisibility(false);
      this.view.flxSinglePayConfirm.setVisibility(true);
      this.view.flxTopHeader.setVisibility(true);
      this.view.flxSuccessMessageStopCheck.setVisibility(false);
      this.view.flxConfirmDetailsSingleMultiple.setVisibility(true);
      this.view.flxHeader.setFocus(true);
      this.setBreadcrumb([{
        label: kony.i18n.getLocalizedString("i18n.topmenu.accounts"),
        toolTip: kony.i18n.getLocalizedString("i18n.topmenu.accounts")
      },
                          {
                            label: kony.i18n.getLocalizedString("i18n.StopCheckPayments.ConfirmDisputeTransaction"),
                            toolTip: kony.i18n.getLocalizedString("i18n.StopCheckPayments.ConfirmDisputeTransaction")
                          },
                         ]);
      this.view.rtxReason.text = input.reason;
      this.view.rtxDescription.text = input.description;
      this.view.flxPrintACK.setVisibility(false);
      this.view.flxDownloadACK.setVisibility(false);
      this.view.lblHeader.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.ConfirmDisputeTransaction");
      var break_point = kony.application.getCurrentBreakpoint();
      var dataMap = {
        "rtxFrom1": "rtxFrom1",
        "rtxPayee1": "rtxPayee1",
        "rtxDate1": "rtxDate1",
        "rtxAmount1": "rtxAmount1",
        "rtxNotes1": "rtxNotes1",
        "rtxType1": "rtxType1",
        "rtxReferenceNumber1": "rtxReferenceNumber1",
        "lblFrom1": "lblFrom1",
        "lblPayee1": "lblPayee1",
        "lblDate1": "lblDate1",
        "lblAmount1": "lblAmount1",
        "lblNotes1": "lblNotes1",
        "lblType1": "lblType1",
        "lblReferenceNumber1": "lblReferenceNumber1",
        "flxIcon": "flxIcon",
        "imgIcon": "imgIcon"
      };
      var data = [];
      var segData = {
        "rtxFrom1": {
          "text": input.fromAccountNumber
        },
        "rtxPayee1": input.toAccount || kony.i18n.getLocalizedString("i18n.common.none"),
        "rtxDate1": input.date,
        "rtxAmount1": input.amount,
        "rtxNotes1": input.notes || kony.i18n.getLocalizedString("i18n.common.none"),
        "rtxType1": input.types,
        "rtxReferenceNumber1": input.referenceNumber,
        "lblFrom1": kony.i18n.getLocalizedString("i18n.StopCheckPayments.from"),
        "lblPayee1": kony.i18n.getLocalizedString("i18n.StopCheckPayments.Payee"),
        "lblDate1": kony.i18n.getLocalizedString("i18n.StopCheckPayments.Date"),
        "lblAmount1": kony.i18n.getLocalizedString("i18n.StopCheckPayments.Amount($)"),
        "lblNotes1": kony.i18n.getLocalizedString("i18n.StopCheckPayments.Notes"),
        "lblType1": kony.i18n.getLocalizedString("i18n.StopCheckPayments.Types"),
        "lblReferenceNumber1": kony.i18n.getLocalizedString("i18n.PayAPerson.ReferenceNumber"),
        "flxIcon": {
          //"isVisible": combinedUser
          "isVisible": this.profileAccess === "both" ? true : false
        },
        "imgIcon": {
          "text": input.isBusinessAccount === "true" ? "r" : "s"
        },
        "template": "flxDetails"
      };
      //if(combinedUser){
      if (!isSingleCustomerProfile) {
        segData.rtxFrom1.left = (isMobile ? "8%" : (isTablet ? "3%" : "50%"));
      }
      data.push(segData);
      this.view.segConfirmDetails.widgetDataMap = dataMap;
      if (break_point == 640 || break_point == 1024) {
        for (var i = 0; i < data.length; i++) {
          data[i].template = "flxDisputeTransactionConfirmDetails";
        }
      }
      this.view.segConfirmDetails.setData(data);
      var self = this;
      this.view.flxConfirmDetailsSingleMultiple.setVisibility(true);
      this.view.flxStep2Buttons.setVisibility(true);
      this.view.btnCancel2.onClick = onCancelAction;
      this.view.btnModify2.onClick = function() {
        var viewModel = {
          data: input
        };
        self.showDisputeTransactionDetail(viewModel);
      };
      this.view.btnConfirm2.onClick = function() {
        var params = {
          transactionId: input.referenceNumber,
          disputeReason: input.reason,
          disputeDescription: input.description
        };
        self.loadStopPaymentsModule().presentationController.createDisputeTransaction(params, input);
      };
      self.AdjustScreen();
    },

    setFromAccountsdata: function() {
      this.view.segFromTransfer.widgetDataMap = {
        "flxFromAccountsList": "flxFromAccountsList",
        "flxAccountListItem": "flxAccountListItem",
        "lblAccountName": "lblAccountName",
        "flxAmount": "flxAmount",
        "flxSeparator": "flxSeparator",
        "lblSeparator": "lblSeparator",
        "lblTopSeparator": "lblTopSeparator",
        "lblAmount": "lblAmount",
        "lblCurSym": "lblCurSym",
        "flxIcons": "flxIcons",
        "imgIcon": "imgIcon",
        "imgBankIcon": "imgBankIcon",
        "lblAccType": "lblAccType",
        "flxTransfersFromListHeader": "flxTransfersFromListHeader",
        "lblTransactionHeader": "lblTransactionHeader",
        "imgDropDown": "imgDropDown",
        "flxDropDown": "flxDropDown",
        "lblTopSeperator" : "lblTopSeperator",
        "lblDefaultAccountIcon": "lblDefaultAccountIcon",
        "lblDefaultAccountName": "lblDefaultAccountName",
        "flxRowDefaultAccounts": "flxRowDefaultAccounts",
        "lblSeparator": "lblSeparator",
        "accountId": "accountId",
        "lblAccountRoleType":"lblAccountRoleType"
      };
    },
    setFromAccountsdataChequeBookRequest: function() {
      this.view.segTransferFrom.widgetDataMap = {
        "flxFromAccountsList": "flxFromAccountsList",
        "flxAccountListItem": "flxAccountListItem",
        "lblAccountName": "lblAccountName",
        "flxAmount": "flxAmount",
        "flxSeparator": "flxSeparator",
        "lblSeparator": "lblSeparator",
        "lblTopSeparator": "lblTopSeparator",
        "lblAmount": "lblAmount",
        "lblCurSym": "lblCurSym",
        "flxIcons": "flxIcons",
        "imgIcon": "imgIcon",
        "imgBankIcon": "imgBankIcon",
        "lblAccType": "lblAccType",
        "flxTransfersFromListHeader": "flxTransfersFromListHeader",
        "lblTransactionHeader": "lblTransactionHeader",
        "imgDropDown": "imgDropDown",
        "flxDropDown": "flxDropDown",
        "lblTopSeperator" : "lblTopSeperator",
        "lblDefaultAccountIcon": "lblDefaultAccountIcon",
        "lblDefaultAccountName": "lblDefaultAccountName",
        "flxRowDefaultAccounts": "flxRowDefaultAccounts",
        "lblSeparator": "lblSeparator",
        "accountId": "accountId",
        "lblAccountRoleType":"lblAccountRoleType"
      };
    },
    /**
         * showStopChecksForm : Method to show stop cheks form view
         * @param {object} formDataVieModel - form prepopulated view model
         */
    showStopChecksForm: function(formDataVieModel) {
      var scopeObj = this;
      Disputeflag = 0;
      scopeObj.view.flxIconSelect.setVisibility(false);
      scopeObj.view.lblAccountSelect.setVisibility(false);
      scopeObj.view.lblFromAmountSelect.setVisibility(false);
      scopeObj.view.lblTypeSelect.text = kony.i18n.getLocalizedString("i18n.StopcheckPayments.SelectType") || "";
      scopeObj.stopCheckRequestData = {};
      scopeObj.setBreadcrumb([{
        label: kony.i18n.getLocalizedString("i18n.topmenu.accounts"),
        toolTip: kony.i18n.getLocalizedString("i18n.topmenu.accounts")
      },
                              {
                                label: kony.i18n.getLocalizedString("i18n.StopcheckPayments.STOPCHECKPAYMENTS"),
                                toolTip: kony.i18n.getLocalizedString("i18n.StopcheckPayments.STOPCHECKPAYMENTS")
                              },
                             ]);
      //if (applicationManager.getConfigurationManager().isCombinedUser === "true") {
      //             if (applicationManager.getUserPreferencesManager().isSingleCustomerProfile === false) {
      scopeObj.view.segFromTransfer.onRowClick = this.segFromAccountRowClick.bind(this);
      scopeObj.view.flxFromDropdown.setVisibility(true);
      scopeObj.view.txtTransferFrom.setVisibility(true);
      scopeObj.view.lbxSelectFrom.setVisibility(false);
      scopeObj.view.txtTransferFrom.text = "";
      scopeObj.setFromAccountsdata();
      scopeObj.view.flxFromDropdown.onClick = function() {
        if (scopeObj.view.txtTransferFrom.isVisible === false) {
          scopeObj.view.txtTransferFrom.setVisibility(true);
          scopeObj.view.txtTransferFrom.setFocus();
          scopeObj.view.lblAccountSelect.setVisibility(false);
          scopeObj.view.flxIconSelect.setVisibility(false);
          scopeObj.view.lblFromAmountSelect.setVisibility(false);
          scopeObj.view.flxFilterFromCancel.setVisibility(true);
          scopeObj.view.flxSegmentFrom.setVisibility(true);
        }
      };
      scopeObj.view.txtTransferFrom.onTouchStart = function() {
        scopeObj.view.flxIconSelect.setVisibility(false);
        scopeObj.view.lblAccountSelect.setVisibility(false);
        scopeObj.view.flxSegmentFrom.setVisibility(true);
        scopeObj.view.segFromTransfer.setVisibility(true);
        scopeObj.view.forceLayout();
      };
      scopeObj.view.flxFilterFromCancel.onClick = function() {
        scopeObj.view.txtTransferFrom.text = "";
        scopeObj.view.flxFilterFromCancel.setVisibility(false);
        scopeObj.view.flxSegmentFrom.setVisibility(true);
      };

      //             }
      if (formDataVieModel.showStopPaymentServiceFeesAndValidity) {
        scopeObj.view.lblThisServices.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.ServiveChargeableNew") || "";
        scopeObj.view.lblThisServices.setVisibility(true);
      } else {
        scopeObj.view.lblThisServices.setVisibility(false);
      }
      scopeObj.view.flxSingleMultiplechecksWrapper.setVisibility(true);
      scopeObj.view.flxSeriesOfChecksWrapper.setVisibility(false);
      scopeObj.view.flxAccounts.setVisibility(false);
      scopeObj.view.lblChequeBookRequests.setVisibility(true);
      scopeObj.view.lblChequeBookRequests.text = kony.i18n.getLocalizedString("i18n.StopcheckPayments.STOPCHECKPAYMENTS");
      if (kony.application.getCurrentBreakpoint() === 640) {
        scopeObj.view.customheadernew.lblHeaderMobile.text = kony.i18n.getLocalizedString("i18n.StopcheckPayments.STOPCHECKPAYMENTS");
        scopeObj.view.btnNew.setVisibility(false);
      }
      scopeObj.view.calDateOfIssue.dateformat = applicationManager.getFormatUtilManager().getDateFormat();
      // var today = CommonUtilities.getServerDateObject();
      // scopeObj.view.calDateOfIssue.dateComponents = [today.getDate(), today.getMonth()+1, today.getFullYear()];
      scopeObj.view.calDateOfIssue.dateComponents = null;
      scopeObj.showStopCheckPaymentsSeriesMultiple();
      scopeObj.setStopChecksFormData(formDataVieModel);
      scopeObj.view.btnProceedStopCheck.onClick = scopeObj.onStopCheckFormConfirmHandler.bind(scopeObj);
      formDataVieModel.accountID === null ? scopeObj.onStopCheckCancel = formDataVieModel.onCancel : scopeObj.onStopCheckCancel = scopeObj.goToDashboard;
      scopeObj.view.btnCancelStopCheck.onClick = scopeObj.onStopCheckCancel;
      scopeObj.view.btnNew.onClick = scopeObj.btnViewDisputedTransactionsClickHandler.bind(scopeObj);
      scopeObj.view.btnNew.setVisibility(false);
      scopeObj.AdjustScreen();
    },
	goToDashboard: function(){
      var navMan=applicationManager.getNavigationManager();
      navMan.navigateTo({"appName": "HomepageMA","friendlyName": "frmDashboard"});
    },
    segFromAccountRowClick: function() {
      var scopeObj = this;
      var segData = scopeObj.view.segFromTransfer.selectedRowItems[0];
      scopeObj.view.txtTransferFromAccount.text = segData.lblAccountName||segData.lblDefaultAccountName.text;
      scopeObj.view.txtTransferFrom.setVisibility(false);
      scopeObj.view.flxFilterFromCancel.setVisibility(false);
      scopeObj.view.lblAccountSelect.text = segData.lblAccountName||segData.lblDefaultAccountName.text;
      var res = (scopeObj.view.lblAccountSelect.text).split(".");
      scopeObj.view.lblAccountSelect.text = (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) ? CommonUtilities.truncateStringWithGivenLength( res[0], 25)+"..."+res[res.length-1]:scopeObj.view.lblAccountSelect.text;
      scopeObj.view.lblAccountSelect.setVisibility(true);
      scopeObj.view.flxIconSelect.setVisibility(this.profileAccess==="both");
      scopeObj.view.imgIconSelect.text = segData.imgIcon||segData.lblDefaultAccountIcon.text;
      scopeObj.view.lblFromAmountSelect.setVisibility(true);
      scopeObj.view.lblFromAmountSelect.text = segData.lblAmount;
      scopeObj.view.flxSegmentFrom.setVisibility(false);
      scopeObj.view.lblCurrencySymbol.text = segData.currencySymbol;
      LandingSelectedAccount = segData.accountID;
    },

    segTransferFromAccountRowClick: function() {
      var scopeObj = this;
      var segData = scopeObj.view.segTransferFrom.selectedRowItems[0];
      scopeObj.view.txtTransferFromAccount.text = segData.processedName||segData.lblDefaultAccountName.text;
      scopeObj.view.txtTransferFromAccount.setVisibility(false);
      scopeObj.view.flxFilterFromCancelAccount.setVisibility(false);
      scopeObj.view.lblAccountSelectAccount.text = segData.processedName||segData.lblDefaultAccountName.text;
      scopeObj.view.lblAccountSelectAccount.setVisibility(true);
      scopeObj.view.flxIconSelectAccount.setVisibility(this.profileAccess==="both");
      scopeObj.view.imgIconSelectAccount.text = segData.imgIcon||segData.lblDefaultAccountIcon.text;
      scopeObj.view.lblFromAmountSelectAccount.setVisibility(true);
      scopeObj.view.lblFromAmountSelectAccount.text = segData.lblAmount;
      scopeObj.view.flxFromLoadingContainerAccount.setVisibility(false);
      scopeObj.view.flxFromSegment.setVisibility(false);
      LandingSelectedAccount = segData.accountID;
    },

    showRequestChequeBookForm: function(ChequeBookViewModel) {
      var scopeObj = this;
      var accountList = scopeObj.loadStopPaymentsModule().presentationController.getAccounts();
      scopeObj.view.lblAccountSelectAccount.setVisibility(true);
      for (var i=0;i< accountList.length;i++) {
        var acc = accountList[i];
        if (!kony.sdk.isNullOrUndefined(acc.accountID) && acc.accountID == ChequeBookViewModel.accountID) {
          scopeObj.view.lblFromAmountSelectAccount.setVisibility(true);
          scopeObj.view.flxIconSelectAccount.setVisibility(this.profileAccess === "both");
          scopeObj.view.lblFromAmountSelectAccount.text = (acc.type !== "CreditCard") ? CommonUtilities.formatCurrencyWithCommas(acc.availableBalance, false, acc.currencyCode) : CommonUtilities.formatCurrencyWithCommas(acc.availableCredit, false, acc.currencyCode);
          scopeObj.view.imgIconSelectAccount.text = acc.isBusinessAccount === "true" ? "r" : "s";
          break;
        }
      }         
      scopeObj.view.flxFromLoadingContainerAccount.setVisibility(false);
      scopeObj.view.txtTransferFromAccount.setVisibility(false);
      scopeObj.hideAll();
      scopeObj.view.flxAccounts.setVisibility(false);
      scopeObj.view.lblChequeBookRequests.setVisibility(true);
      scopeObj.view.flxChequeBookError.setVisibility(false);
      scopeObj.view.flxRequestChequeBookDetail.isVisible = true;
      scopeObj.view.flxRequestChequeBook.setVisibility(true);
      scopeObj.view.flxChequeBookRequests.setVisibility(true);
      scopeObj.view.segTransferFrom.onRowClick = this.segTransferFromAccountRowClick.bind(this);
      scopeObj.view.flxFromDropdownAccount.onClick = function() {
        if (scopeObj.view.txtTransferFromAccount.isVisible === false) {
          scopeObj.view.lblFromAmountSelectAccount.setVisibility(false);
          scopeObj.view.lblAccountSelectAccount.setVisibility(false);
          scopeObj.view.txtTransferFromAccount.setVisibility(true);
          scopeObj.view.txtTransferFromAccount.setFocus();
          scopeObj.view.flxFilterFromCancelAccount.setVisibility(true);
          var widgetFromData = scopeObj.isSingleCustomerProfile ? scopeObj.getDataWithAccountTypeSections(accountList) : scopeObj.getDataWithSections(accountList);
          if (widgetFromData) {
            scopeObj.setFromAccountsdataChequeBookRequest();
            scopeObj.view.segTransferFrom.rowTemplate = "flxRowDefaultAccounts";
            scopeObj.view.segTransferFrom.setData(widgetFromData);
          }
          scopeObj.view.flxFromSegment.setVisibility(true);
        }
      };
      scopeObj.view.txtTransferFromAccount.onTouchStart = function() {
        var widgetFromData = scopeObj.isSingleCustomerProfile ? scopeObj.getDataWithAccountTypeSections(accountList) : scopeObj.getDataWithSections(accountList);
        if (widgetFromData) {
          scopeObj.setFromAccountsdataChequeBookRequest();
          scopeObj.view.segTransferFrom.rowTemplate = "flxRowDefaultAccounts";
          scopeObj.view.segTransferFrom.setData(widgetFromData);
          scopeObj.view.flxFromLoadingContainerAccount.setVisibility(false);
          scopeObj.view.flxNoFromResults.setVisibility(false);
        }
        scopeObj.view.flxFromSegment.setVisibility(true);
        scopeObj.view.segTransferFrom.setVisibility(true);
        scopeObj.view.forceLayout();
      };
      scopeObj.view.flxFilterFromCancelAccount.onClick = function() {
        scopeObj.view.txtTransferFromAccount.text = "";
        scopeObj.view.flxFilterFromCancelAccount.setVisibility(false);
        scopeObj.view.flxFromSegment.setVisibility(true);
      };
      scopeObj.view.btnStopChequeRequests.setVisibility(hasStopPaymentFeat);
      scopeObj.view.btnViewMyChequesRight.setVisibility(hasChequeRequestFeat);
      scopeObj.view.btnViewChequeBookRequestRight.setVisibility(hasViewChequesFeat);

      scopeObj.view.lblChequeBookRequests.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.ChequeBookRequest");
      if (kony.application.getCurrentBreakpoint() === 640) {
        scopeObj.view.customheadernew.lblHeaderMobile.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.ChequeBookRequest");
        scopeObj.view.btnNew.setVisibility(false);
      }
      scopeObj.view.lblStopPayments.setVisibility(false);
      scopeObj.setRequestChequeBookFormData(ChequeBookViewModel.accountID);
      scopeObj.onChequeBookCancel = ChequeBookViewModel.onCancel || null;
      scopeObj.view.btnCancel1.onClick = scopeObj.onChequeBookCancel;
      scopeObj.ChequeBookActions(this);
      scopeObj.view.forceLayout();
      scopeObj.AdjustScreen();
    },
    ChequeDetails: function() {
      FormControllerUtility.enableButton(this.view.btnContinue);
      this.view.flxChequeBookError.setVisibility(false);
      var accountId = this.view.lbxFrom.selectedKeyValue[0];
      this.setRequestChequeBookFormData(accountId);
    },
    ChequeBookActions: function() {
      FormControllerUtility.enableButton(this.view.btnContinue);
      this.view.btnContinue.onClick = this.showChequeBookRequestConfirmPage.bind(this);
      this.view.imgRadioBtn12.onTouchEnd = this.MailAddress.bind(this);
      this.view.imgMailingAddress.onTouchEnd = this.MailAddress.bind(this);
      this.view.imgRadioBtn21.onTouchEnd = this.SelfPickUp.bind(this);
      this.view.imgRadioBtnVertical2.onTouchEnd = this.SelfPickUp.bind(this);
      this.view.lbxFrom.onSelection = this.ChequeDetails.bind(this);

    },
    MailAddress: function() {
      this.view.imgRadioBtn12.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
      this.view.imgRadioBtn12.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
      this.view.imgRadioBtn21.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
      this.view.imgRadioBtn21.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
      this.view.imgMailingAddress.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
      this.view.imgMailingAddress.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
      this.view.lblMailingAddressVertical.skin = "slLabel0d8a72616b3cc47";
      this.view.lblSelfPickupVertical.skin = "sknlbla0a0a015px";
      this.view.imgRadioBtnVertical2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
      this.view.imgRadioBtnVertical2.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
      this.view.flxCheckNumerDate1.setVisibility(true);
      this.view.flxNotification.setVisibility(false);
    },
    SelfPickUp: function() {
      this.view.imgRadioBtn12.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
      this.view.imgRadioBtn12.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
      this.view.imgRadioBtn21.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
      this.view.imgRadioBtn21.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
      this.view.imgMailingAddress.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
      this.view.imgMailingAddress.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
      this.view.lblMailingAddressVertical.skin = "sknlbla0a0a015px";
      this.view.lblSelfPickupVertical.skin = "slLabel0d8a72616b3cc47";
      this.view.imgRadioBtnVertical2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
      this.view.imgRadioBtnVertical2.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
      this.view.flxCheckNumerDate1.setVisibility(false);
      this.view.flxNotification.setVisibility(true);
    },
    fetchFee: function(StopChequeType) {
      var scopeObj = this;
      if (StopChequeType === "Single") {
        if (scopeObj.view.calDateOfIssue.dateComponents !== null) {
          var str1 = scopeObj.view.calDateOfIssue.dateComponents[1].toString();
          var formatmonth = str1.padStart(2, '0');
          var str2 = scopeObj.view.calDateOfIssue.dateComponents[0].toString();
          var formatDate = str2.padStart(2, '0');
          scopeObj.finalDate = scopeObj.view.calDateOfIssue.dateComponents[2].toString() + formatmonth + formatDate;
        } else {
          scopeObj.finalDate = "";
        }
        var chequeAmount = CommonUtilities.deFormatAmount(scopeObj.view.tbxAmount.text);
        var requestModel = {
          fromAccountNumber: LandingSelectedAccount,
          payeeName: scopeObj.view.tbxPayee.text.toString().trim(),
          checkNumber1: scopeObj.view.tbxCheckNumber.text.trim(),
          amount: chequeAmount,
          checkDateOfIssue: scopeObj.finalDate,
          checkReason: scopeObj.view.lbxSelectReasonNew.selectedKeyValue[0],
          transactionsNotes: scopeObj.view.tbxDescription.text,
          validate: "true"
        };
      } else {
        var requestModel = {
          fromAccountNumber: LandingSelectedAccount,
          payeeName: scopeObj.view.tbxPayee.text.toString().trim(),
          checkNumber1: scopeObj.view.tbxFirstCheckNo.text,
          checkNumber2: scopeObj.view.tbxCheckNo.text,
          checkReason: scopeObj.view.lbxSelectReasonNew.selectedKeyValue[0],
          transactionsNotes: scopeObj.view.tbxDescription.text,
          validate: "true"
        };
      }
      applicationManager.getPresentationUtility().showLoadingScreen();
      scopeObj.loadStopPaymentsModule().presentationController.validatefetchFee(requestModel);
    },

    /**
         * onStopCheckFormConfirmHandler : Stop check request confirm button handler
         */
    onStopCheckFormConfirmHandler: function() {
      var scopeObj = this;
      var hasInvaidInputs = true;
      scopeObj.view.btnNew.setVisibility(false);
      scopeObj.setValidationErrorMessageState(false);
      if (scopeObj.view.lblRadioBtnSingle.text === "M") {
        if (scopeObj.isValidStopCheckForm(OLBConstants.CHECK_REQUEST_TYPES.SINGLE)) {
          hasInvaidInputs = false;
          scopeObj.fetchFee(OLBConstants.CHECK_REQUEST_TYPES.SINGLE);
          scopeObj.setSingleOrMultipleCheckRequestConfirmPage(OLBConstants.CHECK_REQUEST_TYPES.SINGLE);
        }
      } else {
        if (scopeObj.isValidStopCheckForm(OLBConstants.CHECK_REQUEST_TYPES.SERIES)) {
          hasInvaidInputs = false;
          scopeObj.fetchFee(OLBConstants.CHECK_REQUEST_TYPES.SERIES);
          scopeObj.setSeriesCheckRequestConfirmPage(OLBConstants.CHECK_REQUEST_TYPES.SERIES);
        }
      }
      if (hasInvaidInputs) {
        scopeObj.setValidationErrorMessageState(true);
      }
      scopeObj.AdjustScreen();
    },
    /**
         * setValidationErrorMessageState : Set Stop checks Error message
         * @param {boolean} visible show or hide flag
         * @param {string} i18nKey, i18n key
         */
    setValidationErrorMessageState: function(visible, i18nKey) {
      var scopeObj = this;
      //  scopeObj.view.flxDisputedTransactionDetails.height = "750px";
      if (visible) {
        scopeObj.view.lblWarningSeriesMultiple.text = kony.i18n.getLocalizedString(i18nKey || scopeObj.validationErrorMsgI18nKey || "i18n.StopPayments.errormessages.InvalidDetails");
        //  scopeObj.view.flxDisputedTransactionDetails.height = "810px";
      }
      scopeObj.view.lblWarningSeriesMultiple.setVisibility(visible);
      scopeObj.AdjustScreen();
    },
    /**
         * isValidStopCheckForm : Stop check request form vaidation handler
         * @param {string} requestType, check request type single/series
         * @return {boolean} isvalid form or not.
         */
    isValidStopCheckForm: function(requestType) {
      var scopeObj = this;
      scopeObj.validationErrorMsgI18nKey = "";
      var isValidCheckNumber = function(checkumber) {
        var checkNumberReg = /^\d+$/;
        return checkNumberReg.test(checkumber);
      };
      switch (requestType) {
        case OLBConstants.CHECK_REQUEST_TYPES.SINGLE:
          var checkNumber1 = scopeObj.view.tbxCheckNumber.text;
          if (!isValidCheckNumber(checkNumber1) && !CommonUtilities.isEmptyString(checkNumber1)) {
            scopeObj.validationErrorMsgI18nKey = "i18n.StopPayments.errormessages.InvalidCheckNumber";
            scopeObj.view.tbxCheckNumber.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            return false;
          }
          break;
        case OLBConstants.CHECK_REQUEST_TYPES.SERIES:
          var serCheckNumber1 = scopeObj.view.tbxFirstCheckNo.text;
          var sercheckNumber2 = scopeObj.view.tbxCheckNo.text;
          if (!isValidCheckNumber(serCheckNumber1) || !isValidCheckNumber(sercheckNumber2)) {
            scopeObj.validationErrorMsgI18nKey = "i18n.StopPayments.errormessages.InvalidCheckNumber";
            scopeObj.view.tbxFirstCheckNo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            scopeObj.view.tbxCheckNo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            scopeObj.view.tbxLastCheckNo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            return false;
          }
          var noOfChecks = scopeObj.getSeriesCheckNumbersCount();
          if (noOfChecks <= 1 || noOfChecks > OLBConstants.MAX_CHECKS_COUNT) {
            scopeObj.validationErrorMsgI18nKey = "i18n.StopPayments.errormessages.InvalidSeriesCheckNumbers";
            scopeObj.view.tbxFirstCheckNo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            scopeObj.view.tbxCheckNo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            scopeObj.view.tbxLastCheckNo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
            return false;
          }
          break;
        default:
          CommonUtilities.ErrorHandler.onError("Invalid Check request type : " + requestType);
          return false;
      }
      scopeObj.AdjustScreen();
      return true;
    },
    /**
         * showStopCheckRequestCofirmPage : Method to show Stop check single request confirmation form.
         */
    showStopCheckRequestCofirmPage: function() {
            var scopeObj = this;
            //var combinedUser = (applicationManager.getConfigurationManager().isCombinedUser === "true");
            var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            scopeObj.hideAll();
            scopeObj.view.flxSinglePayConfirm.setVisibility(true);
            //scopeObj.view.flxSinglePayConfirm.height= "preferred";
            // scopeObj.view.flxSinglePayConfirm.skin= "slfBoxffffffB1R5";
            scopeObj.view.flxMyRequestsTabs.setVisibility(false);
            scopeObj.view.flxTopHeader.setVisibility(true);
            scopeObj.view.lblHeader.text = kony.i18n.getLocalizedString("i18n.StopPayments.confirmStopCheckPayment");
            scopeObj.view.flxDownloadACK.setVisibility(false);
            scopeObj.view.flxSuccessMessageStopCheck.setVisibility(false);
            scopeObj.view.customheadernew.lblHeaderMobile.text = scopeObj.view.lblHeader.text;
            var confirmPage = scopeObj.view.ConfirmPage;
            confirmPage.clipBounds = false;
            confirmPage.flxChequeBookConfirmHeader.lblHeading.text = kony.i18n.getLocalizedString("i18n.StopPayments.stopCheckPaymentDetails");
            confirmPage.flxNewField1.setVisibility(true);
            confirmPage.flxNewField2.setVisibility(true);
            confirmPage.lblAccount.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.from");
            //scopeObj.stopCheckRequestData.fromAccountNumber = combinedUser ? scopeObj.view.segFromTransfer.selectedRowItems[0].accountID : scopeObj.view.lbxSelectFrom.selectedKeyValue[0];
			if (scopeObj.view.segFromTransfer.selectedRowItems[0]){
				scopeObj.stopCheckRequestData.fromAccountNumber = scopeObj.view.segFromTransfer.selectedRowItems[0].accountID;
			} else {
				scopeObj.stopCheckRequestData.fromAccountNumber = LandingSelectedAccount;
			}			
			// scopeObj.view.segFromTransfer.selectedRowItems[0].accountID;
            //confirmPage.lblAccountValue.text = combinedUser ? scopeObj.view.segFromTransfer.selectedRowItems[0].lblAccountName :scopeObj.view.lbxSelectFrom.selectedKeyValue[1];
            //confirmPage.lblAccountValue.text = !isSingleCustomerProfile ? scopeObj.view.segFromTransfer.selectedRowItems[0].lblAccountName : scopeObj.view.lbxSelectFrom.selectedKeyValue[1];
			
			if (scopeObj.view.segFromTransfer.selectedRowItems[0]){
            confirmPage.lblAccountValue.text = scopeObj.view.segFromTransfer.selectedRowItems[0].lblAccountName || scopeObj.view.segFromTransfer.selectedRowItems[0].lblDefaultAccountName.text;
			}else{
				confirmPage.lblAccountValue.text = LandingSelectedAccountName;
			}
            //confirmPage.flxIcon.isVisible = combinedUser ? true :false;
            // confirmPage.flxIcon.isVisible = this.profileAccess === "both" ? true : false;
            //confirmPage.imgIcon.text = combinedUser ? scopeObj.view.segFromTransfer.selectedRowItems[0].imgIcon : "r";
			if (scopeObj.view.segFromTransfer.selectedRowItems[0]){
            confirmPage.imgIcon.text = this.profileAccess === "both" ? scopeObj.view.segFromTransfer.selectedRowItems[0].imgIcon : "r";
			}else{
				confirmPage.imgIcon.text = "r";
			}
            //confirmPage.lblAccountValue.left = combinedUser ? "32%" :"30%";
            //confirmPage.lblAccountValue.left = !isSingleCustomerProfile ? "32%" : "30%";
            confirmPage.lblChequeBooks.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.Payee");
            scopeObj.stopCheckRequestData.payeeName = scopeObj.view.tbxPayee.text.toString().trim();
            confirmPage.lblChequeBooksValue.text = scopeObj.stopCheckRequestData.payeeName;
            confirmPage.lblFee.text = kony.i18n.getLocalizedString("i18n.StopcheckPayments.CheckNumber");
            confirmPage.lblDeliveryType.text = (kony.i18n.getLocalizedString("i18n.StopCheckPayments.Amount($)")).replace('$', scopeObj.view.lblCurrencySymbol.text);
            confirmPage.lblAddress.text = kony.i18n.getLocalizedString("i18n.chequeBookReq.fee");
            confirmPage.lblNotes.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.Date");
            confirmPage.lblNewField1.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.Reason");
            confirmPage.lblNewField2.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.Notes");
            if (scopeObj.RequestType === "Series") {
                TypeofStopCheque = "Series";
                scopeObj.view.ConfirmPage.flxDeliveryType.setVisibility(false);
                scopeObj.view.ConfirmPage.flxNotes.setVisibility(false);
                confirmPage.lblFeeValue.text = scopeObj.getSeriesCheckNumber();
                confirmPage.lblNewField2Value.text = scopeObj.view.tbxDescription.text;
                confirmPage.lblNewField1Value.text = scopeObj.view.lstBoxSelectReasonForDispute.selectedKeyValue[1];
            } else {
                TypeofStopCheque = "Single";
                confirmPage.lblFeeValue.text = scopeObj.view.tbxCheckNumber.text;
                confirmPage.lblDeliveryTypeValue.text = scopeObj.view.tbxAmount.text;
                confirmPage.lblNewField2Value.text = scopeObj.view.tbxDescrip.text;
                confirmPage.lblNotesValue.text = (scopeObj.view.calDateOfIssue.formattedDate) ? scopeObj.view.calDateOfIssue.formattedDate : "";
                confirmPage.lblNewField1Value.text = scopeObj.view.lbxSelectReasonNew.selectedKeyValue[1];
            }
            confirmPage.Buttons.btnModify.onClick = scopeObj.onStopCheckModifyClickHandler.bind(scopeObj);
            confirmPage.Buttons.btnCancel.onClick = this.showCancelStopRequestUI.bind(scopeObj.onStopCheckCancel || scopeObj.onStopCheckModifyClickHandler.bind(scopeObj));
            applicationManager.getPresentationUtility().dismissLoadingScreen();
            scopeObj.view.flxHeader.setFocus(true);
            scopeObj.AdjustScreen();
    },
    // Passing the data from Cheque book request to next page 
    showChequeBookRequestConfirmPage: function() {
      var scopeObj = this;
      scopeObj.view.flxLoading.setVisibility(true);
      scopeObj.view.lblChequeBookRequests.setVisibility(false);
      scopeObj.loadStopPaymentsModule().presentationController.validateandfetchfee();
      scopeObj.view.flxRequestChequeBookDetail.setVisibility(false);
      scopeObj.view.flxConfirmDetailsSingleMultiple.setVisibility(false);
      scopeObj.view.ConfirmPage.skin = "slfBoxffffffB1R5";
      scopeObj.view.ConfirmPage.flxMainConfirmPage.skin = "slfBoxffffffB1R5";
      scopeObj.view.lblStopPayments.setVisibility(false);
      // this.view.lblBillPayAcknowledgement.setVisibility(true);
      scopeObj.view.flxTopHeader.setVisibility(true);
      scopeObj.view.lblHeader.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.confirmChequeBookRequest");
      scopeObj.view.customheadernew.lblHeaderMobile.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.ChequeBookRequest");
      //scopeObj.view.lblHeader.setVisibility(true);
      scopeObj.view.ConfirmPage.flxChequeBookConfirmHeader.lblHeading.text = kony.i18n.getLocalizedString("i18n.chequeBookReq.chequeBookRequestDetails");
      scopeObj.view.flxSinglePayConfirm.setVisibility(true);
      scopeObj.view.ConfirmPage.flxNewField1.setVisibility(false);
      scopeObj.view.ConfirmPage.flxNewField2.setVisibility(false);
      scopeObj.view.ConfirmPage.lblAccount.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.account");
      scopeObj.view.ConfirmPage.lblChequeBooks.text = kony.i18n.getLocalizedString("i18n.chequeBookReq.chequeBooks");
      scopeObj.view.ConfirmPage.lblFee.text = kony.i18n.getLocalizedString("i18n.chequeBookReq.fee");
      scopeObj.view.ConfirmPage.lblDeliveryType.text = kony.i18n.getLocalizedString("i18n.chequeBookReq.deliveryType");

      scopeObj.view.ConfirmPage.lblAddress.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.Address");
      scopeObj.view.ConfirmPage.lblNotes.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.Notes");
      if (kony.application.getCurrentBreakpoint() !== 640) {
        if (scopeObj.view.imgRadioBtn12.text === "M") {
          scopeObj.view.ConfirmPage.lblAddressValue.text = scopeObj.view.lblAddressDetails.text;
          scopeObj.view.ConfirmPage.lblDeliveryTypeValue.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.mailingaddress");
        }
        if (scopeObj.view.imgRadioBtn21.text === "M") {
          scopeObj.view.ConfirmPage.lblAddressValue.text = "";
          scopeObj.view.ConfirmPage.lblDeliveryTypeValue.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.selfpickup");
        }
      } else {
        if (scopeObj.view.imgMailingAddress.text === "M") {
          scopeObj.view.ConfirmPage.lblAddressValue.text = scopeObj.view.lblAddressDetails.text;
          scopeObj.view.ConfirmPage.lblDeliveryTypeValue.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.mailingaddress");
        }
        if (scopeObj.view.imgRadioBtnVertical2.text === "M") {
          scopeObj.view.ConfirmPage.lblAddressValue.text = "";
          scopeObj.view.ConfirmPage.lblDeliveryTypeValue.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.selfpickup");
        }
      }
      scopeObj.view.ConfirmPage.lblAccountValue.text = scopeObj.view.lblAccountSelectAccount.text;
      scopeObj.view.ConfirmPage.lblChequeBooksValue.text = scopeObj.view.lbxChequeBookLeaves.selectedKeyValue[1] + " Books (" + this.view.lblTotalChequeNumber.text + " " + kony.i18n.getLocalizedString("i18n.ChequeBookRequest.Leafs");


      scopeObj.Notes = scopeObj.view.tbxOptional.text;
      scopeObj.view.ConfirmPage.lblNotesValue.text = (scopeObj.view.tbxOptional.text) ? scopeObj.view.tbxOptional.text : "";
      scopeObj.view.ConfirmPage.Buttons.btnModify.onClick = scopeObj.onChequeBookModifyClickHandler.bind(scopeObj);
      scopeObj.view.ConfirmPage.Buttons.btnCancel.onClick = scopeObj.showCancelChequeBookRequestUI.bind(scopeObj.onChequeBookCancel || scopeObj.onChequeBookModifyClickHandler.bind(this));
      scopeObj.view.ConfirmPage.Buttons.btnConfirm.onClick = scopeObj.createChequeBookRequest;
      scopeObj.AdjustScreen();

    },
    createChequeBookRequest: function() {
      this.view.flxLoading.setVisibility(true);
      var data = {
       // "accountID":this.view.ConfirmPage.lblAccountValue.text.replace(/^\D+/g, ""),
        "accountID":this.savedSelectedAccount,
        "chequeIssueId":"",
        "validate":"",
        "fees":(this.view.ConfirmPage.lblFeeValue.text).substring(1),
        "note":this.view.ConfirmPage.lblNotesValue.text,
        "numberOfLeaves":this.view.lblTotalChequeNumber.text,
        "numberOfChequeBooks":this.view.lbxChequeBookLeaves.selectedKeyValue[1],
        "address":this.view.ConfirmPage.lblAddressValue.text,
        "deliveryType":this.view.ConfirmPage.lblDeliveryTypeValue.text
      }     
      this.loadStopPaymentsModule().presentationController.createChequeBookRequest(data,(this.view.tbxOptional.text) ? this.view.ConfirmPage.lblNotesValue.text : "");
    },
    onChequeBookModifyClickHandler: function() {
      this.view.lblStopPayments.setVisibility(false);
      this.view.lblChequeBookRequests.setVisibility(true);
      this.view.lblStopPayments.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.ChequeBookRequest");
      this.view.flxRequestChequeBookDetail.setVisibility(true);
      this.view.flxSinglePayConfirm.setVisibility(false);
      this.view.flxChequeBookRequests.setVisibility(true);
      this.AdjustScreen();
    },
    showChequeBookRequestAcknowledgement: function() {
      this.view.flxAcknowledgement.setVisibility(true);
      this.view.lblChequeBookRequests.setVisibility(false);
      this.view.lblStopPayments.setVisibility(false);
      this.view.flxSinglePayConfirm.setVisibility(false);
      this.view.flxConfirmDialog.setVisibility(false);
      //  this.view.lblBillPayAcknowledgement.setVisibility(true);
      this.view.customheadernew.lblHeaderMobile.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.ChequeBookRequest");
      this.view.lblBillPayAcknowledgement.text = kony.i18n.getLocalizedString("i18n.chequeBookReq.Acknowledgement");
      this.view.lblHeadingACK.text = kony.i18n.getLocalizedString("i18n.chequeBookReq.chequeBookRequestDetails");
      this.view.flxRequestChequeBookDetail.setVisibility(false);
      this.view.flxExtra1.setVisibility(false);
      this.view.flxExtra2.setVisibility(false);
      this.view.lblDeliveryTypeValue.text = this.view.ConfirmPage.lblDeliveryTypeValue.text;
      this.view.lblAccountValue.text = this.view.lblAccountSelectAccount.text;
      this.view.lblChequeBooksValue.text = this.view.lbxChequeBookLeaves.selectedKeyValue[1] + " Books (" + this.view.lblTotalChequeNumber.text + " " + kony.i18n.getLocalizedString("i18n.ChequeBookRequest.Leafs");
      this.view.lblFeeValue.text = this.view.ConfirmPage.lblFeeValue.text;
      //this.view.acknowledgmentMyRequests.lblTransactionMessage.text = kony.i18n.getLocalizedString("i18n.chequeBookReq.sucessfullyRaised");
      this.view.lblAddressValue.text = this.view.ConfirmPage.lblAddressValue.text;
      this.view.lblNotesValue.text = (this.view.tbxOptional.text) ? this.view.tbxOptional.text : "-";
      this.view.btnMakeTransfer.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.GoToAccountDetail");
      this.view.btnMakeTransfer.onClick = this.getbacktoaccountDetails;
      this.view.btnAddAnotherAccount.onClick = this.btnViewDisputedChecks;
      var isMobileDevice = ((kony.application.getCurrentBreakpoint() === 640) || orientationHandler.isMobile);
      var profileAccess = applicationManager.getUserPreferencesManager().profileAccess;
      var accounts = applicationManager.getConfigurationManager().userAccounts;
      var isBusinessAccount = true;

      if(profileAccess=="both" && this.checkBookOrderFromAccount != ""){

        for(var i=0;i<accounts.length;i++){
          if(!kony.sdk.isNullOrUndefined(accounts[i].accountID) && accounts[i].accountID==this.checkBookOrderFromAccount){
            if(accounts[i].isBusinessAccount != "true"){
              isBusinessAccount = false;
            }
            //this.view.flxAccountIcon.isVisible = true;
            this.view.imgIcon.text = isBusinessAccount == true ? "r" : "s";
            this.view.flxAccountIcon.left = "43.3%";
            this.view.lblAccountValue.left = "47.3%";
            this.view.forceLayout();
            break;
          }
        }
      }
      else{
        this.view.lblAccountValue.left = "43.3%";
        this.view.lblChequeBooksValue.left = "43.3%";
        this.view.lblFeeKey.width = "40%";
        this.view.lblFeeKey.height = "35dp";
        this.view.lblFeeValue.left = "43.3%";
        this.view.lblDeliveryTypeValue.left = "43.3%";
        this.view.lblAddressValue.left = "43.3%";
        this.view.lblNotesValue.left = "43.3%";              
        this.view.flxAccountIcon.isVisible = false;
      }
      if(isMobileDevice){
		this.view.lblAccountValue.width = "50%";
		this.view.lblAddressValue.width = "50%";
	  }

      this.checkBookOrderFromAccount = "";
      this.view.forceLayout();
      this.AdjustScreen();
    },
    getbacktoaccountDetails: function() {
      this.loadStopPaymentsModule().presentationController.backToAccountDetails();
    },
    /**
         * onStopCheckModifyClickHandler : Stop check request confim page Modify click handler.
         */
    onStopCheckModifyClickHandler: function() {
      var scopeObj = this;
      scopeObj.setBreadcrumb([{
        label: kony.i18n.getLocalizedString("i18n.topmenu.accounts"),
        toolTip: kony.i18n.getLocalizedString("i18n.topmenu.accounts")
      },
                              {
                                label: kony.i18n.getLocalizedString("i18n.StopcheckPayments.STOPCHECKPAYMENTS"),
                                toolTip: kony.i18n.getLocalizedString("i18n.StopcheckPayments.STOPCHECKPAYMENTS")
                              },
                             ]);
      scopeObj.showStopCheckPaymentsSeriesMultiple();
      scopeObj.view.flxSinglePayConfirm.setVisibility(false);
      scopeObj.view.flxTopHeader.setVisibility(false);
      scopeObj.view.flxPrintACK.setVisibility(false);
      scopeObj.view.flxDownloadACK.setVisibility(false);
      scopeObj.view.lblChequeBookRequests.setVisibility(true);
      scopeObj.view.flxSuccessMessageStopCheck.setVisibility(false);
      scopeObj.view.flxConfirmDetailsSingleMultiple.setVisibility(false);
      scopeObj.AdjustScreen();
    },
    /**
         * showStopCheckRequestCofirmPage : Method to set single or mutliple check request page
         */
    setSingleOrMultipleCheckRequestConfirmPage: function(ChequeRequestType) {
      var scopeObj = this;
      scopeObj.RequestType = ChequeRequestType;
      scopeObj.setBreadcrumb([{
        label: kony.i18n.getLocalizedString("i18n.topmenu.accounts"),
        toolTip: kony.i18n.getLocalizedString("i18n.topmenu.accounts")
      },
                              {
                                label: kony.i18n.getLocalizedString("i18n.StopPayments.confirmStopCheckPayment"),
                                toolTip: kony.i18n.getLocalizedString("i18n.StopPayments.confirmStopCheckPayment")
                              },
                             ]);
      //  scopeObj.showStopCheckRequestCofirmPage(ChequeRequestType);
      scopeObj.view.ConfirmPage.Buttons.btnConfirm.onClick = scopeObj.onSingleOrMultipeCheckRequestConfirmBtnClick.bind(scopeObj);
      scopeObj.setStopCheckSingleOrMutlipleTranSegment();
    },
    /**
         * setStopCheckSingleOrMutlipleTranSegment : Method to set single or mutliple check request transaction deatils in Stop payment confimatin
         */
    setStopCheckSingleOrMutlipleTranSegment: function() {
      var scopeObj = this;
      //var combinedUser = applicationManager.getConfigurationManager().isCombinedUser === "true";
      var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
      var break_point = kony.application.getCurrentBreakpoint();
      var dataMap = {
        "flxRecipientDetails1": "flxRecipientDetails1",
        "flxFrom1": "flxFrom1",
        "lblFrom1": "lblFrom1",
        "rtxFrom1": "rtxFrom1",
        "flxPayee1": "flxPayee1",
        "lblPayee1": "lblPayee1",
        "rtxPayee1": "rtxPayee1",
        "flxDate1": "flxDate1",
        "lblDate1": "lblDate1",
        "rtxDate1": "rtxDate1",
        "flxAmount1": "flxAmount1",
        "lblAmount1": "lblAmount1",
        "rtxAmount1": "rtxAmount1",
        "flxNotes1": "flxNotes1",
        "lblNotes1": "lblNotes1",
        "rtxNotes1": "rtxNotes1",
        "flxIcon": "flxIcon",
        "imgIcon": "imgIcon"
      };
      scopeObj.stopCheckRequestData.checkNumber1 = scopeObj.view.tbxCheckNumber.text;
      scopeObj.stopCheckRequestData.amount = CommonUtilities.deFormatAmount(scopeObj.view.tbxAmount.text);
      scopeObj.stopCheckRequestData.checkDateOfIssue = scopeObj.view.calDateOfIssue.formattedDate;
      scopeObj.stopCheckRequestData.checkReason = scopeObj.view.lbxSelectReasonNew.selectedKeyValue[1];
      scopeObj.stopCheckRequestData.checkReasonId = scopeObj.view.lbxSelectReasonNew.selectedKeyValue[0];
      scopeObj.stopCheckRequestData.description = scopeObj.view.tbxDescrip.text;
      var viewModel = [{
        "lblFrom1": kony.i18n.getLocalizedString("i18n.StopPayments.Checkno"),
        "rtxFrom1": scopeObj.stopCheckRequestData.checkNumber1,
        "lblPayee1": kony.i18n.getLocalizedString("i18n.StopCheckPayments.Amount($)"),
        "rtxPayee1": CommonUtilities.formatCurrencyWithCommas(scopeObj.stopCheckRequestData.amount, true),
        "lblDate1": kony.i18n.getLocalizedString("i18n.StopPayments.DateOfIssueWithColon"),
        "rtxDate1": scopeObj.stopCheckRequestData.checkDateOfIssue,
        "lblAmount1": kony.i18n.getLocalizedString("i18n.StopCheckPayments.Reason"),
        "rtxAmount1": scopeObj.view.lbxSelectReasonNew.selectedKeyValue[1],
        "lblNotes1": kony.i18n.getLocalizedString("i18n.StopCheckPayments.Description"),
        "rtxNotes1": {
          "bottom": "20dp",
          "text": scopeObj.stopCheckRequestData.description
        },
        "flxIcon": {
          //"isVisible":combinedUser
          "isVisible": this.profileAccess === "both" ? true : false
        },
        "imgIcon": {
          "text": "r"
        },
        "template": "flxDetails"
      }];
      scopeObj.view.segConfirmDetails.setVisibility(true);
      scopeObj.view.segConfirmDetails.widgetDataMap = dataMap;
      if (break_point == 640 || break_point == 1024) {
        for (var i = 0; i < viewModel.length; i++) {
          viewModel[i].template = "flxDisputeTransactionConfirmDetails";
        }
      }
      scopeObj.view.segConfirmDetails.setData(viewModel);
      scopeObj.view.forceLayout();
      scopeObj.AdjustScreen();
    },
    /**
         * onSingleOrMultipeCheckRequestConfirmBtnClick : Stop checks single/ multiple check confirmation page confirm button click handler
         */
    onSingleOrMultipeCheckRequestConfirmBtnClick: function() {
      var scopeObj = this;
      //       var str1 =scopeObj.view.calDateOfIssue.dateComponents[1].toString();
      //       var formatmonth =str1.padStart(2, '0');
      //       var str2 =scopeObj.view.calDateOfIssue.dateComponents[0].toString();
      //       var formatDate =str2.padStart(2, '0');      
      var requestModel = {
        transactionType: OLBConstants.TRANSACTION_TYPE.STOPCHECKPAYMENTREQUEST,
        fromAccountNumber: scopeObj.stopCheckRequestData.fromAccountNumber,
        payeeName: scopeObj.stopCheckRequestData.payeeName,
        checkNumber1: scopeObj.stopCheckRequestData.checkNumber1,
        amount: scopeObj.stopCheckRequestData.amount,
        checkDateOfIssue: scopeObj.finalDate,
        checkReason: scopeObj.stopCheckRequestData.checkReasonId,
        description: scopeObj.stopCheckRequestData.description
      };
      scopeObj.loadStopPaymentsModule().presentationController.stopChequeRequest(requestModel);
    },
    /**
         * onSeriesCheckRequestConfirmBtnClick : Stop checks series check confirmation page confirm button click handler
         */
    onSeriesCheckRequestConfirmBtnClick: function() {
      var scopeObj = this;
      var requestModel = {
        transactionType: OLBConstants.TRANSACTION_TYPE.STOPCHECKPAYMENTREQUEST,
        fromAccountNumber: scopeObj.stopCheckRequestData.fromAccountNumber,
        payeeName: scopeObj.stopCheckRequestData.payeeName,
        checkNumber1: scopeObj.stopCheckRequestData.checkNumber1,
        checkNumber2: scopeObj.stopCheckRequestData.checkNumber2,
        checkReason: scopeObj.stopCheckRequestData.checkReasonId,
        description: scopeObj.stopCheckRequestData.description
      };
      scopeObj.loadStopPaymentsModule().presentationController.stopChequeRequest(requestModel);
    },
    /**
         * setSeriesCheckRequestConfirmPage : Method to set series check request page
         */
    setSeriesCheckRequestConfirmPage: function(ChequeRequestType) {
      var scopeObj = this;
      scopeObj.RequestType = ChequeRequestType;
      scopeObj.setBreadcrumb([{
        label: kony.i18n.getLocalizedString("i18n.topmenu.accounts"),
        toolTip: kony.i18n.getLocalizedString("i18n.topmenu.accounts")
      },
                              {
                                label: kony.i18n.getLocalizedString("i18n.StopPayments.confirmStopCheckPayment"),
                                toolTip: kony.i18n.getLocalizedString("i18n.StopPayments.confirmStopCheckPayment")
                              },
                             ]);
      // scopeObj.showStopCheckRequestCofirmPage(ChequeRequestType);
      scopeObj.setStopCheckSeriesTranSegment();
      scopeObj.view.ConfirmPage.Buttons.btnConfirm.onClick = scopeObj.onSeriesCheckRequestConfirmBtnClick.bind(scopeObj);
    },
    /**
         * setStopCheckSeriesTranSegment : Method to set series check request transaction deatils in Stop payment confimatin
         */
    setStopCheckSeriesTranSegment: function() {
      var scopeObj = this;
      //var combinedUser = applicationManager.getConfigurationManager().isCombinedUser === "true";
      var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
      var break_point = kony.application.getCurrentBreakpoint();
      var dataMap = {
        "flxRecipientDetails1": "flxRecipientDetails1",
        "flxFrom1": "flxFrom1",
        "lblFrom1": "lblFrom1",
        "rtxFrom1": "rtxFrom1",
        "flxPayee1": "flxPayee1",
        "lblPayee1": "lblPayee1",
        "rtxPayee1": "rtxPayee1",
        "flxDate1": "flxDate1",
        "lblDate1": "lblDate1",
        "rtxDate1": "rtxDate1",
        "flxIcon": "flxIcon",
        "imgIcon": "imgIcon"
      };
      scopeObj.stopCheckRequestData.checkNumber1 = scopeObj.view.tbxFirstCheckNo.text;
      scopeObj.stopCheckRequestData.checkNumber2 = scopeObj.view.tbxCheckNo.text;
      scopeObj.stopCheckRequestData.checkReason = scopeObj.view.lstBoxSelectReasonForDispute.selectedKeyValue[1];
      scopeObj.stopCheckRequestData.checkReasonId = scopeObj.view.lstBoxSelectReasonForDispute.selectedKeyValue[0];
      scopeObj.stopCheckRequestData.description = scopeObj.view.tbxDescription.text;
      var viewModel = [{
        "lblFrom1": kony.i18n.getLocalizedString("i18n.StopPayments.Checkno"),
        "rtxFrom1": scopeObj.getSeriesCheckNumber() + "&nbsp;&nbsp;&nbsp;&nbsp;" + scopeObj.getSeriesCheckNumbersCount() + " " + kony.i18n.getLocalizedString("i18n.StopPayments.ChecksSelected"),
        "lblPayee1": kony.i18n.getLocalizedString("i18n.StopCheckPayments.Reason"),
        "rtxPayee1": scopeObj.stopCheckRequestData.checkReason,
        "lblDate1": kony.i18n.getLocalizedString("i18n.StopCheckPayments.Description"),
        "rtxDate1": {
          "bottom": "20dp",
          "text": scopeObj.stopCheckRequestData.description
        },
        "flxIcon": {
          //"isVisible":combinedUser
          "isVisible": this.profileAccess === "both" ? true : false
        },
        "imgIcon": {
          "text": "r"
        },
        "template": "flxDetails"
      }];
      scopeObj.view.segConfirmDetails.setVisibility(true);
      scopeObj.view.segConfirmDetails.widgetDataMap = dataMap;
      if (break_point == 640 || break_point == 1024) {
        for (var i = 0; i < viewModel.length; i++) {
          viewModel[i].template = "flxDisputeTransactionConfirmDetails";
        }
      }
      scopeObj.view.segConfirmDetails.setData(viewModel);
      scopeObj.view.forceLayout();
      scopeObj.AdjustScreen();
    },
    /**
         * getSeriesCheckNumber : Method to create and return series check number
         * @return {String} formatted check number for series
         */
    getSeriesCheckNumber: function() {
      return this.view.tbxFirstCheckNo.text + " " + OLBConstants.CHECK_SERIES_SEPARATOR + " " + this.view.tbxCheckNo.text;
    },
    /**
         * getSeriesCheckNumbersCount : Method to return total check number in series
         * @return {Number} total checks count
         */
    getSeriesCheckNumbersCount: function() {
      var firstCheckNumber = Number(this.view.tbxFirstCheckNo.text);
      var lastCheckNumber = Number(this.view.tbxCheckNo.text);
      var count = (lastCheckNumber - firstCheckNumber) + 1;
      if (isNaN(count)) {
        return -1;
      }
      return count;
    },
    /**
         * setStopChecksFormData : Method to set Stop checks form input values
         * @param {object} viewModel - form prepopulated view model
         */
    setStopChecksFormData: function(viewModel) {
      var scopeObj = this;
      scopeObj.setStopChecksFormAccountsDropdown({
        selectedValue: viewModel.accountID
      });
      scopeObj.savedSelectedAccount = viewModel.accountID;
      if (scopeObj.savedSelectedAccount != undefined && scopeObj.savedSelectedAccount != null) {
        this.ChangeShowAccountName();
      }
      scopeObj.view.tbxPayee.text = viewModel.payeeName || "";
      if (viewModel.isSeriesChecks) {
        scopeObj.onSeriesRadioButtonClick();
        scopeObj.setStopChecksFormSingleOrMultipleReasonsDropdown({
          selectedValue: viewModel.checkReason
        });
        scopeObj.savedSeriesCheckReason = viewModel.checkReason;
        scopeObj.setSeriesChecksFormValues(viewModel);
      } else {
        scopeObj.onSingleOrMultipleRadioButtonClick();
        scopeObj.setStopChecksFormSeriesChecksReasonsDropdown({
          selectedValue: viewModel.checkReason
        });
        scopeObj.savedSingleCheckReason = viewModel.checkReason;
        scopeObj.setSingleOrMultipleChecksFormValues(viewModel);
      }
    },
    /* In order to Change the Account In Landing Screen According to the Account of Account Detail*/
    ChangeShowAccountName: function() {
           var scopeObj = this;
            var accountsList = this.loadStopPaymentsModule().presentationController.getAccounts();
            for (var i = 0; i < accountsList.length; i++) {
                if (accountsList[i].accountID == scopeObj.savedSelectedAccount) {
					var acc = accountsList[i];
                    //accountsList[i].processedName = accountsList[i].accountName + "..." + accountsList[i].accountID;
                    accountsList[i].processedName = accountsList[i].accountName;
                    this.view.lblAccountTypes.text = accountsList[i].processedName;
                    this.view.lblAccountSelectAccount.text = accountsList[i].processedName;
					
					this.view.lblAccountSelect.text = accountsList[i].AccountName;
					this.view.lblAccountSelect.setVisibility(true);
					this.view.lblFromAmountSelect.text = (acc.type !== "CreditCard") ? CommonUtilities.formatCurrencyWithCommas(acc.availableBalance, false, acc.currencyCode) : CommonUtilities.formatCurrencyWithCommas(acc.availableCredit, false, acc.currencyCode); 
					this.view.lblFromAmountSelect.setVisibility(true);
					this.view.txtTransferFrom.setVisibility(false);
					LandingSelectedAccount = accountsList[i].accountID;
					LandingSelectedAccountName = accountsList[i].accountName;
                    var transObj = applicationManager.getTransactionsListManager();
                    transObj.setTransactionAttribute("fromAccountNumber", accountsList[i].accountID);
                    transObj.setTransactionAttribute("accountCurrencyCode", applicationManager.getFormatUtilManager().getCurrencySymbol(accountsList[i].currencyCode));
                }
            }
    },
    setRequestChequeBookFormData: function(ViewModel) {
      this.view.lblChequeBookRequests.setVisibility(true);
      this.view.lblStopPayments.setVisibility(false);
      this.view.flxAccounts.setVisibility(false);
      this.view.lblChequeBookRequests.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.ChequeBookRequest");
      this.view.tbxOptional.text = "";
      this.view.tbxOptional.placeholder = kony.i18n.getLocalizedString("i18n.StopPayments.Optional");
      this.view.lbxChequeBookLeaves.selectedKey = "lb1";
      var scopeObj = this;
      scopeObj.setStopChecksFormAccountsDropdown({
        selectedValue: ViewModel
      });
      scopeObj.savedSelectedAccount = ViewModel;
      if (scopeObj.savedSelectedAccount != undefined && scopeObj.savedSelectedAccount != null) {
        this.ChangeShowAccountName();
      }
      // this.view.flxLoading.setVisibility(true);
      this.MailAddress(this);
      scopeObj.loadStopPaymentsModule().presentationController.getChequeLeavesandAddress(ViewModel);
      scopeObj.loadStopPaymentsModule().presentationController.getUserAddress();
      var presentation = applicationManager.getModulesPresentationController({"appName":"ArrangementsMA", "moduleName":"StopPaymentsUIModule"});
      this.view.lblAddressDetails.text = presentation.address;
    },
    bindTransaction: function(ChequeTypes) {
      this.view.lblTotalChequeNumber.text = ChequeTypes;
    },
    bindfee: function(Response, accountId) {
      var presentation = applicationManager.getModulesPresentationController({"appName":"ArrangementsMA", "moduleName":"StopPaymentsUIModule"});
      this.view.ConfirmPage.lblFeeValue.text = CommonUtilities.formatCurrencyWithCommas(Response.fees, false, presentation.currencyCode);
      this.view.flxLoading.setVisibility(false);
      this.checkBookOrderFromAccount = accountId;
      var profileAccess = applicationManager.getUserPreferencesManager().profileAccess;
      var accounts = applicationManager.getConfigurationManager().userAccounts;
      var isBusinessAccount = true;
      var orientationHandler = new OrientationHandler();
      var isMobileDevice = ((kony.application.getCurrentBreakpoint() === 640) || orientationHandler.isMobile);
      if(profileAccess=="both" && this.checkBookOrderFromAccount != ""){

        for(var i=0;i<accounts.length;i++){
          if(!kony.sdk.isNullOrUndefined(accounts[i].accountID) && accounts[i].accountID==this.checkBookOrderFromAccount){
            if(accounts[i].isBusinessAccount != "true"){
              isBusinessAccount = false;
            }
            this.view.ConfirmPage.flxIcon.isVisible = true;
            this.view.ConfirmPage.imgIcon.text = isBusinessAccount == true ? "r" : "s";
            if(isMobileDevice){
              this.view.ConfirmPage.lblAccountValue.left = "47.3%";
            }
            break;
          }
        }
      } else {
        /*if(isMobileDevice){
          this.view.ConfirmPage.lblAccountValue.left = "43.3%";
        }*/
        this.view.ConfirmPage.lblFee.width = "40%";
        this.view.ConfirmPage.lblFee.height = "35dp";
        this.view.ConfirmPage.flxIcon.isVisible = false;
      }
    },
    bindAddress: function(address) {
      this.view.lblAddressDetails.text = address;
      this.view.flxRequestChequeBookDetail.setVisibility(true);
      this.view.flxLoading.setVisibility(false);
    },
    bindReferenceNumber: function(response) {
      this.view.acknowledgmentMyRequests.lblRefrenceNumberValue.text = response.chequeIssueId;
      this.view.flxLoading.setVisibility(false);
      if(response.status == "Signatory Approval Pending"){
        this.view.acknowledgmentMyRequests.lblTransactionMessage.text =  kony.i18n.getLocalizedString("i18n.checkBookRequest.status");
      }   
      /* else if(response.status ==  "Initiated" || response.status == "Request Processed" || response.status ==  "Request Placed" || response.status ==  "Requested" || response.status == "Request Initiated"){    
            	this.view.acknowledgmentMyRequests.lblTransactionMessage.text = kony.i18n.getLocalizedString("i18n.chequeBookReq.sucessfullyRaised");  
            }
			else if(response.status ==  "Failed") {
				this.view.acknowledgmentMyRequests.lblTransactionMessage.text = kony.i18n.getLocalizedString("i18n.chequeBookReq.sucessfullyRaised"); 
			} */
      else {
        this.view.acknowledgmentMyRequests.lblTransactionMessage.text = kony.i18n.getLocalizedString("i18n.chequeBookReq.sucessfullyRaised"); 
      }
      this.showChequeBookRequestAcknowledgement(this);

    },
    bindError: function(error) {
      this.view.lblChequeServerError.text = error.errorMessage;
      this.view.flxLoading.setVisibility(false);
      this.view.flxChequeBookError.setVisibility(true);
      this.view.flxRequestChequeBookDetail.setVisibility(true);
      this.view.lblChequeBookRequests.setVisibility(true);
      this.view.flxSinglePayConfirm.setVisibility(false);
      this.view.flxAcknowledgement.setVisibility(false);
      FormControllerUtility.disableButton(this.view.btnContinue);
      this.view.forceLayout();
      this.AdjustScreen();
    },
    bindStopFee: function(fee) {
      if (TypeofStopCheque === "Series") {
        this.view.ConfirmPage.lblAddressValue.text = fee;
      } else {
        this.view.ConfirmPage.lblAddressValue.text = fee;
      }
      this.showStopCheckRequestCofirmPage(this);
      this.view.forceLayout();
      this.view.flxLoading.setVisibility(false);
    },
    bindStopError: function(err) {
      for(var i=0;i<=stopCheckError.length;i++){     
        if(stopCheckError[i][lblDescription]==this.view.tbxCheckNumber.text)      
          this.view.lblWarningSeriesMultiple.text = kony.i18n.getLocalizedString("konyolb.checkmgmt.Bucketerror");       
        else       
          this.view.lblWarningSeriesMultiple.text = err;       
      }
      applicationManager.getPresentationUtility().dismissLoadingScreen();
      this.hideAll();
      this.view.flxActionsDisputeTransactionDetails.setVisibility(true);
      this.view.lblChequeBookRequests.setVisibility(true);
      this.view.flxDisputedTransactionDetail.setVisibility(true);
      this.view.flxStopCheckPaymentSeriesMultiple.setVisibility(true);
      if (kony.application.getCurrentBreakpoint() >= 1366) {
        this.view.flxDisputedTransactionDetails.height = "790px";
      }
      this.view.lblWarningSeriesMultiple.setVisibility(true);
      this.view.lblWarningSeriesMultiple.text = err;
      this.view.forceLayout();
      this.AdjustScreen();
    },
    /**
         * setStopChecksFormAccountsDropdown : Method to set Stop checks form accounts dropdown
         * @param {object} viewModel - dropdown view model
         */
    setStopChecksFormAccountsDropdown: function(viewModel) {
      var scopeObj = this;
      if (viewModel && viewModel.ddnList && viewModel.ddnList.length) {
        //         if(applicationManager.getConfigurationManager().isCombinedUser === "true"||applicationManager.getConfigurationManager().isSMEUser === "true")
        //         {
        var widgetFromData = this.isSingleCustomerProfile ? scopeObj.getDataWithAccountTypeSections(viewModel.ddnList) : scopeObj.getDataWithSections(viewModel.ddnList);
        if (widgetFromData) {
          scopeObj.view.segFromTransfer.rowTemplate = "flxRowDefaultAccounts";
          scopeObj.view.segFromTransfer.setData(widgetFromData);
          scopeObj.view.flxFromLoadingContainer.setVisibility(false);
          scopeObj.view.flxNoFromResults.setVisibility(false);
        }
        //         }else {
        //           scopeObj.bindStopChecksFormAccountsDropdown({
        //             list: viewModel.ddnList
        //           });
        //         }
      }

      scopeObj.view.lblChequeBookRequests.isVisible = true;
      scopeObj.view.lblStopPayments.isVisible = false;

    },

    getDataWithSections: function(accounts) {
      var scopeObj = this;
      var finalData = {};
      var prioritizeAccountTypes = [];
      var primaryCustomerId = applicationManager.getUserPreferencesManager().primaryCustomerId;
      accounts.forEach(function(account) {
        var accountTypeIcon = "";
        var type = "";
        if (account.isBusinessAccount === "false") {
          if (primaryCustomerId.id === account.Membership_id && primaryCustomerId.type === 'personal') {
            type = "Personal Accounts";
            accountTypeIcon = "s";
          } else {
            type = account.Membership_id;
            accountTypeIcon = "s";
          }
        } else {
          type = account.Membership_id;
          accountTypeIcon = "r";
        }
        if (finalData.hasOwnProperty(type) && account.Membership_id === finalData[type][0]["membershipId"]) {
          if (finalData[type][1][finalData[type][1].length - 1].length === 0) {
            finalData[type][1].pop();
          }
          finalData[type][1].push(scopeObj.createCombinedAccountListSegmentsModel(account));
        } else {
          prioritizeAccountTypes.push(type);
          finalData[type] = [{
            lblTransactionHeader: type === "Personal Accounts" ? type : account.MembershipName,
            imgDropDown: "P",
            flxDropDown: {
              "onClick": function(context) {
                scopeObj.showOrHideAccountRows(context, type)
              },
              "isVisible": false
            },
            lblSeparator: {
              "isVisible": true
            },
            lblTopSeparator: {
              "isVisible": true
            },
            template: "flxTransfersFromListHeader",
            membershipId: account.Membership_id
          },
                             [scopeObj.createCombinedAccountListSegmentsModel(account)]
                            ];
        }

      });
      var data = [];
      for (var key in prioritizeAccountTypes) {
        var type = prioritizeAccountTypes[key];
        if (finalData.hasOwnProperty(type)) {
          data.push(finalData[type]);
        }
      }
      return data;
    },

    /*create segment data with account type grouping
         */
    getDataWithAccountTypeSections: function(accounts) {
      var scopeObj = this;
      var finalData = {};
      var isCombinedUser = applicationManager.getConfigurationManager().getConfigurationValue('isCombinedUser') === "true";
      var prioritizeAccountTypes = applicationManager.getTypeManager().getAccountTypesByPriority();
      accounts.forEach(function(account) {
        var accountType = applicationManager.getTypeManager().getAccountType(account.type||account.accountType);
        if (finalData.hasOwnProperty(accountType)) {
          finalData[accountType][1].push(scopeObj.createCombinedAccountListSegmentsModel(account));
        } else {
          finalData[accountType] = [{

            lblTransactionHeader: {
              text: accountType,
              left: "10dp"
            },
            lblSeparator: {
              "isVisible": "true"
            },
            imgDropDown: "P",
            flxDropDown: {
              "onClick": function(context) {
                scopeObj.showOrHideAccountRows(context);
              }.bind(this),
              "isVisible": false
            },
            template: "flxTransfersFromListHeader",

          },
                                    [scopeObj.createCombinedAccountListSegmentsModel(account)]
                                   ];
        }
      });
      this.sectionData = [];
      var data = [];
      for (var key in prioritizeAccountTypes) {
        var accountType = prioritizeAccountTypes[key];
        if (finalData.hasOwnProperty(accountType)) {
          data.push(finalData[accountType]);
          this.sectionData.push(accountType);
        }
      }
      return data;
    },


    createSegmentData: function(account) {
      var orientationHandler = new OrientationHandler();
      var isMobileDevice = ((kony.application.getCurrentBreakpoint() === 640) || orientationHandler.isMobile);
      var dataObject = {
        "lblAccountName": account.accountName,
        "lblAmount": (account.type !== "CreditCard") ? CommonUtilities.formatCurrencyWithCommas(account.availableBalance, false, account.currencyCode) : CommonUtilities.formatCurrencyWithCommas(account.availableCredit, false, account.currencyCode),
        "accountID": account.accountID,
        "currencyCode": account.currencyCode,
        "imgIcon": (account.isBusinessAccount === "true") ? "r" : "s",
        "lblAccType": account.type,
        "imgBankIcon": {
          "src": this.getBankIcon(account.bankName)
        },
        "flxAccountListItem": {
          "isVisible": true
        },
        "lblSeparator": {
          "isVisible": true
        }
      };
      return dataObject;
    },

    getBankIcon: function(bankName) {
      var img = ViewConstants.IMAGES.HDFC_BANK_IMAGE;
      switch (bankName) {
        case "Citibank":
          img = ViewConstants.IMAGES.CITI_BANK_IMAGE;
          break;
        case "Bank of America":
          img = ViewConstants.IMAGES.BOA_BANK_IMAGE;
          break;
        case "National Bank":
          img = ViewConstants.IMAGES.CHASE_BANK_IMAGE;
          break;
        case "infinity":
          img = ViewConstants.IMAGES.HDFC_BANK_IMAGE;
          break;

      }
      return img;
    },

    showOrHideAccountRows: function(context, type) {
      var section = context.rowContext.sectionIndex;
      var segData = this.view.segFromTransfer.data;
      var isRowVisible = true;
      if (segData[section][0].imgDropDown.text === "O") {
        segData[section][0]["imgDropDown"] = {
          text: "P"
        };
        isRowVisible = true;
      } else {
        segData[section][0]["imgDropDown"] = {
          text: "O"
        };
        isRowVisible = false;
      }
      for (var i = 0; i < segData[section][1].length; i++) {
        var flxAccountListItem = JSON.parse(JSON.stringify(segData[section][1][i].flxAccountListItem));
        flxAccountListItem["isVisible"] = isRowVisible;
        this.updateKeyAt("flxAccountListItem", flxAccountListItem, i, section, type);
      }
      segData = this.view.segFromTransfer.data;
      this.view.segFromTransfer.setSectionAt(segData[section], section);
    },

    updateKeyAt: function(widgetName, value, row, section) {
      var data = this.view.segFromTransfer.data;
      var rowDataTobeUpdated = data[section][1][row];
      rowDataTobeUpdated[widgetName] = value;
      this.view.segFromTransfer.setDataAt(rowDataTobeUpdated, row, section);
    },
    /**
         * onSingleOrMultipleRadioButtonClick : Stop Payments signle or multiple radion buttn click hanlder
         * @param {object} event click event JS  object
         */
    SetRadioBtnSingleSeries: function(RadioBtnSelected, RadioBtnUnselected) {
      var scopeObj = this;
      RadioBtnSelected.text = "M";
      RadioBtnSelected.skin = "sknlblOLBFonts0273E420pxOlbFontIcons";
      RadioBtnUnselected.text = "L";
      RadioBtnUnselected.skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
      scopeObj.setValidationErrorMessageState(false);
    },

    onSingleOrMultipleRadioButtonClick: function(event) {
      var scopeObj = this;
      scopeObj.SetRadioBtnSingleSeries(this.view.lblRadioBtnSingle, this.view.lblRadioBtnSeries);
      scopeObj.view.flxSingleMultiplechecksWrapper.setVisibility(true);
      scopeObj.view.flxSeriesOfChecksWrapper.setVisibility(false);
      scopeObj.setSingleOrMultipleChecksFormValues();
      scopeObj.AdjustScreen();
    },
    /**
         * onSeriesRadioButtonClick : Stop Payments series radion buttn click hanlder
         * @param {object} event, click event JS  object
         */
    onSeriesRadioButtonClick: function(event) {
      var scopeObj = this;
      scopeObj.SetRadioBtnSingleSeries(this.view.lblRadioBtnSeries, this.view.lblRadioBtnSingle);
      scopeObj.view.flxSingleMultiplechecksWrapper.setVisibility(false);
      scopeObj.view.flxSeriesOfChecksWrapper.setVisibility(true);
      scopeObj.view.flxAnotherAddCheck.setVisibility(false);
      scopeObj.view.flxListBox.setVisibility(true);
      scopeObj.setSeriesChecksFormValues();
      scopeObj.AdjustScreen();

    },
    /**
         * resetTCC: Stop Payments Term and Condition check box click handler
         * @param {object} event, click event JS  object
         */
    resetTCC: function() {
      var scopeObj = this;
      CommonUtilities.setLblCheckboxState(false, scopeObj.view.lblCheckBoxFavoriteEmail);
    },
    /**
         * updateStopChekFormContinueBtnState: Update Stop check request Continue button state w.r.t all mandatory fields and T&C Checkbox state
         */
    updateStopChekFormContinueBtnState: function() {
      var scopeObj = this;
      var tccCheckBox = scopeObj.view.lblCheckBoxFavoriteEmail;
      var tbxPayee = scopeObj.view.tbxPayee.text.toString();
      var tbxFirstCheckNo = scopeObj.view.tbxFirstCheckNo.text.toString();
      var tbxLastCheckNo = scopeObj.view.tbxLastCheckNo.text.toString();
      var tbxCheckNo = scopeObj.view.tbxCheckNo.text.toString();
      var tbxDescription = scopeObj.view.tbxDescription.text.toString();
      var tbxCheckNumber = scopeObj.view.tbxCheckNumber.text.toString();
      var tbxAmount = scopeObj.view.tbxAmount.text.toString();
      var tbxDescrip = scopeObj.view.tbxDescrip.text.toString();
      if (scopeObj.view.lblRadioBtnSingle.text === "M") {
        if ((FormControllerUtility.isFontIconChecked(tccCheckBox) && !CommonUtilities.isEmptyString(tbxAmount)) ||
            (FormControllerUtility.isFontIconChecked(tccCheckBox) && scopeObj.view.calDateOfIssue.dateComponents !== null && !CommonUtilities.isEmptyString(tbxCheckNumber))
           ) {
          FormControllerUtility.enableButton(scopeObj.view.btnProceedStopCheck);
        } else {
          FormControllerUtility.disableButton(scopeObj.view.btnProceedStopCheck);
        }
      } else {
        if (FormControllerUtility.isFontIconChecked(tccCheckBox) &&
            !CommonUtilities.isEmptyString(tbxFirstCheckNo) &&
            !(CommonUtilities.isEmptyString(tbxLastCheckNo) || CommonUtilities.isEmptyString(tbxCheckNo))) {
          FormControllerUtility.enableButton(scopeObj.view.btnProceedStopCheck);
        } else {
          FormControllerUtility.disableButton(scopeObj.view.btnProceedStopCheck);
        }
      }
      scopeObj.AdjustScreen();
    },
    /**
         * onTCCClickHanlder : Stop Payments Term and Condition check box click handler
         */
    onTCCClickHanlder: function() {
      var scopeObj = this;
      var tccCheckBox = scopeObj.view.lblCheckBoxFavoriteEmail;
      FormControllerUtility.toggleFontCheckbox(tccCheckBox);
      scopeObj.updateStopChekFormContinueBtnState();
    },
    /**
         * setSingleOrMultipleChecksFormValues : Method to set Stop payments single/mutliple checks form values
         * @param {object} viewModel, view model object
         */
    setSingleOrMultipleChecksFormValues: function(viewModel) {
      viewModel = viewModel || {};
      var scopeObj = this;
      var checkDateOfIssueObj = applicationManager.getFormatUtilManager().getDateObjectFromCalendarString(viewModel.checkDateOfIssue, applicationManager.getFormatUtilManager().getDateFormat().toUpperCase());
      scopeObj.view.tbxCheckNumber.text = viewModel.checkNumber1 || "";
      // scopeObj.view.calDateOfIssue.dateComponents = checkDateOfIssueObj ? [checkDateOfIssueObj.getDate(), checkDateOfIssueObj.getMonth() + 1, checkDateOfIssueObj.getFullYear()] : scopeObj.view.calDateOfIssue.dateComponents;
      scopeObj.view.tbxAmount.text = viewModel.checkAmount ? CommonUtilities.formatCurrencyWithCommas(viewModel.checkAmount, true) : "";
      scopeObj.setStopChecksFormSingleOrMultipleReasonsDropdown({
        ddnList: scopeObj.loadStopPaymentsModule().presentationController.getCheckReasonsListViewModel(),
        selectedValue: viewModel.checkReason || null
      });
      scopeObj.view.tbxDescrip.maxTextLength = viewModel.maxDesripLength || OLBConstants.NOTES_MAXIMUM_LENGTH;
      scopeObj.view.tbxDescrip.text = viewModel.description || "";
      scopeObj.view.tbxPayee.placeholder = kony.i18n.getLocalizedString("i18n.StopPayments.EnterName");
      scopeObj.view.tbxDescrip.placeholder = kony.i18n.getLocalizedString("i18n.StopPayments.Optional");
      scopeObj.view.tbxDescription.placeholder = kony.i18n.getLocalizedString("i18n.StopPayments.Optional");
      scopeObj.view.tbxAmount.placeholder = kony.i18n.getLocalizedString("i18n.konybb.Common.Amount");
      scopeObj.view.tbxFirstCheckNo.placeholder = kony.i18n.getLocalizedString("i18n.StopPayments.FirstChequeNumber");
      scopeObj.view.tbxLastCheckNo.placeholder = kony.i18n.getLocalizedString("i18n.StopcheckPayments.LastCheckNumber");
      scopeObj.resetTCC();
      scopeObj.updateStopChekFormContinueBtnState();
    },
    /**
         * setSeriesChecksFormValues : Method to set Stop payments series checks form values
         * @param {object} viewModel, view model object
         */
    setSeriesChecksFormValues: function(viewModel) {
      var scopeObj = this;
      viewModel = viewModel || {};
      scopeObj.view.tbxFirstCheckNo.text = viewModel.checkNumber1 || "";
      scopeObj.view.tbxLastCheckNo.text = viewModel.checkNumber2 || "";
      scopeObj.view.tbxCheckNo.text = viewModel.checkNumber2 || "";
      var noOfChecks = scopeObj.getSeriesCheckNumbersCount();
      if (noOfChecks > 1) {
        scopeObj.view.lblChecksSelected.text = noOfChecks + " " + kony.i18n.getLocalizedString("i18n.StopPayments.ChecksSelected");
        scopeObj.view.tbxLastCheckNo.setVisibility(true);
        scopeObj.view.tbxCheckNo.setVisibility(false);
        scopeObj.view.lblChecksSelected.setVisibility(true);
      } else {
        scopeObj.view.lblChecksSelected.text = "";
        scopeObj.view.tbxLastCheckNo.setVisibility(true);
        scopeObj.view.tbxCheckNo.setVisibility(false);
        scopeObj.view.lblChecksSelected.setVisibility(false);
      }
      scopeObj.setStopChecksFormSeriesChecksReasonsDropdown({
        ddnList: scopeObj.loadStopPaymentsModule().presentationController.getCheckReasonsListViewModel(),
        selectedValue: viewModel.checkReason || null
      });
      scopeObj.view.tbxPayee.placeholder = kony.i18n.getLocalizedString("i18n.StopPayments.EnterName");
      scopeObj.view.tbxDescrip.placeholder = kony.i18n.getLocalizedString("i18n.StopPayments.Optional");
      scopeObj.view.tbxDescription.placeholder = kony.i18n.getLocalizedString("i18n.StopPayments.Optional");// = "Optional";
      scopeObj.view.tbxCheckNo.placeholder = kony.i18n.getLocalizedString("i18n.StopcheckPayments.LastCheckNumber");
      scopeObj.view.tbxDescription.maxTextLength = viewModel.maxDesriptionLength || OLBConstants.NOTES_MAX_LENGTH;
      scopeObj.view.tbxDescription.text = viewModel.description || "";
      scopeObj.resetTCC();
      scopeObj.updateStopChekFormContinueBtnState();
    },
    /**
         * bindStopChecksFormAccountsDropdown : Method to bind Stop checks form accounts dropdown
         * @param {object} viewModel - dropdown view model
         */
    bindStopChecksFormAccountsDropdown: function(viewModel) {
      var scopeObj = this;
      var chequeSupportedAccounts = [];
      if (viewModel && viewModel.list.length) {
        for (var i = 0; i < viewModel.list.length; i++) {
          if (viewModel.list[i].type === "Checking" || viewModel.list[i].type === "Savings") {
            chequeSupportedAccounts.push(viewModel.list[i]);
          }
        }
        scopeObj.view.lbxSelectFrom.masterData = chequeSupportedAccounts.map(function(account) {
          return [account.accountID, account.accountName];
        });
        scopeObj.view.lbxFrom.masterData = chequeSupportedAccounts.map(function(account) {
          return [account.accountID, account.accountName];
        });
      }
      if (LandingSelectedAccount !== "") {
        scopeObj.view.lbxFrom.selectedKey = LandingSelectedAccount;
        scopeObj.view.lbxSelectFrom.selectedKey = LandingSelectedAccount;
      } else {
        scopeObj.view.lbxFrom.selectedKey = viewModel.selectedValue || scopeObj.savedSelectedAccount || scopeObj.view.lbxFrom.masterData[0][0];
        scopeObj.view.lbxSelectFrom.selectedKey = viewModel.selectedValue || scopeObj.savedSelectedAccount || scopeObj.view.lbxSelectFrom.masterData[0][0];
      }

    },
    /**
         * setStopChecksFormSingleOrMultipleReasonsDropdown : Method to set Stop checks form single or multiple checks reasons dropdown
         * @param {object} viewModel - dropdown view model
         */
    setStopChecksFormSingleOrMultipleReasonsDropdown: function(viewModel) {
      var scopeObj = this;
      if (viewModel && viewModel.ddnList && viewModel.ddnList.length) {
        scopeObj.bindStopChecksFormSingleOrMultipleReasonsDropdown({
          list: viewModel.ddnList
        });
      }
      scopeObj.view.lbxSelectReasonNew.selectedKey = viewModel.selectedValue || scopeObj.savedSingleCheckReason || scopeObj.view.lbxSelectReasonNew.masterData[0][0];
    },
    /**
         * bindStopChecksFormSingleOrMultipleReasonsDropdown : Method to bind Stop checks form reasons dropdown
         * @param {object} viewModel - dropdown view model
         */
    bindStopChecksFormSingleOrMultipleReasonsDropdown: function(viewModel) {
      var scopeObj = this;
      if (viewModel && viewModel.list.length) {
        scopeObj.view.lbxSelectReasonNew.masterData = viewModel.list.map(function(reason) {
          return [reason.id, reason.name];
        });
      }
    },
    /**
         * setStopChecksFormSingleOrMultipleReasonsDropdown : Method to set Stop checks form single or multiple checks reasons dropdown
         * @param {object} viewModel - dropdown view model
         */
    setStopChecksFormSeriesChecksReasonsDropdown: function(viewModel) {
      var scopeObj = this;
      if (viewModel && viewModel.ddnList && viewModel.ddnList.length) {
        scopeObj.bindStopChecksFormSeriesChecksReasonsDropdown({
          list: viewModel.ddnList
        });
      }
      scopeObj.view.lstBoxSelectReasonForDispute.selectedKey = viewModel.selectedValue || scopeObj.savedSeriesCheckReason || scopeObj.view.lbxSelectReasonNew.masterData[0][0];
    },
    /**
         * bindStopChecksFormSingleOrMultipleReasonsDropdown : Method to bind Stop checks form reasons dropdown
         * @param {object} viewModel - dropdown view model
         */
    bindStopChecksFormSeriesChecksReasonsDropdown: function(viewModel) {
      var scopeObj = this;
      if (viewModel && viewModel.list.length) {
        scopeObj.view.lstBoxSelectReasonForDispute.masterData = viewModel.list.map(function(reason) {
          return [reason.id, reason.name];
        });
      }
    },
    /**
         * onTandCBtnClickHandler : Terms and Conditions button click handler.
         */
    onTandCBtnClickHandler: function() {
      var scopeObj = this;
      scopeObj.setTermsAndConditionsPopupState({
        visible: true
      });
    },
    /**
         * setTermsAndConditionsPopupState : set Terms and Conditions popup.
         * @param {boolean} visible  is visibility true/false
         */
    setTermsAndConditionsPopupState: function(visible) {
      var scopeObj = this;
      visible = visible || false;
      scopeObj.view.flxTermsAndConditions.height = scopeObj.getPageHeight() + "dp";
      scopeObj.view.flxTermsAndConditions.setVisibility(visible);
      if (visible === true)
        scopeObj.view.lblTermsAndConditions.setFocus(true);
      scopeObj.view.flxClose.setFocus(true);
      FormControllerUtility.setLblCheckboxState(FormControllerUtility.isFontIconChecked(scopeObj.view.lblCheckBoxFavoriteEmail), scopeObj.view.lblFavoriteEmailCheckBox);
    },
    /**
         * onTandContentSaveClickHandler : Terms and Conditions popup Save button click handler.
         */
    onTandContentSaveClickHandler: function() {
      var scopeObj = this;
      FormControllerUtility.setLblCheckboxState(FormControllerUtility.isFontIconChecked(scopeObj.view.lblFavoriteEmailCheckBox), scopeObj.view.lblCheckBoxFavoriteEmail);
      scopeObj.updateStopChekFormContinueBtnState();
      scopeObj.setTermsAndConditionsPopupState(false);
    },
    /**
         * onTandContentCheckBoxClickHandler : Terms and Conditions popup checkbox click handler.
         */
    onTandContentCheckBoxClickHandler: function() {
      FormControllerUtility.toggleFontCheckbox(this.view.lblFavoriteEmailCheckBox);
    },
    /**
         * onSuccessCreateStopCheckRequest : Method to handle successful sstop check request.
         * @param {object} viewModel, success request view model
         */
    onSuccessCreateStopCheckRequest: function(viewModel) {
      var scopeObj = this;
      scopeObj.showStopChekRequestAcknowledgment({
        referenceNumber: viewModel.referenceNumber
      });
    },
    /**
         * showStopChekRequestAcknowledgment : Method to show Stop check request Acknowledgement form.
         * @param {object} viewModel view
         */
    showStopChekRequestAcknowledgment: function(viewModel) {
             var scopeObj = this;
            //var combinedUser = (applicationManager.getConfigurationManager().isCombinedUser === "true");
            var isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            scopeObj.view.flxLoading.setVisibility(false);
            //var ackPage = scopeObj.view.AcknowledgementDetails;
            scopeObj.hideAll();
            if (CommonUtilities.isPrintEnabled()) {
                scopeObj.view.flxPrintACK.setVisibility(true);
            } else {
                scopeObj.view.flxPrintACK.setVisibility(false);
            }
            scopeObj.view.flxAcknowledgement.setVisibility(true);
            //this.view.flxAcknowledgementMain.width = "43.27%";
            this.view.flxTransactionDetails.setVisibility(true);
            scopeObj.view.flxExtra1.setVisibility(true);
            scopeObj.view.flxExtra2.setVisibility(true);
            scopeObj.view.flxHeader.setFocus(true);
            if (viewModel.isDataBindedAlready) {
                scopeObj.view.forceLayout();
                scopeObj.AdjustScreen();
                return;
            }
            scopeObj.setBreadcrumb([{
                label: kony.i18n.getLocalizedString("i18n.topmenu.accounts"),
                toolTip: kony.i18n.getLocalizedString("i18n.topmenu.accounts")
            }, {
                label: kony.i18n.getLocalizedString("i18n.transfers.Acknowledgement"),
                toolTip: kony.i18n.getLocalizedString("i18n.transfers.Acknowledgement")
            }, ]);
            scopeObj.view.acknowledgmentMyRequests.lblRefrenceNumberValue.text = viewModel.referenceNumber;
            scopeObj.view.lblBillPayAcknowledgement.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.StopCheckPaymentAck");
            scopeObj.view.customheadernew.lblHeaderMobile.text = scopeObj.view.lblBillPayAcknowledgement.text;
            scopeObj.view.lblHeadingACK.text = kony.i18n.getLocalizedString("i18n.StopPayments.stopCheckPaymentDetails");
            scopeObj.view.lblAccountKey.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.from");
			if (scopeObj.view.segFromTransfer.selectedRowItems[0]) {
            scopeObj.view.lblAccountValue.text = scopeObj.view.segFromTransfer.selectedRowItems[0].lblDefaultAccountName.text;
			}else{
				scopeObj.view.lblAccountValue.text = LandingSelectedAccountName;
			}
            //scopeObj.view.lblAccountValue.text = !isSingleCustomerProfile ? scopeObj.view.segFromTransfer.selectedRowItems[0].lblAccountName : scopeObj.view.lbxSelectFrom.selectedKeyValue[1];
            //scopeObj.view.lblAccountValue.text = combinedUser ? scopeObj.view.segFromTransfer.selectedRowItems[0].lblAccountName :scopeObj.view.lbxSelectFrom.selectedKeyValue[1];
            //if (kony.application.getCurrentBreakpoint() == 640) {
            //    scopeObj.view.lblAccountValue.left = "15px";
            // } else {
            //     scopeObj.view.lblAccountValue.left = !isSingleCustomerProfile ? "46.5%" : "42%";
            // }
            //else{scopeObj.view.lblAccountValue.left = combinedUser ? "46.5%" : "42%";}
            //scopeObj.view.flxAccountIcon.isVisible = this.profileAccess === "both" ? true : false;
            //scopeObj.view.flxAccountIcon.isVisible = combinedUser ? true :false;
          //  scopeObj.view.imgIcon.text = this.profileAccess === "both" ? scopeObj.view.segFromTransfer.selectedRowItems[0].imgIcon : "r";
			if (scopeObj.view.segFromTransfer.selectedRowItems[0]) {
                scopeObj.view.imgIcon.text = this.profileAccess === "both" ? scopeObj.view.segFromTransfer.selectedRowItems[0].imgIcon : "r";
            } else {
                scopeObj.view.imgIcon.text = "r";
            }
            //scopeObj.view.imgIcon.text = combinedUser ? scopeObj.view.segFromTransfer.selectedRowItems[0].imgIcon :"r";
            scopeObj.view.lblChequeBooksKey.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.Payee");
            if (scopeObj.stopCheckRequestData !== undefined) {
                scopeObj.view.lblChequeBooksValue.text = scopeObj.stopCheckRequestData.payeeName;
                scopeObj.view.lblFeeKey.text = kony.i18n.getLocalizedString("i18n.StopcheckPayments.CheckNumber");
                scopeObj.view.lblDeliveryType.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.Amount($)");
                scopeObj.view.lblAddressKey.text = kony.i18n.getLocalizedString("i18n.chequeBookReq.fee");
                scopeObj.view.lblNotesKey.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.Date");
                scopeObj.view.lblExtra1.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.Reason");
                scopeObj.view.lblExtra2.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.Notes");
                scopeObj.view.acknowledgmentMyRequests.lblTransactionMessage.text = kony.i18n.getLocalizedString("i18n.StopcheckPayments.SuccessFullyRaisedStopChequeRequest");
                if (TypeofStopCheque === "Series") {
                    scopeObj.view.flxDeliveryType.setVisibility(false);
                    scopeObj.view.flxNotes.setVisibility(false);
                    scopeObj.view.lblFeeValue.text = scopeObj.getSeriesCheckNumber();
                    scopeObj.view.lblExtra2Value.text = (scopeObj.stopCheckRequestData.description) ? scopeObj.stopCheckRequestData.description : "-";
                } else {
                    scopeObj.view.lblFeeValue.text = scopeObj.stopCheckRequestData.checkNumber1;
                    scopeObj.view.lblDeliveryType.text = scopeObj.view.ConfirmPage.lblDeliveryType.text;
                    scopeObj.view.lblDeliveryTypeValue.text = CommonUtilities.formatCurrencyWithCommas(scopeObj.stopCheckRequestData.amount, true);
                    scopeObj.view.lblExtra2Value.text = (scopeObj.stopCheckRequestData.description) ? scopeObj.stopCheckRequestData.description : "-";
                    scopeObj.view.lblNotesValue.text = scopeObj.stopCheckRequestData.checkDateOfIssue;
                }
                scopeObj.view.lblAddressValue.text = this.view.ConfirmPage.lblAddressValue.text;
                scopeObj.view.lblExtra1Value.text = scopeObj.stopCheckRequestData.checkReason;
            }
            scopeObj.view.btnMakeTransfer.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.GoToAccountDetail");
            scopeObj.view.btnMakeTransfer.onClick = viewModel.onBacktoAccountDetails;
            scopeObj.view.btnAddAnotherAccount.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.ViewRequests");
            scopeObj.view.btnAddAnotherAccount.onClick = this.btnViewDisputedTransactionsClickHandler;
            //viewModel.onMyRequestAction || scopeObj.onViewRequestsBtnClick.bind(scopeObj);
            scopeObj.view.forceLayout();
            scopeObj.AdjustScreen();
    },
    /**
         * onViewRequestsBtnClick : Stop Payment Acknowledgemtn My request button click hanlder.
         */
    onViewRequestsBtnClick: function() {
      var scopeObj = this;
      scopeObj.loadStopPaymentsModule().presentationController.showMyRequests({
        selectTab: OLBConstants.DISPUTED_CHECKS
      });
    },
    /**
         * onSeriesLastCheckTextChange : Method to handle Series last check number stop editing
         */
    onSeriesLastCheckTextChange: function() {
      var scopeObj = this;
      scopeObj.view.tbxCheckNumber.skin = ViewConstants.SKINS.SKNTBXLAT0FFFFFF15PXBORDER727272OPA20;
      scopeObj.view.tbxFirstCheckNo.skin = ViewConstants.SKINS.SKNTBXLAT0FFFFFF15PXBORDER727272OPA20;
      scopeObj.view.tbxLastCheckNo.skin = ViewConstants.SKINS.SKNTBXLAT0FFFFFF15PXBORDER727272OPA20;
      scopeObj.view.tbxCheckNo.skin = ViewConstants.SKINS.SKNTBXLAT0FFFFFF15PXBORDER727272OPA20;
      scopeObj.setValidationErrorMessageState(false);
      scopeObj.view.tbxCheckNo.text = scopeObj.view.tbxLastCheckNo.text;
      var noOfChecks = scopeObj.getSeriesCheckNumbersCount();
      if (noOfChecks > 1) {
        scopeObj.view.lblChecksSelected.text = noOfChecks + " " + kony.i18n.getLocalizedString("i18n.StopPayments.ChecksSelected");
        scopeObj.view.tbxLastCheckNo.setVisibility(true);
        scopeObj.view.tbxCheckNo.setVisibility(false);
        scopeObj.view.lblChecksSelected.setVisibility(true);
        scopeObj.view.forceLayout();
      }
      scopeObj.AdjustScreen();
    },
    /**
         * onSeriesLastCheck2TextChange : Method to handle Series last check number first / 2nd text box stop editing
         */
    onSeriesLastCheck2TextChange: function() {
      var scopeObj = this;
      scopeObj.view.tbxCheckNumber.skin = ViewConstants.SKINS.SKNTBXLAT0FFFFFF15PXBORDER727272OPA20;
      scopeObj.view.tbxFirstCheckNo.skin = ViewConstants.SKINS.SKNTBXLAT0FFFFFF15PXBORDER727272OPA20;
      scopeObj.view.tbxLastCheckNo.skin = ViewConstants.SKINS.SKNTBXLAT0FFFFFF15PXBORDER727272OPA20;
      scopeObj.view.tbxCheckNo.skin = ViewConstants.SKINS.SKNTBXLAT0FFFFFF15PXBORDER727272OPA20;
      scopeObj.setValidationErrorMessageState(false);
      var checksCount = scopeObj.getSeriesCheckNumbersCount();
      if (checksCount > 1 && checksCount <= OLBConstants.MAX_CHECKS_COUNT) {
        scopeObj.view.lblChecksSelected.text = scopeObj.getSeriesCheckNumbersCount() + " " + kony.i18n.getLocalizedString("i18n.StopPayments.ChecksSelected");
        scopeObj.setValidationErrorMessageState(false);
      } else {
        if (scopeObj.view.lblChecksSelected.isVisible) {
          scopeObj.view.lblChecksSelected.text = "";
          scopeObj.setValidationErrorMessageState(true, "i18n.StopPayments.errormessages.InvalidSeriesCheckNumbers");
          scopeObj.view.tbxFirstCheckNo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
          scopeObj.view.tbxCheckNo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
          scopeObj.view.tbxLastCheckNo.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
        }
      }
      scopeObj.AdjustScreen();
    },
    /**
         * showMyRequests : Method to show My Request View
         * @param {object} viewModel, view model object
         */
    showMyRequests: function(viewModel) {
      var scopeObj = this;
      if (viewModel) {
        scopeObj.setMyRequestsUI(viewModel);
      } else {
        CommonUtilities.ErrorHandler.onError("showMyRequests - Invalid View Model : " + viewModel);
      }
    },
    /**
         * setMyRequestsUI : Method to set flexes visibility for My Requests UI
         * @param {object} viewModel, view model object
         */
    setMyRequestsUI: function(viewModel) {
      var scopeObj = this;
      Disputeflag = 0;
      scopeObj.setBreadcrumb([{
        label: kony.i18n.getLocalizedString("i18n.topmenu.accounts"),
        toolTip: kony.i18n.getLocalizedString("i18n.topmenu.accounts")
      },
                              {
                                label: kony.i18n.getLocalizedString("i18n.StopCheckPayments.MyRequests"),
                                toolTip: kony.i18n.getLocalizedString("i18n.StopCheckPayments.MyRequests")
                              },
                             ]);
      var selectTab = viewModel.selectTab || OLBConstants.DISPUTED_TRANSACTIONS;
      scopeObj.hideAll();
      scopeObj.view.btnNew.setVisibility(true);
      scopeObj.view.flxMyRequestsTabs.setVisibility(true);
      this.view.flxAccounts.setVisibility(true);
      scopeObj.view.lblStopPayments.isVisible = true;
      scopeObj.view.MyRequestsTabs.flxMyRequestsHeader.setVisibility(false);
      scopeObj.view.MyRequestsTabs.flxMyRequestsHeader.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.MyRequests");
      //scopeObj.view.MyRequestsTabs.flxTabs.setVisibility(true);
      //scopeObj.view.MyRequestsTabs.btnDisputedTrnsactions.setVisibility(true);
      scopeObj.view.MyRequestsTabs.btnDisputedTrnsactions.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.StopChequeRequest");
      scopeObj.view.MyRequestsTabs.btnDisputedTrnsactions.onClick = scopeObj.disputedTransactionsTabClickHandler.bind(scopeObj);
      scopeObj.view.MyRequestsTabs.btnDisputedChecks.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.ChequeBookRequests");
      scopeObj.view.MyRequestsTabs.btnDisputedChecks.onClick = scopeObj.disputedChecksTabClickHandler.bind(scopeObj);
      scopeObj.view.MyRequestsTabs.btnMyCheques.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.MyCheques");
      scopeObj.view.MyRequestsTabs.btnMyCheques.onClick = scopeObj.myChequesTabClickHandler.bind(scopeObj);
      scopeObj.view.MyRequestsTabs.btnAddNewStopCheckPayments.setVisibility(true);
      scopeObj.view.MyRequestsTabs.btnNewChequeBookRequests.setVisibility(false);
      scopeObj.view.MyRequestsTabs.btnNewChequeBookRequests.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.NewChequeBookRequest");
      scopeObj.view.MyRequestsTabs.btnNewChequeBookRequests.toolTip = CommonUtilities.changedataCase(kony.i18n.getLocalizedString("i18n.ChequeManagement.NewChequeBookRequest"));
      scopeObj.view.MyRequestsTabs.btnNewChequeBookRequests.onClick = scopeObj.btnNewChequeBookRequestsClickHandler.bind(scopeObj);
      scopeObj.view.MyRequestsTabs.btnChequeBookRequestsMobile.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.NewChequeBookRequest");
      scopeObj.view.MyRequestsTabs.btnChequeBookRequestsMobile.toolTip = CommonUtilities.changedataCase(kony.i18n.getLocalizedString("i18n.ChequeManagement.NewChequeBookRequest"));
      scopeObj.view.MyRequestsTabs.btnChequeBookRequestsMobile.onClick = scopeObj.btnNewChequeBookRequestsClickHandler.bind(scopeObj);
      scopeObj.view.MyRequestsTabs.btnStopChequeRequestsMobile.setVisibility(false);

      if (viewModel && viewModel.addNewStopCheckRequestAction) {
        scopeObj.view.MyRequestsTabs.btnStopChequeRequestsMobile.text = viewModel.addNewStopCheckRequestAction.displayName;
        scopeObj.view.MyRequestsTabs.btnStopChequeRequestsMobile.toolTip = CommonUtilities.changedataCase(viewModel.addNewStopCheckRequestAction.displayName);
        scopeObj.view.MyRequestsTabs.btnStopChequeRequestsMobile.onClick = viewModel.addNewStopCheckRequestAction.action;
      } else {
        scopeObj.view.MyRequestsTabs.btnStopChequeRequestsMobile.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.NewStopChequeRequest");
        scopeObj.view.MyRequestsTabs.btnStopChequeRequestsMobile.toolTip = CommonUtilities.changedataCase(kony.i18n.getLocalizedString("i18n.ChequeManagement.NewStopChequeRequest"));
        scopeObj.view.MyRequestsTabs.btnStopChequeRequestsMobile.onClick = scopeObj.btnAddNewStopCheckPaymentsClickHandler.bind(scopeObj);
      }
      if (viewModel && viewModel.addNewStopCheckRequestAction) {
        scopeObj.view.MyRequestsTabs.btnAddNewStopCheckPayments.text = viewModel.addNewStopCheckRequestAction.displayName;
        scopeObj.view.MyRequestsTabs.btnAddNewStopCheckPayments.toolTip = CommonUtilities.changedataCase(viewModel.addNewStopCheckRequestAction.displayName);
        scopeObj.view.MyRequestsTabs.btnAddNewStopCheckPayments.onClick = viewModel.addNewStopCheckRequestAction.action;
      } else {
        scopeObj.view.MyRequestsTabs.btnAddNewStopCheckPayments.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.NewStopChequeRequest");
        scopeObj.view.MyRequestsTabs.btnAddNewStopCheckPayments.toolTip = CommonUtilities.changedataCase(kony.i18n.getLocalizedString("i18n.ChequeManagement.NewStopChequeRequest"));
        scopeObj.view.MyRequestsTabs.btnAddNewStopCheckPayments.onClick = scopeObj.btnAddNewStopCheckPaymentsClickHandler.bind(scopeObj);
      }
      scopeObj.view.btnNew.onClick = function() {
        scopeObj.btnAddNewStopCheckPaymentsClickHandler();
        scopeObj.view.lblStopPayments.isVisible = false;
        scopeObj.view.customheadernew.lblHeaderMobile.text = kony.i18n.getLocalizedString("i18n.olb.chequeManagement.chequeManagement");
      };
      scopeObj.view.customheadernew.lblHeaderMobile.text = kony.i18n.getLocalizedString("i18n.olb.chequeManagement.chequeManagement");
      switch (selectTab) {
        case OLBConstants.DISPUTED_TRANSACTIONS:
          scopeObj.setDisputedTransactionTabUI();
          break;
        case OLBConstants.DISPUTED_CHECKS:
          scopeObj.setDisputedChecksTabUI();
          break;
        case OLBConstants.MY_CHEQUES:
          scopeObj.setMyChequesTabUI(viewModel);
          break;
        default:
          scopeObj.setDisputedTransactionTabUI();
      }
      scopeObj.AdjustScreen();

    },
    /**
         * showMyChequesRequests : Method to show Stop check requests
         * @param {Array} myChequesViewModel, stop check requests array
         */
    showMyChequesRequests: function(myChequesViewModel) {
      var scopeObj = this;
      scopeObj.setMyChequesTabUI();
      if (myChequesViewModel && myChequesViewModel.stopMyChequeRequests && myChequesViewModel.stopMyChequeRequests.length) {
        scopeObj.bindMyChequesData(myChequesViewModel.stopMyChequeRequests);
        var sortMap = [{
          name: 'transactionDate',
          imageFlx: this.view.MyRequestsTabs.imgSortDateDC,
          clickContainer: this.view.MyRequestsTabs.flxSortDateDC
        },
                       {
                         name: 'amount',
                         imageFlx: this.view.MyRequestsTabs.imgSortAmountDC,
                         clickContainer: this.view.MyRequestsTabs.flxSortAmountDC
                       },
                       {
                         name: 'statusDesc',
                         imageFlx: this.view.MyRequestsTabs.imgStatusDC,
                         clickContainer: this.view.MyRequestsTabs.flxStatusDC
                       }
                      ];
        FormControllerUtility.setSortingHandlers(sortMap, scopeObj.onDistiputedChecksSorting.bind(scopeObj), scopeObj);
        FormControllerUtility.updateSortFlex(sortMap, myChequesViewModel.config);
        scopeObj.view.MyRequestsTabs.flxNoTransactions.setVisibility(false);
      } else {
        scopeObj.showNoTransactionsUI({
          noTransactionsMessageI18Key: "i18n.StopPayments.NoStopPaymentRequests"
        });
      }
      scopeObj.AdjustScreen();
    },

    /**
         * showStopCheckRequests : Method to show Stop check requests
         * @param {Array} stopCheckRequestsViewModel, stop check requests array
         */
    showStopCheckRequests: function(stopCheckRequestsViewModel) {
      var scopeObj = this;
      scopeObj.setDisputedChecksTabUI();
      if (stopCheckRequestsViewModel && stopCheckRequestsViewModel.stopchecksRequests && stopCheckRequestsViewModel.stopchecksRequests.length) {
        scopeObj.bindStopCheckRequestsData(stopCheckRequestsViewModel.stopchecksRequests);
        var sortMap = [{
          name: 'transactionDate',
          imageFlx: this.view.MyRequestsTabs.imgSortDateDC,
          clickContainer: this.view.MyRequestsTabs.flxSortDateDC
        },
                       {
                         name: 'amount',
                         imageFlx: this.view.MyRequestsTabs.imgSortAmountDC,
                         clickContainer: this.view.MyRequestsTabs.flxSortAmountDC
                       },
                       {
                         name: 'statusDesc',
                         imageFlx: this.view.MyRequestsTabs.imgStatusDC,
                         clickContainer: this.view.MyRequestsTabs.flxStatusDC
                       }
                      ];
        FormControllerUtility.setSortingHandlers(sortMap, scopeObj.onDistiputedChecksSorting.bind(scopeObj), scopeObj);
        FormControllerUtility.updateSortFlex(sortMap, stopCheckRequestsViewModel.config);
        scopeObj.view.MyRequestsTabs.flxNoTransactions.setVisibility(false);
      } else {
        scopeObj.showNoTransactionsUI({
          noTransactionsMessageI18Key: "i18n.StopPayments.NoStopPaymentRequests"
        });
      }
      scopeObj.AdjustScreen();
    },
    /**
         * showDisputeTransactionsRequests : Method to show dispute transaction requests
         * @param {Array} disputeTransactionsRequestsViewModel transactions view model
         */
    showDisputeTransactionsRequests: function(disputeTransactionsRequestsViewModel) {
      var scopeObj = this;
      scopeObj.setDisputedTransactionTabUI();
      if (disputeTransactionsRequestsViewModel && disputeTransactionsRequestsViewModel.stopDisputedRequests && disputeTransactionsRequestsViewModel.stopDisputedRequests.length) {
        scopeObj.bindDisputeTransactionRequestsData(disputeTransactionsRequestsViewModel.stopDisputedRequests);
        var sortMap = [{
          name: 'disputeDate',
          imageFlx: this.view.MyRequestsTabs.imgSortDate,
          clickContainer: this.view.MyRequestsTabs.flxSortDate
        },
                       {
                         name: 'amount',
                         imageFlx: this.view.MyRequestsTabs.imgSortAmount,
                         clickContainer: this.view.MyRequestsTabs.flxSortAmount
                       },
                       {
                         name: 'disputeStatus',
                         imageFlx: this.view.MyRequestsTabs.imgStatus,
                         clickContainer: this.view.MyRequestsTabs.flxStatus
                       }
                      ];
        FormControllerUtility.setSortingHandlers(sortMap, scopeObj.onDistiputedTransactionsSorting.bind(scopeObj), scopeObj);
        FormControllerUtility.updateSortFlex(sortMap, disputeTransactionsRequestsViewModel.config);
        scopeObj.view.MyRequestsTabs.flxNoTransactions.setVisibility(false);
      } else {
        scopeObj.showNoTransactionsUI({
          noTransactionsMessageI18Key: "i18n.StopPayments.NoStopPaymentRequests"
        });
      }
      scopeObj.AdjustScreen();
    },
    /**
         * onDistiputedTransactionsSorting: Handler for Make Transfer tab Sorting
         * @param {object} event - Event Object
         * @param {object} data - Updated Config
         */
    onDistiputedTransactionsSorting: function(event, data) {
      this.loadStopPaymentsModule().presentationController.showDisputeTransactionRequests(data);
    },
    /**
         * onDistiputedChecksSorting: Handler for Make Transfer tab Sorting
         * @param {object} event - Event Object
         * @param {object} data - Updated Config
         */
    onDistiputedChecksSorting: function(event, data) {
      this.loadStopPaymentsModule().presentationController.showDisputeCheckRequests(data);
    },
    /**
         * bindStopCheckRequestsData : Method to bind Stop check requests data to Segments
         * @param {Array} stopCheckRequests, stop check requests array
         */
    bindStopCheckRequestsData: function(stopCheckRequests) {
      var scopeObj = this;
      var break_point = kony.application.getCurrentBreakpoint();
      var widgetDataMap = {
        "flxDisputedChecksRowWrapper": "flxDisputedChecksRowWrapper",
        "flxSegDisputedChecksRowWrapper": "flxSegDisputedChecksRowWrapper",
        "flxIdentifier": "flxIdentifier",
        "flxSelectedRowWrapper": "flxSelectedRowWrapper",
        "flxSegDisputedTransactionRowWrapper": "flxSegDisputedTransactionRowWrapper",
        "flxDropdown": "flxDropdown",
        "flxSegDisputedTransactionRowWrappers": "flxSegDisputedTransactionRowWrappers",
        "flxWrapper": "flxWrapper",
        "flxLeft": "flxLeft",
        "flxRight": "flxRight",
        "flxDate": "flxDate",
        "flxReferenceNo": "flxReferenceNo",
        "flxAmount": "flxAmount",
        "flxStatus": "flxStatus",
        "lblSeparator": "lblSeparator",
        "lblIdentifier": "lblIdentifier",
        "lblSeparator2": "lblSeparator2",
        "imgDropDown": "imgDropDown",
        "lblDate": "lblDate",
        "lblDescription": "lblDescription",
        "lblReferenceNo": "lblReferenceNo",
        "lblAmount": "lblAmount",
        "lblStatus": "lblStatus",
        "lblSepeartor3": "lblSepeartor3",
        "btnCancelRequests": "btnCancelRequests",
        "btnSendAMessage": "btnSendAMessage",
        "lblFromAccount": "lblFromAccount",
        "lblToAccount": "lblToAccount",
        "lblExpiresOnKey": "lblExpiresOnKey",
        "lblFromAccountData": "lblFromAccountData",
        "lblToAccountData": "lblToAccountData",
        "lblExpiresOnData": "lblExpiresOnData",
        "lblDateOfDescriptionKey": "lblDateOfDescriptionKey",
        "CopylblFrequencyTitle0c4e7bef1ab0c44": "CopylblFrequencyTitle0c4e7bef1ab0c44",
        "lblDateOfDescriptionValue": "lblDateOfDescriptionValue",
        "lblTransactionTypeValue": "lblTransactionTypeValue",
        "lblSeparatorLineActions": "lblSeparatorLineActions",
        "lblToAccount1": "lblToAccount1",
        "lblToAccountData1": "lblToAccountData1",
        "lblSeparatorActions": "lblSeparatorActions",
        "lblTransactionDetails": "lblTransactionDetails",
        "lblAmountKey": "lblAmountKey",
        "btnRevoke": "btnRevoke"
      };
      var dataMap = stopCheckRequests.map(function(requestObj) {
        return {
          "template": "flxDisputedChecksUnSelectedWrapper",
          "lblSeparator": "lblSeparator",
          "lblIdentifier": "lblIdentifier",
          "lblSeparator2": "lblSeparator2",
          "imgDropDown": OLBConstants.IMAGES.ARRAOW_DOWN,
          "lblDate": requestObj.transactionDate,
          "lblDescription": requestObj.payeeName,
          "lblReferenceNo": requestObj.checkNumber,
          "lblAmount": requestObj.amount,
          "lblStatus": requestObj.statusDescription,
          "lblSepeartor3": "",
          "lblFromAccount": kony.i18n.getLocalizedString("i18n.transfers.fromAccount"),
          "lblToAccount": kony.i18n.getLocalizedString("i18n.StopCheckPayments.DateOnCheck"),
          "lblExpiresOnKey": kony.i18n.getLocalizedString("i18n.StopCheckPayments.ExpiresOn"),
          "lblFromAccountData": requestObj.fromAccount,
          "lblToAccountData": requestObj.checkDateOfIssue,
          "lblExpiresOnData": requestObj.requestValidity,
          "lblDateOfDescriptionKey": kony.i18n.getLocalizedString("i18n.StopPayments.Reason"),
          "CopylblFrequencyTitle0c4e7bef1ab0c44": kony.i18n.getLocalizedString("i18n.StopPayments.Description"),
          "lblDateOfDescriptionValue": requestObj.checkReason,
          "lblTransactionTypeValue": requestObj.transactionsNotes,
          "btnSendAMessage": {
            "text": kony.i18n.getLocalizedString("i18n.StopCheckPayments.SENDMessage"),
            "toolTip": kony.i18n.getLocalizedString("i18n.StopCheckPayments.SENDMessage"),
            "onClick": requestObj.onSendMessageAction ? requestObj.onSendMessageAction : null,
            "isVisible": (applicationManager.getConfigurationManager().checkUserPermission("MESSAGES_CREATE") && requestObj.onSendMessageAction) ? true : false
          },
          "btnCancelRequests": {
            "text": requestObj.onCancelRequest ? kony.i18n.getLocalizedString("i18n.StopPayments.CANCELREQUEST") : kony.i18n.getLocalizedString("i18n.StopPayments.RENEWREQUEST"),
            "toolTip": CommonUtilities.changedataCase(requestObj.onCancelRequest ? kony.i18n.getLocalizedString("i18n.StopPayments.CANCELREQUEST") : kony.i18n.getLocalizedString("i18n.StopPayments.RENEWREQUEST")),
            "onClick": requestObj.onCancelRequest ? requestObj.onCancelRequest : requestObj.onReNewRequest,
            "isVisible": ((applicationManager.getConfigurationManager().checkUserPermission("CHECK_MANAGEMENT_ADD_STOP_CHECK_REQUEST")) && (requestObj.onCancelRequest || requestObj.onReNewRequest)) ? true : false
          },
          "lblToAccount1": "To:",
          "lblToAccountData1": requestObj.payeeName,
          "lblTransactionDetails": "Transaction Details",
          "lblAmountKey": "Amount:",
        };
      });
      scopeObj.view.MyRequestsTabs.segTransactions.widgetDataMap = widgetDataMap;
      if (break_point == 640) {
        for (var i = 0; i < dataMap.length; i++) {
          dataMap[i].template = "flxDisputedTransactionsUnSelectedMobile";
        }
      }
      scopeObj.view.MyRequestsTabs.segTransactions.setData(dataMap);
      scopeObj.view.MyRequestsTabs.flxSortDisputedChecks.setVisibility(true);
      scopeObj.view.MyRequestsTabs.segTransactions.setVisibility(true);
      if (CommonUtilities.isPrintEnabled()) {
        scopeObj.view.flxPrintACK.setVisibility(true);
      } else {
        scopeObj.view.flxPrintACK.setVisibility(false);
      }
      scopeObj.view.forceLayout();
      scopeObj.AdjustScreen();
    },
    /**
         * showNoTransactionsUI : Method to handle Empty requests/transactions.
         * @param {object} viewModel,view model
         */
    showNoTransactionsUI: function(viewModel) {
      var scopeObj = this;
      viewModel = viewModel || {};
      scopeObj.view.MyRequestsTabs.flxSort.setVisibility(false);
      scopeObj.view.MyRequestsTabs.flxSortDisputedChecks.setVisibility(false);
      scopeObj.view.MyRequestsTabs.segTransactions.setVisibility(false);
      scopeObj.view.MyRequestsTabs.flxNoTransactions.setVisibility(true);
      //scopeObj.view.MyRequestsTabs.flxSearchContent.setVisibility(false);
      scopeObj.view.MyRequestsTabs.rtxNoPaymentMessage.text = kony.i18n.getLocalizedString(viewModel.noServiceMessage || "i18n.StopPayments.NoStopPaymentRequests");
      if (kony.application.getCurrentBreakpoint() == 640)
        scopeObj.view.MyRequestsTabs.rtxNoPaymentMessage.skin = "sknRtxSSPLight42424215Px";
    },
    /**
         * btnAddNewStopCheckPaymentsClickHandler : My Requests Add New Stop Check Payments button click handler
         */
    btnAddNewStopCheckPaymentsClickHandler: function() {
      this.loadStopPaymentsModule().presentationController.showStopChecksForm();
    },
    /**
         * btnNewChequeBookRequestsClickHandler : My Requests Add New Cheque book request button click handler
         */
    btnNewChequeBookRequestsClickHandler: function() {
      var transMan = applicationManager.getTransactionsListManager();
      var transObj = transMan.getTransactionObject();
      this.loadStopPaymentsModule().presentationController.showRequestChequeBookForm({
        accountID: transObj.fromAccountNumber,
      });
      this.hideAccountTypes();
    },
    /**
         * btnViewDisputedTransactionsClickHandler : View Disputed Transactions button Click Handler
         */
    btnViewDisputedTransactionsClickHandler: function() {
      var scopeObj = this;
      //          this.loadStopPaymentsModule().presentationController.showMyRequests({
      //         selectTab: OLBConstants.DISPUTED_TRANSACTIONS
      //       });
      scopeObj.disputedTransactionsTabClickHandler();
      scopeObj.hideAll();
      scopeObj.view.flxMyRequestsTabs.setVisibility(true);
      scopeObj.view.lblStopPayments.setVisibility(true);
      scopeObj.view.flxAccounts.setVisibility(true);

    },
    /**
         * btnViewDisputedChecks : View Disputed Checks button click handler
         */
    btnViewDisputedChecks: function() {
      var scopeObj = this;
      //       scopeObj.loadStopPaymentsModule().presentationController.showMyRequests({
      //         selectTab: OLBConstants.DISPUTED_CHECKS
      //       });
      scopeObj.disputedChecksTabClickHandler();
      scopeObj.hideAll();
      scopeObj.view.flxMyRequestsTabs.setVisibility(true);
      scopeObj.view.lblStopPayments.setVisibility(true);
      scopeObj.view.flxAccounts.setVisibility(true);

    },
    /**
         * disputedTransactionsTabClickHandler : My Requests Disputed Transactions Tab Click Handler
         */
    disputedTransactionsTabClickHandler: function() {
      var scopeObj = this;
      paymentType = "stopchequePayment";
      scopeObj.setDisputedTransactionTabUI();
      scopeObj.loadStopPaymentsModule().presentationController.fetchStopChequePayment();
      scopeObj.hideAccountTypes();

    },
    /**
         * disputedChecksTabClickHandler : My Requests Disputed Checks Tab Click Handler
         */
    disputedChecksTabClickHandler: function() {
      var scopeObj = this;
	  var configManager = applicationManager.getConfigurationManager();
      paymentType = "chequeBookRequests";
      scopeObj.setDisputedChecksTabUI();
	  // if no permission to view the check book request, show no permission message.
	  var chequeBookReqViewPerm = configManager.checkAccountAction(LandingSelectedAccount,"CHEQUE_BOOK_REQUEST_VIEW");
	  if (chequeBookReqViewPerm) {
		scopeObj.loadStopPaymentsModule().presentationController.fetchTransactionForAccount(); 
	  } else {
		scopeObj.showNoTransactionsUI({noServiceMessage: "i18n.ChequeBookReq.NoViewPermission"})
	  }
      scopeObj.hideAccountTypes();
    },

    btnViewMyChequesClickHandler: function() {
      var scopeObj = this;
      scopeObj.myChequesTabClickHandler();
      scopeObj.hideAll();
      scopeObj.view.flxMyRequestsTabs.setVisibility(true);
      scopeObj.view.lblStopPayments.setVisibility(true);
      scopeObj.view.flxAccounts.setVisibility(true);
    },
    /**
         * myChequesTabClickHandler : My Requests Disputed Checks Tab Click Handler
         */
    myChequesTabClickHandler: function() {
      var scopeObj = this;
      paymentType = "viewMyCheques";
      scopeObj.setMyChequesTabUI();
      scopeObj.loadStopPaymentsModule().presentationController.fetchMyCheques();
      scopeObj.hideAccountTypes();

    },
    /**
         * setServerError : Method to handle Server error
         * @param {boolean} isError, error flag to show/hide error flex.
         */
    setServerError: function(isError) {
      var scopeObj = this;
      scopeObj.view.flxDowntimeWarning.setVisibility(isError);
      if (isError) {
        scopeObj.view.lblDowntimeWarning.text = kony.i18n.getLocalizedString("i18n.common.OoopsServerError");
      }
      scopeObj.view.forceLayout();
    },
    /**
         * showCancelStopRequestUI : show cancel stop request UI
         * @param {object} viewModel , view model object.
         */
    showCancelStopRequestUI: function(viewModel) {
      var scopeObj = this;
      var cancelStopCheckPopup = scopeObj.view.CancelStopCheckPayments;
      var height = scopeObj.getPageHeight();
      cancelStopCheckPopup.lblHeading.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.CancelStopCheckPayment");
      cancelStopCheckPopup.lblPopupMessage.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.AreYouSureToCancelTheRequest");
      if (viewModel.showStopPaymentServiceFeesAndValidity) {
        cancelStopCheckPopup.lblThisServicesIsChargeble.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.ServiveChargeableNew") || "";
        cancelStopCheckPopup.flxPleaseNoteTheFollowingPoints.setVisibility(true);
      } else {
        cancelStopCheckPopup.flxPleaseNoteTheFollowingPoints.setVisibility(false);
      }
      cancelStopCheckPopup.flxPleaseNoteTheFollowingPoints.setVisibility(false);
      //scopeObj.view.flxLogoutStopCheckPayment.height = height + "dp";
      scopeObj.view.flxLogoutStopCheckPayment.left = "0%";
      scopeObj.view.flxDialogs.setVisibility(true);
      scopeObj.view.flxLogoutStopCheckPayment.setVisibility(true);
      scopeObj.view.flxLogoutStopCheckPayment.setFocus(true);
      scopeObj.view.CancelStopCheckPayments.lblPopupMessage.setFocus(true);
      scopeObj.view.CustomPopup.lblHeading.setFocus(true);
      if (CommonUtilities.isCSRMode()) {
        cancelStopCheckPopup.btnYes.onClick = CommonUtilities.disableButtonActionForCSRMode();
        cancelStopCheckPopup.btnYes.skin = CommonUtilities.disableButtonSkinForCSRMode();
        cancelStopCheckPopup.btnYes.hoverSkin = CommonUtilities.disableButtonSkinForCSRMode();
        cancelStopCheckPopup.btnYes.focusSkin = CommonUtilities.disableButtonSkinForCSRMode();
      } else {
        cancelStopCheckPopup.btnYes.onClick = function() {
          scopeObj.view.flxLogoutStopCheckPayment.setVisibility(false);
          scopeObj.view.flxDialogs.setVisibility(false);
          scopeObj.onStopCheckCancel();
        };
      }
    },
    showCancelChequeBookRequestUI: function(Model) {
      var scopeObj = this;
      var cancelStopCheckPopup = scopeObj.view.CancelStopCheckPayments;
      var height = scopeObj.getPageHeight();
      cancelStopCheckPopup.lblHeading.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.CancelChequeBookRequest");
      cancelStopCheckPopup.lblPopupMessage.text = kony.i18n.getLocalizedString("i18n.ChequeBookReq.AreYouSureCancel");
      cancelStopCheckPopup.flxPleaseNoteTheFollowingPoints.setVisibility(false);
      //scopeObj.view.flxLogoutStopCheckPayment.height = height + "dp";
      scopeObj.view.flxLogoutStopCheckPayment.left = "0%";
      scopeObj.view.flxLogoutStopCheckPayment.setVisibility(true);
      scopeObj.view.flxDialogs.setVisibility(true);
      scopeObj.view.flxLogoutStopCheckPayment.setFocus(true);
      scopeObj.view.CancelStopCheckPayments.lblPopupMessage.setFocus(true);
      scopeObj.view.CustomPopup.lblHeading.setFocus(true);
      if (CommonUtilities.isCSRMode()) {
        cancelStopCheckPopup.btnYes.onClick = CommonUtilities.disableButtonActionForCSRMode();
        cancelStopCheckPopup.btnYes.skin = CommonUtilities.disableButtonSkinForCSRMode();
        cancelStopCheckPopup.btnYes.hoverSkin = CommonUtilities.disableButtonSkinForCSRMode();
        cancelStopCheckPopup.btnYes.focusSkin = CommonUtilities.disableButtonSkinForCSRMode();
      } else {
        cancelStopCheckPopup.btnYes.onClick = function() {
          scopeObj.view.flxLogoutStopCheckPayment.setVisibility(false);
          scopeObj.view.flxDialogs.setVisibility(false);
          scopeObj.onChequeBookCancel();
        };
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
      var dateObj = fu.getDateObjectFromCalendarString(dateString, inputFormat);
      var outputDate = fu.getFormatedDateString(dateObj, fu.APPLICATION_DATE_FORMAT);
      return outputDate;
    },
    //UI Code
    /**
         * onBreakpointChange : Handles ui changes on .
         * @member of {frmStopPaymentsController}
         * @param {integer} width - current browser width
         * @return {}
         * @throws {}
         */
    orientationHandler: null,
    onBreakpointChange: function(width) {
      kony.print('on breakpoint change');
      var scope = this;
      this.view.CustomPopup.onBreakpointChangeComponent(scope.view.CustomPopup, width);
      if (this.orientationHandler === null) {
        this.orientationHandler = new OrientationHandler();
      }
      this.orientationHandler.onOrientationChange(this.onBreakpointChange);
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
      this.setupFormOnTouchEnd(width);
      this.setDisputedTransactionTabUI();
      var responsiveFonts = new ResponsiveFonts();
      this.view.lblSuccessAck.text = kony.i18n.getLocalizedString("i18n.StopCheckPayment.SuccessMessage");
      if (Disputeflag == 1) {
        this.view.flxDisputeTransactionDetail.isVisible = true;
      } else {
        this.view.flxDisputeTransactionDetail.isVisible = false;
      }
      this.view.skin = "sknFrmf8f7f8";
      if (width == 640) {
        this.view.lblPayee.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.To");
        this.view.ConfirmPage.flxChequeBookConfirmHeader.lblHeading.skin = "slLabel0d8a72616b3cc47";
//        this.view.ConfirmPage.lblAccountValue.left = "15px";
        this.view.flxTopHeader.height = "0dp";
        this.view.btnNew.isVisible = true;
        this.view.btnNew.zIndex = 1000;
        this.view.flxPleaseNoteTheFollowing.top = "5dp";
        this.view.flxPleaseNoteTheFollowing.left = "2%"
        this.view.flxPleaseNoteTheFollowing.width = "96%"
        // this.view.MyRequestsTabs.flxMainSearchContent.skin="sknbgFBFBFBbre3e3e3";

        this.view.MyRequestsTabs.flxSort.isVisible = false;
        this.view.MyRequestsTabs.flxSortDisputedChecks.isVisible = false;
        this.view.customheadernew.lblHeaderMobile.isVisible = true;
        this.view.lblStopPayments.isVisible = false;
        this.view.lblBillPayAcknowledgement.isVisible = false;
        this.view.lblHeader.isVisible = false;
        this.view.MyRequestsTabs.flxMyRequestsHeader.isVisible = false;

        //this.view.StopCheckPaymentSeriesMultiple.btnCancel.left="2%";
        //this.view.StopCheckPaymentSeriesMultiple.btnCancel.width="96%"
        this.view.btnCancel2.left = "10dp";
        this.view.btnCancel2.width = this.view.btnModify2.width;
        //this.view.StopCheckPaymentSeriesMultiple.btnCancel.top="85dp"
        this.view.btnCancel2.width = this.view.btnModify2.width;
        //         this.view.StopCheckPaymentSeriesMultiple.btnCancel.left="2%";
        //         this.view.StopCheckPaymentSeriesMultiple.btnCancel.width="96%";
        //         this.view.StopCheckPaymentSeriesMultiple.btnCancel.centerY="";
        if (this.view.lblDowntimeWarning.info.frame.height > 50) {
          this.view.flxDowntimeWarning.height = this.view.lblDowntimeWarning.info.frame.height + 10 + "dp";
        } else {
          this.view.flxDowntimeWarning.height = "60dp";
        }
        responsiveFonts.setMobileFonts();
      } else {
        this.view.btnNew.isVisible = false;
        this.view.flxTopHeader.height = "25px";
        this.view.MyRequestsTabs.flxSort.isVisible = false;
        this.view.MyRequestsTabs.flxSortDisputedChecks.isVisible = false;
        this.view.customheadernew.lblHeaderMobile.isVisible = false;
        this.view.lblBillPayAcknowledgement.isVisible = true;
        this.view.lblStopPayments.isVisible = true;
		this.view.lblStopPayments.text = kony.i18n.getLocalizedString("i18n.olb.chequeManagement.chequeManagement");
        this.view.lblHeader.isVisible = true;
        this.view.flxTopHeader.isVisible = true;
        this.view.MyRequestsTabs.flxMyRequestsHeader.isVisible = false;
        //         this.view.StopCheckPaymentSeriesMultiple.btnCancel.right="170dp";
        //         this.view.StopCheckPaymentSeriesMultiple.btnCancel.left="";
        //         this.view.StopCheckPaymentSeriesMultiple.btnCancel.width="150dp";
        //         this.view.StopCheckPaymentSeriesMultiple.btnCancel.centerY="";
        //         this.view.StopCheckPaymentSeriesMultiple.btnCancel.top="10dp";
        responsiveFonts.setDesktopFonts();
      }
      this.view.customheadernew.lblHeaderMobile.skin = "sknSSPLblFFFFFF15Px";
      if (width == 1366 || width == 1380) {
        this.view.MyRequestsTabs.lblMyRequestsHeader.skin = "sknSSP42424220Px";
      }
      if (width == 1024) {
        this.view.MyRequestsTabs.lblMyRequestsHeader.skin = "sknlbl424242SSPReg17px";
        this.view.btnCancel2.left = "23.2%";
        this.view.btnCancel2.width = "21.6%";
        //this.view.StopCheckPaymentSeriesMultiple.btnCancel.right = "200dp";
        this.view.btnCancelStopCheck.width = "150dp";
      }
      this.AdjustScreen();
    },
    setupFormOnTouchEnd: function(width) {
      var scope = this;
      if (width == 640) {
        this.view.onTouchEnd = function() {}
        this.nullifyPopupOnTouchStart();
      } else {
        if (width == 1024) {
          this.view.onTouchEnd = function() {}
          this.nullifyPopupOnTouchStart();
        } else {
          this.view.onTouchEnd = function() {
            scope.hidePopups();
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
    hidePopups: function() {
            var currFormObj = kony.application.getCurrentForm();
            if (currFormObj.customheadernew.flxContextualMenu.isVisible === true) {
                setTimeout(function() {
                    currFormObj.customheadernew.flxContextualMenu.setVisibility(false);
                    currFormObj.customheadernew.imgLblTransfers.text = "O";
					currFormObj.customheadernew.flxTransfersAndPay.skin = "flxHoverSkinPointer";
                }, "17ms")
            }
    },
    bindTnCData: function(TnCcontent) {
      if (TnCcontent.alreadySigned) {
        this.view.flxStopCheckSeriesMultipleTCCheckBox.setVisibility(false);
      } else {
        this.view.flxStopCheckSeriesMultipleTCCheckBox.setVisibility(true);
        if (TnCcontent.contentTypeId === OLBConstants.TERMS_AND_CONDITIONS_URL) {
          this.view.btnTAndC.onClick = function() {
            window.open(TnCcontent.termsAndConditionsContent);
          }
        } else {
          this.view.btnTAndC.onClick = this.showTermsAndConditionPopUp;
          this.setTnCDATASection(TnCcontent.termsAndConditionsContent);
          FormControllerUtility.setHtmlToBrowserWidget(this, this.view.brwBodyTnC, TnCcontent.termsAndConditionsContent);
        }
        this.view.flxClose.onClick = this.hideTermsAndConditionPopUp;
      }
    },
    showTermsAndConditionPopUp: function() {
//      var height = this.view.flxHeader.frame.height + this.view.flxContainer.frame.height + this.view.flxFooter.frame.height;
//      this.view.flxTermsAndConditions.height = height + "dp";
      this.view.flxTermsAndConditions.setVisibility(true);
      this.view.forceLayout();
    },
    hideTermsAndConditionPopUp: function() {
      this.view.flxTermsAndConditions.setVisibility(false);
    },
    setTnCDATASection: function(content) {
      this.view.rtxTC.text = content;
    },
    /* Stop Cheque Requests Tab
         */
    bindTransactions: function(data) {
      scopeObj = this;
      var widgetDataMap = {
        "lblDate": "lblDate",
        "lblDescription": "lblDescription",
        "lblReferenceNo": "lblReferenceNo",
        "lblAmount": "lblAmount",
        "imgDropDown": "imgDropDown",
        "lblReason": "lblReason",
        "lblSeparator12": "lblSeparator12",
        "lblPayeeName": "lblPayeeName",
        "lblExpiresOnKey": "lblExpiresOnKey",
        "lblExpiresOnKey0": "lblExpiresOnKey0",
        "lblChequeManagementFee": "lblChequeManagementFee",
        "lblChequeManagementNotes": "lblChequeManagementNotes",
        "lblDateOfDescriptionKey": "lblDateOfDescriptionKey",
        "lblExpiresOnData": "lblExpiresOnData",
        "lblChequeDate": "lblChequeDate",
        "lblFromAccountData": "lblFromAccountData",
        "lblExpiresOnData0": "lblExpiresOnData0",
        "lblDateOfDescriptionValue": "lblDateOfDescriptionValue",
        "lblStatus": "lblStatus",
        "lblReasonKey": "lblReasonKey",
        "lblTransactionTypeValue": "lblTransactionTypeValue",
        "lblToAccountData": "lblToAccountData",
        "flxDisputedTransactionsUnSelectedWrapperMobile": "flxDisputedTransactionsUnSelectedWrapperMobile",
        "flxDisputedTransactionsSelectedWrapperMobile": "flxDisputedTransactionsSelectedWrapperMobile",
        "flxChequeManagementUnSelectedTablet": "flxChequeManagementUnSelectedTablet",
        "flxChequeManagementSelectedTablet": "flxChequeManagementSelectedTablet",
        "flxChequeManagementUnSelectedWrapper": "flxChequeManagementUnSelectedWrapper",
        "flxChequeManagementSelectedWrapper": "flxChequeManagementSelectedWrapper",
        "btnRevoke": "btnRevoke"
      };
      var stopCheckSegmentData = data.map(function(dataItem) {
        var dataObject = {
          "lblDate": dataItem.lblDate,
          "lblDescription": dataItem.lblDescription,
          "lblReferenceNo": dataItem.lblReferenceNo,
          "lblAmount": dataItem.lblAmount,
          "imgDropDown": OLBConstants.IMAGES.ARRAOW_DOWN,
          "lblReason": dataItem.lblReason,
          "lblSeparator12": dataItem.lblSeparator12,
          "lblPayeeName": dataItem.lblPayeeName,
          "lblExpiresOnKey": dataItem.lblExpiresOnKey,
          "lblExpiresOnKey0": dataItem.lblExpiresOnKey0,
          "lblChequeManagementFee": dataItem.lblChequeManagementFee,
          "lblChequeManagementNotes": dataItem.lblChequeManagementNotes,
          "lblDateOfDescriptionKey": dataItem.lblDateOfDescriptionKey,
          "lblExpiresOnData": dataItem.lblExpiresOnData,
          "lblChequeDate": {
            isVisible: false
          },
          "lblFromAccountData": {
            isVisible: false
          },
          "lblExpiresOnData0": dataItem.lblExpiresOnData0,
          "lblDateOfDescriptionValue": dataItem.lblDateOfDescriptionValue,
          "lblStatus": dataItem.lblStatus,
          "lblReasonKey": dataItem.lblReasonKey,
          "lblTransactionTypeValue": dataItem.lblTransactionTypeValue,
          "lblToAccountData": dataItem.lblToAccountData,
          "flxDisputedTransactionsUnSelectedWrapperMobile": {
            "text": "flxDisputedTransactionsUnSelectedWrapperMobile"
          },
          "flxDisputedTransactionsSelectedWrapperMobile": {
            "text": "flxDisputedTransactionsSelectedWrapperMobile"
          },
          "flxChequeManagementUnSelectedTablet": {
            "text": "flxChequeManagementUnSelectedTablet"
          },
          "flxChequeManagementSelectedTablet": {
            "text": "flxChequeManagementSelectedTablet"
          },
          "flxChequeManagementUnSelectedWrapper": {
            "text": "flxChequeManagementUnSelectedWrapper"
          },
          "flxChequeManagementSelectedWrapper": {
            "text": "flxChequeManagementSelectedWrapper"
          },
          btnRevoke: {
            isVisible: false,
          }
        };
        stopCheckError=dataObject;
        return dataObject;
      });
      this.view.MyRequestsTabs.segTransactions.widgetDataMap = widgetDataMap;
      this.view.MyRequestsTabs.flxSortDisputedChecks.setVisibility(false);
      this.view.MyRequestsTabs.flxSort.setVisibility(true);
      this.view.MyRequestsTabs.flxMyCheques.setVisibility(false);
      this.view.MyRequestsTabs.rtxNoPaymentMessage.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.noRecordsFound");
      this.view.MyRequestsTabs.flxNoTransactions.setVisibility(true);
      this.view.MyRequestsTabs.segTransactions.setVisibility(false);
      if (data.length > 0) {
        this.view.MyRequestsTabs.flxNoTransactions.setVisibility(false);
        this.view.MyRequestsTabs.segTransactions.setVisibility(true);
        if (kony.application.getCurrentBreakpoint() === 640) {
          for (var i = 0; i < data.length; i++) {
            stopCheckSegmentData[i].template = "flxDisputedTransactionsUnSelectedWrapperMobile";
          }
          this.view.MyRequestsTabs.segTransactions.setVisibility(true);
          this.view.MyRequestsTabs.flxTabs.setVisibility(true);
          this.view.lblStopPayments.setVisibility(false);
          this.view.btnNew.setVisibility(false);
        } else if (kony.application.getCurrentBreakpoint() === 1024) {
          for (var i = 0; i < data.length; i++) {
            stopCheckSegmentData[i].template = "flxChequeManagementUnSelectedTablet";
          }
          this.view.MyRequestsTabs.segTransactions.setVisibility(true);
        } else if (kony.application.getCurrentBreakpoint() === 1366 || 1380) {
          for (var i = 0; i < data.length; i++) {
            stopCheckSegmentData[i].template = "flxChequeManagementUnSelectedWrapper";
          }
          this.view.MyRequestsTabs.segTransactions.setVisibility(true);
        }
        this.view.MyRequestsTabs.segTransactions.setData(stopCheckSegmentData);
      }
      applicationManager.getPresentationUtility().dismissLoadingScreen();
      this.view.forceLayout();
      this.AdjustScreen();
    },

    /* Cheque Book Requests Tab
         */
    bindChequeBookRequests: function(data) {
      // capitalize each word from status
      for (var x of data){
        var splitLabel = x.lblStatus.split(' ');
        for(i=0; i<splitLabel.length; i++) {
          splitLabel[i] = splitLabel[i].charAt(0).toUpperCase() + splitLabel[i].substring(1).toLowerCase();
        }
        var joinLabel = splitLabel.join(" ");
        x.lblStatus = joinLabel;
      }
      var widgetDataMap = {
        "lblDate": "lblDate",
        "lblAmount": "lblAmount",
        "imgDropDown": "imgDropDown",
        "lblDescription": "lblDescription",
        "lblReferenceNo": "lblReferenceNo",
        "lblStatus": "lblStatus",
        "lblExpiresOnKey": "lblExpiresOnKey",
        "lblExpiresOnKey0": "lblExpiresOnKey0",
        "lblSeparator12": "lblSeparator12",
        "lblReason": "lblReason",
        "lblSeparator": "lblSeparator12",
        "lblPayeeName": "lblPayeeName",
        "lblToAccountData": "lblToAccountData",
        "lblDateOfDescriptionKey": "lblDateOfDescriptionKey",
        "lblDateOfDescriptionValue": "lblDateOfDescriptionValue",
        "lblChequeManagementNotes": "lblChequeManagementNotes",
        "lblChequeManagementFee": "lblChequeManagementFee",
        "lblRefNo": "lblRefNo",
        "lblCurrency": "lblCurrency",
        "lblReferenceDataVertical": "lblReferenceDataVertical",
        "lblExpiresOnData": "lblExpiresOnData",
        "lblExpiresOnData0": "lblExpiresOnData0",
        "lblChequeDate": "lblChequeDate",
        "lblFromAccountData": "lblFromAccountData",
        //"lblReasonKey":"lblReasonKey",
        //"lblTransactionTypeValue":"lblTransactionTypeValue",
        "flxDisputedtransactionsUnSelectedMobile": "flxDisputedtransactionsUnSelectedMobile",
        "flxDisputedtransactionsSelectedMobile": "flxDisputedtransactionsSelectedMobile",
        "flxDisputedChecksUnSelectedWrapperTablet": "flxDisputedChecksUnSelectedWrapperTablet",
        "flxDisputedChecksSelectedWrapperTablet": "flxDisputedChecksSelectedWrapperTablet",
        "flxChequeManagementUnSelectedWrapper": "flxChequeManagementUnSelectedWrapper",
        "flxChequeManagementSelectedWrapper": "flxChequeManagementSelectedWrapper",
        "btnRevoke": "btnRevoke"
      };
      var chequeBookRequestSegmentData = data.map(function(itemData) {
        var objData = {
          "lblDate": itemData.lblDate,
          "lblAmount": itemData.lblAmount,
          "imgDropDown": OLBConstants.IMAGES.ARRAOW_DOWN,
          "lblDescription": itemData.lblDescription,
          "lblReferenceNo": itemData.lblReferenceNo,
          "lblStatus": itemData.lblStatus,
          "lblExpiresOnKey": itemData.lblExpiresOnKey,
          "lblExpiresOnKey0": itemData.lblExpiresOnKey0,
          "lblSeparator12": itemData.lblSeparator12,
          "lblReason": itemData.lblReason,
          "lblSeparator": itemData.lblSeparator12,
          "lblPayeeName": itemData.lblPayeeName,
          "lblToAccountData": itemData.lblToAccountData,
          "lblDateOfDescriptionKey": itemData.lblDateOfDescriptionKey,
          "lblDateOfDescriptionValue": itemData.lblDateOfDescriptionValue,
          "lblChequeManagementNotes": itemData.lblChequeManagementNotes,
          "lblChequeManagementFee": itemData.lblChequeManagementFee,
          "lblRefNo": itemData.lblRefNo,
          "lblCurrency": itemData.lblCurrency,
          "lblReferenceDataVertical": itemData.lblReferenceDataVertical,
          "lblExpiresOnData": itemData.lblExpiresOnData,
          "lblExpiresOnData0": itemData.lblExpiresOnData0,
          "lblChequeDate": itemData.lblChequeDate,
          "lblFromAccountData": itemData.lblFromAccountData,
          "flxDisputedtransactionsUnSelectedMobile": "flxDisputedtransactionsUnSelectedMobile",
          "flxDisputedtransactionsSelectedMobile": "flxDisputedtransactionsSelectedMobile",
          "flxDisputedChecksUnSelectedWrapperTablet": "flxDisputedChecksUnSelectedWrapperTablet",
          "flxDisputedChecksSelectedWrapperTablet": "flxDisputedChecksSelectedWrapperTablet",
          "flxChequeManagementUnSelectedWrapper": "flxChequeManagementUnSelectedWrapper",
          "flxChequeManagementSelectedWrapper": "flxChequeManagementSelectedWrapper",
          btnRevoke: {
            isVisible: false,
          }
        };
        return objData;
      });
      this.view.MyRequestsTabs.segTransactions.widgetDataMap = widgetDataMap;
      this.view.MyRequestsTabs.flxSortDisputedChecks.setVisibility(true);
      this.view.MyRequestsTabs.flxSort.setVisibility(false);
      this.view.MyRequestsTabs.flxMyCheques.setVisibility(false);
      this.view.MyRequestsTabs.btnStopChequeRequestsMobile.setVisibility(false);
      this.view.MyRequestsTabs.rtxNoPaymentMessage.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.noRecordsFound");
      this.view.MyRequestsTabs.flxNoTransactions.setVisibility(true);
      this.view.MyRequestsTabs.segTransactions.setVisibility(false);
      if (data.length > 0) {
        this.view.MyRequestsTabs.flxNoTransactions.setVisibility(false);
        this.view.MyRequestsTabs.segTransactions.setVisibility(true);
        if (kony.application.getCurrentBreakpoint() === 640) {
          for (var i = 0; i < data.length; i++) {
            chequeBookRequestSegmentData[i].template = "flxChequeBookReqUnSelectedMobile";
          }
          this.view.MyRequestsTabs.segTransactions.setVisibility(true);
          this.view.MyRequestsTabs.flxTabs.setVisibility(true);
          this.view.btnNew.setVisibility(false);
          this.view.lblStopPayments.setVisibility(false);
          this.view.MyRequestsTabs.btnChequeBookRequestsMobile.setVisibility(true);
          this.view.MyRequestsTabs.btnDisputedTrnsactions.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.DisputedTransactionsMobile");
          this.view.MyRequestsTabs.btnDisputedChecks.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.DisputedChecksMobile");
        } else if (kony.application.getCurrentBreakpoint() === 1024) {
          for (var i = 0; i < data.length; i++) {
            chequeBookRequestSegmentData[i].template = "flxDisputedChecksUnSelectedWrapperTablet";
          }
          this.view.MyRequestsTabs.segTransactions.setVisibility(true);
          this.view.MyRequestsTabs.btnDisputedTrnsactions.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.DisputedTransactionsMobile");
          this.view.MyRequestsTabs.btnDisputedChecks.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.DisputedChecksMobile");
        } else if (kony.application.getCurrentBreakpoint() === 1366 || 1380) {
          for (var i = 0; i < data.length; i++) {
            chequeBookRequestSegmentData[i].template = "flxChequeManagementUnSelectedWrapper";
          }
          this.view.MyRequestsTabs.segTransactions.setVisibility(true);
          this.view.MyRequestsTabs.btnDisputedChecks.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.ChequeBookRequests");
          this.view.MyRequestsTabs.btnDisputedTrnsactions.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.StopChequeRequest");
        }
        this.view.MyRequestsTabs.segTransactions.setData(chequeBookRequestSegmentData);
      }
      applicationManager.getPresentationUtility().dismissLoadingScreen();
      this.view.forceLayout();
      this.AdjustScreen();

    },

    /* My Cheques Tab */
    bindMyChequeRequests: function(data) {
      scopeObj = this;
      var widgetDataMap = {
        "lblDescription": "lblDescription",
        "lblPayeeName": "lblPayeeName",
        "imgDropDown": "imgDropDown",
        "lblSeparator12": "lblSeparator12",
        "lblAmount": "lblAmount",
        "lblReferenceNo": "lblReferenceNo",
        "lblStatus": "lblStatus",
        "lblDate": "lblDate",
        "lblToAccountData": "lblToAccountData",
        "lblCurrency": "lblCurrency",
        "lblExpiresOnKey": "lblExpiresOnKey",
        "lblExpiresOnData": "lblExpiresOnData",
        "lblChequeDate": "lblChequeDate",
        "lblDateVertical": "lblDateVertical",
        "lblExpiresOnKey0": "lblExpiresOnKey0",
        "lblExpiresOnData0": "lblExpiresOnData0",
        "lblDateOfDescriptionKey": "lblDateOfDescriptionKey",
        "lblDateOfDescriptionValue": "lblDateOfDescriptionValue",
        "lblChequeManagementNotes": "lblChequeManagementNotes",
        "lblTransactionTypeValue": "lblTransactionTypeValue",
        "lblChequeManagementFee": "lblChequeManagementFee",
        "lblReasonKey": "lblReasonKey",
        "lblFromAccountData": "lblFromAccountData",
        "flxChequeManagementUnSelectedWrapperMobile": "flxChequeManagementUnSelectedWrapperMobile",
        "flxChequeManagementSelectedWrapperMobile": "flxChequeManagementSelectedWrapperMobile",
        "flxMyChequeUnSelectedTablet": "flxMyChequeUnSelectedTablet",
        "flxMyChequeSelectedTablet": "flxMyChequeSelectedTablet",
        "flxChequeManagementUnSelectedWrapper": "flxChequeManagementUnSelectedWrapper",
        "flxChequeManagementSelectedWrapper": "flxChequeManagementSelectedWrapper",
        "btnRevoke": "btnRevoke"
      };
      var myChequesSegmentData = data.map(function(itemData) {
        var objectData = {
          "lblDescription": itemData.lblDescription,
          "lblPayeeName": itemData.lblPayeeName,
          "imgDropDown": OLBConstants.IMAGES.ARRAOW_DOWN,
          "lblSeparator12": itemData.lblSeparator12,
          "lblAmount": itemData.lblAmount,
          "lblReferenceNo": itemData.lblReferenceNo,
          "lblStatus": itemData.lblStatus,
          "lblDate": itemData.lblDate,
          "lblChequeTypeId": itemData.lblChequeTypeId,
          "lblToAccountData": itemData.lblToAccountData,
          "lblCurrency": itemData.lblCurrency,
          "lblExpiresOnKey": itemData.lblExpiresOnKey,
          "lblExpiresOnData": itemData.lblExpiresOnData,
          "lblChequeDate": itemData.lblChequeDate,
          "lblDateVertical": itemData.lblDateVertical,
          "lblExpiresOnKey0": itemData.lblExpiresOnKey0,
          "lblExpiresOnData0": itemData.lblExpiresOnData0,
          "lblDateOfDescriptionKey": itemData.lblDateOfDescriptionKey,
          "lblDateOfDescriptionValue": itemData.lblDateOfDescriptionValue,
          "lblChequeManagementNotes": itemData.lblChequeManagementNotes,
          "lblTransactionTypeValue": itemData.lblTransactionTypeValue,
          "lblChequeManagementFee": itemData.lblChequeManagementFee,
          "lblReasonKey": itemData.lblReasonKey,
          "lblFromAccountData": itemData.lblFromAccountData,
          "flxChequeManagementUnSelectedWrapperMobile": "flxChequeManagementUnSelectedWrapperMobile",
          "flxChequeManagementSelectedWrapperMobile": "flxChequeManagementSelectedWrapperMobile",
          "flxMyChequeUnSelectedTablet": "flxMyChequeUnSelectedTablet",
          "flxMyChequeSelectedTablet": "flxMyChequeSelectedTablet",
          "flxChequeManagementUnSelectedWrapper": "flxChequeManagementUnSelectedWrapper",
          "flxChequeManagementSelectedWrapper": "flxChequeManagementSelectedWrapper",
          btnRevoke: {
            isVisible: hasRevokeStopPaymentFeat ? true : false,
            "onClick": function() {
              scopeObj.showRevokePopup(itemData);
            }
          },
        };
        return objectData;
      });
      this.view.MyRequestsTabs.segTransactions.widgetDataMap = widgetDataMap;
      this.view.MyRequestsTabs.flxSortDisputedChecks.setVisibility(false);
      this.view.MyRequestsTabs.flxSort.setVisibility(false);
      this.view.MyRequestsTabs.flxMyCheques.setVisibility(true);
      this.view.MyRequestsTabs.rtxNoPaymentMessage.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.noRecordsFound");
      this.view.MyRequestsTabs.flxNoTransactions.setVisibility(true);
      this.view.MyRequestsTabs.btnStopChequeRequestsMobile.setVisibility(false);
      this.view.MyRequestsTabs.segTransactions.setVisibility(false);
      if (kony.application.getCurrentBreakpoint() === 640) {               
        this.view.MyRequestsTabs.flxMyCheques.setVisibility(false);                 
        if (data.length == 0) { 
          this.view.MyRequestsTabs.SearchContainer.setVisibility(false);  
        } else {
          this.view.MyRequestsTabs.SearchContainer.setVisibility(true);  
        }  
      }
      if (data.length > 0) {
        this.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(true);
        this.view.MyRequestsTabs.flxNoTransactions.setVisibility(false);
        this.view.MyRequestsTabs.segTransactions.setVisibility(true);
        if (kony.application.getCurrentBreakpoint() === 640) {
          for (var i = 0; i < data.length; i++) {
            myChequesSegmentData[i].template = "flxChequeManagementUnSelectedWrapperMobile";
          }
          this.view.MyRequestsTabs.segTransactions.setVisibility(true);
          this.view.MyRequestsTabs.flxTabs.setVisibility(true);
          this.view.lblStopPayments.setVisibility(false);
          this.view.MyRequestsTabs.flxMyCheques.setVisibility(false);
          this.view.MyRequestsTabs.btnStopChequeRequestsMobile.setVisibility(true);
          this.view.btnNew.setVisibility(false);
          this.view.MyRequestsTabs.btnDisputedTrnsactions.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.DisputedTransactionsMobile");
          this.view.MyRequestsTabs.btnDisputedChecks.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.DisputedChecksMobile");
        } else if (kony.application.getCurrentBreakpoint() === 1024) {
          for (var i = 0; i < data.length; i++) {
            myChequesSegmentData[i].template = "flxMyChequeUnSelectedTablet";
          }
          this.view.MyRequestsTabs.segTransactions.setVisibility(true);
          this.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(true);
          this.view.MyRequestsTabs.btnDisputedTrnsactions.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.DisputedTransactionsMobile");
          this.view.MyRequestsTabs.btnDisputedChecks.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.DisputedChecksMobile");
        } else if (kony.application.getCurrentBreakpoint() === 1366 || 1380) {
          for (var i = 0; i < data.length; i++) {
            myChequesSegmentData[i].template = "flxChequeManagementUnSelectedWrapper";
          }
          this.view.MyRequestsTabs.segTransactions.setVisibility(true);
          this.view.MyRequestsTabs.SearchContainer.flxSearchContent.setVisibility(true);
          this.view.MyRequestsTabs.btnDisputedChecks.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.ChequeBookRequests");
          this.view.MyRequestsTabs.btnDisputedTrnsactions.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.StopChequeRequest");
        }
        this.view.MyRequestsTabs.segTransactions.setData(myChequesSegmentData);
      }
      applicationManager.getPresentationUtility().dismissLoadingScreen();
      this.view.forceLayout();
      this.AdjustScreen();
    },
    bindMyChequeError: function() {
      this.view.MyRequestsTabs.flxSortDisputedChecks.setVisibility(false);
      this.view.MyRequestsTabs.flxSort.setVisibility(false);
      this.view.MyRequestsTabs.flxMyCheques.setVisibility(false);
      this.view.MyRequestsTabs.flxNoTransactions.setVisibility(true);
      this.view.MyRequestsTabs.btnStopChequeRequestsMobile.setVisibility(false);
      this.view.MyRequestsTabs.segTransactions.setVisibility(false);
      this.view.forceLayout();
      this.AdjustScreen();
    },
    // go to Revoke Stop Check Acknowledgement screen
    showRevokeStopCheckAcknowledgement: function(viewModel) {
      var scopeObj = this;
      //scopeObj.showStopChekRequestAcknowledgment(viewModel);
      scopeObj.view.flxLoading.setVisibility(false);
      scopeObj.hideAll();
      scopeObj.view.flxAcknowledgement.setVisibility(true);

      scopeObj.view.flxAcknowledgementMain.width = "87.84%";
      if (kony.application.getCurrentBreakpoint() === 640) {
        scopeObj.view.flxAcknowledgementMain.centerX = "50%";
        scopeObj.view.btnMakeTransfer.top = "605px";
        scopeObj.view.btnAddAnotherAccount.top = "550px";
      }
      scopeObj.view.acknowledgmentMyRequests.lblRefrenceNumberValue.text = viewModel.referenceId;
      scopeObj.view.acknowledgmentMyRequests.lblRefrenceNumberValue.setVisibility(true);
      scopeObj.view.flxAccounts.setVisibility(false);
      scopeObj.view.flxTransactionDetails.setVisibility(false);
      scopeObj.view.lblBillPayAcknowledgement.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.RevokeStopChequeRequest.Acknowledgement");
      scopeObj.view.acknowledgmentMyRequests.lblTransactionMessage.text = kony.i18n.getLocalizedString("i18n.ChequeManagement.RevokeStopChequeRequest.AcknowledgementSuccess");

      scopeObj.view.btnMakeTransfer.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.GoToAccountDetail");
      scopeObj.view.btnMakeTransfer.onClick = viewModel.onBacktoAccountDetails.bind(viewModel);
      scopeObj.view.btnAddAnotherAccount.text = kony.i18n.getLocalizedString("i18n.StopCheckPayments.ViewRequests");
      scopeObj.view.btnAddAnotherAccount.onClick = this.btnViewMyChequesClickHandler;

      scopeObj.view.forceLayout();
      scopeObj.AdjustScreen();
    },
    /**
         * show or hide revoke popup
         */
    showRevokePopup: function(viewModel) {
      var scopeObj = this;
      viewModel.revokeDate = this.bankDate;
      scopeObj.view.flxDialogRevoke.setVisibility(true);
      scopeObj.view.flxRevokePopup.setVisibility(true);
      if (kony.application.getCurrentBreakpoint() === 640) {
        scopeObj.view.RevokeStopCheckPayments.centerY = "50%";
        scopeObj.view.RevokeStopCheckPayments.width = "87.84%";
      }
      scopeObj.view.RevokeStopCheckPayments.flxSubmitBtnWrapper.btnYes.onClick = function() {
        scopeObj.view.flxDialogRevoke.setVisibility(false);
        scopeObj.view.flxRevokePopup.setVisibility(false);
        scopeObj.presenter.updateRevokeStopChequePayment(viewModel);
      };
      scopeObj.view.RevokeStopCheckPayments.flxSubmitBtnWrapper.btnNo.onClick = function() {
        scopeObj.view.flxDialogRevoke.setVisibility(false);
        scopeObj.view.flxRevokePopup.setVisibility(false);
      }
      scopeObj.view.RevokeStopCheckPayments.flxCross.onClick = function() {
        scopeObj.view.flxDialogRevoke.setVisibility(false);
        scopeObj.view.flxRevokePopup.setVisibility(false);
      }
    },
    /**
         * Method to set the current working bank date
         * @param {Object} bankDateObj object containing bank date
         */
    setBankDate: function(bankDateObj) {      
      var scopeObj = this;
      var formatUtil = applicationManager.getFormatUtilManager();
      scopeObj.bankDate = bankDateObj;
      var serverDate = CommonUtilities.getServerDateObject();
      var formatServerDate = formatUtil.getFormatedDateString(serverDate, formatUtil.getBackendDateFormat());
      this.bankDate = bankDateObj.currentWorkingDate || formatServerDate;
    },
    /**
         * Method to create Accounts List segment view model
         * @param {JSON} account Account for which you want to create view Model
         * @returns {JSON} View model
         */
    createCombinedAccountListSegmentsModel: function(account) {
      return {
        "lblDefaultAccountName": {
          "text": account.accountName,
          "toolTip": account.accountName,
          "left": "17dp"
        },
        "accountID": account.Account_id || account.accountID || account.accountNumber,
        "processedName":account.accountName,
        "lblDefaultAccountIcon": {
          "text": account.isBusinessAccount === "true" ? "r" : "s",
          //"isVisible":(applicationManager.getConfigurationManager().isCombinedUser==="true")?true:false,
          "isVisible": this.profileAccess === "both" ? true : false,
        },
        "lblSeparator": "Separator",
        "currencySymbol": applicationManager.getFormatUtilManager().getCurrencySymbol(account.currencyCode),
        "lblAmount": (account.type !== "CreditCard") ? CommonUtilities.formatCurrencyWithCommas(account.availableBalance, false, account.currencyCode) : CommonUtilities.formatCurrencyWithCommas(account.availableCredit, false, account.currencyCode),
        /* "flxRowDefaultAccounts": {
                    "onClick": this.segAccountTypesRowClick
                }, */
        template: kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile ? "flxRowDefaultAccounts" : "flxRowDefaultAccounts"
      };
    },
    renderCalendars: function () {
      var context1 = {
        "widget": this.view.calDateOfIssue,
        "anchor": "bottom"
      };
      this.view.calDateOfIssue.setContext(context1);
    },

    /**
         * creates segment with account numbers and other details with particular header values
         */
    getAccountTypesDataWithSections: function(accounts) {
      var scopeObj = this;
      var finalData = {};
      var isCombinedUser = applicationManager.getConfigurationManager().isCombinedUser;
      var prioritizeAccountTypes = [];
      //       if(isCombinedUser==="true"){
      prioritizeAccountTypes.push("Personal Accounts");
      //       }
      accounts.forEach(function(account) {
        var accountType = "Personal Accounts";
        if (account.isBusinessAccount === "true") {
          if (kony.sdk.isNullOrUndefined(account.MembershipName))
            accountType = "Business Accounts";
          else
            accountType = account.MembershipName;
        }

        if (finalData.hasOwnProperty(accountType)) {
          if (finalData[accountType][1][finalData[accountType][1].length - 1].length === 0) {
            finalData[accountType][1].pop();
          }
          finalData[accountType][1].push(scopeObj.createCombinedAccountListSegmentsModel(account));
        } else {
          if (accountType != "Personal Accounts") prioritizeAccountTypes.push(accountType);
          finalData[accountType] = [{
            lblTransactionHeader: accountType,
            lblSeparator: {
              "isVisible": "true"
            },
            imgDropDown: "P",
            flxDropDown: {
              "onClick": function(context) {
                scopeObj.showOrHideAccountRows(context);
              }.bind(this),
              "isVisible": false
            },
            template: "flxTransfersFromListHeader"
          },
                                    [scopeObj.createCombinedAccountListSegmentsModel(account)]
                                   ];
        }
      });
      var data = [];
      for (var key in prioritizeAccountTypes) {
        var accountType = prioritizeAccountTypes[key];
        if (finalData.hasOwnProperty(accountType)) {
          data.push(finalData[accountType]);
        }
      }
      return data;
    },
  }
});
