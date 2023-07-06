define(["FormControllerUtility", "commonUtilities", "OLBConstants"], function (FormControllerUtility, commonUtilities, OLBConstants) {
    const NA = kony.i18n.getLocalizedString("i18n.common.NA");
    let contentScope;
    let sweepData;
    return {
        /**
         * Sets the initial actions for form
         */
        init: function() {
            this.view.preShow = this.preShow;
            this.view.postShow = this.postShow;
            this.view.onDeviceBack = function() {};
            this.view.onBreakpointChange = this.onBreakpointChange;
            this.view.formTemplate12.onError = this.onError;
            this.initFormActions();
        },
        /**
         * @api : onBreakpointChange
         *This function for changing the UI depending upon breakpoint
         * @return : NA
         */
        onBreakpointChange: function(form, width) {
            if (width === 640) {
                this.view.formTemplate12.pageTitleVisibility = false;
            }
            else {
              this.view.formTemplate12.pageTitleVisibility = true; 
            }
        },
        /**
         * Performs the actions required before rendering form
         */
        preShow: function() {
            var formTemplateContext = {
                "breadCrumbBack": {
                    "flag": "true"
                }
            };
            this.view.formTemplate12.setContext(formTemplateContext);
            contentScope.flxBoth.setVisibility(false);
            this.view.formTemplate12.hideBannerError();
            contentScope.rtxCondition.skin = "bbSknRtx424242SSP15px";
        },
        /**
         * Performs the actions required after rendering form
         */
        postShow: function() {
            applicationManager.getNavigationManager().applyUpdates(this);
            contentScope.btnDelete.setVisibility(this.presenter.checkUserPermission('ACCOUNT_SWEEP_DELETE'));
            contentScope.btnEdit.setVisibility(this.presenter.checkUserPermission('ACCOUNT_SWEEP_EDIT'));
        },
        /**
         * Method to initialise form actions
         */
        initFormActions: function() {
            this.presenter = applicationManager.getModulesPresentationController({
                appName: 'AccountSweepsMA',
                moduleName: 'AccountSweepsUIModule'
            });
            contentScope = this.view.formTemplate12.flxContentTCCenter;
            formatUtilManager = applicationManager.getFormatUtilManager();
            contentScope.btnDelete.onClick = this.customPopup;
            contentScope.btnEdit.onClick = this.editSweep;
        },
        /**
         * @api : editSweep
         * Triggerd on click of Edit 
         * @return : NA
         */
        editSweep: function() {
            sweepData.sweepType =  contentScope.lblValue3.text;
            sweepData.isEdit = true;
            this.presenter.showSweepScreen({
                context: "createSweep"
            }, sweepData);
        },
        /**Formats the Currency
         * @param  {Array} amount Array of transactions model
         * @param  {function} onCancelCreateTransfer Needs to be called when cancel button is called
         */
        formatCurrency: function(amount, currencySymbolNotRequired) {
            return commonUtilities.formatCurrencyWithCommas(amount, currencySymbolNotRequired);
        },
        /**
         * @api : customPopup
         * Triggerd on click of Delete 
         * @return : NA
         */
        customPopup: function() {
            var scope = this;
            var deletePopupContext = {
                heading: kony.i18n.getLocalizedString("kony.mb.common.Delete"),
                message: kony.i18n.getLocalizedString("i18n.accountSweeps.deleteRuleAdded") +" "+ '"' + contentScope.lblValue1.text + '"' + "?",
                yesClick: function() {
                    scope.presenter.deleteSweep(sweepData, scope.view.id);
                },
            };
            this.view.formTemplate12.setPopup(deletePopupContext)
        },
        /**
         * Method to update the UI
         * @param {Collection} viewModel List of view properities and keys
         */
        updateUI: function(viewModel) {
            commonUtilities.setText(contentScope.lblValue1, (commonUtilities.truncateStringWithGivenLength(viewModel.primaryAccountName + "....", 26) + commonUtilities.getLastFourDigit(viewModel.primaryAccountNumber)));
            commonUtilities.setText(contentScope.lblValue2, (commonUtilities.truncateStringWithGivenLength(viewModel.secondaryAccountName + "....", 26) + commonUtilities.getLastFourDigit(viewModel.secondaryAccountNumber)));
            if(viewModel.belowSweepAmount) 
            var amountBelow = applicationManager.getFormatUtilManager().getCurrencySymbol(viewModel.currencyCode) + this.formatCurrency(viewModel.belowSweepAmount, true);
            if(viewModel.aboveSweepAmount)
            var amountAbove = applicationManager.getFormatUtilManager().getCurrencySymbol(viewModel.currencyCode) + this.formatCurrency(viewModel.aboveSweepAmount, true);
            contentScope.lblValue3.text = amountBelow ? amountAbove ? kony.i18n.getLocalizedString("i18n.accountsweeps.both") : kony.i18n.getLocalizedString("i18n.accountsweeps.below") : kony.i18n.getLocalizedString("i18n.signatory.above");
            contentScope.lblValue4.text = viewModel.frequency;
            contentScope.lblValue5.text = viewModel.startDate;
            contentScope.lblValue6.text = viewModel.endDate === "" ? kony.i18n.getLocalizedString("i18n.accountsweeps.endManually"): viewModel.endDate;
            if (contentScope.lblValue3.text === "Both") {
                contentScope.rtxCondition.text = "If the balance in " + contentScope.lblValue1.text + ":";
                contentScope.rtxSweepCondAbove.text = " goes <b>above " + amountAbove + "</b> then <b>transfer excess</b> amount to " + contentScope.lblValue2.text;
                contentScope.rtxSweepCond.text = " goes <b>below " + amountBelow + "</b> then <b>topup </b>from " + contentScope.lblValue2.text;
                contentScope.flxBoth.setVisibility(true);
            } else if (contentScope.lblValue3.text === "Above") {
                contentScope.rtxCondition.text = "If the balance in " + contentScope.lblValue1.text + " goes <b>above " + amountAbove + "</b> then <b>transfer excess</b> amount to " + contentScope.lblValue2.text;
            } else {
                contentScope.rtxCondition.text = "If the balance in " + contentScope.lblValue1.text + " goes <b>below " + amountBelow + "</b> then <b>topup </b>from " + contentScope.lblValue2.text;
            }
        },
        /**
         * Entry point method for the form controller
         * @param {Object} viewModel - it contains the set of view properties and keys.
         */
        updateFormUI: function(viewModel) {
            if (viewModel.isLoading === true) {
                FormControllerUtility.showProgressBar(this.view);
            } else if (viewModel.isLoading === false) {
                FormControllerUtility.hideProgressBar(this.view);
            }
            if (viewModel.serverError) {
                this.showServerError(viewModel.serverError);
            }
            if (viewModel.sweeps) {
                sweepData = viewModel.sweeps.AccountSweep[0];
                this.updateUI(viewModel.sweeps.AccountSweep[0]);
            }
            if (viewModel.deleteFailure) {
                this.view.formTemplate12.showBannerError({
                    dbpErrMsg: kony.i18n.getLocalizedString('i18n.accountSweeps.SweepCouldNotBeDeleted'),
                    i18n: kony.i18n.getLocalizedString('i18n.accountSweeps.SweepCouldNotBeDeleted'),
                    errorDetails:  JSON.stringify(kony.i18n.getLocalizedString("i18n.accountSweeps.deleteFailureMessage") )
                });
                
            }
        },
        /**
         * Method to show server error in form 
         * @param {String} errorMsg - Error Message from server
         */
        showServerError: function(errorMsg) {
            this.view.formTemplate12.showBannerError({
                dbpErrMsg: errorMsg
            });
        },
        /**
         * Error thrown from catch block of form controller
         */
        onError: function(err) {
            kony.print(JSON.stringify(err));
        },
    };
});


