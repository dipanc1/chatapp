import { FormControl, PinInput, PinInputField } from '@chakra-ui/react';
import React from 'react';

const Otp = ({ OTP, handleOtp }) => {
    return (
        <FormControl>
            <PinInput
                focusBorderColor='#9F85F7'
                onChange={handleOtp}
                value={OTP}
                otp
            >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
            </PinInput>
        </FormControl>
    );
};

export default Otp;
