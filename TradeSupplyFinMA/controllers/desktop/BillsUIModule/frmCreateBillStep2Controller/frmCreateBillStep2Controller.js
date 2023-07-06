define(["FormControllerUtility", "CommonUtilities", "OLBConstants"], function (FormControllerUtility, CommonUtilities, OLBConstants) {
  const NA = kony.i18n.getLocalizedString("i18n.common.NA"),
    resourcesConstants = {
      'fontIcons': {
        'radioSelected': 'M',
        'radioUnselected': 'L',
        'checkboxSelected': 'C',
        'checkboxUnselected': 'D',
        'chevronUp': 'P',
        'chevronDown': 'O',
      },
      'skins': {
        'radioSelected': 'ICSknLblRadioBtnSelectedFontIcon003e7520px',
        'radioUnselected': 'ICSknLblRadioBtnUnelectedFontIcona0a0a020px',
        'checkboxSelected': 'ICSknLblRadioBtnSelectedFontIcon003e7520px',
        'checkboxUnselected': 'ICSknLblRadioBtnSelectedFontIcon003e7520px',
        'chevron': 'sknLblFontTypeIcon1a98ff14pxOther',
      },
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
  let presenter, contentScope, popupScope, titleActionScope, breakpoint, documentsList = [], selectedDocument = '', deletedDocumentIndex, uploadDocumentMessage, billData;
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
      billData = JSON.parse(JSON.stringify(presenter.billData));
      popupScope.flxReturnedHistoryContainer.doLayout = CommonUtilities.centerPopupFlex;
      this.view.formTemplate12.hideBannerError();
    },
    /**
     * Performs the actions required after rendering form
     */
    postShow: function () {
      applicationManager.getNavigationManager().applyUpdates(this);
      let roadmapData = [];
      for (const [key, value] of Object.entries(presenter.billRoadmap)) {
        roadmapData.push({
          'currentRow': key === 'step2',
          'rowLabel': value,
          'rowStatus': billData[key] === 'done' ? 'done' : key === 'step2' ? 'Inprogress' : 'Incomplete'
        });
      }
      roadmapData['showCopyDetails'] = false;
      contentScope.ProgressTracker.setData(roadmapData);
      if (billData.step2 !== 'done') {
        this.resetForm();
        if (presenter.countriesList && presenter.countriesList.length > 0) {
          this.setCountriesData(presenter.countriesList);
        } else {
          presenter.getAllCountries(this.view.id);
        }
        this.setOverviewDetails();
        if (billData.status) {
          this.preFillData();
        }
      }
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
      contentScope.calShipmentDate.dateEditable = false;
      contentScope.btnSave.onClick = this.togglePopup.bind(this, 'saveDraft');
      contentScope.btnClear.onClick = this.togglePopup.bind(this, 'clearDetails');
      contentScope.btnClose.onClick = () => {
        if (billData.status === OLBConstants.BILLS_STATUS.RETURNED_BY_BANK) {
          this.togglePopup("cancelRevise");
        } else {
          this.togglePopup("saveOrDeleteDraft");
        }
      };
      contentScope.flxSelectOriginCountry.onClick = this.toggleDropdown.bind(this, contentScope.flxOriginCountryList, contentScope.lblOriginCountryDropdown);
      contentScope.segOriginCountryList.onRowClick = this.segRowClick.bind(this, contentScope.segOriginCountryList, contentScope.lblSelectedOriginCountry, contentScope.flxOriginCountryList, contentScope.lblOriginCountryDropdown);
      contentScope.flxSelectDestinationCountry.onClick = this.toggleDropdown.bind(this, contentScope.flxDestinationCountryList, contentScope.lblDestinationCountryDropdown);
      contentScope.segDestinationCountryList.onRowClick = this.segRowClick.bind(this, contentScope.segDestinationCountryList, contentScope.lblSelectedDestinationCountry, contentScope.flxDestinationCountryList, contentScope.lblDestinationCountryDropdown);
      contentScope.btnUploadDocument.onClick = this.browseSupportingDocument;
      contentScope.txtGoodsDescription.onEndEditing = this.enableOrDisableSubmitButton;
      contentScope.calShipmentDate.onSelection = this.enableOrDisableSubmitButton;
      contentScope.txtShipmentAndTracking.onEndEditing = this.enableOrDisableSubmitButton;
      contentScope.txtGoodsDescription.onTextChange = this.validateField;
      contentScope.txtShipmentAndTracking.onTextChange = this.validateField;
      contentScope.tbxDischargePort.onTextChange = this.validateField;
      contentScope.tbxLoadingPort.onTextChange = this.validateField;
      contentScope.tbxFinalDestination.onTextChange = this.validateField;
      contentScope.txtMessageToBank.onTextChange = this.validateField;
      for (let i = 1; i <= 3; i++) {
        contentScope['flxShipmentModeIcon' + i].onClick = this.toggleShipmentMode.bind(this, i);
      }
      contentScope.btnBack.onClick = () => presenter.showView({ form: 'frmCreateBillStep1' });
      contentScope.btnSubmit.onClick = () => {
        let formData = scope.getFormData();
        presenter.billData['step2'] = 'done';
        if (billData.status === OLBConstants.BILLS_STATUS.RETURNED_BY_BANK) {
          presenter.revisedBillData = Object.assign(presenter.revisedBillData, formData);
          presenter.revisedBillData['dataModifiedStep2'] = presenter.compareRevisedBillData(formData);
        } else {
          presenter.billData = Object.assign(presenter.billData, formData);
        }
        presenter.showView({ form: 'frmCreateBillStep3' });
      };
      popupScope.flxReturnedHistoryClose.onClick = this.toggleContentPopup.bind(this, 'flxReturnedHistoryPopup', false);
      contentScope.flxDocumentInfoIcon.onClick = () => contentScope.flxUploadDocInfo.setVisibility(!contentScope.flxUploadDocInfo.isVisible);
      contentScope.flxDocInfoClose.onClick = () => contentScope.flxUploadDocInfo.setVisibility(false);
      this.renderCalendars();
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
      if (viewModel.countries) {
        this.setCountriesData(viewModel.countries);
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
      if (viewModel.saveBill) {
        this.view.formTemplate12.setBannerFocus();
        this.view.formTemplate12.showBannerError({ i18n: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.saveBillSuccessMessage') });
      }
      if (viewModel.serverError) {
        this.view.formTemplate12.setBannerFocus();
        this.view.formTemplate12.showBannerError({ dbpErrMsg: viewModel.serverError });
      }
    },
    /**
    * setting the position of calendars
    */
    renderCalendars: function () {
      const calendars = [contentScope.calShipmentDate];
      for (const calWidget of calendars) {
        calWidget.setContext({
          "widget": calWidget,
          "anchor": "bottom"
        });
      }
    },
    resetForm: function () {
      documentsList = [];
      selectedDocument = '';
      deletedDocumentIndex = '';
      contentScope.txtGoodsDescription.text = "";
      CommonUtilities.disableOldDaySelection(contentScope.calShipmentDate);
      contentScope.calShipmentDate.clear();
      contentScope.txtShipmentAndTracking.text = "";
      contentScope.segOriginCountryList.selectedRowIndex = null;
      contentScope.lblSelectedOriginCountry.text = kony.i18n.getLocalizedString('i18n.common.selecthere');
      contentScope.lblSelectedOriginCountry.toolTip = "";
      contentScope.lblSelectedOriginCountry.skin = "sknLblSSP72727215px";
      contentScope.segDestinationCountryList.selectedRowIndex = null;
      contentScope.lblSelectedDestinationCountry.text = kony.i18n.getLocalizedString('i18n.common.selecthere');
      contentScope.lblSelectedDestinationCountry.toolTip = "";
      contentScope.lblSelectedDestinationCountry.skin = "sknLblSSP72727215px";
      for (let i = 1; i <= 2; i++) {
        contentScope['lblShipmentModeIcon' + i].text = resourcesConstants.fontIcons.radioUnselected;
        contentScope['lblShipmentModeIcon' + i].skin = resourcesConstants.skins.radioUnselected;
      }
      contentScope.tbxDischargePort.text = "";
      contentScope.tbxLoadingPort.text = "";
      contentScope.tbxFinalDestination.text = "";
      contentScope.segDocumentsList.removeAll();
      contentScope.flxDocumentsList.setVisibility(false);
      contentScope.txtMessageToBank.text = "";
      FormControllerUtility.disableButton(contentScope.btnSubmit);
    },
    setCountriesData: function (countries) {
      if (!countries) return;
      let segData = [];
      contentScope.segOriginCountryList.widgetDataMap = {
        'lblListValue': 'value'
      };
      contentScope.segDestinationCountryList.widgetDataMap = {
        'lblListValue': 'value'
      };
      for (const country of countries) {
        segData.push({
          key: country,
          value: {
            text: country,
            toolTip: country
          }
        });
      }
      contentScope.segOriginCountryList.setData(segData);
      contentScope.segDestinationCountryList.setData(segData);
      contentScope.flxOriginCountryList.height = `${Math.min(segData.length * 41, 205)}dp`;
      contentScope.flxDestinationCountryList.height = `${Math.min(segData.length * 41, 205)}dp`;
      if (billData.countryOfOrigin) {
        for (let i = 0; i < segData.length; i++) {
          if (segData[i].key === billData.countryOfOrigin) {
            contentScope.segOriginCountryList.selectedRowIndex = [0, i];
            contentScope.lblSelectedOriginCountry.text = segData[i].value.text;
            contentScope.lblSelectedOriginCountry.toolTip = segData[i].value.toolTip;
            contentScope.lblSelectedOriginCountry.skin = "sknLblSSP15pxtrucation";
            break;
          }
        }
      }
      if (billData.countryOfDestination) {
        for (let i = 0; i < segData.length; i++) {
          if (segData[i].key === billData.countryOfDestination) {
            contentScope.segDestinationCountryList.selectedRowIndex = [0, i];
            contentScope.lblSelectedDestinationCountry.text = segData[i].value.text;
            contentScope.lblSelectedDestinationCountry.toolTip = segData[i].value.toolTip;
            contentScope.lblSelectedDestinationCountry.skin = "sknLblSSP15pxtrucation";
            break;
          }
        }
      }
    },
    toggleDropdown: function (flxDropdownList, lblDropdownIcon) {
      if (flxDropdownList.isVisible) {
        flxDropdownList.setVisibility(false);
        lblDropdownIcon.text = resourcesConstants.fontIcons.chevronDown;
      } else {
        flxDropdownList.setVisibility(true);
        lblDropdownIcon.text = resourcesConstants.fontIcons.chevronUp;
      }
    },
    segRowClick: function (segWidget, lblSelectedValue, flxList, lblDropdownIcon) {
      const data = segWidget.selectedRowItems[0];
      lblSelectedValue.text = data.value.text;
      if (lblSelectedValue.text === kony.i18n.getLocalizedString('i18n.common.selecthere')) {
        lblSelectedValue.toolTip = "";
        lblSelectedValue.skin = "sknLblSSP72727215px";
      } else {
        lblSelectedValue.toolTip = data.value.toolTip;
        lblSelectedValue.skin = "sknLblSSP15pxtrucation";
      }
      flxList.setVisibility(false);
      lblDropdownIcon.text = resourcesConstants.fontIcons.chevronDown;
      this.enableOrDisableSubmitButton();
    },
    toggleShipmentMode: function (idx) {
      for (let i = 1; i <= 3; i++) {
        if (idx === i) {
          contentScope['lblShipmentModeIcon' + i].text = resourcesConstants.fontIcons.radioSelected;
          contentScope['lblShipmentModeIcon' + i].skin = resourcesConstants.skins.radioSelected;
        } else {
          contentScope['lblShipmentModeIcon' + i].text = resourcesConstants.fontIcons.radioUnselected;
          contentScope['lblShipmentModeIcon' + i].skin = resourcesConstants.skins.radioUnselected;
        }
      }
    },
    togglePopup: function (flow) {
      let popupContext = {};
      switch (flow) {
        case "clearDetails":
          popupContext = {
            heading: kony.i18n.getLocalizedString("i18n.TransfersEur.clear"),
            message: kony.i18n.getLocalizedString("i18n.TradeFinance.confirmationClearFilledDetails"),
            noText: kony.i18n.getLocalizedString("i18n.konybb.common.cancel"),
            yesText: kony.i18n.getLocalizedString("i18n.TransfersEur.clear"),
            yesClick: () => this.resetForm()
          };
          break;
        case "saveDraft":
          popupContext = {
            heading: kony.i18n.getLocalizedString("i18n.TradeFinance.SaveDraft"),
            message: kony.i18n.getLocalizedString("i18n.TradeFinance.AreYouSureYouWantToSaveThisDraft"),
            noText: kony.i18n.getLocalizedString("i18n.konybb.common.cancel"),
            yesText: kony.i18n.getLocalizedString("i18n.ProfileManagement.Save"),
            yesClick: () => this.saveDraft(flow)
          };
          break;
        case "saveOrDeleteDraft":
          popupContext = {
            heading: kony.i18n.getLocalizedString("i18n.common.close"),
            message: billData.billReference ? kony.i18n.getLocalizedString("i18n.TradeFinance.saveAsDraftAndCloseOrDeletePermanentlyMessage") : kony.i18n.getLocalizedString("i18n.TradeFinance.saveAsDraftAndCloseOrCloseWithoutSavedMessage"),
            noText: billData.billReference ? kony.i18n.getLocalizedString("kony.mb.Messages.DeletePermanently") : kony.i18n.getLocalizedString("i18n.TradeFinance.closeWithoutSaving"),
            yesText: kony.i18n.getLocalizedString("i18n.TradeFinance.SaveasDraft&Close"),
            noClick: () => this.deletePermanently(),
            yesClick: () => this.saveDraft(flow)
          };
          break;
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
    getFormData: function () {
      let formData = {
        'goodsDescription': contentScope.txtGoodsDescription.text,
        'shipmentDate': contentScope.calShipmentDate.formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2"),
        'shipmentTrackingDetails': contentScope.txtShipmentAndTracking.text,
        'countryOfOrigin': contentScope.segOriginCountryList.selectedRowIndex ? contentScope.segOriginCountryList.selectedRowItems[0].key : '',
        'countryOfDestination': contentScope.segDestinationCountryList.selectedRowIndex ? contentScope.segDestinationCountryList.selectedRowItems[0].key : '',
        'modeOfShipment': ['Air', 'Road', 'Sea'].reduce((acc, val, idx) => acc || (contentScope[`lblShipmentModeIcon${idx + 1}`].text === resourcesConstants.fontIcons.radioSelected ? val : ''), '') || '',
        'portOfDischarge': contentScope.tbxDischargePort.text,
        'portOfLoading': contentScope.tbxLoadingPort.text,
        'finalDestination': contentScope.tbxFinalDestination.text,
        'uploadedDocuments': documentsList.length > 0 ? JSON.stringify(documentsList) : '',
        'messageToBank': contentScope.txtMessageToBank.text
      };
      return formData;
    },
    enableOrDisableSubmitButton: function () {
      const formData = this.getFormData();
      const mandatoryFilled = [formData['goodsDescription'], formData['shipmentDate'], formData['shipmentTrackingDetails'], formData['countryOfOrigin'], formData['countryOfDestination'], formData['uploadedDocuments']].every(value => !!value);
      FormControllerUtility[mandatoryFilled ? 'enableButton' : 'disableButton'](contentScope.btnSubmit);
    },
    saveDraft: function (flow) {
      const formData = this.getFormData();
      presenter.saveBill(formData, flow, this.view.id);
    },
    deletePermanently: function () {
      if (billData.billReference) {
        presenter.deleteBill(this.view.id);
      } else {
        presenter.showBillsScreen({ context: 'viewBills' });
      }
    },
    preFillData: function () {
      contentScope.txtGoodsDescription.text = billData.goodsDescription || '';
      if (billData.shipmentDate && (new Date(billData.shipmentDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))) {
        const shipmentDate = new Date(billData.shipmentDate);
        contentScope.calShipmentDate.dateComponents = [shipmentDate.getDate(), shipmentDate.getMonth() + 1, shipmentDate.getFullYear()];
      }
      contentScope.txtShipmentAndTracking.text = billData.shipmentTrackingDetails || '';
      if (billData.modeOfShipment) {
        this.toggleShipmentMode(billData.modeOfShipment === 'Air' ? 1 : billData.modeOfShipment === 'Road' ? 2 : 3);
      }
      contentScope.tbxDischargePort.text = billData.portOfDischarge || '';
      contentScope.tbxLoadingPort.text = billData.portOfLoading || '';
      contentScope.tbxFinalDestination.text = billData.finalDestination || '';
      if (billData.uploadedDocuments) {
        documentsList = JSON.parse(billData.uploadedDocuments.replace(/'/g, '"'));
        this.setDocumentsList();
      }
      contentScope.txtMessageToBank.text = billData.messageToBank || '';
      this.enableOrDisableSubmitButton();
    },
    validateField: function () {
      const tbxWidgetId = arguments[0].id;
      switch (tbxWidgetId) {
        case 'tbxDischargePort':
        case 'tbxLoadingPort':
        case 'tbxFinalDestination':
          contentScope[tbxWidgetId].text = contentScope[tbxWidgetId].text.replace(/[^a-zA-Z0-9 ]/g, '');
          break;
        default:
          contentScope[tbxWidgetId].text = contentScope[tbxWidgetId].text.replace(/[^a-zA-Z0-9 <>\?:'\-+=]/g, '');
          break;
      }
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
      scope.enableOrDisableSubmitButton();
      if (documentsList.length === 0) {
        contentScope.segDocumentsList.removeAll();
        contentScope.flxDocumentsList.setVisibility(false);
        return;
      }
      contentScope.flxDocumentsList.setVisibility(true);
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
      contentScope.segDocumentsList.widgetDataMap = {
        "imgDocType": "imgDocType",
        "lblDocName": "lblDocName",
        "flxDeleteDoc": "flxDeleteDoc"
      };
      contentScope.segDocumentsList.setData(segData);
      contentScope.forceLayout();
    },
    setOverviewDetails: function () {
      if (billData.status !== OLBConstants.BILLS_STATUS.RETURNED_BY_BANK) {
        this.view.formTemplate12.pageTitle = kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.createBill');
        contentScope.flxBillOverview.setVisibility(false);
        contentScope.btnClear.setVisibility(true);
        contentScope.btnSave.setVisibility(true);
        contentScope.btnClose.text = kony.i18n.getLocalizedString('i18n.common.close');
        contentScope.btnClose.toolTip = kony.i18n.getLocalizedString('i18n.common.close');
        contentScope.ProgressTracker.lblApplicationStep.text = kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.createBill');
        return;
      }
      const returnedHistoryData = billData.returnedHistory ? JSON.parse(billData.returnedHistory.replace(/'/g, '"')) : [];
      this.view.formTemplate12.pageTitle = `${kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.reviseBill')} - ${billData.billReference}`;
      contentScope.flxBillOverview.setVisibility(true);
      contentScope.btnClear.setVisibility(false);
      contentScope.btnSave.setVisibility(false);
      contentScope.btnClose.text = kony.i18n.getLocalizedString('i18n.konybb.common.cancel');
      contentScope.btnClose.toolTip = kony.i18n.getLocalizedString('i18n.konybb.common.cancel');
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
            text: billData.billReference || NA
          }
        }, {
          lblKey: {
            text: kony.i18n.getLocalizedString('i18n.TradeFinance.updatedOnWithColon')
          },
          lblValue: {
            text: billData.updatedOn ? presenter.formatUtilManager.getFormattedCalendarDate(billData.updatedOn) : NA
          }
        }, {
          lblKey: {
            text: kony.i18n.getLocalizedString('i18n.serviceRequests.Status:')
          },
          lblValue: {
            text: billData.status || NA,
            skin: 'sknLblSSP42424215pxBold'
          }
        }, {
          lblKey: {
            text: kony.i18n.getLocalizedString('i18n.TradeFinance.reasonForReturnedWithColon')
          },
          lblValue: {
            text: billData.reasonForReturn || NA,
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