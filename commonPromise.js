function httpGet(url) {

  return new Promise(function(resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function() {
      if (this.status == 200) {
        resolve(this.response);
      } else {
        var error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      }
    };

    xhr.onerror = function() {
      reject(new Error("Network Error"));
    };

    xhr.send();
  });
}

httpGet("https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json")
  .then(
    response => {
    var data = JSON.parse(response);

    var countryList = document.getElementById("countryList");
    var cityList = document.getElementById("cityList");
    var arrData = Object.keys(data).sort();// сортировка стран по алфавиту

    for (var count = 0; count < arrData.length; count++) { // страны в алфавитной сортировке
        var option = document.createElement("option");
        option.innerHTML = arrData[count];
        countryList.appendChild(option);
    }

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
        var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + city + "v%22)%20and%20u%3D'c'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        
        
        httpGet(url)
            .then(
                res => {
                    var city = cityList.value;
                
                    var weatherC = JSON.parse(res);

                    var txt1 = (weatherC.query.results.channel.astronomy.sunrise);
                    var txt2 = (weatherC.query.results.channel.astronomy.sunset);
                    var txt3 = (weatherC.query.results.channel.item.forecast[0].date);
                    var txt4 = (weatherC.query.results.channel.item.forecast[0].day);
                    var txt5 = (weatherC.query.results.channel.item.forecast[0].high);
                    var txt6 = (weatherC.query.results.channel.item.forecast[0].low);

                    document.getElementById("sunrise").value = txt1;
                    document.getElementById("sunset").value = txt2;
                    document.getElementById("todayData").value = txt3;
                    document.getElementById("weakDay").value = txt4;
                    document.getElementById("t1").value = txt5;
                    document.getElementById("t2").value = txt6;
                    
                    // weather.innerHTML = txt1 + " " + txt2 + " " + txt3 + " " + txt4 + " " + txt5 + " " + txt6;
                }
            );     
        }
    
    }
);