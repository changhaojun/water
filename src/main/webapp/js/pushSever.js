var client; 
var topic;
var realTime;
function MQTTconnect(dataId) {
  console.log("订阅程序开始执行");
  var mqttHost = '192.168.1.114';
  var username="admin";
  var password="password";
	 topic="alarm";
//	  console.log(topic);
	  client = new Paho.MQTT.Client(mqttHost, Number(61623), "server" + parseInt(Math.random() * 100, 10));
	  
	  var options = {
			  timeout: 1000,
			  onSuccess: onConnect,
			  onFailure: function (message) {
				  setTimeout(MQTTconnect, 10000000);
			  }
	  };
	  
	  // set callback handlers
	  client.onConnectionLost = onConnectionLost;
	  client.onMessageArrived = onMessageArrived;
	  
	  if (username != null) {
		  options.userName = username;
		  options.password = password;
	  }
	  client.connect(options);  
	  // connect the client
	  client.connect({ onSuccess: onConnect });
	
}

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe(topic);
/*  var message = new Paho.MQTT.Message("Hello");
  message.destinationName = topic;
  client.send(message);*/
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  var topic = message.destinationName;
  var payload = message.payloadString;
 realTime=message.payloadString;
}
