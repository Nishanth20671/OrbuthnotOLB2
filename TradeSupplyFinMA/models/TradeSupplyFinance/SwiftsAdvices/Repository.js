define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function SwiftsAdvicesRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	SwiftsAdvicesRepository.prototype = Object.create(BaseRepository.prototype);
	SwiftsAdvicesRepository.prototype.constructor = SwiftsAdvicesRepository;

	//For Operation 'fetchSwiftsAdvices' with service id 'FetchSwiftsAdvices6337'
	SwiftsAdvicesRepository.prototype.fetchSwiftsAdvices = function(params, onCompletion){
		return SwiftsAdvicesRepository.prototype.customVerb('fetchSwiftsAdvices', params, onCompletion);
	};

	//For Operation 'uploadSwiftsAdvices' with service id 'UploadSwiftsAdvices2803'
	SwiftsAdvicesRepository.prototype.uploadSwiftsAdvices = function(params, onCompletion){
		return SwiftsAdvicesRepository.prototype.customVerb('uploadSwiftsAdvices', params, onCompletion);
	};

	return SwiftsAdvicesRepository;
})