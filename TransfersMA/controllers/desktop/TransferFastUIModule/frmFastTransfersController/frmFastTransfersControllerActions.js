define({
    /*
      This is an auto generated file and any modifications to it may result in corruption of the action sequence.
    */
    /** onClick defined for flxAddInternationalAccount **/
    AS_FlexContainer_bd7dcee49c0440d18c861b631b9e2f8e: function AS_FlexContainer_bd7dcee49c0440d18c861b631b9e2f8e(eventobject) {
        var self = this;
        this.addInternationalAccount();
    },
    /** onClick defined for flxAddReciepient **/
    AS_FlexContainer_d89c0c65bbb243e69330aa7c62ef130f: function AS_FlexContainer_d89c0c65bbb243e69330aa7c62ef130f(eventobject) {
        var self = this;
        this.addP2PAccount();
    },
    /** onClick defined for flxAddBankAccount **/
    AS_FlexContainer_e6628e6b549e46468413368a77946a8c: function AS_FlexContainer_e6628e6b549e46468413368a77946a8c(eventobject) {
        var self = this;
        this.addInternalAccount();
    },
    /** onClick defined for flxAddKonyAccount **/
    AS_FlexContainer_g8bee22d112e4447b8050ec11cabf75d: function AS_FlexContainer_g8bee22d112e4447b8050ec11cabf75d(eventobject) {
        var self = this;
        this.addExternalAccount();
    },
    /** init defined for frmFastTransfers **/
    AS_Form_e7076d2a19a74db2be4902983993ab16: function AS_Form_e7076d2a19a74db2be4902983993ab16(eventobject) {
        var self = this;
        this.init();
    },
    /** onTouchStart defined for lblOpenAccounttFrom **/
    AS_Label_debd1d7e24444de09fb663bc1019df80: function AS_Label_debd1d7e24444de09fb663bc1019df80(eventobject, x, y) {
        var self = this;
        var nuoModule = kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("NAOModule");
        nuoModule.presentationController.showNewAccountOpening();
    },
    /** onTouchStart defined for lblOpenNewAccounttFrom **/
    AS_Label_heb9746e19264a6aa2228b08c7e2c251: function AS_Label_heb9746e19264a6aa2228b08c7e2c251(eventobject, x, y) {
        var self = this;
        // kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule({
        //   "moduleName": "NAOModule",
        //   "appName": "NAOMA"
        // }).presentationController.showNewAccountOpening();
    },
    /** onTouchStart defined for lblSendMoneyToNewRecipientTo **/
    AS_Label_j8d2dca889f34853864541734cda69fa: function AS_Label_j8d2dca889f34853864541734cda69fa(eventobject, x, y) {
        var self = this;
        kony.mvc.MDAApplication.getSharedInstance().getModuleManager().getModule("TransferFastUIModule").presentationController.showTransferScreen({
            showRecipientGateway: true
        });
    }
});