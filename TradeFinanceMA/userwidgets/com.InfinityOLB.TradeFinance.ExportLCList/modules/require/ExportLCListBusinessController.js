define(['DataFormattingUtils/FormatUtils', 'InvokeServiceUtils', 'CommonUtilities'], function (FormatUtils, InvokeServiceUtils, CommonUtilities) {
  function BusinessController() {
    this.context = {};
    this.serviceParameters = {};
    this.dataMapping = {};
    this.store = {};
    this.objectMetadata = {};
    this.breakpoints = {};
    this.formatUtils = new FormatUtils();
    this.invokeServiceUtils = new InvokeServiceUtils();
    this.error = [];
  }

  /**
  * @api : setProperties
  * sets initial properties
  * @return : NA
  */
  BusinessController.prototype.setProperties = function (serviceParameters, dataMapping, dataFormatJSON, breakpoints) {
    var scope = this;
    scope.serviceParameters = serviceParameters;
    scope.dataMapping = dataMapping;
    scope.breakpoints = breakpoints;
    scope.formatUtils.updateFormatJSON(dataFormatJSON);
  };
  /**
  * @api : getMetaDataForAllObjects
  * get meta data  from the model for all the objects
  * @return : NA
  */
  BusinessController.prototype.getMetaDataForAllObjects = function () {
    this.getMetaDataFromModel(this.serviceParameters.GetExportLetterOfCredits.Service, this.serviceParameters.GetExportLetterOfCredits.Object);
  };

  /**
  * @api : getMetaDataFromModel
  * get meta data from the model
  * @return : NA
  */
  BusinessController.prototype.getMetaDataFromModel = function (service, object) {
    var scope = this;
    function getMetaDataSuccess(response) {
      var objectMetadata = kony.mvc.util.ProcessorUtils.convertObjectMetadataToFieldMetadataMap(response);
      if (object === "ExportLetterOfCredit") {
        objectMetadata = {
          "amount": { "format": "AMOUNT", "formatting_dependency": "currency" },
          "lcAmount": { "format": "AMOUNT", "formatting_dependency": "currency" },
          "utilizedLCAmount": { "format": "AMOUNT", "formatting_dependency": "currency" },
          "drawingAmount": { "format": "AMOUNT", "formatting_dependency": "currency" },
          "totalAmount": { "format": "AMOUNT", "formatting_dependency": "currency" },
          "drawingCreatedDate": { "format": "CUSTOM_DATE" },
          "expiryDate": { "format": "CUSTOM_DATE" },
          "issueDate": { "format": "CUSTOM_DATE" },
          "latestShipmentDate": { "format": "CUSTOM_DATE" },
          "approvedDate": { "format": "CUSTOM_DATE" },
          "paymentDate": { "format": "CUSTOM_DATE" },
          "lcIssueDate": { "format": "CUSTOM_DATE" },
          "lcExpiryDate": { "format": "CUSTOM_DATE" },
          "amendmentReceivedDate": { "format": "CUSTOM_DATE" },
          "selfAcceptanceDate": { "format": "CUSTOM_DATE" },
          "selfRejectedDate": { "format": "CUSTOM_DATE" },
          "newLcAmount": { "format": "AMOUNT", "formatting_dependency": "lcCurrency" },
          "lcUpdatedOn": { "format": "CUSTOM_DATE" },
          "lcCreatedOn": { "format": "CUSTOM_DATE" }
        };
      }
      scope.objectMetadata[object] = objectMetadata;
    }
    function getMetaDataFailure(err) {
      scope.setError("getMetaDataFromModel", err);
    }
    var options = { "getFromServer": true };
    kony.mvc.util.ProcessorUtils.getMetadataForObject(service, object, options, getMetaDataSuccess, getMetaDataFailure);
  };
  /**
    * @api : fetchExportLCData
    * makes a service call to fetch export LC data
    * @return : NA
    */
  BusinessController.prototype.fetchExportLCData = function (key) {
    var scope = this;
    kony.application.showLoadingScreen();
    const serviceParams = this.serviceParameters[key];
    scope.invokeServiceUtils.makeAServiceCall(serviceParams.ServiceType, serviceParams.Object, scope.getCriteria(serviceParams.Criteria), serviceParams.Verb)
      .then(this.setExportLCDataInCollection.bind(this, serviceParams.Object))
      .catch(scope.setError.bind(this, "fetchExportLCData"));
  };

  /**
  * @api : getCriteria
  * Return the criteria with context value
  * @return : {JSON}
  */
  BusinessController.prototype.getCriteria = function (criteriaJSON) {
    var collectionObj = this.store.getState();
    var criteria = JSON.parse(JSON.stringify(criteriaJSON));
    for (var key in criteria) {
      var value = criteria[key];
      if (typeof value === "string") {
        if (value.indexOf("$") !== -1) {
          var token = value.substring(value.indexOf("{") + 1, value.indexOf("}"));
          var objectName = token.split(".")[1];
          token = token.split(".")[2];
          if (!this.isEmptyNullOrUndefined(collectionObj.Collection[objectName]) && !this.isEmptyNullOrUndefined(collectionObj.Collection[objectName][token])) {
            criteria[key] = collectionObj.Collection[objectName][token];
          } else {
            delete criteria[key];
          }
        }
      }
    }
    return criteria;
  };

  /**
  * @api : setExportLCDataInCollection
  * Store the service response in Master object under collection and invoke formatting data
  * @return : NA
  */
  BusinessController.prototype.setExportLCDataInCollection = function (object, data) {
    kony.application.dismissLoadingScreen();
    for (let key in data) {
      if (Array.isArray(data[key])) {
        data = data[key];
      }
    }
    data = this.getFormattedData(object, data);
    this.store.dispatch({
      type: "UPDATE_CACHE_COLLECTION",
      Cache: data,
      Collection: data,
      key: object
    });
  };

  /**
  * @api : getFormattedData
  * returns the formatted data
  * @return : NA
  */
  BusinessController.prototype.getFormattedData = function (object, data) {
    var scope = this;
    var objectMetadata = scope.objectMetadata[object];
    var formattedData = JSON.parse(JSON.stringify(data));
    formattedData.map(function (record) {
      var keys = Object.keys(record);
      keys.forEach((key) => {
        if (objectMetadata.hasOwnProperty(key)) {
          var metaData = objectMetadata[key];
          if (metaData.format != undefined) {
            var dependentData;
            if (metaData.formatting_dependency) {
              dependentData = record[metaData.formatting_dependency]
            }
            if (key === "drawingAmount" || key === "lcAmount" || key === "amount")
              record[key] = record[key].replace(/,/g, '');
            var formattedValue = scope.formatUtils.formatData(metaData.format, record[key], dependentData);
            if (key === "drawingAmount") {
              formattedValue = formattedValue.charAt(0).concat(formattedValue.split(formattedValue.charAt(0)).join(" "));
            }
            record[key + "Formatted"] = formattedValue;
          }
        }
      });
    });
    return formattedData;
  };

  /**
     * @api : getDataBasedOnDataMapping
     * gets the corresponding data of each widget from collection
     * @return : NA
     */
  BusinessController.prototype.getDataBasedOnDataMapping = function (widget) {
    var collectionObj = this.store.getState();
    var dataMapping = this.dataMapping;
    for (var record in dataMapping) {
      var keyValues = dataMapping[record];
      for (var key in keyValues) {
        if (widget === key) {
          var fieldValue = dataMapping[record][widget];
          if (typeof fieldValue === "string") {
            if (!fieldValue.indexOf("${Collection")) {
              var group = fieldValue.split(".")[1];
              var fieldType = fieldValue.split(".")[2].replace("}", "");
              if (!this.isEmptyNullOrUndefined(collectionObj.Collection[group])) {
                if (!this.isEmptyNullOrUndefined(collectionObj.Collection[group][fieldType]))
                  return collectionObj.Collection[group][fieldType];
              }
            }
            else if (!fieldValue.indexOf("${i18n"))
              return kony.i18n.getLocalizedString(fieldValue.substring(fieldValue.indexOf("${i18n{") + 7, fieldValue.length - 2));
            else
              return fieldValue;
          }
          else if (typeof fieldValue === "object") {
            var data = this.getDataSpecificToBreakpoint(fieldValue);
            if (!data.indexOf("${Collection")) {
              var group = data.split(".")[1];
              var fieldType = data.split(".")[2].replace("}", "");
              if (!this.isEmptyNullOrUndefined(collectionObj.Collection[group])) {
                if (!this.isEmptyNullOrUndefined(collectionObj.Collection[group][fieldType]))
                  return collectionObj.Collection[group][fieldType];
              }
            }
            else if (!data.indexOf("${i18n"))
              return kony.i18n.getLocalizedString(data.substring(data.indexOf("${i18n{") + 7, data.length - 2));
            else
              return data;
          }
        }
      }
    }
    return "";
  };

  /**
   * @api : storeInCollection
   * stores the input data in collection
   * @return : NA
   */
  BusinessController.prototype.storeInCollection = function (inputData) {
    var scope = this;
    var collectionObj = this.store.getState();
    for (var key in inputData) {
      var fieldName = this.getKeyFromMapping(key) || key;
      var objectName = this.getObjectName(key) || "ExportLC";
      if (!this.isEmptyNullOrUndefined(collectionObj.Collection[objectName])) {
        collectionObj.Collection[objectName][fieldName] = inputData[key];
      } else {
        collectionObj.Collection[objectName] = {};
        collectionObj.Collection[objectName][fieldName] = inputData[key];
      }
    }
  };

  /**
  * @api : getObjectName
  * gets the object name mapped for the corresponding widget
  * @return : NA
  */
  BusinessController.prototype.getObjectName = function (widgetName, dataMapping) {
    var dataMapping = this.dataMapping;
    for (var record in dataMapping) {
      var keyValues = dataMapping[record];
      if (!(widgetName in keyValues)) continue;
      for (var key in keyValues) {
        if (widgetName === key) {
          var fieldValue = dataMapping[record][widgetName];
          if (typeof fieldValue === "object") {
            fieldValue = fieldValue.mapping;
          }
          fieldValue = fieldValue.split(".")[1];
          return fieldValue;
        }
      }
    }
  };

  /**
   * @api : getDataSpecificToBreakpoint
   * gets data specified to the corresponding breakpoint
   * @return : NA
   */
  BusinessController.prototype.getDataSpecificToBreakpoint = function (inputJSON) {
    var currentBreakpoint = kony.application.getCurrentBreakpoint();
    if (Object.keys(this.breakpoints).length !== 0) {
      for (var key in this.breakpoints) {
        if (currentBreakpoint === this.breakpoints[key]) {
          if (!this.isEmptyNullOrUndefined(inputJSON.key))
            return inputJSON.key;
        }
      }
    }
    if (inputJSON.hasOwnProperty("default"))
      return inputJSON["default"];
  };

  /**
  * @api : getKeyFromMapping
  * gets key from data mapping
  * @return : NA
  */
  BusinessController.prototype.getKeyFromMapping = function (widget) {
    var dataMapping = this.dataMapping;
    for (var record in dataMapping) {
      var keyValues = dataMapping[record];
      if (!(widget in keyValues)) continue;
      for (var key in keyValues) {
        if (widget === key) {
          var fieldValue = dataMapping[record][widget];
          if (typeof fieldValue === "object") {
            fieldValue = fieldValue.mapping;
          }
          if (!fieldValue) return "";
          fieldValue = fieldValue.split(".")[2].replace("}", "");
          return fieldValue;
        }
      }
    }
  };
  BusinessController.prototype.generateExportLC = function (key, payload, fileName) {
    var scope = this;
    kony.application.showLoadingScreen();
    const serviceParams = this.serviceParameters[key];
    scope.invokeServiceUtils.makeAServiceCall(serviceParams.ServiceType, serviceParams.Object, payload || serviceParams.Criteria, serviceParams.Verb)
      .then(this.downloadExportLC.bind(this, fileName))
      .catch(scope.setError.bind(this, "generateExportLC"));
  };
  BusinessController.prototype.downloadExportLC = function (fileName, response) {
    const mfURL = KNYMobileFabric.mainRef.config.services_meta.TradeFinance.url;
    const url = `${mfURL}/operations/LCSummary/downloadGeneratedAcknowledgement`;
    CommonUtilities.downloadGeneratedFile({ url, fileName, fileType: 'pdf' }, {"fileId": response.fileId});
    kony.application.dismissLoadingScreen();
  };
  BusinessController.prototype.getExportDrawingSummary = function ({ exportLCId, drawingReferenceNo }) {
    var scope = this;
    kony.application.showLoadingScreen();
    let p1 = scope.invokeServiceUtils.makeAServiceCall("customVerb", this.serviceParameters.GetExportLetterOfCreditsById.Object, { lcReferenceNo: exportLCId }, this.serviceParameters.GetExportLetterOfCreditsById.Verb);
    let p2 = scope.invokeServiceUtils.makeAServiceCall("customVerb", this.serviceParameters.GetExportDrawingById.Object, { drawingReferenceNo }, this.serviceParameters.GetExportDrawingById.Verb);
    Promise.all([p1, p2])
      .then(this.fetchExportDrawingSummary.bind(this, this.serviceParameters.GetExportLetterOfCreditsById.Object))
      .catch(scope.setError.bind(this, "getExportDrawingSummary"));
  };
  BusinessController.prototype.fetchExportDrawingSummary = function (object, data) {
    const LCreditData = this.getFormattedData(object, data[0].ExportLC);
    const SwiftsAndAdvises = data[0]['SwiftsAndAdvises'] ? this.getFormattedData(object, data[0]['SwiftsAndAdvises']) : [];
    const drawingData = this.getFormattedData(object, [data[1]]);
    const PaymentAdvices = data[1]['PaymentAdvices'] ? this.getFormattedData(object, data[1]['PaymentAdvices']) : [];
    kony.application.dismissLoadingScreen();
    this.store.dispatch({
      type: "UPDATE_COLLECTION",
      data: {
        ExportLetterOfCredit: Object.assign(LCreditData[0], { SwiftsAndAdvises }),
        ExportDrawing: Object.assign(drawingData[0], { PaymentAdvices })
      },
      key: 'ExportDrawingSummary'
    });
  };
  /**
    * @api : getExportAmendmentSummary
    * Get lc details and related swifts and advices
    * @return : NA
    */
  BusinessController.prototype.getExportLCSummary = function ({ exportLCId }) {
    var scope = this;
    kony.application.showLoadingScreen();
    const serviceParams = this.serviceParameters['GetExportLetterOfCreditsById'];
    scope.invokeServiceUtils.makeAServiceCall(serviceParams.ServiceType, serviceParams.Object, { lcReferenceNo: exportLCId }, serviceParams.Verb)
      .then(this.fetchExportLCSummary.bind(this, serviceParams.Object))
      .catch(scope.setError.bind(this, "getExportLCSummary"));
  };
  BusinessController.prototype.fetchExportLCSummary = function (object, data) {
    const LCData = this.getFormattedData(object, data.ExportLC);
    const SwiftsAndAdvises = data['SwiftsAndAdvises'] ? this.getFormattedData(object, data['SwiftsAndAdvises']) : [];
    kony.application.dismissLoadingScreen();
    this.store.dispatch({
      type: "UPDATE_COLLECTION",
      data: Object.assign(LCData[0], { SwiftsAndAdvises }),
      key: 'ExportLCSummary'
    });
  };
  /**
    * @api : getExportAmendmentSummary
    * get amendment details and respective lc details
    * @return : NA
    */
  BusinessController.prototype.getExportAmendmentSummary = function (exportLCId, amendmentSRMSRequestId) {
    var scope = this;
    kony.application.showLoadingScreen();
    let p1 = scope.invokeServiceUtils.makeAServiceCall("customVerb", this.serviceParameters.GetExportLetterOfCreditsById.Object, { lcReferenceNo: exportLCId }, this.serviceParameters.GetExportLetterOfCreditsById.Verb);
    let p2 = scope.invokeServiceUtils.makeAServiceCall("customVerb", this.serviceParameters.GetExportAmendmentById.Object, { amendmentSRMSRequestId: amendmentSRMSRequestId }, this.serviceParameters.GetExportAmendmentById.Verb);
    Promise.all([p1, p2])
      .then(this.fetchExportAmendmentSummary.bind(this, this.serviceParameters.GetExportLetterOfCreditsById.Object))
      .catch(scope.setError.bind(this, "getExportAmendmentSummary"));
  };
  BusinessController.prototype.fetchExportAmendmentSummary = function (object, data) {
    const LCreditData = this.getFormattedData(object, data[0].ExportLC);
    const SwiftsAndAdvises = data[0]['SwiftsAndAdvises'] ? this.getFormattedData(object, data[0]['SwiftsAndAdvises']) : [];
    const AmendmentData = this.getFormattedData(object, [data[1]]);
    kony.application.dismissLoadingScreen();
    this.store.dispatch({
      type: "UPDATE_COLLECTION",
      data: {
        ExportLetterOfCredit: Object.assign(LCreditData[0], { SwiftsAndAdvises }),
        ExportAmendment: Object.assign(AmendmentData)
      },
      key: 'ExportAmendmentSummary'
    });
  };
  /**
    * @api : getExportAmendmentsSummary
    * get complete lc details, dependent amendments
    * @return : NA
    */
  BusinessController.prototype.getExportLcAmendmentsSummary = function ({ exportLCId }) {
    var scope = this;
    kony.application.showLoadingScreen();
    let p1 = scope.invokeServiceUtils.makeAServiceCall("customVerb", this.serviceParameters.GetExportLetterOfCreditsById.Object, { lcReferenceNo: exportLCId }, this.serviceParameters.GetExportLetterOfCreditsById.Verb);
    let p2 = scope.invokeServiceUtils.makeAServiceCall("customVerb", this.serviceParameters.GetExportAmendments.Object, { sortByParam: "amendmentNo", sortOrder: "DESC", filterByValue: exportLCId, filterByParam: "exportlcSRMSRequestId" }, this.serviceParameters.GetExportAmendments.Verb);
    Promise.all([p1, p2])
      .then(this.fetchExportAmendmentsSummary.bind(this, this.serviceParameters.GetExportLetterOfCreditsById.Object))
      .catch(scope.setError.bind(this, "getExportLcAmendmentsSummary"));
  };
  BusinessController.prototype.fetchExportAmendmentsSummary = function (object, data) {
    const LCreditData = this.getFormattedData(object, data[0].ExportLC);
    const SwiftsAndAdvises = data[0]['SwiftsAndAdvises'] ? this.getFormattedData(object, data[0]['SwiftsAndAdvises']) : [];
    const AmendmentData = this.getFormattedData(object, data[1].ExportLcAmendments);
    kony.application.dismissLoadingScreen();
    this.store.dispatch({
      type: "UPDATE_COLLECTION",
      data: {
        ExportLetterOfCredit: Object.assign(LCreditData[0], { SwiftsAndAdvises }),
        ExportAmendments: Object.assign(AmendmentData)
      },
      key: 'ExportLcAmendmentsSummary'
    });
  };
  /**
    * @api : isEmptyNullOrUndefined
    * Verifies if the value is empty, null or undefined
    * data {any} - value to be verified
    * @return : {boolean} - validity of the value passed
    */
  BusinessController.prototype.isEmptyNullOrUndefined = function (data) {
    if (data === null || data === undefined || data === "") return true;
    if (typeof data === "object") {
      if (Array.isArray(data)) return data.length === 0;
      return Object.keys(data).length === 0;
    }
    return false;
  };
  /**
    * @api : resetCollection
    * clears the data in collection
    * @return : NA
    */
  BusinessController.prototype.resetCollection = function (objectName) {
    let collectionObj = this.store.getState();
    if (objectName) {
      collectionObj["Collection"][objectName] = {};
    } else {
      collectionObj["Cache"] = {},
        collectionObj["Collection"] = {};
    }
  };
  /**
       * @api : getXLSXFile
       * download the data of records in XLSX format.
       * @return : NA
       */
  BusinessController.prototype.getXLSXFile = function (key, Verb, fileName) {
    var scope = this;
    kony.application.showLoadingScreen();
    const serviceParams = this.serviceParameters[key];
    serviceParams.Verb = Verb;
    var criteria = scope.getCriteria(serviceParams.Criteria);
    criteria["pageOffset"] = "";
    criteria["pageSize"] = "";
    scope.invokeServiceUtils.makeAServiceCall(serviceParams.ServiceType, serviceParams.Object, criteria, serviceParams.Verb).then(this.getXLSXFileSuccess.bind(this, fileName)).catch(scope.getXLSXFileFailure.bind(this));
  };
  /**
  * @api : getXLSXFileSuccess
  * downloads the data on successful service call
  * @return : NA
  */
  BusinessController.prototype.getXLSXFileSuccess = function (fileName, response) {
    const mfURL = KNYMobileFabric.mainRef.config.services_meta.TradeFinance.url;
    const url = `${mfURL}/operations/LCSummary/downloadGeneratedList`;
    CommonUtilities.downloadGeneratedFile({ url, fileName, fileType: 'xlsx' }, {"fileId": response.fileId});
    kony.application.dismissLoadingScreen();
    this.store.dispatch({
      type: "UPDATE_COLLECTION",
      data: {
        isDownloadComplete: true
      },
      key: "download"
    });
  };
  /**
  * @api : getXLSXFileFailure
  * Handles download service failed cases
  * @return : validation type
  */
  BusinessController.prototype.getXLSXFileFailure = function (responseError) {
    this.store.dispatch({
      type: "UPDATE_COLLECTION",
      data: {
        isDownloadComplete: true
      },
      key: "download"
    });
    this.setError(responseError, "getXLSXFileFailure");
  };

  /**
  * @api : setError
  * triggered as a error call back for any service
  * @return : NA
  */
  BusinessController.prototype.setError = function (method, errorDetails) {
    var collectionObj = this.store.getState();
    const objectName = "ErrorDetails";
    kony.application.dismissLoadingScreen();
    collectionObj.Collection[objectName] = {};
    this.store.dispatch({
      type: "UPDATE_COLLECTION",
      data: errorDetails,
      key: objectName
    });
  };
  return BusinessController;
});
