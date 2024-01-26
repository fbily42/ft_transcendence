import { Input } from "@/components/ui/input"
import React from 'react';
import OtpInput from "./OtpInput";

type OtpFormProps = {
  value: string,
  onChange: (value: string) => void,
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
}


const OtpForm : React.FC<OtpFormProps> = ({value, onChange, onSubmit}) => {
  return (
    <div>
      <form className="max-w-sm mx-auto" onSubmit={onSubmit}>
        <p id="helper-text-explanation" className="mt-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
          Please introduce the 6-digit token provided by your authenticator app.
        </p>
        <OtpInput value={value} valueLength={6} onChange={onChange}></OtpInput>
        <Input type="submit" value="Validate"></Input>
      </form>
    </div>
  );
}

export default OtpForm;

