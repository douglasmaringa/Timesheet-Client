import React, { useState } from 'react';
import moment from 'moment';
import { Table, TimePicker,Button } from 'antd';
import axios from "axios"
import Loading from "./Loading"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const apiUrl = import.meta.env.VITE_SERVER_URL

// ... (rest of the code)

function generateDates(startDate, endDate) {
  const dates = [];
  const currentDate = moment(startDate);

  while (currentDate.isSameOrBefore(endDate)) {
    dates.push(currentDate.format('(ddd) YYYY-MM-DD'));
    currentDate.add(1, 'days');
  }

  return dates;
}

function TimeSheetTable({ employees, startDate, endDate }) {
  const formattedStartDate = moment(startDate?.$d).format('(ddd) YYYY-MM-DD');
  const formattedEndDate = moment(endDate?.$d).format('(ddd) YYYY-MM-DD');
  const allDates = generateDates(startDate?.$d, endDate?.$d);
  const[loading,setLoading]=useState(false)
  const[loading2,setLoading2]=useState(false)


  const [employeeData, setEmployeeData] = useState(() => {
    // Initialize the employee data with empty hours for each date
    const data = employees.map((employee) => ({
      key: employee._id,
      name: employee.name,
      ...allDates.reduce((acc, date) => ({ ...acc, [date]: null }), {}),
    }));
    return data;
  });

  const handleInputChange = (employeeKey, date, time) => {
    if (time) {
      const hours = time.hour();
      const minutes = time.minute();
      const value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      setEmployeeData((prevData) => {
        const newData = prevData.map((employee) => {
          if (employee.key === employeeKey) {
            return { ...employee, [date]: value };
          }
          return employee;
        });
        return newData;
      });
    }
  };


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    ...allDates.map((date) => ({
      title: date,
      dataIndex: date,
      key: date,
      render: (text, record) => (
        <TimePicker
    format="HH:mm"
    value={record.hoursWorked[date] ? moment(record.hoursWorked[date], 'HH:mm') : null}
    onChange={(time) => handleInputChange(record.key, date, time)}
    onOk={(time) => handleInputChange(record.key, date, time)}
    clearIcon={null}
  />
      ),
      className: date.includes('(Sun)') || date.includes('(Sat)') ? 'border-y-2 border-indigo-500' : '',
    })),
    {
      title: 'Total Hrs',
      dataIndex: 'totalHoursWorked',
      key: 'totalHoursWorked',
      render: (text, record) => {
        const totalHoursWorked = Object.values(record.hoursWorked).reduce((sum, hours) => sum + hours, 0);
        return totalHoursWorked.toFixed(2);
      },
    },
    {
      title: 'Ot 1',
      dataIndex: 'overtime1',
      key: 'overtime1',
      render: (text, record) => {
        const totalHoursWorked = Object.values(record.hoursWorked).reduce((sum, hours) => sum + hours, 0);
        let overtime1 = 0;
        if (totalHoursWorked > 40 && totalHoursWorked <= 50) {
          overtime1 = (totalHoursWorked - 40).toFixed(2);
        } else if (totalHoursWorked > 50) {
          overtime1 = 10; // Cap overtime1 at 9 hours (49 - 40)
        }
        return overtime1;
      },
    },
    {
      title: 'Ot 2',
      dataIndex: 'overtime2',
      key: 'overtime2',
      render: (text, record) => {
        const totalHoursWorked = Object.values(record.hoursWorked).reduce((sum, hours) => sum + hours, 0);
        let overtime2 = 0;
        if (totalHoursWorked > 50) {
          overtime2 = (totalHoursWorked - 50).toFixed(2);
        }
        return overtime2;
      },
    },
  ];

   // Calculate hoursWorkedData directly here without using useState
   const hoursWorkedData = employeeData.map((employee) => {
    const hoursWorked = allDates.reduce((acc, date) => {
      const time = employee[date];
      if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        const totalHours = hours + minutes / 60;
        acc[date] = parseFloat(totalHours.toFixed(2));
      } else {
        acc[date] = 0;
      }
      return acc;
    }, {});
    return {
      key: employee.key,
      name: employee.name,
      hoursWorked,
    };
  });

  //console.log(hoursWorkedData);

   // Function to handle saving the data to the backend
   const handleSave = () => {
    setLoading(true)
    // Create a new array with the data to be sent to the backend
    const dataToSave = hoursWorkedData.map((employee) => ({
      user: employee?.key, // Assuming employee.key is the user ID
      period: {
        startDate:startDate?.$d,
        endDate:endDate?.$d,
      },
      hoursWorked: allDates.map((date) => ({
        date,
        hours: employee.hoursWorked[date] || 0,
      })),
      status: 'editing', // Set the default status as 'editing'
    }));

    console.log(dataToSave)

    
    // Send the POST request to the backend API
    axios.post(`${apiUrl}/api/timesheet`, dataToSave)
      .then((response) => {
        toast('Timesheet data saved');
        // Perform any necessary actions after successful save
      })
      .catch((error) => {
        toast('Error saving timesheet data');
        // Perform any error handling
      });

      setLoading(false)
      
  };

   // Function to handle saving the data to the backend
   const handleSubmit = () => {
    setLoading2(true)
    // Create a new array with the data to be sent to the backend
    const dataToSave = hoursWorkedData.map((employee) => ({
      user: employee?.key, // Assuming employee.key is the user ID
      period: {
        startDate:startDate?.$d,
        endDate:endDate?.$d,
      },
      hoursWorked: allDates.map((date) => ({
        date,
        hours: employee.hoursWorked[date] || 0,
      })),
      status: 'pending', // Set the default status as 'editing'
    }));

    console.log(dataToSave)

    
    // Send the POST request to the backend API
    axios.post(`${apiUrl}/api/timesheet`, dataToSave)
      .then((response) => {
        toast('Timesheet data saved');
        // Perform any necessary actions after successful save
      })
      .catch((error) => {
        toast('Error saving timesheet data');
        // Perform any error handling
      });
      setLoading2(false)
  };

  const handleReset = ()=>{
    console.log("reset")
  }


  return (
    <div>
       <ToastContainer autoClose={2000} />

      <div className='flex justify-center mt-2 mb-4 space-x-1'>
        <h1>Work Week:</h1>
        <div className='flex space-x-2'>
          <p>( {formattedStartDate}</p>
          <p>-</p>
          <p>{formattedEndDate} )</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table dataSource={hoursWorkedData} columns={columns} pagination={false} />
      </div>

      <div className="flex justify-center space-x-4 mt-4">
        <Button className='bg-blue-600 text-white' type="primary px-10" onClick={handleReset}>
          {
            loading? 'loading...' : "Reset"
          }
        </Button>
        <Button className='bg-green-600 text-white px-10' type="primary" onClick={handleSave}>
          {
            loading? 'loading...' : "Save"
          }
        </Button>
        <Button className='bg-purple-600 text-white px-10' type="primary" onClick={handleSubmit}>
         {
            loading2? 'loading...' : "Submit"
          }
        </Button>
      </div>
    </div>
  );
}

export default TimeSheetTable;
