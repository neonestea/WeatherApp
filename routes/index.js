'use strict';
var express = require('express');
var router = express.Router();

const apiKey = 'a079906fe74d05d272d283d1f9b625de';
const request = require('request');

// Set database connection 
var mysql = require('mysql');

function connect() {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "weatherdb2",
        password: "RootPass12345"
    });

    connection.connect(function (err) {
        if (err) {
            return console.error("Error: " + err.message);
        }
        else {
            console.log("Connected to MySQL successfuly");
        }
    });

    //connection.query("CREATE DATABASE weatherdb2",
    //    function (err, results) {
    //        if (err) console.log(err);
    //        else console.log("DataBase created");
    //    });

    const sql = `create table if not exists cities(
  id int primary key auto_increment,
  name varchar(255) not null
)`;

    connection.query(sql, function (err, results) {
        if (err) console.log(err);
        else console.log("Table created");
    });
    return connection;
}

function disconnect(connection) {
    connection.end(function (err) {
        if (err) {
            return console.log("Error: " + err.message);
        }
        console.log("Connection closed");
    });
}




/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
    console.log("First attempt");
});

function getCityWeather(res, city) {
    const options = {
        method: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=a079906fe74d05d272d283d1f9b625de',
    };
    request(options, function (error, response, body) {
        
        if (error) throw new Error(error);
        body = JSON.parse(body);
        console.log();
        if (body.cod == '404') {
            res.send("{ code: incorrect city }");
        }
        else {
            let data = {
                name: body.name,
                temp: Math.round(body.main.temp - 273),
                iconSrc: "https://openweathermap.org/img/wn/" + body.weather[0]['icon'] + "@2x.png",
                wind: 'Speed ' + body.wind.speed + ', degrees ' + body.wind.deg,
                clouds: body.weather[0].main,
                pressure: body.main.pressure,
                humidity: body.main.humidity + ' %',
                coords: "[" + body.coord.lat + ", " + body.coord.lon + "]"
            }
            res.send(data);
        }
    });
}

function getCoordsWeather(res, lon, lat) {
    const options = {
        method: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=a079906fe74d05d272d283d1f9b625de',
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        body = JSON.parse(body);
        if (body.cod == '400') {
           res.send({ mes: body.message });
           console.log('error');
        }
        else {
            let data = {
                name: body.name,
                temp: Math.round(body.main.temp - 273),
                iconSrc: "https://openweathermap.org/img/wn/" + body.weather[0]['icon'] + "@2x.png",
                wind: 'Speed ' + body.wind.speed + ', degrees ' + body.wind.deg,
                clouds: body.weather[0].main,
                pressure: body.main.pressure,
                humidity: body.main.humidity + ' %',
                coords: "[" + body.coord.lat + ", " + body.coord.lon + "]"
                
            }
            res.send(data);
        }
    });
}

function addCity(city) {
    const connection = connect();
    const sql = `INSERT INTO cities(name) VALUES(\'` + city + `\')`;

    connection.query(sql, function (err, results) {
        if (err) console.log(err);
        //console.log(results);
        
    });
    disconnect(connection);
}

function getCities(res) {
    const connection = connect();
    const sql = `SELECT * FROM cities`;

    connection.query(sql, function (err, results) {
        if (err) console.log(err);
        //console.log(results);
        res.send(results);
    });
    disconnect(connection);
}

function deleteCity(res, city) {
    const connection = connect();
    const sql = "DELETE FROM cities WHERE name=?";
    const data = [city];
    connection.query(sql, data, function (err, results) {
        if (err) console.log(err);
        //console.log(results);
    });
    disconnect(connection);
}

router.get('/weather/coordinates', function (req, res) {
    const lon = req.query.lon;
    const lat = req.query.lat;
    if (lat != ' ' & lon != ' ') {
        getCoordsWeather(res, lon, lat);
    } else {
        res.send({ mes: 'error: coordinates are empty' });
    }
});

router.get('/weather/city', function (req, res) {
    const city = req.query.q;
    if (city != ' ') {
        getCityWeather(res, city);
    } else {
        res.send({ mes: 'error: coordinates are empty' });
    }
});

router.post('/favourites', function (req, res) {
    const city = req.query.q;
    //console.log(city);
    if (city) {
        addCity(city);
        //console.log("City " + city + " added");
    } else {
        res.send({ mes: 'error: no city or already exists' });
    }
});


router.get('/favourites', function (req, res) {
    try {
        getCities(res);
    } catch (err) {
        console.log(err);
    }
})


router.delete('/favourites', function (req, res) {
    if (req.query.q.length != 0) {
        deleteCity(res, req.query.q);
    } else {
        res.send({ mes: 'could not delete' });
    }
})

module.exports = router;
