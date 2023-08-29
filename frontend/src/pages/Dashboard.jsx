import React from 'react'
import Static from '../components/common/Static'
import { Flex, Heading } from '@chakra-ui/react'
import axios from 'axios'
import { backend_url } from '../baseApi'
// import Highcharts from 'highcharts'
// import HighchartsReact from 'highcharts-react-official'

const options = {
  title: {
    text: 'My chart'
  },
  series: [{
    //   data: [1, 2, 3]
    data: [['28', 5], ['29', 7], ['30', 15]]
  }]
}

const Dashboard = () => {
  const [userData, setUserData] = React.useState()
  const [pageState, setPageState] = React.useState({ "page": 1, isLoading: true })
  const user = JSON.parse(localStorage.getItem("user"));

  React.useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const fetchUsers = async () => {
    try {
      pageState["isLoading"] = true;
      setPageState(pageState)
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
      const { data } = await axios.get(`${backend_url}/users/list?page=${pageState.page}`, config);
      pageState["page"] = data?.page;
      pageState["pages"] = data?.pages;
      pageState["total"] = data?.total;
      pageState["isLoading"] = false;
      setUserData(data)
      setPageState(pageState)
      // console.log(data, "<---")
    } catch (error) {
    }
  }

  return (
    <Static>
      <Heading as='h1' size='lg' fontWeight='500'>Dashboard</Heading>
      <Flex></Flex>
      {/* <HighchartsReact
        highcharts={Highcharts}
        options={options}
      /> */}
    </Static>
  )
}

export default Dashboard