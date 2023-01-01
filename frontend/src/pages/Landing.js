import React from 'react'

import "../css/landing.css"

import { Link} from "react-router-dom"

const Landing = () => {
  return (
    <div class='landing-choices'>
        <div><Link to='/login'>Login</Link></div>
        <div><Link to='/student-apply'>Apply as a student</Link></div>
        <div><Link to='/staff-apply'>Apply as staff</Link></div>

    </div>
  )
}

export default Landing