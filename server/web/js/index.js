    var socket = io.connect({
    	secure: true
    })
    var sysdata;
    var firstload = true
    var IFACES_STATE = [];
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

    function UpdateInterfaces() {
    	$('.interface-list').html('')
    	for (var i = 0; i < sysdata.interfaces.length; i++) {
    		var iface = sysdata.interfaces[i]
    		var mac = iface.address || null
    		var vendor = null
    		if (mac) {
    			vendor = iface.vendor
    		}
    		if (IFACES_STATE[i]) {
    			var iface_state = IFACES_STATE[i]
    			var isbusy;
    			var isbusy_process;
    			if (iface_state.state.busy == true) {
    				isbusy = true
    				isbusy_process = iface_state.state.process
    			} else {
    				isbusy = false
    			}
    		}
    		if (iface.interface.indexOf('wlan') < 0) {
    			var type = iface.link
    		} else if (iface.interface.indexOf('mon') < 0) {
    			var type = 'wireless'
    		} else {
    			var type = 'monitor-mode'
    		}
    		var wirelessdata = iface.wirelessdata
    		var ifacename = iface.interface
    		var ipv4addr = iface.ipv4_address || null
    		var ipv6addr = iface.ipv6_address || null
    		var isloopback = iface.loopback || false
    		var isup = iface.up
    		var isrunning = iface.running || false
    		var broadcast = iface.broadcast || false
    		var multicast = iface.multicast || false
    		$('.interface-list').append('<div class="panel panel-default" id="' + ifacename + '"><div class="panel-heading">' + ifacename + '</div><div class="panel-body"><p class="interface-mac">Mac: ' + mac + '</p><p class="interface-vendor">Vendor: ' + vendor + '</p><p class="interface-type">Type: ' + type + '</p><p class="interface-isup">IsUP: ' + isup + '</p></div></div>')
    		if (IFACES_STATE[i]) {
    			//check if busy
    			if (isbusy == true) {
    				$('#' + ifacename + ' .panel-heading').append('   <span class="label label-danger">BUSY</span>')
    			}

    			//check if connected
    			if (isloopback !== true && ipv4addr !== null) {
    				$('#' + ifacename + ' .panel-heading').append('   <span class="label label-success">CONNECTED</span>')
    				$('#' + ifacename + ' .panel-body').append('<p class="interface-ipv4-addr">IPv4: ' + ipv4addr + '</p>')
    			} else if (isloopback !== true && ipv6addr !== null) {
    				$('#' + ifacename + ' .panel-heading').append('   <span class="label label-success">CONNECTED</span>')
    				$('#' + ifacename + ' .panel-body').append('<p class="interface-ipv6-addr">IPv6: ' + ipv6addr + '</p>')
    			}

    			//if wireless
    			if (type == 'wireless') {
    				if (wirelessdata) {
    					if (wirelessdata.mode == "master") {
    						$('#' + ifacename + ' .panel-heading').append('   <span class="label label-primary">Master Mode</span>')
    					} else if (isbusy == false && isup == true) {
    						$('#wifi-scan-interface-list').html('')
    						$('#wifi-scan-interface-list').append('<option>' + ifacename + '</option>')
    					}
    				}
    			}


    		}
    	}
    }

    socket.on('updated interfaces', function() {
    	UpdateInterfaces()
    })

    setInterval(function() {

    	socket.emit('get interface state', function(data) {
    		IFACES_STATE = data
    	})
    	socket.emit('get system info', function(data) {
    		if (sysdata) {
    			var sysinterfaces = [];
    			sysdata.interfaces.forEach(function(dt, index) {
    				sysinterfaces.push(dt.interface)
    			})

    			var datainterfaces = [];
    			data.interfaces.forEach(function(dt, index) {
    				datainterfaces.push(dt.interface)
    			})

    			if (data.interfaces.length > sysdata.interfaces.length) {
    				//new interface
    				var diff = _.difference(datainterfaces, sysinterfaces)
    				diff.forEach(function(data, index) {
    					console.log(data + " was added.") //TODO: Proper alerts!
    				})
    			} else if (data.interfaces.length < sysdata.interfaces.length) {
    				//removed interface
    				var diff = _.difference(sysinterfaces, datainterfaces)
    				diff.forEach(function(data, index) {
    					console.log(data + " was removed.") //TODO: Proper alerts!
    				})
    			}
    		}

    		sysdata = data
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
    			//$('.fs').append(`<div id="fs-disk-${i}">${fs} ${disk} ${mountpoint} ${fstype}</div>`)
    		}
    	})
    }, 600)


    setInterval(function() {
    	UpdateInterfaces()
    }, 2000)


    $('.scan-wifi').click(function() {
    	var iface = $('#wifi-scan-interface-list').val()
    	socket.emit('scan wifi', iface)
    })

    socket.on('new wifi', function(type, data) {
    	console.log(type, data)
    })
