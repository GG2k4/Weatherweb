import './Dashboard.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';


const api = {
  key: "30d873a191564619bf7143743232306",
  base: "https://api.weatherapi.com/v1/current.json"
};


const dateBuilder = (d) => {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();


  return `${day} ${date} ${month} ${year}`;
};


export function Dashboard() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [hovered, setHovered] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    getLocation();
  }, []);


  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        showPosition,
        handleLocationError
      );
    } else {
      // Geolocation is not supported by this browser.
    }
  }


  function showPosition(position) {
    const { latitude, longitude } = position.coords;
    axios
      .get(`${api.base}?key=${api.key}&aqi=yes&q=${latitude},${longitude}`)
      .then(result => {
        setError('');
        setWeather(result.data);
        setQuery('');
      });
  }


  function handleLocationError(error) {
    // Handle location error (e.g., user denies access, timeout, etc.)
    console.error(error);
    // Set default location here (e.g., using a predefined location or showing an error message)
  }


  const search = evt => {
    if (evt.key === "Enter") {
      axios.get(`${api.base}?q=${query}&key=${api.key}&aqi=yes`)
        .then(result => {
          setError('');
          setWeather(result.data);
          setQuery('');
          console.log(result);
        })
        .catch(err => {
          //window.location.reload(false);
          setError('An Error occured while searching.');
        });
    }
  };


  const divClassName = hovered ? 'expanded' : 'collapsed';


  const handleHomeButtonClick = () => {
    getLocation();
  };


  return (
    <div className={(typeof weather.current !== "undefined" && typeof weather.location !== "undefined") ? ((weather.current.temp_c > 16) ? 'app warm' : 'app') : 'app'}>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
          <button className="home-button" onClick={handleHomeButtonClick}>
            Home
          </button>
        </div>
        {error && (
          <div className='Error-message'>{error}</div>
        )}
        {(typeof weather.current !== "undefined" && typeof weather.location !== "undefined") ? (
          <div>
            <div className="location-box">
              <div className="location">{weather.location.name}, {weather.location.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div
              className={`weather-box temp ${divClassName}`}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {!hovered && (
                <div className="temp">
                  {Math.round(weather.current.temp_c)}°c
                </div>
              )}
              {hovered && (
                <div className="additional-info">
                  <div>{weather.current.condition.text}</div>
                  <div>Temperature: {Math.round(weather.current.temp_c)}°c</div>
                  <div>AQI: {Math.round(weather.current.air_quality.co)}</div>
                  <div>Local Time: {weather.location.localtime}</div>
                  <div>Humidity: {weather.current.humidity}</div>
                  <div>Precipitation: {weather.current.precip_mm} mm</div>
                  <div>Wind Velocity: {weather.current.wind_kph} kph</div>
                </div>
              )}
            </div>
          </div>
        ) : ('')}
      </main>
    </div>
  );
}



