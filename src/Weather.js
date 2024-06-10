import React, { useEffect, useRef, useState } from "react";
import './Weather.css';

const apis = "9d61ad8ba8885f49330c8de6b1e37b9f";

const Weather = () => {
  const [dark, setDark] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const inputRef = useRef();

  /// ----- dark monde and light mode function -------------- >
  const changeBackground = () => {
    setDark(!dark);
  };

  /// ----- search city and zip code function -------------- >
  const searchWeather = async (city) => {
    if (city === "") {
      alert("Enter city name");
      return;
    }
    let url;
    if (isNaN(city)) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apis}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?zip=${city},in&units=metric&appid=${apis}`;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeatherData({
        temperature: Math.floor(data.main.temp),
        location: data.name,
        timezone: data.timezone,
        icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      });
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  /// ------- day and time function ----------- >
  const updateDateTime = (timezone) => {
    const now = new Date();
    const localTime = now.getTime();
    const localOffset = now.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const targetTime = utc + (timezone * 1000);
    const targetDate = new Date(targetTime);
    
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    const dateTimeString = targetDate.toLocaleString(undefined, options);
    setCurrentTime(dateTimeString);
  };

  useEffect(() => {
    searchWeather("delhi");
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (weatherData) {
        updateDateTime(weatherData.timezone);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [weatherData]);

  return (
    <div className={`weather ${dark ? "active" : ""}`}>
      <div className="weather_div">
        <div className="search_div">
          <div className="search_bar">
            <input type="text" ref={inputRef} id="search" placeholder="Search City or zip code" />
            <label
              htmlFor="search"
              className="fa-solid fa-search"
              onClick={() => searchWeather(inputRef.current.value)}
            ></label>
          </div>
          <div className="light_dark">
            <i
              className={`fa-solid ${dark ? "fa-moon" : "fa-sun"}`}
              onClick={changeBackground}
            ></i>
          </div>
        </div>
        {weatherData && (
          <div className="weather_loc">
            <div className="weather_temp">
              <img src={weatherData.icon} alt="Weather Icon" />
              <h2>{weatherData.temperature}°C</h2>
              <p className="location">{weatherData.location}</p>
            </div>
            <div className="weather_time">
              <div className="my_time">{currentTime}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
