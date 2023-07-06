define(["CommonUtilities", "FormControllerUtility", "OLBConstants", "ViewConstants"], function(CommonUtilities, FormControllerUtility, OLBConstants, ViewConstants) {
    var responsiveUtils = new ResponsiveUtils();
    var orientationHandler = new OrientationHandler();
    var isAddToEntityFlow = false;
    return {
        segData:"",
        init: function() {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.initActions();
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = this.onBreakpointChange;
        },
        onBreakpointChange: function(form, width) {
            this.view.customheadernew.onBreakpointChangeComponent(width);
            var scope=this;
            var data = scope.segData;
            data=(scope.segData!=="")? scope.segData:scope.view.segmentAccRoleMain.data;
            var datamap={
              "flxUserManagement": "flxUserManagement",
              "flxUserManagementAccAccessRole": "flxUserManagementAccAccessRole",
              "flxUserManagementAccPermissions": "flxUserManagementAccPermissions",
              "lblLeftSideContent": "lblLeftSideContent",
              "lblRIghtSideContent": "lblRIghtSideContent",
              "lblRightMostContent": "lblRightMostContent",
              "lblSeparator": "lblSeparator",
              "lblRightContentAuto": "lblRightContentAuto",
            };
            scope.view.segmentAccRoleMain.rowTemplate="flxUserManagementAccAccessRole";
            scope.view.segmentAccRoleMain.widgetDataMap=datamap;
            scope.view.segmentAccRoleMain.setData(data);

            if (width <= 640 || orientationHandler.isMobile) {
              scope.view.segmentAccRoleMain.setData(data);
            } else if (width <= 1024) {
              scope.view.segmentAccRoleMain.setData(data);
            } else if (width <= 1366) {
              scope.view.segmentAccRoleMain.setData(data);
            } else {
              //for hd desktop
              scope.view.segmentAccRoleMain.setData(data);
            }
            if (kony.i18n.getCurrentLocale() === "ar_AE") {
                this.view.flxRightContainerMain.skin = "bbFlxSeperatore3e3e3RightBorder";
            }
        },
        preShow: function() {
          this.serviceCount = 0;
            this.loadBusinessBankingModule().presentationController.getLoginUserPermissions();
            this.getCustomRoles();
            this.getExistingUsers();
            this.view.Search.txtSearch.text = "";
            this.selectedMap = {};
            this.view.flxRightContainerMain.isVisible = false;
            this.view.btnProceedRoles.toolTip=kony.i18n.getLocalizedString("i18n.userManagement.Continue");
            this.view.btnSkip.toolTip=kony.i18n.getLocalizedString("i18n.konybb.common.cancel");
            this.view.btnBackAccessRoles.toolTip=kony.i18n.getLocalizedString("i18n.ProfileManagement.BACK");
            this.view.btnCancel.toolTip=kony.i18n.getLocalizedString("i18n.konybb.common.cancel");
            this.view.lblAccAccessMain.text=kony.i18n.getLocalizedString("i18n.UserManagement.AccountAccessAndRole");
            this.view.segOtherFeaturePermissionsMain.text=kony.i18n.getLocalizedString("kony.mb.usermanagement.otherfeaturepermission");
            this.imgArrowTransform = this.loadBusinessBankingModule().presentationController.getImgTransformObj();
            this.view.Search.flxtxtSearchandClearbtn.skin =  "sknFlxffffffBorder3px";
          applicationManager.getConfigurationManager().skipFlag = false;
        },
        postShow: function() {
          this.onBreakpointChange();
          isAddToEntityFlow = applicationManager.getNavigationManager().getCustomInfo("addToEntityFlow");
          if (isAddToEntityFlow === "addToEntity") {
            var navManager = applicationManager.getNavigationManager();
            var entityDetails = navManager.getCustomInfo("addToEntityDetails");
            var userName = [];
            userName = entityDetails.userDetails.selectedUserName.split(' ');
            this.view.lblAddAccountHeading.text = "Copy Permission";
            this.view.flxSeparatorNew.setVisibility(true);
            this.view.flxSeparatorNew.width = "100%";
            this.view.flxSeparatorNew.left = "0%";
            this.view.flxSeparator.width = "100%";
            this.view.flxSeparator.left = "0%";
            this.view.flxEntityHeader.setVisibility(true);
            this.view.lblEntityHeader.setVisibility(true);
            this.view.lblEntityHeader.text = "Adding " + '"' + entityDetails.userDetails.selectedUserName + '"' + " to " + '"' + entityDetails.addToEntityName + '"' + " entity";
            this.view.lblEntityHeader.skin = "sknSSPSB42424218Px";
          }
          this.view.customheadernew.activateMenu("User Management", "Create UM User");
          this.view.lblBankNameMain.text=kony.i18n.getLocalizedString("i18n.konybb.Common.Role");
          this.view.lblReferenceIdMain.text=kony.i18n.getLocalizedString("i18n.AccountsAggregation.SelectedAccounts");
          this.view.lblAccountNameMain.text=kony.i18n.getLocalizedString("i18n.approvals.customer");
          this.view.lblSubMainHeaderMain.text=kony.i18n.getLocalizedString("konybb.i18n.userMgmt.PermissionDetails");
          this.view.lblHeader.text=kony.i18n.getLocalizedString("konybb.i18n.userMgmt.CopyPermissionsFromLbl");
          if (kony.i18n.getCurrentLocale() === "ar_AE") {
          if (kony.application.getCurrentBreakpoint() <= 1024)
              {
               this.view.flxAccountAccessMain.left="65%";
              }
          }
        },
        //Init Actions
        initActions: function() {
            var scopeObj = this;
            this.view.segCustomRoles.onRowClick = function() {
                scopeObj.RoleOrUserSelected(scopeObj.view.segCustomRoles, scopeObj.view.segExistingUsers);
            };
            this.view.segExistingUsers.onRowClick = function() {
                scopeObj.RoleOrUserSelected(scopeObj.view.segExistingUsers, scopeObj.view.segCustomRoles);
            };
            this.view.Search.txtSearch.onkeyup = function() {
                scopeObj.searchRoleOrUser(scopeObj.view.Search.txtSearch.text);
            };
            this.view.btnProceedRoles.onClick = function() {
              FormControllerUtility.showProgressBar(this.view);
                scopeObj.navToNextForm();
            };
            this.view.btnSkip.onClick = function() {
              FormControllerUtility.showProgressBar(this.view);
                scopeObj.navToSkipForm();
            };
            this.view.btnBackAccessRoles.onClick = this.onBackClick;
            this.view.btnCancel.onClick = this.onCancelClick;
            this.view.Search.flxClearBtn.onClick = function() {
                scopeObj.view.Search.txtSearch.text = "";
                scopeObj.searchRoleOrUser(scopeObj.view.Search.txtSearch.text);
            };
            this.view.btnBackAccessRoles.onClick = this.onBackClick;
            this.view.btnCancel.onClick = this.onCancelClick;
            FormControllerUtility.disableButton(this.view.btnProceedRoles);
        },
        /** Manages the upcomming flow
         * @param  {object} viewModel object consisting data based on which new flow has to drive
         */
        updateFormUI: function(viewModel) {
            if (viewModel.serverError) {
                this.showServerError(viewModel.serverError);
            } else {
                if (viewModel.progressBar === true) {
                    FormControllerUtility.showProgressBar(this.view);
                } else if (viewModel.progressBar === false) {
                    //FormControllerUtility.hideProgressBar(this.view);
                }
                //getCustomRoles success
                if (viewModel.companyLevelCustomRolesSuccess) {
                  this.serviceCount++;
                    this.generateCustomRolesArr(viewModel.companyLevelCustomRolesSuccess);
                    this.showCustomRoles(this.customRoles);
                } else if (viewModel.companyLevelCustomRolesFailure) {
                  this.serviceCount++;
                    this.showCustomRoles([]);
                }
                //getExistingUsers success
                if (viewModel.associatedContractUsersSuccess) {
                  this.serviceCount++;
                    this.generateExistingUsersArr(viewModel.associatedContractUsersSuccess);
                    this.showExistingUsers(this.existingUsers);
                } else if (viewModel.associatedContractUsersFailure) {
                  this.serviceCount++;
                    this.showExistingUsers([]);
                }

                if (viewModel.getInfinityUserFailure) {
                  this.serviceCount++;
                    this.view.flxDowntimeWarning.isVisible = true;
                    this.view.rtxDowntimeWarning.text = viewModel.getInfinityUserFailure;
                    this.view.btnSkip.enable = false;
                }
                if (viewModel.getInfinityUserSuccess) {
                  this.serviceCount++;
                    this.view.flxDowntimeWarning.isVisible = false;
                    this.view.btnSkip.enable = true;
                }
                if (viewModel.getUserDetailsSuccess) {
                    this.showPermissionDetails(viewModel.getUserDetailsSuccess);
                }
              if(this.serviceCount >= 3){
                FormControllerUtility.hideProgressBar(this.view);
              }
            }
            this.view.forceLayout();
        },
        showServerError: function(errmsg) {},
        /** Adjust Screen after click of dropdown in segment */
        AdjustScreen: function() {
            this.view.forceLayout();
            var mainheight = 0;
            var screenheight = kony.os.deviceInfo().screenHeight;
            mainheight = this.view.flxHeader.info.frame.height + this.view.flxMain.info.frame.height + this.view.flxFooter.info.frame.height;
            var diff = screenheight - mainheight;
            if (mainheight < screenheight) {
                diff = diff - this.view.flxFooter.info.frame.height;
                if (diff > 0) {
                    this.view.flxFooter.top = mainheight + diff + ViewConstants.POSITIONAL_VALUES.DP;
                } else {
                    this.view.flxFooter.top = mainheight + ViewConstants.POSITIONAL_VALUES.DP;
                }
            } else {
                this.view.flxFooter.top = mainheight + ViewConstants.POSITIONAL_VALUES.DP;
            }
            this.view.forceLayout();
        },
      navToNextForm: function() {
        this.loadBusinessBankingModule().presentationController.setUserPermissionFlow(OLBConstants.USER_MANAGEMENT_TYPE.COPY);
        //applicationManager.getConfigurationManager().skipFlag = true;
        var userManagementData = this.loadBusinessBankingModule().presentationController.getUserManagementData();
        this.loadBusinessBankingModule().presentationController.setUserManagementData(userManagementData);
        var navMan=applicationManager.getNavigationManager();
        navMan.setCustomInfo("createManualFlow","createCopyFlow");
        applicationManager.getNavigationManager().navigateTo("frmConfirmAndAck");
      },
        navToSkipForm: function() {
           var navMan=applicationManager.getNavigationManager();
        navMan.setCustomInfo("createCopySkipflow","createCopySkipflow");
            this.loadBusinessBankingModule().presentationController.setUSMToLoggedInUserData();
            var userManagementData = this.loadBusinessBankingModule().presentationController.getUserManagementData();
          for (var i = 0; i < userManagementData.companyList.length; i++) {
            userManagementData.companyList[i].autoSyncAccounts = "false";
          }
          var navManager = applicationManager.getNavigationManager();
          navManager.setCustomInfo('createroleManually', "createusermanual");
          this.loadBusinessBankingModule().presentationController.setUserManagementData(userManagementData);	
            applicationManager.getNavigationManager().navigateTo("frmBBAccountAccessAndRole");
        },
        getCustomRoles: function() {
            //FormControllerUtility.showProgressBar(this.view);
            this.loadBusinessBankingModule().presentationController.getCompanyLevelCustomRoles();
        },
        //load BusinessBanking Module
        loadBusinessBankingModule: function() {
            return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("BusinessBankingUIModule");
        },
        // Method to show Custom Roles UI
        showCustomRoles: function(customRoles) {
            let self = this;
            let segHeader = {
                "lblDropdown": {
                    "text": "P",
                    "accessibilityConfig": {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.Accessibility.dropdownOpen")
                    }
                },
                "flxDropdown": {
                    "onClick": self.showOrHideCustomRolesOrExistingUsers.bind(this, self.view.segCustomRoles)
                },
                "lblFromAccountNo": {
                    "text": kony.i18n.getLocalizedString("konybb.i18n.userMgmt.CustomRoles"),
                    "accessibilityConfig": {
                        "a11yLabel": kony.i18n.getLocalizedString("konybb.i18n.userMgmt.CustomRoles")
                    }
                },
                "imgAcknowledged": {
                    "isVisible": self.selectedMap["selectedSeg"] === self.view.segCustomRoles.id
                }
            };
            let segRowData = [];
            this.view.segCustomRoles.isVisible = true;
            if (customRoles === null || customRoles === undefined || customRoles === -1 || customRoles.length === 0) {
                this.view.NoCustomRoles.isVisible = true;
                //this.view.lblNoCustomRole.isVisible = true;
                CommonUtilities.setText(this.view.rtxNoPaymentMessage1, kony.i18n.getLocalizedString("i18n.FastTransfers.NoResultsFound"), CommonUtilities.getaccessibilityConfig());
                this.view.forceLayout();
            } else {
                this.view.NoCustomRoles.isVisible = false;
                //this.view.lblNoCustomRole.isVisible = false;
                segRowData = customRoles.map(function(customRoles) {
                    return {
                        "flxSelectRoleContainer": {
                            "isVisible": true
                        },
                        "imgSelectRole": {
                            "src": self.selectedMap["selectedRow"] === customRoles.id ? "radiobtn_active.png" : "radio_btn_inactive.png"
                        },
                        "imgArrow": {
                            "transform": self.imgArrowTransform,
                            "isVisible": self.selectedMap["selectedRow"] === customRoles.id
                        },
                        "flxInnerRole": {
                          "skin": self.selectedMap["selectedRow"] === customRoles.id ? "sknflxfbfbfb1pxShadowc0c0c0" : "skne3e3e3br3pxradius"
                        },
                        "lblRoleName": {
                            "text": customRoles.customRoleName,
                            "value": customRoles.customRoleName,
                            "accessibilityConfig": {
                                "a11yLabel": customRoles.customRoleName,
                            }
                        },
                        "id": customRoles.id
                    };
                });
            }
            var segDataModel = [
                [segHeader, segRowData]
            ];
            this.view.segCustomRoles.setData(segDataModel);
        },
        //On Rowclick of Custom Role segment or ExistingUsers Segment
        RoleOrUserSelected: function(activeSegment, inactiveSegment) {
            FormControllerUtility.showProgressBar(this.view);
            //To get details
            isAddToEntityFlow = applicationManager.getNavigationManager().getCustomInfo("addToEntityFlow");
            if (isAddToEntityFlow === "addToEntity") {
                var navManager = applicationManager.getNavigationManager();
                var entityId = navManager.getCustomInfo("addToEntityDetails").addToEntityId;
            let businessBankingPresentationController = this.loadBusinessBankingModule().presentationController;
            var scope = this;
            this.selectedMap["selectedSeg"] = activeSegment.id;
            if (activeSegment.id === "segExistingUsers") {
                let userName = activeSegment.selectedRowItems[0].lblRoleName.value;
                this.selectedMap["selectedRow"] = userName;
                let param = {
                    "userName": userName,
                    "legalEntityId": entityId
                };
                businessBankingPresentationController.getInfinityUser(param);
            } else {
                let id = activeSegment.selectedRowItems[0].id;
                this.selectedMap["selectedRow"] = id;
                businessBankingPresentationController.getCustomRoleDetails({
                    "id": id,
                    "legalEntityId": entityId
                });
            }
        }
        else
        {
            let businessBankingPresentationController = this.loadBusinessBankingModule().presentationController;
            var scope = this;
            this.selectedMap["selectedSeg"] = activeSegment.id;
            if (activeSegment.id === "segExistingUsers") {
                let userName = activeSegment.selectedRowItems[0].lblRoleName.value;
                this.selectedMap["selectedRow"] = userName;
                let param = {
                    "userName": userName,
                };
                businessBankingPresentationController.getInfinityUser(param);
            } else {
                let id = activeSegment.selectedRowItems[0].id;
                this.selectedMap["selectedRow"] = id;
                businessBankingPresentationController.getCustomRoleDetails({
                    "id": id,
                });
            }
        }
            //For Active Segment
            var segData = activeSegment.data;
            var index = activeSegment.selectedRowIndex[1];
            segData[0][0].imgAcknowledged = {
                "isVisible": true
            };
            segData[0][1].forEach(function(arrayElement, i) {
                if (i == index) {
                    arrayElement.imgArrow = {
                        "transform": scope.imgArrowTransform,
                        "isVisible": true
                    };
                  	arrayElement.flxInnerRole ={
                      "skin":"sknflxfbfbfb1pxShadowc0c0c0"
                    };
                    arrayElement.imgSelectRole = {
                        "src": "radiobtn_active.png"
                    };
                } else {
                    arrayElement.imgArrow = {
                        "transform": scope.imgArrowTransform,
                        "isVisible": false
                    };
                    arrayElement.flxInnerRole ={
                      "skin":"skne3e3e3br3pxradius"
                    };
                    arrayElement.imgSelectRole = {
                        "src": "radio_btn_inactive.png"
                    };
                }
            });
            activeSegment.setData(segData);
            //For Inactive segment
            var segData1 = inactiveSegment.data;
            segData1[0][0].imgAcknowledged = {
                "isVisible": false
            };
            segData1[0][1].forEach(function(arrayElement) {
                arrayElement.imgArrow = {
                    "transform": scope.imgArrowTransform,
                    "isVisible": false
                };
                arrayElement.flxInnerRole ={
                  "skin":"skne3e3e3br3pxradius"
                };
                arrayElement.imgSelectRole = {
                    "src": "radio_btn_inactive.png"
                };
            });
            inactiveSegment.setData(segData1);
        },

        generateCustomRolesArr: function(customRoles) {
            let self = this;
            let roles = {};
            this.customRoles = [];
            customRoles.companyList.forEach(function(company) {
                company.customRoles.forEach(function(role) {
                    if (!roles.hasOwnProperty(role.id)) {
                        roles[role.id] = true;
                        self.customRoles.push(role);
                    }
                });
            });
        },

        generateExistingUsersArr: function(existingUsers) {
            let self = this;
            let usernames = {};
            this.existingUsers = [];
            let i = -1;
            existingUsers.companyList.forEach(function(companyList) {
                companyList.companies.forEach(function(company) {
                    company.users.forEach(function(user) {
                        if (!usernames.hasOwnProperty(user.userName)) {
                            usernames[user.userName] = ++i;
                            self.existingUsers.push(user);
                            self.existingUsers[i].coreCustomerId = [company.coreCustomerId];
                            self.existingUsers[i].contractId = [companyList.contractId];
                            self.existingUsers[i].contractName = [companyList.contractName];

                        } else {
                            self.existingUsers[usernames[user.userName]].coreCustomerId.push(company.coreCustomerId);
                            if (self.existingUsers[usernames[user.userName]].contractId.indexOf(companyList.contractId) < 0) {
                                self.existingUsers[usernames[user.userName]].contractId.push(companyList.contractId);
                            }
                            if (self.existingUsers[usernames[user.userName]].contractName.indexOf(companyList.contractName) < 0) {
                                self.existingUsers[usernames[user.userName]].contractName.push(companyList.contractName);
                            }
                        }
                    });
                });
            });
        },
        //Get Existing Users
        getExistingUsers: function() {
            //FormControllerUtility.showProgressBar(this.view);
            this.loadBusinessBankingModule().presentationController.getAssociatedContractUsers();
        },
        //Method to show ExistingUsers
        showExistingUsers: function(existingUsers) {
            let self = this;
            let segHeader = {
                "lblDropdown": {
                    "text": "P",
                    "accessibilityConfig": {
                        "a11yLabel": kony.i18n.getLocalizedString("i18n.Accessibility.dropdownOpen")
                    }
                },
                "flxDropdown": {
                    "onClick": self.showOrHideCustomRolesOrExistingUsers.bind(this, self.view.segExistingUsers)
                },
                "lblFromAccountNo": {
                    "text": kony.i18n.getLocalizedString("konybb.i18n.userMgmt.ExistingUsers"),
                    "accessibilityConfig": {
                        "a11yLabel": kony.i18n.getLocalizedString("konybb.i18n.userMgmt.ExistingUsers")
                    }
                },
                "imgAcknowledged": {
                    "isVisible": self.selectedMap["selectedSeg"] === self.view.segExistingUsers.id
                }
            };
            let segRowData = [];
            if (existingUsers === null || existingUsers === undefined || existingUsers === -1 || existingUsers.length === 0) {
                this.view.NoExistingUsers.isVisible = true;
                //this.view.lblNoExistingUser.isVisible = true;
                CommonUtilities.setText(this.view.rtxNoPaymentMessage, kony.i18n.getLocalizedString("i18n.FastTransfers.NoResultsFound"), CommonUtilities.getaccessibilityConfig());
                this.view.forceLayout();
            } else {
                this.view.NoExistingUsers.isVisible = false;
                //this.view.lblNoExistingUser.isVisible = false;
                segRowData = existingUsers.map(function(user) {
                    return {
                        "flxSelectRoleContainer": {
                            "isVisible": true
                        },
                        "imgSelectRole": {
                            "src": self.selectedMap["selectedRow"] === user.userName ? "radiobtn_active.png" : "radio_btn_inactive.png"
                        },
                        "imgArrow": {
                            "transform": self.imgArrowTransform,
                            "isVisible": self.selectedMap["selectedRow"] === user.userName
                        },
                        "flxInnerRole": {
                          "skin": self.selectedMap["selectedRow"] === user.userName ? "sknflxfbfbfb1pxShadowc0c0c0" : "skne3e3e3br3pxradius"
                        },
                        "lblRoleName": {
                            "text": user.name,
                            "value": user.userName,
                            "accessibilityConfig": {
                                "a11yLabel": user.name
                            }
                        },
                        "name": user.name
                    };
                });
            }
            let segDataModel = [
                [segHeader, segRowData]
            ];
            this.view.segExistingUsers.setData(segDataModel);
        },
        showOrHideCustomRolesOrExistingUsers: function(selectedSegment) {
            let segHeaderData = selectedSegment.data[0][0];
            let segRowData = selectedSegment.data[0][1];
            if (segHeaderData.lblDropdown.text === "O") {
                segHeaderData.lblDropdown.text = "P";
                segHeaderData.lblDropdown.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.dropdownOpen");
                segRowData.forEach(function(arrayElement) {
                    arrayElement.flxSelectRoleContainer = {
                        "isVisible": true
                    };
                });
            } else {
                segHeaderData.lblDropdown.text = "O";
                segHeaderData.lblDropdown.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.dropdownClose");
                segRowData.forEach(function(arrayElement) {
                    arrayElement.flxSelectRoleContainer = {
                        "isVisible": false
                    };
                });
            }
            selectedSegment.setData([
                [segHeaderData, segRowData]
            ]);
        },
        searchRoleOrUser: function(searchString) {
            if (searchString === "") {
                this.view.Search.flxClearBtn.isVisible = false;
            } else {
                this.view.Search.flxClearBtn.isVisible = true;
            }
            //sortField,sortType,searchParams,searchString
            let customRolesSearchResult = CommonUtilities.sortAndSearchJSON(this.customRoles, null, null, "customRoleName", searchString);
            this.showCustomRoles(customRolesSearchResult);
            let existingUsersSearchResult = CommonUtilities.sortAndSearchJSON(this.existingUsers, null, null, "userName", searchString);
            this.showExistingUsers(existingUsersSearchResult);
        },
        showPermissionDetails: function(permissionDetails) {
            this.showAccountAccess(permissionDetails.companyList);
            this.showAccountLevelPermissions(permissionDetails.accountLevelPermissions);
            this.showOtherFeaturePermissions(permissionDetails.globalLevelPermissions);
            this.showTransactionLimits(permissionDetails.transactionLimits);
            FormControllerUtility.enableButton(this.view.btnProceedRoles);
        },
        showAccountAccess: function(companyList) {
            for (let i = 0; i < companyList.length; i++) {
                let companyAccountAccess = companyList[i];
                let selectedAccCount = 0;
                for (let j = 0; j < companyAccountAccess.accounts.length; j++) {
                    if (companyAccountAccess.accounts[j].isEnabled === "true") {
                        selectedAccCount++;
                    }
                }
                companyAccountAccess.selectedAccCount = selectedAccCount;
            }
            console.log(companyList);
            this.view.flxRightContainerMain.isVisible = true;
            let segRowData = companyList.map(function(companyList) {
                let lastFourDigitOfCompanyId = companyList.cif;
                if (lastFourDigitOfCompanyId.length > 4) {
                    lastFourDigitOfCompanyId = lastFourDigitOfCompanyId.substring(lastFourDigitOfCompanyId.length - 4, lastFourDigitOfCompanyId.length);
                }
                return {
                    "lblLeftSideContent": {
                        "text": companyList.companyName + " - " + lastFourDigitOfCompanyId,
                        "accessibilityConfig": {
                            "a11yLabel": companyList.companyName + " - " + lastFourDigitOfCompanyId
                        }
                    },
                    "lblRIghtSideContent": {
                        "text": companyList.userRole,
                        "accessibilityConfig": {
                            "a11yLabel": companyList.userRole
                        }
                    },
                    "lblRightMostContent": {
                        "text": companyList.selectedAccCount.toString(),
                        "accessibilityConfig": {
                            "a11yLabel": companyList.selectedAccCount.toString()
                        }
                    },
                   "lblSeparator": {
                     "isVisible" : true
                   },
                    "lblRightContentAuto": {
                      "text":(companyList.autoSyncAccounts==="true")?"On":"Off",
                      "accessibilityConfig": {
                        "a11yLabel":(companyList.autoSyncAccounts==="true")?"On":"Off"
                      }
                    },
                  "btnViewEdit" : {
                         "isVisible" : false
                        }

                };
            });
            this.segData=segRowData;
             var datamap={
              "flxUserManagement": "flxUserManagement",
              "flxUserManagementAccAccessRole": "flxUserManagementAccAccessRole",
              "flxUserManagementAccPermissions": "flxUserManagementAccPermissions",
              "lblLeftSideContent": "lblLeftSideContent",
              "lblRIghtSideContent": "lblRIghtSideContent",
              "lblRightMostContent": "lblRightMostContent",
              "lblSeparator": "lblSeparator",
              "lblRightContentAuto": "lblRightContentAuto",
               "btnViewEdit" : "btnViewEdit"
            };
            this.view.segmentAccRoleMain.rowTemplate="flxUserManagementAccAccessRole";
            this.view.segmentAccRoleMain.widgetDataMap=datamap;
            this.view.segmentAccRoleMain.setData(segRowData);
        },
        showAccountLevelPermissions: function(accountLevelPermissions) {
            let self = this;
            let segRowData = accountLevelPermissions.map(function(accountLevelPermissionsPerCompany, index) {
                let result = self.getAccountLevelDetailsToShow(accountLevelPermissionsPerCompany);
                let lastFourDigitOfCompanyId = accountLevelPermissionsPerCompany.cif;
                if (lastFourDigitOfCompanyId.length > 4) {
                    lastFourDigitOfCompanyId = lastFourDigitOfCompanyId.substring(lastFourDigitOfCompanyId.length - 4, lastFourDigitOfCompanyId.length);
                }
                return {
                    "lblRecipient": {
                        "text": accountLevelPermissionsPerCompany.companyName + " - " + lastFourDigitOfCompanyId,
                        "accessibilityConfig": {
                            "a11yLabel": accountLevelPermissionsPerCompany.companyName + " - " + lastFourDigitOfCompanyId
                        }
                    },
                    "lblDropdown": {
                        "text": "O",
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.Accessibility.dropdownClose")
                        }
                    },
                    "flxDropdown": {
                        "onClick": self.showAccountLevelAccessDetails.bind(this, self.view.segAccPermissionsSegMain, index)
                    },
                    "flxDetails": {
                        "isVisible": false
                    },
                    "lblSeparator2" : {
                       "isVisible" : true
                    },
                    "lblDefaultPermissionsSet": {
                        "text": kony.i18n.getLocalizedString("i18n.usermanagement.DefaultPermissionSet"),
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.usermanagement.DefaultPermissionSet"),
                        }
                    },
                    "lblTotalFeaturesSelected": {
                        "text": kony.i18n.getLocalizedString("i18n.usermanagement.TotalFeaturesSelected"),
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.usermanagement.TotalFeaturesSelected"),
                        }
                    },
                    "lblTxtDefaultPermissionsSet": {
                        "text": result.DefaultPermissionSet,
                        "accessibilityConfig": {
                            "a11yLabel": result.DefaultPermissionSet
                        }
                    },
                    "lblTxtTotalFeaturesSelected": {
                        "text": result.TotalFeaturesSelected,
                        "accessibilityConfig": {
                            "a11yLabel": result.TotalFeaturesSelected
                        }
                    },
                  "btnViewEditAccountLevel" : {
                    //"onClick" : self.navigateToAccountLevelFeaturePermissions.bind(this),
                    "isVisible" : false
                  }
                };
            });
            this.view.segAccPermissionsSegMain.setData(segRowData);
        },
        getAccountLevelDetailsToShow: function(accountLevelPermissionsPerCompany) {
            let policyMap = {};
            let enabledCount = 0,
                totalCount = 0;
            accountLevelPermissionsPerCompany.accounts.forEach(function(account) {
                account.featurePermissions.forEach(function(feature) {
                    totalCount += feature.permissions.length;
                    feature.permissions.forEach(function(action) {
                        if (action.isEnabled.toString() === "true") {
                            enabledCount++;
                            policyMap[action.accessPolicyId] = true;
                        }
                    });
                });
            });
            let policySet = Object.keys(policyMap).join(", ");
            let result = {
                "DefaultPermissionSet": Object.keys(policyMap).join(", "),
                "TotalFeaturesSelected": enabledCount + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + totalCount
            }
            return result;
        },

        getGlobalLevelDetailsToShow: function(globalLevelPermissionsPerCompany) {
            let policyMap = {};
            let enabledCount = 0,
                totalCount = 0;
            globalLevelPermissionsPerCompany.features.forEach(function(feature) {
                totalCount += feature.permissions.length;
                feature.permissions.forEach(function(action) {
                    if (action.isEnabled.toString() === "true") {
                        enabledCount++;
                        policyMap[action.accessPolicyId] = true;
                    }
                });
            });
            let policySet = Object.keys(policyMap).join(", ");
            let result = {
                "DefaultPermissionSet": Object.keys(policyMap).join(", "),
                "TotalFeaturesSelected": enabledCount + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + totalCount
            }
            return result;
        },
        showOtherFeaturePermissions: function(globalLevelPermissions) {
            let self = this;
            let segRowData = globalLevelPermissions.map(function(globalLevelPermissionsPerCompany, index) {
                let result = self.getGlobalLevelDetailsToShow(globalLevelPermissionsPerCompany);
                let lastFourDigitOfCompanyId = globalLevelPermissionsPerCompany.cif;
                if (lastFourDigitOfCompanyId.length > 4) {
                    lastFourDigitOfCompanyId = lastFourDigitOfCompanyId.substring(lastFourDigitOfCompanyId.length - 4, lastFourDigitOfCompanyId.length);
                }
                return {
                    "lblRecipient": {
                        "text": globalLevelPermissionsPerCompany.companyName + " - " + lastFourDigitOfCompanyId,
                        "accessibilityConfig": {
                            "a11yLabel": globalLevelPermissionsPerCompany.companyName + " - " + lastFourDigitOfCompanyId
                        }
                    },
                    "lblDropdown": {
                        "text": "O",
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.Accessibility.dropdownClose")
                        }
                    },
                    "flxDropdown": {
                        "onClick": self.showAccountLevelAccessDetails.bind(this, self.view.segOtherFeaturePermissionsSegMain, index)
                    },
                    "flxDetails": {
                        "isVisible": false
                    },
                  "lblSeparator2" : {
                       "isVisible" : true
                    },
                    "lblDefaultPermissionsSet": {
                        "text": kony.i18n.getLocalizedString("i18n.usermanagement.DefaultPermissionSet"),
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.usermanagement.DefaultPermissionSet"),
                        }
                    },
                    "lblTotalFeaturesSelected": {
                        "text": kony.i18n.getLocalizedString("i18n.usermanagement.TotalFeaturesSelected"),
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.usermanagement.TotalFeaturesSelected"),
                        }
                    },
                    "lblTxtDefaultPermissionsSet": {
                        "text": result.DefaultPermissionSet,
                        "accessibilityConfig": {
                            "a11yLabel": result.DefaultPermissionSet,
                        }
                    },
                    "lblTxtTotalFeaturesSelected": {
                        "text": result.TotalFeaturesSelected,
                        "accessibilityConfig": {
                            "a11yLabel": result.TotalFeaturesSelected
                        }
                    },
                  "btnViewEditAccountLevel" : {
                    //"onClick" : self.navToNonAccountFeaturePermission.bind(this),
                    "isVisible" : false
                  }
                };
            });
            this.view.segOtherFeaturePermissionsSegMain.setData(segRowData);
        },
        showAccountLevelAccessDetails: function(selectedSegment, i) {
            let segData = selectedSegment.data;
            let rowData = segData[i];
            if (rowData.lblDropdown.text === "O") {
                rowData.lblDropdown.text = "P";
                rowData.lblDropdown.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.dropdownOpen");
                rowData.flxDetails.isVisible = true;
            } else {
                rowData.lblDropdown.text = "O";
                rowData.lblDropdown.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.dropdownClose");
                rowData.flxDetails.isVisible = false;
            }
            selectedSegment.setDataAt(rowData, i);
        },
        showTransactionLimits: function(transactionLimits) {
            let self = this;
            let segRowData = transactionLimits.map(function(transactionLimits, index) {
                let limits = self.getLimits(transactionLimits);
                let lastFourDigitOfCompanyId = transactionLimits.cif;
                if (lastFourDigitOfCompanyId.length > 4) {
                    lastFourDigitOfCompanyId = lastFourDigitOfCompanyId.substring(lastFourDigitOfCompanyId.length - 4, lastFourDigitOfCompanyId.length);
                }
                return {
                    "lblRecipient": {
                        "text": transactionLimits.companyName + " - " + lastFourDigitOfCompanyId,
                        "accessibilityConfig": {
                            "a11yLabel": transactionLimits.companyName + " - " + lastFourDigitOfCompanyId
                        }
                    },
                    "lblDropdown": {
                        "text": "O",
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.Accessibility.dropdownClose")
                        }
                    },
                    "flxDropdown": {
                        "onClick": self.showAccountLevelAccessDetails.bind(this, self.view.segTransactionLimitsMain, index)
                    },
                    "flxDetails": {
                        "isVisible": false
                    },
                  "lblSeparator": {
                     "isVisible" : false
                  },
                    "lblHeader": {
                        "text": kony.i18n.getLocalizedString("i18n.UserManagement.GlobalTransactionLimits"),
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.UserManagement.GlobalTransactionLimits")
                        }
                    },
                    "lblSubHeader": {
                        "text": kony.i18n.getLocalizedString("i18n.usermanagement.IndividualTransactionLimits"),
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.usermanagement.IndividualTransactionLimits"),
                        }
                    },
                    "lblPerTransactionLimits": {
                        "text": kony.i18n.getLocalizedString("i18n.usermanagement.PerTransactionLimit"),
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.usermanagement.PerTransactionLimit"),
                        }
                    },
                    "lblDailyTransactionLimit": {
                        "text": kony.i18n.getLocalizedString("i18n.usermanagement.DailyTransactionLimit"),
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.usermanagement.DailyTransactionLimit"),
                        }
                    },
                    "lblWeeklyTransactionLimits": {
                        "text": kony.i18n.getLocalizedString("i18n.usermanagement.WeeklyTransactionLimit"),
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.usermanagement.WeeklyTransactionLimit"),
                        }
                    },
                    "lblTxtPerTransactionLimits": {
                        "text": CommonUtilities.getDisplayCurrencyFormat(limits[0]),
                        "accessibilityConfig": {
                            "a11yLabel": CommonUtilities.getDisplayCurrencyFormat(limits[0]),
                        }
                    },
                    "lblTxtDailyTransactionLimits": {
                        "text": CommonUtilities.getDisplayCurrencyFormat(limits[1]),
                        "accessibilityConfig": {
                            "a11yLabel": CommonUtilities.getDisplayCurrencyFormat(limits[1]),
                        }
                    },
                    "lblTxtWeeklyTransactionLimits": {
                        "text": CommonUtilities.getDisplayCurrencyFormat(limits[2]),
                        "accessibilityConfig": {
                            "a11yLabel": CommonUtilities.getDisplayCurrencyFormat(limits[2]),
                        }
                    },
                    "lblHeader1": {
                        "text": kony.i18n.getLocalizedString("i18n.usermanagement.BulkTransactionLimits"),
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.usermanagement.BulkTransactionLimits"),
                        }
                    },
                    "lblPerTransactionLimit": {
                        "text": kony.i18n.getLocalizedString("i18n.usermanagement.PerTransactionLimit"),
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.usermanagement.PerTransactionLimit"),
                        }
                    },
                    "lblDailyTransactionLimits": {
                        "text": kony.i18n.getLocalizedString("i18n.usermanagement.DailyTransactionLimit"),
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.usermanagement.DailyTransactionLimit"),
                        }
                    },
                    "lblWeeklyTransactionLimit1": {
                        "text": kony.i18n.getLocalizedString("i18n.usermanagement.WeeklyTransactionLimit"),
                        "accessibilityConfig": {
                            "a11yLabel": kony.i18n.getLocalizedString("i18n.usermanagement.WeeklyTransactionLimit"),
                        }
                    },
                    "lblPerTransactionLimitValue": {
                        "text": CommonUtilities.getDisplayCurrencyFormat(limits[3]),
                        "accessibilityConfig": {
                            "a11yLabel": CommonUtilities.getDisplayCurrencyFormat(limits[3]),
                        }
                    },
                    "lblDailyTransactionLimitValue": {
                        "text": CommonUtilities.getDisplayCurrencyFormat(limits[4]),
                        "accessibilityConfig": {
                            "a11yLabel": CommonUtilities.getDisplayCurrencyFormat(limits[4]),
                        }
                    },
                    "lblWeeklyTransactionLimitValue1": {
                        "text": CommonUtilities.getDisplayCurrencyFormat(limits[5]),
                        "accessibilityConfig": {
                            "a11yLabel": CommonUtilities.getDisplayCurrencyFormat(limits[5])
                        }
                    },
                  "btnViewEditLimits" : {
                    //"onClick" : self.navToTransactionLimits.bind(this),
                    "isVisible" : false
                  }
                };
            });
            this.view.segTransactionLimitsMain.setData(segRowData);
        },
        onBackClick: function() {
            var flowType = this.loadBusinessBankingModule().presentationController.getIsEditFlow();
            if (flowType === true) {
                this.loadBusinessBankingModule().presentationController.setIsEditFlow(false);
                this.loadBusinessBankingModule().presentationController.navigateToConfirmationScreen();
            } else {
                var navObject = new kony.mvc.Navigation("frmCreateUserManually");
                navObject.navigate("frmCopyPermission");
            }
        },
        onCancelClick: function() {
            var flowType = this.loadBusinessBankingModule().presentationController.getIsEditFlow();
            if (flowType === true) {
                this.loadBusinessBankingModule().presentationController.setIsEditFlow(false);
                this.loadBusinessBankingModule().presentationController.navigateToConfirmationScreen();
            } else {
                this.loadBusinessBankingModule().presentationController.fetchAssociatedContractUsers(this.loadBusinessBankingModule().presentationController.fetchAssociatedContractUsersSuccess.bind(this.loadBusinessBankingModule().presentationController));
            }
        },
        getLimits: function(transactionLimits) {
            let limits = [];
            let adder = 0;
            transactionLimits.limitGroups.forEach(function(limitGroup) {
                if (limitGroup.limitGroupId === "BULK_PAYMENT") {
                    adder = 3;
                } else {
                    adder = 0;
                }
                limitGroup.limits.forEach(function(eachLimit) {
                    switch (eachLimit.id) {
                        case "DAILY_LIMIT":
                            limits[1 + adder] = eachLimit.value;
                            break;
                        case "WEEKLY_LIMIT":
                            limits[2 + adder] = eachLimit.value;
                            break;
                        case "MAX_TRANSACTION_LIMIT":
                            limits[0 + adder] = eachLimit.value;
                            break;
                    }

                });
            });
            return limits;
        }
    };
});