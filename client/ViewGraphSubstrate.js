//pile de gestion d'Etat

var TP = TP || {};
(function () {

    // {id:id, name:name, type:type, idSourceAssociatedView:idSourceAssociatedView, interactorList:interactorList}
    var ViewGraphSubstrate = function (parameters) {
        
        //id, bouton, name, nodeColor, linkColor, backgroundColor, labelColor, nodeShape, type, idAssociation
        var __g__ = this;
        
        
        var paramSizeMap = [
            [4, 
                {id:"sizemap"},
                {
                    range: true,
                    min: 0,
                    max: 99,
                    values: [ 3, 12 ]
                },
                "scale: "
            ]
        ];
    
        var tl = [
            [3,{id:"selectedAlgo"}]
        ];

        //var tulipLayout = ["3-Connected (Tutte)", "Balloon (OGDF)", "Bubble Tree", "Circular", "Circular (OGDF)", "Cone Tree", "Connected Component Packing", "Connected Component Packing (Polyomino)", "Davidson Harel (OGDF)", "Dendrogram", "Dominance (OGDF)", "FM^3 (OGDF)", "Fast Multipole Embedder (OGDF)", "Fast Multipole Multilevel Embedder (OGDF)", "Fast Overlap Removal", "Frutcherman Reingold (OGDF)", "GEM (Frick)", "GEM Frick (OGDF)", "GRIP", "Hierarchical Graph", "Hierarchical Tree (R-T Extended)", "Improved Walker", "Improved Walker (OGDF)", "Kamada Kawai (OGDF)", "LinLog", "MMM Example Fast Layout (OGDF)", "MMM Example Nice Layout (OGDF)", "MMM Example No Twist Layout (OGDF)", "Mixed Model", "Perfect aspect ratio", "Planarization Grid (OGDF)", "Random layout", "Squarified Tree Map", "Stress Majorization (OGDF)", "Sugiyama (OGDF)", "Tree Leaf", "Tree Radial", "Upward Planarization (OGDF)", "Visibility (OGDF)"]
        var tulipLayouts = [
            [7,{id:"algoTulip"},
                {
                    source: function(searchStr, sourceCallback){
                        var algorithmList = []
                        for (var algo in TP.Context().tulipLayoutAlgorithms)
                        {
                           var patt = new RegExp(searchStr.term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i')
                           var isAlgo = patt.test(algo);
                           if (isAlgo) algorithmList.push(algo);
                        }
                        sourceCallback(algorithmList);
                    },
                    minLength: 0
                }]];

        var tulipMetrics = [
            [7,{id:"algoTulip"},
                {
                    source: function(searchStr, sourceCallback){
                        var algorithmList = []
                        for (var algo in TP.Context().tulipDoubleAlgorithms)
                        {
                            var patt = new RegExp(searchStr.term.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i')
                            var isAlgo = patt.test(algo);
                            if (isAlgo) algorithmList.push(algo);
                        }
                        sourceCallback(algorithmList);
                    },
                    minLength: 0
                }]];
    
        var colorSettings = [
            [1,{id:"color"},[
                {id:"cnodes", name:"color", class:"colorwell", text:"Nodes Color"},
                {id:"clinks", name:"color", class:"colorwell", text:"Links Color"},
                {id:"cbg", name:"color", class:"colorwell", text:"Background Color"},
                {id:"clabels", name:"color", class:"colorwell", text:"Labels Color"}]
            ],
            [6,{id:"picker"},{class:"colorwell"},null,null,{func:TP.Context().VisualizationObject.changeColor}]
        ];
        
        var setting = [
            [4, {id:"fontsize"},
                {
                    min: 0,
                    max: 99,
                    values: 12
                },
                "Labels size:"
            ],
            [6,{id:"npicker"},{class:"colorwell"},null,null,{func:TP.Context().VisualizationObject.changeColor}]]
        /*
        var tabCatalyst = [1,//__g__.getID(), 
                        null,
                       name + " - catalyst", 
                       "#4682b4", 
                       "#808080", 
                       "#FFFFFF", 
                       "#000000", 
                       "circle", 
                       "catalyst"];
        */

        /*var bigtest = [[0, {id:"select"}, [{value:"opt1", text:"option1"},{value:"opt2",text:"option2"}],"b","a"],
            [1, {id:"radio"},[{name:"alpha",value:"2", text:"bravo"},{name:"alpha",value:"3",text:"charlie"}],"b","a"],
            [2, {id:"checkbox"},[{name:"letter",value:"4", text:"delta"},{name:"alpha",value:"5",text:"epsilon"}],"b","a"],
            [3, {id:"text"},null,"b","a"],
            [5, {id:"spinner"},null,"b","a"],
            [4,{id:'slider',class:'slider'},
                {   range: true,
                    min: 0,
                    max: 99,
                    values: [ 3, 12 ],
                },"b","a"]
            ];*/
        var path = $('#files').val().split('\\');
        var name = path[path.length - 1].split('.')[0];
        if(name){
            name = name + ' - ';
        }
        var _viewGraphCatalystParameters = {
            name:name + " catalyst", 
            nodeColor:"#4682b4", 
            linkColor:"#808080", 
            backgroundColor:"#FFFFFF", 
            labelColor:"#000000", 
            nodeShape:"circle", 
            type:"catalyst"
        }
        
        
        var interactors = [
            //{interactorLabel:'TEST', interactorParameters: bigtest, callbackBehavior:null},
            {interactorLabel:'Force layout', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage('callLayout', {layoutName: 'FM^3 (OGDF)', idView: __g__.getID()})
            }}, interactorGroup:"Layout"},
            {interactorLabel:'MDS layout', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage('callLayout', {layoutName: 'MDS', idView: __g__.getID()})
            }}, interactorGroup:"Layout"},
            /*{interactorLabel:'Tulip layout algorithm', interactorParameters:tl, callbackBehavior:{call: function (layout) {
                __g__.getController().sendMessage('callLayout', {layoutName: layout.selectedAlgo, idView: __g__.getID()})
            }}, interactorGroup:"Layout"},
            {interactorLabel:'Tulip layout list',interactorParameters:'',callbackBehavior:{click:function(){
                __g__.getController().sendMessage('getPlugins', {pluginType:"layout", endHandler:TP.Context().updateTulipLayoutAlgorithms}, 'principal')
            }}, interactorGroup:"Layout"},*/
            {interactorLabel:'Tulip layout algorithm',interactorParameters:tulipLayouts,callbackBehavior:{
                //click:function(){console.log('click on the button');},
                call:function(layout){
                    __g__.getController().sendMessage('changeLayout', {layoutName:layout.algoTulip, idView: TP.Context().activeView})
            }}, interactorGroup:"Layout"},
            {interactorLabel:'Align layout from catalysts', interactorParameters: '', callbackBehavior: {click: function () {
                TP.ObjectReferences().ClientObject.syncLayouts(__g__.getID())
            }}, interactorGroup:"Layout"},


            {interactorLabel:'Toggle selection', interactorParameters: '', callbackBehavior: {click: function () {
                TP.ObjectReferences().InteractionObject.toggleSelection(__g__.getID())
            }}, interactorGroup:"Selection"},
            {interactorLabel:'Induced subgraph', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("sendSelection", {json: TP.ObjectReferences().ClientObject.getSelection(__g__.getID()), idView: __g__.getID()})
            }}, interactorGroup:"Selection"},
            {interactorLabel:'Delete selection', interactorParameters: '', callbackBehavior: {click: function () {
                TP.ObjectReferences().InteractionObject.delSelection(__g__.getID())
            }}, interactorGroup:"Selection"},

            {interactorLabel:'Center view', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage('resetView');
            }}, interactorGroup:"View"},
            {interactorLabel:'Reset size', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("resetSize")
            }}, interactorGroup:"View"},
            {interactorLabel:'Hide labels', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("Hide labels")
            }}, interactorGroup:"View"},
            {interactorLabel:'Hide links', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("Hide links")
            }}, interactorGroup:"View"},
            {interactorLabel:'Arrange labels', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("arrangeLabels")
            }}, interactorGroup:"View"},
            {interactorLabel:'Rotation', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("rotateGraph")
            }}, interactorGroup:"View"},
            {interactorLabel:'Size mapping', interactorParameters: paramSizeMap, callbackBehavior: {call: function (scales) {
                __g__.getController().sendMessage("sizeMapping", {parameter: 'viewMetric', idView: TP.Context().activeView, scales: scales})
            }}, interactorGroup:"View"},
            {interactorLabel:'Zoom in', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("runZoom", {wheelDelta: 120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
            }}, interactorGroup:"View"},
            {interactorLabel:'Zoom out', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("runZoom", {wheelDelta: -120, mousePos: [TP.Context().width / 2, TP.Context().height / 2]})
            }}, interactorGroup:"View"},
            {interactorLabel:'Color settings', interactorParameters: colorSettings,callbackBehavior:null, interactorGroup:"View"},
            /*{interactorLabel:'Nodes settings', interactorParameters: setting, callbackBehavior:{call: function (value) {
                 __g__.getController().sendMessage("changeNodesSettings", {value: value, idView: __g__.getID()})
            }}, interactorGroup:"View"},*/

            {interactorLabel:'Degree', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Degree', idView: __g__.getID()})
            }}, interactorGroup:"Measure"},
            {interactorLabel:'Betweenness centrality', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: 'Betweenness Centrality', idView: __g__.getID()})
            }}, interactorGroup:"Measure"},

            {interactorLabel:'Tulip measure',interactorParameters:tulipMetrics,callbackBehavior:{
                //click:function(){console.log('click on the button');},
                call:function(algo){
                    __g__.getController().sendMessage("callFloatAlgorithm", {floatAlgorithmName: algo.algoTulip, idView: __g__.getID()})
                }}, interactorGroup:"Measure"},

            {interactorLabel:'Bipartite analysis', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("analyseGraph", (function(){
                    var params = __g__.viewGraphCatalystParameters()
                    params.idSourceAssociatedView = __g__.getID();
                    return {viewIndex: __g__.getID(), 
                            viewGraphCatalystParameters: params}
                     })())
            }}, interactorGroup:"Open View"},

            {interactorLabel:'Scatter plot (nvd3)', interactorParameters:'', callbackBehavior:{click: function () {
                __g__.getController().sendMessage("drawScatterPlotNVD3")
            }}, interactorGroup:"Open View"},

            {interactorLabel:'Spreadsheet (experimental)', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("drawDataBase")
            }}, interactorGroup:"Open View"},


            {interactorLabel:'Barchart (experimental)', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("drawBarChart", {smell: 'rotate'})
            }}, interactorGroup:"Open View"},

            {interactorLabel:'Horizontal barchart (experimental)', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("drawBarChart", {smell: 'base'})
            }}, interactorGroup:"Open View"},

            {interactorLabel:'Scatter plot (experimental)', interactorParameters: '', callbackBehavior: {click: function () {
                __g__.getController().sendMessage("drawScatterPlot")
            }}, interactorGroup:"Open View"}
            // ['b3','circular layout','',{click:function(){TP.ObjectReferences().ClientObject.callLayout('Circular', __g__.getID())}}],
            // ['b5','random layout','',{click:function(){TP.ObjectReferences().ClientObject.callLayout('Random', __g__.getID())}}],        
            // ['b13','node information','',{click:function(){TP.ObjectReferences().InterfaceObject.attachInfoBox()}}],
            // ['b16','labels forward','',{click:function(){TP.ObjectReferences().VisualizationObject.bringLabelsForward(__g__.getID())}}],
        ]
        
        parameters.interactorList = interactors;
            
        var __g__ = new TP.ViewGraph(parameters);
       
       
        __g__.viewGraphCatalystParameters = function()
        {
            return _viewGraphCatalystParameters;
        }

        
        __g__.initStates = function () {

            __g__.controller.addEventState("movingZoomDrag",  function (_event) {
                TP.Interaction().movingZoomDrag(_event);
            }, {bindings:["movingZoomDragEnd", "movingZoomDrag"], fromAll:null, useless:null, activate:true});
            __g__.controller.addEventState("movingZoomDragEnd",  function (_event) {
                TP.Interaction().movingZoomDragEnd(_event);
            }, {bindings:["movingZoomDrag"], fromAll:null, useless:null, activate:true});


            __g__.controller.addEventState("callLayout",  function (_event) {
                TP.Client().callLayout(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("AnswerCallLayout",  function (_event) {
                TP.Client().AnswerCallLayout(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("sendSelection",  function (_event) {
                TP.Client().sendSelection(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("answerSendSelection",  function (_event) {
                TP.Client().answerSendSelection(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("resetView",  function (_event) {
                TP.Visualization().resetView(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("callFloatAlgorithm",  function (_event) {
                TP.Client().callFloatAlgorithm(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("AnswerFloatAlgorithm",  function (_event) {
                TP.Client().AnswerFloatAlgorithm(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("analyseGraph",  function (_event) {
                TP.Client().analyseGraph(_event);
            }, {bindings:["all"], fromAll:true, useless:null, activate:true});
            __g__.controller.addEventState("answerAnalyseGraph",  function (_event) {
                TP.Client().answerAnalyseGraph(_event);
            }, {bindings:["all"], fromAll:true, useless:null, activate:true});

            __g__.controller.addEventState("resetSize",  function (_event) {
                TP.Visualization().resetSize(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("Hide labels",  function (_event) {
                TP.Visualization().showhideLabels(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("Hide links",  function (_event) {
                TP.Visualization().showhideLinks(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("rotateGraph",  function (_event) {
                TP.Visualization().rotateGraph(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("drawBarChart",  function (_event) {
                TP.BarChart().drawBarChart(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});
            __g__.controller.addEventState("drawScatterPlot",  function (_event) {
                TP.ScatterPlot().drawScatterPlot(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("drawScatterPlotNVD3",  function (_event) {
                TP.ViewNVD3().drawScatterPlot(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("runZoom",  function (_event) {
                TP.Interaction().runZoom(_event);
            });
            __g__.controller.addEventState("sizeMapping",  function (_event) {
                TP.Visualization().sizeMapping(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("dragNode",  function (_event) {
                TP.Context().view[_event.associatedData.source].getGraphDrawing().dragNode(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("showHideLabelNode",  function (_event) {
                TP.Context().view[_event.associatedData.source].getGraphDrawing().showHideLabelNode(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("mouseoverShowLabelNode",  function (_event) {
                TP.Context().view[_event.associatedData.source].getGraphDrawing().showLabelNode(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("mouseOutNode",  function (_event) {
                TP.Context().view[_event.associatedData.source].getGraphDrawing().mouseOutNode();
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("brushstart",  function (_event) {
                TP.Interaction().brushstart(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true});

            __g__.controller.addEventState("updateOtherView",  function(_event){
                console.log("avant otherViews : source = ", _event.associatedData.source, " target : ", _event.associatedData.target, " data : ", _event.associatedData.data, " type : ", _event.associatedData.type);
                __g__.updateOtherViews(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true})        
            
            __g__.controller.addEventState("updateView",  function(_event){
                console.log("avant updateViewGraph : source = ", _event.associatedData.source, " target : ", _event.associatedData.target, " data : ", _event.associatedData.data, " type : ", _event.associatedData.type);
                __g__.updateEventHandler.treatUpdateEvent(_event); __g__.updateOtherViews(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true})
            
            __g__.controller.addEventState("drawDataBase",  function(_event){
                TP.Visualization().drawDataBase(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true})

            __g__.controller.addEventState("changeNodesSettings", function(_event){
                TP.Visualization().changeNodesSettings(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true})

            __g__.controller.addEventState("changeLayout", function(_event){
                TP.Visualization().tulipLayout(_event);
            }, {bindings:null, fromAll:true, useless:true, activate:true})

            __g__.controller.setCurrentState("select");


        }




        return __g__;
    }

    TP.ViewGraphSubstrate = ViewGraphSubstrate;
})(TP);