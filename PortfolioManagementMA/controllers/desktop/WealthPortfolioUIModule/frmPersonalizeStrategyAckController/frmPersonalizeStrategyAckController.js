define( {
    //Type your controller code here 
    frmPreShow: function() {
        this.view.formTemplate12.flxPageFooter.isVisible = false;
         this.view.onTouchEnd = this.onFormTouchEnd;
        var data = applicationManager.getNavigationManager().getCustomInfo('frmPersonalizeStrategy');
        //var response = JSON.parse(JSON.stringify(data));
        var response= data;
        var assetArray = response.segData;
       //creating the template
        let template = JSON.stringify({
            "templateID": "flxSegPersonalizeStrategyOLB",
            "microAppName": "PortfolioManagementMA"
        });
        let configParam = {
            "serviceParameters": {},
            "dataMapping": {
                "segListDetail": {
                    "segmentMasterData": "${CNTX.segData}",
                    "segmentUI": {
                        "rowTemplate": {
                           //segment widget mapping
                            "lblSegment": "${segmentMasterData.assetName}",
                            "lblRecommended": "${segmentMasterData.weight1}",
                            "lblTarget": "${segmentMasterData.weight2}"
                        }
                    }
                }
            },
            "rowTemplateConfig": template,
            "headerTemplateConfig": ""
        };
        var finalSegListArray = [];
        var listValue;
       for (var k = 0; k < assetArray.length; k++) {
            listValue = {
                assetName: assetArray[k].Name,
                weight1: assetArray[k].recommendedWeight + '%',
                weight2:  assetArray[k].targetWeight + '%',
            };
            finalSegListArray.push(listValue);
        }
        response.segData = finalSegListArray;
        this.view.formTemplate12.flxContentTCCenter.flxMainContent.flxAckMain.flxStrategy.flxSegment.segList.setConfigsFromParent(configParam);
        this.view.formTemplate12.flxContentTCCenter.flxMainContent.flxAckMain.flxStrategy.flxSegment.segList.updateContext(response);
  },
  onFormTouchEnd : function(){
    var currFormObj = kony.application.getCurrentForm();
    if (currFormObj.customheadernew.flxContextualMenu.isVisible === true) {
      setTimeout(function() {
        currFormObj.customheadernew.flxContextualMenu.setVisibility(false);
        currFormObj.customheadernew.flxTransfersAndPay.skin = ViewConstants.SKINS.BLANK_SKIN_TOPMENU;
        currFormObj.customheadernew.imgLblTransfers.text = "O";
      }, "17ms")
    }
  }
});
