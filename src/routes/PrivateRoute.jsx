import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({children, role}) => {
  const {user} = useSelector((state)=> state.auth);
  const location = useLocation();
  if(!user){
    alert("You must be login")
    return <Navigate to={'/'} state={{from: location}}/>
  }
  if(role && user?.role !== role){
    alert("Access Denied!");
    return <Navigate to={'/'} state={{from: location}}/>
  }
  return children;
}

export default PrivateRoute