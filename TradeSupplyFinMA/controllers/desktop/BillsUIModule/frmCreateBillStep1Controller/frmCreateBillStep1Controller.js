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
      }
    };
  let presenter, contentScope, popupScope, titleActionScope, breakpoint, bills, prevCDIdx, billData;
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
      popupScope.flxCopyDetailsContainer.doLayout = CommonUtilities.centerPopupFlex;
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
          'currentRow': key === 'step1',
          'rowLabel': value,
          'rowStatus': billData[key] === 'done' ? 'done' : key === 'step1' ? 'Inprogress' : 'Incomplete'
        });
      }
      roadmapData['showCopyDetails'] = true;
      contentScope.ProgressTracker.setData(roadmapData);
      if (billData.step1 !== 'done') {
        this.resetForm();
        this.setDropdownValues(contentScope.segBillType, presenter.billConfig.billTypes, contentScope.flxBillTypeList);
        this.setDropdownValues(contentScope.segCurrency, presenter.billConfig.currencies, contentScope.flxCurrencyList);
        this.setAccountsData();
        presenter.getBuyerData(this.view.id);
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
      contentScope.calBillDate.dateEditable = false;
      contentScope.calDueDate.dateEditable = false;
      contentScope.btnSave.onClick = this.togglePopup.bind(this, 'saveDraft');
      contentScope.btnClear.onClick = this.togglePopup.bind(this, 'clearDetails');
      contentScope.btnClose.onClick = () => {
        if (billData.status === OLBConstants.BILLS_STATUS.RETURNED_BY_BANK) {
          this.togglePopup("cancelRevise");
        } else {
          this.togglePopup("saveOrDeleteDraft");
        }
      };
      contentScope.flxSelectedBillType.onClick = this.toggleDropdown.bind(this, contentScope.flxBillTypeList, contentScope.lblBillTypeDropdown);
      contentScope.segBillType.onRowClick = this.segRowClick.bind(this, contentScope.segBillType, contentScope.lblSelectedBillType, contentScope.flxBillTypeList, contentScope.lblBillTypeDropdown);
      contentScope.flxCurrencyDropdown.onClick = this.toggleDropdown.bind(this, contentScope.flxCurrencyList, contentScope.lblCurrencyDropdown);
      contentScope.segCurrency.onRowClick = this.segRowClick.bind(this, contentScope.segCurrency, contentScope.lblSelectedCurrency, contentScope.flxCurrencyList, contentScope.lblCurrencyDropdown);
      contentScope.flxSelectedAccountReceivable.onClick = this.toggleDropdown.bind(this, contentScope.flxAccountReceivableList, contentScope.lblAccountReceivableDropdown);
      contentScope.segAccountReceivable.onRowClick = this.segRowClick.bind(this, contentScope.segAccountReceivable, contentScope.lblSelectedAccountReceivable, contentScope.flxAccountReceivableList, contentScope.lblAccountReceivableDropdown);
      contentScope.flxRequestFinanceCheckbox.onClick = this.toggleCheckbox.bind(this, contentScope.lblRequestFinanceCheckbox);
      contentScope.ProgressTracker.lblCoptyStatus.onTouchEnd = this.toggleContentPopup.bind(this, 'flxCopyDetailsPopup', true);
      popupScope.flxReturnedHistoryClose.onClick = this.toggleContentPopup.bind(this, 'flxReturnedHistoryPopup', false);
      contentScope.tbxBillNumber.onEndEditing = this.enableOrDisableSubmitButton;
      contentScope.calBillDate.onSelection = this.enableOrDisableSubmitButton;
      contentScope.calDueDate.onSelection = this.enableOrDisableSubmitButton;
      contentScope.tbxPaymentTerms.onEndEditing = this.enableOrDisableSubmitButton;
      contentScope.tbxAmount.onEndEditing = this.formatAmount;
      contentScope.flxBuyerDropdown.onClick = this.toggleDropdown.bind(this, contentScope.flxBuyerList, contentScope.lblBuyerDropdownIcon);
      contentScope.segBuyerList.onRowClick = this.segRowClick.bind(this, contentScope.segBuyerList, contentScope.lblSelectedBuyer, contentScope.flxBuyerList, contentScope.lblBuyerDropdownIcon);
      contentScope.tbxBuyerName.onEndEditing = this.enableOrDisableSubmitButton;
      contentScope.tbxBuyerAddress.onEndEditing = this.enableOrDisableSubmitButton;
      contentScope.tbxBillName.onTextChange = this.validateField;
      contentScope.tbxBillNumber.onTextChange = this.validateField;
      contentScope.tbxPaymentTerms.onTextChange = this.validateField;
      contentScope.tbxAmount.onTextChange = this.validateField;
      contentScope.tbxBuyerName.onTextChange = this.validateField;
      for (let i = 1; i <= 2; i++) {
        contentScope['flxBuyerOptionIcon' + i].onClick = this.toggleBuyerOption.bind(this, i);
      }
      contentScope.btnSubmit.onClick = () => {
        let formData = scope.getFormData();
        presenter.billData['step1'] = 'done';
        if (billData.status === OLBConstants.BILLS_STATUS.RETURNED_BY_BANK) {
          presenter.revisedBillData = Object.assign(presenter.revisedBillData, formData);
          presenter.revisedBillData['dataModifiedStep1'] = presenter.compareRevisedBillData(formData);
        } else {
          presenter.billData = Object.assign(presenter.billData, formData);
        }
        presenter.showView({ form: 'frmCreateBillStep2' });
      };
      popupScope.txtCDSearch.onTextChange = () => popupScope.flxCDSearchClear.setVisibility(popupScope.txtCDSearch.text !== '');
      popupScope.txtCDSearch.onDone = () => {
        FormControllerUtility.disableButton(popupScope.btnCD2);
        scope.getCDData();
      };
      popupScope.flxCDSearchClear.onTouchEnd = () => {
        popupScope.txtCDSearch.text = '';
        popupScope.flxCDSearchClear.setVisibility(false);
        FormControllerUtility.disableButton(popupScope.btnCD2);
        scope.getCDData();
      };
      popupScope.flxCDClose.onClick = this.toggleContentPopup.bind(this, 'flxCopyDetailsPopup', false);
      popupScope.btnCD1.onClick = this.toggleContentPopup.bind(this, 'flxCopyDetailsPopup', false);
      popupScope.btnCD2.onClick = this.copyDetails;
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
      if (viewModel.buyerData) {
        this.setBuyerDetails(viewModel.buyerData);
      }
      if (viewModel.saveBill) {
        this.view.formTemplate12.setBannerFocus();
        this.view.formTemplate12.showBannerError({ i18n: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.saveBillSuccessMessage') });
      }
      if (viewModel.bills) {
        bills = viewModel.bills;
        this.setCDData();
      }
      if (viewModel.serverError) {
        this.view.formTemplate12.setBannerFocus();
        this.view.formTemplate12.showBannerError({ dbpErrMsg: viewModel.serverError });
        this.toggleContentPopup('flxCopyDetailsPopup', false);
      }
    },
    /**
    * setting the position of calendars
    */
    renderCalendars: function () {
      const calendars = [contentScope.calBillDate, contentScope.calDueDate];
      for (const calWidget of calendars) {
        calWidget.setContext({
          "widget": calWidget,
          "anchor": "bottom"
        });
      }
    },
    resetForm: function () {
      contentScope.tbxBillName.text = "";
      contentScope.tbxBillNumber.text = "";
      CommonUtilities.disableOldDaySelection(contentScope.calBillDate);
      contentScope.calBillDate.clear();
      contentScope.segBillType.selectedRowIndex = null;
      contentScope.lblSelectedBillType.text = kony.i18n.getLocalizedString('i18n.common.selecthere');
      contentScope.lblSelectedBillType.toolTip = "";
      contentScope.lblSelectedBillType.skin = "sknLblSSP72727215px";
      CommonUtilities.disableOldDaySelection(contentScope.calDueDate);
      contentScope.calDueDate.clear();
      contentScope.tbxPaymentTerms.text = "";
      contentScope.segCurrency.selectedRowIndex = null;
      contentScope.lblSelectedCurrency.text = '';
      contentScope.lblSelectedCurrency.toolTip = "";
      contentScope.lblSelectedCurrency.skin = "sknLblSSP72727215px";
      contentScope.tbxAmount.text = "";
      contentScope.segAccountReceivable.selectedRowIndex = null;
      contentScope.lblSelectedAccountReceivable.text = kony.i18n.getLocalizedString('i18n.common.selecthere');
      contentScope.lblSelectedAccountReceivable.toolTip = "";
      contentScope.lblSelectedAccountReceivable.skin = "sknLblSSP72727215px";
      contentScope.lblRequestFinanceCheckbox.text = resourcesConstants.fontIcons.checkboxUnselected;
      for (let i = 1; i <= 2; i++) {
        contentScope['lblBuyerOptionIcon' + i].text = resourcesConstants.fontIcons.radioUnselected;
        contentScope['lblBuyerOptionIcon' + i].skin = resourcesConstants.skins.radioUnselected;
      }
      contentScope.flxSelectBuyerDetails.setVisibility(false);
      contentScope.segBuyerList.selectedRowIndex = null;
      contentScope.lblSelectedBuyer.text = kony.i18n.getLocalizedString('i18n.common.selecthere');
      contentScope.lblSelectedBuyer.toolTip = "";
      contentScope.lblSelectedBuyer.skin = "sknLblSSP72727215px";
      contentScope.flxSelectedBuyerDetails.setVisibility(false);
      contentScope.lblSelectedBuyerDetail1Value.text = "";
      contentScope.lblSelectedBuyerDetail2Value.text = "";
      contentScope.flxEnterBuyerDetails.setVisibility(false);
      contentScope.tbxBuyerName.text = "";
      contentScope.tbxBuyerAddress.text = "";
      FormControllerUtility.disableButton(contentScope.btnSubmit);
      popupScope.setVisibility(false);
    },
    /*
     * Sets the data to the dropdown Segment
     */
    setDropdownValues: function (segWidget, listValues, flxList) {
      if (!listValues) return;
      let segmentData = [];
      segWidget.widgetDataMap = {
        lblListValue: 'value'
      };
      const isArray = Array.isArray(listValues);
      for (const [key, value] of Object.entries(listValues)) {
        segmentData.push({
          key: isArray ? value : key,
          value: {
            text: value,
            toolTip: value
          }
        });
      }
      segWidget.setData(segmentData);
      flxList.height = `${Math.min(segmentData.length * 41, 205)}dp`;
    },
    setAccountsData: function () {
      const accountsData = (presenter.accountManager.getInternalAccounts() || []).filter(acc => presenter.billConfig.accountTypes.includes(acc.accountType));
      contentScope.segAccountReceivable.widgetDataMap = {
        lblListValue: 'value'
      };
      let segAccountData = [];
      for (const account of accountsData) {
        const accName = CommonUtilities.getAccountDisplayName(account);
        segAccountData.push({
          key: account.accountID,
          value: {
            text: accName,
            toolTip: accName
          }
        });
      }
      contentScope.segAccountReceivable.setData(segAccountData);
      contentScope.flxAccountReceivableList.height = `${Math.min(segAccountData.length * 41, 205)}dp`;
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
      if (segWidget.id === 'segBuyerList') {
        contentScope.flxSelectedBuyerDetails.setVisibility(true);
        contentScope.lblSelectedBuyerDetail1Value.text = data.buyerName || NA;
        contentScope.lblSelectedBuyerDetail2Value.text = data.buyerAddress || NA;
      }
      this.enableOrDisableSubmitButton();
    },
    toggleCheckbox: function (lblCheckbox) {
      lblCheckbox.text = (lblCheckbox.text === resourcesConstants.fontIcons.checkboxSelected) ? resourcesConstants.fontIcons.checkboxUnselected : resourcesConstants.fontIcons.checkboxSelected;
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
        'billName': contentScope.tbxBillName.text,
        'billNumber': contentScope.tbxBillNumber.text,
        'billDate': contentScope.calBillDate.formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2"),
        'billType': contentScope.segBillType.selectedRowIndex ? contentScope.segBillType.selectedRowItems[0].key : '',
        'dueDate': contentScope.calDueDate.formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2"),
        'paymentTerms': contentScope.tbxPaymentTerms.text,
        'currency': contentScope.segCurrency.selectedRowIndex ? contentScope.segCurrency.selectedRowItems[0].key : '',
        'amount': presenter.formatUtilManager.deFormatAmount(contentScope.tbxAmount.text),
        'receivableAccount': contentScope.segAccountReceivable.selectedRowIndex ? contentScope.segAccountReceivable.selectedRowItems[0].key : '',
        'requestFinance': contentScope.lblRequestFinanceCheckbox.text === resourcesConstants.fontIcons.checkboxSelected ? 'Yes' : 'No',
        'buyerSelection': '',
        'buyerName': '',
        'buyerAddress': ''
      };
      if (contentScope.flxSelectBuyerDetails.isVisible && contentScope.flxSelectedBuyerDetails.isVisible && contentScope.segBuyerList.selectedRowIndex) {
        const selectedBuyer = contentScope.segBuyerList.selectedRowItems[0];
        formData['buyerSelection'] = 'existing';
        formData['buyerName'] = selectedBuyer.buyerName;
        formData['buyerAddress'] = selectedBuyer.buyerAddress;
      } else if (contentScope.flxEnterBuyerDetails.isVisible) {
        formData['buyerSelection'] = 'manual';
        formData['buyerName'] = contentScope.tbxBuyerName.text;
        formData['buyerAddress'] = contentScope.tbxBuyerAddress.text;
      }
      return formData;
    },
    enableOrDisableSubmitButton: function () {
      const formData = this.getFormData();
      const mandatoryFilled = [formData['billNumber'], formData['billDate'], formData['billType'], formData['dueDate'], formData['paymentTerms'], formData['currency'], formData['amount'], formData['receivableAccount'], formData['buyerName'], formData['buyerAddress']].every(value => !!value);
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
    toggleContentPopup: function (popupWidget, visibility) {
      popupScope.setVisibility(visibility);
      popupScope[popupWidget].setVisibility(visibility);
      if (popupWidget === 'flxCopyDetailsPopup' && visibility) {
        popupScope.txtCDSearch.text = "";
        popupScope.flxCDSearchClear.setVisibility(false);
        FormControllerUtility.disableButton(popupScope.btnCD2);
        this.getCDData();
      }
    },
    getCDData: function () {
      presenter.getBills({
        searchString: popupScope.txtCDSearch.text || '',
        filterByValue: OLBConstants.BILLS_STATUS.APPROVED,
        filterByParam: 'status',
        sortByParam: 'updatedOn',
        sortOrder: 'DESC'
      }, this.view.id);
    },
    copyDetails: function () {
      billData = bills[prevCDIdx];
      if (!billData) return;
      ['billReference', 'status', 'updatedOn'].forEach(key => delete billData[key]);
      presenter.billData = billData;
      this.preFillData();
      this.preFillBuyerData();
      this.toggleContentPopup('flxCopyDetailsPopup', false);
    },
    preFillData: function () {
      contentScope.tbxBillName.text = billData.billName || '';
      contentScope.tbxBillNumber.text = billData.billNumber || '';
      if (billData.billDate && (new Date(billData.billDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))) {
        const billDate = new Date(billData.billDate);
        contentScope.calBillDate.dateComponents = [billDate.getDate(), billDate.getMonth() + 1, billDate.getFullYear()];
      }
      if (billData.billType) {
        const billTypeData = contentScope.segBillType.data;
        for (let i = 0; i < billTypeData.length; i++) {
          if (billTypeData[i].key === billData.billType) {
            contentScope.segBillType.selectedRowIndex = [0, i];
            contentScope.lblSelectedBillType.text = billTypeData[i].value.text;
            contentScope.lblSelectedBillType.toolTip = billTypeData[i].value.toolTip;
            contentScope.lblSelectedBillType.skin = "sknLblSSP15pxtrucation";
            break;
          }
        }
      }
      if (billData.dueDate && (new Date(billData.dueDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))) {
        const dueDate = new Date(billData.dueDate);
        contentScope.calDueDate.dateComponents = [dueDate.getDate(), dueDate.getMonth() + 1, dueDate.getFullYear()];
      }
      contentScope.tbxPaymentTerms.text = billData.paymentTerms || '';
      if (billData.currency) {
        const currencyData = contentScope.segCurrency.data;
        for (let i = 0; i < currencyData.length; i++) {
          if (currencyData[i].key === billData.currency) {
            contentScope.segCurrency.selectedRowIndex = [0, i];
            contentScope.lblSelectedCurrency.text = currencyData[i].value.text;
            contentScope.lblSelectedCurrency.toolTip = currencyData[i].value.toolTip;
            contentScope.lblSelectedCurrency.skin = "sknLblSSP15pxtrucation";
            break;
          }
        }
      }
      contentScope.tbxAmount.text = billData.amount ? presenter.formatUtilManager.formatAmount(billData.amount) : '';
      if (billData.receivableAccount) {
        const accountReceivableData = contentScope.segAccountReceivable.data;
        for (let i = 0; i < accountReceivableData.length; i++) {
          if (accountReceivableData[i].key === billData.receivableAccount) {
            contentScope.segAccountReceivable.selectedRowIndex = [0, i];
            contentScope.lblSelectedAccountReceivable.text = accountReceivableData[i].value.text;
            contentScope.lblSelectedAccountReceivable.toolTip = accountReceivableData[i].value.toolTip;
            contentScope.lblSelectedAccountReceivable.skin = "sknLblSSP15pxtrucation";
            break;
          }
        }
      }
      contentScope.lblRequestFinanceCheckbox.text = billData.requestFinance === 'Yes' ? resourcesConstants.fontIcons.checkboxSelected : resourcesConstants.fontIcons.checkboxUnselected;
      this.enableOrDisableSubmitButton();
    },
    toggleBuyerOption: function (idx) {
      for (let i = 1; i <= 2; i++) {
        if (idx === i) {
          contentScope['lblBuyerOptionIcon' + i].text = resourcesConstants.fontIcons.radioSelected;
          contentScope['lblBuyerOptionIcon' + i].skin = resourcesConstants.skins.radioSelected;
        } else {
          contentScope['lblBuyerOptionIcon' + i].text = resourcesConstants.fontIcons.radioUnselected;
          contentScope['lblBuyerOptionIcon' + i].skin = resourcesConstants.skins.radioUnselected;
        }
      }
      if (idx === 1) {
        contentScope.flxSelectBuyerDetails.setVisibility(true);
        contentScope.flxEnterBuyerDetails.setVisibility(false);
        contentScope.segBuyerList.selectedRowIndex = null;
        contentScope.lblSelectedBuyer.text = kony.i18n.getLocalizedString('i18n.common.selecthere');
        contentScope.lblSelectedBuyer.toolTip = "";
        contentScope.lblSelectedBuyer.skin = "sknLblSSP72727215px";
        contentScope.flxSelectedBuyerDetails.setVisibility(false);
        contentScope.lblSelectedBuyerDetail1Value.text = "";
        contentScope.lblSelectedBuyerDetail2Value.text = "";
      } else {
        contentScope.flxSelectBuyerDetails.setVisibility(false);
        contentScope.flxEnterBuyerDetails.setVisibility(true);
        contentScope.tbxBuyerName.text = "";
        contentScope.tbxBuyerAddress.text = "";
      }
      this.enableOrDisableSubmitButton();
    },
    setBuyerDetails: function (buyerData) {
      contentScope.segBuyerList.widgetDataMap = {
        lblListValue: 'value'
      };
      let segBuyerData = [];
      for (const buyer of buyerData) {
        const name = buyer.accountNumber ? `${buyer.beneficiaryName}...${buyer.accountNumber.slice(-4)}` : buyer.beneficiaryName;
        const address = [buyer.addressLine1 || buyer.address1, buyer.addressLine2 || buyer.address2, buyer.city, buyer.state, buyer.country, buyer.zipcode].join(',').replace(/^,+|,+$/g, '').replace(/,+/g, ', ');
        if (address) {
          segBuyerData.push({
            buyerName: buyer.beneficiaryName,
            buyerAddress: address,
            value: {
              text: name,
              toolTip: name
            }
          });
        }
      }
      contentScope.segBuyerList.setData(segBuyerData);
      contentScope.flxBuyerList.height = `${Math.min(segBuyerData.length * 41, 205)}dp`;
      this.preFillBuyerData();
    },
    formatAmount: function () {
      let amount = contentScope.tbxAmount.text;
      if (amount) {
        amount = presenter.formatUtilManager.formatAmount(amount);
        contentScope.tbxAmount.text = amount || '';
      }
      this.enableOrDisableSubmitButton();
    },
    validateField: function () {
      const tbxWidgetId = arguments[0].id;
      switch (tbxWidgetId) {
        case 'tbxAmount':
          contentScope[tbxWidgetId].text = contentScope[tbxWidgetId].text.replace(/[^0-9.,]/g, '');
          break;
        case 'tbxBillNumber':
          contentScope[tbxWidgetId].text = contentScope[tbxWidgetId].text.replace(/[^a-zA-Z0-9]/g, '');
          break;
        default:
          contentScope[tbxWidgetId].text = contentScope[tbxWidgetId].text.replace(/[^a-zA-Z0-9 <>\?:'\-+=]/g, '');
          break;
      }
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
      contentScope.ProgressTracker.lblCoptyStatus.setVisibility(false);
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
    setCDData: function () {
      if (!bills || bills.length === 0) {
        popupScope.flxCDList.setVisibility(false);
        popupScope.flxCDNoTransactions.setVisibility(true);
        popupScope.flxCDActions.setVisibility(false);
        return;
      }
      popupScope.flxCDList.setVisibility(true);
      popupScope.flxCDNoTransactions.setVisibility(false);
      popupScope.flxCDActions.setVisibility(true);
      let segCDData = [];
      prevCDIdx = undefined;
      popupScope.segCopyDetails.widgetDataMap = {
        'lblField1Icon': 'lblField1Icon',
        'lblField2': 'lblField2',
        'lblField2': 'lblField2',
        'lblField3': 'lblField3',
        'lblField4': 'lblField4',
        'lblField5': 'lblField5',
      };
      bills.forEach((bill, idx) => {
        segCDData.push({
          'lblField1Icon': {
            'text': resourcesConstants.fontIcons.radioUnselected,
            'skin': resourcesConstants.skins.radioUnselected,
            'cursorType': 'pointer',
            'onTouchEnd': this.toggleCDRadioButton.bind(this, idx)
          },
          'lblField2': {
            'text': bill.buyerName || NA
          },
          'lblField3': {
            'text': bill.billReference || NA
          },
          'lblField4': {
            'text': bill.billDate ? presenter.formatUtilManager.getFormattedCalendarDate(bill.billDate) : NA
          },
          'lblField5': {
            'contentAlignment': constants.CONTENT_ALIGN_MIDDLE_RIGHT,
            'text': (bill.currency && bill.amount) ? `${bill.currency} ${presenter.formatUtilManager.formatAmount(bill.amount)}` : NA
          }
        });
      });
      popupScope.segCopyDetails.setData(segCDData);
    },
    toggleCDRadioButton: function (idx) {
      let segData = popupScope.segCopyDetails.data;
      if (prevCDIdx) {
        let prevIdxData = segData[prevCDIdx];
        prevIdxData['lblField1Icon'].text = resourcesConstants.fontIcons.radioUnselected;
        prevIdxData['lblField1Icon'].skin = resourcesConstants.skins.radioUnselected;
        popupScope.segCopyDetails.setDataAt(prevIdxData, prevCDIdx);
      }
      let currIdxData = segData[idx];
      currIdxData['lblField1Icon'].text = resourcesConstants.fontIcons.radioSelected;
      currIdxData['lblField1Icon'].skin = resourcesConstants.skins.radioSelected;
      popupScope.segCopyDetails.setDataAt(currIdxData, idx);
      prevCDIdx = idx;
      FormControllerUtility.enableButton(popupScope.btnCD2);
    },
    preFillBuyerData: function () {
      const segBuyerData = contentScope.segBuyerList.data;
      if (billData.buyerSelection) {
        if (billData.buyerSelection === 'existing') {
          contentScope['lblBuyerOptionIcon' + 1].text = resourcesConstants.fontIcons.radioSelected;
          contentScope['lblBuyerOptionIcon' + 1].skin = resourcesConstants.skins.radioSelected;
          for (let i = 0; i < segBuyerData.length; i++) {
            if (segBuyerData[i].buyerName === billData.buyerName && segBuyerData[i].buyerAddress === billData.buyerAddress) {
              contentScope.segBuyerList.selectedRowIndex = [0, i];
              contentScope.flxSelectBuyerDetails.setVisibility(true);
              contentScope.flxSelectedBuyerDetails.setVisibility(true);
              contentScope.flxEnterBuyerDetails.setVisibility(false);
              contentScope.lblSelectedBuyerDetail1Value.text = segBuyerData[i].buyerName;
              contentScope.lblSelectedBuyerDetail2Value.text = segBuyerData[i].buyerAddress;
              contentScope.lblSelectedBuyer.text = segBuyerData[i].value.text;
              contentScope.lblSelectedBuyer.toolTip = segBuyerData[i].value.toolTip;
              contentScope.lblSelectedBuyer.skin = "sknLblSSP15pxtrucation";
              break;
            }
          }
        } else if (billData.buyerSelection === 'manual') {
          contentScope['lblBuyerOptionIcon' + 2].text = resourcesConstants.fontIcons.radioSelected;
          contentScope['lblBuyerOptionIcon' + 2].skin = resourcesConstants.skins.radioSelected;
          contentScope.flxSelectBuyerDetails.setVisibility(false);
          contentScope.flxEnterBuyerDetails.setVisibility(true);
          contentScope.tbxBuyerName.text = billData.buyerName;
          contentScope.tbxBuyerAddress.text = billData.buyerAddress;
        }
      }
      this.enableOrDisableSubmitButton();
    },
    /**
     * Error thrown from catch block of form controller
     */
    onError: function (err) {
      kony.print(JSON.stringify(err));
    }
  };
});