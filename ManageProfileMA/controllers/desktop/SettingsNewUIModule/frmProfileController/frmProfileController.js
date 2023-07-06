define(['CommonUtilities', 'CSRAssistUI','FormControllerUtility', 'OLBConstants', 'ViewConstants', 'CampaignUtility'], function(CommonUtilities, CSRAssistUI, FormControllerUtility, OLBConstants, ViewConstants) {
  var orientationHandler = new OrientationHandler();
  var responsiveUtils = new ResponsiveUtils();
  var flexVisibility = false;
  return {
    updateFormUI: function(viewModel) {
      if (viewModel.userProfile) this.updateUserProfileSetttingsView(viewModel.userProfile);
    },
    init:function(){
      var self=this;
      this.view.preShow=this.preShow;
      this.view.postShow=this.postShowProfile;
      this.view.flxAccountSettingsCollapseMobile.onClick = this.toggleMenuMobile;
      this.setFlowActions();
      applicationManager.getLoggerManager().setCustomMetrics(this, false, "Profile");
      this.view.onBreakpointChange = function() {
        self.onBreakpointChange(kony.application.getCurrentBreakpoint());
      };
    },
    preShow:function()
    {
      this.view.flxRight.setVisibility(true);
      this.changeProgressBarState(true);
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxFooter', 'flxMain','flxMenuItemMobile']);
      this.view.lblCollapseMobile.text  = "O";
      this.view.customheadernew.activateMenu("Settings","Profile Settings");
      this.view.profileMenu.checkLanguage();
      this.view.profileMenu.activateMenu("PROFILESETTINGS","Profile");
      this.setSelectedValue("i18n.ProfileManagement.Profile");
      this.setAccessibility();
      this.view.lblProfileDeleteContent= kony.i18n.getLocalizedString("i18n.Profile.DeleteProfilePictureWarning");
    
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
    postShowProfile: function() { 
      applicationManager.getNavigationManager().applyUpdates(this);
      this.view.ProfileInfo.imgCross.toolTip=kony.i18n.getLocalizedString("i18n.common.close");
      this.view.ProfileInfo.isVisible = false;
      this.view.flxMain.minHeight = kony.os.deviceInfo().screenHeight -this.view.flxHeader.info.frame.height - this.view.flxFooter.info.frame.height + "dp"; 
      this.setDefaultUserPhoto(); 
      this.changeProgressBarState(false);
      this.view.forceLayout(); 
    },
    /**
	*  Method to set the user photo on the header and the form
	*/
    setDefaultUserPhoto: function() {
      var userImageURLTest = applicationManager.getUserPreferencesManager().getUserImage();
      if (this.view.customheadernew && userImageURLTest === "") {
        this.view.customheadernew.imgUser.src = "";
        this.view.customheadernew.CopyimgToolTip0i580d9acc07c42.src = "";
        this.view.customheadernew.CopyimgToolTip0i580d9acc07c42.src = ViewConstants.IMAGES.USER_DEFAULT_IMAGE;
        this.view.customheadernew.imgUser.src = ViewConstants.IMAGES.USER_DEFAULT_IMAGE;
      }
      if (userImageURLTest === "") {
        this.view.imgProfile.src = ViewConstants.IMAGES.USER_DEFAULT_IMAGE;
      }
      else{
        this.view.imgProfile.base64 = "";
        this.view.customheadernew.imgUser.base64 = "";
        this.view.customheadernew.CopyimgToolTip0i580d9acc07c42.base64 = "";
        this.view.customheadernew.CopyimgToolTip0i580d9acc07c42.base64 = userImageURLTest;
        this.view.imgProfile.base64 = userImageURLTest;
        this.view.customheadernew.imgUser.base64 = userImageURLTest;
      }
      this.view.customheadernew.imgUser.accessibilityConfig = {
        "a11yLabel": kony.i18n.getLocalizedString("i18n.ProfileManagement.Settingscapson")
      }
    },
    /**
    * *@param {json} data- user data to be displayed in json format
	*  Method to set the user data such as name,dob,ssn and image in the form
	*/
    updateUserProfileSetttingsView: function(data) {
      var userProfileViewModel = {
        name: (data.userlastname === null) ? data.userfirstname : (data.userfirstname === null) ? data.userlastname : data.userfirstname + " " + data.userlastname,
        dob: CommonUtilities.getFrontendDateString(data.dateOfBirth, "YYYY-MM-DD"),
        maskedSSN: (data.ssn)?'***-**-' + CommonUtilities.getLastFourDigit(data.ssn):"",
        userImage: data.userImageURL
      };
      flexVisibility=true;
      this.view.flxProfileWrapper.setVisibility(flexVisibility);
      this.changeProgressBarState(false);
      CommonUtilities.setText(this.view.lblNameValue, userProfileViewModel.name , CommonUtilities.getaccessibilityConfig());
      CommonUtilities.setText(this.view.lblDOBValue, userProfileViewModel.dob , CommonUtilities.getaccessibilityConfig());
      CommonUtilities.setText(this.view.lblSocialSecurityValue, userProfileViewModel.maskedSSN , CommonUtilities.getaccessibilityConfig());
      this.view.flxImageError.setVisibility(false);
      if(applicationManager.getConfigurationManager().getProfileImageAvailabilityFlag() === true && userProfileViewModel.userImage && userProfileViewModel.userImage.trim() != "") {
        this.view.imgProfile.base64 = userProfileViewModel.userImage;
        this.view.btnEditPhoto.isVisible = true;
        this.view.btnDeletephoto.isVisible = true;
        this.view.btnAddPhoto.isVisible = false;
        this.view.flxWhatIsSSN.isVisible = false;
      } else if(applicationManager.getConfigurationManager().getProfileImageAvailabilityFlag() === false){
        this.view.imgProfile.src =  ViewConstants.IMAGES.USER_GREY_IMAGE;
        this.view.btnEditPhoto.isVisible = false;
        this.view.btnDeletephoto.isVisible = false;
        this.view.btnAddPhoto.isVisible = false;
        this.view.flxWhatIsSSN.isVisible = false;
      }
      else{
        this.view.imgProfile.src =  ViewConstants.IMAGES.USER_GREY_IMAGE;
        this.view.btnEditPhoto.isVisible = false;
        this.view.btnDeletephoto.isVisible = false;
        this.view.btnAddPhoto.isVisible = true;
        if(kony.application.getCurrentBreakpoint() != 640){
          this.view.flxWhatIsSSN.isVisible = true;
        }
      }
      if(!applicationManager.getConfigurationManager().checkUserPermission("PROFILE_SETTINGS_UPDATE")){
        this.view.btnEditPhoto.isVisible = false;
        this.view.btnDeletephoto.isVisible = false;
        this.view.btnAddPhoto.isVisible = false;
        this.view.flxWhatIsSSN.isVisible = false;
      }
    },
    onBreakpointChange: function (width) {
      FormControllerUtility.setupFormOnTouchEnd(width);
      this.view.flxProfileWrapper.setVisibility(flexVisibility);
      responsiveUtils.onOrientationChange(this.onBreakpointChange);
      this.view.customheadernew.onBreakpointChangeComponent(width);
      this.view.customfooternew.onBreakpointChangeComponent(width);
      this.view.profileMenu.onBreakpointChangeComponent(width);
      orientationHandler.onOrientationChange(this.onBreakpointChange);
      if (kony.application.getCurrentBreakpoint() === 640 || orientationHandler.isMobile) {
         var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
         CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings"), accessibilityConfig);
      }
      this.view.forceLayout();      
    },
    /**
    * *@param {base64} userImage- uploaded user image in base64 format
	*  Method to set the uploaded image in the form
	*/
    bindUploadedImage: function(userImage){
      this.view.flxProfileWrapper.setVisibility(true);
      this.changeProgressBarState(false);
      if(applicationManager.getConfigurationManager().getProfileImageAvailabilityFlag() === true && userImage) {
        this.view.imgProfile.base64 = userImage;
        this.view.btnEditPhoto.isVisible = true;
        this.view.btnDeletephoto.isVisible = true;
        this.view.btnAddPhoto.isVisible = false;
        this.view.flxWhatIsSSN.isVisible = false;
      }
      else if(applicationManager.getConfigurationManager().getProfileImageAvailabilityFlag() === false){
        this.view.imgProfile.src =  ViewConstants.IMAGES.USER_GREY_IMAGE;
        this.view.btnEditPhoto.isVisible = false;
        this.view.btnDeletephoto.isVisible = false;
        this.view.btnAddPhoto.isVisible = false;
        this.view.flxWhatIsSSN.isVisible = false;
      }
      else{
        this.view.imgProfile.src =  ViewConstants.IMAGES.USER_GREY_IMAGE;
        this.view.btnEditPhoto.isVisible = false;
        this.view.btnDeletephoto.isVisible = false;
        this.view.btnAddPhoto.isVisible = true;
        if(kony.application.getCurrentBreakpoint() != 640){
          this.view.flxWhatIsSSN.isVisible = true;
        }         
      }
      this.view.customheadernew.setupUserProfile();
      if(!applicationManager.getConfigurationManager().checkUserPermission("PROFILE_SETTINGS_UPDATE")){
        this.view.btnEditPhoto.isVisible = false;
        this.view.btnDeletephoto.isVisible = false;
        this.view.btnAddPhoto.isVisible = false;
        this.view.flxWhatIsSSN.isVisible = false;
      }
      this.view.forceLayout();
    },
    /**
	*  Method to set the Accessibility configurations
	*/
    setAccessibility: function(){
      var accessibilityConfig = CommonUtilities.getaccessibilityConfig();
      this.view.btnAddPhoto.toolTip = kony.i18n.getLocalizedString("i18n.ProfileManagement.ADDPHOTO");
      this.view.btnDeletephoto.toolTip = kony.i18n.getLocalizedString("i18n.transfers.deleteExternalAccount");
      this.view.btnEditPhoto.toolTip = kony.i18n.getLocalizedString("i18n.billPay.Edit");
      this.view.btnDeletePopupYes.toolTip = kony.i18n.getLocalizedString("i18n.common.yes");
      this.view.btnDeletePopupNo.toolTip = kony.i18n.getLocalizedString("i18n.common.no");
      this.view.customheadernew.lblAccounts.toolTip=kony.i18n.getLocalizedString("i18n.topmenu.accounts");
      CommonUtilities.setText(this.view.customheadernew.lblHeaderMobile, kony.i18n.getLocalizedString("i18n.ProfileManagement.profilesettings"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblProfileDeleteHeader, kony.i18n.getLocalizedString("i18n.Profile.DeleteProfilePicture"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblProfileDeleteContent, kony.i18n.getLocalizedString("i18n.Profile.DeleteProfilePictureWarning"), accessibilityConfig);
      CommonUtilities.setText(this.view.btnDeletePopupYes, kony.i18n.getLocalizedString("i18n.common.yes"), accessibilityConfig);
      CommonUtilities.setText(this.view.btnDeletePopupNo, kony.i18n.getLocalizedString("i18n.common.no"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblNameKey, kony.i18n.getLocalizedString("i18n.ProfileManagement.Name"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblPersonalDetailsHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.PersonalDetails"), accessibilityConfig);
      CommonUtilities.setText(this.view.btnAddPhoto, kony.i18n.getLocalizedString("i18n.ProfileManagement.ADDPHOTO"), accessibilityConfig);
      CommonUtilities.setText(this.view.btnDeletephoto, kony.i18n.getLocalizedString("i18n.transfers.deleteExternalAccount"), accessibilityConfig);
      CommonUtilities.setText(this.view.btnEditPhoto, kony.i18n.getLocalizedString("i18n.billPay.Edit"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblDOBKey, kony.i18n.getLocalizedString("i18n.common.DOB"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblMobileKey, kony.i18n.getLocalizedString("i18n.ProfileManagement.PhoneNumbers"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblEmailId, kony.i18n.getLocalizedString("i18n.ProfileManagement.EmailID"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblSocialSecurityKey, kony.i18n.getLocalizedString("i18n.ProfileManagement.SocialSecurity"), accessibilityConfig);
      //CommonUtilities.setText(this.view.lblHeading, kony.i18n.getLocalizedString("i18n.ProfileManagement.Settingscapson"), accessibilityConfig);
      //CommonUtilities.setText(this.view.ProfileInfo.RichTextInfo, kony.i18n.getLocalizedString("i18n.profileManagement.profileImageInfo"), accessibilityConfig);
      //CommonUtilities.setText(this.view.ProfileInfo.lblInfo, kony.i18n.getLocalizedString("i18n.WireTransfers.Information"), accessibilityConfig);
      this.view.lblCollapseMobile.accessibilityConfig = {
          "a11yARIA": {
               "tabindex": -1
           }
      };
      this.view.flxAccountSettingsCollapseMobile.accessibilityConfig = {
          "a11yLabel": "Dropdown"
      };
      this.view.flxWhatIsSSN.accessibilityConfig={
        "a11yARIA": 
        {
          "tabindex" : -1
        }
      };  
    },  
    /**
	*  Method to set the Form Flow Actions such as button onclick events
	*/
    setFlowActions:function(){
      var scopeObj=this;
      this.view.btnDeletePopupYes.onClick = function(){
        scopeObj.view.flxDialogs.isModalContainer = false;
        scopeObj.view.flxDialogs.isVisible = false;
        scopeObj.view.flxProfileDeletePopUp.setVisibility(false);
        FormControllerUtility.showProgressBar(self.view);
        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.userImageDelete();
      };
      this.view.btnDeletePopupNo.onClick = function(){
        scopeObj.view.flxDialogs.isModalContainer = false;
        scopeObj.view.flxDialogs.isVisible = false;
        scopeObj.view.flxProfileDeletePopUp.setVisibility(false);
      };
      this.view.flxWhatIsSSN.onClick = function() {
        scopeObj.view.ProfileInfo.isVisible = true;
        scopeObj.view.ProfileInfo.left = "10%";
        scopeObj.view.ProfileInfo.top ="280dp";
        scopeObj.view.forceLayout();
      };
      this.view.ProfileInfo.flxCross.onClick = function() {
        scopeObj.view.ProfileInfo.isVisible = false;
        scopeObj.view.forceLayout();
      };
      this.view.flxprofiledeleteClose.onClick = function(){
        scopeObj.view.flxDialogs.isModalContainer = false;
        scopeObj.view.flxDialogs.isVisible = false;
        scopeObj.view.flxProfileDeletePopUp.setVisibility(false);      };
      if (CommonUtilities.isCSRMode()) {
        this.view.btnAddPhoto.setEnabled(false);
        this.view.btnAddPhoto.skin = CommonUtilities.disableSegmentButtonSkinForCSRMode(13);
      } else {
        this.view.btnAddPhoto.onClick = function() {    
          scopeObj.view.flxImageError.setVisibility(false);				   
          var config = {
            selectMultipleFiles: true,
            filter: ["image/png", "image/jpeg"]
          };
          kony.io.FileSystem.browse(config, this.selectedFileCallback.bind(this));                   
        }.bind(this);
      }
      if (CommonUtilities.isCSRMode()) {
        this.view.btnEditPhoto.setEnabled(false);
        this.view.btnEditPhoto.skin = CommonUtilities.disableSegmentButtonSkinForCSRMode(13);
      } else {
        this.view.btnEditPhoto.onClick = function() {   
          scopeObj.view.flxImageError.setVisibility(false);			  
          var config = {
            selectMultipleFiles: true,
            filter: ["image/png", "image/jpeg"]
          };
          kony.io.FileSystem.browse(config, this.selectedFileCallback.bind(this));                   
        }.bind(this);
      }
      if (CommonUtilities.isCSRMode()) {
        this.view.btnDeletephoto.setEnabled(false);
        this.view.btnDeletephoto.skin = CommonUtilities.disableSegmentButtonSkinForCSRMode(13);
      } else {
        this.view.btnDeletephoto.onClick = function() {
          scopeObj.view.flxImageError.setVisibility(false);
          scopeObj.view.flxDialogs.isVisible = true;
          scopeObj.view.flxDialogs.isModalContainer = true;
          scopeObj.view.flxLogout.isVisible=false;
          scopeObj.view.flxProfileDeletePopUp.isVisible = true;
        }
      }
    },
    /**
    * *@param {Image} file - Image file to be converted into base64
	*  Method to convert the image file to base64 format
	*/
    getBase64: function(file, successCallback) {
      var reader = new FileReader();
      reader.onloadend = function() {
        successCallback(reader.result);
      };
      reader.readAsDataURL(file);
    },
    /**
	*  Method to validate the selected image and upload if valid or show error if invalid
	*/
    selectedFileCallback: function(events, files) {
      var scopeObj = this;
      if(files[0].file.type === "image/jpeg" || files[0].file.type === "image/png" || files[0].file.type === "image/jpg"){
        var image = files[0].file.size/1048576;
        if(image <= 2){
          this.getBase64(files[0].file, function(base64String) {
            var base64 = base64String.replace(/data:image\/(png|jpeg);base64\,/,"");
            FormControllerUtility.showProgressBar(scopeObj.view);
            kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({"moduleName" : "SettingsNewUIModule", "appName" : "ManageProfileMA"}).presentationController.userImageUpdate(base64);                 
          });
        } else{
          this.view.flxImageError.setVisibility(true);
          CommonUtilities.setText(this.view.lblImageError, kony.i18n.getLocalizedString("i18n.profile.Imagesize") , CommonUtilities.getaccessibilityConfig());
          this.view.forceLayout();
        }
      } else {
        this.view.flxImageError.setVisibility(true);
        CommonUtilities.setText(this.view.lblImageError, kony.i18n.getLocalizedString("i18n.profile.notAValidImage") , CommonUtilities.getaccessibilityConfig());
        this.view.forceLayout();
      }
    }
  };
});