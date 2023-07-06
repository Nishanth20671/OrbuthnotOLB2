/* eslint-disable */
define(['./RiskProfilingBusinessController'],function(RiskProfilingBusinessController) {
  return {
    constructor: function(baseConfig, layoutConfig, pspConfig) {
     this.businessController = new RiskProfilingBusinessController();
     this.context = {};
      this.view.flxRight.onTouchEnd = this.navigateToReview;
    },
    initGettersSetters: function() {
      defineGetter(this, 'serviceCall', () => {
        return this._serviceCall;
      });
      defineSetter(this, 'serviceCall', value => {
        this._serviceCall = value;
      });
    },
    
    hideFlex: function(isVisible){
      
      this.view.flxRight.isVisible = isVisible;
    },
    setContext: function (context, navigateToReview) {
      var scope = this;
      try {
        this.context = context;
        this.navtorev = navigateToReview;
        this.businessController.fetchDetails(this._serviceCall.ServiceName,this._serviceCall.OperationName,this._serviceCall.ObjectName,this.context,this.onServiceSuccess,this.onError);
      } catch (err) {
        scope.setError(err, "setContext");
      }
    },
    onServiceSuccess: function(response) {
      this.view.lblDate.text = response.expiryDate;
      if(response.isValid === "true"){
        this.view.imgTick.src =  "success.png";
        this.view.lblValid.text = response.message;
		this.view.lblExpires.text = "Expires"; //IW-3978 - bharath
      }else{
        this.view.imgTick.src = "aa_password_error.png";
        this.view.lblValid.text = response.message;
		this.view.lblExpires.text = "Expired"; //IW-3978 - bharath
      }
    },
    navigateToReview:function(){
      this.navtorev();
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
  }
});