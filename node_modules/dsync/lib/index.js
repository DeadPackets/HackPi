var dref         = require("dref"),
_            = require("underscore"),
deepExtend   = require("deep-extend"),
traverse = require("traverse");




module.exports = function(target, thisObject, onCalled) {

	if(isCore(target)) return target;

	//an array? map 
	if(target instanceof Array) {
		return target.map(module.exports);
	}

	if(target.toJSON && !target.toPublic) return target.toJSON();

	if(typeof target == "function") {
		return function() {

			if(onCalled) onCalled();


			//wrap the args
			var args = Array.prototype.slice.call(arguments, 0).map(function(arg) {
				return module.exports(arg, this, onCalled);
			});

			//call the prev function
			return target.apply(thisObject, args);
		}
	}

	//the public target IS the target if it's already been wrapped. If it's wrapped, we're
	//assuming it's been passed over the wire
	var publicTarget = target.toPublic ? target.toPublic() : target,
	publicKeys = publicTarget.publicKeys,
	//assign a NEW target that'll get returned
	wrappedTarget = {},

	isObject = target.constructor === Object,

	//the obj that keeps track of any changes to the object
	template;



	for(var key in publicTarget) {

		//if NOT an object (using prototype), then strip out underscores - they're private
		if(!isObject && key.substr(0, 1) === "_") continue;

		//if public keys exist, then check
		if(publicKeys && !~publicKeys.indexOf(key)) continue;


		wrappedTarget[key] = module.exports(publicTarget[key], publicTarget, triggerChanged);
	}

	//next need to go through every attribute, and wrap it up
	/*traverse(publicTarget).forEach(function(v) {

		//make sure not to accept ANY properties with a an underscore for a prefix (_private, _connection, etc.).
		//If it's an object, we also want to skip it since it'll be traversed later. Setting the original object
		//will allow the wrappedTarget to override any values - we don't want that.
		//this doesn't work in many cases
		// if(isPrivate(this)) return;

		

		var path = this.path.join(".");

		if(!path.length) return;

		//stringify the object - we 
		if(typeof v == "object") {
			// v =  String(v);
		console.log(v.publicKeys);
			return;
		}


		//if public keys exist, then check
		if(publicKeys && !~publicKeys.indexOf(path)) return;



		//need this to keep the original function intact
		var parent   = dref.get(publicTarget, this.path.slice(0, this.path.length - 1).join("."));


		return dref.set(wrappedTarget, path, module.exports(v, parent, triggerChanged));
	});*/


	/*wrappedTarget.__changed = function(values) {

		//already wrapped? probably an object passed over the wire. It SHOULD
		//be over the wire, otherwise __changed will be called more than it needs to be.
		if(publicTarget.__changed) publicTarget.__changed(values);

		_.extend(publicTarget, values);
	}*/


	function triggerChanged() {
		var changed = difference(template, wrappedTarget),
		changedSize = traverse(changed).nodes().length;
		if(changedSize) {
			// wrappedTarget.__changed(changed);
			resetTemplate();
		}
	}

	function resetTemplate() {
		template = traverse(wrappedTarget).clone();
	}

	resetTemplate();


	return wrappedTarget;
}

module.exports.schema = function(schema) {
	schema.methods.toPublic = function() {

		var self = this,
		methods = _.pick(this, ["save"].concat(schema.publicMethods || []));


		traverse(methods).forEach(function(fn) {
			if(typeof fn === "function")
			this.update(function() {
				return fn.apply(self, arguments);
			});
		});

		var doc = this.toObject();

		return _.extend(_.pick(doc, schema.publicKeys || Object.keys(doc)), methods);
	}
}


function isCore(target) {
	var tot = typeof target;
	return !target ||
	target instanceof Error ||
	target instanceof Date ||
	/string|number|undefined/.test(tot);
}

function difference(template, override) {
    var ret = {};
    for (var name in template) {
        if (name in override) {
            if (_.isObject(override[name]) && !_.isArray(override[name])) {
                var diff = difference(template[name], override[name]);
                if (!_.isEmpty(diff)) {
                    ret[name] = diff;
                }
            } else if (!_.isEqual(template[name], override[name])) {
                ret[name] = override[name];
            }
        }
    }
    return ret;
}

function isPrivate(leaf) {
	return !!_.find(leaf.path, function(key) {
		return key.substr(0, 1) === "_";
	})
}