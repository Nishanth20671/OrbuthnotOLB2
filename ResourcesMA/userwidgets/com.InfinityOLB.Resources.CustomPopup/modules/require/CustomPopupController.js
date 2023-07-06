define(function() {
  return {
    preShow : function()
    {
      this.view.onBreakpointChange = this.onBreakpointChangeComponent;
      this.view.lblHeading.accessibilityConfig={
        a11yARIA : {
          tabindex : -1,
        }
      }
      this.view.lblPopupMessage.accessibilityConfig={
        a11yARIA : {
          tabindex : -1,
        }
      }
      this.view.flxCross.accessibilityConfig={
        a11yLabel : kony.i18n.getLocalizedString("i18n.common.close"),
        a11yARIA : {
          tabindex : 0,
          role : "button"
        }
      }
      this.view.btnNo.accessibilityConfig={
        a11yARIA : {
          tabindex : 0,
          role : "button"
        }
      }
      this.view.btnYes.accessibilityConfig={
        a11yARIA : {
          tabindex : 0,
          role : "button"
        }
      }
      this.view.flxSeperator.accessibilityConfig={
        a11yARIA : {
          tabindex : -1
        },
        a11yHidden : true
      }
      this.view.flxSeperator2.accessibilityConfig={
        a11yARIA : {
          tabindex : -1
        },
        a11yHidden : true
      }
    },
    onBreakpointChangeComponent : function(eventObj,breakpoint){
        this.view.centerX = "50%";
        this.view.centerY = "50%";
        if (breakpoint === 640) {
          this.view.width = "90%";
        } else if (breakpoint === 1024) {
          this.view.width = "75%";
        } else{
          this.view.width = "500px";
        }
    }
  };
});