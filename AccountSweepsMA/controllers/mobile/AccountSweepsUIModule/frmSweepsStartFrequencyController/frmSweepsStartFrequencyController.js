define({ 
  /**
   * init is called when the form is loaded , initialisation happen here
   */
   init: function () {
    this.view.preShow = this.preShowForm;
    applicationManager.getPresentationFormUtility().initCommonActions(this, "NO", this.view.id, this.navigateCustomBack);
    this.presenter = applicationManager.getModulesPresentationController({"moduleName" : "AccountSweepsUIModule", "appName" : "AccountSweepsMA"});
  },


  /***
   * navigateCustomBack is triggered native/ ios back event 
   */
  navigateCustomBack: function() {
    this.presenter.commonFunctionForgoBack();
  },

  /***
   * native/ios cancel event 
   */
  cancelOnClick:function(){
    this.presenter.cancelCommon("frmAccountSweepsDashBoard");
  },
  /**
   * preShowForm is called when the form is pre loaded 
   */
  preShowForm: function(){
    if (kony.os.deviceInfo().name === "iPhone") {
      this.view.flxHeader.isVisible = false;
    } else{
      this.view.flxHeader.isVisible = true;
    }
    this.view.segOptions.onRowClick = this.segmentOnClick;
    this.view.customHeader.btnRight.onClick = this.cancelOnClick;
    this.view.customHeader.flxBack.onClick = this.navigateCustomBack;
    this.setSegFrequencyData();
    this.updateUI();
  },
  
  /**
   * OnRowClick of segement
   * returns string -Frequency 
   */
  segmentOnClick : function() {
    var freqValue = this.view.segOptions.data[this.view.segOptions.selectedIndex[1]].lblFrequency;
    this.presenter.setSweepsAttribute("frequency",freqValue.text);
    this.presenter.commonFunctionForNavigation("frmSweepsStartingFrom");
  },

  /**
  * @api : setSegFrequencyData
  * sets data to frequency segment
  * @return : NA
  */
  setSegFrequencyData: function () {
    let frequency = Object.values(this.presenter.frequencies);
    var segFrequencyData = [],i;
    this.view.segOptions.widgetDataMap = {
      "lblFrequency": "lblFrequency",
    };
    for (i = 0; i < frequency.length; i++) {
      segFrequencyData[i] = {
        "lblFrequency": {
          "text": kony.i18n.getLocalizedString(frequency[i]),
        }
      };
    }
    this.view.segOptions.setData(segFrequencyData);
  },

  /**
   * @api : updateUI
   * sets the selected data in screen
   * @return: NA
   */
   updateUI: function() {
    let index = this.presenter.getSelectedFrequencyIndex();
    this.view.segOptions.rowFocusSkin = "";
    this.view.segOptions.retainSelection = false;
    if (index !== null && index !== undefined && index !== "") {
      this.view.segOptions.rowFocusSkin = "sknFlxF9F9F9RoundedRadius35Px";
      this.view.segOptions.width = "90%";
      this.view.segOptions.centerX ="50%";
      this.view.segOptions.retainSelection = true;
	  this.view.segOptions.selectedRowIndex = [0, index];
    }
   }
});