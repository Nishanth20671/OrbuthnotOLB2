/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
	var mappings = {
		"currencyPairs": "currencyPairs",
		"marketRate": "marketRate",
		"id": "id",
		"dateOrPeriod": "dateOrPeriod",
		"RICCode": "RICCode",
		"instrumentId": "instrumentId",
		"buyCurrency": "buyCurrency",
		"sellCurrency": "sellCurrency",
		"buyAmount": "buyAmount",
		"sellAmount": "sellAmount",
	};

	Object.freeze(mappings);

	var typings = {
		"currencyPairs": "string",
		"marketRate": "string",
		"id": "string",
		"dateOrPeriod": "string",
		"RICCode": "string",
		"instrumentId": "string",
		"buyCurrency": "string",
		"sellCurrency": "string",
		"buyAmount": "string",
		"sellAmount": "string",
	}

	Object.freeze(typings);

	var primaryKeys = [
					"currencyPairs",
	];

	Object.freeze(primaryKeys);

	var config = {
		mappings: mappings,
		typings: typings,
		primaryKeys: primaryKeys,
		serviceName: "WealthOrder",
		tableName: "CurrencyDetails"
	};

	Object.freeze(config);

	return config;
})