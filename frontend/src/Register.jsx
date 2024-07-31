import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import Login from './Login.jsx';
import VerifyEmail from './VerifyEmail.jsx';
import useDetailHook from './customHooks/userDetailHook.js';

function Register() {

  const [gotoLogin, setGotoLogin] = useState(false)

  const {
    status,
    userId,
    userProfilePhoto,
    fullName,
    username,
    email,
    password,
  } = useDetailHook()

  const [inputField, setInputField] = useState({
    username: "",
    email: "",
    password: "",
    profilrpicture: "",
    fullname: ""
  })

  const [emptyField, setEmptyField] = useState({
    username: '',
    email: '',
    password: '',
    profilrpicture: '',
    fullname: ''
  })

  const [isFormEmpty, setIsFormEmpty] = useState(true)
  const [formDatas, setFormDatas] = useState("")


  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log("even.target: ", event.target);

    let formEmpty = false
    for (let i in inputField) {
      if (inputField[i] == "") {
        formEmpty = true
        setEmptyField((prevState) => ({
          ...prevState,
          [i]: 'border-2 border-solid border-red-600'
        }))
      }
      else {
        setEmptyField((prevState) => ({
          ...prevState,
          [i]: ''
        }))
      }
    }

    if (formEmpty) {
      return
    }
    setIsFormEmpty(formEmpty)

    // Fetch the registration endpoint with form data
    const formData = new FormData(event.target);
    console.log("formData: ", event.target);
    setFormDatas(formData)
  };

  return (
    <>
      {
        !isFormEmpty ?
          <VerifyEmail email={inputField.email} formDatas={formDatas} />
          :
          <>
            {
              gotoLogin ?
                <Login />
                :
                <div className='bg-gray-100 h-screen flex justify-center items-center'>
                  {
                    status ?
                      <>
                        <Navigate to="/home" />
                      </>
                      :
                      <div className='bg-white rounded-md border-2 border-solid border-slate-300 px-4 py-6'>
                        <h1 className='text-2xl sm:text-3xl mb-6'>Photo Gallery</h1>
                        <form onSubmit={handleSubmit} encType='multipart/form-data'>

                          <input onChange={(e) => setInputField((prevState) => ({
                            ...prevState,
                            username: e.target.value
                          }))} className={`border-2 solid border-gray-300 rounded-sm w-64 sm:w-72 bg-gray-100 px-1 py-1 focus:outline-blue-500 mb-3 ${emptyField.username}`} type="text" name='username' placeholder='Enter Username' /><br />

                          <input onChange={(e) => setInputField((prevState) => ({
                            ...prevState,
                            fullname: e.target.value
                          }))} className={`border-2 solid border-gray-300 rounded-sm w-64 sm:w-72 bg-gray-100 px-1 py-1 focus:outline-blue-500 mb-3 ${emptyField.fullname}`} type="text" name='fullName' placeholder='Full Name' /><br />

                          <input onChange={(e) => setInputField((prevState) => ({
                            ...prevState,
                            email: e.target.value
                          }))} className={`border-2 solid border-gray-300 rounded-sm w-64 sm:w-72 bg-gray-100 px-1 py-1 focus:outline-blue-500 mb-3 ${emptyField.email}`} type="text" name='email' placeholder='Enter Email' /><br />

                          <input onChange={(e) => setInputField((prevState) => ({
                            ...prevState,
                            password: e.target.value
                          }))} className={`border-2 solid border-gray-300 rounded-sm w-64 sm:w-72 bg-gray-100 px-1 py-1 focus:outline-blue-500 mb-6 ${emptyField.password}`} type="password" name='password' placeholder='Enter Password' /><br />

                          <label className={`text-gray-500 rounded-md bg-gray-200 px-3 py-2 hover:cursor-pointer ${emptyField.profilrpicture}`} htmlFor="image">Upload profile photo </label><br />
                          <input onChange={(e) => setInputField((prevState) => ({
                            ...prevState,
                            profilrpicture: e.target.files[0]
                          }))} className='w-64 sm:w-72 hidden' type="file" name="image" id="image" /><br />

                          <button className='rounded-sm text-white w-64 sm:w-72 bg-blue-500 px-1 py-1 hover:cursor-pointer' type="submit">Register</button>

                        </form>
                        <div className='mt-3'>
                          Already have an acoount? &nbsp;

                          <b onClick={() => setGotoLogin(true)} className='text-blue-400 hover:cursor-pointer'>Login</b>
                        </div>
                      </div>
                  }
                </div>
            }
          </>
      }
    </>
  );
}

export default Register;