import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
  } from "@/components/ui/card"

// type OtpFormProps = {
// 	onClose: () => void;
// }

// type OtpFormValues = {
// 	otp1 : number,
// 	otp2 : number,
// 	otp3 : number,
// 	otp4 : number,
// 	otp5 : number,
// 	otp6 : number,
// }

import React, { useRef, KeyboardEvent } from 'react';


const OtpForm : React.FC<OtpFormProps> = () => {

  const inputRefs = Array.from({ length: 6 }, (_, index) => useRef<HTMLInputElement>(null)!);

  const focusNextInput = (currentIdx: number) => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < inputRefs.length && inputRefs[nextIdx].current) {
      inputRefs[nextIdx].current.focus();
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>, currentIdx: number) => {
    if (event.currentTarget.value.length === 0) {
      const prevIdx = currentIdx - 1;
      if (prevIdx >= 0 && inputRefs[prevIdx].current) {
        inputRefs[prevIdx].current.focus();
      }
    } else {
      focusNextInput(currentIdx);
    }
  };

  return (
    <div>
      <form className="max-w-sm mx-auto">
        <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Please introduce the 6-digit token provided by your authenticator app.
        </p>
        <div className="flex mb-2 space-x-2 rtl:space-x-reverse">
          {inputRefs.map((inputRef, index) => (
            <div key={index}>
              <label htmlFor={`code-${index + 1}`} className="sr-only"></label>
              <input
                type="text"
                maxLength={1}
                onKeyUp={(event) => handleKeyUp(event, index)}
                id={`code-${index + 1}`}
                ref={inputRef}
                className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

export default OtpForm;

