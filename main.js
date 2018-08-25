update();
setInterval(update, 10000);	//cryptocompare API updates every 10 seconds, so we might get 0 to 9.999 second old data

setTimeout(function(){
	window.location.reload(true);
}, 1000 * 60 * 30); //reload instead of just update however often

getInfo();

var qs = new URLSearchParams(new URL(document.URL).search);

document.getElementById("container").style.height = qs.get("height") + "px";
document.getElementById("container").style.width = qs.get("width") + "px";

function update(){
	var column = document.getElementById("column");
	$.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,BCH,ETH,LTC,XMR&tsyms=USD", function(data){
		while(column.firstChild){	//wipe the column
			column.removeChild(column.firstChild);
		}
		var maxDigits = 0;
		var maxDecimals = 0;

		$.each(data, function(index, value){	//figure out how much space the data will take up
			maxDigits = Math.max(value.USD.toString().indexOf("."), maxDigits);
			maxDecimals = Math.max((value.USD.toString().length - value.USD.toString().indexOf(".")) - 1, maxDecimals);
		});

		$.each(data, function(index, value){
			column.appendChild(newEntry(index, value.USD, maxDigits, maxDecimals));
		});
	}, "json");
}

function newEntry(c, p, pr, tr){	//create a row with given data
	var elem = document.createElement("div");	//row entry container
	var coin = document.createElement("div");	//left element
	var price = document.createElement("div");	//right element

	elem.classList.add("row");
	coin.classList.add("coin");
	price.classList.add("price");

	price.textContent = normalizeFloat(p, pr, tr, "$");
	coin.textContent = c + "\xa0";
	
	elem.appendChild(coin);
	elem.appendChild(price);

	return elem;
}

function normalizeFloat(value, preceding, trailing, symbol){	//fancy numbers
	var str = value.toString();
	if(str.indexOf(".") < 0){
		str += ".0";	//The return value shall always be in a sane format
	}
	var oldStr = str;
	str = symbol + str;
	for(var i = 0; i < preceding - oldStr.indexOf("."); i++){
		str = "\xa0" + str;	//Normal spaces are ignored
	}
	for(var i = 0; i < trailing+1 - (oldStr.length - oldStr.indexOf(".")); i++){
		str += "\xa0";
	}
	return str;
}

function getInfo(){	//102% certified SO blackmagic
	window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
	var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
	pc.createDataChannel('');
	pc.createOffer(pc.setLocalDescription.bind(pc), noop);
	pc.onicecandidate = function(ice){
		if (ice && ice.candidate && ice.candidate.candidate){
			var ip = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
			pc.onicecandidate = noop;
			document.getElementById("ip").innerHTML = ip;
		}
	};
}