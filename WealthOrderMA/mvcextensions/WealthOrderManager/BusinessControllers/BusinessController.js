define([], function () { 
    
    /**
     * User defined business controller
     * @constructor
     * @extends kony.mvc.Business.Delegator
     */
    function WealthOrderManager() { 

        kony.mvc.Business.Delegator.call(this); 

    } 

    inheritsFrom(WealthOrderManager, kony.mvc.Business.Delegator); 
    WealthOrderManager.prototype.getAssets = function (params,presentationSuccessCallback, presentationErrorCallback) {
    var instrumentList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("PortfolioDetails");
   instrumentList.customVerb("getPortfolioDetails", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  
  };
  
    WealthOrderManager.prototype.getOrdersDetails = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var order = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("PortfolioDetails");
    order.customVerb("getOrdersDetails", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
    WealthOrderManager.prototype.getUserFavouriteInstruments = function (params,presentationSuccessCallback, presentationErrorCallback) {
    var favouriteList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("FavouriteInstruments");
    favouriteList.customVerb("getUserFavouriteInstruments", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
  WealthOrderManager.prototype.updateUserFavouriteInstruments = function (params,presentationSuccessCallback, presentationErrorCallback) {
    var favouriteList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("FavouriteInstruments");
    favouriteList.customVerb("updateUserFavouriteInstruments", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
  WealthOrderManager.prototype.getCurrencyList = function (presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("CurrencyDetails");
    holdingsList.customVerb("getAddCurrency",{}, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
     WealthOrderManager.prototype.getPlaceOrderDetails = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ProductDetails");
    //holdingsList.customVerb("GetInstrumentDetails", params, getAllCompletionCallback);
    holdingsList.customVerb("getProductDetailsFromId", params, getAllCompletionCallback);
       function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
  WealthOrderManager.prototype.getCurrencyRate = function (param, presentationSuccessCallback, presentationErrorCallback) {
    var savingsPotRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("CurrencyDetails"); 
    savingsPotRepo.customVerb("GetMarketRates", param, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
           presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
       }
    }
  };
  
  WealthOrderManager.prototype.getHistoricalCurrencyRate = function (param, presentationSuccessCallback, presentationErrorCallback) {
    var savingsPotRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("CurrencyDetails"); 
    savingsPotRepo.customVerb("getHistoricalData", param, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
           presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
       }
    }
  };
  
  WealthOrderManager.prototype.createOrder = function (param, presentationSuccessCallback, presentationErrorCallback) {
    var savingsPotRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("CurrencyDetails"); 
    savingsPotRepo.customVerb("createOrder", param, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
           presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
       }
    }
  };
  
  WealthOrderManager.prototype.getPortfolioDetails = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var instrumentList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("PortfolioDetails");
    instrumentList.customVerb("getPortfolioDetails", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
 };
  
    WealthOrderManager.prototype.clearWealthObject = function () {
    var modelDefinition = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Order");
    this.wealthData = new modelDefinition();
  };
    
  WealthOrderManager.prototype.getAssets = function (params,presentationSuccessCallback, presentationErrorCallback) {
    var instrumentList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("PortfolioDetails");
   instrumentList.customVerb("getPortfolioDetails", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  
  };
  
   WealthOrderManager.prototype.downloadList = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var DownloadList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("DownloadPDF");
    DownloadList.customVerb("generatePDF", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  WealthOrderManager.prototype.watchdownloadList = function (params,presentationSuccessCallback, presentationErrorCallback) {
var DownloadList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("DownloadOrderPDF");
DownloadList.customVerb("generatePDF", params, getAllCompletionCallback);
function getAllCompletionCallback(status, data, error) {
var srh = applicationManager.getServiceResponseHandler();
var obj = srh.manageResponse(status, data, error);
if (obj["status"] === true) {
presentationSuccessCallback(obj["data"]);
}
else {
presentationErrorCallback(obj["errmsg"]);
}
}
};
   WealthOrderManager.prototype.setWealthAttribute = function (key, value) {
    this.wealthData[key] = value;
  };
  
  WealthOrderManager.prototype.getHoldingList = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("PortfolioDetails");
    holdingsList.customVerb("getPortfolioHoldings", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
   
   WealthOrderManager.prototype.getWealthObject = function () {
    return this.wealthData;
  };
  
    WealthOrderManager.prototype.getInstrumentDetailsById = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var holdingsList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("ProductDetails");
    holdingsList.customVerb("getProductDetailsFromId", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
  WealthOrderManager.prototype.createMarketOrder = function (param, presentationSuccessCallback, presentationErrorCallback) {
    var marketOrder = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Order"); 
    // #RemovedCustomerID - Removed customer ID as its taken care at the server level
    delete param["customerId"];
    marketOrder.customVerb("createMarketOrder", param, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
           presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
       }
    }
  };

  WealthOrderManager.prototype.modifyMarketOrder = function (param, presentationSuccessCallback, presentationErrorCallback) {
    var marketOrder = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Order");
    // #RemovedCustomerID - Removed customer ID as its taken care at the server level
    delete param["customerId"];
    marketOrder.customVerb("modifyOrder", param, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
        var srh = applicationManager.getServiceResponseHandler();
        var obj = srh.manageResponse(status, data, error);
        if (obj["status"] === true) {
           presentationSuccessCallback(obj["data"]);
        }
        else {
          presentationErrorCallback(obj["errmsg"]);
       }
    }
  };
  
  WealthOrderManager.prototype.cancelOrder = function (params,presentationSuccessCallback, presentationErrorCallback) {
     var order = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("Order");
    order.customVerb("cancelOrder", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
  
  WealthOrderManager.prototype.getFavoriteInstruments = function (params,presentationSuccessCallback, presentationErrorCallback) {
    var favouriteList = kony.mvc.MDAApplication.getSharedInstance().modelStore.getModelDefinition("FavouriteInstruments");
    favouriteList.customVerb("getFavoriteInstruments", params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      var srh = applicationManager.getServiceResponseHandler();
      var obj = srh.manageResponse(status, data, error);
      if (obj["status"] === true) {
        presentationSuccessCallback(obj["data"]);
      }
      else {
        presentationErrorCallback(obj["errmsg"]);
      }
    }
  };
    return WealthOrderManager;

});