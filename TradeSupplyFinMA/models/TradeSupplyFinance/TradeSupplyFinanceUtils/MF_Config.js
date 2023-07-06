/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
	var mappings = {
		"records": "records",
		"LanguageCode": "LanguageCode",
		"Code": "Code",
		"softdeleteflag": "softdeleteflag",
		"Name": "Name",
		"lastmodifiedts": "lastmodifiedts",
		"synctimestamp": "synctimestamp",
		"createdts": "createdts",
		"id": "id",
		"dbpErrCode": "dbpErrCode",
		"dbpErrMsg": "dbpErrMsg",
	};

	Object.freeze(mappings);

	var typings = {
		"records": "string",
		"LanguageCode": "string",
		"Code": "string",
		"softdeleteflag": "string",
		"Name": "string",
		"lastmodifiedts": "string",
		"synctimestamp": "string",
		"createdts": "string",
		"id": "string",
		"dbpErrCode": "string",
		"dbpErrMsg": "string",
	}

	Object.freeze(typings);

	var primaryKeys = [
					"id",
	];

	Object.freeze(primaryKeys);

	var config = {
		mappings: mappings,
		typings: typings,
		primaryKeys: primaryKeys,
		serviceName: "TradeSupplyFinance",
		tableName: "TradeSupplyFinanceUtils"
	};

	Object.freeze(config);

	return config;
})