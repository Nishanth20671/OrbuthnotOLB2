define(['CommonUtilities', 'ViewConstants', 'FormControllerUtility', 'OLBConstants', 'CampaignUtility'], function(CommonUtilities, ViewConstants, FormControllerUtility, OLBConstants, CampaignUtility) {
  var orientationHandler = new OrientationHandler();
  return {
    segmentData : null,
    isDropDownAccountsOpened: true,
    fromScroll: false,
    documentTitle : {},
    /**
         * Method that used to updtae the response of the widgets as per the condition
     */
    updateFormUI: function(uiData) {
      if (uiData) {
        if (uiData.showLoadingIndicator) {
          if (uiData.showLoadingIndicator.status === true) {
            FormControllerUtility.showProgressBar(this.view);
          } else {
            FormControllerUtility.hideProgressBar(this.view);
          }
        }
        if (uiData.mortgageAccount) {
          this.setFormData(uiData.mortgageAccount);
	      accountList = applicationManager.getAccountManager().getInternalAccounts();
	      this.showListOfAccounts(accountList);
        }
        if (uiData.documentList) {
          this.setDocumentsToSeg(uiData.documentList);
        }
        if (uiData.documentDownloadFile) {
          this.downloadDocumentFile(uiData.documentDownloadFile);
        }
        if (uiData.showOnServerError) {
          this.onErrorCallBack(uiData.showOnServerError);
        }
	    if (uiData.selectedDocData) {
          this.onDownloadClick(uiData.selectedDocData);
        }
      }
      else{
        kony.print("undefined");
      }
    },
    /**
         * Method that gets called on preshow of frmViewDocument
     */

    preShowFrmViewDocument: function(){
      var scopeObj = this;
      //this.view.customheadernew.forceCloseHamburger();
      //this.view.customheadernew.customhamburger.activateMenu("ACCOUNTS", "My Accounts");
      this.view.flxListOfAccounts.onClick = function() {
                scopeObj.view.flxMortagageAccounts.isVisible = !scopeObj.view.flxMortagageAccounts.isVisible
      };
      this.view.segMortgageAccounts.onRowClick = this.segAccountsOnClick;
      this.view.txtSearchBox.onTextChange = this.searchDocument;
      this.view.flxClearSearch.onTouchStart = this.clearSearch;
      this.segmentData = undefined;
      this.view.segMortgageAccounts.onScrolling = function() {
                scopeObj.fromScroll = true;
       };
      FormControllerUtility.updateWidgetsHeightInInfo(this.view, ['flxHeader',
                				'flxMainScroll',
                'flxMain',
                'flxFooter',
                'customheadernew',
                ]);
    },
    /**
         * Method that gets called on postShow of frmViewDocument
     */

    postShowFrmViewDocument: function() {
      applicationManager.getNavigationManager().applyUpdates(this);
      //this.view.customheadernew.forceCloseHamburger();
      this.AdjustScreen();
    },

    /**
         * Method that sets mortgage account data
     */

    setFormData: function(defaultAccount){
      this.view.lblChooseAccount.text =  defaultAccount.formattedAccountNumber;
      kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        moduleName: "AccountServicesUIModule",
        appName: "ArrangementsMA"
      }).presentationController.fetchDocumentList(defaultAccount);
    },

    /**
         * Method that sets segment data to view list of mortagage accounts
     */
    setAccountsToSeg: function(mortgageAccounts){
      this.view.segMortgageAccounts.widgetDataMap = {
        lblTransactionHeader: "lblTransactionHeader",
        lblAccountName: "formattedAccountName",
        lblAccountType: "accountType",
      };
      this.view.segMortgageAccounts.setData(mortgageAccounts);
      this.AdjustScreen();
    },

    /**
         * Method that displays mortgage accounts available for the user
     */
    showListOfAccounts: function(accountList){
      //this.view.lblChooseAccount.text = "Select Account";
      //this.view.lblDropDown.text = 'p';
      var mortgageAccounts = accountList.filter(function(account) {
        return account.accountType == "mortgageFacility"
      })
      for(var account=0;account<mortgageAccounts.length;account++){
        mortgageAccounts[account].formattedAccountName = mortgageAccounts[account].accountName + " ...." + mortgageAccounts[account].accountID.substring(mortgageAccounts[account].accountID.length - 4);
      }
      var data = [
      [{"lblTransactionHeader": "Mortgage Facilities" + " (" + mortgageAccounts.length + ")"},
      mortgageAccounts
      ]
      ]
      this.setAccountsToSeg(data);
    },

    /**
         * onRowClick of mortagage accounts method, which calls documents service
     */
    segAccountsOnClick: function(){
      //have to start loading indicator
      FormControllerUtility.showProgressBar(this.view);
      this.view.flxMortagageAccounts.isVisible = false;
      //var rowid=this.view.segMortgageAccounts.selectedRowIndex[1];
      var selectedAccount = this.view.segMortgageAccounts.selectedRowItems;
      this.view.lblChooseAccount.text = selectedAccount[0].formattedAccountName;
      //this.view.lblDropDown.text = this.view.flxMortagageAccounts.isVisible === "true" ? 'P' : 'O';
      kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        moduleName: "AccountServicesUIModule",
        appName: "ArrangementsMA"
      }).presentationController.fetchDocumentList(selectedAccount[0]);
      this.AdjustScreen();
    },

    /**
         * Method that sets the documents list of segment
     */ 

    setDocumentsToSeg: function(data){
      this.view.segListOfDocuments.widgetDataMap = {
        flxFileDownload: "flxFileDownload",
        flxFileDownloadMobile: "flxFileDownload",
        lblFileName: "documentName",
        imgDownload: "imgDownload",
        lblDownload: "lblDownload",
        imgFileType: "imgFileType"
      };
      data = this.formatDocumentData(data);
      this.segmentData = data;
      this.view.segListOfDocuments.setData(data);
      this.view.flxSearch.isVisible = true;
      this.view.flxListOfDocuments.isVisible = true;
      //have to stop Loading Indicator
      FormControllerUtility.hideProgressBar(this.view);
      this.AdjustScreen();
    },
    
    formatDocumentData: function(data){
      var isMobileDevice = ((kony.application.getCurrentBreakpoint() === 640) || orientationHandler.isMobile);
      for(var account=0;account<data.length;account++){
        data[account].flxFileDownload = {"left" : "0dp", "top" : "0dp"};
        if(isMobileDevice && data[account].documentName.length >25){
					data[account].documentName = data[account].documentName.substring(0,25) + "..." + (data[account].documentName.split("."))[1];
		}
      }
      return data;
    },

    /**
         * Method used to call service to download document
     */
    onDownloadClick: function(selectedData){
      this.documentTitle.documentName = selectedData.documentName;
      //have to add loading indicator
      FormControllerUtility.showProgressBar(this.view);
      kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        moduleName: "AccountServicesUIModule",
        appName: "ArrangementsMA"
      }).presentationController.downloadDocument(selectedData);
    },

    /**
         * Method to download document file
         * @param {String} fileUrl
         */
    downloadDocumentFile: function(fileUrl) {
      var data = {
        "url": fileUrl
      };
      //CommonUtilities.downloadFile(data);
      this.callDownloadService(data, this.documentTitle.documentName);
      FormControllerUtility.hideProgressBar(this.view);
     // this.AdjustScreen();
    },
    
    callDownloadService: function(mfDownloadURL, fileName) {
      try {
        var self = this;
        var authToken = KNYMobileFabric.currentClaimToken;
        var xhr = new kony.net.HttpRequest();
        xhr.open('GET',mfDownloadURL.url , true);
        xhr.setRequestHeader("X-Kony-Authorization", authToken);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.responseType = "blob";
        xhr.onReadyStateChange = function() {
          try{
            if (xhr.readyState === 4 && xhr.status === 200) {
              self.downloadFileFromResponse(xhr.response, fileName);
            } else if (xhr.status !== 200) {
              kony.print(" ERROR: Error downloadin csv");
            }
          }catch (err) {
            kony.print(" ERROR:" + err);
          }

        };
        xhr.send();
      } catch (err) {
        kony.print(" ERROR:" + err);
      }
    },
    downloadFileFromResponse: function(csvData, fileName) {
      var blobObj = new Blob([csvData], { type: "application/pdf;charset=utf-8," });
      var url = URL.createObjectURL(blobObj);
      var downloadLink = document.createElement("a");
      downloadLink.setAttribute('href', url);
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      kony.print("----"+ fileType +"file downloaded----");
    },

    /**
         * Method used to search the documents based on the keyword entered
     */
    searchDocument: function(){
      var navObj = applicationManager.getNavigationManager();
      var searchtext = this.view.txtSearchBox.text.toLowerCase();
      this.view.flxClearSearch.isVisible = true;
      if (searchtext) {
        var data = [];
        var documentList = this.view.segListOfDocuments.data;
        // headers.push(applicationManager.getPresentationUtility().getStringFromi18n("kony.mb.accdetails.pendingTransactions"));
        data = documentList;
        this.view.flxListOfDocuments.isVisible = true;
        this.view.flxNoDocuments.isVisible = false;
        var searchSegmentData = applicationManager.getDataProcessorUtility().commonSegmentSearch("documentName", searchtext, data);
        if (searchSegmentData.length > 0) {
          this.view.segListOfDocuments.setData(searchSegmentData);
        } else {
          this.view.flxListOfDocuments.isVisible = false;
          this.view.flxNoDocuments.isVisible = true;
        }
      } else {
        if (this.segmentData !== undefined && this.segmentData.length > 0) {
          this.view.flxNoDocuments.isVisible = false;
          this.view.segListOfDocuments.setData(this.segmentData);
          this.view.flxListOfDocuments.isVisible = true;
        } else {
          this.view.flxListOfDocuments.isVisible = false;
          this.view.flxNoDocuments.isVisible = true;
        }
      }
      this.AdjustScreen();
    },
    
    clearSearch: function(){
      this.view.txtSearchBox.text = "";
      this.view.segListOfDocuments.setData(this.segmentData);
      this.view.flxClearSearch.isVisible = false;
	      this.view.flxSearch.isVisible = true;
      this.view.flxListOfDocuments.isVisible = true;
      this.view.flxNoDocuments.isVisible = false;
      this.AdjustScreen();
    },
	


    /**
         * onBreakpointChange : Handles ui changes on .
         * @member of {frmViewDocumentController}
         * @param {integer} width - current browser width
         * @return {}
         * @throws {}
         */
      onBreakpointChange: function() {
        var currBreakpoint = kony.application.getCurrentBreakpoint();
        this.FormTouchEnd(currBreakpoint);
        accountList = applicationManager.getAccountManager().getInternalAccounts();
        this.showListOfAccounts(accountList);
        if (this.segmentData !== undefined && this.segmentData.length > 0) 
          this.setDocumentsToSeg(this.segmentData)
        this.AdjustScreen();
    },
    /**
         * Method to hide the popups in the form 
         */
    FormTouchEnd: function(width){
      scope=this;
      if (width == 640) {
        this.view.onTouchEnd = function() {}
      } else {
        if (width == 1024) {
          this.view.onTouchEnd = function() {}
        } else {
          this.view.onTouchEnd = function() {
            scope.hidePopUps();
          }
        }
      }
    },
    
    hidePopUps: function(){
      scope=this;
      if(this.view.flxMortagageAccounts.isVisible===false && this.isDropDownAccountsOpened === true){
        this.isDropDownAccountsOpened = false;
      }else if (this.view.flxMortagageAccounts.isVisible === true && this.isDropDownAccountsOpened === false){
        setTimeout(function() {
          if (!scope.fromScroll) {
            scope.view.flxMortagageAccounts.isVisible=false;
            scope.isDropDownAccountsOpened = true;
          }
          scope.fromScroll = false;
        }, "17ms"); 
      }
    },
    
    /**
         * Method to update the layout of the page
         */
    AdjustScreen: function() {
            this.view.forceLayout();
            var mainheight = 0;
            var screenheight = kony.os.deviceInfo().screenHeight;
            mainheight = this.view.customheadernew.info.frame.height + this.view.flxMain.info.frame.height;
            var diff = screenheight - mainheight;
            if (mainheight < screenheight) {
                diff = diff - this.view.flxFooter.info.frame.height;
                if (diff > 0) {
                    this.view.flxFooter.top = mainheight + diff - 50 + ViewConstants.POSITIONAL_VALUES.DP;
                } else {
                    this.view.flxFooter.top = mainheight - 50 + ViewConstants.POSITIONAL_VALUES.DP;
                }
            } else {
                this.view.flxFooter.top = (mainheight + 30) + ViewConstants.POSITIONAL_VALUES.DP;
            }
            
            if (kony.application.getCurrentBreakpoint() <= 1024 && kony.application.getCurrentBreakpoint() > 640) {
                this.view.customfooter.flxFooterMenu.left = "25px";
            }
            this.view.forceLayout();
        },

    /**
         * Method that sets error message
         */
    onErrorCallBack: function(errMsg){
      kony.print(errMsg);
      FormControllerUtility.hideProgressBar(this.view);
    }

  };
});