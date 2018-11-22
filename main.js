const updateInterval = 10;	//seconds
const refreshInterval = 60 * 30;	//seconds

////////

setTimeout(function(){
	window.location.reload(true);
}, refreshInterval * 1000); //Fetch the page every so often

var seconds = -1;

countDown();
setInterval(countDown, 1000);

getInfo();	//Print IP

document.getElementById("container").style.height = window.innerHeight + "px";
document.getElementById("container").style.width = window.innerWidth + "px";

function update(){
	var column = document.getElementById("column");
	$.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,BCH,ETH,LTC,XMR&tsyms=USD", function(data){
		while(column.firstChild){	//Wipe the column
			column.removeChild(column.firstChild);
		}
		var maxDigits = 0;
		var maxDecimals = 0;

		$.each(data, function(index, value){	//Figure out how much space the data will take up
			maxDigits = Math.max(value.USD.toString().indexOf("."), maxDigits);
			maxDecimals = Math.max((value.USD.toString().length - value.USD.toString().indexOf(".")) - 1, maxDecimals);
		});

		$.each(data, function(index, value){
			column.appendChild(newEntry(index, value.USD, maxDigits, maxDecimals));
		});
	}, "json");
}

function countDown(){
	seconds--;
	if(seconds < 0){
		var bar = $("#bar");

		bar.finish();

		if(bar.attr("data-target") == "0px"){
			bar.attr("data-target", "100%");
		} else{
			bar.attr("data-target", "0px");
		}

		bar.animate({
			width: bar.attr("data-target")
		}, updateInterval * 1000, "linear", function(){
			if(bar.attr("data-origin") == "right"){
				bar.attr("data-origin", "left");
				bar.css("left", "0px");
				bar.css("right", "");
			} else{
				bar.attr("data-origin", "right");
				bar.css("left", "");
				bar.css("right", "0px");
			}
		});

		seconds = updateInterval-1;
		update();
	}
	document.getElementById("timer").innerHTML = seconds;
}

function newEntry(c, p, pr, tr){	//Create a row with given data
	var elem = document.createElement("div");	//Row entry container
	var coin = document.createElement("div");	//Left element
	var price = document.createElement("div");	//Right element

	elem.classList.add("row");
	coin.classList.add("coin");
	price.classList.add("price");

	price.textContent = normalizeFloat(p, pr, tr, "$");
	coin.textContent = c + "\xa0";

	elem.appendChild(coin);
	elem.appendChild(price);

	return elem;
}

function normalizeFloat(value, preceding, trailing, symbol){	//Fancy numbers
	var str = value.toString();
	if(str.indexOf(".") < 0){
		str += ".0";	//The return value shall always be in a sane format
	}
	var oldStr = str;
	str = symbol + str;
	for(var i = 0; i < preceding - oldStr.indexOf("."); i++){
		str = "\xa0" + str;	//Normal spaces are ignored, use escape seq
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
