define("ArrangementsMA/AccountsUIModule/userfrmChangeRepaymentDayController", ['CommonUtilities', 'ViewConstants', 'FormControllerUtility', 'OLBConstants', 'CampaignUtility'], function(CommonUtilities, ViewConstants, FormControllerUtility, OLBConstants, CampaignUtility) {
    //Type your controller code here 
    var orientationHandler = new OrientationHandler();
    return {
        selectedDay: "",
        updateFormUI: function(uiData) {
            //alert('ok');
            if (uiData) {
                if (uiData.details) {
                    account1 = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                        "moduleName": "AccountsUIModule",
                        "appName": "ArrangementsMA"
                    }).presentationController.currentAccount;
                    details = uiData.details;
                    if (!kony.sdk.isNullOrUndefined(account1) && !kony.sdk.isNullOrUndefined(details) && !kony.sdk.isNullOrUndefined(plans)) {
                        this.setDataForForm(account1, details, plans);
                    }
                }
                if (uiData.plans) {
                    plans = uiData.plans;
                    if (!kony.sdk.isNullOrUndefined(account1) && !kony.sdk.isNullOrUndefined(details) && !kony.sdk.isNullOrUndefined(plans)) {
                        this.setDataForForm(account1, details, plans);
                    }
                }
            }
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
            this.view.formChangeRepaymentDay.setContext(formTemplateContext);
            if (kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "AccountsUIModule",
                    "appName": "ArrangementsMA"
                }).presentationController.isFromMortgage === 1) {
                mortgageDetails = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "AccountServicesUIModule",
                    "appName": "ArrangementsMA"
                }).presentationController.mortgageDetails;
                mortgagePlans = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "AccountServicesUIModule",
                    "appName": "ArrangementsMA"
                }).presentationController.mortgagePlans;
                account1 = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                    "moduleName": "AccountsUIModule",
                    "appName": "ArrangementsMA"
                }).presentationController.currentAccount;
                this.setDataForForm(account1, mortgageDetails, mortgagePlans);
                this.reset();
            }
            this.fileCompRef = this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.uploadFiles3;
            this.setDataForUploadFileComp();
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.isVisible = false;
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSuppDocWarning.isVisible = false;
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.isVisible = false;
            //this.view.formChangeRepaymentDay.pageTitle = 'Change Repayment Day';
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.onClick = this.showConfirmation;
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnCancel.onClick = this.backToFacility;
            this.view.formChangeRepaymentDay.onError = this.onError();
            this.view.onBreakpointChange = this.onBreakpoint;
            var formTemplateContext = {
                "sessionTimeOut": {
                    "timer": 4
                },
                "breadCrumbBack": {
                    "flag": "false"
                }
            }
            this.view.formChangeRepaymentDay.setContext(formTemplateContext);
            scopeObj = this;
            scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.left = "30dp";
            scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.top = "240dp";
            scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.width = "360dp";
            scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.height = "217dp";
            scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.zindex = "10custom";
            scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.height = "240dp";
            scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.skin = "sknFlxffffffShadowd464545";
            scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.right = "0dp";
            scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.top = "10dp";
            scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.height = "101dp";
            scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.isVisible = false;
            scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.isVisible = false;
            if (kony.application.getCurrentBreakpoint() === 1366 || kony.application.getCurrentBreakpoint() === 1380 || orientationHandler.isDesktop) {
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSupportingDocMain.isVisible = false;
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.isVisible = false;
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.isVisible = false;
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.isVisible = false;
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSuppDocWarning.isVisible = false;
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.left = "125dp";
            } else if (kony.application.getCurrentBreakpoint() === 780 || orientationHandler.isTablet) {
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.left = "125dp";
            } else if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.left = "100dp";
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxWarning.left = "10dp";
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSupportingDoc.skin = "ICSknlbl424242SSPSemiBold15px";
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDropdown.left = "10dp";
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDropdown.width = "90%";
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDropdown.flxDropdown.left = "89%"
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.lblSeparatorLine2.left = "10dp";
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.left = "2.5%";
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.width = "100%";
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnCancel.width = "100%";
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnCancel.top = "60dp";
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnCancel.right = "0dp";
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.left = "10dp";
                this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.width = "90%";
            }
            if (this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDropdown.lblDropdown.text == "Select Repayment Day") {
                scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.skin = "sknBtnBlockedSSPFFFFFF15Px";
                scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.setEnabled(false);
            }
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDropdown.onClick = function() {
                scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.isVisible = !scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.isVisible;
                scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDropdown.flxDropdown.lblDropdownIcon.text = scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDropdown.flxDropdown.lblDropdownIcon.text == "O" ? "P" : "O";
                scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.zIndex = 10;
            }
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.imgInfo.onTouchStart = function() {
                if (scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.isVisible) {
                    scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.isVisible = false;
                } else {
                    scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.isVisible = true;
                    if (kony.application.getCurrentBreakpoint() === 1366 || orientationHandler.isDesktop) {
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.left = "140dp";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.width = "260dp";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.lblInfoIcon1.width = "213dp";
                    }
                }
                // scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.isVisible = !scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.isVisible;
                // if (kony.application.getCurrentBreakpoint() === 1366 || kony.application.getCurrentBreakpoint() === 1380 || orientationHandler.isDesktop) {
                //     // scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.left = "137dp";
                //     // scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.top = "193dp";
                //     // scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.width = "330dp";
                //     // scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.height = "66dp";
                // }
            }
            this.setDataForDropdown();
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.lblClose2.onTouchStart = function() {
                scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDayInfoIcon.isVisible = false;
            }
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.imgInfo1.onTouchStart = function() {
                if (scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.isVisible) {
                    scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.isVisible = false;
                } else {
                    scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.isVisible = true;
                    if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.left = "70dp";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.height = "100dp";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.lblSuppDocInfo.width = "226dp";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.lblSuppDocInfo.top = "33dp";
                    }
                }
                // scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.isVisible = !scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.isVisible;
                // if (kony.application.getCurrentBreakpoint() === 1366 || kony.application.getCurrentBreakpoint() === 1380 || orientationHandler.isDesktop) {
                // scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.left = "255dp";
                // scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.top = "290dp";
                // scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.width = "300dp";
                // scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.height = "124dp";
                //     scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.zIndex = 10;
                // }
            }
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.lblClose1.onTouchStart = function() {
                scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxSuppDocInfo.isVisible = false;
            }
            scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.segDays.onRowClick = function() {
                day = scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.segDays.selectedRowItems;
                scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.isVisible = false;
                scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDropdown.lblDropdown.text = day[0].lblAction;
                scopeObj.selectedDay = day[0].lblAction;
                scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDropdown.flxDropdown.lblDropdownIcon.text = "O";
                scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.skin = "sknBtnNormalSSPFFFFFF15Px";
                scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDocumentComponent.flxButtons.btnContinue.setEnabled(true);
                if (scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDropdown.lblDropdown.text === "31") {
                    scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.isVisible = true;
                    if (kony.application.getCurrentBreakpoint() === 1366 || kony.application.getCurrentBreakpoint() === 1380 || orientationHandler.isDesktop) {
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.left = "172dp";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.top = "172dp";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.text = "(Last calendar day of every month)";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.skin = "bbSknLbl424242SSP15Px";
                    }
                    if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.left = "130dp";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.top = "185dp";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.text = "(Last calendar day of every month)";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.skin = "ICSknBBLabelSSP42424213px";
                    }
                    if (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) {
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.left = "172dp";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.top = "166dp";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.text = "(Last calendar day of every month)";
                        scopeObj.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.lblSelectedDay.skin = "bbSknLbl424242SSP15Px";
                    }
                }
            }
        },
        reset: function() {
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxRepaymentDropdown.lblDropdown.text = "Select Repayment Day";
        },
        onBreakpoint: function(){
            if (kony.application.getCurrentBreakpoint() === 640) {

                this.view.formChangeRepaymentDay.pageTitleVisibility = false;
    
                this.view.formChangeRepaymentDay.pageTitle = "Change Repayment Day";
    
            }
    
            else{
    
                this.view.formChangeRepaymentDay.pageTitleVisibility = true;
    
                this.view.formChangeRepaymentDay.pageTitle = "Change Repayment Day";
    
            }
        },
        setDataForDropdown: function() {
            repaymentDay = applicationManager.getConfigurationManager().getConfigurationValue('repaymentDay');
            if (repaymentDay !== undefined && repaymentDay.length !== 0) {
                data = [];
                for (i = 0; i < repaymentDay.length; i++) {
                    let a = {
                        lblAction: repaymentDay[i]
                    };
                    data.push(a);
                }
            } else {
                data = [];
                for (i = 1; i < 32; i++) {
                    let a = {
                        lblAction: i.toString()
                    };
                    data.push(a);
                }
            }
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxSelectRepaymentDay.flxDropDownMenu.segDays.setData(data);
        },
        postShow: function() {
            applicationManager.getNavigationManager().applyUpdates(this);
        },
        setDataForForm: function(account, details, plans) {
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxCont.lblValFacilityName.text = account.accountName + ' - ' + account.account_id.substr(-4);
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxCont.lblValCurrentOutstandingBal.text = CommonUtilities.formatCurrencyWithCommas(details.totalOutstandingBalance, false, details.currencyCode);
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxCont.lblValNoOfLoans.text = plans.length.toString();
            this.view.formChangeRepaymentDay.flxContentTCCenter.flxContentCPD.flxMainCPD.flxChangeRepaymentDay.flxCont.lblValCurrentMaturityDt.text = this.getFormattedDate(details.maturityDate);
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
        backToFacility: function() {
            account = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountsUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.currentAccount;
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountsUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.showAccountDetails(account);
        },
        showConfirmation: function() {
            kony.application.showLoadingScreen();
            var navMan = applicationManager.getNavigationManager();
            navMan.setCustomInfo("frmChangeRepaymentDayCn", scopeObj.selectedDay);
            this.getFileData();
        },
        getFileData: function() {
            var browsedFiles = this.fileCompRef.getData();
            var navMan = applicationManager.getNavigationManager();
            navMan.setCustomInfo("modifyFileData", browsedFiles);
            var attachments = [],
                fileData = {};
            var reader = new FileReader();

            function readFile(index) {
                if (index >= browsedFiles.length) {
                    navMan.setCustomInfo("frmChangeRepaymentDayCnFileData", attachments);
                    navMan.navigateTo({
                        "appName": "ArrangementsMA",
                        "friendlyName": "MortgageServicesUIModule/frmChangeRepaymentDayCn"
                    });
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
