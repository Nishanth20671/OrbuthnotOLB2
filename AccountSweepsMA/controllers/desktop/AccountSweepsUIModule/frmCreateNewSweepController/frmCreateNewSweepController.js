define(["FormControllerUtility", "CommonUtilities", "OLBConstants", "ViewConstants"], function (FormControllerUtility, CommonUtilities, OLBConstants, ViewConstants) {
    const NA = kony.i18n.getLocalizedString("i18n.common.NA");
    let Primary = "Primary";
    let Secondary = "Secondary";
    let PrimaryRecords = [];
    let SecondaryRecords = [];
    let filteredPrimaryAccounts = [];
    let filteredSecondaryAccounts = []
    let PrimarySelected = false;
    let SecondarySelected = false;
    let checkboxSelected = false;
    let amountEntered = false;
    let PrimaryAccountNumber;
    let PrimaryAccountName;
    let SecondaryAccountNumber;
    let SecondaryAccountName;
    let currencyCode;
    let isEdit = false;
    let selectedPrimaryaccount;
    let selectedSecondaryaccount;
    let previousSecondaryAccountNumber = "";
    let contentScope, contentPopupScope, titleActionScope;
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
        onBreakpointChange: function(form, width) {},
        /**
         * Performs the actions required before rendering form
         */
        preShow: function() {
            CommonUtilities.clearList();
            contentPopupScope.setVisibility(false);
            this.isSingleCustomerProfile = applicationManager.getUserPreferencesManager().isSingleCustomerProfile;
            frequency = Object.values(this.presenter.frequencies);
        },
        /**
         * Performs the actions required after rendering form
         */
        postShow: function() {
            applicationManager.getNavigationManager().applyUpdates(this);
            this.view.formTemplate12.pageTitle = kony.i18n.getLocalizedString("i18n.accountsweeps.createNewSweep");
            this.setSegFrequencyDropdownData();
            this.setPrimaryAccountsList();
            this.setSecondaryAccountsList();
            contentScope.flxLoadingIndicatorSecondary.setVisibility(false);
            contentScope.flxLoadingIndicatorPrimary.setVisibility(false);
            if (this.presenter.modifyData) {
                if (this.presenter.modifyData.isEdit && !this.presenter.modifyData.isModify) this.preFilldata()
            } else {
                this.resetForm();
                this.setBankDate();
            }
            contentScope.flxFrequency.onBlur = CommonUtilities.hideAllPopups;
            CommonUtilities.addToListner({
                widget: contentScope.flxFrequencyList,
                hideFunc: this.segDropdownExpandCollapse.bind(this, "lblFrequencyDropdownIcon", "flxFrequencyList")
            });
        },
        /**
         * Method to initialise form actions
         */
        initFormActions: function() {
            const scope = this;
            this.presenter = applicationManager.getModulesPresentationController({
                appName: 'AccountSweepsMA',
                moduleName: 'AccountSweepsUIModule'
            });
            contentScope = this.view.formTemplate12.flxContentTCCenter;
            contentPopupScope = this.view.formTemplate12.flxContentPopup;
            titleActionScope = this.view.formTemplate12.flxTCButtons;
            formatUtilManager = applicationManager.getFormatUtilManager();
            contentScope.flxFrequencyDropdown.onClick = scope.segDropdownExpandCollapse.bind(this, "lblFrequencyDropdownIcon", "flxFrequencyList");
            contentScope.flxCustomOption.onClick = scope.setCustomDate.bind(this);
            contentScope.flxManulaOption.onClick = scope.setManualDate.bind(this);
            contentScope.flxClose.onClick = function() {
                contentScope.flxInfoMessage.setVisibility(false);
            }.bind(this);
            this.renderCalendarSweepAccount();
            this.setSweepConditionUI();
            this.restrictSpecialCharacters();
            contentScope.tbxPrimaryAccount.onKeyUp = this.filterAccounts.bind(this, "Primary");
            contentScope.tbxSecondaryAccount.onKeyUp = this.filterAccounts.bind(this, "Secondary");
            contentScope.segPrimaryAccounts.onRowClick = this.onPrimaryAccountSelection.bind(this);
            contentScope.segSecondaryAccounts.onRowClick = this.onSecondaryAccountSelection.bind(this);
            contentScope.flxPrimaryTextBox.onClick = this.toggleAccountsDropdown.bind(this, "Primary");
            contentScope.flxSecondaryTextBox.onClick = this.toggleAccountsDropdown.bind(this, "Secondary");
            contentScope.tbxPrimaryAccount.onTouchStart = function() {
                this.toggleAccountsDropdown("Primary");
            }.bind(this);
            contentScope.tbxSecondaryAccount.onTouchStart = function() {
                this.toggleAccountsDropdown("Secondary");
            }.bind(this);
            contentScope.flxClearPrimaryText.onClick = this.clearAccountTextboxTexts.bind(this, "Primary");
            contentScope.flxClearSecondaryText.onClick = this.clearAccountTextboxTexts.bind(this, "Secondary");
            contentScope.btnCancel.onClick = this.viewDetails;
            contentScope.flxCheckBox1.onClick = this.toggleCheckbox.bind(this, "1");
            contentScope.flxCheckBox2.onClick = this.toggleCheckbox.bind(this, "2");
            contentScope.btnContinue.onClick = this.submitSweep.bind(this);
            contentScope.tbxAmount1.onTouchStart = () => {
                contentScope.tbxAmount1.text = scope.presenter.isEmptyNullOrUndefined(contentScope.tbxAmount1.text) ? "" : parseFloat(contentScope.tbxAmount1.text.replace(/,/g, '')).toString();
            }
            contentScope.tbxAmount2.onTouchStart = () => {
                contentScope.tbxAmount2.text = scope.presenter.isEmptyNullOrUndefined(contentScope.tbxAmount2.text) ? "" : parseFloat(contentScope.tbxAmount2.text.replace(/,/g, '')).toString();
            }
            contentScope.tbxAmount1.onEndEditing = this.amountFormat.bind(this, "1");
            contentScope.tbxAmount2.onEndEditing = this.amountFormat.bind(this, "2");
            contentScope.calStartDate.onSelection = () => scope.disableOldDaySelection(contentScope.calEndDate, this.presenter.isEmptyNullOrUndefined(contentScope.calStartDate) ? this.presenter.bankDate.currentWorkingDate : contentScope.calStartDate.formattedDate.split("/").reverse().join("-"));
            FormControllerUtility.disableTextbox(contentScope.tbxAmount1);
            FormControllerUtility.disableTextbox(contentScope.tbxAmount2);
            CommonUtilities.disableButton(contentScope.btnContinue);
        },
        /**
         * Method to navigate previous form onClick action of Cancel button
         */
        viewDetails: function() {
            if(kony.application.getPreviousForm().id == "frmAccountSweepDashboard" ){
                this.presenter.getAllsweeps();
        }
        else{
            var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountsUIModule",
                "appName": "HomepageMA"
            });
            accountsModule.presentationController.showAccountsDashboard();
        }
        },
        /**
         * Method to format the amount with commas
         */
        amountFormat: function(Id) {
            if (contentScope["tbxAmount" + Id].text != "") {
                contentScope["tbxAmount" + Id].text=!/^[0-9]/.test(contentScope["tbxAmount" + Id].text)?"":contentScope["tbxAmount" + Id].text;
                contentScope["tbxAmount" + Id].text = formatUtilManager.formatAmount(parseFloat(contentScope["tbxAmount" + Id].text.replace(/,/g, '')));
                this.amountEntered = true;
                this.validateForm();
            } else {
                contentScope["tbxAmount" + Id].text = "";
                this.amountEntered = false;
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
        },
        /**
         * Method to reset all the form actions and UI
         */
        resetForm: function() {
            contentScope.flxInfoMessage.setVisibility(true);
            contentScope.flxPrimaryAccountSegment.setVisibility(false);
            contentScope.flxNoPrimaryRecords.setVisibility(false);
            contentScope.flxErrorMessage.setVisibility(false);
            contentScope.flxPrimaryText.setVisibility(false);
            contentScope.flxClearPrimaryText.setVisibility(false);
            contentScope.flxPrimaryTextBox.setVisibility(true);
            contentScope.lblPrimaryRecordField.setVisibility(false);
            contentScope.tbxPrimaryAccount.setVisibility(true);
            contentScope.tbxPrimaryAccount.text = '';
            contentScope.lblPrimaryRecordField1.setVisibility(false);
            contentScope.flxSecondaryAccountSegment.setVisibility(false);
            contentScope.flxNoSecondaryRecords.setVisibility(false);
            contentScope.lblSecondaryRecordField.setVisibility(false);
            contentScope.tbxSecondaryAccount.setVisibility(true);
            contentScope.tbxSecondaryAccount.text = '';
            contentScope.lblSecondaryRecordField1.setVisibility(false);
            contentScope.flxSelectEndDate.setVisibility(false);
            contentScope.lblSelectedFrequency.text = "Daily";
            contentScope.imgCheck1.text = ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
            contentScope.imgCheck2.text = ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
            FormControllerUtility.disableTextbox(contentScope.tbxAmount1);
            FormControllerUtility.disableTextbox(contentScope.tbxAmount2);
            contentScope.tbxAmount1.text = "";
            contentScope.tbxAmount2.text = "";
            contentScope.tbxAmount1.maxTextLength = 15;
            contentScope.tbxAmount2.maxTextLength = 15;
            this.view.formTemplate12.hideBannerError();
            this.resetToggleCheckbox();
            this.PrimarySelected =  false;
            this.SecondarySelected =  false;
            this.selectedSecondaryaccount='';
            this.selectedPrimaryaccount='';
            this.setManualDate();
            this.hideFieldError();
            CommonUtilities.disableButton(contentScope.btnContinue);
        },
        /**
         * Method to pre-populate the data in the form onClick of edit 
         */
        preFilldata: function() {
            editData = this.presenter.modifyData;
            this.view.formTemplate12.pageTitle = kony.i18n.getLocalizedString("i18n.accountsweeps.editAccountSweep");
            this.preselectAccount(editData.primaryAccountNumber, "Primary");
            this.preselectAccount(editData.secondaryAccountNumber, "Secondary");
            if(this.selectedSecondaryaccount)this.filteredSecondaryAccounts.push(this.selectedSecondaryaccount)
            previousSecondaryAccountNumber = editData.secondaryAccountNumber;
            if (this.selectedPrimaryaccount) {
                this.isEdit = this.presenter.modifyData.isEdit;
                let accounts = this.removeSelectedAccount(this.selectedPrimaryaccount, this.filteredSecondaryAccounts);
                let filteredRecords = this.presenter.filterAccountsByMembershipId(this.selectedPrimaryaccount.Membership_id, accounts);
                this.setData(filteredRecords, "Secondary");
                this.PrimarySelected = true;
                contentScope.lblPrimaryText.text = CommonUtilities.truncateStringWithGivenLength(editData.primaryAccountName + "....", 26) + CommonUtilities.getLastFourDigit(editData.primaryAccountNumber);
                contentScope.flxPrimaryTextBox.setVisibility(false);
                contentScope.flxPrimaryText.setVisibility(true);
                contentScope.lblPrimaryText.skin = "bbSknLbl424242SSP15Px";
            }else{ 
                this.isEdit = false;
                contentScope.flxPrimaryTextBox.setVisibility(true);
                contentScope.flxPrimaryText.setVisibility(false);
            }
            if (this.selectedSecondaryaccount) {
               
                this.selectedSecondaryaccount.lblRecordField1 = CommonUtilities.truncateStringWithGivenLength(editData.secondaryAccountName + "....", 26) + CommonUtilities.getLastFourDigit(editData.secondaryAccountNumber);
                this.selectedSecondaryaccount.lblRecordField2 = (this.selectedSecondaryaccount.availableBalance ? CommonUtilities.formatCurrencyWithCommas(this.selectedSecondaryaccount.availableBalance, false, this.selectedSecondaryaccount.currencyCode) : (this.selectedSecondaryaccount.bankName));
                this.onSecondaryAccountSelection(this.selectedSecondaryaccount);
            }else{
                contentScope.lblSecondaryRecordField.text =  "";
                contentScope.lblSecondaryRecordField1.text = "";
                contentScope.tbxSecondaryAccount.setVisibility(true);
            }
            contentScope.flxInfoMessage.setVisibility(true);
            contentScope.flxErrorMessage.setVisibility(false);
            contentScope.tbxSecondaryAccount.text = '';
            contentScope.lblSelectedFrequency.text = editData.frequency;
            contentScope.tbxAmount1.text = this.presenter.isEmptyNullOrUndefined(editData.belowSweepAmount) ? "" : editData.belowSweepAmount;
            contentScope.tbxAmount2.text = this.presenter.isEmptyNullOrUndefined(editData.aboveSweepAmount) ? "" : editData.aboveSweepAmount;
            contentScope.lblSelectedCurrencySymbol1.text = formatUtilManager.getCurrencySymbol(editData.currencyCode);
            contentScope.lblSelectedCurrencySymbol2.text = formatUtilManager.getCurrencySymbol(editData.currencyCode);
            if (editData.sweepType == "Both") {
                this.editToggleCheckbox("1");
                this.editToggleCheckbox("2");
            }
            if (editData.sweepType == "Below") {
                this.editToggleCheckbox("1");
            }
            if (editData.sweepType == "Above") {
                this.editToggleCheckbox("2");
            }
            var bankDate = this.presenter.bankDate.currentWorkingDate || CommonUtilities.getServerDate();
            var startDate = editData.startDate.split("/").reverse().join("-");
            var endDate = this.presenter.isEmptyNullOrUndefined(editData.endDate) ? "" : editData.endDate.split("/").reverse().join("-");
            if (editData.startDate && formatUtilManager.getDateObjectfromString(startDate) > formatUtilManager.getDateObjectfromString(bankDate)) {
                contentScope.calStartDate.dateComponents = this.getServerDateComponents(startDate);
            } else if (editData.startDate && formatUtilManager.getDateObjectfromString(startDate) < formatUtilManager.getDateObjectfromString(bankDate)) {
                contentScope.calStartDate.dateComponents = this.getServerDateComponents(bankDate);
            }
            if (editData.endDate && formatUtilManager.getDateObjectfromString(endDate) > formatUtilManager.getDateObjectfromString(bankDate)) {
                contentScope.calEndDate.dateComponents = this.getServerDateComponents(endDate);
            } else if (editData.endDate && formatUtilManager.getDateObjectfromString(endDate) < formatUtilManager.getDateObjectfromString(bankDate)) {
                contentScope.calEndDate.dateComponents = this.getServerDateComponents(bankDate);
            }
            this.presenter.isEmptyNullOrUndefined(editData.endDate) ? this.setManualDate() : this.setCustomDate();
            contentScope.flxLoadingIndicatorSecondary.setVisibility(false);
            this.enableOrDisableContinueButton();
        },
        /**
         * Method to check the pre selected account
         * @param {String} id - it contains the account id .
         *  @param {String} type - it contains the type of sweep account(Primary or Secondary) .
         * @returns - it returns account Id
         */
        preselectAccount: function(id, type) {
            let accounts = this.presenter.filteredEditAccounts
            index = accounts.findIndex(object => {
                return object.accountID === id;
            });
            this["selected" + type + "account"] = accounts[index];
            
        },
         /**
         * Method to toggle the check box in edit flow
         * @param {String} id - it contains the widget id .
         */
        editToggleCheckbox: function(id) {
            this.resetToggleCheckbox();
            FormControllerUtility.enableTextbox(contentScope["tbxAmount" + id]);
            contentScope["imgCheck" + id].text = ViewConstants.FONT_ICONS.CHECBOX_SELECTED;
            if (id === "1") contentScope["tbxAmount" + id].text = formatUtilManager.formatAmount(editData.belowSweepAmount);
            if (id === "2") contentScope["tbxAmount" + id].text = formatUtilManager.formatAmount(editData.aboveSweepAmount);
            contentScope["tbxAmount" + id].skin = "ICSknTextBox424242";
            this.checkboxSelected = true;
        },
        /**
         * Method to reset the toggled check box
         * @param {String} id - it contains the widget id .
         */
        resetToggleCheckbox: function() {
            for (i = 1; i <= 2; i++) {
                contentScope["imgCheck" + i].text = ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
                contentScope["tbxAmount" + i].skin = "ICSknTbxDisabledSSPreg42424215px";
                contentScope["tbxAmount" + i].text = "";
            }
        },
        /**
         * Method to submit the form Details to the sweep confirmation page
         */
        submitSweep: function() {
            if (this.validateForm()) {
                var data = this.getFormDetails();
                this.presenter.showConfirmation(data);
            }
        },
         /**
         * Method to get the details of a filled form
         * @returns {object} formDetails - collection of form details
         */
        getFormDetails: function() {
            var formDetails = {};
            formDetails.formattedprimaryAccountNumber = this.selectedPrimaryaccount.lblRecordField1 ? this.selectedPrimaryaccount.lblRecordField1 : contentScope.lblPrimaryText.text
            formDetails.formattedsecondaryAccountNumber = this.selectedSecondaryaccount.lblRecordField1 ? this.selectedSecondaryaccount.lblRecordField1 : contentScope.lblSecondaryRecordField.text;
            formDetails.primaryAccountNumber = this.selectedPrimaryaccount.accountID;
            formDetails.secondaryAccountNumber = this.selectedSecondaryaccount.accountID;
            formDetails.primaryAccountName = this.selectedPrimaryaccount.accountName
            formDetails.secondaryAccountName = this.selectedSecondaryaccount.accountName
            formDetails.previousSecondaryAccountNumber = this.selectedSecondaryaccount.accountID === previousSecondaryAccountNumber?previousSecondaryAccountNumber:"";
            formDetails.frequency = contentScope.lblSelectedFrequency.text;
            formDetails.belowSweepAmount = this.presenter.isEmptyNullOrUndefined(contentScope.tbxAmount1.text) ? "" : contentScope.tbxAmount1.text.replace(/,/g, '');
            formDetails.aboveSweepAmount = this.presenter.isEmptyNullOrUndefined(contentScope.tbxAmount2.text) ? "" : contentScope.tbxAmount2.text.replace(/,/g, '');
            formDetails.startDate = contentScope.calStartDate.formattedDate;
            formDetails.endDate = contentScope.lblManualOption.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO ? kony.i18n.getLocalizedString("i18n.accountsweeps.endManually") : contentScope.calEndDate.formattedDate;
            formDetails.currencyCode = formatUtilManager.getCurrencySymbolCode(contentScope.lblSelectedCurrencySymbol1.text);
            formDetails.formattedcurrencyCode = contentScope.lblSelectedCurrencySymbol1.text;
            formDetails.isEdit = this.isEdit;
            if (contentScope.imgCheck1.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED && contentScope.imgCheck2.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                formDetails.sweepType = "Both";
            } else if (contentScope.imgCheck1.text === ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                formDetails.sweepType = "Below";
            } else {
                formDetails.sweepType = "Above";
            }
            return formDetails;
        },
          /**
         * Method to get the bank server date or the current working date.
         */
        setBankDate: function() {
            var bankDate = this.presenter.bankDate.currentWorkingDate || CommonUtilities.getServerDate();
            this.disableOldDaySelection(contentScope.calStartDate, bankDate);
            this.disableOldDaySelection(contentScope.calEndDate, this.presenter.isEmptyNullOrUndefined(contentScope.calStartDate) ? this.presenter.bankDate.currentWorkingDate : contentScope.calStartDate.formattedDate.split("/").reverse().join("-"));
        },
        /**
         * Method to disable the selection of past dates and sets the date range for a calendar widget.
         * @param {String} widgetId - calendar widget ID
         * @param {String} bankDate - calendar widget's date selection will be disabled for backdated dates of bankDate
         */
        disableOldDaySelection: function(widgetId, bankDate) {
            var numberOfYearsAllowed = OLBConstants.CALENDAR_ALLOWED_FUTURE_YEARS;
            var today = new Date(bankDate);
            var futureDate = new Date(today.getTime() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 365 /*days*/ * numberOfYearsAllowed));
            if (widgetId == contentScope.calStartDate) {
                widgetId.enableRangeOfDates([today.getDate(), today.getMonth() + 1, today.getFullYear()], [futureDate.getDate(), futureDate.getMonth() + 1, futureDate.getFullYear()], "skn", true);
                widgetId.dateComponents = [today.getDate(), today.getMonth() + 1, today.getFullYear()];
            }
            if (widgetId == contentScope.calEndDate) {
                widgetId.enableRangeOfDates([today.getDate() + 1, today.getMonth() + 1, today.getFullYear()], [futureDate.getDate(), futureDate.getMonth() + 1, futureDate.getFullYear()], "skn", true);
                widgetId.dateComponents = [today.getDate() + 1, today.getMonth() + 1, today.getFullYear()];
            }
        },
       
          /**
         * Method to validate amount in textbox and calendar dates
         * @returns {boolean} - enables or disables continue button based on validations
         */
        validateForm: function() {
            var sendOnDate = formatUtilManager.getDateObjectFromDateComponents(contentScope.calStartDate.dateComponents);
            var currDateComponent = this.presenter.bankDate.currentWorkingDate ? this.getServerDateComponents(this.presenter.bankDate.currentWorkingDate) : CommonUtilities.getServerDateComponent();
            var currDate = formatUtilManager.getDateObjectFromDateComponents(currDateComponent);
            var endOnDate = formatUtilManager.getDateObjectFromDateComponents(contentScope.calEndDate.dateComponents);
            if (contentScope.lblCustomOption.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO) {
                if (endOnDate.getTime() < currDate.getTime()) {
                    this.showFieldError("i18n.transfers.errors.invalidEndOnDate");
                    contentScope.calEndDate.skin = ViewConstants.SKINS.SKNFF0000CAL;
                    return false;
                }
                if (endOnDate.getTime() === sendOnDate.getTime()) {
                    this.showFieldError("i18n.transfers.errors.sameEndDate");
                    contentScope.calEndDate.skin = ViewConstants.SKINS.SKNFF0000CAL;
                    return false;
                }
                if (endOnDate.getTime() < sendOnDate.getTime()) {
                    this.showFieldError("i18n.transfers.errors.beforeEndDate");
                    contentScope.calEndDate.skin = ViewConstants.SKINS.SKNFF0000CAL;
                    return false;
                } else if (endOnDate.getTime() > sendOnDate.getTime()) {
                    this.hideFieldError();
                    contentScope.calEndDate.skin = ViewConstants.SKINS.COMMON_CALENDAR_NOERROR;
                }
            }
            if ((contentScope.tbxAmount1.text == "" && contentScope.imgCheck1.text == ViewConstants.FONT_ICONS.CHECBOX_SELECTED) || (contentScope.tbxAmount2.text == "" && contentScope.imgCheck2.text == ViewConstants.FONT_ICONS.CHECBOX_SELECTED)) {
                this.showFieldError("i18n.accountsweeps.pleaseEnterAmount");
                this.amountEntered = false;
                return false;
            }
            if ((contentScope.tbxAmount1.text != "" && contentScope.imgCheck1.text == ViewConstants.FONT_ICONS.CHECBOX_SELECTED) || (contentScope.tbxAmount2.text != "" && contentScope.imgCheck2.text == ViewConstants.FONT_ICONS.CHECBOX_SELECTED)) {
                this.hideFieldError();
            }
            if ((contentScope.tbxAmount1.text != "" && contentScope.imgCheck1.text == ViewConstants.FONT_ICONS.CHECBOX_SELECTED) && (contentScope.tbxAmount2.text != "" && contentScope.imgCheck2.text == ViewConstants.FONT_ICONS.CHECBOX_SELECTED)) {
                if ((parseFloat(contentScope.tbxAmount1.text.replace(/,/g, '')) > parseFloat(contentScope.tbxAmount2.text.replace(/,/g, '')))) {
                    contentScope.tbxAmount2.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
                    this.showFieldError("i18n.accountSweeps.sweepAmountValidate");
                    return false;
                }
            }
            if ((contentScope.tbxAmount1.text != "" && contentScope.imgCheck1.text == ViewConstants.FONT_ICONS.CHECBOX_SELECTED) && (contentScope.tbxAmount2.text != "" && contentScope.imgCheck2.text == ViewConstants.FONT_ICONS.CHECBOX_SELECTED)) {
                if ((parseFloat(contentScope.tbxAmount1.text.replace(/,/g, '')) < parseFloat(contentScope.tbxAmount2.text.replace(/,/g, '')))) {
                    this.hideFieldError();
                }
            }
            if (parseFloat(contentScope.tbxAmount1.text.replace(/,/g, '')) < 1) {
                contentScope.tbxAmount1.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
                this.showFieldError("i18n.accountsweeps.pleaseEnterAmount");
                return false;
            }
            if (parseFloat(contentScope.tbxAmount2.text.replace(/,/g, '')) < 1) {
                contentScope.tbxAmount2.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
                this.showFieldError("i18n.accountSweeps.PleaseEntervalidAmount");
                return false;
            }
            if ((parseFloat(contentScope.tbxAmount1.text.replace(/,/g, '')) < parseFloat(contentScope.tbxAmount2.text.replace(/,/g, ''))) || parseFloat(contentScope.tbxAmount1.text.replace(/,/g, '')) > 1 || parseFloat(contentScope.tbxAmount2.text.replace(/,/g, '')) > 1) {
                this.hideFieldError();
            }
            contentScope.calEndDate.skin = ViewConstants.SKINS.COMMON_CALENDAR_NOERROR;
            return true;
        },
        /**
         * Method to restrict special charcters for amount and allow only numbers
         */
        restrictSpecialCharacters: function() {
            var specialCharactersSet = "~#^|$%&*!@()_-+=}{][/|?,.><`':;\"\\";
            var alphabetsSet = "abcdefghijklmnopqrstuvwxyz";
            contentScope.tbxAmount1.restrictCharactersSet = specialCharactersSet.replace(',.', '') + alphabetsSet + alphabetsSet.toUpperCase();
            contentScope.tbxAmount2.restrictCharactersSet = specialCharactersSet.replace(',.', '') + alphabetsSet + alphabetsSet.toUpperCase();
        },
        /**
         * Method to get the date components
         * @param {object} dateString date string
         * @returns {object} date components
         */
        getServerDateComponents: function(dateString) {
            var dateObj = formatUtilManager.getDateObjectfromString(dateString, formatUtilManager.getDateFormat().toUpperCase());
            return [dateObj.getDate(), dateObj.getMonth() + 1, dateObj.getFullYear()];
        },
        /**
         * Method to show error field with error message when error occured during validation
         * @param {String} errorKey i18n key
         */
        showFieldError: function(errorKey) {
            //     this.view.lblWarning.setVisibility(true);
            CommonUtilities.setText(contentScope.lblErrorMessage, kony.i18n.getLocalizedString(errorKey), CommonUtilities.getaccessibilityConfig());
            contentScope.flxErrorMessage.setVisibility(true);
            if (contentScope.tbxAmount1.text == "" && contentScope.imgCheck1.text == ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                contentScope.tbxAmount1.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
                this.checkboxSelected = false;
            } else if (contentScope.tbxAmount2.text == "" && contentScope.imgCheck2.text == ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                contentScope.tbxAmount2.skin = ViewConstants.SKINS.SKNTXTSSP424242BORDERFF0000OP100RADIUS2PX;
                this.checkboxSelected = false;
            }
            if (errorKey == 'i18n.payments.payDueAmountErrorMessage') {
                this.checkboxSelected = false;
            }
            contentScope.flxErrorMessage.setVisibility(true);
            this.enableOrDisableContinueButton();
        },
         /**
         * Method to hide error field when their is no error occured during validation
         */
        hideFieldError: function() {
            if (contentScope.tbxAmount1.text != "" && contentScope.imgCheck1.text == ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                contentScope.tbxAmount1.skin = "ICSknTextBox424242";
                this.checkboxSelected = true;
            }
            if (contentScope.tbxAmount2.text != "" && contentScope.imgCheck1.text == ViewConstants.FONT_ICONS.CHECBOX_SELECTED) {
                contentScope.tbxAmount2.skin = "ICSknTextBox424242";
                this.checkboxSelected = true;
            }
           
            contentScope.flxErrorMessage.setVisibility(false);
            this.enableOrDisableContinueButton();
        },
         /**
         * Method to toggle checkbox
         * @param {String} selectedcheckbox - for widget ID
         */
        toggleCheckbox: function(selectedcheckbox) {
            if (contentScope["imgCheck" + selectedcheckbox].text === ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED) {
                this.checkboxSelected = true;
                FormControllerUtility.enableTextbox(contentScope["tbxAmount" + selectedcheckbox]);
                contentScope["imgCheck" + selectedcheckbox].text = ViewConstants.FONT_ICONS.CHECBOX_SELECTED;
                contentScope["tbxAmount" + selectedcheckbox].skin = "ICSknTextBox424242";
            } else {
                this.checkboxSelected = false;
                this.amountEntered = false;
                contentScope["imgCheck" + selectedcheckbox].text = ViewConstants.FONT_ICONS.CHECBOX_UNSELECTED;
                contentScope["tbxAmount" + selectedcheckbox].skin = "ICSknTbxDisabledSSPreg42424215px";
                contentScope["tbxAmount" + selectedcheckbox].text = "";
                FormControllerUtility.disableTextbox(contentScope["tbxAmount" + selectedcheckbox]);
                this.hideFieldError();
            }
            this.enableOrDisableContinueButton();
        },
        /**
         * @api : renderCalendarSweepAccount
         * This function UI of Calendar
         * @return : NA
         */
        renderCalendarSweepAccount: function() {
            var context1 = {
                "widget": contentScope.flxCalStartDate,
                "anchor": "bottom"
            };
            contentScope.calStartDate.setContext(context1);
            var context2 = {
                "widget": contentScope.flxCalEndDate,
                "anchor": "bottom"
            };
            contentScope.calEndDate.setContext(context2);
        },
        /**
         * @api : segDropdownExpandCollapse
         * This function handles expand and collapse of segLCDropdown
         * @param {String} labelID - label widget Id for frequence
         * @param {String} FlxID - flex widget Id for frequency dropdown
         * @return : NA
         */
        segDropdownExpandCollapse: function(labelID, flxID) {
            if (contentScope[labelID].text === "O") {
                contentScope[flxID].setVisibility(true);
                contentScope[labelID].text = "P";
            } else {
                contentScope[flxID].setVisibility(false);
                contentScope[labelID].text = "O";
            }
        },
        /**
         * @api : setsegFrequencyListData
         * This function sets widget data mapping for All Guarantees & Standby LC dropdown
         * @return : NA
         */
        setSegFrequencyDropdownData: function() {
            var scope = this;
            var segFrequencyData = [],
                i;
            contentScope.segFrequencyList.rowTemplate = "flxFrequencyListDropdown"
            contentScope.segFrequencyList.widgetDataMap = {
                "flxFrequencyListDropdown": "flxFrequencyListDropdown",
                "lblListValue": "lblListValue",
            };
            for (i = 0; i < frequency.length; i++) {
                segFrequencyData[i] = {
                    "lblListValue": {
                        "text": kony.i18n.getLocalizedString(frequency[i]),
                        "isVisible": true,
                    },
                    "flxFrequencyListDropdown": {
                        "onClick": scope.segFrequencyListOnclick.bind(this),
                        "isVisible": true,
                    }
                };
            }
            contentScope.segFrequencyList.setData(segFrequencyData);
        },
        /**
         * @api : segFrequencyListOnclick
         * This function handles onClick of each row in segLCDropdown
         * @return : NA
         */
        segFrequencyListOnclick: function() {
            let segmentdata = JSON.parse(JSON.stringify(contentScope.segFrequencyList.data));
            var rowIndex = contentScope.segFrequencyList.selectedRowIndex[1];
            contentScope.lblSelectedFrequency.text = segmentdata[rowIndex].lblListValue.text;
            selectedCurrency = frequency[rowIndex];
            contentScope.flxFrequencyList.setVisibility(false);
            contentScope.lblFrequencyDropdownIcon.text = "O";
        },
         /**
         * Method to set custom date onClick of Custom Date radio button
         */
        setCustomDate: function() {
            contentScope.lblManualOption.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
            contentScope.lblManualOption.skin = "ICSknLblRadioBtnUnelectedFontIcona0a0a020px";
            contentScope.lblCustomOption.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
            contentScope.lblCustomOption.skin = "ICSknLblRadioBtnSelectedFontIcon003e7520px";
            contentScope.flxSelectEndDate.setVisibility(true);
        },
         /**
         * Method to set date manually onClick of End Manually radio button
         */
        setManualDate: function() {
            contentScope.lblManualOption.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
            contentScope.lblManualOption.skin = "ICSknLblRadioBtnSelectedFontIcon003e7520px";
            contentScope.lblCustomOption.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
            contentScope.lblCustomOption.skin = "ICSknLblRadioBtnUnelectedFontIcona0a0a020px";
            contentScope.flxSelectEndDate.setVisibility(false);
        },
          /**
         * Method to set Responsive UI for Sweep Condition Input Flex Container
         */
        setSweepConditionUI: function() {
            //row1
            contentScope.lblPreCondition1.doLayout = function(widgetRef) {
                this.updateWidgetInInfo(widgetRef);
                contentScope.flxCondition1.width = contentScope.lblPreCondition1.info.frame.x + contentScope.lblPreCondition1.info.frame.width + "px";
                contentScope.flxConditionAndAmount1.width = contentScope.lblPreCondition1.info.frame.x + contentScope.lblPreCondition1.info.frame.width + 10 + 180 + "px";
                this.checkAndReorderRow1();
            }.bind(this);
            contentScope.lblPostCondition1.doLayout = function(widgetRef) {
                this.updateWidgetInInfo(widgetRef);
                this.checkAndReorderRow1();
            }.bind(this);
            contentScope.flxSweepCondition1.doLayout = function(widgetRef) {
                this.updateWidgetInInfo(widgetRef);
                this.checkAndReorderRow1();
            }.bind(this);
            //row2
            contentScope.lblPreCondition2.doLayout = function(widgetRef) {
                this.updateWidgetInInfo(widgetRef);
                contentScope.flxCondition2.width = contentScope.lblPreCondition2.info.frame.x + contentScope.lblPreCondition2.info.frame.width + "px";
                contentScope.flxConditionAndAmount2.width = contentScope.lblPreCondition2.info.frame.x + contentScope.lblPreCondition2.info.frame.width + 10 + 200 + "px";
                this.checkAndReorderRow2();
            }.bind(this);
            contentScope.lblPostCondition2.doLayout = function(widgetRef) {
                this.updateWidgetInInfo(widgetRef);
                this.checkAndReorderRow2();
            }.bind(this);
            contentScope.flxSweepCondition2.doLayout = function(widgetRef) {
                this.updateWidgetInInfo(widgetRef);
                this.checkAndReorderRow2();
            }.bind(this);
        },
         /**
         * Method to set primary sweep accounts list in the segment dropdown
         */
        setPrimaryAccountsList: function() {
            this.setAccountsSegmentTemplateAndWidgetMap(contentScope.segPrimaryAccounts);
            this.filteredPrimaryAccounts = this.presenter.filteredAccounts;
            this.setData(this.filteredPrimaryAccounts, "Primary");
        },
         /**
         * Method to set secondary sweep accounts list in the segment dropdown
         */
        setSecondaryAccountsList: function() {
            this.setAccountsSegmentTemplateAndWidgetMap(contentScope.segSecondaryAccounts);
            this.filteredSecondaryAccounts = this.presenter.filteredAccounts;
            this.setData(this.filteredSecondaryAccounts, "Secondary");
        },
         /**
         * Method to set data into accounts segment
         * @param {object} filterData - it fetches the filtered accounts data
         * @param {String} type - Prinmary or secondary type account
         */
        setData: function(filterData, type) {
            this[type + "Records"] = filterData;
            //this.showLoadingIndicator(false, type);
            let data = this.isSingleCustomerProfile ? this.getDataWithAccountTypeSections(filterData, type) : this.getDataWithSections(filterData, type);
            contentScope["seg" + type + "Accounts"].setData(data);
        },
        /**
         * Method to filter accounts based on search, selection and clear functionality.
         * @param { String}  fieldType - Primary or Secondary type account
         */
        filterAccounts: function(fieldType) {
            var searchText = contentScope["tbx" + fieldType + "Account"].text.toLowerCase();
            contentScope["flxClear" + fieldType + "Text"].setVisibility(true);
            if (searchText != "") {
                var result = [];
                var data = this[fieldType + "Records"];
                var result = data.filter(function(account) {
                    return CommonUtilities.substituteforIncludeMethod(account.nickName.toLowerCase(), searchText) || CommonUtilities.substituteforIncludeMethod(account.accountID, searchText)
                })
                if (!(result.length > 0)) {
                    contentScope["flx" + fieldType + "AccountSegment"].setVisibility(false);
                    contentScope["flxNo" + fieldType + "Records"].setVisibility(true);
                } else {
                    this.setData(result, fieldType)
                    contentScope["flx" + fieldType + "AccountSegment"].setVisibility(true);
                    contentScope["flxNo" + fieldType + "Records"].setVisibility(false);
                }
            } else {
                this[fieldType + "Selected"] = false;
                this["selected" + fieldType + "account"] = null;
                contentScope["flx" + fieldType + "AccountSegment"].setVisibility(true);
                contentScope["flxNo" + fieldType + "Records"].setVisibility(false);
                contentScope["flxClear" + fieldType + "Text"].setVisibility(false);
                contentScope["lbl" + fieldType + "RecordField"].text = "";
                contentScope["lbl" + fieldType + "RecordField1"].text = "";
                this.filterBasedonMemshipId(this["filtered" + fieldType + "Accounts"], fieldType);
                CommonUtilities.disableButton(contentScope.btnContinue);
            }
        },
         /**
         * Method to filter accounts based on Membership ID
         * @param {object} accounts - collection of accounts
         * @param {String} type - Primary or Secondary type account
         */
        filterBasedonMemshipId: function(accounts, type) {
            if (type === "Secondary" && this.selectedPrimaryaccount) {
                records = this.removeSelectedAccount(this.selectedPrimaryaccount, accounts);
                accounts = this.presenter.filterAccountsByMembershipId(this.selectedPrimaryaccount.Membership_id, records);
            }
            if (type === "Primary" && this.selectedSecondaryaccount) {
                records = this.removeSelectedAccount(this.selectedSecondaryaccount, accounts);
                accounts = this.presenter.filterAccountsByMembershipId(this.selectedSecondaryaccount.Membership_id, records);
            }
            this.setData(accounts, type)
        },
         /**
         * Method to set segment data and widget data mapping
         * @param {object} segWidget- accounts segment widget data
         */
        setAccountsSegmentTemplateAndWidgetMap: function(segWidget) {
            if (kony.application.getCurrentBreakpoint() === 640) {
                segWidget.sectionHeaderTemplate = "flxAccountSweepDropdownHeaderMobile";
                segWidget.rowTemplate = "flxAccountSweepDropdownListMobile";
            } else {
                segWidget.sectionHeaderTemplate = "flxAccountDropdownHeader";
                segWidget.rowTemplate = "flxAccountsDropdown";
            }
            segWidget.widgetDataMap = {
                "lblRecordType": "lblRecordType",
                "lblDropdownIcon": "lblDropdownIcon",
                "flxRecordFieldType": "flxRecordFieldType",
                "lblRecordField1": "lblRecordField1",
                "lblRecordField2": "lblRecordField2",
                "flxRecordFieldTypeIcon1": "flxRecordFieldTypeIcon1",
                "flxRecordFieldTypeIcon2": "flxRecordFieldTypeIcon2",
                "lblRecordFieldTypeIcon1": "lblRecordFieldTypeIcon1",
                "imgRecordFieldTypeIcon2": "imgRecordFieldTypeIcon2",
                "lblRecordField3": "lblRecordField3",
                "flxAccountsDropdown": "flxAccountsDropdown",
                "flxAccountsDropdownListMobile": "flxAccountsDropdownListMobile",
                "flxDropdownIcon": "flxDropdownIcon"
            };
        },
        /** 
        *create segment data with account type grouping
        *@param {object} accounts - collection of all accounts data
        *@param {String} typeOfTransfer - differentiate whether it is "Primary" or "Secondary" account transaction
        */
        getDataWithAccountTypeSections: function(accounts, typeOfTransfer) {
            var scopeObj = this;
            var finalData = {};
            accounts.forEach(function(account) {
                var accountType = account.accountType;
                if (finalData.hasOwnProperty(accountType)) {
                    finalData[accountType][1].push(scopeObj.createSegmentData(account, typeOfTransfer));
                    var totalAccount = finalData[accountType][1].length;
                    finalData[accountType][0].lblAccountTypeNumber = {
                        "text": "(" + totalAccount + ")"
                    }
                } else {
                    finalData[accountType] = [{
                            lblRecordType: {
                                text: accountType,
                                left: "10dp"
                            },
                            flxBottomSeparator: {
                                "isVisible": true
                            },
                            lblDropdownIcon: "P",
                            flxDropdownIcon: {
                                "onClick": function(context) {
                                    scopeObj.showOrHideAccountRows(context,typeOfTransfer);
                                }.bind(this),
                                "isVisible": true
                            },
                            template: "flxAccountDropdownHeader",
                        },
                        [scopeObj.createSegmentData(account, typeOfTransfer)]
                    ];
                }
            });
            this.sectionData = [];
            var data = [];
            for (var key in this.presenter.allowedAccountTypes) {
                var accountType = this.presenter.allowedAccountTypes[key];
                if (finalData.hasOwnProperty(accountType)) {
                    data.push(finalData[accountType]);
                    this.sectionData.push(accountType);
                }
            }
            return data;
        },
        /**
         * creates segment with account numbers and other details with particular header values
         * @param accounts - fetches all accounts data
         * @param typeOfTransfer - differentiate whether it is "Primary" or "Secondary" account transaction
         */
        getDataWithSections: function(accounts, typeOfTransfer) {
            var scopeObj = this;
            var finalData = {};
            var prioritizeAccountTypes = ["Personal Accounts"];
            accounts.forEach(function(account) {
                var accountType = "Personal Accounts";
                var accountTypeIcon = "";
                var primaryCustomerId = applicationManager.getUserPreferencesManager().primaryCustomerId;
                if (account.isBusinessAccount === "false") {
                    if (primaryCustomerId.id === account.Membership_id && primaryCustomerId.type === 'personal') {
                        accountType = "Personal Accounts";
                        accountTypeIcon = "s";
                    } else {
                        accountType = account.Membership_id;
                        accountTypeIcon = "s";
                    }
                } else {
                    accountType = account.Membership_id;
                    accountTypeIcon = "r";
                }
                if (finalData.hasOwnProperty(accountType) && account.Membership_id === finalData[accountType][0]["membershipId"]) {
                    if (finalData[accountType][1][finalData[accountType][1].length - 1].length === 0) {
                        finalData[accountType][1].pop();
                    }
                    finalData[accountType][1].push(scopeObj.createSegmentData(account, typeOfTransfer));
                } else {
                    if (accountType != "Personal Accounts") {
                        prioritizeAccountTypes.push(accountType);
                    }
                    finalData[accountType] = [{
                            lblRecordType: accountType === "Personal Accounts" ? accountType : account.MembershipName,
                            flxBottomSeparator: {
                                "isVisible": true
                            },
                            lblDropdownIcon: "P",
                            flxDropdownIcon: {
                                "onClick": function(context) {
                                    scopeObj.showOrHideAccountRows(context, typeOfTransfer);
                                }.bind(this)
                            },
                            template: "flxAccountDropdownHeader",
                            membershipId: account.Membership_id
                        },
                        [scopeObj.createSegmentData(account, typeOfTransfer)]
                    ];
                }
            });
            var data = [];
            for (var key in prioritizeAccountTypes) {
                var accountType = prioritizeAccountTypes[key];
                if (finalData.hasOwnProperty(accountType)) {
                    data.push(finalData[accountType]);
                }
            }
            return data;
        },
        /**
         *  creates the row template with account number and other details
         *  @param accounts - fetches all accounts data
         *  @param typeOfTransfer - differentiate whether it is "to" or "from" account transaction 
         */
        createSegmentData: function(account, typeOfTransfer) {
            var fromOrToAccountNumber = (typeOfTransfer === "Primary") ? account.fromAccountNumber : account.toAccountNumber;
            var fromOrToAccountName = (typeOfTransfer === "Secondary") ? account.fromAccountName : account.toAccountName;
            this.currencyCode = account.currencyCode;
            var dataObject = {
                "lblRecordField1": (account.accountID || account.Account_id) ? CommonUtilities.truncateStringWithGivenLength(account.accountName + "....", 26) + CommonUtilities.getLastFourDigit(account.accountID) : (kony.sdk.isNullOrUndefined(CommonUtilities.getAccountDisplayName(account)) ? CommonUtilities.getAccountDisplayName(account) : fromOrToAccountName),
                "lblRecordField2": (account.availableBalance ? CommonUtilities.formatCurrencyWithCommas(account.availableBalance, false, account.currencyCode) : (account.bankName || account.phone || account.email)),
                "accountID": account.Account_id || account.accountID || account.accountNumber || account.payPersonId || account.PayPersonId || fromOrToAccountNumber,
                "currencyCode": account.currencyCode,
                "accountName": account.accountName,
                "Membership_id": account.Membership_id,
                "lblRecordField3": {
                    "text": account.accountType,
                    "left": this.profileAccess === "both" ? "7px" : "20px",
                },
                "flxRecordFieldType": {
                    "left": this.profileAccess === "both" ? "15px" : "0px"
                },
                "flxRecordFieldTypeIcon1": {
                    "isVisible": this.profileAccess === "both" ? true : false
                },
                "lblRecordFieldTypeIcon1": {
                    "text": account.isBusinessAccount === "true" ? "r" : "s"
                },
                "flxRecordFieldTypeIcon2": {
                    "isVisible": account.externalIndicator === "true" ? true : false,
                },
                "imgRecordFieldTypeIcon2": {
                    "src": "bank_icon_hdfc.png"
                },
                "flxBottomSeparator": {
                    "isVisible": true
                },
                "flxAccountListItem": {
                    "isVisible": true
                },
                "flxAccountsDropdown": {
                    "height": "76dp"
                }
            };
            return dataObject;
        },
        /**
         * It shows or hides the particular section 
         * @param typeOfTransfer - differentiate whether it is "to" or "from" account transaction 
         */
        showOrHideAccountRows: function(context, typeOfTransfer) {
            fromScroll = true;
            var section = contentScope["seg" + typeOfTransfer + "Accounts"].selectedRowIndex[0];
            var segData = contentScope["seg" + typeOfTransfer + "Accounts"].data;
            var isRowVisible = true;
            if (segData[section][0].lblDropdownIcon.text === "O") {
                segData[section][0]["lblDropdownIcon"] = {
                    text: "P"
                };
                isRowVisible = true;
            } else {
                segData[section][0]["lblDropdownIcon"] = {
                    text: "O"
                };
                isRowVisible = false;
            }
            for (var i = 0; i < segData[section][1].length; i++) {
                var flxAccountsDropdown = JSON.parse(JSON.stringify(segData[section][1][i].flxAccountsDropdown));
                flxAccountsDropdown["isVisible"] = isRowVisible;
                flxAccountsDropdown["height"] = isRowVisible ? "76dp" : "0dp";
                this.updateKeyAt("flxAccountsDropdown", flxAccountsDropdown, i, section, typeOfTransfer);
            }
            segData = contentScope["seg" + typeOfTransfer + "Accounts"].data;
            contentScope["seg" + typeOfTransfer + "Accounts"].setSectionAt(segData[section], section);
            this.setFromAccountsDropdownHeight(segData, typeOfTransfer);
        },
        /**
         * It updates the account row selected from the accounts dropdown
         * @param typeOfTransfer - differentiate whether it is "Primary" or "Secondary" account transaction
         */
        updateKeyAt: function(widgetName, value, row, section, typeOfTransfer) {
            var data = contentScope["seg" + typeOfTransfer + "Accounts"].data;
            var rowDataTobeUpdated = data[section][1][row];
            rowDataTobeUpdated[widgetName] = value;
            contentScope["seg" + typeOfTransfer + "Accounts"].setDataAt(rowDataTobeUpdated, row, section);
        },
        /**
         * It sets height for the Primary and secondary account dropdown
         * @param typeOfTransfer - differentiate whether it is "to" or "from" account transaction 
         */
        setFromAccountsDropdownHeight: function(data, typeOfTransfer) {
            var totalHeight = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i][1][0]["flxAccountsDropdown"].height !== "0dp") {
                    totalHeight += data[i][1].length * 76;
                }
            }
            if (totalHeight === 0) {
                totalHeight += data.length * 40;
            }
            contentScope["flx" + typeOfTransfer + "AccountSegment"].height = totalHeight >= 300 ? "300dp" : totalHeight + "dp";
        },
        updateWidgetInInfo: function(widgetRef) {
            widgetRef.info.frame = widgetRef.frame;
        },
         /**
         * It checks whether the selected account is removed or not
         * @param {String} selectedRecord - it takes the selected account record
         * @param {Object} accounts - it collects all the accounts data
         */
        removeSelectedAccount: function(selectedRecord, accounts) {
            if (selectedRecord) {
                return accounts.filter(function(account) {
                    return account.accountID != selectedRecord.accountID && account.currencyCode === selectedRecord.currencyCode
                })
            }
            return accounts;
        },
         /**
         * It sets data for the primary account textbox on selection
         */
        onPrimaryAccountSelection: function() {
            let selectedRecord = contentScope.segPrimaryAccounts.selectedRowItems[0];
            let records = this.removeSelectedAccount(selectedRecord, this.filteredSecondaryAccounts);
            let filteredRecords = this.presenter.filterAccountsByMembershipId(selectedRecord.Membership_id, records);
            this.selectedPrimaryaccount = selectedRecord;
            this.setData(filteredRecords, "Secondary");
            contentScope.flxClearPrimaryText.setVisibility(false);
            contentScope.tbxPrimaryAccount.setVisibility(false);
            contentScope.lblPrimaryRecordField.setVisibility(true);
            contentScope.lblPrimaryRecordField1.setVisibility(true);
            contentScope.tbxPrimaryAccount.text = selectedRecord.lblRecordField1 || "";
            contentScope.lblPrimaryRecordField.text = selectedRecord.lblRecordField1 || "";
            contentScope.lblPrimaryRecordField1.text = selectedRecord.lblRecordField2 || "";
            contentScope.flxPrimaryAccountSegment.setVisibility(false);
            contentScope.lblSelectedCurrencySymbol1.text = formatUtilManager.getCurrencySymbol(this.currencyCode);
            contentScope.lblSelectedCurrencySymbol2.text = contentScope.lblSelectedCurrencySymbol1.text;
            this.PrimarySelected = true;
            this.enableOrDisableContinueButton();
        },
         /**
         * It sets data for the secondary account textbox on selection
         * @param {object} record - it collects the data of the particular row account
         */
        onSecondaryAccountSelection: function(record) {
            let selectedRecord = record.accountID ? record : contentScope.segSecondaryAccounts.selectedRowItems[0];
            let records = this.removeSelectedAccount(selectedRecord, this.filteredPrimaryAccounts);
            let filteredRecords = this.presenter.filterAccountsByMembershipId(selectedRecord.Membership_id, records);
            this.selectedSecondaryaccount = selectedRecord;
            this.setData(filteredRecords, "Primary");
            contentScope.flxClearSecondaryText.setVisibility(false);
            contentScope.tbxSecondaryAccount.setVisibility(false);
            contentScope.lblSecondaryRecordField.setVisibility(true);
            contentScope.lblSecondaryRecordField1.setVisibility(true);
            //contentScope.tbxSecondaryAccount.text = selectedRecord.lblRecordField1 || "";
            contentScope.lblSecondaryRecordField.text = selectedRecord.lblRecordField1 || "";
            contentScope.lblSecondaryRecordField1.text = selectedRecord.lblRecordField2 || "";
            contentScope.flxSecondaryAccountSegment.setVisibility(false);
            contentScope.lblSelectedCurrencySymbol1.text = formatUtilManager.getCurrencySymbol(this.currencyCode);
            contentScope.lblSelectedCurrencySymbol2.text = contentScope.lblSelectedCurrencySymbol1.text;
            this.SecondarySelected = true;
            this.enableOrDisableContinueButton();
        },
         /**
         * Method is used to enable or disable continue button
         */
        enableOrDisableContinueButton: function() {
            if (contentScope.tbxAmount1.text != "" || contentScope.tbxAmount2.text != "") {
                this.amountEntered = true;
            }
            if (this.PrimarySelected && this.SecondarySelected && this.checkboxSelected && this.amountEntered) {
                CommonUtilities.enableButton(contentScope.btnContinue)
            } else{
                CommonUtilities.disableButton(contentScope.btnContinue)
            }
        },
         /**
         * Method is used to expand or collapse in account segment
         * @param {String} fieldType - Primary or Secondary
         */
        toggleAccountsDropdown: function(fieldType) {
            contentScope["flxClear" + fieldType + "Text"].setVisibility(false);
            if (!(contentScope["flx" + fieldType + "AccountSegment"].isVisible) && !(contentScope["flxNo" + fieldType + "Records"].isVisible)) {
                contentScope["tbx" + fieldType + "Account"].setVisibility(true);
                contentScope["tbx" + fieldType + "Account"].setFocus(true);
                var segData = contentScope["seg" + fieldType + "Accounts"].data;
                if (segData.length != 0) {
                    contentScope["flx" + fieldType + "AccountSegment"].setVisibility(true);
                } else {
                    contentScope["flxNo" + fieldType + "Records"].setVisibility(true);
                }
                contentScope["lbl" + fieldType + "RecordField1"].setVisibility(false);
            } else {
                contentScope["flx" + fieldType + "AccountSegment"].setVisibility(false);
                contentScope["flxNo" + fieldType + "Records"].setVisibility(false);
            }
        },
         /**
         * Method is used to clear text in accounts textbox
         * @param {String} fieldType - Primary or Secondary
         */
        clearAccountTextboxTexts: function(fieldType) {
            this[fieldType + "Selected"] = false;
            contentScope["tbx" + fieldType + "Account"].text = "";
            contentScope["flxClear" + fieldType + "Text"].setVisibility(false);
            contentScope["flx" + fieldType + "AccountSegment"].setVisibility(true);
            contentScope["flxNo" + fieldType + "Records"].setVisibility(false);
            this.enableOrDisableContinueButton();
        },
         /**
         * Method is reset the UI for sweep below condition responsively
         * @return : NA
         */
        checkAndReorderRow1: function() {
            if (contentScope.lblPreCondition1.info.frame === undefined || contentScope.lblPostCondition1.info.frame === undefined || contentScope.flxSweepCondition1.info.frame === undefined) {
                return;
            }
            let checkAndTbxWidth = contentScope.lblPreCondition1.info.frame.x + contentScope.lblPreCondition1.info.frame.width + 10 + 300;
            let internalWidth = checkAndTbxWidth + 10 + contentScope.lblPostCondition1.info.frame.width;
            //-10 below is for right gutter space
            if (internalWidth > contentScope.flxSweepCondition1.info.frame.width - 10) {
                contentScope.flxSweepCondition1.layoutType = kony.flex.FLOW_VERTICAL;
                //-10 below is for right gutter space
                if (checkAndTbxWidth > contentScope.flxSweepCondition1.info.frame.width - 10) {
                    contentScope.flxConditionAndAmount1.layoutType = kony.flex.FLOW_VERTICAL;
                } else {
                    contentScope.flxConditionAndAmount1.layoutType = kony.flex.FLOW_HORIZONTAL;
                }
            } else {
                contentScope.flxSweepCondition1.layoutType = kony.flex.FLOW_HORIZONTAL;
            }
        },
         /**
         * Method is reset the UI for sweep above condition responsively
         * @return : NA
         */
        checkAndReorderRow2: function() {
            if (contentScope.lblPreCondition2.info.frame === undefined || contentScope.lblPostCondition2.info.frame === undefined || contentScope.flxSweepCondition2.info.frame === undefined) {
                return;
            }
            let checkAndTbxWidth = contentScope.lblPreCondition2.info.frame.x + contentScope.lblPreCondition2.info.frame.width + 10 + 300;
            let internalWidth = checkAndTbxWidth + 10 + contentScope.lblPostCondition2.info.frame.width;
            //-10 below is for right gutter space
            if (internalWidth > contentScope.flxSweepCondition2.info.frame.width - 10) {
                contentScope.flxSweepCondition2.layoutType = kony.flex.FLOW_VERTICAL;
                //-10 below is for right gutter space
                if (checkAndTbxWidth > contentScope.flxSweepCondition2.info.frame.width - 10) {
                    contentScope.flxConditionAndAmount2.layoutType = kony.flex.FLOW_VERTICAL;
                } else {
                    contentScope.flxConditionAndAmount2.layoutType = kony.flex.FLOW_HORIZONTAL;
                }
            } else {
                contentScope.flxSweepCondition2.layoutType = kony.flex.FLOW_HORIZONTAL;
            }
        },
         /**
         * Method to show server error in form 
         * @param {String} errorMsg - Error Message from server
         */
        showServerError: function(errorMsg) {
            this.view.formTemplate12.showBannerError({
                dbpErrMsg: errorMsg
            });
        },
        /**
         * Error thrown from catch block of form controller
         */
        onError: function(err) {
            kony.print(JSON.stringify(err));
        },
    };
});


