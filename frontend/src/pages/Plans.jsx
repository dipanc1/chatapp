import React from 'react'
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  Container,
  UnorderedList,
  ListItem,
  ListIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Switch
} from '@chakra-ui/react';
import { 
  BiCheck
} from 'react-icons/bi';

export default function plans() {
  const PlanFeatures = ['Integrated chat', 'Green screen', 'Virtual backgrounds', 'Analytics']
  const PlanDetails = [
    {
      "feature": "Channel",
      "data": ['2', '5', '9']
    },
    {
      "feature": "Users",
      "data": ['4', '2', '4']
    },
    {
      "feature": "Key Features",
      "data": ['','Social Media Streaming(like Facebook Pages and Groups)', 'Stream to guest channels']
    }
  ]

  return (
    <Box py={'111px'} bg={'backgroundColor'}>
      <Container maxW='950px'>
        <Heading fontSize={'22px'}>
            Choose the plan that’s right for you
        </Heading>
        
        <UnorderedList ms={'0'} fontWeight={'600'} color={'greyTextColor'}>
          {
            PlanFeatures.map((feature) => {
              return (
                <ListItem alignItems={'center'} display={'flex'} pt={'14px'}>
                  <ListIcon as={BiCheck}/>
                  {feature}
                </ListItem>
              );
            })
          }
        </UnorderedList>
        <Box>
          <Flex pe={'4'} py={'50px'} fontWeight={'600'} justifyContent={'end'} alignItems={'center'}>
            <Text color={'greyTextColor'}>
              Monthly
            </Text>
            <Switch px={'8px'} defaultChecked colorScheme={'twitter'} size='md' />
            <Text color={'#000'}>
              Annually
            </Text>
          </Flex>
          <TableContainer whiteSpace={'normal'}>
            <Table style={{'table-layout': 'fixed'}} variant="unstyled">
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>
                    <Box maxW={'190px'} mx={'auto'} color={'#fff'} py={'25px'} px={'12px'} textAlign={'center'} bg={'buttonPrimaryColor'}>
                      <Text textTransform={'initial'} fontSize={'16px'}>
                        Basic
                      </Text>
                      <Text pt={'14px'} fontSize={'13px'}>
                        Free
                      </Text>
                    </Box>
                  </Th>
                  <Th>
                    <Box maxW={'190px'} mx={'auto'} color={'#fff'} py={'25px'} px={'12px'} textAlign={'center'} bg={'buttonPrimaryColor'}>
                      <Text textTransform={'initial'} fontSize={'16px'}>
                        Premium
                      </Text>
                      <Text pt={'14px'} fontSize={'13px'}>
                        $114
                      </Text>
                    </Box>
                  </Th>
                  <Th>
                    <Box maxW={'190px'} mx={'auto'} color={'#fff'} py={'25px'} px={'12px'} textAlign={'center'} bg={'buttonPrimaryColor'}>
                      <Text textTransform={'initial'} fontSize={'16px'}>
                        Elite
                      </Text>
                      <Text pt={'14px'} fontSize={'13px'}>
                        $127
                      </Text>
                    </Box>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {
                  PlanDetails.map((Detail, index) => {
                    return (
                      <Tr borderBottom={'1px solid #DED6F9'}>
                        <Th color={'#000'} fontWeight={'bold'}>
                          {Detail.feature}
                        </Th>
                        {
                          Detail.data.map((DataItem) => {
                            return (
                              <Td textAlign={'center'} color={'greyTextColor'} fontWeight={'600'}>
                                {DataItem}
                              </Td>
                            );
                          })
                        }
                      </Tr>
                    );
                  })
                }
              </Tbody>
            </Table>
          </TableContainer>
          <Flex pe={'4'} pt={'100px'} fontWeight={'600'} justifyContent={'end'} alignItems={'center'}>
            <Button 
              px={'50px'} 
              size="lg"
              bg={'buttonPrimaryColor'}
              color={'white'}
              _hover={{
                  bg: 'backgroundColor',
                  color: 'text'
              }}>
              Start Using App
            </Button>
          </Flex>
        </Box>
      </Container>
    </Box>
  )
}
