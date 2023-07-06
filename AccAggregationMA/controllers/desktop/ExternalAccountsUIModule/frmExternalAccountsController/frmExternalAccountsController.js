define(['commonUtilities', 'CommonUtilities', 'OLBConstants', 'ViewConstants', 'FormControllerUtility'], function(commonUtilities, CommonUtilities, OLBConstants, ViewConstants, FormControllerUtility) {
  var responsiveUtils = new ResponsiveUtils();
  var orientationHandler = new OrientationHandler();
  return {
    init: function() {
      this.view.preShow = this.preShow;
      this.view.postShow = this.postShow;
      this.view.onDeviceBack = function() {};
      this.view.onBreakpointChange = this.onBreakpointChange;
      FormControllerUtility.setRequestUrlConfig(this.view.brwBodyContent);
    },

    updateFormUI: function(uiData) {
      if (uiData) {
        if (uiData.showLoadingIndicator) {
          if (uiData.showLoadingIndicator.status === true) {
            FormControllerUtility.showProgressBar(this.view)
          } else {
            FormControllerUtility.hideProgressBar(this.view)
          }
        }
        if (uiData.serviceError) {
          this.setServiceError(uiData.serviceError)
        }
        if (uiData.externalBankList) {
          this.getBankListForCountry(uiData.externalBankList);
        }
        if (uiData.externalBankTermsandConditions) {
          this.setTermsandConditions(uiData.externalBankTermsandConditions);
        }
        if (uiData.externalBankTCConsentSuccess) {
          this.setConcentTandC(uiData.externalBankTCConsentSuccess);
        }
        if (uiData.refreshConsentSuccess) {
          this.openURL(uiData.refreshConsentSuccess);
        }
      }
    },


    setServiceError: function(status) {
      if (status) {
        this.view.flxServerError.setVisibility(true);
        var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
        CommonUtilities.setText(this.view.rtxErrorMessage, kony.i18n.getLocalizedString("i18n.common.OoopsServerError"), accessibilityConfig);
        this.view.rtxErrorMessage.setFocus(true);
      } else {
        this.view.flxServerError.setVisibility(false);
      }
    },

    loadExternalAccountModule: function() {
      return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "ExternalAccountsUIModule",
        "appName": "AccAggregationMA"
      });
    },

    preShow: function() {
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter']);
      this.view.flxBankInfo.isVisible = true;
      this.view.tbxName.text = "";
      this.view.flxContentDetails.isVisible = false;
      this.view.btnOpenNewAccount.onClick = function() {
		var config = applicationManager.getConfigurationManager();
		var ssoConfig = config.getSSOConfig();
		if(ssoConfig!== undefined && ssoConfig.toLowerCase() === "true"){
		    var configurationManager = applicationManager.getConfigurationManager();
			var reDirectionURL = configurationManager.getOnBoardingAppDirectionURL();
			if (reDirectionURL) {
			   location.assign(reDirectionURL);
			} else {
				// Parsing the service url present in appConfig
				var protocol = appConfig.isturlbase.split("//")[0];
				var origin = appConfig.isturlbase.split("//")[1].split("/")[0];
				// Getting the current app name from appDetails
				var appName = appDetails.appID;
				// Redirecting to
				location.assign(protocol + "//" + origin + "/apps/" + configurationManager.getOnboardingAppID() + "#_frmLanding");
			}
		} else if(ssoConfig.toLowerCase() === "false"){ }
	  }.bind(this);
      //this.loadExternalAccountModule().presentationController.navigateToNewAccountOpening.bind(this.loadExternalAccountModule().presentationController);
      this.view.btnContactUs.onClick = function() {
        FormControllerUtility.showProgressBar(this.view);
        this.loadExternalAccountModule().presentationController.showContactUs();
      }.bind(this);
      this.view.tbxName.onKeyUp = this.onTextChangeOfExternalBankSearch;
    },
    postShow: function() {
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight - this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp";
      applicationManager.getNavigationManager().applyUpdates(this);
      this.view.forceLayout();
      this.accessibilityFocusSetup();
      var accountsAggModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "ExternalAccountsUIModule", 
        "appName": "AccAggregationMA"
      });
      var externalBankTandC = accountsAggModule.presentationController.externalBankTermsandConditions
      if(Object.keys(externalBankTandC).length > 0) {
        this.setTermsandConditions(externalBankTandC);
      }
      if (kony.application.getCurrentBreakpoint() > 1366 && orientationHandler.isDesktop) {
        this.view.customfooternew.flxFooterMenu.left = "12%";
        this.view.customfooternew.lblCopyright.left = "12%"; 
      }
      if (kony.os.deviceInfo().screenWidth > 1536  && kony.os.deviceInfo().screenWidth < 1920 && orientationHandler.isDesktop) {
        this.view.customfooternew.flxFooterMenu.left = "14%";
        this.view.customfooternew.lblCopyright.left = "14%";
      } 
      if (kony.os.deviceInfo().screenWidth >= 1920 && orientationHandler.isDesktop) {
        this.view.customfooternew.flxFooterMenu.left = "18.5%";
        this.view.customfooternew.lblCopyright.left = "18.5%";
      }
    },
    /**
         * Set foucs handlers for skin of parent flex on input focus 
         */
    accessibilityFocusSetup: function() {
      let widgets = [
        [this.view.tbxName, this.view.flxtxtSearchandClearbtn]
      ]
      for (let i = 0; i < widgets.length; i++) {
        CommonUtilities.setA11yFoucsHandlers(widgets[i][0], widgets[i][1], this)
      }
    },

    navigateToAccountPreferences: function() {
      var profileModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "SettingsNewUIModule", //ProfileUIModule
        "appName": "ManageProfileMA"
      });
      profileModule.presentationController.showPreferredAccounts();
    },



    getBankListForCountry: function(banks) {
      var data = banks;
      this.view.lblUserInformation.text = kony.i18n.getLocalizedString("i18n.ExternalAccounts.SelectTheBank");
      this.view.flxBankInfo.isVisible = true;
      this.view.flxPopularBanks.isVisible = true;
      this.view.flxBankList.isVisible = false;
      this.view.flxSelectBankOrVendorButtons.isVisible = true;
      this.view.lblPopularBanks.text = kony.i18n.getLocalizedString("i18n.ExternalAccounts.AllBanks");
      this.view.btnUpdateAccntPreferences.onClick = this.navigateToAccountPreferences;
      this.view.btnUpdateAccntPreferences.toolTip = kony.i18n.getLocalizedString("i18n.AccountsAggregation.UpdateAccountPreferences");
      this.view.segPopularBanksList.widgetDataMap = {
        "lblUsers": "bankName",
        "imgBank": "logoUrl",
        "lblBankId": "internalBankId",
        "lblScope": "supportedFetchScopess",
        "lblProviderCode": "bankCode"
      };
      this.externalBankSearchList = data;
      this.view.segPopularBanksList.setData(data);
      this.view.segPopularBanksList.onRowClick = this.getTermsAndConditions.bind(this);
      this.view.btnReset.isVisible = false;
      this.view.btnProceed.isVisible = true;
      this.view.btnProceed.text = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
      this.view.btnProceed.skin = "sknBtnffffffBorder0273e31pxRadius2px";
      this.view.btnProceed.onClick = function() {
        var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
            "moduleName": "AccountsUIModule",
            "appName": "HomepageMA"
          });
        accountsModule.presentationController.showAccountsDashboard();
      };
      this.view.flxBankList.isVisible = false;
      this.view.tbxName.text = "";
      this.view.forceLayout();
      CommonUtilities.hideProgressBar(this.view);
    },


    onTextChangeOfExternalBankSearch: function() {
      var searchText = this.view.tbxName.text;
      this.view.btnReset.isVisible = false;
      this.view.btnProceed.isVisible = true;
      this.view.flxPopularBanks.isVisible = false;
      this.view.flxBankList.isVisible = true;
      this.view.flxSelectBankOrVendorButtons.isVisible = true;
      this.view.btnProceed.text = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
      this.view.btnProceed.skin = "sknBtnffffffBorder0273e31pxRadius2px";
      this.view.btnProceed.onClick = function() {
        var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
            "moduleName": "AccountsUIModule",
            "appName": "HomepageMA"
          });
        accountsModule.presentationController.showAccountsDashboard();
      };
      this.view.segBanksList.widgetDataMap = {
        "lblUsers": "bankName",
        "imgBank": "logoUrl",
        "lblBankId": "internalBankId",
        "lblScope": "supportedFetchScopess",
        "lblProviderCode": "bankCode"
      };
      if (searchText && String(searchText).trim() !== "") {
        searchText = String(searchText).trim().toLowerCase();
        var tempArr = [];
        for (var i in this.externalBankSearchList) {
          if (String(this.externalBankSearchList[i].bankName).trim().toLowerCase().search(searchText) >= 0) {
            tempArr.push(this.externalBankSearchList[i]);
          }
        }
        if (tempArr.length > 0) {
          this.view.segBanksList.setData(tempArr);
          this.view.flxPopularBanks.isVisible = false;
          this.view.flxBankList.isVisible = true;
        } else {
          this.view.segBanksList.setData([]);
          this.view.flxBankList.isVisible = false;
          this.view.flxPopularBanks.isVisible = true;
        }
      } else {
        this.view.segBanksList.setData([]);
        this.view.flxBankList.isVisible = false;
        this.view.flxPopularBanks.isVisible = true;
      }
      this.view.forceLayout();
      this.view.segBanksList.onRowClick = this.getTermsAndConditions.bind(this);
    },


    getTermsAndConditions: function() {
      if (this.view.segPopularBanksList.selectedRowItems.length != 0) {
        var selectedItem = this.view.segPopularBanksList.selectedRowItems[0];
      } else {
        var selectedItem = this.view.segBanksList.selectedRowItems[0];
      }
      var params = {
        bankCode: selectedItem.bankCode,
        type: "createConnection"
      }
      var externalAccountMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "ExternalAccountsUIModule",
        "appName": "AccAggregationMA"
      });
      externalAccountMod.presentationController.getTermsAndConditions(params);
    },


    setTermsandConditions: function(content) {
      var scopObj = this;
      var self = this;
      scopObj.view.lblUserInformation.text = kony.i18n.getLocalizedString("i18n.ExternalAccounts.ConcentDetails");
      scopObj.view.flxBankInfo.isVisible = false;
      scopObj.view.flxContentDetails.isVisible = true;
      scopObj.view.lblRememberMeIcon.text = "D";
      scopObj.view.lblRememberMeIcon.skin = OLBConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
      scopObj.view.flxSelectBankOrVendorButtons.isVisible = true;
      scopObj.view.btnReset.isVisible = true;
      scopObj.view.btnReset.text = kony.i18n.getLocalizedString("i18n.transfers.Cancel");
      scopObj.view.btnReset.onClick = function() {
        var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
            "moduleName": "AccountsUIModule",
            "appName": "HomepageMA"
          });
        accountsModule.presentationController.showAccountsDashboard();
      };
      scopObj.view.btnProceed.isVisible = true;
      scopObj.view.btnProceed.text = kony.i18n.getLocalizedString("i18n.common.proceed");
      scopObj.view.btnProceed.skin = "sknbtnSSPffffff0278ee15pxbr3px";
      FormControllerUtility.setHtmlToBrowserWidget(this, this.view.brwBodyContent, content.termsAndConditionsContent);
      scopObj.disableButton(scopObj.view.btnProceed);
      scopObj.view.flxCheckbox.onTouchEnd = this.toggleTnC.bind(this, self.view.lblRememberMeIcon);
      scopObj.view.btnProceed.onClick = this.getContentTAndC.bind(this, content);
      this.view.forceLayout();
    },

    toggleTnC: function(widget) {
      CommonUtilities.toggleFontCheckbox(this.view.lblRememberMeIcon);
      if (widget.text === OLBConstants.FONT_ICONS.CHECBOX_UNSELECTED) {
        CommonUtilities.disableButton(this.view.btnProceed);
        widget.skin = OLBConstants.SKINS.CHECKBOX_UNSELECTED_SKIN;
      } else {
        CommonUtilities.enableButton(this.view.btnProceed);
        widget.skin = OLBConstants.SKINS.CHECKBOX_SELECTED_SKIN;
      }
    },

    getContentTAndC: function(content) {
      var backendId = "";
      let currentLegalEntity = applicationManager.getUserPreferencesManager().getCurrentLegalEntity();
      if (!kony.sdk.isNullOrUndefined(currentLegalEntity)) {
        var user_attributes = kony.sdk.getCurrentInstance().tokens[OLBConstants.IDENTITYSERVICENAME].provider_token.params.user_attributes;
        var backendIdentifiers = user_attributes.backendIdentifiers ? user_attributes.backendIdentifiers : "";
        if (backendIdentifiers.length > 0) {
           var jsonRes = JSON.parse(backendIdentifiers);
           if (jsonRes.T24 && jsonRes.T24[0]) {
				for(var i=0; i<jsonRes.T24.length; i++){
	 				var backendIdentifier = jsonRes.T24[i].BackendId;
                    if (currentLegalEntity === jsonRes.T24[i].CompanyId){
						backendId = backendIdentifier;
						break;
					}
				}
           } else if (jsonRes.CORE && jsonRes.CORE[0]) {
				for(var i=0; i<jsonRes.CORE.length; i++){
					var backendIdentifier = jsonRes.CORE[i].BackendId;
					if (currentLegalEntity === jsonRes.CORE[i].CompanyId){
						backendId = backendIdentifier;
						break;
					}
				}
           }
       	}
      } else {
         backendId = applicationManager.getUserPreferencesManager().getBackendIdentifier();
      }
      var date = new Date();
      var from_date = ("0" + date.getDate()).slice(-2) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + (date.getYear() + 1900);
      var request = {
        "digitalProfileId": backendId,
        "javascript_callback_type": "post_message",
        "scopes": "['account_details', 'transactions_details']",
        "from_date": from_date,
        "period_days": "90",
        "providerCode": content.bankCode,
        "fetch_scopes": "[ 'accounts', 'transactions' ]",
        "operation": content.operation
      };
      var externalAccountMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "ExternalAccountsUIModule",
        "appName": "AccAggregationMA"
      });
      externalAccountMod.presentationController.giveTermsAndConditionsConsent(request);
    },


    setConcentTandC: function(data) {
      var scopObj = this;
      var externalAccountMod = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "ExternalAccountsUIModule",
        "appName": "AccAggregationMA"
      });
      scopObj.view.flxContentDetails.isVisible = false;
      scopObj.view.flxSelectBankOrVendorButtons.isVisible = false;
      scopObj.view.flxSaltEdge.isVisible = true;
      scopObj.openURL(data);
      this.view.forceLayout();
    },
    openURL: function(data) {
      var temp_url = data.connect_url;
      kony.application.openURL(temp_url);
      var accountsModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        "moduleName": "AccountsUIModule",
        "appName": "HomepageMA"
      });
      accountsModule.presentationController.showAccountsDashboard();
    },
    disableButton: function(button) {
      button.setEnabled(false);
      button.skin = ViewConstants.SKINS.LOCATE_BTNSHARESEND;
      button.hoverSkin = ViewConstants.SKINS.LOCATE_BTNSHARESEND;
      button.focusSkin = ViewConstants.SKINS.LOCATE_BTNSHARESEND;
    },

    enableButton: function(button) {
      button.setEnabled(true);
      button.skin = ViewConstants.SKINS.PFM_BTN_ENABLE;
      button.hoverSkin = ViewConstants.SKINS.PFM_BTN_ENABLE_HOVER;
      button.focusSkin = ViewConstants.SKINS.PFM_BTN_ENABLE_FOCUS;
    },
    onBreakpointChange: function(form, width) {
      var scope = this;
      this.view.CustomPopupLogout.onBreakpointChangeComponent(scope.view.CustomPopupLogout, width);
      FormControllerUtility.setupFormOnTouchEnd(width);
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
    },



  };
});