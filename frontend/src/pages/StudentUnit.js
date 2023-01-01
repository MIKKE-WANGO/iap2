
import "../css/student.css"
import React,{useEffect,useState} from 'react'

import { Link, useNavigate,useParams } from "react-router-dom"
import { toast } from 'react-toastify'

const StudentUnit = (props) => {

    const [messages, setMessages] = useState([])
    const [Activities, setActivities] = useState([]) 
    const Id = useParams(props.id)

    useEffect(() => {
        getActivities()
    }, []);

  async function getActivities() {
    let response = await fetch(`http://127.0.0.1:8000/ams/unit-activities/${Id.id}`, {
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
       
  }
  return (
    <div className="unit">
        <div className="messages">
            <h4>Messages</h4>
            {messages.map(message => 
                      <div className="info">
                      <p style={{color:'blue'}}>{message.title}</p>
                      <p>{message.message}</p>
                     </div> 
             )}
        </div>
        

        <div className="activities">
            <h4>Activities</h4>
            {Activities.map(Activity => 
                     <div className="info">
                          <p  style={{color:'blue'}}>{Activity.title}</p>
                          <p>{Activity.message}</p>
                          </div> 
                          
                          
                    
             )}
        </div>
        
    </div>
  )
}

export default StudentUnit