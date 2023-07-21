import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker, Form, Button, Select } from 'antd';
import moment from 'moment';
import PendingTable from '../components/PendingTable';
import Loading from "../components/Loading"
const apiUrl = import.meta.env.VITE_SERVER_URL

const { Option } = Select;

function Pending() {
  const [collapsed, setCollapsed] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [valid, setValid] = useState(false);
  const [timesheets, setTimesheets] = useState([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [periodStartDates, setPeriodStartDates] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [error, setError] = useState(null);
  const [show,setShow] = useState(false);

  useEffect(() => {
    
    const type = localStorage.getItem('type');
    const token = localStorage.getItem('token');

    if(token){
        console.log("ok")
      }else{
        navigate("/")
      }

    if(type == "admin"){
        setShow(true)
    }else{
        setShow(false)
    }
  }, [])

  console.log(show)


   // Fetch the unique period start dates from the backend
   useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`${apiUrl}/api/timesheet/period-start-dates`)
      .then((response) => {
        setLoading(false);
        setPeriodStartDates(response.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error fetching period start dates:', error);
        setError('Error fetching period start dates');
      });
  }, []);

  const handleStartDateChange = (selectedValue) => {
    setSelectedStartDate(selectedValue);
    console.log('Selected Start Date:', selectedValue);
    // Use the selected start date for filtering timesheets or any other required functionality
  };

  const formatDate = (date) => {
    return moment(date).format('(ddd) DD MMMM YYYY');
  };

 
  const handleStatusChange = (value) => {
    setStatus(value);
  };

  const handleSearch = () => {
    getTimesheetsByPeriod(selectedStartDate,status);
  };

  // Function to get timesheets by period
  const getTimesheetsByPeriod = async (selectedStartDate,status) => {
    setLoading(true)
    setValid(false)
    try {
      const response = await axios.get(`${apiUrl}/api/timesheet/withstart?startDate=${selectedStartDate}&status=${status}`);
      console.log(response);
      const timesheets = response.data;
      console.log('Timesheets fetched:', timesheets);
      setValid(true)
      setTimesheets(timesheets);
      setLoading(false)
      // Perform any necessary actions with the fetched timesheets
      return timesheets;
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      setValid(false)
      // Perform any error handling
      setLoading(false)
      return [];
    }
    setLoading(false)
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
          <div className='w-full lg:w-10/12 mt-36 space-x-6  mx-auto  flex flex-row justify-center align-middle'>
          {show &&
            <>
            {/* Start Date */}
            <Form.Item className='w-6/12' label='Period Start Date'>
           {loading ? (
            <>
            <div className="flex items-center justify-center">
             <div className={`animate-spin rounded-full border-t-2 border-b-2 border-black h-4 w-4`} />
           </div>
         </>
        ) : error ? (
          <div>{error}</div>
        ) : periodStartDates.length === 0 ? (
          <div>No period start dates found.</div>
        ) : (
          <Select value={selectedStartDate} onChange={handleStartDateChange}>
            {periodStartDates.map((startDateObj) => (
              <Option key={startDateObj._id} value={startDateObj.startDate}>
                {formatDate(startDateObj.startDate)}
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>
             <div className='w-5/12 space-x-2 flex'>
               {/* Status Dropdown */}
            <Form.Item className='w-6/12' label='Status'>
              <Select value={status} onChange={handleStatusChange}>
                <Option value='pending'>Pending</Option>
                <Option value='editing'>Editing</Option>
                <Option value='approved'>Approved</Option>
                <Option value='denied'>Denied</Option>
              </Select>
            </Form.Item>
           
            <Form.Item>
              <Button className='bg-blue-600' type='primary' onClick={handleSearch}>
                {
                    loading? "loading..." : "Search"
                }
                
              </Button>
            </Form.Item>
            
          </div>
          </>
          }
          {
           !show && <h1 className='text-center text-3xl'>Access Denied</h1>
           }
          </div>
          <div className='w-12/12 flex flex-row justify-center align-middle'>
            {valid && <PendingTable handleSearch={handleSearch} timesheets={timesheets} />}
          </div>
        </div>
      </div>
      
      
    </div>
  );
}

export default Pending;
