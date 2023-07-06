define(['CommonUtilities', 'CSRAssistUI','FormControllerUtility', 'OLBConstants', 'ViewConstants', 'CampaignUtility'], function(CommonUtilities, CSRAssistUI, FormControllerUtility, OLBConstants, ViewConstants) {
  var orientationHandler = new OrientationHandler();
  var responsiveUtils = new ResponsiveUtils();
  return {
    updateFormUI: function(viewModel) {
      if (viewModel !== undefined) {
        if(viewModel.updateSecurityQuestionError)this.showSecurityQuestionsError(viewModel);
        if (viewModel.SecurityQuestionExists) this.showSecurityQuestions(viewModel.SecurityQuestionExists);
        if (viewModel.isLoading !== undefined) this.changeProgressBarState(viewModel.isLoading);   
      }
    },
    preShow:function()
    {
      this.view.flxRight.setVisibility(true);
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain','flxMenuItemMobile']);
      this.view.lblCollapseMobile.text  = "O";
      this.view.customheadernew.activateMenu("Settings","Security Settings");
      this.view.profileMenu.checkLanguage();
      this.view.profileMenu.activateMenu("SECURITYSETTINGS","Security Setting");
      this.setSelectedValue("i18n.ProfileManagement.SecuritySettings");
      this.setAccessibility();
      this.view.forceLayout();
    },
    init:function(){
      var self=this;
      applicationManager.getLoggerManager().setCustomMetrics(this, false, "Profile");
      this.view.preShow=this.preShow;
      this.view.postShow=this.postShow;
      this.view.flxAccountSettingsCollapseMobile.onClick = this.toggleMenuMobile;
      this.view.onBreakpointChange = function() {
        self.onBreakpointChange(kony.application.getCurrentBreakpoint());
      };
      this.setFlowActions();
    },
    /**
	* *@param {String} text- text that needs to be appended to the upper text in mobile breakpoint
	*  Method to set the text in mobile breakpoint
	*/
    setSelectedValue: function (text) {
      var self = this;
      CommonUtilities.setText(self.view.lblAccountSettingsMobile, kony.i18n.getLocalizedString(text) , CommonUtilities.getaccessibilityConfig());
    },
    /**
       * Method to show error while requestind OTP
       */
    showRequestOtpError: function() {
      //warning flex not there
      this.view.forceLayout();
      FormControllerUtility.hideProgressBar(this.view);
    },
    showSecurityQuestionsError:function(viewModel){
      CommonUtilities.setText(this.view.lblErrorSecuritySettings, kony.i18n.getLocalizedString("i18n.ProfileManagement.updateServerError") , CommonUtilities.getaccessibilityConfig());
      this.view.flxErrorEditSecuritySettings.setVisibility(true);
      this.view.forceLayout();
      FormControllerUtility.hideProgressBar(this.view);      
    },
    /**
       * Method to show error while verifying OTP
       */
    showVerifyOtpServerError: function() {
      this.view.flxErrorSecuritySettingsVerification.setVisibility(true);
      CommonUtilities.setText(this.view.lblErrorSecuritySettingsVerification, kony.i18n.getLocalizedString("i18n.ProfileManagement.updateServerError") , CommonUtilities.getaccessibilityConfig());
      this.view.forceLayout();
    },
    /**
	*  Method to set the Accessibility configurations
	*/
    setAccessibility: function(){
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      this.view.btnSecuritySettingsProceed.text = kony.i18n.getLocalizedString("i18n.enrollNow.proceed");
      this.view.btnSecuritySettingsProceed.toolTip = kony.i18n.getLocalizedString("i18n.enrollNow.proceed");
       this.view.customheadernew.lblAccounts.toolTip=kony.i18n.getLocalizedString("i18n.topmenu.accounts");
      CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.SecuritySettings"), accessibilityConfig);
      CommonUtilities.setText(this.view.lblRulesreset, kony.i18n.getLocalizedString("i18n.StopPayment.PleaseNote"), accessibilityConfig);
      CommonUtilities.setText(this.view.lblSecurityRuleReset1, kony.i18n.getLocalizedString("i18n.ProfileManagement.SecurityQuestionPoint1"), accessibilityConfig);
      CommonUtilities.setText(this.view.lblSecurityRuleReset2, kony.i18n.getLocalizedString("i18n.ProfileManagement.SecurityQuestionPoint2"), accessibilityConfig);
      CommonUtilities.setText(this.view.lblSecurityRuleReset3, kony.i18n.getLocalizedString("i18n.ProfileManagement.SecurityQuestionPoint3"), accessibilityConfig);
      //CommonUtilities.setText(this.view.btnSecuritySettingsProceed, kony.i18n.getLocalizedString("i18n.enrollNow.proceed"), accessibilityConfig);
      CommonUtilities.setText(this.view.lblSecuritySettingsHeader, kony.i18n.getLocalizedString("i18n.ProfileManagement.SecuritySettings"), accessibilityConfig);    
      CommonUtilities.setText(this.view.lblHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.Settingscapson"), accessibilityConfig);	
      this.view.lblCollapseMobile.accessibilityConfig = {
        "a11yARIA": {
            "tabindex": -1
        }
      };
      this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
        "a11yLabel": "Dropdown"
      };
      this.view.imgWarningresetquestions.accessibilityConfig ={
        "a11yLabel": kony.i18n.getLocalizedString("i18n.securitySettings.infoSecuritySettings")
     }
      this.view.btnSecuritySettingsProceed.accessibilityConfig = {
       "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.ProceedSecuritySettings")
      }
      this.view.lblSecuritySettingsHeader.accessibilityConfig = {
        "a11yLabel": ""
    }
    this.view.lblRulesreset.accessibilityConfig = {
        "a11yLabel": ""
    }
    this.view.lblSecurityRuleReset1.accessibilityConfig = {
        "a11yLabel": ""
    }
    this.view.lblSecurityRuleReset2.accessibilityConfig = {
        "a11yLabel": ""
    }
    this.view.lblSecurityRuleReset3.accessibilityConfig = {
        "a11yLabel": ""
    }
    this.view.btnSecuritySettingsProceed.accessibilityConfig = {
        "a11yLabel": ""
    }
    this.view.btnSecuritySettingsProceed.accessibilityConfig = {
        "a11yLabel": ""
    }
    this.view.btnSecuritySettingsProceed.accessibilityConfig = {
        "a11yLabel": ""
    }
    this.view.btnSecuritySettingsProceed.accessibilityConfig = {
        "a11yLabel": ""
    }
    this.view.btnSecuritySettingsProceed.accessibilityConfig = {
        "a11yLabel": ""
    }
    }, 
    onBreakpointChange: function (width) {
      FormControllerUtility.setupFormOnTouchEnd(width);
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
      this.view.profileMenu.onBreakpointChangeComponent(width);
      orientationHandler.onOrientationChange(this.onBreakpointChange);
      if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
        var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
        CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.SecuritySettings"), accessibilityConfig);
      }
      this.view.forceLayout();      
    },

    setFlowActions:function(){
      var scopeObj=this;
      this.view.btnSecuritySettingsProceed.onClick=function(){
        var selectedQuestionsTemp =  {
          securityQuestions: [],
          flagToManipulate: []
        };
        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.fetchSecurityQuestions(selectedQuestionsTemp);
      }
    },
    /**
	*  Method to set ui for the component in mobile breakpoint
	*/
    toggleMenuMobile: function () {
      if (this.view.lblCollapseMobile.text === "O") {
        this.view.lblCollapseMobile.text = "P";
        this.view.flxLeft.setVisibility(true);
        this.view.flxRight.setVisibility(false);
      } else {
        this.view.lblCollapseMobile.text  = "O";
        this.view.flxLeft.setVisibility(false);
        this.view.flxRight.setVisibility(true);
      }
    }, 
    /**
       * Method to show all the security questions screen after fetching from backend
       * @param {Object} viewModel- None
       */

    showSecurityQuestions: function(viewModel) {

    },
    /**
	* *@param {Boolean} isLoading- True or false to show/hide the progess bar
	*  Method to set show/hide the progess bar
	*/
    changeProgressBarState: function(isLoading) {
      if (isLoading) {
        FormControllerUtility.showProgressBar(this.view);
      } else {
        FormControllerUtility.hideProgressBar(this.view);
      }
    },
    postShow: function() { 
      applicationManager.getNavigationManager().applyUpdates(this);
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight -this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp"; 
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      this.view.imgWarningresetquestions.toolTip=kony.i18n.getLocalizedString("i18n.payments.displayError");
      CommonUtilities.setText(this.view.lblHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.Settingscapson"), accessibilityConfig);
      this.view.forceLayout();      
    },

  };
});