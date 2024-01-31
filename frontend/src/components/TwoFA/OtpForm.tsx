import { Input } from "@/components/ui/input"
import React from 'react';
import OtpInput from "./OtpInput";
import { Button } from "../ui/button";

type OtpFormProps = {
  value: string,
  onChange: (value: string) => void,
	onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
  onClose: () => void,
  isTokenValid: string,
}


const OtpForm : React.FC<OtpFormProps> = ({value, onChange, onSubmit, onClose, isTokenValid}) => {
  return (
    <form className="max-w-sm mx-auto" onSubmit={onSubmit}>
      <div className="flex flex-col items-center gap-y-4">
        <div>
          <p id="helper-text-explanation" className="text-center text-sm text-gray-500 dark:text-gray-400">
            Please introduce the 6-digit token provided by your authenticator app.
          </p>
        </div>
        <div className="flex flex-col gap-y-2">
          <div>
            <OtpInput value={value} valueLength={6} onChange={onChange}></OtpInput>
          </div>
            {isTokenValid.length < 1 ? null : <div>
              <p className="text-xs text-red-600 text-center">{isTokenValid}</p>
          </div>}
        </div>
        <div className="w-full flex justify-between">
          <div>
            <Button variant={"outlineBlue"} type="button" onClick={onClose}>Cancel</Button>
          </div>
          <div>
            <Button type="submit">Validate</Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default OtpForm;

