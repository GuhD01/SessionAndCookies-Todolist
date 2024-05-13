import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './register.css'; 

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    
    async function handleSignup(e) {
      e.preventDefault();
      setError("");
  
      if (username.includes(" ")) {
          return setError("Username must not include spaces");
      }
  
      try {
          setLoading(true);
  
          const response = await axios.post('http://localhost:8000/users', {
              email,
              username,
              password
          });
  
          console.log(response.data); 
  
          setShowSuccessPopup(true); // Show success popup
          setTimeout(() => {
              setShowSuccessPopup(false); // Hide success popup after 3 seconds
              navigate("/login");
          }, 3000);
      } catch (err) {
          setShowErrorPopup(true); // Show error popup
          setTimeout(() => {
              setShowErrorPopup(false); // Hide error popup after 3 seconds
          }, 3000);
      }
  
      setLoading(false);
  }

    return (
        <main>
            <div className="card">
      
      <div className="card2">
        <form className="form" onSubmit={handleSignup}>
          <p id="heading">Register</p>
          <div className="field">
            <input
              type="email" 
              className="input-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
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
            <button type="submit" className="button1">Sign Up</button>
          </div>
          <button type="button" className="button3" onClick={() => navigate('/login')}>
            Already have an account
          </button>         
        </form>
      </div>

                {
                    error && 
                    <div className="text-black justify-center flex text-red-500 italic text-sm text-center">
                        {error}
                    </div>
                }

                <hr className="border-b border-gray-200 my-8" />

                {showSuccessPopup && (
    <div className="success-popup">New Account Created</div>
)}
{showErrorPopup && ( 
    <div className="error-popup">Email has been used</div>
)}
            </div>   
        </main>
    )
}