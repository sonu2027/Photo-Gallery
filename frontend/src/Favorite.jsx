import React, { useState, useEffect } from 'react'
import Header from './component/Header.jsx';
import Album from './component/Album.jsx';
import axios from 'axios';
import useDetailHook from './customHooks/userDetailHook.js';

function Favorite() {

    const [imageData, setImageData] = useState([])
    const [uploadImage, setUploadImage] = useState(false)

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
        async function fetchImages() {
            let imagesData = await axios.get(`${import.meta.env.VITE_API_URL}/image`)
            imagesData = imagesData.data
            let images = new Array()
            imagesData.map((e) => {
                if (e.ownerId == userId && e.favorite==true) {
                    images.push(e.image)
                }
            })
            console.log("res: ", images);
            setImageData(images)
            document.cookie = `username=${images}; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/;`;
            const cookies = document.cookie;
            console.log("cookies: ", cookies);
            console.log("cookies: ", cookies.username);
        }
        fetchImages()
    }, [uploadImage])

    return (
        <div className='bg-gray-100 pb-24'>
            <Header />
            <Album imageData={imageData} setUploadImage={setUploadImage} uploadImage={uploadImage} album={"favorite"}/>
        </div >
    )
}

export default Favorite