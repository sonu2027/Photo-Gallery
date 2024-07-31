import React from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { TfiArrowLeft } from "react-icons/tfi";
import { Link } from 'react-router-dom';
import Profile from './Profile';
import useDetailHook from './customHooks/userDetailHook';

function Setting() {

    const {
        status,
        userId,
        userProfilePhoto,
        fullName,
        username,
        email,
        password,
    } = useDetailHook()

    const handleFileSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData(event.target);
        formData.append('userId', userId);
        console.log("formData: ", event.target);
    }

    return (
        <div className='flex flex-col justify-start items-center bg-slate-800 h-screen'>
            <Link to="/">
                <TfiArrowLeft className='text-white text-2xl fixed top-3 left-3' />
            </Link>
            <Profile userProfilePhoto={userProfilePhoto} fullName={fullName} username={username} />
            <ul className='mt-10 p-1 w-11/12 sm:w-9/12 md:w-7/12 text-white rounded-md shadow-lg md:p-2 bg-slate-900'>

                <Link to="/home/setting/name">
                    <li className='px-4 py-1 flex justify-between items-center gap-x-2 hover:bg-gray-200 hover:rounded-md hover:text-black'>
                        <button>Name</button>
                        <IoIosArrowForward />
                    </li>
                </Link>

                <Link to="/home/setting/username">
                    <li className='px-4 py-1 flex justify-between items-center gap-x-2 hover:bg-gray-200 hover:rounded-md hover:text-black'>
                        <button>Username</button>
                        <IoIosArrowForward />
                    </li>
                </Link>

                <Link to="/home/setting/email">
                    <li className='px-4 py-1 flex justify-between items-center gap-x-2 hover:bg-gray-200 hover:rounded-md hover:text-black'>
                        <button>Email</button>
                        <IoIosArrowForward />
                    </li>
                </Link>

                <Link to="/home/setting/password">
                    <li className='px-4 py-1 flex justify-between items-center gap-x-2 hover:bg-gray-200 hover:rounded-md hover:text-black'>
                        <button>Password</button>
                        <IoIosArrowForward />
                    </li>
                </Link>

                <Link to="/home/setting/profilepicture">
                    <li className='px-4 py-1 flex justify-between items-center gap-x-2 hover:bg-gray-200 hover:rounded-md hover:text-black'>
                        <button>Profile Picture</button>
                        <IoIosArrowForward />
                    </li>
                </Link>

                <Link to="/home/setting/accountdeleteion">
                    <li className='px-4 py-1 flex justify-between items-center gap-x-2 hover:bg-gray-200 hover:rounded-md hover:text-black'>
                        <button>Delete your account</button>
                        <IoIosArrowForward />
                    </li>
                </Link>

            </ul>
        </div>
    )
}

export default Setting