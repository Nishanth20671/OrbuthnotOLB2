define([], function () { 
    
 
    function ExternalAccountsManager() { 

     

    } 
  inheritsFrom(ExternalAccountsManager, kony.mvc.Business.Delegator);
  ExternalAccountsManager.prototype.initializeBusinessController = function(){};
  /**
   * Fetches  External Banks using a service call.
   * @param {Function} successCallback - invoke the call back with success response.
   * @param {Function} errorCallback - invoke the call back with error response.
   */
  ExternalAccountsManager.prototype.fetchBankListForCountry = function(param,successCallback, errorCallback) {
    
      function getAllCompletionCallback(status, data, error) {
          var serviceResponseHandler = applicationManager.getServiceResponseHandler();
          var responseObject = serviceResponseHandler.manageResponse(status, data, error, successCallback, successCallback);
          if (responseObject["status"] === true) {
              successCallback(responseObject["data"]);
          } else {
              errorCallback(responseObject["errmsg"]);
          }
      }
          var self = this;
          var externalBanks = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Banks");
          externalBanks.customVerb("getBanksForCountryCode",param,getAllCompletionCallback);
    
  };
      /**
   * Fetches  Beneficiary List using a service call.
   * @param {Function} successCallback - invoke the call back with success response.
   * @param {Function} errorCallback - invoke the call back with error response.
   */
    ExternalAccountsManager.prototype.fetchBeneficiaryList = function(param,successCallback, errorCallback) {
    
      function getAllCompletionCallback(status, data, error) {
          var serviceResponseHandler = applicationManager.getServiceResponseHandler();
          var responseObject = serviceResponseHandler.manageResponse(status, data, error, successCallback, successCallback);
          if (responseObject["status"] === true) {
              successCallback(responseObject["data"]);
          } else {
              errorCallback(responseObject["errmsg"]);
          }
      }
          var externalBanks = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ExternalAccounts");
          externalBanks.customVerb("getAllExternalAccountsWithPagination",param,getAllCompletionCallback);
    
  };
          /**
   * get  Beneficiary name using a service call.
   * @param {Function} successCallback - invoke the call back with success response.
   * @param {Function} errorCallback - invoke the call back with error response.
   */
  ExternalAccountsManager.prototype.getBeneficiaryName = function(param,successCallback, errorCallback) {
    
    function getAllCompletionCallback(status, data, error) {
        var serviceResponseHandler = applicationManager.getServiceResponseHandler();
        var responseObject = serviceResponseHandler.manageResponse(status, data, error, successCallback, successCallback);
        if (responseObject["status"] === true) {
            successCallback(responseObject["data"]);
        } else {
            errorCallback(responseObject["errmsg"]);
        }
    }
        var externalBanks = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ExternalAccounts");
        externalBanks.customVerb("getBeneficiaryName",param,getAllCompletionCallback);
  
};
     /**
   * Delete  the Beneficiary  using a service call.
   * @param {Function} successCallback - invoke the call back with success response.
   * @param {Function} errorCallback - invoke the call back with error response.
   */
      ExternalAccountsManager.prototype.deleteBeneficiaryById = function(param,successCallback, errorCallback) {
    
      function getAllCompletionCallback(status, data, error) {
          var serviceResponseHandler = applicationManager.getServiceResponseHandler();
          var responseObject = serviceResponseHandler.manageResponse(status, data, error, successCallback, successCallback);
          if (responseObject["status"] === true) {
              successCallback(responseObject["data"]);
          } else {
              errorCallback(responseObject["errmsg"]);
          }
      }
          var externalBanks = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ExternalAccounts");
          externalBanks.customVerb("deleteExternalAccount",param,getAllCompletionCallback);
    
  };
      /**
   * Edit  Beneficiary  using a service call.
   * @param {Function} successCallback - invoke the call back with success response.
   * @param {Function} errorCallback - invoke the call back with error response.
   */
        ExternalAccountsManager.prototype.editBeneficiary = function(param,successCallback, errorCallback) {
    
      function getAllCompletionCallback(status, data, error) {
          var serviceResponseHandler = applicationManager.getServiceResponseHandler();
          var responseObject = serviceResponseHandler.manageResponse(status, data, error, successCallback, successCallback);
          if (responseObject["status"] === true) {
              successCallback(responseObject["data"]);
          } else {
              errorCallback(responseObject["errmsg"]);
          }
      }
          var externalBanks = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ExternalAccounts");
          externalBanks.customVerb("editExternalAccount",param,getAllCompletionCallback);
    
  };
     /**
  * fetch the Terms and Conditions using a service call.
  * @param {function} presentationSuccessCallback  will be called when call is successfull
  * @param {function} presentationErrorCallback will be called when call is not successfull
  */
ExternalAccountsManager.prototype.fetchTermsAndConditions = function(param,presentationSuccessCallback,presentationErrorCallback)
{
   var self =this;
   var infoTerms  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Consent");
   infoTerms.customVerb("getTermsAndConditions", param, getCompletionCallback);
   function  getCompletionCallback(status,  data,  error) {
     var srh = applicationManager.getServiceResponseHandler();
     var obj =  srh.manageResponse(status,  data,  error,presentationSuccessCallback,presentationErrorCallback);
     if(obj["status"] === true){
     presentationSuccessCallback(data);
     }
     else {
       presentationErrorCallback(obj["errmsg"]);
     }
   }
};

  
  
  
  ExternalAccountsManager.prototype.createInfinityBankTermsAndConditions = function(param,presentationSuccessCallback,presentationErrorCallback)
  {
    var self =this;
    var infoTerms  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Consent");
    infoTerms.customVerb("createTermsAndConditions",param,getCompletionCallback);
    function  getCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error,presentationSuccessCallback,presentationErrorCallback);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]); 
      }
    }
  };
   ExternalAccountsManager.prototype.refreshConsent = function(param,presentationSuccessCallback,presentationErrorCallback)
  {
    var self =this;
    var infoTerms  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Connection");
    infoTerms.customVerb("refreshConnection",param,getCompletionCallback);
    function  getCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error,presentationSuccessCallback,presentationErrorCallback);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]); 
      }
    }
  };
  ExternalAccountsManager.prototype.deleteConnection = function(param,presentationSuccessCallback,presentationErrorCallback)
  {
    var self =this;
    var infoTerms  =  kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Connection");
    infoTerms.customVerb("deleteConnection",param,getCompletionCallback);
    function  getCompletionCallback(status,  data,  error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj =  srh.manageResponse(status,  data,  error,presentationSuccessCallback,presentationErrorCallback);
      if(obj["status"] === true){
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]); 
      }
    }
  };
    return ExternalAccountsManager;

});