define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function MarketNewsRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	MarketNewsRepository.prototype = Object.create(BaseRepository.prototype);
	MarketNewsRepository.prototype.constructor = MarketNewsRepository;

	//For Operation 'getTopMarketNews' with service id 'getTopMarketNews7956'
	MarketNewsRepository.prototype.getTopMarketNews = function(params, onCompletion){
		return MarketNewsRepository.prototype.customVerb('getTopMarketNews', params, onCompletion);
	};

	return MarketNewsRepository;
})