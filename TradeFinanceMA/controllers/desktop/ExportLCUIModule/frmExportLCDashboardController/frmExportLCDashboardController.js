define(['FormControllerUtility', 'OLBConstants', 'CommonUtilities'], function (FormControllerUtility, OLBConstants, CommonUtilities) {
  const responsiveUtils = new ResponsiveUtils(),
    NA = kony.i18n.getLocalizedString("i18n.common.NA"),
    formatter = new Intl.NumberFormat('en', { notation: 'compact' });
  let context = {}, presenter, currencyCode, currencySymbol, duration, exportLCGraphData, newlyReceivedCount, breakpoint;
  return {
    init: function () {
      this.view.preShow = this.preShow;
      this.view.postShow = this.postShow;
      this.view.onDeviceBack = function () { };
      this.view.onBreakpointChange = this.onBreakpointChange;
      this.view.ExportLCList.onTabClick = this.onTabClick;
      this.view.ExportLCList.showErrorMessage = this.showErrorMessage;
      this.view.ExportLCList.onError = this.onError;
      this.initFormActions();
    },
    onBreakpointChange: function (form, width) {
      FormControllerUtility.setupFormOnTouchEnd(width);
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
    },
    preShow: function () {
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter']);
      this.view.customheadernew.forceCloseHamburger();
      this.view.customheadernew.activateMenu("TradeFinance", "Exports");
      this.view.flxCreateNewDrawingContainer.doLayout = CommonUtilities.centerPopupFlex;
      this.resetForm();
    },
    postShow: function () {
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
      applicationManager.getNavigationManager().applyUpdates(this);
      this.setDropdownValues(this.view.segCurrencyFilter, presenter.exportLCConfig.graphCurrencyFilters, this.view.flxCurrencyFilterList, this.view.lblSelectedCurrencyFilter);
      this.setDropdownValues(this.view.segDurationFilter, presenter.exportLCConfig.graphDurationFilters, this.view.flxDurationFilterList, this.view.lblSelectedDurationFilter);
      presenter.getExportLetterOfCredits({
        'pageSize': '',
        'pageOffset': '',
        'sortByParam': 'lcUpdatedOn',
        'sortOrder': 'DESC',
        'timeParam': '',
        'timeValue': ''
      }, this.view.id);
    },
    initFormActions: function () {
      const scope = this;
      presenter = applicationManager.getModulesPresentationController({ appName: 'TradeFinanceMA', moduleName: 'ExportLCUIModule' });
      this.view.flxCurrencyFilterDropdown.onClick = this.toggleDropdown.bind(this, this.view.flxCurrencyFilterList, this.view.lblCurrencyFilterDropdownIcon);
      this.view.segCurrencyFilter.onRowClick = this.segRowClick.bind(this, this.view.segCurrencyFilter, this.view.lblSelectedCurrencyFilter, this.view.flxCurrencyFilterList, this.view.lblCurrencyFilterDropdownIcon);
      this.view.flxDurationFilterDropdown.onClick = this.toggleDropdown.bind(this, this.view.flxDurationFilterList, this.view.lblDurationFilterDropdownIcon);
      this.view.segDurationFilter.onRowClick = this.segRowClick.bind(this, this.view.segDurationFilter, this.view.lblSelectedDurationFilter, this.view.flxDurationFilterList, this.view.lblDurationFilterDropdownIcon);
      this.view.flxClose.onClick = () => scope.view.flxErrorMessage.setVisibility(false);
      this.view.flxCloseBtn.onClick = () => scope.view.flxSuccess.setVisibility(false);
      this.view.flxQuickLink1.onClick = this.toggleCreateNewDrawingPopup.bind(this, true);
      this.view.flxQuickLinkTablet1.onClick = this.toggleCreateNewDrawingPopup.bind(this, true);
      this.view.CreateNewDrawing.flxClose.onClick = this.toggleCreateNewDrawingPopup.bind(this, false);
      this.view.CreateNewDrawing.btnClose.onClick = this.viewLCDetails;
      this.view.CreateNewDrawing.btnCopyDetails.onClick = this.createNewDrawing;
      this.view.flxQuickLink2.onClick = this.toggleNewlyReceivedExportLCView.bind(this, true);
      this.view.flxQuickLinkTablet2.onClick = this.toggleNewlyReceivedExportLCView.bind(this, true);
      this.view.btnBackToDashboard.onClick = this.toggleNewlyReceivedExportLCView.bind(this, false);
      this.initialiseColumnChart();
    },
    onNavigate: function (param = {}) {
      breakpoint = kony.application.getCurrentBreakpoint();
      context = param;
      if (!context.flowType) context.flowType = 'GetAllExportLettersOfCredit';
      if (context.deleteDrawing) {
        this.view.flxSuccess.setVisibility(true);
        this.view.lblExportSuccess.text = kony.i18n.getLocalizedString("i18n.TradeFinance.ExportLCDrawingDraftDeleteMessage");
      }
      if (context.drawings) {
        this.view.flxSuccess.setVisibility(true);
        this.view.lblExportSuccess.text = kony.i18n.getLocalizedString("i18n.TradeFinance.ExportLCDrawingDraftSaveMessage");
      }
      this.view.ExportLCList.setContext(context);
    },
    /**
     * updateFormUI - the entry point method for the form controller.
     * @param {Object} viewModel - it contains the set of view properties and keys.
     */
    updateFormUI: function (viewModel) {
      if (viewModel.isLoading === true) {
        FormControllerUtility.showProgressBar(this.view);
      } else if (viewModel.isLoading === false) {
        FormControllerUtility.hideProgressBar(this.view);
      }
      if (viewModel.ExportLetterOfCredits) {
        if (this.view.flxCreateNewDrawingPopup.isVisible) {
          this.view.CreateNewDrawing.setData(viewModel.ExportLetterOfCredits, 'exportDrawing');
        } else {
          this.constructGraphData(viewModel.ExportLetterOfCredits);
          this.setRecentLCData(viewModel.ExportLetterOfCredits);
        }
      }
      if (viewModel.serverError) {
        this.showErrorMessage({ dbpErrMsg: viewModel.serverError });
      }
    },
    onTabClick: function (tabId) {
      this.view.flxErrorMessage.setVisibility(false);
      this.view.flxSuccess.setVisibility(false);
      const navManager = applicationManager.getNavigationManager();
      if (context.flowType && context.flowType === "GetExportLcIdDrawings") {
        if (tabId === "Amendments") {
          navManager.navigateTo({ appName: "TradeFinanceMA", friendlyName: "ExportLCUIModule/frmExportLCDetails" }, false, {
            flowType: 'Amendments',
            lcAmendments: context.lcAmendments
          });
        } else if (tabId === "LettersOfCredit") {
          navManager.navigateTo({ appName: "TradeFinanceMA", friendlyName: "ExportLCUIModule/frmExportLCDetails" }, false, {
            flowType: 'LcDetails',
            lcAmendments: context.lcAmendments
          });
        }
      } else {
        switch (tabId) {
          case "Drawings":
            context.flowType = "GetAllExportDrawings";
            break;
          case "Amendments":
            context.flowType = "GetAllExportAmendments";
            break;
          default:
            context.flowType = this.view.flxExportLCSummary.isVisible ? "GetAllExportLettersOfCredit" : "NewlyReceivedExportLC";
            break;
        }
        this.view.ExportLCList.setContext({ flowType: context.flowType });
        this.view.ExportLCList.refreshComponent();
      }
    },
    showErrorMessage: function (errorObj) {
      var scope = this;
      if (errorObj) {
        scope.view.flxFormContent.setContentOffset({ x: "0%", y: "0%" }, true);
        scope.view.flxErrorMessage.setVisibility(true);
        scope.view.lblErrorMessage.text = errorObj.dbpErrMsg || errorObj.errmsg || errorObj.errorMessage;
        scope.view.forceLayout();
      } else {
        scope.view.flxErrorMessage.setVisibility(false);
      }
    },
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
        segWidget.selectedRowIndex = [0, 2];
        lblSelectedValue.text = segWidget.selectedRowItems[0].value;
        duration = segWidget.selectedRowItems[0].key;
      }
      flxList.height = (segmentData.length * 41 > 205) ? "205dp" : `${segmentData.length * 41}dp`;
    },
    toggleDropdown: function (flxSeg, lblIcon) {
      if (flxSeg.isVisible) {
        flxSeg.setVisibility(false);
        lblIcon.text = presenter.resourcesConstants.fontIcons.chevronDown;
      } else {
        flxSeg.setVisibility(true);
        lblIcon.text = presenter.resourcesConstants.fontIcons.chevronUp;
      }
    },
    segRowClick: function (segDropdown, lblSelectedValue, flxSegDropdown, lblDropdownIcon) {
      const selectedData = segDropdown.selectedRowItems[0];
      lblSelectedValue.text = selectedData.value;
      flxSegDropdown.setVisibility(false);
      lblDropdownIcon.text = presenter.resourcesConstants.fontIcons.chevronDown;
      if (segDropdown.id === 'segCurrencyFilter' || segDropdown.id === 'segDurationFilter') {
        this.setGraphData();
      }
    },
    initialiseColumnChart: function () {
      const options = {
        title: '',
        height: 200,
        width: (breakpoint >= 1380) ? 720 : (breakpoint >= 1366) ? 670 : 670,
        legend: { position: 'none' },
        isStacked: true,
        bar: { groupWidth: "45%" },
        vAxis: {
          gridlines: { color: "#F6F6F6" },
          viewWindow: { min: 0 },
          format: "short"
        },
        chartArea: { left: 40 }
      };
      let exportLCBarChart = new kony.ui.CustomWidget({
        "id": "ExportLCBarChart",
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
      this.view.flxBarGraph.add(exportLCBarChart);
    },
    setRecentLCData: function (lcData) {
      this.view.segRecentLC.widgetDataMap = {
        'lblKey1': 'lblKey1',
        'lblKey2': 'lblKey2',
        'lblKey3': 'lblKey3',
        'lblValue1': 'lblValue1',
        'lblValue2': 'lblValue2',
        'lblValue3': 'lblValue3',
        'btnAction': 'btnAction'
      };
      const recentLCData = (lcData && lcData.length > 0) ? lcData.slice(0, presenter.exportLCConfig.recentLCLimit) : [];
      let segRecentLCData = [];
      for (const record of recentLCData) {
        segRecentLCData.push({
          'lblKey1': kony.i18n.getLocalizedString('i18n.TradeFinance.lcRefWithColon'),
          'lblKey2': kony.i18n.getLocalizedString('i18n.TradeFinance.ApplicantWithColon'),
          'lblKey3': kony.i18n.getLocalizedString('i18n.serviceRequests.Status:'),
          'lblValue1': record.lcReferenceNo || NA,
          'lblValue2': record.applicant || NA,
          'lblValue3': record.status || NA,
          'btnAction': {
            'text': kony.i18n.getLocalizedString('i18n.common.ViewDetails'),
            'toolTip': kony.i18n.getLocalizedString('i18n.common.ViewDetails'),
            'onClick': () => presenter.showExportLCScreen({ context: 'viewExportLoC', data: record, form: this.view.id })
          }
        });
      }
      this.view.segRecentLC.setData(segRecentLCData);
    },
    resetForm: function () {
      this.view.lblExportLC.text = kony.i18n.getLocalizedString('i18n.ImportLC.ExportLC');
      this.view.flxErrorMessage.setVisibility(false);
      this.view.flxSuccess.setVisibility(false);
      this.view.flxCurrencyFilterList.setVisibility(false);
      this.view.lblCurrencyFilterDropdownIcon.text = presenter.resourcesConstants.fontIcons.chevronDown;
      this.view.flxDurationFilterList.setVisibility(false);
      this.view.lblDurationFilterDropdownIcon = presenter.resourcesConstants.fontIcons.chevronDown;
      this.view.flxExportLCSummary.setVisibility(true);
      this.view.flxActions.setVisibility(false);
      this.view.lblQuickLink2.text = `${kony.i18n.getLocalizedString('i18n.TradeFinance.newlyReceivedExportLc')} (0)`;
      this.view.lblQuickLinkTablet2.text = `${kony.i18n.getLocalizedString('i18n.TradeFinance.newlyReceivedExportLc')} (0)`;
    },
    constructGraphData: function (lcData) {
      newlyReceivedCount = 0;
      if (!lcData) return;
      const lcStatuses = {};
      scope_configManager.exportLCChartData.forEach(x => { Object.values(x.LCStatus).forEach(y => lcStatuses[y] = x.DisplayStatus) });
      exportLCGraphData = lcData.reduce(function (acc, obj) {
        if (obj.status === OLBConstants.EXPORT_LC_STATUS.NEW) newlyReceivedCount++;
        let date = new Date(obj.lcUpdatedOn).toDateString();
        if (!acc[obj.currency]) acc[obj.currency] = {};
        if (!acc[obj.currency][date]) acc[obj.currency][date] = {};
        if (!acc[obj.currency][date][obj.lcType]) acc[obj.currency][date][obj.lcType] = {
          totalAmount: 0,
          utilizedAmount: 0
        };
        acc[obj.currency][date][obj.lcType]['totalAmount'] += parseFloat(obj.amount || 0);
        acc[obj.currency][date][obj.lcType]['utilizedAmount'] += parseFloat(obj.utilizedLCAmount || 0);
        if (!acc[obj.currency][date][lcStatuses[obj.status]]) acc[obj.currency][date][lcStatuses[obj.status]] = {
          count: 0,
          amount: 0
        };
        acc[obj.currency][date][lcStatuses[obj.status]]['count']++;
        acc[obj.currency][date][lcStatuses[obj.status]]['amount'] += parseFloat(obj.amount || 0);
        return acc;
      }, {});
      this.view.lblQuickLink2.text = `${kony.i18n.getLocalizedString('i18n.TradeFinance.newlyReceivedExportLc')} (${newlyReceivedCount})`;
      this.view.lblQuickLinkTablet2.text = `${kony.i18n.getLocalizedString('i18n.TradeFinance.newlyReceivedExportLc')} (${newlyReceivedCount})`;
      this.setGraphData();
    },
    setGraphData: function () {
      currencyCode = this.view.segCurrencyFilter.selectedRowItems[0].key;
      currencySymbol = presenter.configurationManager.getCurrency(currencyCode);
      duration = this.view.segDurationFilter.selectedRowItems[0].key;
      let filteredData = {};
      scope_configManager.lcPaymentTerms.forEach(x => filteredData[x.type] = { colorCode: x.colorCode, totalAmount: 0, utilizedAmount: 0 });
      let filteredSummary = scope_configManager.exportLCChartData.reduce(function (acc, obj) {
        acc[obj.DisplayStatus] = { count: 0, amount: 0 };
        return acc;
      }, {});
      let graphData = [], date = new Date(), lcDate;
      for (let i = 0; i < duration; i++) {
        lcDate = date.toDateString();
        if (exportLCGraphData[currencyCode] && exportLCGraphData[currencyCode][lcDate]) {
          Object.keys(exportLCGraphData[currencyCode][lcDate]).forEach(key => {
            if (filteredData[key]) {
              filteredData[key]['utilizedAmount'] += exportLCGraphData[currencyCode][lcDate][key]['utilizedAmount'];
              filteredData[key]['totalAmount'] += exportLCGraphData[currencyCode][lcDate][key]['totalAmount'];
            }
            if (filteredSummary[key]) {
              filteredSummary[key]['count'] += exportLCGraphData[currencyCode][lcDate][key]['count'];
              filteredSummary[key]['amount'] += exportLCGraphData[currencyCode][lcDate][key]['amount'];
            }
          });
        }
        date.setDate(date.getDate() - 1);
      }
      this.view.lblCount1.text = `${filteredSummary['Pending Requests']['count']}`;
      this.view.lblAmount1.text = `${currencySymbol} ${presenter.formatUtilManager.formatAmount(filteredSummary['Pending Requests']['amount'])}`;
      this.view.lblCount2.text = `${filteredSummary['Approved']['count']}`;
      this.view.lblAmount2.text = `${currencySymbol} ${presenter.formatUtilManager.formatAmount(filteredSummary['Approved']['amount'])}`;
      this.view.lblCount3.text = `${filteredSummary['Settled']['count']}`;
      this.view.lblAmount3.text = `${currencySymbol} ${presenter.formatUtilManager.formatAmount(filteredSummary['Settled']['amount'])}`;
      this.view.lblCount4.text = `${filteredSummary['Rejected']['count']}`;
      this.view.lblAmount4.text = `${currencySymbol} ${presenter.formatUtilManager.formatAmount(filteredSummary['Rejected']['amount'])}`;
      for (let statusLabel = 1; statusLabel <= 4; statusLabel++) {
        if(this.view["lblAmount" + statusLabel].text.length > 13) {
          this.view["lblAmount" + statusLabel].skin = "bbSknLbl424242SSP15Px";
          this.view["lblAmount" + statusLabel].top = "10px";
        }
      }
      for (const lcType in filteredData) {
        let barData = {
          'categoryName': lcType,
          'budget1': 0,
          'budget1ColorCode': filteredData[lcType]['colorCode'],
          'budget1TooltipText': '',
          'budget2': 0,
          'budget2TooltipText': '',
          'budget2ColorCode': `color:${filteredData[lcType]['colorCode']};opacity:0.5`,
          'budget3': -1,
          'budget3ColorCode': '',
          'budget3TooltipText': ''
        };
        if (filteredData[lcType]) {
          barData.budget1 = filteredData[lcType]['utilizedAmount'];
          barData.budget2 = filteredData[lcType]['totalAmount'] - filteredData[lcType]['utilizedAmount'];
        }
        const tooltipText = `${lcType}\n`
          + `${kony.i18n.getLocalizedString('i18n.TradeFinance.totalLimit')}: ${currencySymbol}${formatter.format(filteredData[lcType]['totalAmount'])}\n`
          + `${kony.i18n.getLocalizedString('i18n.TradeFinance.available')}: ${currencySymbol}${formatter.format(barData.budget2)}\n`
          + `${kony.i18n.getLocalizedString('i18n.TradeFinance.utilized')}: ${currencySymbol}${formatter.format(barData.budget1)}`;
        barData.budget1TooltipText = tooltipText;
        barData.budget2TooltipText = tooltipText;
        graphData.push(barData);
      }
      this.view.flxBarGraph.ExportLCBarChart.chartData = graphData;
    },
    toggleCreateNewDrawingPopup: function (visibility) {
      breakpoint = kony.application.getCurrentBreakpoint();
      this.view.flxCreateNewDrawingPopup.setVisibility(visibility);
      if (breakpoint > 640 && breakpoint <= 1024) {
        this.view.flxCreateNewDrawingContainer.width = "90%";
      } else if (breakpoint === 1366 || breakpoint === 1380) {
        this.view.flxCreateNewDrawingContainer.width = "65%";
      }
      if (visibility) {
        FormControllerUtility.disableButton(this.view.CreateNewDrawing.btnCopyDetails);
        presenter.getExportLetterOfCredits({
          filterByParam: "status",
          filterByValue: OLBConstants.EXPORT_LC_STATUS.APPROVED,
          sortByParam: "lcUpdatedOn",
          sortOrder: "DESC"
        }, this.view.id);
      }
      this.view.forceLayout();
    },
    getSearchedRecords: function () {
      presenter.getExportLetterOfCredits({
        searchString: this.view.CreateNewDrawing.txtSearchBox.text,
        filterByParam: "status",
        filterByValue: OLBConstants.EXPORT_LC_STATUS.APPROVED,
        sortByParam: "lcUpdatedOn",
        sortOrder: "DESC"
      }, this.view.id);
    },
    viewLCDetails: function () {
      const data = this.view.CreateNewDrawing.getData();
      if (!data) return;
      this.toggleCreateNewDrawingPopup(false);
      presenter.showExportLCScreen({ context: 'viewExportLoC', data, form: this.view.id })
    },
    createNewDrawing: function () {
      const data = this.view.CreateNewDrawing.getData();
      this.toggleCreateNewDrawingPopup(false);
      presenter.navigationManager.navigateTo({ appName: "TradeFinanceMA", friendlyName: "frmExportLCCreateDrawings" }, false, data);
    },
    toggleNewlyReceivedExportLCView: function (visibility) {
      if (visibility) {
        this.view.lblExportLC.text = kony.i18n.getLocalizedString('i18n.TradeFinance.exportLcNewlyReceived');
        this.view.flxExportLCSummary.setVisibility(false);
        this.view.flxActions.setVisibility(true);
        this.view.ExportLCList.setContext({ flowType: 'NewlyReceivedExportLC' });
      } else {
        this.view.lblExportLC.text = kony.i18n.getLocalizedString('i18n.ImportLC.ExportLC');
        this.view.flxExportLCSummary.setVisibility(true);
        this.view.flxActions.setVisibility(false);
        this.view.ExportLCList.setContext({ flowType: 'GetAllExportLettersOfCredit' });
      }
      this.view.forceLayout();
      this.view.ExportLCList.refreshComponent();
    },
    /**
     * Method to show the error thrown by component
     * @return : NA
     */
    onError: function (err) {
      alert(JSON.stringify(err));
    }
  };
});