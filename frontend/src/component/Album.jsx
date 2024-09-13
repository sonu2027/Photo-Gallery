import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { RxCross1 } from "react-icons/rx";
import useDetailHook from '../customHooks/userDetailHook.js';

function Album({imageData, setUploadImage, uploadImage, album}) {

    const {
        status,
        userId,
        userProfilePhoto,
        fullName,
        username,
        email,
        password,
    } = useDetailHook()

    // const [uploadImage, setUploadImage] = useState(false)
    const [uploadFailed, setUploadfailed] = useState(false)
    // const [imageData, setImageData] = useState([])
    const [loading, setLoading] = useState(false)
    const [uploadOption, setUploadOption] = useState(false)

    


    const handleUpload = async (event) => {
        event.preventDefault();
        console.log("event: ", event);

        if (event.target[0].value != "") {
            setLoading(true)
            const formData = new FormData(event.target);
            formData.append('ownerId', userId);
            console.log("formData: ", event.target);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/image`, {
                    method: 'POST',
                    body: formData
                });

                console.log("response: ", response);

                if (response.ok) {
                    document.body.style.overflow = "scroll"
                    const data = await response.json();
                    console.log('Images: ', data);
                    setUploadOption(false)
                    setLoading(false)
                } else {
                    setUploadfailed(true)
                    setTimeout(() => {
                        setUploadfailed(false)
                    }, 3000)
                    console.error('Registration failed:', response.statusText);
                }
            } catch (error) {
                console.error('Error occurred while registering:', error);
            }
            setUploadImage(!uploadImage)
        }
    };

    const showUploadOption = (e) => {
        e.stopPropagation()
        setUploadOption(!uploadOption)
        if (uploadOption) {
            document.body.style.overflow = "scroll"
        }
        else {
            document.body.style.overflow = "hidden"
        }
    }

    window.addEventListener("click", (e) => {
        if (uploadOption) {
            setUploadOption(false)
        }
        document.body.style.overflow = "scroll"
    })

    return (
        <div className='bg-gray-100 pb-24'>
            {
                uploadOption &&
                <div onClick={(e) => { e.stopPropagation() }} className='bg-white fixed top-1/3 right-1/2 translate-x-1/2 translate-y-1/2 rounded-md border-2 border-solid border-gray-300'>
                    <div className='flex justify-end items-center'>
                        <RxCross1 onClick={showUploadOption} className='m-2 hover:cursor-pointer' />
                    </div>
                    <form className='flex flex-col justify-center items-center px-4 pb-4 pt-2' onSubmit={handleUpload} encType='multipart/form-data'>
                        <input onChange={(e) => {
                            console.log("e:", e);

                        }} type="file" name="image" id="" placeholder='Upload Files' /><br /><br />
                        {
                            loading ?
                                <button className='bg-blue-500 rounded-sm text-white px-4 py-2' type="submit">
                                    <div className='h-6 w-6 rounded-full border-solid border-2 border-white border-t-blue-900 animate-spin'></div>
                                </button>
                                :
                                <button className='bg-blue-500 rounded-sm text-white px-4 py-1' type="submit">Post</button>
                        }
                    </form>
                    {
                        uploadFailed && <div>Upload failed: Please try again</div>
                    }
                </div>
            }

            <div className='sm:mx-4 md:mx-8 lg:mx-12 bg-white rounded-md flex flex-col border-2 border-solid border-gray-100'>

                <div className='mx-2 mt-8 mb-8 flex justify-between items-center'>
                    <div className=' text-2xl'>Photos</div>
                    <button onClick={showUploadOption} className='text-white bg-blue-500 rounded-sm px-2 py-1'>Add photo</button>
                </div>

                <div className='flex justify-center items-start px-2 py-2'>
                    <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-2'>
                        {
                            imageData.map((e) =>
                                <Link key={e} to={`/home/image/${encodeURIComponent(e.slice(7, e.length))}?album=${album}`}>
                                    <div className='rounded-md border-gray-200 border-2 border-solid h-52'>
                                        <img className='h-full w-full object-cover' src={`${e}`} alt="img"
                                        />
                                    </div>
                                </Link>
                            )
                        }
                    </div>
                </div>

            </div>

        </div >
    )
}

export default Album