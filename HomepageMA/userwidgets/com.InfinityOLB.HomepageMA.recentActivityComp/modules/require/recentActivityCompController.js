define(['./recentActivityDAO'],function(recentActivityDAO) {
	return {
		constructor: function(baseConfig, layoutConfig, pspConfig) {
			this._objService="";
			this._objName="";
			this._operation="";
			this.recentActivityDAO = new recentActivityDAO();
			this._cutomerId = "";
			this._perm = false;
			
			defineSetter(this, 'objService', function (val) {
				if (typeof val === 'string' && val !== '') {
                    this._objService = val;
				}
			});
			defineGetter(this, 'objService', function () {
				return this._objService;
			});
			
			defineSetter(this, 'objName', function (val) {
				if (typeof val === 'string' && val !== '') {
                    this._objName = val;
				}
			});
			defineGetter(this, 'objName', function () {
				return this._objName;
			});
			defineSetter(this, 'operation', function (val) {
				if (typeof val === 'string' && val !== '') {
                    this._operation = val;
				}
			});
			defineGetter(this, 'operation', function () {
				return this._operation;
			});
		},
          getCustomerId: function(params, perm){
			this._cutomerId = params;
            this._perm = perm;
        },
		makeDaoCallRecentActivity: function(){
            try{
              let serviceResponseIdentifier = "S1";
              let objectName = this._objName;
              let objectServiceName = this._objService;
              let operationName = this._operation;
              // #RemovedCustomerID - Removed customer ID as its taken care at the server level
              //let params = this._cutomerId;
              let params = {};
				this.recentActivityDAO.fetchDetails(objectServiceName,operationName,objectName,params,serviceResponseIdentifier,this.onServiceSuccess,this.onError);
            }
            catch(err)
            {
			var errorObj =
				{
                    "errorInfo" : "Error in making service call.",
                    "errorLevel" : "Business",
                    "error": err
				};
			self.onError(errorObj);
            }
		},
		onServiceSuccess: function(response){
			this.displayResults(response);
		},
		onError: function(errorObj){
			// error fetch
          this.view.setVisibility(false);
          this.recentActivityPostShow();
		},	
		preShow:function(){  
            var scope = this;
			if(this._perm === true) {
				scope.initActions();
			}
          this.view.lblHead.accessibilityConfig = {
            a11yARIA: {
              tabindex: -1,
            },
          }
          this.view.segActivity.accessibilityConfig = {
            a11yARIA: {
              tabindex: -1,
            },
          }
          this.view.lblNoActivity.accessibilityConfig = {
            a11yARIA: {
              tabindex: -1,
            },
          }
          this.view.lblLoadingData.accessibilityConfig = {
            a11yARIA: {
              tabindex: -1,
            },
          }
		},
		initActions: function(){
            var self = this;
            try
            {
			this.makeDaoCallRecentActivity();
            }
            catch(err)
            {
			var errorObj =
				{
                    "errorInfo" : "Error in setting the actions to columns.",
                    "errorLevel" : "Business",
                    "error": err
				};
			self.onError(errorObj);
            }
		},
      
        fitCharacterss: function(str){
          if(str === undefined || str === null) return "";
          else if(str.length <= 14){
            return str;
          }
          else{
            let new_string = str.slice(0,11) + "...";
            return new_string;
          }
        },
      
      
		displayResults: function(response){
                    var data = response.recentActivity;
                    var  activityData = [];
				if(data){
                    if(data.length === 0){
                      this.view.flxLoadingData.isVisible = false;
                      this.view.flxSeg.setVisibility(false);
                      this.view.btnViewAllActiv.setVisibility(false);
                      this.view.flxNoResults.setVisibility(true);
                    } else {
                      this.view.flxLoadingData.isVisible = false;
                      this.view.flxNoResults.setVisibility(false);
                      this.view.flxSeg.setVisibility(true);
               //       this.view.btnViewAllActiv.setVisibility(true);
					for (var list in data) {
                           var storeData;
								if(list < data.length - 1){
									if (data[list].orderType.toLowerCase() === 'buy') {
											storeData = {
												lblContinue: "You purchased " + data[list].quantity + " shares of " + this.fitCharacterss(data[list].description),
												lblTime: this.time_ago(data[list].tradeDate),
												template: "flxActivityContainer"
											};
										} else {
											storeData = {
												lblContinue: "You sold " + data[list].quantity + " shares of " + data[list].description,
												lblTime: this.time_ago(data[list].tradeDate),
												template: "flxActivityContainer"
											};
										}
									
								} else {
										if (data[list].orderType.toLowerCase() === 'buy') {
											storeData = {
												lblContinue: "You purchased " + data[list].quantity + " shares of " + this.fitCharacterss(data[list].description),
												lblTime: this.time_ago(data[list].tradeDate),
												template: "flxActivityContainerAlt"
											};
										} else {
											storeData = {
												lblContinue: "You sold " + data[list].quantity + " shares of " + data[list].description,
												lblTime: this.time_ago(data[list].tradeDate),
												template: "flxActivityContainerAlt"
											};
										}
								}
								activityData.push(storeData);
					}
                       this.view.segActivity.widgetDataMap = {
                        lblContinue : "lblContinue",
                        lblTime: "lblTime"
					};
                       this.view.segActivity.removeAll();
                       this.view.segActivity.setData(activityData);
                    } 
					
				} else {
                    this.view.flxLoadingData.isVisible = false;
					this.view.flxSeg.setVisibility(false);
                    this.view.btnViewAllActiv.setVisibility(false);
                    this.view.flxNoResults.setVisibility(true);
                    this.view.setVisibility(false);
                    this.recentActivityPostShow();
				}	
		},
          /**
      Help functions for time conversion

      */     
    time_ago: function(time) {
        if (this.isBeforeToday(time) === true) {
          var forUtility = applicationManager.getFormatUtilManager();
          var tradeDateObj = forUtility.getDateObjectfromString(time);
          var formattedTradeDate = forUtility.getFormatedDateString(tradeDateObj, forUtility.getApplicationDateFormat());
          return formattedTradeDate;
        }
        switch (typeof time) {
          case 'number':
            break;
          case 'string':
            time = +new Date(time);
            break;
          case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
          default:
            time = +new Date();
        }
        var time_formats = [
          [60, 'seconds', 1], // 60
          [120, '1 minute ago', '1 minute from now'], // 60*2
          [3600, 'minutes', 60], // 60*60, 60
          [7200, '1 hour ago', '1 hour from now'], // 60*60*2
          [86400, 'hours', 3600]
        ];
        var seconds = (+new Date() - time) / 1000,
            token = 'ago',
            list_choice = 1;

        if (seconds === 0) {
          return 'Just now';
        }
        if (seconds < 0) {
          seconds = Math.abs(seconds);
          token = 'from now';
          list_choice = 2;
        }

        var i = 0,
            format;
        while (format = time_formats[i++])
          if (seconds < format[0]) {
            if (typeof format[2] === 'string')
              return format[list_choice];
            else
              return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
          }
        return time;
      },
      isBeforeToday: function(date) {
        var timestamp = new Date().getTime() - (1 * 24 * 60 * 60 * 1000);
        var otherDate = new Date(date).getTime();
        if (otherDate < timestamp)
          return true;
        else
          return false;
      }
	};
});