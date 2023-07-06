define(['CommonUtilities', 'OLBConstants'], function (CommonUtilities, OLBConstants) {
    /**
     * User defined presentation controller
     * @constructor
     * @extends kony.mvc.Presentation.BasePresenter
     */
    function BillsPresentationController() {
        this.navigationManager = applicationManager.getNavigationManager();
        this.configurationManager = applicationManager.getConfigurationManager();
        this.asyncManager = applicationManager.getAsyncManager();
        this.accountManager = applicationManager.getAccountManager();
        this.formatUtilManager = applicationManager.getFormatUtilManager();
        this.billsManager = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ moduleName: 'BillsManager', appName: 'TradeSupplyFinMA' }).businessController;
        this.billData = {};
        this.revisedBillData = {};
        this.isUploadInBackground = false;
        this.csvRecordData = [];
        this.sNoSet = new Set(); // to keep a track of all Serial numbers
        this.billNumberSet = new Set(); // to keep a track of all bill numbers
        this.countriesList = [];
        this.contextualMenuData = [
            {
                'id': 'download',
                'icon': 'D',
                'text': kony.i18n.getLocalizedString('i18n.common.Download')
            },
            {
                'id': 'print',
                'icon': 'p',
                'text': kony.i18n.getLocalizedString('i18n.accounts.print')
            },
            {
                'id': 'raiseQuery',
                'icon': 'm',
                'text': kony.i18n.getLocalizedString('i18n.TradeFinance.RaiseAQuery')
            }
        ];
        this.billConfig = {
            'billTypes': ['Promisory note', 'Bill of exchange', 'Deffered payment letter of credit', 'Commercial Invoice', 'Sales Agreement', 'Purchase Order'],
            'currencies': ['USD', 'EUR'],
            'accountTypes': [OLBConstants.ACCOUNT_TYPE.SAVING, OLBConstants.ACCOUNT_TYPE.CHECKING, OLBConstants.ACCOUNT_TYPE.CURRENT],
            'documentsLimit': 10,
            'documentMaxSize': 25000000,
            'fileExtensions': ['pdf', 'jpeg', 'doc', 'docx', 'xlsx', 'bmp', 'zip'],
            'modesOfShipment': ['Air', 'Road', 'Sea'],
            'requestFinance': ['Yes', 'No'],
            'buyerSelection': ['existing', 'manual'],
            'billCsvSize': 2000000,
            'csvBillLimit': 50,
            'graphCurrencyFilters': {
                'USD': `USD-${this.configurationManager.getCurrency('USD')}`,
                'EUR': `EUR-${this.configurationManager.getCurrency('EUR')}`
            },
            'graphDurationFilters': {
                '7': `7 ${kony.i18n.getLocalizedString('i18n.TradeFinance.days')}`,
                '14': `14 ${kony.i18n.getLocalizedString('i18n.TradeFinance.days')}`,
                '30': `1 ${kony.i18n.getLocalizedString('i18n.AccountsDetails.month')}`
            }
        };
        this.billRoadmap = {
            'step1': kony.i18n.getLocalizedString('kony.mb.BillPay.BillDetails'),
            'step2': kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.goodsShipmentAndDocuments'),
            'step3': kony.i18n.getLocalizedString('i18n.kony.BulkPayments.ViewRequests')
        };
        this.csvRowData = {// first param is the identifier and second param is to know if it is a mandatory field.
            "S.no": ["number", false, "sno"],
            "Bill name": ["string", false, "billName"],
            "Bill number*": ["string", true, "billNumber"],
            "Bill Date*": ["date", true, "billDate"],
            "Bill Type*": ["string", true, "billType"],
            "Due Date*": ["date", true, "dueDate"],
            "Payment Terms*": ["string", true, "paymentTerms"],
            "Amount*": ["currencyAmount", true, "amount"],
            "Account Receivables*": ["account", true, "receivableAccount"],
            "Need Finance*": ["string", true, "requestFinance"],
            "Buyer Selection*": ["string", true, "buyerSelection"],
            "Buyer name*": ["string", true, "buyerName"],
            "Buyer Address*": ["string", true, "buyerAddress"],
            "Goods Description*": ["string", true, "goodsDescription"],
            "Shipment Date*": ["date", true, "shipmentDate"],
            "Shipment & Tracking*": ["string", true, "shipmentTrackingDetails"],
            "Country of Origin*": ["country", true, "countryOfOrigin"],
            "Country of destination*": ["country", true, "countryOfDestination"],
            "Mode of Shipment": ["string", false, "modeOfShipment"],
            "Port of Discharge": ["string", false, "portOfDischarge"],
            "Port of Loading": ["string", false, "portOfLoading"],
            "Final Destination": ["country", false, "finalDestination"],
            "Message to Bank": ["string", false, "messageToBank"]
        };
        kony.mvc.Presentation.BasePresenter.call(this);
    }

    inheritsFrom(BillsPresentationController, kony.mvc.Presentation.BasePresenter);

    /**
     * Overridden Method of kony.mvc.Presentation.BasePresenter
     * This method gets called when presentation controller gets initialized
     * @method
     */
    BillsPresentationController.prototype.initializeBillsPresentationController = function () { };
    /**
     * Entry Point method for Bills module
     * @param {object} params - contains info to load the screen
     */
    BillsPresentationController.prototype.showBillsScreen = function (params) {
        switch (params.context) {
            case 'createBill':
                this.billData = params.data || {};
                this.showView({ form: 'frmCreateBillStep1' });
                break;
            case 'viewBills':
                this.navigationManager.navigateTo({ appName: 'TradeSupplyFinMA', friendlyName: 'frmReceivableBillsDashboard' }, false, { flowType: 'bills' });
                break;
            case 'viewBillDetails':
                this.getBill(params.data, params.form, this.showView.bind(this, { form: 'frmViewBillDetails' }));
                break;
            case 'cancelBill':
                this.showView({ form: 'frmCancelBill' });
                break;
            case 'reviseBill':
                this.revisedBillData = JSON.parse(JSON.stringify(this.billData));
                this.showView({ form: 'frmCreateBillStep1' });
                break;
            case 'printBill':
                this.navigationManager.navigateTo({ appName: 'TradeSupplyFinMA', friendlyName: 'frmReceivableBillsPrint' }, false, params.data);
                break;
            case 'viewFileImports':
                this.navigationManager.navigateTo({ appName: 'TradeSupplyFinMA', friendlyName: 'frmReceivableBillsDashboard' }, false, { flowType: 'fileImport' });
                break;
            case 'reviewFileImport':
                this.csvRecordData = params.data;
                this.getBills({ filterByValue: params.data.fileReference, filterByParam: 'fileReference' }, params.form, this.showView.bind(this, { form: 'frmCreateCsvBill' }));
                break;
        }
    };
    /**
     * Method to show a particular form
     * @param {object} param0 contains info to load the particular form
     */
    BillsPresentationController.prototype.showView = function ({ appName, form, data }) {
        if (kony.application.getCurrentForm().id !== form) {
            const navObj = {
                appName: appName || 'TradeSupplyFinMA',
                friendlyName: form
            };
            this.navigationManager.navigateTo(navObj);
        }
        if (!this.isEmptyNullOrUndefined(data)) {
            this.navigationManager.updateForm(data, form);
        }
    };
    /**
     * Method to verify whether the value is empty, null or undefined
     * @param {any} data value to be verified
     * @returns {boolean} validity of the value passed
     */
    BillsPresentationController.prototype.isEmptyNullOrUndefined = function (data) {
        try {
            data = JSON.parse(data);
        } catch (err) { }
        if (data === null || data === undefined || (typeof data === "string" && data.trim() === "")) return true;
        if (typeof data === "object") {
            if (Array.isArray(data)) return data.length === 0;
            return Object.keys(data).length === 0;
        }
        return false;
    };
    /**
     * Method to show the loading indicator
     */
    BillsPresentationController.prototype.showProgressBar = function () {
        this.navigationManager.updateForm({
            isLoading: true
        });
    };
    /**
     * Method to hide the loading indicator
     */
    BillsPresentationController.prototype.hideProgressBar = function () {
        this.navigationManager.updateForm({
            isLoading: false
        });
    };
    /**
     * Method to handle service failure
     * @param {string} form form id
     * @param {object} response contains error info
     */
    BillsPresentationController.prototype.commonServiceFailureMethod = function ({ form, method }, response) {
        this.hideProgressBar();
        if (method && method === "createBillsFromCSV" && this.isUploadInBackground) {
            return;
        }
        this.showView({
            form,
            data: {
                serverError: response.errmsg || response.errorMessage,
                method
            }
        });
    };
    /**
     * Method to get Buyer data
     * @param {string} form form id
     */
    BillsPresentationController.prototype.getBuyerData = function (form) {
        const scope = this;
        this.showProgressBar();
        this.asyncManager.callAsync(
            [
                this.asyncManager.asyncItem(this.billsManager, 'fetchPaymentPayees', [{}]),
                this.asyncManager.asyncItem(this.billsManager, 'fetchCorporatePayees', [{}])
            ],
            scope.getBuyerDataCompletionCallBack.bind(scope, form)
        );
    };
    /**
     * Service completion callback for get Buyer data
     * @param {string} form form id
     * @param {object} syncResponseObject contains service response data
     */
    BillsPresentationController.prototype.getBuyerDataCompletionCallBack = function (form, syncResponseObject) {
        this.hideProgressBar();
        if (syncResponseObject.isAllSuccess()) {
            const buyerData = syncResponseObject.responses.flatMap(response => response.data ? (response.data.ExternalAccounts || response.data.Payees || []) : []);
            this.showView({
                form,
                data: { buyerData }
            });
        } else {
            this.showView({
                form,
                data: syncResponseObject.responses[0]
            });
        }
    };
    /**
     * Method to get Countries data
     * @param {string} form form id
     */
    BillsPresentationController.prototype.getAllCountries = function (form) {
        this.showProgressBar();
        this.billsManager.fetchCountriesList(this.getAllCountriesSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form }));
    };
    /**
     * Success callback for get Countries data
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.getAllCountriesSuccess = function (form, response) {
        this.hideProgressBar();
        this.countriesList = (response.records || []).map(x => x.Name);
        this.showView({
            form,
            data: { countries: this.countriesList }
        });
    };
    /**
     * Method to upload the document
     * @param {string} attachment contains document info
     * @param {string} form form id
     */
    BillsPresentationController.prototype.uploadDocument = function (attachment, form) {
        this.showProgressBar();
        const params = {
            'uploadedattachments': attachment
        };
        this.billsManager.uploadDocument(params, this.uploadDocumentSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form }));
    };
    /**
     * Success callback for upload document
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.uploadDocumentSuccess = function (form, response) {
        this.hideProgressBar();
        if (response && response.LCDocuments && response.LCDocuments[0].failedUploads) {
            this.showView({
                form,
                data: {
                    'serverError': kony.i18n.getLocalizedString('i18n.payments.unableToUploadFile')
                }
            });
        } else {
            this.showView({
                form,
                data: {
                    'uploadDocument': response
                }
            });
        }
    };
    /**
     * Method to delete a uploaded document
     * @param {string} deleteParams contains document info
     * @param {string} form form id
     */
    BillsPresentationController.prototype.deleteDocument = function (deleteParams, form) {
        this.showProgressBar();
        const params = {
            'documentReference': deleteParams
        };
        this.billsManager.deleteDocument(params, this.deleteDocumentSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form }));
    };
    /**
     * Success callback for deleting the uploaded document
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.deleteDocumentSuccess = function (form, response) {
        this.hideProgressBar();
        this.showView({
            form,
            data: {
                'deleteDocument': response
            }
        });
    };
    /**
     * Method to download a document
     * @param {string} docReference contains document reference
     * @param {string} form form id
     */
    BillsPresentationController.prototype.downloadDocument = function (docReference, form) {
        this.showProgressBar();
        const params = {
            'documentReference': docReference
        };
        this.billsManager.downloadDocument(params, this.downloadDocumentSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form }));
    };
    /**
     * Success callback for downloading the uploaded document
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.downloadDocumentSuccess = function (form, response) {
        this.hideProgressBar();
        if (response) {
            let downloadUrl = `${KNYMobileFabric.mainRef.config.services_meta.TradeSupplyFinance.url}/operations/TradeDocuments/downloadDocument`;
            CommonUtilities.downloadAttachment(downloadUrl, { 'fileId': response[0].fileID });
        }
    };
    /**
     * Method to get transformed bill data
     * @returns {object} transformed bill data object
     */
    BillsPresentationController.prototype.transformBillData = function () {
        const data = JSON.parse(JSON.stringify(this.billData.status === OLBConstants.BILLS_STATUS.RETURNED_BY_BANK ? this.revisedBillData : this.billData));
        let transformedData = {
            'billName': data.billName || '',
            'billNumber': data.billNumber || '',
            'billDate': data.billDate || '',
            'billType': data.billType || '',
            'dueDate': data.dueDate || '',
            'paymentTerms': data.paymentTerms || '',
            'currency': data.currency || '',
            'amount': data.amount || '',
            'receivableAccount': data.receivableAccount || '',
            'requestFinance': data.requestFinance || '',
            'buyerSelection': data.buyerSelection || '',
            'buyerName': data.buyerName || '',
            'buyerAddress': data.buyerAddress || '',
            'goodsDescription': data.goodsDescription || '',
            'shipmentDate': data.shipmentDate || '',
            'shipmentTrackingDetails': data.shipmentTrackingDetails || '',
            'countryOfOrigin': data.countryOfOrigin || '',
            'countryOfDestination': data.countryOfDestination || '',
            'modeOfShipment': data.modeOfShipment || '',
            'portOfDischarge': data.portOfDischarge || '',
            'portOfLoading': data.portOfLoading || '',
            'finalDestination': data.finalDestination || '',
            'uploadedDocuments': data.uploadedDocuments || '',
            'messageToBank': data.messageToBank || '',
            'billReference': data.billReference || ''
        };
        for (const key in transformedData) {
            if (this.isEmptyNullOrUndefined(transformedData[key])) delete transformedData[key];
        }
        return transformedData;
    };
    /**
     * Method to save a bill
     * @param {object} params contains bill info
     * @param {string} form form id
     * @param {string} flow contains the flow type
     */
    BillsPresentationController.prototype.saveBill = function (params, flow, form) {
        this.showProgressBar();
        this.billData = Object.assign(this.billData, params);
        const transformedBillData = this.transformBillData();
        this.billsManager.saveBill(transformedBillData, this.saveBillSuccess.bind(this, flow, form), this.commonServiceFailureMethod.bind(this, { form }));
    };
    /**
     * Success callback for saving the bill
     * @param {string} flow contains the flow type
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.saveBillSuccess = function (flow, form, response) {
        this.hideProgressBar();
        if (flow === 'saveOrDeleteDraft') {
            form = "frmReceivableBillsDashboard";
        }
        this.billData = Object.assign(this.billData, response);
        this.showView({
            form,
            data: {
                saveBill: true
            }
        });
    };
    /**
     * Method to create a bill
     * @param {string} form form id
     */
    BillsPresentationController.prototype.createBill = function (form) {
        this.showProgressBar();
        const transformedBillData = this.transformBillData();
        this.billsManager.createBill(transformedBillData, this.createBillSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form }));
    };
    /**
     * Success callback for creating the bill
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.createBillSuccess = function (form, response) {
        this.hideProgressBar();
        this.billData = Object.assign(this.billData, response);
        this.showView({
            form,
            data: {
                createBill: true
            }
        });
    };

    /**
     * Method to create bills through csv upload
     * @param {string} form form id
     */
    BillsPresentationController.prototype.createBillsFromCSV = function (form) {
        const payload = {
            bills: this.csvRecordData
        };
        this.billsManager.createBillsFromCSV(payload, this.createBillsFromCSVSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form, method: 'createBillsFromCSV' }));
    };
    /**
     * Success callback for creating the bill
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.createBillsFromCSVSuccess = function (form, response) {
        this.hideProgressBar();
        this.csvRecordData = response;
        if (!this.isUploadInBackground) {
            this.showView({
                form: 'frmCreateCsvBill',
                data: {
                    importCsvSuccess: true
                }
            });
        }
    };
    /**
     * Method to delete a bill
     * @param {string} form form id
     */
    BillsPresentationController.prototype.deleteBill = function (form) {
        this.showProgressBar();
        const params = {
            billReference: this.billData.billReference
        };
        this.billsManager.deleteBill(params, this.deleteBillSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form }));
    };
    /**
     * Success callback for deleting the bill
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.deleteBillSuccess = function (form, response) {
        this.hideProgressBar();
        this.showView({
            form: 'frmReceivableBillsDashboard',
            data: {
                deleteBill: true
            }
        });
    };

    /**
    * Method to fetch Swift Advices
    * @param {object} params - consist of payload to generate file
    * @param {string} frm - form name
    */
    BillsPresentationController.prototype.fetchFileResponse = function (params, form) {
        this.showProgressBar();
        this.billsManager.fetchFileResponse(params, this.fetchFileResponseSuccess.bind(this, form), this.fetchFileResponseFailure.bind(this, form));
    };

    /**
     * Success callback for save fetch Swift Advices
     * @param {object} response - consist fileId of generated file
     */
    BillsPresentationController.prototype.fetchFileResponseSuccess = function (form, response) {
        this.hideProgressBar();
        this.showView({
            form,
            data: { fetchFileResponse: response }
        });
    };

    /**
     * Failure callback for fetch Swift Advices
     * @param {string} frm - form name
     * @param {object} response - consist of error details
     */
    BillsPresentationController.prototype.fetchFileResponseFailure = function (form, response) {
        this.hideProgressBar();
        this.showView({
            form,
            data: {
                serverError: response
            }
        });
    };
    /**
     * Method to revise a bill
     * @param {string} form form id
     */
    BillsPresentationController.prototype.reviseBill = function (form) {
        this.showProgressBar();
        const transformedBillData = this.transformBillData();
        this.billsManager.reviseBill(transformedBillData, this.reviseBillSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form }));
    };
    /**
     * Success callback for revising the bill
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.reviseBillSuccess = function (form, response) {
        this.hideProgressBar();
        this.revisedBillData = Object.assign(this.revisedBillData, response);
        this.showView({
            form,
            data: {
                reviseBill: true
            }
        });
    };
    /**
     * Method to fetch the list of bill
     * @param {object} params contains params to fetch the bills
     * @param {string} form form id
     */
    BillsPresentationController.prototype.getBills = function (params, form, chartsData) {
        this.showProgressBar();
        this.billsManager.getBills(params, this.getBillsSuccess.bind(this, form, chartsData), this.commonServiceFailureMethod.bind(this, { form }));
    };
    /**
     * Success callback for fetching the list of bills
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.getBillsSuccess = function (form, chartsData, response) {
        this.hideProgressBar();
        response = (response && response.ReceivableBills) || [];
        if (chartsData && typeof chartsData === 'function') {
            this.csvRecordData['bills'] = response;
            chartsData();
        } else {
            const isChart = chartsData ? chartsData.isChartData : false;
            this.showView({
                form,
                data: isChart ? { chartData: response } : { bills: response }
            });
        }
    };
    /**
     * Method to fetch a bill
     * @param {object} params contains params to fetch the bill
     * @param {string} form form id
     * @param {Function} callback contains callback method
     */
    BillsPresentationController.prototype.getBill = function (params, form, callback) {
        this.showProgressBar();
        this.billsManager.getBill(params, this.getBillSuccess.bind(this, form, callback), this.commonServiceFailureMethod.bind(this, { form }));
    };
    /**
     * Success callback for fetching a particular bill
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.getBillSuccess = function (form, callback, response) {
        this.hideProgressBar();
        this.billData = response;
        if (callback && typeof callback === 'function') {
            callback();
        } else {
            this.showView({
                form,
                data: {
                    billDetails: response
                }
            });
        }
    };
    /**
     * Method to generate pdf
     * @param {string} docReference contains bill reference
     */
    BillsPresentationController.prototype.downloadBillReportPdf = function (orderId) {
        this.showProgressBar();
        const params = {
            'orderId': orderId
        };
        this.billsManager.generateBill(params, this.downloadGeneratedPdfSuccess.bind(this), this.commonServiceFailureMethod.bind(this));
    };
    /**
     * Success callback for downloading the generated pdf file
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.downloadGeneratedPdfSuccess = function (response) {
        this.hideProgressBar();
        if (response) {
            let downloadUrl = `${KNYMobileFabric.mainRef.config.services_meta.TradeSupplyFinance.url}/operations/TradeDocuments/downloadPdf`;
            CommonUtilities.downloadAttachment(downloadUrl, { 'fileId': response.fileId });
        }
    };
    /**
     * Method to generate xlsx
     * @param {string} docReference contains bill reference
     */
    BillsPresentationController.prototype.downloadBillsXlsx = function (params) {
        this.showProgressBar();
        this.billsManager.generateBillsList(params, this.downloadGeneratedXlsxSuccess.bind(this), this.commonServiceFailureMethod.bind(this));
    };
    /**
     * Success callback for downloading the generated xlsx file
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.downloadGeneratedXlsxSuccess = function (response) {
        this.hideProgressBar();
        if (response) {
            let downloadUrl = `${KNYMobileFabric.mainRef.config.services_meta.TradeSupplyFinance.url}/operations/TradeDocuments/downloadXlsx`;
            CommonUtilities.downloadAttachment(downloadUrl, { 'fileId': response.fileId });
        }
    };
    /**
     * Method to compare the revised bill data
     * @param {object} fields contains fields which might be updated
     * @returns {Boolean} comparison result
     */
    BillsPresentationController.prototype.compareRevisedBillData = function (fields) {
        for (const key in fields) {
            if ((this.billData.hasOwnProperty(key) && this.billData[key] !== this.revisedBillData[key]) || (!this.billData.hasOwnProperty(key) && this.revisedBillData[key])) {
                return true;
            }
        }
        return false;
    };
    /**
     * Method to get display account name
     * @param {string} accId account id
     */
    BillsPresentationController.prototype.getAccountDisplayName = function (accId) {
        const accounts = this.accountManager.getInternalAccounts();
        for (const account of accounts) {
            if (account.accountID === accId) {
                return CommonUtilities.getAccountDisplayName(account);
            }
        }
        return accId;
    };

    /**
     * @api : renderI18nKeys
     * Method to render i18n keys
     * @param {string} i18nKeyString i18n id
     * @param {boolean} renderColon to render colon
     */
    BillsPresentationController.prototype.renderI18nKeys = function (i18nKeyString, renderColon) {
        var scope = this;
        try {
            let i18nValue = kony.i18n.getLocalizedString(i18nKeyString);
            if (renderColon)
                i18nValue = kony.i18n.getCurrentLocale() === 'ar_AE' ? ":" + i18nValue : i18nValue + ":";
            return i18nValue;
        } catch (err) {
            var errorObj =
            {
                "method": "renderI18nKeys",
                "error": err
            };
            scope.onError(errorObj);
        }
    };

    /**
     * Method to show cursor as pointer
     * @param {Array} widgetRef - form name
     * @returns : NA
     */
    BillsPresentationController.prototype.cursorTypePointer = function (widgetRef) {
        try {
            widgetRef.map(item => {
                item.cursorType = "pointer";
            });
        } catch (err) {
            var errorObj = {
                "method": "cursorTypePointer",
                "error": err
            };
            scope.onError(errorObj);
        }
    };

    /**
     * Method to fetch Swift Advices
     * @param {object} params - consist of payload to generate file
     * @param {string} frm - form name
     */
    BillsPresentationController.prototype.fetchSwiftsAdvices = function (params, form) {
        this.showProgressBar();
        this.billsManager.fetchSwiftsAdvices(params, this.fetchSwiftsAdvicesSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form }));
    };

    /**
       * Success callback for save fetch Swift Advices
       * @param {object} response - consist fileId of generated file
       */
    BillsPresentationController.prototype.fetchSwiftsAdvicesSuccess = function (form, response) {
        this.hideProgressBar();
        this.showView({
            form,
            data: { fetchSwiftsAdvices: response }
        });
    };

    /**
     * Method to fetch all the bills
     * @param {object} params contains params to fetch all the bills
     * @param {string} form form id
     */
    BillsPresentationController.prototype.getDashboardData = function (params, form, flowType) {
        this.showProgressBar();
        let asyncCalls = [
            this.asyncManager.asyncItem(this.billsManager, 'getBills', [params.chartsParameter]),
            this.asyncManager.asyncItem(this.billsManager, flowType === "bills" ? 'getBills' : flowType === "fileImport" ? "fetchCsvImports" : "fetchBatch", [params.listingParameter])
        ];
        if (!(this.countriesList && this.countriesList.length > 0)) {
            asyncCalls.push(this.asyncManager.asyncItem(this.billsManager, 'fetchCountriesList'));
        }
        this.asyncManager.callAsync(asyncCalls, this.getDashboardDataCallback.bind(this, form, flowType));
    };
    /**
       * Success and Failure callback for fetch all the bills
       * @param {string} form form id
       * @param {object} response contains service response data
       */
    BillsPresentationController.prototype.getDashboardDataCallback = function (form, flowType, syncResponseObject) {
        this.hideProgressBar();
        let response = syncResponseObject.responses;
        if (syncResponseObject.isAllSuccess()) {
            let data = {
                chartData: (response[0].data && response[0].data.ReceivableBills) || []
            };
            switch (flowType) {
                case 'bills':
                    data['bills'] = (response[1].data && response[1].data.ReceivableBills) || [];
                    break;
                case 'fileImport':
                    data['CsvImports'] = (response[1].data && response[1].data.CsvImports) || []
                    break;
                default:
                    data['batch'] = [];
            }
            if (response[2] && response[2].data) {
                this.countriesList = (response[2].data.records || []).map(x => x.Name);
            }
            this.showView({
                form,
                data
            });
        } else {
            this.commonServiceFailureMethod({
                form,
                data: syncResponseObject.responses[0]
            });
        }
    };
    /**
     * @api : onError
     * Error thrown from catch block in component and shown on the form
     * @arg: err - object based on error
     * @return : NA
    */
    BillsPresentationController.prototype.onError = function (err) {
        let errMsg = JSON.stringify(err);
        errMsg.level = " BillsPresentation";
        // kony.ui.Alert(errMsg);
    };

    /**
     * @api : CSVToJSON
     * Used to covert the csv to json 
     * @param {*} csv 
     * return : array of records in JSON
     */
    BillsPresentationController.prototype.CSVToJSON = function (csv, form) {
        this.sNoSet.clear();
        this.billNumberSet.clear();
        this.csvRecordData = [];
        let csvErrorMessage = "";
        try {
            let rows = csv.trim().split(/\r?\n/);
            const headers = rows[0].trim().split(',');
            rows = rows.slice(1);
            const emptyRowRegex = /^,+$/;
            rows = rows.filter(row => !emptyRowRegex.test(row));
            if (rows.length < 1) {
                throw new Error("File has no records. Please add some records and upload again.");
            }
            if (rows.length > this.billConfig.csvBillLimit) {
                throw new Error(`File has more than ${this.billConfig.csvBillLimit} records.`);
            }
            const { length } = headers;
            for (const row of rows) {
                const values = row.trim().split(/,(?=(?:[^"]|"[^"]*")*$)/).map(str => str.replace(/"/g, ''));
                const [isValid, errorMessage] = this.validateRecord(headers, values);
                if (!isValid) {
                    this.csvRecordData.length = 0;
                    throw new Error(errorMessage);
                }
                const record = {};
                for (let j = 0; j < length; j++) {
                    const header = headers[j];
                    const [value] = values.slice(j, j + 1);
                    const { 0: dataType, 2: key } = this.csvRowData[header];
                    switch (dataType) {
                        case 'currencyAmount':
                            const [currency, amount] = value.trim().split(' ');
                            record.currency = currency;
                            record[key] = amount;
                            break;
                        case 'date':
                            const [month, day, year] = value.trim().split('/');
                            record[key] = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                            break;
                        default:
                            record[key] = value.trim();
                    }
                }
                this.csvRecordData.push(record);
            }
        } catch (error) {
            csvErrorMessage = error.message;
        }
        this.sNoSet.clear();
        this.billNumberSet.clear();
        this.showView({
            form,
            data: {
                parsedCSVData: this.csvRecordData,
                errorMessage: csvErrorMessage
            }
        });
    };
    /**
     * Method to cancel the bill
     * @param {object} params contains params to fetch the bills
     * @param {string} form form id
     */
    BillsPresentationController.prototype.cancelBill = function (params, form) {
        this.showProgressBar();
        this.billsManager.cancelBillRequest(params, this.requestBillCancelSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form }));
    };

    /**
     * Success callback for cancelling bill
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.requestBillCancelSuccess = function (form, response) {
        this.hideProgressBar();
        this.showView({
            form,
            data: {
                billCancelResponse: response
            }
        });
    };

    /**
     * Method to generateSampleCSVFile
     * @param {string} form form id
     */
    BillsPresentationController.prototype.generateSampleCSVFile = function (form) {
        try {
            const csvData = `${Object.keys(this.csvRowData).join(",")} \n`;
            const downloadLink = document.createElement("a");
            downloadLink.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvData));
            downloadLink.setAttribute("download", "sample.csv");
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (err) {
            this.showView({
                form,
                data: {
                    serverError: 'Error while generating CSV, please try again later.'
                }
            });
        }
    };

    /**
     * Method to validate uploaded csv file records
     * @param {array} title - list of column titles
     * @param {array} rowValues - list of all values wrt to the column titles
     */
    BillsPresentationController.prototype.validateRecord = function (title, rowValues) {
        const rowNum = this.csvRecordData.length + 1;
        try {
            for (let i = 0; i < title.length; i++) {
                const titleKey = title[i];
                const [expectedType, isMandatory, key] = this.csvRowData[titleKey];
                if (isMandatory && (!rowValues[i] || (typeof rowValues[i] === "string" && rowValues[i].trim() === ''))) {
                    throw new Error(`Error: Row ${rowNum} contains invalid data in column ${titleKey}. Please review and correct the data.`);
                }
                if ((titleKey === "S.no" && this.sNoSet.has(rowValues[i])) || (titleKey === "Bill number" && this.billNumberSet.has(rowValues[i]))) {
                    throw new Error(`Error: Row ${rowNum} contains invalid data in column ${titleKey}. Please review and correct the data.`);
                }
                if (titleKey === "S.no") {
                    this.sNoSet.add(rowValues[i]);
                } else if (titleKey === "Bill number") {
                    this.billNumberSet.add(rowValues[i]);
                }
                if (!rowValues[i] && !isMandatory) continue;
                switch (expectedType) {
                    case "number":
                        if (isNaN(Number(rowValues[i]))) {
                            throw new Error(`Error: Row ${rowNum} contains invalid data in column ${titleKey}. Please review and correct the data.`);
                        }
                        break;
                    case "string":
                        if (typeof rowValues[i] !== "string") {
                            throw new Error(`Error: Row ${rowNum} contains invalid data in column ${titleKey}. Please review and correct the data.`);
                        }
                        switch (key) {
                            case 'modeOfShipment':
                                if (!this.billConfig.modesOfShipment.includes(rowValues[i])) {
                                    throw new Error(`Error: Row ${rowNum} contains invalid data in column ${titleKey}. Please review and correct the data.`);
                                }
                                break;
                            case 'billType':
                                if (!this.billConfig.billTypes.includes(rowValues[i])) {
                                    throw new Error(`Error: Row ${rowNum} contains invalid data in column ${titleKey}. Please review and correct the data.`);
                                }
                                break;
                            case 'requestFinance':
                                if (!this.billConfig.requestFinance.includes(rowValues[i])) {
                                    throw new Error(`Error: Row ${rowNum} contains invalid data in column ${titleKey}. Please review and correct the data.`);
                                }
                                break;
                            case 'buyerSelection':
                                if (!this.billConfig.buyerSelection.includes(rowValues[i])) {
                                    throw new Error(`Error: Row ${rowNum} contains invalid data in column ${titleKey}. Please review and correct the data.`);
                                }
                                break;
                            default:
                                break;
                        }
                        break;
                    case "date":
                        const inputDate = new Date(rowValues[i]);
                        if (!(inputDate instanceof Date && !isNaN(inputDate) && inputDate.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0))) {
                            throw new Error(`Error: Row ${rowNum} contains invalid data in column ${titleKey}. Please review and correct the data.`);
                        }
                        break;
                    case "country":
                        if (!this.countriesList.includes(rowValues[i])) {
                            throw new Error(`Error: Row ${rowNum} contains invalid data in column ${titleKey}. Please review and correct the data.`);
                        }
                        break;
                    case "account":
                        const accounts = (this.accountManager.getInternalAccounts() || []).filter(acc => this.billConfig.accountTypes.includes(acc.accountType));
                        if (!accounts.some(account => account.accountID === rowValues[i])) {
                            throw new Error(`Error: Row ${rowNum} contains invalid data in column ${titleKey}. Please review and correct the data.`);
                        }
                        break;
                    case "currencyAmount":
                        if (!(/^[A-Z]{3} \d+(\.\d+)?$/.test(rowValues[i]) && this.billConfig.currencies.includes(rowValues[i].substring(0, 3)))) {
                            throw new Error(`Error: Row ${rowNum} contains invalid data in column ${titleKey}. Please review and correct the data.`);
                        }
                        break;
                    default:
                        break;
                }
            }
        } catch (error) {
            return [false, error.message];
        }
        return [true];
    };

    /**
     * Method to submit imported bill
     * @param {Number} index contains index of imported bill to submit
     * @param {string} form form id
     */
    BillsPresentationController.prototype.submitImportedBill = function (index, form) {
        this.showProgressBar();
        const { billReference, uploadedDocuments } = this.csvRecordData.bills[index];
        this.billsManager.submitImportedBill({ billReference, uploadedDocuments }, this.submitImportedBillSuccess.bind(this, form, index), this.commonServiceFailureMethod.bind(this, { form, method: 'submitImportedBill' }));
    };
    /**
     * Success callback for submitting imported bill
     * @param {Number} index contains index of imported bill to submit
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.submitImportedBillSuccess = function (form, index, response) {
        this.hideProgressBar();
        this.csvRecordData.bills[index] = Object.assign(this.csvRecordData.bills[index], response);
        this.showView({
            form,
            data: {
                submitImportedBill: true
            }
        });
    };
    /**
     * Method to submit imported CSV
     * @param {string} form form id
     */
    BillsPresentationController.prototype.submitImportedCsv = function (form) {
        this.showProgressBar();
        const payload = {
            fileReference: this.csvRecordData.fileReference
        };
        this.billsManager.submitImportedCsv(payload, this.submitCsvImportSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form }));
    };
    /**
     * Success callback for submitting imported CSV
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.submitCsvImportSuccess = function (form, response) {
        this.hideProgressBar();
        this.showView({
            form: 'frmCreateCsvBill',
            data: {
                submitImportedCsv: true
            }
        });
    };
    /**
     * Method to fetch imported CSVs
     * @param {object} params contains params to fetch the bill
     * @param {string} form form id
     */
    BillsPresentationController.prototype.getCsvImports = function (params, form) {
        this.showProgressBar();
        this.billsManager.fetchCsvImports(params, this.getCsvImportsSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form }));
    };
    /**
     * Success callback for fetching imported CSV
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.getCsvImportsSuccess = function (form, response) {
        this.hideProgressBar();
        this.showView({
            form,
            data: {
                CsvImports: (response && response.CsvImports) || []
            }
        });
    };
    /**
     * Method to fetch particular imported CSV
     * @param {object} params contains params to fetch the bill
     * @param {string} form form id
     */
    BillsPresentationController.prototype.getCsvImport = function (params, form) {
        this.showProgressBar();
        this.billsManager.fetchCsvImport(params, this.getCsvImportSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form }));
    };
    /**
     * Success callback for fetching a particular imported CSV
     * @param {string} form form id
     * @param {object} response contains service response data
     */
    BillsPresentationController.prototype.getCsvImportSuccess = function (form, response) {
        this.hideProgressBar();
        this.showView({
            form,
            data: {
                csvImport: response
            }
        });
    };

    /**
       * Method to delete the Csv Imports
       * @param {object} params - consist of payload to delete CsvImports
       * @param {string} frm - form name
       */
    BillsPresentationController.prototype.deleteCsvImports = function (params, form) {
        this.showProgressBar();
        this.billsManager.deleteCsvImports(params, this.deleteCsvImportsSuccess.bind(this, form), this.commonServiceFailureMethod.bind(this, { form }));
    };

    /**
       * Success callback for deleting the Csv Imports
       * @param {object} response - consist response of deleted CsvImports
       */
    BillsPresentationController.prototype.deleteCsvImportsSuccess = function (form, response) {
        this.hideProgressBar();
        this.showView({
            form,
            data: {
                deleteCsvImport: true
            }
        });
    };

    /**
     * Method to initiate SecureMessageMA
     * @param {Object} params - list of keys required for SecureMessageMA
     */
    BillsPresentationController.prototype.showMessagesScreen = function (params) {
        const messagesPresenter = applicationManager.getModulesPresentationController({
            appName: 'SecureMessageMA',
            moduleName: 'AlertsMsgsUIModule'
        });
        let contextObj = {};
        params.Category = "RCID_TSF_BILLS";
        contextObj.record = params;
        contextObj.show = "CreateNewMessage"
        contextObj.cancelCallback = false;
        params.tradeModule = true;
        messagesPresenter.showAlertsPage(kony.i18n.getLocalizedString("i18n.TradeSupplyFinance.supplyChainFinance"), contextObj);
    };

    return BillsPresentationController;
});