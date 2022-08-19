# usage

    <svg id="chart" viewBox="0 0 500 500" style="height:100%; width:100%; background: lightgray;"></svg>


    import * as chart from "../components/treeChart/treeChart.mjs"

    chart.draw("chart", {
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
    })
