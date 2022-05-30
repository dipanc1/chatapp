import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button } from 'react-native'
import PhoneInput from "react-native-phone-number-input";
import React, { useRef } from 'react'
import { PhoneAppContext } from '../context/PhoneAppContext';
import OTPTextView from 'react-native-otp-textinput';
import * as ImagePicker from 'expo-image-picker';
import { backend_url } from '../production'
import axios from 'axios';


const Register = () => {

  const { dispatch, number } = React.useContext(PhoneAppContext);
  const [verify, setVerify] = React.useState(false);
  const [otp, setOtp] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [formattedNumber, setFormattedNumber] = React.useState();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')
  const [show, setShow] = React.useState(false)
  const [pic, setPic] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const phoneInput = useRef(null);

  const cloudName = 'dipanc1';
  const apiUrlMobile = `${backend_url}/mobile`;
  const apiUrlOtp = `${backend_url}/otp`;
  const apiUrlRegister = `${backend_url}/users/register`;
  const pictureUpload = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
  };



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
        console.log("NumberJHFBJKFDSJ", {number1: number});
        axios.post(apiUrlOtp, { OTP, number1: number })
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

  const handleRegister = () => {}


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
              />

              <Text style={styles.registerLabel}>Password</Text>
              <TextInput
                placeholder='Enter Password'
                placeholderTextColor={'#000'}
                secureTextEntry={true}
                style={styles.registerInput}
              />

              <Text style={styles.registerLabel}>Confirm Password</Text>
              <TextInput
                placeholder='Confirm Password'
                placeholderTextColor={'#000'}
                secureTextEntry={true}
                style={styles.registerInput}
                
              />

              <View style={styles.registerLabel}>
                <Button title="Upload Your Picture" onPress={pickImage} />
              </View>
            </>
          }
        </View>
        {verify ? <TouchableOpacity onPress={handleVerify} style={styles.registerButtonVerify}>
          <Text style={styles.registerButtonText}>Verify Phone Number</Text>
        </TouchableOpacity> : null}
        {!otp ? <TouchableOpacity onPress={handleRegister} style={styles.registerButtonVerify}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity> : null}

        {error &&
          <Text className={styles.failure}>
            {errorMessage}
          </Text>
        }
        <View style={styles.registerLinkBox}>
          <Text style={styles.newUserButton}>Already Have an Account?</Text>
          <TouchableOpacity>
            <Text style={styles.newUserButtonLink}>Login</Text>
          </TouchableOpacity>
        </View>
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