define(['CommonUtilities', 'OLBConstants', 'FormControllerUtility', 'ViewConstants', 'FormatUtil'], function(CommonUtilities, OLBConstants, FormControllerUtility, ViewConstants, FormatUtil) {
  let NA = kony.i18n.getLocalizedString("i18n.common.NA");
  const formatter = new Intl.NumberFormat('en', { notation: 'compact' });
  const BILLS = "bills",BATCH = "batch",FILE_IMPORT = "fileImport";
  let presenter, contentScope, buttonScope, popupScope, fileName, formTemplateScope, breakpoint, currencyCode, currencySymbol, duration, billsData, isBillsGraphRendered = false,
      currentTab = BILLS;
  let prevSelectedIndex;
  let serviceResponse = {};
  let recordsData = {};
  let sortApplied = false;
  let filterSegDetails;
  let segFilterDetails;
  let isFilterApplied = false;
  let resourcesConstants = {
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
  let pageConfig = {
    "pageOffset": "0",
    "pageSize": "11"
  };
  let sortFields = {
    "imgListHeader1": "buyerName",
    "imgListHeader2": "billReference",
    "imgListHeader3": "dueDate",
    "imgListHeader4": "origin",
    "imgListHeader5": "status",
    "imgListHeader6": "amount"
  };
  let serviceParameters = {
    "searchString": "",
    "pageSize": "11",
    "pageOffset": "0",
    "sortByParam": "updatedOn",
    "sortOrder": "DESC",
    "timeParam": "",
    "timeValue": "6,MONTH",
    "filterByValue": "single",
    "filterByParam": "origin"
  };
  let chartServiceParameters = {
    "searchString": "",
    "pageSize": "",
    "pageOffset": "",
    "sortByParam": "",
    "sortOrder": "",
    "timeParam": "",
    "timeValue": "",
    "filterByValue": "",
    "filterByParam": "",
  };
  //This objects holds all the UI and mapping config for tabs Bills,Batch and File Imports in dashboard
  let dashboardTabsConfig = {
    "bills": {
      "flxRow1Column1": "5%",
      "flxRow1Column2": "0%",
      "flxRow1Column3": "0%",
      "flxRow1Column4": "10.5%",
      "flxRow1Column5": "5.5%",
      "flxColumn2": "0%",
      "flxColumn3": "2%",
      "flxColumn4": "0%",
      "flxColumn5": "0%",
      "flxColumn6": "1%",
      "flxListHeader2": "0%",
      "flxListHeader3": "3%",
      "flxListHeader5": "0%",
      "flxListHeader6": "10%",
      "flxListHeader2Width": "12.5%",
      "flxListHeader5Width": "14%",
      "flxListHeader6Width": "9%",
      "flxListHeader7Width": "7%",
      "flxRow1Column2Width": "13%",
      "flxRow1Column7": "1.5%",
      "flxColumn7": "1%",
      "flxColumn2Width": "13.5%",
      "flxColumn5Width": "15%",
      "flxColumn6Width": "15%",
      "flxColumn7Width": "8%",
      "flxRow1Column6Width": "21%",
      "flxRow1Column7Width": "8%",
      "lblColumn1": "buyerName",
      "lblColumn2": "billReference",
      "lblColumn3": "dueDate",
      "lblColumn4": "origin",
      "lblColumn5": "status",
      "lblColumn6": "amount",
      "lblRow1Column1Value": "billNumber",
      "lblRow1Column2Value": "billName",
      "lblRow1Column3Value": "billCounts",
      "lblRow1Column4Value": "receivableAccount",
      "lblRow1Column5Value": "batchReference",
      "lblRow1Column6Value": "cancellationStatus",
    },
    "batch": {
      "flxListHeader2": "4.3%",
      "flxListHeader3": "7.3%",
      "flxListHeader4": "7.3%",
      "flxRow1Column1": "5%",
      "flxRow1Column2": "4.3%",
      "flxRow1Column3": "4.3%",
      "flxRow1Column4": "3%",
      "flxRow1Column5": "10%",
      "flxColumn2": "4.3%",
      "flxColumn3": "6.3%",
      "flxColumn4": "7.3%",
      "flxColumn5": "7.3%",
      "flxColumn6": "5%",
      "flxListHeader5": "2%",
      "flxListHeader6": "8%",
      "flxListHeader2Width": "10%",
      "flxListHeader5Width": "11%",
      "flxListHeader6Width": "11%",
      "flxListHeader7Width": "7%",
      "flxRow1Column2Width": "13%",
      "flxRow1Column7": "20%",
      "flxColumn7": "3.5%",
      "flxColumn2Width": "11%",
      "flxColumn5Width": "15%",
      "flxColumn6Width": "9.5%",
      "flxColumn7Width": "8%",
      "flxRow1Column6Width": "15.5%",
      "flxRow1Column7Width": "8%",
      "lblColumn1": "",//empty values needs to be updated in future
      "lblColumn2": "",
      "lblColumn3": "",
      "lblColumn4": "",
      "lblColumn6": "",
      "lblRow1Column1Value": "",
      "lblRow1Column2Value": "",
      "lblRow1Column3Value": "",
      "lblRow1Column5Value": "",
    },
    "fileImport": {
      "flxColumn2": "1%",
      "flxRow1Column1": "5%",
      "flxRow1Column2": "1%",
      "flxRow1Column3": "0%",
      "flxRow1Column4": "1%",
      "flxRow1Column5": "7.5%",
      "flxColumn3": "3%",
      "flxColumn4": "4%",
      "flxColumn5": "4%",
      "flxColumn6": "1%",
      "flxListHeader2": "1%",
      "flxListHeader3": "4%",
      "flxListHeader4": "4%",
      "flxListHeader5": "4%",
      "flxListHeader6": "8%",
      "flxListHeader2Width": "10%",
      "flxListHeader5Width": "11%",
      "flxListHeader6Width": "11%",
      "flxListHeader7Width": "21%",
      "flxRow1Column2Width": "14%",
      "flxRow1Column3Width": "14%",
      "flxRow1Column4Width": "10%",
      "flxRow1Column7": "32.3%",
      "flxColumn7": "7%",
      "flxColumn2Width": "11%",
      "flxColumn5Width": "13%",
      "flxColumn6Width": "9.5%",
      "flxColumn7Width": "12%",
      "flxRow1Column6Width": "15.5%",
      "flxRow1Column7Width": "5%",
      "lblColumn1": "fileReference",
      "lblColumn2": "fileType",
      "lblColumn3": "counts",
      "lblColumn4": "fileDate",
      "lblColumn5": "updatedOn",
      "lblRow1Column1Value": "batchReference",
      "lblRow1Column2Value": "billReferences",
    }
  };

  return {

    /**
     * @api : init
     * This function for executing the lines of code only once
     * @return : NA
     */
    init: function() {
      this.view.preShow = this.preShow;
      this.view.postShow = this.postShow;
      this.view.onDeviceBack = function() {};
      this.view.onBreakpointChange = this.onBreakpointChange;
      this.view.formTemplate12.onError = this.onError;
      this.initFormActions();
    },
    
    /**
    * @api : onNavigate
    * Will execute when navigation came from another form
    * @arg : param - Obj - Data used to load in UI
    * @return : NA
        */
    onNavigate: function(data) {
      var scope = this;
      breakpoint = kony.application.getCurrentBreakpoint();
      try {
        if(data.flowType){
         currentTab = data.flowType === BILLS ? BILLS : data.flowType === BATCH ? BATCH : FILE_IMPORT ;
         currentTab === FILE_IMPORT ? (serviceParameters.filterByParam = "", serviceParameters.filterByValue = "") : (serviceParameters.filterByParam = "origin", serviceParameters.filterByValue = "single");
        }else{
          currentTab = BILLS;
        }
        scope.view.formTemplate12.hideBannerError();
      }catch (err) {
        var errorObj = {
          "method": "onNavigate",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    
    /**
     * @api : onBreakpointChange
     * Performs the actions required on change of breakpoint
     * @return : NA
     */
    onBreakpointChange: function(form, width) {
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      breakpoint = kony.application.getCurrentBreakpoint();
    },

    /**
     * @api : preShow
     * Performs the actions required before rendering form
     * @return : NA
     */
    preShow: function() {
      this.setDefaultUI();
      this.setCreateOptionsData();
    },

    /**
     * @api : postShow
     * Performs the actions required after rendering form
     * @return : NA
     */
    postShow: function () {
      var scope = this;
      this.setDropdownValues(contentScope.segCurrencyFilter, presenter.billConfig.graphCurrencyFilters, contentScope.flxCurrencyFilterList, contentScope.lblSelectedCurrencyFilter);
      this.setDropdownValues(contentScope.segDurationFilter, presenter.billConfig.graphDurationFilters, contentScope.flxDurationFilterList, contentScope.lblSelectedDurationFilter);
      scope.getDashboardData();
      
    },
    
    /**
     *  @api : initFormActions
     * Method to initialise form actions
     * @return : NA
     */
    initFormActions: function() {
      const scope = this;
      presenter = applicationManager.getModulesPresentationController({
        appName: 'TradeSupplyFinMA',
        moduleName: 'BillsUIModule'
      });
      popupScope = this.view.formTemplate12.flxContentPopup;
      buttonScope = this.view.formTemplate12.flxTCButtons;
      contentScope = this.view.formTemplate12.flxContentTCCenter;
      contentScope.flxPagination.PaginationContainer.setPageSize(10);
      contentScope.flxPagination.PaginationContainer.flxPagination.width = "235dp";
      scope.setPaginationComponent(kony.i18n.getLocalizedString("i18n.payments.bills"));  
      contentScope.flxPagination.zIndex = 0;
      contentScope.tbxSearch.text = "";
      contentScope.lblSwitchToBatchBills.text = "m";
      contentScope.flxVerticalEllipsisBatch.onClick = this.openCreateoptions.bind(this, "batch");
      contentScope.flxVerticalEllipsisBills.onClick = this.openCreateoptions.bind(this, "bill");
      contentScope.btnCreateNewBill.onClick = () => presenter.showBillsScreen({ context: 'createBill' });
      contentScope.btnCreateNewBillTablet.onClick = () => presenter.showBillsScreen({ context: 'createBill' });
      contentScope.btnTabBill.onClick = scope.tabClick.bind(this, BILLS);
      contentScope.btnTabBatch.onClick = scope.tabClick.bind(this, BATCH);
      contentScope.btnFileImport.onClick = scope.tabClick.bind(this, FILE_IMPORT);
      popupScope.flxCloseUploadPopup.onClick = function () {
        presenter.isUploadInBackground = true;
        popupScope.setVisibility(false);
        popupScope.flxFileUploadPopup.setVisibility(false);
        contentScope.lblBannerMessage.text = kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.fileUploadingInBackgroundMessage').replace('%field%', fileName);
        contentScope.flxBannerMessage.setVisibility(true);
      };
      popupScope.btnRunInBack.onClick = function () {
        presenter.isUploadInBackground = true;
        popupScope.setVisibility(false);
        popupScope.flxFileUploadPopup.setVisibility(false);
        contentScope.lblBannerMessage.text = kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.fileUploadingInBackgroundMessage').replace('%field%', fileName);
        contentScope.flxBannerMessage.setVisibility(true);
      };
      contentScope.flxCurrencyFilterDropdown.onClick = this.toggleDropdown.bind(this, contentScope.flxCurrencyFilterList, contentScope.lblCurrencyFilterDropdownIcon);
      contentScope.segCurrencyFilter.onRowClick = this.segRowClick.bind(this, contentScope.segCurrencyFilter, contentScope.lblSelectedCurrencyFilter, contentScope.flxCurrencyFilterList, contentScope.lblCurrencyFilterDropdownIcon);
      contentScope.flxDurationFilterDropdown.onClick = this.toggleDropdown.bind(this, contentScope.flxDurationFilterList, contentScope.lblDurationFilterDropdownIcon);
      contentScope.segCurrencyFilter.onRowClick = this.segRowClick.bind(this, contentScope.segCurrencyFilter, contentScope.lblSelectedCurrencyFilter, contentScope.flxCurrencyFilterList, contentScope.lblCurrencyFilterDropdownIcon);
      contentScope.segDurationFilter.onRowClick = this.segRowClick.bind(this, contentScope.segDurationFilter, contentScope.lblSelectedDurationFilter, contentScope.flxDurationFilterList, contentScope.lblDurationFilterDropdownIcon);
      this.initialiseColumnChart();
      scope.setFilterUIView();
      contentScope.tbxSearch.onTextChange = function () {
        if (contentScope.tbxSearch.text.length > 0) contentScope.lblClearSearch.setVisibility(true);
        else contentScope.lblClearSearch.setVisibility(false);
      };
      contentScope.lblClearSearch.onTouchEnd = function () {
        contentScope.tbxSearch.text = "";
        contentScope.lblClearSearch.setVisibility(false);
        scope.fetchDashboardData();
      };
      contentScope.tbxSearch.onDone = scope.fetchDashboardData;
      contentScope.flxSwitch.onClick = () => {
        if (contentScope.lblSwitchToBatchBills.text === "m") {
          contentScope.lblSwitchToBatchBills.text = "n";
          scope.getBatchBills(true);
        } else {
          contentScope.lblSwitchToBatchBills.text = "m";
          scope.getBatchBills(false);
        }
      };
      contentScope.flxFilter.onClick = scope.toggleFilterDropDownVisibility.bind(this);
      contentScope.btnCancel.onClick = scope.onFilterCancel.bind(this);
      contentScope.btnApply.onClick = scope.applyFilters.bind(this);
      contentScope.flxExportList.onClick = () => {
        contentScope.flxEllipsisDropDown.setVisibility(!contentScope.flxEllipsisDropDown.isVisible);
      };
      contentScope.flxEllipsisContainer.onClick = scope.downloadXlsx;
      contentScope.flxBannerMessageClose.onClick = () => contentScope.flxBannerMessage.setVisibility(false);
    },

    /**
     *  @api : segRowClick
     * Method to set data based on the options selected.
     * @return : NA
     */
    segRowClick: function (segDropdown, lblSelectedValue, flxSegDropdown, lblDropdownIcon) {
      const selectedData = segDropdown.selectedRowItems[0];
      lblSelectedValue.text = selectedData.value;
      flxSegDropdown.setVisibility(false);
      lblDropdownIcon.text = resourcesConstants.fontIcons.chevronDown;
      if (segDropdown.id === 'segCurrencyFilter' || segDropdown.id === 'segDurationFilter') {
        this.setGraphData();
      }
    },

    /**
     *  @api : toggleDropdown
     * Method to expand or collapse dropdowns.
     * @return : NA
     */
    toggleDropdown: function (flxSeg, lblIcon) {
      if (flxSeg.isVisible) {
        flxSeg.setVisibility(false);
        lblIcon.text = resourcesConstants.fontIcons.chevronDown;
      } else {
        flxSeg.setVisibility(true);
        lblIcon.text = resourcesConstants.fontIcons.chevronUp;
      }
    },

    /**
     *  @api : initialiseColumnChart
     * Method to initialise column chart
     * @return : NA
     */
    initialiseColumnChart: function () {
      const options = {
        title: '',
        height: 180,
        width: (breakpoint >= 1380) ? 820 : (breakpoint >= 1366) ? 735 : 900,
        legend: { position: 'none' },
        isStacked: true,
        bar: { groupWidth: "40%" },
        vAxis: {
          gridlines: { color: "#F6F6F6" },
          viewWindow: { min: 0 },
          format: "short"
        },
        chartArea: { left: 40 }
      };
      let receivablesChart = new kony.ui.CustomWidget({
        "id": "ReceivablesBarChart",
        "isVisible": true,
        "width": "100%",
        "height": "100%",
        "zIndex": 1
      }, {
        "padding": [0, 0, 0, 0],
        "paddingInPixel": false
      }, {
        "widgetName": "VerticalBarChart",
        "chartData": [],
        "chartProperties": Object.assign({ widgetId: 'stacked_barChart_div1' }, options),
        "OnClickOfBar": function () { }
      });
      contentScope.flxBarGraph.add(receivablesChart);
    },
    /**
     * Entry point method for the form controller
     * @param {Object} viewModel - it contains the set of view properties and keys.
     */
    updateFormUI: function(viewModel) {
      var scope = this;
      if (viewModel.isLoading === true) {
        FormControllerUtility.showProgressBar(this.view);
      } else if (viewModel.isLoading === false) {
        FormControllerUtility.hideProgressBar(this.view);
      }
      if (viewModel.bills || viewModel.CsvImports) {
        if(currentTab === BILLS){
          serviceResponse = viewModel.bills;
          scope.setRecentRecordsData(viewModel.bills);
        }else if(currentTab === FILE_IMPORT){
          serviceResponse = viewModel.CsvImports;
        }
        recordsData = serviceResponse.slice(0, 10);
        if(Object.keys(serviceResponse).length > 0){
          contentScope.flxPagination.setVisibility(true);
          contentScope.flxExportList.setVisibility(true);
        }
        else{
          contentScope.flxPagination.setVisibility(false);
          contentScope.flxExportList.setVisibility(false);
        }
        scope.setListingDetails();
      }
      if (viewModel.chartData) {
        if (!isBillsGraphRendered) {
          this.constructBillsGraphData(viewModel.chartData);
        } else {
          this.setGraphData(viewModel.chartData);
        }
      }
      if (viewModel.parsedCSVData) {
        if (viewModel.parsedCSVData.length > 0 && !viewModel.errorMessage) {
          popupScope.setVisibility(true);
          popupScope.flxFileUploadPopup.setVisibility(true);
          popupScope.forceLayout();
          presenter.createBillsFromCSV(this.view.id);
        } else {
          this.view.formTemplate12.showBannerError({ dbpErrMsg: viewModel.errorMessage });
        }
      }
      if (viewModel.serverError) {
        this.view.formTemplate12.setBannerFocus();
        if (viewModel.method && viewModel.method === 'createBillsFromCSV') {
          popupScope.setVisibility(false);
          popupScope.flxFileUploadPopup.setVisibility(false);
        }
        this.view.formTemplate12.showBannerError({ dbpErrMsg: viewModel.serverError });
      }
      if (viewModel.saveBill) {
        this.view.formTemplate12.showBannerError({ i18n: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.saveBillSuccessMessage') });
      } 
      if(viewModel.deleteCsvImport){
        scope.fetchDashboardData();
      }
      const offset = contentScope.flxPagination.PaginationContainer.getPageOffset();
      if (offset === 0) {
        contentScope.flxPagination.PaginationContainer.imgPaginationPrevious.src = ViewConstants.IMAGES.PAGINATION_BACK_INACTIVE;
      } else {
        contentScope.flxPagination.PaginationContainer.imgPaginationPrevious.src = ViewConstants.IMAGES.PAGINATION_BACK_ACTIVE;
      }
      if (!kony.sdk.isNullOrUndefined(serviceResponse) && serviceResponse.length > 10) {
        contentScope.flxPagination.PaginationContainer.imgPaginationNext.src = ViewConstants.IMAGES.PAGINATION_NEXT_ACTIVE;
        contentScope.flxPagination.PaginationContainer.imgPaginationNext.imageScaleMode = constants.IMAGE_SCALE_MODE_FIT_TO_DIMENSIONS;
      } else {
        contentScope.flxPagination.PaginationContainer.imgPaginationNext.src = ViewConstants.IMAGES.PAGINATION_NEXT_INACTIVE;
      }
    },

    /**
     * @api : setRecentRecordsData
     * This function to show recent records of a bill/batch.
     * @return : NA
     */
    setRecentRecordsData: function (billData) {
      var scope = this;
      try {
        contentScope.segRecentBills.widgetDataMap = {
          'lblKey1': 'lblKey1',
          'lblKey2': 'lblKey2',
          'lblKey3': 'lblKey3',
          'lblValue1': 'lblValue1',
          'lblValue2': 'lblValue2',
          'lblValue3': 'lblValue3',
          'btnAction': 'btnAction',
		      'flxSeparator': 'flxSeparator'
        };
        let recentRecordData = (billData && billData.length > 0) ? billData.slice(0, 2) : [];
        let segRecentRecordData = [];
        for (let [index,record] of recentRecordData.entries()) {
          segRecentRecordData.push({
            'lblKey1': scope.getI18nValue("i18n.TradeSupplyFinance.billRefWithColon"),
            'lblKey2': scope.getI18nValue("i18n.TradeSupplyFinance.buyerWithColon"),
            'lblKey3': kony.i18n.getLocalizedString('i18n.serviceRequests.Status:'),
            'lblValue1': record.billReference || NA,
            'lblValue2': record.buyerName || NA,
            'lblValue3': record.status || NA,
            'flxSeparator': {
              isVisible: index === 1 ? false : true
            },
            'btnAction': {
              'text': kony.i18n.getLocalizedString(record.status === OLBConstants.BILLS_STATUS.DRAFT ? 'i18n.TransfersEur.btnContinue' : 'i18n.TradeFinance.View'),
              'toolTip': kony.i18n.getLocalizedString(record.status === OLBConstants.BILLS_STATUS.DRAFT ? 'i18n.TransfersEur.btnContinue' : 'i18n.TradeFinance.View'),
              'onClick': () => presenter.showBillsScreen({
                context: record.status === OLBConstants.BILLS_STATUS.DRAFT ? 'createBill' : 'viewBillDetails',
                data: record
              })
            }
          });
        }
        contentScope.segRecentBills.setData(segRecentRecordData);
      } catch (err) {
        var errorObj = {
          "level": "frmReceivableBillsDashboardController",
          "method": "setRecentRecordsData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : openCreateoptions
     * This function to show options for creating a bill/batch.
     * @return : NA
     */
    openCreateoptions: function(param){
      switch(param){
        case "bill":{
          contentScope.flxBillsEllipsisDropDown.setVisibility(!contentScope.flxBillsEllipsisDropDown.isVisible);
          break;
        }
        case "batch":{
          contentScope.flxBatchEllipsisDropDown.setVisibility(!contentScope.flxBatchEllipsisDropDown.isVisible);
          break;
        }
      }
    },

    /**
     * @api : createBillFromOptions
     * This function to call the appropriate method of creating a bill.
     * @return : NA
     */
    createBillFromOptions: function (param) {
      switch (param) {
        case "csv": {
          this.browseSupportingDocument();
          contentScope.flxBillsEllipsisDropDown.setVisibility(false);
          break;
        }
        case "sampleFile": {
          presenter.generateSampleCSVFile("frmReceivableBillsDashboard");
          contentScope.flxBillsEllipsisDropDown.setVisibility(false);
          break;
        }
        case "ocr": {
          //call the apprp. method.
          contentScope.flxBillsEllipsisDropDown.setVisibility(false);
          break;
        }
        case "erp":{
          //call the apprp. method.
          contentScope.flxBillsEllipsisDropDown.setVisibility(false);
          break;
        }
      }
    },

    /**
     * @api : createBatchFromOptions
     * This function to call the appropriate method of creating a batch.
     * @return : NA
     */
    createBatchFromOptions: function (param) {
      switch (param) {
        case "csv": {
          //call the apprp. method.
          contentScope.flxBatchEllipsisDropDown.setVisibility(false);
          break;
        }
        case "sampleFile": {
          //call the apprp. method.
          contentScope.flxBatchEllipsisDropDown.setVisibility(false);
          break;
        }
        case "ocr": {
          //call the apprp. method.
          contentScope.flxBatchEllipsisDropDown.setVisibility(false);
          break;
        }
      }
    },

    /**
     * @api : setCreateOptionsData
     * This function to set options for creating a bill/batch.
     * @return : NA
     */
    setCreateOptionsData: function(){
      var scope = this;
      let widgetDataMap =  {
      'flxListDropdown': 'flxListDropdown',
      'lblListValue': 'lblListValue'
      };

      let billOptionsData = [{
        lblListValue: {
          text: scope.getI18nValue("i18n.TradeSupplyFinance.fromFileImport"),
          toolTip: scope.getI18nValue("i18n.TradeSupplyFinance.fromFileImport")
        },
        flxListDropdown: {
          onClick: this.createBillFromOptions.bind(this, "csv")
        }
      },{
        lblListValue: {
          text: scope.getI18nValue("i18n.bulkWireFiles.donwLoadFileInfo"),
          toolTip: scope.getI18nValue("i18n.bulkWireFiles.donwLoadFileInfo")
        },
        flxListDropdown: {
          onClick: this.createBillFromOptions.bind(this, "sampleFile")
        }
      },{
        lblListValue: {
          text: scope.getI18nValue("i18n.TradeSupplyFinance.fromOCROrAI"),
          toolTip: scope.getI18nValue("i18n.TradeSupplyFinance.fromOCROrAI")
        },
        flxListDropdown: {
          onClick: this.createBillFromOptions.bind(this, "ocr")
        }
      },{
        lblListValue: {
          text: scope.getI18nValue("i18n.TradeSupplyFinance.eRPBill"),
          toolTip: scope.getI18nValue("i18n.TradeSupplyFinance.eRPBill")
        },
        flxListDropdown: {
          onClick: this.createBillFromOptions.bind(this, "erp")
        }
      }
      ];

      let batchOptionsData = [{
        lblListValue: {
          text: scope.getI18nValue("i18n.TradeSupplyFinance.fromFileImport"),
          toolTip: scope.getI18nValue("i18n.TradeSupplyFinance.fromFileImport")
        },
        flxListDropdown: {
          onClick: this.createBatchFromOptions.bind(this, "csv")
        }
      },{
        lblListValue: {
          text: scope.getI18nValue("i18n.bulkWireFiles.donwLoadFileInfo"),
          toolTip: scope.getI18nValue("i18n.bulkWireFiles.donwLoadFileInfo")
        },
        flxListDropdown: {
          onClick: this.createBatchFromOptions.bind(this, "sampleFile")
        }
      },{
        lblListValue: {
          text: scope.getI18nValue("i18n.TradeSupplyFinance.fromOCROrAI"),
          toolTip: scope.getI18nValue("i18n.TradeSupplyFinance.fromOCROrAI")
        },
        flxListDropdown: {
          onClick: this.createBatchFromOptions.bind(this, "ocr")
        }
      }
      ];
      contentScope.segBillCreateOptions.widgetDataMap = widgetDataMap;
      contentScope.segBillCreateOptions.setData(billOptionsData);
      contentScope.segBatchCreateOptions.widgetDataMap = widgetDataMap;
      contentScope.segBatchCreateOptions.setData(batchOptionsData);
      
    },

    /**
     * @api : setDefaultUI
     * This function to set default UI when landing on screen.
     * @return : NA
     */
    setDefaultUI: function() {
      var scope = this;
      try {
        this.view.formTemplate12.pageTitle = kony.i18n.getLocalizedString('i18n.payments.bills');
        contentScope.flxCreateNewContainerTablet.setVisibility(false);
        contentScope.flxBatchEllipsisDropDown.setVisibility(false);
        contentScope.flxBillsEllipsisDropDown.setVisibility(false);
        contentScope.flxDurationFilterList.setVisibility(false);
        contentScope.flxCurrencyFilterList.setVisibility(false);
        contentScope.lblClearSearch.setVisibility(false);
        contentScope.flxEllipsisDropDown.setVisibility(false);   
        if (breakpoint > 640 && breakpoint <= 1024) {
          contentScope.flxCreateNewContainerTablet.setVisibility(true);
        }
        popupScope.setVisibility(false);
        popupScope.flxFileUploadPopup.setVisibility(false);
      } catch (err) {
        var errorObj = {
          "level": "frmReceivableBillsDashboardController",
          "method": "setDefaultUI",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : constructBillsGraphData
     * This function to set graph data for bills.
     * @return : NA
     */
    constructBillsGraphData: function(billData){
      var scope = this;
      let groupChartData = scope_configManager.receivableBillsChartData.billStatus;
      try {
        billsData = (billData || []).reduce(function (acc, obj) {
          let date = new Date(obj.billDate).toDateString();
          if (!acc[obj.currency]) acc[obj.currency] = {
            overviewData:{},
            chartData:{}
          };
          if(!acc[obj.currency]['overviewData'][groupChartData[obj.status]]) acc[obj.currency]['overviewData'][groupChartData[obj.status]] = {
            count:0,
            amount: 0
          };
          acc[obj.currency]['overviewData'][groupChartData[obj.status]]['count']++;
          acc[obj.currency]['overviewData'][groupChartData[obj.status]]['amount'] += parseFloat(obj.amount || 0);

          if (!acc[obj.currency]['chartData'][date]) acc[obj.currency]['chartData'][date] = {};

          if (!acc[obj.currency]['chartData'][date][obj.origin]) acc[obj.currency]['chartData'][date][obj.origin] = {
            count:0,
            amount:0
          };
          acc[obj.currency]['chartData'][date][obj.origin]["amount"] += parseFloat(obj.amount || 0);
          acc[obj.currency]['chartData'][date][obj.origin]["count"]++ ;
          return acc;
        }, {});
        this.setGraphData();
      } catch (err) {
        var errorObj = {
          "level": "frmReceivableBillsDashboardController",
          "method": "constructBillsGraphData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : setGraphData
     * This function to set graph data for bills.
     * @return : NA
     */
    setGraphData: function () {
      var scope = this;
      try {
        isBillsGraphRendered = true;
        currencyCode = contentScope.segCurrencyFilter.selectedRowItems[0].key;
        currencySymbol = presenter.configurationManager.getCurrency(currencyCode);
        duration = contentScope.segDurationFilter.selectedRowItems[0].key;
        let colorCodes = scope_configManager.receivableBillsChartData.billColorCode;
        let graphData = [], date = new Date();
        let billDate = date.toDateString();
        date.setDate(date.getDate() - duration + 1);
        for (let i = 0; i < duration; i++) {
          billDate = date.toDateString();
          let barData = {
            'categoryName': date.toLocaleString('default', { month: 'short', day: 'numeric' }),
            'budget1': 0,
            'budget1ColorCode': colorCodes.Single,
            'budget1TooltipText': '',
            'budget2': 0,
            'budget2TooltipText': '',
            'budget2ColorCode': colorCodes.Batch,
            'budget3': -1,
            'budget3TooltipText': '',
            'budget3ColorCode': ""
          };
          if (billsData[currencyCode]) {
            if (billsData[currencyCode]['chartData'][billDate]) {
              barData.budget1 = billsData[currencyCode]['chartData'][billDate]['Single'] ? billsData[currencyCode]['chartData'][billDate]['Single']['amount'] : 0;
              barData.budget2 = billsData[currencyCode]['chartData'][billDate]['Batch'] ? billsData[currencyCode]['chartData'][billDate]['Batch']['amount'] : 0;
            }
          } else {
            billsData[currencyCode] = {
              overviewData: {},
              chartData: {}
            };
          }
          let singleBillsCount = billsData[currencyCode]['chartData'][billDate] && billsData[currencyCode]['chartData'][billDate]['Single'] ? billsData[currencyCode]['chartData'][billDate]['Single']['count'] : 0;
          let batchBillsCount = billsData[currencyCode]['chartData'][billDate] && billsData[currencyCode]['chartData'][billDate]['Batch'] ? billsData[currencyCode]['chartData'][billDate]['Batch']['count'] : 0;
          const tooltipText = `${barData.categoryName}\n`
            + `${kony.i18n.getLocalizedString('i18n.wealth.totalWithColon')} ${currencySymbol}${formatter.format(barData.budget1 + barData.budget2)}\n`
            + `${singleBillsCount} ${kony.i18n.getLocalizedString('i18n.payments.bills')}: ${currencySymbol}${formatter.format(barData.budget1)}\n`
            + `${batchBillsCount} Batches: ${currencySymbol}${formatter.format(barData.budget2)}`;
          barData.budget1TooltipText = tooltipText;
          barData.budget2TooltipText = tooltipText;
          graphData.push(barData);
          date.setDate(date.getDate() + 1);
        }
        let defaultValue = `${currencySymbol} ${presenter.formatUtilManager.formatAmount(0)}`;
        contentScope.lblCount1.text = billsData[currencyCode]['overviewData']['Draft'] ? billsData[currencyCode]['overviewData']['Draft']['count'] + "" : "0";
        contentScope.lblAmount1.text = billsData[currencyCode]['overviewData']['Draft'] ? `${currencySymbol} ${presenter.formatUtilManager.formatAmount(billsData[currencyCode]['overviewData']['Draft']['amount'])}` : defaultValue;
        contentScope.lblCount2.text = billsData[currencyCode]['overviewData']['Returned by Bank'] ? billsData[currencyCode]['overviewData']['Returned by Bank']['count'] + "" : "0";
        contentScope.lblAmount2.text = billsData[currencyCode]['overviewData']['Returned by Bank'] ? `${currencySymbol} ${presenter.formatUtilManager.formatAmount(billsData[currencyCode]['overviewData']['Returned by Bank']['amount'])}` : defaultValue;
        contentScope.lblCount3.text = billsData[currencyCode]['overviewData']['Processing'] ? billsData[currencyCode]['overviewData']['Processing']['count'] + "" : "0";
        contentScope.lblAmount3.text = billsData[currencyCode]['overviewData']['Processing'] ? `${currencySymbol} ${presenter.formatUtilManager.formatAmount(billsData[currencyCode]['overviewData']['Processing']['amount'])}` : defaultValue;
        contentScope.lblCount4.text = billsData[currencyCode]['overviewData']['Approved'] ? billsData[currencyCode]['overviewData']['Approved']['count'] + "" : "0";
        contentScope.lblAmount4.text = billsData[currencyCode]['overviewData']['Approved'] ? `${currencySymbol} ${presenter.formatUtilManager.formatAmount(billsData[currencyCode]['overviewData']['Approved']['amount'])}` : defaultValue;
        for (let statusLabel = 1; statusLabel <= 4; statusLabel++) {
          if (contentScope["lblAmount" + statusLabel].text.length > 13) {
            contentScope["lblAmount" + statusLabel].skin = "bbSknLbl424242SSP15Px";
            contentScope["lblAmount" + statusLabel].top = "10px";
          }
        }
        contentScope.flxBarGraph.ReceivablesBarChart.chartData = graphData;
      } catch (err) {
        var errorObj = {
          "level": "frmReceivableBillsDashboardController",
          "method": "setGraphData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : setDropdownValues
     * This function to set data in the grapjh dropdowns.
     * @return : NA
     */
    setDropdownValues: function (segWidget, listValues, flxList, lblSelectedValue) {
      let segmentData = [];
      if (listValues) {
        segWidget.widgetDataMap = {
          'lblListValue': 'value'
        };
        for (const key in listValues) {
          segmentData.push({
            key: key,
            value: listValues[key],
            template: 'flxListDropdown'
          });
        }
        segWidget.setData(segmentData);
      }
      if (segWidget.id === 'segCurrencyFilter') {
        segWidget.selectedRowIndex = [0, 0];
        lblSelectedValue.text = segWidget.selectedRowItems[0].value;
        currencyCode = segWidget.selectedRowItems[0].key;
        currencySymbol = presenter.configurationManager.getCurrency(currencyCode);
      } else if (segWidget.id === 'segDurationFilter') {
        segWidget.selectedRowIndex = [0, 0];
        lblSelectedValue.text = segWidget.selectedRowItems[0].value;
        duration = segWidget.selectedRowItems[0].key;
      }
      flxList.height = (segmentData.length * 41 > 205) ? "205dp" : `${segmentData.length * 41}dp`;
    },

    /**
     * @api : setActiveTab
     * This function to set active tab based on the tab clicked.
     * @return : NA
     */
    setActiveTab: function(param){
      param = param ? param : currentTab;
      switch(param){
        case "bills":{
          contentScope.btnTabBill.skin = "ICSknBtnAccountSummarySelected2";
          contentScope.btnTabBatch.skin = "ICSknBtnAccountSummaryUnselected2";
          contentScope.btnFileImport.skin = "ICSknBtnAccountSummaryUnselected2";
          break;
        }
        case "batch":{
          contentScope.btnTabBill.skin = "ICSknBtnAccountSummaryUnselected2";
          contentScope.btnTabBatch.skin = "ICSknBtnAccountSummarySelected2";
          contentScope.btnFileImport.skin = "ICSknBtnAccountSummaryUnselected2";
          break;
        }
        case "fileImport":{
          contentScope.btnTabBill.skin = "ICSknBtnAccountSummaryUnselected2";
          contentScope.btnTabBatch.skin = "ICSknBtnAccountSummaryUnselected2";
          contentScope.btnFileImport.skin = "ICSknBtnAccountSummarySelected2";
          break;
        }
      }
    },

    /**
     * @api : tabClick
     * This function to set data based on the tab clicked.
     * @return : NA
     */
    tabClick: function(param){
      var scope = this;
      recordsData = [];
      switch(param){
        case "bills":{
          currentTab = BILLS;
          serviceParameters = {
            "searchString": "",
            "pageSize": "11",
            "pageOffset": "0",
            "sortByParam": "updatedOn",
            "sortOrder": "DESC",
            "timeParam": "",
            "timeValue": "6,MONTH",
            "filterByValue": "single",
            "filterByParam": "origin"
          };
          this.fetchDashboardData(BILLS);
          break;
        }
        case "batch":{
          currentTab = BATCH;
          this.fetchDashboardData(BATCH);
          break;
        }
        case "fileImport":{
          currentTab = FILE_IMPORT;
          serviceParameters.filterByParam = "";
          serviceParameters.filterByValue = "";
          this.fetchDashboardData(FILE_IMPORT);
          break;
        }
      }
      scope.setListingDetails();
      contentScope.flxListDropdown.setVisibility(false);
      contentScope.lblBillTypeDropdown.text = resourcesConstants['fontIcons']['chevronDown'];
      scope.isFilterApplied = false;
	  sortApplied = false;
      scope.onFilterCancel();
      contentScope.lblFilterText.text = scope.getI18nValue("i18n.konybb.Common.All");
    },

    /**
  * @api : fetchDashboardData
  * This method is responsible for calling dashboard service calls and modifying request payload
  * @return : NA
  */
    fetchDashboardData: function (params) {
      var scope = this;
      try{
        var searchStringtext = contentScope.tbxSearch.text;
        serviceParameters.searchString = searchStringtext;
        if (params !== 'pagination' && params !== "sort") {
          contentScope.flxPagination.PaginationContainer.setLowerLimit(1);
          contentScope.flxPagination.PaginationContainer.setPageSize(10);
          contentScope.flxPagination.PaginationContainer.setIntervalHeader();
        }
        var pageOffsetValue = (params === "pagination" || params === "sort") ? contentScope.flxPagination.PaginationContainer.getPageOffset() : 0;
        serviceParameters.pageOffset = JSON.stringify(pageOffsetValue);
        serviceParameters.pageSize = pageConfig.pageSize;
        if(currentTab === BILLS){
          presenter.getBills(serviceParameters, "frmReceivableBillsDashboard");
        }
        else if(currentTab === FILE_IMPORT){
          presenter.getCsvImports(serviceParameters, "frmReceivableBillsDashboard");
        }
      }catch (err) {
        var errorObj = {
          "level": "frmReceivableBillsDashboardController",
          "method": "fetchDashboardData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
  * @api : downloadXlsx
  * This method is responsible for generation and download of bills on request payload
  * @return : NA
  */
    downloadXlsx: function() {
      serviceParameters.pageSize = "";
      serviceParameters.pageOffset = "";
      presenter.downloadBillsXlsx(serviceParameters);
      contentScope.flxEllipsisDropDown.setVisibility(false);
    },
    /**
  * @api : fetchChartsData
  * This method is responsible for calling dashboard service calls and modifying request payload
  * @return : NA
  */
    fetchChartsData: function () {
      var scope = this;
      try{
        presenter.getBills(chartServiceParameters, "frmReceivableBillsDashboard",{isChartData: true});
      }catch (err) {
        var errorObj = {
          "level": "frmReceivableBillsDashboardController",
          "method": "fetchChartsData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    
    /**
     * @api : getDashboardData
     * This function is responsible for initial service calls for dashboard data
     * @param : null
     * @return : NA
     */
    getDashboardData: function(){
       var scope = this;
      try{
        let params = {
          listingParameter: serviceParameters,
          chartsParameter: chartServiceParameters
        }
        presenter.getDashboardData(params, "frmReceivableBillsDashboard",currentTab);      
      }catch (err) {
        var errorObj = {
          "level": "frmReceivableBillsDashboardController",
          "method": "getDashboardData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    
    /**
     * @api : setsegListingWidgetDataMap
     * This function for setting widgetDataMap for segment
     * @param : name of the segment.
     * @return : NA
     */
    setsegListingWidgetDataMap: function(segName) {
      var scope = this;
      try {
        var currentBreakpoint = kony.application.getCurrentBreakpoint();
        if (currentBreakpoint > 640 && currentBreakpoint <= 1024) {
          contentScope[segName].rowTemplate = "flxBillsListingRowTemplate";
        } else {
          contentScope[segName].rowTemplate = "flxBillsListingRowTemplate";
        }
        contentScope[segName].sectionHeaderTemplate = "flxBillsListingHeaderTemplate";
        contentScope[segName].widgetDataMap = {
          "flxBillsListingHeaderTemplate": "flxBillsListingHeaderTemplate",
          "flxTopSeparator": "flxTopSeparator",
          "flxBillsListingMainContainer": "flxBillsListingMainContainer",
          "flxListHeader1": "flxListHeader1",
          "flxListHeader2": "flxListHeader2",
          "flxListHeader3": "flxListHeader3",
          "flxListHeader4": "flxListHeader4",
          "flxListHeader5": "flxListHeader5",
          "flxListHeader6": "flxListHeader6",
          "flxListHeader7": "flxListHeader7",
          "btnListHeader1": "btnListHeader1",
          "btnListHeader2": "btnListHeader2",
          "btnListHeader3": "btnListHeader3",
          "btnListHeader4": "btnListHeader4",
          "btnListHeader5": "btnListHeader5",
          "btnListHeader6": "btnListHeader6",
          "btnListHeader7": "btnListHeader7",
          "imgListHeader1": "imgListHeader1",
          "imgListHeader2": "imgListHeader2",
          "imgListHeader3": "imgListHeader3",
          "imgListHeader4": "imgListHeader4",
          "imgListHeader5": "imgListHeader5",
          "imgListHeader6": "imgListHeader6",
          "flxBottomSeparator": "flxBottomSeparator",
          "flxBillsListingRowTemplate": "flxBillsListingRowTemplate",
          "flxListingMainContainer": "flxListingMainContainer",
          "flxMainContainer": "flxMainContainer",
          "flxDropdown": "flxDropdown",
          "lblDropdown": "lblDropdown",
          "flxColumn1": "flxColumn1",
          "flxColumn2": "flxColumn2",
          "flxColumn3": "flxColumn3",
          "flxColumn4": "flxColumn4",
          "flxColumn5": "flxColumn5",
          "flxColumn6": "flxColumn6",
          "flxColumn7": "flxColumn7",
          "lblColumn1": "lblColumn1",
          "lblColumn2": "lblColumn2",
          "lblColumn3": "lblColumn3",
          "lblColumn4": "lblColumn4",
          "lblColumn5": "lblColumn5",
          "lblColumn6": "lblColumn6",
          "btnAction": "btnAction",
          "lblSeparator": "lblSeparator",
          "flxExpandMainContainer": "flxExpandMainContainer",
          "flxExpandRowOne": "flxExpandRowOne",
          "flxRow1Column1": "flxRow1Column1",
          "flxRow1Column2": "flxRow1Column2",
          "flxRow1Column3": "flxRow1Column3",
          "flxRow1Column4": "flxRow1Column4",
          "flxRow1Column5": "flxRow1Column5",
          "flxRow1Column6": "flxRow1Column6",
          "flxRow1Column7": "flxRow1Column7",
          "lblRow1Column1Title": "lblRow1Column1Title",
          "lblRow1Column2Title": "lblRow1Column2Title",
          "lblRow1Column3Title": "lblRow1Column3Title",
          "lblRow1Column4Title": "lblRow1Column4Title",
          "lblRow1Column5Title": "lblRow1Column5Title",
          "lblRow1Column6Title": "lblRow1Column6Title",
          "lblRow1Column1Value": "lblRow1Column1Value",
          "lblRow1Column2Value": "lblRow1Column2Value",
          "lblRow1Column3Value": "lblRow1Column3Value",
          "lblRow1Column4Value": "lblRow1Column4Value",
          "lblRow1Column5Value": "lblRow1Column5Value",
          "lblRow1Column6Value": "lblRow1Column6Value",
          "btnDownload": "btnDownload",
          "btnPrint": "btnPrint",
          "lblBottomSeparator": "lblBottomSeparator",
          "flxWarning": "flxWarning",
          "lblWarning": "lblWarning",
          "imgWarning": "imgWarning"
        };
      } catch (err) {
        var errorObj = {
          "level": "frmReceivableBillsDashboard",
          "method": "setsegListingWidgetDataMap",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : setListingDetails
     * This function for setting data for segment
     * @return : NA
     */
    setListingDetails: function () {
      var scope = this;
      try {
        scope.setsegListingWidgetDataMap("segRecordListing");
        let DashboardDetails = [];
        let rowData = [];
        let section1 = [{
          btnListHeader1: {
            text: currentTab === FILE_IMPORT ? scope.getI18nValue("i18n.TradeFinance.fileRef") : scope.getI18nValue("i18n.TradeFinance.buyer")
          },
          btnListHeader2: {
            text: currentTab === BILLS ? scope.getI18nValue("i18n.TradeFinance.billRef") : currentTab === FILE_IMPORT ? scope.getI18nValue("kony.mb.achfiledetail.fileType") : scope.getI18nValue("i18n.TradeFinance.batchRefDot")
          },
          btnListHeader3: {
            text: currentTab === FILE_IMPORT ? scope.getI18nValue("i18n.TradeFinance.counts") : scope.getI18nValue("i18n.billPay.DueDate")
          },
          btnListHeader4: {
            text: currentTab === BILLS ? scope.getI18nValue("i18n.TradeFinance.origin") : currentTab === FILE_IMPORT ? scope.getI18nValue("i18n.TradeFinance.fileDate") : scope.getI18nValue("i18n.common.status")
          },
          btnListHeader5: {
            text: currentTab === BILLS ? scope.getI18nValue("i18n.common.status") : scope.getI18nValue("i18n.TradeFinance.updatedOn")
          },
          btnListHeader6: {
            text: scope.getI18nValue("i18n.konybb.Common.Amount")
          },
          btnListHeader7: {
            text: scope.getI18nValue("i18n.konybb.Common.Actions")
          },
          imgListHeader1: {
            src: "sorting.png"
          },
          flxListHeader1: {
            onClick: scope.sortRecords.bind(this, 1)
          },
          flxListHeader2: {
            onClick: scope.sortRecords.bind(this, 2),
            left: dashboardTabsConfig[currentTab]['flxListHeader2'],
            width: dashboardTabsConfig[currentTab]['flxListHeader2Width']
          },
          flxListHeader3: {
            onClick: scope.sortRecords.bind(this, 3),
            left: dashboardTabsConfig[currentTab]['flxListHeader3']
          },
          flxListHeader4: {
            onClick: scope.sortRecords.bind(this, 4),
            left: dashboardTabsConfig[currentTab]['flxListHeader4']
          },
          flxListHeader5: {
            isVisible: currentTab === BATCH ? false : true,
            left: dashboardTabsConfig[currentTab]['flxListHeader5'],
            width: dashboardTabsConfig[currentTab]['flxListHeader5Width'],
            onClick: scope.sortRecords.bind(this, 5)
          },
          flxListHeader6: {
            isVisible: currentTab === FILE_IMPORT ? false : true,
            onClick: scope.sortRecords.bind(this, 6),
            left: dashboardTabsConfig[currentTab]['flxListHeader6'],
            width: dashboardTabsConfig[currentTab]['flxListHeader6Width'],
          },
          flxListHeader7: {
            width: dashboardTabsConfig[currentTab]['flxListHeader7Width']
          }
        }];
        if (!sortApplied) {
          Object.assign(section1[0], {
            imgListHeader1: {
              src: "sorting.png"
            },
            imgListHeader2: {
              src: "sorting.png"
            },
            imgListHeader3: {
              src: "sorting.png"
            },
            imgListHeader4: {
              src: "sorting.png"
            },
            imgListHeader5: {
              src: "sorting.png"
            },
            imgListHeader6: {
              src: "sorting.png"
            }
          });
        } else {
          section1[0] = contentScope.segRecordListing.data[0][0];
        }
        if (recordsData.length > 0) {
          if (currentTab === BILLS) {
            for (const record of recordsData) {
              rowData.push({
                lblColumn1: {
                  text: record.buyerName || NA
                },
                lblColumn2: {
                  text: record.billReference || NA
                },
                lblColumn3: {
                  text: record.dueDate ? presenter.formatUtilManager.getFormattedCalendarDate(record.dueDate) : NA
                },
                lblColumn4: {
                  text: record.origin || NA
                },
                lblColumn5: {
                  text: record.status || NA
                },
                lblColumn6: {
                  text: (record.currency && record.amount) ? `${record.currency} ${presenter.formatUtilManager.formatAmount(record.amount)}` : NA
                },
                lblRow1Column1Title: {
                  text: scope.getI18nValue("i18n.TradeFinance.billNumber")
                },
                lblRow1Column2Title: {
                  text: scope.getI18nValue("i18n.TradeFinance.billName")
                },
                lblRow1Column3Title: {
                  text: scope.getI18nValue("i18n.TradeFinance.billCounts")
                },
                lblRow1Column4Title: {
                  text: scope.getI18nValue("i18n.TradeFinance.accountReceivable")
                },
                lblRow1Column5Title: {
                  text: scope.getI18nValue("i18n.TradeFinance.batchReference")
                },
                lblRow1Column6Title: {
                  text: scope.getI18nValue("i18n.TradeFinance.CancellationStatus")
                },
                lblRow1Column1Value: {
                  text: record.billNumber || NA
                },
                lblRow1Column2Value: {
                  text: record.billName || NA,
                  skin: "ICSKNLbl42424215PxWordBreak"
                },
                lblRow1Column3Value: {
                  text: record.billCounts || NA
                },
                lblRow1Column4Value: {
                  text: record.receivableAccount ? presenter.getAccountDisplayName(record.receivableAccount) : NA
                },
                lblRow1Column5Value: {
                  text: record.batchReference || NA,
                  skin: "sknlbl3B74A615px"
                },
                lblRow1Column6Value: {
                  text: record.cancellationStatus || NA
                },
                flxRow1Column1: {
                  left: dashboardTabsConfig[currentTab]['flxRow1Column1']
                },
                flxRow1Column2: {
                  left: dashboardTabsConfig[currentTab]['flxRow1Column2'],
                  width: dashboardTabsConfig[currentTab]['flxRow1Column2Width']
                },
                flxRow1Column3: {
                  isVisible: false,
                  left: dashboardTabsConfig[currentTab]['flxRow1Column3']
                },
                flxRow1Column4: {
                  isVisible: true,
                  left: dashboardTabsConfig[currentTab]['flxRow1Column4']
                },
                flxRow1Column5: {
                  isVisible: true,
                  left: dashboardTabsConfig[currentTab]['flxRow1Column5']
                },
                flxRow1Column6: {
                  isVisible: !!record.cancellationStatus,
                  width: dashboardTabsConfig[currentTab]['flxRow1Column6Width']
                },
                flxRow1Column7: {
                  isVisible: true,
                  left: record.cancellationStatus ? dashboardTabsConfig[currentTab]['flxRow1Column7'] : "22.5%",
                  width: dashboardTabsConfig[currentTab]['flxRow1Column7Width']
                },
                lblDropdown: {
                  text: resourcesConstants['fontIcons']['chevronDown']
                },
                flxDropdown: {
                  onClick: scope.onActionClick.bind(this, "segRecordListing")
                },
                flxExpandMainContainer: {
                  isVisible: false
                },
                flxBillsListingMainContainer: {
                  skin: "slFbox"
                },
                flxBillsListingRowTemplate: {
                  skin: "slFbox"
                },
                flxColumn2: {
                  left: dashboardTabsConfig[currentTab]['flxColumn2'],
                  width: dashboardTabsConfig[currentTab]['flxColumn2Width']
                },
                flxColumn3: {
                  left: dashboardTabsConfig[currentTab]['flxColumn3']
                },
                flxColumn4: {
                  left: dashboardTabsConfig[currentTab]['flxColumn4']
                },
                flxColumn5: {
                  isVisible: true,
                  left: dashboardTabsConfig[currentTab]['flxColumn5'],
                  width: dashboardTabsConfig[currentTab]['flxColumn5Width']
                },
                flxColumn6: {
                  isVisible: true,
                  left: dashboardTabsConfig[currentTab]['flxColumn6'],
                  width: dashboardTabsConfig[currentTab]['flxColumn6Width']
                },
                flxColumn7: {
                  left: dashboardTabsConfig[currentTab]['flxColumn7'],
                  width: dashboardTabsConfig[currentTab]['flxColumn7Width']
                },
                btnAction: {
                  text: kony.i18n.getLocalizedString(record.status === OLBConstants.BILLS_STATUS.DRAFT ? 'i18n.TransfersEur.btnContinue' : 'i18n.TradeFinance.View'),
                  toolTip: kony.i18n.getLocalizedString(record.status === OLBConstants.BILLS_STATUS.DRAFT ? 'i18n.TransfersEur.btnContinue' : 'i18n.TradeFinance.View'),
                  skin: "bbSknBtn4176A4TransparentBgSSP15px",
                  onClick: () => presenter.showBillsScreen({
                    context: record.status === OLBConstants.BILLS_STATUS.DRAFT ? 'createBill' : 'viewBillDetails',
                    data: record,
                    form: "frmReceivableBillsDashboard"
                  })
                },
                btnDownload: {
                  text: scope.getI18nValue("i18n.common.Download"),
                  toolTip: scope.getI18nValue("i18n.common.Download"),
                  onClick: () => {
                    presenter.downloadBillReportPdf(record.billReference);
                  }
                },
                btnPrint: {
                  isVisible: breakpoint > 1024,
                  text: scope.getI18nValue("i18n.accounts.print"),
                  toolTip: kony.i18n.getLocalizedString("i18n.accounts.print"),
                  onClick: function () {
                    presenter.showBillsScreen({
                      context: "printBill",
                      data: {
                        navData: record,
                        previousFormName: 'frmReceivableBillsDashboard',
                      }
                    });
                  }
                },
                flxWarning: {
                  isVisible: false
                },
                flxBillsListingMainContainer: {
                  isVisible: true
                }
              });
            }
          } else if (currentTab === FILE_IMPORT) {
            for (const record of recordsData) {
              const billReferences = JSON.parse(record.billReferences),
                totalCount = Object.keys(billReferences).length,
                pendingCount = Object.values(billReferences).filter(s => s === 'In Review').length,
                submittedCount = totalCount - pendingCount;
              rowData.push({
                lblColumn1: {
                  text: record.fileReference || NA
                },
                lblColumn2: {
                  text: record.fileType || NA
                },
                lblColumn3: {
                  text: record.counts || NA
                },
                lblColumn4: {
                  text: record.fileDate ? presenter.formatUtilManager.getFormattedCalendarDate(record.fileDate) : NA
                },
                lblColumn5: {
                  text: record.updatedOn ? presenter.formatUtilManager.getFormattedCalendarDate(record.updatedOn) : NA
                },
                lblRow1Column1Title: {
                  text: scope.getI18nValue("i18n.TradeFinance.batchReference")
                },
                lblRow1Column2Title: {
                  text: scope.getI18nValue("i18n.TradeFinance.billReference")
                },
                lblRow1Column3Title: {
                  text: scope.getI18nValue("i18n.TradeFinance.SubmittedToBank")
                },
                lblRow1Column4Title: {
                  left: '0%',
                  text: "Pending Review"
                },
                lblRow1Column1Value: {
                  text: record.batchReference || NA
                },
                lblRow1Column2Value: {
                  text: billReferences ? Object.keys(billReferences).join(', ') : NA,
                  toolTip: billReferences ? Object.keys(billReferences).join(', ') : NA,
                  skin: "sknLblSSP15pxtrucation"
                },
                lblRow1Column3Value: {
                  text: submittedCount.toString()
                },
                lblRow1Column4Value: {
                  left: '0%',
                  text: pendingCount.toString()
                },
                flxRow1Column1: {
                  left: dashboardTabsConfig[currentTab]['flxRow1Column1']
                },
                flxRow1Column2: {
                  left: dashboardTabsConfig[currentTab]['flxRow1Column2'],
                  width: dashboardTabsConfig[currentTab]['flxRow1Column2Width']
                },
                flxRow1Column3: {
                  isVisible: true,
                  left: dashboardTabsConfig[currentTab]['flxRow1Column3'],
                  width: dashboardTabsConfig[currentTab]['flxRow1Column3Width']
                },
                flxRow1Column4: {
                  isVisible: true,
                  left: dashboardTabsConfig[currentTab]['flxRow1Column4'],
                  width: dashboardTabsConfig[currentTab]['flxRow1Column4Width']
                },
                flxRow1Column5: {
                  isVisible: false
                },
                flxRow1Column6: {
                  isVisible: false
                },
                flxRow1Column7: {
                  isVisible: true,
                  left: dashboardTabsConfig[currentTab]['flxRow1Column7'],
                  width: dashboardTabsConfig[currentTab]['flxRow1Column7Width']
                },
                lblDropdown: {
                  text: resourcesConstants['fontIcons']['chevronDown']
                },
                flxDropdown: {
                  onClick: scope.onActionClick.bind(this, "segRecordListing")
                },
                flxExpandMainContainer: {
                  isVisible: false
                },
                flxBillsListingMainContainer: {
                  skin: "slFbox"
                },
                flxBillsListingRowTemplate: {
                  skin: "slFbox"
                },
                flxColumn2: {
                  left: dashboardTabsConfig[currentTab]['flxColumn2'],
                  width: dashboardTabsConfig[currentTab]['flxColumn2Width']
                },
                flxColumn3: {
                  left: dashboardTabsConfig[currentTab]['flxColumn3']
                },
                flxColumn4: {
                  left: dashboardTabsConfig[currentTab]['flxColumn4']
                },
                flxColumn5: {
                  isVisible: true,
                  left: dashboardTabsConfig[currentTab]['flxColumn5'],
                  width: dashboardTabsConfig[currentTab]['flxColumn5Width']
                },
                flxColumn6: {
                  isVisible: false
                },
                flxColumn7: {
                  left: dashboardTabsConfig[currentTab]['flxColumn7'],
                  width: dashboardTabsConfig[currentTab]['flxColumn7Width']
                },
                btnAction: {
                  text: (totalCount === submittedCount) ? kony.i18n.getLocalizedString('i18n.Wealth.Done') : (totalCount === pendingCount) ? kony.i18n.getLocalizedString('i18n.kony.BulkPayments.ViewRequests') : 'Continue Reviewing',
                  toolTip: (totalCount === submittedCount) ? kony.i18n.getLocalizedString('i18n.Wealth.Done') : (totalCount === pendingCount) ? kony.i18n.getLocalizedString('i18n.kony.BulkPayments.ViewRequests') : 'Continue Reviewing',
                  skin: (totalCount === submittedCount) ? "sknBtnAccountSummaryUnselectedTransferFocus" : "bbSknBtn4176A4TransparentBgSSP15px",
                  enable: (totalCount === submittedCount) ? false : true,
                  onClick: () => presenter.showBillsScreen({
                    context: 'reviewFileImport',
                    data: record,
                    form: "frmReceivableBillsDashboard"
                  })
                },
                btnDownload: {
                  isVisible: (totalCount !== submittedCount),
                  text: scope.getI18nValue("kony.mb.common.Delete"),
                  toolTip: scope.getI18nValue("kony.mb.common.Delete"),
                  onClick: () => {
                    presenter.deleteCsvImports({ "fileReference": record.fileReference }, "frmReceivableBillsDashboard");
                  }
                },
                btnPrint: {
                  isVisible: false
                },
                flxWarning: {
                  isVisible: false
                },
                flxBillsListingMainContainer: {
                  isVisible: true
                }
              });
            }
          }
        } else {
          rowData.push({
            flxWarning: {
              isVisible: true
            },
            flxBillsListingMainContainer: {
              isVisible: false
            }
          });
        }
        section1.push(rowData);
        DashboardDetails.push(section1);
        contentScope.segRecordListing.setData(DashboardDetails);
        this.setActiveTab(currentTab);
      } catch (err) {
        var errorObj = {
          "level": "frmReceivableBillsDashboard",
          "method": "setListingDetails",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : onActionClick
     * This function for expanding/collapsing listing
     * @return : NA
     */
    onActionClick: function (segName) {
      var scopeObj = this;
      try {
        let index = contentScope[segName].selectedRowIndex;
        var sectionIndex = index[0];
        let rowIndex = index[1];
        let selectedRowDataObject;
        let segData = contentScope[segName].data[0][1];
        selectedRowDataObject = segData[rowIndex];
        if (!presenter.isEmptyNullOrUndefined(prevSelectedIndex)) {
          let prevSelectedRowDataObject;
          if (!presenter.isEmptyNullOrUndefined(segData[prevSelectedIndex])) {
            prevSelectedRowDataObject = segData[prevSelectedIndex];
            selectedRowDataObject.lblDropdown.text = resourcesConstants['fontIcons']['chevronDown'];
            selectedRowDataObject.flxDropdown.width = "5%";
            selectedRowDataObject.flxBillsListingMainContainer.skin = "slFbox";
            selectedRowDataObject.flxBillsListingRowTemplate.skin = "slFbox";
            if(currentTab === BILLS){
              selectedRowDataObject.flxColumn5.left = "0%";
              selectedRowDataObject.flxRow1Column5.left = "5.5%";
              prevSelectedRowDataObject.flxDropdown.width = "5%";
              prevSelectedRowDataObject.flxColumn5.left = "0%";
            }else if(currentTab === FILE_IMPORT){
              selectedRowDataObject.flxColumn5.left = "4.25%";
              prevSelectedRowDataObject.flxColumn5.left = "4%";
			  prevSelectedRowDataObject.flxDropdown.width = "5%";
            }
            prevSelectedRowDataObject.flxExpandMainContainer.isVisible = false;
            prevSelectedRowDataObject.lblDropdown.text = resourcesConstants['fontIcons']['chevronDown'];
            prevSelectedRowDataObject.flxBillsListingRowTemplate.skin = "slFbox";
            prevSelectedRowDataObject.flxBillsListingMainContainer.skin = "slFbox";
            contentScope[segName].setDataAt(prevSelectedRowDataObject, prevSelectedIndex, sectionIndex);
            if (prevSelectedIndex === rowIndex) {
              prevSelectedIndex = null;
              return;
            }
          }
        }
        prevSelectedIndex = rowIndex;
        selectedRowDataObject.lblDropdown.text = resourcesConstants['fontIcons']['chevronUp'];
        selectedRowDataObject.flxDropdown.width = "4.6%";
        selectedRowDataObject.flxRow1Column1.left = "4.6%";
        selectedRowDataObject.flxBillsListingMainContainer.skin = "ICSknFlxfbfbfb";
        selectedRowDataObject.flxBillsListingRowTemplate.skin = "slFboxLeftBorder4176a4";
        if(currentTab === BILLS){
          selectedRowDataObject.flxColumn5.left = "0.25%";
          selectedRowDataObject.flxRow1Column5.left = "5.81%";
        }else if(currentTab === FILE_IMPORT){
          selectedRowDataObject.flxColumn5.left = "4.25%";
        }
        selectedRowDataObject.flxExpandMainContainer.isVisible = true;
        contentScope[segName].setDataAt(selectedRowDataObject, rowIndex, sectionIndex);
      } catch (err) {
        var errorObj = {
          "level": "frmReceivableBillsDashboard",
          "method": "onActionClick",
          "error": err
        };
        scopeObj.onError(errorObj);
      }
    },

    /**
     * @api : sortRecords
     * Update sort icons and trigger a action to business controller to sort
     * @return : NA
     */
    sortRecords: function (columnNo) {
      var scope = this;
      try {
        var sortType = "";
        sortApplied = true;
        var imageName = "imgListHeader";
        var segView = contentScope.segRecordListing.data[0][0];
        var field = sortFields[imageName + columnNo];
        if (segView[imageName + columnNo].src === "sorting.png") {
          segView[imageName + columnNo].src = "sorting_previous.png";
          sortType = "ASC";
        } else if (segView[imageName + columnNo].src === "sorting_previous.png") {
          segView[imageName + columnNo].src = "sorting_next.png";
          sortType = "DESC";
        } else {
          segView[imageName + columnNo].src = "sorting_previous.png";
          sortType = "ASC";
        }
        for (var i = 1; i <= 6; i++) {
          if (i !== columnNo && segView[imageName + i]) {
            segView[imageName + i].src = "sorting.png";
          }
        }
        contentScope.segRecordListing.data[0][0] = segView;
        contentScope.segRecordListing.setData(contentScope.segRecordListing.data);
        serviceParameters.sortByParam = field ? field : "";
        serviceParameters.sortOrder = sortType;
        scope.fetchDashboardData("sort");
      } catch (err) {
        var errorObj = {
          "method": "sortRecords",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : getI18nValue
     * This function is responsible for getting i18n Value
     * @return : i18n Value
     */
    getI18nValue: function (i18Key) {
      var scope = this;
      try {
        return kony.i18n.getLocalizedString(i18Key);
      }
      catch (err) {
        var errorObj =
        {
          "level": "frmReceivableBillsDashboard",
          "method": "getI18nValue",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
  * @api : setPaginationComponent
  * This method will invoked to set pagination variables
  * @return : NA
  */
    setPaginationComponent: function (pageHeader) {
      var scope = this;
      try {
        contentScope.flxPagination.PaginationContainer.setPageSize(10);
        contentScope.flxPagination.PaginationContainer.setLowerLimit(1);
        contentScope.flxPagination.PaginationContainer.setPageHeader(pageHeader);
        contentScope.flxPagination.PaginationContainer.setServiceDelegate(scope.fetchDashboardData.bind(scope, 'pagination'));
        contentScope.flxPagination.PaginationContainer.setIntervalHeader();
      } catch (err) {
        var errorObj = {
          "method": "setPaginationComponent",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    
    /**
  * @api : getBatchBills
  * This method is responsible for getting batch related bills
  * @return : NA
  */
    getBatchBills: function (param) {
      var scope = this;
      try {
        if (param) {
          serviceParameters.filterByParam = "origin,origin";
          serviceParameters.filterByValue = "single,batch";
        } else {
          serviceParameters.filterByParam = "origin";
          serviceParameters.filterByValue = "single";
        }
        scope.fetchDashboardData();
      }
      catch (err) {
        var errorObj =
        {
          "level": "frmReceivableBillsDashboard",
          "method": "getBatchBills",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
      * @api : setFilterWidgetDataMap
      * Maps widgetdata to  filter segments
      * @return : NA
      */
    setFilterWidgetDataMap: function () {
      var scope = this;
      try {
        var widgetDataMap = {
          "flxBillsFilterList": "flxBillsFilterList",
          "lblIcon": "lblIcon",
          "lblFilterValue": "lblFilterValue",
          "flxDetailsHeader": "flxDetailsHeader",
          "flxHeaderSeparator": "flxHeaderSeparator",
          "flxMain": "flxMain",
          "lblHeading": "lblHeading",
          "flxDropdown": "flxDropdown",
          "lblDropdownIcon": "lblDropdownIcon"
        };
        contentScope.segFilter.widgetDataMap = widgetDataMap;
      } catch (err) {
        var errorObj = {
          "method": "setFilterWidgetDataMap",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
      * @api : setFilterUIView
      * This Method handles filter dropdown UI
      * @return : NA
      */
    setFilterUIView: function () {
      var scope = this;
      try {
        scope.setFilterWidgetDataMap();
        contentScope.segFilter.setVisibility(true);
        scope.setFilterData();
      } catch (err) {
        var errorObj = {
          "method": "setFilterUIView",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : toggleFilterDropDownVisibility
     * Hides or shows the filter dropw down based on its current state
     * @return : NA
     */
    toggleFilterDropDownVisibility: function () {
      var scope = this;
      try {
        if (contentScope.lblBillTypeDropdown.text === resourcesConstants['fontIcons']['chevronDown']) {
          if (scope.isFilterApplied) {
            contentScope.segFilter.setData(JSON.parse(JSON.stringify(segFilterDetails)));
          } else {
            scope.setFilterData();
          }
          contentScope.btnApply.skin = "ICSknbtnEnabed003e7536px";
          contentScope.btnApply.setEnabled(true);
          contentScope.flxListDropdown.setVisibility(true);
          contentScope.lblBillTypeDropdown.text = resourcesConstants['fontIcons']['chevronUp'];
        } else {
          contentScope.flxListDropdown.setVisibility(false);
          contentScope.lblBillTypeDropdown.text = resourcesConstants['fontIcons']['chevronDown'];
        }
        scope.view.forceLayout();
      } catch (err) {
        var errorObj = {
          "method": "toggleFilterDropDownVisibility",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : setFilterData
     * Widget data mapping for LC type segment
     * @return : NA
     */
    setFilterData: function () {
      var scope = this;
      filterSegDetails = [];
      let timePeriodTypes = ['Today', 'Last One Month', 'Last Six Months', 'Last One Year', 'YTD'];
      try {
        let timePeriodFilter = [];
        let segFilter1Data = [{
          "lblHeading": {
            text: scope.getI18nValue("i18n.Accounts.SortBy"),
            left: "5%"
          },
          "flxMain": {
            height: "50dp"
          },
          "flxHeaderSeparator": {
            isVisible: true,
          },
          lblDropdownIcon: {
            text: resourcesConstants['fontIcons']['chevronUp']
          }
        },
        [{
          lblFilterValue: {
            text: scope.getI18nValue("i18n.TradeSupplyFinance.updateDate"),
            isVisible: true,
            key: OLBConstants.BILLS_SORTBY.UPDATED_ON
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['radioSelected'],
            isVisible: true
          }
        }, {
          lblFilterValue: {
            text: scope.getI18nValue("i18n.TradeFinance.billNumber"),
            isVisible: true,
            key: OLBConstants.BILLS_SORTBY.BILL_NUMBER
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['radioUnselected'],
            isVisible: true
          }
        }, {
          lblFilterValue: {
            text: scope.getI18nValue("i18n.billPay.labelBillDate"),
            isVisible: true,
            key: OLBConstants.BILLS_SORTBY.BILL_DATE
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['radioUnselected'],
            isVisible: true
          }
        }]
        ];
        let segFilter2Data = [{
          "lblHeading": {
            text: scope.getI18nValue("i18n.TradeFinance.statusRequired"),
            left: "5%"
          },
          "flxMain": {
            height: "50dp"
          },
          "flxHeaderSeparator": {
            isVisible: true,
          },
          lblDropdownIcon: {
            text: resourcesConstants['fontIcons']['chevronUp']
          }
        },
        [{
          lblFilterValue: {
            text: scope.getI18nValue("i18n.TradeFinance.SelectAll"),
            isVisible: true,
            key: 'Select All'
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['checkboxSelected'],
            isVisible: true
          }
        }, {
          lblFilterValue: {
            text: scope.getI18nValue("kony.mb.Messages.draft"),
            isVisible: true,
            key: OLBConstants.BILLS_STATUS.DRAFT
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['checkboxSelected'],
            isVisible: true
          }
        }, {
          lblFilterValue: {
            text: scope.getI18nValue("i18n.TradeFinance.SubmittedToBank"),
            isVisible: true,
            key: OLBConstants.BILLS_STATUS.SUBMITTED_TO_BANK
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['checkboxSelected'],
            isVisible: true
          }
        }, {
          lblFilterValue: {
            text: scope.getI18nValue("i18n.TradeFinance.ProcessingByBank"),
            isVisible: true,
            key: OLBConstants.BILLS_STATUS.PROCESSING_BY_BANK
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['checkboxSelected'],
            isVisible: true
          }
        }, {
          lblFilterValue: {
            text: scope.getI18nValue("i18n.TradeFinance.ReturnedbyBank"),
            isVisible: true,
            key: OLBConstants.BILLS_STATUS.RETURNED_BY_BANK
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['checkboxSelected'],
            isVisible: true
          }
        }, {
          lblFilterValue: {
            text: scope.getI18nValue("kony.mb.ApprovalRequests.Approved"),
            isVisible: true,
            key: OLBConstants.BILLS_STATUS.APPROVED
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['checkboxSelected'],
            isVisible: true
          }
        }, {
          lblFilterValue: {
            text: scope.getI18nValue("i18n.TradeFinance.settled"),
            isVisible: true,
            key: OLBConstants.BILLS_STATUS.SETTLED
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['checkboxSelected'],
            isVisible: true
          }
        }, {
          lblFilterValue: {
            text: scope.getI18nValue("i18n.Search.Rejected"),
            isVisible: true,
            key: OLBConstants.BILLS_STATUS.REJECTED
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['checkboxSelected'],
            isVisible: true
          }
        }, {
          lblFilterValue: {
            text: scope.getI18nValue("i18n.TradeSupplyFinance.needFinance"),
            isVisible: true,
            key: OLBConstants.BILLS_STATUS.NEED_FINANCE
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['checkboxSelected'],
            isVisible: true
          }
        }, {
          lblFilterValue: {
            text: scope.getI18nValue("i18n.TradeSupplyFinance.financed"),
            isVisible: true,
            key: OLBConstants.BILLS_STATUS.FINANCED
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['checkboxSelected'],
            isVisible: true
          }
        }, {
          lblFilterValue: {
            text: scope.getI18nValue("i18n.Transfers.Cancelled"),
            isVisible: true,
            key: OLBConstants.BILLS_STATUS.CANCELLED
          },
          lblIcon: {
            text: resourcesConstants['fontIcons']['checkboxSelected'],
            isVisible: true
          }
        }]
        ];
        let segFilter3Data = [{
          "lblHeading": {
            text: scope.getI18nValue("i18n.TradeFinance.TimePeriod"),
            left: "5%"
          },
          "flxMain": {
            height: "50dp"
          },
          "flxHeaderSeparator": {
            isVisible: true,
          },
          lblDropdownIcon: {
            text: resourcesConstants['fontIcons']['chevronUp']
          }
        }];
        timePeriodTypes.forEach((timePeriodType, idx) => {
          timePeriodFilter.push({
            lblFilterValue: {
              text: timePeriodType,
              isVisible: true
            },
            lblIcon: {
              text: idx === 2 ? resourcesConstants['fontIcons']['radioSelected'] : resourcesConstants['fontIcons']['radioUnselected'],
              isVisible: true,
              cursorType: "pointer"
            }
          });
        });
        segFilter3Data.push(timePeriodFilter);
        filterSegDetails.push(segFilter1Data);
        filterSegDetails.push(segFilter2Data);
        filterSegDetails.push(segFilter3Data);
        contentScope.segFilter.setData(JSON.parse(JSON.stringify(filterSegDetails)));
      } catch (err) {
        var errorObj = {
          "method": "setFilterData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : segRowOnClick
     * This method handles on row click of filter segments
     * @return : NA
     */
    segRowOnClick: function ({sectionIndex,rowIndex}) {
      var scope = this;
      try {
        var statusTypeCount = 0;
        var segmentdata = contentScope.segFilter.data;
        if (sectionIndex === 1) {
          if (segmentdata[sectionIndex][1][rowIndex].lblIcon.text === resourcesConstants['fontIcons']['checkboxUnselected']) {
            segmentdata[sectionIndex][1][rowIndex].lblIcon.text = resourcesConstants['fontIcons']['checkboxSelected'];
            if (rowIndex !== 0) {
              segmentdata[sectionIndex][1][0].lblIcon.text = resourcesConstants['fontIcons']['checkboxUnselected'];
            }
          } else {
            segmentdata[sectionIndex][1][rowIndex].lblIcon.text = resourcesConstants['fontIcons']['checkboxUnselected'];
            if (rowIndex !== 0) {
              segmentdata[sectionIndex][1][0].lblIcon.text = resourcesConstants['fontIcons']['checkboxUnselected'];
            }
          }

        } else {
          if (sectionIndex !== 1 && rowIndex === scope.previousFilterSelection) {
            segmentdata[sectionIndex][1][rowIndex].lblIcon.text = resourcesConstants['fontIcons']['radioUnselected'];
            segmentdata[sectionIndex][1][scope.previousFilterSelection].lblIcon.text = resourcesConstants['fontIcons']['radioSelected'];
            scope.previousFilterSelection = rowIndex;
          } else {
            segmentdata[sectionIndex][1][rowIndex].lblIcon.text = resourcesConstants['fontIcons']['radioSelected'];
          }
        }
        if (sectionIndex !== 1) {
          for (var i = 0; i < segmentdata[sectionIndex][1].length; i++) {
            if (i !== rowIndex) {
              segmentdata[sectionIndex][1][i].lblIcon.text = resourcesConstants['fontIcons']['radioUnselected'];
            }
          }
        }
        if (sectionIndex === 1 && rowIndex === 0) {
          for (var i = 0; i < segmentdata[sectionIndex][1].length; i++) {
            segmentdata[sectionIndex][1][i].lblIcon.text = segmentdata[sectionIndex][1][rowIndex].lblIcon.text;
          }
        }
        contentScope.segFilter.setData(JSON.parse(JSON.stringify(segmentdata)));
        var statusTypeData = contentScope.segFilter.data[1][1];
        for (var i = 0; i < statusTypeData.length; i++) {
          if (statusTypeData[i].lblIcon.text === resourcesConstants['fontIcons']['checkboxSelected']) {
            statusTypeCount++;
            if ((statusTypeCount === 10 && currentTab === BILLS)) {
              statusTypeData[0].lblIcon.text = resourcesConstants['fontIcons']['checkboxSelected'];
              contentScope.segFilter.setDataAt(Object.assign({}, statusTypeData[0]), 0, 1);
            }
          }
        }
        if (statusTypeCount >= 1) {
          contentScope.btnApply.onClick = scope.applyFilters;
          contentScope.btnApply.skin = "ICSknbtnEnabed003e7536px";
          contentScope.btnApply.setEnabled(true);
        } else {
          contentScope.btnApply.skin = "ICSknbtnDisablede2e9f036px";
          contentScope.btnApply.setEnabled(false);
        }
        contentScope.forceLayout();
      } catch (err) {
        var errorObj = {
          "method": "segRowOnClick",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : applyFilters
     * Applies the filter values for filtering the data
     * @return : NA
     */
    applyFilters: function () {
      var scope = this;
      try {
        let filterByValue = [];
        let filterByParam = [];
        let timeValue = "";
        let pageOffset = contentScope.flxPagination.PaginationContainer.getPageOffset();
        let selectedFilterCount = 0;
        let sortByFilter = contentScope.segFilter.data[0][1];
        let statusFilter = contentScope.segFilter.data[1][1];
        let timePeriodFilter = contentScope.segFilter.data[2][1];
        for (var i = 0; i < sortByFilter.length; i++) {
          if (sortByFilter[i].lblIcon.text === resourcesConstants['fontIcons']['radioSelected']) {
            serviceParameters.sortByParam = sortByFilter[i].lblFilterValue.key;
            selectedFilterCount++;
          }
        }
        for (var i = 0; i < statusFilter.length; i++) {
          if (statusFilter[i].lblIcon.text === resourcesConstants['fontIcons']['checkboxSelected']) {
            filterByValue.push(statusFilter[i].lblFilterValue.key);
            if (currentTab === BILLS) {
              filterByParam.push("status");
            }
            selectedFilterCount++;
          }
        }
        for (var i = 0; i < timePeriodFilter.length; i++) {
          if (timePeriodFilter[i].lblIcon.text === resourcesConstants['fontIcons']['radioSelected']) {
            switch (timePeriodFilter[i].lblFilterValue.text) {
              case "Last Six Months":
                timeValue = "6,MONTH";
                break;
              case "Today":
                timeValue = "1,DAY";
                break;
              case "Last One Month":
                timeValue = "1,MONTH";
                break;
              case "Last One Year":
                timeValue = "1,YEAR";
                break;
              case "YTD":
                timeValue = `${Math.ceil((Date.now() - Date.parse(new Date().getFullYear(), 0, 0)) / 864e5)},DAY`;
                break;
            }
            selectedFilterCount++;
          }
        }
        scope.isFilterApplied = true;
        contentScope.flxListDropdown.setVisibility(false);
        contentScope.lblBillTypeDropdown.text = resourcesConstants['fontIcons']['chevronDown'];
        if (statusFilter[0].lblIcon.text === resourcesConstants['fontIcons']['checkboxSelected']) {
          contentScope.lblFilterText.text = scope.getI18nValue("i18n.konybb.Common.All");
        } else {
          contentScope.lblFilterText.text = scope.getI18nValue("i18n.ProfileManagement.Selected") + "(" + selectedFilterCount + ")";
        }
        scope.view.forceLayout();
        filterByValue = filterByValue.join(',');
        filterByParam = filterByParam.join(',');
        filterByValue.substring(1, filterByValue.length);
        let timeParam = "";
        if (currentTab === BILLS) {
          timeParam = OLBConstants.BILLS_SORTBY.UPDATED_ON;
        }
        serviceParameters.filterByValue = filterByValue;
        serviceParameters.filterByParam = filterByParam;
        serviceParameters.timeParam = timeParam;
        serviceParameters.timeValue = timeValue;
		segFilterDetails = JSON.parse(JSON.stringify(contentScope.segFilter.data));
        scope.fetchDashboardData();
      } catch (err) {
        var errorObj = {
          "method": "applyFilters",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
     * @api : onFilterCancel
     * This metod will invoked on cancel of filters
     * @return : NA
     */
    onFilterCancel: function () {
      var scope = this;
      try {
        if (scope.isFilterApplied) {
          contentScope.segFilter.setData(JSON.parse(JSON.stringify(segFilterDetails)));
        }
        else{
          contentScope.segFilter.setData(JSON.parse(JSON.stringify(filterSegDetails)));
        }
        contentScope.flxListDropdown.setVisibility(false);
        contentScope.lblBillTypeDropdown.text = resourcesConstants['fontIcons']['chevronDown'];
      } catch (err) {
        var errorObj = {
          "method": "onFilterCancel",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
 * @api : toggleSectionHeader
 * Triggerd on click of dropdown in segment
 * @return : NA
 */
    toggleSectionHeader: function ({ sectionIndex, rowIndex }) {
      try {
        let newSegData = JSON.parse(JSON.stringify(contentScope.segFilter.data));
        if (newSegData[sectionIndex][0]['lblDropdownIcon']['text'] === resourcesConstants['fontIcons']['chevronDown']) {
          newSegData[sectionIndex][0]['lblDropdownIcon']['text'] = resourcesConstants['fontIcons']['chevronUp'];
          newSegData[sectionIndex][1] = filterSegDetails[sectionIndex][1];
        } else {
          newSegData[sectionIndex][0]['lblDropdownIcon']['text'] = resourcesConstants['fontIcons']['chevronDown'];
          newSegData[sectionIndex][1] = [];
        }
        for (let i = 0; i < filterSegDetails.length; i++) {
          if (newSegData[i][1].length > 0) {
            newSegData[i][1] = filterSegDetails[i][1];
          }
        }
        filterSegDetails[sectionIndex][0]['lblDropdownIcon']['text'] = newSegData[sectionIndex][0]['lblDropdownIcon']['text']
        contentScope.segFilter.setData(newSegData);
      } catch (err) {
        const errorObj = {
          "level": "frmReceivableBillsDashboard",
          "method": "toggleSectionHeader",
          "error": err
        };
        this.onError(errorObj);
      }
    },

    /**
         * @api : browseSupportingDocument
         * Triggerd on click upload option
         * @return : NA
         */
    browseSupportingDocument: function () {
      var scope = this;
      try {
        this.view.formTemplate12.hideBannerError();
          var config = {
              selectMultipleFiles: false,
              filter: [".csv"]
          };
          kony.io.FileSystem.browse(config, scope.selectedFileCallbackForCSV);
      } catch (err) {
          var errorObj = {
              "method": "browseSupportingDocument",
              "error": err
          };
          scope.onError(errorObj);
      }
  },

  /**
   * @api : selectedFileCallbackForCSV
   * Triggerd on uploading of a file
   * @return : NA
   */
  selectedFileCallbackForCSV: function (res) {
      var reader = new FileReader();
      fileName = res.target.files[0].name;
      if (res.target.files[0].size >= presenter.billConfig.billCsvSize) {
        let message = `${kony.i18n.getLocalizedString("i18n.TransfersEur.AttachmentTypeErrorMsg1")} ${res.target.files[0].name} ${kony.i18n.getLocalizedString("kony.mb.Europe.AttachmentSizeErrorMsg")} ${presenter.billConfig.billCsvSize / 10e5} MB.`;
        this.view.formTemplate12.showBannerError({ dbpErrMsg: message });
        return;
      }
      reader.readAsDataURL(res.target.files[0]);
      reader.onload = () => {
        const csv = atob(reader.result.split(',')[1]); // decode base64-encoded CSV data
        presenter.isUploadInBackground = false;
        presenter.CSVToJSON(csv, "frmReceivableBillsDashboard");
      };
      reader.onerror = (error) => {
        this.onError(error);
      };
    },


    /**
 * @api : onError
 * Error thrown from catch block in component and shown on the form
 * @return : NA
 */
    onError: function(err) {
      kony.print(JSON.stringify(err));
    }
  };
});