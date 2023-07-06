/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "Consent", "objectService" : "ExternalAccounts"};

    var setterFunctions = {
    };

    //Create the Model Class
    function Consent(defaultValues) {
        var privateState = {};

        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
        });

        //converts model object to json object.
        this.toJsonInternal = function() {
            return Object.assign({}, privateState);
        };

        //overwrites object state with provided json value in argument.
        this.fromJsonInternal = function(value) {
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(Consent);

    //Create new class level validator object
    BaseModel.Validator.call(Consent);

    var registerValidatorBackup = Consent.registerValidator;

    Consent.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(Consent.isValid(this, propName, val)) {
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
    //For Operation 'createTermsAndConditions' with service id 'createTermsAndConditions3601'
     Consent.createTermsAndConditions = function(params, onCompletion){
        return Consent.customVerb('createTermsAndConditions', params, onCompletion);
     };

    //For Operation 'getTermsAndConditions' with service id 'getTermsAndConditions3270'
     Consent.getTermsAndConditions = function(params, onCompletion){
        return Consent.customVerb('getTermsAndConditions', params, onCompletion);
     };

    var relations = [];

    Consent.relations = relations;

    Consent.prototype.isValid = function() {
        return Consent.isValid(this);
    };

    Consent.prototype.objModelName = "Consent";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    Consent.registerProcessors = function(options, successCallback, failureCallback) {

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

        kony.mvc.util.ProcessorUtils.getMetadataForObject("ExternalAccounts", "Consent", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    Consent.clone = function(objectToClone) {
        var clonedObj = new Consent();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return Consent;
});