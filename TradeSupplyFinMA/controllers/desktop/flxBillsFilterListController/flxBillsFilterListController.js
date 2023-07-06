define({ 

    onViewCreated: function () {
        this.view.flxIcon.onClick = function () {
            const data = {
                sectionIndex: arguments[1].sectionIndex,
                rowIndex: arguments[1].rowIndex,
                segmentId: arguments[1].widgetInfo.id
            };
            try {
                this.executeOnParent("segRowOnClick", data);
            } catch (e) {
                const frmController = applicationManager.getPresentationUtility().getController(kony.application.getCurrentForm().id, true);
                if ("segRowOnClick" in frmController) frmController.segRowOnClick(data);
            }
        }.bind(this);
    }

 });