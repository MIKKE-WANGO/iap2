
import React ,{useState,useEffect}from 'react'

import { toast } from 'react-toastify';

import "../css/login.css"
import { Link, useNavigate } from "react-router-dom"





const CreateAnnouncement = () => {

  const [formData, setFormData] = useState({
    title: '',
    message: ''
  })

  const {title, message} = formData

  
  const onChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
}

  
const onSubmit = e => {
  e.preventDefault()
  create(formData)
 
};

async function  create  (formData)  {
  //retrieve refresh and access
  let response = await fetch('http://127.0.0.1:8000/ams/announcements', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`, 
      },
      body: JSON.stringify(formData)
  })

  //remove items from local storage
  if(!response.ok){
   
    toast.error("Unable to create announcement");
    
    
  }

  let data = await response.json()
  if(data.success === 'Announcement created successfully'){
    toast.success('Announcement created successfully')
}


     
}
  return (
    <div className='login-outer'>
    <div className='login'>
      <div className='login-inner'>
        <p>CREATE ANNOUNCEMENT</p>

        <hr></hr>
        
        <form onSubmit={e => onSubmit(e)} style={{margin:5}} >
               
               <label for='email'>TITLE</label>
                <input
                name="title"  
                type="text"
                value={title}
                onChange={e => onChange(e)}                        
                />

                <label for='password'>ANNOUNCEMENT</label>
                <input  
                name="message" 
                type="text"
                value={message}
                onChange={e => onChange(e)} 
                />

                

                <button type='submit'><h4>CREATE</h4></button>

               
          
        </form>

      
      </div>
    </div>
    </div>
  )
}

export default CreateAnnouncement