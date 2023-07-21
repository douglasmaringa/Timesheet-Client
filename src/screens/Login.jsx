import React,{useState} from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import Loading from "../components/Loading"
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_SERVER_URL


const Login = () => {
  const[loading,setLoading]=useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const response = await axios.post(`${apiUrl}/api/user/login`, {
        email: values?.email,
        password: values?.password,
      });
      //console.log(response)
      const { data,status } = response;
     
      if (status == 200) {
        localStorage.setItem('token', data?.token);
        localStorage.setItem('type', data?.type);
        //toast('Login successful');
        navigate("/home")
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      if (error?.response && error?.response.status === 401) {
        toast.error('Unauthorized: Invalid email or password');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
      console.error(error);
    }
    setLoading(false)
  };
  
  const onFinishFailed = (errorInfo) => {
    setLoading(true)
    toast('Failed:', errorInfo);
    setLoading(false)
  };
  

return (
<div className='bg-custom-background bg-cover bg-center bg-no-repeat '>
<ToastContainer autoClose={2000} />
  <div className="flex flex-wrap bg-gradient-to-tl from-[#672A8F] to-transparent">
    <div className="w-full md:w-1/4 px-4">
      {/* Left column */}
      
    </div>
    <div className="w-full md:w-2/4 px-4">
      {/* Middle column */}
      <div className="flex justify-center items-center" style={{ minHeight: '100vh' }}>
        <Form
          style={{ maxWidth: 500 }}
          className='w-8/12'
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {/* Form content */}
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input className="h-12" placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
           
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password className="h-12" placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
          >
            <Checkbox className='text-white'>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button className="bg-[#672A8F] w-full text-base h-12 font-semibold text-white" htmlType="submit">
               {loading? <><Loading/></>:<>Sign in</> }
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
    <div className="w-full md:w-1/4 px-4">
      {/* Right column */}
      <div className="flex p-10 justify-end items-end h-full">
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: '200px', height: '100px' }}
        />
      </div>
    </div>
  </div>
  </div>
  )
};

export default Login;
