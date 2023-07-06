define(['CommonUtilities', 'OLBConstants', 'FormControllerUtility'], function (CommonUtilities, OLBConstants, FormControllerUtility) {
  const NA = kony.i18n.getLocalizedString("i18n.common.NA");
  let presenter, contentScope, buttonScope, popupScope, formTemplateScope, breakpoint, billData, swiftsAdvicesData;
  return {
    /**
     * @api : init
     * This function for executing the lines of code only once
     * @return : NA
     */
    init: function () {
      this.view.preShow = this.preShow;
      this.view.postShow = this.postShow;
      this.view.onDeviceBack = function () { };
      this.view.onBreakpointChange = this.onBreakpointChange;
      this.view.formTemplate12.onError = this.onError;
      this.initFormActions();
    },
    /**
     * @api : onBreakpointChange
     * Performs the actions required on change of breakpoint
     * @return : NA
     */
    onBreakpointChange: function (form, width) {
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      breakpoint = kony.application.getCurrentBreakpoint();
    },
    /**
    * Entry point method for the form controller
    * @param {Object} viewModel - it contains the set of view properties and keys.
    */
    updateFormUI: function (viewModel) {
      var scope = this;
      if (viewModel.isLoading === true) {
        FormControllerUtility.showProgressBar(this.view);
      } else if (viewModel.isLoading === false) {
        FormControllerUtility.hideProgressBar(this.view);
      }
      if (viewModel.serverError) {
        this.view.formTemplate12.showBannerError({ dbpErrMsg: viewModel.serverError });
      }
      if (viewModel.fetchSwiftsAdvices) {
        swiftsAdvicesData = viewModel.fetchSwiftsAdvices;
        scope.renderSwiftAdvice();
      }
      if (viewModel.fetchFileResponse) {
        popupScope.setVisibility(true);
        popupScope.flxSAPopup.setVisibility(true);
        popupScope.rtxSA.text = viewModel.fetchFileResponse.rawResponse ? viewModel.fetchFileResponse.rawResponse : viewModel.fetchFileResponse;
      }
    },
    /**
     * @api : preShow
     * Performs the actions required before rendering form
     * @return : NA
     */
    preShow: function () {
      billData = JSON.parse(JSON.stringify(presenter.billData));
      this.setDefaultUI();
    },
    /**
     * @api : postShow
     * Performs the actions required after rendering form
     * @return : NA
     */
    postShow: function () {
      contentScope.BillDetails.setContext({ data: billData });
      let swiftAdvicesPayload = {
        "orderId": billData.billReference,
        "product": "RECEIVABLEBILLS"
      }
      presenter.fetchSwiftsAdvices(swiftAdvicesPayload, 'frmViewBillDetails');
      this.renderPrintAndDownload();
    },
    /**
     *  @api : initFormActions
     * Method to initialise form actions
     * @return : NA
     */
    initFormActions: function () {
      const scope = this;
      presenter = applicationManager.getModulesPresentationController({
        appName: 'TradeSupplyFinMA',
        moduleName: 'BillsUIModule'
      });
      popupScope = this.view.formTemplate12.flxContentPopup;
      buttonScope = this.view.formTemplate12.flxTCButtons;
      contentScope = this.view.formTemplate12.flxContentTCCenter;
      contentScope.btnRevise.onClick = () => presenter.showBillsScreen({ context: 'reviseBill', data: billData });
      contentScope.btnRequestCancellation.onClick = () => presenter.showBillsScreen({ context: 'cancelBill', data: billData });
      contentScope.btnBack.onClick = () => presenter.showBillsScreen({ context: 'viewBills' });
      buttonScope.flxVerticalEllipsisBody.onClick = () => buttonScope.flxVerticalEllipsisDropdown.setVisibility(!buttonScope.flxVerticalEllipsisDropdown.isVisible);
      popupScope.flxSAClose.onClick = function () {
        popupScope.setVisibility(false);
        popupScope.flxSAPopup.setVisibility(false);
      };
      buttonScope.btnSwiftAndAdvices.onClick = () => buttonScope.flxSwiftAndAdvices.setVisibility(!buttonScope.flxSwiftAndAdvices.isVisible);
    },

    /**
     * @api : renderSwiftAdvice
     * This function to set UI for Swift&Advices.
     * @return : NA
     */
    renderSwiftAdvice: function () {
      var scope = this;
      if (!swiftsAdvicesData.PaymentAdvices || swiftsAdvicesData.PaymentAdvices.length === 0 || !swiftsAdvicesData.SwiftMessages || swiftsAdvicesData.SwiftMessages.length === 0) {
        buttonScope.btnSwiftAndAdvices.setVisibility(false);
        return;
      }
      buttonScope.btnSwiftAndAdvices.text = `${kony.i18n.getLocalizedString('i18n.TradeFinance.SwiftAndAdvices')} (${swiftsAdvicesData.PaymentAdvices.length + swiftsAdvicesData.SwiftMessages.length})`;
      buttonScope.btnSwiftAndAdvices.setVisibility(true);
      buttonScope.segSwiftAndAdvices.widgetDataMap = {
        'lblListValue': 'lblListValue',
        'flxListDropdown': 'flxListDropdown'
      };
      let segAdvicesData = [];
      swiftsAdvicesData.PaymentAdvices.map(item => {
        segAdvicesData.push({
          'flxListDropdown': {
            cursorType: 'pointer',
            onClick: scope.swiftAndAdvicesOnRowClick.bind(scope, item)
          },
          'lblListValue': `${kony.i18n.getLocalizedString('i18n.TradeFinance.PaymentAdvice')} ${presenter.formatUtilManager.getFormattedCalendarDate(item.uploadedTimeStamp)}`
        });
      });
      swiftsAdvicesData.SwiftMessages.map(item => {
        segAdvicesData.push({
          'flxListDropdown': {
            cursorType: 'pointer',
            onClick: scope.swiftAndAdvicesOnRowClick.bind(scope, item)
          },
          'lblListValue': `SWIFT MT ### - Advice of ... (${presenter.formatUtilManager.getFormattedCalendarDate(item.uploadedTimeStamp)})`
        });
      });
      buttonScope.segSwiftAndAdvices.setData(segAdvicesData);
    },

    /**
     * @api : swiftAndAdvicesOnRowClick
     * This function is triggered on row cick of advices segment.
     * @return : NA
     */
    swiftAndAdvicesOnRowClick: function (selectedItem) {
      var scope = this;
      try {
        buttonScope.flxSwiftAndAdvices.setVisibility(false);
        let payload = {
          fileName: selectedItem.fileName,
          fileId: selectedItem.fileId
        };
        if (selectedItem.category === 'SWIFT') {
          popupScope.lblSAHeading.text = 'SWIFT MT ### - Advice of ...' + ' (' + presenter.formatUtilManager.getFormattedCalendarDate(selectedItem.uploadedTimeStamp) + ')';
        } else {
          popupScope.lblSAHeading.text = `${kony.i18n.getLocalizedString('i18n.TradeFinance.PaymentAdvice')} ${presenter.formatUtilManager.getFormattedCalendarDate(selectedItem.uploadedTimeStamp)}`
        }
        presenter.fetchFileResponse(payload, 'frmViewBillDetails');
      } catch (err) {
        var errorObj = {
          "method": "swiftAndAdvicesOnRowClick",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : renderPrintAndDownload
     * This function to set UI for print and download options.
     * @return : NA
     */
    renderPrintAndDownload: function () {
      var scope = this;
      try {
        buttonScope.segVerticalDropdownEllipsis.widgetDataMap = {
          "lblIcon": "lblIcon",
          "flxBillsFilterList": "flxBillsFilterList",
          "lblFilterValue": "lblFilterValue"
        };
        let masterData = [];
        presenter.contextualMenuData.map(item => {
          masterData.push({
            flxBillsFilterList: {
              onClick: scope.onPrintAndDownloadRowClick.bind(scope, item.id),
              cursorType: 'pointer',
              isVisible: (item.id == 'raiseQuery') && (billData.status.toLowerCase() !== (OLBConstants.OUTWARD_COLLECTION_AMENDMENTS_STATUS.APPROVED).toLowerCase()) ? false : 
                          (item.id == "print" && breakpoint <=1024) ? false : true
            },
            lblIcon: {
              isVisible: true,
              skin: "sknOLBFonts003e7520px",
              text: item.icon
            },

            lblFilterValue: {
              isVisible: true,
              text: item.text
            }
          });
        });
        buttonScope.segVerticalDropdownEllipsis.setData(masterData);
      } catch (err) {
        var errorObj = {
          "method": "renderPrintAndDownload",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : onPrintAndDownloadRowClick
     * This function to call appropriate methods for print and download options.
     * @return : NA
     */
    onPrintAndDownloadRowClick: function (id) {
      var scope = this;
      try {
        buttonScope.flxVerticalEllipsisDropdown.setVisibility(false);
        if (id == 'download') {
          presenter.downloadBillReportPdf(billData.billReference);
        } else if (id == 'print') {
          presenter.showBillsScreen({
            context: "printBill",
            form: scope.view.id,
            data: {
              navData: billData,
              previousFormName: 'frmViewBillDetails',
            }
          });
        } else if (id == 'raiseQuery') {
          let record = billData;
          let queryObj = {};
          queryObj.subject = `${kony.i18n.getLocalizedString("i18n.TradeSupplyFinance.supplyChainFinance")} - ${record.billReference}`;
          queryObj.descriptionObj = {};
          record.billReference && (queryObj.descriptionObj[kony.i18n.getLocalizedString("i18n.TradeFinance.billReference")] = record.billReference);
          record.buyerName && (queryObj.descriptionObj[kony.i18n.getLocalizedString("i18n.TradeSupplyFinance.buyerName")] = record.buyerName);
          (record.currency && record.amount) && (queryObj.descriptionObj[kony.i18n.getLocalizedString("i18n.TradeFinance.currencyAndAmount")] = `${record.currency} ${applicationManager.getFormatUtilManager().formatAmount(record.amount)}`);
          record.requestFinance && (queryObj.descriptionObj[kony.i18n.getLocalizedString("i18n.TradeSupplyFinance.needFinance")] = record.requestFinance);
          record.dueDate && (queryObj.descriptionObj[kony.i18n.getLocalizedString("i18n.billPay.DueDate")] = presenter.formatUtilManager.getFormattedCalendarDate(record.dueDate));
          presenter.showMessagesScreen(queryObj);
        }
      } catch (err) {
        var errorObj = {
          "method": "onPrintAndDownloadRowClick",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : setDefaultUI
     * This function to set default UI when landing on screen.
     * @return : NA
     */
    setDefaultUI: function () {
      this.view.formTemplate12.pageTitle = `${kony.i18n.getLocalizedString('i18n.accounts.viewBill')} - ${billData.billReference}`;
      contentScope.btnBack.setVisibility(true);
      contentScope.btnRevise.setVisibility(false);
      popupScope.setVisibility(false);
      buttonScope.flxVerticalEllipsisDropdown.setVisibility(false);
      popupScope.flxSAPopup.setVisibility(false);
      contentScope.btnRequestCancellation.setVisibility(false);
      if (billData.status === OLBConstants.BILLS_STATUS.APPROVED && !billData.cancellationStatus) {
        contentScope.btnRequestCancellation.setVisibility(true);
      } else if (billData.status === OLBConstants.BILLS_STATUS.RETURNED_BY_BANK) {
        contentScope.btnRevise.setVisibility(true);
      }
      buttonScope.flxSwiftAndAdvices.setVisibility(false);
    },
    /**
     * Error thrown from catch block of form controller
     */
    onError: function (err) {
      kony.print(JSON.stringify(err));
    }
  };
});