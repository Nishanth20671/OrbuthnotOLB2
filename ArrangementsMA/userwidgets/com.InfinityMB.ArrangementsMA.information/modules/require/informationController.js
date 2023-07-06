/**
 * Component controller
 *
 * @author KH2144
 */
define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this._headerText = "";
      this._infoText = "";
      this._crossButtonFontIcon = "";
      this._sknHeader = "";
      this._sknInfo = "";
    },

    initGettersSetters: function() {
            defineSetter(this, 'headerText', function (val) {
                if (typeof val === 'string' && val !== '') {
                    this._headerText = val;
                }
            });
            defineGetter(this, 'headerText', function () {
                return this._headerText;
            });
            defineSetter(this, 'infoText', function (val) {
                if (typeof val === 'string' && val !== '') {
                    this._infoText = val;
                }
            });
            defineGetter(this, 'infoText', function () {
                return this._infoText;
            });
            defineSetter(this, 'crossButtonFontIcon', function (val) {
                if (typeof val === 'string' && val !== '') {
                    this._crossButtonFontIcon = val;
                }
            });
            defineGetter(this, 'crossButtonFontIcon', function () {
                return this._crossButtonFontIcon;
            });
            defineSetter(this, 'sknHeader', function (val) {
                if (typeof val === 'string' && val !== '') {
                    this._sknHeader = val;
                }
            });
            defineGetter(this, 'sknHeader', function () {
                return this._sknHeader;
            });
            defineSetter(this, 'sknInfo', function (val) {
                if (typeof val === 'string' && val !== '') {
                    this._sknInfo = val;
                }
            });
            defineGetter(this, 'sknInfo', function () {
                return this._sknInfo;
            });
        },

    /**
     * Component setData
     * Set values for properties
     * @param: flexData{JSONObject} - values for configuration
     */
    setData: function(flexData){
      var scope = this;
      scope._headerText = flexData.headerText;
      scope._infoText = flexData.infoText;
      scope._sknHeader = flexData.headerSkin;
      scope._sknInfo = flexData.infoSkin;
      scope._crossButtonFontIcon = flexData.crossButtonFontIcon;
      this.setUI();
    },

    setFocusMethod: function(){
      this.view.btnCross.setFocus(true);
    },
    /**
     * Component setUI
     * Assign the values based on the properties configured
     */
    setUI: function(){
      var scope = this;
      if(scope._headerText){
        scope.view.lblInfo.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.Info");
      }else{
        scope.view.lblInfo.text = "";
      }
      if(scope._infoText){
        scope.view.RichTextInfo.text = kony.i18n.getLocalizedString("i18n.iIcon.accounts.SavingCurrentAccount");
      }else{
        scope.view.RichTextInfo.text = "";
      }
      if(scope._sknHeader){
        scope.view.lblInfo.skin = scope._sknHeader;
      }
      if(scope._sknInfo){
        scope.view.RichTextInfo.skin = scope._sknInfo;
      }
      if(scope._crossButtonFontIcon){
        scope.view.btnCross.text = scope._crossButtonFontIcon;
        scope.view.btnCross.setVisibility(true);
      }
      else{
        scope.view.btnCross.setVisibility(false);
      }
      scope.view.lblInfo.accessibilityConfig = {
        "a11yARIA": {
            tabindex: -1
        }
      }
      scope.view.RichTextInfo.accessibilityConfig = {
        "a11yARIA": {
            tabindex: -1
        }
      }
      scope.view.btnCross.accessibilityConfig = {
        "a11yLabel": "close",
        "a11yARIA": {
          "aria-live": "off"
        }
      }
      scope.view.imgToolTip.accessibilityConfig = {
        "a11yARIA": {
          tabindex: -1
        }
      }
      scope.view.flxInformationText.accessibilityConfig = {
        "a11yARIA": {
          tabindex: -1,
          "aria-live": "off"
        }
      }
    }
  };
});