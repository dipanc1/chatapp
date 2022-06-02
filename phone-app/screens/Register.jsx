import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native'
import PhoneInput from "react-native-phone-number-input";
import React, { useRef } from 'react'
import { PhoneAppContext } from '../context/PhoneAppContext';
import OTPTextView from 'react-native-otp-textinput';
import * as ImagePicker from 'expo-image-picker';
import { backend_url } from '../production'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Register = () => {

  const { dispatch } = React.useContext(PhoneAppContext);
  const [verify, setVerify] = React.useState(true);
  const [otp, setOtp] = React.useState(true);
  const [username, setUsername] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [formattedNumber, setFormattedNumber] = React.useState();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [show, setShow] = React.useState(false)
  const [pic, setPic] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const phoneInput = useRef(null);
  const number1 = React.useContext(PhoneAppContext)

  const cloudName = 'dipanc1';
  const apiUrlMobile = `${backend_url}/mobile`;
  const apiUrlOtp = `${backend_url}/otp`;
  const apiUrlRegister = `${backend_url}/users/register`;
  const pictureUpload = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;


  const handleVerify = () => {
    dispatch({ type: 'SET_NUMBER', payload: formattedNumber });
    if (number !== NaN) {
      setError(false);
      setVerify(false);
      axios.post(apiUrlMobile, { number: formattedNumber })
        .then(res => {
          console.log(res.data)
        })
        .catch(err => {
          console.log("ERROR:", err)
        })
    }
    else {
      setError(true)
      setErrorMessage("Please enter a valid phone number")
    }
  }

  const handleOtp = (OTP) => {
    console.log("OTP", OTP);
    if (OTP.length === 5) {
      setTimeout(() => {
        console.log("NumberJHFBJKFDSJ", { number1 });
        axios.post(apiUrlOtp, { OTP, number1 })
          .then((res) => {
            console.log(res)
            if (res.data.resp.valid) {
              setOtp(false)
            } else {
              setOtp(true);
              setError(true);
            }
          })
          .catch((err) => {
            console.log("ERROR:", err)
          })
      }, 1000);
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      // aspect: [4, 3],
      base64: true
    });
    setLoading(true)
    if (!result.cancelled) {
      setPic({ image: result.uri })

      let base64Img = `data:image/jpg;base64,${result.base64}`

      //Add your cloud name
      let apiUrl = pictureUpload;

      let data = {
        "file": base64Img,
        "upload_preset": "chat-app",
        'api_key': '835688546376544'
      }

      fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }).then(async r => {
        let data = await r.json()
        console.log(data.secure_url)
        setLoading(false)
        return data.secure_url
      }).catch(err => {
        console.log(err)
        setLoading(false)
      })
    }

  }

  const handleRegister = () => {
    if (password !== confirmPassword) {
      setError(true);
      setErrorMessage('Passwords do not match');
      return

    } else {
      const details = {
        username: username,
        number1: number1,
        password: password,
        pic: pic.image
      }
      axios.post(apiUrlRegister, details)
        .then(res => {
          console.log(res.data);
          // const jsonValue = JSON.stringify(res.data)
          // AsyncStorage.setItem('user', jsonValue)
        })
        .catch(err => {
          console.log(err);
          setError(true);
          setErrorMessage('Please enter valid details');
        })
    }
  }


  return (
    <View style={styles.register}>
      <View style={styles.registerBox}>
        <Text style={styles.registerHeading}>Register</Text>
        <View>
          {verify &&
            <>
              <Text style={styles.registerLabel}>Phone Number</Text>
              <PhoneInput
                ref={phoneInput}
                containerStyle={styles.registerInputPhone}
                defaultValue={number}
                defaultCode="IN"
                layout="second"
                onChangeText={(text) =>
                  dispatch({ type: 'SET_NUMBER', payload: text })}
                onChangeFormattedText={(text) => setFormattedNumber(text)}
                withDarkTheme
                withShadow
                autoFocus
                textInputStyle={{
                  color: '#232323',
                }}
                placeholder=' '
              />
            </>
          }
          {(!verify && otp) && <View style={styles.otpBox}>
            <OTPTextView
              handleTextChange={(OTP) => handleOtp(OTP)}
              containerStyle={styles.textInputContainer}
              textInputStyle={styles.roundedTextInput}
              inputCount={5}
              inputCellLength={1}
            />
            <TouchableOpacity style={styles.otpButton}>
              <Text style={styles.registerButtonText}>Resend</Text>
            </TouchableOpacity>
          </View>}
          {!otp &&
            <>
              <Text style={styles.registerLabel}>User Name</Text>
              <TextInput
                placeholder='Enter User Name'
                placeholderTextColor={'#000'}
                style={styles.registerInput}
                value={username}
                onChangeText={(text) => setUsername(text)}
              />

              <Text style={styles.registerLabel}>Password</Text>
              <TextInput
                placeholder='Enter Password'
                placeholderTextColor={'#000'}
                secureTextEntry={true}
                style={styles.registerInput}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />

              <Text style={styles.registerLabel}>Confirm Password</Text>
              <TextInput
                placeholder='Confirm Password'
                placeholderTextColor={'#000'}
                secureTextEntry={true}
                style={styles.registerInput}
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
              />

              <View style={styles.registerLabel}>
                <Button title="Upload Your Picture" onPress={() => pickImage()} />
              </View>
            </>
          }
        </View>
        {verify ? <TouchableOpacity onPress={handleVerify} style={styles.registerButtonVerify}>
          <Text style={styles.registerButtonText}>Verify Phone Number</Text>
        </TouchableOpacity> : null}

        {!otp && password === confirmPassword && username.length !== 0 && password.length >= 8 ? <TouchableOpacity onPress={handleRegister} style={styles.registerButtonVerify} disabled={loading ? true : false}>
          <Text style={styles.registerButtonText}>{loading ? "Loading..." : "Register"}</Text>
        </TouchableOpacity> : null}

        {error &&
          <Text className={styles.failure}>
            {errorMessage}
          </Text>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  register: {
    flex: 1,
    backgroundColor: '#B4CBFF',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  registerBox: {
    width: '70%',
    height: '82%',
    backgroundColor: '#F2F7FD',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerHeading: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  registerLabel: {
    fontSize: 15,
    marginBottom: 10,
    marginLeft: 10,
  },
  registerInputPhone: {
    width: 270,
    height: 80,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  registerInput: {
    width: 200,
    height: 40,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  registerButton: {
    width: '60%',
    height: 40,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#004CFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonVerify: {
    width: '60%',
    height: 40,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: '#004CFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  registerLinkBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newUserButton: {
    fontSize: 15,
    marginTop: 30,
    color: '#000',
  },
  newUserButtonLink: {
    fontSize: 15,
    marginTop: 30,
    marginLeft: 5,
    color: '#004CFB',
  },
  textInputContainer: {
    marginBottom: 20,
  },
  roundedTextInput: {
    borderRadius: 6,
    borderWidth: 3,
  },
  otpBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  otpButton: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#004CFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  failure: {
    color: '#FF0000',
    fontSize: 15,
    marginTop: 10,
  }
})

export default Register