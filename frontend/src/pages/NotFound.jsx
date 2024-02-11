import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <Box textAlign='center' py={'56'}>
            <Heading
                display='inline-block'
                as='h2'
                size='2xl'
                bg={'buttonPrimaryColor'}
                color={'white'}
                backgroundClip='text'
            >
                404
            </Heading>
            <Text fontSize='18px' mt={3} mb={2}>
                Page Not Found
            </Text>
            <Text color={'gray.500'} mb={6}>
                The page you're looking for does not seem to exist
            </Text>

            <Button
                bg={'buttonPrimaryColor'}
                color={'white'}
                _hover={{
                    bg: 'backgroundColor',
                    color: 'text',
                }}
                variant='solid'
            >
                <Link to='/'>Go to Home</Link>
            </Button>
        </Box>
    );
}
