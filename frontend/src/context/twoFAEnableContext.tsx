import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

export type TwoFAContextType = {
  twoFAenabled : boolean,
  enableTwoFA : () => void,
  disableTwoFA : () => void,
  twoFAverified: boolean, 
  setTwoFAVerified: () => void, 
  unsetTwoFAVerified: () => void,
}

export const TwoFAContext = createContext<TwoFAContextType>({
  twoFAenabled: false, 
  enableTwoFA: () => {}, 
  disableTwoFA: () => {},
  twoFAverified: false, 
  setTwoFAVerified: () => {}, 
  unsetTwoFAVerified: () => {},
});


export const TwoFAProvider: React.FC = () => {
  const [twoFAenabled, setTwoFAenabled] = useState<boolean>(false);
  const [twoFAverified, setTwoFAverified] = useState<boolean>(false);

  useEffect(() => {
    const getTwoFA = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/otp/twoFAState`,
        {withCredentials: true}
      )
  
      setTwoFAenabled(response.data.twoFAEnabled);
      setTwoFAverified(response.data.twoFAVerified);
    }

    getTwoFA();
  }, []);

  const enableTwoFA = () => {
    setTwoFAenabled(true);
  }

  const disableTwoFA = () => {
    setTwoFAenabled(false);
  }

  const setTwoFAVerified = () => {
    setTwoFAverified(true);
  }

  const unsetTwoFAVerified = () => {
    setTwoFAverified(false);
  }

  return (
    <TwoFAContext.Provider value={{
      twoFAenabled,
      enableTwoFA,
      disableTwoFA,
      twoFAverified,
      setTwoFAVerified,
      unsetTwoFAVerified,
    }}>
      <Outlet />
    </TwoFAContext.Provider>
  );
};