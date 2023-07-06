define({
  //Type your controller code here
  rowIndexForSwipe: -1,
  previousSection: -1,
  swipeObj: {},
  filterVisible: 0,
  finalData: [],
  sweepAccData: [],
  searchVariable: 0,
  /**
   * init is called when the form is loaded , initialisation happen here
   */
  init: function () {
    var scope = this;
    this.view.preShow = this.preShowForm;
    this.view.postShow = this.postShowForm;
    applicationManager.getPresentationFormUtility().initCommonActions(this, "NO", this.view.id, scope.navigateCustomBack);
  },
  /***
   * OnNavigate is called when the form is navigated after init
   */
  onNavigate: function () {
    var self = this;
    this.presenter = applicationManager.getModulesPresentationController({
      moduleName: "AccountSweepsUIModule",
      appName: "AccountSweepsMA",
    });
    this.navManager = applicationManager.getNavigationManager();
    let context = this.navManager.getCustomInfo("AllSweeps");
    this.view.flxDeletePopup.isVisible = false;
    context && (context.dbpErrMsg || context.errorMessage) ? this.bindGenericError(context.dbpErrMsg || context.errorMessage) : this.updateForm(context);
    this.view.flxFilter.onTouchStart = function () {
      self.view.flxAccountsFilter.isVisible = true;
      self.setFilterData(context);
    };
    kony.application.dismissLoadingScreen();
  },

  /***
   * navigateCustomBack is triggered native/ ios back event
   */
  navigateCustomBack: function () {
    this.presenter.commonFunctionForgoBack();
    this.resetGlobalVariable();
  },

  /***
   * native/ios cancel event
   */
  cancelOnClick: function () {
    this.presenter.cancelCommon({"appName": "HomepageMA", "friendlyName": "frmUnifiedDashboard"});
    this.resetGlobalVariable();
  },
  /**
   * preShowForm is called when the form is pre loaded
   */
  preShowForm: function () {
    if (kony.os.deviceInfo().name === "iPhone") {
      this.view.flxHeader.isVisible = false;
    } else{
      this.view.flxHeader.isVisible = true;
    }
    //this.view.flxNoSearch.isVisible = false;
    this.view.flxAccountsFilter.isVisible = false;
    this.view.flxSearchClose.isVisible = false;
    this.view.tbxSearch.text = "";
    this.initActions();
  },

  /**
   * postShowForm is called when the form is post loaded
   */
  postShowForm: function () {},

  /**
   * initActions has all form action declarations
   */
  initActions: function () {
    var self = this;
    this.view.customHeader.btnRight.onClick = this.cancelOnClick;
    this.view.customHeader.flxBack.onTouchStart = function(){
      self.navManager.navigateTo({"appName": "HomepageMA", "friendlyName": "frmUnifiedDashboard"});
    };
    this.view.flxClose.onTouchStart = function () {
      self.view.flxAccountsFilter.isVisible = false;
    };
    this.view.segSweepAccounts.onRowClick =
      this.segSweepAccountsRowClick.bind(this);
    this.view.segFilter.onRowClick = this.setSelectedFilter.bind(this);
    this.view.btnNewAccount.isVisible = this.checkUserPermission("ACCOUNT_SWEEP_CREATE");
    this.view.tbxSearch.onTextChange = this.tbxSearchOnTextChange.bind(this);
    this.view.flxSearchClose.onTouchStart = this.clearSearch;
    this.view.btnNewAccount.onClick = this.createSweep;
  },

  /**
     *updateForm : Will be called by the navigate method, when current form is to be updated
     @param{object}
  */

  updateForm: function (context) {
    if (context.length === 0 ) {
      if (this.filterVisible === 1) {
        this.setAccountsVisibily(this.filterVisible);
      } else {
        this.view.segSweepAccounts.isVisible = false;
        this.view.flxSegment.isVisible = false;
        this.view.flxCondition.isVisible = false;
        this.view.flxNoAccounts.isVisible = true;
        this.view.flxFooter.skin = "sknFlxf8f7f8";
      }
    } else {
      this.filterVisible = 0;
      this.setAccountsVisibily(this.filterVisible);
      this.view.segSweepAccounts.isVisible = true;
      this.setSegmentData(context);
    }
  },

  /**
     *setAccountsVisibily : Will be called by the updateForm method
     *@param{int}
  */
  setAccountsVisibily: function (filterSearch) {
    this.view.flxCondition.isVisible = true;
    this.view.flxNoAccounts.isVisible = false;
    this.view.flxSegment.isVisible = filterSearch === 1 ? false : true;
    this.view.flxNoSearch.isVisible = filterSearch === 1 ? true : false;
    this.view.lblNoRecord.text = kony.i18n.getLocalizedString("kony.mb.transfers.noRecordFound");
    this.view.flxFooter.skin = "slFbox0e6f1958661e64a";
  },

  /**
     * setFilterData : sets filter Name in filter UI
     * @param{object}
  */
  setFilterData: function (context) {
    this.view.segFilter.widgetDataMap = this.getFilterWidgetDataMap();
    var filterData = [
      "i18n.AccountsDetails.ALL",
      "i18n.signatory.above",
      "i18n.accountsweeps.below",
      "i18n.accountsweeps.both",
    ];
    var data = [];
    if (this.finalData.length === 0) {
      for (var i = 0; i < filterData.length; i++) {
        if (
          kony.i18n.getLocalizedString(filterData[i]) ===
          kony.i18n.getLocalizedString("i18n.AccountsDetails.ALL")
        ) {
          data["lblFilterOption"] = {
            text:
              kony.i18n.getLocalizedString("i18n.AccountsDetails.ALL") +
              " " +
              "(" +
              context.length +
              ")",
          };
          data["imgFilterSelectedIcon"] = {
            src: "correct.png",
            isVisible: true,
          };
        } else {
          data["lblFilterOption"] = {
            text: kony.i18n.getLocalizedString(filterData[i]),
          };
          data["imgFilterSelectedIcon"] = {
            src: "correct.png",
            isVisible: false,
          };
        }
        this.finalData.push(data);
        data = [];
      }
    }
    this.view.segFilter.setData(this.finalData);
    this.view.forceLayout();
  },

  /**
     *setSelectedFilter : sets selected filter Name Data in UI 
  */ 
  setSelectedFilter: function (seguiWidget, sectionIndex, rowIndex) {
    var filterName;
    var segmentData = this.view.segFilter.data[rowIndex];
    if(segmentData.lblFilterOption.text.includes("All")){
      filterName = segmentData.lblFilterOption.text.split(" (")[0];
    } else {
      filterName = segmentData.lblFilterOption.text;
    }
    this.setIdBasedValueFromArray(segmentData);
    this.view.tbxSearch.text = "";
    this.view.flxSearchClose.isVisible = false;
    this.presenter.setSweepsAttribute(
      "filterByValue",
      filterName === "All"
        ? ""
        : filterName
    );
    this.presenter.setSweepsAttribute(
      "filterByParam",
      filterName === "All" ? "" : "sweepType"
    );
    this.filterVisible = 1;
    this.view.segSweepAccounts.removeAll();
    this.presenter.getSweeps();
    this.view.flxAccountsFilter.isVisible = false;
  },

  /**
     *setIdBasedValueFromArray : Will be called by the setSelectedFilter method
     *@param{object}
  */
  setIdBasedValueFromArray: function (segmentData) {
    try {
      var filterOption = [];
      var selectedFilter = JSON.parse(JSON.stringify(segmentData));
      var selectedFilterIcon = "correct.png";
      this.finalData.forEach(function (item) {
        var filter = {
          lblFilterOption: { text: item.lblFilterOption.text },
          imgFilterSelectedIcon: {
            src: "correct.png",
            isVisible:
              item.lblFilterOption.text === selectedFilter.lblFilterOption.text
                ? true
                : false,
          },
        };
        filterOption.push(filter);
      });
      this.view.segFilter.setData(filterOption);
      this.finalData = filterOption;
      this.view.forceLayout();
    } catch (err) {
      var errObj = {
        errorInfo:
          "Error while setting Filter Headers and Options List in the UI.",
        errorLevel: "Configuration",
        error: err,
      };
      this.onError(errObj);
    }
  },

  /**
     * setSegmentData : Will be called by the setSelectedFilter method
     * @param{object}
  */
  setSegmentData: function (data) {
    var self = this;
    this.view.segSweepAccounts.widgetDataMap = this.getSegWidgetDataMap();
    for (var i = 0; i < data.length; i++) {
      var forUtility = applicationManager.getFormatUtilManager();
      data[i]["flxSwipeBtn1"] = {
        isVisible: this.checkUserPermission("ACCOUNT_SWEEP_EDIT"),
        onClick: function () {
          var RowData = self.view.segSweepAccounts.data[self.rowIndexForSwipe];
          self.editRow(RowData);
        },
      };
      data[i]["flxSwipeBtn2"] = {
        isVisible: this.checkUserPermission("ACCOUNT_SWEEP_DELETE"),
        onClick: function () {
          var RowData = self.view.segSweepAccounts.data[self.rowIndexForSwipe];
          self.deleteRow(RowData);
        },
      };
      data[i]["processedPrimaryName"] = {
        "text": applicationManager.getPresentationUtility().formatText(data[i].primaryAccountName, 10, data[i].primaryAccountNumber, 4)
      };
      data[i]["processedSecondaryName"] = {
        "text": applicationManager.getPresentationUtility().formatText(data[i].secondaryAccountName, 10, data[i].secondaryAccountNumber, 4)
      };
      if (!this.presenter.isEmptyNullUndefined(data[i].belowSweepAmount) && !this.presenter.isEmptyNullUndefined(data[i].aboveSweepAmount)) {
        data[i]["aboveValue"] = {
          isVisible: true,
          text: kony.i18n.getLocalizedString("i18n.signatory.above") + " " + forUtility.formatAmountandAppendCurrencySymbol(data[i].aboveSweepAmount, data[i].currencyCode) + " - " + kony.i18n.getLocalizedString("i18n.accountsweeps.below") + " " + forUtility.formatAmountandAppendCurrencySymbol( data[i].belowSweepAmount, data[i].currencyCode ),
        };
      } else if (!this.presenter.isEmptyNullUndefined(data[i].belowSweepAmount)) {
        data[i]["aboveValue"] = {
          isVisible: true,
          text: kony.i18n.getLocalizedString("i18n.accountsweeps.below") + " " + forUtility.formatAmountandAppendCurrencySymbol( data[i].belowSweepAmount, data[i].currencyCode ),
        };
      } else {
        data[i]["aboveValue"] = {
          isVisible: true,
          text: kony.i18n.getLocalizedString("i18n.signatory.above") + " " + forUtility.formatAmountandAppendCurrencySymbol( data[i].aboveSweepAmount, data[i].currencyCode ),
        };
      }
    }
    this.view.flxSegment.isVisible = true;
    this.view.segSweepAccounts.isVisible = true;
    this.sweepAccData = data;
    this.view.segSweepAccounts.setData(data);
    this.view.flxNoAccounts.isVisible = false;
    this.view.forceLayout();
  },

  /**
     * segSweepAccountsRowClick : performs on row click on segment
  */
  segSweepAccountsRowClick: function () {
    var rowindex = Math.floor(this.view.segSweepAccounts.selectedRowIndex[1]);
    sweepData = this.view.segSweepAccounts.data[rowindex];
    this.presenter.setSweepAccountsForTransactions(sweepData);
    this.navManager.navigateTo("frmViewAccountSweep");
  },

  /**
     * tbxSearchOnTextChange : This method will be called when search is triggered
  */
  tbxSearchOnTextChange: function () {
    var searchtext = this.view.tbxSearch.text.toLowerCase();
    if (searchtext.length >= 3) {
      this.searchVariable = 1;
      this.view.flxSegment.isVisible = true;
      this.view.segSweepAccounts.isVisible = true;
      this.view.flxNoSearch.isVisible = false;
      this.view.flxSearchClose.isVisible = true;
      this.view.segSweepAccounts.removeAll();
      var searchobj = applicationManager
        .getDataProcessorUtility()
        .multipleCommonSegmentSearch(
          [
            "primaryAccountNumber",
            "secondaryAccountNumber",
            "primaryAccountName",
            "secondaryAccountName",
            "confirmationNumber",
          ],
          searchtext,
          this.sweepAccData
        );
      if (searchobj.length > 0) {
        this.view.segSweepAccounts.setData(searchobj);
      } else {
        this.view.flxSegment.isVisible = false;
        this.view.segSweepAccounts.isVisible = false;
        this.view.flxNoSearch.isVisible = true;
        this.view.lblNoRecord.text = kony.i18n.getLocalizedString("kony.mb.transfers.noSearchResultFound");
      }
    } else {
      this.view.flxSearchClose.isVisible = false;
      this.view.flxSegment.isVisible = true;
      this.view.segSweepAccounts.isVisible = true;
      this.view.flxNoSearch.isVisible = false;
      if (this.searchVariable !== 0) {
        this.view.segSweepAccounts.setData(this.sweepAccData);
      }
      this.searchVariable = 0;
    }
  },

  /**
     * clearSearch : This method is responsible for clearing the search text
  */
  clearSearch: function () {
    if (this.searchVariable !== 0) {
      this.view.flxSegment.isVisible = true;
      this.view.segSweepAccounts.isVisible = true;
      this.view.segSweepAccounts.setData(this.sweepAccData);
      this.view.flxSearchClose.isVisible = false;
    }
    this.searchVariable = 0;
    this.view.flxNoSearch.isVisible = false;
    this.view.tbxSearch.text = "";
  },

  /**
     * editRow : This method is called while onClicking edit in Swipe
     * @param{json}
  */
  editRow: function (rowData) {
    this.presenter.setSweepAccountsForTransactions(rowData);
    this.navManager.setEntryPoint("AccountSweepsFlow", "Edit");
    this.presenter.getAllAccounts("frmSweepsAmount", "frmAccountSweepsDashBoard");
  },

  /**
     * deleteRow : This method is called while delete edit in Swipe
     * @param{json}
  */
  deleteRow: function (rowData) {
    var scope = this;
    var basicProperties = {
      message:
        kony.i18n.getLocalizedString("i18n.accountsweeps.deleteTheRule") +
        ' " ' +
        rowData.processedPrimaryName.text +
        ' " ' +
        "?",
      alertType: constants.ALERT_TYPE_CONFIRMATION,
      yesLabel: kony.i18n.getLocalizedString("i18n.common.yes"),
      noLabel: kony.i18n.getLocalizedString("i18n.common.no"),
      alertHandler: scope.deleteHandler.bind(scope, rowData),
    };
    var pspConfig = {};
    kony.ui.Alert(basicProperties, pspConfig);
  },

  /**
     * deleteHandler : responsible for deleting account Sweep
     * @param{json}
  */
  deleteHandler: function (rowIndex, response) {
    var scope = this;
    if (response == true) {
      this.navManager.setEntryPoint("AccountSweepsFlow", "Delete");
      this.presenter.getSweepsDelete(rowIndex);
    }
  },

  /**
     * PopupHandler : Responsible for showing the delete popup
     * @param{object}
  */
  PopupHandler: function (response) {
    var scope = this;
    if (response.errorMessage) {
      var errorObject = {};
      var errorText = kony.i18n.getLocalizedString(
        "i18n.accountSweeps.SweepCouldNotBeDeleted"
      );
      errorObject.formattedFailedText = errorText;
      errorObject.isSuccess = false;
      this.view.CancelTransactionPopup.setContext(errorObject);
      this.view.CancelTransactionPopup.isVisible=true;
      this.view.flxDeletePopup.setVisibility(true);
      this.view.CancelTransactionPopup.contextualActionButtonOnClick =
        function (btnAction) {
          if (btnAction)
          scope.presenter.commonFunctionForNavigation("frmAccountSweepsDashBoard");
        };
    } else {
      var formattedResponse = [];
      var data = {};
      var context = {};
      data.message = response.message;
      formattedResponse.push(data);
      context.messageDetails = JSON.stringify(formattedResponse);
      var successText = kony.i18n.getLocalizedString(
        "i18n.accountSweeps.successfullyDeleted"
      );
      context.formattedSuccessText = successText;
      context.isSuccess = true;
      context.confirmationNumber = response.serviceRequestId;
      this.view.CancelTransactionPopup.setContext(context);
      this.view.CancelTransactionPopup.isVisible=true;
      this.view.flxDeletePopup.setVisibility(true);
      this.view.CancelTransactionPopup.contextualActionButtonOnClick =
        function (btnAction) {
          if (btnAction) scope.presenter.getSweeps();
        };
    }
  },

  /**
   * getSegWidgetDataMap - responsible for getting the widgetDataMap
   * @return datamap
  */
  getSegWidgetDataMap: function () {
    var dataMap = {
      lblAccountName: "processedPrimaryName",
      lblAboveValue: "aboveValue",
      flxAccountsMain: "flxAccountsMain",
      flxRightSideContents: "flxRightSideContents",
      flxSwipeBtn1: "flxSwipeBtn1",
      flxSwipeBtn2: "flxSwipeBtn2",
    };
    return dataMap;
  },

  /**
   * getFilterWidgetDataMap - responsible for getting the widgetDataMap
   * @return FilterdataMap
  */
  getFilterWidgetDataMap: function () {
    var FilterdataMap = {
      lblFilterOption: "lblFilterOption",
      imgFilterSelectedIcon: "imgFilterSelectedIcon",
    };
    return FilterdataMap;
  },

  /**
   * Component swipeRowOption
   * swipe the segment row and show options
   * widgetInfo {object} - this will be details about the segment
   * swipeInfo {object} - this will be swipe row information like swiped left or right
   */
  swipeRowOption: function (widgetInfo, swipeInfo) {
    if (this.rowIndexForSwipe >= 0 && this.previousSection >= 0) {
      this.animateRight(this.rowIndexForSwipe, this.previousSection);
    }
    this.rowIndexForSwipe = swipeInfo.row;
    this.previousSection = swipeInfo.section;
    if (swipeInfo.swipeDirection === 1) {
      this.animateLeft(swipeInfo.row, swipeInfo.section);
    } else if (swipeInfo.swipeDirection === 2) {
      this.animateRight(swipeInfo.row, swipeInfo.section);
    }
  },

  animateLeft: function (rowNumber, sectionNumber) {
    var shiftPixels = this.getShiftPixels(rowNumber);
    if (sectionNumber === 0) {
      this.getTransAnimDefinition(shiftPixels);
      this.view.segSweepAccounts.animateRows({
        rows: [
          {
            sectionIndex: sectionNumber,
            rowIndex: rowNumber,
          },
        ],
        widgets: ["flxAccountsMain"],
        animation: this.swipeObj,
      });
    }
  },
  animateRight: function (rowNumber, sectionNumber) {
    if (sectionNumber === 0) {
      this.getTransAnimDefinition("0dp");
      this.view.segSweepAccounts.animateRows({
        rows: [
          {
            sectionIndex: sectionNumber,
            rowIndex: rowNumber,
          },
        ],
        widgets: ["flxAccountsMain"],
        animation: this.swipeObj,
      });
    }
  },

  getShiftPixels: function (rowNumber) {
    var isSwipeButton1Visible = this.view.segSweepAccounts.data[rowNumber].flxSwipeBtn1.isVisible;
    var isSwipeButton2Visible = this.view.segSweepAccounts.data[rowNumber].flxSwipeBtn2.isVisible;
    if (isSwipeButton1Visible && isSwipeButton2Visible) {
      return "-140dp";
    } else if (!isSwipeButton1Visible && !isSwipeButton2Visible) {
      return "0dp";
    }
    return "-70dp";
  },

  getTransAnimDefinition: function (leftVal) {
    var transAnimDef1 = {
      100: {
        left: leftVal,
        stepConfig: {
          timingFunction: kony.anim.LINEAR,
        },
        rectified: true,
      },
    };
    var animConf = {
      delay: 0,
      iterationCount: 1,
      fillMode: kony.anim.FILL_MODE_FORWARDS,
      duration: 0.5,
    };
    this.swipeObj = {
      definition: kony.ui.createAnimation(transAnimDef1),
      config: animConf,
      callbacks: null,
    };
  },

  createSweep: function () {
    this.navManager.setEntryPoint("AccountSweepsFlow", "Create");
    this.presenter.isSecondaryEdit = false;
    var accountSweepMan = applicationManager.getAccountSweepsManager();
    accountSweepMan.clearSweepsObject();
    this.presenter.getAllAccounts("frmAccountSweepsPrimaryAccount","frmAccountSweepsDashBoard");
  },

  /**
   * checkUserPermission - Checks whether user has permission
   * @returns {boolean}
 */
  checkUserPermission: function (permission) {
    return applicationManager
      .getConfigurationManager()
      .checkUserPermission(permission);
  },

  /**
   * resetGlobalVariable - Resets the Global Variables
 */
  resetGlobalVariable: function () {
    this.rowIndexForSwipe = -1;
    this.previousSection = -1;
    this.swipeObj = {};
    this.filterVisible = 0;
    this.finalData = [];
    this.sweepAccData = [];
    this.searchVariable = 0;
  },

  bindGenericError: function (errorMsg) {
    applicationManager.getPresentationUtility().dismissLoadingScreen();
    applicationManager.getDataProcessorUtility().showToastMessageError(this, errorMsg);
  },
});
