
import "../css/student.css"
import React,{useEffect,useState} from 'react'

import { Link, useNavigate,useParams } from "react-router-dom"
import { toast } from 'react-toastify'


const StudentDashboard = () => {

  const [classes, setClasses] = useState([])
  const [type, setType] = useState('registered') 
  
  
  
  
  
  useEffect(() => {
    choice()
}, [type]);

  async function getRegistered() {
    let response = await fetch('http://127.0.0.1:8000/ams/student-units/registered', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',  
            'Authorization': `Bearer ${localStorage.getItem('access')}`,                       
        },     
        
    });
    let data = await response.json();   
    setClasses(data.units)
       
  }

  async function getUnregistered() {
    let response = await fetch('http://127.0.0.1:8000/ams/student-units/unregistered', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',  
            'Authorization': `Bearer ${localStorage.getItem('access')}`,                       
        },     
        
    });
    let data = await response.json();   
    setClasses(data.units)
       
  }

  const choice = () => {
    if(type === 'registered'){
      getRegistered()
    }
    else{
      getUnregistered()
    }

  }

  async function Register(pk) {
    let response = await fetch(`http://127.0.0.1:8000/ams/register-unit/${pk}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',  
            'Authorization': `Bearer ${localStorage.getItem('access')}`,              
            
        },     
    
    });
    let data = await response.json();   
    if(!response.ok){
        
        toast.error("Internal error unable to register unit");
        return console.log('not authorised') 
        
    }
    if(data.success === 'Unit registered successfully'){
        toast.success('Unit registered successfully')
        
    }

    getUnregistered()
  
    
    
  }

  return (
    <div className="dark">
      <div className='head'>
        <div className='registered' onClick={e => setType('registered')}>Registered classes</div>
        <div className='unregistered' onClick={e => setType('unregistered')}>Unregistered classes</div>
      </div>

      {type === 'unregistered' ? 
        <div className='classes'>
       
              <div className='table'>
                <table class="styled-table">
                  <thead>
                      <tr>
                          
                          <th style={{width:'25%'}}>Name</th>
                          
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
                    {classes.map(clas => 
                      <tr>
                          <td style={{width:'30%'}}>{clas.name}</td>
                          <td onClick={e => Register(clas.id)}style={{color:'red',cursor:'pointer'}}>Register</td>
                          
                          
                      </tr>
                    )}
                    
                  </tbody>
                </table>
              </div>
         
        </div>
             
         
      :
      <div className='classes'>
          
              <div className='table'>
                <table class="styled-table">
                  <thead>
                      <tr>
                          
                          <th style={{width:'25%'}}>Name</th>
                          
                          <th></th>
                      </tr>
                  </thead>
                  <tbody>
                    {classes.map(clas => 
                      <tr >
                          <td style={{width:'30%'}}>{clas.name}</td>
                          <td style={{color:'red',cursor:'pointer'}}><Link to={`/student-unit/${clas.id}`}>View</Link></td>
                          
                          
                      </tr>
                    )}
                    
                  </tbody>
                </table>
              </div>
             
          
        </div>
            
      }

      </div>
    
  )
}

export default StudentDashboard