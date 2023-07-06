/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
	var mappings = {
		"portfolioId": "portfolioId",
		"initialValue": "initialValue",
		"netDeposit": "netDeposit",
		"benchMarkIndex": "benchMarkIndex",
		"duration": "duration",
		"pl": "pl",
		"feesAndTax": "feesAndTax",
		"timeWeighted": "timeWeighted",
		"moneyWeighted": "moneyWeighted",
		"portfolioReturn": "portfolioReturn",
		"dateTime": "dateTime",
		"referenceCurrency": "referenceCurrency",
		"dateFrom": "dateFrom",
		"dateTo": "dateTo",
		"currentValue": "currentValue",
		"sortBy": "sortBy",
		"sortOrder": "sortOrder",
		"pageSize": "pageSize",
		"pageOffset": "pageOffset",
		"currencyId": "currencyId",
	};

	Object.freeze(mappings);

	var typings = {
		"portfolioId": "string",
		"initialValue": "string",
		"netDeposit": "string",
		"benchMarkIndex": "string",
		"duration": "string",
		"pl": "string",
		"feesAndTax": "string",
		"timeWeighted": "string",
		"moneyWeighted": "string",
		"portfolioReturn": "string",
		"dateTime": "string",
		"referenceCurrency": "string",
		"dateFrom": "string",
		"dateTo": "string",
		"currentValue": "string",
		"sortBy": "string",
		"sortOrder": "string",
		"pageSize": "string",
		"pageOffset": "string",
		"currencyId": "string",
	}

	Object.freeze(typings);

	var primaryKeys = [
					"portfolioId",
	];

	Object.freeze(primaryKeys);

	var config = {
		mappings: mappings,
		typings: typings,
		primaryKeys: primaryKeys,
		serviceName: "PortfolioServicing",
		tableName: "PortfolioPerformance"
	};

	Object.freeze(config);

	return config;
})