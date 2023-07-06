define({
    showSelectedRow: function() {
        var index = kony.application.getCurrentForm().segDisputeTransactions.selectedRowIndex;
        var rowIndex = index[1];
        var data = kony.application.getCurrentForm().segDisputeTransactions.data;
        if (data[rowIndex].imgDropdown === "P") {
            data[rowIndex].imgDropdown = "O";
            data[rowIndex].flxIdentifier.skin = "sknFlxIdentifier";
            data[rowIndex].lblIdentifier.skin = "sknffffff15pxolbfonticons";
            data[rowIndex].flxDisputedTransactions.skin = "sknflxffffffnoborder";
            data[rowIndex].flxDisputedTransactions.height = "55dp";
            kony.application.getCurrentForm().segDisputeTransactions.setDataAt(data[rowIndex], rowIndex);
        } else {
            for (i = 0; i < data.length; i++) {
                if (i === rowIndex) {
                    data[i].imgDropdown = "P";
                    data[i].flxIdentifier.isVisible = true;
                    data[i].flxIdentifier.skin = "sknflx4a902";
                    data[i].lblIdentifier.skin = "sknLbl4a90e215px";
                    data[i].flxDisputedTransactions.height = "236dp";
                    data[i].flxDisputedTransactions.skin = "sknFlxf7f7f7";
                } else {
                    data[i].imgDropdown = "O";
                    data[i].flxIdentifier.isVisible = true;
                    data[i].flxIdentifier.skin = "sknFlxIdentifier";
                    data[i].lblIdentifier.skin = "sknffffff15pxolbfonticons";
                    data[i].flxDisputedTransactions.skin = "sknflxffffffnoborder";
                    data[i].flxDisputedTransactions.height = "55dp";
                }
            }
            kony.application.getCurrentForm().segDisputeTransactions.setData(data);
        }
        kony.application.getCurrentForm().forceLayout();
    }
});