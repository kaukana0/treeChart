import("../../redist/d3.v6.min.js").then(_ => 
{   // use this "side effect import", to execute the script w/o importing anything.
    // we exploit here the way d3 v6 is written - it creates a "d3" object which can be used in this module after the resolve.
})


export function draw(domElId, data) {makeSynchronous(domElId, data)}


function makeSynchronous(domElId, data) {
  if(typeof d3 !== 'undefined') {
    _draw(domElId, data)
  } else {
    setTimeout(()=>draw(domElId,data), 100)
  }
}


function _draw(domElId, data) {

  const root = d3.hierarchy(data)
  const treeLayout = d3.tree().size([500, 500])(root)   // this sets x and y on each node
  const linkPathGenerator = d3.linkHorizontal().x(d => d.y).y(d => d.x)

  update(d3, treeLayout, linkPathGenerator)
  
  function update(d3, treeLayout, linkPathGenerator) {
  
    // creating and destroying links
    const l = d3.select("#"+domElId).selectAll("path").data(treeLayout.links())
    l.exit().remove()
    const le = l.enter().append("path").attr("d", linkPathGenerator)
    le.merge(l)

    // creating and destroying groups
    const g = d3.select("#"+domElId).selectAll("g").data(root.descendants())
    g.exit().remove()
    // content of group
    const ge = g.enter().append("g");
    ge.append("circle").attr("cx", d => d.y).attr("cy", d => d.x).attr("style", d => "fill: skyblue").attr("r", 10)
    ge.append("text").attr("x", d => d.y).attr("y", d => d.x).text(d => {return d.data.name})
    ge.on("click", (e,d) => {
      if (d.children) {
        d._children = d.children; // store and detach
        d.children = null;
      } else {
        d.children = d._children; // restore and attach
        d._children = null;
      }
      update(d3, treeLayout, linkPathGenerator)
    })
  }

}