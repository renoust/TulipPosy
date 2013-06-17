/************************************************************************
 * This module contains all the global variables the application needs
 * @authors Fabien Gelibert
 * @created February 2013
 ***********************************************************************/

(function () {

    import_class("graph.js", "TP");
    import_class('States.js', 'TP');
    import_class('StatesChange.js', 'TP');  

    var Context = function () {
        var __g__ = this;

        //forcing context to be singleton, instanciated once 
        if (Context.prototype._singletonInstance) {
            return Context.prototype._singletonInstance;
        }
		
		this.viewMeter = 0;
		
        Context.prototype._singletonInstance = this;
        this.view = {};

        // initialization of the communication address and port        
        // an additional default json file
        this.tulip_address = document.URL;
        this.json_address = "./data/cluster1.json";

        // initialization of the default svg parameters
        this.dialogWidth = 460;
        this.dialogHeight = 460;
        this.width = this.dialogWidth-30;
        this.height = this.dialogHeight-50;

        // initialization of the svg frames
		this.tabGraph = [];

        //substrate by default
        this.activeView = "substrate";

        this.stateStack = [];
        
        this.changeStack = new TP.StatesChange();
        
        this.mouse_over_button = false;        
        //this.combined_foreground = "substrate";

        // initialization of the global entanglement parameters        
        this.tabOperator = [];
                
        this.entanglement_intensity = 0.0;
        this.entanglement_homogeneity = 0.0;

        // initialization of default interface visual parameters
        this.defaultFillColor = "white";
        this.highlightFillColor = "lavender";
        this.defaultTextColor = "black";
        this.defaultBorderColor = "gray";
        this.defaultBorderWidth = .5;
        this.defaultTextFont = "Arial";
        this.defaultTextSize = 14;

        this.sessionSid = 0;

        this.substrateProperties = {};
        this.substrateWeightProperty = null;

        //number of pane for the menu
        this.menuNum=1;
        
		this.tabOperator["catalyst"] = "OR";
        this.tabOperator[1] = "OR";

        this.getViewGraph = function (viewID) {
                return __g__.tabGraph["graph_"+viewID];
        };
        
        this.getIndiceView = function(){
        	var tmp = __g__.viewMeter;
        	__g__.viewMeter++;
        	return tmp;
        };
        
        this.GroupOfView = new Object();
        
        
        this.clearInterface = function()
        {
        	if(this.menuNum != 1){
	        		
	        	d3.selectAll(".ui-dialog").remove();
	        	d3.selectAll(".cont").remove();
	        	d3.selectAll(".jPicker").remove();
	        	$('#wrap')[0].className='sidebar';
                $.jPicker.List.splice(0,3)
	        	
	        	for(var key in this.view){        		
	        		this.view[key].remove();
	        		this.view[key] = null;        		
	        	}
	        	
	        	this.view = null;
	        	this.view = {};
	        	
	        	this.substrateProperties = {};
	        	this.viewMeter = 0;
	        	this.menuNum=1;
	        	this.tabGraph = null;
	        	this.tabGraph = [];
	        	this.substrateWeightProperty = null;
	        	this.entanglement_intensity = 0.0;
	        	this.entanglement_homogeneity = 0.0;
	        	this.tabOperator = [];
                this.tabOperator['catalyst'] = 'OR';
	        	this.changeStack = new TP.StatesChange();
	        	this.stateStack = [];
        	
        	}
        }

        return __g__;
    }

    return {Context: Context};
})()
