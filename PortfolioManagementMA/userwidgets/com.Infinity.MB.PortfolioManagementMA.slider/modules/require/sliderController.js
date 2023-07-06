/* eslint-disable */

define(function() {
  return {
    jsonPath: [],
    breadCrumbData: [],
    prop: [],
    flxrow1: 0,
    flxrow2: 0,
    rowData: {},
    counter: 0,
    prevValue: 0,
    currentSelectedTarget: 0,
    targetDiff: 0,
    totalTarget:0,
    selectedRowIndex: 0,
    


    constructor: function(baseConfig, layoutConfig, pspConfig) {
      //this.businessController = new sliderDAO();
      this.context = {};
    },


    initGettersSetters: function() {
      defineGetter(this, 'serviceParam', () => {
        return this._serviceParam;
      });
      defineSetter(this, 'serviceParam', value => {
        this._serviceParam = value;
      });
      defineGetter(this, 'configParam', () => {
        return this._configParam;
      });
      defineSetter(this, 'configParam', value => {
        this._configParam = value;
      });
    },


    setContext: function(response, totalTarget) {

      var scope = this;
      var segData = [];
      scope.prop = [];
      var storeData;
      var totalRecommendedWeight = 0;
      var totalTargetWeight = 0;
      this.counter = 0;
      this.rowData = response;
      this.setTotalValue(response);
      this.totalTarget = totalTarget; // the target which we need to achieve
      for (var k = 0; k < response.length; k++) {
        if (!response[k].isVisited) {
          this.counter++;
        }
        totalRecommendedWeight = totalRecommendedWeight + parseFloat(response[k].recommendedWeight);
        totalTargetWeight = totalTargetWeight + parseFloat(response[k].targetWeight);
        storeData = {
          isVisitedProp : response[k].isVisited,

          slideNo : "slide"+k,
          assetName: {
            text: response[k].Name,
            skin: response[k].isParent?"sknlbl003e75SSPR15px":"sknlbl424242SSPR40px",
            
//             onClick: function (eventobject, context, k) {
//               this.onbutton(eventobject, context, k);
//             }.bind(this),
          },
		  //IW-3989 Start Bharath
          weight: parseFloat(response[k].targetWeight).toFixed(2) + "%",
          rec: parseFloat(response[k].recommendedWeight).toFixed(2) + "%",
			//IW-3989 end Bharath
          //weight: response[k].strategyWeight + "%",
          //rec: response[k].strategyWeight + "%",

          slide: {
            selectedValue: parseInt(response[k].targetWeight),
            onSelection: function (event, context, k) {
              this.onSlideCallBack(event, context, k);
            }.bind(this),
          },
          button: {
            onClick: function (eventobject, context) {
              this.onbutton(eventobject, context);
            }.bind(this),
          },
          flx1: {
            onClick: function (event, context) {
              this.onflex1(event, context);
            }.bind(this),
          },
          flx2: {
            onClick: function (event, context) {
              this.onflex2(event, context);
            }.bind(this),
          },
          flx:
            response[k].isParent ?
          {
            "onClick": function(eventobject, context) {     
              this.onbutton(eventobject, context);                        
            }.bind(this)
          } : {}
        };
        segData.push(storeData);
        scope.prop.push(storeData);
        this.view.lblRecTotalValue.text = Math.round(totalRecommendedWeight) + ".00%";
        //this.view.lblTotalTarget.text = Math.round(totalTargetWeight) + ".00%"; //iw-3687 - Yash
        //IW-3687
        if (totalTargetWeight >= 99.91 && totalTargetWeight <= 100.09) {
                    this.view.lblTotalTarget.text = "100.00%";    
                }else{
                this.view.lblTotalTarget.text = (totalTargetWeight).toFixed(2) + "%";
                }
      }
      this.view.segSlider.widgetDataMap = {
        lblHead: "assetName",
        flxDummy:"flx",
        lblRecValue: "rec",
        lblTargetValue: "weight",
        sliderincdec: "slide",
        flxMinus: "flx1",
        flxPlus: "flx2",
      };
      this.view.segSlider.removeAll();
      this.view.segSlider.setData(segData);
    },

    onbutton: function (event, context, k) {
//       var c = k;
//       var value = this.view.segSlider.data[c];
//       //var row = context.rowIndex;
//       //console.log(this.view.segSlider.selectedRowIndex[1]);
//       //var rowIndex = selectedRowIndex;
//       //var rowIndex = this.view.segSlider.selectedRowIndex[1];
      var rowIndex = context.rowIndex;
      var selectedRowData = this.rowData[rowIndex];
      this.breadCrumbData.length = 0;
      this.totalTarget = this.prop[rowIndex].weight.substring(0, this.prop[rowIndex].weight.length - 1);
      this.breadCrumbData.push(selectedRowData, selectedRowData.Name);
      this.setBtnValues(this.breadCrumbData, selectedRowData,this.totalTarget);

    },
    onSlideCallBack: function (event, context) {
      //      var rowindex = context.rowIndex;
	if (applicationManager.getPresentationFormUtility().getDeviceName() !== "iPhone") {
      var rowindex = this.view.segSlider.selectedRowIndex?this.view.segSlider.selectedRowIndex[1]:"";
    } else {
//       var rowindex = context.rowIndex?context.rowIndex:"";
      var rowindex = context.rowIndex; //iw-3785
    }
      if(rowindex !== ""){
      
      var selectedRowData = this.rowData[rowindex];
      selectedRowData.targetWeight = event.selectedValue;
      //var rowindex = context.rowIndex;
      this.prop[rowindex] = Object.assign(this.prop[rowindex], {
        weight: event.selectedValue + ".00%",
        slide: {
          selectedValue: parseInt(event.selectedValue),
          onSelection: function (event, context) {
            this.onSlideCallBack(event, context);
          }.bind(this),
        },
      });

      this.view.segSlider.removeAll();
      this.view.segSlider.setData(this.prop);
      this.setTotalValue(this.prop);
      this.sendUpdatedTarget(selectedRowData);
	  }
    },

    onflex1: function (event, context) {
      //var rowNumber = this.view.segSlider.selectedRowIndex[1];
      var rowNumber = context.rowIndex;
      var scope = this;
      scope.flxrow1 = rowNumber;
      var newweight1 = 
          parseFloat(scope.prop[scope.flxrow1].weight.split("%")[0]) - 1;
      if(newweight1<0){
         newweight1 = 0;
       }else if(newweight1 > 100){
         newweight1 = 100;
       }
      var selectedRowData = this.rowData[rowNumber];
      selectedRowData.targetWeight = newweight1;
      scope.prop[scope.flxrow1] = Object.assign(scope.prop[scope.flxrow1], {
        weight: newweight1.toFixed(2) + "%",
      });
      scope.prop[scope.flxrow1] = Object.assign(scope.prop[scope.flxrow1], {
        slide: {
          selectedValue: newweight1,
          onSelection: function (event, context) {
            scope.onSlideCallBack(event, context);
          }.bind(scope),
        },
      });
      scope.view.segSlider.removeAll();
      scope.view.segSlider.setData(scope.prop);
      scope.setTotalValue(scope.prop);
      scope.sendUpdatedTarget(selectedRowData);
      //}
    },
    onflex2: function (event, context) {
//       var navManager = applicationManager.getNavigationManager();
//       flagReset = true;
//       navManager.setCustomInfo('segDet', flagReset);

      //var rowNumber = this.view.segSlider.selectedRowIndex[1];
      var rowNumber = context.rowIndex;
      var scope = this;
      scope.flxrow2 = rowNumber;
      var newweight2 =
          parseFloat(scope.prop[scope.flxrow2].weight.split("%")[0]) + 1;
      if(newweight2<0){
         newweight2 = 0;
       }else if(newweight2 > 100){
         newweight2 = 100;
       }
      var selectedRowData = this.rowData[rowNumber];
      selectedRowData.targetWeight = newweight2;
      scope.prop[scope.flxrow2] = Object.assign(scope.prop[scope.flxrow2], {
        weight: newweight2.toFixed(2) + "%",
      });
      scope.prop[scope.flxrow2] = Object.assign(scope.prop[scope.flxrow2], {
        slide: {
          selectedValue: newweight2,
          onSelection: function (event, context) {
            scope.onSlideCallBack(event, context);
          }.bind(scope),
        },
      });
      scope.view.segSlider.removeAll();
      scope.view.segSlider.setData(scope.prop);
      scope.setTotalValue(scope.prop);
      scope.sendUpdatedTarget(selectedRowData);
    },

    setTotalValue: function(data){
      var totalTargetWeight = 0;
      var totalRecommendedWeight = 0;
      for (var k = 0; k < data.length; k++) {
		  //IW-3989 Start Bharath
		  if(data[k].rec === "0.00%"){
          totalRecommendedWeight =data[k].rec ==="0%" ? totalRecommendedWeight + 0 : totalRecommendedWeight + (parseFloat(data[k].rec));
        }else{
        totalRecommendedWeight =data[k].rec ==="0%" ? totalRecommendedWeight + 0 : totalRecommendedWeight + (parseFloat(data[k].rec) ? parseFloat(data[k].rec) : parseFloat(data[k].recommendedWeight));
        }
		  //IW-3989 end Bharath
    
        if(data[k].weight === "0.00%"){
        totalTargetWeight = data[k].weight === "0%" ? totalRecommendedWeight + 0  : totalTargetWeight + (parseFloat(data[k].weight));  
        }
        else{
        totalTargetWeight = data[k].weight === "0%" ? totalRecommendedWeight + 0 : totalTargetWeight + (parseFloat(data[k].weight) ? parseFloat(data[k].weight) : parseFloat(data[k].targetWeight));
      }
      }
      this.view.lblRecTotalValue.text = Math.round(totalRecommendedWeight) + ".00%";
      //this.view.lblTotalTarget.text = Math.round(totalTargetWeight) + ".00%";
      //IW-3687
      if (totalTargetWeight >= 99.91 && totalTargetWeight <= 100.09) {
                    this.view.lblTotalTarget.text = "100.00%";    
                }else{
                this.view.lblTotalTarget.text = (totalTargetWeight).toFixed(2) + "%";
                }
      

    },





  };
});
