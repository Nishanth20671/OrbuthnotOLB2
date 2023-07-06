/* eslint-disable */
define(['./AllocationCheckDAO'],function(AllocationCheckDAO) {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this.businessController = new AllocationCheckDAO();
      this.context = {};
      this.view.postShow = this.postShow;
      this.assetAllocHealth = "1";
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

    setContext: function(context,isHealthCheck,riskAnalysisFlexChange) {
      this.context = context;
      this.riskAnalysisFlexChange = riskAnalysisFlexChange;
      if(isHealthCheck){
      this.businessController.fetchDetails(
        this._serviceParam.ServiceName,
        this._serviceParam.OperationName,
        this._serviceParam.ObjectName,
        this.context,
        this.onServiceSuccess,
        this.onError
      );
      }else{
         this.businessController.fetchDetails(
        this._serviceParam.ServiceName,
        "getHealthIfOrderAccepted",
        "InvestmentProposals",
        this.context,
        this.onServiceSuccess,
        this.onError
      );
      }
    },

    postShow: function() {
    },

    onServiceSuccess: function(response) {
      var data = response.Assets;
      for(var i=0;i<data.length;i++){
        data[i].item = i;
        data[i].level = parseInt(data[i].level);
      }
      var filteredData = data.filter(e=>!((e.currentWeight=="0" && e.strategyWeight == "0") || (e.currentWeight=="0" && e.strategyWeight == "0.0")|| (e.currentWeight=="0.0" && e.strategyWeight == "0.0") || (e.currentWeight=="0.0" && e.strategyWeight == "0")));
      this.setIntialSegment(filteredData);


      var chartData = this.getChartData(filteredData);
      var requiredHeight = (chartData.seriesArray[0].length * 110)+50;
      if (kony.application.getCurrentBreakpoint() > 1024) {
        if(kony.application.getCurrentForm().id === "frmInvestmentProposal"){
        this.view.AllocationGraph.setLegendHeight(chartData.seriesArray[0].length*37);
       this.riskAnalysisFlexChange(requiredHeight, chartData);
        if (chartData.seriesArray[0].length > 3) {
          this.view.AllocationGraph.setLegendHeight((chartData.seriesArray[0].length*37)+(chartData.seriesArray[0].length - 3)*26);
        this.riskAnalysisFlexChange(requiredHeight,chartData);
        } else if(chartData.seriesArray[0].length !== 3){
          this.view.AllocationGraph.setLegendHeight(0);
          this.riskAnalysisFlexChange(requiredHeight,chartData);
        }
      }else{
        this.view.AllocationGraph.setLegendHeight(chartData.seriesArray[0].length*37);
        if (chartData.seriesArray[0].length > 3) {
          this.view.AllocationGraph.setLegendHeight((chartData.seriesArray[0].length*37)+(chartData.seriesArray[0].length - 3)*26);
        } else if(chartData.seriesArray[0].length !== 3){
          this.view.AllocationGraph.setLegendHeight(0);
        }
      }} 
      else {       
        this.view.flxGraph.height = (requiredHeight) + "px";
        this.view.AllocationGraph.setLegendHeight(chartData.seriesArray[0].length*37);

        if (chartData.seriesArray[0].length > 3) {
          var height = 380+(chartData.seriesArray[0].length - 3)*70;
          this.view.flxGraph.height = (height) + "px";
          this.view.AllocationGraph.setLegendHeight((chartData.seriesArray[0].length*37)+(chartData.seriesArray[0].length - 3)*26);
        } else if(chartData.seriesArray[0].length !== 3){
          this.view.AllocationGraph.setLegendHeight(0);
          this.view.flxGraph.height = "270px";
        }
      }
      this.view.AllocationGraph.setData(chartData);
      this.view.AllocationGraph.checkVisibility(true);

      if(this.assetAllocHealth==="1"){
        this.view.imgHealthStatus.src = 'success_icon.png';
        this.view.lblHealthMsg.text=kony.i18n.getLocalizedString("i18n.wealth.noIssues");
      } else {
        this.view.imgHealthStatus.src = 'alert.png';
        this.view.lblHealthMsg.text=kony.i18n.getLocalizedString("i18n.wealth.healthMsg");
      }

      if(kony.application.getCurrentForm().id === "frmInvestmentProposal"){
        if(kony.application.getCurrentBreakpoint()> 1024)
        {
          this.view.lblCompHeader.text = kony.i18n.getLocalizedString("i18n.wealth.portfolioHealthIfOrderAccepted");
          this.view.flxCompHeader.left = "30dp";
          this.view.flxSeperator.setVisibility(false);
          this.view.flxHealthStatus.setVisibility(false);
          this.view.flxContent.top = "30dp";
          this.view.lblCompHeader.skin = 'sknlbl424242SSPReg17px';
        }
        else
        {
          this.view.lblCompHeader.text = kony.i18n.getLocalizedString("i18n.wealth.portfolioHealthIfOrderAccepted");
          this.view.flxCompHeader.top = "10dp";
          this.view.flxSeperator.setVisibility(false);
          this.view.flxHealthStatus.setVisibility(false);
          this.view.flxContent.top = "30Dp";
          this.view.lblCompHeader.skin = 'sknlbl424242SSPReg17px';
        }
      }
      else{
        if(kony.application.getCurrentBreakpoint()> 1024)
        {
          this.view.lblCompHeader.text = kony.i18n.getLocalizedString("i18n.wealth.assetAllocation");
          this.view.flxCompHeader.left = "26dp";
        }
        else
        {
          this.view.lblCompHeader.text = kony.i18n.getLocalizedString("i18n.wealth.assetAllocation");
        }
      }
    },

    setIntialSegment : function(data){
      var initialData = [];
      this.assetAllocHealth = "1";
      for(var i=0; i<data.length; i++){
        // kony.print(data[i].level)
        if(data[i].level=== 1){
          var image="";
          var imageArrow="";
          for(var j=0;j<data.length;j++){
            if(data[j].healthStatus==="0"){
              image = "success_icon.png";
              //IW-3836 - Parthiban
             // this.assetAllocHealth = "1"
            } else {
              image = "alert.png";
              //IW_3836 - Parthiban
              this.assetAllocHealth = "0"
            }

            // if(data[i+1] && data[i+1].level === data[i].level+1){
            if (data[j] && data[j].level === data[i].level + 1 && (parseInt(data[i].ID)) === (parseInt(data[j].parentId))) {
              imgArrow = "right_arrow.png"
              break;
            } else {
              imgArrow = "";
            }
          }

          var assetNameWithTooltip = {
            "toolTip": data[i].Name,
            "text": data[i].Name
          };
          if (data[i].Name.length > 25) {
            assetNameWithTooltip = {
              "toolTip": data[i].Name,
              "text": data[i].Name.substr(0, 24) + '...'
            };
          }
          
          var storeData = {
            assetName: assetNameWithTooltip,
            CurrentWeight: data[i].currentWeight+"%",
            StrategyWeight: data[i].strategyWeight+"%",
            item: data[i].item,
            level: data[i].level,
            imgHealth: ("0" === data[i].healthStatus)?"success_icon.png" :"alert.png",
            imgArrow : imgArrow,
            isExpanded: false,
            ID: data[i].ID,
            parentId: data[i].parentId

          };

          initialData.push(storeData);

        }
      } // end of for loop
      this.view.sampledrilldown.setData(data,initialData);
	  
      this.view.sampledrilldown.sendData = function(selectedIndex, segData, isDelete,data){

        var newArr=[...segData]
		
        var rowData = segData[selectedIndex];
        var data = this.data;


        //Remove background skins
        for(var index=0; index< newArr.length; index++){ 
          newArr[index].flxAllocation={};
        }

        //Toggle arrow mark
        if(newArr[selectedIndex].imgArrow==="right_arrow.png"){
          newArr[selectedIndex].imgArrow="arrow_down.png";
        } else if(newArr[selectedIndex].imgArrow==="arrow_down.png"){
          newArr[selectedIndex].imgArrow="right_arrow.png"
        }

        //set background skin for selected row
        newArr[selectedIndex].flxAllocation = {skin: "sknFlxf5f5f5BottomBorder"};

        //Toggle expanded row
        newArr[selectedIndex].isExpanded = !newArr[selectedIndex].isExpanded;

       if(newArr[selectedIndex].imgArrow === ""){
          newArr[selectedIndex].isExpanded = false;
        }

        //(!isDelete) is Adding rows
        if(!isDelete){
		
            for (var i = 0; i < newArr.length; i++) {


            if (selectedIndex !== i && rowData.level < newArr[i].level) {

              if(newArr[i].parentId === newArr[i-1].ID){
                newArr[i-1].isExpanded = false;
                newArr[i-1].imgArrow = "right_arrow.png"
              }

              newArr.splice(i, 1);
              if(i<selectedIndex)
                selectedIndex--;
              i--;
            }

          }

          var insertIndex = selectedIndex + 1;
          
          for(var i=0 ; i<data.length; i++){
            // if(rowData.level+1 === data[i].level){
            if (rowData.level + 1 === data[i].level && (parseInt(rowData.ID)) === (parseInt(data[i].parentId))) {
              var image="";
              if(data[i].healthStatus==="0"){
                image =  "success_icon.png"
              } else {
                image = "alert.png"
              }

              var assetNameWithTooltip = {"toolTip" : data[i].Name,
                          "text" : data[i].Name};
              if(data[i].Name.length > 25){
                assetNameWithTooltip = {"toolTip" : data[i].Name,
                        "text" : data[i].Name.substr(0, 24) + '...'};
              }
              for(var j=0;j< data.length;j++){
                //  if(data[i+1] && data[i+1].level === data[i].level+1) {
                if (data[j] && data[i].level+1 === data[j].level && (parseInt(data[i].ID)) === (parseInt(data[j].parentId))) {
                  imgArrow = "right_arrow.png"
                  break;
                } else {
                  imgArrow = ""
                }
              }


              var storeData = {
                assetName: assetNameWithTooltip,
                CurrentWeight: data[i].currentWeight+"%",
                StrategyWeight: data[i].strategyWeight+"%",
                item: data[i].item,
                level: data[i].level,
                imgHealth: image,
                imgArrow : imgArrow,
                isExpanded: false,
                ID: data[i].ID,
                parentId: data[i].parentId

              };

			  
              newArr.splice(insertIndex++, 0, storeData);

            } 
            else if ( rowData.level === data[i].level )
            {
              continue;
            }
          }
        } else {
          var j=selectedIndex+1;
          while(j<data.length && j<newArr.length){
            if(rowData.level < newArr[j].level){
              newArr.splice(j, 1);
            } else {
              break;
            }
          }
          
        }
        
        for(var index=0; index< newArr.length; index++){
          if(newArr[index+1] && newArr[index+1].level === newArr[index].level+1) {
            newArr[index].imgArrow = "arrow_down.png"
          }
          var leftSize = ((newArr[index].level+1)*2) + "%";
          newArr[index].flxAssetName = { left: leftSize };

        }
        return newArr;
      }
    },


    getChartData: function(flatData){
      var chartData={};
      var labelArray = [];
      var arrIndex=0;
      var seriesArray = [];
      seriesArray[0] = []; //Current Weight
      seriesArray[1] = []; //Strategy Weight

      const colArray = ["#3AB1D6","#7E04C4","#E8705B","#BF04C4","#3E75A6", "#2C82BE", "#24BFEC", "#76DDFB", "#C7CCD5", "#3E75A6", "#2C82BE", "#24BFEC"];
    
      for(var index=0; index<flatData.length; index++){
        if(flatData[index].level=== 1){
          seriesArray[0][arrIndex] = flatData[index].currentWeight;
          seriesArray[1][arrIndex] = flatData[index].strategyWeight;
          labelArray[arrIndex] = flatData[index].Name;
          arrIndex++;
        }
      }

      chartData.labelArray = labelArray;
      chartData.seriesArray = seriesArray;
      chartData.colArray = colArray;
      chartData.offSetVal = false;
      return chartData;
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
    },
  };
});