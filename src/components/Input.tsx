interface InputProps { 
    placeholder: string; 
    reference?: React.Ref<HTMLInputElement>;
    type?: string;
    className?: string;
}

export function Input({placeholder, reference, type = "text", className = ""}: InputProps) {
    const baseClasses = "px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent m-1";
    const combinedClasses = `${baseClasses} ${className}`.trim();
    
    return <div className="w-full">
        <input 
            ref={reference} 
            placeholder={placeholder} 
            type={type}
            className={combinedClasses}
        />
    </div>
}

