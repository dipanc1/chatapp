import { FormControl, FormLabel } from '@chakra-ui/react'
import React from 'react'
import PhoneInput from 'react-phone-number-input'

const PhoneNumber = ({ number, setNumber }) => {

    return (
        <FormControl id="number" isRequired>
            <FormLabel>Phone Number</FormLabel>
            <PhoneInput
                international
                defaultCountry="IN"
                value={number}
                onChange={setNumber} />
        </FormControl>
    )
}

export default PhoneNumber