/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
	var mappings = {
		"portfolioId": "portfolioId",
		"accountId": "accountId",
		"dateFrom": "dateFrom",
		"dateTo": "dateTo",
		"listType": "listType",
		"amount": "amount",
		"balance": "balance",
		"quantity": "quantity",
		"displayName": "displayName",
		"shortName": "shortName",
		"currencyId": "currencyId",
		"searchByInstrumentName": "searchByInstrumentName",
		"sortBy": "sortBy",
		"sortOrder": "sortOrder",
		"pageSize": "pageSize",
		"pageOffset": "pageOffset",
	};

	Object.freeze(mappings);

	var typings = {
		"portfolioId": "string",
		"accountId": "string",
		"dateFrom": "string",
		"dateTo": "string",
		"listType": "string",
		"amount": "string",
		"balance": "string",
		"quantity": "string",
		"displayName": "string",
		"shortName": "string",
		"currencyId": "string",
		"searchByInstrumentName": "string",
		"sortBy": "string",
		"sortOrder": "string",
		"pageSize": "string",
		"pageOffset": "string",
	}

	Object.freeze(typings);

	var primaryKeys = [
					"portfolioId",
					"accountId",
	];

	Object.freeze(primaryKeys);

	var config = {
		mappings: mappings,
		typings: typings,
		primaryKeys: primaryKeys,
		serviceName: "PortfolioServicing",
		tableName: "AccountActivity"
	};

	Object.freeze(config);

	return config;
})