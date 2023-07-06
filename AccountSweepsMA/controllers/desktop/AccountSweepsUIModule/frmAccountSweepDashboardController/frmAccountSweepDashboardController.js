define(["FormControllerUtility", "CommonUtilities", "OLBConstants", "ViewConstants"], function (FormControllerUtility, CommonUtilities, OLBConstants, ViewConstants) {
    const NA = kony.i18n.getLocalizedString("i18n.common.NA");
    let contentScope, contentPopupScope, titleActionScope;
    let isFilterApplied = false;
    let prevSelectedIndex;
    let sweepsData = {};
    let sweepAccData = [];
    let recordsPerPage;
    let pageNumber;
    let isTablet = false;
    return {
        /**
         * Sets the initial actions for form
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
         * @api : onBreakPointChange
         * Based on break point design will change
         * @return : NA
        */
        onBreakpointChange: function(form, width) {
            if (width === 640) {
                this.view.formTemplate12.pageTitleVisibility = false;
            } else {
                this.view.formTemplate12.pageTitleVisibility = true;
                this.view.formTemplate12.pageTitle = kony.i18n.getLocalizedString("i18n.accountsweeps.accountSweep");
            }
            if (width <= 1024 && width > 640) {
                isTablet = true;
            } else {
                isTablet = false;
            }
        },
        /**
         * Performs the actions required before rendering form
         */
        preShow: function() {
            contentPopupScope.setVisibility(false);
            var offsetLimit = pagination.getDefaultOffsetAndLimit();
            this.offset = offsetLimit.offset;
            recordsPerPage = offsetLimit.limit;
            pagination.fetchPaginatedRecords = this.fetchPaginatedRecords;
            pagination.resetStartIndex();
            pagination.collapseDropDown();
            this.resetForm();
        },
        /**
         * Performs the actions required after rendering form
         */
        postShow: function() {
            applicationManager.getNavigationManager().applyUpdates(this);
        },
        /**
         * Method to initialise form actions
         */
        initFormActions: function() {
            var scope = this;
            try {
                this.presenter = applicationManager.getModulesPresentationController({
                    appName: 'AccountSweepsMA',
                    moduleName: 'AccountSweepsUIModule'
                });
                contentScope = this.view.formTemplate12.flxContentTCCenter;
                contentPopupScope = this.view.formTemplate12.flxContentPopup;
                titleActionScope = this.view.formTemplate12.flxTCButtons;
                pagination = this.view.formTemplate12.flxContentTCCenter.pagination;
                formatUtilManager = applicationManager.getFormatUtilManager();
                contentScope.tbxSearch.text = "";
                contentScope.flxListDropDown.setVisibility(false);
                contentScope.lblFilterDropDown.text = ViewConstants.FONT_ICONS.THREE_DOTS_ACCOUNTS;
                contentScope.lblClear.setVisibility(false);
                contentScope.tbxSearch.onTouchStart = contentScope.flxListDropDown.setVisibility(false);
                contentScope.lblClear.onTouchEnd = function() {
                    contentScope.tbxSearch.text = "";
                    scope.performSearch();
                };
                contentScope.segFilterList.widgetDataMap = {
                    "flxFilterOptions": "flxFilterOptions",
                    "flxMain": "flxMain",
                    "lblRadio": "lblRadio",
                    "lblFilterValue": "lblFilterValue"
                };
                contentScope.flxPrimaryAccount.onClick = this.sort.bind(this, "primaryAccountName", contentScope.ImgSortIcon1);
                contentScope.flxSecondaryAccount.onClick = this.sort.bind(this, "secondaryAccountName", contentScope.ImgSortIcon2);
                contentScope.flxSweepCondition.onClick = this.sort.bind(this, "sweepType", contentScope.ImgSortIcon3);
                contentScope.tbxSearch.onTextChange = this.performSearch;
                contentScope.tbxSearch.onDone = this.performSearch.bind(this);
                contentScope.flxPagination.zIndex = 0;
                contentScope.flxFilter.onClick = this.toggleFilterDropDownVisibility.bind(this);
                contentScope.btnCreateNewSweep.onClick = function() {
                    scope.presenter.showSweepScreen({
                        context: "createSweep"
                    });
                };
            } catch (err) {
                var errorObj = {
                    "method": "initFormActions",
                    "error": err
                };
                this.onError(errorObj);
            }
        },
        /**
         * Entry point method for the form controller
         * @param {Object} viewModel - it contains the set of view properties and keys.
         */
        updateFormUI: function(viewModel) {
            if (viewModel.isLoading === true) {
                FormControllerUtility.showProgressBar(this.view);
            } else if (viewModel.isLoading === false) {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (viewModel.serverError) {
                this.showServerError(viewModel.serverError);
            }
            if (viewModel.sweeps) {
                this.sweepsData = viewModel.sweeps;
                pageNumber = 1;
                this.renderDataInDashboardList(this.getDataOfPage());
                pagination.updatePaginationBar(0, viewModel.sweeps.length);
            }
            if (viewModel.deletesweep) {
                this.view.formTemplate12.showBannerError({
                    i18n: kony.i18n.getLocalizedString('i18n.accountSweeps.successfullyDeleted'),
                    errorDetails: JSON.stringify(kony.i18n.getLocalizedString("kony.mb.common.refNumberColon") + " " + viewModel.deletesweep.serviceRequestId)
                });
            }
            if (viewModel.deleteFailure) {
                this.view.formTemplate12.showBannerError({
                    dbpErrMsg: kony.i18n.getLocalizedString('i18n.accountSweeps.SweepCouldNotBeDeleted'),
                    i18n: kony.i18n.getLocalizedString('i18n.accountSweeps.SweepCouldNotBeDeleted'),
                    errorDetails:  JSON.stringify(kony.i18n.getLocalizedString("i18n.accountSweeps.deleteFailureMessage") )
                });
                
            }
        },
        /**
         * Method to search the response data 
         */
        performSearch: function() {
            var searchtext = contentScope.tbxSearch.text.toLowerCase();
            contentScope.lblClear.setVisibility(searchtext.length >= 1);
            if (searchtext.length >= 3) {
                FormControllerUtility.showProgressBar();
                contentScope.segSweep.setVisibility(true);
                contentScope.segSweep.removeAll();
                let recordsData = applicationManager.getDataProcessorUtility().multipleCommonSegmentSearch(["primaryAccountNumber", "secondaryAccountNumber", "primaryAccountName", "secondaryAccountName", "serviceRequestId"], searchtext, this.sweepsData);
                if (recordsData.length > 0) {
                    this.renderDataInDashboardList(recordsData);
                } else {
                    this.showSearchView(true);
                }
                FormControllerUtility.hideProgressBar();
            } else {
                this.renderDataInDashboardList(this.sweepsData);
                this.showSearchView(false);
            }
        },
        /**
         * Method to perform the filter operation on  the response data 
         */
        toggleFilterDropDownVisibility: function() {
            try {
                if (contentScope.lblFilterDropDown.text === ViewConstants.FONT_ICONS.THREE_DOTS_ACCOUNTS) {
                    if (this.isFilterApplied) {
                        contentScope.segFilterList.setData(this.segFilterData);
                    } else {
                        this.setSweepFilterData();
                    }
                    contentScope.flxListDropDown.setVisibility(true);
                    contentScope.lblFilterDropDown.text = ViewConstants.FONT_ICONS.CHEVRON_UP;
                } else {
                    contentScope.flxListDropDown.setVisibility(false);
                    contentScope.lblFilterDropDown.text = ViewConstants.FONT_ICONS.THREE_DOTS_ACCOUNTS;
                }
            } catch (err) {
                var errorObj = {
                    "method": "toggleFilterDropDownVisibility",
                    "error": err
                };
                this.onError(errorObj);
            }
        },
        /**
         * Method to reset the data
         */
        resetForm: function() {
            contentScope.ImgSortIcon1.src = "sorting_next.png";
            contentScope.flxListDropDown.setVisibility(false);
            this.view.formTemplate12.hideBannerError();
            contentScope.lblConditions.text = kony.i18n.getLocalizedString("i18n.accountsweeps.allConditions");
            this.resetImages(contentScope.ImgSortIcon1);
            contentScope.lblClear.setVisibility(false);
            contentScope.tbxSearch.text = "";
            this.showNosweeps(false);
            this.showSearchView(false);
            this.isFilterApplied = false;
            contentScope.btnCreateNewSweep.setVisibility(this.presenter.checkUserPermission('ACCOUNT_SWEEP_CREATE'))
            contentScope.lblFilterDropDown.text = ViewConstants.FONT_ICONS.THREE_DOTS_ACCOUNTS;
            contentScope.ImgSortIcon1.toolTip = kony.i18n.getLocalizedString("i18n.accountsweeps.primaryAccounts");
            contentScope.ImgSortIcon2.toolTip = kony.i18n.getLocalizedString("i18n.accountsweeps.secondaryAccount");
            contentScope.ImgSortIcon3.toolTip = kony.i18n.getLocalizedString("i18n.accountSweeps.sweepConditionWithoutColon");
        },
        /**
         * Method to set the data to filter segment
         */
        setSweepFilterData: function() {
            try {
                this.segFilterData = [];
                this.segFilterData = [{
                    "lblRadio": ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO,
                    "lblFilterValue": kony.i18n.getLocalizedString("i18n.accountsweeps.allConditions"),
                    "flxMain": {
                        onClick: this.filterRowOnClick.bind(this)
                    }
                }, {
                    "lblRadio": ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO,
                    "lblFilterValue": kony.i18n.getLocalizedString("i18n.signatory.above"),
                    "flxMain": {
                        onClick: this.filterRowOnClick.bind(this)
                    }
                }, {
                    "lblRadio": ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO,
                    "lblFilterValue": kony.i18n.getLocalizedString("i18n.accountsweeps.below"),
                    "flxMain": {
                        onClick: this.filterRowOnClick.bind(this)
                    }
                }, {
                    "lblRadio": ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO,
                    "lblFilterValue": kony.i18n.getLocalizedString("i18n.accountsweeps.both"),
                    "flxMain": {
                        onClick: this.filterRowOnClick.bind(this)
                    }
                }];
                contentScope.segFilterList.setData(this.segFilterData);
            } catch (err) {
                var errorObj = {
                    "method": "setSweepFilterData",
                    "error": err
                };
                this.onError(errorObj);
            }
        },
        /**
         * Method to select filter datas
         */
        filterRowOnClick: function() {
            try {
                var segmentdata = contentScope.segFilterList.data;
                var index = contentScope.segFilterList.selectedRowIndex;
                var rowIndex = index[1];
                for (var i = 0; i < segmentdata.length; i++) {
                    if (i !== rowIndex) {
                        segmentdata[i].lblRadio = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                    }
                }
                segmentdata[rowIndex].lblRadio = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                contentScope.lblConditions.text = segmentdata[rowIndex].lblFilterValue;
                contentScope.flxListDropDown.setVisibility(false);
                contentScope.lblClear.setVisibility(false);
                contentScope.tbxSearch.text = "";
                contentScope.segFilterList.setData(segmentdata);
                this.isFilterApplied = true;
                this.segFilterData = segmentdata;
                contentScope.lblFilterDropDown.text = ViewConstants.FONT_ICONS.CHEVRON_DOWN;
                this.presenter.filterByValue = rowIndex === 0 ? "" : segmentdata[rowIndex].lblFilterValue;
                this.presenter.getAllsweeps();
            } catch (err) {
                var errorObj = {
                    "method": "filterRowOnClick",
                    "error": err
                };
                this.onError(errorObj);
            }
        },
        /**
         * Method to set listing data in the dashboard segment
         */
        renderDataInDashboardList: function(data) {
            try {
                var scope = this;
                if (data.length === 0) {
                    this.showNosweeps(true);
                    return;
                }
                let masterData = [];
                if (kony.application.getCurrentBreakpoint() > 640) {
                    contentScope.segSweep.rowTemplate = "flxSweepListingTemp";
                } else {
                    contentScope.segSweep.rowTemplate = "flxSweepListingTempMobile";
                }
                let template = contentScope.segSweep.rowTemplate;
                contentScope.segSweep.widgetDataMap = {
                    "lblCoulmn1": "lblCoulmn1",
                    "lblRowCoulmn1Key": "lblRowCoulmn1Key",
                    "lblRowCoulmn1Value": "lblRowCoulmn1Value",
                    "lblRowCoulmn2Key": "lblRowCoulmn2Key",
                    "lblRowCoulmn2Value": "lblRowCoulmn2Value",
                    "lblCoulmn2": "lblCoulmn2",
                    "lblRowCoulmn3Key": "lblRowCoulmn3Key",
                    "lblRowCoulmn3Value": "lblRowCoulmn3Value",
                    "lblRowCoulmn4Key": "lblRowCoulmn4Key",
                    "lblRowCoulmn4Value": "lblRowCoulmn4Value",
                    "lblCoulmn4": "lblCoulmn4",
                    "btnEdit": "btnEdit",
                    "btnAction": "btnAction",
                    "lblDropdown": "lblDropdown",
                    "flxIdentifier": "flxIdentifier",
                    "lblIdentifier": "lblIdentifier",
                    "flxSweepListingTemp": "flxSweepListingTemp",
                    "flxSweepListingTempMobile": "flxSweepListingTempMobile",
                    "flxManageBeneficiaries": "flxManageBeneficiaries",
                    "flxDropDown2": "flxDropDown2",
                    "flxDropdown": "flxDropdown",
                    "lblAccountName": "lblAccountName",
                    "lblCoulmn3": "lblCoulmn3",
                    "lblAccBalance": "lblAccBalance",
                    "lblSeparator": "lblSeparator",
                    "lblSeperatorMain": "lblSeperatorMain",
                    "lblTopSeparator": "lblTopSeparator",
                    "flxCoulmn2": "flxCoulmn2",
                    "flxCoulmn3": "flxCoulmn3",
                    "flxCoulmn4": "flxCoulmn4",
                    "flxBtnAction": "flxBtnAction",
                    "flxRowColumn2": "flxRowColumn2",
                    "flxRowColumn3": "flxRowColumn3",
                    "flxDetailAction": "flxDetailAction",
                    "flxRowColumn4": "flxRowColumn4",
                };
                data.map(response => {
                    var formattedPrimaryName = CommonUtilities.truncateStringWithGivenLength(response.primaryAccountName + "....", 26) + CommonUtilities.getLastFourDigit(response.primaryAccountNumber);
                    masterData.push({
                        "flxDropdown": {
                            "isVisible": true
                        },
                        "flxCoulmn2": {
                            "left": isTablet ? "27%" : "25%",
                        },
                        "flxCoulmn3": {
                            "left": isTablet ? "51.5%" : "49.5%",
                        },
                        "flxCoulmn4": {
                            "right": isTablet ? "18%" : "21%"
                        },
                        "flxBtnAction": {
                            "right": isTablet ? "4%" : "2.9%"
                        },
                        "flxDetailAction": {
                            "right": isTablet ? "4%" : "2.9%"
                        },
                        "flxRowColumn2": {
                            "left": isTablet ? "27%" : "25%",
                        },
                        "flxRowColumn3": {
                            "left": isTablet ? "51.5%" : "49.5%",
                        },
                        "flxRowColumn4": {
                            "left": isTablet ? "75.5%" : "74.5%"
                        },
                        "lblDropdown": {
                            "text": ViewConstants.FONT_ICONS.THREE_DOTS_ACCOUNTS
                        },
                        "flxIdentifier": {
                            "isVisible": false
                        },
                        "lblIdentifier": {
                            "skin": "sknLabelDummy"
                        },
                        "lblSeperatorMain": {
                            "isVisible": true
                        },
                        "lblSeparator": {
                            "isVisible": false
                        },
                        "flxSweepListingTemp": {
                            "height": "53dp",
                            "skin": "sknflxffffffnoborder"
                        },
                        "flxDropDown2": {
                            "isVisible": true
                        },
                        "flxSweepListingTempMobile": {
                            "height": "75dp"
                        },
                        "lblTopSeparator": {
                            "height": "1dp",
                            "bottom": "2dp",
                            isVisible: response.sweepType === "Both" ? true : false
                        },
                        "flxManageBeneficiaries": {
                            "height": "75dp",
                            "top": response.sweepType === "Both" ? "1dp" : "0dp",
                        },
                        "lblAccountName": {
                            "text": formattedPrimaryName
                        },
                        "lblAccBalance": {
                            "text": (response.sweepType === "Below") ? "Below" + formatUtilManager.appendCurrencySymbol(formatUtilManager.formatAmount(response.belowSweepAmount)) : (response.sweepType === "Above") ? "Above" + formatUtilManager.appendCurrencySymbol(formatUtilManager.formatAmount(response.aboveSweepAmount)) : (response.sweepType === "Both") ? ("Above" + " " + formatUtilManager.appendCurrencySymbol(formatUtilManager.formatAmount(response.aboveSweepAmount)) + "\n" + "Below" + " " + formatUtilManager.appendCurrencySymbol(formatUtilManager.formatAmount(response.belowSweepAmount))) : NA,
                        },
                        "lblCoulmn1": {
                            "text": formattedPrimaryName,
                            "width": isTablet ? "80%" : "100%",
                            "skin": isTablet ? "sknLblSSP15pxtrucation" : "slLabel0d8a72616b3cc47"
                        },
                        "lblCoulmn2": {
                            "text": CommonUtilities.truncateStringWithGivenLength(response.secondaryAccountName + "....", 26) + CommonUtilities.getLastFourDigit(response.secondaryAccountNumber),
                            "width": isTablet ? "80%" : "100%",
                            "skin": isTablet ? "sknLblSSP15pxtrucation" : "slLabel0d8a72616b3cc47"
                        },
                        "lblCoulmn3": {
                            "text": response.sweepType
                        },
                        "lblCoulmn4": {
                            "text": (response.sweepType === "Below") ? formatUtilManager.appendCurrencySymbol(formatUtilManager.formatAmount(response.belowSweepAmount), response.currencyCode) : (response.sweepType === "Above") ? formatUtilManager.appendCurrencySymbol(formatUtilManager.formatAmount(response.aboveSweepAmount), response.currencyCode) : (response.sweepType === "Both") ? ("Above" + " " + formatUtilManager.appendCurrencySymbol(formatUtilManager.formatAmount(response.aboveSweepAmount), response.currencyCode) + "\n" + "Below" + " " + formatUtilManager.appendCurrencySymbol(formatUtilManager.formatAmount(response.belowSweepAmount),response.currencyCode)) : NA
                        },
                        "lblRowCoulmn1Key": {
                            "text": kony.i18n.getLocalizedString("i18n.ChequeManagement.ReferenceNumber")
                        },
                        "lblRowCoulmn1Value": {
                            "text": response.serviceRequestId
                        },
                        "lblRowCoulmn2Key": {
                            "text": kony.i18n.getLocalizedString("i18n.transfers.lblFrequency")
                        },
                        "lblRowCoulmn2Value": {
                            "text": response.frequency
                        },
                        "lblRowCoulmn3Key": {
                            "text": kony.i18n.getLocalizedString("i18n.accountsweeps.startingFrom")
                        },
                        "lblRowCoulmn3Value": {
                            "text": response.startDate
                        },
                        "lblRowCoulmn4Key": {
                            "text": kony.i18n.getLocalizedString("i18n.transfers.end_date")
                        },
                        "lblRowCoulmn4Value": {
                            "text": response.endDate
                        },
                        "btnEdit": {
                            "isVisible":this.presenter.checkUserPermission('ACCOUNT_SWEEP_EDIT'),
                            "text": kony.i18n.getLocalizedString("i18n.accounts.edit"),
                            "onClick": function() {
                                scope.navigateBtnEdit(response);
                            }
                        },
                        "btnAction": {
                            "isVisible":this.presenter.checkUserPermission('ACCOUNT_SWEEP_DELETE'),
                            "text": kony.i18n.getLocalizedString("i18n.transfers.deleteExternalAccount"),
                            "onClick": function() {
                                scope.customPopup(response, formattedPrimaryName);
                            }
                        },
                        "template": template
                    });
                });
                this.showSearchView(false);
                sweepAccData = masterData;
                contentScope.segSweep.setData(masterData);
            } catch (err) {
                var errorObj = {
                    "method": "renderDataInDashboardList",
                    "error": err
                };
                this.onError(errorObj);
            }
        },
        /**
         * Method to set the data based on search criteria 
         */
        showSearchView: function(visible) {
            contentScope.segSweep.setVisibility(!visible);
            contentScope.flxNoAccounts.setVisibility(visible);
            contentScope.rtxNoAccounts.text = this.isFilterApplied ? kony.i18n.getLocalizedString("i18n.TransfersEur.noResults") : kony.i18n.getLocalizedString("i18n.payments.noSearchResultsFound");
            contentScope.flxPagination.setVisibility(!visible);
        },
        /**
         * Method to show No sweep banner if no records are found
         */
        showNosweeps: function(visible) {
            if (this.isFilterApplied) {
                this.showSearchView(true);
                return;
            }
            contentScope.flxSweepMainContent.setVisibility(!visible);
            contentScope.flxExistingSweepInfo.setVisibility(visible);
            contentScope.flxNoAccountSweep.setVisibility(visible);
            contentScope.flxSearchAndFilter.setVisibility(!visible);
            contentScope.flxPagination.setVisibility(!visible);
        },
        /**
         * Update sort icons and trigger a action to presentation controller to sort
         */
        sort: function(sortByParam, img) {
            this.presenter.sortByParam = sortByParam;
            if (img.src === "sorting_next.png" || img.src === "sortingfinal.png") {
                img.src = "sorting_previous.png";
                this.presenter.sortOrder = "desc";
            } else {
                img.src = "sorting_next.png";
                this.presenter.sortOrder = "asc";
            }
            this.resetImages(img);
            this.presenter.getAllsweeps();
        },
        /**
         * resetImages.
         * This method resets the sorting images.
         */
        resetImages: function(imageWidget) {
            for (var i = 1; i <= 3; i++) {
                if (imageWidget.id === ("ImgSortIcon" + i)) {
                    continue;
                }
                contentScope["ImgSortIcon" + i].src = "sortingfinal.png"
            }
        },
        /**
         * Method to handle delete popup 
         */
        customPopup: function(data, account) {
            let scope = this;
            let payload = {};
            payload.primaryAccountNumber = data.primaryAccountNumber;
            payload.secondaryAccountNumber = data.secondaryAccountNumber;
            payload.belowSweepAmount = this.presenter.isEmptyNullOrUndefined(data.belowSweepAmount) ? "" : data.belowSweepAmount;
            payload.aboveSweepAmount = this.presenter.isEmptyNullOrUndefined(data.aboveSweepAmount) ? "" : data.aboveSweepAmount;
            payload.frequency = data.frequency;
            payload.startDate = data.startDate;
            payload.endDate = this.presenter.isEmptyNullOrUndefined(data.endDate) ? "" : data.endDate;
            payload.primaryAccountName = data.primaryAccountName;
            payload.secondaryAccountName = data.secondaryAccountName;
            payload.currencyCode = data.currencyCode;
            let cancelPopupContext = {
                heading: kony.i18n.getLocalizedString("i18n.transfers.deleteExternalAccount"),
                message: kony.i18n.getLocalizedString("i18n.accountsweeps.deleteTheRule") + " " + account + "?",
                yesClick: function() {
                    scope.presenter.deleteSweep(payload, scope.view.id);
                },
            };
            this.view.formTemplate12.setPopup(cancelPopupContext);
        },
        /**
         * Method to navigate to Create New Sweep Form 
         */
        navigateBtnEdit: function(data) {
            data.isEdit = true;
            this.presenter.showSweepScreen({
                context: "createSweep"
            }, data);
        },
        /**
         * Method to get records of a particular page
         * @return {Array} Manage Beneficiaries of a particular page
         */
        getDataOfPage: function() {
            return this.sweepsData.slice((pageNumber - 1) * recordsPerPage, pageNumber * recordsPerPage);
        },
        /**
         * @function fetchPaginatedRecords
         * updates the segment based on the number of records per page selected or next/previous buttons are clicked
         * @input_arguement offset: offset of the record to be rendered in UI
         * @input_arguement noOfRecords: total number of beneficiary records
         * @return NA
         */
        fetchPaginatedRecords: function(offset, noOfRecords) {
            recordsPerPage = noOfRecords;
            this.offset = offset;
            if (offset === 0) {
                this.renderDataInDashboardList(this.sweepsData);
                this.offsetFlag = offset;
            } else {
                this.renderDataInDashboardList(this.sweepsData.slice(offset, offset + noOfRecords));
            }
            pagination.updatePaginationBar(noOfRecords, this.sweepsData.length);
        },
        /**
         * Method to show server error in form 
         * @param {String} errorMsg - Error Message from server
         */
        showServerError: function(errorMsg) {
            this.view.formTemplate12.showBannerError({
                dbpErrMsg: errorMsg
            });
            this.showSearchView(true);
        },
        /**
         * Error thrown from catch block of form controller
         */
        onError: function(err) {
            kony.print(JSON.stringify(err));
        },
    };
});


