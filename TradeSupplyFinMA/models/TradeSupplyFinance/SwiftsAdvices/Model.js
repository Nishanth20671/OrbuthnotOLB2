/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "SwiftsAdvices", "objectService" : "TradeSupplyFinance"};

    var setterFunctions = {
        orderId: function(val, state) {
            context["field"] = "orderId";
            context["metadata"] = (objectMetadata ? objectMetadata["orderId"] : null);
            state['orderId'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        swiftMessages: function(val, state) {
            context["field"] = "swiftMessages";
            context["metadata"] = (objectMetadata ? objectMetadata["swiftMessages"] : null);
            state['swiftMessages'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        paymentAdvices: function(val, state) {
            context["field"] = "paymentAdvices";
            context["metadata"] = (objectMetadata ? objectMetadata["paymentAdvices"] : null);
            state['paymentAdvices'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        fileName: function(val, state) {
            context["field"] = "fileName";
            context["metadata"] = (objectMetadata ? objectMetadata["fileName"] : null);
            state['fileName'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        category: function(val, state) {
            context["field"] = "category";
            context["metadata"] = (objectMetadata ? objectMetadata["category"] : null);
            state['category'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        fileId: function(val, state) {
            context["field"] = "fileId";
            context["metadata"] = (objectMetadata ? objectMetadata["fileId"] : null);
            state['fileId'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        uploadedTimeStamp: function(val, state) {
            context["field"] = "uploadedTimeStamp";
            context["metadata"] = (objectMetadata ? objectMetadata["uploadedTimeStamp"] : null);
            state['uploadedTimeStamp'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        product: function(val, state) {
            context["field"] = "product";
            context["metadata"] = (objectMetadata ? objectMetadata["product"] : null);
            state['product'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function SwiftsAdvices(defaultValues) {
        var privateState = {};
        context["field"] = "orderId";
        context["metadata"] = (objectMetadata ? objectMetadata["orderId"] : null);
        privateState.orderId = defaultValues ?
            (defaultValues["orderId"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["orderId"], context) :
                null) :
            null;

        context["field"] = "swiftMessages";
        context["metadata"] = (objectMetadata ? objectMetadata["swiftMessages"] : null);
        privateState.swiftMessages = defaultValues ?
            (defaultValues["swiftMessages"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["swiftMessages"], context) :
                null) :
            null;

        context["field"] = "paymentAdvices";
        context["metadata"] = (objectMetadata ? objectMetadata["paymentAdvices"] : null);
        privateState.paymentAdvices = defaultValues ?
            (defaultValues["paymentAdvices"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["paymentAdvices"], context) :
                null) :
            null;

        context["field"] = "fileName";
        context["metadata"] = (objectMetadata ? objectMetadata["fileName"] : null);
        privateState.fileName = defaultValues ?
            (defaultValues["fileName"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["fileName"], context) :
                null) :
            null;

        context["field"] = "category";
        context["metadata"] = (objectMetadata ? objectMetadata["category"] : null);
        privateState.category = defaultValues ?
            (defaultValues["category"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["category"], context) :
                null) :
            null;

        context["field"] = "fileId";
        context["metadata"] = (objectMetadata ? objectMetadata["fileId"] : null);
        privateState.fileId = defaultValues ?
            (defaultValues["fileId"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["fileId"], context) :
                null) :
            null;

        context["field"] = "uploadedTimeStamp";
        context["metadata"] = (objectMetadata ? objectMetadata["uploadedTimeStamp"] : null);
        privateState.uploadedTimeStamp = defaultValues ?
            (defaultValues["uploadedTimeStamp"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["uploadedTimeStamp"], context) :
                null) :
            null;

        context["field"] = "product";
        context["metadata"] = (objectMetadata ? objectMetadata["product"] : null);
        privateState.product = defaultValues ?
            (defaultValues["product"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["product"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "orderId": {
                get: function() {
                    context["field"] = "orderId";
                    context["metadata"] = (objectMetadata ? objectMetadata["orderId"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.orderId, context);
                },
                set: function(val) {
                    setterFunctions['orderId'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "swiftMessages": {
                get: function() {
                    context["field"] = "swiftMessages";
                    context["metadata"] = (objectMetadata ? objectMetadata["swiftMessages"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.swiftMessages, context);
                },
                set: function(val) {
                    setterFunctions['swiftMessages'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "paymentAdvices": {
                get: function() {
                    context["field"] = "paymentAdvices";
                    context["metadata"] = (objectMetadata ? objectMetadata["paymentAdvices"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.paymentAdvices, context);
                },
                set: function(val) {
                    setterFunctions['paymentAdvices'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "fileName": {
                get: function() {
                    context["field"] = "fileName";
                    context["metadata"] = (objectMetadata ? objectMetadata["fileName"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.fileName, context);
                },
                set: function(val) {
                    setterFunctions['fileName'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "category": {
                get: function() {
                    context["field"] = "category";
                    context["metadata"] = (objectMetadata ? objectMetadata["category"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.category, context);
                },
                set: function(val) {
                    setterFunctions['category'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "fileId": {
                get: function() {
                    context["field"] = "fileId";
                    context["metadata"] = (objectMetadata ? objectMetadata["fileId"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.fileId, context);
                },
                set: function(val) {
                    setterFunctions['fileId'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "uploadedTimeStamp": {
                get: function() {
                    context["field"] = "uploadedTimeStamp";
                    context["metadata"] = (objectMetadata ? objectMetadata["uploadedTimeStamp"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.uploadedTimeStamp, context);
                },
                set: function(val) {
                    setterFunctions['uploadedTimeStamp'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "product": {
                get: function() {
                    context["field"] = "product";
                    context["metadata"] = (objectMetadata ? objectMetadata["product"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.product, context);
                },
                set: function(val) {
                    setterFunctions['product'].call(this, val, privateState);
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
            privateState.orderId = value ? (value["orderId"] ? value["orderId"] : null) : null;
            privateState.swiftMessages = value ? (value["swiftMessages"] ? value["swiftMessages"] : null) : null;
            privateState.paymentAdvices = value ? (value["paymentAdvices"] ? value["paymentAdvices"] : null) : null;
            privateState.fileName = value ? (value["fileName"] ? value["fileName"] : null) : null;
            privateState.category = value ? (value["category"] ? value["category"] : null) : null;
            privateState.fileId = value ? (value["fileId"] ? value["fileId"] : null) : null;
            privateState.uploadedTimeStamp = value ? (value["uploadedTimeStamp"] ? value["uploadedTimeStamp"] : null) : null;
            privateState.product = value ? (value["product"] ? value["product"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(SwiftsAdvices);

    //Create new class level validator object
    BaseModel.Validator.call(SwiftsAdvices);

    var registerValidatorBackup = SwiftsAdvices.registerValidator;

    SwiftsAdvices.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(SwiftsAdvices.isValid(this, propName, val)) {
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
    //For Operation 'fetchSwiftsAdvices' with service id 'FetchSwiftsAdvices6337'
     SwiftsAdvices.fetchSwiftsAdvices = function(params, onCompletion){
        return SwiftsAdvices.customVerb('fetchSwiftsAdvices', params, onCompletion);
     };

    //For Operation 'uploadSwiftsAdvices' with service id 'UploadSwiftsAdvices2803'
     SwiftsAdvices.uploadSwiftsAdvices = function(params, onCompletion){
        return SwiftsAdvices.customVerb('uploadSwiftsAdvices', params, onCompletion);
     };

    var relations = [];

    SwiftsAdvices.relations = relations;

    SwiftsAdvices.prototype.isValid = function() {
        return SwiftsAdvices.isValid(this);
    };

    SwiftsAdvices.prototype.objModelName = "SwiftsAdvices";
    SwiftsAdvices.prototype.objServiceName = "TradeSupplyFinance";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    SwiftsAdvices.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("TradeSupplyFinance", "SwiftsAdvices", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    SwiftsAdvices.clone = function(objectToClone) {
        var clonedObj = new SwiftsAdvices();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return SwiftsAdvices;
});