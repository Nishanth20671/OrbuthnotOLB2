define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function PortfolioDetailsRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	PortfolioDetailsRepository.prototype = Object.create(BaseRepository.prototype);
	PortfolioDetailsRepository.prototype.constructor = PortfolioDetailsRepository;

	//For Operation 'getPortfolioHoldings' with service id 'getPortfolioHoldings9388'
	PortfolioDetailsRepository.prototype.getPortfolioHoldings = function(params, onCompletion){
		return PortfolioDetailsRepository.prototype.customVerb('getPortfolioHoldings', params, onCompletion);
	};

	//For Operation 'getPortfolioDetails' with service id 'getPortfolioDetails1958'
	PortfolioDetailsRepository.prototype.getPortfolioDetails = function(params, onCompletion){
		return PortfolioDetailsRepository.prototype.customVerb('getPortfolioDetails', params, onCompletion);
	};

	//For Operation 'getCashAccounts' with service id 'getCashAccounts8448'
	PortfolioDetailsRepository.prototype.getCashAccounts = function(params, onCompletion){
		return PortfolioDetailsRepository.prototype.customVerb('getCashAccounts', params, onCompletion);
	};

	return PortfolioDetailsRepository;
})