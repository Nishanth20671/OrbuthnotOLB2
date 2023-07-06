define([], function () {
    /**
     * User defined business controller
     * @constructor
     * @extends kony.mvc.Business.Delegator
     */
    function BillsManager() {
        kony.mvc.Business.Delegator.call(this);
    }

    inheritsFrom(BillsManager, kony.mvc.Business.Delegator);
    /**
     * Method to fetch payment payees
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.fetchPaymentPayees = function (params, successCallback, errorCallback) {
        const payeesRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("Payees");
        payeesRepo.customVerb("getPayees", params, getCompletionCallback, "online");
        function getCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                successCallback(obj.data);
            } else {
                errorCallback(obj.errmsg);
            }
        }
    };
    /**
     * Method to fetch corporate payees
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.fetchCorporatePayees = function (params, successCallback, errorCallback) {
        const payeesRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("CorporatePayees");
        payeesRepo.customVerb('getCorporatePayees', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                successCallback(obj.data);
            } else {
                errorCallback(obj.errmsg);
            }
        }
    };
    /**
     * Method to upload supporting documents
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.uploadDocument = function (params, successCallback, errorCallback) {
        const tradeDocumentsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TradeDocuments");
        tradeDocumentsRepo.customVerb('uploadDocument', params, getAllCompletionCallback);
        function getAllCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                successCallback(obj.data);
            } else {
                errorCallback(obj.errmsg);
            }
        }
    };
    /**
     * Method to delete supporting documents
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.deleteDocument = function (params, successCallback, errorCallback) {
        const tradeDocumentsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TradeDocuments");
        tradeDocumentsRepo.customVerb('deleteDocument', params, getAllCompletionCallback);
        function getAllCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                successCallback(obj.data);
            } else {
                errorCallback(obj.errmsg);
            }
        }
    };
    /**
     * Method to download uploaded documents
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.downloadDocument = function (params, successCallback, errorCallback) {
        const tradeDocumentsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TradeDocuments");
        tradeDocumentsRepo.customVerb('downloadDocument', params, getAllCompletionCallback);
        function getAllCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                successCallback(obj["data"]);
            } else {
                errorCallback(obj["errmsg"]);
            }
        }
    };

    /**
    * Method to fetch file response
    * @param {Object} params request parameters
    * @param {function} successCallback invoke the call back with success response
    * @param {function} errorCallback invoke the call back with error response
    */
    BillsManager.prototype.fetchFileResponse = function (params, successCallback, errorCallback) {
        const tradeDocumentsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TradeDocuments");
        tradeDocumentsRepo.customVerb('downloadDocument', params, getAllCompletionCallback);
        function getAllCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj["status"] === true) {
                successCallback(obj["data"]);
            } else {
                errorCallback(obj["errmsg"]);
            }
        }
    };

    /**
     * Method to save Bill record
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.saveBill = function (params, successCallback, errorCallback) {
        const receivableSingleBillsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivableSingleBills");
        receivableSingleBillsRepo.customVerb('saveBill', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                successCallback(obj.data);
            } else {
                errorCallback(obj.errmsg);
            }
        }
    };
    /**
     * Method to create Bill record
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.createBill = function (params, successCallback, errorCallback) {
        const receivableSingleBillsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivableSingleBills");
        receivableSingleBillsRepo.customVerb('createBill', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                successCallback(obj.data);
            } else {
                errorCallback(obj.errmsg);
            }
        }
    };
    /**
     * Method to create Bill from csv upload
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.createBillsFromCSV = function (params, successCallback, errorCallback) {
        const receivableSingleBillsCSVRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivablesCsvImport");
        receivableSingleBillsCSVRepo.customVerb('createBills', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                successCallback(obj.data);
            } else {
                errorCallback(obj.errmsg);
            }
        }
    };
    /**
     * Method to delete Bill record
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.deleteBill = function (params, successCallback, errorCallback) {
        const receivableSingleBillsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivableSingleBills");
        receivableSingleBillsRepo.customVerb('deleteBill', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                successCallback(obj.data);
            } else {
                errorCallback(obj.errmsg);
            }
        }
    };
    /**
     * Method to revise Bill record
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.reviseBill = function (params, successCallback, errorCallback) {
        const receivableSingleBillsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivableSingleBills");
        receivableSingleBillsRepo.customVerb('reviseBill', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                successCallback(obj.data);
            } else {
                errorCallback(obj.errmsg);
            }
        }
    };
    /**
     * Method to get all Bill records
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.getBills = function (params, successCallback, errorCallback) {
        const receivableSingleBillsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivableSingleBills");
        receivableSingleBillsRepo.customVerb('getBills', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                successCallback(obj.data);
            } else {
                errorCallback(obj.errmsg);
            }
        }
    };
    /**
     * Method to get single Bill record
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.getBill = function (params, successCallback, errorCallback) {
        const receivableSingleBillsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivableSingleBills");
        receivableSingleBillsRepo.customVerb('getBill', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                successCallback(obj.data);
            } else {
                errorCallback(obj.errmsg);
            }
        }
    };

    /**
     * Method to get Swift Advices
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.fetchSwiftsAdvices = function (params, successCallback, errorCallback) {
        const receivableSingleBillsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("SwiftsAdvices");
        receivableSingleBillsRepo.customVerb('fetchSwiftsAdvices', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                successCallback(obj.data);
            } else {
                errorCallback(obj.errmsg);
            }
        }
    };

    /**
     * Method to cancel the bill
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.cancelBillRequest = function (params, successCallback, errorCallback) {
        const receivableSingleBillsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivableSingleBills");
        receivableSingleBillsRepo.customVerb('requestBillCancellation', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const srh = applicationManager.getServiceResponseHandler();
            const obj = srh.manageResponse(status, data, error);
            if (obj.status === true) {
                successCallback(obj.data);
            } else {
                errorCallback(obj.errmsg);
            }
        }
    };

    /**
     * Method to get the report of single Bill record
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.generateBill = function (params, successCallback, errorCallback) {
        const receivableSingleBillsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivableSingleBills");
        receivableSingleBillsRepo.customVerb('generateBillReport', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const responseObj = applicationManager.getServiceResponseHandler().manageResponse(status, data, error);
            if (responseObj.status === true) {
                successCallback(responseObj.data);
            } else {
                errorCallback(responseObj.errmsg);
            }
        }
    };
    /**
     * Method to generate xlsx for list of Bill records
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.generateBillsList = function (params, successCallback, errorCallback) {
        const receivableSingleBillsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivableSingleBills");
        receivableSingleBillsRepo.customVerb('generateBillsList', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const responseObj = applicationManager.getServiceResponseHandler().manageResponse(status, data, error);
            if (responseObj.status === true) {
                successCallback(responseObj.data);
            } else {
                errorCallback(responseObj.dbpErrMsg);
            }
        }
    };
    /**
     * Method to submit imported bill
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.submitImportedBill = function (params, successCallback, errorCallback) {
        const receivableSingleBillsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivableSingleBills");
        receivableSingleBillsRepo.customVerb('submitImportedBill', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const responseObj = applicationManager.getServiceResponseHandler().manageResponse(status, data, error);
            if (responseObj.status === true) {
                successCallback(responseObj.data);
            } else {
                errorCallback(responseObj.errmsg);
            }
        }
    };
    /**
     * Method to submit imported CSV
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.submitImportedCsv = function (params, successCallback, errorCallback) {
        const receivablesCsvImportRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivablesCsvImport");
        receivablesCsvImportRepo.customVerb('submitCsvImport', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const responseObj = applicationManager.getServiceResponseHandler().manageResponse(status, data, error);
            if (responseObj.status === true) {
                successCallback(responseObj.data);
            } else {
                errorCallback(responseObj.errmsg);
            }
        }
    };
    /**
     * Method to fetch all imported CSV
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.fetchCsvImports = function (params, successCallback, errorCallback) {
        const receivablesCsvImportRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivablesCsvImport");
        receivablesCsvImportRepo.customVerb('getCsvImports', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const responseObj = applicationManager.getServiceResponseHandler().manageResponse(status, data, error);
            if (responseObj.status === true) {
                successCallback(responseObj.data);
            } else {
                errorCallback(responseObj.errmsg);
            }
        }
    };
    /**
     * Method to fetch single imported CSV
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.fetchCsvImport = function (params, successCallback, errorCallback) {
        const receivablesCsvImportRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivablesCsvImport");
        receivablesCsvImportRepo.customVerb('getCsvImportById', params, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const responseObj = applicationManager.getServiceResponseHandler().manageResponse(status, data, error);
            if (responseObj.status === true) {
                successCallback(responseObj.data);
            } else {
                errorCallback(responseObj.errmsg);
            }
        }
    };
  /**
     * Method to delete CsvImports
     * @param {Object} params request parameters
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
  BillsManager.prototype.deleteCsvImports = function (params, successCallback, errorCallback) {
    const receivablesCsvImportRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("ReceivablesCsvImport");
    receivablesCsvImportRepo.customVerb('deleteImportedBills', params, getAllCompletionCallback);
    function getAllCompletionCallback(status, data, error) {
      const srh = applicationManager.getServiceResponseHandler();
      const obj = srh.manageResponse(status, data, error);
      if (obj.status === true) {
        successCallback(obj.data);
      } else {
        errorCallback(obj.errmsg);
      }
    }
  };
    /**
     * Method to fetch all countries
     * @param {function} successCallback invoke the call back with success response
     * @param {function} errorCallback invoke the call back with error response
     */
    BillsManager.prototype.fetchCountriesList = function (successCallback, errorCallback) {
        const tsfUtilsRepo = kony.mvc.MDAApplication.getSharedInstance().getRepoManager().getRepository("TradeSupplyFinanceUtils");
        tsfUtilsRepo.customVerb('getAllCountries', null, getCompletionCallback);
        function getCompletionCallback(status, data, error) {
            const responseObj = applicationManager.getServiceResponseHandler().manageResponse(status, data, error);
            if (responseObj.status === true) {
                successCallback(responseObj.data);
            } else {
                errorCallback(responseObj.errmsg);
            }
        }
    };
    return BillsManager;
});