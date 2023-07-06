define(['./ExportLCStore', './ExportLCListBusinessController', 'ViewConstants', 'OLBConstants'], function (ExportLCStore, BusinessController, ViewConstants, OLBConstants) {
  let scope, isTablet;
  return {
    constructor: function (baseConfig, layoutConfig, pspConfig) {
      this._serviceParameters = {};
      this._dataFormatting = {};
      this._dataMapping = {};
      this._breakpoints = {};
      ExportLCStore.subscribe(this.render.bind(this));
      this.businessController = new BusinessController();
      this.store = ExportLCStore;
      this.collectionObj = ExportLCStore.getState();
      this.businessController.store = this.store;
      this.context = {};
      this.segFilter1Data = [];
      this.segFilter2Data = [];
      this.segFilter3Data = [];
      this.isFilterApplied = false;
      this.currentTab = "LettersOfCredit";
      this.segUIConditionalMapping = {
        "segTemplates": {
        }
      };
      this.sortFields = {
        "imgColumn1Tab1": "applicant",
        "imgColumn2Tab1": "lcReferenceNo",
        "imgColumn3Tab1": "lcType",
        "imgColumn4Tab1": "lcUpdatedOn",
        "imgColumn5Tab1": "amount",
        "imgColumn6Tab1": "status",
        "imgColumn1Tab2": "applicant",
        "imgColumn2Tab2": "lcReferenceNo",
        "imgColumn3Tab2": "lcAmount",
        "imgColumn4Tab2": "drawingCreatedDate",
        "imgColumn5Tab2": "status",
        "imgColumn1Tab3": "applicantName",
        "imgColumn2Tab3": "exportlcReferenceNo",
        "imgColumn3Tab3": "lcType",
        "imgColumn4Tab3": "amendmentReceivedDate",
        "imgColumn5Tab3": "amendmentNo",
        "imgColumn6Tab3": "amendmentStatus"
      };
      this.isFilterSubHeaderToggled = false;
    },

    initGettersSetters: function () {
      defineGetter(this, 'dataMapping', () => {
        return this._dataMapping;
      });
      defineSetter(this, 'dataMapping', value => {
        this._dataMapping = value;
      });
      defineGetter(this, 'dataFormatting', () => {
        return this._dataFormatting;
      });
      defineSetter(this, 'dataFormatting', value => {
        this._dataFormatting = value;
      });
      defineGetter(this, 'conditionalMappingKey', () => {
        return this._conditionalMappingKey;
      });
      defineSetter(this, 'conditionalMappingKey', value => {
        this._conditionalMappingKey = value;
      });
      defineGetter(this, 'conditionalMapping', () => {
        return this._conditionalMapping;
      });
      defineSetter(this, 'conditionalMapping', value => {
        this._conditionalMapping = value;
      });
      defineGetter(this, 'breakpoints', () => {
        return this._breakpoints;
      });
      defineSetter(this, 'breakpoints', value => {
        this._breakpoints = value;
      });
      defineGetter(this, 'serviceParameters', () => {
        return this._serviceParameters;
      });
      defineSetter(this, 'serviceParameters', value => {
        this._serviceParameters = value;
      });
    },
    /**
     * @api : preShow
     * Gets invoked initially before rendering of UI
     * @return : NA
     */
    preShow: function () {
      scope = this;
      try {
        scope.businessController.setProperties(this._serviceParameters, this._dataMapping, this._dataFormatting);
        scope.businessController.getMetaDataForAllObjects();
        this.initActions();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "preShow",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : postShow
     * Gets invoked initially after rendering of UI
     * @return : NA
     */
    postShow: function () {
      scope = this;
      try {
        scope.setFilterWidgetDataMap();
        scope.setComponentUIText();
        scope.refreshComponent();
        scope.moreActionSegDataMapping();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "postShow",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : initActions
     * Method to initialise the component actions
     * @return : NA
     */
    initActions: function () {
      scope = this;
      try {
        this.view.onClick = scope.hideFilterDropDown.bind(this);
        this.view.flxVerticalEllipsis.onClick = () => scope.view.flxEllipsisDropDown.setVisibility(!scope.view.flxEllipsisDropDown.isVisible);
        this.view.btnLOC.onClick = this.onTabClick.bind(this, "LettersOfCredit");
        this.view.btnDrawings.onClick = this.onTabClick.bind(this, "Drawings");
        this.view.btnAmendments.onClick = this.onTabClick.bind(this, "Amendments");
        this.view.btnApply.onClick = this.applyFilters;
        this.view.btnCancel.onClick = this.cancelFilters;
        this.view.flxDropDown.onClick = this.toggleFilterDropDownVisibility;
        this.view.tbxSearch.onDone = this.fetchDashboardData;
        this.view.tbxSearch.onTextChange = function () {
          this.view.lblClearIcon.setVisibility(this.view.tbxSearch.text !== "");
        }.bind(this);
        this.view.lblClearIcon.onTouchEnd = function () {
          this.view.tbxSearch.text = "";
          this.view.lblClearIcon.setVisibility(false);
          this.fetchDashboardData();
        }.bind(this);
        scope.view.tbxSearch.onBeginEditing = function () {
          scope.view.flxSearch.skin = "ICSknFlxffffffBorder003e751pxRadius3px";
        };
        scope.view.tbxSearch.onEndEditing = function () {
          scope.view.flxSearch.skin = "ICSknFlxffffffBordere3e3e31pxRadius3px";
        };
        for (let i = 1; i <= 3; i++) {
          scope.view['lblDropdownFilter' + i].onTouchEnd = scope.onClickFilterSubHeader.bind(this, i);
        }
        for (let i = 1; i <= 3; i++) {
          for (let j = 1; j <= 6; j++) {
            if (!this.view['imgColumn' + j + 'Tab' + i]) continue;
            this.view['imgColumn' + j + 'Tab' + i].onTouchStart = this.toggleSortIcon.bind(this, 'imgColumn' + j + 'Tab' + i);
          }
        }
      } catch (err) {
        var errorObj =
        {
          "level": "ComponentController",
          "method": "initActions",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : setContext
     * Method to set form level properties to component
     * @return : NA
     */
    setContext: function (context) {
      scope = this;
      try {
        const breakpoint = kony.application.getCurrentBreakpoint();
        isTablet = (breakpoint > 640 && breakpoint <= 1024) ? true : false;
        scope.context = context;
      } catch (err) {
        var errorObj =
        {
          "level": "ComponentController",
          "method": "SetContext",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    setComponentUIText: function () {
      let scope = this;
      try {
        for (let i = 1; i <= 3; i++) {
          for (let j = 1; j <= 7; j++) {
            if (!this.view['lblColumn' + j + 'Tab' + i]) continue;
            this.view['lblColumn' + j + 'Tab' + i].text = this.businessController.getDataBasedOnDataMapping('lblColumn' + j + 'Tab' + i);
          }
        }

        this.view.btnLOC.text = this.businessController.getDataBasedOnDataMapping('btnLOC');
        this.view.btnLOC.toolTip = this.view.btnLOC.text;
        this.view.btnDrawings.text = this.businessController.getDataBasedOnDataMapping('btnDrawings');
        this.view.btnDrawings.toolTip = this.view.btnDrawings.text;
        this.view.btnAmendments.text = this.businessController.getDataBasedOnDataMapping('btnAmendments');
        this.view.btnAmendments.toolTip = this.view.btnAmendments.text;
        this.view.btnApply.text = this.businessController.getDataBasedOnDataMapping('btnApply');
        this.view.btnApply.toolTip = this.view.btnApply.text;
        this.view.btnCancel.text = this.businessController.getDataBasedOnDataMapping('btnCancel');
        this.view.btnCancel.toolTip = this.view.btnCancel.text;
        scope.view.lblClearIcon.cursorType = "pointer";
        scope.view.lblDropdownFilterIcon.cursorType = "pointer";
        scope.view.lblDropdownFilter1.cursorType = "pointer";
        scope.view.lblDropdownFilter2.cursorType = "pointer";
        scope.view.lblDropdownFilter3.cursorType = "pointer";
        scope.view.lblVerticalEllipsis.cursorType = "pointer";
        this.view.tbxSearch.placeholder = kony.i18n.getLocalizedString("i18n.TradeFinance.searchForApplicantLCRef");
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setComponentUIText",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
      * @api : hideFilterDropDown
      * Hides the filter drop down
      * @return : NA
      */
    hideFilterDropDown: function () {
      scope = this;
      try {
        if (scope.view.flxListDropdown.isVisible === true && !scope.isFilterSubHeaderToggled) {
          scope.view.flxListDropdown.setVisibility(false);
          scope.view.lblDropdownFilterIcon.text = "O";
        }
        scope.isFilterSubHeaderToggled = false;
      }
      catch (err) {
        var errorObj =
        {
          "level": "ComponentController",
          "method": "hideFilterDropDown",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : onClickFilterSubHeader
    * Invoked on dropdown click on filter
    * @return : NA
    */
    onClickFilterSubHeader: function (idx) {
      scope = this;
      try {
        scope.isFilterSubHeaderToggled = true;
        if (scope.view['lblDropdownFilter' + idx].text === "O") {
          scope.view['lblDropdownFilter' + idx].text = "P";
          scope.view['segFilter' + idx].setVisibility(true);
        } else {
          scope.view['lblDropdownFilter' + idx].text = "O";
          scope.view['segFilter' + idx].setVisibility(false);
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "onClickFilterSubHeader",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
      * @api : getSegmentData
      * This method is used to get the segment data 
      * @return : NA
      */
    getSegmentData: function (exportLCData) {
      scope = this;
      try {
        const NA = kony.i18n.getLocalizedString("i18n.common.NA");
        let template = "", segData = [];
        if (isTablet) {
          if (this.currentTab === "Drawings") {
            template = "flxTempExportLCList4";
            for (const record of exportLCData) {
              segData.push(Object.assign(record, {
                "lblDropdown": "O",
                "flxTempExportLCList4": {
                  "height": "40dp",
                  "skin": "sknflxffffffnoborder"
                },
                "lblIdentifier": {
                  "skin": "sknffffff15pxolbfonticons"
                },
                "flxIdentifier": {
                  "skin": "sknFlxIdentifier"
                },
                "flxDropdown": {
                  "onClick": this.handleSegmentRowView.bind(this)
                },
                "lblColumn1": record.applicant || NA,
                "lblColumn2": record.drawingCreatedDateFormatted || NA,
                "lblColumn3": record.status || NA,
                "template": template,
                "lblRowColumn1Key": kony.i18n.getLocalizedString("i18n.TradeFinance.AdvisingLCRefNo"),
                "lblRowColumn2Key": kony.i18n.getLocalizedString("i18n.TradeFinance.DrawingReference"),
                "lblRowColumn3Key": kony.i18n.getLocalizedString("i18n.wealth.amount"),
                "lblRow2Column1Key": kony.i18n.getLocalizedString("i18n.TradeFinance.MessageToBankDrawings"),
                "lblRow2Column2Key": kony.i18n.getLocalizedString("i18n.TradeFinance.DocStatus"),
                "lblRow2Column3Key": kony.i18n.getLocalizedString("i18n.common.Currency"),
                "lblRowColumn1Value": record.lcReferenceNo || NA,
                "lblRowColumn2Value": record.drawingReferenceNo || NA,
                "lblRowColumn3Value": record.drawingAmountFormatted,
                "lblRow2Column1Value": record.messageToBank || NA,
                "lblRow2Column2Value": record.documentStatus || NA,
                "lblRow2Column3Value": record.currency || NA,
                "btnAction": {
                  "text": record.status === OLBConstants.EXPORT_DRAWING_STATUS.DRAFT ? kony.i18n.getLocalizedString("i18n.ImportLC.ContinueEditing") : kony.i18n.getLocalizedString("i18n.common.ViewDetails"),
                  "toolTip": record.status === OLBConstants.EXPORT_DRAWING_STATUS.DRAFT ? kony.i18n.getLocalizedString("i18n.ImportLC.ContinueEditing") : kony.i18n.getLocalizedString("i18n.common.ViewDetails"),
                  "onClick": function () {
                    scope.btnId = 'ViewDetails';
                    scope.businessController.getExportDrawingSummary(record);
                  }
                },
                "btnAction1": {
                  "text": kony.i18n.getLocalizedString("i18n.common.Download"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.common.Download"),
                  "onClick": function () {
                    scope.businessController.generateExportLC("DownloadDrawings", {
                      drawingReferenceNo: record.drawingReferenceNo
                    }, "Export Drawing");
                  }
                },
                "btnAction2": {
                  "text": kony.i18n.getLocalizedString("i18n.accounts.print"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.accounts.print"),
                  "onClick": function () {
                    scope.btnId = 'Print';
                    scope.businessController.getExportDrawingSummary(record);
                  }
                }
              }));
            }
          } else if (this.currentTab === "Amendments") {
            template = "flxExportAmendmentListTablet";
            for (const record of exportLCData) {
              segData.push(Object.assign(record, {
                "flxExportAmendmentListTablet": {
                  "height": "40dp",
                  "skin": "sknflxffffffnoborder"
                },
                "lblDropdown": "O",
                "flxDropdown": {
                  "onClick": this.handleSegmentRowView.bind(this)
                },
                "flxIdentifier": {
                  "skin": "sknFlxIdentifier"
                },
                "lblIdentifier": {
                  "skin": "sknffffff15pxolbfonticons"
                },
                "template": template,
                "lblColumn1": record.applicantName || NA,
                "lblColumn2": record.exportlcReferenceNo || NA,
                "lblColumn3": record.amendmentReceivedDateFormatted || NA,
                "lblColumn4": record.amendmentStatus || NA,
                "lblRowColumn1Key": kony.i18n.getLocalizedString("i18n.ImportLC.LCType"),
                "lblRowColumn1Value": record.lcType || NA,
                "lblRowColumn2Key": kony.i18n.getLocalizedString("i18n.TradeFinance.IssueDate"),
                "lblRowColumn2Value": record.lcIssueDateFormatted || NA,
                "lblRowColumn3Key": kony.i18n.getLocalizedString("i18n.ImportLC.ExpiryDate"),
                "lblRowColumn3Value": record.lcExpiryDateFormatted || NA,
                "lblRowColumn4Key": kony.i18n.getLocalizedString("i18n.TradeFinance.AmendmentNoWithDot"),
                "lblRowColumn4Value": record.amendmentNo || NA,
                "lblRow2Column1Key": kony.i18n.getLocalizedString("i18n.TradeFinance.AmendmentReference"),
                "lblRow2Column1Value": record.amendmentReferenceNo || NA,
                "btnAction": {
                  "text": kony.i18n.getLocalizedString("i18n.common.ViewDetails"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.common.ViewDetails"),
                  "onClick": function () {
                    scope.btnId = 'ViewDetails';
                    scope.businessController.getExportAmendmentSummary(record.exportlcSRMSRequestId, record.amendmentSRMSRequestId);
                  }
                },
                "btnAction1": {
                  "text": kony.i18n.getLocalizedString("i18n.common.Download"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.common.Download"),
                  "onClick": function () {
                    scope.businessController.generateExportLC("DownloadAmendments", {
                      amendmentReferenceNo: record.amendmentSRMSRequestId
                    }, "Export LC Amendment");
                  }
                },
                "btnAction2": {
                  "text": kony.i18n.getLocalizedString("i18n.accounts.print"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.accounts.print"),
                  "onClick": function () {
                    scope.btnId = 'Print';
                    scope.businessController.getExportAmendmentSummary(record.exportlcSRMSRequestId, record.amendmentSRMSRequestId);
                  }
                }
              }))
            }
          } else {
            template = "flxTempExportLCList3";
            for (const record of exportLCData) {
              segData.push(Object.assign(record, {
                "lblDropdown": "O",
                "flxTempExportLCList3": {
                  "height": "40dp",
                  "skin": "sknflxffffffnoborder"
                },
                "lblIdentifier": {
                  "skin": "sknffffff15pxolbfonticons"
                },
                "flxIdentifier": {
                  "skin": "sknFlxIdentifier"
                },
                "flxDropdown": {
                  "onClick": this.handleSegmentRowView.bind(this)
                },
                "lblColumn1": record.applicant || NA,
                "lblColumn2": record.lcReferenceNo || NA,
                "lblColumn3": record.lcUpdatedOnFormatted || NA,
                "lblColumn4": record.status || NA,
                "template": template,
                "lblRowColumn1Key": kony.i18n.getLocalizedString("i18n.ImportLC.LCType"),
                "lblRowColumn2Key": kony.i18n.getLocalizedString("i18n.wealth.amount"),
                "lblRowColumn3Key": kony.i18n.getLocalizedString("i18n.TradeFinance.IssuingBank"),
                "lblRowColumn4Key": kony.i18n.getLocalizedString("i18n.TradeFinance.IssueDate"),
                "lblRow2Column1Key": kony.i18n.getLocalizedString("i18n.TradeFinance.ExpiryDate"),
                "lblRow2Column2Key": kony.i18n.getLocalizedString("i18n.TradeFinance.AmendLatestShipmentDate"),
                "lblRowColumn1Value": record.lcType || NA,
                "lblRowColumn2Value": record.amountFormatted || NA,
                "lblRowColumn3Value": record.issuingBank || NA,
                "lblRowColumn4Value": record.issueDateFormatted || NA,
                "lblRow2Column1Value": record.expiryDateFormatted || NA,
                "lblRow2Column2Value": record.latestShipmentDateFormatted || NA,
                "btnAction": {
                  "text": kony.i18n.getLocalizedString("i18n.common.ViewDetails"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.common.ViewDetails"),
                  "onClick": function () {
                    scope.btnId = 'ViewDetails';
                    applicationManager.getModulesPresentationController({ appName: 'TradeFinanceMA', moduleName: 'ExportLCUIModule' }).showExportLCScreen({ context: 'viewExportLoC', data: { exportLCId: record.exportLCId }, form: 'frmExportLCDashboard' });
                  }
                },
                "btnAction1": {
                  "text": kony.i18n.getLocalizedString("i18n.common.Download"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.common.Download"),
                  "onClick": function () {
                    scope.businessController.generateExportLC("DownloadLOC", {
                      exportLCId: record.exportLCId
                    }, "Export Letter Of Credit");
                  }
                },
                "btnAction2": {
                  "text": kony.i18n.getLocalizedString("i18n.accounts.print"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.accounts.print"),
                  "onClick": function () {
                    scope.btnId = 'Print',
                      scope.businessController.getExportLCSummary(record)
                  }
                },
                "btnAction3": {
                  "isVisible": record.status === OLBConstants.EXPORT_LC_STATUS.APPROVED,
                  "text": kony.i18n.getLocalizedString("i18n.TradeFinance.CreateNewDrawing"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.TradeFinance.CreateNewDrawing"),
                  "onClick": function () {
                    applicationManager.getNavigationManager().navigateTo({ appName: "TradeFinanceMA", friendlyName: "frmExportLCCreateDrawings" }, false, record);
                  }
                }
              }));
            }
          }
        } else {
          if (this.currentTab === "Drawings") {
            template = "flxTempExportLCList2";
            for (const record of exportLCData) {
              segData.push(Object.assign(record, {
                "lblDropdown": "O",
                "flxTempExportLCList2": {
                  "height": "40dp",
                  "skin": "sknflxffffffnoborder"
                },
                "lblIdentifier": {
                  "skin": "sknffffff15pxolbfonticons"
                },
                "flxIdentifier": {
                  "skin": "sknFlxIdentifier"
                },
                "flxDropdown": {
                  "onClick": this.handleSegmentRowView.bind(this)
                },
                "lblColumn1": record.applicant || NA,
                "lblColumn2": record.drawingReferenceNo || NA,
                "lblColumn3": record.drawingAmountFormatted || NA,
                "lblColumn4": record.drawingCreatedDateFormatted || NA,
                "lblColumn5": record.status || NA,
                "template": template,
                "lblRowColumn1Key": kony.i18n.getLocalizedString("i18n.TradeFinance.AdvisingLCRefNo"),
                "lblRowColumn2Key": kony.i18n.getLocalizedString("i18n.ImportLC.LCType"),
                "lblRowColumn3Key": kony.i18n.getLocalizedString("i18n.TradeFinance.DocStatus"),
                "lblRowColumn4Key": kony.i18n.getLocalizedString("i18n.common.Currency"),
                "lblRow2Column1Key": kony.i18n.getLocalizedString("i18n.TradeFinance.MessageToBankDrawings"),
                "lblRowColumn1Value": record.lcReferenceNo || NA,
                "lblRowColumn2Value": record.lcType || NA,
                "lblRowColumn3Value": record.documentStatus || NA,
                "lblRowColumn4Value": record.currency || NA,
                "lblRow2Column1Value": record.messageToBank || NA,
                "btnAction": {
                  "text": record.status === OLBConstants.EXPORT_DRAWING_STATUS.DRAFT ? kony.i18n.getLocalizedString("i18n.ImportLC.ContinueEditing") : kony.i18n.getLocalizedString("i18n.common.ViewDetails"),
                  "toolTip": record.status === OLBConstants.EXPORT_DRAWING_STATUS.DRAFT ? kony.i18n.getLocalizedString("i18n.ImportLC.ContinueEditing") : kony.i18n.getLocalizedString("i18n.common.ViewDetails"),
                  "onClick": function () {
                    scope.btnId = 'ViewDetails';
                    scope.businessController.getExportDrawingSummary(record);
                  }
                },
                "btnAction1": {
                  "text": kony.i18n.getLocalizedString("i18n.common.Download"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.common.Download"),
                  "onClick": function () {
                    scope.businessController.generateExportLC("DownloadDrawings", {
                      drawingReferenceNo: record.drawingReferenceNo
                    }, "Export Drawing");
                  }
                },
                "btnAction2": {
                  "text": kony.i18n.getLocalizedString("i18n.accounts.print"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.accounts.print"),
                  "onClick": function () {
                    scope.btnId = 'Print';
                    scope.businessController.getExportDrawingSummary(record);
                  }
                }
              }));
            }
          } else if (this.currentTab === "Amendments") {
            template = "flxExportAmendmentList";
            for (const record of exportLCData) {
              segData.push(Object.assign(record, {
                "flxExportAmendmentList": {
                  "height": "40dp",
                  "skin": "sknflxffffffnoborder"
                },
                "lblDropdown": "O",
                "flxDropdown": {
                  "onClick": this.handleSegmentRowView.bind(this)
                },
                "flxIdentifier": {
                  "skin": "sknFlxIdentifier"
                },
                "lblIdentifier": {
                  "skin": "sknffffff15pxolbfonticons"
                },
                "template": template,
                "lblColumn1": record.applicantName || NA,
                "lblColumn2": record.exportlcReferenceNo || NA,
                "lblColumn3": record.lcType || NA,
                "lblColumn4": record.amendmentReceivedDateFormatted || NA,
                "lblColumn5": record.amendmentNo || NA,
                "lblColumn6": record.amendmentStatus || NA,
                "lblRowColumn1Key": kony.i18n.getLocalizedString("i18n.TradeFinance.IssueDate"),
                "lblRowColumn1Value": record.lcIssueDateFormatted || NA,
                "lblRowColumn2Key": kony.i18n.getLocalizedString("i18n.ImportLC.ExpiryDate"),
                "lblRowColumn2Value": record.lcExpiryDateFormatted || NA,
                "lblRowColumn3Key": kony.i18n.getLocalizedString("i18n.TradeFinance.AmendmentReference"),
                "lblRowColumn3Value": record.amendmentReferenceNo || NA,
                "btnAction": {
                  "text": kony.i18n.getLocalizedString("i18n.common.ViewDetails"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.common.ViewDetails"),
                  "onClick": function () {
                    scope.btnId = 'ViewDetails';
                    scope.businessController.getExportAmendmentSummary(record.exportlcSRMSRequestId, record.amendmentSRMSRequestId);
                  }
                },
                "btnAction1": {
                  "text": kony.i18n.getLocalizedString("i18n.common.Download"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.common.Download"),
                  "onClick": function () {
                    scope.businessController.generateExportLC("DownloadAmendments", {
                      amendmentReferenceNo: record.amendmentReferenceNo
                    }, "Export Amenment");
                  }
                },
                "btnAction2": {
                  "text": kony.i18n.getLocalizedString("i18n.accounts.print"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.accounts.print"),
                  "onClick": function () {
                    scope.btnId = 'Print';
                    scope.businessController.getExportAmendmentSummary(record.exportlcSRMSRequestId, record.amendmentSRMSRequestId);
                  }
                }
              }))
            }
          } else {
            template = "flxTempExportLCList1";
            for (const record of exportLCData) {
              segData.push(Object.assign(record, {
                "lblDropdown": "O",
                "flxTempExportLCList1": {
                  "height": "40dp",
                  "skin": "sknflxffffffnoborder"
                },
                "lblIdentifier": {
                  "skin": "sknffffff15pxolbfonticons"
                },
                "flxIdentifier": {
                  "skin": "sknFlxIdentifier"
                },
                "flxDropdown": {
                  "onClick": this.handleSegmentRowView.bind(this)
                },
                "lblColumn1": record.applicant || NA,
                "lblColumn2": record.lcReferenceNo || NA,
                "lblColumn3": record.lcType || NA,
                "lblColumn4": record.lcUpdatedOnFormatted || NA,
                "lblColumn5": record.amountFormatted || NA,
                "lblColumn6": record.status || NA,
                "template": template,
                "lblRowColumn1Key": kony.i18n.getLocalizedString("i18n.TradeFinance.IssuingBank"),
                "lblRowColumn2Key": kony.i18n.getLocalizedString("i18n.TradeFinance.IssueDate"),
                "lblRowColumn3Key": kony.i18n.getLocalizedString("i18n.ImportLC.ExpiryDate"),
                "lblRowColumn4Key": kony.i18n.getLocalizedString("i18n.TradeFinance.AmendLatestShipmentDate"),
                "lblRowColumn1Value": record.issuingBank || NA,
                "lblRowColumn2Value": record.issueDateFormatted || NA,
                "lblRowColumn3Value": record.expiryDateFormatted || NA,
                "lblRowColumn4Value": record.latestShipmentDateFormatted || NA,
                "btnAction": {
                  "text": kony.i18n.getLocalizedString("i18n.common.ViewDetails"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.common.ViewDetails"),
                  "onClick": function () {
                    scope.btnId = 'ViewDetails';
                    applicationManager.getModulesPresentationController({ appName: 'TradeFinanceMA', moduleName: 'ExportLCUIModule' }).showExportLCScreen({ context: 'viewExportLoC', data: { exportLCId: record.exportLCId }, form: 'frmExportLCDashboard' });
                  }
                },
                "btnAction1": {
                  "text": kony.i18n.getLocalizedString("i18n.common.Download"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.common.Download"),
                  "onClick": function () {
                    scope.businessController.generateExportLC("DownloadLOC", {
                      exportLCId: record.exportLCId
                    }, "Export Letter Of Credit");
                  }
                },
                "btnAction2": {
                  "text": kony.i18n.getLocalizedString("i18n.accounts.print"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.accounts.print"),
                  "onClick": function () {
                    scope.btnId = 'Print',
                      scope.businessController.getExportLCSummary(record);
                  }
                },
                "btnAction3": {
                  "isVisible": record.status === OLBConstants.EXPORT_LC_STATUS.APPROVED,
                  "text": kony.i18n.getLocalizedString("i18n.TradeFinance.CreateNewDrawing"),
                  "toolTip": kony.i18n.getLocalizedString("i18n.TradeFinance.CreateNewDrawing"),
                  "onClick": function () {
                    applicationManager.getNavigationManager().navigateTo({ appName: "TradeFinanceMA", friendlyName: "frmExportLCCreateDrawings" }, false, record);
                  }
                }
              }));
            }
          }
        }
        return segData;
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "getSegmentData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
      * @api : fetchDashboardData
      * This method will invoked to fetch the dashboard data 
      * @return : NA
      */
    fetchDashboardData: function (params) {
      try {
        scope = this;
        if (params !== 'pagination' && params !== "sort") {
          scope.view.PaginationContainer.setLowerLimit(1);
          scope.view.PaginationContainer.setPageSize(10);
          scope.view.PaginationContainer.setIntervalHeader();
        }
        scope.businessController.storeInCollection({
          searchString: this.view.tbxSearch.text,
          pageOffset: (params === "pagination" || params === "sort") ? this.view.PaginationContainer.getPageOffset() : 0
        });
        if (this.currentTab === "Drawings") {
          scope.businessController.fetchExportLCData("GetExportDrawings");
        } else if (this.currentTab === "Amendments") {
          scope.businessController.fetchExportLCData("GetExportAmendments");
        } else {
          scope.businessController.fetchExportLCData("GetExportLetterOfCredits");
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "fetchDashboardData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
      * @api : setDashboardData
      * This method will invoked to set dashboard data 
      * @return : NA
      */
    setDashboardData: function () {
      try {
        let exportLCData = JSON.parse(JSON.stringify(this.collectionObj.Collection.ExportLetterOfCredit || []));
        this.previousIndex = undefined;
        if (exportLCData && exportLCData.length > 0) {
          this.view.flxTransactionList.setVisibility(true);
          this.view.flxNoTransactions.setVisibility(false);
          this.view.flxPagination.setVisibility(true);
        } else {
          this.view.flxTransactionList.setVisibility(false);
          this.view.flxNoTransactions.setVisibility(true);
          this.view.flxPagination.setVisibility(false);
          return;
        }
        const offset = this.view.PaginationContainer.getPageOffset();
        if (offset === 0) {
          this.view.flxPagination.PaginationContainer.imgPaginationPrevious.src = ViewConstants.IMAGES.PAGINATION_BACK_INACTIVE;
        } else {
          this.view.flxPagination.PaginationContainer.imgPaginationPrevious.src = ViewConstants.IMAGES.PAGINATION_BACK_ACTIVE;
        }
        if (exportLCData.length > 10) {
          this.view.flxPagination.PaginationContainer.imgPaginationNext.src = "pagination_next_active_container.png";
        } else {
          this.view.flxPagination.PaginationContainer.imgPaginationNext.src = "pagination_next_inactive.png";
        }
        this.view.flxPagination.PaginationContainer.imgPaginationPrevious.imageScaleMode = constants.IMAGE_SCALE_MODE_FIT_TO_DIMENSIONS;
        this.view.flxPagination.PaginationContainer.imgPaginationNext.imageScaleMode = constants.IMAGE_SCALE_MODE_FIT_TO_DIMENSIONS;
        const segData = this.getSegmentData(exportLCData.splice(0, 10));
        this.view.segTemplates.setData(segData);
        this.hideFilterDropDown();
        this.view.forceLayout();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setDashboardData",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
      * @api : cancelFilters
      * This metod will invoked on cancel of filters
      * @return : NA
      */
    cancelFilters: function () {
      scope = this;
      try {
        scope.view.flxListDropdown.setVisibility(false);
        scope.view.lblDropdownFilterIcon.text = "O";
      }
      catch (err) {
        var errorObj =
        {
          "level": "ComponentController",
          "method": "cancelFilters",
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
      scope = this;
      try {
        let filterByValue = [];
        let filterByParam = [];
        let timeValue = "";
        let selectedFilterCount = 0;
        for (var i = 1; i < scope.view.segFilter1.data.length; i++) {
          if (scope.view.segFilter1.data[i].lblIcon.text === "C") {
            filterByValue.push(scope.view.segFilter1.data[i].lblFilterValue.text);
            filterByParam.push("lcType");
            selectedFilterCount++;
          }
        }
        for (var i = 1; i < scope.view.segFilter2.data.length; i++) {
          if (scope.view.segFilter2.data[i].lblIcon.text === "C") {
            filterByValue.push(scope.view.segFilter2.data[i].lblFilterValue.text);
            filterByParam.push(this.currentTab === "Amendments" ? "amendmentStatus" : "status");
            selectedFilterCount++;
          }
        }
        for (var i = 0; i < scope.view.segFilter3.data.length; i++) {
          if (scope.view.segFilter3.data[i].lblIcon.text === "M") {
            switch (scope.view.segFilter3.data[i].lblFilterValue.text) {
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
        scope.view.flxListDropdown.setVisibility(false);
        scope.view.lblDropdownFilterIcon.text = "O";
        scope.segFilter1Data = scope.view.segFilter1.data;
        scope.segFilter2Data = scope.view.segFilter2.data;
        scope.segFilter3Data = scope.view.segFilter3.data;
        if (scope.segFilter1Data[0].lblIcon.text === "C" && scope.segFilter2Data[0].lblIcon.text === "C") {
          scope.view.lblFilterText.text = kony.i18n.getLocalizedString("i18n.konybb.Common.All");
        } else {
          scope.view.lblFilterText.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.Selected") + "(" + selectedFilterCount + ")";
        }
        scope.view.forceLayout();
        scope.businessController.storeInCollection({
          filterByValue: filterByValue.join(','),
          filterByParam: filterByParam.join(','),
          timeValue,
          timeParam: this.currentTab === "Drawings" ? "drawingCreatedDate" : this.currentTab === "Amendments" ? "amendmentReceivedDate" : "lcUpdatedOn",
        });
        scope.fetchDashboardData();
      } catch (err) {
        var errorObj =
        {
          "level": "ComponentController",
          "method": "applyFilters",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
      * @api : render
      * This method will be invoked when collection is updated.
      * @return : NA
      */
    render: function () {
      scope = this;
      try {
        scope.collectionObj = ExportLCStore.getState();
        if (!kony.sdk.isNullOrUndefined(scope.collectionObj.Collection.download) && scope.collectionObj.Collection.download.isDownloadComplete)
          scope.view.flxEllipsisDropDown.setVisibility(false);
        if (scope.collectionObj && scope.collectionObj.Collection && scope.collectionObj.Collection.ExportLetterOfCredit && scope.collectionObj.Collection.ExportLetterOfCredit.length > 0) {
          scope.view.flxVerticalEllipsis.setVisibility(true);
        }
        else {
          scope.view.flxVerticalEllipsis.setVisibility(false);
        }
        if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection["ErrorDetails"])) {
          scope.showErrorMessage(scope.collectionObj.Collection.ErrorDetails);
          scope.businessController.resetCollection("ErrorDetails");
        } else if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection['ExportLCSummary'])) {
          scope.viewExportLCDetails(scope.collectionObj.Collection.ExportLCSummary);
          scope.businessController.resetCollection("ExportLCSummary");
        } else if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection['ExportDrawingSummary'])) {
          scope.viewOrPrintExportDrawingDetails(scope.collectionObj.Collection.ExportDrawingSummary);
          scope.businessController.resetCollection("ExportDrawingSummary");
        } else if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection['ExportLcAmendmentsSummary'])) {
          scope.viewExportLCDetails(scope.collectionObj.Collection.ExportLcAmendmentsSummary);
          scope.businessController.resetCollection("ExportLcAmendmentsSummary");
        } else if (!scope.isEmptyNullOrUndefined(scope.collectionObj.Collection['ExportAmendmentSummary'])) {
          scope.viewOrPrintExportAmendmentDetails(scope.collectionObj.Collection.ExportAmendmentSummary);
          scope.businessController.resetCollection("ExportAmendmentSummary");
        } else {
          this.setDashboardData();
        }
      } catch (err) {
        var errorObj =
        {
          "level": "ComponentController",
          "method": "render",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
      * @api : setFilterDropdownData
      * Widget data mapping for filter dropdown
      * @return : NA
      */
    setFilterDropdownData: function () {
      scope = this;
      try {
        scope.segFilter1Data = [];
        scope.segFilter2Data = [];
        scope.segFilter3Data = [];
        let lcTypes = ['Select All'].concat(Object.values(OLBConstants['LC_PAYMENT_TERM']));
        lcTypes.forEach(lcType => {
          scope.segFilter1Data.push({
            lblFilterValue: {
              text: lcType,
              isVisible: true
            },
            lblIcon: {
              text: "C",
              isVisible: true,
              cursorType: "pointer"
            }
          });
        });
        let statusTypes = [];
        if (this.currentTab === "LettersOfCredit") {
          statusTypes = ['Select All'].concat(Object.values(OLBConstants['EXPORT_LC_STATUS']));
        } else if (this.currentTab === "Drawings") {
          statusTypes = ['Select All'].concat(Object.values(OLBConstants['EXPORT_DRAWING_STATUS']));
        } else {
          statusTypes = ['Select All'].concat(Object.values(OLBConstants['EXPORT_AMENDMENT_STATUS']));
        }
        statusTypes.forEach(statusType => {
          scope.segFilter2Data.push({
            lblFilterValue: {
              text: statusType,
              isVisible: true
            },
            lblIcon: {
              text: "C",
              isVisible: true,
              cursorType: "pointer"
            }
          });
        });
        const timePeriodTypes = ['Today', 'Last One Month', 'Last Six Months', 'Last One Year', 'YTD'];
        timePeriodTypes.forEach((timePeriodType, idx) => {
          scope.segFilter3Data.push({
            lblFilterValue: {
              text: timePeriodType,
              isVisible: true
            },
            lblIcon: {
              text: idx === 2 ? "M" : "L",
              skin: idx === 2 ? "ICSknLblRadioBtnSelectedFontIcon003e7520px" : "sknLblOlbFontIconsA0A0A020Px",
              isVisible: true,
              cursorType: "pointer"
            }
          });
        });
        scope.view.segFilter1.setData(scope.segFilter1Data);
        scope.view.segFilter2.setData(scope.segFilter2Data);
        scope.view.segFilter3.setData(scope.segFilter3Data);
      } catch (err) {
        const errorObj = {
          "level": "ComponentController",
          "method": "setFilterDropdownData",
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
      scope = this;
      try {
        if (scope.view.lblDropdownFilterIcon.text === "O") {
          scope.view.segFilter1.setData(scope.segFilter1Data);
          scope.view.segFilter2.setData(scope.segFilter2Data);
          scope.view.segFilter3.setData(scope.segFilter3Data);
          scope.view.btnApply.skin = "ICSknbtnEnabed003e7536px";
          scope.view.btnApply.setEnabled(true);
          scope.view.flxListDropdown.setVisibility(true);
          scope.view.lblDropdownFilterIcon.text = "P";
        } else {
          scope.view.flxListDropdown.setVisibility(false);
          scope.view.lblDropdownFilterIcon.text = "O";
        }
        scope.view.forceLayout();
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "toggleFilterDropDownVisibility",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
      * @api : setFilterWidgetDataMap
      * Hides or shows the filter dropw down based on its current state
      * @return : NA
      */
    setFilterWidgetDataMap: function () {
      scope = this;
      try {
        scope.view.segFilter1.widgetDataMap = {
          "lblFilterValue": "lblFilterValue",
          "lblIcon": "lblIcon",
          "flxTempExportLCFilter1": "flxTempExportLCFilter1"
        };
        scope.view.segFilter2.widgetDataMap = {
          "lblFilterValue": "lblFilterValue",
          "lblIcon": "lblIcon",
          "flxTempExportLCFilter1": "flxTempExportLCFilter1"
        };
        scope.view.segFilter3.widgetDataMap = {
          "lblFilterValue": "lblFilterValue",
          "lblIcon": "lblIcon",
          "flxTempExportLCFilter1": "flxTempExportLCFilter1"
        };
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setFilterWidgetDataMap",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * Method to set default sort icon image
     */
    setDefaultSort: function (widget) {
      try {
        for (const key in this.sortFields) {
          this.view[key].src = "sortingfinal.png";
        }
        this.view[widget].src = "sorting_next.png";
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setDefaultSort",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
    * @api : toggleSortIcon
    * Update sort icons and trigger a action to business controller to sort
    * @return : NA
    */
    toggleSortIcon: function (widget) {
      scope = this;
      try {
        let sortType = "";
        if (scope.view[widget].src === "sorting_previous.png") {
          scope.view[widget].src = "sorting_next.png";
          sortType = "DESC";
        } else {
          scope.view[widget].src = "sorting_previous.png";
          sortType = "ASC";
        }
        for (const key in scope.sortFields) {
          if (key !== widget) {
            scope.view[key].src = "sortingfinal.png";
          }
        }
        scope.businessController.storeInCollection({
          pageOffset: this.view.PaginationContainer.getPageOffset(),
          sortByParam: scope.sortFields[widget],
          sortOrder: sortType
        });
        scope.fetchDashboardData("sort");
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "toggleSortIcon",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    /**
    * @api : setLOCSegmentWidgetDataMap
    * This method will set the widget data map for segTemplates segment
    * @return : NA
    */
    setLOCSegmentWidgetDataMap: function () {
      scope = this;
      try {
        scope.view.segTemplates.widgetDataMap = {
          "btnAction": "btnAction",
          "btnAction1": "btnAction1",
          "btnAction2": "btnAction2",
          "btnAction3": "btnAction3",
          "flxDropdown": "flxDropdown",
          "flxExportAmendmentList": "flxExportAmendmentList",
          "flxExportAmendmentListTablet": "flxExportAmendmentListTablet",
          "flxIdentifier": "flxIdentifier",
          "flxTempExportLCList1": "flxTempExportLCList1",
          "flxTempExportLCList2": "flxTempExportLCList2",
          "flxTempExportLCList3": "flxTempExportLCList3",
          "flxTempExportLCList4": "flxTempExportLCList4",
          "lblColumn1": "lblColumn1",
          "lblColumn2": "lblColumn2",
          "lblColumn3": "lblColumn3",
          "lblColumn4": "lblColumn4",
          "lblColumn5": "lblColumn5",
          "lblColumn6": "lblColumn6",
          "lblDropdown": "lblDropdown",
          "lblIdentifier": "lblIdentifier",
          "lblRow2Column1Key": "lblRow2Column1Key",
          "lblRow2Column1Value": "lblRow2Column1Value",
          "lblRow2Column2Key": "lblRow2Column2Key",
          "lblRow2Column2Value": "lblRow2Column2Value",
          "lblRow2Column3Key": "lblRow2Column3Key",
          "lblRow2Column3Value": "lblRow2Column3Value",
          "lblRow3Column1Key": "lblRow3Column1Key",
          "lblRow3Column1Value": "lblRow3Column1Value",
          "lblRowColumn1Key": "lblRowColumn1Key",
          "lblRowColumn1Value": "lblRowColumn1Value",
          "lblRowColumn2Key": "lblRowColumn2Key",
          "lblRowColumn2Value": "lblRowColumn2Value",
          "lblRowColumn3Key": "lblRowColumn3Key",
          "lblRowColumn3Value": "lblRowColumn3Value",
          "lblRowColumn4Key": "lblRowColumn4Key",
          "lblRowColumn4Value": "lblRowColumn4Value"
        };
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setLOCSegmentWidgetDataMap",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    onFilterSelection: function ({ segWidget, rowIndex }) {
      scope = this;
      try {
        let segmentdata = JSON.parse(JSON.stringify(scope.view[segWidget].data));
        if (segWidget === "segFilter1" || segWidget === "segFilter2") {
          if (rowIndex === 0) {
            if (segmentdata[rowIndex].lblIcon.text === "D") {
              segmentdata.forEach(record => {
                record.lblIcon.text = "C";
              });
            } else {
              segmentdata.forEach(record => {
                record.lblIcon.text = "D";
              });
            }
          } else {
            if (segmentdata[rowIndex].lblIcon.text === "D") {
              segmentdata[rowIndex].lblIcon.text = "C";
            } else {
              segmentdata[rowIndex].lblIcon.text = "D";
            }
            let selectedFilterCount = 1;
            for (var i = 1; i < segmentdata.length; i++) {
              if (segmentdata[i].lblIcon.text === "C") selectedFilterCount++;
            }
            if (segmentdata.length === selectedFilterCount) {
              segmentdata[0].lblIcon.text = "C";
            } else {
              segmentdata[0].lblIcon.text = "D";
            }
          }
        } else {
          segmentdata.forEach(record => {
            record.lblIcon.text = "L";
            record.lblIcon.skin = "sknLblOlbFontIconsA0A0A020Px";
          });
          segmentdata[rowIndex].lblIcon.text = "M";
          segmentdata[rowIndex].lblIcon.skin = "ICSknLblRadioBtnSelectedFontIcon003e7520px";
        }
        scope.view[segWidget].removeAll();
        scope.view[segWidget].setData(segmentdata);
        let accCount = 0, statusCount = 0, timeCount = 1;
        for (var i = 0; i < scope.view.segFilter1.data.length; i++) {
          if (scope.view.segFilter1.data[i].lblIcon.text === "C") accCount++;
        }
        for (var i = 0; i < scope.view.segFilter2.data.length; i++) {
          if (scope.view.segFilter2.data[i].lblIcon.text === "C") statusCount++;
        }
        if (accCount >= 1 && statusCount >= 1 && timeCount >= 1) {
          this.view.btnApply.skin = "ICSknbtnEnabed003e7536px";
          this.view.btnApply.setEnabled(true);
        } else {
          this.view.btnApply.skin = "ICSknbtnDisablede2e9f036px";
          this.view.btnApply.setEnabled(false);
        }
        scope.view.forceLayout();
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "onFilterSelection",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
      * @api : onBreakpointChangeComponent
      * This method will invoked on breakpoint change
      * @return : NA
      */
    onBreakpointChangeComponent: function (width) {
      scope = this;
      try {
        if (width === undefined) {
          width = kony.application.getCurrentBreakpoint();
        }
        isTablet = (width > 640 && width <= 1024) ? true : false;
        this.setDashboardData()
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "onBreakpointChangeComponent",
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
      scope = this;
      try {
        scope.view.PaginationContainer.setPageSize(10);
        scope.view.PaginationContainer.setLowerLimit(1);
        scope.view.PaginationContainer.setPageHeader(pageHeader);
        scope.view.PaginationContainer.setServiceDelegate(scope.fetchDashboardData.bind(scope, 'pagination'));
        scope.view.PaginationContainer.setIntervalHeader();
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "setPaginationComponent",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
      * @api : resetFilters
      * This method will invoked to reset filter
      * @return : NA
      */
    resetFilters: function () {
      scope = this;
      try {
        scope.view.lblFilterText.text = kony.i18n.getLocalizedString("i18n.konybb.Common.All");
        scope.view.lblDropdownFilter1.text = "P";
        scope.view.segFilter1.setVisibility(true);
        scope.view.lblDropdownFilter2.text = "P";
        scope.view.segFilter2.setVisibility(true);
        scope.view.lblDropdownFilter3.text = "P";
        scope.view.segFilter3.setVisibility(true);
        scope.setFilterDropdownData();
        scope.view.forceLayout();
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "resetFilters",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    switchToLOCTab: function () {
      scope = this;
      try {
        if (scope.collectionObj && scope.collectionObj.Collection && scope.collectionObj.Collection.ExportLetterOfCredit && scope.collectionObj.Collection.ExportLetterOfCredit.length > 0) {
          scope.view.flxVerticalEllipsis.setVisibility(true);
        }
        else {
          scope.view.flxVerticalEllipsis.setVisibility(false);
        }
        scope.setDefaultSort("imgColumn4Tab1");
        scope.businessController.resetCollection("ExportLetterOfCredit");
        this.currentTab = "LettersOfCredit";
        this.view.btnLOC.skin = "ICSknBtnAccountSummarySelected2";
        this.view.btnDrawings.skin = "ICSknBtnAccountSummaryUnselected2";
        this.view.btnAmendments.skin = "ICSknBtnAccountSummaryUnselected2";
        this.view.flxSortColumnTab1.setVisibility(true);
        this.view.flxSortColumnTab2.setVisibility(false);
        this.view.flxSortColumnTab3.setVisibility(false);
        this.setPaginationComponent(kony.i18n.getLocalizedString("i18n.ImportLC.Exports"));
        scope.setLOCSegmentWidgetDataMap();
        scope.fetchDashboardData();
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "switchToLOCTab",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    switchToDrawingsTab: function () {
      scope = this;
      try {
        if (scope.collectionObj && scope.collectionObj.Collection && scope.collectionObj.Collection.ExportLetterOfCredit && scope.collectionObj.Collection.ExportLetterOfCredit.length > 0) {
          scope.view.flxVerticalEllipsis.setVisibility(true);
        }
        else {
          scope.view.flxVerticalEllipsis.setVisibility(false);
        }
        scope.setDefaultSort("imgColumn4Tab2");
        this.businessController.resetCollection("ExportLetterOfCredit");
        this.currentTab = "Drawings";
        this.view.btnLOC.skin = "ICSknBtnAccountSummaryUnselected2";
        this.view.btnDrawings.skin = "ICSknBtnAccountSummarySelected2";
        this.view.btnAmendments.skin = "ICSknBtnAccountSummaryUnselected2";
        this.view.flxSortColumnTab1.setVisibility(false);
        this.view.flxSortColumnTab2.setVisibility(true);
        this.view.flxSortColumnTab3.setVisibility(false);
        this.setPaginationComponent(kony.i18n.getLocalizedString("i18n.ImportLC.Drawings"));
        scope.setLOCSegmentWidgetDataMap();
        scope.fetchDashboardData();
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "switchToDrawingsTab",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    switchToAmendmentsTab: function () {
      scope = this;
      try {
        if (scope.collectionObj && scope.collectionObj.Collection && scope.collectionObj.Collection.ExportLetterOfCredit && scope.collectionObj.Collection.ExportLetterOfCredit.length > 0) {
          scope.view.flxVerticalEllipsis.setVisibility(true);
        }
        else {
          scope.view.flxVerticalEllipsis.setVisibility(false);
        }
        scope.setDefaultSort("imgColumn4Tab3");
        this.currentTab = "Amendments";
        this.businessController.resetCollection("ExportLetterOfCredit");
        this.view.btnLOC.skin = "ICSknBtnAccountSummaryUnselected2";
        this.view.btnDrawings.skin = "ICSknBtnAccountSummaryUnselected2";
        this.view.btnAmendments.skin = "ICSknBtnAccountSummarySelected2";
        this.view.flxSortColumnTab1.setVisibility(false);
        this.view.flxSortColumnTab2.setVisibility(false);
        this.view.flxSortColumnTab3.setVisibility(true);
        this.setPaginationComponent(kony.i18n.getLocalizedString("i18n.ImportLC.Amendments"));
        scope.setLOCSegmentWidgetDataMap();
        scope.fetchDashboardData();
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "switchToAmendmentsTab",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    viewExportLCDetails: function (record) {
      const navManager = applicationManager.getNavigationManager();
      if (scope.btnId === 'Print') {
        navManager.navigateTo({ appName: "TradeFinanceMA", friendlyName: "frmPrintExportDrawing" }, false, {
          drawingSummary: record,
          printCallback: function () {
            applicationManager.getNavigationManager().navigateTo({ appName: 'TradeFinanceMA', friendlyName: 'frmExportLCDashboard' });
          }
        });
      } else {
        navManager.navigateTo({ appName: "TradeFinanceMA", friendlyName: "frmExportLCDetails" }, false, record);
      }
    },
    viewOrPrintExportDrawingDetails: function (record) {
      scope = this;
      try {
        const navManager = applicationManager.getNavigationManager();
        if (scope.btnId === "ViewDetails") {
          switch (record.ExportDrawing.status) {
            case OLBConstants.EXPORT_DRAWING_STATUS.DRAFT:
              record = Object.assign(record.ExportLetterOfCredit, record.ExportDrawing);
              record.recordStatus = record.status;
              navManager.navigateTo({ appName: "TradeFinanceMA", friendlyName: "frmExportLCCreateDrawings" }, false, record);
              break;
            case OLBConstants.EXPORT_DRAWING_STATUS.RETURNED_BY_BANK:
              navManager.navigateTo({ appName: "TradeFinanceMA", friendlyName: "frmExportLCViewDetailsReturned" }, false, record);
              break;
            default:
              navManager.navigateTo({ appName: "TradeFinanceMA", friendlyName: "frmExportDrawingDetails" }, false, record);
              break;
          }
        } else {
          navManager.navigateTo({ appName: "TradeFinanceMA", friendlyName: "frmPrintExportDrawing" }, false, {
            drawingSummary: record,
            printCallback: function () {
              applicationManager.getNavigationManager().navigateTo({ appName: 'TradeFinanceMA', friendlyName: 'frmExportLCDashboard' });
            }
          });
        }
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "viewOrPrintExportDrawingDetails",
          "error": err
        };
        this.onError(errorObj);
      }
    },
    viewOrPrintExportAmendmentDetails: function (record) {
      try {
        if (scope.btnId === 'Print') {
          let navData = {};
          navData.importLCId = record.ExportAmendment[0].amendmentSRMSRequestId;
          navData = record.ExportAmendment[0];
          navData["frmName"] = "frmExportLCDashboard";
          kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("ImportLCUIModule").presentationController.navigateToForm("TradeFinanceMA", "ImportLCUIModule/frmAmendmentsPrint", {
            "Data": navData,
            "LOCNavData": record.ExportLetterOfCredit
          });
        } else {
          applicationManager.getNavigationManager().navigateTo({ appName: "TradeFinanceMA", friendlyName: "frmExportAmendmentViewDetails" }, false, {
            ExportLetterOfCredit: record.ExportLetterOfCredit,
            ExportAmendment: record.ExportAmendment[0]
          });
        }
      } catch (error) {
        var errorObj = {
          "level": "ComponentController",
          "method": "viewOrPrintExportAmendmentDetails",
          "error": error
        };
        this.onError(errorObj);
      }
    },
    /**
     * Method to handle the segment row view on click of dropdown
     */
    handleSegmentRowView: function () {
      try {
        scope = this;
        const rowIndex = scope.view.segTemplates.selectedRowIndex[1];
        const data = scope.view.segTemplates.data;
        let expandedHeight;
        if (this.currentTab === "LettersOfCredit") {
          expandedHeight = isTablet ? "170dp" : "130dp";
        } else if (this.currentTab === "Drawings") {
          expandedHeight = isTablet ? "205dp" : "210dp";
        } else {
          expandedHeight = isTablet ? "175dp" : "105dp";
        }
        var pre_val;
        var requiredView = [];
        const collapsedView = ["O", false, "sknFlxIdentifier", "sknffffff15pxolbfonticons", "40dp", "sknflxffffffnoborder"];
        const expandedView = ["P", true, "sknflxBg4a90e2op100NoBorder", "sknSSP4176a415px", expandedHeight, "ICSknFlxfbfbfb"];
        if (this.previousIndex === rowIndex) {
          requiredView = data[rowIndex].lblDropdown === "P" ? collapsedView : expandedView;
          this.toggleSegmentRowView(rowIndex, requiredView);
        } else {
          if (this.previousIndex >= 0) {
            pre_val = this.previousIndex;
            this.toggleSegmentRowView(pre_val, collapsedView);
          }
          pre_val = rowIndex;
          this.toggleSegmentRowView(rowIndex, expandedView);
        }
        this.previousIndex = rowIndex;
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "handleSegmentRowView",
          "error": err
        };
        this.onError(errorObj);
      }
    },
    /**
     * Method to toggle the segment row view
     * @param {Number} index - index of segment row to toggle
     * @param {Array} viewData - data which need to be assigned to toggled view
     */
    toggleSegmentRowView: function (index, viewData) {
      try {
        scope = this;
        let data = scope.view.segTemplates.data[index];
        const template = data.template;
        data.lblDropdown = viewData[0];
        data.flxIdentifier.isVisible = viewData[1];
        data.flxIdentifier.skin = viewData[2];
        data.lblIdentifier.skin = viewData[3];
        data[template].height = viewData[4];
        data[template].skin = viewData[5];
        scope.view.segTemplates.setDataAt(data, index);
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "toggleSegmentRowView",
          "error": err
        };
        this.onError(errorObj);
      }
    },
    refreshComponent: function () {
      scope = this;
      try {
        scope.view.tbxSearch.text = "";
        scope.view.lblClearIcon.setVisibility(false);
        scope.view.segTemplates.removeAll();
        scope.view.flxPagination.setVisibility(false);
        if (scope.context.flowType === "GetAllExportLettersOfCredit") {
          scope.businessController.storeInCollection({
            searchString: "",
            pageSize: "11",
            pageOffset: 0,
            sortByParam: "lcUpdatedOn",
            sortOrder: "DESC",
            timeParam: "lcUpdatedOn",
            timeValue: "6,MONTH",
            filterByValue: "",
            filterByParam: ""
          });
          scope.toggleFilterVisibility(true);
          scope.switchToLOCTab();
        } else if (scope.context.flowType === "GetAllExportDrawings") {
          scope.businessController.storeInCollection({
            searchString: "",
            pageSize: "11",
            pageOffset: 0,
            sortByParam: "drawingCreatedDate",
            sortOrder: "DESC",
            timeParam: "drawingCreatedDate",
            timeValue: "6,MONTH",
            filterByValue: "",
            filterByParam: "",
            exportLcId: ""
          });
          scope.toggleFilterVisibility(true);
          scope.switchToDrawingsTab();
        } else if (scope.context.flowType === "GetExportLcIdDrawings") {
          scope.businessController.storeInCollection({
            searchString: "",
            pageSize: "11",
            pageOffset: 0,
            sortByParam: "drawingCreatedDate",
            sortOrder: "DESC",
            timeParam: "drawingCreatedDate",
            timeValue: "6,MONTH",
            filterByValue: "",
            filterByParam: "",
            exportLcId: scope.context.exportLcId
          });
          scope.toggleFilterVisibility(false);
          scope.switchToDrawingsTab();
        } else if (scope.context.flowType === "GetAllExportAmendments") {
          scope.businessController.storeInCollection({
            searchString: "",
            pageSize: "11",
            pageOffset: 0,
            sortByParam: "amendmentReceivedDate",
            sortOrder: "DESC",
            timeParam: "amendmentReceivedDate",
            timeValue: "6,MONTH",
            filterByValue: "",
            filterByParam: "",
          });
          scope.toggleFilterVisibility(true);
          scope.switchToAmendmentsTab();
        } else if (scope.context.flowType === "NewlyReceivedExportLC") {
          scope.businessController.storeInCollection({
            searchString: "",
            pageSize: "11",
            pageOffset: 0,
            sortByParam: "lcUpdatedOn",
            sortOrder: "DESC",
            timeParam: "",
            timeValue: "",
            filterByValue: OLBConstants.EXPORT_LC_STATUS.NEW,
            filterByParam: "status"
          });
          scope.toggleFilterVisibility(true);
          scope.switchToLOCTab();
        }
        scope.resetFilters();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "refreshComponent",
          "error": err
        };
        this.onError(errorObj);
      }
    },
    toggleFilterVisibility: function (visibility) {
      try {
        if (visibility) {
          this.view.flxDropDown.setVisibility(true);
          this.view.flxSearch.width = isTablet ? "47%" : "60%";
        } else {
          this.view.flxDropDown.setVisibility(false);
          this.view.flxSearch.width = isTablet ? "94.6%" : "96.8%";
        }
        this.view.forceLayout();
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "toggleFilterVisibility",
          "error": err
        };
        this.onError(errorObj);
      }
    },
    /**
      * @api : isEmptyNullOrUndefined
      * Verifies if the value is empty, null or undefined
      * data {any} - value to be verified
      * @return : {boolean} - validity of the value passed
      */
    isEmptyNullOrUndefined: function (data) {
      if (data === null || data === undefined || data === "") return true;
      if (typeof data === "object") {
        if (Array.isArray(data)) return data.length === 0;
        return Object.keys(data).length === 0;
      }
      return false;
    },
    /**
    * @api : moreActionSegDataMapping
    * Sets data for more actions dropdown
    * @return : NA
    */
    moreActionSegDataMapping: function () {
      scope = this;
      try {
        scope.view.segEllipsisDropDownValues.widgetDataMap = {
          "flxAccountTypes": "flxAccountTypes",
          "lblUsers": "lblUsers",
          "lblSeparator": "lblSeparator"
        };
        var segData = [
          [
            {},
            [{
              lblUsers: {
                text: kony.i18n.getLocalizedString("i18n.TradeFinance.ExportList"),
                toolTip: kony.i18n.getLocalizedString("i18n.TradeFinance.ExportList"),
                isVisible: true,
              },
              flxAccountTypes: {
                onClick: scope.downloadXLSXFile.bind(this),
                isVisible: true,
              },
            },
            ]
          ]
        ];
        scope.view.segEllipsisDropDownValues.setData(segData);
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "moreActionSegDataMapping",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
      * @api : downloadXLSXFile
      * downloads records in XLSX File for the current tab records.
      * @return : NA
      */
    downloadXLSXFile: function () {
      scope = this;
      try {
        switch (this.currentTab) {
          case "LettersOfCredit":
            scope.businessController.getXLSXFile("GenerateExportLetterOfCreditList", "generateExportLetterOfCreditList", "Export Letter Of Credit");
            break;
          case "Drawings":
            scope.businessController.getXLSXFile("GenerateExportDrawingsList", "generateExportDrawingsList", "Export Drawing");
            break;
          case "Amendments":
            scope.businessController.getXLSXFile("GenerateExportAmendmentList", "generateExportAmendmentList", "Export LC Amendment");
            break;
        }
        scope.view.flxEllipsisDropDown.setVisibility(false);
      } catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "downloadXLSXFile",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
  };
});
