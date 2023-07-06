/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
	var mappings = {
		"name": "name",
		"address1": "address1",
		"address2": "address2",
		"city": "city",
		"state": "state",
		"country": "country",
		"zipcode": "zipcode",
		"customerId": "customerId",
		"payeeId": "payeeId",
		"cif": "cif",
	};

	Object.freeze(mappings);

	var typings = {
		"name": "string",
		"address1": "string",
		"address2": "string",
		"city": "string",
		"state": "string",
		"country": "string",
		"zipcode": "string",
		"customerId": "string",
		"payeeId": "string",
		"cif": "string",
	}

	Object.freeze(typings);

	var primaryKeys = [
					"payeeId",
	];

	Object.freeze(primaryKeys);

	var config = {
		mappings: mappings,
		typings: typings,
		primaryKeys: primaryKeys,
		serviceName: "TradeSupplyFinance",
		tableName: "CorporatePayees"
	};

	Object.freeze(config);

	return config;
})