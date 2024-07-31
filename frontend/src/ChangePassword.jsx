import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { userFound } from './store/passwordReq';

function ChangePassword() {

    const userFoundStatus = useSelector((s) => s.changePasswordReq.status)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!userFoundStatus) {
            navigate("/")
        }
    }, [])

    const navigate = useNavigate()

    const [p1, setP1] = useState("")
    const [p2, setP2] = useState("")
    const [matchPassword, setMatchPassword] = useState("")
    const [somethingWrong, setSomethingWrong] = useState("")

    const { mail } = useParams()

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (p1 == p2) {
            const formData = new FormData(event.target)
            formData.append('email', mail)
            console.log("event.target in  ChangePassword: ", event.target);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/image`, {
                    method: 'PUT',
                    body: formData
                });
                console.log("response: ", response);

                if (response.ok) {
                    const data = await response.json();
                    console.log('Updation successful: data', data);
                    dispatch(userFound({ status: false }))
                    setMatchPassword("true")
                    setTimeout(() => {
                        setMatchPassword("")
                        navigate("/")
                    }, 3000)

                } else {
                    setSomethingWrong("true")
                    setTimeout(() => {
                        setSomethingWrong("")
                    }, 3000)
                    console.error('Updation failed:', response.statusText);
                    throw error
                }
            }
            catch (error) {
                console.log("error in change while handlesubmit: ", error);
            }
        }
        else {
            setMatchPassword("false")
            setTimeout(() => {
                setMatchPassword("")
            }, 3000)
        }

    }


    return (
        <div className=' bg-slate-800 h-screen'>


            <div className='flex flex-col justify-center items-center'>

                <div className='pt-4 pb-2 text-white text-2xl font-medium'>Photo Gallery</div>
                <hr className='border-2 border-solid border-gray-700 w-screen' />

                <div className='pt-4 pb-2 text-white text-2xl font-medium mt-4 mb-2'>Change password</div>
                <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center w-screen' encType='multipart/form-data'>

                    <input onChange={(e) => setP1(e.target.value)} className='w-10/12 mb-4 rounded-md text-white bg-slate-700 caret-white focus:outline-none p-2 sm:w-9/12 md:w-6/12' type="password" name="password" id="newPassword" placeholder='Enter new password' />

                    <input onChange={(e) => setP2(e.target.value)} className='w-10/12 mb-4 rounded-md text-white bg-slate-700 caret-white focus:outline-none p-2 sm:w-9/12 md:w-6/12' type="password" name="password" id="confirmPassword" placeholder='Confirm Password' />


                    <div className='flex justify-center items-center'>
                        <button className='text-white bg-blue-500 rounded-2xl absolute bottom-4 w-10/12 sm:w-9/12 md:w-6/12 py-2' type="submit">submit</button>
                    </div>

                </form>

                {
                    matchPassword == "false" && <div className='text-red-600'>Password doesn't match</div>
                }
                {
                    matchPassword == "true" && <div className='text-green-600'>Password change successfully</div>
                }

                {
                    somethingWrong == "true" && <div className='text-red-600'>Something went wrong, please try gaain</div>
                }

            </div>
        </div>
    )
}

export default ChangePassword