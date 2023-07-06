define(["FormControllerUtility", "CommonUtilities", "OLBConstants"], function (FormControllerUtility, CommonUtilities, OLBConstants) {
  const resourcesConstants = {
    'images': {
      'pdf': 'pdf_image.png',
      'jpeg': 'jpeg_image.png',
      'doc': 'word.png',
      'docx': 'word.png',
      'xlsx': 'excel.png',
      'bmp': 'png.png',
      'zip': 'zip.png'
    }
  };
  let presenter, contentScope, popupScope, titleActionScope, breakpoint, csvBillIndex, csvBillData, documentsList = [], selectedDocument = '', deletedDocumentIndex, uploadDocumentMessage, retrySubmission = false;
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
      csvBillData = JSON.parse(JSON.stringify(presenter.csvRecordData.bills));
      csvBillIndex = csvBillData.findIndex(bill => bill.status === 'In Review');
      this.view.formTemplate12.hideBannerError();
    },
    /**
     * Performs the actions required after rendering form
     */
    postShow: function () {
      applicationManager.getNavigationManager().applyUpdates(this);
      this.setCsvBillData();
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
      contentScope.btnUploadDocument.onClick = this.browseSupportingDocument;
      contentScope.flxDocInfoIcon.onClick = () => contentScope.flxUploadDocInfo.setVisibility(!contentScope.flxUploadDocInfo.isVisible);
      contentScope.flxDocInfoClose.onClick = () => contentScope.flxUploadDocInfo.setVisibility(false);
      contentScope.btnCancel.onClick = this.togglePopup.bind(this, 'cancel');
      contentScope.btnSubmit.onClick = () => {
        if (retrySubmission) {
          presenter.submitImportedBill(csvBillIndex, scope.view.id);
        } else {
          this.togglePopup('submitBill');
        }
      };
      contentScope.segDocumentsList.widgetDataMap = {
        "imgDocType": "imgDocType",
        "lblDocName": "lblDocName",
        "flxDeleteDoc": "flxDeleteDoc"
      };
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
      if (viewModel.uploadDocument) {
        selectedDocument['documentReference'] = viewModel.uploadDocument.LCDocuments[0].documentReference;
        documentsList.push(selectedDocument);
        this.setDocumentsList();
      }
      if (viewModel.deleteDocument) {
        documentsList.splice(deletedDocumentIndex, 1);
        this.setDocumentsList();
      }
      if (viewModel.submitImportedBill) {
        csvBillData = JSON.parse(JSON.stringify(presenter.csvRecordData.bills));
        csvBillIndex = csvBillData.findIndex(bill => bill.status === 'In Review');
        if (csvBillIndex === -1) {
          presenter.submitImportedCsv(this.view.id);
        } else {
          this.view.formTemplate12.setBannerFocus();
          this.view.formTemplate12.showBannerError({ i18n: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.submitFileImportBillSuccessMessage').replace('%field%', csvBillIndex) });
          this.setCsvBillData();
        }
      }
      if (viewModel.serverError) {
        this.view.formTemplate12.setBannerFocus();
        if (viewModel.method && viewModel.method === 'submitImportedBill') {
          retrySubmission = true;
          this.view.formTemplate12.showBannerError({ dbpErrMsg: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.tryAgainFailedSubmissionMessage') });
          contentScope.btnSubmit.text = kony.i18n.getLocalizedString('i18n.qrpayments.Retry');
          contentScope.btnSubmit.toolTip = kony.i18n.getLocalizedString('i18n.qrpayments.Retry');
        } else {
          this.view.formTemplate12.showBannerError({ dbpErrMsg: viewModel.serverError });
        }
      }
    },
    setCsvBillData: function () {
      const billData = csvBillData[csvBillIndex];
      documentsList = [];
      selectedDocument = '';
      deletedDocumentIndex = '';
      retrySubmission = false;
      contentScope.btnSubmit.text = kony.i18n.getLocalizedString('i18n.TradeFinance.ConfirmAndSubmit');
      contentScope.btnSubmit.toolTip = kony.i18n.getLocalizedString('i18n.TradeFinance.ConfirmAndSubmit');
      this.view.formTemplate12.pageTitle = `${kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.createBillFromFileReview')} ${kony.i18n.getLocalizedString('i18n.billPay.Bill')} ${csvBillIndex + 1} of ${csvBillData.length}`;
      contentScope.lblReviewHeader.text = `${kony.i18n.getLocalizedString('i18n.billPay.Bill')} ${csvBillIndex + 1}`;
      contentScope.segDocumentsList.removeAll();
      contentScope.flxDocumentList.setVisibility(false);
      contentScope.flxDocStatus.setVisibility(true);
      contentScope.BillDetails.setContext({ data: billData, flow: 'importCsv' });
      FormControllerUtility.disableButton(contentScope.btnSubmit);
    },
    browseSupportingDocument: function () {
      const scope = this;
      const config = {
        selectMultipleFiles: false,
        filter: [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/bmp",
          "application/x-zip-compressed",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
          ".csv"
        ]
      };
      if (documentsList.length >= presenter.billConfig.documentsLimit) {
        uploadDocumentMessage = `${kony.i18n.getLocalizedString("i18n.TradeFinance.allowedDocumentsLimitMessage")} ${presenter.billConfig.documentsLimit}.`;
        scope.togglePopup('uploadDocument');
        return;
      }
      kony.io.FileSystem.browse(config, scope.selectedDocumentCallback);
    },
    getBase64: function (file, successCallback) {
      let reader = new FileReader();
      reader.onloadend = function () {
        successCallback(reader.result);
      };
      reader.readAsDataURL(file);
    },
    selectedDocumentCallback: function (events, files) {
      const scope = this;
      const extensions = presenter.billConfig.fileExtensions;
      if (files.length > 0) {
        const extension = files[0].file.name.split('.').pop();
        if (extension && !extensions.includes(extension)) {
          uploadDocumentMessage = `${kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentTypeErrorMsg1")} ${files[0].name} ${kony.i18n.getLocalizedString("i18n.TradeFinance.allowedFileExtensionsMessage")} ${extensions.map(e => `.${e}`).join(', ')}.`;
          scope.togglePopup('uploadDocument');
          return;
        }
        if (files[0].file.size >= presenter.billConfig.documentMaxSize) {
          uploadDocumentMessage = `${kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentTypeErrorMsg1")} ${files[0].name} ${kony.i18n.getLocalizedString("kony.mb.Europe.AttachmentSizeErrorMsg")} ${presenter.billConfig.documentMaxSize / 10e5} MB.`;
          scope.togglePopup('uploadDocument');
          return;
        }
        let fileData = {};
        selectedDocument = { documentName: files[0].name };
        fileData.fileName = files[0].name;
        fileData.fileType = files[0].file.type;
        scope.getBase64(files[0].file, function (base64String) {
          fileData.fileContents = base64String.split(';base64,')[1];
          let fileDataItemParsed = [fileData.fileName, fileData.fileType, fileData.fileContents].join('~');
          presenter.uploadDocument(fileDataItemParsed, scope.view.id);
        });
      }
      contentScope.forceLayout();
    },
    setDocumentsList: function () {
      const scope = this;
      if (documentsList.length === 0) {
        contentScope.segDocumentsList.removeAll();
        contentScope.flxDocumentList.setVisibility(false);
        contentScope.flxDocStatus.setVisibility(true);
        FormControllerUtility.disableButton(contentScope.btnSubmit);
        return;
      }
      contentScope.flxDocumentList.setVisibility(true);
      contentScope.flxDocStatus.setVisibility(false);
      FormControllerUtility.enableButton(contentScope.btnSubmit);
      let segData = [];
      for (const document of documentsList) {
        segData.push({
          "imgDocType": {
            src: resourcesConstants.images[document.documentName.split('.').pop()] || 'aa_password_error.png'
          },
          "lblDocName": {
            text: document.documentName,
            toolTip: document.documentName
          },
          "flxDeleteDoc": {
            onClick: scope.togglePopup.bind(scope, 'deleteDocument'),
            cursorType: "pointer"
          }
        });
      }
      contentScope.segDocumentsList.setData(segData);
      contentScope.forceLayout();
    },
    togglePopup: function (flow) {
      const scope = this;
      let popupContext = {};
      switch (flow) {
        case 'uploadDocument':
          popupContext = {
            heading: kony.i18n.getLocalizedString("i18n.TradeFinance.UploadDocument"),
            message: uploadDocumentMessage,
            noText: kony.i18n.getLocalizedString("i18n.common.close"),
            yesText: kony.i18n.getLocalizedString("kony.mb.common.TryAgain"),
            yesClick: () => this.browseSupportingDocument()
          };
          break;
        case 'deleteDocument':
          deletedDocumentIndex = contentScope.segDocumentsList.selectedRowIndex[1];
          popupContext = {
            heading: kony.i18n.getLocalizedString("kony.mb.common.Delete"),
            message: `${kony.i18n.getLocalizedString("i18n.TradeFinance.deleteDocumentMessage")} "${documentsList[deletedDocumentIndex].documentName}"?`,
            noText: kony.i18n.getLocalizedString("i18n.common.no"),
            yesText: kony.i18n.getLocalizedString("i18n.common.yes"),
            yesClick: () => presenter.deleteDocument(documentsList[deletedDocumentIndex].documentReference, this.view.id)
          };
          break;
        case 'cancel':
          popupContext = {
            heading: kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
            message: kony.i18n.getLocalizedString("i18n.PayAPerson.CancelAlert"),
            noText: kony.i18n.getLocalizedString("i18n.common.no"),
            yesText: kony.i18n.getLocalizedString("i18n.common.yes"),
            yesClick: () => presenter.showBillsScreen({ context: 'viewFileImports' })
          };
          break;
        case 'submitBill':
          popupContext = {
            heading: kony.i18n.getLocalizedString("i18n.TradeFinance.ConfirmAndSubmit"),
            message: kony.i18n.getLocalizedString("i18n.TradeSupplyFinance.reviewAndSubmitFileImportBillMessage").replace('%field1%', csvBillIndex + 1).replace('%field2%', csvBillData.length),
            noText: kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
            yesText: kony.i18n.getLocalizedString(csvBillIndex + 1 === csvBillData.length ? "i18n.wealth.submit" : "i18n.TradeSupplyFinance.submitAndContinue"),
            yesClick: () => {
              presenter.csvRecordData.bills[csvBillIndex]['uploadedDocuments'] = JSON.stringify(documentsList);
              presenter.submitImportedBill(csvBillIndex, scope.view.id);
            }
          };
          break;
      }
      this.view.formTemplate12.setPopup(popupContext);
    },
    /**
     * Error thrown from catch block of form controller
     */
    onError: function (err) {
      kony.print(JSON.stringify(err));
    }
  };
});