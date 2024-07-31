import React from 'react'

function PasswordForm({ handleSubmit, flag, changes, saving, newPassword, setNewPassword, ConfirmPassword, setConfirmPassword }) {
    return (
        <form className='flex flex-col justify-center items-center w-screen' encType='multipart/form-data' onSubmit={handleSubmit}>

            <input className='w-10/12 mb-4 rounded-md text-white bg-slate-700 caret-white focus:outline-none p-2 sm:w-9/12 md:w-6/12' onChange={(e) => setNewPassword(e.target.value)} value={newPassword} type="password" name="password" id="newPassword" placeholder='Enter new password' />

            <input className='w-10/12 mb-4 rounded-md text-white bg-slate-700 caret-white focus:outline-none p-2 sm:w-9/12 md:w-6/12' onChange={(e) => setConfirmPassword(e.target.value)} value={ConfirmPassword} type="password" name="password" id="confirmPassword" placeholder='Confirm Password' />

            {
                changes == "true" &&
                <div className='text-green-600 text-xl'>
                    {flag} changed successfully
                </div>
            }

            {
                changes == "false" &&
                <div className='text-red-600 text-xl'>
                    {flag} doesn't match
                </div>
            }

            <div className='flex justify-center items-center'>
                <button className='text-white bg-blue-500 rounded-2xl absolute bottom-4 w-10/12 sm:w-9/12 md:w-6/12 py-2' type="submit">{saving ? "Saving..." : "Save"}</button>
            </div>

        </form>
    )
}

export default PasswordForm