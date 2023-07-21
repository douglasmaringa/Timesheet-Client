import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TimeSheetTable from '../components/TimeSheetTable';
import { DatePicker, Form, Button } from 'antd';
import moment from 'moment';
import EditTimeSheets from '../components/EditTimeSheets';
const apiUrl = import.meta.env.VITE_SERVER_URL

function Timesheet() {
  const [collapsed, setCollapsed] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/employee?page=1&limit=100`);
        setEmployees(response.data.employees);
      } catch (error) {
        console.error(error);
        toast('Failed to fetch employees');
      }
    };

    fetchEmployees();
  }, []); // Empty dependency array to run the effect only once on component mount

  const handleDateChange = (dates) => {
    setStartDate(null);
    setEndDate(null);
    setValid(false)
    if(dates){
    const [start, end] = dates;
    if (end.diff(start, 'days') !== 6) {
      // Show toast for invalid work week duration
      toast('A work week can only be 7 days or less');
      setValid(false)
    } else {
      setStartDate(start);
      setEndDate(end);
      getTimesheetsByPeriod(start?.$d,end?.$d)
      setValid(true)
    }
  }else{
    return;
  }
  };

  // Function to get timesheets by period
const getTimesheetsByPeriod = async (startDate, endDate) => {
  console.log(startDate,endDate)
  try {
    const response = await axios.get(`${apiUrl}/api/timesheet?startDate=${startDate}&endDate=${endDate}`);
    console.log(response)
    const timesheets = response.data;
    console.log('Timesheets fetched:', timesheets);
    setTimesheets(timesheets)
    // Perform any necessary actions with the fetched timesheets
    return timesheets;
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    // Perform any error handling
    return [];
  }
};

  return (
    <div className='font-lato'>
      <Topbar collapsed={collapsed} />
      <ToastContainer autoClose={2000} />

      <div className='flex'>
        {/* Left */}
        <div>
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </div>

        {/* Right */}
        <div className='w-10/12'>
          {/* Content of the right div */}
          <div className='w-5/12 mt-36 space-x-6  mx-auto  flex flex-row justify-center align-middle'>
            {/* Start Date */}
            <Form.Item label='Start Date'>
              <DatePicker.RangePicker
                value={[startDate, endDate]}
                format='YYYY-MM-DD'
                onChange={handleDateChange}
              />
            </Form.Item>
          </div>
          <div className='w-12/12 flex flex-row justify-center align-middle'>
             {  
                timesheets?.length == 0 && 
                 valid &&
                 <TimeSheetTable employees={employees} startDate={startDate} endDate={endDate} />
              }
              {
                timesheets?.length > 0 && 
                  valid &&
                 <EditTimeSheets timesheets={timesheets}/>
              }

          </div>
        </div>
      </div>
    </div>
  );
}

export default Timesheet;
