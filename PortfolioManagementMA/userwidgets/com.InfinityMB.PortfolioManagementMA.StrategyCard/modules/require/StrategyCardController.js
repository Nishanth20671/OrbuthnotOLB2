define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this.arrname = [];
      this.view.flxButton.onTouchEnd = this.selectedCard;
    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {

    },

    setData: function(cardNumber,segData, graphData, strategyName, onClickMethod) {
      var widgetMap = {
        "lblName": "assetName",
        "lblPercent": "weight",
        "flxLegend": "background"
      };
      this.view.segLegends.widgetDataMap = widgetMap;
      this.view.segLegends.setData(segData);
      this.clickStrategy = onClickMethod;

      if(cardNumber === 0){
        this.view.lblHeader2.text = "Recommended";
        this.view.lblWarning.text = "Based on the answers provided to your risk assessment, we recommend the Investment Strategy"
        this.view.imgWarning.setVisibility(false);
        this.view.lblWarning.left = "20dp";
      }

      this.view.forceLayout();
      if(strategyName==="Active"){
        this.view.imgDynamic.src = "active_one.png";
      }
      else{
        this.view.imgDynamic.src = strategyName.toLowerCase()+".png";
      }

      this.view.lblHeader1.text = strategyName;
      this.arrname.push(this.view.lblHeader1.text);
      kony.timer.schedule("timer"+cardNumber,this.drawWealthStrategyChart.bind(this, graphData), 1, false);
    },

    updateSkins : function()
    {
	  this.view.lblButton.text = "Selected Strategy";
      this.view.flxCard.skin = "sknFBox04a615rad10px";
      this.view.flxButton.skin = "sknFBox04a615rad15px";
      this.view.imgButton.src = "selectedtick.png";
      this.view.imgButton.width = "24dp";
      this.view.imgButton.height = "24dp";
      this.view.imgButton.right = "16dp";
    },

    updateSkinsNull: function(){
	  this.view.lblButton.text = "Select Strategy";
      this.view.flxCard.skin = "sknFlxe3e3e3rad10px";
      this.view.flxButton.skin = "sknFlxa0a0a0rad15px";
      this.view.imgButton.src = "radiobuttoninactive_big.png";
      this.view.imgButton.width = "36dp";
      this.view.imgButton.height = "36dp";
      this.view.imgButton.right = "7dp";
    },

    selectedCard : function ()
    {
      var clickedname = this.arrname[0];            
      this.clickStrategy(clickedname);
    },


    drawWealthStrategyChart: function(graphData){

      this.view.brwChart.evaluateJavaScript("drawStrategyDonutChart("+JSON.stringify(graphData)+");");	         

    },

  };
});