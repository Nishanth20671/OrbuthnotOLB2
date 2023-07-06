define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function ConnectionRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	ConnectionRepository.prototype = Object.create(BaseRepository.prototype);
	ConnectionRepository.prototype.constructor = ConnectionRepository;

	//For Operation 'refreshConnection' with service id 'refreshConnection8007'
	ConnectionRepository.prototype.refreshConnection = function(params, onCompletion){
		return ConnectionRepository.prototype.customVerb('refreshConnection', params, onCompletion);
	};

	//For Operation 'deleteConnection' with service id 'deleteConnection4424'
	ConnectionRepository.prototype.deleteConnection = function(params, onCompletion){
		return ConnectionRepository.prototype.customVerb('deleteConnection', params, onCompletion);
	};

	return ConnectionRepository;
})