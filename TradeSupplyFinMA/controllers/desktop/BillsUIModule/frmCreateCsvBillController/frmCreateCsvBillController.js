define(["FormControllerUtility", "CommonUtilities", "OLBConstants", "ViewConstants"], function (FormControllerUtility, CommonUtilities, OLBConstants, ViewConstants) {
  const NA = kony.i18n.getLocalizedString("i18n.common.NA");
  let presenter, contentScope, popupScope, titleActionScope, breakpoint, csvBillData;
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
      this.view.formTemplate12.hideBannerError();
      contentScope.flxUploadFileContainer.setVisibility(false);
      contentScope.flxCsvBillsContainer.setVisibility(true);
      contentScope.flxReviewActions.setVisibility(true);
      contentScope.flxAckActions.setVisibility(false);
    },
    /**
     * Performs the actions required after rendering form
     */
    postShow: function () {
      applicationManager.getNavigationManager().applyUpdates(this);
      this.populateBillList();
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
      contentScope.flxUploadFileIcon.onClick = () => {
        scope.view.formTemplate12.hideBannerError();
        kony.io.FileSystem.browse({
          selectMultipleFiles: false,
          filter: [".csv"]
        }, scope.selectedFileCallback);
      };
      contentScope.btnDownloadSampleFile.onClick = () => presenter.generateSampleCSVFile(scope.view.id);
      contentScope.btnUploadCancel.onClick = () => presenter.showBillsScreen({ context: 'viewFileImports' });
      contentScope.btnReview1.onClick = this.togglePopup.bind(this, 'cancel');
      contentScope.btnReview2.onClick = () => presenter.showView({ form: 'frmReviewCsvBill' });
      contentScope.btnAck1.onClick = () => {
        kony.io.FileSystem.browse({
          selectMultipleFiles: false,
          filter: [".csv"]
        }, scope.selectedFileCallback);
      };
      contentScope.btnAck2.onClick = () => presenter.showBillsScreen({ context: 'viewFileImports' });
      contentScope.btnAck3.onClick = () => presenter.showBillsScreen({ context: 'viewBills' });
      contentScope.segCsvBills.widgetDataMap = {
        'flxListHeader1': 'flxListHeader1',
        'flxListHeader2': 'flxListHeader2',
        'flxListHeader3': 'flxListHeader3',
        'flxListHeader4': 'flxListHeader4',
        'flxListHeader5': 'flxListHeader5',
        'flxListHeader6': 'flxListHeader6',
        'flxListHeader7': 'flxListHeader7',
        'btnListHeader1': 'btnListHeader1',
        'btnListHeader2': 'btnListHeader2',
        'btnListHeader3': 'btnListHeader3',
        'btnListHeader4': 'btnListHeader4',
        'btnListHeader5': 'btnListHeader5',
        'btnListHeader6': 'btnListHeader6',
        'imgListHeader1': 'imgListHeader1',
        'imgListHeader2': 'imgListHeader2',
        'imgListHeader3': 'imgListHeader3',
        'imgListHeader4': 'imgListHeader4',
        'imgListHeader5': 'imgListHeader5',
        'imgListHeader6': 'imgListHeader6',
        'flxDropdown': 'flxDropdown',
        'flxColumn1': 'flxColumn1',
        'flxColumn2': 'flxColumn2',
        'flxColumn3': 'flxColumn3',
        'flxColumn4': 'flxColumn4',
        'flxColumn5': 'flxColumn5',
        'flxColumn6': 'flxColumn6',
        'flxColumn7': 'flxColumn7',
        'lblColumn1': 'lblColumn1',
        'lblColumn2': 'lblColumn2',
        'lblColumn3': 'lblColumn3',
        'lblColumn4': 'lblColumn4',
        'lblColumn5': 'lblColumn5',
        'lblColumn6': 'lblColumn6',
      };
      contentScope.lblFileType.text = `${kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.supportedFileTypeWithColon')} CSV`;
      contentScope.lblFileSize.text = `${kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.maxFileSizeWithColon')} ${presenter.billConfig.billCsvSize / 10e5}MB`;
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
      if (viewModel.importCsvSuccess) {
        this.showView('review');
      }
      if (viewModel.submitImportedCsv) {
        this.showView('acknowledgement');
      }
      if (viewModel.parsedCSVData) {
        if (viewModel.parsedCSVData.length > 0 && !viewModel.errorMessage) {
          this.view.formTemplate12.showLoading();
          presenter.createBillsFromCSV(this.view.id);
        } else {
          if (!contentScope.flxUploadFileContainer.isVisible) {
            this.showView('upload');
          }
          this.view.formTemplate12.setBannerFocus();
          this.view.formTemplate12.showBannerError({ dbpErrMsg: viewModel.errorMessage });
        }
      }
      if (viewModel.serverError) {
        this.showView('upload');
        this.view.formTemplate12.setBannerFocus();
        this.view.formTemplate12.showBannerError({ dbpErrMsg: viewModel.serverError });
      }
    },
    selectedFileCallback: function (event, files) {
      const scope = this, reader = new FileReader();
      if (files[0].file.size >= presenter.billConfig.billCsvSize) {
        this.view.formTemplate12.showBannerError({ dbpErrMsg: `${kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentTypeErrorMsg1")} ${files[0].name} ${kony.i18n.getLocalizedString("kony.mb.Europe.AttachmentSizeErrorMsg")} ${presenter.billConfig.billCsvSize / 10e5} MB.` });
        return;
      }
      reader.readAsDataURL(files[0].file);
      reader.onload = () => {
        const csv = atob(reader.result.split(',')[1]);
        presenter.isUploadInBackground = false;
        presenter.CSVToJSON(csv, scope.view.id);
      };
      reader.onerror = (error) => scope.onError(error);
    },
    populateBillList: function () {
      csvBillData.forEach(bill => (bill.status === 'In Review') && (bill.status = 'Pending Review'));
      contentScope.lblBillCountValue.text = csvBillData.length.toString();
      let segCsvBillsData = [];
      segCsvBillsData.push([{
        'flxListHeader1': {
          'left': '1.6%',
          'width': '19.8%',
          'onClick': this.applySort.bind(this, 1, 'buyerName')
        },
        'flxListHeader2': {
          'left': '0%',
          'width': '12%',
          'onClick': this.applySort.bind(this, 2, 'dueDate')
        },
        'flxListHeader3': {
          'left': '0%',
          'width': '20%',
          'onClick': this.applySort.bind(this, 3, 'receivableAccount')
        },
        'flxListHeader4': {
          'left': '0%',
          'width': '14%',
          'onClick': this.applySort.bind(this, 4, 'requestFinance')
        },
        'flxListHeader5': {
          'left': '0%',
          'width': '14%',
          'onClick': this.applySort.bind(this, 5, 'status')
        },
        'flxListHeader6': {
          'left': '0%',
          'width': '17%',
          'layoutType': kony.flex.FREE_FORM,
          'onClick': this.applySort.bind(this, 6, 'amount')
        },
        'flxListHeader7': {
          'isVisible': false
        },
        'btnListHeader1': {
          'text': kony.i18n.getLocalizedString('i18n.TradeFinance.buyer')
        },
        'btnListHeader2': {
          'text': kony.i18n.getLocalizedString('i18n.billPay.DueDate')
        },
        'btnListHeader3': {
          'text': kony.i18n.getLocalizedString('i18n.TradeFinance.accountReceivable')
        },
        'btnListHeader4': {
          'text': kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.needFinance')
        },
        'btnListHeader5': {
          'text': kony.i18n.getLocalizedString('i18n.common.status')
        },
        'btnListHeader6': {
          'left': '',
          'right': '23dp',
          'text': kony.i18n.getLocalizedString('i18n.wealth.amount')
        },
        'imgListHeader1': {
          'src': ViewConstants.IMAGES.SORTING_PREVIOUS
        },
        'imgListHeader2': {
          'src': ViewConstants.IMAGES.SORT_FINAL_IMAGE
        },
        'imgListHeader3': {
          'src': ViewConstants.IMAGES.SORT_FINAL_IMAGE
        },
        'imgListHeader4': {
          'src': ViewConstants.IMAGES.SORT_FINAL_IMAGE
        },
        'imgListHeader5': {
          'src': ViewConstants.IMAGES.SORT_FINAL_IMAGE
        },
        'imgListHeader6': {
          'left': '',
          'right': '0dp',
          'src': ViewConstants.IMAGES.SORT_FINAL_IMAGE
        }
      }, []]);
      segCsvBillsData[0][1] = this.getSortedRowData('buyerName', 'ASC');
      contentScope.segCsvBills.setData(segCsvBillsData);
    },
    getSortedRowData: function (sortBy, sortOrder) {
      const sortByValue = csvBillData[0][sortBy];
      let sortFunction;
      if (isNaN(parseInt(sortByValue))) {
        sortFunction = (a, b) => sortOrder === 'ASC' ? (a[sortBy] > b[sortBy] ? 1 : -1) : (a[sortBy] < b[sortBy] ? 1 : -1);
      } else if (Number.isInteger(Date.parse(sortByValue)) && isNaN(sortByValue)) {
        sortFunction = (a, b) => sortOrder === 'ASC' ? (new Date(a[sortBy]) - new Date(b[sortBy])) : (new Date(b[sortBy]) - new Date(a[sortBy]));
      } else {
        sortFunction = (a, b) => sortOrder === 'ASC' ? (Number(a[sortBy]) - Number(b[sortBy])) : (Number(b[sortBy]) - Number(a[sortBy]));
      }
      csvBillData = csvBillData.sort(sortFunction);
      let sortedRowData = [];
      for (const bill of csvBillData) {
        sortedRowData.push({
          'flxDropdown': {
            'isVisible': false
          },
          'flxColumn1': {
            'left': '1.6%',
            'width': '19.8%'
          },
          'flxColumn2': {
            'left': '0%',
            'width': '12%',
          },
          'flxColumn3': {
            'left': '0%',
            'width': '20%',
          },
          'flxColumn4': {
            'left': '0%',
            'width': '14%',
          },
          'flxColumn5': {
            'left': '0%',
            'width': '14%'
          },
          'flxColumn6': {
            'left': '0%',
            'width': '17%',
            'layoutType': kony.flex.FREE_FORM,
          },
          'flxColumn7': {
            'isVisible': false
          },
          'lblColumn1': {
            'text': bill.buyerName
          },
          'lblColumn2': {
            'text': bill.dueDate ? presenter.formatUtilManager.getFormattedCalendarDate(bill.dueDate) : NA
          },
          'lblColumn3': {
            'text': bill.receivableAccount ? presenter.getAccountDisplayName(bill.receivableAccount) : NA
          },
          'lblColumn4': {
            'text': bill.requestFinance
          },
          'lblColumn5': {
            'text': bill.status || NA
          },
          'lblColumn6': {
            'text': (bill.currency && bill.amount) ? `${bill.currency} ${presenter.formatUtilManager.formatAmount(bill.amount)}` : NA
          }
        });
      }
      return sortedRowData;
    },
    applySort: function (idx, sortBy) {
      let segCsvBillsData = contentScope.segCsvBills.data;
      const sortOrder = segCsvBillsData[0][0]['imgListHeader' + idx].src === ViewConstants.IMAGES.SORTING_PREVIOUS ? 'DESC' : 'ASC';
      segCsvBillsData[0][0]['imgListHeader' + idx].src = sortOrder === 'DESC' ? ViewConstants.IMAGES.SORTING_NEXT : ViewConstants.IMAGES.SORTING_PREVIOUS;
      for (let i = 1; i <= 5; i++) {
        (i !== idx) && (segCsvBillsData[0][0]['imgListHeader' + i].src = ViewConstants.IMAGES.SORT_FINAL_IMAGE);
      }
      this.view.formTemplate12.showLoading();
      setTimeout(function () {
        segCsvBillsData[0][1] = this.getSortedRowData(sortBy, sortOrder);
        contentScope.segCsvBills.removeAll();
        contentScope.segCsvBills.setData(segCsvBillsData);
        contentScope.forceLayout();
        this.view.formTemplate12.hideLoading();
      }.bind(this), 0);
    },
    togglePopup: function (flow) {
      let popupContext = {};
      switch (flow) {
        case 'cancel':
          popupContext = {
            heading: kony.i18n.getLocalizedString("i18n.transfers.Cancel"),
            message: kony.i18n.getLocalizedString("i18n.PayAPerson.CancelAlert"),
            noText: kony.i18n.getLocalizedString("i18n.common.no"),
            yesText: kony.i18n.getLocalizedString("i18n.common.yes"),
            yesClick: () => presenter.showBillsScreen({ context: 'viewFileImports' })
          };
          break;
      }
      this.view.formTemplate12.setPopup(popupContext);
    },
    showView: function (viewType) {
      this.view.formTemplate12.setBannerFocus();
      switch (viewType) {
        case 'review':
          this.view.formTemplate12.pageTitle = kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.createBillFromFileReview');
          contentScope.flxUploadFileContainer.setVisibility(false);
          contentScope.flxCsvBillsContainer.setVisibility(true);
          contentScope.flxReviewActions.setVisibility(true);
          contentScope.flxAckActions.setVisibility(false);
          this.view.formTemplate12.showBannerError({ i18n: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.fileImportSuccessMessage') });
          break;
        case 'acknowledgement':
          this.view.formTemplate12.pageTitle = kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.createBillFromFileAcknowledgement');
          contentScope.flxUploadFileContainer.setVisibility(false);
          contentScope.flxCsvBillsContainer.setVisibility(true);
          contentScope.flxReviewActions.setVisibility(false);
          contentScope.flxAckActions.setVisibility(true);
          this.view.formTemplate12.showBannerError({ i18n: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.submitFileImportBillsSuccessMessage').replace('%field%', csvBillData.length) });
          break;
        case 'upload':
          this.view.formTemplate12.pageTitle = kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.createBillFromFileUpload');
          contentScope.flxUploadFileContainer.setVisibility(true);
          contentScope.flxCsvBillsContainer.setVisibility(false);
          contentScope.flxReviewActions.setVisibility(false);
          contentScope.flxAckActions.setVisibility(false);
          break;
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