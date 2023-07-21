import React from 'react';
import moment from 'moment';
import { Table,Button } from 'antd';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const apiUrl = import.meta.env.VITE_SERVER_URL

function PendingTable({ timesheets,handleSearch}) {
  
  const approveTimesheet = async (timesheetId) => {
    try {
      // Send a PUT request to the server to update the timesheet status to "approved"
      await axios.put(`${apiUrl}/api/timesheet/status`, [
        { _id: timesheetId, status: 'approved' },
      ]);

      // Assuming the status update is successful, you may want to update the UI or perform any other actions
      toast(`Timesheet with ID ${timesheetId} has been approved.`);
      handleSearch()
    } catch (error) {
      toast('Error updating timesheet status:');
    }
  };

  const denyTimesheet = async (timesheetId) => {
    try {
      // Send a PUT request to the server to update the timesheet status to "denied"
      await axios.put(`${apiUrl}/api/timesheet/status`, [
        { _id: timesheetId, status: 'denied' },
      ]);

      // Assuming the status update is successful, you may want to update the UI or perform any other actions
      toast(`Timesheet with ID ${timesheetId} has been denied.`);
      handleSearch()
    } catch (error) {
      toast('Error updating timesheet status:', error);
    }
  };


  const emailTimesheet = (timesheetId) => {
    // Implement the logic to send an email for the timesheet with the given ID
    console.log(`Send email for timesheet with ID: ${timesheetId}`);
  };

  const generatePDF = (timesheetId) => {
    // Implement the logic to generate a PDF for the timesheet with the given ID
    console.log(`Generate PDF for timesheet with ID: ${timesheetId}`);
  };

  // Function to calculate earnings based on overtime and pay rate
  const calculateEarnings = (totalHours, overtime1, overtime2, payRate) => {
    const regularHours = totalHours - overtime1 - overtime2;
    const overtime1Earnings = overtime1 * payRate * 1.5;
    const overtime2Earnings = overtime2 * payRate * 2;
    const regularHoursEarnings = regularHours * payRate;
    return overtime1Earnings + overtime2Earnings + regularHoursEarnings;
  };

  // Calculate total hours, overtime1, and overtime2 for each timesheet
  const data = timesheets.map((timesheet) => {
    const totalHours = timesheet.hoursWorked.reduce(
      (sum, entry) => sum + (entry.hours ? parseFloat(entry.hours) : 0),
      0
    );
    let overtime1 = 0;
    let overtime2 = 0;

    if (totalHours > 40) {
      overtime1 = Math.min(totalHours - 40, 10);
      overtime2 = Math.max(totalHours - 50, 0);
    }

    const payRate = timesheet.user?.payRate || 0; // Assuming payRate is available in the user object

    const totalEarnings = calculateEarnings(totalHours, overtime1, overtime2, payRate);

    return {
      key: timesheet._id,
      name: timesheet.user?.name || 'N/A',
      status:timesheet.status,
      rate: `$${timesheet.user?.payRate}` || 'N/A',
      totalHours: totalHours.toFixed(2),
      overtime1: overtime1.toFixed(2),
      overtime2: overtime2.toFixed(2),
      totalEarnings: `$${totalEarnings.toFixed(2)}`,
    };
  });

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
    {
        title: 'Rate',
        dataIndex: 'rate',
        key: 'rate',
      },
    {
      title: 'Total Hours',
      dataIndex: 'totalHours',
      key: 'totalHours',
    },
    {
      title: 'Ot 1',
      dataIndex: 'overtime1',
      key: 'overtime1',
    },
    {
      title: 'Ot 2',
      dataIndex: 'overtime2',
      key: 'overtime2',
    },{
        title: 'Total Earnings',
        dataIndex: 'totalEarnings',
        key: 'totalEarnings',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <div className='space-x-2'>
            {
                record.status !== "editing" ?
            <>
            
            {
                record.status !== "approved" &&
                <Button className="bg-blue-600 text-white" type="primary" onClick={() => approveTimesheet(record.key)}>
                 Approve
               </Button>
            }
            {
            record.status !== "denied" &&
            <Button className="bg-red-700 text-white" type="danger" onClick={() => denyTimesheet(record.key)}>
              Deny
            </Button>
            }
            
            <Button className="bg-black-600 text-black" onClick={() => emailTimesheet(record.key)}>Email</Button>
            <Button className="bg-purple-600 text-white" type='primary' onClick={() => generatePDF(record.key)}>PDF</Button>
            </>:<>Still Editing</>
            }
          </div>
        ),
      },
  ];

   // Get the work week start date from the first item in timesheets
   const workWeekStartDate = timesheets.length > 0 ? timesheets[0].period.startDate : null;
   const workWeekEndDate = timesheets.length > 0 ? timesheets[0].period.endDate : null;
   const formattedWorkWeekStartDate = workWeekStartDate
     ? moment(workWeekStartDate).format('(ddd) MMM Do YYYY')
     : '';

     const formattedWorkWeekEndDate = workWeekEndDate
     ? moment(workWeekEndDate).format('(ddd) MMM Do YYYY')
     : '';

  return (
    <div>
        <ToastContainer autoClose={2000} />

      <div className='flex justify-center mt-2 mb-4 space-x-1'>
        <h1>Work Week:</h1>
        <div className='flex space-x-2'>
          <p>( {formattedWorkWeekStartDate}</p>
          <p>-</p>
          <p>{formattedWorkWeekEndDate} )</p>
        </div>
      </div>

      <Table dataSource={data} columns={columns} pagination={false} />
    </div>
  );
}

export default PendingTable;
