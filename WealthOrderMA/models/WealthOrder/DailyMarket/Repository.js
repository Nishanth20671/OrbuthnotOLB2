define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function DailyMarketRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	DailyMarketRepository.prototype = Object.create(BaseRepository.prototype);
	DailyMarketRepository.prototype.constructor = DailyMarketRepository;

	//For Operation 'getDailyMarket' with service id 'getDailyMarket2367'
	DailyMarketRepository.prototype.getDailyMarket = function(params, onCompletion){
		return DailyMarketRepository.prototype.customVerb('getDailyMarket', params, onCompletion);
	};

	return DailyMarketRepository;
})