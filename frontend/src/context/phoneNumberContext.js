import { createContext, useReducer } from "react";
import PhoneNumberReducer from "./phoneNumberReducer";

const INITIAL_STATE = {
  number: "",
};

export const PhoneNumberContext = createContext(INITIAL_STATE);

export const PhoneNumberContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PhoneNumberReducer, INITIAL_STATE);

  return (
    <PhoneNumberContext.Provider value={{ number: state.number, dispatch }}>
      {children}
    </PhoneNumberContext.Provider>
  );
};