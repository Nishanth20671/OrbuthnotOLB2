define(function () {
  const skins = {
    circleIncomplete: "sknFlxInactiveCircleRoadmap",
    circleInProgress: "sknFlxInProgressCircleRoadmap",
    rowNumberIncomplete: "ICSknLabelSSPRegular42424215px",
    currentRow: "sknFlxInProgressRowRoadmap",
    rowDone: "ICSknLabelSSPRegular42424215px",
    rowIncomplete: "ICSknLbl949494SSPR15px",
    rowInProgress: "ICSknLabelSSPRegular42424215px"
  };
  const fontIcons = {
    'chevronUp': 'P',
    'chevronDown': 'O'
  };
  return {
    preShow: function () {
      this.view.flxDropdown.onClick = this.toggleDropdown;
      this.view.segSections.widgetDataMap = {
        "imgRowDone": "imgRowDone",
        "lblRowNumber": "lblRowNumber",
        "flxCurrentRowIndicator": "flxCurrentRowIndicator",
        "flxRowCircle": "flxRowCircle",
        "lblRowName": "lblRowName",
        "lblInProgress": "lblInProgress",
        "imgDottedLine": "imgDottedLine",
        "flxRowContent": "flxRowContent",
      };
    },
    /**
     * Method to update the status bar UI
     */
    setData: function (data) {
      this.view.lblApplicationStartDate.text = `${kony.i18n.getLocalizedString('i18n.TradeFinance.startedOnWithColon')} ${applicationManager.getFormatUtilManager().getFormattedCalendarDate(new Date())}`;
      this.view.lblCoptyStatus.setVisibility(data.showCopyDetails || false);
      let segData = [], currentRow = -1;
      for (let i = 0; i < data.length; i++) {
        segData.push(this._getRowData(data[i], i + 1));
        if (data[i]["currentRow"]) {
          currentRow = i;
        }
      }
      segData[0]["imgDottedLine"] = {
        isVisible: false
      };
      if (currentRow >= 0) {
        segData[currentRow]["flxCurrentRowIndicator"] = {
          skin: skins.currentRow
        };
        segData[currentRow]["flxRowContent"] = {
          top: "0dp"
        };
        segData[currentRow]["height"] = "55dp";
      }
      this.view.segSections.setData(segData);
    },
    /**
     * Get row data json for give type of row
     * @param {json} rowData data to be filled in row
     * @param {Number} rowNumber  number of the current row
     */
    _getRowData: function (rowData, rowNumber) {
      switch (rowData.rowStatus) {
        case "done":
          return this._getDoneRow(rowData);
        case "Inprogress":
          return this._getInProgressRow(rowData, rowNumber);
        default:
          return this._getIncompleteRow(rowData, rowNumber);
      }
    },
    /**	
     * Get row data json for done row
     * @param {json} data data for done row
     */
    _getDoneRow: function (data) {
      let rowData = {
        'lblRowName': {
          text: data["rowLabel"],
          skin: skins.rowDone
        },
        'imgRowDone': {
          src: "numeringdone.png",
          isVisible: true
        },
        'lblRowNumber': "",
        'flxRowCircle': {
          skin: "slFbox"
        },
        'lblInProgress': "",
        'flxCurrentRowIndicator': {
          skin: "slFbox"
        },
        'imgDottedLine': {
          isVisible: true
        },
        'flxRowContent': {
          top: "5dp"
        },
        'onClick': data["onClick"]
      };
      return rowData;
    },
    /**
     * Get row data json for inprogress row
     * @param {json} data data for inprogress row
     * @param {Number} rowNumber number of the current row
     */
    _getInProgressRow: function (data, rowNumber) {
      let rowData = {
        'lblRowName': {
          text: data["rowLabel"],
          skin: skins.rowInProgress
        },
        'imgRowDone': {
          src: "useractions.png",
          isVisible: data.rowLabel === "User Actions"
        },
        'lblRowNumber': {
          text: "" + rowNumber
        },
        'flxRowCircle': {
          skin: skins.circleInProgress
        },
        'lblInProgress': {
          text: "In Progress",
          right: "20dp"
        },
        'flxCurrentRowIndicator': {
          skin: "slFbox"
        },
        'imgDottedLine': {
          isVisible: true
        },
        'flxRowContent': {
          top: "5dp"
        },
        'onClick': data["onClick"]
      };
      return rowData;
    },
    /**
     * Get row data json for incomplete row
     * @param {json} data data for incomplete row
     * @param {Number} rowNumber number of the current row
     */
    _getIncompleteRow: function (data, rowNumber) {
      let rowData = {
        'lblRowName': {
          text: data["rowLabel"],
          skin: skins.rowIncomplete
        },
        'imgRowDone': {
          isVisible: false
        },
        'lblRowNumber': {
          text: "" + rowNumber,
          skin: skins.rowNumberIncomplete
        },
        'flxRowCircle': {
          skin: skins.circleIncomplete
        },
        'lblInProgress': "",
        'flxCurrentRowIndicator': {
          skin: "slFbox"
        },
        'imgDottedLine': {
          isVisible: true,
          src: "dottedline.png"
        },
        'flxRowContent': {
          top: "5dp"
        },
        'onClick': data["onClick"]
      };
      return rowData;
    },
    /**
     * Method to toggle the dropdown
     */
    toggleDropdown: function () {
      if (this.view.flxSegment.isVisible) {
        this.view.flxSegment.setVisibility(false);
        this.view.lblDropdown.text = fontIcons.chevronDown;
      } else {
        this.view.flxSegment.setVisibility(true);
        this.view.lblDropdown.src = fontIcons.chevronUp;
      }
    }
  };
});
