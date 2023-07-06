define(function() {

  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
      this.view.postShow = this.postShow;
      this.btnId = 0;
      this.sepId = 0;
      this.selectedBreadCrumb={};
      this.assets =["0", "Assets"];
    },
    //Logic for getters/setters of custom properties
    initGettersSetters: function() {},


    postShow: function(){
      
      this.btnId = 0;
      this.sepId = 0;
      this.assets =["0", "Assets"];
      
      this.view.flxbreadCrumb.removeAll();
      this.createSep(this.assets);
    },

    setContext: function(initialData, tableHandler) {
      this.assets = initialData;
      this.tableHandler = tableHandler;
    },

    loadButtons: function(buttonData){
      this.selectedBreadCrumb=buttonData;
      this.createSep(buttonData);
    },
    

    
     resetButton: function(){
      this.btnId = 0;
      this.sepId = 0;
      this.assets =["0", "Asset"];
      //this.view.flxBreadCrumb.removeAll();
       this.view.flxbreadCrumb.removeAll();
      this.createSep(this.assets);
    },

    onClickCallBck: function(x){
      if(x.skin!=='sknBtn424242SSPReg30pxTab'){
        let i=Number(x.id[3]) + 1.0;
        let j=Number(x.id[3]) + 1.0;

        for(i; i<=this.btnId; i++){
          this.view[`btn${i}`].setVisibility(false);
          this.view[`btn${i}`].removeFromParent();
        }

        for(j; j<=this.btnId; j++){
          this.view[`sep${j}`].setVisibility(false);
          this.view[`sep${j}`].removeFromParent();
        }

        this.btnId = Number(x.id[3]);
        this.sepId = Number(x.id[3]);
        
        //black skin
        this.view[`btn${this.btnId}`].skin = "sknBtn424242SSPReg30pxTab";
        this.view[`btn${this.btnId}`].focusSkin = "sknBtn424242SSPReg30pxTab";
        this.sendBtn(x,this.selectedBreadCrumb);
      }

    },

    createBtn: function(drillDownData){
      this.btnId++;
      try{
        var btnBasic = {
          id: `btn${this.btnId}`,
          isVisible: true,
          text: `${drillDownData[1]}`,
          //width: "80dp",
          autogrowMode: kony.flex.AUTOGROW_HEIGHT,
          height: "100%",
          centerY: "50%",
          left: "0dp",
          info:{
            "key":this.btnId === 1?null:drillDownData[0].ID,
          },
          //black Skin
          skin: "sknBtn424242SSPReg30pxTab",
          focusSkin: "sknBtn424242SSPReg30pxTab",
          onClick: this.onClickCallBck,
        };

        var Onbutton = new kony.ui.Button(btnBasic);
        if(drillDownData[1] === 'Assets') {
          Onbutton.width = "80dp";
        }
        
        this.view.flxbreadCrumb.add(Onbutton);
        if(this.btnId > 1){
          for(let i=this.btnId - 1.0; i>0; i--){
            //blue Skin
            //this.view[`btn${i}`].skin = "sknBtn30Px293276SSP";
            //IW-3682 author: Yash
            this.view[`btn${i}`].skin = "sknlbl003E7536px";
            //this.view[`btn${i}`].focusSkin = "sknBtn30Px293276SSP";
            this.view[`btn${i}`].focusSkin = "sknlbl003E7536px";
            //           alert(`in loop ${i}`);
          }
        }
      }catch(err){
        kony.print(JSON.stringify(err));
      }
    },

    createSep: function(drillDownData){
      this.sepId++;
      try{
        var btnBasic = {
          id: `sep${this.sepId}`,
          isVisible: true,
          //Ayush Raj, [IW-3698] - fix start 
          left:this.sepId === 2?"-4dp":"2dp",
          height: "100%",
          centerY: "50%",
          enable: false,
          src:"arrow_right_grey.png", //fix end
        };

        //var Onbutton = new kony.ui.Button(btnBasic);
        var Onbutton = new kony.ui.Image2(btnBasic);
        this.view.flxbreadCrumb.add(Onbutton);
        this.view.sep1.setVisibility(false);
      }catch(err){
        kony.print(JSON.stringify(err));
      }
      this.createBtn(drillDownData);
    },

  };
});