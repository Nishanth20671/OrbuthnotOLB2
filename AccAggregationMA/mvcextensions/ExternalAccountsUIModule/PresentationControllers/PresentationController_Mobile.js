define([], function() {
    /**
     * User defined presentation controller
     * @constructor
     * @extends kony.mvc.Presentation.BasePresenter
     */

    function ExternalAccounts_PresentationController() {
        scope_ExternalAcc_Pres = this;
        kony.mvc.Presentation.BasePresenter.call(this);
    }
    inheritsFrom(ExternalAccounts_PresentationController, kony.mvc.Presentation.BasePresenter);
    ExternalAccounts_PresentationController.prototype.initializePresentationController = function() {
    };
   /**
     * fetch the  External banks.
     * @member of  ExternalAccountPresetationController
     */
    ExternalAccounts_PresentationController.prototype.getBankListForCountry = function() {
        var externalAccountObj = applicationManager.getExternalAccountsManager();
		var countryCode = scope_ExternalAcc_Pres.getCountryCode();
        var param = {"countryCode":countryCode};
        externalAccountObj.fetchBankListForCountry(param,scope_ExternalAcc_Pres.presentationExternalBanksFetchSuccess, scope_ExternalAcc_Pres.presentationExternalBanksFetchError);
    };
	/**
     * Get the country code in format ISO 3166-1 alpha-2 .
     * @member of  ExternalAccountPresetationController
     */
    ExternalAccounts_PresentationController.prototype.getCountryCode = function() {
      var countryCode = "XF"; //This is fake country code
      return countryCode;
    };

       /**
     * Success callback function for fetchExternalBanks call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing username of the signed in user, username for the external bank, id of the external bank.
     */
    ExternalAccounts_PresentationController.prototype.presentationExternalBanksFetchSuccess = function(data) {
        var navManager = applicationManager.getNavigationManager();
        var formattedData = scope_ExternalAcc_Pres.processExternalBanksData(data);
        var allData = {
          "allBanks":formattedData,
          "selectedBank":""
        };
        navManager.setCustomInfo({"appName" : "AccAggregationMA", "friendlyName" : "ExternalAccountsUIModule/frmSelectExternalBanks"}, allData);
        navManager.navigateTo({"appName" : "AccAggregationMA", "friendlyName" : "ExternalAccountsUIModule/frmSelectExternalBanks"});
        //return ExternalBanksData;
    };
    /**
     * Error callback function for fetchExternalBanks call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing the error response.
     */
    ExternalAccounts_PresentationController.prototype.presentationExternalBanksFetchError = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        if(err["isServerUnreachable"])
                  applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
        kony.print("error finding external banks");
        //generic error callback
    };
   /**
    * helper function for formatting list of external banks in required format.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing list of external banks.
     * @returns {Array} returns array of external banks in required format.
     */
    ExternalAccounts_PresentationController.prototype.processExternalBanksData = function(data) {
        var secData = [];
        for (var i = 0; i < data.length; i++) {
            secData[i] = {};
            secData[i].bankName = data[i].bankName;
//  Uncomment this when platform supports svg images          
//             secData[i].logo = {
//                 src: data[i].logoUrl
//             };
          
			secData[i].logo =  {
                 src: "genericexternalbank.png"
             }; 
            secData[i].identityProvider = data[i].bankCode;
            secData[i].bankId = data[i].internalBankId;
            secData[i].scopes = data[i].supportedFetchScopess;
        }
        var externalBanksProcessedData = [];
        var sectionJson = {
            headerName: kony.i18n.getLocalizedString("kony.mb.common.allBanks")
        };
        var sectionFinal = [];
        sectionFinal.push(sectionJson);
        sectionFinal.push(secData);
        externalBanksProcessedData.push(sectionFinal);
        return externalBanksProcessedData;
    };
    /**
     * fetch the  Terms and conditions.
     * @member of ExternalAccountPresetationController
     */
    ExternalAccounts_PresentationController.prototype.getTermsAndConditions = function(data) {
        var externalAccountObj = applicationManager.getExternalAccountsManager();
        var config = applicationManager.getConfigurationManager();
        var locale=config.getLocale();
        var termsAndConditions=config.getTermsAndConditions();
         var parms={
           "languageCode": termsAndConditions[locale],
            "termsAndConditionsCode": "AccountAggregation_TnC",
              "operation":data.type,
              "bankCode": data.bankCode
        };
        externalAccountObj.fetchTermsAndConditions(parms,scope_ExternalAcc_Pres.presentationTCFetchSuccess, scope_ExternalAcc_Pres.presentationTCFetchFailure);
    };
    /**
     * Success callback function for fetchTermsAndConditions call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing username of the signed in user, username for the external bank, id of the external bank.
     */
    ExternalAccounts_PresentationController.prototype.presentationTCFetchSuccess = function(data) {
        var navMan = applicationManager.getNavigationManager();
        navMan.setCustomInfo({"appName" : "AccAggregationMA", "friendlyName" : "ExternalAccountsUIModule/frmExternalAccountsTermsAndConditions"}, data);
        navMan.navigateTo({"appName" : "AccAggregationMA", "friendlyName" : "ExternalAccountsUIModule/frmExternalAccountsTermsAndConditions"});
    };
   /**
     * Error callback function for fetchExternalBanks call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing the error response.
     */
    ExternalAccounts_PresentationController.prototype.presentationTCFetchFailure = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        if(err["isServerUnreachable"])
                  applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
        kony.print("error finding external banks");
        //generic error callback
    };
  
   /**
     * give consent the  Terms and conditions.
     * @member of ExternalAccountPresetationController
     */
    ExternalAccounts_PresentationController.prototype.giveTermsAndConditionsConsent = function() {
        var navManager = applicationManager.getNavigationManager();
        var userPreferencesManager = applicationManager.getUserPreferencesManager();
        var userId = userPreferencesManager.getBackendIdentifier();
        var data = navManager.getCustomInfo({"appName" : "AccAggregationMA", "friendlyName" : "ExternalAccountsUIModule/frmExternalAccountsTermsAndConditions"});

        var date = new Date();
       // var from_date = date.getDate()+"-"+(date.getMonth()+1)+"-"+(date.getYear()+1900);
        var from_date = ("0"+date.getDate()).slice(-2)+"-"+("0" + (date.getMonth() + 1)).slice(-2)+"-"+(date.getYear()+1900);

      /*var data1 = externalBanksData.scopes;
		        data1 = data1.split(",");
        var temp ="[";
        var tempDetails = "[";
        for(i=0;i<data1.length;i++)
          {
            temp = temp+ "'"+data1[i]+"',";
            tempDetails = tempDetails + "'"+data1[i]+"_details"+"',";
          }
        var x = temp.length;
        temp = temp.slice(0,x-1)+']';
        var y = tempDetails.length;
        tempDetails = tempDetails.slice(0,y-1)+']';*/
           var param = {
          "digitalProfileId":userId,
          "javascript_callback_type":"iframe",
          "scopes": "['account_details', 'transactions_details']",
          "from_date": from_date,
          "period_days": "90",
           "providerCode": data.bankCode,
           "fetch_scopes": "['accounts', 'transactions' ]",
           "operation" : data.operation
          };
      
      

        var externalAccountObj = applicationManager.getExternalAccountsManager();
        externalAccountObj.createInfinityBankTermsAndConditions(param,scope_ExternalAcc_Pres.presentationTCConsentSuccess, scope_ExternalAcc_Pres.presentationTCConsentFailure);
    };
  
 
   /**
     * Success callback function for giveTermsAndConditionsConsent call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing username of the signed in user, username for the external bank, id of the external bank.
     */
    ExternalAccounts_PresentationController.prototype.presentationTCConsentSuccess = function(data) {
      var url  = data.connect_url;
      if(url)
        {
           kony.application.openURL(url);
        }
      var accountMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AccountsUIModule",
        "appName": "HomepageMA"
      });
      accountMod.presentationController.showDashboard();
//         var navMan = applicationManager.getNavigationManager();
//         navMan.setCustomInfo("frmBankLogin", data);
//         navMan.navigateTo("frmBankLogin");
    };
   /**
     * Error callback function for giveTermsAndConditionsConsent call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing the error response.
     */
    ExternalAccounts_PresentationController.prototype.presentationTCConsentFailure = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        if(err["isServerUnreachable"])
                  applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
        kony.print("error finding external banks");
        //generic error callback
    }; /**
    * helper function for formatting list of external banks in required format.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing list of external banks.
     * @returns {Array} returns array of external banks in required format.
     */
    ExternalAccounts_PresentationController.prototype.process = function(data) {
        var secData = [];
        for (var i = 0; i < data.length; i++) {
            secData[i] = {};
            secData[i].bankName = data[i].providerName;
            secData[i].logo = {
                src: data[i].logoUrl
            };
            secData[i].identityProvider = data[i].providerCode;
            secData[i].bankId = data[i].bankId;
            secData[i].scopes = data[i].supported_fetch_scopes;
        }
        var externalBanksProcessedData = [];
        var sectionJson = {
            headerName: kony.i18n.getLocalizedString("kony.mb.common.allBanks")
        };
        var sectionFinal = [];
        sectionFinal.push(sectionJson);
        sectionFinal.push(secData);
        externalBanksProcessedData.push(sectionFinal);
        return externalBanksProcessedData;
    };
  /**
     * call for refresh consent
     * @member of  ExternalAccountPresetationController
     * @param {bank} bank of account
     */
  ExternalAccounts_PresentationController.prototype.refreshConsent = function(bank) {
        var userPreferencesManager = applicationManager.getUserPreferencesManager();
        var userId = userPreferencesManager.getBackendIdentifier();
        var bankCode = bank; 
        var param = {
          "digitalProfileId":userId,
          "providerCode" :bankCode
          };

        var externalAccountObj = applicationManager.getExternalAccountsManager();
        externalAccountObj.refreshConsent(param,scope_ExternalAcc_Pres.presentationRefreshConsentSuccess, scope_ExternalAcc_Pres.presentationRefreshConsentFailure);
    };
    /**
     * Success callback function for refreshConsent call.
     * @member of  ExternalAccountPresetationController
     * @param {data} connection url of saltedge
     */
    ExternalAccounts_PresentationController.prototype.presentationRefreshConsentSuccess = function(data) {
    
        var basicConfig = {
                 message: applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.Accounts.refreshInitiated"),
                alertIcon: null,
                alertType: constants.ALERT_TYPE_INFO
            };
            var pspConfig = {};
            applicationManager.getPresentationUtility().showAlertMessage(basicConfig, pspConfig);
      var accountMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AccountsUIModule",
        "appName": "HomepageMA"
      });
      accountMod.presentationController.showDashboard();

    };
   /**
     * Error callback function for refreshConsent call.
     * @member of  ExternalAccountPresetationController
     * @param {data} data containing the error response.
     */
    ExternalAccounts_PresentationController.prototype.presentationRefreshConsentFailure = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        if(err["isServerUnreachable"])
                  applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
        kony.print("error initiating refresh");
       // kony.ui.Alert(err.errorMessage);
      var basicConfig = {
                message: err.errorMessage,
                alertIcon: null,
                alertType: constants.ALERT_TYPE_ERROR
            };
            var pspConfig = {};
            applicationManager.getPresentationUtility().showAlertMessage(basicConfig, pspConfig);
        //generic error callback
    };
   /**
     * call for deleteConnection
     * @member of  ExternalAccountPresetationController
     * @param {bank} bank of account
     */
  ExternalAccounts_PresentationController.prototype.deleteConnection = function(bank) {
     
        var userPreferencesManager = applicationManager.getUserPreferencesManager();
        var userId = userPreferencesManager.getBackendIdentifier();
        var bankCode = bank; 
        var param = {
          "digitalProfileId":userId,
          
          "providerCode" :bankCode,
         
          };

        var externalAccountObj = applicationManager.getExternalAccountsManager();
        externalAccountObj.deleteConnection(param,scope_ExternalAcc_Pres.presentationDeleteConnectionSuccess, scope_ExternalAcc_Pres.presentationDeleteConnectionFailure);
    };
    /**
     * Success callback function for deleteConnection call.
     * @member of  ExternalAccountPresetationController
     * @response of delete
     */
    ExternalAccounts_PresentationController.prototype.presentationDeleteConnectionSuccess = function(data) {
     
       var basicConfig = {
                message: applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.Accounts.deleteInitiated"),
                alertIcon: null,
                alertType: constants.ALERT_TYPE_INFO
            };
            var pspConfig = {};
            applicationManager.getPresentationUtility().showAlertMessage(basicConfig, pspConfig);
            var accountMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
              "moduleName": "AccountsUIModule",
              "appName": "HomepageMA"
            });
      accountMod.presentationController.showDashboard();


    };
   /**
     * Error callback function for deleteConnection call.
     * @member of  ExternalAccountPresetationController
     * @response of delete
     */
    ExternalAccounts_PresentationController.prototype.presentationDeleteConnectionFailure = function(err) {
        applicationManager.getPresentationUtility().dismissLoadingScreen();
        if(err["isServerUnreachable"])
                  applicationManager.getPresentationInterruptHandler().showErrorMessage("postLogin", err);
        kony.print("error deleting");
       var basicConfig = {
                message: err.errorMessage,
                alertIcon: null,
                alertType: constants.ALERT_TYPE_ERROR
            };
            var pspConfig = {};
            applicationManager.getPresentationUtility().showAlertMessage(basicConfig, pspConfig);
    };
    return ExternalAccounts_PresentationController;
});
