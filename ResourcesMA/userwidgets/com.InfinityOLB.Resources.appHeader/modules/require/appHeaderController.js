define(["./appHeaderStore", "./appHeaderBusinessController", "ComponentUtility", "TopbarConfig", "ViewConstants", "ApplicationManager","CommonUtilities"], function(appHeaderStore, BusinessController, ComponentUtility, TopbarConfig, ViewConstants, ApplicationManager,CommonUtilities) {
  var applicationManager = ApplicationManager.getApplicationManager();
  var configCheck = 0;
  var configurationManager = null;
  var animationConfiguration = {
    duration: 0.3,
    fillMode: kony.anim.FILL_MODE_FORWARDS,
  };
  var MIN_ENTITIES_RECORDS_TO_ALLOW_SEARCH = 5;
  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this.businessController = new BusinessController(this);
      this.businessController.store = appHeaderStore;
      this.businessController.setContextKey(this.view.id);
      configurationManager = applicationManager.getConfigurationManager();
      this.businessController.configurationManager = configurationManager;
      //NGUI needed component scope as well this might not be required in OLB
      // appHeaderStore.subscribe(this.render.bind(this), this);
      appHeaderStore.subscribe(this.render.bind(this));
      this.componentUtility = new ComponentUtility();
      this.context = {};
      this.collectionData = appHeaderStore.getState();
      this.contextKey = "";
      this.hamConfig = configurationManager.getHamConfig();
    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      defineGetter(this, "primaryLinks", () => {
        return this._primaryLinks;
      });
      defineSetter(this, "primaryLinks", (value) => {
        this._primaryLinks = value;
      });
      defineGetter(this, "secondaryLinks", () => {
        return this._secondaryLinks;
      });
      defineSetter(this, "secondaryLinks", (value) => {
        this._secondaryLinks = value;
      });
      defineGetter(this, "supplementaryLinks", () => {
        return this._supplementaryLinks;
      });
      defineSetter(this, "supplementaryLinks", (value) => {
        this._supplementaryLinks = value;
      });
      defineGetter(this, "logoConfig", () => {
        return this._logoConfig;
      });
      defineSetter(this, "logoConfig", (value) => {
        this._logoConfig = value;
      });
      defineGetter(this, "hamburgerConfig", () => {
        return this._hamburgerConfig;
      });
      defineSetter(this, "hamburgerConfig", (value) => {
        this._hamburgerConfig = value;
      });
      defineGetter(this, "logoutConfig", () => {
        return this._logoutConfig;
      });
      defineSetter(this, "logoutConfig", (value) => {
        this._logoutConfig = value;
      });
      defineGetter(this, "profileConfig", () => {
        return this._profileConfig;
      });
      defineSetter(this, "profileConfig", (value) => {
        this._profileConfig = value;
      });
      defineGetter(this, "activeMenuID", () => {
        return this._activeMenuID;
      });
      defineSetter(this, "activeMenuID", (value) => {
        this._activeMenuID = value;
      });
      defineGetter(this, "activeSubMenuID", () => {
        return this._activeSubMenuID;
      });
      defineSetter(this, "activeSubMenuID", (value) => {
        this._activeSubMenuID = value;
      });
    },
    setContext: function(context) {
      var scope = this;
      try {
        this.context = context;
      } catch (err) {
        scope.setError(err, "setContext");
      }
    },
    /**
         * Gets invoked when collection gets updated so that UI gets updated
         */
    render: function() {
      var scope = this;
      try {
        // if (!applicationManager.getUserPreferencesManager().isUserLoggedin()) {
        // 	this.setupPreLoginView();
        // 	return;
        // }
        this.collectionData = appHeaderStore.getState();
        this.view.flxHamburger.height = kony.os.deviceInfo().screenHeight + "px";
        this.setUpPrimaryLinks(); //done
        this.setUpSecondaryLinks(); //done
        this.setUpSupplementaryLinks(); //done
        this.setUpLogo(); //done
        this.setupHamburger(); //done
        this.setActiveMenu();
      } catch (err) {
        scope.setError(err, "render");
      }
    },
    preShow: function() {
      // configurationManager = applicationManager.getConfigurationManager();
      CommonUtilities.clearList();
      this.view.lblPrimaryLink1.doLayout = function() {
        let width = 20 + this.view.lblPrimaryLink1.frame.width + 20;
        if (this.view.imgPrimaryLink1Chevron.isVisible) {
          width += 40;
        }
        this.view.flxPrimaryLink1.width = width + "dp";
        this.view.flxPrimaryLink1Menu.width = width + "dp";
      }.bind(this);
      this.view.lblPrimaryLink2.doLayout = function() {
        let width = 20 + this.view.lblPrimaryLink2.frame.width + 20;
        if (this.view.imgPrimaryLink2Chevron.isVisible) {
          width += 40;
        }
        this.view.flxPrimaryLink2.width = width + "dp";
        this.view.flxPrimaryLink2Menu.width = width + "dp";
      }.bind(this);
      this.view.lblPrimaryLink3.doLayout = function() {
        let width = 20 + this.view.lblPrimaryLink3.frame.width + 20;
        if (this.view.imgPrimaryLink3Chevron.isVisible) {
          width += 40;
        }
        this.view.flxPrimaryLink3.width = width + "dp";
        this.view.flxPrimaryLink3Menu.width = width + "dp";
      }.bind(this);
      this.view.flxPrimaryLink1.onClick = this.togglePrimaryLinkMenu.bind(this,1);
      this.view.flxPrimaryLink2.onClick = this.togglePrimaryLinkMenu.bind(this,2);
      this.view.flxPrimaryLink3.onClick = this.togglePrimaryLinkMenu.bind(this,3);
      this.view.flxUser.onClick = this.toggleUserActions;
      this.view.flxUser.accessibilityConfig = {
        "a11yLabel": "Profile",
        "a11yARIA": {
          "tabindex": 0,
          "role": "button",
          "aria-expanded":false
        }
      }
      this.view.flxUserActions.accessibilityConfig={
        "a11yARIA":{
          "aria-live": "off",
          "tabindex" : -1
        }
      }
      this.view.lblLegalEntityDropdownIconHamburger.accessibilityConfig = {
        "a11yHidden": true,
        "a11yARIA": {
          "tabindex": -1
        },
      };
      this.view.flxLegalEntityDropdownHamburger.accessibilityConfig = {
        a11yARIA: {
          "role": "button",
          "aria-expanded": false,
          "aria-labelledby": "lblLegalEntityHamburger",
          "tabindex": 0
        }
      };
      this.view.flxSegLegalEntityHamburger.accessibilityConfig = {
        a11yARIA: {
          "aria-live": "off",
          "tabindex": -1
        }
      };
      this.view.lblLegalEntityDropdownIcon.accessibilityConfig = {
        "a11yHidden": true,
        "a11yARIA": {
          "tabindex": -1
        },
      };
      this.view.flxLegalEntityDropdown.accessibilityConfig = {
        a11yARIA: {
          "role": "button",
          "aria-expanded": false,
          "aria-labelledby": "lblLegalEntity",
          "tabindex": 0
        }
      };
      this.view.flxSegLegalEntity.accessibilityConfig = {
        a11yARIA: {
          "aria-live": "off",
          "tabindex": -1
        }
      },
      
      this.view.btnSupplementaryLink1.doLayout = function() {
        this.view.flxSupplementarySep1.right = this.view.btnSupplementaryLink1.frame.width + 20 + "px";
        this.view.btnSupplementaryLink2.right = this.view.btnSupplementaryLink1.frame.width + 41 + "px";
      }.bind(this);
      this.view.flxToClone.isVisible = false;
      this.view.flxHamburger.isVisible = false;
      this.view.btnMenu.onClick = this.openHamburgerMenu;
      this.view.btnLogout.onClick = this.showLogout.bind(this, this.view.btnLogout);
      this.view.flxLogout.onClick = this.showLogout.bind(this, this.view.flxLogout);
      this.view.btnCloseHamburger.onClick = this.closeHamburgerMenu;
      this.view.btnSkipHeader.onClick = this.onSkipToMainContent;
      this.isAnimating = false;
      this.view.postShow = this.postShow;
      let singleEntityValue = "true";
    if (applicationManager.getConfigurationManager().configurations.getItem("isSingleEntity") !== undefined) {
      singleEntityValue = applicationManager.getConfigurationManager().configurations.getItem("isSingleEntity");
    }
    if (singleEntityValue === "false") {
      if (kony.application.getCurrentBreakpoint() === 640) {
        this.view.flxLegalEntity.setVisibility(false);
        this.view.flxLegalEntityHamburger.setVisibility(true);
      } else {
        this.view.flxLegalEntity.setVisibility(true);
        this.view.flxLegalEntityHamburger.setVisibility(false);
      }
      this.view.onKeyPress = this.onKeyPressCallBack;
    
     this.view.flxLegalEntityDropdown.onKeyPress = this.onKeyPressCallBack;
     this.view.flxSegLegalEntity.onKeyPress = this.onKeyPressCallBack;
     this.view.flxLegalEntityDropdownHamburger.onKeyPress = this.onKeyPressCallBack;
     this.view.flxSegLegalEntityHamburger.onKeyPress = this.onKeyPressCallBack; 
      this.view.flxLegalEntityDropdown.onClick = this.toggleLEDropdown.bind(this, this.view.flxSegLegalEntity, this.view.lblLegalEntityDropdownIcon);
      this.view.tbxLESearch.onKeyUp = this.performSearch.bind(this);
      this.view.flxLECross.onClick = this.populateLEList.bind(this);
      this.view.flxLegalEntityDropdownHamburger.onClick = this.toggleLEDropdown1.bind(this, this.view.flxSegLegalEntityHamburger, this.view.lblLegalEntityDropdownIconHamburger);
      this.view.tbxLESearchHamburger.onKeyUp = this.performSearch1.bind(this);
      this.view.flxLECrossHamburger.onClick = this.populateLEList1.bind(this);
      let scope = this;
      this.view.segLegalEntity.onRowClick = function () {
        scope.onEntitySwitchInDropdown(scope.view.segLegalEntity, scope.view.flxSegLegalEntity, scope.view.lblLegalEntityText, scope.populateLEList);
      };
      this.view.segLegalEntityHamburger.onRowClick = function () {
        scope.onEntitySwitchInDropdown(scope.view.segLegalEntityHamburger, scope.view.flxSegLegalEntityHamburger, scope.view.lblLegalEntityTextHamburger, scope.populateLEList1);
      };
      this.populateLEList()
      this.populateLEList1();
    }
    else {
      this.view.flxLegalEntity.setVisibility(false);
      this.view.flxLegalEntityHamburger.setVisibility(false);
    }
    },
    togglePrimaryLinkMenu : function(linkCount) {
      if (this.view["flxPrimaryLink"+ linkCount + "Menu"].isVisible === true) {
        this.view["flxPrimaryLink"+ linkCount + "Menu"].isVisible = false;
        this.view["flxPrimaryLink"+ linkCount].skin = "flxHoverSkinPointer";
        this.view["flxPrimaryLink"+ linkCount].hoverSkin = "flxHoverSkinPointer000000op10";
        this.view["imgPrimaryLink"+linkCount+"Chevron"].text = "O";
        this.view["flxPrimaryLink"+ linkCount].accessibilityConfig = {
          "a11yARIA": {
            "aria-labelledby": "lblPrimaryLink"+linkCount,
            "role": "button",
            "tabindex": 0,
            "aria-expanded": false
          }
        }
      } else {
        this.view["flxPrimaryLink"+ linkCount + "Menu"].isVisible = true;
        this.view["flxPrimaryLink"+ linkCount].skin = "sknFlxHeaderTransfersSelected";
        this.view["imgPrimaryLink"+linkCount+"Chevron"].text = "P";
        this.view["flxPrimaryLink"+ linkCount].accessibilityConfig = {
          "a11yARIA": {
            "aria-labelledby": "lblPrimaryLink"+linkCount,
            "role": "button",
            "tabindex": 0,
            "aria-expanded": true
          }
        }
      }
    },
    fetchTermsAndConditions: function (requestObj, callback) {
      let accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ "moduleName": "AccountsUIModule", "appName": "HomepageMA" });
      accountsModule.presentationController.fetchTermsAndConditions(requestObj, callback);
    },
  
    updateTermsAndConditions: function (requestObj, callback) {
      let accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({ "moduleName": "AccountsUIModule", "appName": "HomepageMA" });
      accountsModule.presentationController.updateTermsAndConditions(requestObj, callback);
    },
  
    onEntitySwitchInDropdown: function (seg, flx, lbl, callback) {
      let scope = this;
      let selectedEntityRowData = seg.selectedRowItems[0];
      let selectedEntityData;
      if (selectedEntityRowData) {
        selectedEntityData = seg.data.find(entityData => entityData.id === selectedEntityRowData.id);
      }
      let checkTermsAndConditionsAlreadySignedCallback = function (response) {
        if (response && !response.alreadySigned) {
          scope.showTermsAndConditionsLegalEntityPopup(response, seg, flx, lbl, callback);
        } else {
          callback();
        }
      };
      if (selectedEntityData) {
        let request = {
          "id": selectedEntityData.id
        };
        scope.fetchTermsAndConditions(request, checkTermsAndConditionsAlreadySignedCallback);
      }
    },
    
    performSearch:function(){
      let scope = this;
      if(this.view.tbxLESearch.text.trim().length>0){
        this.view.flxLECross.isVisible=true;
        var entityData = this.view.segLegalEntity.info.data;
        var searchText = this.view.tbxLESearch.text.toLowerCase();
        var statusName = "";
        var filteredData = entityData.filter(function(rec) {
            statusName = rec.lblDescription.text.toLowerCase();
            if (statusName.indexOf(searchText) >= 0) return rec;
          });
          if (filteredData.length === 0) {
            this.view.segLegalEntity.setVisibility(false);
          } else {
            this.view.segLegalEntity.setVisibility(true);
            this.view.segLegalEntity.setData(filteredData);
          }
      }else{
        this.populateLEList();
      }
      this.view.forceLayout();
    },
    
    populateLEList: function () {
      let scope = this;
      this.view.segLegalEntity.widgetDataMap = {
        "lblDescription": 'lblDescription',
        "id": "id"
      };
      let segData = [];
      let entitiesData = applicationManager.getMultiEntityManager().getUserLegalEntitiesListArr();
      for (let entityData of entitiesData) {
        segData.push({
          "lblDescription": {
            text: entityData.companyName,
            skin: 'ICSKNLbl42424215PxWordBreak',
          },
          "id": entityData.id
        });
      };
      this.view.segLegalEntity.setData(segData);
      this.view.segLegalEntity.info = {
        "data": this.view.segLegalEntity.data
      };
      this.view.segLegalEntity.setVisibility(true);
      this.view.flxLegalEntityDropdown.accessibilityConfig = {
        a11yARIA: {
          "role": "button",
          "aria-expanded": false,
          "aria-labelledby": "lblLegalEntity",
          "tabindex": 0
        }
      };
      if (segData.length <= MIN_ENTITIES_RECORDS_TO_ALLOW_SEARCH) {
        this.view.flxLESearch.isVisible = false;
      } else {
        this.view.flxLESearch.isVisible = true;
        this.view.tbxLESearch.text = "";
        this.view.flxLECross.isVisible = false;
      }
      let currentLegalEntity = applicationManager.getUserPreferencesManager().getCurrentLegalEntity();
      let selectedEntityData = entitiesData.find(entityData => entityData.id === currentLegalEntity);
      this.view.lblLegalEntityText.text = selectedEntityData && selectedEntityData.companyName ? selectedEntityData.companyName : "";
      this.view.lblLegalEntityDropdownIcon.text = ViewConstants.FONT_ICONS.CHEVRON_DOWN;
      this.view.flxSegLegalEntity.setVisibility(false);
      this.view.forceLayout();
    },
    
    toggleLEDropdown: function (flx, lbl) {
      var segData = this.view.segLegalEntity.data;
      if (segData.length <= MIN_ENTITIES_RECORDS_TO_ALLOW_SEARCH) {
        this.view.flxLESearch.isVisible = false;
      } else {
        this.view.flxLESearch.isVisible = true;
        this.view.tbxLESearch.text = "";
        this.view.flxLECross.isVisible = false;
      }
      if (flx.isVisible) {
        flx.setVisibility(false);
        lbl.text = ViewConstants.FONT_ICONS.CHEVRON_DOWN;
        this.view.flxLegalEntityDropdown.accessibilityConfig = {
          a11yARIA: {
            "role": "button",
            "aria-expanded": false,
            "aria-labelledby": "lblLegalEntity",
            "tabindex": 0
          }
        };
      } else {
        flx.setVisibility(true);
        lbl.text = ViewConstants.FONT_ICONS.CHEVRON_UP;
        this.view.flxLegalEntityDropdown.accessibilityConfig = {
          a11yARIA: {
            "role": "button",
            "aria-expanded": true,
            "aria-labelledby": "lblLegalEntity",
            "tabindex": 0
          }
        };
      }
      this.view.forceLayout();
    },
  
    performSearch1:function(){
      let scope = this;
      if(this.view.tbxLESearchHamburger.text.trim().length>0){
        this.view.flxLECrossHamburger.isVisible=true;
        var entityData = this.view.segLegalEntityHamburger.info.data;
        var searchText = this.view.tbxLESearchHamburger.text.toLowerCase();
        var statusName = "";
        var filteredData = entityData.filter(function(rec) {
            statusName = rec.lblDescription.text.toLowerCase();
            if (statusName.indexOf(searchText) >= 0) return rec;
          });
          if (filteredData.length === 0) {
            this.view.segLegalEntityHamburger.setVisibility(false);
          } else {
            this.view.segLegalEntityHamburger.setVisibility(true);
            this.view.segLegalEntityHamburger.setData(filteredData);
          }
      }else{
        this.populateLEList1();
      }
      this.view.forceLayout();
    },
  
    populateLEList1: function () {
      let scope = this;
      this.view.segLegalEntityHamburger.widgetDataMap = {
        "lblDescription": 'lblDescription',
        "id": "id"
      };
      let segData = [];
      let entitiesData = applicationManager.getMultiEntityManager().getUserLegalEntitiesListArr();;
      for (let entityData of entitiesData) {
        segData.push({
          "lblDescription": {
            text: entityData.companyName,
            skin: 'ICSKNLbl42424215PxWordBreak'
          },
          "id": entityData.id
        });
      }
      this.view.segLegalEntityHamburger.setData(segData);
      this.view.segLegalEntityHamburger.info = {
        "data": this.view.segLegalEntityHamburger.data
      };
      this.view.segLegalEntityHamburger.setVisibility(true);
      this.view.flxLegalEntityDropdownHamburger.accessibilityConfig = {
        a11yARIA: {
          "role": "button",
          "aria-expanded": false,
          "aria-labelledby": "lblLegalEntity",
          "tabindex": 0
        }
      };
      if (segData.length <= MIN_ENTITIES_RECORDS_TO_ALLOW_SEARCH) {
        this.view.flxLESearchHamburger.isVisible = false;
      } else {
        this.view.flxLESearchHamburger.isVisible = true;
        this.view.tbxLESearchHamburger.text = "";
        this.view.flxLECrossHamburger.isVisible = false;
      }
      let currentLegalEntity = applicationManager.getUserPreferencesManager().getCurrentLegalEntity();
      let selectedEntityData = entitiesData.find(entityData => entityData.id === currentLegalEntity);
      this.view.lblLegalEntityTextHamburger.text = selectedEntityData && selectedEntityData.companyName ? selectedEntityData.companyName : "";
      this.view.lblLegalEntityDropdownIconHamburger.text = ViewConstants.FONT_ICONS.CHEVRON_DOWN;
      this.view.flxSegLegalEntityHamburger.setVisibility(false);
      this.view.forceLayout();
    },
    
    toggleLEDropdown1: function (flx, lbl) {
      var segData = this.view.segLegalEntityHamburger.data;
      if (segData.length <= MIN_ENTITIES_RECORDS_TO_ALLOW_SEARCH) {
        this.view.flxLESearchHamburger.isVisible = false;
      } else {
        this.view.flxLESearchHamburger.isVisible = true;
        this.view.tbxLESearchHamburger.text = "";
        this.view.flxLECrossHamburger.isVisible = false;
      }
      if (flx.isVisible) {
        flx.setVisibility(false);
        lbl.text = ViewConstants.FONT_ICONS.CHEVRON_DOWN;
        this.view.flxLegalEntityDropdownHamburger.accessibilityConfig = {
          a11yARIA: {
            "role": "button",
            "aria-expanded": false,
            "aria-labelledby": "lblLegalEntityHamburger",
            "tabindex": 0
          }
        };
      } else {
        flx.setVisibility(true);
        lbl.text = ViewConstants.FONT_ICONS.CHEVRON_UP;
        this.view.flxLegalEntityDropdownHamburger.accessibilityConfig = {
          a11yARIA: {
            "role": "button",
            "aria-expanded": true,
            "aria-labelledby": "lblLegalEntityHamburger",
            "tabindex": 0
          }
        };
      }
      this.view.forceLayout();
    },
  
    addTermsAndConditionsLegalEntityPopup: function () {
      let currForm = kony.application.getCurrentForm();
      if (!currForm.flxTermsAndConditionsLegalEntity) {
        var flxTermsAndConditionsLegalEntity = new kony.ui.FlexContainer({
          "id": "flxTermsAndConditionsLegalEntity",
          "autogrowMode": kony.flex.AUTOGROW_NONE,
          "clipBounds": false,
          "top": "0dp",
          "left": "0dp",
          "width": "100%",
          "height": "100%",
          "isVisible": false,
          "layoutType": kony.flex.FREE_FORM,
          "isModalContainer": true,
          "skin": "sknflx000000op50",
          "zIndex": 1000,
          "appName": "ResourcesMA"
        }, {}, {});
        flxTermsAndConditionsLegalEntity.setDefaultUnit(kony.flex.DP);
        currForm.add(flxTermsAndConditionsLegalEntity);
      }
      if (!currForm.flxTermsAndConditionsLegalEntity.tandcLegalEntity) {
        var componentTAndCLegalEntity = new com.InfinityOLB.Resources.TermsAndConditionLegalEntity({
          "autogrowMode": kony.flex.AUTOGROW_NONE,
          "id": "tandcLegalEntity",
          "layoutType": kony.flex.FLOW_VERTICAL,
          "masterType": constants.MASTER_TYPE_DEFAULT,
          "isModalContainer": true,
          "appName": "ResourcesMA"
        });
        flxTermsAndConditionsLegalEntity.add(componentTAndCLegalEntity);
      }
    },
  
    showTermsAndConditionsLegalEntityPopup: function (response, seg, flx, lbl, callback) {
      let scope = this;
      if (kony.application.getCurrentForm()) {
        let currForm = kony.application.getCurrentForm();
        if (!currForm.flxTermsAndConditionsLegalEntity || !currForm.flxTermsAndConditionsLegalEntity.tandcLegalEntity) {
          scope.addTermsAndConditionsLegalEntityPopup();
        }
        currForm.tandcLegalEntity.TermsAndConditionBody.text = response && response.termsAndConditionsContent ? response.termsAndConditionsContent : "";
        currForm.tandcLegalEntity.flxClose.setActive(true);
        currForm.tandcLegalEntity.flxClose.onClick = scope.onClickOfCancelTAndCLegalEntity.bind(scope, flx, callback);
        currForm.tandcLegalEntity.btnCancelTAndC.accessibilityConfig = {
          "a11yARIA": {
            "tabindex": 0
          }
        };
        currForm.tandcLegalEntity.btnCancelTAndC.onClick = scope.onClickOfCancelTAndCLegalEntity.bind(scope, flx, callback);
        currForm.tandcLegalEntity.btnAcceptTAndC.accessibilityConfig = {
          "a11yARIA": {
            "tabindex": 0
          }
        };
        currForm.tandcLegalEntity.btnAcceptTAndC.onClick = scope.onClickOfAcceptTAndCLegalEntity.bind(scope, seg, flx, lbl, callback);
        currForm.flxTermsAndConditionsLegalEntity.setVisibility(true);
        currForm.forceLayout();
      }
    },
  
    hideTermsAndConditionsLegalEntityPopup: function () {
      let currForm = kony.application.getCurrentForm();
      currForm.flxTermsAndConditionsLegalEntity.setVisibility(false);
      currForm.remove(currForm.flxTermsAndConditionsLegalEntity);
    },
  
    onClickOfAcceptTAndCLegalEntity: function (seg, flx, lbl, callback) {
      let scope = this;
      let selectedEntityRowData = seg.selectedRowItems[0];
      let selectedEntityData = seg.data.find(entityData => entityData.id === selectedEntityRowData.id);
      let requestObj = {
        "id": selectedEntityData.id
      };
      scope.hideTermsAndConditionsLegalEntityPopup();
      scope.updateTermsAndConditions(requestObj, callback);
    },
  
    onClickOfCancelTAndCLegalEntity: function (flx, callback) {
      let scope = this;
      flx.setVisibility(false);
      scope.hideTermsAndConditionsLegalEntityPopup();
      callback();
    },
    postShow: function() {
      this.businessController.setDataInCollection({
        primaryLinks: this.primaryLinks,
        secondaryLinks: this.secondaryLinks,
        supplementaryLinks: this.supplementaryLinks,
        logoConfig: this.logoConfig,
        hamburgerConfig: this.hamConfig,
        logoutConfig: this.logoutConfig,
        profileConfig: this.profileConfig,
      });
      this.view.lblPrimaryLink2.accessibilityConfig = {
        "a11yLabel": "Payments And Transfer",
        "a11yARIA": {
          "tabindex": -1
        }
      }
      this.view.flxLogout.accessibilityConfig = {
        "a11yARIA": {
          "tabindex": 0,
          "role": "button"
        }
      }
      this.view.btnCloseHamburger.accessibilityConfig = {
        "a11yLabel": "Close Hamburger",
        "a11yARIA": {
          "tabindex": 0,
          "role": "button"
        }
      }
      this.view.lblSecondaryLinkNotification1.accessibilityConfig = {
        "a11yHidden": true,
        "a11yARIA": {
          "tabindex": -1,
        }
      }
      this.view.flxSecondarySep1.accessibilityConfig = {
        "a11yHidden": true,
        "a11yARIA": {
          "tabindex": -1,
        }
      }
      this.view.flxUserSep.accessibilityConfig = {
        "a11yHidden": true,
        "a11yARIA": {
          "tabindex": -1,
        }
      }
      this.view.flxPrimarySep1.accessibilityConfig = {
        "a11yHidden": true,
        "a11yARIA": {
          "tabindex": -1,
        }
      };
      this.view.segUserActions.accessibilityConfig={
        "a11yARIA": {
          "tabindex" : -1,
          "aria-live" : "off"
        }
      };
      this.view.flxUser.onBlur = CommonUtilities.hideAllPopups;
    this.view.flxPrimaryLink1.onBlur = CommonUtilities.hideAllPopups;
    this.view.flxPrimaryLink2.onBlur = CommonUtilities.hideAllPopups;
    this.view.flxPrimaryLink3.onBlur = CommonUtilities.hideAllPopups;
      for(let k=1;k<=3;k++){
      CommonUtilities.addToListner({
				widget: this.view["flxPrimaryLink"+k+"Menu"],
				hideFunc: this.togglePrimaryLinkMenu,
        param : k
			});
    }
    CommonUtilities.addToListner({
      widget: this.view.flxUserActions,
      hideFunc: this.toggleUserActions
    });
      this.view.onKeyPress = this.onKeyPressCallBack;
      this.view.flxHamburger.onKeyPress = this.onKeyPressCallBack;
      var scope = this;
      this.view.flxLogout.onKeyPress = function(eventObject,eventPayload){
      if(eventPayload.keyCode===9){
        scope.view.flxHamburgerHeader.accessibilityConfig={
          a11yARIA:{
            tabindex:-1
        }
      }
      scope.view.flxHamburgerHeader.setActive(true);
      }
      if(eventPayload.keyCode===27){
        scope.closeHamburgerMenu();
      }
    }
    },
    onKeyPressCallBack : function(eventObject,eventPayload){
      var scope =this;
      if(eventPayload.keyCode===27){
        if(scope.view.flxUserActions.isVisible){
          scope.toggleUserActions();
        }
        else if(scope.view.flxPrimaryLink2Menu.isVisible){
          scope.togglePrimaryLinkMenu(2);
          scope.view.flxPrimaryLink2.setActive(true);
        }
        else if(scope.view.flxHamburger.isVisible){
          scope.closeHamburgerMenu();
      }
      else if(scope.view.flxSegLegalEntity.isVisible===true){
        scope.toggleLEDropdown(scope.view.flxSegLegalEntity, scope.view.lblLegalEntityDropdownIcon);
        scope.view.flxLegalEntityDropdown.setActive(true);
      }
      else if(scope.view.flxSegLegalEntityHamburger.isVisible===true){
        scope.toggleLEDropdown1(scope.view.flxSegLegalEntityHamburger, scope.view.lblLegalEntityDropdownIconHamburger);
        scope.view.flxLegalEntityDropdownHamburger.setActive(true);
      }
      }

    },
    setupPreLoginView: function() {
      let linkData = this.businessController.getLinkData(this.logoConfig.loggedOut);
      this.view.flxBottom.isVisible = false;
      this.view.flxShadowContainer.top = "70px";
      this.view.flxSecondaryLinks.isVisible = false;
      this.view.flxNotLoggedIn.isVisible = true;
      this.view.btnLogo.onClick = linkData.onClick;
      this.view.btnLogo.accessibilityConfig = {};
      this.view.btnLogo.accessibilityConfig.a11yARIA = {
        tabindex: -1,
      };
  },
  setActiveMenu: function()  {
    var activeMenuID = this.activeMenuID;
    var activeSubMenuID = this.activeSubMenuID;
    var scope = this;
    var menuWidgets = scope.view.flxHamburgerMenu.widgets();
    if(menuWidgets.length===0){
        this.setupHamburger();
        menuWidgets = this.view.flxHamburgerMenu.widgets();
    }
    menuWidgets.forEach(function(menuWrapper) {
        subMenuWidget = menuWrapper.widgets()[1];
        if (menuWrapper.idToActivate === activeMenuID) {
            var widget = subMenuWidget;
            subMenuWidget.isVisible = true;
            for (let j = 0; j < widget.widgets().length; j++) {
                widget.isVisible = true;
                widget.widgets().isVisible = true;
                widget.widgets().height= 54 + "px";
                widget.widgets()[j].accessibilityConfig.a11yARIA = {
                  tabindex: 0,
                };
              }
              subMenuWidget.height = widget.widgets().length * 54 + "px";
              menuWrapper.widgets()[0].accessibilityConfig = {
                a11yARIA: {
                    "aria-expanded": true,
                    "role" : "button",
                    "aria-labelledby" : menuWrapper.widgets()[0].widgets()[1].id
                }
              };
              imageWidget = menuWrapper.widgets()[0].widgets()[2];
              imageWidget.src = "chevron_up.png";
            for (let j = 0; j < subMenuWidget.widgets().length; j++) {
                if (subMenuWidget.widgets()[j].idToActivate === activeSubMenuID) {
                    subMenuWidget.widgets()[j].widgets()[0].skin = "sknLblHamburgerSelected";
                }
            }
            return;
        } else {
            for (let j = 0; j < subMenuWidget.widgets().length; j++) {
                subMenuWidget.widgets()[j].widgets()[0].skin = "sknLblHamburgerUnSelected";
                subMenuWidget.widgets()[j].accessibilityConfig.a11yARIA = {
                    tabindex: -1,
                };
            }
            subMenuWidget.height = "0px";
            imageWidget = menuWrapper.widgets()[0].widgets()[2];
            if (imageWidget.src === "chevron_up.png") {
                imageWidget.src = "arrow_down.png";
            }
        }
    });
},
    setUpPrimaryLinks: function() {
      var scope=this;
      var linkData = null;
      var previousId=null;
      linkCount = 1;
      for (let i = 0; i < 5 && i < this.primaryLinks.length; i++) {
        const menuData = this.businessController.getLinkData(this.primaryLinks[i]);
        if(menuData.id === "EUROTRANSFERS"||menuData.id === "TRANSFERS" || menuData.id === "Pay a Person" || menuData.id === "FASTTRANSFERS"){
          if(menuData.id === "TRANSFERS" || menuData.id === "Pay a Person"){
            if(configurationManager.getDeploymentGeography() !== "EUROPE" && configurationManager.isFastTransferEnabled === "false"){
              linkData = menuData;
            }
          }
          if(menuData.id === "FASTTRANSFERS"){
            if(configurationManager.isFastTransferEnabled === "true"){
              linkData = menuData;
            }
          }
          if (menuData.id === "EUROTRANSFERS") {
            if (configurationManager.getDeploymentGeography() === "EUROPE") {
              linkData = menuData;
            }
          }
        } else{
          linkData = menuData;
        }
        if(previousId!==linkData.id){
          if (linkData.isVisible) {
            this.view["flxPrimaryLink" + linkCount].accessibilityConfig = linkData.accessibilityConfig;
            this.view["flxPrimaryLink" + linkCount].accessibilityConfig = {
              "a11yARIA": {
                "role": "button",
                "tabindex": 0,
              }
            }
            this.view["lblPrimaryLink" + linkCount].text = linkData.title;
            //this.view["lblPrimaryLink" + linkCount].toolTip = linkData.toolTip;
            if (linkData.subMenu) {
              this.view["flxPrimaryLink" + linkCount].accessibilityConfig = {
                "a11yARIA": {
                  "aria-labelledby": "lblPrimaryLink" + linkCount,
                  "role": "button",
                  "tabindex": 0,
                  "aria-expanded": false
                },
              }
              let contextualSegData = [];
              linkData.subMenu.forEach(function(contextualItem) {
                if (contextualItem.isVisible === true) {
                  let rowData = {
                    flxActionsMenu: {},
                    lblAction: {}
                  };
                  rowData.flxActionsMenu.onClick = function(){
                    contextualItem.onClick();
                    scope.togglePrimaryLinkMenu(linkCount);
                  },
                  rowData.flxActionsMenu.accessibilityConfig = contextualItem.accessibilityConfig;
                  rowData.flxActionsMenu.accessibilityConfig = {
                    "a11yARIA": {
                      "role": "link",
                      "tabindex": 0,
                    }
                  }
                  rowData.lblAction.accessibilityConfig = contextualItem.accessibilityConfig;
                  rowData.lblAction.accessibilityConfig.a11yARIA = {
                    tabindex: -1,
                  };
                  rowData.lblAction.text = contextualItem.title;
                  contextualSegData.push(rowData);
                }
              });
              this.view["segPrimaryLink" + linkCount + "Menu"].setData(contextualSegData);
            } else {
              this.view["flxPrimaryLink" + linkCount].onClick = linkData.onClick;
            }
            if (linkCount > 1) {
              this.view["flxPrimarySep" + (linkCount - 1)].isVisible = true;
            }
            linkCount++;
          }
          previousId=linkData.id;
        }
      }
      for (linkCount; linkCount <= 3; linkCount++) {
        this.view["flxPrimarySep" + (linkCount - 1)].isVisible = false;
        this.view["flxPrimaryLink" + linkCount].isVisible = false;
      }
    },
    setUpSecondaryLinks: function() {
      //Logout
      let logoutData = this.businessController.getLinkData(this.logoutConfig);
      this.view.btnLogout.text = logoutData.title;
      //this.view.btnLogout.onClick = logoutData.onClick;
      this.view.btnLogout.fontIcon = logoutData.fontIcon;
      this.view.btnLogout.accessibilityConfig = logoutData.accessibilityConfig;
      //profile
      let profileData = this.businessController.getLinkData(this.profileConfig);
      if (profileData.isVisible) {
        var userObject = applicationManager.getUserPreferencesManager().getUserObj();
        var userImageURL = applicationManager.getUserPreferencesManager().getUserImage();
        if (applicationManager.getConfigurationManager().getProfileImageAvailabilityFlag() === true && userImageURL && userImageURL.trim() != "") this.view.imgUser.base64 = userImageURL;
        else this.view.imgUser.src = ViewConstants.IMAGES.USER_DEFAULT_IMAGE;
        if (applicationManager.getConfigurationManager().getProfileImageAvailabilityFlag() === true && userImageURL && userImageURL.trim() != "") this.view.imgProfile.base64 = userImageURL;
        else this.view.imgProfile.src = ViewConstants.IMAGES.USER_DEFAULT_IMAGE;
        this.view.lblName.text = (userObject.userlastname === null) ? userObject.userfirstname : (userObject.userfirstname === null) ? userObject.userlastname : userObject.userfirstname + " " + userObject.userlastname;
        this.view.lblUserEmail.text = this.setEmailForUserObj();
        this.view.flxUserActions.isVisible = false;
        this.setupUserActions(profileData.subMenu);
      } else {
        this.view.flxUserSep.isVisible = false;
        this.view.flxUser.isVisible = false;
      }
      linkCount = 1;
      for (i = 0; i < 2 && i < this.secondaryLinks.length; i++) {
        const linkData = this.businessController.getLinkData(this.secondaryLinks[i]);
        if (linkData.isVisible) {
          //todo: How to add this to header?
          //configurationManager.enableAlertsIcon === "true"
          this.view["flxSecondaryLink" + linkCount].onClick = linkData.onClick;
          this.view["flxSecondaryLink" + linkCount].accessibilityConfig = linkData.accessibilityConfig;
          this.view.flxSecondaryLink2.accessibilityConfig = {
            "a11yLabel": "Messages",
            "a11yARIA": {
              role: "button",
              tabindex: 0,
            }
          },
            this.view.flxSecondaryLink1.accessibilityConfig = {
            "a11yLabel": "Notifications",
            "a11yARIA": {
              role: "button",
              tabindex: 0,
            }
          },
            this.view["lblSecondaryLinkImg" + linkCount].text = linkData.title;
          this.view["lblSecondaryLinkImg" + linkCount].text = linkData.fontIcon;
          this.view["flxSecondarySep" + linkCount].isVisible = true;
          linkCount++;
          //todo: check notification count
          // if (configurationManager.getUnreadMessageCount().count > 0) {
          // 	this.view.lblSecondaryLinkNotification1.isVisible = true;
          // } else {
          // 	this.view.lblSecondaryLinkNotification1.isVisible = false;
          // }
        }
      }
      for (linkCount; linkCount < 2; linkCount++) {
        this.view["flxPrimaryLink" + linkCount].isVisible = false;
      }
    },
    setEmailForUserObj: function() {
      var userEntitlementsEmailIds = applicationManager.getUserPreferencesManager().getEntitlementEmailIds();
      for (var i = 0; i < userEntitlementsEmailIds.length; i++) {
        if (userEntitlementsEmailIds[i].isPrimary === "true") {
          return userEntitlementsEmailIds[i].Value;
        }
      }
      return "";
    },
    setupUserActions: function(subMenuData) {
      this.view.segUserActions.widgetDataMap = {
        lblSeparator: "lblSeparator",
        lblUsers: "lblUsers",
        btnUsers : "btnUsers",
        flxSegUserActions:"flxSegUserActions"
      };
      this.view.segUserActions.setData(subMenuData.map(function(menuData) {
        return {
          flxSegUserActions: {
            accessibilityConfig: {
              "a11yARIA":{
                "tabindex":-1,
                "aria-live":"off"
              }
            }
          },
          lblSeparator: "L",
          lblUsers: {
            text: menuData.title,
            accessibilityConfig: {
              "a11yHidden":true,
              "a11yARIA":{
                "tabindex":-1
              }
            }
          },
          btnUsers:{
            onClick: function(){
              menuData.onClick();
              scope.toggleUserActions();
          },
            isVisible:true,
            accessibilityConfig:{
              "a11yARIA":{
                "tabindex":0,
                "aria-labelledby":"lblUsers",
                "role":"link"
              }
            }
          }
        };
      }));
    },
    toggleUserActions: function() {
      if (this.view.flxUserActions.isVisible === false) {
        this.view.flxUser.accessibilityConfig = {
          "a11yLabel": "Profile",
          "a11yARIA": {
            "tabindex": 0,
            "role": "button",
            "aria-expanded":true
          }
        }
        this.view.flxUserActions.isVisible = true;
        this.view.flxUser.setActive(true);
        //this.view.segUserActions.setActive(0,-1);
      } else {
        this.view.flxUser.accessibilityConfig = {
          "a11yLabel": "Profile",
          "a11yARIA": {
            "tabindex": 0,
            "role": "button",
            "aria-expanded":false
          }
        }
        this.view.flxUserActions.isVisible = false;
        this.view.flxUser.setActive(true);
      }
    },
    showLogout: function(widget) {
      popupContext = {
        heading: kony.i18n.getLocalizedString("i18n.common.logout"),
        message: kony.i18n.getLocalizedString("i18n.common.LogoutMsg"),
        yesClick: function() {
          //FormControllerUtility.showProgressBar(kony.application.getCurrentForm());
          TopbarConfig.config.LOGOUT.onClick();
        },
        srcWidget: widget
        //noClick: function() {},
      };
      this.onLogout(popupContext);
    },
    setUpSupplementaryLinks: function() {
      let linkCount = 1;
      for (let i = 0; i < this.supplementaryLinks.length && i < 2; i++) {
        linkData = this.businessController.getLinkData(this.supplementaryLinks[i]);
        if (linkData.isVisible) {
          this.view["btnSupplementaryLink" + linkCount].text = linkData.title;
          this.view["btnSupplementaryLink" + linkCount].onClick = linkData.onClick;
        }
        if (linkCount > 1) {
          this.view["flxSupplementarySep" + (linkCount - 1)].isVisible = true;
        }
        linkCount++;
      }
      for (linkCount; linkCount <= 2; linkCount++) {
        this.view["btnSupplementaryLink" + linkCount].isVisible = false;
        if(linkCount>=2)
        this.view["flxSupplementarySep" + (linkCount - 1)].isVisible = false;
      }
    },
    setUpLogo: function() {
      let linkData = this.businessController.getLinkData(this.logoConfig.loggedIn);
      this.view.btnLogo.onClick = linkData.onClick;
      //this.view.btnLogo.toolTip = linkData.toolTip;
      this.view.btnLogo.accessibilityConfig = linkData.accessibilityConfig;
      this.view.btnLogo.accessibilityConfig = {
        "a11yLabel": "Infinity Digital Banking Home",
        "a11yARIA": {
          "role": "button",
          "tabindex": 0
        }
      }
      this.view.btnLogoHamburger.onClick = linkData.onClick;
      this.view.flxHamburgerBack.isVisible = false;
      //this.view.btnLogoHamburger.toolTip = linkData.toolTip;
      this.view.btnLogoHamburger.accessibilityConfig = linkData.accessibilityConfig;
      this.view.btnLogoHamburger.accessibilityConfig = {
        "a11yLabel": "Infinity Digital Banking Home",
        "a11yARIA": {
          "role": "button",
          "tabindex": 0
        }
      }
      if (configurationManager.isSMEUser === "true") {
        this.view.btnLogo.skin = "btnInfinityLogoSME";
        this.view.btnLogoHamburger.skin = "btnInfinityLogoSMEWhite";
      } else if (configurationManager.isMBBUser === "true") {
        this.view.btnLogo.skin = "btnInfinityLogoMBB";
        this.view.btnLogoHamburger.skin = "btnInfinityLogoMBBWhite";
      } else if (configurationManager.isRBUser === "true") {
        this.view.btnLogo.skin = "btnInfinityLogoRB";
        this.view.btnLogoHamburger.skin = "btnInfinityLogoRBWhite";
      } else {
        this.view.btnLogo.skin = "btnInfinityLogoGeneric";
        this.view.btnLogoHamburger.skin = "btnInfinityLogoGenericWhite";
      }
    },
    setupHamburger: function() {
    if (this.hamConfig.length === 0) {
        var config = [];
        if(this._hamburgerConfig===""||this._hamburgerConfig===null||this._hamburgerConfig===undefined){
            this.view.btnMenu.isVisible = false;
            this.view.flxPrimaryLinks.left = this.view.btnMenu.left;
            return;
        }
        if(this._hamburgerConfig.endsWith(".js")){
        var hamburgerConfig = this._hamburgerConfig.split(".")[0];
        var scope = this;
        require([hamburgerConfig], function(obj) {
            if(JSON.parse(JSON.stringify(obj.config))){
            var hamburgerJSON = obj.config;
            for (let i = 0; i < hamburgerJSON.length; i++) {
                const menuData = scope.businessController.getLinkData(hamburgerJSON[i]);
                if (!menuData.isVisible) {
                    continue;
                }
              if(menuData.id === "EUROTRANSFERS"||menuData.id === "TRANSFERS" || menuData.id === "Pay a Person" || menuData.id === "FASTTRANSFERS"){
                if(menuData.id === "TRANSFERS" || menuData.id === "Pay a Person"){
                  if(configurationManager.getDeploymentGeography() !== "EUROPE" && configurationManager.isFastTransferEnabled === "false"){
                    config.push(menuData);
                  }
                }
                if(menuData.id === "FASTTRANSFERS"){
                  if(configurationManager.isFastTransferEnabled === "true"){
                    config.push(menuData);
                  }
                }
                if (menuData.id === "EUROTRANSFERS") {
                  if (configurationManager.getDeploymentGeography() === "EUROPE") {
                    config.push(menuData);
                  }
                }
              } else{
                config.push(menuData);
              }

            }
              scope.hamConfig = config;
            scope.addMenu();
            configurationManager.setHamConfig(config);
        }
        else{
            kony.print("Failed to validate the JSON");
        }
    });
    }
    else{
        kony.print("Please give .js file as input");
    }
    } else{
        if(this._hamburgerConfig===""||this._hamburgerConfig===null||this._hamburgerConfig===undefined){
            this.view.btnMenu.isVisible = false;
            this.view.flxPrimaryLinks.left = this.view.btnMenu.left;
            return;
        }
        this.addMenu();
    }
    },  
    addMenu : function()
    {
        this.view.flxHamburgerMenu.removeAll();
        this.hamConfig = configurationManager.getHamConfig();
        for (let i = 0; i < this.hamConfig.length; i++) {
            let menuWidget = this.createMenu(this.hamConfig[i]);
            this.view.flxHamburgerMenu.add(menuWidget);
        }
        this.collapseAll();
        this.setActiveMenu();
    },
    createMenu: function(menuData) {
      let wrapperWidget = this.view.flxMenuWrapper.clone(menuData.id.replace(/ /g, ""));
      wrapperWidget.accessibilityConfig = {
        "a11yARIA": {
          "tabindex": -1,
        }
      }
      wrapperWidget.idToActivate = menuData.id;
      let menuWidget = wrapperWidget.widgets()[0];
      let subMenuWidget = wrapperWidget.widgets()[1];
      let iconWidget = menuWidget.widgets()[0];
      let titleWidget = menuWidget.widgets()[1];
      let chevronWidget = menuWidget.widgets()[2];
      // let sepWidget = menuWidget.widgets()[3];
      //icon
      iconWidget.text = menuData.fontIcon;
      //title
      titleWidget.text = menuData.title;
      if (menuData.toolTip) {
        //titleWidget.toolTip = menuData.toolTip;
      }
      titleWidget.accessibilityConfig = menuData.accessibilityConfig;
      titleWidget.accessibilityConfig = {
        //"a11yHidden": "false",
        "a11yARIA": {
          tabindex: -1,
        }
      };
      //wrapper
      menuWidget.accessibilityConfig = menuData.accessibilityConfig;
      menuWidget.accessibilityConfig = {
        "a11yARIA": {
          "aria-labelledby": titleWidget.id,
          "role": "button",
          "aria-expanded": false,
          "tabindex": 0
        }
      }
      if (menuData.subMenu && menuData.subMenu.length > 0) {
        menuWidget.accessibilityConfig = {
          "a11yARIA": {
            "aria-labelledby": titleWidget.id,
            "role": "button",
            "aria-expanded": false,
            "tabindex": 0
          }
        }
        menuWidget.onClick = this.toggleMenu.bind(this, menuWidget, subMenuWidget, chevronWidget);
        for (let i = 0; i < menuData.subMenu.length; i++) {
          if (!menuData.subMenu[i].isVisible) {
            continue;
          }
          let subMenuItemWidget = this.createSubMenu(menuData,menuData.subMenu[i]);
          //subMenuItemWidget.isVisible = false;
          subMenuWidget.add(subMenuItemWidget);
          subMenuWidget.isVisible = false;
        }
      } else {
        menuWidget.onClick = menuData.onClick;
        subMenuWidget.isVisible = false;
        menuWidget.accessibilityConfig = {
          "a11yARIA": {
            "aria-labelledby": titleWidget.id,
            "role": "button",
            "tabindex": 0
          }
        }
        chevronWidget.src = "right_arrow.png";
        //chevronWidget.toolTip = "Expand";
        chevronWidget.width = "8dp";
        chevronWidget.height = "13dp";
      }
      return wrapperWidget;
    },
    createSubMenu: function(menuData,subMenuData) {
      let subMenuWrapperWidget = this.view.flxSubMenuItem.clone(subMenuData.id+menuData.id.replace(/ /g, ""));
      subMenuWrapperWidget.idToActivate = subMenuData.id;
      let lblWidget = subMenuWrapperWidget.widgets()[0];
      lblWidget.text = subMenuData.title;
      lblWidget.accessibilityConfig = subMenuData.accessibilityConfig;
      lblWidget.accessibilityConfig.a11yARIA = {
        tabindex: -1,
      };
      subMenuWrapperWidget.accessibilityConfig = subMenuData.accessibilityConfig;
      subMenuWrapperWidget.accessibilityConfig = {
        "a11yARIA": {
          "role": "link",
          "tabindex": 0,
        }
      }
      subMenuWrapperWidget.onClick = subMenuData.onClick;
      return subMenuWrapperWidget;
    },
    /**
         * Toggles the sub menu
         * @param {kony.ui.FlexContainer} widget Submenu widget to toggle
         * @param {kony.ui.FlexContainer} imgArrow imgArrow to toggle
         */
    toggleMenu: function(menuWidget, widget, imgArrow) {
      if (widget.height === "0px" || widget.height === "0dp") {
        this.collapseAll();
        imgArrow.src = "chevron_up.png";
        //imgArrow.toolTip = "Collapse";
        this.expand(widget);
        menuWidget.accessibilityConfig = {
          "a11yARIA": {
            "aria-labelledby": menuWidget.widgets()[1].id,
            "role": "button",
            "aria-expanded": true,
            "tabindex": 0
          }
        }
      } else {
        this.collapseAll();
        imgArrow.src = "arrow_down.png";
        //imgArrow.toolTip = "Expand";
        menuWidget.accessibilityConfig = {
          "a11yARIA": {
            "aria-labelledby": menuWidget.widgets()[1].id,
            "role": "button",
            "aria-expanded": false,
            "tabindex": 0
          }
        }
      }
      // this.view.forceLayout();
    },
    /**
         * Expands the subMenu
         * @param {kony.ui.FlexContainer} widget Submenu widget to expand
         */
    expand: function(widget) {
      var scope = this;
      for (let j = 0; j < widget.widgets().length; j++) {
        widget.isVisible = true;
        widget.widgets().isVisible = true;
        widget.widgets()[j].accessibilityConfig.a11yARIA = {
          tabindex: 0,
        };
      }
      var animationDefinition = {
        0: {
          height: "0px",
        },
        100: {
          height: widget.widgets().length * 54 + "px",
        },
      };
      var callbacks = {
        animationEnd: function() {
          widget.widgets()[0].setFocus(true);
          // scope.view.forceLayout();
        },
      };
      var animationDef = kony.ui.createAnimation(animationDefinition);
      widget.animate(animationDef, animationConfiguration, callbacks);
    },
    /**
         * Collapse All the sub menu items
         */
    collapseAll: function() {
      var scope = this;
      var menuWidgets = this.view.flxHamburgerMenu.widgets();
      menuWidgets.forEach(function(menuWrapper) {
        if (menuWrapper.widgets()[0].widgets()[1].text === "Unified Transfers Flow") {
          menuWrapper.widgets()[0].accessibilityConfig = {
            "a11yARIA": {
              "aria-labelledby": menuWrapper.widgets()[0].widgets()[1].id,
              "role": "button",
              "tabindex": 0
            }
          };
        } else {
          menuWrapper.widgets()[0].accessibilityConfig = {
            "a11yARIA": {
              "aria-labelledby": menuWrapper.widgets()[0].widgets()[1].id,
              "aria-expanded": false,
              "role": "button",
              "tabindex": 0
            }
          };
        }
        subMenuWidget = menuWrapper.widgets()[1];
        for (let j = 0; j < subMenuWidget.widgets().length; j++) {
          subMenuWidget.widgets()[j].accessibilityConfig.a11yARIA = {
            tabindex: -1,
          };
        }
        subMenuWidget.height = "0px";
        subMenuWidget.isVisible = false;
        imageWidget = menuWrapper.widgets()[0].widgets()[2];
        if (imageWidget.src === "chevron_up.png") {
          imageWidget.src = "arrow_down.png";
          //imageWidget.toolTip = "Expand";
        }
      });
      // this.view.forceLayout();
    },
    //payments and transfer menu toogle
    toggleContextualMenu: function() {
      if (this.view.flxPrimaryLink2Menu.isVisible === true) {
        this.view.flxPrimaryLink2.skin = "flxHoverSkinPointer";
        this.view.flxPrimaryLink2Menu.isVisible = false;
        this.view.imgPrimaryLink2Chevron.text = "O";
      } else {
        this.view.flxPrimaryLink2Menu.isVisible = true;
        this.view.flxPrimaryLink2.skin = "sknFlxHeaderTransfersSelected";
        this.view.imgPrimaryLink2Chevron.text = "P";
      }
      this.view.flxPayMultipleBeneficiaries.isVisible = false;
      // this.view.forceLayout();
    },
    openHamburgerMenu: function() {
      if (this.isAnimating) {
        return;
      }
      this.isAnimating = true;
      this.view.flxHamburger.isVisible = true;
      this.view.btnLogoHamburger.setFocus(true);
      // this.view.btnCloseHamburger.setFocus(true);
      let screenHeight = kony.os.deviceInfo().screenHeight;
      this.view.flxHamburger.height = screenHeight + "dp";
      this.view.flxHamburgerScroll.height = screenHeight - 60 + "dp";
      this.view.flxHamburgerBack.height = screenHeight + "dp";
      this.view.flxHamburgerBack.isVisible = true;
      // this.view.forceLayout();
      var scope = this;
      var animationDefinition = {};
      if (kony.i18n.getCurrentLocale() === "ar") {
        animationDefinition = {
          0: {
            left: "",
            right: "-500dp",
          },
          100: {
            left: "",
            right: "0dp",
          },
        };
      } else {
        animationDefinition = {
          0: {
            left: "-500dp",
          },
          100: {
            left: "0dp",
          },
        };
      }
      var callbacks = {
        animationEnd: function() {
          scope.isHamburgerVisible = true;
          scope.isAnimating = false;
          // scope.view.forceLayout();
        },
      };
      var animationDef = kony.ui.createAnimation(animationDefinition);
      this.view.flxHamburger.animate(animationDef, animationConfiguration, callbacks);
      var fadeAnimDef = kony.ui.createAnimation({
        0: {
          opacity: 0,
        },
        100: {
          opacity: 1,
        },
      });
      this.view.flxHamburgerBack.animate(fadeAnimDef, animationConfiguration, {});
    },
    closeHamburgerMenu: function() {
      if (this.isAnimating) {
        return;
      }
      this.view.btnMenu.setFocus(true);
      var scope = this;
      var animationDefinition = {};
      if (kony.i18n.getCurrentLocale() === "ar") {
        animationDefinition = {
          0: {
            left: "",
            right: "0%",
          },
          100: {
            left: "",
            right: "-500dp",
          },
        };
      } else {
        animationDefinition = {
          0: {
            left: "0%",
          },
          100: {
            left: "-500dp",
          },
        };
      }
      var callbacks = {
        animationEnd: function() {
          scope.view.flxHamburgerBack.isVisible = false;
          scope.isHamburgerVisible = false;
          scope.isAnimating = false;
          scope.view.flxHamburger.isVisible = false;
          // scope.view.forceLayout();
        },
      };
      var animationDef = kony.ui.createAnimation(animationDefinition);
      this.view.flxHamburger.animate(animationDef, animationConfiguration, callbacks);
      var fadeAnimDef = kony.ui.createAnimation({
        0: {
          opacity: 1,
        },
        100: {
          opacity: 0,
        },
      });
      this.view.flxHamburgerBack.animate(fadeAnimDef, animationConfiguration, {});
    },
    /**
         * Gets trigerred when any exception occurs in any method in view controller
         * @param errorMsg {String} - error message
         * @param method {String} - method from which error message is received
         */
    setError: function(errorMsg, method) {
      let errorObj = {
        level: "ComponentViewController",
        method: method,
        error: errorMsg,
      };
      this.onError(errorObj);
    },
  };
});