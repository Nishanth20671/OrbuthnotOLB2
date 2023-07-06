define(['CommonUtilities', 'OLBConstants'], function (CommonUtilities, OLBConstants) {
    /**
     * User defined presentation controller
     * @constructor
     * @extends kony.mvc.Presentation.BasePresenter
     */
    function AccountSweepsPresentationController() {
        this.navigationManager = applicationManager.getNavigationManager();
        this.configurationManager = applicationManager.getConfigurationManager();
        this.recipientsManager = applicationManager.getRecipientsManager();
        this.asyncManager = applicationManager.getAsyncManager();
        this.userPreferencesManager = applicationManager.getUserPreferencesManager();
        this.filteredAccounts = {};
        this.filteredEditAccounts = {};
        this.sortByParam = 'primaryAccountName',
            this.sortOrder = OLBConstants.ASCENDING_KEY,
            this.pageOffset = '',
            this.pageSize = '',
            this.filterByParam = "sweepType",
            this.filterByValue = ''
        this.frequencies = {
            'Daily': "i18n.Transfers.Daily",
            'Weekly': "i18n.Transfers.Weekly",
            'Monthly': "i18n.Transfers.Monthly",
            'Every 6 Months': "i18n.accountSweeps.everySixMonths"
        };
        this.allowedAccountTypes = ["Checking", "Savings"];
        this.modifyData = {};
        this.printData = {};
        kony.mvc.Presentation.BasePresenter.call(this);
    }

    inheritsFrom(AccountSweepsPresentationController, kony.mvc.Presentation.BasePresenter);

    /**
     * Overridden Method of kony.mvc.Presentation.BasePresenter
     * This method gets called when presentation controller gets initialized
     * @method
     */
    AccountSweepsPresentationController.prototype.initializeAccountSweepsPresentationController = function () { };

    /**
     * Entry Point method for sweeps module
     * @param {object} context - contains info to load the screen
     */
    AccountSweepsPresentationController.prototype.showSweepScreen = function (params, data) {
        switch (params.context) {
            case 'createSweep':
                this.modifyData = data
                this.loadAccounts();
                break;
            case 'viewSweeps':
                this.getaccountSweepByID(data);
                break;
            case 'AcccountSweep':
                this.sortOrder = OLBConstants.ASCENDING_KEY;
                this.sortByParam = 'primaryAccountName';
                this.filterByValue = '';
                this.getAllsweeps();
                break;
        }
    };
    /**
     * Method to show a particular form
     * @param {object} param0 - contains info to load the particular form
     */
    AccountSweepsPresentationController.prototype.showView = function (frm, data) {
        if (kony.application.getCurrentForm().id !== frm) {
            applicationManager.getNavigationManager().navigateTo({
                "appName": "AccountSweepsMA",
                "friendlyName": frm
            });
        }
        if (data) {
            applicationManager.getNavigationManager().updateForm(data, frm);
        }
    };
    /**
     * Method to verify whether the value is empty, null or undefined
     * @param {any} data - value to be verified
     * @returns {boolean} - validity of the value passed
     */
    AccountSweepsPresentationController.prototype.isEmptyNullOrUndefined = function (data) {
        try {
            data = JSON.parse(data);
        } catch (err) { }
        if (data === null || data === undefined || (typeof data === "string" && data.trim() === "")) return true;
        if (typeof data === "object") {
            if (Array.isArray(data)) return data.length === 0;
            return Object.keys(data).length === 0;
        }
        return false;
    };
    /**
     * Method to show the loading indicator
     */
    AccountSweepsPresentationController.prototype.showProgressBar = function () {
        this.navigationManager.updateForm({
            isLoading: true
        });
    };
    /**
     * Method to hide the loading indicator
     */
    AccountSweepsPresentationController.prototype.hideProgressBar = function () {
        this.navigationManager.updateForm({
            isLoading: false
        });
    };
    /**
     * Method to fetch the accounts
     */
    AccountSweepsPresentationController.prototype.loadAccounts = function () {
        this.showProgressBar();
        this.getBankDate();
        this.fetchAccounts();
    };
    /**
    * Method to fetch the internal accounts
    */
    AccountSweepsPresentationController.prototype.fetchAccounts = function () {
        applicationManager.getAccountManager().fetchInternalAccounts(this.fetchAccountsCompletionCallBack.bind(this), this.showOnServerError.bind(this));
    };
    /**
    * fetch the internal accounts Success Callback
    */
    AccountSweepsPresentationController.prototype.fetchAccountsCompletionCallBack = function () {
        var Accounts = this.getAllowedAccounts(applicationManager.getAccountManager().getInternalAccounts());
        this.filteredEditAccounts =  Accounts.filter(function (account) {
            return account.externalIndicator !== "true" && (account.accountType === "Savings" || account.accountType === "Checking") && (account.accountStatus === "ACTIVE" || account.accountStatus === "CLOSURE_PENDING")
        })
        this.filteredAccounts = this.filteredEditAccounts.filter(function (account) {
            return account.isSweepCreated === false
        })
        this.showView("frmCreateNewSweep");
        this.hideProgressBar();
    };
    /**
    * fetch the internal accounts error Callback
    */
    AccountSweepsPresentationController.prototype.showOnServerError = function () {
        this.hideProgressBar();
        CommonUtilities.showServerDownScreen();
    }
    /**
     * method to check the account at least one action
     */
    AccountSweepsPresentationController.prototype.isAccountHaveAtleastOneActions = function(permissions, accountObject) {
        return permissions.some(function(permission) {
            return applicationManager.getConfigurationManager().checkAccountAction(accountObject.accountID, permission)
        })
    }
    /**
    * method to filter the accounts based in permissions
    */
    AccountSweepsPresentationController.prototype.getAllowedAccounts = function (accounts) {
        var permission = [
            "ACCOUNT_SWEEP_CREATE"
        ];
        return accounts.filter(this.isAccountHaveAtleastOneActions.bind(this, permission));
    }
    /**
    * Method to get the bank date
    */
    AccountSweepsPresentationController.prototype.getBankDate = function (frm) {
        applicationManager.getRecipientsManager().fetchBankDate({}, this.getBankDateSuccess.bind(this), this.getBankDateFailure.bind(this));
    };
    /**
     * get bank date Success Callback
     * @param {Object} response object containing bank date
     */
    AccountSweepsPresentationController.prototype.getBankDateSuccess = function (response) {
        this.bankDate = response.date[0];
    };
    /**
     * get bank date Failure Callback
     * @param {Object} response object containing failure message
     */
    AccountSweepsPresentationController.prototype.getBankDateFailure = function (response) {
        this.hideProgressBar();
        this.bankDate = CommonUtilities.getServerDate()
    };

    /**
    * Method to fetch the sweep by id
    */
    AccountSweepsPresentationController.prototype.getaccountSweepByID  = function (data) {
        let payload = {
            "accountId": data
        }        
        applicationManager.getAccountSweepsManager().getSweepById(payload, this.getaccountSweepByIDSuccess.bind(this), this.getaccountSweepByIDFailure.bind(this));
    };
    /**
     * getaccountSweepByIDSuccess Callback
     * @param {Object} response object containing response
     */
     AccountSweepsPresentationController.prototype.getaccountSweepByIDSuccess = function (response) {
        this.hideProgressBar();
        this.showView('frmAccountSweepViewDetails', {
            sweeps: response
        }); 
    };
    /**
    * getaccountSweepByID Failure Callback
    * @param {Object} response object containing failure message
    */
    AccountSweepsPresentationController.prototype.getaccountSweepByIDFailure = function (response) {
        var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
            "moduleName": "AccountsUIModule",
            "appName": "ArrangementsMA"
        });
        accountsModule.presentationController.getaccountSweepByIDFailure(response);
    };
    /**
    * Method to delete the sweep
    */
    AccountSweepsPresentationController.prototype.deleteSweep = function (data, frm) {
        applicationManager.getAccountSweepsManager().deleteAccountSweep(data, this.deleteSweepSuccess.bind(this), this.deleteSweepFailure.bind(this, frm));
    };
    /**
     * delete sweep Success Callback
     * @param {Object} response object containing response
     */
    AccountSweepsPresentationController.prototype.deleteSweepSuccess = function (response) {
        this.hideProgressBar();
        this.showView('frmAccountSweepDashboard', {
            deletesweep: response
        });
        this.filterByValue = '';
        this.getAllsweeps();
    };
    /**
     * delete sweep Failure Callback
     * @param {Object} response object containing failure message
     */
    AccountSweepsPresentationController.prototype.deleteSweepFailure = function (frm, response) {
        this.hideProgressBar();
        this.showView(frm, {
            "deleteFailure": response.errorMessage || response.dbpErrMsg
        });
        this.filterByValue = '';
        if(frm ==="frmAccountSweepDashboard")
        this.getAllsweeps();
    };
    /**
    * Method to pass the data to confirm page 
    */
    AccountSweepsPresentationController.prototype.showConfirmation = function (data) {
        this.showView("frmAccountSweepConfirmation", {
            "confirmDetails": data
        });
    };
    /**
    * Method to pass the data to print page 
    */
    AccountSweepsPresentationController.prototype.printSweep = function (data) {
        this.printData = data;
        this.showView("frmPrint");
    };
    /**
    * Method to check user have the specified permission or not
    */
    AccountSweepsPresentationController.prototype.checkUserPermission = function (permission) {
        return this.configurationManager.checkUserPermission(permission);
    };
    /**
    * Method to get the all sweeps
    */
    AccountSweepsPresentationController.prototype.getAllsweeps = function () {
        this.showProgressBar();
        var criteria = {
            "sortByParam": this.sortByParam,
            "sortOrder": this.sortOrder,
            "pageSize": this.pageSize,
            "pageOffset": this.pageOffset,
            "filterByParam": this.filterByParam,
            "filterByValue": this.filterByValue
        }
        applicationManager.getAccountSweepsManager().getAllSweeps(criteria, this.getAllsweepsSuccess.bind(this), this.getAllsweepsFailure.bind(this));
    };
    /**
    * getAllsweeps Success Callback
    * @param {Object} response object containing response
    */
    AccountSweepsPresentationController.prototype.getAllsweepsSuccess = function (response) {
        this.hideProgressBar();
        this.showView('frmAccountSweepDashboard', {
            sweeps: response
        });
    };
    /**
     * getAllsweeps Failure Callback
     * @param {Object} response object containing failure message
     */
    AccountSweepsPresentationController.prototype.getAllsweepsFailure = function (response) {
        this.hideProgressBar();
        this.showView("frmAccountSweepDashboard", {
            "serverError": response.errorMessage || response.dbpErrMsg
        });
    };
    /**
    * Method to create the sweep
    */
    AccountSweepsPresentationController.prototype.createSweep = function (payload, sweepData) {
        this.showProgressBar();
        applicationManager.getAccountSweepsManager().createAccountSweep(payload, this.createSweepSuccess.bind(this, payload, sweepData), this.createSweepFailure.bind(this));
    };
    /**
    * createSweep Success Callback
    * @param {Object} response object containing response
    */
    AccountSweepsPresentationController.prototype.createSweepSuccess = function (payload, data, response) {
        this.hideProgressBar();
        data.confirmationNumber = response.serviceRequestId
        data.payload = payload;
        this.showView('frmAccountSweepAcknowledgement', {
            sweeps: data
        });
        applicationManager.getAccountManager().fetchInternalAccounts(function() {}, function() {});
    };
    /**
    * createSweep Failure Callback
    * @param {Object} response object containing failure message
    */
    AccountSweepsPresentationController.prototype.createSweepFailure = function (response) {
        this.hideProgressBar();
        this.showView("frmCreateNewSweep", {
            "serverError": response.errorMessage || response.dbpErrMsg
        });
    };

    /**
    * method to download the sweep
    */
    AccountSweepsPresentationController.prototype.downloadSweep = function (payload) {
        this.showProgressBar();
        applicationManager.getAccountSweepsManager().DownloadAccountSweeps(payload, this.downloadSweepSuccess.bind(this), this.downloadSweepFailure.bind(this));
    };
    /**
    * downloadSweep Success Callback
    * @param {Object} response object containing response
    */
    AccountSweepsPresentationController.prototype.downloadSweepSuccess = function (response) {
        var mfURL = KNYMobileFabric.mainRef.config.services_meta.DocumentManagement.url;
        var fileUrl = mfURL + "/objects/DownloadTransactionPDF?fileId=" + response.fileId;
        kony.application.openURL(fileUrl);
        this.hideProgressBar();
    };
    /**
    * downloadSweep Failure Callback
    * @param {Object} response object containing response
    */
    AccountSweepsPresentationController.prototype.downloadSweepFailure = function (response) {
        this.hideProgressBar();
        this.showView("frmAccountSweepAcknowledgement", {
            "serverError": response
        });
    };
    /**
    * Method to edit the particular sweep 
    */
    AccountSweepsPresentationController.prototype.editSweep = function (payload, sweepData) {
        this.showProgressBar();
        applicationManager.getAccountSweepsManager().editAccountSweep(payload, this.editSweepSuccess.bind(this, sweepData), this.editSweepFailure.bind(this));
    };
    /**
    * editSweep Success Callback
    * @param {Object} response object containing response
    */
    AccountSweepsPresentationController.prototype.editSweepSuccess = function (data, response) {
        this.hideProgressBar();
        data.confirmationNumber = response.serviceRequestId
        this.showView('frmAccountSweepAcknowledgement', {
            sweeps: data
        });
    };
    /**
    * editSweep Failure Callback
    * @param {Object} response object containing failure message
    */
    AccountSweepsPresentationController.prototype.editSweepFailure = function (response) {
        this.hideProgressBar();
        this.showView("frmCreateNewSweep", {
            "serverError": response.errorMessage || response.dbpErrMsg
        });
    };
    /**
    * Filter the acconts based on membershipId
    * @param {Object} response object containing failure message
    */
    AccountSweepsPresentationController.prototype.filterAccountsByMembershipId = function (membershipId, accounts) {
        return applicationManager.getRecipientsManager().filterToAccountsByMembershipId(membershipId, accounts)
    };
    return AccountSweepsPresentationController;
});