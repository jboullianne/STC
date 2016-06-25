var MEDIA_OFF_ID = "";


function getJSONData(endpoint, handler) {

	$.ajax({ url: '../data/getData.php?endpoint=' + endpoint ,
        success: function(data) {
        	var response = JSON.parse(data);
        	handler(response);
        }
	});
}

function translateMediaActivity(activity){
	var actMap = new Map();
	actMap.set("Show PC", "PC");
	actMap.set("Watch Apple TV", "Apple TV");
	actMap.set("Play Xbox", "Xbox One");
	actMap.set("--", "Off");

	return actMap.get(activity);
}

function toggleLight(id){
	var json_string = '';

	if($('#lights' + id +"toggle").text() == "OFF"){
		json_string = '{"id": "' + id + '","color": { "switch": "on", "level" : 100} }';
	}else{
		json_string = '{"id": "' + id + '","color": { "switch" : "off" } }';
	}
	var endpoint = '/lights/' + id + '/state';
	$.ajax({ url: '../data/putData.php?endpoint=' + endpoint + "&json_string=" + JSON.stringify(JSON.parse(json_string)),
		type: 'POST',
        success: function(response) {
        	//console.log(response);
        }
	});


	/* Set Representation of light */
	if($('#lights' + id +"toggle").text() == "OFF"){
		$('#lights' + id +"toggle").text("ON");
		$('#lights' + id +"toggle").attr("class", "btn btn-success btn-sm");
	}else{
		$('#lights' + id +"toggle").text("OFF").attr("class", "btn btn-outline btn-success btn-sm").blur();
	}
}

function setLightColor(id, color){
	console.log("Light #" + id + " changed to color: " + color);

	var colorToHex = new Map();
	colorToHex.set("RED", "%23e00000"); 	//#f00000
	colorToHex.set("BLUE", "%231e00ff");	//#1e00ff
	colorToHex.set("GREEN", "%232bff00");	//#2bff00
	colorToHex.set("ORANGE", "%23ff8000");	//#ff8000
	colorToHex.set("WHITE", "%23ffffff");	//#ffffff

	var hex = colorToHex.get(color);

	json_string = '{"id": "' + id + '","color": { "level" : 100, "hex" : "'+ hex + '" } }';
	console.log(json_string);
	var endpoint = '/lights/' + id + '/state';
	console.log(endpoint);
	$.ajax({ url: '../data/putData.php?endpoint=' + endpoint + "&json_string=" + JSON.stringify(JSON.parse(json_string)),
		type: 'POST',
        success: function(response) {
        	console.log(response);
        	console.log("Ajax Returned: Light Change Color: " + color);
        }
	});
}

function startMediaActivity(id){
	console.log("Starting Activity: " + id);

	if(id == -1){
		id = MEDIA_OFF_ID;
	}

	json_string = '{"state": "' + id + '" }';
	console.log(json_string);
	var endpoint = '/media/state';
	console.log(endpoint);
	$.ajax({ url: '../data/putData.php?endpoint=' + endpoint + "&json_string=" + JSON.stringify(JSON.parse(json_string)),
		type: 'POST',
        success: function(response) {
        	console.log(response);
        	console.log("Ajax Returned: Started Media Activity: " + id);
        }
	});
}

function getLightController(id_main, id_controller, size, color_primary, color_secondary){

	var out = "";

	out += 	'<div class="col-lg-' + size + '">' +
			'<div class="panel panel-default">' +
			'<div class="panel-heading" style="background: ' + color_primary + '; color: ' + color_secondary + ';">' +
			'Lights' + 
			'</div>' +
			'<div class="panel-body">' +
			'<div class="panel-group" id="lights">';

	getJSONData("/lights", function(response){

	    var rHTML = "";
	    var count = 0;
	    for (var k in response){
		    var device = response[k].device.device;
		    var state = response[k].device.state;

		    if(state == "on"){
		    	count++;
		    }

		    rHTML += '<div class="panel panel-default">' +
		    			'<div class="panel-heading" style="overflow: hidden;">' + 
		            		'<a data-toggle="collapse" data-parent="#lights" href="#lights' + device.id + k + '" class="">' +
								'<div style="float: left; width: 90%">' +
									'<h4 class="panel-title">' + device.label +  '</h4>' + 
								'</div>' +
							'</a>' +
							'<div style="float: right; width: 10%">' +
							'<button type="button" style="    position: relative; right: .4em;" onclick="toggleLight(' + k + ')" id="lights' + k + 'toggle"' +
							(state == "on" ? ' class="btn btn-success btn-sm">ON</button>' : ' class="btn btn-outline btn-success btn-sm">OFF</button>') +
							'</div>' + 
		    			'</div>' +
		    			'<style> button { margin-right: 0.2em; } </style>' + 
			    		'<div id="lights'+ device.id + k + '" class="panel-collapse collapse">' +
			        		'<div class="panel-body">' +
			            		'<button type="button" onclick="setLightColor(' + k + ', \'RED\')" class="btn btn-outline btn-success">Red</button>'+
								'<button type="button" onclick="setLightColor(' + k + ', \'BLUE\')" class="btn btn-outline btn-success">Blue</button>'+
								'<button type="button" onclick="setLightColor(' + k + ', \'GREEN\')" class="btn btn-outline btn-success">Green</button>'+
								'<button type="button" onclick="setLightColor(' + k + ', \'ORANGE\')" class="btn btn-outline btn-success">Orange</button>'+
								'<button type="button" onclick="setLightColor(' + k + ', \'WHITE\')" class="btn btn-outline btn-success">White</button>'+ 
			        		'</div>' +
			    		'</div>' +
					'</div>';

			}
		out += rHTML;
		out += 	'</div>' +
				'</div>' +
				'</div>' +
				'</div>';

		$(id_controller).html(out);
		$(id_main).text(count);
	});

}

function getMediaController(id_main, id_controller, size, color_primary, color_secondary){

	var out = "";

	out += 	'<div class="col-lg-' + size + '">' +
			'<div class="panel panel-default">' +
			'<div class="panel-heading" style="background: ' + color_primary + '; color: ' + color_secondary + ';">' +
			'Media Controllers' + 
			'</div>' +
			'<div class="panel-body">' +
			'<div class="panel-group" id="media">';

	getJSONData("/media", function(response){

    var rHTML = "";
    var currentActivity = "";

    for (var k in response){
	    var device = response[k].device.device;
	    currentActivity += response[k].device.state.currentActivity;
	    var activities = JSON.parse(response[k].device.state.activities);

	    rHTML += '<div class="panel panel-default">' +
	    			'<div class="panel-heading" style="overflow: hidden;">' + 
	            		'<a data-toggle="collapse" data-parent="#media" href="#media' + device.id + k + '" class="">' +
							'<div style="float: left; width: 80%">' +
								'<h4 class="panel-title">' + device.label +  '</h4>' + 
							'</div>' +
						'</a>' +
						'<div style="float: right; width: 10%">' +
						'<button type="button" style="    position: relative; right: .4em;" onclick="startMediaActivity(' + -1 + ')" id="media' + k + 'toggle"' +
						(currentActivity == "Activity Off" ? ' class="btn btn-outline btn-primary btn-sm disabled">OFF</button>' : ' class="btn btn-primary btn-sm">ON</button>') +
						'</div>' + 
	    			'</div>' +
	    			'<style> button { margin-right: 0.2em; } </style>' + 
		    		'<div id="media'+ device.id + k + '" class="panel-collapse collapse">' +
		        		'<div class="panel-body">';

		        			for(var j in activities){
		        				if( j == activities.length - 1){
		        					MEDIA_OFF_ID = activities[j].id;
		        					break;
		        				}
		        				rHTML += '<button type="button" onclick="startMediaActivity(' + activities[j].id + ')" class="btn btn-outline btn-primary">' + activities[j].name + '</button>';

		        			}
		        		rHTML += '</div>' +
		    		'</div>' +
				'</div>';

		}
	out += rHTML;
	out += 	'</div>' +
			'</div>' +
			'</div>' +
			'</div>';

	$(id_controller).html(out);

	
	$(id_main).html(translateMediaActivity(currentActivity));
	});
}

function getTempMonitor(id_main, id_controller, size, color_primary, color_secondary){
	var out = "";

	out += 	'<div class="col-lg-' + size + '">' +
			'<div class="panel panel-default">' +
			'<div class="panel-heading" style="background: ' + color_primary + '; color: ' + color_secondary + ';">' +
			'Temp Sensors' + 
			'</div>' +
			'<div class="panel-body">' +
			'<div class="panel-group" id="temp">';

	getJSONData("/therm", function(response){

    var rHTML = "";
    var avg_temp = 0;
    var num_sensors = 0;
    for (var k in response){
	    var device = response[k].device.device;
	    var state = response[k].device.state;

	    avg_temp += state;
	    num_sensors++;

	    rHTML += '<div class="panel panel-default">' +
	    			'<div class="panel-heading" style="overflow: hidden;">' + 
	            		'<a data-toggle="collapse" data-parent="#temp" href="#temp' + device.id + k + '" class="">' +
							'<div style="float: left; width: 90%">' +
								'<h4 class="panel-title">' + device.label +  '</h4>' + 
							'</div>' +
						'</a>' +
						'<div style="float: right; width: 10%">' +
						'<button type="button" id="temp' + k + 'toggle"' +
						' class="btn btn-outline btn-success btn-sm" style="position: relative; right: .3em;">'+ state + '&deg;</button>' +
						'</div>' + 
	    			'</div>' +
	    			'<style> button { margin-right: 0.2em; } </style>' + 
		    		'<div id="temp'+ device.id + k + '" class="panel-collapse collapse">' +
		        		'<div class="panel-body">' +
		        			'<h4><b>Last Updated:</b> 10:20 PM</h4>' +
		        		'</div>' +
		    		'</div>' +
				'</div>';

	}
	out += rHTML;
	out += 	'</div>' +
			'</div>' +
			'</div>' +
			'</div>';

	avg_temp /= num_sensors;
	avg_temp = avg_temp.toFixed(1);

	$(id_controller).html(out);
	$(id_main).html(avg_temp + "&deg;");
	});
}

function getContactMonitor(id_main, id_controller, size, color_primary, color_secondary){
	var out = "";

	out += 	'<div class="col-lg-' + size + '">' +
			'<div class="panel panel-default">' +
			'<div class="panel-heading" style="background: ' + color_primary + '; color: ' + color_secondary + ';">' +
			'Contact Sensors' + 
			'</div>' +
			'<div class="panel-body">' +
			'<div class="panel-group" id="contacts">';

	getJSONData("/contact", function(response){

    var rHTML = "";

    var open = 0;
    var closed = 0;

    for (var k in response){
	    var device = response[k].device.device;
	    var state = response[k].device.state;

	    if(state == "open"){
	    	open++;
	    }else{
	    	closed++;
	    }

	    rHTML += '<div class="panel panel-default">' +
	    			'<div class="panel-heading" style="overflow: hidden;">' + 
	            		'<a data-toggle="collapse" data-parent="#contacts" href="#contacts' + device.id + k + '" class="">' +
							'<div style="float: left; width: 90%">' +
								'<h4 class="panel-title">' + device.label +  '</h4>' + 
							'</div>' +
						'</a>' +
						'<div style="float: right; width: 10%">' +
						'<button type="button" id="contacts' + k + 'toggle"' +
						' class="btn btn-outline btn-success btn-sm" style="position: relative; right: 2em;">'+ state + '</button>' +
						'</div>' + 
	    			'</div>' +
	    			'<style> button { margin-right: 0.2em; } </style>' + 
		    		'<div id="contacts'+ device.id + k + '" class="panel-collapse collapse">' +
		        		'<div class="panel-body">' +
		        			'<h4><b>Last Updated:</b> 10:20 PM</h4>' +
		        		'</div>' +
		    		'</div>' +
				'</div>';

	}
	out += rHTML;
	out += 	'</div>' +
			'</div>' +
			'</div>' +
			'</div>';

	$(id_controller).html(out);
	$(id_main).text(open + " : " + closed);
	});
}

function getMotionMonitor(id_main){


	getJSONData("/motion", function(response){

		var state = "--";
	    for (var k in response){
		    state = response[k].device.state;
		}
		state = state.charAt(0).toUpperCase() + state.slice(1);
		$(id_main).html(state);
	});

}

function getPhoneMonitor(id_main){


	getJSONData("/phone", function(response){

		var state = "--";
	    for (var k in response){
		    state = response[k].device.state.presence;
		}
		state = state.charAt(0).toUpperCase() + state.slice(1);
		$(id_main).html(state);
	});
}

function getScheduleMonitor(id_main, id_minor){

	var d = new Date();
	var day = d.getDay();
	var hour = d.getHours();
	var min = d.getMinutes();

	/* SCHEDULE FOR CLASS BAR */
	var schedule = [
					[], // Sunday
					[["NAV 222", "HARK 114", '07', '30'], ["ECE 114", "GAVET 244", '15', '25'], ["CSC 257", "CSB 601", '16', '50']],	//Monday
					[["CSC 282", "B&L 109", '11', '05'], ["CSC 210", "B&L 106", '16', '50'], ["CSC 214", "GAVET 202", '18', '15']],	//Tuesday
					[["NAV 222", "HARK 114", '07', '30'], ["ECE 114", "GAVET 244", '15', '25'], ["CSC 257", "CSB 601", '16', '50'], ["WRT 273", "TODD 202", '18', '15']],	//Wednesday
					[["CSC 282", "B&L 109", '11', '05'], ["CSC 210", "B&L 106", '16', '50'], ["CSC 214", "GAVET 202", '18', '15']],	//Thursday
					[["ECE 114", "GAVET 244", '11', '50']],	//Friday
					[],	//Saturday
					];

	for(var i = day; i<7; i++){
		for(var j = 0; j<schedule[i].length; j++){
			if(schedule[i][j][2] >= hour && schedule[i][j][3] >= min && i == day){
				$(id_main).html(schedule[i][j][2] + ":" + schedule[i][j][3].toString());
				$(id_minor).html(schedule[i][j][0] + " : " + schedule[i][j][1].toString());
				return;
			}else if(i > day){
				$(id_main).html(schedule[i][j][2] + ":" + schedule[i][j][3].toString());
				$(id_minor).html(schedule[i][j][0] + " : " + schedule[i][j][1].toString());
				return;
			}
		}

		
	}
	//If it's the weekend and the next class is next week
	for(var k = 0; k<7; k++){
		for(var m = 0; m<schedule[k].length; m++){
			$(id_main).html(schedule[k][m][2] + ":" + schedule[k][m][3].toString());
			$(id_minor).html(schedule[k][m][0] + " : " + schedule[k][m][1].toString());
			return;
		}
	}
}

function buildTempGraph(){
	var offset = 0;
    plot();

    function plot() {
        var sensor1 = [],
        	sensor2 = [],
            sensor3 = [];
        for (var i = 0; i < 12; i += 0.5) {
            sensor1.push([i, Math.random() * (80 - 60) + 60]);
            sensor2.push([i, Math.random() * (80 - 60) + 60]);
            sensor3.push([i, Math.random() * (80 - 60) + 60]);
            //sin.push([i, Math.sin(i + offset)]);
            //cos.push([i, Math.cos(i + offset)]);
        }

        var options = {
            series: {
                lines: {
                    show: true
                },
                points: {
                    show: true
                }
            },
            grid: {
                hoverable: true //IMPORTANT! this is needed for tooltip to work
            },
            yaxis: {
                min: 50,
                max: 100,
                label: "Temp"
            },
            xaxis: {
            	transform: function (v) { return -v; }
            },
            tooltip: true,
            tooltipOpts: {
                content: "'%s' of %x.1 is %y.4",
                shifts: {
                    x: -60,
                    y: 25
                }
            }
        };

        var plotObj = $.plot($("#flot-line-chart"), [{
                data: sensor1,
                label: "Temp Sensor 1"
            }, {
                data: sensor2,
                label: "Temp Sensor 2"
            }, {
                data: sensor3,
                label: "Temp Sensor 3"
            }],
            options);
    }
}

function refresh(object, delay){
	console.log(object.toString + " : Refreshed");
}

function hideMonitor(object, delay){
	//object.delay(delay).animate({opacity: 0}, "slow");
	object.delay(delay).fadeTo( 1000, 0 );
}
function showMonitor(object, delay){
	//object.delay(delay).animate({opacity: 100}, "slow");
	object.delay(delay).fadeTo( 1000, 1 );
}

function refreshPage(){

	hideMonitor($('#media-panel-main'), 0);
	hideMonitor($('#light-panel-main'), 100);
	hideMonitor($('#temp-panel-main'), 200);
	hideMonitor($('#notification-panel-main'), 300);
	hideMonitor($('#phone-panel-main'), 400);
	hideMonitor($('#motion-panel-main'), 500);
	hideMonitor($('#contact-panel-main'), 600);
	hideMonitor($('#class-panel-main'), 700);

	//Media Main
	refresh($('#media-panel-main'), 0);

	//Light Main
	refresh($('#light-panel-main'), 100);

	//Temp Main
	refresh($('#temp-panel-main'), 200);

	//Notification Main
	refresh($('#notification-panel-main'), 300);

	//Phone Main
	refresh($('#phone-panel-main'), 400);

	//Motion Main
	refresh($('#motion-panel-main'), 500);

	//Contact Main
	refresh($('#contact-panel-main'), 600);

	//Class Main
	refresh($('#class-panel-main'), 700);

	
	showMonitor($('#media-panel-main'), 0);
	showMonitor($('#light-panel-main'), 100);
	showMonitor($('#temp-panel-main'), 200);
	showMonitor($('#notification-panel-main'), 300);
	showMonitor($('#phone-panel-main'), 400);
	showMonitor($('#motion-panel-main'), 500);
	showMonitor($('#contact-panel-main'), 600);
	showMonitor($('#class-panel-main'), 700);
	
}

function getAllData(){
	getJSONData("/devices/state", function(response){

		var lightCount = 0;
		var mediaActivity = "";
		var tempSensorCount = 0;
		var totalTemp = 0;
		var contactOpen = 0;
		var contactClosed = 0;
		var phonePresence = false;
		var motionActive = "Inactive";


		var keys = Object.keys(response);
		for(var x in response){
			var keys = Object.keys(response[x]);

			switch(keys[0]){
				case "light":
					if(response[x][keys[0]] == "on")
						lightCount++;
					break;
				case "temp":
					tempSensorCount++;
					totalTemp += response[x][keys[0]];
					break;
				case "phone":
					if(response[x][keys[0]] == "present")
						phonePresence = "Present";
					break;
				case "motion":
					if(response[x][keys[0]] == "active")
						motionActive = "Active";
					break;
				case "media":
					mediaActivity = translateMediaActivity(response[x][keys[0]]); 
					break;
				case "contact":
					if(response[x][keys[0]] == "closed")
						contactClosed++;
					else
						contactOpen++;
					break;
				default:
					break;
			}

		}


		console.log(lightCount + " " + mediaActivity + " " + tempSensorCount + " " + totalTemp + " " + contactOpen + " " + contactClosed + " " + phonePresence + " " + motionActive);
	});
}


//Main Function that's run when page is finishing loading
$(function() {
    console.log( "ready!" );

   	getLightController('#lights-state-label', '#light-controller', 3, '#5cb85c', 'white');
   	getMediaController('#media-state-label', '#media-controller', 3, '#337ab7', 'white');
   	getTempMonitor('#temp-state-label', '#temp-monitor', 3, '#f0ad4e', 'white');
   	//buildTempGraph();
   	getContactMonitor('#contact-state-label', '#contact-monitor', 3, '#84E066', 'white');
   	getMotionMonitor('#motion-state-label');
   	getPhoneMonitor('#phone-state-label');
   	//getNotificationController();
   	getScheduleMonitor('#class-state-label', '#class-state-label-minor');
});