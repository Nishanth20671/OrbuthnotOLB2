define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function BanksRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	BanksRepository.prototype = Object.create(BaseRepository.prototype);
	BanksRepository.prototype.constructor = BanksRepository;

	//For Operation 'getBanksForCountryCode' with service id 'getBanks8920'
	BanksRepository.prototype.getBanksForCountryCode = function(params, onCompletion){
		return BanksRepository.prototype.customVerb('getBanksForCountryCode', params, onCompletion);
	};

	return BanksRepository;
})