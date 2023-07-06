define({
    showSelectedRow: function() {
        var previousIndex;
        var index = kony.application.getCurrentForm().TransactionsUnCategorized.segTransactions.selectedRowIndex;
        var rowIndex = index[1];
        var data = kony.application.getCurrentForm().TransactionsUnCategorized.segTransactions.data;
        for (i = 0; i < data.length; i++) {
            if (i == rowIndex) {
                data[i].imgDropdown = "arrow_up.png";
                data[i].template = "flxPFMBulkUpdateTransactionsSelectedMobile";
            } else {
                data[i].imgDropdown = "arrow_down.png";
                data[i].template = "flxPFMBulkUpdateTransactionMobile";
            }
        }
        kony.application.getCurrentForm().TransactionsUnCategorized.segTransactions.setData(data);
        this.AdjustScreen();
    },
    toggleCheckBox: function() {
        var index = kony.application.getCurrentForm().TransactionsUnCategorized.segTransactions.selectedIndex[1];
        var data = kony.application.getCurrentForm().TransactionsUnCategorized.segTransactions.data;
        for (i = 0; i < data.length; i++) {
            if (i == index) {
                if (data[i].imgCheckBox === "unchecked_box.png") {
                    data[i].imgCheckBox = "checked_box.png";
                } else {
                    data[i].imgCheckBox = "unchecked_box.png";
                }
            }
            kony.application.getCurrentForm().TransactionsUnCategorized.segTransactions.setData(data);
        }
    },
    //UI Code
    AdjustScreen: function() {
        var currForm = kony.application.getCurrentForm();
        currForm.forceLayout();
        var mainheight = 0;
        var screenheight = kony.os.deviceInfo().screenHeight;
        mainheight = currForm.customheader.frame.height + currForm.flxMainContainer.frame.height;
        var diff = screenheight - mainheight;
        if (mainheight < screenheight) {
            diff = diff - currForm.flxFooter.frame.height;
            if (diff > 0)
                currForm.flxFooter.top = mainheight + diff + "dp";
            else
                currForm.flxFooter.top = mainheight + "dp";
        } else {
            currForm.flxFooter.top = mainheight + "dp";
        }
        currForm.forceLayout();
    }
});