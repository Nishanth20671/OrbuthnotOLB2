define(function() {

	return {
      preShow: function(){
        this.view.brwChart.onPageFinished=this.setChartData;
      },
      setChartData: function(labels, response, chartColors){
		this.view.brwChart.evaluateJavaScript("addchart( " + JSON.stringify(labels)+" ," + JSON.stringify(response) +"," +JSON.stringify(chartColors)+" );");
	
      },
    }
});