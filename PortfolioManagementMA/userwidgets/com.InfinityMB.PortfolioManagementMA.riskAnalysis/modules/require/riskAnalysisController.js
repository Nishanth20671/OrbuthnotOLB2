/* eslint-disable */
define(['./PortfolioRiskAnalysisBusinessController'],function(PortfolioRiskAnalysisBusinessController) {



  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      flag: false;
      this.businessController = new PortfolioRiskAnalysisBusinessController();
      this.context = {};

    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      defineGetter(this, 'serviceCall', () => {
        return this._serviceCall;
      });
      defineSetter(this, 'serviceCall', value => {
        this._serviceCall = value;
      });
    },

    setContext: function (context) {
      var scope = this;
      this.view.flxRiskContent.setVisibility(true);
      this.view.flxMain.height = "558dp";
      this.view.imgToggleArrow.src = "arrowup.png";
      try {
        this.context = context;
        this.businessController.fetchDetails(this._serviceCall.ServiceName,this._serviceCall.OperationName,this._serviceCall.ObjectName,this.context,this.onServiceSuccess,this.onError);
      } catch (err) {
        scope.setError(err, "setContext");
      }
    },

    onServiceSuccess: function(response) {
      try{
      var riskData = response.riskAnalysis[0];
      this.drawDataChartMB(riskData);
      if(Number(riskData.riskPortMeasureP) < Number(riskData.riskStratMeasureP)){
        this.view.lblRiskMessage.text=kony.i18n.getLocalizedString("i18n.wealth.lowerRiskLevel");

      }
      else if(Number(riskData.riskPortMeasureP) > Number(riskData.riskStratMeasureP)){
        this.view.lblRiskMessage.text=kony.i18n.getLocalizedString("i18n.wealth.higherRiskLevel");
      }
      else{
        this.view.lblRiskMessage.text=kony.i18n.getLocalizedString("i18n.wealth.balancedRiskLevel");     


      }

      if(riskData.riskStatus==="1"){
        this.view.imgIssueImage.src = "warning.png";
        this.view.lblIssueMessage.text=kony.i18n.getLocalizedString("i18n.wealth.issuesInPortfolio");
      }

      this.view.flxToggle.onTouchEnd = this.onToggle;
      } catch(err) {
        this.setError(err, "onServiceSuccess");
      } 

    },

    setError: function (errorMsg, method) {
      let errorObj = {
        "level": "ComponentViewController",
        "method": method,
        "error": errorMsg
      };
      this.onError(errorObj);
    },

    onError: function(err) {
      kony.print(JSON.stringify(err));
    },

    
    drawDataChartMB: function(response){
      this.view.brwChart.onPageFinished = this.drawRiskAnalysisChart(response);  
     
    },
    drawRiskAnalysisChart: function(response){
      try{
      seriesArray=[];
      seriesArray.push(response.riskPortMeasureP,response.riskStratMeasureP);
      riskObjective=Number(response.riskObjectiveP);
      lblArray=['Portfolio', 'Investment Profile'];
      ticksCount = Math.round(Math.max(response.riskPortMeasureP,response.riskStratMeasureP,response.riskObjectiveP,response.riskToleranceMaxP));
      
      var greyArea = [parseFloat(response.riskToleranceMinP), parseFloat(response.riskToleranceMaxP)];
      this.view.brwChart.evaluateJavaScript("drawRiskChart("+JSON.stringify(seriesArray)+","+JSON.stringify(riskObjective)+","+JSON.stringify(lblArray)+","+JSON.stringify(ticksCount)+","+JSON.stringify(greyArea)+" );");
} catch(err) {
        this.setError(err, "drawRiskAnalysisChart");
      }
    },



    onToggle: function(){
      try{
      if(this.flag){
        this.view.flxRiskContent.setVisibility(true);
        this.view.imgToggleArrow.src = "arrowup.png";
        this.view.flxMain.height = "558dp";
        this.flag = false;
      }
      else{
        this.view.flxRiskContent.setVisibility(false);
        this.view.imgToggleArrow.src = "arrowdown.png";
        this.view.flxMain.height = "82dp";
        this.flag = true;
      }
        } catch(err) {
        this.setError(err, "onToggle");
      }
    },
    /**
	* @api : setError
	* triggered as a error call back for any service
    * @arg1: errorMsg {String} - error message
    * @arg2: method {String} - method from which error message is received
	* @return : NA
	*/
    setError: function(errorMsg, method) {
      var scope = this;
      var errorObj = {
        "level" : "ComponentController",
        "method" : method,
        "error": errorMsg
      };
	
	scope.onErrorMain(errorObj);
    },
    onErrorMain:function(err){
      kony.print(JSON.stringify(err));
    }


  };
});