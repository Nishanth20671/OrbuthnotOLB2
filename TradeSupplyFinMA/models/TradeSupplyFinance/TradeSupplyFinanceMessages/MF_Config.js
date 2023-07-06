/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
	var mappings = {
		"createdby": "createdby",
		"accountid": "accountid",
		"customer_id": "customer_id",
		"filename": "filename",
		"harddelete": "harddelete",
		"markallasread": "markallasread",
		"media_id": "media_id",
		"messagedescription": "messagedescription",
		"modifiedby": "modifiedby",
		"priority": "priority",
		"requestcategory_id": "requestcategory_id",
		"requestid": "requestid",
		"requestsubject": "requestsubject",
		"softdelete": "softdelete",
		"softDeleteFlag": "softDeleteFlag",
		"Status": "Status",
		"username": "username",
		"request_id": "request_id",
		"requeststatus": "requeststatus",
	};

	Object.freeze(mappings);

	var typings = {
		"createdby": "string",
		"accountid": "string",
		"customer_id": "string",
		"filename": "string",
		"harddelete": "string",
		"markallasread": "string",
		"media_id": "string",
		"messagedescription": "string",
		"modifiedby": "string",
		"priority": "string",
		"requestcategory_id": "string",
		"requestid": "string",
		"requestsubject": "string",
		"softdelete": "string",
		"softDeleteFlag": "string",
		"Status": "string",
		"username": "string",
		"request_id": "string",
		"requeststatus": "string",
	}

	Object.freeze(typings);

	var primaryKeys = [
					"customer_id",
	];

	Object.freeze(primaryKeys);

	var config = {
		mappings: mappings,
		typings: typings,
		primaryKeys: primaryKeys,
		serviceName: "TradeSupplyFinance",
		tableName: "TradeSupplyFinanceMessages"
	};

	Object.freeze(config);

	return config;
})