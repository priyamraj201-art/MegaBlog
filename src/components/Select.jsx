import React, {useId} from 'react'

function Select({
    options,
    label,
    className,
    ...props
}, ref) {
    const id = useId()
  return (
    <div className='w-full'>
        {label && <label htmlFor={id} className='inline-block mb-1.5 pl-1 text-xs font-bold uppercase tracking-wider text-[#121212]'>{label}</label>}
        <select
        {...props}
        id={id}
        ref={ref}
        className={`px-4 py-3 rounded-xl bg-[#F5F1E6] text-[#121212] outline-none focus:bg-[#FAF7EE] focus:ring-2 focus:ring-[#121212] transition-all duration-200 border border-[#E0DCD0] w-full text-sm font-medium ${className}`}
        >
            {options?.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
  )
}

export default React.forwardRef(Select)