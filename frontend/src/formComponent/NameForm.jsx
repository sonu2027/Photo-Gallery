import React from 'react'

function NameForm({handleSubmit, setInputValue, inputValue, flag, changes, saving}) {
    return (
        <form className='flex flex-col justify-center items-center w-screen' encType='multipart/form-data' onSubmit={handleSubmit}>
            <input onChange={(e) => setInputValue(e.target.value)} value={inputValue} className='w-10/12 mb-4 rounded-md text-white bg-slate-700 caret-white focus:outline-none p-2 sm:w-9/12 md:w-6/12' type="text" name={flag == "Name" ? "fullName" : flag.toLowerCase()} id={flag == "Name" ? "fullName" : flag.toLowerCase()} placeholder={`Enter new ${flag.toLowerCase()}`} />

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

export default NameForm