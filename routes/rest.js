const apiKey = 'a079906fe74d05d272d283d1f9b625de';
const request = require('request');


function getCityWeather(res, city) {
    const options = {
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a079906fe74d05d272d283d1f9b625de`,
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        body = JSON.parse(body);
        if (body.cod == '404') {
            res.send({ mes: '404' });
        } else {
            let data = {
                name: city,
                temp: Math.round(body.main.temp),
                wind: 'Speed ' + body.wind.speed + ', degrees ' + body.wind.deg,
                desc: body.weather[0].main,
                pres: body.main.pressure,
                hum: body.main.humidity + ' %',
                coords: "[" + data.coord.lat + ", " + data.coord.lon + "]",
                iconSrc: "https://openweathermap.org/img/wn/" + data.weather[0]['icon'] + "@2x.png"
            };
            res.send(data);
        }
    });
}

function getCoordsWeather(res, lon, lat) {
    const options = {
        method: 'GET',
        url: `https://api.openweathermap.org/data/2.5/find?lon=${lon}&lat=${lat}&appid=a079906fe74d05d272d283d1f9b625de`
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        body = JSON.parse(body);
        if (body.cod == '400') {
            res.send({ mes: body.message });
        } else {
            body = body.list[0];
            let data = {
                name: city,
                temp: Math.round(body.main.temp),
                wind: 'Speed ' + body.wind.speed + ', degrees ' + body.wind.deg,
                desc: body.weather[0].main,
                pres: body.main.pressure,
                hum: body.main.humidity + ' %',
                coords: "[" + data.coord.lat + ", " + data.coord.lon + "]",
                iconSrc: "https://openweathermap.org/img/wn/" + data.weather[0]['icon'] + "@2x.png"
            };
            res.send(data);
        }
    });
}

module.exports.getCoordsWeather = getCoordsWeather;
module.exports.getCityWeather = getCityWeather;
