import React, { useEffect, useState } from 'react'
import { login } from './store/authSlice';
import { TfiArrowLeft } from "react-icons/tfi";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import VerifyEmail from './VerifyEmail';
import ProfilePictureForm from './formComponent/ProfilePictureForm.jsx';
import NameForm from './formComponent/NameForm.jsx';
import PasswordForm from './formComponent/PasswordForm.jsx';
import EmailForm from './formComponent/EmailForm.jsx';
import Profile from './Profile.jsx';
import useDetailHook from './customHooks/userDetailHook.js';

function Change() {

    const dispatch = useDispatch();
    const {
        status,
        userId,
        userProfilePhoto,
        fullName,
        username,
        email,
        password,
    } = useDetailHook()

    const { change } = useParams()
    const [flag, setFlag] = useState("")

    const [inputValue, setInputValue] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const [changes, setChanges] = useState("")
    const [saving, setSaving] = useState(false)

    const [gotoVerifyEmail, setGotVerifyEmail] = useState(false)
    const [formDatas, setFormDatas] = useState("")

    useEffect(() => {
        if (change == "name") {
            setFlag("Name")
            setInputValue(fullName)
        }
        else if (change == "username") {
            setFlag("Username")
            setInputValue(username)
        }
        else if (change == "email") {
            setFlag("Email")
            setInputValue(email)
        }
        else if (change == "password") {
            setFlag("Password")
            setInputValue(password)
        }
        else {
            setFlag("profilepicture")
        }
    }, [])

    const handleSubmit = async (event) => {
        setSaving(true)
        event.preventDefault();
        const formData = new FormData(event.target)
        formData.append('userId', userId)
        console.log("event.target in change: ", event.target);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/image`, {
                method: 'PUT',
                body: formData
            });
            console.log("response: ", response);

            if (response.ok) {
                setSaving(false)
                setChanges("true")
                setTimeout(() => {
                    setChanges("")
                }, 3000)
                setNewPassword("")
                setConfirmPassword("")
                // Registration successful, handle response
                const data = await response.json();
                console.log('Updation successful: data', data);
                // Optionally, you can redirect the user to another page or show a success message here 
                if (change == "name") {
                    dispatch(login({ userId: userId, userProfilePhoto: userProfilePhoto, fullName: data.data, email: email, username: username, password: password }))
                }
                else if (change == "username") {
                    dispatch(login({ userId: userId, userProfilePhoto: userProfilePhoto, fullName: fullName, email: email, username: data.data, password: password }))
                }
                else if (change == "email") {
                    dispatch(login({ userId: userId, userProfilePhoto: userProfilePhoto, fullName: fullName, email: data.data, username: username, password: password }))
                }
                else if (change == "password") {
                    dispatch(login({ userId: userId, userProfilePhoto: userProfilePhoto, fullName: fullName, email: email, username: username, password: data.data[0] }))
                }
                else {
                    dispatch(login({ userId: userId, userProfilePhoto: data.data, fullName: fullName, email: email, username: username, password: password }))
                }
            } else {
                // Handle errors
                setSaving(false)
                setChanges("false")
                setTimeout(() => {
                    setChanges("")
                }, 3000)
                setNewPassword("")
                setConfirmPassword("")
                console.error('Updation failed:', response.statusText);
                // Optionally, you can show an error message to the user
            }
        }
        catch (error) {
            console.log("error in change while handlesubmit: ", error);
        }
    }

    const handleEmailChange = async (event) => {
        const formData = new FormData(event.target)
        // formData.append("email", inputValue)
        formData.append("userId", userId)
        setFormDatas(formData)
        setGotVerifyEmail(true)
    }

    return (
        <>{
            gotoVerifyEmail ? <VerifyEmail setChanges={setChanges} setGotVerifyEmail={setGotVerifyEmail} requesting={"tochangeemail"} formDatas={formDatas} email={inputValue} />
                :
                <div className=' bg-slate-800 h-screen'>

                    <Link to="/home/setting">
                        <TfiArrowLeft className='text-white font-medium text-3xl fixed top-3 left-3' />
                    </Link>

                    <Profile userProfilePhoto={userProfilePhoto} fullName={fullName} username={username} />

                    <div className='flex flex-col justify-center items-center mt-4'>

                        <div className='pt-4 pb-2 text-white text-2xl font-medium'>{flag}</div>
                        {
                            change == "password" &&
                            <PasswordForm handleSubmit={handleSubmit} flag={flag} changes={changes} saving={saving} newPassword={newPassword} setNewPassword={setNewPassword} ConfirmPassword={ConfirmPassword} setConfirmPassword={setConfirmPassword} />
                        }
                        {
                            change == "profilepicture" &&
                            <ProfilePictureForm handleSubmit={handleSubmit} flag={flag} saving={saving} changes={changes} />
                        }
                        {
                            change == "email" &&
                            <EmailForm handleEmailChange={handleEmailChange} setInputValue={setInputValue} inputValue={inputValue} flag={flag} saving={saving} changes={changes} />
                        }
                        {
                            (change == "username" || change == "name") &&
                            <NameForm handleSubmit={handleSubmit} setInputValue={setInputValue} inputValue={inputValue} flag={flag} changes={changes} saving={saving} />
                        }
                    </div>
                </div>
        }
        </>
    )
}

export default Change