define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function PortfolioPerformanceRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	PortfolioPerformanceRepository.prototype = Object.create(BaseRepository.prototype);
	PortfolioPerformanceRepository.prototype.constructor = PortfolioPerformanceRepository;

	//For Operation 'getPortfolioPerformance' with service id 'getPortfolioPerformance3997'
	PortfolioPerformanceRepository.prototype.getPortfolioPerformance = function(params, onCompletion){
		return PortfolioPerformanceRepository.prototype.customVerb('getPortfolioPerformance', params, onCompletion);
	};

	return PortfolioPerformanceRepository;
})