import {
  //BrowserRouter as Router,
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import React ,{useState,useEffect}from 'react'

import './App.css';
import Landing from './pages/Landing';
import Login from './pages/Login'
import Activity from './pages/Activity'
import Message from './pages/Message'
import StudentUnit from './pages/StudentUnit'
import ApplyStudent from './pages/ApplyStudent'
import ApplyStaff from './pages/ApplyStaff'
import LecturerDashboard from './pages/LecturerDashboard'
import StaffDashboard from './pages/StaffDashboard'
import StudentDasbboard from './pages/StudentDashboard'
import AdmDashboard from './pages/AdmDashboard'

import HandleStudentApplication from './pages/HandleStudentApplication'

import HandleStaffApplication from './pages/HandleStaffApplication'

import CreateAnnouncement from './pages/CreateAnnouncement'

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Zoom} from 'react-toastify';
function App() {

  return (
     <Router>
        
        <div className="App">
         <Routes>
         
            <Route path="/" element={<Landing />}/>  
            <Route path="/login" element={<Login />}/>  
            <Route path="/student-apply" element={<ApplyStudent />}/> 
            <Route path="/staff-apply" element={<ApplyStaff />}/> 
            <Route path="/student-dashboard" element={<StudentDasbboard />}/>
            <Route path="/lecturer-dashboard" element={<LecturerDashboard />}/>
            <Route path="/staff-dashboard" element={<StaffDashboard />}/>
            <Route path="/adm-dashboard" element={<AdmDashboard />}/>
            <Route path="/handle-student-application" element={<HandleStudentApplication />}/> 
            <Route path="/handle-staff-application" element={<HandleStaffApplication />}/> 
            <Route path="/create-announcements" element={<CreateAnnouncement />}/>  
            <Route path="/student-unit/:id" element={< StudentUnit/>}/>  
            <Route path="/activity" element={<Activity />}/>  
            <Route path="/message" element={<Message />}/>  
           
                       
        </Routes>  
        <ToastContainer theme='dark' transition={Zoom} />
        </div>
       
        
        
  </Router>
   
  );
}

export default App;