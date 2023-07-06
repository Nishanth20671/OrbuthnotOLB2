define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function CurrencyDetailsRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	CurrencyDetailsRepository.prototype = Object.create(BaseRepository.prototype);
	CurrencyDetailsRepository.prototype.constructor = CurrencyDetailsRepository;

	//For Operation 'GetMarketRates' with service id 'getMarketRates2969'
	CurrencyDetailsRepository.prototype.GetMarketRates = function(params, onCompletion){
		return CurrencyDetailsRepository.prototype.customVerb('GetMarketRates', params, onCompletion);
	};

	//For Operation 'createOrder' with service id 'createOrder7797'
	CurrencyDetailsRepository.prototype.createOrder = function(params, onCompletion){
		return CurrencyDetailsRepository.prototype.customVerb('createOrder', params, onCompletion);
	};

	//For Operation 'getHistoricalData' with service id 'getHistoricalData2847'
	CurrencyDetailsRepository.prototype.getHistoricalData = function(params, onCompletion){
		return CurrencyDetailsRepository.prototype.customVerb('getHistoricalData', params, onCompletion);
	};

	//For Operation 'getAddCurrency' with service id 'getAddCurrency4047'
	CurrencyDetailsRepository.prototype.getAddCurrency = function(params, onCompletion){
		return CurrencyDetailsRepository.prototype.customVerb('getAddCurrency', params, onCompletion);
	};

	return CurrencyDetailsRepository;
})