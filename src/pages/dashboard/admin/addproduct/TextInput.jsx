import React from 'react'

const TextInput = ({label, name, placeholder, value, type, onChange}) => {
  return (
    <div>
        <label htmlFor={name} className='block text-sm font-medium text-gray-600'>{label}</label>
        <input 
        type={type} 
        name={name} 
        id={name} 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className='add-product-InputCSS border border-gray700 rounded-lg p-2 pr-25'
        />
    </div>
  )
}

export default TextInput