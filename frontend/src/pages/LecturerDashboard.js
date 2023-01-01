
import "../css/student.css"
import React,{useEffect,useState} from 'react'

import { Link, useNavigate,useParams } from "react-router-dom"
import { toast } from 'react-toastify'
import StudentUnit from "./StudentUnit"


const LecturerDashboard = () => {

  const [messages, setMessages] = useState([])
  const [Activities, setActivities] = useState([]) 
  const [unit, setUnit] = useState('')
 

  useEffect(() => {
      getActivities()
  }, []);

async function getActivities() {
  let response = await fetch(`http://127.0.0.1:8000/ams/lec-unit-activities`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',  
          'Authorization': `Bearer ${localStorage.getItem('access')}`,                       
      },     
      
  });
  let data = await response.json();   
  setMessages(data.unit_messages)
  setActivities(data.unit_activities)
  setUnit(data.unit)
     
}


async function deleteActivity(id) {
  let response = await fetch(`http://127.0.0.1:8000/ams/handle-unit-activities`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',  
          'Authorization': `Bearer ${localStorage.getItem('access')}`,                       
      },     
      body: JSON.stringify({id:id})
  });
  let data = await response.json();   
  if (data.success === 'Unit activity deleted successfully'){
    toast.success(' activity deleted successfully')
  }
  getActivities()
}

async function deleteMessage(id) {
  let response = await fetch(`http://127.0.0.1:8000/ams/handle-unit-messages`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',  
          'Authorization': `Bearer ${localStorage.getItem('access')}`,                       
      },     
      body: JSON.stringify({id:id})
  });
  let data = await response.json();   
  if (data.success === 'Unit message deleted successfully'){
    toast.success(' activity deleted successfully')
  }
     
  getActivities()
}
  return (
    <div>
      <h3>{unit}</h3>
      <div className="unit">
        <div className="messages">
            <h4>Messages</h4>
            <Link to={`/message`}>Create new message</Link>
            {messages.map(message => 
                      <div className="info">
                      <p style={{color:'blue',textTransform:'uppercase'}}>{message.title}</p>
                      <p>{message.message}</p>
                      <p onClick={e => deleteMessage(message.id)}style={{color:'red',cursor:'pointer'}}>Delete</p>
                
                     </div> 
             )}
        </div>
        

        <div className="activities">
            <h4>Activities</h4>
            <Link to={`/activity`}>Create new Activity</Link>
            {Activities.map(Activity => 
                     <div className="info">
                          <p  style={{color:'blue', textTransform:'uppercase'}}>{Activity.title}</p>
                          <p>{Activity.message}</p>
                          <p onClick={e => deleteActivity(Activity.id)}style={{color:'red',cursor:'pointer'}}>Delete</p>
                
                          </div> 
                          
                          
                    
             )}
        </div>
        
    </div>
    </div>
  )
}

export default LecturerDashboard