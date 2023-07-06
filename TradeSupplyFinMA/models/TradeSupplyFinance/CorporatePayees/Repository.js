define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function CorporatePayeesRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	CorporatePayeesRepository.prototype = Object.create(BaseRepository.prototype);
	CorporatePayeesRepository.prototype.constructor = CorporatePayeesRepository;

	//For Operation 'getCorporatePayees' with service id 'GetCorporatePayees1579'
	CorporatePayeesRepository.prototype.getCorporatePayees = function(params, onCompletion){
		return CorporatePayeesRepository.prototype.customVerb('getCorporatePayees', params, onCompletion);
	};

	return CorporatePayeesRepository;
})