import { useState } from "react"
import { Cookies } from 'react-cookie';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './login.css';
import { useCookies } from 'react-cookie';


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['theme', 'session_id', 'user_id']); 
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    // Function to change theme and save it to cookies
    const toggleBodyColor = () => {
        const savedTheme = cookies.theme;
        setCookie('theme', savedTheme === 'Light' ? 'Dark' : 'Light', { path: '/' });
    };

    async function handleEmailLogin(e) {
      e.preventDefault();
  
      try {
          setError("");
          setLoading(true);
  
          // Make an HTTP POST request to your backend API endpoint
          const response = await axios.post('http://localhost:8000/login/', {
              email,
              password,
          });
  
          // Handle successful response
          const { data } = response;
          if (data.success) {
              const cookies = new Cookies(null, { path: '/' });
              cookies.set('session', "loggedIn");
              cookies.set('user_id', data.user_id);
              cookies.set('session_id', data.session_id);

              setShowSuccessPopup(true);
              setTimeout(() => {
                  navigate("/");
              }, 2000); // Redirect after 2 seconds
          } else {
              setShowErrorPopup(true);
              setTimeout(() => {
                  setShowErrorPopup(false); // Hide the error popup after 3 seconds
              }, 3000);
          }
      } catch (err) {
          setShowErrorPopup(true);
          setError("Failed to login - " + err.message);
      }
  
      setLoading(false);
  }
  
    
    async function handlePasswordReset() {
        // const email = prompt('Please enter your email ');
        // resetPassword(email);
        // alert('Email sent! Check your inbox for password reset instructions');
    }

    return (
        <main>
            {/* Theme changer button at top right corner */}
            <div className="theme-changer" onClick={toggleBodyColor}>
                 Choose {cookies.theme === 'Light' ? 'Dark' : 'Light'} Mode
            </div>

            <div className="card">
                <div className="card2">
                    <form className="form" onSubmit={handleEmailLogin}>
                        <p id="heading">Login</p>
                        <div className="field">
                            <input
                                type="email"
                                className="input-field"
                                placeholder="Email"
                                autoComplete="off"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <input 
                                type="password" 
                                className="input-field" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="btn">
                            <button type="submit" className="button1">Login</button>
                            <button type="button" className="button2" onClick={() => navigate('/signup')}>Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>   

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="success-popup">Login Successful</div>
            )}

            {/* Error Popup */}
            {showErrorPopup && (
                <div className="error-popup">Incorrect Email or Password</div>
            )}
        </main>
    )
}
