/*
    This is an auto generated file and any modifications to it may result in corrupted data.
*/
define([], function() {
    var BaseModel = kony.mvc.Data.BaseModel;
    var preProcessorCallback;
    var postProcessorCallback;
    var objectMetadata;
    var context = {"object" : "ReceivableSingleBills", "objectService" : "TradeSupplyFinance"};

    var setterFunctions = {
        billReference: function(val, state) {
            context["field"] = "billReference";
            context["metadata"] = (objectMetadata ? objectMetadata["billReference"] : null);
            state['billReference'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        amount: function(val, state) {
            context["field"] = "amount";
            context["metadata"] = (objectMetadata ? objectMetadata["amount"] : null);
            state['amount'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        billDate: function(val, state) {
            context["field"] = "billDate";
            context["metadata"] = (objectMetadata ? objectMetadata["billDate"] : null);
            state['billDate'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        billName: function(val, state) {
            context["field"] = "billName";
            context["metadata"] = (objectMetadata ? objectMetadata["billName"] : null);
            state['billName'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        billNumber: function(val, state) {
            context["field"] = "billNumber";
            context["metadata"] = (objectMetadata ? objectMetadata["billNumber"] : null);
            state['billNumber'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        billType: function(val, state) {
            context["field"] = "billType";
            context["metadata"] = (objectMetadata ? objectMetadata["billType"] : null);
            state['billType'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        buyerAddress: function(val, state) {
            context["field"] = "buyerAddress";
            context["metadata"] = (objectMetadata ? objectMetadata["buyerAddress"] : null);
            state['buyerAddress'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        buyerName: function(val, state) {
            context["field"] = "buyerName";
            context["metadata"] = (objectMetadata ? objectMetadata["buyerName"] : null);
            state['buyerName'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        cancellationDocuments: function(val, state) {
            context["field"] = "cancellationDocuments";
            context["metadata"] = (objectMetadata ? objectMetadata["cancellationDocuments"] : null);
            state['cancellationDocuments'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        cancellationStatus: function(val, state) {
            context["field"] = "cancellationStatus";
            context["metadata"] = (objectMetadata ? objectMetadata["cancellationStatus"] : null);
            state['cancellationStatus'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        countryOfDestination: function(val, state) {
            context["field"] = "countryOfDestination";
            context["metadata"] = (objectMetadata ? objectMetadata["countryOfDestination"] : null);
            state['countryOfDestination'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        countryOfOrigin: function(val, state) {
            context["field"] = "countryOfOrigin";
            context["metadata"] = (objectMetadata ? objectMetadata["countryOfOrigin"] : null);
            state['countryOfOrigin'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        createdOn: function(val, state) {
            context["field"] = "createdOn";
            context["metadata"] = (objectMetadata ? objectMetadata["createdOn"] : null);
            state['createdOn'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        currency: function(val, state) {
            context["field"] = "currency";
            context["metadata"] = (objectMetadata ? objectMetadata["currency"] : null);
            state['currency'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        documentNo: function(val, state) {
            context["field"] = "documentNo";
            context["metadata"] = (objectMetadata ? objectMetadata["documentNo"] : null);
            state['documentNo'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        dueDate: function(val, state) {
            context["field"] = "dueDate";
            context["metadata"] = (objectMetadata ? objectMetadata["dueDate"] : null);
            state['dueDate'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        finalDestination: function(val, state) {
            context["field"] = "finalDestination";
            context["metadata"] = (objectMetadata ? objectMetadata["finalDestination"] : null);
            state['finalDestination'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        goodsDescription: function(val, state) {
            context["field"] = "goodsDescription";
            context["metadata"] = (objectMetadata ? objectMetadata["goodsDescription"] : null);
            state['goodsDescription'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        messageFromBank: function(val, state) {
            context["field"] = "messageFromBank";
            context["metadata"] = (objectMetadata ? objectMetadata["messageFromBank"] : null);
            state['messageFromBank'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        messageToBank: function(val, state) {
            context["field"] = "messageToBank";
            context["metadata"] = (objectMetadata ? objectMetadata["messageToBank"] : null);
            state['messageToBank'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        modeOfShipment: function(val, state) {
            context["field"] = "modeOfShipment";
            context["metadata"] = (objectMetadata ? objectMetadata["modeOfShipment"] : null);
            state['modeOfShipment'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        paymentTerms: function(val, state) {
            context["field"] = "paymentTerms";
            context["metadata"] = (objectMetadata ? objectMetadata["paymentTerms"] : null);
            state['paymentTerms'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        physicalDocuments: function(val, state) {
            context["field"] = "physicalDocuments";
            context["metadata"] = (objectMetadata ? objectMetadata["physicalDocuments"] : null);
            state['physicalDocuments'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        portOfLoading: function(val, state) {
            context["field"] = "portOfLoading";
            context["metadata"] = (objectMetadata ? objectMetadata["portOfLoading"] : null);
            state['portOfLoading'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        portOfDischarge: function(val, state) {
            context["field"] = "portOfDischarge";
            context["metadata"] = (objectMetadata ? objectMetadata["portOfDischarge"] : null);
            state['portOfDischarge'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        reasonForCancellation: function(val, state) {
            context["field"] = "reasonForCancellation";
            context["metadata"] = (objectMetadata ? objectMetadata["reasonForCancellation"] : null);
            state['reasonForCancellation'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        reasonForRejection: function(val, state) {
            context["field"] = "reasonForRejection";
            context["metadata"] = (objectMetadata ? objectMetadata["reasonForRejection"] : null);
            state['reasonForRejection'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        reasonForReturn: function(val, state) {
            context["field"] = "reasonForReturn";
            context["metadata"] = (objectMetadata ? objectMetadata["reasonForReturn"] : null);
            state['reasonForReturn'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        receivableAccount: function(val, state) {
            context["field"] = "receivableAccount";
            context["metadata"] = (objectMetadata ? objectMetadata["receivableAccount"] : null);
            state['receivableAccount'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        requestFinance: function(val, state) {
            context["field"] = "requestFinance";
            context["metadata"] = (objectMetadata ? objectMetadata["requestFinance"] : null);
            state['requestFinance'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        returnedHistory: function(val, state) {
            context["field"] = "returnedHistory";
            context["metadata"] = (objectMetadata ? objectMetadata["returnedHistory"] : null);
            state['returnedHistory'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        shipmentDate: function(val, state) {
            context["field"] = "shipmentDate";
            context["metadata"] = (objectMetadata ? objectMetadata["shipmentDate"] : null);
            state['shipmentDate'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        shipmentTrackingDetails: function(val, state) {
            context["field"] = "shipmentTrackingDetails";
            context["metadata"] = (objectMetadata ? objectMetadata["shipmentTrackingDetails"] : null);
            state['shipmentTrackingDetails'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        status: function(val, state) {
            context["field"] = "status";
            context["metadata"] = (objectMetadata ? objectMetadata["status"] : null);
            state['status'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        updatedOn: function(val, state) {
            context["field"] = "updatedOn";
            context["metadata"] = (objectMetadata ? objectMetadata["updatedOn"] : null);
            state['updatedOn'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        uploadedDocuments: function(val, state) {
            context["field"] = "uploadedDocuments";
            context["metadata"] = (objectMetadata ? objectMetadata["uploadedDocuments"] : null);
            state['uploadedDocuments'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        searchString: function(val, state) {
            context["field"] = "searchString";
            context["metadata"] = (objectMetadata ? objectMetadata["searchString"] : null);
            state['searchString'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        pageSize: function(val, state) {
            context["field"] = "pageSize";
            context["metadata"] = (objectMetadata ? objectMetadata["pageSize"] : null);
            state['pageSize'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        pageOffset: function(val, state) {
            context["field"] = "pageOffset";
            context["metadata"] = (objectMetadata ? objectMetadata["pageOffset"] : null);
            state['pageOffset'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        sortByParam: function(val, state) {
            context["field"] = "sortByParam";
            context["metadata"] = (objectMetadata ? objectMetadata["sortByParam"] : null);
            state['sortByParam'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        sortOrder: function(val, state) {
            context["field"] = "sortOrder";
            context["metadata"] = (objectMetadata ? objectMetadata["sortOrder"] : null);
            state['sortOrder'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        timeParam: function(val, state) {
            context["field"] = "timeParam";
            context["metadata"] = (objectMetadata ? objectMetadata["timeParam"] : null);
            state['timeParam'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        timeValue: function(val, state) {
            context["field"] = "timeValue";
            context["metadata"] = (objectMetadata ? objectMetadata["timeValue"] : null);
            state['timeValue'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        filterByValue: function(val, state) {
            context["field"] = "filterByValue";
            context["metadata"] = (objectMetadata ? objectMetadata["filterByValue"] : null);
            state['filterByValue'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        filterByParam: function(val, state) {
            context["field"] = "filterByParam";
            context["metadata"] = (objectMetadata ? objectMetadata["filterByParam"] : null);
            state['filterByParam'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        origin: function(val, state) {
            context["field"] = "origin";
            context["metadata"] = (objectMetadata ? objectMetadata["origin"] : null);
            state['origin'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        fileReference: function(val, state) {
            context["field"] = "fileReference";
            context["metadata"] = (objectMetadata ? objectMetadata["fileReference"] : null);
            state['fileReference'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        buyerSelection: function(val, state) {
            context["field"] = "buyerSelection";
            context["metadata"] = (objectMetadata ? objectMetadata["buyerSelection"] : null);
            state['buyerSelection'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
        buyerId: function(val, state) {
            context["field"] = "buyerId";
            context["metadata"] = (objectMetadata ? objectMetadata["buyerId"] : null);
            state['buyerId'] = kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, val, context);
        },
    };

    //Create the Model Class
    function ReceivableSingleBills(defaultValues) {
        var privateState = {};
        context["field"] = "billReference";
        context["metadata"] = (objectMetadata ? objectMetadata["billReference"] : null);
        privateState.billReference = defaultValues ?
            (defaultValues["billReference"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["billReference"], context) :
                null) :
            null;

        context["field"] = "amount";
        context["metadata"] = (objectMetadata ? objectMetadata["amount"] : null);
        privateState.amount = defaultValues ?
            (defaultValues["amount"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["amount"], context) :
                null) :
            null;

        context["field"] = "billDate";
        context["metadata"] = (objectMetadata ? objectMetadata["billDate"] : null);
        privateState.billDate = defaultValues ?
            (defaultValues["billDate"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["billDate"], context) :
                null) :
            null;

        context["field"] = "billName";
        context["metadata"] = (objectMetadata ? objectMetadata["billName"] : null);
        privateState.billName = defaultValues ?
            (defaultValues["billName"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["billName"], context) :
                null) :
            null;

        context["field"] = "billNumber";
        context["metadata"] = (objectMetadata ? objectMetadata["billNumber"] : null);
        privateState.billNumber = defaultValues ?
            (defaultValues["billNumber"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["billNumber"], context) :
                null) :
            null;

        context["field"] = "billType";
        context["metadata"] = (objectMetadata ? objectMetadata["billType"] : null);
        privateState.billType = defaultValues ?
            (defaultValues["billType"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["billType"], context) :
                null) :
            null;

        context["field"] = "buyerAddress";
        context["metadata"] = (objectMetadata ? objectMetadata["buyerAddress"] : null);
        privateState.buyerAddress = defaultValues ?
            (defaultValues["buyerAddress"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["buyerAddress"], context) :
                null) :
            null;

        context["field"] = "buyerName";
        context["metadata"] = (objectMetadata ? objectMetadata["buyerName"] : null);
        privateState.buyerName = defaultValues ?
            (defaultValues["buyerName"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["buyerName"], context) :
                null) :
            null;

        context["field"] = "cancellationDocuments";
        context["metadata"] = (objectMetadata ? objectMetadata["cancellationDocuments"] : null);
        privateState.cancellationDocuments = defaultValues ?
            (defaultValues["cancellationDocuments"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["cancellationDocuments"], context) :
                null) :
            null;

        context["field"] = "cancellationStatus";
        context["metadata"] = (objectMetadata ? objectMetadata["cancellationStatus"] : null);
        privateState.cancellationStatus = defaultValues ?
            (defaultValues["cancellationStatus"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["cancellationStatus"], context) :
                null) :
            null;

        context["field"] = "countryOfDestination";
        context["metadata"] = (objectMetadata ? objectMetadata["countryOfDestination"] : null);
        privateState.countryOfDestination = defaultValues ?
            (defaultValues["countryOfDestination"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["countryOfDestination"], context) :
                null) :
            null;

        context["field"] = "countryOfOrigin";
        context["metadata"] = (objectMetadata ? objectMetadata["countryOfOrigin"] : null);
        privateState.countryOfOrigin = defaultValues ?
            (defaultValues["countryOfOrigin"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["countryOfOrigin"], context) :
                null) :
            null;

        context["field"] = "createdOn";
        context["metadata"] = (objectMetadata ? objectMetadata["createdOn"] : null);
        privateState.createdOn = defaultValues ?
            (defaultValues["createdOn"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["createdOn"], context) :
                null) :
            null;

        context["field"] = "currency";
        context["metadata"] = (objectMetadata ? objectMetadata["currency"] : null);
        privateState.currency = defaultValues ?
            (defaultValues["currency"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["currency"], context) :
                null) :
            null;

        context["field"] = "documentNo";
        context["metadata"] = (objectMetadata ? objectMetadata["documentNo"] : null);
        privateState.documentNo = defaultValues ?
            (defaultValues["documentNo"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["documentNo"], context) :
                null) :
            null;

        context["field"] = "dueDate";
        context["metadata"] = (objectMetadata ? objectMetadata["dueDate"] : null);
        privateState.dueDate = defaultValues ?
            (defaultValues["dueDate"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["dueDate"], context) :
                null) :
            null;

        context["field"] = "finalDestination";
        context["metadata"] = (objectMetadata ? objectMetadata["finalDestination"] : null);
        privateState.finalDestination = defaultValues ?
            (defaultValues["finalDestination"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["finalDestination"], context) :
                null) :
            null;

        context["field"] = "goodsDescription";
        context["metadata"] = (objectMetadata ? objectMetadata["goodsDescription"] : null);
        privateState.goodsDescription = defaultValues ?
            (defaultValues["goodsDescription"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["goodsDescription"], context) :
                null) :
            null;

        context["field"] = "messageFromBank";
        context["metadata"] = (objectMetadata ? objectMetadata["messageFromBank"] : null);
        privateState.messageFromBank = defaultValues ?
            (defaultValues["messageFromBank"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["messageFromBank"], context) :
                null) :
            null;

        context["field"] = "messageToBank";
        context["metadata"] = (objectMetadata ? objectMetadata["messageToBank"] : null);
        privateState.messageToBank = defaultValues ?
            (defaultValues["messageToBank"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["messageToBank"], context) :
                null) :
            null;

        context["field"] = "modeOfShipment";
        context["metadata"] = (objectMetadata ? objectMetadata["modeOfShipment"] : null);
        privateState.modeOfShipment = defaultValues ?
            (defaultValues["modeOfShipment"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["modeOfShipment"], context) :
                null) :
            null;

        context["field"] = "paymentTerms";
        context["metadata"] = (objectMetadata ? objectMetadata["paymentTerms"] : null);
        privateState.paymentTerms = defaultValues ?
            (defaultValues["paymentTerms"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["paymentTerms"], context) :
                null) :
            null;

        context["field"] = "physicalDocuments";
        context["metadata"] = (objectMetadata ? objectMetadata["physicalDocuments"] : null);
        privateState.physicalDocuments = defaultValues ?
            (defaultValues["physicalDocuments"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["physicalDocuments"], context) :
                null) :
            null;

        context["field"] = "portOfLoading";
        context["metadata"] = (objectMetadata ? objectMetadata["portOfLoading"] : null);
        privateState.portOfLoading = defaultValues ?
            (defaultValues["portOfLoading"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["portOfLoading"], context) :
                null) :
            null;

        context["field"] = "portOfDischarge";
        context["metadata"] = (objectMetadata ? objectMetadata["portOfDischarge"] : null);
        privateState.portOfDischarge = defaultValues ?
            (defaultValues["portOfDischarge"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["portOfDischarge"], context) :
                null) :
            null;

        context["field"] = "reasonForCancellation";
        context["metadata"] = (objectMetadata ? objectMetadata["reasonForCancellation"] : null);
        privateState.reasonForCancellation = defaultValues ?
            (defaultValues["reasonForCancellation"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["reasonForCancellation"], context) :
                null) :
            null;

        context["field"] = "reasonForRejection";
        context["metadata"] = (objectMetadata ? objectMetadata["reasonForRejection"] : null);
        privateState.reasonForRejection = defaultValues ?
            (defaultValues["reasonForRejection"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["reasonForRejection"], context) :
                null) :
            null;

        context["field"] = "reasonForReturn";
        context["metadata"] = (objectMetadata ? objectMetadata["reasonForReturn"] : null);
        privateState.reasonForReturn = defaultValues ?
            (defaultValues["reasonForReturn"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["reasonForReturn"], context) :
                null) :
            null;

        context["field"] = "receivableAccount";
        context["metadata"] = (objectMetadata ? objectMetadata["receivableAccount"] : null);
        privateState.receivableAccount = defaultValues ?
            (defaultValues["receivableAccount"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["receivableAccount"], context) :
                null) :
            null;

        context["field"] = "requestFinance";
        context["metadata"] = (objectMetadata ? objectMetadata["requestFinance"] : null);
        privateState.requestFinance = defaultValues ?
            (defaultValues["requestFinance"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["requestFinance"], context) :
                null) :
            null;

        context["field"] = "returnedHistory";
        context["metadata"] = (objectMetadata ? objectMetadata["returnedHistory"] : null);
        privateState.returnedHistory = defaultValues ?
            (defaultValues["returnedHistory"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["returnedHistory"], context) :
                null) :
            null;

        context["field"] = "shipmentDate";
        context["metadata"] = (objectMetadata ? objectMetadata["shipmentDate"] : null);
        privateState.shipmentDate = defaultValues ?
            (defaultValues["shipmentDate"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["shipmentDate"], context) :
                null) :
            null;

        context["field"] = "shipmentTrackingDetails";
        context["metadata"] = (objectMetadata ? objectMetadata["shipmentTrackingDetails"] : null);
        privateState.shipmentTrackingDetails = defaultValues ?
            (defaultValues["shipmentTrackingDetails"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["shipmentTrackingDetails"], context) :
                null) :
            null;

        context["field"] = "status";
        context["metadata"] = (objectMetadata ? objectMetadata["status"] : null);
        privateState.status = defaultValues ?
            (defaultValues["status"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["status"], context) :
                null) :
            null;

        context["field"] = "updatedOn";
        context["metadata"] = (objectMetadata ? objectMetadata["updatedOn"] : null);
        privateState.updatedOn = defaultValues ?
            (defaultValues["updatedOn"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["updatedOn"], context) :
                null) :
            null;

        context["field"] = "uploadedDocuments";
        context["metadata"] = (objectMetadata ? objectMetadata["uploadedDocuments"] : null);
        privateState.uploadedDocuments = defaultValues ?
            (defaultValues["uploadedDocuments"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["uploadedDocuments"], context) :
                null) :
            null;

        context["field"] = "searchString";
        context["metadata"] = (objectMetadata ? objectMetadata["searchString"] : null);
        privateState.searchString = defaultValues ?
            (defaultValues["searchString"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["searchString"], context) :
                null) :
            null;

        context["field"] = "pageSize";
        context["metadata"] = (objectMetadata ? objectMetadata["pageSize"] : null);
        privateState.pageSize = defaultValues ?
            (defaultValues["pageSize"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["pageSize"], context) :
                null) :
            null;

        context["field"] = "pageOffset";
        context["metadata"] = (objectMetadata ? objectMetadata["pageOffset"] : null);
        privateState.pageOffset = defaultValues ?
            (defaultValues["pageOffset"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["pageOffset"], context) :
                null) :
            null;

        context["field"] = "sortByParam";
        context["metadata"] = (objectMetadata ? objectMetadata["sortByParam"] : null);
        privateState.sortByParam = defaultValues ?
            (defaultValues["sortByParam"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["sortByParam"], context) :
                null) :
            null;

        context["field"] = "sortOrder";
        context["metadata"] = (objectMetadata ? objectMetadata["sortOrder"] : null);
        privateState.sortOrder = defaultValues ?
            (defaultValues["sortOrder"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["sortOrder"], context) :
                null) :
            null;

        context["field"] = "timeParam";
        context["metadata"] = (objectMetadata ? objectMetadata["timeParam"] : null);
        privateState.timeParam = defaultValues ?
            (defaultValues["timeParam"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["timeParam"], context) :
                null) :
            null;

        context["field"] = "timeValue";
        context["metadata"] = (objectMetadata ? objectMetadata["timeValue"] : null);
        privateState.timeValue = defaultValues ?
            (defaultValues["timeValue"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["timeValue"], context) :
                null) :
            null;

        context["field"] = "filterByValue";
        context["metadata"] = (objectMetadata ? objectMetadata["filterByValue"] : null);
        privateState.filterByValue = defaultValues ?
            (defaultValues["filterByValue"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["filterByValue"], context) :
                null) :
            null;

        context["field"] = "filterByParam";
        context["metadata"] = (objectMetadata ? objectMetadata["filterByParam"] : null);
        privateState.filterByParam = defaultValues ?
            (defaultValues["filterByParam"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["filterByParam"], context) :
                null) :
            null;

        context["field"] = "origin";
        context["metadata"] = (objectMetadata ? objectMetadata["origin"] : null);
        privateState.origin = defaultValues ?
            (defaultValues["origin"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["origin"], context) :
                null) :
            null;

        context["field"] = "fileReference";
        context["metadata"] = (objectMetadata ? objectMetadata["fileReference"] : null);
        privateState.fileReference = defaultValues ?
            (defaultValues["fileReference"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["fileReference"], context) :
                null) :
            null;

        context["field"] = "buyerSelection";
        context["metadata"] = (objectMetadata ? objectMetadata["buyerSelection"] : null);
        privateState.buyerSelection = defaultValues ?
            (defaultValues["buyerSelection"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["buyerSelection"], context) :
                null) :
            null;

        context["field"] = "buyerId";
        context["metadata"] = (objectMetadata ? objectMetadata["buyerId"] : null);
        privateState.buyerId = defaultValues ?
            (defaultValues["buyerId"] ?
                kony.mvc.util.ProcessorUtils.applyFunction(preProcessorCallback, defaultValues["buyerId"], context) :
                null) :
            null;


        //Using parent constructor to create other properties req. to kony sdk
        BaseModel.call(this);

        //Defining Getter/Setters
        Object.defineProperties(this, {
            "billReference": {
                get: function() {
                    context["field"] = "billReference";
                    context["metadata"] = (objectMetadata ? objectMetadata["billReference"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.billReference, context);
                },
                set: function(val) {
                    setterFunctions['billReference'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "amount": {
                get: function() {
                    context["field"] = "amount";
                    context["metadata"] = (objectMetadata ? objectMetadata["amount"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.amount, context);
                },
                set: function(val) {
                    setterFunctions['amount'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "billDate": {
                get: function() {
                    context["field"] = "billDate";
                    context["metadata"] = (objectMetadata ? objectMetadata["billDate"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.billDate, context);
                },
                set: function(val) {
                    setterFunctions['billDate'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "billName": {
                get: function() {
                    context["field"] = "billName";
                    context["metadata"] = (objectMetadata ? objectMetadata["billName"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.billName, context);
                },
                set: function(val) {
                    setterFunctions['billName'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "billNumber": {
                get: function() {
                    context["field"] = "billNumber";
                    context["metadata"] = (objectMetadata ? objectMetadata["billNumber"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.billNumber, context);
                },
                set: function(val) {
                    setterFunctions['billNumber'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "billType": {
                get: function() {
                    context["field"] = "billType";
                    context["metadata"] = (objectMetadata ? objectMetadata["billType"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.billType, context);
                },
                set: function(val) {
                    setterFunctions['billType'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "buyerAddress": {
                get: function() {
                    context["field"] = "buyerAddress";
                    context["metadata"] = (objectMetadata ? objectMetadata["buyerAddress"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.buyerAddress, context);
                },
                set: function(val) {
                    setterFunctions['buyerAddress'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "buyerName": {
                get: function() {
                    context["field"] = "buyerName";
                    context["metadata"] = (objectMetadata ? objectMetadata["buyerName"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.buyerName, context);
                },
                set: function(val) {
                    setterFunctions['buyerName'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "cancellationDocuments": {
                get: function() {
                    context["field"] = "cancellationDocuments";
                    context["metadata"] = (objectMetadata ? objectMetadata["cancellationDocuments"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.cancellationDocuments, context);
                },
                set: function(val) {
                    setterFunctions['cancellationDocuments'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "cancellationStatus": {
                get: function() {
                    context["field"] = "cancellationStatus";
                    context["metadata"] = (objectMetadata ? objectMetadata["cancellationStatus"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.cancellationStatus, context);
                },
                set: function(val) {
                    setterFunctions['cancellationStatus'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "countryOfDestination": {
                get: function() {
                    context["field"] = "countryOfDestination";
                    context["metadata"] = (objectMetadata ? objectMetadata["countryOfDestination"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.countryOfDestination, context);
                },
                set: function(val) {
                    setterFunctions['countryOfDestination'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "countryOfOrigin": {
                get: function() {
                    context["field"] = "countryOfOrigin";
                    context["metadata"] = (objectMetadata ? objectMetadata["countryOfOrigin"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.countryOfOrigin, context);
                },
                set: function(val) {
                    setterFunctions['countryOfOrigin'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "createdOn": {
                get: function() {
                    context["field"] = "createdOn";
                    context["metadata"] = (objectMetadata ? objectMetadata["createdOn"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.createdOn, context);
                },
                set: function(val) {
                    setterFunctions['createdOn'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "currency": {
                get: function() {
                    context["field"] = "currency";
                    context["metadata"] = (objectMetadata ? objectMetadata["currency"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.currency, context);
                },
                set: function(val) {
                    setterFunctions['currency'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "documentNo": {
                get: function() {
                    context["field"] = "documentNo";
                    context["metadata"] = (objectMetadata ? objectMetadata["documentNo"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.documentNo, context);
                },
                set: function(val) {
                    setterFunctions['documentNo'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "dueDate": {
                get: function() {
                    context["field"] = "dueDate";
                    context["metadata"] = (objectMetadata ? objectMetadata["dueDate"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.dueDate, context);
                },
                set: function(val) {
                    setterFunctions['dueDate'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "finalDestination": {
                get: function() {
                    context["field"] = "finalDestination";
                    context["metadata"] = (objectMetadata ? objectMetadata["finalDestination"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.finalDestination, context);
                },
                set: function(val) {
                    setterFunctions['finalDestination'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "goodsDescription": {
                get: function() {
                    context["field"] = "goodsDescription";
                    context["metadata"] = (objectMetadata ? objectMetadata["goodsDescription"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.goodsDescription, context);
                },
                set: function(val) {
                    setterFunctions['goodsDescription'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "messageFromBank": {
                get: function() {
                    context["field"] = "messageFromBank";
                    context["metadata"] = (objectMetadata ? objectMetadata["messageFromBank"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.messageFromBank, context);
                },
                set: function(val) {
                    setterFunctions['messageFromBank'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "messageToBank": {
                get: function() {
                    context["field"] = "messageToBank";
                    context["metadata"] = (objectMetadata ? objectMetadata["messageToBank"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.messageToBank, context);
                },
                set: function(val) {
                    setterFunctions['messageToBank'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "modeOfShipment": {
                get: function() {
                    context["field"] = "modeOfShipment";
                    context["metadata"] = (objectMetadata ? objectMetadata["modeOfShipment"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.modeOfShipment, context);
                },
                set: function(val) {
                    setterFunctions['modeOfShipment'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "paymentTerms": {
                get: function() {
                    context["field"] = "paymentTerms";
                    context["metadata"] = (objectMetadata ? objectMetadata["paymentTerms"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.paymentTerms, context);
                },
                set: function(val) {
                    setterFunctions['paymentTerms'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "physicalDocuments": {
                get: function() {
                    context["field"] = "physicalDocuments";
                    context["metadata"] = (objectMetadata ? objectMetadata["physicalDocuments"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.physicalDocuments, context);
                },
                set: function(val) {
                    setterFunctions['physicalDocuments'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "portOfLoading": {
                get: function() {
                    context["field"] = "portOfLoading";
                    context["metadata"] = (objectMetadata ? objectMetadata["portOfLoading"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.portOfLoading, context);
                },
                set: function(val) {
                    setterFunctions['portOfLoading'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "portOfDischarge": {
                get: function() {
                    context["field"] = "portOfDischarge";
                    context["metadata"] = (objectMetadata ? objectMetadata["portOfDischarge"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.portOfDischarge, context);
                },
                set: function(val) {
                    setterFunctions['portOfDischarge'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "reasonForCancellation": {
                get: function() {
                    context["field"] = "reasonForCancellation";
                    context["metadata"] = (objectMetadata ? objectMetadata["reasonForCancellation"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.reasonForCancellation, context);
                },
                set: function(val) {
                    setterFunctions['reasonForCancellation'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "reasonForRejection": {
                get: function() {
                    context["field"] = "reasonForRejection";
                    context["metadata"] = (objectMetadata ? objectMetadata["reasonForRejection"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.reasonForRejection, context);
                },
                set: function(val) {
                    setterFunctions['reasonForRejection'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "reasonForReturn": {
                get: function() {
                    context["field"] = "reasonForReturn";
                    context["metadata"] = (objectMetadata ? objectMetadata["reasonForReturn"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.reasonForReturn, context);
                },
                set: function(val) {
                    setterFunctions['reasonForReturn'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "receivableAccount": {
                get: function() {
                    context["field"] = "receivableAccount";
                    context["metadata"] = (objectMetadata ? objectMetadata["receivableAccount"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.receivableAccount, context);
                },
                set: function(val) {
                    setterFunctions['receivableAccount'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "requestFinance": {
                get: function() {
                    context["field"] = "requestFinance";
                    context["metadata"] = (objectMetadata ? objectMetadata["requestFinance"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.requestFinance, context);
                },
                set: function(val) {
                    setterFunctions['requestFinance'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "returnedHistory": {
                get: function() {
                    context["field"] = "returnedHistory";
                    context["metadata"] = (objectMetadata ? objectMetadata["returnedHistory"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.returnedHistory, context);
                },
                set: function(val) {
                    setterFunctions['returnedHistory'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "shipmentDate": {
                get: function() {
                    context["field"] = "shipmentDate";
                    context["metadata"] = (objectMetadata ? objectMetadata["shipmentDate"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.shipmentDate, context);
                },
                set: function(val) {
                    setterFunctions['shipmentDate'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "shipmentTrackingDetails": {
                get: function() {
                    context["field"] = "shipmentTrackingDetails";
                    context["metadata"] = (objectMetadata ? objectMetadata["shipmentTrackingDetails"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.shipmentTrackingDetails, context);
                },
                set: function(val) {
                    setterFunctions['shipmentTrackingDetails'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "status": {
                get: function() {
                    context["field"] = "status";
                    context["metadata"] = (objectMetadata ? objectMetadata["status"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.status, context);
                },
                set: function(val) {
                    setterFunctions['status'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "updatedOn": {
                get: function() {
                    context["field"] = "updatedOn";
                    context["metadata"] = (objectMetadata ? objectMetadata["updatedOn"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.updatedOn, context);
                },
                set: function(val) {
                    setterFunctions['updatedOn'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "uploadedDocuments": {
                get: function() {
                    context["field"] = "uploadedDocuments";
                    context["metadata"] = (objectMetadata ? objectMetadata["uploadedDocuments"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.uploadedDocuments, context);
                },
                set: function(val) {
                    setterFunctions['uploadedDocuments'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "searchString": {
                get: function() {
                    context["field"] = "searchString";
                    context["metadata"] = (objectMetadata ? objectMetadata["searchString"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.searchString, context);
                },
                set: function(val) {
                    setterFunctions['searchString'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "pageSize": {
                get: function() {
                    context["field"] = "pageSize";
                    context["metadata"] = (objectMetadata ? objectMetadata["pageSize"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.pageSize, context);
                },
                set: function(val) {
                    setterFunctions['pageSize'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "pageOffset": {
                get: function() {
                    context["field"] = "pageOffset";
                    context["metadata"] = (objectMetadata ? objectMetadata["pageOffset"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.pageOffset, context);
                },
                set: function(val) {
                    setterFunctions['pageOffset'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "sortByParam": {
                get: function() {
                    context["field"] = "sortByParam";
                    context["metadata"] = (objectMetadata ? objectMetadata["sortByParam"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.sortByParam, context);
                },
                set: function(val) {
                    setterFunctions['sortByParam'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "sortOrder": {
                get: function() {
                    context["field"] = "sortOrder";
                    context["metadata"] = (objectMetadata ? objectMetadata["sortOrder"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.sortOrder, context);
                },
                set: function(val) {
                    setterFunctions['sortOrder'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "timeParam": {
                get: function() {
                    context["field"] = "timeParam";
                    context["metadata"] = (objectMetadata ? objectMetadata["timeParam"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.timeParam, context);
                },
                set: function(val) {
                    setterFunctions['timeParam'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "timeValue": {
                get: function() {
                    context["field"] = "timeValue";
                    context["metadata"] = (objectMetadata ? objectMetadata["timeValue"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.timeValue, context);
                },
                set: function(val) {
                    setterFunctions['timeValue'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "filterByValue": {
                get: function() {
                    context["field"] = "filterByValue";
                    context["metadata"] = (objectMetadata ? objectMetadata["filterByValue"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.filterByValue, context);
                },
                set: function(val) {
                    setterFunctions['filterByValue'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "filterByParam": {
                get: function() {
                    context["field"] = "filterByParam";
                    context["metadata"] = (objectMetadata ? objectMetadata["filterByParam"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.filterByParam, context);
                },
                set: function(val) {
                    setterFunctions['filterByParam'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "origin": {
                get: function() {
                    context["field"] = "origin";
                    context["metadata"] = (objectMetadata ? objectMetadata["origin"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.origin, context);
                },
                set: function(val) {
                    setterFunctions['origin'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "fileReference": {
                get: function() {
                    context["field"] = "fileReference";
                    context["metadata"] = (objectMetadata ? objectMetadata["fileReference"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.fileReference, context);
                },
                set: function(val) {
                    setterFunctions['fileReference'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "buyerSelection": {
                get: function() {
                    context["field"] = "buyerSelection";
                    context["metadata"] = (objectMetadata ? objectMetadata["buyerSelection"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.buyerSelection, context);
                },
                set: function(val) {
                    setterFunctions['buyerSelection'].call(this, val, privateState);
                },
                enumerable: true,
            },
            "buyerId": {
                get: function() {
                    context["field"] = "buyerId";
                    context["metadata"] = (objectMetadata ? objectMetadata["buyerId"] : null);
                    return kony.mvc.util.ProcessorUtils.applyFunction(postProcessorCallback, privateState.buyerId, context);
                },
                set: function(val) {
                    setterFunctions['buyerId'].call(this, val, privateState);
                },
                enumerable: true,
            },
        });

        //converts model object to json object.
        this.toJsonInternal = function() {
            return Object.assign({}, privateState);
        };

        //overwrites object state with provided json value in argument.
        this.fromJsonInternal = function(value) {
            privateState.billReference = value ? (value["billReference"] ? value["billReference"] : null) : null;
            privateState.amount = value ? (value["amount"] ? value["amount"] : null) : null;
            privateState.billDate = value ? (value["billDate"] ? value["billDate"] : null) : null;
            privateState.billName = value ? (value["billName"] ? value["billName"] : null) : null;
            privateState.billNumber = value ? (value["billNumber"] ? value["billNumber"] : null) : null;
            privateState.billType = value ? (value["billType"] ? value["billType"] : null) : null;
            privateState.buyerAddress = value ? (value["buyerAddress"] ? value["buyerAddress"] : null) : null;
            privateState.buyerName = value ? (value["buyerName"] ? value["buyerName"] : null) : null;
            privateState.cancellationDocuments = value ? (value["cancellationDocuments"] ? value["cancellationDocuments"] : null) : null;
            privateState.cancellationStatus = value ? (value["cancellationStatus"] ? value["cancellationStatus"] : null) : null;
            privateState.countryOfDestination = value ? (value["countryOfDestination"] ? value["countryOfDestination"] : null) : null;
            privateState.countryOfOrigin = value ? (value["countryOfOrigin"] ? value["countryOfOrigin"] : null) : null;
            privateState.createdOn = value ? (value["createdOn"] ? value["createdOn"] : null) : null;
            privateState.currency = value ? (value["currency"] ? value["currency"] : null) : null;
            privateState.documentNo = value ? (value["documentNo"] ? value["documentNo"] : null) : null;
            privateState.dueDate = value ? (value["dueDate"] ? value["dueDate"] : null) : null;
            privateState.finalDestination = value ? (value["finalDestination"] ? value["finalDestination"] : null) : null;
            privateState.goodsDescription = value ? (value["goodsDescription"] ? value["goodsDescription"] : null) : null;
            privateState.messageFromBank = value ? (value["messageFromBank"] ? value["messageFromBank"] : null) : null;
            privateState.messageToBank = value ? (value["messageToBank"] ? value["messageToBank"] : null) : null;
            privateState.modeOfShipment = value ? (value["modeOfShipment"] ? value["modeOfShipment"] : null) : null;
            privateState.paymentTerms = value ? (value["paymentTerms"] ? value["paymentTerms"] : null) : null;
            privateState.physicalDocuments = value ? (value["physicalDocuments"] ? value["physicalDocuments"] : null) : null;
            privateState.portOfLoading = value ? (value["portOfLoading"] ? value["portOfLoading"] : null) : null;
            privateState.portOfDischarge = value ? (value["portOfDischarge"] ? value["portOfDischarge"] : null) : null;
            privateState.reasonForCancellation = value ? (value["reasonForCancellation"] ? value["reasonForCancellation"] : null) : null;
            privateState.reasonForRejection = value ? (value["reasonForRejection"] ? value["reasonForRejection"] : null) : null;
            privateState.reasonForReturn = value ? (value["reasonForReturn"] ? value["reasonForReturn"] : null) : null;
            privateState.receivableAccount = value ? (value["receivableAccount"] ? value["receivableAccount"] : null) : null;
            privateState.requestFinance = value ? (value["requestFinance"] ? value["requestFinance"] : null) : null;
            privateState.returnedHistory = value ? (value["returnedHistory"] ? value["returnedHistory"] : null) : null;
            privateState.shipmentDate = value ? (value["shipmentDate"] ? value["shipmentDate"] : null) : null;
            privateState.shipmentTrackingDetails = value ? (value["shipmentTrackingDetails"] ? value["shipmentTrackingDetails"] : null) : null;
            privateState.status = value ? (value["status"] ? value["status"] : null) : null;
            privateState.updatedOn = value ? (value["updatedOn"] ? value["updatedOn"] : null) : null;
            privateState.uploadedDocuments = value ? (value["uploadedDocuments"] ? value["uploadedDocuments"] : null) : null;
            privateState.searchString = value ? (value["searchString"] ? value["searchString"] : null) : null;
            privateState.pageSize = value ? (value["pageSize"] ? value["pageSize"] : null) : null;
            privateState.pageOffset = value ? (value["pageOffset"] ? value["pageOffset"] : null) : null;
            privateState.sortByParam = value ? (value["sortByParam"] ? value["sortByParam"] : null) : null;
            privateState.sortOrder = value ? (value["sortOrder"] ? value["sortOrder"] : null) : null;
            privateState.timeParam = value ? (value["timeParam"] ? value["timeParam"] : null) : null;
            privateState.timeValue = value ? (value["timeValue"] ? value["timeValue"] : null) : null;
            privateState.filterByValue = value ? (value["filterByValue"] ? value["filterByValue"] : null) : null;
            privateState.filterByParam = value ? (value["filterByParam"] ? value["filterByParam"] : null) : null;
            privateState.origin = value ? (value["origin"] ? value["origin"] : null) : null;
            privateState.fileReference = value ? (value["fileReference"] ? value["fileReference"] : null) : null;
            privateState.buyerSelection = value ? (value["buyerSelection"] ? value["buyerSelection"] : null) : null;
            privateState.buyerId = value ? (value["buyerId"] ? value["buyerId"] : null) : null;
        };
    }

    //Setting BaseModel as Parent to this Model
    BaseModel.isParentOf(ReceivableSingleBills);

    //Create new class level validator object
    BaseModel.Validator.call(ReceivableSingleBills);

    var registerValidatorBackup = ReceivableSingleBills.registerValidator;

    ReceivableSingleBills.registerValidator = function() {
        var propName = arguments[0];
        if(!setterFunctions[propName].changed) {
            var setterBackup = setterFunctions[propName];
            setterFunctions[arguments[0]] = function() {
                if(ReceivableSingleBills.isValid(this, propName, val)) {
                    return setterBackup.apply(null, arguments);
                } else {
                    throw Error("Validation failed for " + propName + " : " + val);
                }
            }
            setterFunctions[arguments[0]].changed = true;
        }
        return registerValidatorBackup.apply(null, arguments);
    }

    //Extending Model for custom operations
    //For Operation 'getBill' with service id 'GetReceivableSingleBillById7070'
     ReceivableSingleBills.getBill = function(params, onCompletion){
        return ReceivableSingleBills.customVerb('getBill', params, onCompletion);
     };

    //For Operation 'updateBillByBank' with service id 'UpdateReceivableSingleBillByBank1715'
     ReceivableSingleBills.updateBillByBank = function(params, onCompletion){
        return ReceivableSingleBills.customVerb('updateBillByBank', params, onCompletion);
     };

    //For Operation 'generateBillsList' with service id 'GenerateReceivableSingleBillsList8715'
     ReceivableSingleBills.generateBillsList = function(params, onCompletion){
        return ReceivableSingleBills.customVerb('generateBillsList', params, onCompletion);
     };

    //For Operation 'getBills' with service id 'GetReceivableSingleBills8752'
     ReceivableSingleBills.getBills = function(params, onCompletion){
        return ReceivableSingleBills.customVerb('getBills', params, onCompletion);
     };

    //For Operation 'requestBillCancellation' with service id 'RequestReceivableSingleBillCancellation4953'
     ReceivableSingleBills.requestBillCancellation = function(params, onCompletion){
        return ReceivableSingleBills.customVerb('requestBillCancellation', params, onCompletion);
     };

    //For Operation 'reviseBill' with service id 'ReviseReceivableSingleBill2224'
     ReceivableSingleBills.reviseBill = function(params, onCompletion){
        return ReceivableSingleBills.customVerb('reviseBill', params, onCompletion);
     };

    //For Operation 'createBill' with service id 'CreateReceivableSingleBill2137'
     ReceivableSingleBills.createBill = function(params, onCompletion){
        return ReceivableSingleBills.customVerb('createBill', params, onCompletion);
     };

    //For Operation 'deleteBill' with service id 'DeleteReceivableSingleBill9934'
     ReceivableSingleBills.deleteBill = function(params, onCompletion){
        return ReceivableSingleBills.customVerb('deleteBill', params, onCompletion);
     };

    //For Operation 'generateBillReport' with service id 'GenerateReceivableSingleBillReport5308'
     ReceivableSingleBills.generateBillReport = function(params, onCompletion){
        return ReceivableSingleBills.customVerb('generateBillReport', params, onCompletion);
     };

    //For Operation 'saveBill' with service id 'SaveReceivableSingleBill5597'
     ReceivableSingleBills.saveBill = function(params, onCompletion){
        return ReceivableSingleBills.customVerb('saveBill', params, onCompletion);
     };

    //For Operation 'submitImportedBill' with service id 'SubmitCsvImportBill1720'
     ReceivableSingleBills.submitImportedBill = function(params, onCompletion){
        return ReceivableSingleBills.customVerb('submitImportedBill', params, onCompletion);
     };

    var relations = [];

    ReceivableSingleBills.relations = relations;

    ReceivableSingleBills.prototype.isValid = function() {
        return ReceivableSingleBills.isValid(this);
    };

    ReceivableSingleBills.prototype.objModelName = "ReceivableSingleBills";
    ReceivableSingleBills.prototype.objServiceName = "TradeSupplyFinance";

    /*This API allows registration of preprocessors and postprocessors for model.
     *It also fetches object metadata for object.
     *Options Supported
     *preProcessor  - preprocessor function for use with setters.
     *postProcessor - post processor callback for use with getters.
     *getFromServer - value set to true will fetch metadata from network else from cache.
     */
    ReceivableSingleBills.registerProcessors = function(options, successCallback, failureCallback) {

        if(!options) {
            options = {};
        }

        if(options && ((options["preProcessor"] && typeof(options["preProcessor"]) === "function") || !options["preProcessor"])) {
            preProcessorCallback = options["preProcessor"];
        }

        if(options && ((options["postProcessor"] && typeof(options["postProcessor"]) === "function") || !options["postProcessor"])) {
            postProcessorCallback = options["postProcessor"];
        }

        function metaDataSuccess(res) {
            objectMetadata = kony.mvc.util.ProcessorUtils.convertObjectMetadataToFieldMetadataMap(res);
            successCallback();
        }

        function metaDataFailure(err) {
            failureCallback(err);
        }

        kony.mvc.util.ProcessorUtils.getMetadataForObject("TradeSupplyFinance", "ReceivableSingleBills", options, metaDataSuccess, metaDataFailure);
    };

    //clone the object provided in argument.
    ReceivableSingleBills.clone = function(objectToClone) {
        var clonedObj = new ReceivableSingleBills();
        clonedObj.fromJsonInternal(objectToClone.toJsonInternal());
        return clonedObj;
    };

    return ReceivableSingleBills;
});