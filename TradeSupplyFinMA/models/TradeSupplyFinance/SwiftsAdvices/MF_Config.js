/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
	var mappings = {
		"orderId": "orderId",
		"swiftMessages": "swiftMessages",
		"paymentAdvices": "paymentAdvices",
		"fileName": "fileName",
		"category": "category",
		"fileId": "fileId",
		"uploadedTimeStamp": "uploadedTimeStamp",
		"product": "product",
	};

	Object.freeze(mappings);

	var typings = {
		"orderId": "string",
		"swiftMessages": "string",
		"paymentAdvices": "string",
		"fileName": "string",
		"category": "string",
		"fileId": "string",
		"uploadedTimeStamp": "string",
		"product": "string",
	}

	Object.freeze(typings);

	var primaryKeys = [
					"fileId",
	];

	Object.freeze(primaryKeys);

	var config = {
		mappings: mappings,
		typings: typings,
		primaryKeys: primaryKeys,
		serviceName: "TradeSupplyFinance",
		tableName: "SwiftsAdvices"
	};

	Object.freeze(config);

	return config;
})