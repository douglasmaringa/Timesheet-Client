import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './screens/Home'
import Login from './screens/Login'
import Timesheet from './screens/Timesheet'
import Employee from './screens/Employee'
import Pending from './screens/Pending'
import PayStubs from './screens/PayStubs'
import Help from './screens/Help'


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/timesheet" element={<Timesheet />} />
                <Route path="/profiles" element={<Employee />} />
                <Route path="/pending" element={<Pending />} />
                <Route path="/paystubs" element={<PayStubs />} />
                <Route path="/help" element={<Help />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
