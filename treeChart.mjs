import("../../redist/d3.v6.min.js").then(_ => {

  try3()

});



function try1() {
  const treeData = {
    "name": "Eve",
    "value": 15,
    "type": "black",
    "level": "yellow",
    "children": [
      {
        "name": "Cain",
        "value": 10,
        "type": "grey",
        "level": "red"
      },
      {
        "name": "Seth",
        "value": 10,
        "type": "grey",
        "level": "red",
        "children": [
          {
            "name": "Enos",
            "value": 7.5,
            "type": "grey",
            "level": "purple"
          },
          {
            "name": "Noam",
            "value": 7.5,
            "type": "grey",
            "level": "purple"
          }
        ]
      },
      {
        "name": "Abel",
        "value": 10,
        "type": "grey",
        "level": "blue"
      },
      {
        "name": "Awan",
        "value": 10,
        "type": "grey",
        "level": "green",
        "children": [
          {
            "name": "Enoch",
            "value": 7.5,
            "type": "grey",
            "level": "orange"
          }
        ]
      },
      {
        "name": "Azura",
        "value": 10,
        "type": "grey",
        "level": "green"
      }
    ]
  };
  
  // set the dimensions and margins of the diagram
  const margin = {top: 20, right: 90, bottom: 30, left: 90},
        width  = 660 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
  
  // declares a tree layout and assigns the size
  const treemap = d3.tree().size([height, width]);
  
  //  assigns the data to a hierarchy using parent-child relationships
  let nodes = d3.hierarchy(treeData, d => d.children);
  
  // maps the node data to the tree layout
  nodes = treemap(nodes);
  
  // append the svg object to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  const svg = d3.select("body").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom),
        g = svg.append("g")
          .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
  
  // adds the links between the nodes
  const link = g.selectAll(".link")
      .data( nodes.descendants().slice(1))
    .enter().append("path")
      .attr("class", "link")
      .style("stroke", d => d.data.level)
      .attr("d", d => {
         return "M" + d.y + "," + d.x
           + "C" + (d.y + d.parent.y) / 2 + "," + d.x
           + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
           + " " + d.parent.y + "," + d.parent.x;
         });
  
  // adds each node as a group
  const node = g.selectAll(".node")
      .data(nodes.descendants())
      .enter().append("g")
      .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
      .attr("transform", d => "translate(" + d.y + "," + d.x + ")");
  
  // adds the circle to the node
  node.append("circle")
    .attr("r", d => d.data.value)
    .style("stroke", d => d.data.type)
    .style("fill", d => d.data.level);
    
  // adds the text to the node
  node.append("text")
    .attr("dy", ".35em")
    .attr("x", d => d.children ? (d.data.value + 5) * -1 : d.data.value + 5)
    .attr("y", d => d.children && d.depth !== 0 ? -(d.data.value + 5) : d)
    .style("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name);
      
}



function try2() {

  var treeData = [
    {
      "name": "Top Level",
      "parent": "null",
      "status": "red",
      "children": [
        {
          "name": "Level 2-A",
          "parent": "Top Level",
          "status": "red",
          "children": [
            {
              "name": "Legolas",
              "status": "red",
              "parent": "Level 2-A"
            },
            {
              "name": "Finegal",
              "status": "green",
              "parent": "Level 2-A"
            }
          ]
        },
        {
          "name": "Level 2-B",
          "status": "red",
          "parent": "Top Level",
          "children": [
            {
              "name": "Durin",
              "status": "red",
              "parent": "Level 2-B",
        "children": [
          {
          "name": "Frodo",
          "status": "green",
          "parent": "Durin"
          },
          {
          "name": "Bilbo",
          "status": "red",
          "parent": "Durin"
          }
        ]            
            },
            {
              "name": "Balin",
              "status": "green",
              "parent": "Level 2-B",
        "children": [
          {
          "name": "Merry",
          "status": "green",
          "parent": "Balin"
          },
          {
          "name": "Pipen",
          "status": "green",
          "parent": "Balin"
          }
        ]            
            }
          ]
        },
        {
          "name": "Level 2-C",
          "parent": "Top Level",
          "status": "green",
          "children": [
            {
              "name": "Gandalf",
              "status": "green",
              "parent": "Level 2-C"
            },
            {
              "name": "Sauruman",
              "status": "green",
              "parent": "Level 2-C"
            }
          ]
        },
      ]
    }
  ];


  // ************** Generate the tree diagram	 *****************
  var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;
    
  var i = 0,
    duration = 750,
    root;

  //  d3.select('#tree').selectAll('*').remove()
  //
  //  let vis = d3.select('#tree')
  //    .append('svg:svg')
  //    .attr('width', width + margin.right + margin.left)
  //    .attr('height', height + margin.top + margin.bottom)
  //    .append('svg:g')
  //    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  //
  //  var tree = d3.layout.tree().size([height, width])

  var tree = d3.tree().size([height, width]);

//  var diagonal = d3.svg.diagonal()
//    .projection(function(d) { return [d.y, d.x]; });

  var diagonal = d3.linkHorizontal()
  .x(function(d) { return d.y; })
  .y(function(d) { return d.x; })

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," 
                                    + margin.top + ")");

  root = treeData[0];
  root.x0 = height / 2;
  root.y0 = 0;

  function toggleAll(d) {
    if (d.children) {
      if (d.status == "green") {
        d._children = d.children;
        d._children.forEach(toggleAll);
        d.children = null;
      } else {
        d.children.forEach(toggleAll);
      }
    }
  }

  root.children.forEach(toggleAll);
    
  update(root);

  d3.select(self.frameElement).style("height", "500px");

  function update(source) {

    // Compute the new tree layout.
    //var nodes = tree.nodes(root).reverse(),
    //  links = tree.links(nodes);

    tree(root)
    var nodes = d3.hierarchy(root).descendants().reverse()
    var links = d3.hierarchy(root).links(nodes)

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i);  });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
        console.log(source)
        return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

    nodeEnter.append("circle")
      .attr("r", 20)
      .style("fill", function(d) {  return d.data.status; });

    nodeEnter.append("text")
      .attr("x", function(d) { 
        return d.children || d._children ? -13 : 13; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { 
        return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.data.name; })
      .style("fill-opacity", 50);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
      .attr("r", 10)
      .style("fill", function(d) { return d.status; });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { 
        return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

    nodeExit.select("circle")
      .attr("r", 50);

    nodeExit.select("text")
      .style("fill-opacity", 50);

    // Update the links…
    var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
      return diagonal({source: o, target: o});
      });

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
      var o = {x: source.x, y: source.y};
      return diagonal({source: o, target: o});
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
    });
  }

  // Toggle children on click.
  function click(d) {
    console.log(d);
    if (d.children) {
    d._children = d.children;
    d.children = null;
    } else {
    d.children = d._children;
    d._children = null;
    }
    update(d);
  }

}

function try3() {
  const data = {
    name:"A",
    children: [
      {
        name:"AB1",
        children: [{
          name:"ABC1",
          children: []
        },{
          name:"ABC2",
          children: []
        }]
      },
      {
        name:"AB2",
        children: []
      }
    ]
  }

  var root = d3.hierarchy(data)
  var treeLayout = d3.tree().size([500, 500])(root)   // this sets x and y on each node

  var linkPathGenerator = d3.linkHorizontal().x(d => d.y).y(d => d.x)

  //d3.select("#chart").append('svg').attr('width', 400).attr('height', 400).style('background', '#C9D7D6')
  d3.select("#chart")
    .selectAll("path").data(treeLayout.links())
    .enter().append("path")
    .attr("d", linkPathGenerator)

  var g = d3.select("#chart").selectAll("g").data(root.descendants())
  var ge = g.enter().append("g");

  ge.append("circle")
  .attr("cx", d => d.y)
  .attr("cy", d => d.x)
  .attr("style", d => "fill: skyblue")
  .attr("r", 10)

  ge.append("text")
  .attr("x", d => d.y)
  .attr("y", d => d.x)
  .text(d => {return d.data.name})


}