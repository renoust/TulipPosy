/**************************************************************************
 * A basic graph container built on ideas borrowed from d3.layout.force
 * This container stores basically a list of nodes and links and binds
 * them together
 * @requires jQuery
 * @authors Benjamin Renoust, Guy Melancon
 * @created May 2012
 **************************************************************************/

var TP = TP || {};
(function () {

    // This class can be called with 'new' to create independant instances
    // with deep copies of the links and nodes
    var Graph = function () {
        // g, the return variable
        // nodes_array, the array containing the list of nodes
        // links_array, the array containing the list of links
        var g = this;

        this.nodes_array = [];
        this.links_array = [];
        this.type;
        this.multiplexLinks = 0;

        // setter/getter (with/without argument) of the node array 
        // x: an array of nodes
        // a deep copy is made using jQuery
        this.nodes = function (x, type) {
            if (!arguments.length)
                return g.nodes_array;
            g.nodes_array = [];
            x.forEach(function (d) {
                d._type = type;
                g.nodes_array.push(jQuery.extend(true, {}, d));
            });
            g.nodes_array.sort(function (a, b) {
                return a.baseID - b.baseID;
            });
            return g.nodes_array;
        };


        this.addNodes = function (x, type) {
            x.forEach(function (d) {
                if (type != null)
                    d._type = type;
                g.nodes_array.push(jQuery.extend(true, {}, d));
            });
            g.nodes_array.sort(function (a, b) {
                return a.baseID - b.baseID;
            });
            return g.nodes_array;
        };

        this.updateNodes = function (nodes, updateExisting) {
            var newArray = [];
            nodes.sort(function (a, b) {
                return a.baseID - b.baseID;
            });
            if (nodes.length != g.nodes_array.length) {
                assert(false, "updateNodes, cannot match both arrays, what should I do?");
            }

            g.nodes_array.forEach(function (d, i) {
                for (var key in nodes[i]) {
                    if (updateExisting || !(key in d)) {
                        d[key] = nodes[i][key];
                    }
                }
            });

        };

        this.subsetNodes = function (nodes, type) {
            var newArray = [];
            var baseIDArray = [];
            nodes.forEach(function (n) {
                baseIDArray.push(n.baseID);
            });

            g.nodes_array.forEach(function (d, i) {
                if (baseIDArray.indexOf(d.baseID) != -1) {
                    if (d._type == type)
                        newArray.push(d);
                }
            });

            g.nodes_array = newArray;
            return g.nodes_array;
        };


        this.subsetLinks = function (links, type) {
            var newArray = [];
            var baseIDArray = [];
            links.forEach(function (n) {
                baseIDArray.push(n.baseID);
            });

            g.links_array.forEach(function (d, i) {
                if (baseIDArray.indexOf(d.baseID) != -1) {
                    if (d._type == type)
                        newArray.push(d);
                }
            });

            g.links_array = newArray;
            return g.links_array;
        };

        this.updateNodeAttributes = function (nodes, _attributes, updateExisting) {
            //attributes should be of the form [{in:name_in, out:name_out}], out is optional
            var newArray = [];
            nodes.sort(function (a, b) {
                return a.baseID - b.baseID;
            });
            if (nodes.length != g.nodes_array.length) {
                assert(false, "updateNodes, cannot match both arrays, what should I do?");
            }

            g.nodes_array.forEach(function (d, i) {
                //for safety maybe should we check the baseIDs of each part
                for (var j = 0; j < _attributes.length; j++)//nodes[i])
                {
                    var keys = _attributes[j];
                    //assert(true, "attributes");
                    //console.log(keys, _attributes)
                    var keyIn = keys["in"];
                    if (keyIn in nodes[i]) {
                        var keyOut = keyIn;
                        if ("out" in keys)
                            keyOut = keys["out"];

                        if (updateExisting || !(keyOut in d)) {
                            d[keyOut] = nodes[i][keyIn];
                        }
                    }
                }
            });

        };


        this.updateLinkAttributes = function (links, _attributes, updateExisting) {
            //attributes should be of the form [{in:name_in, out:name_out}], out is optional

            var newArray = [];
            links.sort(function (a, b) {
                return a.baseID - b.baseID;
            });
            if (links.length != g.links_array.length) {
                assert(false, "updateLinks, cannot match both arrays, what should I do?");
            }

            g.links_array.forEach(function (d, i) {

                var end = _attributes.length;

                for (var j = 0; j < end; j++)//nodes[i])
                {
                    var keys = _attributes[j];
                    var keyIn = keys["in"];
                    if (keyIn in links[i]) {
                        var keyOut = keyIn;
                        if ("out" in keys)
                            keyOut = keys["out"];

                        if (keyOut != "source" && keyOut != "target" && (updateExisting || !(keyOut in d))) {
                            d[keyOut] = links[i][keyIn];
                        }
                    }
                }

            });

        };


        this.updateLinks = function (links, updateExisting) {
            var newArray = [];
            links.sort(function (a, b) {
                return a.baseID - b.baseID;
            });
            if (links.length != g.links_array.length) {
                assert(false, "updateLinks, cannot match both arrays, what should I do?");
            }

            g.links_array.forEach(function (d, i) {
                for (var key in links[i]) {
                    if (key != "source" && key != "target" && (updateExisting || !(key in d))) {
                        d[key] = links[i][key];
                    }
                }
            });

        };


        // setter/getter (with/without argument) of the link array
        // x: an array of links
        // a deep copy is made using jQuery
        this.links = function (x, type) {
            if (!arguments.length)
                return g.links_array;
            //console.log("Reassigning edges");

            g.links_array = [];
            x.forEach(function (d) {
                g.links_array.push(jQuery.extend(true, {}, d));
                var o = g.links_array[g.links_array.length - 1];
                if (type) o._type = type;
                if (typeof o.source != "number" && typeof o.source != "string")
                //object already bounded
                    o.source = o.source.baseID;
                if (typeof o.target != "number" && typeof o.target != "string")
                //object already bounded
                    o.target = o.target.baseID;
            });
            g.links_array.sort(function (a, b) {
                return a.baseID - b.baseID;
            });
            return g.links_array;
        };


        this.addLinks = function (x, type) {
            x.forEach(function (d) {
                if (type != null)
                    d._type = type;
                d.source = d.source.baseID;
                d.target = d.target.baseID;
                g.links_array.push(jQuery.extend(true, {}, d));
            });
            g.links_array.sort(function (a, b) {
                return a.baseID - b.baseID;
            });
            return g.links_array;
        };
                
        this.updateMultiplexLinks = function()
        {

                function Object_keys(obj) {
                    var keys = [],
                        name;
                    for (name in obj) {
                        if (obj.hasOwnProperty(name)) {
                            keys.push(name);
                        }
                    }
                    return keys;
                };
          
          g.multiplexLinks = 0;
          g.links_array.forEach(function(l){
              if(l["descriptors"] != undefined && l["descriptors"] != "")
              {
                  var dList = l["descriptors"].split(';');
                  if (dList)
                  {
                      g.multiplexLinks += dList.length;
                  }
              }
              
          });
          return g.multiplexLinks;  
        };
            


        // this function needs to be called to bind the connected nodes to each
        // link. Each links is associated to a pair of nodes by there id, we 
        // use the property baseID
        // we first create an associated map for each node to its baseID
        // we then replace if exists each link 'source' and 'target' property 
        // by the node object associated to the given baseID number 
        this.edgeBinding = function () {
            var n = g.nodes_array.length,
                m = g.links_array.length,
                o = {};

            for (var i = 0; i < n; ++i) {
                var node = g.nodes_array[i];
                if (!(node._type in o))
                    o[node._type] = {};
                o[node._type][node.baseID] = node;
            }
            ;

            for (i = 0; i < m; ++i) {
                var l = g.links_array[i];
                //assert(false, "edge")
                if (typeof l.source == "number") {
                    l.source = o[l._type][l.source];
                }
                if (typeof l.target == "number") l.target = o[l._type]
                    [l.target];
            }
            //console.log("The binding: ", g.links_array);
        };


        this.specialEdgeBinding = function (sourceType, targetType) {
            var n = g.nodes_array.length,
                m = g.links_array.length,
                o = {};

            for (var i = 0; i < n; ++i) {
                var node = g.nodes_array[i];
                if (!(node._type in o))
                    o[node._type] = {};
                o[node._type][node.baseID] = node;
            }
            ;

            for (i = 0; i < m; ++i) {
                var l = g.links_array[i];
                if (typeof l.source == "number") {
                    l.source = o[sourceType][l.source];
                }
                if (typeof l.target == "number") l.target = o[targetType]
                    [l.target];
            }
            //console.log("The binding: ", g.links_array);
        };


        // previous binding based on indexing (d3.force) inspired
        // the principle is the same, but the index are given by the node 
        // position 
        // its the array
        this.edgeBindingIncrementalIndex = function () {
            var n = g.nodes_array.length,
                m = g.links_array.length,
                o;

            for (var i = 0; i < n; ++i) {
                (o = g.nodes_array[i])
                    .index = i;
                o.weight = 0;
            }

            for (i = 0; i < m; ++i) {
                o = g.links_array[i];
                if (typeof o.source == "number")
                    o.source = g.nodes_array[o.source];
                if (typeof o.target == "number")
                    o.target = g.nodes_array[o.target];
            }
        };
                
        this.opposite= function (sourceNode, sourceLink)
        {
            if (sourceLink.source == sourceNode)
                return sourceLink.target;
            if (sourceLink.target == sourceNode)
                return sourceLink.source;
            return null;
        };
        
        this.neighborhood = function (sourceNode){
            var m = g.links_array.length;
            var returnLinks = [];
            var returnNodes = [];
            for(var i =0; i<m; ++i){
               o = g.links_array[i];
               if (o.source == sourceNode || o.target == sourceNode)
               {
                    returnLinks.push(o);
                    returnNodes.push(g.opposite(sourceNode,o));
               } 
            }
            return {nodes:returnNodes, links:returnLinks};
        };


        return g;
    };
    TP.Graph = Graph;
})(TP);
