import React,{useState,useEffect} from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('type');

    if(token){
      console.log("ok")
    }else{
      navigate("/")
    }
  }, [])

  return (
    <div className='font-lato'>
    <Topbar collapsed={collapsed} />
     

     <div className='flex'>
        {/*left*/}
      <div>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
       
        {/*left*/}
      <div className='w-10/12'>
        {/* Content of the right div */}
        <div className='flex justify-center align-middle'>
        <div className='w-10/12 md:w-1/2 mx-auto mt-72'>
           <h1 className='text-3xl font-normal text-center'>Welcome Back to the MEJ Timesheet App</h1>
        
            <p className='text-2xl font-light text-center mt-10'>As an admin user of MEJ Enterprises' custom time sheet app, you can easily manage your team's time tracking, employee profiles, and approve pending timesheets. We're excited to have you on board and are here to support you. Let's improve your team's productivity together!</p>
        </div>
      </div>
       
       </div>

      </div>


    </div>
  );
}

export default Home;


