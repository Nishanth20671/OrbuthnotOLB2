define(['./RiskAnalysisGraphDAO'],function(RiskAnalysisGraphDAO) {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this.businessController = new RiskAnalysisGraphDAO();
      this.context = {};
      this.view.postShow = this.postShow;


      this._data = {};
      var WealthRiskAnalysisGraph = new kony.ui.CustomWidget({
        "id": "WealthRiskAnalysisGraph",
        "isVisible": true,
        "width": "100%",
        "height": "100%",
      }, {
        "padding": [0, 0, 0, 0],
        "paddingInPixel": false
      }, {
        "widgetName": "WealthRiskAnalysisGraph",
        "chartData": this._data,
        "OnClickOfPie": function() {}
      });

      this.view.flxRiskGraph.add(WealthRiskAnalysisGraph);
    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {
      defineGetter(this, 'serviceParam', () => {
        return this._serviceParam;
      });
      defineSetter(this, 'serviceParam', value => {
        this._serviceParam = value;
      });
    },
    setContext: function(context) {
      this.context = context;
      this.businessController.fetchDetails(
        this._serviceParam.ServiceName,
        this._serviceParam.OperationName,
        this._serviceParam.ObjectName,
        this.context,
        this.onServiceSuccess,
        this.onError
      );
    },

    postShow: function() {
    },

    onServiceSuccess: function(response) {

      if(response){
        this.view.flxRiskGraph.WealthRiskAnalysisGraph.chartData = response;  
        var riskAnalysisData = response.riskAnalysis;
        if(riskAnalysisData && riskAnalysisData[0])
        {
          if(riskAnalysisData[0].riskStatus==='0'){
            this.view.imgHealthStatus.src='success_icon.png';
            this.view.lblHealthMsg.text = 'No issues';
          } else {
            this.view.imgHealthStatus.src='Alert.png';
            this.view.lblHealthMsg.text = 'Some issue with your portfolio health';
          }
          
          var msg="";
          var portfolioRisk = parseFloat(riskAnalysisData[0].riskPortMeasureP);
          var investRisk = parseFloat(riskAnalysisData[0].riskStratMeasureP);
          if(portfolioRisk<investRisk){
            msg='Your Portfolio has a lower risk level than your objective Investment Strategy.'; 
          } else if(portfolioRisk<investRisk){
            msg='Your portfolio has a higher risk level than your objective Investment Strategy.';
          } else {
            msg='Your portfolio has a balanced risk level with your objective Investment Strategy.';
          }
          this.view.lblHealthDetailedMsg.text = msg; 
        }
      } else {
        this.view.isVisible = false;
      }

      if(kony.application.getCurrentForm().id === "frmInvestmentProposal"){
        if(kony.application.getCurrentBreakpoint()> 1024)
        {
          this.view.flxCompHeader.left = "30dp";
          this.view.flxSeperator.left = "30dp";
          this.view.flxHealthStatus.left = "31dp";
          this.view.flxMainContent.left = "31dp";
          this.view.flxDisclaimer.left = "31dp";
        }
      }
      else
      {
        if(kony.application.getCurrentBreakpoint()> 1024)
        {
          this.view.flxCompHeader.left = "26dp";
          this.view.flxSeperator.left = "26dp";
          this.view.flxHealthStatus.left = "30dp";
          this.view.flxMainContent.left = "30dp";
          this.view.flxDisclaimer.left = "30dp";
        }
      }


    },

    /**
    * @api: setError
    * Gets trigerred when any exception occurs in any method in view controller
    * @arg1: errorMsg {String} - error message
    * @arg2: method {String} - method from which error message is received
    * @return: NA
    **/
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
    }
  };
});