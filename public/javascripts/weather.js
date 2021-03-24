let geoAccess = false;
let currentPos = {
    lat: "55",
    lon: "37"
}
let adding = "no adding";
let exists = false;

var makeElement = function (tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) {
        element.classList.add(className);
    }
    if (text) {
        element.textContent = text;
    }
    if (className == "btn" && text == '\u00D7') {
        element.onclick = removeCard;
    }
    return element;
};

function hideGeoAsk() {
    let geoAsk = document.getElementById("geo_ask");
    geoAsk.style.transform = 'translate(-350px,0)';
}

function success(position) {
    var latitude = position.coords.latitude; // широта
    var longitude = position.coords.longitude; // долгота
    currentPos.lat = latitude;
    currentPos.lon = longitude;
}

// Обработка ошибок
function error(errorCode) {
    var msg = "";
    switch (errorCode) {
        case 1: msg = "Нет разрешения"; // Пользователь не дал разрешения на определение местоположения
            break;
        case 2: msg = "Техническая ошибка";
            break;
        case 3: msg = "Превышено время ожидания";
            break;
        default: msg = "Что то случилось не так";
    }
    alert(msg);
}

async function getWeatherAPICoords(lon = '37', lat = '55') {
        const url = `/weather/coordinates/?lon=${lon}&lat=${lat}`;
        try {
            let resp = await fetch(url);
            let data = await resp.json();
            console.log(data);

            document.querySelector('.mainCity').innerHTML = data.name;
            document.querySelector('.mainTemp').innerHTML = data.temp + '&deg;C';
            const iconSrc = data.iconSrc;
            let icon = document.querySelector('.bigIcon');
            icon.src = iconSrc;
            document.querySelector('.wind').textContent = data.wind;
            document.querySelector('.clouds').textContent = data.clouds;
            document.querySelector('.pressure').textContent = data.pressure;
            document.querySelector('.humidity').textContent = data.humidity;
            document.querySelector('.coords').innerHTML = data.coords;
        } catch (err) {
            alert("Invalid city");
        }
}

async function getWeatherAPICity(city) {
    const url = `/weather/city/?q=${city}`;
    try {
        let resp = await fetch(url);
        let data = await resp.json();
        
        return data;
    } catch (err) {
        alert("Invalid city");
    }
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
    getWeatherAPICoords();
}

function agreeGeo() {
    geoAccess = true;
    hideGeoAsk();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    }
    getWeatherAPICoords(currentPos.lon, currentPos.lat);
}

function updateGeolocation() {
    if (geoAccess) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        }
        getWeatherAPICoords(currentPos.lon, currentPos.lat);
    }
}

function declineGeo() {
    hideGeoAsk();
}

async function getAllCitiesFromDB() {
    const url = `/favourites`;
    try {
        let resp = await fetch(url);
        let data = await resp.json();
        return await data;
    }
    catch (err) {
        console.log("could not get cities");
    }
}

function noAdding() {
    adding = "no adding";
}

function yesAdding() {
    adding = "yes adding";
}

async function addCityToDB(city) {
    const allCities = await getAllCitiesFromDB();
    let cityNames = [];
    for (var i = 0; i < allCities.length; i++) {
        cityNames.push(allCities[i].name);
    }
    if (cityNames.indexOf(city) == -1) {
        const url = `/favourites/?q=` + city;
        try {
            await fetch(url, { method: 'POST' });
        }
        catch (err) {
            console.log("could not add city");
        }
    }
}

async function deleteCityFromDB(city) {
    const allCities = await getAllCitiesFromDB();
    let cityNames = [];
    for (var i = 0; i < allCities.length; i++) {
        cityNames.push(allCities[i].name);
    }
    if (cityNames.indexOf(city) != -1) {
        const url = `/favourites/?q=` + city;
        try {
            await fetch(url, { method: 'DELETE' });
        }
        catch (err) {
            console.log("could not delete city");
        }
    }
}


function createCityCard(cityName) {
//    //let loader = document.getElementById('loader');
    //    //loader.style.display = 'block';
    let cityCard = makeElement('li', 'card', "");
    let mainLine = makeElement('div', 'mainLine', "");
    let name = makeElement('h3', '', cityName);
    let temp = makeElement('h4', '', '');
    let icon = makeElement('img', 'smallIcon', "");
    let button = makeElement('button', 'btn', '\u00D7');

    let params = makeElement('ul', 'params', "");

    let line1 = makeElement('li', 'line', "");
    let indic1 = makeElement('p', 'indics', "Wind");
    let val1 = makeElement('p', 'vals', '');

    let line2 = makeElement('li', 'line', "");
    let indic2 = makeElement('p', 'indics', "Clouds");
    let val2 = makeElement('p', 'vals', '');

    let line3 = makeElement('li', 'line', "");
    let indic3 = makeElement('p', 'indics', "Pressure");
    let val3 = makeElement('p', 'vals', '');

    let line4 = makeElement('li', 'line', "");
    let indic4 = makeElement('p', 'indics', "Humidity");
    let val4 = makeElement('p', 'vals', '');

    let line5 = makeElement('li', 'line', "");
    let indic5 = makeElement('p', 'indics', "Coordinates");
    let val5 = makeElement('p', 'vals', '');
    
    let promise = getWeatherAPICity(cityName);
        promise
            .then(
                result => {
                    if (result) {

                        temp.innerHTML = result.temp + '&deg;C';
                        icon.src = result.iconSrc;
                        val1.textContent = result.wind;
                        val2.textContent = result.clouds;
                        val3.textContent = result.pressure;
                        val4.textContent = result.humidity;
                        val5.textContent = result.coords;
                        cityCard.id = cityName;

                    }
                    
                    

                })

            mainLine.appendChild(name);
            mainLine.appendChild(temp);
            mainLine.appendChild(icon);
            mainLine.appendChild(button);
            cityCard.appendChild(mainLine);
            line1.appendChild(indic1);
            line1.appendChild(val1);
            line2.appendChild(indic2);
            line2.appendChild(val2);
            line3.appendChild(indic3);
            line3.appendChild(val3);
            line4.appendChild(indic4);
            line4.appendChild(val4);
            line5.appendChild(indic5);
            line5.appendChild(val5);

            params.appendChild(line1);
            params.appendChild(line2);
            params.appendChild(line3);
            params.appendChild(line4);
            params.appendChild(line5);
            cityCard.appendChild(params);

        return cityCard;
            
        //    //loader.style.display = 'none';
}

async function checkIfCityExists(city) {
    let res = false;
    const allCities = await getAllCitiesFromDB();
    let cityNames = [];
    for (var i = 0; i < allCities.length; i++) {
        cityNames.push(allCities[i].name);
    }
    if (cityNames.indexOf(city) == -1) {
        res = true;
    }
    return res;
}




function addCity() {
    
    const text = document.getElementById('text');
    const cards = document.getElementById('cards');
    const cityName = text.value;
    const addBtn = document.getElementById('addBtn');

    
    let promise = getWeatherAPICity(cityName);
    promise
        .then(
            result => {
                if (result) {
                    addCityToDB(cityName);
                    let promise = checkIfCityExists(cityName);
                    promise
                        .then(
                            result => {
                                if (result) {
                                    let city = createCityCard(cityName);
                                    cards.appendChild(city);
                                }
                            })
                }
            })

    text.value = "";
    addBtn.disabled = true;
}

function showFavorites() {
    let promise = getAllCitiesFromDB();
    promise
        .then(
            result => {
                if (result) {
                    for (var i = 0; i < result.length; i++) {
                        const cityName = result[i].name;
                        const cards = document.getElementById('cards');
                        let cityCard = createCityCard(cityName);
                        if (cityCard) {
                            cards.appendChild(cityCard);
                        }
                    }
                }
            })
}


document.addEventListener("DOMContentLoaded", showFavorites);




function enterText() {
    const addBtn = document.getElementById('addBtn');
    const text = document.getElementById('text');

    addBtn.disabled = false;
    if (text.value == '') {
        addBtn.disabled = true;
    }
};


function removeCard() {
    let line = this.parentElement;
    let card = line.parentElement;
    deleteCityFromDB(card.id);
    card.remove();
}


