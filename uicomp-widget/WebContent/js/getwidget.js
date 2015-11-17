function ResponsiveWidget(inputId, inputType) {
	this.id = inputId;
	this.type = inputType;
}

function JQMWidget(id) {
	ResponsiveWidget.call(this, id, 'jqm');
}

function BootstrapWidget(id) {
	ResponsiveWidget.call(this, id, 'bootstrap');
}

ResponsiveWidget.prototype = {
	constructor : ResponsiveWidget,
	init : function(url, callback) {
		var jQuery;
		var jQueryVersion = '2.1.4';
		if (window.jQuery === undefined
				|| window.jQuery.fn.jquery !== jQueryVersion) {
			var script = document.createElement("script")
			script.type = "text/javascript";
			script.setAttribute("src", url);
			if (script.readyState) { // IE
				script.onreadystatechange = function() {
					if (script.readyState == "loaded"
							|| script.readyState == "complete") {
						script.onreadystatechange = null;
						callback();
					}
				};
			} else { // Others
				script.onload = function() {
					callback();
				};
			}

		} else {
			// The jQuery version on the window is the one we want to use
			callback();
		}

		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
	},
	createWidget : function() {
		this
				.init(
						"http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js",
						(function() {
							jQuery = window.jQuery.noConflict(true);
							// jQuery loaded
							console.log('jquery loaded');

							jQuery(document).ready(
									(function() {
										this.service.loadWidget(this.type,
												(function(result) {
													this.ui.writeWidget(
															jQuery("#"
																	+ this.id),
															result);
												}).bind(this));
									}).bind(this));

						}).bind(this));

	},
	service : function() {
		isServer = true;
		serverUrl = "http://localhost:8082/uicomp-widget/";
		var loadWidget = function(type, callback) {
			if (isServer) {
				// Go to server and load comments
				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4 && xhttp.status == 200) {
						var json = JSON.parse(xhttp.responseText);
						callback(json);
					}
				}
				xhttp.open("GET", serverUrl + "uicomp/" + type, true);
				xhttp.setRequestHeader("Accept", "application/json");
				xhttp.send();
			} else {
				setTimeout(function() {
					callback(json);
				}, 3000);
			}
		};
		return {
			loadWidget : loadWidget
		}

	}(),
	ui : function() {
		var writeWidget = function(id, result) {
			// var data = JSON.parse(result);
			id.html(result.html)
		};
		return {
			writeWidget : writeWidget
		}
	}()
}

// subclass of responsive widget using JQuery Mobile
JQMWidget.prototype = new ResponsiveWidget(); // Here's where the inheritance occurs
JQMWidget.prototype.constructor = JQMWidget;
JQMWidget.create = function(id) {
	var instance = new JQMWidget(id);
	instance.createWidget();
}

// subclass of responsive widget using Bootstrap
BootstrapWidget.prototype = new ResponsiveWidget(); // Here's where the inheritance occurs
BootstrapWidget.prototype.constructor = BootstrapWidget;
BootstrapWidget.create = function(id) {
	var instance = new BootstrapWidget(id);
	instance.createWidget();
}
