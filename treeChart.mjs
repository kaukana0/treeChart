import("../../redist/d3.v6.min.js").then(_ => 
{	// use this "side effect import", to execute the script w/o importing anything.
	// we exploit here the way d3 v6 is written - it creates a "d3" object which can be used in this module after the resolve.
})


export function init(domElId, data) {makeSynchronous(domElId, data)}


function makeSynchronous(domElId, data) {
	if(typeof d3 !== 'undefined') {
		d3.selectAll("svg > *").remove();	// tabula rasa
		update(getConfig(domElId, data))
	} else {
		setTimeout(()=>makeSynchronous(domElId,data), 100)   // in other words - wait...
	}
}


function getConfig(domElId, data) {
	return {
		d3: d3,
		domElId: domElId,
		root: d3.hierarchy(data),
		linkPathGenerator: d3.linkHorizontal().x(d => d.y).y(d => d.x),
		uniqueId: d => d.name,                    // what uniquely ids a node?
		calcLayout: d3.tree().size([500, 500])    // this is a fct. this sets x and y on each node. modifies given object.
	}
}


function update(cfg) {
	cfg.calcLayout(cfg.root)
	groupsCRUD(cfg)
	linksCRUD(cfg)
}

function groupsCRUD(cfg)
{
	// read
	const r = cfg.d3.select("#"+cfg.domElId).selectAll("g").data(cfg.root, cfg.uniqueId)
	// for some reason, root node pos isn't updated - all others are.
	// seems it's a bug or something, so do it manually as a workaround... :-/
	// btw: groups don't have x/y only translate, so gotta go through all their children
	r.selectAll("text").attr("x", d => d.y).attr("y", d => d.x)
	r.selectAll("circle").attr("cx", d => d.y).attr("cy", d => d.x)

	// create elements (content of a group)
	const c = r.enter().append("g");
	c.append("circle").attr("cx", d => d.y).attr("cy", d => d.x).attr("style", d => "fill: skyblue").attr("r", 10)
	c.append("text").attr("x", d => d.y).attr("y", d => d.x).text(d => {return d.data.name})
	c.on("click", (e,d) => {
		if (d.children) {
			d._children = d.children; // detach and store
			d.children = null;
		} else {
			d.children = d._children; // restore and attach
			d._children = null;
		}
		update(cfg)
	})

	// update elements (omitted)

	// delete elements
	r.exit().remove()
}

function linksCRUD(cfg) {

	// read
	const r = d3.select("#"+cfg.domElId).selectAll("path").data(cfg.root.links(), cfg.uniqueId)
	// same workaround as for groups
	r.attr("d", cfg.linkPathGenerator)

	// create
	const c = r.enter().append("path").attr("d", cfg.linkPathGenerator)

	// update elements (omitted)

	// delete
	r.exit().remove()
}