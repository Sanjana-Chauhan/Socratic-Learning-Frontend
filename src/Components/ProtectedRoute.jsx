import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isVerified, setIsVerified] = useState(null); // null = loading, false = unauthenticated
  const token = localStorage.getItem("jwt-token");

  useEffect(() => {
    if (!token) {
      setIsVerified(false);
      return;
    }

    fetch(`http://localhost:5125/api/verify-token?token=${token}`, {
      method: 'GET',
    })
      .then(res => {
        if (res.ok) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      })
      .catch(() => {
        setIsVerified(false);
      });
  }, [token]);

  if (isVerified === null) {
    return <div>Loading...</div>; 
  }

  if (!isVerified) {
    return <Navigate to="/signUp" />;
  }

  return children;
};

export default ProtectedRoute;
