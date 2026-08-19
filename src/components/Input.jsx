import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref){
    const id = useId()
    return (
        <div className='w-full'>
            {label && <label 
            className='inline-block mb-1.5 pl-1 text-xs font-bold uppercase tracking-wider text-[#121212]' 
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
            className={`px-4 py-3 rounded-xl bg-[#F5F1E6] text-[#121212] placeholder-[#999488] outline-none focus:bg-[#FAF7EE] focus:ring-2 focus:ring-[#121212] transition-all duration-200 border border-[#E0DCD0] w-full text-sm font-medium ${className}`}
            ref={ref}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input