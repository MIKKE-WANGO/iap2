
import React ,{useState,useEffect}from 'react'
import "../css/login.css"
import { Link, useNavigate } from "react-router-dom"


import {  toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';

const ApplyStaff = () => {

  
 
  const [formData, setFormData] = useState({
    name:'',
    email: '',
    department:'Finance'

  })

  const [accountCreated, setAccountCreated] = useState(false)

  
  useEffect(() => {
    //redirect()
  },[accountCreated])

  //destructure to access formData keys  individually
  const {name,email,department} = formData

  let navigate = useNavigate()

  let redirect = ()  => {
    if(accountCreated){
        console.log('redirected')
        return navigate('/login')
        }
    
    }

  const onChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
  }

  
  const onSubmit = e => {
    e.preventDefault()
    apply(formData)
        
    
  };
  
  const apply= async  (formData) => {
  
    let response = await fetch('http://127.0.0.1:8000/ams/staff-application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify(formData)
    })

    let data = await response.json()
    
    //remove items from local storage
    if(!response.ok){
      setAccountCreated(false)

      if( data.error === 'Application with this email already exists'){
        toast.error('Application with this email already exists')
        return console.log('user already exists')    
      }
        
    } else {
      setAccountCreated(true)
      toast.success('Application received.Check your email for any updates on the application.')
      console.log("sign up success") 
     
    }         
  }

  return (
    <div className='login-outer'>
    <div className='login'>
      <div className='login-inner'>
        <p>APPLY AS STAFF</p>

        <hr></hr>
        
        <form onSubmit={e => onSubmit(e)} style={{margin:5}} >
               
                <label for='name'>Full Name</label>
                <input  
                name="name" 
                type="text"
                value={name}
                onChange={e => onChange(e)} 
                />

               <label for='email'>Email address</label>
                <input
                name="email"  
                type="email"
                value={email}
                onChange={e => onChange(e)}                        
                />

                <label>
                Pick your department:
                </label>
                <select value={department} onChange={e => onChange(e)} name="department">
                    <option value="Finance">Finance</option>
                    <option value="Cleaning">Cleaning</option>
                    
                </select>

                <button type='submit'><h4>Apply</h4></button>

               
         
        </form>
               
      </div>
    </div>
    </div>
  )
}

export default ApplyStaff