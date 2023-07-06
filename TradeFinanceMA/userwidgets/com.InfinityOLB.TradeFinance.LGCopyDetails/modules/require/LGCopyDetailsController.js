define(['FormControllerUtility'], function (FormControllerUtility) {
  const fontIconConstants = {
    'radioSelected': 'M',
    'radioUnselected': 'L'
  };
  const skinConstants = {
    'radioSelected': 'ICSknLblRadioBtnSelectedFontIcon003e7520px',
    'radioUnselected': 'ICSknLblRadioBtnUnelectedFontIcona0a0a020px'
  };
  let prevIdx;
  let data;
  const fields = {
    'issuedGuarantee': ['beneficiaryName', 'guaranteesSRMSId', 'productType', 'issueDate'],
    'issuedGuaranteeAmedment': ['beneficiaryName', 'guaranteesSRMSId', 'productType', 'issueDate'],
    'issuedClaim': ['applicantName', 'guaranteeSrmsId', 'productType', 'expectedIssueDate'],
    'outwardCollectionAmendment': ['draweeName', 'collectionReference', 'tenorType', 'createdOn'],
    'outwardCollection': ['draweeName', 'documentNo', 'createdOn', 'formattedAmount'],
    'exportDrawing': ['applicant', 'lcReferenceNo', 'lcType', 'lcUpdatedOn'],
    'importLCAmendment': ['beneficiaryName', 'lcReferenceNo', 'paymentTerms', 'lcCreatedOn'],
    'importLC': ['beneficiaryName', 'lcReferenceNo', 'paymentTerms', 'issueDate']
  };
  return {
    preShow: function () {
      const scope = this;
      this.view.txtSearchBox.text = "";
      FormControllerUtility.disableButton(this.view.btnCopyDetails);
      this.view.txtSearchBox.onTextChange = function () {
        scope.view.lblCrossIcon.setVisibility(scope.view.txtSearchBox.text !== '');
      };
      this.view.txtSearchBox.onDone = function () {
        FormControllerUtility.disableButton(scope.view.btnCopyDetails);
        applicationManager.getPresentationUtility().getController(kony.application.getCurrentForm().id, true).getSearchedRecords();
      };
      this.view.lblCrossIcon.onTouchEnd = function () {
        scope.view.txtSearchBox.text = '';
        scope.view.lblCrossIcon.setVisibility(false);
        FormControllerUtility.disableButton(scope.view.btnCopyDetails);
        applicationManager.getPresentationUtility().getController(kony.application.getCurrentForm().id, true).getSearchedRecords();
      };
    },
    setData: function (records, context) {
      if (!records || records.length === 0) {
        this.view.flxSegDetails.setVisibility(false);
        this.view.flxNoTransactions.setVisibility(true);
        this.view.flxButton.setVisibility(false);
        return;
      }
      this.view.flxSegDetails.setVisibility(true);
      this.view.flxNoTransactions.setVisibility(false);
      this.view.flxButton.setVisibility(true);
      const scope = this;
      const NA = kony.i18n.getLocalizedString("i18n.common.NA");
      const formatUtilManager = applicationManager.getFormatUtilManager();
      let segData = [];
      prevIdx = undefined;
      data = records;
      this.view.segLGCopyDetails.widgetDataMap = {
        lblField1Icon: 'lblField1Icon',
        lblField2: 'lblField2',
        lblField2: 'lblField2',
        lblField3: 'lblField3',
        lblField4: 'lblField4',
        lblField5: 'lblField5',
      };
      data.forEach((record, idx) => {
        segData.push({
          'lblField1Icon': {
            text: fontIconConstants.radioUnselected,
            skin: skinConstants.radioUnselected,
            cursorType: 'pointer',
            onTouchEnd: scope.toggleRadioButton.bind(scope, idx)
          },
          'lblField2': {
            text: record[fields[context][0]] || NA
          },
          'lblField3': {
            text: record[fields[context][1]] || NA
          },
          'lblField4': {
            text: record[fields[context][2]] || NA
          },
          'lblField5': {
            text: record[fields[context][3]] ? (context !== 'outwardCollection' ? formatUtilManager.getFormattedCalendarDate(record[fields[context][3]]) : record[fields[context][3]]) : NA
          }
        });
      });
      this.view.segLGCopyDetails.setData(segData);
    },
    toggleRadioButton: function (idx) {
      let segData = this.view.segLGCopyDetails.data;
      if (!kony.sdk.isNullOrUndefined(prevIdx)) {
        let prevIdxData = segData[prevIdx];
        prevIdxData['lblField1Icon'].text = fontIconConstants.radioUnselected;
        prevIdxData['lblField1Icon'].skin = skinConstants.radioUnselected;
        this.view.segLGCopyDetails.setDataAt(prevIdxData, prevIdx);
      }
      let currIdxData = segData[idx];
      currIdxData['lblField1Icon'].text = fontIconConstants.radioSelected;
      currIdxData['lblField1Icon'].skin = skinConstants.radioSelected;
      this.view.segLGCopyDetails.setDataAt(currIdxData, idx);
      prevIdx = idx;
      FormControllerUtility.enableButton(this.view.btnCopyDetails);
    },
    getData: function () {
      return data[prevIdx];
    }
  };
});