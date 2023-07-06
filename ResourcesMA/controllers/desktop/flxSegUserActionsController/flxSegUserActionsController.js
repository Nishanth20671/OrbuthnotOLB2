define({
    //Type your controller code here
  setFocusToLogout: function(eventobject, eventPayload, context) {
    var frm = kony.application.getCurrentForm();
    if(eventPayload.keyCode === 27){
      if(frm.customheader){
        frm.customheader.onKeyPressCallBack(eventobject,eventPayload);
      }
      if(frm.customheadernew){
        frm.customheadernew.onKeyPressCallBack(eventobject,eventPayload);
      }
    }
    if (eventPayload.keyCode === 9) {
      if(event.shiftKey){
        if(context.rowIndex===context.widgetInfo.data.length-1){
          eventPayload.preventDefault();
          context.widgetInfo.setActive(context.rowIndex-1,context.sectionIndex,"btnUsers");
        }
        if(context.rowIndex===0){
          eventPayload.preventDefault();
          if(frm.customheader){
            eventPayload.preventDefault();
            frm.customheader.headermenu.flxUserId.setActive(true);
          }
          if(frm.customheadernew){
            eventPayload.preventDefault();
            frm.customheadernew.flxUser.setActive(true);
          }
        }
      }
      else{
        if(context.rowIndex===context.widgetInfo.data.length-1){
          if (frm.customheader) {
            eventPayload.preventDefault();
            frm.customheader.headermenu.btnLogout.setActive(true);
          }
          if (frm.customheadernew) {
            eventPayload.preventDefault();
            frm.customheadernew.btnLogout.setActive(true);
          }
        }
      }
    }
  }
});