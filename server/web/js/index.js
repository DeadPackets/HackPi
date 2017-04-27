    var socket = io.connect({
    	secure: true
    })

    /*
    var options = {
    	autoResize: true,
    	height: '100%',
    	width: '100%',
    	clickToUse: true,
    	configure: {
    		enabled: false
    	},
    	interaction: {
    		hover: true
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
    // create an array with nodes

    //Global vars
    var hosts;
    var nodes;
    var edges;
    var container;
    var network;


    // initialize your network!
    function DrawNetwork(state, data, scantime) {
    	if (state == 'success') {
    		console.log(data, scantime) //REMOVE THIS LATER

    		hosts = [{
    			id: 1,
    			label: 'You',
    			title: "You"
    		}];

    		for (var i = 0; i < data.length; i++) {
    			var obj = {
    				id: data[i].ip,
    				label: data[i].ip,
    				title: data[i].hostname
    			}
    			hosts.push(obj)
    		}
    		nodes = new vis.DataSet(hosts);

    		// create an array with edges
    		var edges_data = [];
    		for (var i = 0; i < hosts.length; i++) {
    			if (hosts[i].id == 1) {} else {
    				var obj = {
    					from: hosts[i].id,
    					to: 1
    				}
    				edges_data.push(obj)
    			}
    		}
    		edges = new vis.DataSet(edges_data);

    		// create a network
    		container = document.getElementById('mynetwork');

    		// provide the data in the vis format
    		result = {
    			nodes: nodes,
    			edges: edges
    		};
    		network = new vis.Network(container, result, options);

    		//Zooms in on central node
    		network.once("beforeDrawing", function() {
    			network.focus(1, {
    				scale: 12
    			});
    		});

    		//Zooms out with an animation
    		network.once("afterDrawing", function() {
    			network.fit({
    				animation: {
    					duration: 3000,
    					easingFunction: 'easeInOutQuint'
    				}
    			});
    		})
    		//Stops the wiggling
    		network.stabilize()
    	} else {
    		console.log("Error!", data)
    	}
    }

    //  socket.emit('scan local', 'eth0', DrawNetwork(state, data, scantime))

*/
    setInterval(function() {
    	socket.emit('get system info', function(data) {

    		//Parsing general data
    		var uptime = data.uptime
    		var osuptime = data.osuptime
    		var freemem = data.mem.free
    		var usedmem = data.mem.used
    		var totalmem = data.mem.total
    		var swapfree = data.swap.swapfree
    		var swapused = data.swap.swapused
    		var swaptotal = data.swap.swaptotal
    		var cpuload = data.cpu.load.avgload
    		var cpuspeed = data.cpu.speed.avg
    		var cputemp = data.cpu.temp.main
    		$('.uptime').text(uptime)
    		$('.osuptime').text(osuptime)
    		$('.freemem').text(freemem)
    		$('.usedmem').text(usedmem)
    		$('.totalmem').text(totalmem)
    		$('.swapused').text(swapused)
    		$('.swaptotal').text(swaptotal)
    		$('.cpuload').text(cpuload)
    		$('.cpuspeed').text(cpuspeed)
    		$('.cputemp').text(cputemp)

    		//Parsing fs data
    		for (var i = 0; i < data.fs.fssize.length; i++) {
    			var fs = data.fs.fssize[i]
    			var disk = fs.fs
    			var mountpoint = fs.mount
    			var fstype = fs.type
    			var fssize = fs.size
    			var fsused = fs.used
    			var fsusedpercent = fs.use
    			$('.fs').append(`<div id="fs-disk-${i}">${fs} ${disk} ${mountpoint} ${fstype}</div>`)
    		}

    		//Parsing interface data
    		for (var i = 0; i < data.interfaces.length; i++) {
    			var iface = data.interfaces[i]
    			var mac = iface.address || null
    			var ifacename = iface.interface
    			var ipv4addr = iface.ipv4_address || null
    			var ipv6addr = iface.ipv6_address || null
    			var isloopback = iface.loopback || false
    			var isup = iface.up
    			var isrunning = iface.running || false
    			if (iface.interface.indexOf('wlan') < 0) {
    				var type = iface.link
    			} else if (iface.interface.indexOf('mon') < 0) {
    				var type = 'wireless'
    			} else {
    				var type = 'monitor-mode'
    			}
    			var broadcast = iface.broadcast || false
    			var multicast = iface.multicast || false
    			//console.log(ifacename + " " + mac + " " + type)
    		}
    	})
    }, 600)
