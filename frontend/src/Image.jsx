import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdDeleteOutline } from "react-icons/md";
import { TfiArrowLeft } from "react-icons/tfi";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";

function Image() {
    const { imageURL } = useParams()
    console.log('ImageURL: ', imageURL);

    const [prev, setPrev] = useState("")
    const [next, setNext] = useState("")

    const [showPopup, setShowPopup] = useState(false)

    const navigate = useNavigate()

    const userId = useSelector((s) => s.auth.userData.userId)

    async function fetchImage() {
        try {
            let response = await axios.get(`${import.meta.env.VITE_API_URL}/image`)
            response = response.data
            response = response.filter((e) => e.ownerId === userId)
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


    return (
        userId && <div className='bg-slate-900 pt-3'>
            <Link to="/home">
                <TfiArrowLeft className='text-white text-2xl fixed top-3 left-3' />
            </Link>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                {
                    prev != "" && <Link to={`/home/image/${encodeURIComponent(prev.slice(7, prev.length))}`}>
                        <IoMdArrowDropleft className='text-white text-4xl sm:text-5xl absolute left-1' />
                    </Link>
                }

                <div className='flex flex-col justify-center items-center h-screen'>
                    <img className='w-64' onClick={() => handleShowPopup(showPopup)} src={`https://${imageURL}`} alt="Image" />
                    {
                        showPopup && <div className='w-64 md:w-72 lg:w-80 xl:w-96 bg-slate-900 text-white relative h-10 bottom-10 flex justify-center items-center'>
                            <MdDeleteOutline onClick={deleteDocument} style={{ color: "white", fontSize: "2rem" }} />
                        </div>
                    }
                </div>

                {
                    next != "" && <Link to={`/home/image/${encodeURIComponent(next.slice(7, next.length))}`}>
                        <IoMdArrowDropright className='text-white text-4xl sm:text-5xl absolute right-1' />
                    </Link>
                }

            </div>
        </div>

    )
}

export default Image