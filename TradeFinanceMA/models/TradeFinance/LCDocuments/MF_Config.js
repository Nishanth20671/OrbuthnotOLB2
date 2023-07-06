/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
	var mappings = {
		"uploadedattachments": "uploadedattachments",
		"successfulUploads": "successfulUploads",
		"failedUploads": "failedUploads",
		"documentReference": "documentReference",
		"fileID": "fileID",
		"fileName": "fileName",
		"fileNames": "fileNames",
		"fileContent": "fileContent",
	};

	Object.freeze(mappings);

	var typings = {
		"uploadedattachments": "string",
		"successfulUploads": "string",
		"failedUploads": "string",
		"documentReference": "string",
		"fileID": "string",
		"fileName": "string",
		"fileNames": "string",
		"fileContent": "string",
	}

	Object.freeze(typings);

	var primaryKeys = [
					"documentReference",
	];

	Object.freeze(primaryKeys);

	var config = {
		mappings: mappings,
		typings: typings,
		primaryKeys: primaryKeys,
		serviceName: "TradeFinance",
		tableName: "LCDocuments"
	};

	Object.freeze(config);

	return config;
})