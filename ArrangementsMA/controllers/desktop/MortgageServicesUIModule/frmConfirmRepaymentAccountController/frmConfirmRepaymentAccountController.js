define("ArrangementsMA/MortgageServicesUIModule/userfrmConfirmRepaymentAccountController", ['CommonUtilities', 'ViewConstants', 'FormControllerUtility', 'OLBConstants', 'CampaignUtility'], function(CommonUtilities, ViewConstants, FormControllerUtility, OLBConstants, CampaignUtility) {
    //Type your controller code here 
    var orientationHandler = new OrientationHandler();
    return {
        accountList: {},
        payLoad: {},
        frmPreShow: function() {
            var navMan = applicationManager.getNavigationManager();
            var scopeObj = this;
            this.accountList = navMan.getCustomInfo("frmCofirmRepaymentAccount");
            //this.view.formConfirmRepaymentAccount.pageTitle = 'Confirm Repayment Account';
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
            var formTemplateContext = {
                "sessionTimeOut": {
                    "timer": 4
                },
                "breadCrumbBack": {
                    "flag": "false"
                }
            }
            this.view.formConfirmRepaymentAccount.setContext(formTemplateContext);
            scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxCheckBoxMain.flxCheckBox.lblCheckBox.text = 'D'
            var account = {
                accountHoldName: "John Bailey",
                accountNo: "567812",
                accountBicSwift: "LB29NWBK60161331926819",
                accountBankName: "Lloyds Banking Group",
                arrangementId: "343243243",
                accountName: "Mortgage Loan"
            };
            this.setDataForForm(account);
            this.setupPayLoad(account);
            this.setResponsiveUI();
            this.view.onBreakpointChange = this.onBreakpoint;
            scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnSubmit.skin = "sknBtnBlockedSSPFFFFFF15Px";
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnModify.onClick = this.backToChangeRepaymentAccount;
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnCancel.onClick = this.backToFacility;
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnSubmit.setEnabled(false);
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxCheckBoxMain.flxCheckBox.lblCheckBox.onTouchEnd = function() {
                if (scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxCheckBoxMain.flxCheckBox.lblCheckBox.text == 'D') {
                    scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxCheckBoxMain.flxCheckBox.lblCheckBox.text = 'C'
                    scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnSubmit.setEnabled(true);
                    FormControllerUtility.enableButton(scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnSubmit);
                    scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnSubmit.skin = "sknBtnNormalSSPFFFFFF15Px";
                    //scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxConfirmAndModify.flxButtons.btnSubmit.onClick = this.showAccountAcknowledge;
                } else {
                    scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxCheckBoxMain.flxCheckBox.lblCheckBox.text = 'D'
                    scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnSubmit.setEnabled(false);
                    scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnSubmit.skin = "sknBtnBlockedSSPFFFFFF15Px";
                    FormControllerUtility.disableButton(scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnSubmit);
                }
            };
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnSubmit.onClick = this.showAccountAcknowledge;
            this.view.formConfirmRepaymentAccount.onError = function(errorObject) {
                alert(JSON.stringify(errorObject));
            };
        },
        onBreakpoint: function() {
            if (kony.application.getCurrentBreakpoint() === 640) {    
                this.view.formConfirmRepaymentAccount.pageTitleVisibility = false;    
                this.view.formConfirmRepaymentAccount.pageTitle = "Confirmation";   
            }    
            else{    
                this.view.formConfirmRepaymentAccount.pageTitleVisibility = true;    
                this.view.formConfirmRepaymentAccount.pageTitle = "Confirm Repayment Account";    
            }    
        },
        postShow: function() {
            applicationManager.getNavigationManager().applyUpdates(this);
        },
        setDataForForm: function(account) {
            //accountlist = {};
            scopeObj = this;
            var accountHolder = JSON.parse(this.accountList.accountHolder);
            if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxNewAccDetails.isVisible = true;  
            }else{
                this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxNewAccDetails.isVisible = false;  
            }
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxAccountDetails.flxAccHold.lblVal1.text = account.accountHoldName;
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxAccountDetails.flxAccHold.lblVal2.text = accountHolder.fullname;
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxNewAccDetails.flxNewAccHold.lblNewVal2.text = accountHolder.fullname;
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxAccountDetails.flxAccNo.lblVal3.text = account.accountNo;
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxAccountDetails.flxAccNo.lblVal4.text = this.accountList.account_id;
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxNewAccDetails.flxNewAccNo.lblNewVal4.text = this.accountList.account_id;
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxAccountDetails.flxBankName.lblVal7.text = kony.sdk.isNullOrUndefined(this.accountList.bankName) ? account.accountBankName : this.accountList.bankName;
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxAccountDetails.flxBankName.lblVal8.text = kony.sdk.isNullOrUndefined(this.accountList.bankName) ? account.accountBankName : this.accountList.bankName; 
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxNewAccDetails.flxNewBankName.lblNewVal8.text = kony.sdk.isNullOrUndefined(this.accountList.bankName) ? account.accountBankName : this.accountList.bankName;  
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxAccountDetails.flxBICSwift.isVisible = false;  
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxNewAccDetails.flxNewBICSwift.isVisible = false;  
            kony.application.dismissLoadingScreen();
        },
        setResponsiveUI: function(){
            if (kony.application.getCurrentBreakpoint() === 1366 || kony.application.getCurrentBreakpoint() === 1380 || orientationHandler.isDesktop) {
                this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxCheckBoxMain.flxSeparator3.left = "20dp";
                
            }
            else if (kony.application.getCurrentBreakpoint() === 780 || orientationHandler.isTablet) {
              this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxCheckBoxMain.flxSeparator3.left = "20dp";
            }
            else if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
                this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxAccountDetails.flxAccHold.height = "45dp";
                this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxAccountDetails.flxAccNo.height = "45dp";
                this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxAccountDetails.flxBICSwift.height = "45dp";
                this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxAccountDetails.flxBankName.height = "45dp";
                this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxNewAccDetails.flxNewAccHold.height = "45dp";
                this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxNewAccDetails.flxNewAccNo.height = "45dp";
                this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxNewAccDetails.flxNewBICSwift.height = "45dp";
                this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxNewAccDetails.flxNewBankName.height = "45dp";
                scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.height = "200dp";
                scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.height = "200dp";
                scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnSubmit.top = "10dp";
                scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnModify.top = "65dp";
                scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxConfirmAndModify.flxButtons.btnCancel.top = "120dp";
                scopeObj.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxCheckBoxMain.flxCheckBox.left= "10dp";
            }
        },
        setupPayLoad: function(account) {
            repaymentAccount = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountServicesUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.repaymentAccount;
            mortgageAccount = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountsUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.currentAccount;
            this.payLoad.arrangementId = repaymentAccount.arrangementId;
            this.payLoad.accountID = mortgageAccount.accountID;
            this.payLoad.facilityName = mortgageAccount.accountName;
            this.payLoad.loanName = repaymentAccount.accountName;
            this.payLoad.facilityAccountNumber = mortgageAccount.accountID
            this.payLoad.loanAccountNumber = repaymentAccount.accountID;
            // this.payLoad.supportingDocumentIds = "";
            this.payLoad.customerId = this.accountList.coreCustomerId;
            this.payLoad.customerName = this.accountList.coreCustomerName;
            this.payLoad.requestDetails = [{
                "fieldName": "accountHolderName",
                "displayName": "Account Holder Name",
            }, {
                "fieldName": "accountNumber",
                "currentValue": "27368238234",
                "displayName": "Account Number",
            }, {
                "fieldName": "bankName",
                "displayName": "Bank Name",
            }];
            this.payLoad.requestDetails[0].currentValue = account.accountHoldName;
            this.payLoad.requestDetails[1].currentValue = account.accountNo;
            this.payLoad.requestDetails[2].currentValue = kony.sdk.isNullOrUndefined(this.accountList.bankName) ? account.accountBankName : this.accountList.bankName;
            var accountHolder = JSON.parse(this.accountList.accountHolder);
            this.payLoad.requestDetails[0].newValue = accountHolder.fullname;
            this.payLoad.requestDetails[1].newValue = this.accountList.account_id;
            this.payLoad.requestDetails[2].newValue = kony.sdk.isNullOrUndefined(this.accountList.bankName) ? account.accountBankName : this.accountList.bankName;
            var navMan = applicationManager.getNavigationManager();
            var docs = navMan.getCustomInfo("frmChangeRepaymentAcountCnFileData");
            this.payLoad.supportingDocumentIds = docs;
            var segData = [];
            docs.forEach(function(doc) {
                segData.push({
                    "lblDocName": doc.fileName,
                    "flxContentDocs" : {
                        "left" :  (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) ? "-20dp" : "0dp",
                        "left": (kony.application.getCurrentBreakpoint() === 1024 || orientationHandler.isTablet) ? "-15dp" : "0dp"
                    }
                }
                )
            })
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxSuppDoc.isVisible = true;
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxSupportingDocs.isVisible = true;
            this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxSupportingDocs.segSupportingDocs.setData(segData);
            if (segData.length == 0) {
                this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxSuppDoc.isVisible = false;
                this.view.formConfirmRepaymentAccount.flxContentTCCenter.flxConfirm.flxSupportingDocsMain.flxSupportingDocs.isVisible = false;
            }
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
        backToChangeRepaymentAccount: function() {
            var navMan = applicationManager.getNavigationManager();
            var configManager = applicationManager.getConfigurationManager();
            navMan.navigateTo({
                "appName": "ArrangementsMA",
                "friendlyName": "MortgageServicesUIModule/frmChangeRepaymentAccountNew"
            });
        },
        showAccountAcknowledge: function() {
            kony.application.showLoadingScreen();
            var navMan = applicationManager.getNavigationManager();
            navMan.setCustomInfo("frmChangeRepaymentAccountAcknowledge", this.payLoad);
            navMan.setCustomInfo("accountModifyFlow", false);
            navMan.setCustomInfo("modifyFileData", null);
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
                "moduleName": "AccountServicesUIModule",
                "appName": "ArrangementsMA"
            }).presentationController.showAccountAcknowledgement(this.payLoad)
        }
    }
});