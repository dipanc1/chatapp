import { Box, FormControl, FormLabel } from '@chakra-ui/react'
import React from 'react'
import PhoneInput from 'react-phone-number-input'

const PhoneNumber = ({ number, setNumber }) => {

    return (
        <FormControl id="number" isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Box 
                border='1px solid #E2E8F0'
                p='6px 10px'
                borderRadius={'4px'}
            >
                <PhoneInput
                    international
                    defaultCountry="IN"
                    value={number}
                    onChange={setNumber} 
                />
            </Box>
        </FormControl>
    )
}

export default PhoneNumber