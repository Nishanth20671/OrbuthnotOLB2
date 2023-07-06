/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "PortfolioPerformance", "objectService" : "PortfolioServicing"};

    var setterFunctions = {
        portfolioId: function(val, state) {
            context["field"] = "portfolioId";
            context["metadata"] = (objectMetadata ? objectMetadata["portfolioId"] : null);
            state['portfolioId'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        initialValue: function(val, state) {
            context["field"] = "initialValue";
            context["metadata"] = (objectMetadata ? objectMetadata["initialValue"] : null);
            state['initialValue'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        netDeposit: function(val, state) {
            context["field"] = "netDeposit";
            context["metadata"] = (objectMetadata ? objectMetadata["netDeposit"] : null);
            state['netDeposit'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        benchMarkIndex: function(val, state) {
            context["field"] = "benchMarkIndex";
            context["metadata"] = (objectMetadata ? objectMetadata["benchMarkIndex"] : null);
            state['benchMarkIndex'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        duration: function(val, state) {
            context["field"] = "duration";
            context["metadata"] = (objectMetadata ? objectMetadata["duration"] : null);
            state['duration'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        pl: function(val, state) {
            context["field"] = "pl";
            context["metadata"] = (objectMetadata ? objectMetadata["pl"] : null);
            state['pl'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        feesAndTax: function(val, state) {
            context["field"] = "feesAndTax";
            context["metadata"] = (objectMetadata ? objectMetadata["feesAndTax"] : null);
            state['feesAndTax'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        timeWeighted: function(val, state) {
            context["field"] = "timeWeighted";
            context["metadata"] = (objectMetadata ? objectMetadata["timeWeighted"] : null);
            state['timeWeighted'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        moneyWeighted: function(val, state) {
            context["field"] = "moneyWeighted";
            context["metadata"] = (objectMetadata ? objectMetadata["moneyWeighted"] : null);
            state['moneyWeighted'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        portfolioReturn: function(val, state) {
            context["field"] = "portfolioReturn";
            context["metadata"] = (objectMetadata ? objectMetadata["portfolioReturn"] : null);
            state['portfolioReturn'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        dateTime: function(val, state) {
            context["field"] = "dateTime";
            context["metadata"] = (objectMetadata ? objectMetadata["dateTime"] : null);
            state['dateTime'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        referenceCurrency: function(val, state) {
            context["field"] = "referenceCurrency";
            context["metadata"] = (objectMetadata ? objectMetadata["referenceCurrency"] : null);
            state['referenceCurrency'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        dateFrom: function(val, state) {
            context["field"] = "dateFrom";
            context["metadata"] = (objectMetadata ? objectMetadata["dateFrom"] : null);
            state['dateFrom'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        dateTo: function(val, state) {
            context["field"] = "dateTo";
            context["metadata"] = (objectMetadata ? objectMetadata["dateTo"] : null);
            state['dateTo'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        currentValue: function(val, state) {
            context["field"] = "currentValue";
            context["metadata"] = (objectMetadata ? objectMetadata["currentValue"] : null);
            state['currentValue'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        sortBy: function(val, state) {
            context["field"] = "sortBy";
            context["metadata"] = (objectMetadata ? objectMetadata["sortBy"] : null);
            state['sortBy'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        sortOrder: function(val, state) {
            context["field"] = "sortOrder";
            context["metadata"] = (objectMetadata ? objectMetadata["sortOrder"] : null);
            state['sortOrder'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        pageSize: function(val, state) {
            context["field"] = "pageSize";
            context["metadata"] = (objectMetadata ? objectMetadata["pageSize"] : null);
            state['pageSize'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        pageOffset: function(val, state) {
            context["field"] = "pageOffset";
            context["metadata"] = (objectMetadata ? objectMetadata["pageOffset"] : null);
            state['pageOffset'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        currencyId: function(val, state) {
            context["field"] = "currencyId";
            context["metadata"] = (objectMetadata ? objectMetadata["currencyId"] : null);
            state['currencyId'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function PortfolioPerformance(defaultValues) {
        var privateState = {};
        context["field"] = "portfolioId";
        context["metadata"] = (objectMetadata ? objectMetadata["portfolioId"] : null);
        privateState.portfolioId = defaultValues ?
            (defaultValues["portfolioId"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["portfolioId"], context) :
                null) :
            null;

        context["field"] = "initialValue";
        context["metadata"] = (objectMetadata ? objectMetadata["initialValue"] : null);
        privateState.initialValue = defaultValues ?
            (defaultValues["initialValue"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["initialValue"], context) :
                null) :
            null;

        context["field"] = "netDeposit";
        context["metadata"] = (objectMetadata ? objectMetadata["netDeposit"] : null);
        privateState.netDeposit = defaultValues ?
            (defaultValues["netDeposit"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["netDeposit"], context) :
                null) :
            null;

        context["field"] = "benchMarkIndex";
        context["metadata"] = (objectMetadata ? objectMetadata["benchMarkIndex"] : null);
        privateState.benchMarkIndex = defaultValues ?
            (defaultValues["benchMarkIndex"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["benchMarkIndex"], context) :
                null) :
            null;

        context["field"] = "duration";
        context["metadata"] = (objectMetadata ? objectMetadata["duration"] : null);
        privateState.duration = defaultValues ?
            (defaultValues["duration"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["duration"], context) :
                null) :
            null;

        context["field"] = "pl";
        context["metadata"] = (objectMetadata ? objectMetadata["pl"] : null);
        privateState.pl = defaultValues ?
            (defaultValues["pl"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["pl"], context) :
                null) :
            null;

        context["field"] = "feesAndTax";
        context["metadata"] = (objectMetadata ? objectMetadata["feesAndTax"] : null);
        privateState.feesAndTax = defaultValues ?
            (defaultValues["feesAndTax"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["feesAndTax"], context) :
                null) :
            null;

        context["field"] = "timeWeighted";
        context["metadata"] = (objectMetadata ? objectMetadata["timeWeighted"] : null);
        privateState.timeWeighted = defaultValues ?
            (defaultValues["timeWeighted"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["timeWeighted"], context) :
                null) :
            null;

        context["field"] = "moneyWeighted";
        context["metadata"] = (objectMetadata ? objectMetadata["moneyWeighted"] : null);
        privateState.moneyWeighted = defaultValues ?
            (defaultValues["moneyWeighted"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["moneyWeighted"], context) :
                null) :
            null;

        context["field"] = "portfolioReturn";
        context["metadata"] = (objectMetadata ? objectMetadata["portfolioReturn"] : null);
        privateState.portfolioReturn = defaultValues ?
            (defaultValues["portfolioReturn"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["portfolioReturn"], context) :
                null) :
            null;

        context["field"] = "dateTime";
        context["metadata"] = (objectMetadata ? objectMetadata["dateTime"] : null);
        privateState.dateTime = defaultValues ?
            (defaultValues["dateTime"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["dateTime"], context) :
                null) :
            null;

        context["field"] = "referenceCurrency";
        context["metadata"] = (objectMetadata ? objectMetadata["referenceCurrency"] : null);
        privateState.referenceCurrency = defaultValues ?
            (defaultValues["referenceCurrency"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["referenceCurrency"], context) :
                null) :
            null;

        context["field"] = "dateFrom";
        context["metadata"] = (objectMetadata ? objectMetadata["dateFrom"] : null);
        privateState.dateFrom = defaultValues ?
            (defaultValues["dateFrom"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["dateFrom"], context) :
                null) :
            null;

        context["field"] = "dateTo";
        context["metadata"] = (objectMetadata ? objectMetadata["dateTo"] : null);
        privateState.dateTo = defaultValues ?
            (defaultValues["dateTo"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["dateTo"], context) :
                null) :
            null;

        context["field"] = "currentValue";
        context["metadata"] = (objectMetadata ? objectMetadata["currentValue"] : null);
        privateState.currentValue = defaultValues ?
            (defaultValues["currentValue"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["currentValue"], context) :
                null) :
            null;

        context["field"] = "sortBy";
        context["metadata"] = (objectMetadata ? objectMetadata["sortBy"] : null);
        privateState.sortBy = defaultValues ?
            (defaultValues["sortBy"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["sortBy"], context) :
                null) :
            null;

        context["field"] = "sortOrder";
        context["metadata"] = (objectMetadata ? objectMetadata["sortOrder"] : null);
        privateState.sortOrder = defaultValues ?
            (defaultValues["sortOrder"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["sortOrder"], context) :
                null) :
            null;

        context["field"] = "pageSize";
        context["metadata"] = (objectMetadata ? objectMetadata["pageSize"] : null);
        privateState.pageSize = defaultValues ?
            (defaultValues["pageSize"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["pageSize"], context) :
                null) :
            null;

        context["field"] = "pageOffset";
        context["metadata"] = (objectMetadata ? objectMetadata["pageOffset"] : null);
        privateState.pageOffset = defaultValues ?
            (defaultValues["pageOffset"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["pageOffset"], context) :
                null) :
            null;

        context["field"] = "currencyId";
        context["metadata"] = (objectMetadata ? objectMetadata["currencyId"] : null);
        privateState.currencyId = defaultValues ?
            (defaultValues["currencyId"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["currencyId"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "portfolioId": {
                get: function() {
                    context["field"] = "portfolioId";
                    context["metadata"] = (objectMetadata ? objectMetadata["portfolioId"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.portfolioId, context);
                },
                set: function(val) {
                    setterFunctions['portfolioId'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "initialValue": {
                get: function() {
                    context["field"] = "initialValue";
                    context["metadata"] = (objectMetadata ? objectMetadata["initialValue"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.initialValue, context);
                },
                set: function(val) {
                    setterFunctions['initialValue'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "netDeposit": {
                get: function() {
                    context["field"] = "netDeposit";
                    context["metadata"] = (objectMetadata ? objectMetadata["netDeposit"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.netDeposit, context);
                },
                set: function(val) {
                    setterFunctions['netDeposit'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "benchMarkIndex": {
                get: function() {
                    context["field"] = "benchMarkIndex";
                    context["metadata"] = (objectMetadata ? objectMetadata["benchMarkIndex"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.benchMarkIndex, context);
                },
                set: function(val) {
                    setterFunctions['benchMarkIndex'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "duration": {
                get: function() {
                    context["field"] = "duration";
                    context["metadata"] = (objectMetadata ? objectMetadata["duration"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.duration, context);
                },
                set: function(val) {
                    setterFunctions['duration'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "pl": {
                get: function() {
                    context["field"] = "pl";
                    context["metadata"] = (objectMetadata ? objectMetadata["pl"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.pl, context);
                },
                set: function(val) {
                    setterFunctions['pl'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "feesAndTax": {
                get: function() {
                    context["field"] = "feesAndTax";
                    context["metadata"] = (objectMetadata ? objectMetadata["feesAndTax"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.feesAndTax, context);
                },
                set: function(val) {
                    setterFunctions['feesAndTax'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "timeWeighted": {
                get: function() {
                    context["field"] = "timeWeighted";
                    context["metadata"] = (objectMetadata ? objectMetadata["timeWeighted"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.timeWeighted, context);
                },
                set: function(val) {
                    setterFunctions['timeWeighted'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "moneyWeighted": {
                get: function() {
                    context["field"] = "moneyWeighted";
                    context["metadata"] = (objectMetadata ? objectMetadata["moneyWeighted"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.moneyWeighted, context);
                },
                set: function(val) {
                    setterFunctions['moneyWeighted'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "portfolioReturn": {
                get: function() {
                    context["field"] = "portfolioReturn";
                    context["metadata"] = (objectMetadata ? objectMetadata["portfolioReturn"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.portfolioReturn, context);
                },
                set: function(val) {
                    setterFunctions['portfolioReturn'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "dateTime": {
                get: function() {
                    context["field"] = "dateTime";
                    context["metadata"] = (objectMetadata ? objectMetadata["dateTime"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.dateTime, context);
                },
                set: function(val) {
                    setterFunctions['dateTime'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "referenceCurrency": {
                get: function() {
                    context["field"] = "referenceCurrency";
                    context["metadata"] = (objectMetadata ? objectMetadata["referenceCurrency"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.referenceCurrency, context);
                },
                set: function(val) {
                    setterFunctions['referenceCurrency'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "dateFrom": {
                get: function() {
                    context["field"] = "dateFrom";
                    context["metadata"] = (objectMetadata ? objectMetadata["dateFrom"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.dateFrom, context);
                },
                set: function(val) {
                    setterFunctions['dateFrom'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "dateTo": {
                get: function() {
                    context["field"] = "dateTo";
                    context["metadata"] = (objectMetadata ? objectMetadata["dateTo"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.dateTo, context);
                },
                set: function(val) {
                    setterFunctions['dateTo'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "currentValue": {
                get: function() {
                    context["field"] = "currentValue";
                    context["metadata"] = (objectMetadata ? objectMetadata["currentValue"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.currentValue, context);
                },
                set: function(val) {
                    setterFunctions['currentValue'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "sortBy": {
                get: function() {
                    context["field"] = "sortBy";
                    context["metadata"] = (objectMetadata ? objectMetadata["sortBy"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.sortBy, context);
                },
                set: function(val) {
                    setterFunctions['sortBy'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "sortOrder": {
                get: function() {
                    context["field"] = "sortOrder";
                    context["metadata"] = (objectMetadata ? objectMetadata["sortOrder"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.sortOrder, context);
                },
                set: function(val) {
                    setterFunctions['sortOrder'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "pageSize": {
                get: function() {
                    context["field"] = "pageSize";
                    context["metadata"] = (objectMetadata ? objectMetadata["pageSize"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.pageSize, context);
                },
                set: function(val) {
                    setterFunctions['pageSize'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "pageOffset": {
                get: function() {
                    context["field"] = "pageOffset";
                    context["metadata"] = (objectMetadata ? objectMetadata["pageOffset"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.pageOffset, context);
                },
                set: function(val) {
                    setterFunctions['pageOffset'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "currencyId": {
                get: function() {
                    context["field"] = "currencyId";
                    context["metadata"] = (objectMetadata ? objectMetadata["currencyId"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.currencyId, context);
                },
                set: function(val) {
                    setterFunctions['currencyId'].call(this, val, privateState);
                },
                enumerable: true,
            },
        });

        //converts model object to json object.
        this.toJsonInternal = function() {
            return Object.assign({}, privateState);
        };

        //overwrites object state with provided json value in argument.
        this.fromJsonInternal = function(value) {
            privateState.portfolioId = value ? (value["portfolioId"] ? value["portfolioId"] : null) : null;
            privateState.initialValue = value ? (value["initialValue"] ? value["initialValue"] : null) : null;
            privateState.netDeposit = value ? (value["netDeposit"] ? value["netDeposit"] : null) : null;
            privateState.benchMarkIndex = value ? (value["benchMarkIndex"] ? value["benchMarkIndex"] : null) : null;
            privateState.duration = value ? (value["duration"] ? value["duration"] : null) : null;
            privateState.pl = value ? (value["pl"] ? value["pl"] : null) : null;
            privateState.feesAndTax = value ? (value["feesAndTax"] ? value["feesAndTax"] : null) : null;
            privateState.timeWeighted = value ? (value["timeWeighted"] ? value["timeWeighted"] : null) : null;
            privateState.moneyWeighted = value ? (value["moneyWeighted"] ? value["moneyWeighted"] : null) : null;
            privateState.portfolioReturn = value ? (value["portfolioReturn"] ? value["portfolioReturn"] : null) : null;
            privateState.dateTime = value ? (value["dateTime"] ? value["dateTime"] : null) : null;
            privateState.referenceCurrency = value ? (value["referenceCurrency"] ? value["referenceCurrency"] : null) : null;
            privateState.dateFrom = value ? (value["dateFrom"] ? value["dateFrom"] : null) : null;
            privateState.dateTo = value ? (value["dateTo"] ? value["dateTo"] : null) : null;
            privateState.currentValue = value ? (value["currentValue"] ? value["currentValue"] : null) : null;
            privateState.sortBy = value ? (value["sortBy"] ? value["sortBy"] : null) : null;
            privateState.sortOrder = value ? (value["sortOrder"] ? value["sortOrder"] : null) : null;
            privateState.pageSize = value ? (value["pageSize"] ? value["pageSize"] : null) : null;
            privateState.pageOffset = value ? (value["pageOffset"] ? value["pageOffset"] : null) : null;
            privateState.currencyId = value ? (value["currencyId"] ? value["currencyId"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(PortfolioPerformance);

    //Create new class level validator object
    BaseModel.Validator.call(PortfolioPerformance);

    var registerValidatorBackup = PortfolioPerformance.registerValidator;

    PortfolioPerformance.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(PortfolioPerformance.isValid(this, propName, val)) {
                    return setterBackup.apply(null, arguments);
                } else {
                    throw Error("Validation failed for " + propName + " : " + val);
                }
            }
            setterFunctions[arguments[0]].changed = true;
        }
        return registerValidatorBackup.apply(null, arguments);
    }

    //Extending Model for custom operations
    //For Operation 'getPortfolioPerformance' with service id 'getPortfolioPerformance3997'
     PortfolioPerformance.getPortfolioPerformance = function(params, onCompletion){
        return PortfolioPerformance.customVerb('getPortfolioPerformance', params, onCompletion);
     };

    var relations = [];

    PortfolioPerformance.relations = relations;

    PortfolioPerformance.prototype.isValid = function() {
        return PortfolioPerformance.isValid(this);
    };

    PortfolioPerformance.prototype.objModelName = "PortfolioPerformance";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    PortfolioPerformance.registerProcessors = function(options, successCallback, failureCallback) {

        if(!options) {
            options = {};
        }

        if(options && ((options["preProcessor"] && typeof(options["preProcessor"]) === "function") || !options["preProcessor"])) {
            preProcessorCallback = options["preProcessor"];
        }

        if(options && ((options["postProcessor"] && typeof(options["postProcessor"]) === "function") || !options["postProcessor"])) {
            postProcessorCallback = options["postProcessor"];
        }

        function metaDataSuccess(res) {
            objectMetadata = kony.mvc.util.ProcessorUtils.convertObjectMetadataToFieldMetadataMap(res);
            successCallback();
        }

        function metaDataFailure(err) {
            failureCallback(err);
        }

        kony.mvc.util.ProcessorUtils.getMetadataForObject("PortfolioServicing", "PortfolioPerformance", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    PortfolioPerformance.clone = function(objectToClone) {
        var clonedObj = new PortfolioPerformance();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return PortfolioPerformance;
});