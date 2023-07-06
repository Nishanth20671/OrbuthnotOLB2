define(["FormControllerUtility", "CommonUtilities", "OLBConstants"], function (FormControllerUtility, CommonUtilities, OLBConstants) {
  const NA = kony.i18n.getLocalizedString("i18n.common.NA");
  let presenter, contentScope, popupScope, titleActionScope, breakpoint;
  return {
    /**
     * Sets the initial actions for form
     */
    init: function () {
      this.view.preShow = this.preShow;
      this.view.postShow = this.postShow;
      this.view.onDeviceBack = function () { };
      this.view.onBreakpointChange = this.onBreakpointChange;
      this.view.formTemplate12.onError = this.onError;
      this.initFormActions();
    },
    onBreakpointChange: function (form, width) {
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      breakpoint = kony.application.getCurrentBreakpoint();
    },
    /**
     * Performs the actions required before rendering form
     */
    preShow: function () {
      popupScope.flxReturnedHistoryContainer.doLayout = CommonUtilities.centerPopupFlex;
      this.view.formTemplate12.hideBannerError();
      this.setOverviewDetails();
    },
    /**
     * Performs the actions required after rendering form
     */
    postShow: function () {
      applicationManager.getNavigationManager().applyUpdates(this);
      let roadmapData = [];
      for (const [key, value] of Object.entries(presenter.billRoadmap)) {
        roadmapData.push({
          'currentRow': key === 'step3',
          'rowLabel': value,
          'rowStatus': presenter.billData[key] === 'done' ? 'done' : key === 'step3' ? 'Inprogress' : 'Incomplete'
        });
      }
      roadmapData['showCopyDetails'] = false;
      contentScope.ProgressTracker.setData(roadmapData);
      contentScope.flxRightContainer.setVisibility(true);
      if (kony.application.getCurrentBreakpoint() > 1024) {
        contentScope.flxLeftContainer.width = "66.25%";
      }
      contentScope.lblBillDetailsHeading.text = kony.i18n.getLocalizedString('kony.mb.BillPay.BillDetails');
      contentScope.flxActions.setVisibility(true);
      contentScope.flxAckActions.setVisibility(false);
      contentScope.BillDetails.setContext({ data: JSON.parse(JSON.stringify(presenter.billData.status === OLBConstants.BILLS_STATUS.RETURNED_BY_BANK ? presenter.revisedBillData : presenter.billData)), flow: 'create' });
    },
    /**
     * Method to initialise form actions
     */
    initFormActions: function () {
      const scope = this;
      presenter = applicationManager.getModulesPresentationController({ appName: 'TradeSupplyFinMA', moduleName: 'BillsUIModule' });
      contentScope = this.view.formTemplate12.flxContentTCCenter;
      popupScope = this.view.formTemplate12.flxContentPopup;
      titleActionScope = this.view.formTemplate12.flxTCButtons;
      contentScope.btnCancel.onClick = () => {
        if (billData.status === OLBConstants.BILLS_STATUS.RETURNED_BY_BANK) {
          this.togglePopup("cancelRevise");
        } else {
          this.togglePopup("saveOrDeleteDraft");
        }
      };
      contentScope.btnBack.onClick = () => presenter.showView({ form: 'frmCreateBillStep2' });
      contentScope.btnSubmit.onClick = () => {
        if (presenter.billData.status === OLBConstants.BILLS_STATUS.RETURNED_BY_BANK) {
          presenter.reviseBill(scope.view.id);
        } else {
          presenter.createBill(scope.view.id);
        }
      };
      contentScope.btnCreateBill.onClick = () => presenter.showBillsScreen({ context: 'createBill' });
      contentScope.btnViewAllBills.onClick = () => presenter.showBillsScreen({ context: 'viewBills' });
      popupScope.flxReturnedHistoryClose.onClick = this.toggleContentPopup.bind(this, 'flxReturnedHistoryPopup', false);
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
      if (viewModel.saveBill) {
        this.view.formTemplate12.setBannerFocus();
        this.view.formTemplate12.showBannerError({
          i18n: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.saveBillSuccessMessage')
        });
      }
      if (viewModel.createBill || viewModel.reviseBill) {
        this.view.formTemplate12.setBannerFocus();
        this.view.formTemplate12.showBannerError({
          i18n: kony.i18n.getLocalizedString(viewModel.createBill ? 'i18n.TradeSupplyFinance.submitBillSuccessMessage' : 'i18n.TradeSupplyFinance.submitReviseBillSuccessMessage')
        });
        this.view.formTemplate12.pageTitle = viewModel.createBill ? kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.createBillAcknowledgement') : `${kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.reviseBill')} - ${presenter.billData.billReference} - ${kony.i18n.getLocalizedString('i18n.wealth.acknowledgement')}`;
        contentScope.lblBillDetailsHeading.text = kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.billOverview');
        contentScope.flxBillOverview.setVisibility(false);
        contentScope.BillDetails.setContext({
          data: JSON.parse(JSON.stringify(viewModel.createBill ? presenter.billData : presenter.revisedBillData))
        });
        contentScope.flxRightContainer.setVisibility(false);
        contentScope.flxLeftContainer.width = "100%";
        contentScope.flxActions.setVisibility(false);
        contentScope.flxAckActions.setVisibility(true);
      }
      if (viewModel.serverError) {
        this.view.formTemplate12.setBannerFocus();
        this.view.formTemplate12.showBannerError({
          dbpErrMsg: viewModel.serverError
        });
      }
    },
    toggleSectionHeader: function (params) {
      contentScope.BillDetails.toggleSectionHeader(params);
    },
    setOverviewDetails: function () {
      FormControllerUtility.enableButton(contentScope.btnSubmit);
      if (presenter.billData.status !== OLBConstants.BILLS_STATUS.RETURNED_BY_BANK) {
        this.view.formTemplate12.pageTitle = kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.createBillReviewAndSubmit');
        contentScope.flxBillOverview.setVisibility(false);
        contentScope.btnCancel.text = kony.i18n.getLocalizedString('i18n.common.close');
        contentScope.btnCancel.toolTip = kony.i18n.getLocalizedString('i18n.common.close');
        contentScope.ProgressTracker.lblApplicationStep.text = kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.createBill');
        return;
      }
      const data = presenter.revisedBillData;
      if (!data.dataModifiedStep1 && !data.dataModifiedStep2) {
        FormControllerUtility.disableButton(contentScope.btnSubmit);
        this.view.formTemplate12.showBannerError({ dbpErrMsg: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.reviseBillUnchangedFieldsMessage') });
      }
      const returnedHistoryData = data.returnedHistory ? JSON.parse(data.returnedHistory.replace(/'/g, '"')) : [];
      this.view.formTemplate12.pageTitle = `${kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.reviseBill')} - ${data.billReference} - ${kony.i18n.getLocalizedString('i18n.kony.BulkPayments.ViewRequests')}`;
      contentScope.flxBillOverview.setVisibility(true);
      contentScope.btnCancel.text = kony.i18n.getLocalizedString('i18n.konybb.common.cancel');
      contentScope.btnCancel.toolTip = kony.i18n.getLocalizedString('i18n.konybb.common.cancel');
      contentScope.ProgressTracker.lblApplicationStep.text = kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.reviseBill');
      contentScope.segOverviewDetails.widgetDataMap = {
        'btnAction': 'btnAction',
        'flxValue': 'flxValue',
        'lblKey': 'lblKey',
        'lblValue': 'lblValue'
      };
      contentScope.segOverviewDetails.setData([
        {
          lblKey: {
            text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.billReferenceWithColon')
          },
          lblValue: {
            text: data.billReference || NA
          }
        }, {
          lblKey: {
            text: kony.i18n.getLocalizedString('i18n.TradeFinance.updatedOnWithColon')
          },
          lblValue: {
            text: data.updatedOn ? presenter.formatUtilManager.getFormattedCalendarDate(data.updatedOn) : NA
          }
        }, {
          lblKey: {
            text: kony.i18n.getLocalizedString('i18n.serviceRequests.Status:')
          },
          lblValue: {
            text: data.status || NA,
            skin: 'sknLblSSP42424215pxBold'
          }
        }, {
          lblKey: {
            text: kony.i18n.getLocalizedString('i18n.TradeFinance.reasonForReturnedWithColon')
          },
          lblValue: {
            text: data.reasonForReturn || NA,
            width: kony.flex.USE_PREFERRED_SIZE
          },
          btnAction: {
            isVisible: returnedHistoryData.length > 1,
            left: '20dp',
            text: `${kony.i18n.getLocalizedString('i18n.TradeFinance.viewHistory')} (${returnedHistoryData.length - 1})`,
            onClick: this.toggleContentPopup.bind(this, 'flxReturnedHistoryPopup', true)
          },
          flxValue: {
            width: kony.flex.USE_PREFERRED_SIZE,
            layoutType: kony.flex.FLOW_HORIZONTAL
          }
        }
      ]);
      popupScope.segReturnedHistory.widgetDataMap = {
        "lblReturnBank": "lblReturnBank",
        "lblReturnDate": "lblReturnDate",
        "lblKey1": "lblKey1",
        "lblValue1": "lblValue1",
        "lblKey2": "lblKey2",
        "lblValue2": "lblValue2",
        "lblKey3": "lblKey3",
        "lblValue3": "lblValue3",
      };
      let segReturnedHistoryData = [];
      for (let i = returnedHistoryData.length - 2; i >= 0; i--) {
        const record = returnedHistoryData[i];
        segReturnedHistoryData.push({
          "lblReturnBank": {
            "text": `${kony.i18n.getLocalizedString("i18n.TradeFinance.ReturnedbyBank")} (${i + 1})`
          },
          "lblReturnDate": {
            "text": record.returnedTimeStamp ? `${presenter.formatUtilManager.getFormattedCalendarDate(record.returnedTimeStamp)}, ${new Date(record.returnedTimeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}` : NA
          },
          "lblKey1": {
            "text": kony.i18n.getLocalizedString("i18n.TradeFinance.reasonForReturnedWithColon")
          },
          "lblValue1": {
            "text": record.reasonForReturn || NA
          },
          "lblKey2": {
            "text": kony.i18n.getLocalizedString("i18n.TradeFinance.returnMessageToBankWithColon")
          },
          "lblValue2": {
            "text": record.messageToBank || NA
          },
          "lblKey3": {
            "text": kony.i18n.getLocalizedString("i18n.TradeFinance.corporateUserNameWithColon")
          },
          "lblValue3": {
            "text": record.corporateUserName || NA
          }
        });
      }
      popupScope.segReturnedHistory.setData(segReturnedHistoryData);
    },
    togglePopup: function (flow) {
      let popupContext = {};
      switch (flow) {
        case "saveOrDeleteDraft":
          popupContext = {
            heading: kony.i18n.getLocalizedString("i18n.common.close"),
            message: presenter.billData.billReference ? kony.i18n.getLocalizedString("i18n.TradeFinance.saveAsDraftAndCloseOrDeletePermanentlyMessage") : kony.i18n.getLocalizedString("i18n.TradeFinance.saveAsDraftAndCloseOrCloseWithoutSavedMessage"),
            noText: presenter.billData.billReference ? kony.i18n.getLocalizedString("kony.mb.Messages.DeletePermanently") : kony.i18n.getLocalizedString("i18n.TradeFinance.closeWithoutSaving"),
            yesText: kony.i18n.getLocalizedString("i18n.TradeFinance.SaveasDraft&Close"),
            noClick: () => this.deletePermanently(),
            yesClick: () => presenter.saveBill({}, flow, this.view.id)
          };
          break;
        case "cancelRevise":
          popupContext = {
            heading: kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
            message: kony.i18n.getLocalizedString("i18n.PayAPerson.CancelAlert"),
            noText: kony.i18n.getLocalizedString("i18n.common.no"),
            yesText: kony.i18n.getLocalizedString("i18n.common.yes"),
            yesClick: () => presenter.showView({
              form: 'frmViewBillDetails'
            })
          };
          break;
      }
      this.view.formTemplate12.setPopup(popupContext);
    },
    deletePermanently: function () {
      if (presenter.billData.billReference) {
        presenter.deleteBill(this.view.id);
      } else {
        presenter.showBillsScreen({ context: 'viewBills' });
      }
    },
    toggleContentPopup: function (popupWidget, visibility) {
      popupScope.setVisibility(visibility);
      popupScope[popupWidget].setVisibility(visibility);
    },
    /**
     * Error thrown from catch block of form controller
     */
    onError: function (err) {
      kony.print(JSON.stringify(err));
    }
  };
});
