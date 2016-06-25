<html>
<head>
	<title>Functionality Page</title>

	<link rel="stylesheet" href="styles.css">
	<script src="assets/js/jquery.min.js"></script>
	<script src="assets/js/jquery-ui.min.js"></script>
	<script src="assets/js/data-helper.js"></script>
</head>

<body>

	<div id="header" class="fixedheader">
		<?php include "header.php"; ?>
	</div>
	<div id="content" style="margin-top: 6em;">
		<div id="categories">

			<h2 class="list-title"><u> Device List </u></h2>
			<div id="devices">
				<script>
					getJSONData("../data/getData.php?endpoint=/devices", function(result) {
						var deviceHTML = "";
						 for(var k in result){
						  	//console.log(devices[k]);
						  	deviceHTML += "<h3>" + result[k].device.label + "</h3>";
						  	deviceHTML += "<div><p>ID: " + result[k].device.id + "";
						  	deviceHTML += "<br>LABEL: " + result[k].device.name + "</p></div>";
						}
						  	
						$('#devices').html(deviceHTML);
						$('#devices').accordion();
					});
				</script>
			</div>

			<h2 class="list-title"><u> Light List </u></h2>
			<div id="lights">
				<script>
					getJSONData("../data/getData.php?endpoint=/lights", function(result) {
						var deviceHTML = "";
						 for(var k in result){
						  	//console.log(devices[k]);
						  	deviceHTML += "<h3>" + result[k].device.label + "</h3>";
						  	deviceHTML += "<div><p>ID: " + result[k].device.id + "";
						  	deviceHTML += "<br>LABEL: " + result[k].device.name + "</p></div>";
						}
						  	
						$('#lights').html(deviceHTML);
						$('#lights').accordion();
					});
				</script>
			</div>

			<h2 class="list-title"><u> Phone List </u></h2>
			<div id="phone">
				<script>
					getJSONData("../data/getData.php?endpoint=/phone", function(result) {
						  	var deviceHTML = "";
						  		deviceHTML += "<h3>" + result.device.label + "</h3>";
						  		deviceHTML += "<div><p>ID: " + result.device.id + "";
						  		deviceHTML += "<br>LABEL: " + result.device.name + "</p></div>";
						  	
						  	$('#phone').html(deviceHTML);
						  	$('#phone').accordion();

					});
				</script>
			</div>

			<h2 class="list-title"><u> Therm List </u></h2>
			<div id="therm">
				<script>
					getJSONData("../data/getData.php?endpoint=/therm", function(result) {
						var deviceHTML = "";
						 for(var k in result){
						  	//console.log(devices[k]);
						  	deviceHTML += "<h3>" + result[k].device.label + "</h3>";
						  	deviceHTML += "<div><p>ID: " + result[k].device.id + "";
						  	deviceHTML += "<br>LABEL: " + result[k].device.name + "</p></div>";
						}
						  	
						$('#therm').html(deviceHTML);
						$('#therm').accordion();
					});
				</script>
			</div>



			<h2 class="list-title"><u> Motion Sensor List </u></h2>
			<div id="motion">
				<script>
					getJSONData("../data/getData.php?endpoint=/motion", function(result) {
						  	var deviceHTML = "";
						  		deviceHTML += "<h3>" + result.device.label + "</h3>";
						  		deviceHTML += "<div><p>ID: " + result.device.id + "";
						  		deviceHTML += "<br>LABEL: " + result.device.name + "</p></div>";
						  	
						  	$('#motion').html(deviceHTML);
						  	$('#motion').accordion();

					});
				</script>
			</div>

			<h2 class="list-title"><u> Media Controller List </u></h2>
			<div id="media">
				<script>
					getJSONData("../data/getData.php?endpoint=/media", function(result) {
						  	var deviceHTML = "";
						  		deviceHTML += "<h3>" + result.device.label + "</h3>";
						  		deviceHTML += "<div><p>ID: " + result.device.id + "";
						  		deviceHTML += "<br>LABEL: " + result.device.name + "</p></div>";
						  	
						  	$('#media').html(deviceHTML);
						  	$('#media').accordion();

					});
				</script>
			</div>
		</div>

		<div id="states">
			<ul>
			    <li><a href="#motion">Motion Sensor</a></li>
			    <li><a href="#phone">Phone</a></li>
			    <li><a href="#media">Media Controller</a></li>
			</ul>

			<script>
				getJSONData("../data/getData.php?endpoint=/phone/state", function(result){
					console.log(result);
				})
			</script>
		</div>
	</div>
	

	<div id="footer">
		<?php include "footer.php"; ?>
	</div>

</body>
</html>