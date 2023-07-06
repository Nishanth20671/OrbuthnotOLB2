define("ArrangementsMA/AccountServicesUIModule/userfrmConfirmClosureController", ['CommonUtilities', 'ViewConstants', 'FormControllerUtility', 'OLBConstants', 'CampaignUtility'], function(CommonUtilities, ViewConstants, FormControllerUtility, OLBConstants, CampaignUtility) {
    //Type your controller code here 
    var orientationHandler = new OrientationHandler();
    return {
        selectedReason: "",
        fileCompRef: "",
        account: {},
        updateFormUI: function(uiData) {
            //alert('ok');
            if (uiData) {}
        },
        frmPreShow: function() {
            var formTemplateContext = {
                "sessionTimeOut": {
                    "timer": 4
                },
                "breadCrumbBack": {
                    "flag": false
                }
            }
            scopeObj = this;
            this.view.init = this.initActions;
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountServicesUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.getTandCData();
            var navMan = applicationManager.getNavigationManager();
            data = navMan.getCustomInfo("TandCdata");
            this.setTandCData(data);
            this.view.formAccountClosure.setContext(formTemplateContext);
            this.view.formAccountClosure.onError = this.onError;
            this.view.formAccountClosure.flxContentPopup.flxTC.doLayout = this.centerPopupFlex;
            this.view.formAccountClosure.flxContentPopup.btnClose.onClick = this.hideTermsAndConditionPopUp;
            this.view.formAccountClosure.flxContentTCCenter.lblTAndC.onTouchStart = this.showTermsAndConditionPopUp;
            this.view.formAccountClosure.flxContentTCCenter.imgInfo1.onTouchStart = function() {
                scopeObj.view.formAccountClosure.flxContentTCCenter.flxSuppDocInfo.top = "130dp";
                if (orientationHandler.isMobile) {
                    scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxSuppDocInfo.left = "10dp";
                }
                scopeObj.view.formAccountClosure.flxContentTCCenter.flxSuppDocInfo.isVisible = !scopeObj.view.formAccountClosure.flxContentTCCenter.flxSuppDocInfo.isVisible;
            };
            this.view.formAccountClosure.flxContentTCCenter.lblClose1.onTouchStart = function() {
                scopeObj.view.formAccountClosure.flxContentTCCenter.flxSuppDocInfo.isVisible = false;
            }
            if(orientationHandler.isMobile){
                scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.centerY = "";
                scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.top = "10dp";
            }
            this.setupResponsiveUI();
            this.fileCompRef = this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.uploadFiles3;
            this.setDataForUploadFileComp();
            var navMan = applicationManager.getNavigationManager();
            this.fileCompRef.removeAllDocs();
            this.setDataForReasons();
            account = navMan.getCustomInfo("frmConfirmClosure");
            this.account = account;
            statusMessage = navMan.getCustomInfo("statusMessage");
            if (statusMessage == "" || statusMessage == undefined || statusMessage == null) {
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxAlert.isVisible = false;
            } else {
                data = [{
                    lblDot: "F",
                    lblReason: statusMessage
                }]
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxAlert.flxAlertMain.flxReasonsMain.segAlerts.setData(data)
            }
            this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.lblDropdown.text = "Select";
            this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDropDownMenu.isVisible = false;
            this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.flxDropdown.lblDropdownIcon.text = "O";
            this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.flxCheckBox.lblCheckBox.text ='D';
            this.setDataForForm(account);
            this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.onTouchStart = function() {
                scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDropDownMenu.isVisible = !(scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDropDownMenu.isVisible);
                scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.flxDropdown.lblDropdownIcon.text = scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.flxDropdown.lblDropdownIcon.text === "O" ? "P" : "O";
                if (kony.application.getCurrentBreakpoint < 640 ) {
                    scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.flxDropdown.left = "10dp";
                    scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.flxDropdown.width = "90%";
                }
                if(orientationHandler.isMobile) {
                    scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.flxDropdown.left = "92%";
                    scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.flxDropdown.width = "20dp";
                }
            };
            this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.flxCheckBox.onClick = function() {
                var txt = scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.lblDropdown.text;
                if (scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.flxCheckBox.lblCheckBox.text == 'D') {
                    if(txt !== "Select"){scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.setEnabled(true);
                    scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.skin = "sknBtnNormalSSPFFFFFF15Px";}
                    scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.flxCheckBox.lblCheckBox.text = "C";
                } else {
                    scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.setEnabled(false);
                    scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.skin = "sknBtnBlockedSSPFFFFFF15Px"
                    scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.flxCheckBox.lblCheckBox.text = "D";
                }
            }
            this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDropDownMenu.segReasons.onRowClick = function() {
                scopeObj.selectedReason = scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDropDownMenu.segReasons.selectedRowItems[0].lblUsers;
                scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.lblDropdown.text = scopeObj.selectedReason;
                scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.lblDropdown.skin = "bbSknLbl424242SSP15Px"
                scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDropDownMenu.isVisible = false;
                scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.flxDropdown.lblDropdownIcon.text = "O";
                var txt = scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.lblDropdown.text;
                if (scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.flxCheckBox.lblCheckBox.text == 'C' && txt !== "Select") {
                    scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.setEnabled(true);
                    scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.skin = "sknBtnNormalSSPFFFFFF15Px"
                }
            }
            this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.onClick = this.showConfirmation;
            this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnCancel.onClick = this.backToAccountDetails;
        },
        setDataForReasons: function(){
            var reasons = applicationManager.getConfigurationManager().getConfigurationValue('AcCloseReason');
            if(!kony.sdk.isNullOrUndefined(reasons) && reasons.length !== 0){
                data = []
                for(var i=0 ; i<reasons.length ; i++){
                    let segData = {
                        "lblUsers" : reasons[i]
                    } 
                    data.push(segData)
                }
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDropDownMenu.segReasons.setData(data); 
            }
        },
        setupResponsiveUI: function() {
            this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.setEnabled(false);
            scopeObj.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.skin = "sknBtnBlockedSSPFFFFFF15Px"
            if (kony.application.grtCurrentBreakpoint <= 640 || orientationHandler.isMobile) {
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.flxDropdown.left = "10dp";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.flxDropdown.width = "90%";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.left = "3%";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.width = "93.5%";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.top = "50dp";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnCancel.left = "3%";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnCancel.top = "110dp";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnCancel.width = "93.5%";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.left = "0dp";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.width = "100%";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.height = "160dp";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.top = "5%";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.width = "100%";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.height = "20%";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.flxCheckBox.left = "10dp";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.lblCheckMsg.left = "40dp";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.lblTAndC.left = "115dp";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.flxDropdown.right = "0dp";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxClosingDropdown.flxDropdown.left = "92%";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDropDownMenu.left = "20dp";
            } else if (kony.application.grtCurrentBreakpoint >= 1366 || orientationHandler.isDesktop) {
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.left = "0dp";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.width = "96%";
            } else if (kony.application.grtCurrentBreakpoint === 1024 || orientationHandler.isTablet) {
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.left = "0dp";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.width = "96%";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.flxCheckBox.left = "20dp";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.lblCheckMsg.left = "50dp";
                this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.flxCheckBoxMain.lblTAndC.left = "125dp";
            }
        },
        initActions: function() {
            FormControllerUtility.setRequestUrlConfig(this.view.formAccountClosure.flxContentPopup.brwBodyTnC);
        },
        setTandCData: function() {
            content = {
                "termsAndConditionsContent": ""
            }
            FormControllerUtility.setHtmlToBrowserWidget(this, this.view.formAccountClosure.flxContentPopup.brwBodyTnC, content.termsAndConditionsContent);
        },
        centerPopupFlex: function(popupWidget) {
            popupWidget = this.view.formAccountClosure.flxContentPopup.flxTC;
            popupWidget.info = popupWidget.frame;
            if (kony.os.deviceInfo().screenHeight - 40 <= popupWidget.info.height) {
                popupWidget.top = "20dp";
                popupWidget.height = kony.os.deviceInfo().screenHeight - 40 + "dp";
                this.view.formAccountClosure.flxContentPopup.brwScroll.height = kony.os.deviceInfo().screenHeight - 124 + "dp";
                popupWidget.centerY = "";
            } else {
                if (kony.application.getCurrentBreakpoint() === 640) {
                    popupWidget.height = "325dp";
                } else if (kony.application.getCurrentBreakpoint() === 768) {
                    popupWidget.height = "400dp";
                } else if (kony.application.getCurrentBreakpoint() === 1024) {
                    popupWidget.height = "500dp";
                } else {
                    popupWidget.height = "450dp";
                }
                popupWidget.top = "";
                popupWidget.centerX = "50%"
                popupWidget.centerY = "50%";
            }
            this.view.forceLayout();
        },
        reset: function() {
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDropdown.lblDropdown.text = "Select";
        },
        postShow: function() {
            applicationManager.getNavigationManager().applyUpdates(this);
        },
        showTermsAndConditionPopUp: function() {
            var navMan = applicationManager.getNavigationManager();
            data = navMan.getCustomInfo("TandCdata");
            this.view.formAccountClosure.contentPopupVisiblility = true;
            this.view.formAccountClosure.flxContentPopup.flxTC.isModalContainer = true;
            this.view.formAccountClosure.flxContentPopup.btnClose.setFocus(true);
            this.view.formAccountClosure.flxContentPopup.flxScrollDetails.isVisible = false;
            this.view.formAccountClosure.flxContentPopup.flxTCContents.isVisible = true;
            this.view.formAccountClosure.flxContentPopup.flxTCContents.rtxTC.text = data.termsAndConditionsContent;
        },
        hideTermsAndConditionPopUp: function() {
            this.view.formAccountClosure.contentPopupVisiblility = false;
            this.view.formAccountClosure.flxContentPopup.flxTC.isModalContainer = true;
            this.view.formAccountClosure.flxContentTCCenter.lblTAndC.setFocus(true);
        },
        setDataForForm: function(account) {
            temp = this.view.formAccountClosure.flxContentTCCenter.flxAccountClosure.flxCont;
            temp.lblValAccountName.text = account.accountName;
            temp.lblValAccountNumber.text = account.accountID;
            temp.lblValAccountType.text = account.accountType;
            temp.lblValCurrentBalance.text = CommonUtilities.formatCurrencyWithCommas(account.currentBalance, false, account.currencyCode);
            kony.application.dismissLoadingScreen();
        },
        setDataForUploadFileComp: function() {
            var isMandatory = true;
            var navMan = applicationManager.getNavigationManager();
            var files = navMan.getCustomInfo("modifyFileData");
            var filesData = [];
            if (kony.sdk.isNullOrUndefined(files)) {
                this.fileCompRef.removeAllDocs();
            }
            var config = {
                "selectMultipleFiles": false,
                "filter": ['image/jpeg', 'application/pdf']
            }
            var dataComp = {
                // "title": kony.i18n.getLocalizedString("kony.onboarding.documents.adddocuments"),
                // "description": kony.i18n.getLocalizedString("kony.onboarding.documents.lblUploadDescription.text"),
                // "uploadFilesDocCallback": this.uploadFilesCallback.bind(this, userActionName, false, key, coApplicantKey, isMandatory, applicantType,areMultipleUserActionsPresent),//userActions[key][i].ActionMetaData.Skippable),
                // "fileSelectedCallback": this.fileSelectedCallBack.bind(this, userActionName),
                // "downloadCallback": this.downloadCallback.bind(this),
                "removeFileCallback": this.removeFileCallback.bind(this, isMandatory),
                // "checkEvidenceCallback": this.checkEvidenceCallback.bind(this, isMandatory),
                // "deleteEvidenceCallback": this.deleteEvidenceCallback.bind(this, isMandatory),
                // "removeFileUpdateCallback": this.removeFileUpdateCallback.bind(this, isMandatory),
                // "removeFileDropdownCallback": this.removeFileDropdownCallback.bind(this, isMandatory),
                // "filesData": filesData,
                "config": config,
                // "fulfilmentId": fulfilmentId,
                // "hasUploadState": false
            };
            this.fileCompRef.setData(dataComp);
        },
        getFormattedFileDataForComp: function(files) {
            var fileData = [];
            files.forEach(function(file) {
                var fileObject = {
                    "fileObj": {
                        "documentName": file[1]
                    },
                    documentDescription: "file a added",
                    clientDocID: file[2]
                };
                fileData.push(fileObject);
            })
            return fileData;
        },
        removeFileCallback: function(isMandatory, file, uniqueId, removeSuccess, removeFailure, removeSuccessDocument, isUpload, componentParentData) {
            removeSuccess();
        },
        backToAccountDetails: function() {
            var navMan = applicationManager.getNavigationManager();
            account = navMan.getCustomInfo("frmConfirmClosure");
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountsUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.showAccountDetails(account);
        },
        showConfirmation: function() {
            var navMan = applicationManager.getNavigationManager();
            kony.application.showLoadingScreen();
            var navMan = applicationManager.getNavigationManager();
            navMan.setCustomInfo("frmAcClosureAcknowledge", "akhil");
            this.getFileData();
        },
        getFileData: function() {
            var browsedFiles = this.fileCompRef.getData();
            var navMan = applicationManager.getNavigationManager();
            var attachments = [],
                fileData = {};
            var reader = new FileReader();
            scopeObj = this;

            function readFile(index) {
                if (index >= browsedFiles.length) {
                    navMan.setCustomInfo("frmAcClosureFileData", attachments);
                    payload = {};
                    payload.accountName = scopeObj.account.accountName;
                    payload.accountNumber = scopeObj.account.accountID;
                    payload.accountType = scopeObj.account.accountType;
                    payload.currentBalance = scopeObj.account.currentBalance;
                    payload.currentBalanceCurrencyCode = scopeObj.account.currencyCode;
                    payload.closingReason = scopeObj.selectedReason;
                    payload.IBAN = scopeObj.account.IBAN;
                    payload.swiftCode = "";
                    navMan.setCustomInfo("frmAcClosurePayload", payload);
                    kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                        "moduleName": "AccountServicesUIModule",
                        "appName": "ArrangementsMA"
                    }).presentationController.showAccountClosureAcknowledgement(payload);
                } else {
                    var newFile = browsedFiles[index];
                    fileData = {};
                    fileData.fileName = newFile[0].name;
                    fileData.fileType = newFile[0].file.type;
                    fileData.fileInfo = newFile[1];
                    fileData.fileClientId = newFile[2];
                    fileData.documentStatus = "Pending";
                    reader.onloadend = function(e) {
                        var base64String = e.target.result;
                        base64String = base64String.replace("data:;base64,", "");
                        base64String = base64String.replace("data:image/png;base64,", "");
                        base64String = base64String.replace("data:application/octet-stream;base64,", "");
                        base64String = base64String.replace("data:image/jpeg;base64,", "");
                        base64String = base64String.replace("data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,", "");
                        base64String = base64String.replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", "");
                        base64String = base64String.replace("data:application/vnd.ms-excel;base64,", "");
                        fileData.fileContents = base64String.replace("data:application/pdf;base64,", "");
                        attachments.push(fileData);
                        readFile(index + 1);
                    };
                    reader.readAsDataURL(newFile[0].file);
                }
            }
            readFile(0);
        },
        getFormattedDate: function(date) {
            if (date.indexOf("-") == "-1") {
                var newDate = date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2);
                return CommonUtilities.getFrontendDateString(newDate);
            } else {
                return CommonUtilities.getFrontendDateString(date);
            }
        },
        onError: function() {
            FormControllerUtility.hideProgressBar(this.view);
        },
    }
});