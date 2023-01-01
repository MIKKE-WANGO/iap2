import React from 'react'
import "../css/landing.css"
import { Link, useNavigate } from "react-router-dom"
const AdmDashboard = () => {
  return (
   
    <div class='landing-choices'>
        <div><Link to='/handle-student-application'>View student applications</Link></div>
        <div><Link to='/handle-staff-application'>View staff applications</Link></div>
        <div><Link to='/create-announcements'>Create announcements</Link></div>
    </div>
    
  )
}

export default AdmDashboard