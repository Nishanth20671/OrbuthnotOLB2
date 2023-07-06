define(["CommonUtilities", "OLBConstants"], function(CommonUtilities, OLBConstants) {
  
	this.externalBankTermsandConditions = {};
  
    function PresentationController() {
        kony.mvc.Presentation.BasePresenter.call(this);
        this.initializePresentationController();
    }

    var frmName = {"appName" : "AccAggregationMA", "friendlyName" : "frmExternalAccounts"};
    inheritsFrom(PresentationController, kony.mvc.Presentation.BasePresenter);

    PresentationController.prototype.initializePresentationController = function() {

    };

    PresentationController.prototype.navigateToNewAccountOpening = function() {
        var nuoModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("NAOModule");
        nuoModule.presentationController.showNewAccountOpening();
    };

    PresentationController.prototype.showContactUs = function() {
        var InformationContentModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
          "moduleName": "InformationContentUIModule",
          "appName": "AboutUsMA"
        });
        InformationContentModule.presentationController.showContactUsPage();
    };

    PresentationController.prototype.getBankListForCountry = function() {
        var param = {
            "countryCode": this.getCountryCode()
        };
        this.presentExternalAccountsLanding();
        applicationManager.getNavigationManager().updateForm({
            showLoadingIndicator: {
                status: true
            }
        }, frmName);
        applicationManager.getExternalAccountsManager().fetchBankListForCountry(param, this.showExternalBanksFetchSuccess.bind(this), this.showExternalBanksFetchError.bind(this));
    };

    PresentationController.prototype.showExternalBanksFetchSuccess = function(response) {
        applicationManager.getNavigationManager().updateForm({
            "externalBankList": response
        });
    };

    PresentationController.prototype.showExternalBanksFetchError = function(error) {
        applicationManager.getNavigationManager().updateForm({
            "externalBankList": [],
            serviceError: true
        });
    };
    /**
     * Get the country code in format ISO 3166-1 alpha-2 .
     * @member of  ExternalAccountPresetationController
     */
    PresentationController.prototype.getCountryCode = function() {
        var countryCode = "XF"; //This is fake country code
        return countryCode;
    };

    PresentationController.prototype.presentExternalAccountsLanding = function() {
        this.externalBankTermsandConditions = {};
        applicationManager.getNavigationManager().navigateTo(frmName);
    };


    /**
     * fetch the  Terms and conditions.
     * @member of ExternalAccountPresetationController
     */
    PresentationController.prototype.getTermsAndConditions = function(data) {
        var param = {
            "languageCode": kony.i18n.getCurrentLocale().replace("_", "-"),
            "termsAndConditionsCode": OLBConstants.TNC_FLOW_TYPES.AccountAggregation_TnC,
            "operation": data.type,
            "bankCode": data.bankCode
        };
        var externalAccountObj = applicationManager.getExternalAccountsManager();
        externalAccountObj.fetchTermsAndConditions(param, this.presentationTCFetchSuccess.bind(this), this.presentationTCFetchFailure.bind(this));
    };
    /**
     * Success callback function for fetchTermsAndConditions call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing username of the signed in user, username for the external bank, id of the external bank.
     */
    PresentationController.prototype.presentationTCFetchSuccess = function(data) {
        applicationManager.getNavigationManager().navigateTo({"friendlyName": "ExternalAccountsUIModule/frmExternalAccounts", "appName": "AccAggregationMA"});
        applicationManager.getNavigationManager().updateForm({
            "externalBankTermsandConditions": data
        });
        this.externalBankTermsandConditions = data;
    };
    /**
     * Error callback function for fetchExternalBanks call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing the error response.
     */
    PresentationController.prototype.presentationTCFetchFailure = function(err) {
        applicationManager.getNavigationManager().updateForm({
            "externalBankTermsandConditions": err
        });
    };

    /**
     * give consent the  Terms and conditions.
     * @member of ExternalAccountPresetationController
     */
    PresentationController.prototype.giveTermsAndConditionsConsent = function(request) {
        var externalAccountObj = applicationManager.getExternalAccountsManager();
        externalAccountObj.createInfinityBankTermsAndConditions(request, this.presentationTCConsentSuccess.bind(this), this.presentationTCConsentFailure.bind(this));

    };

    /**
     * Success callback function for giveTermsAndConditionsConsent call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing username of the signed in user, username for the external bank, id of the external bank.
     */
    PresentationController.prototype.presentationTCConsentSuccess = function(data) {
        applicationManager.getNavigationManager().updateForm({
            "externalBankTCConsentSuccess": data
        });
    };
    /**
     * Error callback function for giveTermsAndConditionsConsent call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing the error response.
     */
    PresentationController.prototype.presentationTCConsentFailure = function(err) {
        applicationManager.getNavigationManager().updateForm({
            "externalBankTCConsentSuccess": err
        });
    };


    /**
     * get connections.
     * @member of ExternalAccountPresetationController
     */
    PresentationController.prototype.getConnections = function(request) {
        var externalAccountObj = applicationManager.getExternalAccountsManager();
        externalAccountObj.createConnections(request, this.presentationGetConnectionsSuccess.bind(this), this.presentationGetConnectionsFailure.bind(this));
    };
    /**
     * Success callback function for getConnections call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing username of the signed in user, username for the external bank, id of the external bank.
     */
    PresentationController.prototype.presentationGetConnectionsSuccess = function(data) {
        kony.print(data);
    };
    /**
     * Error callback function for getConnections call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing the error response.
     */
    PresentationController.prototype.presentationGetConnectionsFailure = function(err) {
        applicationManager.getNavigationManager().updateForm({
            serviceError: true,
            showLoadingIndicator: {
                status: false
            }
        });
    };
    /**
     * fetch transactions and accounts
     * @member of ExternalAccountPresetationController
     */
    PresentationController.prototype.getAccountsAndTransactions = function(param) {
        var externalAccountObj = applicationManager.getExternalAccountsManager();
        externalAccountObj.fetchAccountsAndTransactions(param, this.presentationGetATSuccess.bind(this), this.presentationGetATFailure.bind(this));
    };
    /**
     * Success callback function for getAccountsAndTransactions call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing username of the signed in user, username for the external bank, id of the external bank.
     */

    PresentationController.prototype.presentationGetATSuccess = function(data) {
        kony.print(data);
    };
    /**
     * Error callback function for getAccountsAndTransactions call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing the error response.
     */
    PresentationController.prototype.presentationGetATFailure = function(err) {
        applicationManager.getNavigationManager().updateForm({
            serviceError: true,
            showLoadingIndicator: {
                status: false
            }
        });
    };
    /**
     * call for deleteConnection
     * @member of  ExternalAccountPresetationController
     * @param {bank} bank of account
     */
    PresentationController.prototype.deleteConnection = function(accountID) {
        var bankCode = accountID.split("-")[0];
        var backendId = applicationManager.getUserPreferencesManager().getBackendIdentifier();
        var param = {
            "digitalProfileId": backendId,
            "providerCode": bankCode
        };
        var externalAccountObj = applicationManager.getExternalAccountsManager();
        externalAccountObj.deleteConnection(param, this.deleteConnectionSuccess.bind(this), this.deleteConnectionFailure.bind(this));
    };
    /**
     * Success callback function for deleteConnection call.
     * @member of  ExternalAccountPresetationController
     * @response of delete
     */
    PresentationController.prototype.deleteConnectionSuccess = function(response) {
        //Fire n Forgot Call
        // var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("AccountsModule");
        // accountsModule.presentationController.showAccountsDashboard();
    };
    /**
     * Error callback function for deleteConnection call.
     * @member of  ExternalAccountPresetationController
     * @response of delete
     */
    PresentationController.prototype.deleteConnectionFailure = function(err) {
        //this.serviceError(err);
    };
    /**
     * call for refresh consent
     * @member of  ExternalAccountPresetationController
     * @param {bank} bank of account
     */
    PresentationController.prototype.refreshConsent = function(accountID) {
        var backendId = applicationManager.getUserPreferencesManager().getBackendIdentifier();
        var date = new Date();
        var from_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + (date.getYear() + 1900);
        var bankCode = accountID.split("-")[0];
        var param = {
            "digitalProfileId": backendId,
            "javascript_callback_type": "iframe",
            "scopes": "['account_details', 'transactions_details']",
            "from_date": from_date,
            "period_days": "90",
            "providerCode": bankCode,
            "fetch_scopes": "['accounts', 'transactions']"
        };

        var externalAccountObj = applicationManager.getExternalAccountsManager();
        externalAccountObj.refreshConsent(param, this.refreshConsentSuccess.bind(this), this.refreshConsentFailure.bind(this));
    };
    /**
     * Success callback function for refreshConsent call.
     * @member of  ExternalAccountPresetationController
     * @param {data} connection url of saltedge
     */
    PresentationController.prototype.refreshConsentSuccess = function(data) {
        //Fire n Forgot Call
        // var url  = data.connect_url;
        // if(url)
        //   {
        //     applicationManager.getNavigationManager().updateForm({
        //       "refreshConsentSuccess":data
        //       });
        //   }
    };
    /**
     * Error callback function for refreshConsent call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing the error response.
     */
    PresentationController.prototype.refreshConsentFailure = function(err) {
        applicationManager.getNavigationManager().updateForm({
            errorMsg: err.errorMessage,
            showLoadingIndicator: {
                status: false
            }
        });
    };
    /**
     * Function for service call failure
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing the error response.
     */
    PresentationController.prototype.serviceError = function(err) {
        applicationManager.getNavigationManager().updateForm({
            serviceError: true,
            showLoadingIndicator: {
                status: false
            }
        });
    };

    return PresentationController;
});