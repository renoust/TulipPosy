/************************************************************************
 * This module contains all the requests to the server that the client 
 * has to do in order to get the graph, or to modify some of its nodes.
 * @requires jquery.js
 * @authors Guy Melancon, Benjamin Renoust
 * @created May 2012
 ***********************************************************************/

(function () {

    import_class('context.js', 'TP');
    import_class("objectReferences.js", "TP");

    import_class("graph.js", "TP");
    import_class("graphDrawing.js", "TP");
    import_class("UpdateViews.js", "TP");

    var Client = function () {
        var __g__ = this;

        var contxt = TP.Context();
        var objectReferences = TP.ObjectReferences();


        // Loads the data from a json file, if no JSON is passed, then we load
        // the default JSON stored in 'contxt.json_address', otherwise it loads
        // the given json file.
        // It is first formatted correctly, locally, then sent to tulip to be 
        //initialized (so it is modified again), and analyzed.
        this.loadData = function (json) {
            //for local use
            if (json == "" || json == null) {
                var jqxhr = $.getJSON(contxt.json_address, function () {
                    console.log("success");
                })

                .error(function (e) {
                    alert("error!!", e);
                })
                .complete(function () {
                    console.log("complete");
                })
                .success(function (data, b) {
                    objectReferences.ToolObject.addBaseID(data, "id")
                    jsonData = JSON.stringify(data)
                    objectReferences.ToolObject.loadJSON(data)
                    this.createTulipGraph(jsonData)
                    this.analyseGraph()
                });
            } else {
                data = $.parseJSON(json)
                objectReferences.ToolObject.addBaseID(data, "id")
                json = JSON.stringify(data)
                objectReferences.ToolObject.loadJSON(data)
                console.log("I am creating the graph in Tulip")
                this.createTulipGraph(json)
                console.log("I should now analyse the graph",contxt.sessionSid)
                this.analyseGraph()
                console.log("graph analysed", contxt.sessionSid)
            }
            TP.ObjectReferences().TulipPosyClientObject.syncLayouts();
            //TP.ObjectContext().TulipPosyVisualizationObject.sizeMapping("entanglementIndice", "catalyst");
            /*var cGraph = null;
    		var svg = null;

    		svg = contxt.getViewSVG('catalyst');
    		cGraph = contxt.getViewGraph('catalyst');
    		var graph_drawing = TP.GraphDrawing(cGraph, svg);
    		graph_drawing.nodeSizeMap(cGraph, 0, 'entanglementIndice');

    		objectContext.TulipPosyInterfaceObject.addInterfaceSubstrate();
    		objectContext.TulipPosyInterfaceObject.addInterfaceCatalyst();
    		objectContext.TulipPosyVisualizationObject.entanglementCaught();*/
        }


        // This function calls a special case of creation of a graph, instead 
        // of passing a json graph object, it passes a query that goes through
        // a search engine to build then a substrate graph.
        // query, the query to pass to the search engine
        this.callSearchQuery = function (query) {
            var recieved_data = {};
            //console.log('calling search query ', query)
            $.ajax({
                url: contxt.tulip_address,
                async: false,
                data: {type: "creation",'search': query['query']},
                type: 'POST',
                success: function (data) {
                    console.log('sending search request in tulip, and recieved data: ',data)
                    data = JSON.parse(data)
                    recieved_data = data
                }
            });
            return JSON.stringify(recieved_data)
        }


        this.sendQuery = function (params) {
        //success parameters might be useless...closure just does it well enough

            var defaultParams = {
                parameters: {},
                async: true,
                success: function () {},
                successParameters: []
            }

            for (var p in defaultParams) {
                if (!(p in params))
                    params[p] = defaultParams[p];
            }
            //we've got to manage here jsonp for cross domain request (so it 
            //should be always async) and error callback, at least default 
            //error and waiting behaviours
            //we also may want to manage JSON interpretation directly

            $.ajax({
                url: contxt.tulip_address,
                data: params['parameters'],
                type: 'POST',
                dataType: 'json',
                async: params['async'],
                success: function (data) {
                    var args = [data];
                    for (var i = 0; i < params['successParameters'].length;i++)
                        args.push(params['successParameters'][i]);
                    params['success'].apply(this, args);
                }
            });
        }


        // This function creates a new substrate graph in tulip, initializes, 
        // returns and displays it.
        // json, the initial json string corresponding to the graph.
        this.createTulipGraph = function (json) {
            params = {
                type: "creation",
                graph: json
            }
            __g__.sendQuery({
                parameters: params,
                async: false,
                success: objectReferences.UpdateViewsObject
                    .buildGraphFromData
            });
        }


        // This function calls through tulip the analysis of a substrate graph, 
        // stores and displays it in the catalyst view, updating the new 
        // entanglement indices computed.
        this.analyseGraph = function () {
            var params = {
                sid: contxt.sessionSid,
                type: 'analyse',
                target: 'substrate',
                weight: contxt.substrateWeightProperty
            }
            __g__.sendQuery({
                parameters: params,
                success: objectReferences.UpdateViewsObject
                    .applySubstrateAnalysisFromData
            });
        }


        // This function send to the tulip server a selection of nodes and 
        // removes the unselected nodes
        // json, the json string of the graph
        // graphName, the string value corresponding to the graph
        this.sendSelection = function (json, graphName) {
            var updateParams = {
                type: "induced"
            };
            var params = {
                sid: contxt.sessionSid,
                type: "update",
                parameters: JSON.stringify(updateParams),
                graph: json,
                target: graphName
            }
            __g__.sendQuery({
                parameters: params,
                success: function (data) {
                    objectReferences.UpdateViewsObject.applyInducedSubGraphFromData(data, graphName);
                }
            });
        };


        // This function calls a layout algorithm of a graph through tulip, 
        // and moves the given graph accordingly
        // layoutName, the name of the tulip layout we want to call
        // graphName, the string value corresponding to the graph
        this.callLayout = function (layoutName, graphName) {

            //save for undo
            var data_save = {nodes : TP.Context().getViewGraph(graphName).nodes(), links : TP.Context().getViewGraph(graphName).links()};
            var undo = function(){objectReferences.UpdateViewsObject.applyLayoutFromData(data_save, graphName);}
            
            var layoutParams = {
                type: "layout",
                name: layoutName,
                target: graphName
            };
            var params = {
                sid: contxt.sessionSid,
                type: 'algorithm',
                parameters: JSON.stringify(layoutParams)
            };

            __g__.sendQuery({
                parameters: params,
                success: function (data) {
                    objectReferences.UpdateViewsObject.applyLayoutFromData(data, graphName);
                
                    var redo = function(){objectReferences.UpdateViewsObject.applyLayoutFromData(data, graphName);}
                    contxt.changeStack.addChange("callLayout", undo, redo);
                    undo = null;
                    redo = null;
                }
            });
        };


        this.updateLayout = function (graphName, json) {
            json = JSON.stringify({
                nodes: TP.Context().graph_catalyst.nodes()
            })
            var updateParams = {
                type: "layout",
                target: graphName,
                graph: json
            };
            var params = {
                sid: contxt.sessionSid,
                type: 'update',
                parameters: JSON.stringify(updateParams)
            };

            __g__.sendQuery({
                parameters: params,
                success: function (data) {}
            });
        };


        // This function calls a float algorithm of a graph through tulip, 
        // and moves the given graph accordingly
        // floatAlgorithmName, the name of the tulip algorithm we want to call
        // graphName, the string value corresponding to the graph
        this.callFloatAlgorithm = function (floatAlgorithmName, graphName) {

            var floatParams = {
                type: "float",
                name: floatAlgorithmName,
                target: graphName
            };
            var params = {
                sid: contxt.sessionSid,
                type: 'algorithm',
                parameters: JSON.stringify(floatParams)
            }

            __g__.sendQuery({
                parameters: params,
                success: function (data) {
                    objectReferences.UpdateViewsObject.applyFloatAlgorithmFromData(data, graphName);
                }
            });
        }


        // This function calls the synchronization from a given graph through 
        // tulip, returns and applies the result on the other graph. The 
        // computed entanglement indices are also updated.
        // selection, the JSON string of the selected subgraph
        // graphName, the graph origin of the selection
        this.syncGraph = function (selection, graphName) {

            var syncTarget = graphName;

            if (graphName == 'combined')
                syncTarget = contxt.combined_foreground;

            var params = {
                sid: contxt.sessionSid,
                type: 'analyse',
                graph: selection,
                target: syncTarget,
                operator: contxt.catalyst_sync_operator,
                weight: contxt.substrateWeightProperty
            }

            __g__.sendQuery({
                parameters: params,
                async: false,
                success: function (data) {
                    objectReferences.UpdateViewsObject.syncGraphRequestFromData(data, selection, graphName);
                }
            });
        }


        this.syncLayouts = function (async) {
		if(async !== false)
            async = true;

            var syncLayoutParams = {
                type: "synchronize layouts",
                name: "synchronize layouts"
            };
            var params = {
                sid: contxt.sessionSid,
                type: 'algorithm',
                parameters: JSON.stringify(syncLayoutParams)
            };

            __g__.sendQuery({
                parameters: params,
                async:async,
                success: objectReferences.UpdateViewsObject.syncLayoutsFromData
            });
        };


        // This method returns the nodes that are selected in a given graph.
        // graphName, the string value corresponding to the graph we want to 
        // select nodes in ('substrate' or 'catalyst')
        // After selected all 'g.node' of class 'selected', the function 
        // constructs and array of nodes with only its 'baseID'
        // and returns a string JSON version of the corresponding selection
        this.getSelection = function (graphName) {
            var cGraph = null;
            var svg = null;
            svg = contxt.getViewSVG(graphName);
            cGraph = contxt.getViewGraph(graphName);
            var u = svg.selectAll("g.node.selected").data();

            var toStringify = {};
            toStringify.nodes = new Array();

            for (i = 0; i < u.length; i++) {
                var node = {};
                node.baseID = u[i].baseID;
                toStringify.nodes.push(node);
            }
            return JSON.stringify(toStringify);
        };

        return __g__;
    }
    return {Client: Client};
})()
