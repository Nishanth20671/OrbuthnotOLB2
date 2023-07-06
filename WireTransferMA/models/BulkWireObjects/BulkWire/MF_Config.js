/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
	var mappings = {
		"bulkWireID": "bulkWireID",
		"bulkWireName": "bulkWireName",
		"noOfTransactions": "noOfTransactions",
		"noOfDomesticTransactions": "noOfDomesticTransactions",
		"noOfInternationalTransactions": "noOfInternationalTransactions",
		"createdts": "createdts",
		"lastmodifiedts": "lastmodifiedts",
		"lastExecutedOn": "lastExecutedOn",
		"defaultFromAccount": "defaultFromAccount",
		"defaultCurrency": "defaultCurrency",
		"bulkWireCategory": "bulkWireCategory",
		"firstname": "firstname",
		"lastname": "lastname",
		"BulkWires": "BulkWires",
		"errmsg": "errmsg",
		"dbpErrMsg": "dbpErrMsg",
		"dbpErrCode": "dbpErrCode",
		"bulkWireCategoryFilter": "bulkWireCategoryFilter",
		"bulkWireTemplateID": "bulkWireTemplateID",
		"bulkWireTemplateName": "bulkWireTemplateName",
		"company_id": "company_id",
		"searchString": "searchString",
		"sortByParam": "sortByParam",
		"sortOrder": "sortOrder",
		"groupBy": "groupBy",
		"bulkWireTemplateLineItemID": "bulkWireTemplateLineItemID",
		"swiftCode": "swiftCode",
		"bulkWireTransferType": "bulkWireTransferType",
		"transactionType": "transactionType",
		"internationalRoutingNumber": "internationalRoutingNumber",
		"recipientName": "recipientName",
		"recipientAddressLine1": "recipientAddressLine1",
		"recipientAddressLine2": "recipientAddressLine2",
		"recipientCity": "recipientCity",
		"recipientState": "recipientState",
		"recipientCountryName": "recipientCountryName",
		"recipientZipCode": "recipientZipCode",
		"recipientBankName": "recipientBankName",
		"recipientBankAddress1": "recipientBankAddress1",
		"recipientBankAddress2": "recipientBankAddress2",
		"recipientBankZipCode": "recipientBankZipCode",
		"recipientBankcity": "recipientBankcity",
		"recipientBankstate": "recipientBankstate",
		"accountNickname": "accountNickname",
		"recipientAccountNumber": "recipientAccountNumber",
		"routingNumber": "routingNumber",
		"recipientId": "recipientId",
		"templateRecipientCategory": "templateRecipientCategory",
		"BulkWireTemplateLineItems": "BulkWireTemplateLineItems",
		"Domestic": "Domestic",
		"International": "International",
		"ExtractedFromFile": "ExtractedFromFile",
		"ManuallyAdded": "ManuallyAdded",
		"ExistingRecipient": "ExistingRecipient",
		"payeeId": "payeeId",
	};

	Object.freeze(mappings);

	var typings = {
		"bulkWireID": "string",
		"bulkWireName": "string",
		"noOfTransactions": "number",
		"noOfDomesticTransactions": "number",
		"noOfInternationalTransactions": "number",
		"createdts": "string",
		"lastmodifiedts": "string",
		"lastExecutedOn": "string",
		"defaultFromAccount": "string",
		"defaultCurrency": "string",
		"bulkWireCategory": "string",
		"firstname": "string",
		"lastname": "string",
		"BulkWires": "string",
		"errmsg": "string",
		"dbpErrMsg": "string",
		"dbpErrCode": "string",
		"bulkWireCategoryFilter": "string",
		"bulkWireTemplateID": "string",
		"bulkWireTemplateName": "string",
		"company_id": "string",
		"searchString": "string",
		"sortByParam": "string",
		"sortOrder": "string",
		"groupBy": "string",
		"bulkWireTemplateLineItemID": "string",
		"swiftCode": "string",
		"bulkWireTransferType": "string",
		"transactionType": "string",
		"internationalRoutingNumber": "string",
		"recipientName": "string",
		"recipientAddressLine1": "string",
		"recipientAddressLine2": "string",
		"recipientCity": "string",
		"recipientState": "string",
		"recipientCountryName": "string",
		"recipientZipCode": "string",
		"recipientBankName": "string",
		"recipientBankAddress1": "string",
		"recipientBankAddress2": "string",
		"recipientBankZipCode": "string",
		"recipientBankcity": "string",
		"recipientBankstate": "string",
		"accountNickname": "string",
		"recipientAccountNumber": "string",
		"routingNumber": "string",
		"recipientId": "string",
		"templateRecipientCategory": "string",
		"BulkWireTemplateLineItems": "string",
		"Domestic": "string",
		"International": "string",
		"ExtractedFromFile": "string",
		"ManuallyAdded": "string",
		"ExistingRecipient": "string",
		"payeeId": "string",
	}

	Object.freeze(typings);

	var primaryKeys = [
					"bulkWireID",
	];

	Object.freeze(primaryKeys);

	var config = {
		mappings: mappings,
		typings: typings,
		primaryKeys: primaryKeys,
		serviceName: "BulkWireObjects",
		tableName: "BulkWire"
	};

	Object.freeze(config);

	return config;
})