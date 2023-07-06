define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function InvestmentProposalsRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	InvestmentProposalsRepository.prototype = Object.create(BaseRepository.prototype);
	InvestmentProposalsRepository.prototype.constructor = InvestmentProposalsRepository;

	//For Operation 'getInvestmentProposal' with service id 'getInvestmentProposal3471'
	InvestmentProposalsRepository.prototype.getInvestmentProposal = function(params, onCompletion){
		return InvestmentProposalsRepository.prototype.customVerb('getInvestmentProposal', params, onCompletion);
	};

	//For Operation 'getPastProposal' with service id 'getPastProposal1812'
	InvestmentProposalsRepository.prototype.getPastProposal = function(params, onCompletion){
		return InvestmentProposalsRepository.prototype.customVerb('getPastProposal', params, onCompletion);
	};

	//For Operation 'getRiskAnalysisIP' with service id 'getRiskAnalysisIP4949'
	InvestmentProposalsRepository.prototype.getRiskAnalysisIP = function(params, onCompletion){
		return InvestmentProposalsRepository.prototype.customVerb('getRiskAnalysisIP', params, onCompletion);
	};

	//For Operation 'getOrderProposal' with service id 'getOrderProposal7772'
	InvestmentProposalsRepository.prototype.getOrderProposal = function(params, onCompletion){
		return InvestmentProposalsRepository.prototype.customVerb('getOrderProposal', params, onCompletion);
	};

	//For Operation 'getHealthIfOrderAccepted' with service id 'getHealthIfOrderAccepted6879'
	InvestmentProposalsRepository.prototype.getHealthIfOrderAccepted = function(params, onCompletion){
		return InvestmentProposalsRepository.prototype.customVerb('getHealthIfOrderAccepted', params, onCompletion);
	};

	//For Operation 'getConstraintsIP' with service id 'getConstraintsIP1973'
	InvestmentProposalsRepository.prototype.getConstraintsIP = function(params, onCompletion){
		return InvestmentProposalsRepository.prototype.customVerb('getConstraintsIP', params, onCompletion);
	};

	//For Operation 'getRecommendedInstrIP' with service id 'getRecommendedInstrIP5101'
	InvestmentProposalsRepository.prototype.getRecommendedInstrIP = function(params, onCompletion){
		return InvestmentProposalsRepository.prototype.customVerb('getRecommendedInstrIP', params, onCompletion);
	};

	return InvestmentProposalsRepository;
})