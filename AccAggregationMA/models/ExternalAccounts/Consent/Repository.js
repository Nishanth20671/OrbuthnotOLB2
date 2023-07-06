define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function ConsentRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	ConsentRepository.prototype = Object.create(BaseRepository.prototype);
	ConsentRepository.prototype.constructor = ConsentRepository;

	//For Operation 'createTermsAndConditions' with service id 'createTermsAndConditions3601'
	ConsentRepository.prototype.createTermsAndConditions = function(params, onCompletion){
		return ConsentRepository.prototype.customVerb('createTermsAndConditions', params, onCompletion);
	};

	//For Operation 'getTermsAndConditions' with service id 'getTermsAndConditions3270'
	ConsentRepository.prototype.getTermsAndConditions = function(params, onCompletion){
		return ConsentRepository.prototype.customVerb('getTermsAndConditions', params, onCompletion);
	};

	return ConsentRepository;
})