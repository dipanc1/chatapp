import React, { useContext } from 'react'
import { RoomContext } from '../context/RoomContext';

const NameInput = () => {
  const { username, setUsername } = useContext(RoomContext);


  return (
    <input style={{
      width:'228px',
      height:'28px',
      border:'1px solid black',
      outline:'none'

    }} type="text" placeholder='enter name' name="name" id="name" onChange={
      (e) => {
        setUsername(e.target.value);
      }
    } value=
    {username} />
  )
}

export default NameInput