import React, { useState } from 'react';
import './App.css';

const stations = [
  { name: 'Miyapur' },
  { name: 'Kukatpally' },
  { name: 'Ameerpet' },
  { name: 'Begumpet' },
  { name: 'Paradise' },
  { name: 'Secunderabad' },
  { name: 'Hitec City' },
  { name: 'Raidurg' },
  { name: 'LB Nagar' },
  { name: 'MGBS' },
  { name: 'Nagole' },
];

const savedUser = localStorage.getItem("user");
const savedLoginStatus = localStorage.getItem("isLoggedIn");

function App() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(savedLoginStatus === "true");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerError, setRegisterError] = useState('');

  const handleLogin = () => {
    if (registeredUser && username === registeredUser.username && password === registeredUser.password) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleRegister = () => {
    if (!registerUsername || !registerPassword) {
      setRegisterError('Please enter username and password');
    } else {
      const newUser = { username: registerUsername, password: registerPassword };
      localStorage.setItem("user", JSON.stringify(newUser));
      setRegisteredUser(newUser);
      setIsRegistering(false);
      setRegisterUsername('');
      setRegisterPassword('');
      setRegisterError('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    setUsername('');
    setPassword('');
    setSource('');
    setDestination('');
    setResult(null);
    setError('');
    setLoading(false);
  };

  const handleSubmit = () => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      try {
        if (source === destination) throw new Error('Source and destination cannot be the same.');

        const stationNames = stations.map(s => s.name);
        const srcIndex = stationNames.indexOf(source);
        const destIndex = stationNames.indexOf(destination);
        if (srcIndex === -1 || destIndex === -1) throw new Error('Invalid station selection');

        const route =
          srcIndex < destIndex
            ? stationNames.slice(srcIndex, destIndex + 1)
            : stationNames.slice(destIndex, srcIndex + 1).reverse();

        const totalStations = route.length;
        const baseFare = 10;
        const additionalFare = totalStations > 2 ? (totalStations - 2) * 5 : 0;

        const interchangeStations = ['Ameerpet', 'Secunderabad', 'Paradise', 'Begumpet'];
        const interchanges = route.filter(station => interchangeStations.includes(station));
        const interchangePenalty = interchanges.length * 2;

        const totalFare = baseFare + additionalFare + interchangePenalty;
        const estimatedTime = (totalStations - 1) * 2.5 + interchanges.length * 5;

        const lineChanges = interchanges.map(name => ({ from: 'Red Line', to: 'Blue Line', at: name }));

        const mockRouteData = {
          route,
          totalStations,
          totalDistance: totalStations * 1.5,
          totalFare,
          estimatedTime: `${Math.round(estimatedTime)} minutes`,
          interchanges,
          lineChanges,
        };

        setResult(mockRouteData);
      } catch (err) {
        setError(err.message || 'Something went wrong');
        setResult(null);
      }

      setLoading(false);
    }, 1000);
  };

  const handleClear = () => {
    setSource('');
    setDestination('');
    setResult(null);
    setError('');
  };

  return (
    <div className={`route-finder ${isDarkMode ? 'dark' : ''}`}>
      <div className="header-bar">
        <h2>Hyderabad Metro Route Finder</h2>
        <button onClick={() => setIsDarkMode(prev => !prev)} className="dark-toggle">
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {!isLoggedIn ? (
        <div className="login-form">
          <h3>{isRegistering ? 'Register' : 'Login'} to Continue</h3>

          {isRegistering ? (
            <>
              <input
                type="text"
                placeholder="New Username"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <button onClick={handleRegister}>Register</button>
              {registerError && <p className="error">{registerError}</p>}
              <p>
                Already have an account?{' '}
                <button onClick={() => setIsRegistering(false)}>Login</button>
              </p>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin}>Login</button>
              {loginError && <p className="error">{loginError}</p>}
              <p>
                New here?{' '}
                <button onClick={() => setIsRegistering(true)}>Register</button>
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          <button onClick={handleLogout} className="logout-btn">Logout</button>

          <div className="form-section">
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">Select Source</option>
              {stations.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
            </select>

            <select value={destination} onChange={(e) => setDestination(e.target.value)}>
              <option value="">Select Destination</option>
              {stations.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
            </select>

            <button onClick={handleSubmit} disabled={loading}>Find Route</button>
            <button onClick={handleClear}>Clear</button>
          </div>

          {loading && (
            <div className="spinner-container">
              <div className="spinner"></div>
              <p>Finding route...</p>
            </div>
          )}
          {error && <p className="error">⚠️ {error}</p>}

          {result && (
            <div className="result-box">
              <h3>Route</h3>
              <ul>
                {result.route.map((station, index) => <li key={index}>{station}</li>)}
              </ul>
              <p>Total Stations: {result.totalStations}</p>
              <p>Total Distance: {result.totalDistance} km</p>
              <p>Total Fare: ₹{result.totalFare}</p>
              <p>Estimated Time: {result.estimatedTime}</p>

              {result.interchanges.length > 0 && (
                <>
                  <p>Interchanges: {result.interchanges.join(', ')}</p>
                  <h4>Line Changes:</h4>
                  <ul>
                    {result.lineChanges.map((change, i) => (
                      <li key={i}>{change.from} → {change.to} at {change.at}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;