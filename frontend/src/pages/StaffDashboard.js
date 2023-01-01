
import "../css/student.css"
import React,{useEffect,useState} from 'react'

import { Link, useNavigate,useParams } from "react-router-dom"
import { toast } from 'react-toastify'


const StaffDashboard = () => {

  const [messages, setMessages] = useState([])

  useEffect(() => {
    getActivities()
}, []);

  async function getActivities() {
  let response = await fetch(`http://127.0.0.1:8000/ams/announcements`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',  
          'Authorization': `Bearer ${localStorage.getItem('access')}`,                       
      },     
      
  });
  let data = await response.json();   
  setMessages(data.announcements)
    
  }
  return (
    <div className="dark">
      <div className="messages">
            <h4 style={{color:"antiquewhite", margin:20}}>Staff announcements</h4>

            {messages.map(message => 
                      <div className="info">
                      <p style={{color:'blue'}}>{message.title}</p>
                      <p>{message.message}</p>
                     </div> 
             )}
        </div>

    </div>
  )
}

export default StaffDashboard