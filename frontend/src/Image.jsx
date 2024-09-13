import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdDeleteOutline } from "react-icons/md";
import { TfiArrowLeft } from "react-icons/tfi";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { MdOutlineFavorite } from "react-icons/md";
import { markedFav } from './databasecall/markedFav.js';
import { getImageDtls } from './databasecall/getImageDtls.js';
import { useLocation } from 'react-router';
import { useRef } from 'react';

function Image() {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);

    // Access individual query parameters
    const album = queryParams.get('album');
    console.log("a is: ", album);

    const { imageURL } = useParams()
    console.log('ImageURL: ', imageURL);

    const [prev, setPrev] = useState("")
    const [next, setNext] = useState("")

    const [showPopup, setShowPopup] = useState(false)
    const [imageDetails, setImageDetails] = useState({})

    const navigate = useNavigate()

    useRef

    const userId = useSelector((s) => s.auth.userData.userId)

    async function fetchImage() {
        try {
            let response = await axios.get(`${import.meta.env.VITE_API_URL}/image`)
            response = response.data
            if (album == "favorite") {
                response = response.filter((e) => (e.ownerId === userId && e.favorite == true))
            }
            else {
                response = response.filter((e) => (e.ownerId === userId))
            }
            console.log("res in viewimage: ", response);
            return response
        }
        catch (error) {
            console.log("Fetching img failed: ", error);
        }
    }


    const deleteDocument = async () => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/image/viewimage?param1=${encodeURIComponent('https://' + imageURL)}`);
            console.log("res from delete: ", res.data);
            console.log("prev for routing: ", prev, next);
            if (prev != "") {
                navigate(`/home/image/${encodeURIComponent(prev.slice(7, prev.length))}`)
            }
            else {
                navigate(`/home`)
            }
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    };

    useEffect(() => {
        if (!userId) {
            navigate("/")
        }

        getImageDtls(`http://${imageURL}`)
            .then((res) => {
                setImageDetails(res)
            })
            .catch(() => {

            })

        fetchImage()
            .then((response) => {
                response.map((e, i) => {
                    console.log("e", e);
                    if (`http://${imageURL}` == e.image) {
                        // console.log("e[i+1].image: ", response[i + 1].image);
                        // console.log("response[i+1].image: ", response[i + 1].image);

                        if (response[i + 1] && response[i - 1]) {
                            setNext(response[i + 1].image)
                            setPrev(response[i - 1].image)
                        }
                        else if (response[i + 1]) {
                            setNext(response[i + 1].image)
                            setPrev("")
                        }
                        else if (response[i - 1]) {
                            setPrev(response[i - 1].image)
                            setNext("")
                        }
                    }
                })
            })
    }, [imageURL])

    const handleShowPopup = (para) => {
        if (para == false) {
            setShowPopup(!showPopup)
            setTimeout(() => {
                setShowPopup(false)
            }, 4000)
        }
        else {
            setShowPopup(false)
        }
    }


    console.log("prev, next: ", prev, next);

    const [swipeDirection, setSwipeDirection] = useState(null); // To store the swipe direction
    const touchStartX = useRef(0); // To track the starting X position of the touch
    const touchEndX = useRef(0);   // To track the ending X position of the touch

    // Called when the user starts touching the screen
    const handleTouchStart = (event) => {
        touchStartX.current = event.touches[0].clientX; // Record the initial touch position
    };

    // Called as the user moves their finger on the screen
    const handleTouchMove = (event) => {
        touchEndX.current = event.touches[0].clientX; // Update as the finger moves
    };

    // Called when the user lifts their finger from the screen
    const handleTouchEnd = () => {
        const diffX = touchStartX.current - touchEndX.current;

        if (diffX > 50) {
            // Swipe Left
            setSwipeDirection("Left");
            if (next != "") {
                navigate(`/home/image/${encodeURIComponent(next.slice(7, next.length))}?album=${album}`)
            }
        } else if (diffX < -50) {
            // Swipe Right
            setSwipeDirection("Right");
            if (prev != "") {
                navigate(`/home/image/${encodeURIComponent(prev.slice(7, prev.length))}?album=${album}`)
            }
        } else {
            setSwipeDirection(null); // No significant swipe
        }
    };

    return (
        userId && <div onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd} className='bg-slate-900 pt-3'>
            <Link to="/home">
                <TfiArrowLeft className='text-white text-2xl fixed top-3 left-3' />
            </Link>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                {
                    prev != "" && <Link to={`/home/image/${encodeURIComponent(prev.slice(7, prev.length))}?album=${album}`}>
                        <IoMdArrowDropleft className='text-white text-4xl sm:text-5xl absolute left-1 hidden md:block' />
                    </Link>
                }

                <div className='flex flex-col justify-center items-center h-screen'>
                    <img className='w-64' onClick={(e) => {
                        e.stopPropagation()
                        handleShowPopup(showPopup)
                    }} src={`https://${imageURL}`} alt="Image" />
                </div>

                {
                    showPopup && <div onClick={(e) => { e.stopPropagation() }} className='w-64 md:w-72 lg:w-80 xl:w-96 bg-slate-900 text-white fixed h-10 bottom-4 flex justify-center gap-x-4 items-center'>
                        <MdDeleteOutline className='hover:text-red-600 text-2xl text-white' onClick={deleteDocument} />
                        {
                            imageDetails.favorite ?
                                <MdOutlineFavorite onClick={() => {
                                    markedFav(`http://${imageURL}`)
                                        .then((response) => {
                                            console.log("response after markedfav: ", response);
                                            return getImageDtls(`http://${imageURL}`)
                                        })
                                        .then((res) => {
                                            console.log("response after getImageDtls: ", res);
                                            // setImageDetails((state) => ({ ...state, favorite: false }))
                                            setImageDetails(res)
                                        })
                                }} className='text-2xl text-red-500 hover:text-red-500' />
                                :
                                <MdOutlineFavorite onClick={() => {
                                    markedFav(`http://${imageURL}`)
                                        .then((response) => {
                                            console.log("response after markedfav: ", response);
                                            return getImageDtls(`http://${imageURL}`)
                                        })
                                        .then((res) => {
                                            console.log("response after getImageDtls: ", res);
                                            // setImageDetails((state) => ({ ...state, favorite: true }))
                                            setImageDetails(res)
                                        })
                                }} className='text-2xl hover:text-red-500' />
                        }
                    </div>
                }

                {
                    next != "" && <Link to={`/home/image/${encodeURIComponent(next.slice(7, next.length))}?album=${album}`}>
                        <IoMdArrowDropright className='text-white text-4xl sm:text-5xl absolute right-1 hidden md:block' />
                    </Link>
                }

            </div>
        </div>

    )
}

export default Image