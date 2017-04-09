    var socket = io.connect({
      secure: true
    })

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

    // initialize your network!


    socket.emit('scan local', 'eth0', function(data, scantime) {
      console.log(data, scantime) //REMOVE THIS LATER
      
      var hosts = [{
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
      var nodes = new vis.DataSet(hosts);

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
      var edges = new vis.DataSet(edges_data);

      // create a network
      var container = document.getElementById('mynetwork');

      // provide the data in the vis format
      var result = {
        nodes: nodes,
        edges: edges
      };
      var network = new vis.Network(container, result, options);
      
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
    })










    socket.emit('get system info', function(data) {

      //Parsing general data
      var uptime = data.uptime
      var osuptime = data.osuptime
      var freemem = data.mem.free / 1073741824
      var usedmem = data.mem.used / 1073741824
      var totalmem = data.mem.total / 1073741824
      var swapfree = data.swap.swapfree
      var swapused = data.swap.swapused
      var swaptotal = data.swap.swaptotal
      var cpuload = data.cpu.load.avgload
      var cpuspeed = data.cpu.speed.avg
      var cputemp = data.cpu.temp.main

      //Parsing fs data
      for (var i = 0; i < data.fs.fssize.length; i++) {
        var fs = data.fs.fssize[i]
        var disk = fs.fs
        var mountpoint = fs.mount
        var fstype = fs.type
        var fssize = fs.size
        var fsused = fs.used
        var fsusedpercent = fs.use
      }

      //Parsing interface data
      for (var i = 0; i < data.interfaces.length; i++) {
        var iface = data.interfaces[i]
        var mac = iface.address || false
        var ifacename = iface.interface
        var ipv4addr = iface.ipv4_address
        var ipv6addr = iface.ipv6_address || null
        var isloopback = iface.loopback || false
        var isup = iface.up
        var isrunning = iface.running || false
        var type = iface.link
        var broadcast = iface.broadcast || false
        var multicast = iface.multicast || false
      }
    })