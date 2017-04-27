var options = {
  autoResize: true,
  height: '100%',
  width: '100%',
  clickToUse: true,
  configure: {
    enabled: false
  },
  edges: {
    smooth: {
      forceDirection: 'none',
      roundness: 1
    }
  },
  physics: {
    forceAtlas2Based: {
      springLength: 60,
      springConstant: 0.1,
      damping: 1,
      avoidOverlap: 1
    },
    minVelocity: 0.3,
    solver: "forceAtlas2Based",
    timestep: 0.11
  }
}

var nodes = [];
var oldNodes = [];
var edges = [];
var oldEdges = [];
var container = document.getElementById('map');
var network = new vis.Network(container, { nodes, edges }, options)

if(webViewBridge) {
  //injected webview bridge variable is available by react native

  webViewBridge.onMessage = (raw) => {
    //new data from react native, in this case the graph data

    //convert text data to native object
    var data = JSON.parse(raw)

    if(data.type == 'graph update') {
      graphUpdate(data.payload)
    }

  }

  //click listeners for functions.. I dont want to trigger any type of meny in the webView
  //it will have a lack of performence etc.. I will use IOS default menu for now.
  network.on('click', (e) => {
    var stringData = JSON.stringify({
      event: 'click',
      eventData: e
    })
    webViewBridge.sendMessage(stringData)
  })
}


//load new data, redraw
function graphUpdate (nodes) {

  nodes = new vis.DataSet(nodes)
  network.redraw()
}
