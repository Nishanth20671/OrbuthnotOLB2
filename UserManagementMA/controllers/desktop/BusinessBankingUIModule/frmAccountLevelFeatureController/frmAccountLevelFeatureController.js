define(['CommonUtilities', 'OLBConstants', 'FormControllerUtility', 'ViewConstants'], function(CommonUtilities, OLBConstants, FormControllerUtility, ViewConstants) {
    var orientationHandler = new OrientationHandler();
    return /** @alias module:frmUserManagementController */ {
        /**
         * Method to display the footer at the end of the screen by calculating the size of screen dynamically
         * @param {integer} data value
         **/
        adjustScreen: function() {
            this.view.forceLayout();
        },
        /**
         * Breakpont change
         */
        onBreakpointChange: function(width) {
            kony.print('on breakpoint change');
            var scope = this;
            this.resetUI();
            if (width <= 640 || orientationHandler.isMobile) {} else if (width <= 1024) {
                //for tablet
            } else if (width <= 1366) {
                //for desktop
            } else {
                //for hd desktop
            }
            if (kony.application.getCurrentBreakpoint() > 1400) {
                var data = this.view.segRolePermissions.data;
                this.view.segRolePermissions.rowTemplate = "flxUserManagementFeaturePermissionsDesktop"; //templatename for that breakpoint //
                this.view.segRolePermissions.setData(data);
            } else if (kony.application.getCurrentBreakpoint() <= 1400 && kony.application.getCurrentBreakpoint() > 1024) {
                var data = this.view.segRolePermissions.data;
                this.view.segRolePermissions.rowTemplate = "flxUserManagementFeaturePermissionsDesktop";
                this.view.segRolePermissions.setData(data);
            } else if (kony.application.getCurrentBreakpoint() >= 768 && kony.application.getCurrentBreakpoint() <= 1024) {
                var data = this.view.segRolePermissions.data;
                this.view.segRolePermissions.rowTemplate = "flxUserManagementFeaturePermissionsTablet";
                this.view.segRolePermissions.setData(data);
            } else if (kony.application.getCurrentBreakpoint() === 640) {
                var data = this.view.segRolePermissions.data;
                this.view.segRolePermissions.rowTemplate = "flxUserManagementFeaturePermissionsTablet";
                this.view.segRolePermissions.setData(data);
            }
            this.view.customheadernew.onBreakpointChangeComponent(width);
            this.adjustScreen()
        },
        /**
         * hide all ui flexes in user management form
         */
        resetUI: function() {
            this.adjustScreen();
        },
         /**
         * Method will invoke on form init
         */
        initActions: function() {
            var scopeObj = this;
			this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = this.onBreakpointChange;
			CommonUtilities.disableButton(this.view.btnProceedRoles);
			this.view.btnCancelRoles.onClick = this.onCancelClick;
			this.view.btnBackAccessRoles.onClick = this.onBackClick;
            this.view.btnProceedRoles.onClick = function() {
                scopeObj.navToNextForm();
            };
        },
        /**
         * Method will invoke on form pre show
         */
        preShow: function() {},
        /**
        * onNavigate for form 
        
        */
      onNavigate: function(params) {
        var jpath = "accountLevelPermissions,cif=" + params.companyId + ",accounts,accountId=" + params.accountId;
        this.companyId = params.companyId;
        this.accountId = params.accountId;
        this.userManagementData = params.userManagementData;
        CommonUtilities.setText(this.view.lblCompanyDesc, params.companyName + '-' + params.companyId, CommonUtilities.getaccessibilityConfig());
        this.userObj = JSON.parse(JSON.stringify(CommonUtilities.getObjectFromPath(this.userManagementData, jpath)));
        CommonUtilities.setText(this.view.lblAccountDesc, this.userObj.accountName, CommonUtilities.getaccessibilityConfig());
        var flowType = this.loadBusinessBankingModule().presentationController.getUserManagementFlow();
        var createOrEditFlow = this.loadBusinessBankingModule().presentationController.getUserNavigationType();
        if (flowType === OLBConstants.USER_MANAGEMENT_TYPE.CUSTOM_ROLE) {
          this.view.lblUserName.isVisible = false;
          this.view.lblEmail.isVisible = false;
          if (createOrEditFlow === OLBConstants.USER_MANAGEMENT_TYPE.CREATE) {
            this.view.customheadernew.activateMenu("User Management", "Create Custom Role");
            CommonUtilities.setText(this.view.lblContentHeader, kony.i18n.getLocalizedString("i18n.UserManagement.createRole_AccountLevelPermissions"), CommonUtilities.getaccessibilityConfig());
          } else if (createOrEditFlow === OLBConstants.USER_MANAGEMENT_TYPE.VIEW_EDIT) {
            this.view.customheadernew.activateMenu("User Management", "User Roles");
            CommonUtilities.setText(this.view.lblContentHeader, kony.i18n.getLocalizedString("i18n.UserManagement.view_EditRole_AccountLevelPermissions"), CommonUtilities.getaccessibilityConfig());
          }
        } else if (flowType === OLBConstants.USER_MANAGEMENT_TYPE.USER_CREATION) {
          this.view.lblUserName.isVisible = true;
          this.view.lblEmail.isVisible = true;
          let userDetails = this.loadBusinessBankingModule().presentationController.getUserDetails();
          CommonUtilities.setText(this.view.lblUserName, userDetails.firstName + " " + userDetails.lastName,  CommonUtilities.getaccessibilityConfig());
          CommonUtilities.setText(this.view.lblEmail, userDetails.email,  CommonUtilities.getaccessibilityConfig());
          if (createOrEditFlow === OLBConstants.USER_MANAGEMENT_TYPE.CREATE) {
            this.view.customheadernew.activateMenu("User Management", "Create UM User");
            CommonUtilities.setText(this.view.lblContentHeader, kony.i18n.getLocalizedString("i18n.UserManagement.createUser_AccountLevelPermissions"), CommonUtilities.getaccessibilityConfig());
          } else if (createOrEditFlow === OLBConstants.USER_MANAGEMENT_TYPE.VIEW_EDIT) {
            this.view.customheadernew.activateMenu("User Management", "All Users");
            CommonUtilities.setText(this.view.lblContentHeader, kony.i18n.getLocalizedString("i18n.UserManagement.view_EditUser_AccountLevelPermissions"), CommonUtilities.getaccessibilityConfig());
          }
        }
      },
        /**
         * Method will invoke on form post show
         */
        postShow: function() {
            this.adjustScreen();
			this.setFeaturePermissions(this.userObj);
        },
        loadBusinessBankingModule: function() {
            return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("BusinessBankingUIModule");
        },
        setFeaturePermissions: function(data) {
            var segData = [];
            this.changed = [];
            for (var i = 0; i < data.featurePermissions.length; i++) {
                var row = {},
                    allOn = true,
                    allOff = true;
                row["lblPermissionName"] = {
                    "text": data.featurePermissions[i].featureName,
                    "accessibilityConfig": {
                        "a11yLabel": data.featurePermissions[i].featureName
                    }
                };
                row["lblDescription"] = {
                    "text": data.featurePermissions[i].featureDescription,
                    "accessibilityConfig": {
                        "a11yLabel": data.featurePermissions[i].featureDescription
                    }
                };
                row["lblimgPermissions"] = {
                    "text": "D",
                    "accessibilityConfig": {
                        "a11yLabel": "Checkbox Unchecked"
                    }
                };
                row["lbltooltip"] = {
                    "text": "i",
                    "toolTip": data.featurePermissions[i].featureDescription,
                    "accessibilityConfig": {
                        "a11yLabel": "Tooltip"
                    }
                };
                for (var j = 0, k = 1; j < data.featurePermissions[i].permissions.length; j++, k++) {
                    row["lblAction" + k] = {
                        "text": data.featurePermissions[i].permissions[j].actionName,
                        "accessibilityConfig": {
                            "a11yLabel": data.featurePermissions[i].permissions[j].actionName
                        }
                    };
                    row["flxAction" + k] = {
                        "isVisible": true
                    };
                    row["lblTickBox" + k] = data.featurePermissions[i].permissions[j].isEnabled.toString() == 'true' ? {
                        "text": "C",
                        "accessibilityConfig": {
                            "a11yLabel": "Checkbox checked"
                        }
                    } : {
                        "text": "D",
                        "accessibilityConfig": {
                            "a11yLabel": "Checkbox Unchecked"
                        }
                    };
                    row["lblFeatureSeparator"] = {
                        "isVisible": false
                    };
					if (data.featurePermissions[i].permissions[j].dependentActions !== undefined) {
						row["isDependentOn" + k] = data.featurePermissions[i].permissions[j].dependentActions.split(',');
						for (var l = 1; l < row["isDependentOn" + k].length - 1; l++) {
							row["isDependentOn" + k][l] = row["isDependentOn" + k][l].trim();
						}
						row["isDependentOn" + k][0] = row["isDependentOn" + k][0].replace('[', '');
						row["isDependentOn" + k][row["isDependentOn" + k].length - 1] = row["isDependentOn" + k][row["isDependentOn" + k].length - 1].replace(']', '');
                    } else {
                        row["isDependentOn" + k] = [];
                    }
                    row["id" + k] = data.featurePermissions[i].permissions[j].actionId;
                    data.featurePermissions[i].permissions[j].isEnabled.toString() == 'true' ? allOff = false : allOn = false;
                }
                if (allOff == true) row["lblimgPermissions"] = {
                    "text": "D",
                    "accessibilityConfig": {
                        "a11yLabel": "Checkbox unchecked"
                    }
                };
                else if (allOn == true) row["lblimgPermissions"] = {
                    "text": "C",
                    "accessibilityConfig": {
                        "a11yLabel": "Checkbox checked"
                    }
                };
                else row["lblimgPermissions"] = {
                    "text": "z",
                    "accessibilityConfig": {
                        "a11yLabel": "Checkbox partially checked"
                    }
                }
                segData.push(row);
                this.changed.push(false);
            }
            segData[0].lblSeperator0 = {
                "isVisible": false
            };
            this.baseSegData = JSON.parse(JSON.stringify(segData));
            this.view.segRolePermissions.setData(segData);
			CommonUtilities.hideProgressBar();
            FormControllerUtility.hideProgressBar(this.view);
        },
        selectOrUnselectEntireFeature: function(segdata) {
            var lblIndex = segdata.eventobject.id.slice(-1);
            var widget = "lblimgPermissions";
            var toggle, toggleAcc, changed = false;
            var data = this.view.segRolePermissions.data;
            if (data[segdata.context.rowIndex][widget].text == 'C') {
                data[segdata.context.rowIndex][widget].text = 'D';
				data[segdata.context.rowIndex][widget].accessibilityConfig.a11yLabel = "Checkbox Unchecked";
                toggle = 'D';
				toggleAcc = "Checkbox Unchecked";
                if (this.baseSegData[segdata.context.rowIndex][widget].text !== data[segdata.context.rowIndex][widget].text) changed = true;
            } else if (data[segdata.context.rowIndex][widget].text == 'D' || data[segdata.context.rowIndex][widget].text == 'z') {
                data[segdata.context.rowIndex][widget].text = 'C';
				data[segdata.context.rowIndex][widget].accessibilityConfig.a11yLabel = "Checkbox checked";
                toggle = 'C';
				toggleAcc = "Checkbox checked";
                if (this.baseSegData[segdata.context.rowIndex][widget].text !== data[segdata.context.rowIndex][widget].text) changed = true;
            }
            widget = "lblTickBox";
            for (i = 1; i < 21; i++) {
                var locWidget = widget + i.toString();
                if (data[segdata.context.rowIndex][locWidget] == undefined) break;
                data[segdata.context.rowIndex][locWidget].text = toggle;
                data[segdata.context.rowIndex][locWidget].accessibilityConfig.a11yLabel = toggleAcc;
                if (this.baseSegData[segdata.context.rowIndex][locWidget].text !== data[segdata.context.rowIndex][locWidget].text) changed = true;
            }
            this.view.segRolePermissions.setDataAt(data[segdata.context.rowIndex], segdata.context.rowIndex, 0);
            this.changed[segdata.context.rowIndex] = changed;
			this.updateChanges();
            changed == true || this.isChanged ? CommonUtilities.enableButton(this.view.btnProceedRoles) : CommonUtilities.disableButton(this.view.btnProceedRoles);
        },
        selectOrUnselectParentFeature: function(segdata) {
            var lblIndex = segdata.eventobject.id.slice(-2);
            if (lblIndex[0].match(/[a-zA-Z]/i)) {
                lblIndex = lblIndex[1];
            }
            var widget = "lblTickBox" + lblIndex;
            var data = this.view.segRolePermissions.data,
                changed = false;
            if (data[segdata.context.rowIndex][widget].text == 'C') {
                data[segdata.context.rowIndex][widget].text = 'D';
                data[segdata.context.rowIndex][widget].accessibilityConfig.a11yLabel = "Checkbox Unchecked";
                if (this.baseSegData[segdata.context.rowIndex][widget].text !== data[segdata.context.rowIndex][widget].text) changed = true;
                var allOff = 'D',
                    allOn = 'C';
                for (i = 1; i < 21; i++) {
                    var locWidget = "lblTickBox" + i.toString();
                    if (data[segdata.context.rowIndex][locWidget] == undefined) break;
                    if (data[segdata.context.rowIndex]["isDependentOn" + i].includes(data[segdata.context.rowIndex]["id" + lblIndex])) {
						data[segdata.context.rowIndex][locWidget].text = 'D';
						data[segdata.context.rowIndex][locWidget].accessibilityConfig.a11yLabel = "Checkbox unchecked";
					}
                    if (data[segdata.context.rowIndex][locWidget].text == 'C') {
                        allOff = 'C';
                    } else {
                        allOn = 'D';
                    }
                    if (this.baseSegData[segdata.context.rowIndex][locWidget].text !== data[segdata.context.rowIndex][locWidget].text) changed = true;
                }
                if (allOn == 'C') {
                    data[segdata.context.rowIndex]["lblimgPermissions"].text = 'C';
                    data[segdata.context.rowIndex]["lblimgPermissions"].accessibilityConfig.a11yLabel = "Checkbox checked";
                } else if (allOff == 'D') {
                    data[segdata.context.rowIndex]["lblimgPermissions"].text = 'D';
                    data[segdata.context.rowIndex]["lblimgPermissions"].accessibilityConfig.a11yLabel = "Checkbox unchecked";
                } else {
                    data[segdata.context.rowIndex]["lblimgPermissions"].text = 'z';
                    data[segdata.context.rowIndex]["lblimgPermissions"].accessibilityConfig.a11yLabel = "Checkboc partially checked";
                }
                //write policyset logic here
            } else if (data[segdata.context.rowIndex][widget].text == 'D') {
                var allOn = 'C',
                    allOff = 'D';
                data[segdata.context.rowIndex][widget].text = 'C';
                data[segdata.context.rowIndex][widget].accessibilityConfig.a11yLabel = "Checkbox checked";
                if (this.baseSegData[segdata.context.rowIndex][widget].text !== data[segdata.context.rowIndex][widget].text) changed = true;
                for (i = 1; i < 21; i++) {
                    var locWidget = "lblTickBox" + i.toString();
                    if (data[segdata.context.rowIndex][locWidget] == undefined) break;
                    if (data[segdata.context.rowIndex]["isDependentOn" + lblIndex].includes(data[segdata.context.rowIndex]["id" + i])) {
						data[segdata.context.rowIndex][locWidget].text = 'C';
						data[segdata.context.rowIndex][locWidget].accessibilityConfig.a11yLabel = "Checkbox checked";
					}
                    if (this.baseSegData[segdata.context.rowIndex][locWidget].text !== data[segdata.context.rowIndex][locWidget].text) changed = true;
                    if (data[segdata.context.rowIndex][locWidget].text == 'C') {
                        allOff = 'C';
                    } else allOn = 'D';
                }
                if (allOn == 'C') {
                    data[segdata.context.rowIndex]["lblimgPermissions"].text = 'C';
                    data[segdata.context.rowIndex]["lblimgPermissions"].accessibilityConfig.a11yLabel = "Checkbox checked";
                } else if (allOff == 'D') {
                    data[segdata.context.rowIndex]["lblimgPermissions"].text = 'D';
                    data[segdata.context.rowIndex]["lblimgPermissions"].accessibilityConfig.a11yLabel = "Checkbox unchecked";
                } else {
                    data[segdata.context.rowIndex]["lblimgPermissions"].text = 'z';
                    data[segdata.context.rowIndex]["lblimgPermissions"].accessibilityConfig.a11yLabel = "Checkbox partially checked";
                }
                //write policyset logic here
            }
            this.view.segRolePermissions.setDataAt(data[segdata.context.rowIndex], segdata.context.rowIndex, 0);
            this.changed[segdata.context.rowIndex] = changed;
            this.updateChanges();
            changed == true || this.isChanged ? CommonUtilities.enableButton(this.view.btnProceedRoles) : CommonUtilities.disableButton(this.view.btnProceedRoles);
        },
        onInfoTouchStart: function(eventObj) {
            //var widget = "flxShowDescription";
            //var data = this.view.segRolePermissions.data;
            //data[eventObj.context.rowIndex][widget] = {
            //   "isVisible": true
            //};
            //this.view.segRolePermissions.setDataAt(data[eventObj.context.rowIndex],eventObj.context.rowIndex,0);
        },
        onInfoTouchEnd: function(eventObj) {
            //var widget = "flxShowDescription";
            //var data = this.view.segRolePermissions.data;
            //data[eventObj.context.rowIndex][widget] = {
            //    "isVisible": false
            //};
            //this.view.segRolePermissions.setDataAt(data[eventObj.context.rowIndex],eventObj.context.rowIndex,0);
        },
      navToNextForm: function() {
        this.changeSegDataToUserManagementData();
        //send or update userManagementData in presentation controller to this.userManagementData
      },
        updateChanges: function() {
            this.isChanged = false;
			
            for (var j in this.changed) {
                if (this.changed[j] == true) {
                    this.isChanged = true;
					break;
				}
			}
		},
        changeSegDataToUserManagementData: function() {
            //doing changes made on segment to userobj
            var data = this.view.segRolePermissions.data;
            for (var i = 0; i < data.length; i++) {
                for (var j = 1; j < 21; j++) {
                    if (this.userObj.featurePermissions[i].permissions[j - 1] == undefined) break;
                    this.userObj.featurePermissions[i].permissions[j - 1].isEnabled = data[i]["lblTickBox" + j].text == 'C' ? true : false;
                }
            }
            //assigning changed userobj to userManagementData
            var jpath = "accountLevelPermissions,cif=" + this.companyId + ",accounts,accountId=" + this.accountId;
            //this.userManagementData = CommonUtilities.updateObjectFromPath(this.userManagementData,jpath,this.userObj);
            var bussBankingPC = this.loadBusinessBankingModule().presentationController;
            bussBankingPC.setFeaturePermissionsFromUserManagement(this.companyId, this.accountId, this.userObj);
			bussBankingPC.generateTransactionLimits(JSON.parse(JSON.stringify(bussBankingPC.userManagementData.accountLevelPermissions)));
            var param = {
                'flowType': "FROM_THIRD_FORM",
                'userObj': this.userObj
            };
            applicationManager.getNavigationManager().setCustomInfo("cif", this.companyId);
            FormControllerUtility.showProgressBar(this.view);
            applicationManager.getNavigationManager().navigateTo("frmAccountLevelFeaturePermissions", true, param);
        },
        onBackClick: function() {
            FormControllerUtility.showProgressBar(this.view);
            applicationManager.getNavigationManager().navigateTo("frmAccountLevelFeaturePermissions", true, {});
        },
        onCancelClick: function() {
            FormControllerUtility.showProgressBar(this.view);
			applicationManager.getNavigationManager().navigateTo("frmConfirmAndAck");
		}
    };
});