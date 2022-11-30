import React from 'react'
// import styled from 'styled-components'



export const Input = ({label="Input", isRequired=false, type, placeholder, id, name, onChange, errorMessage, ...rest }) => {
  return (
    <label {...rest} className='text-sm flex flex-col mb-6'>
    <div className='flex items-baseline'><p className='text-gray-500 font-bold'>{label}</p> {
        
        isRequired && <p className='text-red-500'>*</p> 
    } 
    <p className='pl-2 text-xs text-red-600'>{errorMessage}</p>
    <p></p>
        </div>
    <input type={type} id={id} name={name} placeholder={placeholder} onChange={onChange} className='border rounded p-2 border-sky-700 h-12 focus-within:outline-sky-400  mt-1' />
    </label>
  )
}


