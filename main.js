var column = document.getElementById("column");

function update(){
	$.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,BCH,ETH,LTC,XMR,DGC&tsyms=USD", function(data){
		while(column.firstChild){	//wipe the column
			column.removeChild(column.firstChild);
		}
		$.each(data, function(index, value){
			column.appendChild(newEntry(index, value.USD));
		})
	}, "json");
	console.log("update");
}

function newEntry(c, p){	//create a row (coin, price)
	var elem = document.createElement("div");	//row entry container
	var coin = document.createElement("div");	//left element
	var price = document.createElement("div");	//right element
	var subcoin = document.createElement("div");	//for centering
	var subprice = document.createElement("div");	//^^
	
	elem.classList.add("row");
	coin.classList.add("coin");
	price.classList.add("price");
	subcoin.classList.add("subcoin");
	subprice.classList.add("subprice");
	
	subprice.textContent = "$" + normalizeFloat(p, 6, 6);
	subcoin.textContent = c;

	price.appendChild(subprice);
	coin.appendChild(subcoin);
	elem.appendChild(coin);
	elem.appendChild(price);
	
	return elem;
}

function normalizeFloat(value, preceding, trailing){	//fancy numbers
	var str = value.toString();
	if(str.indexOf(".") < 0){
		str += ".";
	}
	var oldStr = str;
	for(var i = 0; i < preceding - oldStr.indexOf("."); i++){
		str = "\xa0" + str;	//Normal spaces are ignored
	}
	for(var i = 0; i < trailing+1 - (oldStr.length - oldStr.indexOf(".")); i++){
		str += "0";
	}

	return str;
}

var interval = 10000;	//Set here so we can use even multiples later

update();
setInterval(update, interval);	//cryptocompare API updates every 10 seconds, so we might get 0 to 9.999 second old data

setTimeout(function(){
	window.location.reload(true);
}, interval * 6 * 5); //reload every 5 minutes