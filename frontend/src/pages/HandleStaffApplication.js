import React,{useEffect,useState} from 'react'
import "../css/review.css"
import { Link, useNavigate,useParams } from "react-router-dom"
import { toast } from 'react-toastify'


const HandleStaffApplication = () => {
  const [applications, setApplications] = useState([]) 
    

  
    useEffect(() => {
        getApplications()
    }, []);

    useEffect(() => {
        
    }, [applications]);


  
  async function getApplications() {
    let response = await fetch('http://127.0.0.1:8000/ams/staff-application', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',  
            'Authorization': `Bearer ${localStorage.getItem('access')}`,                       
        },     
        
    });
    let data = await response.json();   
    setApplications(data.staff_applications)
    
    
  }


  async function Register(pk,action) {
    let response = await fetch(`http://127.0.0.1:8000/ams/staff-application/${pk}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',  
            'Authorization': `Bearer ${localStorage.getItem('access')}`,              
            
        },     
        body:JSON.stringify({'action':action})
    });
    let data = await response.json();   
    if(!response.ok){
        
        toast.error("Internal error unable to register student");
        return console.log('not authorised') 
        
    }
    if(data.success === 'Employed  successfully'){
        toast.success('staff accepted')
        getApplications()
    }
    if(data.success === 'Application Rejected'){
        toast.success('staff Rejected')
        getApplications()
    }
  
    
    
  }


  return (
    <div className='dark'>
    <div className='table'>
        <table class="styled-table">
          <thead>
              <tr>
                  <th style={{width:'10%'}}>email</th>
                  <th style={{width:'25%'}}>Name</th>
                  <th style={{width:'25%'}}>Department ID</th>
                  
                  <th></th>
                  <th></th>
              </tr>
          </thead>
          <tbody>
            {applications.map(application => 
              <tr>
                  <td style={{width:'30%'}}>{application.email}</td>
                  <td style={{width:'35%'}}>{application.name}</td>               
                  <td style={{width:'20%'}}>{application.department}</td>
                  
                  <td onClick={e => Register(application.id,'accept')}style={{color:'green',cursor:'pointer'}}>Accept</td>
                  <td onClick={e => Register(application.id, 'reject')}style={{color:'red',cursor:'pointer'}}>Reject</td>
              </tr>
            )}
            
          </tbody>
        </table>
        
      </div>
      </div>
  )
}

export default HandleStaffApplication