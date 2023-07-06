define(['CommonUtilities', 'OLBConstants', 'FormControllerUtility', 'ViewConstants'], function(CommonUtilities, OLBConstants, FormControllerUtility, ViewConstants) {
  var orientationHandler = new OrientationHandler();
  return /** @alias module:frmUserManagementController */ {
    currentVisibleFlex: "flxUserDetails",
    /**
         * Method to display the footer at the end of the screen by calculating the size of screen dynamically
         * @param {integer} data value
         **/
    adjustScreen: function() {
      this.view.forceLayout();
      this.view.flxFooter.isVisible = true;
      var mainheight = 0;
      var screenheight = kony.os.deviceInfo().screenHeight;
      mainheight = this.view.flxHeader.info.frame.height + this.view.flxMain.info.frame.height;
      var diff = screenheight - mainheight;
      if (mainheight < screenheight) {
        diff = diff - this.view.flxFooter.info.frame.height;
        if (diff > 0) {
          this.view.flxFooter.top = mainheight + diff + "dp";
        } else {
          this.view.flxFooter.top = mainheight + "dp";
        }
        this.view.forceLayout();
      } else {
        this.view.flxFooter.top = mainheight + "dp";
        this.view.forceLayout();
      }

    },
    /**
         * Breakpont change
         */
    onBreakpointChange: function(width) {
      this.view.customheadernew.onBreakpointChangeComponent(width);
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
      this.view.btnProceedRoles.onClick = this.navToNextForm;
      this.view.btnCancelRoles.onClick = this.cancelAndNavigateToNextForm;
      this.view.Search.txtSearch.onTextChange = function() {
        scopeObj.searchAccounts(scopeObj.view.Search.txtSearch.text);
      };
      this.view.Search.flxClearBtn.onClick = function() {
        scopeObj.view.Search.txtSearch.text = "";
        scopeObj.searchAccounts(scopeObj.view.Search.txtSearch.text);
      };
      this.view.flxStatus.onClick = function() {
        if (scopeObj.view.lblLoan2.text === "L") {
          scopeObj.view.lblLoan2.text = "M";
          scopeObj.view.lblLoan2.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.RadioButtonOn");
          scopeObj.viewOnlySelectedOnClick();
        } else {
          scopeObj.view.lblLoan2.text = "L";
          scopeObj.view.lblLoan2.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.RadioButtonOff");
          scopeObj.reloadAccounts();
        }
      };
      this.view.btnApply.onClick = this.bulkUpdate;
      this.view.btnViewNEdit.onClick = this.resetToDefault;
    },

    /**
         * Method will invoke on form pre show
         */
    preShow: function() {
      this.view.customheadernew.forceCloseHamburger();
      //this.view.customheadernew.customhamburger.activateMenu("User Management","Create A User"); 
      var scope = this;
      this.view.toggleSwitch.selectedIndex = 1;
      this.view.toggleSwitch.onSlide = function() {
        scope.toggleSwitchAlerts();
      };
      this.currentVisibleFlex = "flxUserDetails";
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader', 'flxMain', 'flxFooter']);
    },

    /**
         * Method will invoke on Navigate
         */
    onNavigate: function(param) {
      if (param.hasOwnProperty("flowType") && param.flowType === "FROM_FIRST_FORM") {
        this.accountLevelPermissions = JSON.parse(JSON.stringify(param.selectedCompanyAccountLevelPermissions));
        this.accountLevelPermissionsUnTouched = JSON.parse(JSON.stringify(param.selectedCompanyAccountLevelPermissions));
        this.updateButtonToShow = false;
      }
      if (param.hasOwnProperty("flowType") && param.flowType === "FROM_THIRD_FORM") {
        var jpath = "accounts,accountId=" + param.userObj.accountId;
        //data = JSON.parse(JSON.stringify(param.userObj));
        this.accountLevelPermissions = CommonUtilities.updateObjectFromPath(this.accountLevelPermissions, jpath, param.userObj);
        this.accountLevelPermissionsUnTouched = CommonUtilities.updateObjectFromPath(this.accountLevelPermissionsUnTouched, jpath, param.userObj);
      }
      this.updateButtonToShow ? FormControllerUtility.enableButton(this.view.btnProceedRoles) : FormControllerUtility.disableButton(this.view.btnProceedRoles);
      this.setUIForCompany();
    },





    /**
         * Method will invoke on form post show
         */
    postShow: function() {
      var flowType = this.getBusinessBankingPresentation().getUserManagementFlow();
      var createOrEditFlow = this.getBusinessBankingPresentation().getUserNavigationType();
      if (flowType === OLBConstants.USER_MANAGEMENT_TYPE.CUSTOM_ROLE) {
        this.view.lblName.isVisible = false;
        this.view.lblEmail.isVisible = false;
        if (createOrEditFlow === OLBConstants.USER_MANAGEMENT_TYPE.CREATE) {
          this.view.customheadernew.activateMenu("User Management", "Create Custom Role");
          CommonUtilities.setText(this.view.lblContentHeader, kony.i18n.getLocalizedString("i18n.UserManagement.createRole_AccountLevelPermissions"), CommonUtilities.getaccessibilityConfig());
        } else {
          this.view.customheadernew.activateMenu("User Management", "User Roles");
          CommonUtilities.setText(this.view.lblContentHeader, kony.i18n.getLocalizedString("i18n.UserManagement.view_EditRole_AccountLevelPermissions"), CommonUtilities.getaccessibilityConfig());
        }
      } else {
        let userDetails = this.getBusinessBankingPresentation().getUserDetails();
        this.view.lblName.isVisible = true;
        this.view.lblEmail.isVisible = true;
        CommonUtilities.setText(this.view.lblName, userDetails.firstName + " " + userDetails.lastName, CommonUtilities.getaccessibilityConfig());
        CommonUtilities.setText(this.view.lblEmail, userDetails.email, CommonUtilities.getaccessibilityConfig());
        if (createOrEditFlow === OLBConstants.USER_MANAGEMENT_TYPE.CREATE) {
          this.view.customheadernew.activateMenu("User Management", "Create UM User");
          CommonUtilities.setText(this.view.lblContentHeader, kony.i18n.getLocalizedString("i18n.UserManagement.createUser_AccountLevelPermissions"), CommonUtilities.getaccessibilityConfig());
        } else {
          this.view.customheadernew.activateMenu("User Management", "All Users");
          CommonUtilities.setText(this.view.lblContentHeader, kony.i18n.getLocalizedString("i18n.UserManagement.view_EditUser_AccountLevelPermissions"), CommonUtilities.getaccessibilityConfig());
        }
      }
      this.onBreakpointChange();
    },

    /**
         * Set foucs handlers for skin of parent flex on input focus 
         */
    accessibilityFocusSetup: function() {
      let widgets = [
        [this.view.tbLastName, this.view.flxLastName],
        [this.view.tbxDriversLicense, this.view.flxDriversLicense],
        [this.view.tbxEmail, this.view.flxEmail],
        [this.view.tbxMiddleName, this.view.flxMiddleName],
        [this.view.tbxName, this.view.flxName],
        [this.view.tbxPhoneNum, this.view.flxPhoneNum],
        [this.view.tbxSSN, this.view.flxSSN]
      ]
      for (let i = 0; i < widgets.length; i++) {
        CommonUtilities.setA11yFoucsHandlers(widgets[i][0], widgets[i][1], this)
      }
    },

    /**
         * Method to update form using given context
         * @param {object} context depending on the context the appropriate function is executed to update view
         */
    updateFormUI: function(viewModel) {
      if (viewModel.serverError) {
        this.showServerError(viewModel.serverError);
      } else {
        if (viewModel.isLoading === true) {
          FormControllerUtility.showProgressBar(this.view);
        } else if (viewModel.isLoading === false) {
          FormControllerUtility.hideProgressBar(this.view);
        }
      }

    },
    navToNextForm: function() {
		var bussBankingPC = this.getBusinessBankingPresentation();
		bussBankingPC.setAccountLevelPermissionsByCompany(this.accountLevelPermissions.cif, this.accountLevelPermissions);
		bussBankingPC.generateTransactionLimits(JSON.parse(JSON.stringify(bussBankingPC.userManagementData.accountLevelPermissions)));
		let self = this;
		let params = {
			"flowType": "FROM_SECOND_FORM",
			"accountLevelPermissions": self.accountLevelPermissions
		};
		applicationManager.getNavigationManager().navigateTo({"appName" : "UserManagementMA", "friendlyName" : "BusinessBankingUIModule/frmFeaturePermissions"}, true, params);
	},

    cancelAndNavigateToNextForm: function() {
      let self = this;
      let params = {
        "flowType": "FROM_SECOND_FORM",
        "accountLevelPermissions": self.accountLevelPermissionsUnTouched
      };
      applicationManager.getNavigationManager().navigateTo({"appName" : "UserManagementMA", "friendlyName" : "BusinessBankingUIModule/frmFeaturePermissions"}, true, params);
    },

    populateAccounts: function() {
      //Dividing accounts by account type
      let accountTypeMap = {};
      for (let i = 0; i < this.accountLevelPermissions.accounts.length; i++) {
        if (!accountTypeMap.hasOwnProperty(this.accountLevelPermissions.accounts[i].accountType)) {
          accountTypeMap[this.accountLevelPermissions.accounts[i].accountType] = [];
        }
        accountTypeMap[this.accountLevelPermissions.accounts[i].accountType].push(this.accountLevelPermissions.accounts[i]);
      }

      this.accountTypeMap = accountTypeMap;
      this.totalAccountsCount = this.accountLevelPermissions.accounts.length;
      this.selectedAccountsCount = 0;
      this.isSelectedAccountMap = {};

      //Populating accounts segment
      let segData = [];
      let self = this;
      let index = -1;
      this.sortOrder = "ASC";
      for (let accountType in accountTypeMap) {
        this.isSelectedAccountMap[accountType] = 0;
        index += 1;
        let accountTypeRow = [];
        let segHeader = {
          "totalAccounts": accountTypeMap[accountType].length,
          "selectedAccounts": 0,
          "lblRecipientName": {
            "text": accountType,
            "accessibilityConfig": {
              "a11yLabel": accountType
            }
          },
          "lblAccountsSelectedNo": {
            "text": "0" + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + accountTypeMap[accountType].length,
            "accessibilityConfig": {
              "a11yLabel": "0" + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + accountTypeMap[accountType].length
            }
          },
          "flxSortMakeTransfers": {
            "isVisible": true
          },
          "CopyimgSortAccountLevel": {
            "src": "sorting.png"
          },
          "CopylblIcon0e1936ef51c5147": {
            "text": "O"
          },
          "imgSortAccountName": {
            "src": "sorting.png"
          },
          "flxImgSortFeatures": {
            "isVisible": false
          },
          "imgSortPermissionType": {
            "src": "sorting.png"
          },
          "lblAccountLevel": {
            "text": kony.i18n.getLocalizedString("i18n.UserManagement.editAccountLevel"),
            "accessibilityConfig": {
              "a11yLabel": kony.i18n.getLocalizedString("i18n.UserManagement.editAccountLevel")
            }
          },
          "lblAccountname": {
            "text": kony.i18n.getLocalizedString("i18n.transfers.accountName"),
            "accessibilityConfig": {
              "a11yLabel": kony.i18n.getLocalizedString("i18n.transfers.accountName")
            }
          },
          "lblAccountsSelected": {
            "text": kony.i18n.getLocalizedString("konybb.i18n.AccountsSelected"),
            "accessibilityConfig": {
              "a11yLabel": kony.i18n.getLocalizedString("konybb.i18n.AccountsSelected")
            }
          },
          "lblDropDownIcon": {
            "text": "P",
            "accessibilityConfig": {
              "a11yLabel": kony.i18n.getLocalizedString("i18n.Accessibility.dropdownOpen")
            }
          },
          "flxActions": {
            "onClick": self.onDropdownClick.bind(this, index)
          },
          "lblFeaturesPermission": {
            "text": kony.i18n.getLocalizedString("i18n.UserManagement.featurePermission"),
            "accessibilityConfig": {
              "a11yLabel": kony.i18n.getLocalizedString("i18n.UserManagement.featurePermission")
            }
          },
          "lblIcon": {
            "text": "s"
          },
          "lblPermissionType": {
            "text": kony.i18n.getLocalizedString("i18n.UserManagement.PermissionsType"),
            "accessibilityConfig": {
              "a11yLabel": kony.i18n.getLocalizedString("i18n.UserManagement.PermissionsType")
            }
          },
          "lblSeparator": {
            "text": ""
          },
          "lblDropdown": {
            "text": "D",
            "accessibilityConfig": {
              "a11yLabel": kony.i18n.getLocalizedString("i18n.Accessibility.checkboxUnSelected")
            }
          },
          "flxDropdown": {
            "onClick": self.bulkSelectAccounts.bind(this, index)
          },
          "flxImgAccSort": {
            "onClick": self.sortAccounts.bind(this, index, "accountName")
          },
          "flxImgSortPermission": {
            "onClick": self.sortAccounts.bind(this, index, "permissionType")
          }
        }
        let segRow = self.getAccountsSegRowData(accountTypeMap[accountType], index);
        accountTypeRow.push(segHeader);
        accountTypeRow.push(segRow);

        segData.push(accountTypeRow);
      }
      this.accountsSegData = segData;

      this.view.flxSearch.isVisible = true;
      this.view.flxSegment.isVisible = true;
      this.view.segmentFileTransactions.setData(segData);
      CommonUtilities.setText(this.view.lblNoAccountsSelected, this.selectedAccountsCount + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + this.totalAccountsCount, CommonUtilities.getaccessibilityConfig());
    },

    onDropdownClick: function(index) {
      let segData = this.view.segmentFileTransactions.data;
      if (segData[index][0].lblDropDownIcon.text === "O") {
        segData[index][0].lblDropDownIcon.text = "P";
        segData[index][0].lblDropDownIcon.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.dropdownOpen");
        segData[index][0].flxSortMakeTransfers.isVisible = true;
        //         let searchString = this.view.Search.txtSearch.text;
        //         let accountsSearchResult = CommonUtilities.sortAndSearchJSON(this.accountTypeMap[segData[index][0].lblRecipientName.text], null, null, "accountName,accountId", searchString);
        //         if(accountsSearchResult !== -1 && accountsSearchResult !== null && accountsSearchResult !== undefined && accountsSearchResult.length != 0){
        //           segData[index][1] = this.getAccountsSegRowData(accountsSearchResult, index);
        //         }
        //         else{
        //           segData[index][1] = this.accountsSegData[index][1];
        //         }
        segData[index][1].forEach(function(row) {
          row.flxUserManagementSelectBulkTransactionLimits = {
            "isVisible": true
          };
        });
      } else {
        segData[index][0].lblDropDownIcon.text = "O";
        segData[index][0].lblDropDownIcon.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.dropdownClose");
        segData[index][0].flxSortMakeTransfers.isVisible = false;
        //segData[index][1] = [];
        segData[index][1].forEach(function(row) {
          row.flxUserManagementSelectBulkTransactionLimits = {
            "isVisible": false
          };
        });
      }
      this.view.segmentFileTransactions.setData(segData);
      if (this.view.lblLoan2.text === "M") {
        this.viewOnlySelectedOnClick();
      }
    },

    selectAccount: function(index, rowIndex) {
      let segData = this.view.segmentFileTransactions.data;
      if (segData[index][1][rowIndex].lblDropdownRowICon.text === 'D') {
        segData[index][1][rowIndex].lblDropdownRowICon.text = 'C';
        segData[index][1][rowIndex].lblDropdownRowICon.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.checkboxSelected");
        segData[index][1][rowIndex].lblDropdownRowICon.skin = "sknlblDelete20px";
        segData[index][0].selectedAccounts += 1;
        this.selectedAccountsCount += 1;
        this.isSelectedAccountMap[segData[index][0].lblRecipientName.text] += 1;
        CommonUtilities.setText(segData[index][0].lblAccountsSelectedNo, segData[index][0].selectedAccounts + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + segData[index][0].totalAccounts, CommonUtilities.getaccessibilityConfig());
        this.isSelectedAccountMap[segData[index][1][rowIndex].accountId] = true;
      } else {
        segData[index][1][rowIndex].lblDropdownRowICon.text = 'D';
        segData[index][1][rowIndex].lblDropdownRowICon.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.checkboxUnSelected");
        segData[index][1][rowIndex].lblDropdownRowICon.skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
        segData[index][0].selectedAccounts -= 1;
        this.selectedAccountsCount -= 1;
        this.isSelectedAccountMap[segData[index][0].lblRecipientName.text] -= 1;
        CommonUtilities.setText(segData[index][0].lblAccountsSelectedNo, segData[index][0].selectedAccounts + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + segData[index][0].totalAccounts, CommonUtilities.getaccessibilityConfig());
        
        this.isSelectedAccountMap[segData[index][1][rowIndex].accountId] = false;
      }
      if (segData[index][0].selectedAccounts == segData[index][0].totalAccounts) {
        segData[index][0].lblDropdown.text = "C";
        segData[index][0].lblDropdown.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.checkboxSelected");
      } else if (segData[index][0].selectedAccounts == 0) {
        segData[index][0].lblDropdown.text = "D";
        segData[index][0].lblDropdown.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.checkboxUnSelected");
      } else {
        segData[index][0].lblDropdown.text = "z";
        segData[index][0].lblDropdown.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.checkboxPartiallySelected");
      }

      this.view.segmentFileTransactions.setData(segData);
      CommonUtilities.setText(this.view.lblNoAccountsSelected, this.selectedAccountsCount + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + this.totalAccountsCount, CommonUtilities.getaccessibilityConfig());

      if (this.view.lblLoan2.text === "M") {
        this.viewOnlySelectedOnClick();
      }
    },

    setUIForCompany: function() {
      let self = this;
      this.view.Search.txtSearch.text = "";
      this.view.lblLoan2.text = "L";
      this.view.lblLoan2.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.RadioButtonOff");
      FormControllerUtility.disableButton(this.view.btnApply);
      this.populateAccounts();
      //FormControllerUtility.enableButton(this.view.btnProceedRoles);

      let lastFourDigitOfCompanyId = this.accountLevelPermissions.cif;
      if (lastFourDigitOfCompanyId.length > 4) {
        lastFourDigitOfCompanyId = lastFourDigitOfCompanyId.substring(lastFourDigitOfCompanyId.length - 4, lastFourDigitOfCompanyId.length);
      }
      CommonUtilities.setText(this.view.lblCompanyName, this.accountLevelPermissions.companyName + " - " + lastFourDigitOfCompanyId, CommonUtilities.getaccessibilityConfig());

      //Features
      this.dependentActions = {};
      let featuresRowData = this.accountLevelPermissions.accounts[0].featurePermissions.map(function(features) {
        return {
          "lblDefaultAccountName": {
            "text": features.featureName,
            "accessibilityConfig": {
              "a11yLabel": features.featureName
            }
          },
          "featureId": features.featureId,
          "lblDefaultAccountIcon": {
            "isVisible": false
          }
        }
      });
      this.view.segAccountListActions1.setData(featuresRowData);
      CommonUtilities.setText(this.view.lblShowAllFeatures, kony.i18n.getLocalizedString("i18n.common.none"), CommonUtilities.getaccessibilityConfig());
      CommonUtilities.setText(this.view.lblShowAllFeatures2, kony.i18n.getLocalizedString("i18n.common.none"), CommonUtilities.getaccessibilityConfig());
      CommonUtilities.setText(this.view.lblShowAllFeatures3, kony.i18n.getLocalizedString("i18n.common.none"), CommonUtilities.getaccessibilityConfig());

      this.view.flxAccountsRightContainer1.onClick = function() {
        if(self.view.CopycompanyListAllFeatures.isVisible){
          self.view.CopycompanyListAllFeatures.isVisible = false;
          self.view.lblImgDropdown1.text = "O";
        }
        else {
          self.view.CopycompanyListAllFeatures.isVisible = true;
          self.view.lblImgDropdown1.text = "P";
        }
      };
      this.view.segAccountListActions1.onRowClick = function() {
        let index = self.view.segAccountListActions1.selectedRowIndex[1];
        let rowData = self.view.segAccountListActions1.data;
        let selectedFeature = rowData[index].lblDefaultAccountName.text;
        CommonUtilities.setText(self.view.lblShowAllFeatures, selectedFeature, CommonUtilities.getaccessibilityConfig());
        self.view.CopycompanyListAllFeatures.isVisible = false;
        self.view.lblImgDropdown1.text = "O";
        CommonUtilities.setText(self.view.lblShowAllFeatures2, kony.i18n.getLocalizedString("i18n.common.none"), CommonUtilities.getaccessibilityConfig());

        self.generateDependentActions(index);

        let actionsHeaderData = {
          "totalActionsCount": self.accountLevelPermissions.accounts[0].featurePermissions[index].permissions.length,
          "selectedActionsCount": 0,
          "lastSelectedAction": "",
          "featureId": rowData[index].featureId,
          "flxTransfersFromListHeader": {
            "isVisible": false
          }
        };
        let actionsRowData = self.accountLevelPermissions.accounts[0].featurePermissions[index].permissions.map(function(actions) {
          return {
            "lblDefaultAccountName": {
              "text": actions.actionName,
              "accessibilityConfig": {
                "a11yLabel": actions.actionName
              }
            },
            "actionId": actions.actionId,
            "lblDefaultAccountIcon": {
              "text": "D",
              "accessibilityConfig": {
                "a11yLabel": kony.i18n.getLocalizedString("i18n.Accessibility.checkboxUnSelected")
              }
            }
          }
        });
        self.view.segAccountListActions2.setData([
          [actionsHeaderData, actionsRowData]
        ]);
        if (self.view.lblShowAllFeatures3.text !== kony.i18n.getLocalizedString("i18n.common.none") && self.view.lblShowAllFeatures2.text !== kony.i18n.getLocalizedString("i18n.common.none")) {
          FormControllerUtility.enableButton(self.view.btnApply);
        } else {
          FormControllerUtility.disableButton(self.view.btnApply);
        }

      };

      //Actions
      this.view.flxAccountsRightContainer2.onClick = function() {
        if (self.view.lblShowAllFeatures.text !== kony.i18n.getLocalizedString("i18n.common.none")) {
          if (self.view.companyListAllFeatures2.isVisible) {
            self.view.companyListAllFeatures2.isVisible = false;
            self.view.lblImgDropdown2.text = "O";
            let actionsSegData = self.view.segAccountListActions2.data;
            if (actionsSegData[0][0].selectedActionsCount === 1) {
              CommonUtilities.setText(self.view.lblShowAllFeatures2, actionsSegData[0][0].lastSelectedAction, CommonUtilities.getaccessibilityConfig());
            } else {
              CommonUtilities.setText(self.view.lblShowAllFeatures2, kony.i18n.getLocalizedString("i18n.UserManagement.selected") + actionsSegData[0][0].selectedActionsCount + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + actionsSegData[0][0].totalActionsCount, CommonUtilities.getaccessibilityConfig());
            }
            if (self.view.lblShowAllFeatures.text !== kony.i18n.getLocalizedString("i18n.common.none") && self.view.lblShowAllFeatures3.text !== kony.i18n.getLocalizedString("i18n.common.none")) {
              FormControllerUtility.enableButton(self.view.btnApply);
            } else {
              FormControllerUtility.disableButton(self.view.btnApply);
            }
          } else {
            self.view.companyListAllFeatures2.isVisible = true;
            self.view.lblImgDropdown2.text = "P";
          }
        }
      };

      this.view.segAccountListActions2.onRowClick = function() {
        let index = self.view.segAccountListActions2.selectedRowIndex[1];
        let segData = self.view.segAccountListActions2.data;
        let selectedAction = segData[0][1][index].actionId;
        self.view.companyListAllFeatures2.isVisible = false;
        self.view.lblImgDropdown2.text = "O";

        let toSetIcon = "D",
            adder = -1,
            depIndex = 1,
            toSetA11y = kony.i18n.getLocalizedString("i18n.Accessibility.checkboxUnSelected");
        if (segData[0][1][index].lblDefaultAccountIcon.text === "D") {
          toSetIcon = "C";
          toSetA11y = kony.i18n.getLocalizedString("i18n.Accessibility.checkboxSelected");
          adder = +1;
          depIndex = 0;
        }
        let oneSelectedAction = "";
        segData[0][1].forEach(function(eachAction) {
          if (eachAction.lblDefaultAccountIcon.text !== toSetIcon) {
            if (eachAction.actionId === selectedAction || self.dependentActions[segData[0][0].featureId][selectedAction][depIndex].indexOf(eachAction.actionId) >= 0) {
              eachAction.lblDefaultAccountIcon.text = toSetIcon;
              eachAction.lblDefaultAccountIcon.accessibilityConfig.a11yLabel = toSetA11y;
              segData[0][0].selectedActionsCount += adder;
            }
          }
          if (eachAction.lblDefaultAccountIcon.text === "C") {
            oneSelectedAction = eachAction.lblDefaultAccountName.text;
          }
        });
        if (segData[0][0].selectedActionsCount === 1) {
          segData[0][0].lastSelectedAction = oneSelectedAction;
        }
        self.view.segAccountListActions2.setData(segData);
      };

      //Permissions

      let permissionsArr = [kony.i18n.getLocalizedString("i18n.Alerts.Enable"), kony.i18n.getLocalizedString("i18n.UserManagement.disable")];
      let permissionsSegData = permissionsArr.map(function(permission) {
        return {
          "lblDefaultAccountName": {
            "text": permission,
            "accessibilityConfig": {
              "a11yLabel": permission
            }
          },
          "lblDefaultAccountIcon": {
            "isVisible": false
          }
        }
      });
      this.view.segAccountListActions3.setData(permissionsSegData);

      this.view.flxSubPermissionType.onClick = function() {
        if(self.view.companyListAllFeatures3.isVisible){
          self.view.companyListAllFeatures3.isVisible = false;
          self.view.lblImgDropdown3.text = "O";
        }
        else {
          self.view.companyListAllFeatures3.isVisible = true;
          self.view.lblImgDropdown3.text = "P";
        }
      };
      this.view.segAccountListActions3.onRowClick = function() {
        let index = self.view.segAccountListActions3.selectedRowIndex[1];
        let rowData = self.view.segAccountListActions3.data;
        CommonUtilities.setText(self.view.lblShowAllFeatures3, rowData[index].lblDefaultAccountName.text, CommonUtilities.getaccessibilityConfig());
        self.view.segAccountListActions3.setData(rowData);
        self.view.companyListAllFeatures3.isVisible = false;
        self.view.lblImgDropdown3.text = "O";
        if (self.view.lblShowAllFeatures.text !== kony.i18n.getLocalizedString("i18n.common.none") && self.view.lblShowAllFeatures2.text !== kony.i18n.getLocalizedString("i18n.common.none")) {
          FormControllerUtility.enableButton(self.view.btnApply);
        } else {
          FormControllerUtility.disableButton(self.view.btnApply);
        }
      };
      FormControllerUtility.hideProgressBar(this.view);
    },

    parseDepActions: function(dependentActionsString) {
      //console.log(dependentActionsString);
      return dependentActionsString.substr(1, dependentActionsString.length - 2).split(",").map(eachStr => eachStr.trim());
    },

    generateDependentActions: function(index) {
      let self = this;
      let featureId = this.accountLevelPermissions.accounts[0].featurePermissions[index].featureId;
      if (!(this.dependentActions.hasOwnProperty(featureId))) {
        this.dependentActions[featureId] = {};
        this.accountLevelPermissions.accounts[0].featurePermissions[index].permissions.map(function(action) {
          self.dependentActions[featureId][action.actionId] = [action.dependentActions === undefined ? [] : self.parseDepActions(action.dependentActions), []];
        });

        for (let actionId in self.dependentActions[featureId]) {
          self.dependentActions[featureId][actionId][0].forEach(function(depAction) {
            if (self.dependentActions[featureId].hasOwnProperty(depAction)) {
              self.dependentActions[featureId][depAction][1].push(actionId);
            }
          });
        }
      }
    },
    sortAccounts: function(index, sortParam) {
      let self = this;
      if (this.sortOrder === "ASC") {
        this.sortOrder = "DESC";
      } else {
        this.sortOrder = "ASC";
      }
      let segData = this.accountsSegData;
      //sortField,sortType,searchParams,searchString
      let accountsSortResult = CommonUtilities.sortAndSearchJSON(self.accountTypeMap[segData[index][0].lblRecipientName.text], sortParam, this.sortOrder, "accountName,accountId", this.view.Search.txtSearch.text);
      if (accountsSortResult !== -1 && accountsSortResult !== null && accountsSortResult !== undefined && accountsSortResult.length != 0) {
        segData[index][1] = self.getAccountsSegRowData(accountsSortResult, index);
        this.view.segmentFileTransactions.setData([]);
        this.view.segmentFileTransactions.setData(segData);

        if (this.view.lblLoan2.text === "M") {
          this.viewOnlySelectedOnClick();
        }
      }
    },
    toggleSwitchAlerts: function() {
      var switchSegData = [];
      var index = [];
      var excludeIndex = [];
      var switchIndex = this.view.toggleSwitch.selectedIndex;
      if (switchIndex === 0) {
        var segDataSwitch = this.view.segmentFileTransactions.data;
        for (var s = 0; s < segDataSwitch.length; s++) {
          segDataSwitch[s][1].forEach(function(data) {
            if (data.lblDropdownRowICon.text === "C") {
              switchSegData.push(data);
              index.push({
                "index": s
              });
            } else {
              if (!excludeIndex.includes(s)) {
                excludeIndex.push(s);
              }
            }
          });
        }
        var segmentForSwitch = [];
        for (var i = 0; i < switchSegData.length; i++) {
          segmentForSwitch.push(Object.assign(switchSegData[i], index[i]));
        }
        var result = segmentForSwitch.reduce(function(r, a) {
          r[a.index] = r[a.index] || [];
          r[a.index].push(a);
          return r;
        }, Object.create(null));
        var scope = this;
        var values = Object.values(result);
        values.forEach(function(item) {
          item.forEach(function(data) {
            delete data.index;
          });
        });
        var indexValues = [];
        var keys = Object.keys(result);
        excludeIndex.forEach(function(item) {
          if (!keys.includes(item.toString())) {
            indexValues.push(item.toString());
          }
        });
        var segData = this.view.segmentFileTransactions.data;
        for (var i = 0; i < keys.length; i++) {
          segData[i].pop();
          segData[i].push(values[i]);
          //scope.view.segmentFileTransactions.setData(segData);
        }
        for (var i = indexValues.length - 1; i >= 0; i--) {
          segData.splice(indexValues[i], 1);
        }
        scope.view.segmentFileTransactions.setData(segData);
      } else {
        //this.addOnlySectionHeaders(this.getSectionHeadersMonetaryFeaturesReadOnly());
        this.populateAccounts();
      }
    },

    searchAccounts: function(searchString) {
      if (searchString === "") {
        this.view.Search.flxClearBtn.isVisible = false;
      } else {
        this.view.Search.flxClearBtn.isVisible = true;
      }
      let self = this;
      let searchSegData = [];
      let index = -1;
      this.accountsSegData.forEach(function(eachRow, i) {
        //sortField,sortType,searchParams,searchString
        let accountsSearchResult = CommonUtilities.sortAndSearchJSON(self.accountTypeMap[eachRow[0].lblRecipientName.text], null, null, "accountName,accountId", searchString);
        if (accountsSearchResult !== -1 && accountsSearchResult !== null && accountsSearchResult !== undefined && accountsSearchResult.length != 0) {
          index++;
          let segRow = self.getAccountsSegRowData(accountsSearchResult, index);
          eachRow[0].flxSortMakeTransfers.isVisible = true;
          eachRow[0].lblDropDownIcon.text = "P";
          eachRow[0].lblDropDownIcon.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.dropdownOpen");
          eachRow[0].selectedAccounts = self.isSelectedAccountMap[eachRow[0].lblRecipientName.text];
          eachRow[0].flxDropdown.onClick = self.bulkSelectAccounts.bind(this, index);
          eachRow[0].flxActions.onClick = self.onDropdownClick.bind(this, index);
          CommonUtilities.setText(eachRow[0].lblAccountsSelectedNo, eachRow[0].selectedAccounts + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + eachRow[0].totalAccounts, CommonUtilities.getaccessibilityConfig());
          searchSegData.push([eachRow[0], segRow]);
        }
      });

      if (searchSegData.length === 0) {
        this.view.NoTransactions.isVisible = true;
        this.view.rtxNoPaymentMessage.text = kony.i18n.getLocalizedString("i18n.onlineHelp.noSearchResults");
      } else {
        this.view.NoTransactions.isVisible = false;
      }
      this.view.segmentFileTransactions.setData(searchSegData);
      if (this.view.lblLoan2.text === "M") {
        this.viewOnlySelectedOnClick();
      }
    },

    setPermissionTypeToAccountsData: function(accountType, accountId, permissionType) {
      this.accountTypeMap[accountType].forEach(function(account) {
        if (account.accountId === accountId) {
          account.permissionType = permissionType;
        }
      });

    },
    getAccountsSegRowData: function(accounts, index) {
      let self = this;
      let segRow = accounts.map(function(account, rowIndex) {
        account.Id = account.accountId;
        account.accountNumber = account.accountId;

        let isSelected = false;
        if (account.accountId in self.isSelectedAccountMap) {
          isSelected = self.isSelectedAccountMap[account.accountId];
        } else {
          self.isSelectedAccountMap[account.accountId] = false;
          isSelected = false;
        }

        let totalPermissions = 0;
        let selectedPermissions = 0;
        account.featurePermissions.forEach(function(featurePermission) {
          totalPermissions += featurePermission.permissions.length;
          featurePermission.permissions.forEach(function(permission) {
            if (permission.isEnabled) {
              selectedPermissions++;
            }
          });
        });
        let permissionType = selectedPermissions === totalPermissions ? kony.i18n.getLocalizedString("i18n.UserManagement.default") : kony.i18n.getLocalizedString("i18n.UserManagement.custom");
        self.setPermissionTypeToAccountsData(account.accountType, account.accountId, permissionType);

        return {
          "lblActions": {
            "text": kony.i18n.getLocalizedString("i18n.billPay.Edit"),
            "accessibilityConfig": {
              "a11yLabel": kony.i18n.getLocalizedString("i18n.billPay.Edit")
            }
          },
          "flxActionsRow": {
            "onClick": self.editAccountLevel.bind(this, index, rowIndex)
          },
          "lblBankName": {
            "text": permissionType,
            "accessibilityConfig": {
              "a11yLabel": permissionType
            }
          },
          "lblDropdownRowICon": {
            "text": isSelected ? "C" : "D",
            "accessibilityConfig": {
              "a11yLabel": isSelected ? kony.i18n.getLocalizedString("i18n.Accessibility.checkboxSelected") : kony.i18n.getLocalizedString("i18n.Accessibility.checkboxUnSelected")
            }
          },
          "flxDropdownRow": {
            "onClick": self.selectAccount.bind(this, index, rowIndex)
          },
          "lblIcon": {
            "text": "s"
          },
          "lblRecipientNameRow": {
            "text": CommonUtilities.getAccountDisplayName(account),
            "accessibilityConfig": {
              "a11yLabel": CommonUtilities.getAccountDisplayName(account),
            }
          },
          "lblSeparator": {
            "text": ""
          },
          "lblTransactionsType": {
            "text": selectedPermissions + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + totalPermissions,
            "accessibilityConfig": {
              "a11yLabel": selectedPermissions + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + totalPermissions,
            }
          },
          "accountId": account.accountId,
          "flxUserManagementSelectBulkTransactionLimits": {
            "isVisible": true
          }
        }
      });
      return segRow;
    },

    viewOnlySelectedOnClick: function() {
      let self = this;
      let segData = this.view.segmentFileTransactions.data;
      let selectedOnlySegData = [];;
      segData.forEach(function(eachAccountType, index) {
        let j = 0;
        eachAccountType[1].forEach(function(eachAccount) {
          if (eachAccount.lblDropdownRowICon.text === "C") {
            j += 1;
          } else {
            eachAccount.flxUserManagementSelectBulkTransactionLimits = {
              "isVisible": false
            };
          }
        });
        if (j === 0) {
          eachAccountType[0].lblDropDownIcon.text = "O";
          eachAccountType[0].lblDropDownIcon.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.dropdownClose");
          eachAccountType[0].flxSortMakeTransfers.isVisible = false;
        }
      });
      this.view.segmentFileTransactions.setData(segData);
    },

    bulkSelectAccounts: function(index) {
      let self = this;
      let segData = this.view.segmentFileTransactions.data;
      if (segData[index][0].lblDropdown.text === "C" || segData[index][0].lblDropdown.text === "z") {
        segData[index][0].lblDropdown.text = "D"
        segData[index][0].lblDropdown.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.checkboxUnSelected");
        self.selectedAccountsCount -= segData[index][0].selectedAccounts;
        segData[index][0].selectedAccounts = 0;
        self.isSelectedAccountMap[segData[index][0].lblRecipientName.text] = 0;
        CommonUtilities.setText(segData[index][0].lblAccountsSelectedNo, segData[index][0].selectedAccounts + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + segData[index][0].totalAccounts, CommonUtilities.getaccessibilityConfig());
        segData[index][1].forEach(function(eachRow) {
          eachRow.lblDropdownRowICon.text = 'D';
          eachRow.lblDropdownRowICon.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.checkboxUnSelected");
          eachRow.lblDropdownRowICon.skin = "sknlblOLBFontsE3E3E320pxOlbFontIcons";
          self.isSelectedAccountMap[eachRow.accountId] = false;
        });
      } else {
        segData[index][0].lblDropdown.text = "C";
        segData[index][0].lblDropdown.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.checkboxSelected");
        self.selectedAccountsCount += segData[index][0].totalAccounts - segData[index][0].selectedAccounts;
        segData[index][0].selectedAccounts = segData[index][0].totalAccounts;
        self.isSelectedAccountMap[segData[index][0].lblRecipientName.text] = segData[index][0].totalAccounts;
        CommonUtilities.setText(segData[index][0].lblAccountsSelectedNo, segData[index][0].selectedAccounts + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + segData[index][0].totalAccounts, CommonUtilities.getaccessibilityConfig());
        segData[index][1].forEach(function(eachRow) {
          eachRow.lblDropdownRowICon.text = 'C';
          eachRow.lblDropdownRowICon.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.checkboxSelected");
          eachRow.lblDropdownRowICon.skin = "sknlblDelete20px";
          self.isSelectedAccountMap[eachRow.accountId] = true;
        });
      }
      CommonUtilities.setText(this.view.lblNoAccountsSelected, this.selectedAccountsCount + kony.i18n.getLocalizedString("i18n.konybb.Common.of") + this.totalAccountsCount, CommonUtilities.getaccessibilityConfig());
      this.view.segmentFileTransactions.setData(segData);

      if (this.view.lblLoan2.text === "M") {
        this.viewOnlySelectedOnClick();
      }

    },

    bulkUpdate: function() {
      let self = this;
      let selectedFeature = this.view.lblShowAllFeatures.text;
      let selectedActions = [];
      let actionsSegData = this.view.segAccountListActions2.data;
      actionsSegData[0][1].forEach(function(eachRow) {
        if (eachRow.lblDefaultAccountIcon.text === "C") {
          selectedActions.push(eachRow.actionId);
        }
      });
      let bool = this.view.lblShowAllFeatures3.text === kony.i18n.getLocalizedString("i18n.Alerts.Enable") ? true : false;

      this.accountLevelPermissions.accounts.forEach(function(account) {
        if (self.isSelectedAccountMap[account.accountId] == true) {
          account.featurePermissions.forEach(function(eachFeature) {
            if (eachFeature.featureName === selectedFeature) {
              eachFeature.permissions.forEach(function(action) {
                if (selectedActions.indexOf(action.actionId) >= 0) {
                  action.isEnabled = bool;
                }
              });
            }
          });
        }
      });
      this.reloadAccounts();
      this.updateButtonToShow = true;
      FormControllerUtility.enableButton(this.view.btnProceedRoles);
    },

    reloadAccounts: function() {
      let segData = [];
      let self = this;
      let index = -1;
      let existingData = this.view.segmentFileTransactions.data;
      for (let accountType in this.accountTypeMap) {
        //this.isSelectedAccountMap[accountType] = this.accountTypeMap[accountType].length;
        index += 1;
        let accountTypeRow = [];
        let segHeader = existingData[index][0];
        segHeader.lblDropDownIcon.text = "P";
        segHeader.lblDropDownIcon.accessibilityConfig.a11yLabel = kony.i18n.getLocalizedString("i18n.Accessibility.dropdownOpen");
        segHeader.flxSortMakeTransfers.isVisible = true;
        let segRow = self.getAccountsSegRowData(this.accountTypeMap[accountType], index);
        accountTypeRow.push(segHeader);
        accountTypeRow.push(segRow);

        segData.push(accountTypeRow);
      }
      this.view.segmentFileTransactions.setData(segData);
    },

    getBusinessBankingPresentation() {
      return kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("BusinessBankingUIModule").presentationController;
    },

    editAccountLevel: function(index, rowIndex) {
      FormControllerUtility.showProgressBar(this.view);
      let self = this;
      let segData = this.view.segmentFileTransactions.data;
      let params = {
        "companyId": self.accountLevelPermissions.cif,
        "companyName": self.accountLevelPermissions.companyName,
        "accountId": segData[index][1][rowIndex].accountId,
        "userManagementData": {
          "accountLevelPermissions": [self.accountLevelPermissions]
        }
      }
      applicationManager.getNavigationManager().navigateTo({"appName" : "UserManagementMA", "friendlyName" : "BusinessBankingUIModule/frmAccountLevelFeature"}, true, params);
    },

    resetToDefault: function() {
      this.accountLevelPermissions = this.getBusinessBankingPresentation().getAccountLevelPermissionsInitByCompany(this.accountLevelPermissions.cif);
      this.updateButtonToShow = true;
      FormControllerUtility.enableButton(this.view.btnProceedRoles);
      this.setUIForCompany();
    }
  };
});