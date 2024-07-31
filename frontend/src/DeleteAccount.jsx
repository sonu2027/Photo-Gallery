import React, { useEffect, useState } from 'react'
import useDetailHook from './customHooks/userDetailHook'
import Profile from './Profile.jsx'
import { TfiArrowLeft } from "react-icons/tfi";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from './store/authSlice.js';

function DeleteAccount() {

    const navigate=useNavigate()
    const dispatch=useDispatch()

    const {
        status,
        userId,
        userProfilePhoto,
        fullName,
        username,
        email,
        password,
    } = useDetailHook()

    const [otpSent, setOtpSent] = useState("")
    const [emails, setEmails] = useState("")
    const [passwords, setPasswords] = useState("")
    const [auth, setAuth] = useState("")
    const [inputOtp, setInputOtp]=useState("")
    const [generatedOtp, setGeneratedOtp]=useState("false")
    const [formDatas, setFormDatas]=useState("")

    const requestForAccountDeletion = async (formData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/deleteaccount`, {
                method: "DELETE",
                body: formData
            })
            console.log("response after account delete: ", response);

            if (response.ok) {
                setAuth("Account deleted successfully")
                setTimeout(() => {
                    setAuth("")
                    dispatch(logout())
                    navigate("/")
                }, 3000)
            }
        }
        catch (error) {
            console.log("error: ", error);
        }
    }

    useEffect(()=>{
        if(generatedOtp==inputOtp){
            requestForAccountDeletion(formDatas)
        }
    }, [inputOtp])

    const sendOtp = async (event) => {
        event.preventDefault()
        if (emails == email && passwords == password) {
            const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            setGeneratedOtp(otp)
            console.log("Generated otp: ", otp);
            const formData = new FormData(event.target)
            formData.append("verificationCode", otp)
            formData.append("userId", userId)
            setFormDatas(formData)

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/sendemail`, {
                    method: "POST",
                    body: formData
                })
                console.log("response: ", response);

                if (response.ok) {
                    setEmails("")
                    setPasswords("")
                    setInputOtp("")
                    setOtpSent("true")
                }
            }
            catch (error) {
                console.log("error: ", error);
            }
        }
        else {
            setAuth("Wrong email and password")
            setTimeout(() => {
                setAuth("")
            }, 3000)
        }

    }

    return (
        <div className='bg-slate-900 h-screen w-screen'>
            <Link to="/home/setting">
                <TfiArrowLeft className='text-white font-medium text-3xl fixed top-3 left-3' />
            </Link>
            <Profile userProfilePhoto={userProfilePhoto} fullName={fullName} username={username} />
            <form className='flex flex-col justify-center items-center pt-10' encType='multipart/form-data' onSubmit={sendOtp}>

                {
                    otpSent ?
                        <>
                            <input onChange={(e)=>setInputOtp(e.target.value)} className='w-10/12 mb-4 rounded-md text-white bg-slate-700 caret-white focus:outline-none p-2 sm:w-9/12 md:w-6/12' placeholder='Enter otp' type="text" name="otp" id="otp" />
                            {
                                auth != "" && <div className='text-red-500'>{auth}</div>
                            }</>
                        :
                        <>
                            <input onChange={(e) => setEmails(e.target.value)} className='w-10/12 mb-4 rounded-md text-white bg-slate-700 caret-white focus:outline-none p-2 sm:w-9/12 md:w-6/12' placeholder='Enter your email' type="email" name="email" id="email" /><br />

                            <input onChange={(e) => setPasswords(e.target.value)} className='w-10/12 mb-4 rounded-md text-white bg-slate-700 caret-white focus:outline-none p-2 sm:w-9/12 md:w-6/12' type="password" name="password" id="password" placeholder='Enter your password' />
                            {
                                auth != "" && <div className='text-red-500'>{auth}</div>
                            }
                        </>
                }

                <div className='flex justify-center items-center'>
                    <button className='text-white bg-blue-500 rounded-2xl absolute bottom-4 w-10/12 sm:w-9/12 md:w-6/12 py-2' type="submit">Next</button>
                </div>
            </form>
        </div>

    )
}

export default DeleteAccount