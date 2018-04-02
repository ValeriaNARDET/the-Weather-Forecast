var request = new XMLHttpRequest();

request.open('GET', 'https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json', true) // последний параметр указывает на синхронность или асинхронность запроса. В данном случае запрос асинхронный


request.onreadystatechange = function(){
	if (request.readyState != 4){
		return;
	}

	if (request.status == 200){
		console.log('all ok');
		
		var data = JSON.parse(request.responseText);

				var countryList = document.getElementById("countryList");
				var cityList = document.getElementById("cityList");
				var arrData = Object.keys(data).sort();
				console.log(arrData);

				// for (var key in data) { // заносим список стран в селект из распарсенных данных без сортировки по алфавиту
				// 	var option = document.createElement("option");
				// 	option.innerHTML = key;
				// 	countryList.appendChild(option);
				// }

				for (var count = 0; count < arrData.length; count++) { // страны в алфавитной сортировке
					
					var option = document.createElement("option");
					option.innerHTML = arrData[count];
					countryList.appendChild(option);
				}

				// var inputCounrty = document.getElementById("enterCountry"); // сравнение введенного значения в инпут со списком стран
				// inputCounrty.onkeydown = function () {						// пока что не работает
				// 	inputCounrty.value == (key in data)						// нужно провести побитовую проверку с учетом регистра и при отсуствующих буквам
				// }
	
				countryList.onchange = function countryChange() { // подгружаем список городов, соответствующих выбраной в селекте стране
					var country = countryList.value.length;
					cityList.innerText = "choise the city"; // почистить список городов
					data[countryList.value].sort(); // сортируем города по алфавиту

					for (var i = 0; i < data[countryList.value].length; i++) {
						var option1 = document.createElement("option");
					    option1.innerHTML = data[countryList.value][i];
						cityList.appendChild(option1);
					}
				};

				cityList.onchange = function cityChange() { // посылаем запрос погоды для выбраного города и вставляем его в диве в страницу
					var city = cityList.value;
					var request = new XMLHttpRequest() 
					var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + city + "v%22)%20and%20u%3D'c'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
					
					console.log(city)
					
					request.open('GET', url, true) // последний параметр указывает на синхронность или асинхронность запроса. В данном случае запрос асинхронный
					
					
					request.onreadystatechange = function(){ //обработчик изменения статуса запроса. Статус == 4 сигнализирует о том, что запрос окончен.
					    if (request.readyState != 4){
					        return;
					    }
					
					    if (request.status == 200){
					    	var city = cityList.value;
		
							var weatherC = JSON.parse(request.responseText);
							console.log(weatherC);
							var txt1 = "Восход: " + (weatherC.query.results.channel.astronomy.sunrise) + "\n";
							var txt2 = "Закат: " + (weatherC.query.results.channel.astronomy.sunset) + '\n';
							var txt3 = "Дата: " + (weatherC.query.results.channel.item.forecast[0].date) + '\n';
							var txt4 = "День: " + (weatherC.query.results.channel.item.forecast[0].day) + '\n';
							var txt5 = "Температура1: " + (weatherC.query.results.channel.item.forecast[0].high) + '\n';
							var txt6 = "Температура2: " + (weatherC.query.results.channel.item.forecast[0].low) + '\n';
							weather.innerHTML = txt1 + " " + txt2 + " " + txt3 + " " + txt4 + " " + txt5 + " " + txt6;
						}
					    else {
					        alert('trouble: ' +  request.status + ', ' + request.statusText );
					    }
					}
					
					request.send() 
				}  
        } else {alert('trouble: ' +  request.status + ', ' + request.statusText )};
};
request.send();

