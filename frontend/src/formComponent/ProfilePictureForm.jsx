import React from 'react'

function ProfilePictureForm({handleSubmit, flag, saving, changes}) {
    return (
        <form className='flex flex-col justify-center items-center w-screen' encType='multipart/form-data' onSubmit={handleSubmit}>
            <label className='text-white rounded-md bg-slate-700 px-3 py-2 hover:cursor-pointer' htmlFor={flag.toLowerCase()}>Update Profile Picture</label><br />

            <input className='hidden' type="file" name="image" id={flag.toLowerCase()} />

            {
                changes == "true" &&
                <div className='text-green-600 text-xl'>
                    {flag} changed successfully
                </div>
            }

            <div className='flex justify-center items-center'>
                <button className='text-white bg-blue-500 rounded-2xl absolute bottom-4 w-10/12 sm:w-9/12 md:w-6/12 py-2' type="submit">{saving ? "Saving..." : "Save"}</button>
            </div>
        </form>
    )
}

export default ProfilePictureForm