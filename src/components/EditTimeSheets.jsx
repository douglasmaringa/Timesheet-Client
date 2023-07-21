import React,{useState, useEffect} from 'react';
import { Table, TimePicker,Button } from 'antd';
import moment from 'moment';
import axios from 'axios';
import Loading from "./Loading"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const apiUrl = import.meta.env.VITE_SERVER_URL

function EditTimeSheets({ timesheets }) {
  const[loading,setLoading]=useState(false)
  const[loading2,setLoading2]=useState(false)
   // Extract all unique dates from the timesheets to dynamically generate columns
   const allDates = Array.from(
    new Set(
      timesheets.flatMap((timesheet) =>
        timesheet.hoursWorked.map((entry) => moment(entry.date).format('YYYY-MM-DD'))
      )
    )
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    ...allDates.map((date) => ({
        title: date,
        dataIndex: date,
        key: date,
        render: (text, record) => (
          <TimePicker
            key={`${record.key}-${date}`} // Use both record.key and date as a unique key
            format="HH:mm"
            value={
              record[date] ? moment(record[date], 'HH:mm') : null // Access the value directly using record[date]
            }
            onChange={(time) => handleInputChange(record.key, date, time)}
            onOk={(time) => handleInputChange(record.key, date, time)}
            clearIcon={null}
          />
        ),
    })),
    {
        title: 'Total Hrs',
        dataIndex: 'totalHoursWorked',
        key: 'totalHoursWorked',
        render: (text, record) => {
          const totalHoursWorked = allDates.reduce(
            (sum, date) => sum + (record[date] ? moment.duration(record[date]).asHours() : 0),
            0
          );
          return totalHoursWorked.toFixed(2);
        },
      },
    {
      title: 'Ot 1',
      dataIndex: 'overtime1',
      key: 'overtime1',
      render: (text, record) => {
        const totalHoursWorked = allDates.reduce(
          (sum, date) => sum + (record[date] ? moment.duration(record[date]).asHours() : 0),
          0
        );
        let overtime1 = 0;
        if (totalHoursWorked > 40 && totalHoursWorked <= 50) {
          overtime1 = (totalHoursWorked - 40).toFixed(2);
        } else if (totalHoursWorked > 50) {
          overtime1 = 10; // Cap overtime1 at 10 hours (50 - 40)
        }
        return overtime1;
      },
    },
    {
      title: 'Ot 2',
      dataIndex: 'overtime2',
      key: 'overtime2',
      render: (text, record) => {
        const totalHoursWorked = allDates.reduce(
          (sum, date) => sum + (record[date] ? moment.duration(record[date]).asHours() : 0),
          0
        );
        let overtime2 = 0;
        if (totalHoursWorked > 50) {
          overtime2 = (totalHoursWorked - 50).toFixed(2);
        }
        return overtime2;
      },
    },
  ];

 

  const [timesheetsData, setTimesheetsData] = useState(
    timesheets.map((timesheet) => ({
      key: timesheet._id,
      name: timesheet.user.name,
      user:timesheet.user,
      _id:timesheet._id,
      hours:timesheet.hoursWorked,
      period:timesheet.period,
      status:timesheet.status,
      ...timesheet.hoursWorked.reduce((acc, entry) => {
        acc[moment(entry.date).format('YYYY-MM-DD')] = moment(entry.hours, 'HH:mm').format('HH:mm');
        return acc;
      }, {}),
    }))
  );

   // New state to track the changes in TimePicker values
   const [timePickerValues, setTimePickerValues] = useState({});

   const handleInputChange = (timesheetKey, date, time) => {
    setTimesheetsData((prevData) =>
      prevData.map((timesheet) => {
        if (timesheet.key === timesheetKey) {
          const newData = { ...timesheet };
          newData[date] = time ? time.format('HH:mm') : 'delete';

          const totalHours = allDates.reduce(
            (sum, date) => sum + (newData[date] ? moment.duration(newData[date]).asHours() : 0),
            0
          );
         // newData['delete'] = totalHours.toFixed(2);

          return newData;
        }
        return timesheet;
      })
    );
  };

 
   useEffect(() => {
     // When the TimePicker values change, update the corresponding state values
     setTimesheetsData((prevData) =>
       prevData.map((timesheet) => {
         const newData = { ...timesheet };
         allDates.forEach((date) => {
           const key = `${timesheet.key}-${date}`;
           if (timePickerValues.hasOwnProperty(key)) {
             const timeValue = timePickerValues[key];
             const totalHours = timeValue ? moment.duration(timeValue).asHours() : 0;
             newData[date] = totalHours.toFixed(2);
           }
         });
         return newData;
       })
     );
   }, [timePickerValues]);
  
  
   const handleSave = () => {
    setLoading(true)
    // Create a new array with the data to be sent to the backend
    const dataToUpdate = timesheetsData.map((timesheet) => {
      // Extract relevant data from each timesheet object
      const { _id, user, status, period, hours, ...hoursWorked } = timesheet;
      console.log(hours);
      const { startDate, endDate } = period;
  
      return {
        _id,
        user: user._id, // Assuming timesheet.user has the user ID
        period: {
          startDate: startDate, // Convert startDate to ISOString
          endDate: endDate, // Convert endDate to ISOString
        },
        hoursWorked: Object.entries(hoursWorked)
        .filter(([date, hours]) => date !== 'key' && date !== 'name' && date !== 'delete') // Filter out 'key', 'name', and null hours
        .map(([date, hours]) => ({
            date: moment(date, 'YYYY-MM-DD').toISOString(),
            hours: parseFloat(hours), // Convert hours from decimal string to number
          })),
        status,
      };
    });
   //console.log(dataToUpdate)
   
    // Send the PUT request to update multiple timesheets
    axios
      .put(`${apiUrl}/api/timesheet`, dataToUpdate)
      .then((response) => {
        toast('Timesheets data updated:');
        // Perform any necessary actions after successful update
      })
      .catch((error) => {
        toast('Error updating timesheets data:');
        // Perform any error handling
      });
      setLoading(false)
  };

  const handleSubmit = () => {
    setLoading2(true)
    // Create a new array with the data to be sent to the backend
    const dataToUpdate = timesheetsData.map((timesheet) => {
      // Extract relevant data from each timesheet object
      const { _id, user, status, period, hours, ...hoursWorked } = timesheet;
      console.log(hours);
      const { startDate, endDate } = period;
  
      return {
        _id,
        user: user._id, // Assuming timesheet.user has the user ID
        period: {
          startDate: startDate, // Convert startDate to ISOString
          endDate: endDate, // Convert endDate to ISOString
        },
        hoursWorked: Object.entries(hoursWorked)
        .filter(([date, hours]) => date !== 'key' && date !== 'name' && date !== 'delete') // Filter out 'key', 'name', and null hours
        .map(([date, hours]) => ({
            date: moment(date, 'YYYY-MM-DD').toISOString(),
            hours: parseFloat(hours), // Convert hours from decimal string to number
          })),
        status:"pending",
      };
    });
   //console.log(dataToUpdate)
   
    // Send the PUT request to update multiple timesheets
    axios
      .put(`${apiUrl}/api/timesheet`, dataToUpdate)
      .then((response) => {
        toast('Timesheet data saved');
        // Perform any necessary actions after successful update
      })
      .catch((error) => {
        toast('Error updating timesheets data:');
        // Perform any error handling
      });
      setLoading2(false)
  };


  const handleReset = ()=>{
    console.log("reset")
  }
  
  //console.log(timesheetsData)

  return (
    <div>
      <ToastContainer autoClose={2000} />

      <div className='overflow-x-auto'>
      <Table dataSource={timesheetsData} columns={columns} pagination={false} />
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

export default EditTimeSheets;
