import { Input } from "@/components/ui/input"
import React from 'react';
import OtpInput from "./OtpInput";
import { Button } from "../ui/button";

type OtpFormProps = {
  value: string,
  onChange: (value: string) => void,
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  isTokenValid: boolean,
}


const OtpForm : React.FC<OtpFormProps> = ({value, onChange, onSubmit, isTokenValid}) => {
  return (
    <form className="max-w-sm mx-auto" onSubmit={onSubmit}>
      <div className="grid gap-y-4">
        <div>
          <p id="helper-text-explanation" className="text-sm text-gray-500 dark:text-gray-400">
            Please introduce the 6-digit token provided by your authenticator app.
          </p>
        </div>
        <div className="grid gap-y-2">
          <div>
            <OtpInput value={value} valueLength={6} onChange={onChange}></OtpInput>
          </div>
            {isTokenValid ? null : <div>
              <p className="text-xs text-red-600 text-center">Token is not valid</p>
          </div>}
        </div>
        <div>
          <Button className="text-center" type="submit">Validate</Button>
        </div>
      </div>
    </form>
  );
}

export default OtpForm;

