define({
  /**
   * init is called when the form is loaded , initialisation happen here
   */
  init: function () {
    var scope = this;
    scope.view.preShow = scope.preShowForm;
    scope.view.postShow = scope.postShowForm;
    applicationManager.getPresentationFormUtility().initCommonActions(this, "NO", this.view.id, scope.navigateCustomBack);
  },
  /***
   * navigateCustomBack is triggered native/ ios back event
   */
  navigateCustomBack: function () {
    this.sweepsModule.commonFunctionForgoBack();
  },

  /***
   * native/ios cancel event
   */
  cancelOnClick: function () {
    this.sweepsModule.cancelCommon("frmAccountSweepsDashBoard");
  },
  /**
   * preShowForm is called when the form is pre loaded
   */
  preShowForm: function () {
    var scope = this;
    if (kony.os.deviceInfo().name === "iPhone") {
      this.view.flxHeader.isVisible = false;
    } else {
      this.view.flxHeader.isVisible = true;
    }
    this.view.customCalendar.preShow();
    if (this.view.customCalendar.selectedDate === "") {
      this.view.btnContinue.setEnabled(false);
    } else {
      this.view.btnContinue.setEnabled(true);
    }
    this.initActions();
    this.sweepsModule = applicationManager.getModulesPresentationController({
      moduleName: "AccountSweepsUIModule",
      appName: "AccountSweepsMA",
    });
    this.view.customCalendar.selectedDate = "";
    this.view.customCalendar.triggerContinueAction = false;
    this.view.customCalendar.updateDateBullets();
    this.view.customCalendar.firstEnabledDate = "";
    this.view.customCalendar.setFirstEnabledDate();
    this.sweepsModule.isStartDateSelected = true;
    this.data = this.sweepsModule.getAccountSweepsObject();
    var navManager = applicationManager.getNavigationManager();
    let sweepflow = navManager.getEntryPoint("AccountSweepsFlow");
    if (sweepflow === "Edit") {
      var dateObject = new Date();
      var date = applicationManager
        .getFormatUtilManager()
        .getFormattedSelectedDate(dateObject);
      this.data.formattedStartDate !== date
        ? this.setStartDateToCalendar(date)
        : this.setStartDateToCalendar(this.data.formattedStartDate);
    } else {
      var startDateFeed1 = this.data.formattedStartDate;
      this.view.customCalendar.setFirstEnabledDate(startDateFeed1);
      this.setStartDateToCalendar(startDateFeed1);
    }
    this.enableLastDate();
    this.view.customCalendar.resetCal();
  },
  /**
   * initActions has all form action declarations
   */
  initActions: function () {
    let scope = this;
    this.view.customHeader.flxBack.onClick = this.navigateCustomBack;
    this.view.btnContinue.onClick = this.continueAction;
    this.view.customHeader.btnRight.onClick = function () {
      scope.cancelOnClick();
    };
  },
  /*
  It is used for setting the last start date enabled
  */
  enableLastDate: function () {
    this.view.customCalendar.lastEnabledDate = "";
    var lastEnabledDate = new Date(this.data.formattedStartDate);
    lastEnabledDate.setYear(lastEnabledDate.getFullYear() + 3);
    var setLastDate = applicationManager
      .getFormatUtilManager()
      .getFormattedSelectedDate(lastEnabledDate);
    this.view.customCalendar.setLastEnabledDate(setLastDate);
  },
  /**
   * It is used to set the date to calender
   */
  setStartDateToCalendar: function (dateString) {
    var forUtility = applicationManager.getFormatUtilManager();
    var configManager = applicationManager.getConfigurationManager();
    var scheduledDate = forUtility.getDateObjectFromCalendarString(
      dateString,
      configManager.getCalendarDateFormat()
    );
    scheduledDate = forUtility.getFormattedSelectedDate(scheduledDate);
    this.view.customCalendar.setSelectedDate(scheduledDate);
  },
  /**
   * performs the actions on continue onclick
   */
  continueAction: function () {
    //based on frequency selected sets the Obj and navigates

    this.sweepsModule.setSweepsAttribute(
      "startDate",
      this.view.customCalendar.getSelectedDate()
    );
    this.sweepsModule.commonFunctionForNavigation("frmSweepsEndDate");
  },
});
