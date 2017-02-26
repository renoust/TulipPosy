/************************************************************************
 * @file updateViews.js
 * This module updates the graph views by drawing a new graph from a
 * given set of data
 * @requires d3.js
 * @authors Benjamin Renoust, Guy Melancon
 * @created May 2012
 ***********************************************************************/

var TP = TP || {};
(function () {


    var UpdateViews = function () {
        var __g__ = this;

        var contxt = TP.Context();
        var objectReferences = TP.ObjectReferences();


        this.syncLayoutsFromData = function (data, viewID) {

            var target = viewID;

            var cGraph = null;
            var svg = null;

            cGraph = TP.Context().view[viewID].getGraph(); //substrate before generic code

            svg = TP.Context().view[viewID].getSvg(); //substrate...


            // we need to rescale the graph so it will fit the current svg 
            //frame and wont overlap with the buttons
            //objectReferences.VisualizationObject.rescaleGraph(data);

            //graph_drawing.rescaleGraph(contxt,data);
            var typeGraph = TP.Context().view[viewID].getType();

            //cGraph.nodes(data.nodes, typeGraph);
            cGraph.updateNodeAttributes(data.nodes, [
                {'in': 'x'},
                {'in': 'y'}
            ], true);

            var cView = TP.Context().view[viewID]; 
            cView.getGraphDrawing().clear();
            cView.getGraphDrawing().draw();
            cView.getGraphDrawing().rescaleGraph(cGraph, cView.dialog.dialog().width(), cView.dialog.dialog().height());
            cView.getGraphDrawing().changeLayout(cGraph, 0);


            var newGraph = JSON.parse(data.data.graph);
            var newLinks = newGraph.links;


            var combinedGraph = null;

            if (TP.Context().view[viewID].getAssociatedView("combined")
                && TP.Context().view[viewID].getAssociatedView("combined")[0].getGraph() != null) {
                var tmp = TP.Context().view[viewID].getAssociatedView("combined");
                combinedGraph = tmp[0].getGraph();
            }

            if (combinedGraph) {
                combinedGraph.nodes(TP.Context().tabGraph["graph_substrate"].nodes(), "substrate");
                combinedGraph.addNodes(TP.Context().tabGraph["graph_catalyst"].nodes());
                combinedGraph.links(newLinks);
                combinedGraph.specialEdgeBinding("substrate", "catalyst");
            }
            

            /*********** TO BE REDONE

             var p1_s = data.data[viewID][0];
             var p2_s = data.data[viewID][1];
             var p1prime_s;
             var p2prime_s;



             TP.Context().tabGraph["graph_"+viewID].nodes().forEach(function (d) {
                if (d.baseID == p1_s.baseID) {
                    p1prime_s = d;
                }
                if (d.baseID == p2_s.baseID) {
                    p2prime_s = d;
                }
            });
             var delta = 0.0000000000000001;
             var scaleX_s = (p2prime_s.x-p1prime_s.x) / (p2_s.x-p1_s.x+delta)
             var scaleY_s = (p2prime_s.y-p1prime_s.y) / (p2_s.y-p1_s.y+delta)

             var deltaX_s = p2prime_s.x - p2_s.x * scaleX_s
             var deltaY_s = p2prime_s.y - p2_s.y * scaleY_s

             var p1_c = data.data['catalyst'][0];
             var p2_c = data.data['catalyst'][1];
             var p1prime_c;
             var p2prime_c;
             assert(false, "here 3")


             TP.Context().tabGraph["graph_catalyst"].nodes()
             .forEach(function (d) {
                if (d.baseID == p1_c.baseID) {
                    p1prime_c = d;
                }
                if (d.baseID == p2_c.baseID) {
                    p2prime_c = d;
                }
            });
             delta = 0.0000000000000001

             var scaleX_c = (p2prime_c.x-p1prime_c.x) / (p2_c.x-p1_c.x+delta)
             var scaleY_c = (p2prime_c.y-p1prime_c.y) / (p2_c.y-p1_c.y+delta)
             var deltaX_c = p2prime_c.x - p2_c.x * scaleX_c
             var deltaY_c = p2prime_c.y - p2_c.y * scaleY_c


             if(combinedGraph)
             {
                 TP.Context().tabGraph["graph_combined"].nodes()
                     .forEach(function (nprime) {
                     if (nprime._type == viewID) {
                         var newX = ((nprime.x-deltaX_s)/scaleX_s)*scaleX_c+deltaX_c;
                         nprime.x = newX;
                         var newY = ((nprime.y-deltaY_s)/scaleY_s)*scaleY_c+deltaY_c;
                         nprime.y = newY;
                     };
                 });

                 var graph_drawing = TP.GraphDrawing(TP.Context().tabGraph["graph_combined"], TP.Context().view["combined"].getSvg(), "combined");
                 graph_drawing.clear();
                 graph_drawing.draw();
             }
             */


            //TP.ObjectReferences().VisualizationObject.nodeSizeMapping("entanglementIndex", viewID);
            //TP.Context().view[viewID].getController().sendMessage("sizeMapping", {parameter: 'entanglementIndex', idView: TP.Context().activeView});

            //TP.ObjectContext().TulipPosyVisualizationObject.arrangeLabels(viewID);
            TP.Controller().sendMessage("arrangeLabels", null, viewID, viewID);
            //TP.ObjectContext().TulipPosyVisualizationObject.arrangeLabels("catalyst");
            //if(TP.Context().view[viewID].getAssociatedView("catalyst")[0] != null){
            //    var getCatalyst = TP.Context().view[viewID].getAssociatedView("catalyst")[0];
            //    TP.Controller().sendMessage("arrangeLabels", null, getCatalyst, getCatalyst);
            //}

        };


        this.buildGraphFromData = function (data, target, forceLinks) { //substrate at bigin of project

            TP.Context().sessionSid = data.data.sid;
            //objectReferences.VisualizationObject.rescaleGraph(data)


            //TP.GraphDrawing(TP.Context().getViewGraph("substrate"),TP.Context().getViewSVG("substrate")).rescaleGraph(contxt,data);

            var typeGraph = TP.Context().view[target].getType();

            var graph = TP.Context().view[target].getGraph();

            graph.nodes(data.nodes, typeGraph); //substrate
            graph.links(data.links, typeGraph); //substrate

            TP.Context().view[target].getGraphDrawing().rescaleGraph(graph);

            graph.edgeBinding(); //...

            //graph_drawing.move(TP.Context().view[target].getGraph(), 0)
            TP.Context().view[target].getGraphDrawing().clear();
            TP.Context().view[target].getGraphDrawing().draw(forceLinks);


            //assert(true, "arrangeLabels appele dans buildgraph")
            //graph_drawing.arrangeLabels();
        };


        this.applySubstrateAnalysisFromData = function (data, target, multiplex_property) { //catalyst at bingin of project, without generic programmation
            //TP.GraphDrawing(TP.Context().view[target].getGraph(),TP.Context().view[target].getSvg(), target).rescaleGraph(data);

            //objectReferences.VisualizationObject.rescaleGraph(data)

            var typeGraph = TP.Context().view[target].getType();

            var graph = TP.Context().view[target].getGraph();

            data.nodes.forEach(function(d){
                if ("entanglementIndex" in d)
                {
                    d.entanglementIndex = objectReferences.ToolObject.round(d.entanglementIndex, TP.Context().digitPrecision);
                }
            });

            data['data']['entanglement homogeneity'] = objectReferences.ToolObject.round(data['data']['entanglement homogeneity'], TP.Context().digitPrecision);
            data['data']['entanglement intensity'] = objectReferences.ToolObject.round(data['data']['entanglement intensity'], TP.Context().digitPrecision);

            graph.nodes(data.nodes, typeGraph); //catalyst
            graph.links(data.links, typeGraph); //catalyst
            
            TP.Context().view[target].getGraphDrawing().rescaleGraph(graph);

            TP.Context().view[target].getGraph().edgeBinding();

            TP.Context().view[target].getGraphDrawing().clear();
            TP.Context().view[target].getGraphDrawing().draw();


            TP.Context().entanglement_homogeneity = objectReferences.ToolObject.round(data['data']['entanglement homogeneity'], TP.Context().digitPrecision);
            TP.Context().entanglement_intensity = objectReferences.ToolObject.round(data['data']['entanglement intensity'], TP.Context().digitPrecision);
            TP.Context().entanglement_homogeneity = 1 - Math.acos(TP.Context().entanglement_homogeneity)/(Math.PI/2);
            
            objectReferences.VisualizationObject.entanglementCaught(target, null, multiplex_property);
            TP.Context().view[target].getController().sendMessage("sizeMapping", {parameter:"entanglementIndex", idView: target});
        };


        this.applyLayoutFromData = function (data, graphName) {
            //assert(true, "here");;
            TP.Context().view[graphName].getGraph().updateNodeAttributes(data.nodes, [
                {'in': 'x'},
                {'in': 'y'}
            ], true);
            //assert(true, "there");
            //TP.Context().view[graphName].getGraph().updateLinkAttributes(data.links, true);
            //assert(true, "again");

            var graph = null;
            var svg = null;
            svg = TP.Context().view[graphName].getSvg();
            graph = TP.Context().view[graphName].getGraph();
            var cView = TP.Context().view[graphName];
            //TP.GraphDrawing(graph,svg,graphName).rescaleGraph(contxt,data);
            //objectReferences.VisualizationObject.rescaleGraph(data);
            //graph.nodes(data.nodes, graphName);
            //graph.links(data.links, graphName);
            //graph.edgeBinding();

            //cView.getGraphDrawing().rescaleGraph(graph);
            //graph_drawing.move(graph, 0);
            //TP.Context().view[graphName].getGraphDrawing().clear();
            //TP.Context().view[graphName].getGraphDrawing().draw();
            //cView.getGraphDrawing().changeLayout(graph, 0);
            cView.getGraphDrawing().rescaleGraph(graph, cView.dialog.dialog().width(), cView.dialog.dialog().height());
            cView.getGraphDrawing().changeLayout(graph, 0);
            
        };


        this.applyInducedSubGraphFromData = function (data, graphName, rescale) {
            var graph = null;
            var svg = null;

            if (!rescale)
                rescale = false;

            svg = TP.Context().view[graphName].getSvg();
            graph = TP.Context().view[graphName].getGraph();

            var typeGraph = TP.Context().view[graphName].getType();

            graph.subsetNodes(data.nodes, typeGraph);
            graph.subsetLinks(data.links, typeGraph);
            //graph.edgeBinding();

            TP.Context().view[graphName].getGraphDrawing().exit(graph, 0);

            if (rescale) {
                TP.Context().view[graphName].getGraphDrawing().rescaleGraph(graph);
                TP.Context().view[graphName].getGraphDrawing().clear();
                TP.Context().view[graphName].getGraphDrawing().draw();
            }

            var _viewGraphCatalystParameters = {
                name:name + " catalyst",
                nodeColor:TP.Context().defaulNodeColor,
                linkColor:TP.Context().defaultLinkColor,
                backgroundColor:TP.Context().defaultBackgroundColor,
                labelColor:TP.Context().defaultLabelColor,
                nodeShape:"circle",
                type:"catalyst"
            };

            TP.Context().view[graphName].getController().sendMessage("analyseGraph", (function(){
                var params = _viewGraphCatalystParameters;
                params.idSourceAssociatedView = graphName;
                return {viewIndex: graphName,
                    viewGraphCatalystParameters: params};
            })());
        };


        this.applyFloatAlgorithmFromData = function (data, graphName, attributeName, unsetViewMetric) {

            if (!attributeName)
                attributeName = "viewMetric";

            //assert(true, "here");;
            TP.Context().view[graphName].getGraph().updateNodeAttributes(data.nodes, [
                {'in': "viewMetric", 'out': attributeName}
            ], true);
            //assert(true, "there");
            TP.Context().view[graphName].getGraph().updateLinks(data.links, [
                {'in': "viewMetric", 'out': attributeName}
            ], true);
            //assert(true, "again");

            if (!unsetViewMetric)
            {
                TP.Context().view[graphName].getGraph().updateNodeAttributes(data.nodes, [
                    {'in': "viewMetric", 'out': "viewMetric"}
                ], true);
                //assert(true, "there");
                TP.Context().view[graphName].getGraph().updateLinks(data.links, [
                    {'in': "viewMetric", 'out': "viewMetric"}
                ], true);
            }


            var graph = null;
            var svg = null;

            svg = TP.Context().view[graphName].getSvg();
            graph = TP.Context().view[graphName].getGraph();


            //TP.GraphDrawing(graph,svg).rescaleGraph(contxt,data, graphName);

            //objectReferences.VisualizationObject.rescaleGraph(data);
            //graph.nodes(data.nodes, graphName);
            //graph.links(data.links, graphName);
            //graph.edgeBinding();

            TP.Context().view[graphName].getGraphDrawing().resize(graph, 0);


            var pileCentrality = new TP.Metric();

            /*
             var char = d3.selectAll("g.node.substrate");
             char.attr("x", function(d){ console.log("viewMetric : "+ d.viewMetric); pileCentrality.addMetric(d.viewMetric, d); return d.x; });


             TP.Context().metric_substrate_BC = pileCentrality.transformToArray("BarChart");
             TP.Context().metric_substrate_SP = pileCentrality.transformToArray("ScatterPlot");*/
            /*
             var char = d3.selectAll("#svg_"+graphName).selectAll("g.node."+TP.Context().view[graphName].getType());
             char.attr("x", function(d){

             //assert(false,d.viewMetric);
             pileCentrality.addMetric(d.viewMetric, d);
             return d.x;
             });*/

            pileCentrality.TreatmentAction(graphName, "viewMetric"/*,["Libye", "tolerance"]*/);


            TP.Context().view[graphName].setMetric_BC(pileCentrality.transformToArray("BarChart"));
            TP.Context().view[graphName].setMetric_SP(pileCentrality.transformToArray("ScatterPlot"));

        };


        this.syncGraphRequestFromData = function (data, selection, graphName, multiplex_property) {
            
                
            data.nodes.forEach(function(d){
                if ("entanglementIndex" in d)
                {
                    d.entanglementIndex = objectReferences.ToolObject.round(d.entanglementIndex, TP.Context().digitPrecision);
                    
                }
            });

            
            var graph = null;
            var svg = null;
            var targetView = null;

            var associatedViewFound = false;

            var typeGraph = TP.Context().view[graphName].getType();

            if (typeGraph == 'substrate' && TP.Context().view[graphName].getAssociatedView("catalyst") != null) {
                //if(TP.Context().view[graphName].getAssociatedView("catalyst")[0].viewInitialized() == 1){
                var tmp = null;

                for (var v in TP.Context().view[graphName].getAssociatedView("catalyst"))
                {
                    var cview = TP.Context().view[graphName].getAssociatedView("catalyst")[v];
                    if (cview.descriptors_property == multiplex_property)
                        tmp = cview
                }
                if (tmp != null)
                {
                    var tmpEvent = {};
                    tmpEvent.associatedData = {};
                    tmpEvent.associatedData.catalystList = {} ;
                    data.nodes.forEach(function (d) {
                        tmpEvent.associatedData.catalystList[d.label] = d.entanglementIndex;
                    });
                    TP.Interface().addCatalystList(tmpEvent);
                    graph = tmp.getGraph();
                    svg = tmp.getSvg();
                    associatedViewFound = true;
                    targetView = tmp.getID();
                    //}
                }
            }

            if (typeGraph == 'catalyst' && TP.Context().view[graphName].getAssociatedView("substrate") != null) {
                //if(TP.Context().view[graphName].getAssociatedView("substrate")[0].viewInitialized() == 1){
                var tmp = TP.Context().view[graphName].getAssociatedView("substrate");
                graph = tmp[0].getGraph();
                svg = tmp[0].getSvg();
                associatedViewFound = true;
                targetView = tmp[0].getID();
                // }
            }

            if ('data' in data) {

                if (typeGraph == "catalyst" || TP.Context().view[graphName].leapfrog_target == multiplex_property)
                {

                    data['data']['entanglement homogeneity'] = objectReferences.ToolObject.round(data['data']['entanglement homogeneity'], TP.Context().digitPrecision);
                    data['data']['entanglement intensity'] = objectReferences.ToolObject.round(data['data']['entanglement intensity'], TP.Context().digitPrecision);

                    TP.Context().entanglement_homogeneity = data['data']['entanglement homogeneity'];
                    TP.Context().entanglement_intensity = data['data']['entanglement intensity'];
                    TP.Context().entanglement_homogeneity = 1 - Math.acos(TP.Context().entanglement_homogeneity)/(Math.PI/2);
                
                    objectReferences.VisualizationObject.entanglementCaught(graphName, null, multiplex_property);
                }

            }

            if (associatedViewFound == false)
                return;

            var tempGraph = new TP.Graph();
            tempGraph.nodes(data.nodes, typeGraph);
            tempGraph.links(data.links, typeGraph);
            tempGraph.edgeBinding();


            if (typeGraph == 'catalyst') {
                TP.Context().syncNodes = [];
                data.nodes.forEach(function (d) {
                    TP.Context().syncNodes.push(d.baseID);
                });
            } else {
                TP.Context().syncNodes = undefined;
            }

            //sets the target view selection as a list of nodes 
            //(later we might want it to be graph)
            nodeList = [];
            data.nodes.forEach(function (d) {
                nodeList.push(d.baseID);
            });
            //assert(true, "SETTING VIEW TARGET SELECTION");
            //TP.Context().view[targetView].setTargetSelection(nodeList);


            //sets the target view selection as a list of nodes 
            //(later we might want it to be graph)
            //nodeList = [];
            //data.nodes.forEach(function (d) {
            //    nodeList.push(d.baseID);
            //});
            //assert(true, "SETTING VIEW TARGET SELECTION");
            TP.Context().view[targetView].setTargetSelection(nodeList);
            TP.Context().view[targetView].getGraphDrawing().show(tempGraph);



        };


        return __g__;
    };
    TP.UpdateViews = UpdateViews;
})(TP);
