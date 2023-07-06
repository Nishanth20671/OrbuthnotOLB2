define(['FormControllerUtility', 'CommonUtilities', 'ViewConstants', 'OLBConstants'], function (FormControllerUtility, CommonUtilities, ViewConstants, OLBConstants) {
     
    var orientationHandler = new OrientationHandler();
    var pageNumber;
    var totalNoOfRecords;
    var noResults;
    var recordsPerPage;
    var records = [];
    var searchView;
    var searchKeyword;
    var international_flag;
    var inter_flag;
    var intra_flag;
    var payment_method;
    this.beneficiaryRecords = "";
    var segLastRowClicked=null;
    return {
        init: function () {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function () { };
            this.view.onBreakpointChange = this.onBreakpointChange;
            var scopeObj = this;
            this.ManageActivitiesPresenter = applicationManager.getModulesPresentationController({ "appName": "TransfersMA", "moduleName": "ManageActivitiesUIModule" });
            this.Europresenter = applicationManager.getModulesPresentationController({ "appName": "TransfersMA", "moduleName": "TransferEurUIModule" });
            this.view.txtSearch.onKeyUp = this.onTxtSearchKeyUp.bind(this);
            this.view.btnConfirm.onClick = this.onSearchBtnClick.bind(this);
            this.view.txtSearch.onDone = this.onSearchBtnClick.bind(this);
            this.view.flxClearBtn.onClick = this.onSearchClearBtnClick.bind(this);
            this.view.btnAddNewBeneficiary.onClick = function () {
                scopeObj.Europresenter.showTransferScreen({
                    context: "AddBeneficiary"
                })
            };
            this.view.flxAddNewBeneficiary.onClick = function () {
                scopeObj.Europresenter.showTransferScreen({
                    context: "AddBeneficiary"
                })
            };
            this.view.flxCross.onClick = function () {
                scopeObj.view.flxSuccessMessage.setVisibility(false);
            };
            scopeObj.setSorting();
        },
        onBreakpointChange: function (form, width) {
            var scope = this;
            this.view.CustomPopup.onBreakpointChangeComponent(scope.view.CustomPopup, width);
            this.view.DeletePopup.onBreakpointChangeComponent(scope.view.DeletePopup, width);
            FormControllerUtility.setupFormOnTouchEnd(width);
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.view.customfooternew.onBreakpointChangeComponent(width);
            if (this.previousBreakpoint === 640) {
                this.changeTemplateOnBreakpoint("flxManageBeneficiariesSelected");
            }else if (width === 640) {
                this.changeTemplateOnBreakpoint("flxManageBeneficiariesSelectedMobile");
            }
            this.previousBreakpoint = width;
        },

        /**
         * This method changes the template of Manage Benificieries segment when breakpoint is changed from any to 640 and 640 to any.
         * This is triggered from onBreakPointChange menthod.
         * @param {String} template - template which has to be assigned to the segment.
         */
        changeTemplateOnBreakpoint : function(template){
            var segData = this.view.segmentBillpay.data;
            if (segData === null || segData === undefined) {
                return;
            }
            segData.forEach(row => {
                row.template = template;
            });
            this.view.segmentBillpay.setData(segData);
        },

        preShow: function () {
            scopeObj=this;
            this.view.customheadernew.activateMenu("EUROTRANSFERS", "Manage Beneficiaries");
            this.view.flxClearBtn.setVisibility(false);
            this.view.flxSuccessMessage.setVisibility(false);
            this.view.txtSearch.text = "";
            var offsetLimit = this.view.pagination.getDefaultOffsetAndLimit();
            this.offset = offsetLimit.offset;
            recordsPerPage = offsetLimit.limit;
            this.view.pagination.fetchPaginatedRecords = this.fetchPaginatedRecords;
            this.view.pagination.resetStartIndex();
            this.view.pagination.collapseDropDown();
            this.view.CustomPopup.onKeyPress = this.onKeyPressCallBack;
            this.view.DeletePopup.onKeyPress = this.onKeyPressCallBack;
            this.view.onKeyPress = this.onKeyPressCallBack;
            this.view.customheadernew.btnSkipNav.onClick= function(){
              scopeObj.view.btnBypass.setFocus(true);
            };
            this.view.btnBypass.onClick=function(){
              scopeObj.view.flxAddNewBeneficiary.setActive(true);
            };        
        },
        onKeyPressCallBack: function (eventObject, eventPayload) {
            var self = this;
            if (eventPayload.keyCode === 27) {
                if (self.view.flxDeletePopup.isVisible === true) {
                    self.view.flxDialogs.isVisible = false;
                    self.view.flxDeletePopup.isVisible = false;
                    if(segLastRowClicked!==null){
                        self.view.segmentBillpay.setActive(segLastRowClicked,-1);
                    }
                }
                else if(self.view.flxLogout.isVisible === true){
                    self.view.flxDialogs.isVisible = false;
                    self.view.flxLogout.isVisible = false; 
                }
            }
            this.view.customheadernew.onKeyPressCallBack(eventObject,eventPayload);
        },
        postShow: function () {
            this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.frame.height - this.view.flxFooter.frame.height + "dp";
            applicationManager.getNavigationManager().applyUpdates(this);
            applicationManager.executeAuthorizationFramework(this);
            this.accessibilityFocusSetup();
            this.view.CustomPopup.doLayout = CommonUtilities.centerPopupFlex;
            this.view.DeletePopup.doLayout = CommonUtilities.centerPopupFlex;
        },
        showAddBeneficiaryFlx: function () {
            this.view.flxRight.setVisibility(true);
        },
        hideAddBeneficiaryFlx: function () {
            this.view.flxRight.setVisibility(false);
        },
        /**
         * Set foucs handlers for skin of parent flex on input focus 
         */
        accessibilityFocusSetup: function () {
            let widgets = [
                [this.view.txtSearch, this.view.flxtxtSearchandClearbtn]
            ]
            for (let i = 0; i < widgets.length; i++) {
                CommonUtilities.setA11yFoucsHandlers(widgets[i][0], widgets[i][1], this)
            }
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
            if (viewModel.manageBeneficiary) {
                this.bindManagePayeeData(viewModel);
                this.beneficiaryRecords = viewModel;
                this.view.pagination.updatePaginationBar(0, viewModel.manageBeneficiary.length);
            }
            if (viewModel.deleteResponse) {
                this.showDeleteAck(viewModel.deleteResponse);
            }
            if (viewModel.serverError) {
                this.view.rtxDowntimeWarning.text = viewModel.serverError;
                this.view.flxDowntimeWarning.setVisibility(true);
                this.view.flxSuccessMessage.setVisibility(false);
                this.view.flxFormContent.forceLayout();
            } else {
                this.view.flxDowntimeWarning.setVisibility(false);
            }
            if (viewModel.noBeneficiaries) {
                this.showNoBeneficiaries({
                    noBeneficiariesMessageI18Key: "i18n.TransfersEur.YouHaveNoSavedBeneficiaries"
                });
            }
        },
        /**
         * Sorting Configurations for Manage Beneficiaries
         */
        setSorting: function () {
            var scopeObj = this;
            scopeObj.manageBeneficiarySortMap = [{
                name: 'beneficiaryName',
                imageFlx: scopeObj.view.imgBillerSort,
                clickContainer: scopeObj.view.flxBillerName
            },
            {
                name: 'bankName',
                imageFlx: scopeObj.view.imgSortLastPayment,
                clickContainer: scopeObj.view.flxLastPayment
            },
            {
                name: 'isVerified',
                imageFlx: scopeObj.view.imgNextBillSort,
                clickContainer: scopeObj.view.flxNextBill
            }
            ];
            FormControllerUtility.setSortingHandlers(scopeObj.manageBeneficiarySortMap, scopeObj.onManageBeneficiarySortClickHandler, scopeObj);
        },
        /**
         * Manage Beneficiaries sorting handler
         * @param {object} event
         * @param {object} data
         */
        onManageBeneficiarySortClickHandler: function (event, data) {
            var scopeObj = this;
            FormControllerUtility.showProgressBar(scopeObj.view);
            scopeObj.ManageActivitiesPresenter.fetchManageBeneficiary(data);
        },
        /**
         * used to bind the manage beneficiaries data
         * @param {object} data data
         * @param {object}  noofRecords no of records
         * @param {boolean} searchvisibility search visibulity
         */
        bindManagePayeeData: function (data) {
            this.setManageBeneficiariesSegmentData({
                "manageBeneficiary": data.manageBeneficiary ? data.manageBeneficiary : data,
                "noOfRecords": data.noOfRecords,
                "searchvisibility": data.searchvisibility,
                "noResults": data.noResults,
                "searchKeyword": data.searchKeyword

            });
            FormControllerUtility.updateSortFlex(this.manageBeneficiarySortMap, data.noOfRecords);
        },

        showDeleteAck: function (response) {
            if (response.dbpErrMsg) {
                this.view.flxDowntimeWarning.setVisibility(true);
                this.view.flxSuccessMessage.setVisibility(false);
                this.view.rtxDowntimeWarning.text = response.dbpErrMsg
            } else {
                this.view.flxSuccessMessage.setVisibility(true);
                this.view.flxDowntimeWarning.setVisibility(false);
                this.view.lblRefrenceNumberValue.text = response.referenceId || response.Id;
                this.view.lblSuccessAcknowledgement.text = kony.i18n.getLocalizedString("i18n.TransfersEur.BeneficiaryRemoved");
            }
        },
        /**
         * Method to set data for Manage Beneficiary Segment
         * @param {object}  data list of beneficiaries
         */
        setManageBeneficiariesSegmentData: function (data) {
            var scopeObj = this;
            scopeObj.view.flxMainContainer.setVisibility(true);
            scopeObj.view.segmentBillpay.setVisibility(true);
            scopeObj.view.flxNoPayment.setVisibility(false);
            if (kony.application.getCurrentBreakpoint() == 640 || orientationHandler.isMobile) {
                scopeObj.view.flxManageHeader.setVisibility(false);
            } else {
                scopeObj.view.flxManageHeader.setVisibility(true);
            }
            pageNumber = 1;
            records = data.manageBeneficiary;
            totalNoOfRecords = data.manageBeneficiary.length;
            noResults = data.noResults
            searchView = data.searchvisibility;
            searchKeyword = data.searchKeyword
            scopeObj.setSegmentData(scopeObj.getDataOfPage());
        },
        /**
         * Method to get records of a particular page
         * @return {Array} Manage Beneficiaries of a particular page
         */
        getDataOfPage: function () {
            return records.slice((pageNumber - 1) * recordsPerPage, pageNumber * recordsPerPage);
        },
        showInternational: function () {
            international_flag = 1;
        },
        hideInternational: function () {
            international_flag = 0;
        },
        showInter: function () {
            inter_flag = 1;
        },
        hideInter: function () {
            inter_flag = 0;
        },
        showIntra: function () {
            intra_flag = 1;
        },
        hideIntra: function () {
            intra_flag = 0;
        },

        /**
         * Method to set records in segment
         * @param {Array} data -  Records Array of a particular page
         */
        setSegmentData: function (data) {
            var scopeObj = this;
            if (!searchView) {
                scopeObj.view.flxPagination.setVisibility(true);
            } else {
                scopeObj.view.flxPagination.setVisibility(false);
            }
            if (data.length === 0) {
                if (noResults) {
                    scopeObj.showNoBeneficiaries({
                        noBeneficiariesMessageI18Key: "i18n.TransferEur.noResultFound"
                    });
                } else {
                    scopeObj.showNoBeneficiaries({
                        noBeneficiariesMessageI18Key: "i18n.TransfersEur.YouHaveNoSavedBeneficiaries"
                    });
                }
                FormControllerUtility.hideProgressBar(this.view);
                return;
            }
            var dataMap = {
                "flxIdentifier": "flxIdentifier",
                "lblIdentifier": "lblIdentifier",
                "lblDropdown": "lblDropdown",
                "flxDetail":"flxDetail",
                "flxDropdown":"flxDropdown",
                "flxManageBeneficiariesSelected": "flxManageBeneficiariesSelected",
                "flxManageBeneficiariesSelectedMobile": "flxManageBeneficiariesSelectedMobile",
                "lblAccountName": "lblAccountName",
                "lblBankName": "lblBankName",
                "lblStatus": "lblStatus",
                "btnAction": "btnAction",
                "lblSeparator": "lblSeparator",
                "flxAccountNumberTitle": "flxAccountNumberTitle",
                "lblAccountNumberTitle": "lblAccountNumberTitle",
                "lblAccountNumberValue": "lblAccountNumberValue",
                "flxAddressTitle": "flxAddressTitle",
                "lblAddressTitle": "lblAddressTitle",
                "lblAddressValue": "lblAddressValue",
                "flxAddressValue": "flxAddressValue",
                "lblAddress1": "lblAddress1",
                "lblAddress2": "lblAddress2",
                "lblAddress3": "lblAddress3",
                "flxSwiftTitle": "flxSwiftTitle",
                "lblSwiftTitle": "lblSwiftTitle",
                "lblSwiftValue": "lblSwiftValue",
                "flxEmailTitle": "flxEmailTitle",
                "lblEmailTitle": "lblEmailTitle",
                "lblEmailValue": "lblEmailValue",
                "lblNickNameTitle": "lblNickNameTitle",
                "lblNickNameValue": "lblNickNameValue",
                "flxPhoneNumber": "flxPhoneNumber",
                "lblPhoneNumberTitle": "lblPhoneNumberTitle",
                "lblPhoneNumberValue": "lblPhoneNumberValue",
                "lblPaymentMethodTitle": "lblPaymentMethodTitle",
                "lblPaymentMethodValue": "lblPaymentMethodValue",
                "btnViewActivity": "btnViewActivity",
                "btnEdit": "btnEdit",
                "btnRemoveRecipient": "btnRemoveRecipient",
                "flxActions": "flxActions",
                "lblSeparatorLineAction1": "lblSeparatorLineAction1",
                "lblSeparatorLineAction2": "lblSeparatorLineAction2",
                "lblSeparatorLineAction3": "lblSeparatorLineAction3",
                "lblSeperatorone": "lblSeperatorone",
                "lblLinkedWithValue": "lblLinkedWithValue"
            };
            if (data.length > 0) {
                var manageBeneficiariesData = data.map(function (dataItem) {
                    var strings = [dataItem.city, dataItem.country, dataItem.zipcode];
                    var adr = strings.filter(function (string) {
                        if (string) {
                            return true;
                        }
                        return false;
                    }).join(', ');
                    if (dataItem.isInternationalAccount === "false" && dataItem.isSameBankAccount === "false") {
                        payment_method = "Domestic";
                    } else if (dataItem.isInternationalAccount === "true") {
                        payment_method = "International";
                    } else if (dataItem.isInternationalAccount === "false" && dataItem.isSameBankAccount === "true") {
                        payment_method = "Within Bank";
                    }
                    var dataObject = {
                        "beneficiaryId": {
                            "text": dataItem.Id
                        },
                        "lblSeparator": {
                            "text": ""
                        },
                        "lblSeparator1": {
                            "text": " "
                        },
                        "lblSeperatorone": {
                            "text": ""
                        },
                        "flxIdentifier": {
                            "skin": "sknFlxIdentifier",
                        },
                        "lblIdentifier": {
                            "skin": "sknffffff15pxolbfonticons"
                        },
                        "lblDropdown": {
                            "text": "O",
                        },
                        "flxDropdown": {
                          "accessibility":{
                            "a11yLabel": "show more details",
                            "a11yARIA": {
                              "role":"button",
                               "aria-expanded":false
                            }
                          }
                        },
                        "flxDetail":{
                          "isVisible":false
                        },
                        "flxManageBeneficiariesSelected": {
                            "height": "50dp",
                            "skin": "sknflxffffffnoborder"
                        },
                        "flxManageBeneficiariesSelectedMobile": {
                            "height": "70dp",
                            "skin": "sknflxffffffnoborder"
                        },
                        "lblAccountName": {
                            "text": dataItem.beneficiaryName ? dataItem.beneficiaryName : dataItem.nickName ? dataItem.nickName : dataItem.accountNumber,
                            "skin": "sknLblSSP15pxtrucation",
                            "toolTip": dataItem.beneficiaryName ? dataItem.beneficiaryName : dataItem.nickName ? dataItem.nickName : dataItem.accountNumber
                        },
                        "lblBankName": {
                            "text": dataItem.bankName ? dataItem.bankName : "-"
                        },
                        "lblStatus": {
                            "text": dataItem.isVerified ? kony.i18n.getLocalizedString("i18n.transfers.verified") : kony.i18n.getLocalizedString("i18n.accounts.pending"),
                        },
                        "lblAccountNumberTitle": {
                            "text": kony.i18n.getLocalizedString("i18n.ProfileManagement.AccountNumber")
                        },
                        "lblAccountNumberValue": {
                            "text": dataItem.accountNumber
                        },
                        "lblAddressTitle": {
                            "text": kony.i18n.getLocalizedString("i18n.ProfileManagement.Address") + ":"
                        },
                        "lblAddressValue": {
                            "text": dataItem.addressLine1 ? dataItem.addressLine1 : "-"
                        },
                        "lblAddress1": {
                            "text": (!dataItem.addressLine1 && !dataItem.city && !dataItem.zipcode && !dataItem.country) ? "-" : dataItem.addressLine1,
                            "isVisible": (!dataItem.addressLine1 && !dataItem.city && !dataItem.zipcode && !dataItem.country) ? true : (dataItem.addressLine1) ? true : false
                        },
                        "lblAddress2": {
                            "isVisible": false
                        },
                        "lblAddress3": {
                            "isVisible": (!dataItem.city && !dataItem.zipcode && !dataItem.country) ? false : true,
                            "text": (!dataItem.city && !dataItem.postCode && !dataItem.country) ? "-" : adr
                        },
                        "flxSwiftTitle": {
                            "isVisible": dataItem.isSameBankAccount === "true" ? false : true
                        },
                        "lblSwiftTitle": {
                            "text": kony.i18n.getLocalizedString("i18n.accounts.swiftCode") + ":"
                        },
                        "lblSwiftValue": {
                            "text": dataItem.swiftCode ? dataItem.swiftCode : "-"
                        },
                        "lblEmailTitle": {
                            "text": kony.i18n.getLocalizedString("i18n.konybb.manageUser.EmailID") + ":"
                        },
                        "lblEmailValue": {
                            "text": dataItem.email
                        },
                        "lblNickNameTitle": {
                            "text": kony.i18n.getLocalizedString("i18n.TransfersEur.Nickname") + ":"
                        },
                        "lblNickNameValue": {
                            "text": dataItem.nickName ? dataItem.nickName : "-",
                            "skin": "sknLblSSP13pxtrucation",
                            "toolTip": dataItem.nickName ? dataItem.nickName : "-"
                        },
                        "lblPhoneNumberTitle": {
                            "text": kony.i18n.getLocalizedString("i18n.ProfileManagement.PhoneNumbers") + ":"
                        },
                        "lblPhoneNumberValue": {
                            "text": dataItem.phoneNumber
                        },
                        "lblPaymentMethodTitle": {
                            "text": kony.i18n.getLocalizedString("i18n.TransfersEur.PaymentMethod") + ":"
                        },
                        "lblPaymentMethodValue": {
                            "text": payment_method
                        },
                        "btnAction": {
                            "text": kony.i18n.getLocalizedString("i18n.payments.makePayment"),
                            "toolTip": kony.i18n.getLocalizedString("i18n.payments.makePayment"),
                            "onClick": scopeObj.makePayment.bind(scopeObj, dataItem),
                        },
                        "btnViewActivity": {
                            "text": kony.i18n.getLocalizedString("i18n.transfers.viewActivity"),
                            "toolTip": kony.i18n.getLocalizedString("i18n.transfers.viewActivity"),
                            "isVisible": false
                        },
                        "btnEdit": {
                            "text": kony.i18n.getLocalizedString("i18n.billPay.Edit"),
                            "toolTip": kony.i18n.getLocalizedString("i18n.billPay.Edit"),
                            "onClick": function () {
                                scopeObj.Europresenter.showView("frmAddBeneficiaryEuro", {
                                    "editDetails": dataItem
                                });
                            }
                        },
                        "btnRemoveRecipient": {
                            "text": kony.i18n.getLocalizedString("i18n.bulkwires.Remove"),
                            "toolTip": kony.i18n.getLocalizedString("i18n.bulkwires.Remove"),
                            "onClick": function (widgetInfo,segInfo) {
                                segLastRowClicked=segInfo.rowIndex;
                                scopeObj.removeBeneficiary(dataItem,widgetInfo,segInfo);
                            },
                            "isVisible": scopeObj.permissionVisibility()
                        },
                        "lblLinkedWithValue": {
                            "text": dataItem.noOfCustomersLinked ? dataItem.noOfCustomersLinked + " " + kony.i18n.getLocalizedString("konybb.userMgmt.Customers") : " - "
                        },
                        "template": (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? "flxManageBeneficiariesSelectedMobile" : "flxManageBeneficiariesSelected",
                    }
                    return dataObject;
                });
                this.view.segmentBillpay.widgetDataMap = dataMap;
                this.view.segmentBillpay.setData(manageBeneficiariesData);
                scopeObj.view.flxNoPayment.setVisibility(false);
            }
            FormControllerUtility.hideProgressBar(this.view);
            scopeObj.view.forceLayout();
        },
        /**
         * method used to enable or disable the clear button.
         * @param {object} event event
         */
        onTxtSearchKeyUp: function () {
            var scopeObj = this;
            var searchKeyword = scopeObj.view.txtSearch.text.trim();
            if (searchKeyword.length > 0) {
                scopeObj.view.flxClearBtn.setVisibility(true);
            } else {
                scopeObj.view.flxClearBtn.setVisibility(false);
            }
            this.view.flxSearch.forceLayout();
        },
        /**
         * method to handle the search beneficiary functionality
         */
        onSearchBtnClick: function () {
            var scopeObj = this;
            var searchKeyword = scopeObj.view.txtSearch.text.trim();
            var allData = this.view.segmentBillpay.data;
            if (searchKeyword.length > 0) {
                scopeObj.ManageActivitiesPresenter.searchBeneficiaries({
                    'searchKeyword': searchKeyword
                }, allData);
                scopeObj.searchView = true;
            } else {
                scopeObj.ManageActivitiesPresenter.showTransferScreen({
                    "context": "ManageBeneficiaries"
                });
                scopeObj.searchView = false;
            }
        },
        /**
         * method used to call the service.
         */
        onSearchClearBtnClick: function () {
            var scopeObj = this;
            scopeObj.view.txtSearch.text = "";
            scopeObj.view.flxClearBtn.setVisibility(false);
            if (this.searchView === true) {
                scopeObj.ManageActivitiesPresenter.showTransferScreen({
                    "context": "ManageBeneficiaries"
                });
            }
            this.searchView = false;
        },
        /**
         * used to show the no beneficiary flow.
         * @param {message} message used to show the no beneficiary message on the page
         */
        showNoBeneficiaries: function (message) {
            var scopeObj = this;
            if (message) {
                scopeObj.view.flxNoPayment.setVisibility(true);
                scopeObj.view.segmentBillpay.setVisibility(false);
                scopeObj.view.flxPagination.setVisibility(false);
                if (searchKeyword)
                    scopeObj.view.rtxNoPaymentMessage.text = kony.i18n.getLocalizedString(message.noBeneficiariesMessageI18Key) + ' ' + searchKeyword;
                else
                    scopeObj.view.rtxNoPaymentMessage.text = kony.i18n.getLocalizedString(message.noBeneficiariesMessageI18Key)
            }
        },

        /**
         * construct a make payment object and send to makePayment
         * @param {object} dataItem payee Payment object
         */
        makePayment: function (dataItem) {
            var scopeObj = this;
            var makePaymentData = {
                "beneficiaryName": dataItem.beneficiaryName,
                "accountNumber": dataItem.accountNumber,
                "swiftCode": dataItem.swiftCode,
                "countryName": dataItem.countryName,
                "phoneNumber": dataItem.phoneNumber,
            };
            if (scope_configManager.TransferFlowType === "CTF") {
                scopeObj.Europresenter.showTransferScreen({
                    context: "MakePayment",
                    accountTo: dataItem.Id
                });
            } else {
                var frmName = "",
                    transferType = "";
                dataItem["toAccountNumber"] = dataItem.accountNumber;
                dataItem["transactionType"] = "ExternalTransfer";
                if (dataItem.isInternationalAccount === "false" && dataItem.isSameBankAccount === "true") {
                    frmName = "frmUTFSameBankTransfer";
                    transferType = "Same Bank";
                } else if (dataItem.isSameBankAccount === "false" && dataItem.isInternationalAccount === "false") {
                    frmName = "frmUTFDomesticTransfer";
                    transferType = "Domestic Transfer";
                } else if (dataItem.isInternationalAccount === "true") {
                    frmName = "frmUTFInternationalTransfer";
                    transferType = "International Transfer";
                } else {
                    frmName = "frmUTFP2PTransfer";
                    transferType = "Pay a Person";
                }
                var context = {
                    "transferType": transferType,
                    "transferFlow": "PayBeneficiary",
                    "transactionObject": dataItem
                };
                var navManager = kony.mvc.getNavigationManager();
                var obj = {
                    context: this,
                    params: context,
                    callbackModelConfig: {
                        "frm": frmName,
                        "UIModule": "UnifiedTransferFlowUIModule",
                        "appName": "TransfersMA"
                    }
                };
                navManager.navigate(obj);
            }
        },
        /**
         * method to delete beneficiary on click of Remove button.
         * @param {number} offsetVal offset value
         */
        removeBeneficiary: function (param,widgetInfo,segInfo) {
            var scopeObj = this;
            var data = this.view.segmentBillpay.data;
            //var index = this.view.segmentBillpay.selectedRowIndex[1];
            var index = param.rowIndex;
            var deleteData = {
                "accountNumber": param.accountNumber,
                "payeeId": param.Id,
                "isSameBankAccount": param.isSameBankAccount,
                "isInternationalAccount": param.isInternationalAccount
            };
            scopeObj.view.flxDialogs.setVisibility(true);
            scopeObj.view.flxDeletePopup.setVisibility(true);
            scopeObj.view.DeletePopup.flxCross.setActive(true);
            var beneficiaryName = param.beneficiaryName || param.nickName || param.accountNumber;
            scopeObj.view.DeletePopup.lblPopupMessage.text=kony.i18n.getLocalizedString("i18n.TransfersEur.RemoveBeneficiaryMessage") + " " + beneficiaryName + "?";
            scopeObj.view.DeletePopup.btnYes.onClick = function () {
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.flxDeletePopup.setVisibility(false);
                if (deleteData !== null || deleteData.accountNumber !== null || deleteData.accountNumber !== "") {
                    scopeObj.ManageActivitiesPresenter.deleteBeneficiary(deleteData);
                }
            };
            scopeObj.view.DeletePopup.btnNo.onClick = function () {
                scopeObj.view.flxDeletePopup.setVisibility(false);
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.segmentBillpay.setActive(segInfo.rowIndex,-1);
            };
            scopeObj.view.DeletePopup.flxCross.onClick = function () {
                scopeObj.view.flxDeletePopup.setVisibility(false);
                scopeObj.view.flxDialogs.setVisibility(false);
                scopeObj.view.segmentBillpay.setActive(segInfo.rowIndex,-1);
            };
        },
        permissionVisibility: function () {
            if (payment_method == "International") {
                if (international_flag == 1) {
                    return true;
                } else {
                    return false
                }
            } else if (payment_method == "Within Bank") {
                if (intra_flag == 1) {
                    return true;
                } else {
                    return false
                }
            } else if (payment_method == "Domestic") {
                if (inter_flag == 1) {
                    return true;
                } else {
                    return false
                }
            }
        },
        /**
         * @function fetchPaginatedRecords
         * updates the segment based on the number of records per page selected or next/previous buttons are clicked
         * @input_arguement offset: offset of the record to be rendered in UI
         * @input_arguement noOfRecords: total number of beneficiary records
         * @return NA
         */
        fetchPaginatedRecords: function (offset, noOfRecords) {
            this.view.flxFormContent.setContentOffset({
                x: "0%",
                y: "0%"
            }, true);
            recordsPerPage = noOfRecords;
            this.offset = offset;
            if (offset === 0) {
                this.setManageBeneficiariesSegmentData(this.beneficiaryRecords);
                this.offsetFlag = offset;
            } else {
                this.setSegmentData(records.slice(offset, offset + noOfRecords));
            }
            this.view.pagination.updatePaginationBar(noOfRecords, records.length);
        },
    };
});