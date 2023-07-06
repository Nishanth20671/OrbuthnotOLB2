define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function TradeSupplyFinanceMessagesRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	TradeSupplyFinanceMessagesRepository.prototype = Object.create(BaseRepository.prototype);
	TradeSupplyFinanceMessagesRepository.prototype.constructor = TradeSupplyFinanceMessagesRepository;

	//For Operation 'createRequest' with service id 'CreateRequest9893'
	TradeSupplyFinanceMessagesRepository.prototype.createRequest = function(params, onCompletion){
		return TradeSupplyFinanceMessagesRepository.prototype.customVerb('createRequest', params, onCompletion);
	};

	return TradeSupplyFinanceMessagesRepository;
})