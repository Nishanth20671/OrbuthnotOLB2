define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function StrategiesRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	StrategiesRepository.prototype = Object.create(BaseRepository.prototype);
	StrategiesRepository.prototype.constructor = StrategiesRepository;

	//For Operation 'getStrategyAllocation' with service id 'getStrategyAllocation1027'
	StrategiesRepository.prototype.getStrategyAllocation = function(params, onCompletion){
		return StrategiesRepository.prototype.customVerb('getStrategyAllocation', params, onCompletion);
	};

	//For Operation 'getSuitabilityProfile' with service id 'getSuitabilityProfile7381'
	StrategiesRepository.prototype.getSuitabilityProfile = function(params, onCompletion){
		return StrategiesRepository.prototype.customVerb('getSuitabilityProfile', params, onCompletion);
	};

	//For Operation 'getRecommendedStrategy' with service id 'getRecommendedStrategy9559'
	StrategiesRepository.prototype.getRecommendedStrategy = function(params, onCompletion){
		return StrategiesRepository.prototype.customVerb('getRecommendedStrategy', params, onCompletion);
	};

	//For Operation 'getMyStrategy' with service id 'getMyStrategy4815'
	StrategiesRepository.prototype.getMyStrategy = function(params, onCompletion){
		return StrategiesRepository.prototype.customVerb('getMyStrategy', params, onCompletion);
	};

	return StrategiesRepository;
})