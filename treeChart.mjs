import("../../redist/d3.v6.min.js").then(_ => 
{	// use this "side effect import", to execute the script w/o importing anything.
	// we exploit here the way d3 v6 is written - it creates a "d3" object which can be used in this module after the resolve.
})


export function init(domElId, data) {makeSynchronous(domElId, data)}


function makeSynchronous(domElId, data) {
	if(typeof d3 !== 'undefined') {
		draw(domElId, data)
	} else {
		setTimeout(()=>makeSynchronous(domElId,data), 100)   // in other words - wait...
	}
}


function draw(domElId, data) {
	d3.selectAll("svg > *").remove();

	const cfg = {
		d3: d3,
		domElId: domElId,
		root: d3.hierarchy(data),
		linkPathGenerator: d3.linkHorizontal().x(d => d.y).y(d => d.x),
		uniqueId: d => d.name,                    // what uniquely ids a node?
		calcLayout: d3.tree().size([500, 500])    // this is a fct. this sets x and y on each node. modifies given object.
	}
	update(cfg)
}


function update(cfg) {

	cfg.calcLayout(cfg.root)

	groupsCRUD(cfg)
	linksCRUD(cfg)

	// links

}

function groupsCRUD(cfg)
{
	// read
	const g = cfg.d3.select("#"+cfg.domElId).selectAll("g").data(cfg.root, cfg.uniqueId)

	// create elements (content of a group)
	const ge = g.enter().append("g");
	ge.append("circle").attr("cx", d => d.y).attr("cy", d => d.x).attr("style", d => "fill: skyblue").attr("r", 10)
	ge.append("text").attr("x", d => d.y).attr("y", d => d.x).text(d => {return d.data.name})
	ge.on("click", (e,d) => {
		if (d.children) {
			d._children = d.children; // detach and store
			d.children = null;
		} else {
			d.children = d._children; // restore and attach
			d._children = null;
		}
		update(cfg)
	})

	// update elements
	const gu = ge.merge(g)  // get a handle on nodes which stayed
	//gu.attr("transform", d => "translate(" + d.x + "," + d.y + ")")
	//gu.call((d) => console.log("GU",d))

	// delete elements
	g.exit().remove()        // .call((d) => console.log("EXIT",d))  for "debugging"
}

function linksCRUD(cfg) {

	// read
	const l = d3.select("#"+cfg.domElId).selectAll("path").data(cfg.root.links(), cfg.uniqueId)

	// create
	const le = l.enter().append("path").attr("d", cfg.linkPathGenerator)

	// update
	const lu = le.merge(l)   // update pos of the ones that stayed
	lu.attr("d", cfg.linkPathGenerator)

	// delete
	l.exit().remove()
}