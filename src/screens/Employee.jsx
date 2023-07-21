import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import EmployeeTable from '../components/EmployeeTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Loading from '../components/Loading';
import { UserAddOutlined } from '@ant-design/icons';
import SearchInput from '../components/SearchInput';
import { Button, Modal } from 'antd';
import NewEmployee from '../components/NewEmployee';
import EditEmployee from '../components/EditEmployee';
const apiUrl = import.meta.env.VITE_SERVER_URL

function Employee() {
  const [collapsed, setCollapsed] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
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
  

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/employee?page=${currentPage}&limit=10`);
      console.log(response);
      setLoading(false);
      setEmployees(response?.data?.employees);
      setTotalPages(response?.data?.totalPages);
    } catch (error) {
      toast('Failed to retrieve employees');
      setLoading(false);
      console.error(error);
    }
  };

  const fetchEmployees2 = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/employee?page=${pageNumber}&limit=10`);
      console.log(response);
      setLoading(false);
      setEmployees(response?.data?.employees);
      setTotalPages(response?.data?.totalPages);
    } catch (error) {
      toast('Failed to retrieve employees');
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [refresh]);

  // Function to handle page change
  const onPageChange = (pageNumber) => {
    console.log(pageNumber);
    // Update the current page
    setCurrentPage(pageNumber);

    // Fetch the employees for the new page
    fetchEmployees2(pageNumber);
  };

  const searchName = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/employee/search?name=${search}`);
      console.log(response)
      if (response?.data?.employees === 0) {
        toast("No results found");
      }
      setEmployees(response?.data?.employees);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const showModal2 = (employee) => {
    setIsModalOpen2(true);
    setEmployee(employee)
  };

 // Function to delete an employee
const deleteEmployee = async (id) => {
    const response = confirm("Are you sure you want to do that?");
                if (response) {
                    try {
                        await axios.delete(`${apiUrl}/api/employee/${id}`);
                        // Handle success or show a notification
                        toast('Employee deleted successfully');
                        setRefresh(!refresh);
                      } catch (error) {
                        // Handle error or show a notification
                        toast('Failed to delete employee');
                      }
                } else {
                    return;
                }   
  };
 

  return (
    <div className='font-lato'>
    <Topbar collapsed={collapsed} />
      <ToastContainer autoClose={2000} />
      <Modal title="Add New Employee" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}  footer={[]}>
        <NewEmployee refresh={refresh} setRefresh={setRefresh} isModalOpen={setIsModalOpen}/>
      </Modal>

      <Modal title="Edit Employee" open={isModalOpen2} onCancel={()=>{setIsModalOpen2(false)}}  footer={[]}>
        <EditEmployee employee={employee} refresh={refresh} setRefresh={setRefresh} isModalOpen={setIsModalOpen2}/>
      </Modal>
     
    
     <div className='flex'>
        {/*left*/}
      <div>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>
       
        {/*left*/}
        {
      show &&
      <div className='w-10/12'>
        {/* Content of the right div */}
        {loading? <div className='mt-36 mb-2'><Loading color={"black"}/></div>:<div className='mt-36 mb-2'></div>}
        <div className='w-5/12 space-x-6  mx-auto mb-10 flex flex-row justify-center align-middle'>
              <SearchInput search={search} setSearch={setSearch} searchName={searchName}/>
              <button onClick={showModal} className='mx-auto bg-slate-300 hover:bg-slate-500 hover:text-white rounded-lg px-6'>
              <UserAddOutlined className='text-lg'/>
              </button>
            </div>
            <div className='w-12/12 flex flex-row justify-center align-middle'>
            {!loading &&
            <EmployeeTable
              employees={employees}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              edit={showModal2}
              deleteEmployee={deleteEmployee}
            />}
            </div>
            
          </div>
          }
          {
            !show && 
            <div className='w-10/12 mt-36'>
            <h1 className='text-center text-black text-3xl'>Access Denied</h1>
            </div>
          }

          </div>
     
      

    </div>
  );
}

export default Employee;
