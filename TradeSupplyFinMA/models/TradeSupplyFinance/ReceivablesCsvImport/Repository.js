define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function ReceivablesCsvImportRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	ReceivablesCsvImportRepository.prototype = Object.create(BaseRepository.prototype);
	ReceivablesCsvImportRepository.prototype.constructor = ReceivablesCsvImportRepository;

	//For Operation 'submitCsvImport' with service id 'SubmitCsvImportedBills2798'
	ReceivablesCsvImportRepository.prototype.submitCsvImport = function(params, onCompletion){
		return ReceivablesCsvImportRepository.prototype.customVerb('submitCsvImport', params, onCompletion);
	};

	//For Operation 'createBills' with service id 'CreateBillsCsvImport6762'
	ReceivablesCsvImportRepository.prototype.createBills = function(params, onCompletion){
		return ReceivablesCsvImportRepository.prototype.customVerb('createBills', params, onCompletion);
	};

	//For Operation 'deleteImportedBills' with service id 'DeleteCsvImportedBills9618'
	ReceivablesCsvImportRepository.prototype.deleteImportedBills = function(params, onCompletion){
		return ReceivablesCsvImportRepository.prototype.customVerb('deleteImportedBills', params, onCompletion);
	};

	//For Operation 'getCsvImports' with service id 'GetCsvImports9336'
	ReceivablesCsvImportRepository.prototype.getCsvImports = function(params, onCompletion){
		return ReceivablesCsvImportRepository.prototype.customVerb('getCsvImports', params, onCompletion);
	};

	//For Operation 'getCsvImportById' with service id 'GetCsvImportById2125'
	ReceivablesCsvImportRepository.prototype.getCsvImportById = function(params, onCompletion){
		return ReceivablesCsvImportRepository.prototype.customVerb('getCsvImportById', params, onCompletion);
	};

	return ReceivablesCsvImportRepository;
})