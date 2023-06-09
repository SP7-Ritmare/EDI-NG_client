function Observation() {
	this.observerCollection = [];
	this.registerObserver = function(observer) {
		this.observerCollection.push(observer);
		// doDebug("registering " + observer);
	}
	this.unregisterObserver = function(observer) {
		// doDebug("unregistering " + observer);
		var index = this.observerCollection.indexOf(observer);
		if ( index > -1 ) {
			this.observerCollection.splice(index, 1);
		} else {
		}
		doDebug("" + this.observerCollection.length + " observers left");
		if ( this.observerCollection.length == 1 ) {
		}
		if ( this.observerCollection.length == 0 ) {
			this.callback();
		}
	}
	this.callback = function() {};
}
