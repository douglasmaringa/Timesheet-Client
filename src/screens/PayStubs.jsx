import React,{useState,useEffect} from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { useNavigate } from 'react-router-dom';

function PayStubs() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    
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
           <h1 className='text-3xl font-normal text-center'>Paystub Page under construction</h1>
    
        </div>
      </div>
       
       </div>

      </div>


    </div>
  );
}

export default PayStubs;


