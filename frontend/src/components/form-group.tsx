import React, { ChangeEvent, InputHTMLAttributes } from 'react';

// Define TypeScript types for props
interface StudentFormProps extends InputHTMLAttributes<HTMLInputElement> {
  labelname: string;
  inputvalue: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<StudentFormProps> = ({
  labelname,
  inputvalue,
  handleChange,
  ...rest 
}) => {
  return (
    <div className="form-group">
      <label htmlFor={labelname}>
        {labelname} <span className="required-dot"></span>
      </label>
      <input
        type="text"
        id={labelname}
        name={labelname}
        value={inputvalue}
        onChange={handleChange}
        required
        {...rest} // Spread other props like placeholder, etc.
      />
    </div>
  );
};

export default InputField;
