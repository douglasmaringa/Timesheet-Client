import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, DatePicker, Select } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Loading from './Loading';
import moment from 'moment';
const apiUrl = import.meta.env.VITE_SERVER_URL

const NewEmployee = ({isModalOpen,refresh,setRefresh}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log(values)
    
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/employee`, {
            "name": values?.name,
            "position": values?.position,
            "email": values?.email,
            "payType": values?.payType,
            "payRate": parseFloat(values.payRate),
            "phone": values?.phone,
            "address": values?.address,
            "startDate":values.startDate.format('YYYY-MM-DD'),
            "sin": values?.sin,
            "birthday":values.birthday.format('YYYY-MM-DD')      
       
      });
      //console.log(response);
      toast('New employee created successfully');
      form.resetFields();
      setRefresh(!refresh)
    } catch (error) {
      toast('Failed to create employee');
      console.error(error);
    }
    setLoading(false);
    
    isModalOpen(false)
  };

  const onFinishFailed = (errorInfo) => {
    toast('Failed:', errorInfo);
  };

  return (
    <div className='flex justify-center items-center mt-5'>
      <Form
        style={{ maxWidth: 500 }}
        className='w-10/12'
        form={form}
        name='basic'
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        {/* Form content */}
        <Form.Item
          name='name'
          className='text-black'
          rules={[
            {
              required: true,
              message: 'Please input your name',
            },
          ]}
        >
          <Input className='h-10 border placeholder-gray-900::placeholder border-gray-600' placeholder='Name' />
        </Form.Item>

        <Form.Item
          name='position'
          rules={[
            {
              required: true,
              message: 'Please input the position',
            },
          ]}
        >
          <Input className='h-10 border border-gray-600' placeholder='Position' />
        </Form.Item>

        <Form.Item
          name='email'
          rules={[
            {
              required: true,
              message: 'Please input your email',
            },
          ]}
        >
          <Input className='h-10 border border-gray-600' placeholder='Email' />
        </Form.Item>

        <Form.Item
          name='payType'
          className='h-10'
          rules={[
            {
              required: true,
              message: 'Please select the pay type',
            },
          ]}
        >
          <Select
            className=''
            placeholder='Pay Type'
          >
            <Option value='hourly'>Hourly</Option>
            <Option value='weekly'>Weekly</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name='payRate'
          rules={[
            {
              required: true,
              message: 'Please input the pay rate',
            },
          ]}
        >
          <Input
            className='h-10 border border-gray-600'
            placeholder='Pay Rate'
            type='number' // Specify the input type as number
          />
        </Form.Item>

        <Form.Item
          name='phone'
          rules={[
            {
              required: true,
              message: 'Please input your phone number',
            },
          ]}
        >
          <Input
            className='h-10 border border-gray-600'
            placeholder='Phone'
            type='text' // Specify the input type as number
          />
        </Form.Item>

        <Form.Item
          name='address'
          rules={[
            {
              required: true,
              message: 'Please input your address',
            },
          ]}
        >
          <Input className='h-10 border border-gray-600' placeholder='Address' />
        </Form.Item>

        <Form.Item
          name='startDate'
          rules={[
            {
              required: true,
              message: 'Please select the start date',
            },
          ]}
        >
          <DatePicker className='h-10 border w-full border-gray-600' placeholder='Start Date' />
        </Form.Item>

        <Form.Item
          name='sin'
          rules={[
            {
              required: true,
              message: 'Please input the SIN',
            },
          ]}
        >
          <Input className='h-10 border border-gray-600' placeholder='SIN' />
        </Form.Item>

        <Form.Item
          name='birthday'
          rules={[
            {
              required: true,
              message: 'Please select the birthday',
            },
          ]}
        >
          <DatePicker className='h-10 border w-full border-gray-600' placeholder='Birthday' />
        </Form.Item>

        <Form.Item>
          <Button
            className='bg-[#672A8F] w-full text-base h-12 font-semibold text-white'
            htmlType='submit'
          >
            {loading ? <Loading /> : <>Create</>}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewEmployee;
