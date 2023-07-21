import React from 'react'
import moment from 'moment'
import {EditOutlined,DeleteOutlined } from '@ant-design/icons'

function EmployeeTable({
    employees,
    currentPage,
    totalPages,
    onPageChange,
    deleteEmployee,
    edit,
    
}) {
    
    return (
        <div className=''>
            <section class="container px-4 mb-20">
                <div class="flex flex-col">
                    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead class="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th
                                                scope="col"
                                                class="py-3.5 px-4 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                                            >
                                                <div class="flex items-center gap-x-3">
                                                    <input
                                                        type="checkbox"
                                                        class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                                                    />
                                                    <button class="flex items-center gap-x-2">
                                                        <span>Name</span>
                                                    </button>
                                                </div>
                                            </th>

                                            <th
                                                scope="col"
                                                class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                                            >
                                               Email
                                            </th>

                                            <th
                                                scope="col"
                                                class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                                            >
                                                Position
                                            </th>

                                            
                                            <th
                                                scope="col"
                                                class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                                            >
                                                PayType
                                            </th>

                                            <th
                                                scope="col"
                                                class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                                            >
                                                PayRate
                                            </th>

                                            <th
                                                scope="col"
                                                class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                                            >
                                                Phone
                                            </th>

                                           
                                            <th
                                                scope="col"
                                                class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                                            >
                                                Start Date
                                            </th>
                                            <th
                                                scope="col"
                                                class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                                            >
                                                SIN
                                            </th>
                                           
                                            <th
                                                scope="col"
                                                class="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400"
                                            >
                                                Action
                                            </th>

                                           
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                        {employees.map((employee) => (
                                            <tr key={employee._id}>
                                                <td class="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-wrap">
                                                    <div class="inline-flex items-center gap-x-3">
                                                        <input
                                                            type="checkbox"
                                                            class="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                                                        />

                                                        <span>
                                                            #
                                                            {
                                                                employee?.name
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 ">
                                                    {employee?.email}
                                                </td>
                                                
                                                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-wrap">
                                                    {employee?.position}
                                                </td>

                                                
                                                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-wrap">
                                                    {employee?.payType}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-wrap">
                                                    {employee?.payRate}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-wrap">
                                                    {employee?.phone}
                                                </td>
                                                
                                               
                                                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-wrap">
                                                   {moment(
                                                        employee?.startDate
                                                    ).format('LL')}
                                                </td>
                                                <td class="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-wrap">
                                                    {employee?.sin}
                                                </td>
                                                
                                                
                                                <td class="px-4 flex space-x-2 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-wrap">
                                                   <button onClick={()=>{edit(employee)}} className='text-blue-700'>
                                                   <EditOutlined />
                                                   </button>
                                                   <button onClick={()=>{deleteEmployee(employee?._id)}} className='text-red-600'>
                                                   <DeleteOutlined />
                                                   </button>
                                                </td>
                                               
                                                
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                    <button
                        className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 rtl:-scale-x-100"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                            />
                        </svg>

                        <span>Previous</span>
                    </button>

                    <div className="items-center hidden md:flex gap-x-3">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={`px-2 py-1 text-sm rounded-md ${
                                    currentPage === index + 1
                                        ? 'text-blue-500 bg-blue-100/60'
                                        : 'text-gray-500 hover:bg-gray-100'
                                }`}
                                onClick={() => onPageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <span>Next</span>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 rtl:-scale-x-100"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                            />
                        </svg>
                    </button>
                </div>
            </section>
        </div>
    )
}

export default EmployeeTable