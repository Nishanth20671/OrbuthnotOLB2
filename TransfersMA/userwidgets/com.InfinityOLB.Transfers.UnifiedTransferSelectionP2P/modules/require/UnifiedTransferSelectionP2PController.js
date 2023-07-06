define(['./UnifiedTransferSelectionP2PBusinessController','./UnifiedTransferSelectionP2PStore'], function(BusinessController,UnifiedTransferSelectionP2PStore) {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this._dataMapping = {};
      this.businessController = new BusinessController();
      UnifiedTransferSelectionP2PStore.subscribe(this.render.bind(this));
      this.store = UnifiedTransferSelectionP2PStore;
      this.businessController.store = this.store;
      this.collectionObj = UnifiedTransferSelectionP2PStore.getState();
      this.richTextId = " ";
    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
            defineGetter(this, 'dataMapping', () => {
                return this._dataMapping;
            });
            defineSetter(this, 'dataMapping', value => {
                this._dataMapping = value;
            });
            defineGetter(this, 'rtxtId', () => {
                return this._rtxtId;
            });
            defineSetter(this, 'rtxtId', value => {
                this._rtxtId = value;
                this.richTextId = this._rtxtId;
            });
        },
    /**
	* @api : preShow
 	* Gets invoked initially before rendering of UI
	* @return : NA
	*/
    preShow: function() {
      var scope = this;
      try {
        this.businessController.setDataInCollection(this.context);
        this.initActionsOfButtons();
        this.bindFieldsData();
        this.view.flxPopup.onKeyPress = this.onKeyPressCallBack;
        this.view.flxMainContainer.doLayout = this.centerPopupFlex;
        this.view.flxScrollMainContainer.accessibilityConfig = {
          "a11yARIA": {
            tabindex: -1,
            "aria-live": "off"
          }
        }
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "preShow",
          "error": err
        };
        scope.onError(errorObj);
      }
    },

    setAccessibility: function (a11yLabel) {
      this.view.btnAction1.accessibilityConfig = {
        "a11yLabel": a11yLabel.btnAction1,
        "a11yARIA": {
          role: "link"
        }
      }
      this.view.btnAction2.accessibilityConfig = {
        "a11yLabel": a11yLabel.btnAction2,
        "a11yARIA": {
          role: "link"
        }
      }
    },

    centerPopupFlex: function (flxPopupWidget) {
      flxPopupWidget.info = flxPopupWidget.frame;
      if (kony.os.deviceInfo().screenHeight > flxPopupWidget.info.height) {
        flxPopupWidget.top = "";
        flxPopupWidget.centerY = "50%";
      } else {
        flxPopupWidget.top = "20px";
        flxPopupWidget.centerY = "";
      }
    },
    
    /**
     * @api : setContext
     * Method to set the context value 
     * @return : NA
     */
    setContext: function(context) {
      var scope = this;
      try {
        this.context = context;
      }
      catch (err) {
        var errorObj = {
          "level": "ComponentController",
          "method": "SetContext",
          "error": err
        };
        scope.onError(errorObj);
      }
    },
    /**
	* @api : initActionsOfButtons
 	* Actions of buttons are initialized
	* @return : NA
	*/  
    initActionsOfButtons: function() {
      var scope = this;
      this.view.rtLearnMore.onClick = this.showDescription.bind(this);
      var btnAction1=scope.businessController.getDataBasedOnDataMapping("btnActions1",scope.dataMapping);     
      scope.view.btnAction1.onClick =function()
      {
        scope.buttonActionHandling(btnAction1);
      }
        this.view.flxCloseIcon.onClick = this.closeDescription.bind(this);
      this.view.btnClosePopup.onClick = this.closeDescription.bind(this);
    },
    /**
	* @api : render
	* This method will be invoked when collection is updated to refresh UI
	* @return : NA
	*/
    render: function() {
      this.collectionObj = UnifiedTransferSelectionP2PStore.getState();
      var dataMapping = this.dataMapping;
    },
    /**
     * @api : getMappedValueForWidget
     * Get mapped data of the corresponding widget
     * @return : mapped value
     */
    getMappedValueForWidget : function(widget, dataMapping) {
      for(var record in dataMapping) {
        var keyValues = dataMapping[record];
        for(var key in keyValues) {
          if(widget === key) {
            var fieldValue = dataMapping[record][widget];
            fieldValue = fieldValue.split(".")[3].replace("}","");
            return fieldValue;
          }
        }
      }
    },
    /**
     * @api : bindFieldsData
     * Binds the view data from dataMapping
     * @return : NA
     */
    bindFieldsData : function(){
      this.view.btnAction1.text=this.businessController.getDataBasedOnDataMapping("btnActions1", this._dataMapping);   
      this.view.imgTransactionIcon.src = this.businessController.getDataBasedOnDataMapping("imgTransactionIcon", this._dataMapping);
      this.view.lblTransactionType.text = this.businessController.getDataBasedOnDataMapping("lblTransactionType", this._dataMapping);
      var descriptionText = this.businessController.getDataBasedOnDataMapping("rtLearnMore", this._dataMapping);
      this.view.rtLearnMore.text =this.getShortDescription(descriptionText);
      var btn1Entitlement = this.businessController.isEntitled(this.businessController.getDataBasedOnDataMapping("btnAction1", this._dataMapping));
       if(btn1Entitlement){
        this.view.btnAction1.setVisibility(true);     
       
      }
      else if(btn1Entitlement){
        this.view.btnAction1.centerX = "50%";
        this.view.btnAction1.setVisibility(true);
        this.view.btnAction2.setVisibility(false);
        this.view.flxSeparator2.setVisibility(false);
      }
     
      else {
        this.hideTile();
      }
      this.view.flxTransferTypes.forceLayout();
    },

    onKeyPressCallBack: function(eventObject, eventPayload) {
      if(eventPayload.keyCode === 27){
        if(this.view.flxDescHeader.isVisible === true){
          this.closeDescription();  
          this.setRichTextFocus();
        }
      }
    },

    /**
     * @api : getShortDescription
     * Get formatted short description with the link
     * @return : short text
     */
    getShortDescription : function(description) {
      var descriptionRender;
      if(kony.application.getCurrentBreakpoint()===640){
        descriptionRender = 120;
      }else{
        descriptionRender = 60;
      }
      var moreLink  = "<a id= "+this.richTextId+" tabindex = 0 role = button href = "+"#>"+this.businessController.getDataBasedOnDataMapping("MoreLink", this._dataMapping)+"</a>"; 
      var shortText = description.slice(0,descriptionRender) + "." + moreLink;       
      return shortText;
    },

    setRichTextFocus: function(){
      document.getElementById(this.richTextId).focus();
    },

    /**
     * @api : showDescription
     * Shows the description popup on click of learn more link
     * @return : NA
     */
    showDescription : function(){
      var form = kony.application.getCurrentForm();	
      this.view.lblTransactionTypePopup.text = this.businessController.getDataBasedOnDataMapping("lblTransactionTypePopup", this._dataMapping);
      this.view.rtPopupDescription.text = this.businessController.getDataBasedOnDataMapping("rtPopupDescription", this._dataMapping);
      this.view.lblTermsConditionsTitle.text = this.businessController.getDataBasedOnDataMapping("lblTermsConditionsTitle", this._dataMapping);
      this.view.rtTermsConditions.text = this.businessController.getDataBasedOnDataMapping("rtTermsConditions", this._dataMapping);
      this.popupObj = this.view.flxPopup.clone();	
      form.add(this.popupObj);
      this.popupObj.isVisible = true;
      this.view.flxTransferTypes.forceLayout();  
      this.popupObj.flxScrollMainContainer.flxMainContainer.flxDescHeader.flxCloseIcon.setActive(true);
      this.popupObj.flxScrollMainContainer.accessibilityConfig = {
        "a11yARIA": {
          tabindex: -1,
          "aria-live": "off"
        }
      }
      this.popupObj.accessibilityConfig = {
        "a11yARIA": {
          tabindex: -1
        }
      }
    },
    /**
     * @api : closeDescription
     * Closes the description popup on click of close
     * @return : NA
     */
    closeDescription : function(){
      var currForm = kony.application.getCurrentForm();
      currForm.remove(this.popupObj);
      this.view.flxPopup.setVisibility(false);
      this.setRichTextFocus();
    },
    
    /**
     * @api : buttonActionHandling
     * Handles the action of btnAction1 and btnAction2
     * @return : NA
     */
    buttonActionHandling : function(clickedButton){
      var transferType=this.businessController.getDataBasedOnDataMapping("transferType", this._dataMapping);
      var selectedTransferType = 
          {
            "transferType" : transferType,
            "clickedButton" : clickedButton
          };
      this.transferTypeDetails(selectedTransferType);
    }
  };
});