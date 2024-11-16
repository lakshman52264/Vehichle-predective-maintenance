import React, { useEffect, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, login } = useAuth(); // Use `login` function from context

  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect to homepage if already authenticated
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await login(); // Use `login` function from context
      navigate('/'); // Redirect to homepage after successful login
    } catch (err) {
      setError('Google Sign-In failed. Please try again.');
    }
  };

  return ( 
    <div className="h-screen bg-gray-100">
      {/* Heading at the top of the page */}
      <h1 className="text-4xl font-bold text-center pt-10">Welcome to our page</h1>
  
      {/* Centered login container */}
      <div className="flex justify-center items-center h-full">
        <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M24 9.5c3.5 0 6.3 1.2 8.4 3.2l6.3-6.3C34.3 2.5 29.7 0 24 0 14.6 0 6.9 5.5 3.1 13.5l7.2 5.6C12.5 12 17.7 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.5 24.5c0-1.8-.2-3.6-.5-5.3H24v10h12.5c-1.3 3.4-4.2 6.2-8.1 7.8l7.2 5.6c4.2-3.7 6.9-9.1 6.9-15.6z"/>
              <path fill="#FBBC05" d="M10.3 27.4C9.7 25.9 9.3 24.2 9.3 22.5s.4-3.4 1-5L3.1 13.5C1.1 17.2 0 20.8 0 24.5s1.1 7.3 3.1 11l7.2-5.6z"/>
              <path fill="#EA4335" d="M24 48c5.7 0 10.5-1.9 14-5.1l-7.2-5.6c-2 1.3-4.4 2-6.8 2-6.3 0-11.5-4.2-13.4-10.1L3.1 35c3.8 8 11.5 13 20.9 13z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default Login;
