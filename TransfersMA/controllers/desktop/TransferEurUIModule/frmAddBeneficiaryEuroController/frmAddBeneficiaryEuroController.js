define(['FormControllerUtility', 'CommonUtilities', 'ViewConstants', 'OLBConstants'], function(FormControllerUtility, CommonUtilities, ViewConstants, OLBConstants) {
     
    var isSameBankAccount;
    var isInternationalAccount;
    var records;
    var beneficiary_name;
    var bank_country;
    var international_flag;
    var inter_flag;
    var intra_flag;
    var edit_flag;
    return {
        init: function() {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = this.onBreakpointChange;
            var scopeObj = this;
            this.euroPresenter =   applicationManager.getModulesPresentationController({"appName" : "TransfersMA", "moduleName" : "TransferEurUIModule"});
            this.ManageActivitiesPresenter = applicationManager.getModulesPresentationController({"appName" : "TransfersMA", "moduleName" : "ManageActivitiesUIModule"});
            this.view.flxRadioBtn1.onClick = this.toggleRadioButton1.bind(this);
            this.view.flxRadioBtn2.onClick = this.toggleRadioButton2.bind(this);
            this.view.tbxAccountNumber.onKeyUp = this.validateBeneficiaryDetails.bind(this);
            this.view.tbxSWIFTBIC.onKeyUp = this.validateBeneficiaryDetails.bind(this);
            this.view.tbxAccountNumber.onEndEditing = this.validateIBAN.bind(this);
            this.view.tbxSWIFTBIC.onEndEditing = this.validateSwiftCode.bind(this);
            this.view.tbxAccountNumber.onBeginEditing = this.normalizeAccountTextbox.bind(this);
            this.view.tbxSWIFTBIC.onBeginEditing = this.normalizeSwiftTextbox.bind(this);
            this.view.tbxBeneficiaryName.onKeyUp = this.validateBeneficiaryDetails.bind(this);
            this.view.tbxPhoneNumber.onKeyUp = this.validateBeneficiaryDetails.bind(this);
            this.view.tbxEmailAddress.onKeyUp = this.validateBeneficiaryDetails.bind(this);
            //this.view.btnLookUp.onClick = this.showLookUpPopup.bind(this);
            this.view.btnCancel.onClick = function() {
                // applicationManager.getNavigationManager().navigateTo("frmManageBeneficiaries"); 
                scopeObj.ManageActivitiesPresenter.showTransferScreen({
                    context: "ManageBeneficiaries"
                })
            };
            this.view.btnContinue.onClick = this.addBeneficiary.bind(this);
            this.view.flxAddNewBeneficiary.onClick = function() {
                scopeObj.euroPresenter.showTransferScreen({
                    context: "AddBeneficiary"
                })
            };
            this.restrictSpecialCharacters();
            this.initActions();
        },

        initActions: function() {
            var self = this;
            this.view.btnLookUp.onClick = function() {
                self.view.flxDialogs.setVisibility(true);
                self.view.flxLookup.setVisibility(true);
                self.view.flxNoResults.setVisibility(false);
                self.view.txtBankName.text = '';
                self.view.txtCity1.text = '';
                self.view.txtCountry1.text = '';
                self.view.segResults.setData([]);
				FormControllerUtility.disableButton(self.view.btnSearch);
            }
            this.view.flxCross.onClick = function() {
                self.view.flxDialogs.setVisibility(false);
                self.view.flxLookup.setVisibility(false);
            }
            this.view.btnSearch.onClick = self.searchSwift;
            this.view.btnClearSearchBic.onClick = self.clearSearch;
            this.view.segResults.onRowClick = this.segRowClick;
			this.view.txtCountry1.onTextChange = this.enableSwiftSearch;
			this.view.txtCity1.onTextChange = this.enableSwiftSearch;
			this.view.txtBankName.onTextChange = this.enableSwiftSearch;
        },
		enableSwiftSearch : function(){
			var scopeObj = this;
			if(this.view.txtCountry1.text !== "" || this.view.txtCity1.text !== "" || this.view.txtBankName.text !== "" ){
				FormControllerUtility.enableButton(scopeObj.view.btnSearch);
			}
			else{
				FormControllerUtility.disableButton(scopeObj.view.btnSearch);
			}
		},
        searchSwift: function() {
            var searchData = {};
            //LumapplicationManager.getPresentationUtility().showLoadingScreen();
            if (this.view.txtCountry1.text && this.view.txtCountry1.text.length > 0) {
                searchData.country = this.view.txtCountry1.text;
            }
            if (this.view.txtCity1.text && this.view.txtCity1.text.length > 0) {
                searchData.city = this.view.txtCity1.text;
            }
            if (this.view.txtBankName.text && this.view.txtBankName.text.length > 0) {
                searchData.bankName = this.view.txtBankName.text;
            }

            var transferMod = applicationManager.getModulesPresentationController("TransferEurUIModule");
            transferMod.searchAllSwiftBICCode(searchData, "frmAddBeneficiaryEuro");

            //  this.setSegmentData();
        },



        setSegmentData: function(data) {
            //  this.view.forceLayout();

            if (data && data.length > 0) {
                this.view.segResults.widgetDataMap = this.getWidgetDataMap();
                this.view.segResults.setData(data);
                this.view.flxNoResults.setVisibility(false);
                this.view.segResults.setVisibility(true);
            } else {
                this.view.flxNoResults.setVisibility(true);
                this.view.segResults.setVisibility(false);
            }
        },
        segRowClick: function() {
            var rowindex;
            rowindex = Math.floor(this.view.segResults.selectedRowIndex[1]);
            selectedAccount = this.view.segResults.data[rowindex];
            this.view.tbxSWIFTBIC.text = selectedAccount.bic;
            this.view.tbxBankName.text = selectedAccount.bankName;
            bank_country = selectedAccount.country;
            isSameBankAccount = false;
            isInternationalAccount = true;
            this.view.flxLookup.setVisibility(false);
            this.view.flxDialogs.setVisibility(false);
        },
        getWidgetDataMap: function() {
            var dataMap = {
                lblSwiftCodeValue: "bic",
                lblBankValue: "bankName",
                lblCityNameValue: "city",
                lblCountryNameValue: "country",
            };
            return dataMap;
        },

        fetchManageBeneficiarySuccessCallBack: function(response) {
            this.records = response
        },
        onBreakpointChange: function(form, width) {
            var scope = this;
            this.view.CustomPopupLogout.onBreakpointChangeComponent(scope.view.CustomPopupLogout, width);
            this.view.CustomPopupCancel.onBreakpointChangeComponent(scope.view.CustomPopupCancel, width);
            FormControllerUtility.setupFormOnTouchEnd(width);
           
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
        },
        preShow: function() {
            this.view.customheadernew.activateMenu("EUROTRANSFERS", "Manage Beneficiaries");
            this.view.tbxBankName.setEnabled(false);
            this.view.flxMainContainer.setVisibility(true);
            this.view.flxContractList.setVisibility(false);
            this.view.btnLookUp.toolTip = kony.i18n.getLocalizedString("i18n.unifiedBeneficiary.Lookup");
            this.view.btnContinue.toolTip = kony.i18n.getLocalizedString("i18n.unifiedBeneficiary.Continue");
            this.view.btnSave.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.Save");
            this.view.btnCancel.toolTip = kony.i18n.getLocalizedString("i18n.TransfersEur.btnCancel");
            this.view.btnClearSearchBic.toolTip = kony.i18n.getLocalizedString("i18n.payments.clearSelection");
            this.view.btnSearch.toolTip = kony.i18n.getLocalizedString("i18n.serviceRequests.Search");
            this.view.contractList.btnAction6.toolTip = kony.i18n.getLocalizedString("i18n.common.proceed");
            this.view.contractList.btnAction5.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Modify");
            this.view.contractList.btnAction4.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
        },
        postShow: function() {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.frame.height - this.view.flxFooter.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
            applicationManager.executeAuthorizationFramework(this);
        },
        enableSamebankoption: function() {
            this.view.lblRadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
            this.view.lblRadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
        },
        disableSamebankoption: function() {
            this.view.lblRadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
            this.view.lblRadioBtn1.skin = "sknFontIconCheckBoxDisabled";
            this.view.flxRadioBtn1.onClick = null;
            intra_flag = 1;
        },
        enableOtherbankoption: function() {
            this.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
            this.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
            this.toggleRadioButton2();
            if (intra_flag !== 1) {
                this.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                this.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
                this.toggleRadioButton1();
            }
        },
        disableOtherbankoption: function() {
            this.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
            this.view.lblRadioBtn2.skin = "sknFontIconCheckBoxDisabled";
            inter_flag = 1;
        },
        InternationalPermssion: function() {
            this.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
            this.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
            this.toggleRadioButton2();
            international_flag = 1
            if (intra_flag !== 1) {
                this.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                this.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
                this.toggleRadioButton1();
            }
        },
        NoInternationalPermssion: function() {
            if (inter_flag == 1) {
                this.view.flxRadioBtn2.onClick = null;
            }
            international_flag = 0;
        },

        /**
         * updateFormUI - the entry point method for the form controller.
         * @param {Object} viewModel - it contains the set of view properties and keys.
         */
        updateFormUI: function(viewModel) {
            if (viewModel.isLoading === true) {
                FormControllerUtility.showProgressBar(this.view);
            } else if (viewModel.isLoading === false) {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (viewModel.initialView) {
                this.resetAddBeneficiary();
            }
            if (viewModel.editDetails) {
                this.editBeneficiary(viewModel.editDetails);
            }
            if (viewModel.modifyBeneficiary) {
                this.modifyBeneficiary(viewModel.modifyBeneficiary);
            }
            if (viewModel.BICdetails) {
                this.populateBIC(viewModel.BICdetails);
            }
            if (viewModel.beneficiaryName) {
                this.populateBeneficiaryName(viewModel.beneficiaryName);
            }
            if (viewModel.contracts) {
                this.setContractsData(viewModel.contracts, viewModel.data);
            }
            if(viewModel.IBanerror){
                this.showIbanError();
            }
            if (viewModel.serverError) {
                this.view.rtxDowntimeWarning.text = viewModel.serverError;
                this.view.flxDialogs.setVisibility(false);
                this.view.flxLookup.setVisibility(false);
                this.view.flxDowntimeWarning.setVisibility(true);
                this.view.flxFormContent.forceLayout();
            } else {
                this.view.flxDowntimeWarning.setVisibility(false);
            }
        },
        /**
         * Method to restrict Special Characters entry in textbox
         */
        restrictSpecialCharacters: function() {
            var scopeObj = this;
            var specialCharactersSet = "~#^|$%&*!@()_-+=}{][/|?,.><`':;\"\\";
            var numbersSet = "0123456789";
            var alphabetsSet = "abcdefghijklmnopqrstuvwxyz"
            scopeObj.view.tbxAccountNumber.restrictCharactersSet = specialCharactersSet;
            scopeObj.view.tbxPostCode.restrictCharactersSet = specialCharactersSet;
            scopeObj.view.tbxSWIFTBIC.restrictCharactersSet = specialCharactersSet;
            scopeObj.view.tbxBeneficiaryName.restrictCharactersSet = specialCharactersSet;
            scopeObj.view.tbxBeneficiaryNickname.restrictCharactersSet = specialCharactersSet;
            scopeObj.view.txtBankName.restrictCharactersSet = specialCharactersSet;
            scopeObj.view.txtCity1.restrictCharactersSet = specialCharactersSet + numbersSet;
            scopeObj.view.txtCountry1.restrictCharactersSet = specialCharactersSet + numbersSet;
            scopeObj.view.tbxPhoneNumber.restrictCharactersSet = specialCharactersSet +  alphabetsSet + alphabetsSet.toUpperCase();
        },
        /**
         * Method to validate the beneficiary detail fields
         */
        validateBeneficiaryDetails: function() {
            var scopeObj = this;
            var validationUtilityManager = applicationManager.getValidationUtilManager();
            scopeObj.view.tbxAccountNumber.text = scopeObj.view.tbxAccountNumber.text.toUpperCase();
            scopeObj.view.tbxSWIFTBIC.text = scopeObj.view.tbxSWIFTBIC.text.toUpperCase();
            var formData = {
                "IBAN": scopeObj.view.tbxAccountNumber.text.trim(),
                "beneficiaryName": scopeObj.view.tbxBeneficiaryName.text.trim(),
                "swiftCode": scopeObj.view.tbxSWIFTBIC.text.trim(),
                "phone": scopeObj.view.tbxPhoneNumber.text.trim(),
                "email": scopeObj.view.tbxEmailAddress.text.trim()
            };
            if (scopeObj.view.lblRadioBtn2.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO) {
                if (formData.swiftCode === "" || formData.beneficiaryName === "") {
                    FormControllerUtility.disableButton(scopeObj.view.btnContinue);
                    return;
                }
            }
            var validPhone = formData.phone !== "" ? validationUtilityManager.isValidPhoneNumber(formData.phone) : true;
            var validEmail = formData.email !== "" ? validationUtilityManager.isValidEmail(formData.email) : true;
            if (formData.IBAN === "" || validPhone === false || validEmail === false) {
                FormControllerUtility.disableButton(scopeObj.view.btnContinue);
                //FormControllerUtility.disableButton(scopeObj.view.btnSave);
                return;
            }
            FormControllerUtility.enableButton(scopeObj.view.btnContinue);
            FormControllerUtility.enableButton(scopeObj.view.btnSave);
        },
        showIbanError: function(){
            var scopeObj =  this;
            CommonUtilities.setText(scopeObj.view.lblInvalidIBAN, kony.i18n.getLocalizedString("i18n.TransfersEur.InvalidIBANMessage"), CommonUtilities.getaccessibilityConfig());
            scopeObj.view.tbxAccountNumber.skin = ViewConstants.SKINS.BORDER;
            scopeObj.view.lblInvalidIBAN.setVisibility(true);
            FormControllerUtility.disableButton(scopeObj.view.btnContinue);
        },
        /**
         * Method to check valid IBAN & get BIC
         */
        validateIBAN: function() {
            var scopeObj = this;
            var validationUtilityManager = applicationManager.getValidationUtilManager();
            var IBAN = scopeObj.view.tbxAccountNumber.text.trim();
            if (IBAN !== "") {
                if (scopeObj.view.lblRadioBtn1.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO) {
                    if (!validationUtilityManager.isValidAccountNumber(IBAN)) {
                        scopeObj.view.tbxAccountNumber.skin = ViewConstants.SKINS.BORDER;
                        CommonUtilities.setText(scopeObj.view.lblInvalidIBAN, kony.i18n.getLocalizedString("i18n.TransfersEur.InvalidAccountNumberMessage"), CommonUtilities.getaccessibilityConfig());
                        scopeObj.view.lblInvalidIBAN.setVisibility(true);
                        FormControllerUtility.disableButton(scopeObj.view.btnContinue);
                    } else {
                        scopeObj.validateExistingorNot(IBAN);
                    }
                } else {
                    scopeObj.toggleRadioButton2();
                    scopeObj.view.tbxAccountNumber.text = IBAN;
                    isSameBankAccount = false;
                    isInternationalAccount = true;
                   if (!validationUtilityManager.isValidAccountNumber(IBAN) &&  /^[a-z]/i.test(IBAN.charAt(0))) {
                        scopeObj.validateExistingorNot(IBAN)
                    } 
                }
            }
            scopeObj.view.flxFormContent.forceLayout();
        },
        /**
         * Method to check existed accountnumber or not 
         */
        validateExistingorNot: function(IBAN) {
            var scopeObj = this;
            if (scopeObj.view.lblRadioBtn1.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO) {
                scopeObj.euroPresenter.getBeneficiaryName(IBAN, this.view.id);
            } else {
                scopeObj.euroPresenter.isValidIBAN(IBAN, this.view.id);
            }
        },
        /**
         * Method to check valid SWIFT Code
         */
        validateSwiftCode: function() {
            var scopeObj = this;
            var swiftCode = scopeObj.view.tbxSWIFTBIC.text.trim();
            var validationUtilityManager = applicationManager.getValidationUtilManager();
            if (swiftCode !== "") {
                if (!(validationUtilityManager.isValidSwiftCode(swiftCode) && /^[A-Z]+$/.test(swiftCode.slice(0, 6)))) {
                    scopeObj.view.lblInvalidSwiftCode.setVisibility(true);
                    CommonUtilities.setText(scopeObj.view.lblInvalidSwiftCode, kony.i18n.getLocalizedString("i18n.TransfersEur.InvalidSwiftCodeMessage"), CommonUtilities.getaccessibilityConfig());
                    scopeObj.view.tbxSWIFTBIC.skin = ViewConstants.SKINS.BORDER;
                }
            }
            scopeObj.view.flxFormContent.forceLayout();
        },
        /**
         * Normalize Account Number textbox
         */
        normalizeAccountTextbox: function() {
            var scopeObj = this;
            FormControllerUtility.enableTextbox(scopeObj.view.tbxAccountNumber);
            scopeObj.view.lblInvalidIBAN.setVisibility(false);
            scopeObj.view.flxFormContent.forceLayout();
        },
        /**
         * Normalize SWIFT Code textbox
         */
        normalizeSwiftTextbox: function() {
            var scopeObj = this;
            FormControllerUtility.enableTextbox(scopeObj.view.tbxSWIFTBIC);
            scopeObj.view.lblInvalidSwiftCode.setVisibility(false);
            scopeObj.view.flxFormContent.forceLayout();
        },
        /**
         * Method to populate BIC value
         * @param {Object} data object containing BIC value
         */
        populateBIC: function(data) {
            var scopeObj = this;
            CommonUtilities.setText(scopeObj.view.tbxSWIFTBIC, data.bic, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxBankName, data.bankName, CommonUtilities.getaccessibilityConfig());
            //CommonUtilities.setText(scopeObj.view.tbxCountry, data.country, CommonUtilities.getaccessibilityConfig());
            bank_country = data.country;
            FormControllerUtility.disableTextbox(scopeObj.view.tbxSWIFTBIC);
            scopeObj.view.btnLookUp.setVisibility(false);
            if (data.sepaMember === undefined || data.sepaMember === "" || data.sepaMember === "Y") {
                isSameBankAccount = false;
                isInternationalAccount = false;
            } else if (data.sepaMember === "N") {
                isSameBankAccount = false;
                isInternationalAccount = true;
            }
            scopeObj.validateBeneficiaryDetails();
        },
        /**
         * Method to populate Beneficiary name value
         * @param {Object} data object containing BIC value
         */
        populateBeneficiaryName: function(data) {
            var scopeObj = this;
            if (data.beneficiaryName === "") {
                scopeObj.view.lblInvalidIBAN.setVisibility(true);
                scopeObj.view.tbxBeneficiaryName.text = "";
                scopeObj.view.tbxAccountNumber.skin = ViewConstants.SKINS.BORDER;
                CommonUtilities.setText(scopeObj.view.lblInvalidIBAN, kony.i18n.getLocalizedString("i18n.TransferEur.inValidAccountNumber"), CommonUtilities.getaccessibilityConfig());
                FormControllerUtility.disableButton(scopeObj.view.btnContinue);
            } else {
                scopeObj.view.lblInvalidIBAN.setVisibility(false);
                //beneficiary_name = data.beneficiaryName
                CommonUtilities.setText(scopeObj.view.tbxBeneficiaryName, data.beneficiaryName, CommonUtilities.getaccessibilityConfig());
            }
        },
        /**
         * Method to Send the beneficiary data for confirmation
         */
        addBeneficiary: function() {
            var scopeObj = this;
            var data = {
                "accountNumber": scopeObj.view.tbxAccountNumber.text.trim(),
                "IBAN": scopeObj.view.tbxAccountNumber.text.trim(),
                "beneficiaryName": CommonUtilities.changedataCase(scopeObj.view.tbxBeneficiaryName.text.trim()),
                "bankName": scopeObj.view.tbxBankName.text.trim() || "",
                "bankCountry": bank_country,
                "nickName": CommonUtilities.changedataCase(scopeObj.view.tbxBeneficiaryNickname.text.trim()) || "",
                "addressLine1": CommonUtilities.changedataCase(scopeObj.view.tbxAddressLine01.text.trim()),
                "addressLine2": CommonUtilities.changedataCase(scopeObj.view.tbxAddressLine02.text.trim()),
                "city": CommonUtilities.changedataCase(scopeObj.view.tbxCity.text.trim()),
                "zipcode": scopeObj.view.tbxPostCode.text.trim(),
                "country": CommonUtilities.changedataCase(scopeObj.view.tbxCountry.text.trim()),
                "phone": scopeObj.view.tbxPhoneNumber.text.trim(),
                "email": scopeObj.view.tbxEmailAddress.text.trim(),
                "swiftCode": scopeObj.view.tbxSWIFTBIC.text.trim(),
                "sameBank": scopeObj.view.lblRadioBtn1.skin,
                "otherBank": scopeObj.view.lblRadioBtn2.skin,
                "isVerified" : true
            };
            if (scopeObj.view.lblRadioBtn1.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO) {
                data["isSameBankAccount"] = true;
                data["isInternationalAccount"] = false;
            } else {
                data["isSameBankAccount"] = isSameBankAccount;
                data["isInternationalAccount"] = isInternationalAccount;
                data["swiftCode"] = scopeObj.view.tbxSWIFTBIC.text.trim();
            }
            if ((isInternationalAccount === true && international_flag === 0) || (isInternationalAccount === false && international_flag === 0 && inter_flag == 1) || (isInternationalAccount === false && international_flag === 1 && inter_flag == 1)) {
                //FormControllerUtility.disableButton(scopeObj.view.btnContinue);
                scopeObj.view.lblInvalidIBAN.setVisibility(true);
                CommonUtilities.setText(scopeObj.view.lblInvalidIBAN, kony.i18n.getLocalizedString("i18n.TransferEur.dontHavePermission"), CommonUtilities.getaccessibilityConfig());
            } else {
                scopeObj.view.lblInvalidIBAN.setVisibility(false);
                //FormControllerUtility.enableButton(scopeObj.view.btnContinue);
                //scopeObj.presenter.showView("frmAddBeneficiaryConfirmEuro", data);
                this.getContracts(false, true, data);
            }

        },

        getContracts: function (modify, isAddFlow, data) {
            
            if (!modify) {
                isAddFlow == true ? this.isEdit = false : this.isEdit = true;
                this.presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("TransferEurUIModule").presentationController;
                if ((data.isInternationalAccount === false || data.isInternationalAccount === "false") && (data.isSameBankAccount === false || data.isSameBankAccount === "false")) {
                    data.feature = "INTRA_BANK_FUND_TRANSFER_CREATE_RECEPIENT";
                } else if ((data.isInternationalAccount === true || data.isInternationalAccount === "true") && (data.isSameBankAccount === false || data.isSameBankAccount === "false")) {
                    data.feature = "INTERNATIONAL_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT";
                } else if ((data.isInternationalAccount === false || data.isInternationalAccount === "false") && (data.isSameBankAccount === true || data.isSameBankAccount === "true")) {
                    data.feature = "INTER_BANK_ACCOUNT_FUND_TRANSFER_CREATE_RECEPIENT";
                }
                this.euroPresenter.getContracts(data);
            } else if (this.cif) {
                let modifiedData = this.getFormData();
                modifiedData.cif = this.cif;
                this.euroPresenter.showView("frmAddBeneficiaryConfirmEuro", modifiedData);
            } else {
                this.view.contractList.setVisibility(true);
                this.view.flxContractList.setVisibility(true);
                this.view.flxMainContainer.setVisibility(false);
            }
        },
        /**
         * Method to Reset the add beneficiary fields
         */
        resetAddBeneficiary: function() {
            var scopeObj = this;
            edit_flag = 0;
            CommonUtilities.setText(scopeObj.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.TransfersEur.AddNewBeneficiary"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblAddBeneficiary, kony.i18n.getLocalizedString("i18n.TransfersEur.AddNewBeneficiary"), CommonUtilities.getaccessibilityConfig());
            //applicationManager.getRecipientsManager().fetchAllExternalAccountsWithPaginationOld({}, this.fetchManageBeneficiarySuccessCallBack.bind(this), this.fetchManageBeneficiarySuccessCallBack.bind(this));
            scopeObj.view.flxBankType.setVisibility(true);
            FormControllerUtility.enableTextbox(scopeObj.view.tbxAccountNumber);
            FormControllerUtility.enableTextbox(scopeObj.view.tbxBeneficiaryName);
            scopeObj.view.tbxAccountNumber.text = "";
            scopeObj.view.tbxSWIFTBIC.text = "";
            scopeObj.view.tbxBankName.text = "";
            scopeObj.view.tbxBeneficiaryName.text = "";
            scopeObj.view.tbxBeneficiaryNickname.text = "";
            scopeObj.view.tbxAddressLine01.text = "";
            scopeObj.view.tbxAddressLine02.text = "";
            scopeObj.view.tbxCity.text = "";
            scopeObj.view.tbxPostCode.text = "";
            scopeObj.view.tbxCountry.text = "";
            scopeObj.view.tbxPhoneNumber.text = "";
            scopeObj.view.tbxEmailAddress.text = "";
            scopeObj.toggleRadioButton1();
            scopeObj.view.btnContinue.setVisibility(true);
            scopeObj.view.btnSave.setVisibility(false);
            FormControllerUtility.disableButton(scopeObj.view.btnContinue);
            scopeObj.view.btnContinue.onClick = this.addBeneficiary.bind(this);
            scopeObj.view.lblInvalidIBAN.setVisibility(false);
            scopeObj.view.lblInvalidSwiftCode.setVisibility(false);
            scopeObj.view.forceLayout();
        },
        /**
         * Method to toggle radio button1
         */
        toggleRadioButton1: function() {
            var scopeObj = this;
            if (edit_flag === 1) {
                return
            }
            if (intra_flag !== 1) {
                scopeObj.view.lblRadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                scopeObj.view.lblRadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
            }
            if (inter_flag !== 1 || international_flag == 1) {
                scopeObj.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                scopeObj.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
            }
            scopeObj.view.tbxAccountNumber.text = "";
            scopeObj.view.tbxAccountNumber.placeholder = kony.i18n.getLocalizedString("i18n.TransfersEur.EnterBeneficiaryLocalAccountNumber");
            scopeObj.view.lblInvalidSwiftCode.setVisibility(false);
            FormControllerUtility.disableTextbox(scopeObj.view.tbxSWIFTBIC);
            scopeObj.view.tbxSWIFTBIC.text = "";
            scopeObj.view.tbxSWIFTBIC.placeholder = "";
            scopeObj.view.tbxBankName.text = "";
            scopeObj.view.tbxBankName.placeholder = "";
            FormControllerUtility.disableTextbox(scopeObj.view.tbxBeneficiaryName);
            scopeObj.view.tbxBeneficiaryName.text = "";
            scopeObj.view.tbxBeneficiaryName.placeholder = "";
            scopeObj.view.btnLookUp.setVisibility(false);
            scopeObj.view.flxLeft.forceLayout();
            scopeObj.normalizeAccountTextbox();
            scopeObj.validateBeneficiaryDetails();
        },
        /**
         * Method to toggle radio button2
         */
        toggleRadioButton2: function() {
            var scopeObj = this;
            if (edit_flag === 1) {
                return
            }
            if (intra_flag !== 1) {
                scopeObj.view.lblRadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                scopeObj.view.lblRadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
            }
            scopeObj.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
            scopeObj.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
            scopeObj.view.tbxAccountNumber.text = "";
            scopeObj.view.tbxAccountNumber.placeholder = kony.i18n.getLocalizedString("i18n.TransfersEur.EnterBeneficiaryLocalAccountNumberorIBAN");
            FormControllerUtility.enableTextbox(scopeObj.view.tbxSWIFTBIC);
            scopeObj.view.tbxSWIFTBIC.text = "";
            scopeObj.view.tbxSWIFTBIC.placeholder = kony.i18n.getLocalizedString("i18n.TransfersEur.EnterSWIFTBICCode");
            scopeObj.view.tbxBankName.text = "";
            scopeObj.view.tbxBankName.placeholder = "";
            FormControllerUtility.enableTextbox(scopeObj.view.tbxBeneficiaryName);
            scopeObj.view.tbxBeneficiaryName.text = "";
            scopeObj.view.tbxBeneficiaryName.placeholder = kony.i18n.getLocalizedString("i18n.TransfersEur.EnterBeneficiaryFullNameHere");
            scopeObj.view.btnLookUp.setVisibility(true);
            scopeObj.view.flxLeft.forceLayout();
            scopeObj.normalizeAccountTextbox();
            scopeObj.validateBeneficiaryDetails();
        },
        /**
         * Method to show or hide lookup popup
         */
        /*
            showLookUpPopup: function() {
                var scopeObj = this;
                scopeObj.view.flxDialogs.setVisibility(true);
                scopeObj.view.flxLookup.setVisibility(true);
                scopeObj.view.flxCross.onClick = function() {
                    scopeObj.view.flxDialogs.setVisibility(false);
                    scopeObj.view.flxLookup.setVisibility(false);
                };
            },
           /**
             * Method to modify the beneficiary details
             */
        modifyBeneficiary: function(data) {
            var scopeObj = this;
            CommonUtilities.setText(scopeObj.view.tbxAccountNumber, data.IBAN ? data.IBAN : data.accountNumber, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxSWIFTBIC, data.swiftCode, CommonUtilities.getaccessibilityConfig());
            scopeObj.view.lblInvalidIBAN.setVisibility(false);
            scopeObj.view.lblInvalidSwiftCode.setVisibility(false);
            CommonUtilities.setText(scopeObj.view.tbxBankName, data.bankName, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxBeneficiaryName, data.beneficiaryName, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxBeneficiaryNickname, data.nickName, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxAddressLine01, data.addressLine1, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxAddressLine02, data.addressLine2, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxCity, data.city, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxPostCode, data.zipcode, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxCountry, data.country, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxPhoneNumber, data.phone, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxEmailAddress, data.email, CommonUtilities.getaccessibilityConfig());
            if (data.sameBank === ViewConstants.SKINS.RADIOBTN_SELECTED) {
                scopeObj.view.lblRadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                scopeObj.view.lblRadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
                FormControllerUtility.disableTextbox(scopeObj.view.tbxBeneficiaryName);
                // scopeObj.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                // scopeObj.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
            } else {
                FormControllerUtility.enableTextbox(scopeObj.view.tbxBeneficiaryName);
                if (data.sameBank === "sknFontIconCheckBoxDisabled") {
                    scopeObj.disableSamebankoption();
                } else if (data.otherBank === "sknFontIconCheckBoxDisabled") {
                    scopeObj.disableOtherbankoption();
                } else {
                    scopeObj.view.lblRadioBtn1.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_UNSELECTED_NUO;
                    scopeObj.view.lblRadioBtn1.skin = ViewConstants.SKINS.RADIOBTN_UNSELECTED;
                    scopeObj.view.lblRadioBtn2.text = ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO;
                    scopeObj.view.lblRadioBtn2.skin = ViewConstants.SKINS.RADIOBTN_SELECTED;
                }

                scopeObj.view.btnContinue.onClick = function () {
                    scopeObj.getContracts(true, !data.isEdit, data);
                }
            }
            scopeObj.view.btnContinue.setVisibility(true);
            FormControllerUtility.enableButton(scopeObj.view.btnContinue);
        },
        /**
         * Method to edit the beneficiary details
         */
        editBeneficiary: function(data) {
            var scopeObj = this;
            edit_flag = 1;
            data.isEdit = true;
            CommonUtilities.setText(scopeObj.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.TransfersEur.EditBeneficiary"), CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.lblAddBeneficiary, kony.i18n.getLocalizedString("i18n.TransfersEur.EditBeneficiary"), CommonUtilities.getaccessibilityConfig());
            scopeObj.view.flxBankType.setVisibility(false);
            FormControllerUtility.disableTextbox(scopeObj.view.tbxAccountNumber);
            FormControllerUtility.disableTextbox(scopeObj.view.tbxSWIFTBIC);
            FormControllerUtility.disableTextbox(scopeObj.view.tbxBeneficiaryName);
            //scopeObj.view.btnLookUp.setVisibility(false);
            CommonUtilities.setText(scopeObj.view.tbxAccountNumber, data.IBAN ? data.IBAN : data.accountNumber, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxSWIFTBIC, data.swiftCode, CommonUtilities.getaccessibilityConfig());
            scopeObj.view.tbxSWIFTBIC.placeholder = "";
            scopeObj.view.tbxBeneficiaryName.placeholder = "";
            scopeObj.view.lblInvalidIBAN.setVisibility(false);
            scopeObj.view.lblInvalidSwiftCode.setVisibility(false);
            // scopeObj.view.tbxBankName.text = data.bankName;
            CommonUtilities.setText(scopeObj.view.tbxBankName, data.bankName, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxBeneficiaryName, data.beneficiaryName, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxBeneficiaryNickname, data.nickName, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxAddressLine01, data.addressLine1, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxAddressLine02, data.addressLine2, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxCity, data.city, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxPostCode, data.zipcode, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxCountry, data.country, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxPhoneNumber, data.phoneNumber, CommonUtilities.getaccessibilityConfig());
            CommonUtilities.setText(scopeObj.view.tbxEmailAddress, data.email, CommonUtilities.getaccessibilityConfig());
            scopeObj.view.btnContinue.setVisibility(true);
            scopeObj.view.btnSave.setVisibility(false);
            FormControllerUtility.enableButton(scopeObj.view.btnContinue);
            //             scopeObj.view.btnSave.onClick = function() {
            //                 scopeObj.saveChangedBeneficiaryDetails(data);
            //             };
            scopeObj.view.btnContinue.onClick = function() {
                scopeObj.getContracts(false, false, data);
            };
        },
        /**
         * send the edited beneficiary details to backend
         */
        saveChangedBeneficiaryDetails: function(data) {
            var scopeObj = this;
            var params = {};
            params["accountNumber"] = data.accountNumber || data.IBAN;
            params["payeeId"] = data.Id;
            params["isSameBankAccount"] = data.isSameBankAccount;
            params["isInternationalAccount"] = data.isInternationalAccount;
            params["accountType"] = data.accountType;
            params["beneficiaryName"] = data.beneficiaryName;
            if (CommonUtilities.changedataCase(scopeObj.view.tbxBeneficiaryNickname.text.trim()) !== data.nickName) {
                params["nickName"] = CommonUtilities.changedataCase(scopeObj.view.tbxBeneficiaryNickname.text.trim()) === undefined ? " " : CommonUtilities.changedataCase(scopeObj.view.tbxBeneficiaryNickname.text.trim())
            } else {
                params["nickName"] = data.nickName;
            }
            if (CommonUtilities.changedataCase(scopeObj.view.tbxAddressLine01.text.trim()) !== data.addressLine1) {
                params["addressLine1"] = CommonUtilities.changedataCase(scopeObj.view.tbxAddressLine01.text.trim()) === undefined ? " " : CommonUtilities.changedataCase(scopeObj.view.tbxAddressLine01.text.trim());
            }
            if (CommonUtilities.changedataCase(scopeObj.view.tbxAddressLine02.text.trim()) !== data.addressLine2) {
                params["addressLine2"] = CommonUtilities.changedataCase(scopeObj.view.tbxAddressLine02.text.trim()) === undefined ? " " : CommonUtilities.changedataCase(scopeObj.view.tbxAddressLine02.text.trim());
            }
            if (CommonUtilities.changedataCase(scopeObj.view.tbxPostCode.text.trim()) !== data.zipcode) {
                params["zipcode"] = CommonUtilities.changedataCase(scopeObj.view.tbxPostCode.text.trim()) === undefined ? " " : CommonUtilities.changedataCase(scopeObj.view.tbxPostCode.text.trim())
            }
            if (CommonUtilities.changedataCase(scopeObj.view.tbxCountry.text.trim()) !== data.country) {
                params["country"] = CommonUtilities.changedataCase(scopeObj.view.tbxCountry.text.trim()) === undefined ? " " : CommonUtilities.changedataCase(scopeObj.view.tbxCountry.text.trim())
            }
            if (CommonUtilities.changedataCase(scopeObj.view.tbxCity.text.trim()) !== data.city) {
                params["city"] = CommonUtilities.changedataCase(scopeObj.view.tbxCity.text.trim()) === undefined ? " " : CommonUtilities.changedataCase(scopeObj.view.tbxCity.text.trim())
            }
            if (scopeObj.view.tbxPhoneNumber.text.trim() !== data.phone) {
                params["phone"] = scopeObj.view.tbxPhoneNumber.text.trim() === undefined ? " " : scopeObj.view.tbxPhoneNumber.text.trim()
            }
            if (scopeObj.view.tbxEmailAddress.text.trim() !== data.email) {
                params["email"] = scopeObj.view.tbxEmailAddress.text.trim() === undefined ? " " : scopeObj.view.tbxEmailAddress.text.trim()
            }
            if (data.singleCustomer)
                params["cif"] = data.cif;
            else
                params["cif"] = this.createCIFDataForAddBenificiary(data.contractsData);
            //       if (data.nickName !== params.nickName || data.country !== params.country || data.zipcode !== params.zipcode || data.city !== params.city || data.addressLine1 !== params.addressLine1) {
            //         scopeObj.presenter.saveChangedBeneficiaryDetails(data, params);
            //       }
            if (data.nickName !== params.nickName) {
                data["nickName"] = CommonUtilities.changedataCase(scopeObj.view.tbxBeneficiaryNickname.text.trim());
            }
            if (data.addressLine1 !== params.addressLine1) {
                data["addressLine1"] = CommonUtilities.changedataCase(scopeObj.view.tbxAddressLine01.text.trim());
            }
            if (data.addressLine2 !== params.addressLine2) {
                data["addressLine2"] = CommonUtilities.changedataCase(scopeObj.view.tbxAddressLine02.text.trim());
            }
            if (data.zipcode !== params.zipcode) {
                data["zipcode"] = CommonUtilities.changedataCase(scopeObj.view.tbxPostCode.text.trim());
            }
            if (data.country !== params.country) {
                data["country"] = CommonUtilities.changedataCase(scopeObj.view.tbxCountry.text.trim());
            }
            if (data.city !== params.city) {
                data["city"] = CommonUtilities.changedataCase(scopeObj.view.tbxCity.text.trim());
            }
            if (data.phone !== params.phone) {
                data["phone"] = scopeObj.view.tbxPhoneNumber.text.trim();
            }
            if (data.email !== params.email) {
                data["email"] = scopeObj.view.tbxEmailAddress.text.trim();
            }
            return params;
        },

        clearSearch: function() {
            this.view.txtBankName.text = '';
            this.view.txtCity1.text = '';
            this.view.txtCountry1.text = '';
            this.view.segResults.setData([]);

        },

        setContractsData: function(contractsData, data, onCancel) {
            this.view.flxContractList.setVisibility(true);
            this.view.contractList.lblHeader.text = kony.i18n.getLocalizedString("i18n.unifiedBeneficiary.LinkPayee");
            this.view.contractList.lblDescription.text = kony.i18n.getLocalizedString("i18n.unifiedBeneficiary.contractSubHeader");
            this.presenter = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("TransferEurUIModule").presentationController;
            if (contractsData.contracts.length > 0) {
                if (contractsData.contracts.length === 1 && contractsData.contracts[0].contractCustomers.length === 1) {
                    this.view.contractList.segContract.data = [];
                    this.cif = JSON.stringify([{
                        "contractId": contractsData.contracts[0].contractId,
                        "coreCustomerId": contractsData.contracts[0].contractCustomers[0].coreCustomerId
                    }]);
                    data.singleCustomer = true;
                    data.cif = this.cif;
                    this.view.contractList.setVisibility(false);
                    this.view.flxMainContainer.setVisibility(true);
                    if (data.isEdit) {
                        let params = this.saveChangedBeneficiaryDetails(data);
                        this.euroPresenter.saveChangedBeneficiaryDetails(data, params);
                    } else {
                        this.euroPresenter.showView("frmAddBeneficiaryConfirmEuro", data);
                    }   
                } else {
                    this.view.contractList.setVisibility(true);
                    this.view.flxMainContainer.setVisibility(false);
                    contractsData.isCombinedUser = applicationManager.getUserPreferencesManager().profileAccess == "both" ? true : false;
                    contractsData.action = data.feature;

                    if (data.isEdit && data.cif) {
                        this.view.contractList.preshow(contractsData, data.cif);
                    } else {
                        this.view.contractList.preshow(contractsData);
                    }

                    this.view.contractList.btnAction4.onClick = this.onContractCancelButtonPress.bind(this);
                    this.view.contractList.btnAction5.onClick = this.onContractsBackButtonPress.bind(this);
                    this.view.contractList.btnAction6.onClick = this.onContractContinueButtonPress.bind(this, data);
                }
            } else {
               kony.print("Error")
            }
        },
        onContractsBackButtonPress: function() {
            this.view.contractList.setVisibility(false);
            this.view.flxMainContainer.setVisibility(true);
            this.view.btnContinue.onClick = this.getContracts.bind(this, true, true);
        },

        onContractCancelButtonPress: function() {
            this.ManageActivitiesPresenter.showTransferScreen({
                context: "ManageBeneficiaries"
            });
        },

        onContractContinueButtonPress: function(data) {
            
            if (data.isEdit) {
                data.contractsData = this.view.contractList.segContract.data;
                let params = this.saveChangedBeneficiaryDetails(data);
                this.euroPresenter.saveChangedBeneficiaryDetails(data, params);

            } else {
                let addBenificiaryData = this.getFormData();
                addBenificiaryData.contractsData = this.view.contractList.segContract.data;
                addBenificiaryData.cif = this.createCIFDataForAddBenificiary(this.view.contractList.segContract.data)
                this.euroPresenter.showView("frmAddBeneficiaryConfirmEuro", addBenificiaryData);
            }
            
        },

        createCIFDataForAddBenificiary: function(segData) {
            var cif = [];
            segData.forEach(function(contract) {
                var coreCustomerIdArray = [];
                contract[1].forEach(function(customer) {
                    if (customer.lblCustomerCheckbox["text"] === "C") {
                        coreCustomerIdArray.push(customer.lblCustomerNumber.text);
                    }
                });
                cif.push({
                    "contractId": contract[0].lblIdentityNumber.text,
                    "coreCustomerId": coreCustomerIdArray.join(',')
                });
            });
            return JSON.stringify(cif);
        },

        getFormData: function () {
            var scopeObj = this;
            let data = {
                "accountNumber": scopeObj.view.tbxAccountNumber.text.trim(),
                "IBAN": scopeObj.view.tbxAccountNumber.text.trim(),
                "beneficiaryName": CommonUtilities.changedataCase(scopeObj.view.tbxBeneficiaryName.text.trim()),
                "bankName": scopeObj.view.tbxBankName.text.trim() || "",
                "bankCountry": bank_country,
                "nickName": CommonUtilities.changedataCase(scopeObj.view.tbxBeneficiaryNickname.text.trim()) || "",
                "addressLine1": CommonUtilities.changedataCase(scopeObj.view.tbxAddressLine01.text.trim()),
                "addressLine2": CommonUtilities.changedataCase(scopeObj.view.tbxAddressLine02.text.trim()),
                "city": CommonUtilities.changedataCase(scopeObj.view.tbxCity.text.trim()),
                "zipcode": scopeObj.view.tbxPostCode.text.trim(),
                "country": CommonUtilities.changedataCase(scopeObj.view.tbxCountry.text.trim()),
                "phone": scopeObj.view.tbxPhoneNumber.text.trim(),
                "email": scopeObj.view.tbxEmailAddress.text.trim(),
                "swiftCode": scopeObj.view.tbxSWIFTBIC.text.trim(),
                "sameBank": scopeObj.view.lblRadioBtn1.skin,
                "otherBank": scopeObj.view.lblRadioBtn2.skin,
                "isVerified" : true
            };
            if (scopeObj.view.lblRadioBtn1.text === ViewConstants.FONT_ICONS.RADIO_BUTTON_SELECTED_NUO) {
                data["isSameBankAccount"] = true;
                data["isInternationalAccount"] = false;
            } else {
                data["isSameBankAccount"] = isSameBankAccount;
                data["isInternationalAccount"] = isInternationalAccount;
                data["swiftCode"] = scopeObj.view.tbxSWIFTBIC.text.trim();
            }

            return data;
        }
    };
});