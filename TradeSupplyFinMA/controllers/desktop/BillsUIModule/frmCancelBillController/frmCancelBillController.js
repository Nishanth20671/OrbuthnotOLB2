define(['FormControllerUtility'], function (FormControllerUtility) {
  const docImages = {
    'pdf': 'pdf_image.png',
    'jpeg': 'jpeg_image.png',
    'doc': 'word.png',
    'docx': 'word.png',
    'xlsx': 'excel.png',
    'bmp': 'png.png',
    'zip': 'zip.png'
  },
        NA = kony.i18n.getLocalizedString("i18n.common.NA");
  let billData, presenter, formTemplateScope, widgetScope, popupScope,
      uploadDocPopupParam, documentsList = [], docReferenceValues = [], selectedDocument = '', segOverviewData = [];
  return {
    /**
     * @api :init
     * Sets the initial actions for form
     * @arg : NA
     * @return : NA
     */
    init: function () {
      presenter = applicationManager.getModulesPresentationController({ appName: 'TradeSupplyFinMA', moduleName: 'BillsUIModule' });
      this.view.preShow = this.preShow;
      this.view.postShow = this.postShow;
      this.view.onDeviceBack = function () { };
      formTemplateScope = this.view.formTemplate12;
      widgetScope = formTemplateScope.flxContentTCCenter;
      popupScope = formTemplateScope.flxContentPopup;
      this.initFormActions();
    },

    /**
     * @api :initFormActions
     * Contains button/user actions
     * @arg : NA
     * @return : NA
     */
    initFormActions: function () {
      const scope = this;
      presenter.cursorTypePointer([
        popupScope.lblSummeryViewDetailsClose,
        widgetScope.flxUploadInfoIcon,
        widgetScope.lblInfoClose,
      ]);
      let requestCancellationPopupParam = {
        heading: presenter.renderI18nKeys('i18n.TradeFinance.RequestCancellation', false),
        message: `${presenter.renderI18nKeys('i18n.TradeSupplyFinance.areYouSureToCancel', false)}\n\n${presenter.renderI18nKeys('i18n.TradeFinance.NoteYouCantUndoThisAction', false)}`,
        yesClick: scope.submitCancellation.bind(scope),
        yesText: presenter.renderI18nKeys('i18n.TradeSupplyFinance.submitCancellation', false),
        noText: presenter.renderI18nKeys('i18n.TradeFinance.DontSubmit', false)
      };
      widgetScope.btnUploadNewFile.onClick = scope.browseSupportingDocument.bind(scope);
      widgetScope.txtReasonForCancellation.onKeyUp = scope.enableOrDisableSubmitButton.bind(scope);
      widgetScope.btnCancel.onClick = () => presenter.showView({
        form: 'frmViewBillDetails'
      });
      FormControllerUtility.disableButton(widgetScope.btnConfirmAndSubmit);
      widgetScope.btnConfirmAndSubmit.onClick = () => formTemplateScope.setPopup(requestCancellationPopupParam);
      widgetScope.lblViewDetails.onTouchEnd = () => {
        let isArabic = kony.i18n.getCurrentLocale === "ar_AE";
        popupScope.lblSummeryViewDetailsHeader.text = isArabic ?
          `${billData.billReference} - ${presenter.renderI18nKeys('i18n.common.ViewDetails', false)} - ${presenter.renderI18nKeys('i18n.TradeFinance.BillSummary', false)}` :
        `${presenter.renderI18nKeys('i18n.TradeFinance.BillSummary', false)} - ${billData.billReference} - ${presenter.renderI18nKeys('i18n.common.ViewDetails', false)}`;
        popupScope.setVisibility(true);
      };
      popupScope.lblSummeryViewDetailsClose.onTouchEnd = () => popupScope.setVisibility(false);
      widgetScope.flxInfoUploadMsg.setVisibility(false);
      widgetScope.flxUploadInfoIcon.onClick = () => widgetScope.flxInfoUploadMsg.setVisibility(!widgetScope.flxInfoUploadMsg.isVisible);
      widgetScope.lblInfoClose.onTouchEnd = () => widgetScope.flxInfoUploadMsg.setVisibility(!widgetScope.flxInfoUploadMsg.isVisible);
      widgetScope.btnViewAllBills.onClick = () => presenter.showBillsScreen({
        context: 'viewBills'
      });
      widgetScope.segRecords.widgetDataMap = {
        'flxDetails': 'flxDetails',
        'lblKey': 'lblKey',
        'lblValue': 'lblValue',
        'lblHeading': 'lblHeading',
        'flxValue': 'flxValue',
        'flxMain': 'flxMain',
        'flxDetailsHeader': 'flxDetailsHeader',
        'lblDropdownIcon': 'lblDropdownIcon'
      };
      widgetScope.segOverviewRecords.widgetDataMap = {
        'flxDetails': 'flxDetails',
        'lblKey': 'lblKey',
        'lblValue': 'lblValue',
        'lblHeading': 'lblHeading',
        'flxValue': 'flxValue',
        'flxMain': 'flxMain',
        'flxDetailsHeader': 'flxDetailsHeader',
        'lblDropdownIcon': 'lblDropdownIcon',
      };
    },

    /**
     * @api :preShow
     * Will execute before loading the form
     * @arg : NA
     * @return : NA
     */
    preShow: function () {
      billData = JSON.parse(JSON.stringify(presenter.billData));
      this.renderPageTitle(false);
      widgetScope.flxOverview.setVisibility(false);
      widgetScope.flxCancellationDetails.setVisibility(true);
      widgetScope.flxAckActions.setVisibility(false);
      popupScope.setVisibility(false);
      formTemplateScope.hideBannerError();
    },

    /**
     * @api :postShow
     * Will execute after loading the form
     * @arg : NA
     * @return : NA
     */
    postShow: function () {
      docReferenceValues = [];
      widgetScope.txtReasonForCancellation.text = '';
      documentsList = [];
      widgetScope.segDocuments.removeAll();
      this.renderBillSummary();
      popupScope.BillDetails.setContext({ data: billData });
    },

    /**
     * @api :browseSupportingDocument
     * Helps to select the files from the local device
     * @arg : NA
     * @return : NA
     */
    browseSupportingDocument: function () {
      var scope = this;
      try {
        uploadDocPopupParam = {
          heading: presenter.renderI18nKeys('i18n.TradeFinance.UploadDocument', false),
          message: presenter.renderI18nKeys('i18n.TradeFinance.allowedDocumentsLimitMessage', false) + ' ' + presenter.billConfig.documentsLimit,
          yesClick: scope.browseSupportingDocument.bind(scope),
          yesText: presenter.renderI18nKeys('kony.mb.common.TryAgain', false),
          noText: presenter.renderI18nKeys('kony.mb.common.close', false)
        };
        const config = {
          selectMultipleFiles: false,
          filter: ["application/pdf", "image/jpeg", "image/png", "image/bmp", "application/x-zip-compressed", "application/msword", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel", ".csv"]
        };
        if (documentsList.length >= presenter.billConfig.documentsLimit) {
          formTemplateScope.setPopup(uploadDocPopupParam);
          return;
        }
        kony.io.FileSystem.browse(config, scope.selectedFileCallback);
      } catch (err) {
        var errorObj = {
          "method": "browseSupportingDocument",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api :selectedFileCallback
     * Helps to select the files from the local device
     * @arg : NA
     * @return : NA
     */
    selectedFileCallback: function (events, files) {
      const scope = this;
      const extensions = presenter.billConfig.fileExtensions;
      if (files.length > 0) {
        const extension = files[0].file.name.split('.').pop();
        if (extension && !extensions.includes(extension)) {
          uploadDocPopupParam.message = kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentTypeErrorMsg1") + " " + files[0].name + " " + kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentTypeErrorMsg3");
          formTemplateScope.setPopup(uploadDocPopupParam);
          return;
        }
        if (files[0].file.size >= presenter.billConfig.documentMaxSize) {
          uploadDocPopupParam.message = `${kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentTypeErrorMsg1")} ${files[0].name} ${kony.i18n.getLocalizedString("kony.mb.Europe.AttachmentSizeErrorMsg")} ${presenter.billConfig.documentMaxSize / 10e5} MB.`;
          formTemplateScope.setPopup(uploadDocPopupParam);
          return;
        } else {
          let fileData = {};
          selectedDocument = [files[0].name, extension];
          fileData.fileName = files[0].name;
          fileData.fileType = files[0].file.type;
          scope.getBase64(files[0].file, function (base64String) {
            fileData.fileContents = base64String.split(';base64,')[1];
            let fileDataItemParsed = [fileData.fileName, fileData.fileType, fileData.fileContents].join('~');
            presenter.uploadDocument(fileDataItemParsed, scope.view.id);
          });
        }
      }
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
        this.storeDocumentReference(viewModel.uploadDocument.LCDocuments[0].documentReference);
      }
      if (viewModel.deleteDocument) {
        this.removeDocumentReference();
      }
      if (viewModel.serverError) {
        formTemplateScope.showBannerError({ dbpErrMsg: viewModel.serverError });
      }
      if (viewModel.billCancelResponse) {
        billData = Object.assign(billData, viewModel.billCancelResponse);
        this.renderAckScreen();
      }
    },
    storeDocumentReference: function (key) {
      documentsList.push(selectedDocument);
      docReferenceValues.push(key);
      this.setDocumentsDataToSegment();
    },
    setDocumentsDataToSegment: function () {
      const scope = this;
      scope.enableOrDisableSubmitButton();
      if (documentsList.length === 0) {
        widgetScope.segDocuments.removeAll();
        widgetScope.flxSegDocuments.setVisibility(false);
        return;
      }
      widgetScope.flxSegDocuments.setVisibility(true);
      let segData = [];
      for (const document of documentsList) {
        segData.push({
          imgDocType: {
            src: docImages[document[1]] || 'aa_password_error.png'
          },
          lblDocName: {
            text: document[0],
            toolTip: document[0]
          },
          flxDeleteDoc: {
            onClick: scope.deleteDocumentPopup.bind(scope),
            cursorType: "pointer"
          }
        });
      }
      widgetScope.segDocuments.widgetDataMap = {
        imgDocType: 'imgDocType',
        lblDocName: 'lblDocName',
        flxDeleteDoc: 'flxDeleteDoc'
      };
      widgetScope.segDocuments.setData(segData);
    },
    getBase64: function (file, successCallback) {
      let reader = new FileReader();
      reader.onloadend = function () {
        successCallback(reader.result);
      };
      reader.readAsDataURL(file);
    },
    deleteDocumentPopup: function () {
      var scope = this;
      try {
        deletedIndex = widgetScope.segDocuments.selectedRowIndex[1];
        let deleteDocPopupParam = {
          heading: presenter.renderI18nKeys('kony.mb.common.Delete', false),
          message: `${presenter.renderI18nKeys('i18n.TradeFinance.deleteDocumentMessage', false)} "${documentsList[deletedIndex][0]}"?`,
          yesClick: () => presenter.deleteDocument(docReferenceValues[deletedIndex], scope.view.id),
          yesText: presenter.renderI18nKeys('kony.mb.common.AlertYes', false),
          noText: presenter.renderI18nKeys('kony.mb.common.No', false)
        };
        formTemplateScope.setPopup(deleteDocPopupParam);
      } catch (err) {
        var errorObj = {
          "method": "deleteDocumentPopup",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    removeDocumentReference: function () {
      documentsList.splice(deletedIndex, 1);
      docReferenceValues.splice(deletedIndex, 1);
      this.setDocumentsDataToSegment();
    },
    enableOrDisableSubmitButton: function () {
      if (docReferenceValues.length === 0 || widgetScope.txtReasonForCancellation.text.length === 0) {
        FormControllerUtility.disableButton(widgetScope.btnConfirmAndSubmit);
      } else {
        FormControllerUtility.enableButton(widgetScope.btnConfirmAndSubmit);
      }
    },

    /**
     * @api :renderPageTitle
     * Will load the page title
     * @arg : NA
     * @return : NA
     */
    renderPageTitle: function (isAckScreen) {
      var scope = this;
      try {
        let tempTitle;
        let isArabic = kony.i18n.getCurrentLocale === "ar_AE";
        if (isAckScreen) {
          tempTitle = isArabic ?
            `${presenter.renderI18nKeys('i18n.wealth.acknowledgement', false)} - ${billData.billReference} - ${presenter.renderI18nKeys('i18n.TradeSupplyFinance.cancelBill', false)}`
          :
          `${presenter.renderI18nKeys('i18n.TradeSupplyFinance.cancelBill', false)} - ${billData.billReference} - ${presenter.renderI18nKeys('i18n.wealth.acknowledgement', false)}`;
        } else {
          tempTitle = isArabic ?
            `${billData.billReference} - ${presenter.renderI18nKeys('i18n.TradeSupplyFinance.cancelBill', false)}`
          :
          `${presenter.renderI18nKeys('i18n.TradeSupplyFinance.cancelBill', false)} - ${billData.billReference}`;
        }
        formTemplateScope.pageTitle = tempTitle;
      } catch (err) {
        var errorObj = {
          "method": "renderPageTitle",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api :renderBillSummary
     * Loading bill summery details
     * @arg1 {name} : Response to load data
     * @return : NA
     */
    renderBillSummary: function () {
      let segData = [
        {
          lblKey: presenter.renderI18nKeys('i18n.TradeFinance.buyer', true),
          lblValue: billData.buyerName || NA
        },
        {
          lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.billReferenceWithColon', false),
          lblValue: billData.billReference || NA
        },
        {
          lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.billNumberWithColon', false),
          lblValue: billData.billNumber || NA
        },
        {
          lblKey: presenter.renderI18nKeys('i18n.billPayee.review.amount', false),
          lblValue: (billData.currency && billData.amount) ? `${billData.currency} ${presenter.formatUtilManager.formatAmount(billData.amount)}` : NA
        },
        {
          lblKey: presenter.renderI18nKeys('i18n.payments.dueDateWithColon', false),
          lblValue: billData.dueDate ? presenter.formatUtilManager.getFormattedCalendarDate(billData.dueDate) : NA
        }
      ];
      widgetScope.segRecords.setData(segData);
    },

    /**
     * @api :submitCancellation
     * Will print the Payment Details
     * @arg1 {name} : Response to load data
     * @return : NA
     */
    submitCancellation: function () {
      var scope = this;
      try {
        let tempUploadDocuments = [];
        docReferenceValues.map((item, index) => {
          tempUploadDocuments.push({
            documentName: documentsList[index][0],
            documentReference: item
          });
        });
        let params = {
          billReference: billData.billReference,
          reasonForCancellation: widgetScope.txtReasonForCancellation.text,
          cancellationDocuments: JSON.stringify(tempUploadDocuments)
        };
        presenter.cancelBill(params, "frmCancelBill");
      } catch (err) {
        var errorObj = {
          "method": "submitCancellation",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api :renderAckScreen
     * Rendering ack screen after cancellation call
     * @arg : NA
     * @return : NA
     */
    renderAckScreen: function () {
      formTemplateScope.showBannerError({ i18n: presenter.renderI18nKeys('i18n.TradeFinance.cancellationRequestAcknowledgementMessage', false) });
      this.renderPageTitle(true);
      this.renderBillOverview();
      widgetScope.flxOverview.setVisibility(true);
      widgetScope.flxCancellationDetails.setVisibility(false);
      widgetScope.flxAckActions.setVisibility(true);
    },

    /**
     * @api :renderBillOverview
     * Rendering bill overview details
     * @arg : NA
     * @return : NA
     */
    renderBillOverview: function () {
      segOverviewData = [
        [
          {
            flxDetailsHeader: {
              isVisible: false
            }
          },
          [
            {
              lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.billReferenceWithColon', false),
              lblValue: billData.billReference || NA
            },
            {
              lblKey: presenter.renderI18nKeys('i18n.TradeFinance.updatedOnWithColon', false),
              lblValue: billData.updatedOn ? presenter.formatUtilManager.getFormattedCalendarDate(billData.updatedOn) : NA
            },
            {
              lblKey: presenter.renderI18nKeys('i18n.serviceRequests.Status:', false),
              lblValue: {
                text: billData.status || NA,
                skin: 'ICSknlbl424242SSP15pxSemibold'
              }
            },
          ]
        ],
        [
          {
            lblHeading: presenter.renderI18nKeys('i18n.TradeSupplyFinance.cancellationDetails', false),
            lblDropdownIcon: {
              text: 'P'
            }
          },
          [
            {
              flxDetails: {
                top: '20dp'
              },
              lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.cancellationStatusWithColon', false),
              lblValue: billData.cancellationStatus || NA
            },
            {
              lblKey: presenter.renderI18nKeys('i18n.TradeSupplyFinance.reasonforCancellationWithColon', false),
              lblValue: billData.reasonForCancellation || NA
            },
          ]
        ]
      ];
      if (billData.cancellationDocuments) {
        const cancellationDocuments = JSON.parse(billData.cancellationDocuments.replace(/'/g, '"'));
        for (let i = 0; i < cancellationDocuments.length; i++) {
          segOverviewData[1][1].push({
            lblKey: {
              text: i === 0 ? presenter.renderI18nKeys('i18n.TradeSupplyFinance.cancellationDocumentsOptionalWithColon', false) : ''
            },
            lblValue: {
              text: cancellationDocuments[i].documentName || NA,
              skin: 'sknLbl4176A4SSP15Px'
            },
            flxValue: {
              cursorType: 'pointer',
              onClick: () => presenter.downloadDocument(cancellationDocuments[i].documentReference, kony.application.getCurrentForm().id)
            },
            flxMain: {
              height: (i === cancellationDocuments.length - 1) ? '40dp' : '30dp'
            }
          });
        }
      }
      widgetScope.segOverviewRecords.setData(segOverviewData);
    },
    /**
             * @api : toggleSectionHeader
             * Triggerd on click of dropdown in segment
             * @return : NA
             */
    toggleSectionHeader: function ({ sectionIndex, rowIndex }) {
      try {
        let newSegData = JSON.parse(JSON.stringify(widgetScope.segOverviewRecords.data));
        if (newSegData[sectionIndex][0]['lblDropdownIcon']['text'] === 'O') {
          newSegData[sectionIndex][0]['lblDropdownIcon']['text'] = 'P';
          newSegData[sectionIndex][1] = segOverviewData[sectionIndex][1];
        } else {
          newSegData[sectionIndex][0]['lblDropdownIcon']['text'] = 'O';
          newSegData[sectionIndex][1] = [];
        }
        for (let i = 0; i < segOverviewData.length; i++) {
          if (newSegData[i][1].length > 0) {
            newSegData[i][1] = segOverviewData[i][1];
          }
        }
        segOverviewData[sectionIndex][0]['lblDropdownIcon']['text'] = newSegData[sectionIndex][0]['lblDropdownIcon']['text']
        widgetScope.segOverviewRecords.setData(newSegData);
      } catch (err) {
        const errorObj = {
          "method": "toggleSectionHeader",
          "error": err
        };
        this.onError(errorObj);
      }
    },
    /**
             * Error thrown from catch block of form controller
             */
    onError: function (err) {
      kony.print(JSON.stringify(err));
    }
  };
});
