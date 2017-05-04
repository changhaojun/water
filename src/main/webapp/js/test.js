var client;
var topic;
var data;

function MQTTconnect(dataIds) {
	console.log("订阅程序开始执行");
	client = new Paho.MQTT.Client('139.129.231.31', Number(61623), "server" + parseInt(Math.random() * 100, 10));
	data = dataIds;
	var options = {
		userName: 'admin',
		password: 'finfosoft123',
		timeout: 1000,
		onSuccess: function() {
			console.log("onConnect");
			for(var i = 0; i < data.length; i++) {
				console.log("订阅第" + i + "个主题");
				client.subscribe(data[i]);
			}
		},
		onFailure: function(message) {
			setTimeout(MQTTconnect, 10000000);
		}
	};
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;
	client.connect(options);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
	if(responseObject.errorCode !== 0) {
		console.log("onConnectionLost:" + responseObject.errorMessage);
	}
}

// called when a message arrives
function onMessageArrived(message) {
	var topic = message.destinationName;
	var payload = message.payloadString;
	console.log(JSON.parse(payload));
//	console.log("onMessageArrived:" + "=topic=" + topic + "==message==++=" + message.payloadString);
}