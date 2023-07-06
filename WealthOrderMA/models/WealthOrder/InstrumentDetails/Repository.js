define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function InstrumentDetailsRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	InstrumentDetailsRepository.prototype = Object.create(BaseRepository.prototype);
	InstrumentDetailsRepository.prototype.constructor = InstrumentDetailsRepository;

	//For Operation 'viewInstrumentTransactions' with service id 'viewInstrumentTransactions5981'
	InstrumentDetailsRepository.prototype.viewInstrumentTransactions = function(params, onCompletion){
		return InstrumentDetailsRepository.prototype.customVerb('viewInstrumentTransactions', params, onCompletion);
	};

	//For Operation 'GetInstrumentDetails' with service id 'getInstrumentDetails4118'
	InstrumentDetailsRepository.prototype.GetInstrumentDetails = function(params, onCompletion){
		return InstrumentDetailsRepository.prototype.customVerb('GetInstrumentDetails', params, onCompletion);
	};

	//For Operation 'getstockNewsDetails' with service id 'getStockNewsWeb6277'
	InstrumentDetailsRepository.prototype.getstockNewsDetails = function(params, onCompletion){
		return InstrumentDetailsRepository.prototype.customVerb('getstockNewsDetails', params, onCompletion);
	};

	//For Operation 'getSearchInstrumentList' with service id 'getSearchInstrumentList9823'
	InstrumentDetailsRepository.prototype.getSearchInstrumentList = function(params, onCompletion){
		return InstrumentDetailsRepository.prototype.customVerb('getSearchInstrumentList', params, onCompletion);
	};

	//For Operation 'getPricingData' with service id 'getPricingData1063'
	InstrumentDetailsRepository.prototype.getPricingData = function(params, onCompletion){
		return InstrumentDetailsRepository.prototype.customVerb('getPricingData', params, onCompletion);
	};

	//For Operation 'getInstrumentMinimal' with service id 'getInstrumentMinimal6469'
	InstrumentDetailsRepository.prototype.getInstrumentMinimal = function(params, onCompletion){
		return InstrumentDetailsRepository.prototype.customVerb('getInstrumentMinimal', params, onCompletion);
	};

	//For Operation 'getStockNews' with service id 'getStockNews9939'
	InstrumentDetailsRepository.prototype.getStockNews = function(params, onCompletion){
		return InstrumentDetailsRepository.prototype.customVerb('getStockNews', params, onCompletion);
	};

	//For Operation 'getStockNewsStory' with service id 'getNewsStory3954'
	InstrumentDetailsRepository.prototype.getStockNewsStory = function(params, onCompletion){
		return InstrumentDetailsRepository.prototype.customVerb('getStockNewsStory', params, onCompletion);
	};

	return InstrumentDetailsRepository;
})