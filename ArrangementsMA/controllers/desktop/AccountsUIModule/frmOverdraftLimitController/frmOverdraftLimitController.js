define({ 

 //Type your controller code here 
onNavigate: function()
{
this.view.txtNewLimit.text="";
this.view.CopytxtNewLimit0e7dc6384d16040.text="";
},
  btnSend_onClick: function()
  {
    var ntf=new kony.mvc.Navigation("AccountsUIModule/frmOverdraftAcknowledgement");
    ntf.navigate();
  }
  

 });