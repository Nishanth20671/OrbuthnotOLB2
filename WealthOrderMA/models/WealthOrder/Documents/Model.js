/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "Documents", "objectService" : "WealthOrder"};

    var setterFunctions = {
        ISINCode: function(val, state) {
            context["field"] = "ISINCode";
            context["metadata"] = (objectMetadata ? objectMetadata["ISINCode"] : null);
            state['ISINCode'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function Documents(defaultValues) {
        var privateState = {};
        context["field"] = "ISINCode";
        context["metadata"] = (objectMetadata ? objectMetadata["ISINCode"] : null);
        privateState.ISINCode = defaultValues ?
            (defaultValues["ISINCode"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["ISINCode"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "ISINCode": {
                get: function() {
                    context["field"] = "ISINCode";
                    context["metadata"] = (objectMetadata ? objectMetadata["ISINCode"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.ISINCode, context);
                },
                set: function(val) {
                    setterFunctions['ISINCode'].call(this, val, privateState);
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
            privateState.ISINCode = value ? (value["ISINCode"] ? value["ISINCode"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(Documents);

    //Create new class level validator object
    BaseModel.Validator.call(Documents);

    var registerValidatorBackup = Documents.registerValidator;

    Documents.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(Documents.isValid(this, propName, val)) {
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
    //For Operation 'getDocuments' with service id 'getDocuments9989'
     Documents.getDocuments = function(params, onCompletion){
        return Documents.customVerb('getDocuments', params, onCompletion);
     };

    var relations = [];

    Documents.relations = relations;

    Documents.prototype.isValid = function() {
        return Documents.isValid(this);
    };

    Documents.prototype.objModelName = "Documents";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    Documents.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("WealthOrder", "Documents", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    Documents.clone = function(objectToClone) {
        var clonedObj = new Documents();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return Documents;
});