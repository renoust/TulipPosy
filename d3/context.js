/************************************************************************
 * This module contains all the global variables the application needs
 * @authors Fabien Gelibert
 * @created February 2013
 ***********************************************************************/

(function () {

    import_class("graph.js", "TP");
    import_class('States.js', 'TP');
    import_class('StatesChange.js', 'TP');
    import_class('Controller.js', 'TP');

    var Context = function () {
        var __g__ = this;

        //forcing context to be singleton, instanciated once 
        if (Context.prototype._singletonInstance) {
            return Context.prototype._singletonInstance;
        }
        
        __g__.controller = new TP.Controller();
		
		__g__.viewMeter = 0;
		
        Context.prototype._singletonInstance = __g__;
        __g__.view = {};

        // initialization of the communication address and port        
        // an additional default json file
        __g__.tulip_address = document.URL;
        __g__.json_address = "./data/cluster1.json";

        // initialization of the default svg parameters
        __g__.dialogWidth = 460;
        __g__.dialogHeight = 460;
        __g__.width = __g__.dialogWidth-30;
        __g__.height = __g__.dialogHeight-50;

        // initialization of the svg frames
		__g__.tabGraph = [];

        //substrate by default
        __g__.activeView = "substrate";

        __g__.stateStack = [];
        
        __g__.changeStack = new TP.StatesChange();
        
        __g__.mouse_over_button = false;        
        //__g__.combined_foreground = "substrate";

        // initialization of the global entanglement parameters        
        __g__.tabOperator = [];
                
        __g__.entanglement_intensity = 0.0;
        __g__.entanglement_homogeneity = 0.0;

        // initialization of default interface visual parameters
        __g__.defaultFillColor = "white";
        __g__.highlightFillColor = "lavender";
        __g__.defaultTextColor = "black";
        __g__.defaultBorderColor = "gray";
        __g__.defaultBorderWidth = .5;
        __g__.defaultTextFont = "Arial";
        __g__.defaultTextSize = 14;

        __g__.sessionSid = 0;

        __g__.substrateProperties = {};
        __g__.substrateWeightProperty = null;

        //number of pane for the menu
        __g__.menuNum=1;
        
		__g__.tabOperator["catalyst"] = "OR";
        __g__.tabOperator[1] = "OR";
        

        __g__.getViewGraph = function (viewID) {
                return __g__.tabGraph["graph_"+viewID];
        };
        
        __g__.getIndiceView = function(){
        	var tmp = __g__.viewMeter;
        	__g__.viewMeter++;
        	return tmp;
        };
        
        __g__.GroupOfView = new Object();
        
        
        __g__.clearInterface = function()
        {
        	
        	if(__g__.menuNum != 1){
        	
	        	d3.selectAll(".ui-dialog").remove();
	        	d3.selectAll(".cont").remove();
	        	d3.selectAll(".jPicker").remove();
	        	$('#wrap')[0].className='sidebar';
                $.jPicker.List.splice(0,3)
	        	
	        	for(var key in __g__.view){        		
	        		__g__.view[key].remove();
	        		__g__.view[key] = null;        		
	        	}
	        	
	        	__g__.view = null;
	        	__g__.view = {};
	        	
	        	__g__.substrateProperties = {};
	        	__g__.viewMeter = 0;
	        	__g__.menuNum=1;
	        	__g__.tabGraph = null;
	        	__g__.tabGraph = [];
	        	__g__.substrateWeightProperty = null;
	        	__g__.entanglement_intensity = 0.0;
	        	__g__.entanglement_homogeneity = 0.0;
	        	__g__.tabOperator = [];
                __g__.tabOperator['catalyst'] = 'OR';
	        	__g__.changeStack = new TP.StatesChange();
	        	__g__.stateStack = [];
        	
        	}
        }
        
	__g__.initStates = function()
	{	
		assert(true, "type of controller principal");
				
		__g__.controller.addState({name:"callLayoutSendQuery", bindings:null, func:function(event){/*assert(true, "callLayoutSendQuery");*/ TP.Client().callLayoutSendQuery(event);}}, "all");				
		__g__.controller.addState({name:"selectionSendQuery", bindings:null, func:function(event){/*assert(true, "selectionSendQuery");*/ TP.Client().selectionSendQuery(event);}}, "all");
		__g__.controller.addState({name:"FloatAlgorithmSendQuery", bindings:null, func:function(event){/*assert(true, "FloatAlgorithmSendQuery");*/ TP.Client().FloatAlgorithmSendQuery(event);}}, "all");
		__g__.controller.addState({name:"analyseGraphSendQuery", bindings:null, func:function(event){/*assert(true, "analyseGraphSendQuery");*/ TP.Client().analyseGraphSendQuery(event);}}, "all");
		__g__.controller.addState({name:"mouseoverInfoBox", bindings:null, func:function(event){/*assert(true, "mouseoverInfoBox");*/ TP.Interface().addInfoBox(event);}},"all");		
	}        
        
        __g__.initController = function(ID, typeC)
        {        	
        	__g__.controller.initListener(ID, typeC);
        }
        
        __g__.getController = function()
        {
        	return __g__.controller;
        }

        return __g__;
    }

    return {Context: Context};
})()
