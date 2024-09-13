import React, { useState, useEffect } from 'react'
import useDetailHook from '../customHooks/userDetailHook.js'
import { Navigate } from 'react-router'
import { FaEdit } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import { IoPencil } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import { MdOutlineFavorite } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/authSlice.js';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { RxCross1 } from "react-icons/rx";

function Header() {

    const [clickedUser, setClickedUser] = useState(false)
    const [updateImage, setUpdateImage] = useState(false)
    const [updateName, setUpdateName] = useState(false)
    const [newName, setNewName] = useState("")
    const [updatePPOption, setUpdatePPOption] = useState(false)
    const [PPuploadFailed, setPPuploadFailed] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {
        status,
        userId,
        userProfilePhoto,
        fullName,
        username,
        email,
        password,
    } = useDetailHook()

    useEffect(() => {
        setNewName(fullName)
    }, [])

    const handleUpdateName = () => {
        setUpdateName(!updateName)
        setNewName(fullName)
    }

    const handleNameSubmit = async (event) => {
        setUpdateName(!updateName)
        setNewName(fullName)
        event.preventDefault(); // Prevent the default form submission behavior
        console.log("even.target: ", event.target);

        const formData = new FormData(event.target);
        formData.append('userId', userId);
        console.log("formData: ", event.target);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/image`, {
                method: 'PUT',
                body: formData
            });

            console.log("response: ", response);

            if (response.ok) {
                // Registration successful, handle response
                const data = await response.json();
                console.log('Updation successful: data', data);
                // Optionally, you can redirect the user to another page or show a success message here
                // userId: data.data._id, userProfilePhoto: data.data.image, 
                dispatch(login({ userId: userId, userProfilePhoto: userProfilePhoto, fullName: data.data }))
            } else {
                // Handle errors
                console.error('Updation failed:', response.statusText);
                // Optionally, you can show an error message to the user
            }
        } catch (error) {
            console.error('Error occurred while registering:', error);
            // Optionally, you can show an error message to the user
        }
    }

    const handleUpdatePP = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData(event.target);
        formData.append('userId', userId);
        console.log("formData: ", event.target);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/image`, {
                method: 'PUT',
                body: formData
            });
            console.log("Res for updating pp: ", response);
            if (response.ok) {
                setUpdatePPOption(false)
                // Registration successful, handle response
                const data = await response.json();
                console.log('Updation PP successful: data', data);
                // Optionally, you can redirect the user to another page or show a success message here
                // userId: data.data._id, userProfilePhoto: data.data.image, 
                dispatch(login({ userId: userId, userProfilePhoto: data.data, fullName: fullName }))
            } else {
                setPPuploadFailed(true)
                setTimeout(() => {
                    setPPuploadFailed(false)
                }, 3000)
                // Handle errors
                console.error('Updation failed:', response.statusText);
                // Optionally, you can show an error message to the user
            }
        }
        catch (error) {
            console.log("error occured while updatiing pp: ", error);
        }
    }

    window.addEventListener("click", (e) => {
        if (clickedUser) {
            setClickedUser(false)
        }
        document.body.style.overflow = "scroll"
    })

    return (
        <>
            {
                status ?
                    <>
                        <div onClick={(e) => { e.stopPropagation() }} className='m-2 absolute right-6 top-2 text-red-500 font-medium' >
                            <img onClick={() => setClickedUser(!clickedUser)} className='h-8 w-8 hover:cursor-pointer rounded-full' src={userProfilePhoto} alt="" />
                        </div>
                        {clickedUser &&
                            <ul className='m-2 absolute right-2 top-12  bg-white text-black rounded-md shadow-lg border-2 border-solid border-white md:p-2'>
                                <Link to="/home">
                                    <li className='px-4 py-1 flex justify-start items-center gap-x-2 hover:bg-gray-200 hover:rounded-md'>
                                        <IoMdHome />
                                        <button>Home</button>
                                    </li>
                                </Link>

                                <Link to="/home/favorite">
                                    <li className='px-4 py-1 flex justify-start items-center gap-x-2 hover:bg-gray-200 hover:rounded-md'>
                                        <MdOutlineFavorite />
                                        <button>Favorite</button>
                                    </li>
                                </Link>
                                <Link to="/home/setting">
                                    <li className='px-4 py-1 flex justify-start items-center gap-x-2 hover:bg-gray-200 hover:rounded-md'>
                                        <IoSettingsSharp />
                                        <button>Settings and Privacy</button>
                                    </li>
                                </Link>
                                <li onClick={() => {
                                    document.cookie = "username=sonu; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                    dispatch(logout())
                                }} className='px-4 py-1 flex justify-start items-center gap-x-2 hover:bg-gray-200 hover:rounded-md'>
                                    <IoLogOut />
                                    <button>Log Out</button>
                                </li>
                            </ul>
                        }
                    </>
                    :
                    <>
                        <Navigate to="/" />
                    </>
            }
            <div className='flex flex-col justify-center items-center bg-gray-100 pt-2 pb-2'>
                <img onClick={() => {
                    setUpdateImage(true)
                    setTimeout(() => {
                        setUpdateImage(false)
                    }, 3000)
                }} className='rounded-full w-48' src={`${userProfilePhoto}`} alt="Profile Photo" />
                {
                    updateImage && <IoPencil onClick={() => setUpdatePPOption(true)} className='fixed text-gray-100 text-2xl' />
                }
                {
                    updateName ?
                        <form className='flex justify-center items-center gap-x-2 cursor-pointer' onSubmit={handleNameSubmit} encType='multipart/form-data'>
                            <input className='focus:outline-black rounded-sm pl-1' onChange={(e) => setNewName(e.target.value)} type="text" name="fullName" id="" value={newName} />
                            <button type="submit">
                                <SiTicktick />
                            </button>
                        </form>
                        :
                        <div className='flex justify-center items-center gap-x-2 cursor-pointer'>
                            <div className='font-medium'>{fullName}</div>
                            <FaEdit onClick={handleUpdateName} />
                        </div>
                }

            </div>
            <br />
            {
                updatePPOption &&
                <div className='bg-white fixed top-1/3 right-1/2 translate-x-1/2 translate-y-1/2 rounded-md border-2 border-solid border-gray-300'>
                    <div className='flex justify-end items-center'>
                        <RxCross1 onClick={() => setUpdatePPOption(false)} className='m-2 hover:cursor-pointer' />
                    </div>
                    <form className='flex flex-col justify-center items-center px-4 pb-4 pt-2' onSubmit={handleUpdatePP} encType='multipart/form-data'>
                        <input type="file" name="image" id="" placeholder='Upload Files' /><br /><br />
                        <button className='bg-blue-500 rounded-sm text-white px-4 py-1' type="submit">Update</button>
                    </form>
                    {
                        PPuploadFailed && <div>Upload failed: Please try again</div>
                    }
                </div>
            }
        </>
    )
}

export default Header