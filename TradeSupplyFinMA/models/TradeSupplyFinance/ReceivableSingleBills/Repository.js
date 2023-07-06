define([], function(){
	var BaseRepository = kony.mvc.Data.BaseRepository;

	//Create the Repository Class
	function ReceivableSingleBillsRepository(modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource) {
		BaseRepository.call(this, modelDefinition, config, defaultAppMode, dataSourceFactory, injectedDataSource);
	};

	//Setting BaseRepository as Parent to this Repository
	ReceivableSingleBillsRepository.prototype = Object.create(BaseRepository.prototype);
	ReceivableSingleBillsRepository.prototype.constructor = ReceivableSingleBillsRepository;

	//For Operation 'getBill' with service id 'GetReceivableSingleBillById7070'
	ReceivableSingleBillsRepository.prototype.getBill = function(params, onCompletion){
		return ReceivableSingleBillsRepository.prototype.customVerb('getBill', params, onCompletion);
	};

	//For Operation 'updateBillByBank' with service id 'UpdateReceivableSingleBillByBank1715'
	ReceivableSingleBillsRepository.prototype.updateBillByBank = function(params, onCompletion){
		return ReceivableSingleBillsRepository.prototype.customVerb('updateBillByBank', params, onCompletion);
	};

	//For Operation 'generateBillsList' with service id 'GenerateReceivableSingleBillsList8715'
	ReceivableSingleBillsRepository.prototype.generateBillsList = function(params, onCompletion){
		return ReceivableSingleBillsRepository.prototype.customVerb('generateBillsList', params, onCompletion);
	};

	//For Operation 'getBills' with service id 'GetReceivableSingleBills8752'
	ReceivableSingleBillsRepository.prototype.getBills = function(params, onCompletion){
		return ReceivableSingleBillsRepository.prototype.customVerb('getBills', params, onCompletion);
	};

	//For Operation 'requestBillCancellation' with service id 'RequestReceivableSingleBillCancellation4953'
	ReceivableSingleBillsRepository.prototype.requestBillCancellation = function(params, onCompletion){
		return ReceivableSingleBillsRepository.prototype.customVerb('requestBillCancellation', params, onCompletion);
	};

	//For Operation 'reviseBill' with service id 'ReviseReceivableSingleBill2224'
	ReceivableSingleBillsRepository.prototype.reviseBill = function(params, onCompletion){
		return ReceivableSingleBillsRepository.prototype.customVerb('reviseBill', params, onCompletion);
	};

	//For Operation 'createBill' with service id 'CreateReceivableSingleBill2137'
	ReceivableSingleBillsRepository.prototype.createBill = function(params, onCompletion){
		return ReceivableSingleBillsRepository.prototype.customVerb('createBill', params, onCompletion);
	};

	//For Operation 'deleteBill' with service id 'DeleteReceivableSingleBill9934'
	ReceivableSingleBillsRepository.prototype.deleteBill = function(params, onCompletion){
		return ReceivableSingleBillsRepository.prototype.customVerb('deleteBill', params, onCompletion);
	};

	//For Operation 'generateBillReport' with service id 'GenerateReceivableSingleBillReport5308'
	ReceivableSingleBillsRepository.prototype.generateBillReport = function(params, onCompletion){
		return ReceivableSingleBillsRepository.prototype.customVerb('generateBillReport', params, onCompletion);
	};

	//For Operation 'saveBill' with service id 'SaveReceivableSingleBill5597'
	ReceivableSingleBillsRepository.prototype.saveBill = function(params, onCompletion){
		return ReceivableSingleBillsRepository.prototype.customVerb('saveBill', params, onCompletion);
	};

	//For Operation 'submitImportedBill' with service id 'SubmitCsvImportBill1720'
	ReceivableSingleBillsRepository.prototype.submitImportedBill = function(params, onCompletion){
		return ReceivableSingleBillsRepository.prototype.customVerb('submitImportedBill', params, onCompletion);
	};

	return ReceivableSingleBillsRepository;
})