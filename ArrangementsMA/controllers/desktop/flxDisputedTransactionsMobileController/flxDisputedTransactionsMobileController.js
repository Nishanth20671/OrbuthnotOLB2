define({
    showSelectedRow: function() {
        var index = kony.application.getCurrentForm().segDisputeTransactions.selectedRowIndex;
        var rowIndex = index[1];
        var data = kony.application.getCurrentForm().segDisputeTransactions.data;
        if (data[rowIndex].imgDropdown === "P") {
            data[rowIndex].imgDropdown = "O";
            data[rowIndex].flxIdentifier.skin = "sknFlxIdentifier";
            data[rowIndex].lblIdentifier.skin = "sknffffff15pxolbfonticons";
            data[rowIndex].flxDisputedTransactionsMobile.skin = "sknflxffffffnoborder";
            data[rowIndex].flxDisputedTransactionsMobile.height = "70dp";
            kony.application.getCurrentForm().segDisputeTransactions.setDataAt(data[rowIndex], rowIndex);
        } else {
            for (i = 0; i < data.length; i++) {
                if (i === rowIndex) {
                    data[i].imgDropdown = "P";
                    data[i].flxIdentifier.isVisible = true;
                    data[i].flxIdentifier.skin = "sknflx4a902";
                    data[i].lblIdentifier.skin = "sknLbl4a90e215px";
                    data[i].flxDisputedTransactionsMobile.height = "630dp";
                    data[i].flxDisputedTransactionsMobile.skin = "sknFlxf7f7f7";
                } else {
                    data[i].imgDropdown = "O";
                    data[i].flxIdentifier.isVisible = true;
                    data[i].flxIdentifier.skin = "sknFlxIdentifier";
                    data[i].lblIdentifier.skin = "sknffffff15pxolbfonticons";
                    data[i].flxDisputedTransactionsMobile.skin = "sknflxffffffnoborder";
                    data[i].flxDisputedTransactionsMobile.height = "70dp";
                }
            }
            kony.application.getCurrentForm().segDisputeTransactions.setData(data);
        }
        kony.application.getCurrentForm().forceLayout();
    }
});