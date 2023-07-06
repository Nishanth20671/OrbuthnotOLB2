define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function DownloadPDFRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	DownloadPDFRepository.prototype = Object.create(BaseRepository.prototype);
	DownloadPDFRepository.prototype.constructor = DownloadPDFRepository;

	//For Operation 'generatePDF' with service id 'generatePDF1504'
	DownloadPDFRepository.prototype.generatePDF = function(params, onCompletion){
		return DownloadPDFRepository.prototype.customVerb('generatePDF', params, onCompletion);
	};

	return DownloadPDFRepository;
})