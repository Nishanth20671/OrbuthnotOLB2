/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "Banks", "objectService" : "ExternalAccounts"};

    var setterFunctions = {
        dbpErrCode: function(val, state) {
            context["field"] = "dbpErrCode";
            context["metadata"] = (objectMetadata ? objectMetadata["dbpErrCode"] : null);
            state['dbpErrCode'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        dbpErrMsg: function(val, state) {
            context["field"] = "dbpErrMsg";
            context["metadata"] = (objectMetadata ? objectMetadata["dbpErrMsg"] : null);
            state['dbpErrMsg'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        bankCode: function(val, state) {
            context["field"] = "bankCode";
            context["metadata"] = (objectMetadata ? objectMetadata["bankCode"] : null);
            state['bankCode'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        supportedAccountNaturess: function(val, state) {
            context["field"] = "supportedAccountNaturess";
            context["metadata"] = (objectMetadata ? objectMetadata["supportedAccountNaturess"] : null);
            state['supportedAccountNaturess'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        internalBankId: function(val, state) {
            context["field"] = "internalBankId";
            context["metadata"] = (objectMetadata ? objectMetadata["internalBankId"] : null);
            state['internalBankId'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        supportedFetchScopess: function(val, state) {
            context["field"] = "supportedFetchScopess";
            context["metadata"] = (objectMetadata ? objectMetadata["supportedFetchScopess"] : null);
            state['supportedFetchScopess'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        timeZone: function(val, state) {
            context["field"] = "timeZone";
            context["metadata"] = (objectMetadata ? objectMetadata["timeZone"] : null);
            state['timeZone'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        bankName: function(val, state) {
            context["field"] = "bankName";
            context["metadata"] = (objectMetadata ? objectMetadata["bankName"] : null);
            state['bankName'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        isActive: function(val, state) {
            context["field"] = "isActive";
            context["metadata"] = (objectMetadata ? objectMetadata["isActive"] : null);
            state['isActive'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        supportedAccountTypess: function(val, state) {
            context["field"] = "supportedAccountTypess";
            context["metadata"] = (objectMetadata ? objectMetadata["supportedAccountTypess"] : null);
            state['supportedAccountTypess'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        logoUrl: function(val, state) {
            context["field"] = "logoUrl";
            context["metadata"] = (objectMetadata ? objectMetadata["logoUrl"] : null);
            state['logoUrl'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        mode: function(val, state) {
            context["field"] = "mode";
            context["metadata"] = (objectMetadata ? objectMetadata["mode"] : null);
            state['mode'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        homeUrl: function(val, state) {
            context["field"] = "homeUrl";
            context["metadata"] = (objectMetadata ? objectMetadata["homeUrl"] : null);
            state['homeUrl'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        provider: function(val, state) {
            context["field"] = "provider";
            context["metadata"] = (objectMetadata ? objectMetadata["provider"] : null);
            state['provider'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        loginUrl: function(val, state) {
            context["field"] = "loginUrl";
            context["metadata"] = (objectMetadata ? objectMetadata["loginUrl"] : null);
            state['loginUrl'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        countryCode: function(val, state) {
            context["field"] = "countryCode";
            context["metadata"] = (objectMetadata ? objectMetadata["countryCode"] : null);
            state['countryCode'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        providerStatus: function(val, state) {
            context["field"] = "providerStatus";
            context["metadata"] = (objectMetadata ? objectMetadata["providerStatus"] : null);
            state['providerStatus'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function Banks(defaultValues) {
        var privateState = {};
        context["field"] = "dbpErrCode";
        context["metadata"] = (objectMetadata ? objectMetadata["dbpErrCode"] : null);
        privateState.dbpErrCode = defaultValues ?
            (defaultValues["dbpErrCode"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["dbpErrCode"], context) :
                null) :
            null;

        context["field"] = "dbpErrMsg";
        context["metadata"] = (objectMetadata ? objectMetadata["dbpErrMsg"] : null);
        privateState.dbpErrMsg = defaultValues ?
            (defaultValues["dbpErrMsg"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["dbpErrMsg"], context) :
                null) :
            null;

        context["field"] = "bankCode";
        context["metadata"] = (objectMetadata ? objectMetadata["bankCode"] : null);
        privateState.bankCode = defaultValues ?
            (defaultValues["bankCode"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["bankCode"], context) :
                null) :
            null;

        context["field"] = "supportedAccountNaturess";
        context["metadata"] = (objectMetadata ? objectMetadata["supportedAccountNaturess"] : null);
        privateState.supportedAccountNaturess = defaultValues ?
            (defaultValues["supportedAccountNaturess"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["supportedAccountNaturess"], context) :
                null) :
            null;

        context["field"] = "internalBankId";
        context["metadata"] = (objectMetadata ? objectMetadata["internalBankId"] : null);
        privateState.internalBankId = defaultValues ?
            (defaultValues["internalBankId"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["internalBankId"], context) :
                null) :
            null;

        context["field"] = "supportedFetchScopess";
        context["metadata"] = (objectMetadata ? objectMetadata["supportedFetchScopess"] : null);
        privateState.supportedFetchScopess = defaultValues ?
            (defaultValues["supportedFetchScopess"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["supportedFetchScopess"], context) :
                null) :
            null;

        context["field"] = "timeZone";
        context["metadata"] = (objectMetadata ? objectMetadata["timeZone"] : null);
        privateState.timeZone = defaultValues ?
            (defaultValues["timeZone"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["timeZone"], context) :
                null) :
            null;

        context["field"] = "bankName";
        context["metadata"] = (objectMetadata ? objectMetadata["bankName"] : null);
        privateState.bankName = defaultValues ?
            (defaultValues["bankName"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["bankName"], context) :
                null) :
            null;

        context["field"] = "isActive";
        context["metadata"] = (objectMetadata ? objectMetadata["isActive"] : null);
        privateState.isActive = defaultValues ?
            (defaultValues["isActive"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["isActive"], context) :
                null) :
            null;

        context["field"] = "supportedAccountTypess";
        context["metadata"] = (objectMetadata ? objectMetadata["supportedAccountTypess"] : null);
        privateState.supportedAccountTypess = defaultValues ?
            (defaultValues["supportedAccountTypess"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["supportedAccountTypess"], context) :
                null) :
            null;

        context["field"] = "logoUrl";
        context["metadata"] = (objectMetadata ? objectMetadata["logoUrl"] : null);
        privateState.logoUrl = defaultValues ?
            (defaultValues["logoUrl"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["logoUrl"], context) :
                null) :
            null;

        context["field"] = "mode";
        context["metadata"] = (objectMetadata ? objectMetadata["mode"] : null);
        privateState.mode = defaultValues ?
            (defaultValues["mode"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["mode"], context) :
                null) :
            null;

        context["field"] = "homeUrl";
        context["metadata"] = (objectMetadata ? objectMetadata["homeUrl"] : null);
        privateState.homeUrl = defaultValues ?
            (defaultValues["homeUrl"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["homeUrl"], context) :
                null) :
            null;

        context["field"] = "provider";
        context["metadata"] = (objectMetadata ? objectMetadata["provider"] : null);
        privateState.provider = defaultValues ?
            (defaultValues["provider"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["provider"], context) :
                null) :
            null;

        context["field"] = "loginUrl";
        context["metadata"] = (objectMetadata ? objectMetadata["loginUrl"] : null);
        privateState.loginUrl = defaultValues ?
            (defaultValues["loginUrl"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["loginUrl"], context) :
                null) :
            null;

        context["field"] = "countryCode";
        context["metadata"] = (objectMetadata ? objectMetadata["countryCode"] : null);
        privateState.countryCode = defaultValues ?
            (defaultValues["countryCode"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["countryCode"], context) :
                null) :
            null;

        context["field"] = "providerStatus";
        context["metadata"] = (objectMetadata ? objectMetadata["providerStatus"] : null);
        privateState.providerStatus = defaultValues ?
            (defaultValues["providerStatus"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["providerStatus"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "dbpErrCode": {
                get: function() {
                    context["field"] = "dbpErrCode";
                    context["metadata"] = (objectMetadata ? objectMetadata["dbpErrCode"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.dbpErrCode, context);
                },
                set: function(val) {
                    setterFunctions['dbpErrCode'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "dbpErrMsg": {
                get: function() {
                    context["field"] = "dbpErrMsg";
                    context["metadata"] = (objectMetadata ? objectMetadata["dbpErrMsg"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.dbpErrMsg, context);
                },
                set: function(val) {
                    setterFunctions['dbpErrMsg'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "bankCode": {
                get: function() {
                    context["field"] = "bankCode";
                    context["metadata"] = (objectMetadata ? objectMetadata["bankCode"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.bankCode, context);
                },
                set: function(val) {
                    setterFunctions['bankCode'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "supportedAccountNaturess": {
                get: function() {
                    context["field"] = "supportedAccountNaturess";
                    context["metadata"] = (objectMetadata ? objectMetadata["supportedAccountNaturess"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.supportedAccountNaturess, context);
                },
                set: function(val) {
                    setterFunctions['supportedAccountNaturess'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "internalBankId": {
                get: function() {
                    context["field"] = "internalBankId";
                    context["metadata"] = (objectMetadata ? objectMetadata["internalBankId"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.internalBankId, context);
                },
                set: function(val) {
                    setterFunctions['internalBankId'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "supportedFetchScopess": {
                get: function() {
                    context["field"] = "supportedFetchScopess";
                    context["metadata"] = (objectMetadata ? objectMetadata["supportedFetchScopess"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.supportedFetchScopess, context);
                },
                set: function(val) {
                    setterFunctions['supportedFetchScopess'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "timeZone": {
                get: function() {
                    context["field"] = "timeZone";
                    context["metadata"] = (objectMetadata ? objectMetadata["timeZone"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.timeZone, context);
                },
                set: function(val) {
                    setterFunctions['timeZone'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "bankName": {
                get: function() {
                    context["field"] = "bankName";
                    context["metadata"] = (objectMetadata ? objectMetadata["bankName"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.bankName, context);
                },
                set: function(val) {
                    setterFunctions['bankName'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "isActive": {
                get: function() {
                    context["field"] = "isActive";
                    context["metadata"] = (objectMetadata ? objectMetadata["isActive"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.isActive, context);
                },
                set: function(val) {
                    setterFunctions['isActive'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "supportedAccountTypess": {
                get: function() {
                    context["field"] = "supportedAccountTypess";
                    context["metadata"] = (objectMetadata ? objectMetadata["supportedAccountTypess"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.supportedAccountTypess, context);
                },
                set: function(val) {
                    setterFunctions['supportedAccountTypess'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "logoUrl": {
                get: function() {
                    context["field"] = "logoUrl";
                    context["metadata"] = (objectMetadata ? objectMetadata["logoUrl"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.logoUrl, context);
                },
                set: function(val) {
                    setterFunctions['logoUrl'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "mode": {
                get: function() {
                    context["field"] = "mode";
                    context["metadata"] = (objectMetadata ? objectMetadata["mode"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.mode, context);
                },
                set: function(val) {
                    setterFunctions['mode'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "homeUrl": {
                get: function() {
                    context["field"] = "homeUrl";
                    context["metadata"] = (objectMetadata ? objectMetadata["homeUrl"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.homeUrl, context);
                },
                set: function(val) {
                    setterFunctions['homeUrl'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "provider": {
                get: function() {
                    context["field"] = "provider";
                    context["metadata"] = (objectMetadata ? objectMetadata["provider"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.provider, context);
                },
                set: function(val) {
                    setterFunctions['provider'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "loginUrl": {
                get: function() {
                    context["field"] = "loginUrl";
                    context["metadata"] = (objectMetadata ? objectMetadata["loginUrl"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.loginUrl, context);
                },
                set: function(val) {
                    setterFunctions['loginUrl'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "countryCode": {
                get: function() {
                    context["field"] = "countryCode";
                    context["metadata"] = (objectMetadata ? objectMetadata["countryCode"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.countryCode, context);
                },
                set: function(val) {
                    setterFunctions['countryCode'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "providerStatus": {
                get: function() {
                    context["field"] = "providerStatus";
                    context["metadata"] = (objectMetadata ? objectMetadata["providerStatus"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.providerStatus, context);
                },
                set: function(val) {
                    setterFunctions['providerStatus'].call(this, val, privateState);
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
            privateState.dbpErrCode = value ? (value["dbpErrCode"] ? value["dbpErrCode"] : null) : null;
            privateState.dbpErrMsg = value ? (value["dbpErrMsg"] ? value["dbpErrMsg"] : null) : null;
            privateState.bankCode = value ? (value["bankCode"] ? value["bankCode"] : null) : null;
            privateState.supportedAccountNaturess = value ? (value["supportedAccountNaturess"] ? value["supportedAccountNaturess"] : null) : null;
            privateState.internalBankId = value ? (value["internalBankId"] ? value["internalBankId"] : null) : null;
            privateState.supportedFetchScopess = value ? (value["supportedFetchScopess"] ? value["supportedFetchScopess"] : null) : null;
            privateState.timeZone = value ? (value["timeZone"] ? value["timeZone"] : null) : null;
            privateState.bankName = value ? (value["bankName"] ? value["bankName"] : null) : null;
            privateState.isActive = value ? (value["isActive"] ? value["isActive"] : null) : null;
            privateState.supportedAccountTypess = value ? (value["supportedAccountTypess"] ? value["supportedAccountTypess"] : null) : null;
            privateState.logoUrl = value ? (value["logoUrl"] ? value["logoUrl"] : null) : null;
            privateState.mode = value ? (value["mode"] ? value["mode"] : null) : null;
            privateState.homeUrl = value ? (value["homeUrl"] ? value["homeUrl"] : null) : null;
            privateState.provider = value ? (value["provider"] ? value["provider"] : null) : null;
            privateState.loginUrl = value ? (value["loginUrl"] ? value["loginUrl"] : null) : null;
            privateState.countryCode = value ? (value["countryCode"] ? value["countryCode"] : null) : null;
            privateState.providerStatus = value ? (value["providerStatus"] ? value["providerStatus"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(Banks);

    //Create new class level validator object
    BaseModel.Validator.call(Banks);

    var registerValidatorBackup = Banks.registerValidator;

    Banks.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(Banks.isValid(this, propName, val)) {
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
    //For Operation 'getBanksForCountryCode' with service id 'getBanks8920'
     Banks.getBanksForCountryCode = function(params, onCompletion){
        return Banks.customVerb('getBanksForCountryCode', params, onCompletion);
     };

    var relations = [];

    Banks.relations = relations;

    Banks.prototype.isValid = function() {
        return Banks.isValid(this);
    };

    Banks.prototype.objModelName = "Banks";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    Banks.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("ExternalAccounts", "Banks", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    Banks.clone = function(objectToClone) {
        var clonedObj = new Banks();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return Banks;
});