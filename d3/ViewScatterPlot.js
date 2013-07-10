(function () {

import_class('context.js', 'TP');
import_class("objectReferences.js", "TP");
import_class('stateSelect.js','TP');
import_class('Controller.js','TP');
import_class('StateTree.js', 'TP')

	var ViewScatterPlot = function(id, groupe, bouton, svgs, name, type, idAssociation){		
		
		var __g__ = new TP.ViewTemplate(id, groupe, svgs, name, type, idAssociation, bouton);
		
		__g__.addView = function() {
	
	     	if(__g__.controller != null)
	     	   __g__.controller.initListener(__g__.ID, "view");
	     	   
			__g__.buttonTreatment();
			__g__.createDialog();
			
		    __g__.svg = d3.select("#zone" + __g__.ID)
	           .append("svg")
	           .attr('class', 'scatterPlot'+__g__.ID)
	           .attr("width", "100%")
	           .attr("height", "100%")
	           .attr("id", __g__.tabDataSvg[4])
	           .attr("idView", __g__.ID);	
		}
					
		__g__.remove = function()
		{
			__g__.removeViewTemplate();
		}
	
		
		__g__.initStates = function()
		{
								
			__g__.controller.addState({name:"mouseoverScatterPlot", bindings:null, func:function(event){/*assert(true, "mouseoverScatterPlot");*/ TP.ScatterPlot().mouseoverScatterPlot(event);}}, "all", true);				
			__g__.controller.addState({name:"mouseoutScatterPlot", bindings:null, func:function(event){/*assert(true, "mouseoutScatterPlot");*/ TP.ScatterPlot().mouseoutScatterPlot(event);}}, "all", true);
			__g__.controller.addState({name:"mouseclickScatterPlot", bindings:null, func:function(event){/*assert(true, "mouseclickScatterPlot");*/ TP.ScatterPlot().mouseclickScatterPlot(event);}}, "all", true);
				
			__g__.controller.addState({name:"zoomScatterPlot", bindings:null, func:function(event){/*assert(true, "zoomScatterPlot");*/ TP.ScatterPlot().zoomScatterPlot(event);}}, "all", true);
				
			
			__g__.controller.setCurrentState(null);
			
		}
				
		
		return __g__;
	}

    return {ViewScatterPlot  : ViewScatterPlot};
        
})()