/* eslint-disable */
define( function() {
  return {
    selectedItem:{},
    isParent:false,
    jsonPath :[],
    currentIndex:1,
    totaltargetWeight:0,
    chartSegData: [],
    updatedValue:{},
    updateCount:"",
    isComputed : false,

    onNavigate: function() {            
      this.view.postShow = this.postShow;     
      this.initActions();        
    },
    initActions: function() {
      this.view.btnRevert.onClick = this.revertPopup;
      this.view.btnCancel.onClick = this.closePopupRevert;
      this.view.btnOk.onClick = this.revertStrategy;
      this.view.btnReset.onClick = this.resetTargetValue;
      this.view.btnDone.onClick = this.navAcknowledgeForm;
      this.view.btnDone.setEnabled(false);
      this.view.btnDone.skin = "sknlblEAEBF1SSPSemiBold72727215px";
      this.view.btnCompute.setEnabled(false);
      this.view.btnCompute.skin = "sknlblEAEBF1SSPSemiBold72727215px";
      this.view.flxRevert.isVisible = false;
	  this.view.btnReset.setVisibility(false);
      this.view.flxContent.enableScrolling = true;
      this.view.flxMain.setEnabled(true);
      this.view.flxWarning.isVisible = false;
      this.view.imgCheckBox.src = "tickmarkbox.png"; //IW-3696 - Bharath
      this.view.flxCheckBox.setEnabled(false); //iw-3777 - Yash

	  this.toggleView('table',null);
      this.view.customHeader.flxBack.onClick =this.navBackToStrategyAllocation;
    },
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this.view.btnTableView.onClick = this.toggleView.bind(this,'table');
      this.view.btnGraphView.onClick = this.toggleView.bind(this,'graph');

    },



    postShow: function() {
if(applicationManager.getPresentationFormUtility().getDeviceName()==="iPhone"){
        this.view.flxHeader.setVisibility(false);
        this.view.flxContent.top = "0dp";
      }
      scope_WealthPresentationController.computedStrategyValue = {};
      var scope = this;
      this.view.btnTableView.onClick = this.toggleView.bind(this,'table');
      this.view.btnGraphView.onClick = this.toggleView.bind(this,'graph');
      this.view.imgCheckBox.onTouchEnd = this.setConfirmation;
      this.view.btnCompute.onClick = this.getComputeStrategy;

      try{
        let wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        let params;
        var portfolioId = wealthModule.portfolioId;
        params={
          "portfolioId":portfolioId,
          "portfolioServiceType":"Advisory"
        }
        wealthModule.getPersonalizedStrategy(params);
      }
      catch(err){
        kony.print(err)
      }


      this.jsonPath.push(
        {
          "selectedRowItems": [
            {
              ID: "1",
              Name: "Assets"
            }
          ]
        }
      );


    },
    
    // revert onclick 
    revertStrategy: function(){
      let wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        let params;
        var portfolioId = wealthModule.portfolioId;
        params={
          "portfolioId":portfolioId,
          "portfolioServiceType":"Advisory"
        }
      wealthModule.revertStrategy(params);
    },

    setResponse: function(response){

      if(response){
        if(response.personalizedStrategy){
          this.updateCount = response.updateCount;
			this.view.flxWarning.isVisible = false;

      this.getInitialSegmentData(response.personalizedStrategy);
      var scope=this;
      this.view.slider.setBtnValues = function(btnValues,selectedJson,totalTarget){
        scope.totaltargetWeight = totalTarget;
        scope.selectedItem = selectedJson;
        scope.parenttargetWeight=selectedJson.targetWeight;

        scope.view.breadCrumb.loadButtons(btnValues);
        scope.view.breadCrumb.sendBtn=function(btnObj,selectedBreadCrumb){

          var btn=btnObj;
          if(btnObj.id=="btn1"){
            scope.getInitialSegmentData(response.personalizedStrategy,100);
          }
          else{
            scope.getChildSegmentData(btnObj.info.key,response.personalizedStrategy);
          }
        };
        var id=scope.selectedItem.ID;
		
        scope.getChildSegmentData(id,response.personalizedStrategy);
      };
      this.view.slider.sendUpdatedTarget = function(newTarget){
       
        scope.view.btnReset.setVisibility(true);
        scope.view.btnCompute.setEnabled(true);
        scope.view.btnCompute.skin = "sknbtnBf293276Border1pxFontFFFFFF40PX";
        //scope.view.btnCompute.skin = "sknBtn0095e4RoundedffffffSSP26px";
        scope.updatedValue = newTarget;

        var charData = scope.getChartData(scope.chartSegData);

        scope.view.brwPersonalizeStrategyChart.onPageFinished = scope.drawpersonalizedStrategyChart(charData); 
      }
    }
  
}},
    onComputeError: function(errorObj) {
        this.view.flxWarning.isVisible = true;
        this.view.lblWarning.text = errorObj.dbpErrMsg?errorObj.dbpErrMsg:"Error occurred";    
    },

    getChartData: function(flatData){
      var chartData={};
      chartData.offSet = true;
//       if(parseInt(flatData['0'].level) === 3){
//         chartData.offSet = true;  
//       }
      var labelArray = [];
      var arrIndex=0;
      var seriesArray = [];
      seriesArray[0] = []; //Current Weight
      seriesArray[1] = []; //Strategy Weight
      var colArray =  ["#7E04C4","#3AB1D6"];

      for(var index=0; index<flatData.length; index++){
        //if(parseInt(flatData[index].level)===0){
        seriesArray[0][arrIndex] = flatData[index].recommendedWeight;
        seriesArray[1][arrIndex] = flatData[index].targetWeight;
        labelArray[arrIndex] = flatData[index].Name;
        arrIndex++;
        //}
      }
      chartData.labelArray = labelArray;
      chartData.seriesArray = seriesArray;
      chartData.colArray = colArray;
      chartData.strokewidth = true;
      return chartData;
    },




    getChildSegmentData:function(selectedItem,data){
      var targetWeight=this.totaltargetWeight !== 0 ? this.totaltargetWeight : this.selectedItem.targetWeight;
      //var targetWeight=this.totaltargetWeight !== 0 ? this.totaltargetWeight : this.selectedItem.strategyWeight;
      var segData=[];
      for(let i=0;i<data.length;i++){
        var childData = data.filter(e => e.parentId === data[i].ID);
        this.isParent = childData.length > 0 ? true : false;
        data[i].isParent = this.isParent;
        if(data[i].parentId == selectedItem){
          segData.push(data[i]);
        }
      }
      this.chartSegData = segData;
      var charData = this.getChartData(segData);
      this.view.brwPersonalizeStrategyChart.onPageFinished = this.drawpersonalizedStrategyChart(charData);
      this.view.slider.setContext(segData,targetWeight);
    },

    getInitialSegmentData:function(data){
      var segData=[];
      for(let i=0;i<data.length;i++){
        var childData = data.filter(e => e.parentId === data[i].ID);
        this.isParent = childData.length > 0 ? true : false;
        data[i].isParent = this.isParent;
        //Need to change the condition based on the service response
        if(data[i].level == "1"){
          segData.push(data[i]);
        }
      }
      this.chartSegData = segData;
      var charData = this.getChartData(segData);
      this.view.brwPersonalizeStrategyChart.onPageFinished = this.drawpersonalizedStrategyChart(charData);
      this.view.slider.setContext(segData,100);
    },


    toggleView: function(btnType, btn){

      if(btnType==='table'){
        this.view.brwPersonalizeStrategyChart.isVisible = false;
        this.view.flxColorTitleBar.isVisible = false;
        //this.view.flxTableContent.isVisible = true;
        this.view.flxSlider.isVisible = true;
        this.view.flxBreadCrumb.isVisible = true;
        this.view.flxFooter.isVisible = true;
        this.view.flxApply.isVisible = true;
        this.view.flxSeperatorThree.isVisible = true;
        this.view.flxSeperatorSecond.isVisible = true;

        this.view.btnTableView.skin='sknbtnBf293276Border1pxFontFFFFFF40PX';
        this.view.btnGraphView.skin='sknIWBtnBgFFFFFFBorder1px29327640px';

      } else if(btnType==='graph') {
        this.view.flxBreadCrumb.isVisible = true;
        this.view.brwPersonalizeStrategyChart.isVisible = true;
        this.view.flxColorTitleBar.isVisible = true;
        this.view.flxSlider.isVisible = false;
        this.view.flxFooter.isVisible = false;
        this.view.flxApply.isVisible = false;
        this.view.flxSeperatorThree.isVisible = false;
        this.view.flxSeperatorSecond.isVisible = true;
        this.view.btnTableView.skin='sknIWBtnBgFFFFFFBorder1px29327640px';
        this.view.btnGraphView.skin='sknbtnBf293276Border1pxFontFFFFFF40PX';
      }

    },

    drawpersonalizedStrategyChart: function(charData){

      this.view.brwPersonalizeStrategyChart.evaluateJavaScript("drawWealthAllocationChart(" + JSON.stringify(charData.labelArray)
                                                               + " ," 
                                                               + JSON.stringify(charData.seriesArray)
                                                               +" ,"	
                                                               + JSON.stringify(charData.colArray)
                                                               + " ," + JSON.stringify(charData.strokewidth) + " ,"
                                                               + JSON.stringify(charData.offSet) +");");


	//IW-3815 FIX START
      if(charData.offSet === true){
         if(charData.hasOwnProperty("seriesArray")){
            if(charData.seriesArray.length === 2){
               if(charData.seriesArray[0].length >=0){
                  var height = ((charData.seriesArray[0].length * 40) + 100);
                 this.view.brwPersonalizeStrategyChart.height = height + "dp";
                }
              else{
                   this.view.brwPersonalizeStrategyChart.height = "100%";
                 
               }
            }
          }
      }
      this.view.flxMain.forceLayout();
      this.view.flxContent.forceLayout();
    // FIX END
    },

    revertPopup: function(){
      this.view.flxRevert.isVisible = true;
      this.view.flxContent.enableScrolling = false;
      this.view.flxMain.setEnabled(false);
    },
    navBackToStrategyAllocation: function(){
      var navManager = applicationManager.getNavigationManager();
      navManager.navigateTo("frmStrategyAllocation"); 
	  scope_WealthPresentationController.computedStrategyValue = ""; //IW-3851 Bharath
    },

    setConfirmation: function(){
      if(this.view.imgCheckBox.src === "a.png") //IW-3696 - Bharath
      {
        this.view.imgCheckBox.src = "inactivecheckbox_2.png";//IW-3777 - Yash
        this.view.btnDone.setEnabled(false);
        this.view.btnDone.skin = "sknlblEAEBF1SSPSemiBold72727215px";
        //this.view.btnApply.skin = "sknBtnE2E9F0Rounded";
      }
      else if(this.view.imgCheckBox.src === "inactivecheckbox_2.png")//IW-3777 - Yash
      {
        this.view.imgCheckBox.src = "a.png";//IW-3696 - Bharath
        this.view.btnDone.setEnabled(true);
        this.view.btnDone.skin = "sknbtnBf293276Border1pxFontFFFFFF40PX";
        //this.view.btnApply.skin = "ICSknBtnF6F6F615px";
      }
    },

    getComputeStrategy: function(){
      
      try{
        let reqParam;
        let wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        var portfolioId = wealthModule.portfolioId;
        var scope = this;
        reqParam={
          "portfolioId": portfolioId,
          "ID": this.updatedValue.ID?this.updatedValue.ID:"",
          "Name": this.updatedValue.Name?this.updatedValue.Name:"",
          "targetWeight": this.updatedValue.targetWeight.toString(),
          "recommendedWeight": this.updatedValue.recommendedWeight.split('.')[0],
          "UpdateCount": this.updateCount?this.updateCount:"0",
          "portfolioServiceType":"Advisory",
          "marketSegmentId":this.updatedValue.marketSegmentId,
          "portfolioCode":scope_WealthPresentationController.contextId[portfolioId],
          "isCustomized" : this.updatedValue.isCustomized
          
        }
        this.isComputed = true;
        wealthModule.getcomputeStrategy(reqParam);
      }
      catch(err){
        kony.print(err)
      }
      this.view.breadCrumb.resetButton();
      this.view.btnCompute.setEnabled(false);
      this.view.btnCompute.skin = "sknlblEAEBF1SSPSemiBold72727215px";
      this.view.btnReset.setVisibility(false);

      this.view.imgCheckBox.src = "inactivecheckbox_2.png"; //iw-3777 - Yash
      this.view.flxCheckBox.setEnabled(true); //iw-3777 - Yash
    },

    closePopupRevert: function(){
      this.view.flxRevert.isVisible =false;
      this.view.flxContent.enableScrolling = true;
      this.view.flxMain.setEnabled(true);
    },

    resetTargetValue: function(){
     var preValue = JSON.parse(JSON.stringify(scope_WealthPresentationController.computedStrategyValue));
      if(Object.keys(preValue).length !== 0){
        this.setResponse(preValue);
      }
      else{
        this.getPersonalizedStrategy();
      }
	  this.view.btnCompute.setEnabled(false);
      this.view.btnCompute.skin = "sknlblEAEBF1SSPSemiBold72727215px";
      this.view.btnReset.setVisibility(false);
      this.view.breadCrumb.resetButton();
	this.view.flxWarning.isVisible = false;
    },
    
    getPersonalizedStrategy: function(){
      try{
        let wealthModule = applicationManager.getModulesPresentationController("WealthPortfolioUIModule");
        let params;
        var portfolioId = wealthModule.portfolioId;
        params={
          "portfolioId":portfolioId,
          "portfolioServiceType":"Advisory"
        }
        wealthModule.getPersonalizedStrategy(params);
      }
      catch(err){
        kony.print(err)
      }
      this.view.btnReset.setVisibility(false);
      this.view.breadCrumb.resetButton();
    },
    navAcknowledgeForm: function(){
      var navManager = applicationManager.getNavigationManager();
      new kony.mvc.Navigation({
        "appName": "PortfolioManagementMA",
        "friendlyName": "frmPersonalizeStrategyAck"
      }).navigate();
    },


  };
});
