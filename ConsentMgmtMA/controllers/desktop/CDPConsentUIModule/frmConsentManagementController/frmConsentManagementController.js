define(['CommonUtilities', 'CSRAssistUI', 'FormControllerUtility', 'OLBConstants', 'ViewConstants', 'CampaignUtility'], function(CommonUtilities, CSRAssistUI, FormControllerUtility, OLBConstants, ViewConstants, CampaignUtility) {
  var orientationHandler = new OrientationHandler();
  var consentManagementData = [];
  var consentEdit = false;
  var responsiveUtils = new ResponsiveUtils();
  return {
    updateFormUI: function(viewModel) {
      if (viewModel !== undefined) {
        if (viewModel.isLoading !== undefined) this.changeProgressBarState(viewModel.isLoading);
        if (viewModel.consentResponse) {
          this.setConsentManagementData(viewModel.consentResponse);
        }
        if (viewModel.consentError) {
          this.showErrorConsent(viewModel.consentError, viewModel.action);
        }
        this.view.forceLayout();
      }
    },
    init: function() {
      var self = this;
      //  this.view.preShow = this.preShow;
      //  this.view.postShow = this.postShow;
      this.view.forceLayout();
      applicationManager.getLoggerManager().setCustomMetrics(this, false, "Profile");
      this.view.onBreakpointChange = function() {
        self.onBreakpointChange(kony.application.getCurrentBreakpoint());
      };
    },
    onBreakpointChange: function(width) {
      FormControllerUtility.setupFormOnTouchEnd(width);
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
      this.view.profileMenu.onBreakpointChangeComponent(width);
      orientationHandler.onOrientationChange(this.onBreakpointChange);
      if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
        var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
        CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.Consent"), accessibilityConfig);
      }
      this.view.forceLayout();
    },
    preShow: function() {
      var self = this;
      var scopeObj = this;
      this.view.flxAccountSettingsCollapseMobile.onClick = this.toggleMenuMobile;
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain','flxMenuItemMobile','flxRight']);
      this.view.btnEditConsent.onClick = function() {
        scopeObj.showEditConsent();
      }.bind(this);
      this.view.btnConsentManagementCancel.onClick = function() {
        consentEdit = false;
        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "CDPConsentUIModule", "appName" : "ConsentMgmtMA"}).presentationController.showConsentManagement();
      }.bind(this);
      this.view.btnConsentManagementSave.onClick = function() {
        consentEdit = false;
        FormControllerUtility.showProgressBar(this.view);
        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "CDPConsentUIModule", "appName" : "ConsentMgmtMA"}).presentationController.editConsentManagement(consentManagementData[0]);
      }.bind(this);
      if (this.view.lblCollapseMobile.text == "P") {
        this.view.lblCollapseMobile.text = "O";
        this.view.flxLeft.setVisibility(false);
        this.view.flxRight.setVisibility(true);
      }
      this.view.flxLeft.setVisibility(true);
      this.view.lblCollapseMobile.text = "O";
      this.view.profileMenu.activateMenu("CONSENT MANAGEMENT", "Your Consent");
      this.view.customheadernew.activateMenu("Settings", "Consent Management");
      this.setSelectedValue("i18n.ProfileManagement.MyConsent");
      this.view.onBreakpointChange = function() {
        self.onBreakpointChange(kony.application.getCurrentBreakpoint());
      };
      applicationManager.getLoggerManager().setCustomMetrics(this, false, "Profile");
      //this.view.flxOption4.setVisibility(false);
      this.setAccessibility();
      this.view.forceLayout();
      this.view.profileMenu.checkLanguage();
    },
    postShow: function() {
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
      applicationManager.getNavigationManager().applyUpdates(this);
      this.view.profileMenu.flxSeperator.height = this.view.flxRight.info.frame.height;
      this.view.flxLeft.height = this.view.flxRight.info.frame.height;
      this.view.btnEditConsent.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.EditConsent");
      this.view.forceLayout();
    },
    setAccessibility: function() {
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      this.view.btnEditConsent.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.EditConsent");
      this.view.btnConsentManagementSave.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.Save");
      this.view.btnConsentManagementCancel.toolTip = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
      CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.Consent"), accessibilityConfig);

      this.view.btnEditConsent.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.EditYourConsent")
      };
      this.view.btnConsentManagementSave.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.SaveConsent")
      };
      this.view.btnConsentManagementCancel.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.CancelConsent")
      };
      this.view.lblCollapseMobile.accessibilityConfig = {
        "a11yARIA": {
          "tabindex": -1
        }
      };
      this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
        "a11yLabel": "Dropdown"
      };
      this.view.imgConsentManagementNotification.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.ConsentInfo")
      };

    },
    changeProgressBarState: function(isLoading) {
      if (isLoading) {
        FormControllerUtility.showProgressBar(this.view);
      } else {
        FormControllerUtility.hideProgressBar(this.view);
      }
    },
    toggleCheckboxConsent: function(subTypes, elemItem, elemSubitem,resultsDataConsent) {
      var scopeObj = this;
      var flexRoot = this.view.flxConsentManagementContainer.flxAllConsentTypes.widgets();
      var flxConsentNotificationDetails = flexRoot[elemItem].widgets()[2];
      if (flxConsentNotificationDetails.isVisible !== true && consentEdit == true) {
        var itemItemRowSelected = flexRoot[elemItem].widgets()[5];
        var itemOptions = itemItemRowSelected.widgets();
        var checkboxOption = itemOptions[elemSubitem].widgets();
        if (checkboxOption[0].text === "C") {
          checkboxOption[0].text = "D";
        } else {
          checkboxOption[0].text = "C";
        }
        if(subTypes !== undefined && subTypes.length > 0) {
          checkboxOption[0].accessibilityConfig = {
            "a11yLabel": checkboxOption[0].text === "C" ? kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " + kony.i18n.getLocalizedString("i18n.settings.accessibility.checkbox") + " " + (resultsDataConsent[elemItem].subTypes[elemSubitem].consentSubType) : kony.i18n.getLocalizedString("i18n.accountSettings.unchecked") + " " + kony.i18n.getLocalizedString("i18n.settings.accessibility.checkbox") + " " + (resultsDataConsent[elemItem].subTypes[elemSubitem].consentSubType),
            "a11yARIA": {
              "aria-checked": checkboxOption[0].text === "C" ? "true" : "false",
              "aria-disabled": checkboxOption[0].text === "C" ? "false" : "true"
            }
          };

        } else {
          checkboxOption[0].accessibilityConfig = {
            "a11yLabel": checkboxOption[0].text === "C" ? kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " + kony.i18n.getLocalizedString("i18n.settings.accessibility.checkbox") + " " + (resultsDataConsent[elemItem].consentTypeName) : kony.i18n.getLocalizedString("i18n.accountSettings.unchecked") + " " + kony.i18n.getLocalizedString("i18n.settings.accessibility.checkbox") + " " + (resultsDataConsent[elemItem].consentTypeName),
            "a11yARIA": {
              "aria-checked": checkboxOption[0].text === "C" ? "true" : "false",
              "aria-disabled": checkboxOption[0].text === "C" ? "false" : "true"
            }
          };

        } 
        var sameOptionConsent = true;
        for (var i = 0; i < flexRoot.length; i++) {
          var flxItemRow = flexRoot[i].widgets()[5];
          var flxOptions = flxItemRow.widgets();
          for (var j = 0; j < flxOptions.length; j++) {
            var lblCheckboxOption = flxOptions[j].widgets();
            if (lblCheckboxOption[0].text !== lblCheckboxOption[0].textInitial) {
              sameOptionConsent = false;
              if (typeof consentManagementData[0].consents[i].subTypes !== "undefined" && consentManagementData[0].consents[i].subTypes.length > 0) {
                if (lblCheckboxOption[0].text === "C") {
                  consentManagementData[0].consents[i].subTypes[j].consentSubTypeGiven = "YES";
                } else {
                  consentManagementData[0].consents[i].subTypes[j].consentSubTypeGiven = "NO";
                }
              } else {
                if (lblCheckboxOption[0].text === "C") {
                  consentManagementData[0].consents[i].consentGiven = "YES";
                } else {
                  consentManagementData[0].consents[i].consentGiven = "NO";
                }
              }
            }
          }
        }
        if (sameOptionConsent === false) scopeObj.enableButton(this.view.btnConsentManagementSave);
        else scopeObj.disableButton(this.view.btnConsentManagementSave);
      }
    },
    /**
         * Method to Enable a button
         * @param {String} button - ID of the button to be enabled
         */
    enableButton: function(button) {
      if (!CommonUtilities.isCSRMode()) {
        button.setEnabled(true);
        button.skin = "sknbtnSSPffffff15px0273e3bg";
        button.hoverSkin = "sknBtnFocusSSPFFFFFF15Px0273e3";
        button.focusSkin = "sknBtnHoverSSPFFFFFF15Px0273e3";
      }
    },
    /**
         * Method to Disable a button
         * @param {String} button - ID of the button to be disabled
         */
    disableButton: function(button) {
      button.setEnabled(false);
      button.skin = "sknBtnBlockedSSPFFFFFF15Px";
      button.hoverSkin = "sknBtnBlockedSSPFFFFFF15Px";
      button.focusSkin = "sknBtnBlockedSSPFFFFFF15Px";
    },
    /**
         * *@param {String} text- text that needs to be appended to the upper text in mobile breakpoint
         *  Method to set the text in mobile breakpoint
         */
    setSelectedValue: function(text) {
      var self = this;
      CommonUtilities.setText(self.view.lblAccountSettingsMobile, kony.i18n.getLocalizedString(text) , CommonUtilities.getaccessibilityConfig());
    },
    showErrorConsent: function(errorMsg, action) {
      if (action === "get") {
        this.setDataVisibility(false);
      } else {
        consentEdit = true;
        this.view.flxErrorConsent.setVisibility(true);
      }
      this.view.btnEditConsent.setVisibility(false);
      // this.view..lblErrorConsent.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.updateServerError");
      this.view.lblErrorConsent.text = errorMsg;
      this.view.flxConsentManagementButtons.setVisibility(true);
      FormControllerUtility.hideProgressBar(this.view);
      this.view.forceLayout();
      this.postShow();
      //this.showConsentManagementView(this);
    },
    getConsentTypeI18n: function(consentType){
        var consentTypeI18n;
        switch(consentType){
          case "EMAIL" : consentTypeI18n = applicationManager.getPresentationUtility().getStringFromi18n('kony.mb.consent.email');
          break;
          case "PHONE" :consentTypeI18n = applicationManager.getPresentationUtility().getStringFromi18n('kony.mb.consent.phone');
          break;
          case "SMS" : consentTypeI18n = applicationManager.getPresentationUtility().getStringFromi18n('kony.mb.consent.sms');
          break;
          default : consentTypeI18n = applicationManager.getPresentationUtility().getStringFromi18n('kony.mb.Alerts.pushNotifications');
        }  
      return consentTypeI18n
    },
    setConsentManagementData: function(data) {
      consentEdit = false;
      this.setDataVisibility(true);
      this.view.flxConsentManagementContainer.flxAllConsentTypes.removeAll();
      this.view.flxConsentManagementButtons.setVisibility(false);
      var scopeObj = this;
      if (!data.consentTypes) {
        scopeObj.view.lblErrorConsent.text = kony.i18n.getLocalizedString("i18n.ProfileManagement.invalidConsent");
        //this.setDataVisibility(false);
        //this.view.flxConsentManagementMainContainer.setVisibility(false);
        this.view.flxErrorConsent.setVisibility(true);
        this.view.flxConsentManagementNotification.setVisibility(false);
        this.view.flxConsentManagementContainer.setVisibility(false);
        //scopeObj.view.lblConsentManagementNotification.skin ="sknLabelSSPFF000015Px"; 
        scopeObj.view.btnEditConsent.setVisibility(false);
      } else {
        consentManagementData = data.consentTypes;
        var resultsDataConsent = data.consentTypes[0].consents;
        var checkConsentBlock = resultsDataConsent.every(o => 'consentBlock' in o);

        scopeObj.view.btnEditConsent.setVisibility((applicationManager.getConfigurationManager().checkUserPermission("CDP_CONSENT_EDIT") && !checkConsentBlock) ? true : false);
        
        var SAMPLE_CONSENT_TYPE_ITEM = "flxProfileManagementConsent";
        var SAMPLE_CHANNEL_ITEM = "flxProfileManagementConsentOptions";
        var ALL_CONSENT_TYPES = "flxAllConsentTypes";
        for (var item in resultsDataConsent) {
          var consentTypeItem = this.view[SAMPLE_CONSENT_TYPE_ITEM].clone("flxCloneAllRows" + item);
          var childWidgets = consentTypeItem.widgets();
          childWidgets[0].widgets()[0].text = resultsDataConsent[item].consentTypeName;
          childWidgets[2].setVisibility(resultsDataConsent[item].consentBlock === "YES" ? true : false);
          if (kony.i18n.getLocalizedString("i18n.ProfileManagement." + resultsDataConsent[item].consentType + "")) {
            childWidgets[3].widgets()[0].text = kony.i18n.getLocalizedString("i18n.ProfileManagement." + resultsDataConsent[item].consentType + "");
          } else {
            childWidgets[3].widgets()[0].text = "Some description for this consent type";
          }
          childWidgets[3].accessibilityconfig = {
            "a11yLabel": "Some description for this consent type"
          };
          childWidgets[4].text = kony.i18n.getLocalizedString("i18n.ProfileManagement.blockConsent");
          var choises = consentTypeItem.widgets()[5];
          if (resultsDataConsent[item].subTypes !== undefined && resultsDataConsent[item].subTypes.length > 0) {
            for (var subItem in resultsDataConsent[item].subTypes) {
              var channelItem = this.view[SAMPLE_CHANNEL_ITEM].clone("flxCloneRow" + subItem + item);
              var childChannelWidgets = channelItem.widgets();
              if (kony.i18n.getLocalizedString("i18n.ProfileManagement.consent." + resultsDataConsent[item].subTypes[subItem].consentSubType + "")) {
                childChannelWidgets[1].text = kony.i18n.getLocalizedString("i18n.ProfileManagement.consent." + this.getConsentTypeI18n(resultsDataConsent[item].subTypes[subItem].consentSubType) + "");
              } else {
                childChannelWidgets[1].text = this.getConsentTypeI18n(resultsDataConsent[item].subTypes[subItem].consentSubType);
              }
              channelItem.width = (30 + (11 * childChannelWidgets[1].text.length)) + "dp";
              childChannelWidgets[0].text = resultsDataConsent[item].subTypes[subItem].consentSubTypeGiven === "YES" ? "C" : "D";
              childChannelWidgets[0].textInitial = resultsDataConsent[item].subTypes[subItem].consentSubTypeGiven === "YES" ? "C" : "D";
              childChannelWidgets[0].skin = "sknFontIconCheckBox727272Disabled";
              childChannelWidgets[0].accessibilityConfig = {
                "a11yLabel": resultsDataConsent[item].subTypes[subItem].consentSubTypeGiven === "YES" ? kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " + kony.i18n.getLocalizedString("i18n.settings.accessibility.checkbox") + " " + (resultsDataConsent[item].subTypes[subItem].consentSubType) : kony.i18n.getLocalizedString("i18n.accountSettings.unchecked") + " " + kony.i18n.getLocalizedString("i18n.settings.accessibility.checkbox") + " " + (resultsDataConsent[item].subTypes[subItem].consentSubType),
                "a11yARIA": {
                  "aria-checked": resultsDataConsent[item].subTypes[subItem].consentSubTypeGiven === "YES" ? "true" : "false",
                  "aria-disabled": resultsDataConsent[item].subTypes[subItem].consentSubTypeGiven === "YES" ? "false" : "true"
                }
              };
              childChannelWidgets[0].onTouchStart = scopeObj.toggleCheckboxConsent.bind(this, resultsDataConsent[item].subTypes, item, subItem,resultsDataConsent);

              choises.add(channelItem);
              channelItem.isVisible = true;
            }
          } else {
            var channelItemSingle = this.view[SAMPLE_CHANNEL_ITEM].clone("flxCloneRow" + item);
            channelItemSingle.width = "100%";
            var childChannelWidgetsSingle = channelItemSingle.widgets();
            childChannelWidgetsSingle[0].text = resultsDataConsent[item].consentGiven === "YES" ? "C" : "D";
            childChannelWidgetsSingle[0].textInitial = resultsDataConsent[item].consentGiven === "YES" ? "C" : "D";
            childChannelWidgetsSingle[0].skin = "sknFontIconCheckBox727272Disabled";
            childChannelWidgetsSingle[0].accessibilityConfig = {
              "a11yLabel": resultsDataConsent[item].consentGiven === "YES" ? kony.i18n.getLocalizedString("i18n.accountSettings.checked") + " " + kony.i18n.getLocalizedString("i18n.settings.accessibility.checkbox") + " " + (resultsDataConsent[item].consentTypeName) : kony.i18n.getLocalizedString("i18n.accountSettings.unchecked") + " " + kony.i18n.getLocalizedString("i18n.settings.accessibility.checkbox") + " " + (resultsDataConsent[item].consentTypeName),
              "a11yARIA": {
                "aria-checked": resultsDataConsent[item].consentGiven === "YES" ? "true" : "false",
                "aria-disabled": resultsDataConsent[item].consentGiven === "YES" ? "false" : "true"
              }
            };
            childChannelWidgetsSingle[0].onTouchStart = scopeObj.toggleCheckboxConsent.bind(this,resultsDataConsent[item].subTypes, item, 0,resultsDataConsent);


            childChannelWidgetsSingle[1].text = "Allow " + resultsDataConsent[item].consentTypeName;
            choises.add(channelItemSingle);
            channelItemSingle.isVisible = true;
          }
          this.view[ALL_CONSENT_TYPES].add(consentTypeItem);
          consentTypeItem.isVisible = true;
        }
      }
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain','flxMenuItemMobile','flxRight']);
      this.view.profileMenu.flxSeperator.height = this.view.flxRight.info.frame.height;
      this.view.flxLeft.height = this.view.flxRight.info.frame.height;
      this.view.forceLayout();
      if (applicationManager.getConfigurationManager().checkUserPermission("CDP_CONSENT_VIEW")) {
        //scopeObj.showConsentManagementView(this);
      }
    },
    showConsentManagementView: function(result) {
      var scopeObj = this;
      this.view.lblConsentManagementCollapse.text = ViewConstants.FONT_ICONS.CHEVRON_UP;
      this.view.lblConsentManagementCollapse.toolTip = "Collapse";
      this.view.customheadernew.activateMenu("Settings", "Consent Management");
      this.view.lblConsentManagementCollapse.accessibilityConfig = {
        "a11yLabel": "Collapse"
      };
      this.view.forceLayout();
    },
    /**
         *  Method to set ui for the component in mobile breakpoint
         */
    toggleMenuMobile: function() {
      if (this.view.lblCollapseMobile.text === "O") {
        this.view.lblCollapseMobile.text = "P";
        this.view.flxLeft.setVisibility(true);
        this.view.flxRight.setVisibility(false);
      } else {
        this.view.lblCollapseMobile.text = "O";
        this.view.flxLeft.setVisibility(false);
        this.view.flxRight.setVisibility(true);
      }
    },
    /**
         * Method to show the consent management wrapper
         */
    showConsent: function() {
      //    this.showViews(["flxConsentManagementWrapper"]);
    },
    setDataVisibility: function(vissibility) {
      this.view.flxConsentManagementWrapper.setVisibility(vissibility);
      this.view.flxConsentManagementNotification.setVisibility(vissibility);
      this.view.flxErrorConsent.setVisibility(!vissibility);
    },
    showEditConsent: function() {
      consentEdit = true;
      var scopeObj = this;
      this.view.btnEditConsent.isVisible = false;
      var flexRoot = this.view.flxConsentManagementContainer.flxAllConsentTypes.widgets();
      for (var i = 0; i < flexRoot.length; i++) {
        var flxItemRow = flexRoot[i].widgets()[5];
        var flxOptions = flxItemRow.widgets();
        if (flexRoot[i].widgets()[2].isVisible === false) {
          for (var j = 0; j < flxOptions.length; j++) {
            var itemOption = flxOptions[j].widgets();
            itemOption[0].skin = "sknlblOLBFonts3343A820pxOlbFontIcons";
            itemOption[1].skin = "sknlbla0a0a015px";
          }
        }
      }
      scopeObj.view.flxConsentManagementButtons.setVisibility(true);
      scopeObj.view.flxConsentManagementContainer.flxAllConsentTypes = this.view.flxConsentManagementContainer.flxAllConsentTypes;
      scopeObj.disableButton(this.view.btnConsentManagementSave);
      scopeObj.view.forceLayout();
      this.postShow();
    },
    setFlowActions: function() {
      var scopeObj = this;
      var self = this;

    }
  };
});