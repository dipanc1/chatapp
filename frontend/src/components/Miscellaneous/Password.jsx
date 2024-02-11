import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
} from '@chakra-ui/react';
import { AiOutlineLock } from 'react-icons/ai';
import React from 'react';

const Password = ({
    password,
    confirmPassword,
    handleConfirmPassword,
    handlePassword,
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <InputLeftElement
                        pointerEvents='none'
                        children={<AiOutlineLock color='greyTextColor' />}
                    />

                    <Input
                        focusBorderColor='#9F85F7'
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        name='password'
                        placeholder='Enter Password'
                        value={password}
                        minLength={8}
                        onChange={handlePassword}
                    />
                    <InputRightElement h={'full'}>
                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                setShowPassword((showPassword) => !showPassword)
                            }
                        >
                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='confirmpassword' isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <InputLeftElement
                        pointerEvents='none'
                        children={<AiOutlineLock color='greyTextColor' />}
                    />
                    <Input
                        focusBorderColor='#9F85F7'
                        type={showPassword ? 'text' : 'password'}
                        id='confirmpassword'
                        name='confirmpassword'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={handleConfirmPassword}
                    />
                    <InputRightElement h={'full'}>
                        <Button
                            variant={'ghost'}
                            onClick={() =>
                                setShowPassword((showPassword) => !showPassword)
                            }
                        >
                            {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
        </>
    );
};

export default Password;
