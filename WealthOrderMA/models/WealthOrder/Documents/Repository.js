define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function DocumentsRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	DocumentsRepository.prototype = Object.create(BaseRepository.prototype);
	DocumentsRepository.prototype.constructor = DocumentsRepository;

	//For Operation 'getDocuments' with service id 'getDocuments9989'
	DocumentsRepository.prototype.getDocuments = function(params, onCompletion){
		return DocumentsRepository.prototype.customVerb('getDocuments', params, onCompletion);
	};

	return DocumentsRepository;
})