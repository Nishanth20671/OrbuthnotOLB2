define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function TradeSupplyFinanceUtilsRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	TradeSupplyFinanceUtilsRepository.prototype = Object.create(BaseRepository.prototype);
	TradeSupplyFinanceUtilsRepository.prototype.constructor = TradeSupplyFinanceUtilsRepository;

	//For Operation 'getAllCountries' with service id 'GetAllCountries2898'
	TradeSupplyFinanceUtilsRepository.prototype.getAllCountries = function(params, onCompletion){
		return TradeSupplyFinanceUtilsRepository.prototype.customVerb('getAllCountries', params, onCompletion);
	};

	return TradeSupplyFinanceUtilsRepository;
})