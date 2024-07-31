import React from 'react'

function Profile({userProfilePhoto, fullName, username}) {
    return (
        <div className='flex flex-col justify-center items-center'>
            <img className='h-28 w-28 hover:cursor-pointer rounded-full mt-20' src={userProfilePhoto} alt="" />
            <div className='flex flex-col justify-center items-center'>
                <div className='text-white mt-2'>{fullName}</div>
                <div className='text-gray-300'>{username} . Photo Gallery</div>
            </div>
        </div>
    )
}

export default Profile