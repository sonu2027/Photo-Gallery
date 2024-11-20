import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { login } from './store/authSlice'
import Login from './Login.jsx'
import useDetailHook from './customHooks/userDetailHook.js'

function VerifyEmail({ email, formDatas, requesting, setGotVerifyEmail, setChanges }) {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {
        status,
        userId,
        userProfilePhoto,
        fullName,
        username,
        email: emails,
        password,
    } = useDetailHook()

    const [time, setTime] = useState(20)
    const [inputOtp, setInputOtp] = useState("")
    const [realOtp, setRealOtp] = useState("1")
    const [otpSent, setOtpSent] = useState(false)
    const [gotoLogin, setGotoLogin] = useState(false)
    const [userExist, setuserExist] = useState(false)

    async function sendOtp() {
        const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        console.log("Generated otp: ", otp);
        const formData = new FormData()
        formData.append("verificationCode", otp)
        formData.append("email", email)
        setRealOtp(otp)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/sendemail`, {
                method: "POST",
                body: formData
            })
            console.log("response: ", response);

            if (response.ok) {
                setOtpSent(true)
            }
        }
        catch (error) {
            console.log("error: ", error);
        }
    }

    useEffect(() => {
        sendOtp()
        let timerId = setInterval(() => {
            setTime((s) => s - 1);
        }, 1000);

        setTimeout(() => {
            if (requesting) {
                setGotVerifyEmail(false)
            }
            else {
                setGotoLogin(true)
                clearInterval(timerId);
            }
        }, 20000);
    }, [])

    const registerUser = async () => {
        console.log("register started");
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/register`, {
                method: 'POST',
                body: formDatas
            });

            console.log("response: ", response);

            if (response.ok) {
                const data = await response.json();
                console.log('Registration successful: data', data);

                dispatch(login({ userId: data.data._id, userProfilePhoto: data.data.image, fullName: data.data.fullName, email: data.data.email, username: data.data.username, password: data.data.password }))
            } else {
                console.error('Registration failed:', response.statusText);
            }
        } catch (error) {
            setuserExist(true)
            setTimeout(() => {
                setGotoLogin(true)
            }, 3000)
            console.error('Error occurred while registering:', error);
        }
    }

    const ChangeEmailReq = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/image`, {
                method: 'PUT',
                body: formDatas
            });
            console.log("response for email update: ", response);

            if (response.ok) {
                const data = await response.json();
                console.log('email Updation successful: data', data);

                dispatch(login({ userId: userId, userProfilePhoto: userProfilePhoto, fullName: fullName, email: data.data, username: username, password: password }))
                // navigate("/home/setting/email")
                setGotVerifyEmail(false)
                setChanges("true")
                setTimeout(() => {
                    setChanges("")
                }, 3000)

            } else {
                setGotVerifyEmail(false)
                setChanges("false")
                setTimeout(() => {
                    setChanges("")
                }, 3000)
                console.error('email Updation failed:', response.statusText);
            }
        }
        catch (error) {
            console.log("error in change email : ", error);
        }
    }

    useEffect(() => {
        console.log("running");
        if (realOtp == inputOtp && !requesting) {
            console.log("registerUser called");
            registerUser().then((res) => {
                console.log("res after registerUser: ", res);
                if (status && !requesting) {
                    navigate("/home")
                }
            })
                .catch((e) => {
                    console.log('Error while registering: ', e);
                })
        } else if (realOtp == inputOtp && requesting) {
            console.log("ChangeEmailReq  called");
            ChangeEmailReq()
        }
    }, [inputOtp])


    return (
        <>
            {
                gotoLogin ?
                    <Login />
                    :
                    <div className='flex flex-col justify-start pt-28 items-center h-screen bg-slate-800'>

                        <div className='text-center text-white'>Enter verification code send to {email}</div>
                        <div className='flex justify-center items-center mt-4 gap-x-2 w-screen'>
                            <input className='w-8/12 rounded-md text-white bg-slate-700 caret-white focus:outline-none p-2 sm:w-7/12 md:w-5/12' onChange={(e) => setInputOtp(e.target.value)} type="text" name="otp" id="otp" placeholder='Enter otp' />
                            <div className='text-white'>{time} sec</div>
                        </div>
                        {
                            userExist && <div className='text-white'>User with {email} already exist</div>
                        }
                    </div>
            }
        </>
    )
}

export default VerifyEmail