define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function DigitalArrangementsRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	DigitalArrangementsRepository.prototype = Object.create(BaseRepository.prototype);
	DigitalArrangementsRepository.prototype.constructor = DigitalArrangementsRepository;

	//For Operation 'ValidateAccountClosure' with service id 'ValidateAccountClosure7575'
	DigitalArrangementsRepository.prototype.ValidateAccountClosure = function(params, onCompletion){
		return DigitalArrangementsRepository.prototype.customVerb('ValidateAccountClosure', params, onCompletion);
	};

	//For Operation 'getList' with service id 'getAccountsPostLogin6370'
	DigitalArrangementsRepository.prototype.getList = function(params, onCompletion){
		return DigitalArrangementsRepository.prototype.customVerb('getList', params, onCompletion);
	};

	//For Operation 'SubmitAccountClosureServiceRequestOperation' with service id 'SubmitAccountClosureServiceRequestOperation4360'
	DigitalArrangementsRepository.prototype.SubmitAccountClosureServiceRequestOperation = function(params, onCompletion){
		return DigitalArrangementsRepository.prototype.customVerb('SubmitAccountClosureServiceRequestOperation', params, onCompletion);
	};

	//For Operation 'getInfinityAccounts' with service id 'getInfinityAccounts8952'
	DigitalArrangementsRepository.prototype.getInfinityAccounts = function(params, onCompletion){
		return DigitalArrangementsRepository.prototype.customVerb('getInfinityAccounts', params, onCompletion);
	};

	return DigitalArrangementsRepository;
})