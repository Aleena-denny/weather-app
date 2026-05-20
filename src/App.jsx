import { useState } from "react";

const API_KEY = import.meta.env.VITE_API_KEY;

const weatherBackgrounds = {
  Clear: "linear-gradient(135deg, #f6931bff 0%, #ffd200 50%, #f7971e 100%)",
  Clouds: "linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)",
  Rain: "linear-gradient(135deg, #1c3f5e 0%, #2c6b9e 50%, #4a90d9 100%)",
  Drizzle: "linear-gradient(135deg, #3a7bd5 0%, #3a9bd5 100%)",
  Thunderstorm: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  Snow: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
  Mist: "linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)",
  Fog: "linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)",
  Haze: "linear-gradient(135deg, #f3904f 0%, #3b4371 100%)",
  default: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
};

const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  Haze: "🌤️",
  default: "🌡️",
};

const popularCities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad"];

function getTextColor(condition) {
  const darkBg = ["Rain", "Thunderstorm", "Mist", "Fog", "default"];
  return darkBg.includes(condition) ? "#ffffff" : "#1a1a1a";
}

function getSubTextColor(condition) {
  const darkBg = ["Rain", "Thunderstorm", "Mist", "Fog", "default"];
  return darkBg.includes(condition) ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.6)";
}

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric");
  const [animKey, setAnimKey] = useState(0);

  const condition = weather?.weather?.[0]?.main || "default";
  const bg = weatherBackgrounds[condition] || weatherBackgrounds.default;
  const textColor = getTextColor(condition);
  const subColor = getSubTextColor(condition);
  const icon = weatherIcons[condition] || weatherIcons.default;

  async function fetchWeather(cityName) {
    if (!cityName.trim()) return;
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast([]);
    try {
      const [wRes, fRes] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${unit}`),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=${unit}&cnt=5`)
      ]);
      if (!wRes.ok) throw new Error("City not found. Please check the spelling.");
      const wData = await wRes.json();
      const fData = await fRes.json();
      setWeather(wData);
      setForecast(fData.list || []);
      setAnimKey(k => k + 1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchWeather(city);
  }

  function toggleUnit() {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);
    if (weather) fetchWeather(weather.name);
  }

  const tempSymbol = unit === "metric" ? "°C" : "°F";

  const styles = {
    app: {
      minHeight: "100vh",
      background: weather ? bg : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      transition: "background 1.2s ease",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Georgia', serif",
      padding: "40px 20px",
    },
    appTitle: {
      fontSize: "14px",
      letterSpacing: "6px",
      textTransform: "uppercase",
      color: weather ? subColor : "rgba(255,255,255,0.5)",
      marginBottom: "8px",
      fontFamily: "'Courier New', monospace",
    },
    searchForm: {
      display: "flex",
      gap: "10px",
      marginBottom: "24px",
      width: "100%",
      maxWidth: "480px",
    },
    input: {
      flex: 1,
      padding: "14px 20px",
      borderRadius: "50px",
      border: "none",
      fontSize: "16px",
      background: "rgba(255,255,255,0.18)",
      backdropFilter: "blur(10px)",
      color: "#fff",
      outline: "none",
      boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      fontFamily: "'Courier New', monospace",
    },
    searchBtn: {
      padding: "14px 24px",
      borderRadius: "50px",
      border: "none",
      background: "rgba(255,255,255,0.9)",
      color: "#1a1a2e",
      fontWeight: "bold",
      cursor: "pointer",
      fontSize: "15px",
      fontFamily: "'Courier New', monospace",
      letterSpacing: "1px",
    },
    citiesRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      justifyContent: "center",
      marginBottom: "32px",
      maxWidth: "500px",
    },
    cityChip: {
      padding: "6px 16px",
      borderRadius: "50px",
      border: "1px solid rgba(255,255,255,0.3)",
      background: "rgba(255,255,255,0.12)",
      color: "rgba(255,255,255,0.85)",
      fontSize: "13px",
      cursor: "pointer",
      fontFamily: "'Courier New', monospace",
      letterSpacing: "0.5px",
    },
    card: {
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(20px)",
      borderRadius: "28px",
      padding: "40px 48px",
      width: "100%",
      maxWidth: "480px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      border: "1px solid rgba(255,255,255,0.2)",
      animation: "fadeSlideUp 0.6s ease forwards",
    },
    cityName: {
      fontSize: "28px",
      fontWeight: "bold",
      color: textColor,
      marginBottom: "4px",
      letterSpacing: "1px",
    },
    countryBadge: {
      display: "inline-block",
      fontSize: "12px",
      letterSpacing: "3px",
      color: subColor,
      textTransform: "uppercase",
      marginBottom: "28px",
      fontFamily: "'Courier New', monospace",
    },
    tempRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "8px",
    },
    temp: {
      fontSize: "72px",
      fontWeight: "bold",
      color: textColor,
      lineHeight: 1,
      letterSpacing: "-2px",
    },
    iconBig: {
      fontSize: "72px",
      lineHeight: 1,
    },
    desc: {
      fontSize: "18px",
      color: subColor,
      textTransform: "capitalize",
      marginBottom: "28px",
      fontStyle: "italic",
    },
    divider: {
      height: "1px",
      background: "rgba(255,255,255,0.2)",
      margin: "20px 0",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "24px",
    },
    statBox: {
      background: "rgba(255,255,255,0.1)",
      borderRadius: "16px",
      padding: "16px",
      textAlign: "center",
    },
    statLabel: {
      fontSize: "11px",
      letterSpacing: "2px",
      color: subColor,
      textTransform: "uppercase",
      fontFamily: "'Courier New', monospace",
      marginBottom: "6px",
    },
    statValue: {
      fontSize: "22px",
      fontWeight: "bold",
      color: textColor,
    },
    forecastRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "8px",
    },
    forecastItem: {
      flex: 1,
      background: "rgba(255,255,255,0.1)",
      borderRadius: "14px",
      padding: "10px 6px",
      textAlign: "center",
    },
    forecastTime: {
      fontSize: "11px",
      color: subColor,
      fontFamily: "'Courier New', monospace",
      marginBottom: "4px",
    },
    forecastIcon: {
      fontSize: "20px",
      marginBottom: "4px",
    },
    forecastTemp: {
      fontSize: "14px",
      fontWeight: "bold",
      color: textColor,
    },
    unitBtn: {
      marginTop: "20px",
      background: "rgba(255,255,255,0.15)",
      border: "1px solid rgba(255,255,255,0.3)",
      borderRadius: "50px",
      padding: "8px 20px",
      color: textColor,
      cursor: "pointer",
      fontFamily: "'Courier New', monospace",
      fontSize: "13px",
      letterSpacing: "1px",
    },
    errorBox: {
      background: "rgba(255,80,80,0.2)",
      border: "1px solid rgba(255,80,80,0.4)",
      borderRadius: "16px",
      padding: "16px 28px",
      color: "#fff",
      fontFamily: "'Courier New', monospace",
      fontSize: "14px",
      maxWidth: "480px",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.app}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.5); }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={styles.appTitle}>Weather Forecast</div>
      </div>

      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          style={styles.input}
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        <button type="submit" style={styles.searchBtn}>GO</button>
      </form>

      <div style={styles.citiesRow}>
        {popularCities.map(c => (
          <button key={c} style={styles.cityChip}
            onClick={() => { setCity(c); fetchWeather(c); }}>
            {c}
          </button>
        ))}
      </div>

      {loading && <div style={{ fontSize: "40px" }}>🌀</div>}
      {error && <div style={styles.errorBox}>⚠️ {error}</div>}

      {weather && !loading && (
        <div key={animKey} style={styles.card}>
          <div style={styles.cityName}>{weather.name}</div>
          <div style={styles.countryBadge}>{weather.sys?.country}</div>

          <div style={styles.tempRow}>
            <div style={styles.temp}>{Math.round(weather.main?.temp)}{tempSymbol}</div>
            <div style={styles.iconBig}>{icon}</div>
          </div>

          <div style={styles.desc}>{weather.weather?.[0]?.description}</div>
          <div style={styles.divider} />

          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Feels Like</div>
              <div style={styles.statValue}>{Math.round(weather.main?.feels_like)}{tempSymbol}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Humidity</div>
              <div style={styles.statValue}>{weather.main?.humidity}%</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Wind</div>
              <div style={styles.statValue}>{Math.round(weather.wind?.speed)} {unit === "metric" ? "m/s" : "mph"}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Visibility</div>
              <div style={styles.statValue}>{((weather.visibility || 0) / 1000).toFixed(1)} km</div>
            </div>
          </div>

          {forecast.length > 0 && (
            <>
              <div style={{ ...styles.statLabel, marginBottom: "10px" }}>NEXT FEW HOURS</div>
              <div style={styles.forecastRow}>
                {forecast.slice(0, 4).map((f, i) => (
                  <div key={i} style={styles.forecastItem}>
                    <div style={styles.forecastTime}>
                      {new Date(f.dt * 1000).getHours()}:00
                    </div>
                    <div style={styles.forecastIcon}>
                      {weatherIcons[f.weather?.[0]?.main] || "🌡️"}
                    </div>
                    <div style={styles.forecastTemp}>
                      {Math.round(f.main?.temp)}{tempSymbol}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ textAlign: "center" }}>
            <button style={styles.unitBtn} onClick={toggleUnit}>
              Switch to {unit === "metric" ? "°F" : "°C"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}