/* eslint-disable */
define(function() {

  return {

    constructor: function(baseConfig, layoutConfig, pspConfig) {

    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {

    },
    //declaring global variables
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
    


    // setting values to the segment
    setContext: function(assetArray,totalTarget) {     
      var scope = this;
      var segData = [];
      scope.prop=[];
      var storeData;    
      var totalRecommendedWeight = 0;
      var totalTargetWeight = 0;
      this.counter = 0;
      this.rowData = assetArray;
       this.totalTarget = totalTarget; // the target which we need to achieve
      var flag = this.setTotalValue(assetArray);
      for (var k = 0; k < assetArray.length; k++) {      
        //storing the data into array
    if (!assetArray[k].isVisited) {
          this.counter++;
        }
        totalRecommendedWeight = totalRecommendedWeight + parseFloat(assetArray[k].recommendedWeight);
        totalTargetWeight = totalTargetWeight + parseFloat(assetArray[k].targetWeight);
        storeData = {  
         isVisitedProp : assetArray[k].isVisited,

          slideNo : "slide"+k,
          assetName: {
            "text" :assetArray[k].Name,
            "skin":assetArray[k].isParent ? "SknLbl3B74A6SSPR15Px" : "bbSknLbl424242SSP15Px",
          },
          recWeight: parseFloat(assetArray[k].recommendedWeight).toFixed(2) + '%', //IW-3989 BHARATH
          weight: parseFloat(assetArray[k].targetWeight).toFixed(2) + '%',
          slide: {                        
            selectedValue: parseInt(assetArray[k].targetWeight),
            "onSelection": function(event, context,k) {                            
              this.onSlideCallBack(event, context,k);                        
            }.bind(this),     
          },

          flx1: {                        
            "onClick": function(event, context) {  
              this.onflex1(event, context);  
            }.bind(this),
          },
          flx2: {                        
            "onClick": function(event, context) {   
              this.onflex2(event, context);                        
            }.bind(this)                    
          },
          flx: 
          assetArray[k].isParent ?
          {
            "onClick": function(eventobject, context) {     
              this.onbutton(eventobject, context);                        
            }.bind(this)
          } : ""
        };                
        segData.push(storeData);                
        scope.prop.push(storeData);            
       this.view.lblPercentage.text = Math.round(totalRecommendedWeight) + ".00%";
//        this.view.lblPercentage2.text = Math.round(totalTargetWeight) + ".00%";
        //IW-3687
        if (totalTargetWeight >= 99.91 && totalTargetWeight <= 100.09) {
                    this.view.lblPercentage2.text = "100.00%";    
                }else{
                this.view.lblPercentage2.text = (totalTargetWeight).toFixed(2) + "%";
                }
      }            
      //segment widget mapping
      this.view.segSlider.widgetDataMap = {  
        lblSegmentname:"assetName",
        lblValue1: "recWeight",
        lblValue2: "weight",
        sliderincdec: "slide",
        flxMinus: "flx1",
        flxPlus: "flx2",
        flxLabel: "flx"
    
      };    
      this.view.segSlider.removeAll();
      this.view.segSlider.setData(segData);
    },

    // asset name click event to load breadcrumb values
    onbutton: function(event, context,k) {
      var rowIndex=context.rowIndex;     
      var selectedRowData=this.rowData[rowIndex];  
      this.breadCrumbData.length = 0;  
      this.totalTarget = this.prop[rowIndex].weight.substring(0, this.prop[rowIndex].weight.length - 1);
      this.breadCrumbData.push(selectedRowData, selectedRowData.Name);  
      // method used to set breadcrumb values through the form
      this.setButtonValues(this.breadCrumbData,selectedRowData,this.totalTarget);
    },

    // slider call back method
    onSlideCallBack: function(event, context) {            
      var rowindex = context.rowIndex;   
      var selectedRowData = this.rowData[rowindex];
      selectedRowData.targetWeight = event.selectedValue + '.00';
      this.prop[rowindex] = Object.assign(this.prop[rowindex], {                
        weight: event.selectedValue + ".00%"            
      });            
      this.view.segSlider.removeAll();            
      this.view.segSlider.setData(this.prop);
       var flag = this.setTotalValue(this.prop);
      // event to send updated target weight to the form
      this.sendUpdatedTarget(selectedRowData);
    },

    // decreament click event
    onflex1: function(event, context) { 
      var scope = this;

        var rowNumber = context.rowIndex;
        scope.flxrow1 = rowNumber;
        var selectedRowData = scope.rowData[rowNumber];
        var newweight1 = (parseFloat(scope.prop[scope.flxrow1].weight.split("%")[0]) - 1);
       if(newweight1<0){
         newweight1 = 0;
       }else if(newweight1 > 100){
         newweight1 = 100;
       }
        selectedRowData.targetWeight = newweight1;
        scope.prop[scope.flxrow1] = Object.assign(scope.prop[scope.flxrow1], {                
          weight:newweight1.toFixed(2) + "%"  
        }); 
        scope.prop[scope.flxrow1] = Object.assign(scope.prop[scope.flxrow1], {                
          slide: {                        
            selectedValue: parseInt(newweight1),
            "onSelection": function(event, context) {                            
              scope.onSlideCallBack(event, context);                        
            }.bind(scope),
          }
        }); 
        scope.view.segSlider.removeAll();            
        scope.view.segSlider.setData(scope.prop);
         var flag = scope.setTotalValue(scope.prop);
        // event to send updated target weight to the form
        scope.sendUpdatedTarget(selectedRowData);
    
    },

    // increament click event
    onflex2: function(event, context) { 
      var scope = this;
    
        var rowNumber = context.rowIndex;
        scope.flxrow2 = rowNumber;
        var selectedRowData = scope.rowData[rowNumber];
        var newweight2 = (parseFloat(scope.prop[scope.flxrow2].weight.split("%")[0]) + 1);
        if(newweight2<0){
         newweight2 = 0;
       }else if(newweight2 > 100){
         newweight2 = 100;
       }
        selectedRowData.targetWeight = newweight2;
        scope.prop[scope.flxrow2] = Object.assign(scope.prop[scope.flxrow2], {                
          weight:newweight2.toFixed(2) + "%" 
        });
        scope.prop[scope.flxrow2] = Object.assign(scope.prop[scope.flxrow2], {                
          slide: {                        
            selectedValue:parseInt(newweight2),
            "onSelection": function(event, context) {                            
              scope.onSlideCallBack(event, context);                        
            }.bind(scope),
          }
        }); 
        scope.view.segSlider.removeAll();            
        scope.view.segSlider.setData(scope.prop);
         var flag = scope.setTotalValue(scope.prop);
        // event to send updated target weight to the form
        scope.sendUpdatedTarget(selectedRowData);
      },
       setTotalValue: function(data){
      var totalTargetWeight = 0;
      var totalRecommendedWeight = 0;
      for (var k = 0; k < data.length; k++) {
		  //IW-3989 - START bharath
       if(data[k].recWeight === "0.00%"){
           totalRecommendedWeight = totalRecommendedWeight + (parseFloat(data[k].recWeight));
         }else{
           totalRecommendedWeight = totalRecommendedWeight + (parseFloat(data[k].recWeight)?parseFloat(data[k].recWeight):parseFloat(data[k].recommendedWeight));
         }//IW-3989 - end bharath
        //iw-3857 fix - Yash
        if(data[k].weight === "0.00%"){
                    totalTargetWeight = totalTargetWeight + (parseFloat(data[k].weight));
                }
                else{
                totalTargetWeight = totalTargetWeight + (parseFloat(data[k].weight) ? parseFloat(data[k].weight) : parseFloat(data[k].targetWeight));
                }
        //fix end

      }
      this.view.lblPercentage.text = Math.round(totalRecommendedWeight) + ".00%";
  //    this.view.lblPercentage2.text = Math.round(totalTargetWeight) + ".00%";
         //IW-3687
         if (totalTargetWeight >= 99.91 && totalTargetWeight <= 100.09) {
                    this.view.lblPercentage2.text = "100.00%";    
                }else{
                this.view.lblPercentage2.text = (totalTargetWeight).toFixed(2) + "%";
                }
      if(Math.round(totalTargetWeight) !== Math.round(totalRecommendedWeight)){
        return true;
      }
      else{
        return false;
      }

    },
   

  };
});



