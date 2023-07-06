/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
	var mappings = {
		"dbpErrCode": "dbpErrCode",
		"dbpErrMsg": "dbpErrMsg",
		"bankCode": "bankCode",
		"supportedAccountNaturess": "supportedAccountNaturess",
		"internalBankId": "internalBankId",
		"supportedFetchScopess": "supportedFetchScopess",
		"timeZone": "timeZone",
		"bankName": "bankName",
		"isActive": "isActive",
		"supportedAccountTypess": "supportedAccountTypess",
		"logoUrl": "logoUrl",
		"mode": "mode",
		"homeUrl": "homeUrl",
		"provider": "provider",
		"loginUrl": "loginUrl",
		"countryCode": "countryCode",
		"providerStatus": "providerStatus",
	};

	Object.freeze(mappings);

	var typings = {
		"dbpErrCode": "string",
		"dbpErrMsg": "string",
		"bankCode": "string",
		"supportedAccountNaturess": "string",
		"internalBankId": "string",
		"supportedFetchScopess": "string",
		"timeZone": "string",
		"bankName": "string",
		"isActive": "string",
		"supportedAccountTypess": "string",
		"logoUrl": "string",
		"mode": "string",
		"homeUrl": "string",
		"provider": "string",
		"loginUrl": "string",
		"countryCode": "string",
		"providerStatus": "string",
	}

	Object.freeze(typings);

	var primaryKeys = [
					"bankCode",
	];

	Object.freeze(primaryKeys);

	var config = {
		mappings: mappings,
		typings: typings,
		primaryKeys: primaryKeys,
		serviceName: "ExternalAccounts",
		tableName: "Banks"
	};

	Object.freeze(config);

	return config;
})