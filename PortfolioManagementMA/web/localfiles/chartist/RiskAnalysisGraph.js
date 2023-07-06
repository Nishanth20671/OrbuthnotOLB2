/*var tseriesArray = [2.5, 60.5];
		var triskObj=50.5;
		var tLabels = ['Portfolio', 'Investment Profile']
		var ticksCount = 8;
		
		drawChart(tseriesArray, triskObj, tLabels, ticksCount)*/

		function drawRiskChart(seriesArray, riskObj, lblArray, ticksCount, greyArea){
			
			ticksCount = ticksCount>5?5:ticksCount;
		
			var maxValue = Math.max(...seriesArray, ...greyArea) + 1;
			
			var ticksArray=[];
			if(maxValue === 1) {
				ticksArray = [0];
			} else {
				
				if(riskObj>maxValue) {
					maxValue = riskObj+1;
				}
				
				var splitBy = parseInt(Math.ceil(maxValue/ticksCount));
				var ticksArray=[];
				for(i=0; i<=ticksCount+5; i++) {
					ticksArray.push((splitBy * i).toFixed(0));
				}				
				ticksArray = [...new Set(ticksArray)];
			}
			
			
			
			
			var riskObjPos = ticksArray.indexOf(riskObj);
	    var greyStartPos = ticksArray.indexOf(greyArea[0].toString());
	    var greyEndPos =  ticksArray.indexOf(greyArea[1].toString());
			var isExtraGrid = false;
	    var isGreyStartExtraGrid = false;
     	var isGreyEndExtraGrid = false;
			
			if(riskObjPos<0) {
				isExtraGrid = true;
				ticksArray.push(riskObj);
				
			}
			
	if(greyStartPos<0) {
		isGreyStartExtraGrid = true;
		ticksArray.push(greyArea[0].toString());
	}
			
	if(greyEndPos<0) {
		isGreyStartExtraGrid = true;
		ticksArray.push(greyArea[1].toString());
	}
	
	ticksArray = [...new Set(ticksArray)];
	
	riskObjPos = ticksArray.sort(function(a, b){return a - b}).indexOf(riskObj.toString());
	greyStartPos = ticksArray.sort(function(a, b){return a - b}).indexOf(greyArea[0].toString());
	greyEndPos = ticksArray.sort(function(a, b){return a - b}).indexOf(greyArea[1].toString());
	

	var options = {
		seriesBarDistance: 0,
		reverseData: true,
		horizontalBars: true,
		axisX : {
			type : Chartist.FixedScaleAxis,
			low : 0,
			high : maxValue,
			ticks : ticksArray,
			offset : 15,
			labelInterpolationFnc: function(value) {
                         return value + '%'
					}
		},
		axisY : {
			offset : 1
		},
		chartPadding : 30
		
	};
	var data = {
		labels: lblArray,
		series: [ seriesArray ]
	}
	
	var chart = new Chartist.Bar('#WealthRiskAnalysisGraph', data, options);
	
	
	maxValue = Math.max(...ticksArray);
	
	chart.on('draw', function (ctx) {
		console.log(ctx);

				if(ctx.type === 'grid' && ctx.axis.units.pos === 'x') {

			if(ctx.index+1===4){
				this.greyStart = ctx;
			}
			
			if(ctx.index+1===riskObjPos+1) {
				this.riskObjStartPos = ctx.x2;
				if(isExtraGrid) {
					ctx.element.attr({
					  style: 'fill-opacity:0;stroke-opacity:0'
					});
				}				
			}
			
			if(ctx.index+1===greyStartPos+1) {
				this.greyStartPos = ctx;
				if(isGreyStartExtraGrid) {
					ctx.element.attr({
					  style: 'fill-opacity:0;stroke-opacity:0'
					});
				}
			}
			
			if(ctx.index+1===greyEndPos+1) {
				this.greyEndPos = ctx;
				if(isGreyEndExtraGrid) {
					ctx.element.attr({
					  style: 'fill-opacity:0;stroke-opacity:0'
					});
				}
			}
			
			if(this.greyEndPos){
				var rectWidth = this.greyEndPos.x1-this.greyStartPos.x1;
				var rectHeight = this.greyEndPos.y2-this.greyEndPos.y1;
				
				ctx.group.elem('rect', {
					x: this.greyStartPos.x1,
					y: this.greyStartPos.y1,
					width: rectWidth,
					height: rectHeight,
					style:"fill:#e3e3e3;stroke:#e3e3e3;stroke-width:0;fill-opacity:0.5;stroke-opacity:0.5"
					}, 'ct-tick');
					
				this.greyEndPos=undefined;
			}
			
		} else if(ctx.type === 'bar' && ctx.index===1) {
			
			ctx.group.elem('rect', {
			x: this.riskObjStartPos-3,
			y: ctx.y1-25,
			width: 3,
			height: 50,
			style:"fill:#f9256c;stroke:#f9256c;stroke-width:0;fill-opacity:1;stroke-opacity:1"
			}, 'ct-tick');	
			
		} else if(ctx.type === 'label') {
			if(ctx.index+1===riskObjPos+1) {
				if(isExtraGrid) {
					ctx.element.attr({
					  style: 'width:0; height:0;'
					});
				}
				
			}
		}
	});
}