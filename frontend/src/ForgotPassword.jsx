import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { userFound } from './store/passwordReq'

function ForgotPassword() {

    const dispatch=useDispatch()

    const navigate = useNavigate()

    const [otpSent, setOtpSent] = useState(false)
    const [mail, setMail] = useState("")
    const [OTP, setOTP] = useState("")
    const [generatedOTP, setGeneratedOTP] = useState("")
    const [wrongOTP, setwrongOTP] = useState("")
    const [foundUser, setFoundUser] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (OTP) {
            if (OTP == generatedOTP) {
                setwrongOTP("true")
                const formData = new FormData(event.target)
                formData.append("email", mail)
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/finduser`, {
                        method: "POST",
                        body: formData
                    })

                    console.log("response", response);

                    if (response.ok) {
                        console.log("User found");
                        dispatch(userFound({status:true}))
                        navigate(`/forgotpassword/ChangePassword/${mail}`)
                    }
                    else {
                        setFoundUser("false")
                        setTimeout(() => {
                            setFoundUser("")
                            navigate("/")
                        }, 3000)
                        throw error
                    }
                }
                catch (error) {
                    console.log("error: ", error);
                }
            }
            else {
                setwrongOTP("false")
                setTimeout(() => {
                    setwrongOTP("")
                }, 3000)
            }
        }
        else {
            const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            const formData = new FormData(event.target)
            formData.append("verificationCode", otp)
            setGeneratedOTP(otp)

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/sendemail`, {
                    method: "POST",
                    body: formData
                })

                console.log("response", response);

                if (response.ok) {
                    console.log("Email sent successful");
                    setOtpSent(true)
                }
                else {
                    throw error
                }
            }
            catch (error) {
                console.log("error: ", error);
            }
        }
    }

    return (
        <div className=' bg-slate-800 h-screen'>


            <div className='flex flex-col justify-center items-center'>

                <div className='pt-4 pb-2 text-white text-2xl font-medium'>Photo Gallery</div>
                <hr className='border-2 border-solid border-gray-700 w-screen' />

                {
                    otpSent ?
                        <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center w-screen mt-6' encType='multipart/form-data'>
                            <div className='pt-4 pb-4  text-white text-xl font-medium'>Enter OTP</div>
                            <input onChange={(e) => setOTP(e.target.value)} className='w-10/12 mb-4 rounded-md text-white bg-slate-700 caret-white focus:outline-none p-2 sm:w-9/12 md:w-6/12' type="text" name="otp" id="otp" value={OTP} />


                            <div className='flex justify-center items-center'>
                                <button className='text-white bg-blue-500 rounded-2xl absolute bottom-4 w-10/12 sm:w-9/12 md:w-6/12 py-2' type="submit">Next</button>
                            </div>
                        </form>
                        :
                        <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center w-screen mt-6' encType='multipart/form-data'>
                            <div className='pt-4 pb-4  text-white text-xl font-medium'>Enter your email address</div>
                            <input onChange={(e) => setMail(e.target.value)} className='w-10/12 mb-4 rounded-md text-white bg-slate-700 caret-white focus:outline-none p-2 sm:w-9/12 md:w-6/12' type="email" name="email" id="email" value={mail} />


                            <div className='flex justify-center items-center'>
                                <button className='text-white bg-blue-500 rounded-2xl absolute bottom-4 w-10/12 sm:w-9/12 md:w-6/12 py-2' type="submit">Next</button>
                            </div>
                        </form>
                }
                {
                    wrongOTP == "false" && <div className='text-red-600'>Wrong OTP</div>
                }
                {
                    foundUser == "false" && <div className='text-red-600'>Email doesn't exist</div>
                }
            </div>
        </div >
    )
}

export default ForgotPassword