define(['CommonUtilities', 'OLBConstants'], function (CommonUtilities, OLBConstants) {
  let segData = [], data, flow, presenter;
  const NA = kony.i18n.getLocalizedString("i18n.common.NA");
  return {
    /**
     * Method to set the context value
     */
    setContext: function (param) {
      try {
        data = param.data;
        flow = param.flow;
        presenter = applicationManager.getModulesPresentationController({ appName: 'TradeSupplyFinMA', moduleName: 'BillsUIModule' });
        this.setBillDetails();
      } catch (err) {
        const errorObj = {
          "level": "ComponentController",
          "method": "setContext",
          "error": err
        };
        this.onError(errorObj);
      }
    },
    /**
     * Method to set Bill details
     */
    setBillDetails: function () {
      const scope = this;
      segData = [];
      try {
        scope.view.segDetails.widgetDataMap = {
          'btnAction': 'btnAction',
          'flxAddress': 'flxAddress',
          'flxDocument': 'flxDocument',
          'flxDownloadImage': 'flxDownloadImage',
          'flxDropdown': 'flxDropdown',
          'flxMain': 'flxMain',
          'flxValue': 'flxValue',
          'lblAddress1': 'lblAddress1',
          'lblAddress2': 'lblAddress2',
          'lblAddress3': 'lblAddress3',
          'lblDocumentName': 'lblDocumentName',
          'lblDropdownIcon': 'lblDropdownIcon',
          'lblHeading': 'lblHeading',
          'lblKey': 'lblKey',
          'lblValue': 'lblValue'
        };
        if (flow !== 'create' && flow !== 'importCsv') {
          let billOverview = [
            {
              lblKey: {
                text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.billReferenceWithColon')
              },
              lblValue: {
                text: data.billReference || NA
              }
            }, {
              lblKey: {
                text: kony.i18n.getLocalizedString('i18n.TradeFinance.updatedOnWithColon')
              },
              lblValue: {
                text: data.updatedOn ? presenter.formatUtilManager.getFormattedCalendarDate(data.updatedOn) : NA
              }
            }, {
              lblKey: {
                text: kony.i18n.getLocalizedString('i18n.serviceRequests.Status:')
              },
              lblValue: {
                text: data.status || NA,
                skin: 'sknLblSSP42424215pxBold'
              }
            }
          ];
          if (data.status === OLBConstants.BILLS_STATUS.REJECTED) {
            billOverview.push({
              lblKey: {
                text: kony.i18n.getLocalizedString('i18n.TradeFinance.reasonForRejectionWithColon')
              },
              lblValue: {
                text: data.reasonForRejection || NA
              }
            });
          }
          if (data.hasOwnProperty('reasonForReturn')) {
            const returnHistory = JSON.parse(data.returnedHistory.replace(/'/g, '"'));
            this.setReturnedHistoryData(returnHistory);
            const lastReturn = returnHistory.slice(-1)[0];
            billOverview.push({
              lblKey: {
                text: kony.i18n.getLocalizedString('i18n.TradeFinance.reasonForReturnedWithColon')
              },
              lblValue: {
                width: kony.flex.USE_PREFERRED_SIZE,
                text: lastReturn.reasonForReturn || NA
              },
              btnAction: {
                left: '20dp',
                text: `${kony.i18n.getLocalizedString("i18n.TradeFinance.viewHistory")} (${returnHistory.length - 1})`,
                isVisible: returnHistory.length > 1,
                onClick: this.showReturnedHistory
              },
              flxValue: {
                width: kony.flex.USE_PREFERRED_SIZE,
                layoutType: kony.flex.FLOW_HORIZONTAL
              }
            });
          }
          segData.push([
            {
              flxMain: {
                isVisible: false
              }
            }, billOverview
          ]);
        }
        if (data.cancellationStatus) {
          const cancellationDetails = [
            {
              lblKey: {
                text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.cancellationStatusWithColon')
              },
              lblValue: {
                text: data.cancellationStatus || NA
              }
            }, {
              lblKey: {
                text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.reasonforCancellationWithColon')
              },
              lblValue: {
                text: data.reasonForCancellation || NA
              }
            }
          ];
          if (data.cancellationDocuments) {
            const cancellationDocuments = JSON.parse(data.cancellationDocuments.replace(/'/g, '"'));
            for (let i = 0; i < cancellationDocuments.length; i++) {
              cancellationDetails.push({
                lblKey: {
                  text: i === 0 ? kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.cancellationDocumentsOptionalWithColon') : ''
                },
                lblValue: {
                  text: cancellationDocuments[i].documentName || NA,
                  skin: 'sknLbl4176A4SSP15Px'
                },
                flxValue: {
                  cursorType: 'pointer',
                  onClick: () => presenter.downloadDocument(cancellationDocuments[i].documentReference, kony.application.getCurrentForm().id)
                },
                flxMain: {
                  height: (i === cancellationDocuments.length - 1) ? '40dp' : '30dp'
                }
              });
            }
          }
          segData.push([
            {
              lblHeading: {
                text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.cancellationDetails')
              },
              lblDropdownIcon: {
                text: 'P'
              },
              flxMain: {
                bottom: '20dp'
              }
            },
            cancellationDetails
          ]);
        }
        let billDetails = [
          {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.billNameOptionalWithColon')
            },
            lblValue: {
              text: data.billName || NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.billNumberWithColon')
            },
            lblValue: {
              text: data.billNumber || NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.billDateWithColon')
            },
            lblValue: {
              text: data.billDate ? presenter.formatUtilManager.getFormattedCalendarDate(data.billDate) : NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeFinance.billTypeWithColon')
            },
            lblValue: {
              text: data.billType || NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.payments.dueDateWithColon')
            },
            lblValue: {
              text: data.dueDate ? presenter.formatUtilManager.getFormattedCalendarDate(data.dueDate) : NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeFinance.paymentTermsWithColon')
            },
            lblValue: {
              text: data.paymentTerms || NA
            }
          }
        ];
        let amountAccountDetails = [
          {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.wealth.amountColon')
            },
            lblValue: {
              text: (data.currency && data.amount) ? `${data.currency} ${presenter.formatUtilManager.formatAmount(data.amount)}` : NA
            },
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.accountReceivableWithColon')
            },
            lblValue: {
              text: data.receivableAccount ? presenter.getAccountDisplayName(data.receivableAccount) : NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.needFinanceWithColon')
            },
            lblValue: {
              text: data.requestFinance || NA
            }
          }
        ];
        let buyerDetails = [
          {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.buyerNameWithColon')
            },
            lblValue: {
              text: data.buyerName || NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.buyerAddressWithColon')
            },
            lblValue: {
              text: data.buyerAddress || NA
            }
          }
        ];
        let goodsShipmentDetails = [
          {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.goodsDescriptionWithColon')
            },
            lblValue: {
              text: data.goodsDescription || NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.shipmentDateWithColon')
            },
            lblValue: {
              text: data.shipmentDate ? presenter.formatUtilManager.getFormattedCalendarDate(data.shipmentDate) : NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.shipmentAndTrackingWithColon')
            },
            lblValue: {
              text: data.shipmentTrackingDetails || NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.countryOfOriginWithColon')
            },
            lblValue: {
              text: data.countryOfOrigin || NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.countryOfDestinationWithColon')
            },
            lblValue: {
              text: data.countryOfDestination || NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.modeOfShipmentOptionalWithColon')
            },
            lblValue: {
              text: data.modeOfshipment || NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.portOfDischargeOptionalWithColon')
            },
            lblValue: {
              text: data.portOfDischarge || NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.portOfLoadingOptionalWithColon')
            },
            lblValue: {
              text: data.portOfLoading || NA
            }
          }, {
            lblKey: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.finalDestinationOptionalWithColon')
            },
            lblValue: {
              text: data.finalDestination || NA
            }
          }
        ];
        let documentDetails = [];
        if (data.uploadedDocuments) {
          const documents = JSON.parse(data.uploadedDocuments.replace(/'/g, '"'));
          for (let i = 0; i < documents.length; i++) {
            documentDetails.push({
              lblKey: {
                text: i === 0 ? kony.i18n.getLocalizedString('i18n.TradeFinance.uploadedDocumentsWithColon') : ''
              },
              lblValue: {
                text: documents[i].documentName || NA,
                skin: 'sknLbl4176A4SSP15Px'
              },
              flxValue: {
                cursorType: 'pointer',
                onClick: () => presenter.downloadDocument(documents[i].documentReference, kony.application.getCurrentForm().id)
              },
              flxMain: {
                height: (i === documents.length - 1) ? '40dp' : '30dp'
              }
            });
          }
        }
        documentDetails.push({
          lblKey: {
            text: kony.i18n.getLocalizedString('i18n.TradeFinance.messageToBankOptionalWithColon')
          },
          lblValue: {
            text: data.messageToBank || NA
          }
        });
        segData.push([
          {
            lblHeading: {
              text: kony.i18n.getLocalizedString('kony.mb.BillPay.BillDetails')
            },
            lblDropdownIcon: {
              text: 'P'
            },
            flxMain: {
              bottom: '20dp',
              isVisible: flow !== 'create'
            }
          },
          billDetails
        ], [
          {
            lblHeading: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.amountAmpersandAccount')
            },
            lblDropdownIcon: {
              text: 'P'
            },
            flxMain: {
              bottom: '20dp'
            }
          },
          amountAccountDetails
        ], [
          {
            lblHeading: {
              text: kony.i18n.getLocalizedString('i18n.TradeFinance.buyer')
            },
            lblDropdownIcon: {
              text: 'P'
            },
            flxMain: {
              bottom: '20dp'
            }
          },
          buyerDetails
        ], [
          {
            lblHeading: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.goodsAndShipment')
            },
            lblDropdownIcon: {
              text: 'P'
            },
            flxMain: {
              bottom: '20dp'
            }
          },
          goodsShipmentDetails
        ], [
          {
            lblHeading: {
              text: kony.i18n.getLocalizedString('i18n.TradeSupplyFinance.documentsAndMessageToBank')
            },
            lblDropdownIcon: {
              text: 'P'
            },
            flxMain: {
              bottom: '20dp'
            }
          },
          documentDetails
        ]);
        segData.forEach(section => {
          let rowCount = 0;
          section[1].forEach(row => {
            if (row.lblValue && row.lblValue.text === NA) {
              row.flxMain = { isVisible: false };
              rowCount++;
            }
            if (!row.lblValue) row.lblValue = { isVisible: false };
            if (!row.btnAction) row.btnAction = { isVisible: false };
            if (!row.flxDocument) row.flxDocument = { isVisible: false };
            if (!row.flxAddress) row.flxAddress = { isVisible: false };
          });
          if (rowCount === section[1].length) section[0] = { flxMain: { isVisible: false } }
        });
        scope.view.segDetails.removeAll();
        scope.view.segDetails.setData(segData);
      } catch (err) {
        const errorObj = {
          "level": "ComponentController",
          "method": "setBillDetails",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
     * @api : toggleSectionHeader
     * Triggerd on click of dropdown in segment
     * @return : NA
     */
    toggleSectionHeader: function ({ sectionIndex, rowIndex }) {
      try {
        let newSegData = JSON.parse(JSON.stringify(this.view.segDetails.data));
        if (newSegData[sectionIndex][0]['lblDropdownIcon']['text'] === 'O') {
          newSegData[sectionIndex][0]['lblDropdownIcon']['text'] = 'P';
          newSegData[sectionIndex][1] = segData[sectionIndex][1];
        } else {
          newSegData[sectionIndex][0]['lblDropdownIcon']['text'] = 'O';
          newSegData[sectionIndex][1] = [];
        }
        for (let i = 0; i < segData.length; i++) {
          if (newSegData[i][1].length > 0) {
            newSegData[i][1] = segData[i][1];
          }
        }
        segData[sectionIndex][0]['lblDropdownIcon']['text'] = newSegData[sectionIndex][0]['lblDropdownIcon']['text']
        this.view.segDetails.setData(newSegData);
      } catch (err) {
        const errorObj = {
          "level": "ComponentController",
          "method": "toggleSectionHeader",
          "error": err
        };
        this.onError(errorObj);
      }
    },
    setReturnedHistoryData: function (returnedHistoryData) {
      this.view.flxReturnedHistoryMain.doLayout = CommonUtilities.centerPopupFlex;
      this.view.lblReturnedHistory.text = `${kony.i18n.getLocalizedString("i18n.TradeFinance.ReturnedbyBank")} - ${kony.i18n.getLocalizedString('i18n.TradeFinance.viewHistory')} (${returnedHistoryData.length - 1})`;
      this.view.segReturnedHistory.widgetDataMap = {
        "lblReturnBank": "lblReturnBank",
        "lblReturnDate": "lblReturnDate",
        "lblKey1": "lblKey1",
        "lblValue1": "lblValue1",
        "lblKey2": "lblKey2",
        "lblValue2": "lblValue2",
        "lblKey3": "lblKey3",
        "lblValue3": "lblValue3",
      };
      let segReturnedHistoryData = [];
      for (let i = returnedHistoryData.length - 2; i >= 0; i--) {
        const record = returnedHistoryData[i];
        segReturnedHistoryData.push({
          "lblReturnBank": {
            "text": `${kony.i18n.getLocalizedString("i18n.TradeFinance.ReturnedbyBank")} (${i + 1})`
          },
          "lblReturnDate": {
            "text": record.returnedTimeStamp ? `${presenter.formatUtilManager.getFormattedCalendarDate(record.returnedTimeStamp)}, ${new Date(record.returnedTimeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}` : NA
          },
          "lblKey1": {
            "text": kony.i18n.getLocalizedString("i18n.TradeFinance.reasonForReturnedWithColon")
          },
          "lblValue1": {
            "text": record.reasonForReturn || NA
          },
          "lblKey2": {
            "text": kony.i18n.getLocalizedString("i18n.TradeFinance.returnMessageToBankWithColon")
          },
          "lblValue2": {
            "text": record.messageToBank || NA
          },
          "lblKey3": {
            "text": kony.i18n.getLocalizedString("i18n.TradeFinance.corporateUserNameWithColon")
          },
          "lblValue3": {
            "text": record.corporateUserName || NA
          }
        });
      }
      this.view.segReturnedHistory.setData(segReturnedHistoryData);
    },
    showReturnedHistory: function () {
      try {
        let form = kony.application.getCurrentForm();
        let popupObj = this.view.flxReturnedHistory.clone();
        form.add(popupObj);
        popupObj.isVisible = true;
        popupObj.height = "100%";
        popupObj.flxReturnedHistoryMain.flxReturnedHistoryHeader.lblCross.onTouchEnd = () => form.remove(popupObj);
        this.view.forceLayout();
      } catch (err) {
        const errorObj = {
          "level": "ComponentController",
          "method": "showReturnedHistory",
          "error": err
        };
        this.onError(errorObj);
      }
    },
    /**
     * @api : onError
     * Error thrown from catch block in component and shown on the form
     * @return : NA
     */
    onError: function (err) {
      kony.print(JSON.stringify(err));
    }
  };
});