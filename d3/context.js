/************************************************************************
 * This module contains all the global variables the application needs
 * @authors Fabien Gelibert
 * @created February 2013
 ***********************************************************************/

(function () {

    import_class("graph.js", "TP");

    var Context = function () {
        var __g__ = this;

        //forcing context to be singleton, instanciated once 
        if (Context.prototype._singletonInstance) {
            return Context.prototype._singletonInstance;
        }

        Context.prototype._singletonInstance = this;

        this.application = [];
        this.view = [];

        // initialization of the communication address and port        
        // an additional default json file
        this.tulip_address = "http://localhost:8085";
        this.json_address = "./cluster1.json";

        // initialization of the default svg parameters
        this.dialogWidth = 480;
        this.dialogHeight = 480;
        this.width = this.dialogWidth-30;
        this.height = this.dialogHeight-50;

        // initialization of the svg frames
        this.svg_substrate = null;
        this.svg_catalyst = null;
        this.svg_combined = null;

        // initialization of the graphs, and lasso interactors
        this.graph_substrate = null;
        this.graph_catalyst = null;
        this.graph_combined = null;
        this.lasso_catalyst = null;
        this.lasso_substrate = null;
        this.lasso_combined = null;

        // initialization of the selection and move modes
        this.select_mode_substrate = false;
        this.move_mode_substrate = true;
        this.show_labels_substrate = true;
        this.show_links_substrate = true;
        this.node_information_substrate = false;
        this.select_mode_catalyst = false;
        this.move_mode_catalyst = true;
        this.show_labels_catalyst = true;
        this.show_links_catalyst = true;
        this.node_information_catalyst = false;
        this.mouse_over_button = false;
        this.select_mode_combined = false;
        this.move_mode_combined = true;
        this.show_labels_combined = true;
        this.show_links_combined = true;
        this.node_information_combined = false;
        this.combined_foreground = "substrate";

        // initialization of the global entanglement parameters
        this.catalyst_sync_operator = "AND";
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
        //var color = d3.scale.category20();

		//Added to get translation values 
		this.data_translation_catalyst = [0,0];
		this.data_translation_substrate = [0,0];
		this.data_translation_combined = [0,0];

        this.sessionSid = 0;

        this.substrateProperties = {};
        this.substrateWeightProperty = null;

        this.getViewSVG = function (viewID) {
            if (viewID == "catalyst") {
                return __g__.svg_catalyst;
            }

            if (viewID == "substrate") {
                return __g__.svg_substrate;
            }

            if (viewID == "combined") {
                return __g__.svg_combined;
            }
        };


        this.getViewGraph = function (viewID) {
            if (viewID == "catalyst") {
                return __g__.graph_catalyst;
            }

            if (viewID == "substrate") {
                return __g__.graph_substrate;
            }

            if (viewID == "combined") {
                return __g__.graph_combined;
            }
        };

        return __g__;
    }

    return {Context: Context};
})()
