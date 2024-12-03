import React, {useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import {useStore} from '../store/store';
import { BASEURL } from '../../globalConfig';

const RegisterScreen = ({navigation}: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setUserDetails = useStore((state: any) => state.setUserDetails);

  const registerUser = async () => {
    if (!name || !email || !password || !confirmPassword) {
      ToastAndroid.showWithGravity(
        'All fields are required',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    if (password !== confirmPassword) {
      ToastAndroid.showWithGravity(
        'Passwords do not match',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    setIsLoading(true);

    try {
      // Send registration request
      const response = await fetch(`${BASEURL}/app/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          emailId: email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUserDetails(data['userDetails']); // Store user details in the global state

        ToastAndroid.showWithGravity(
          'Registration Successful!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        // After successful registration, navigate back to login
        navigation.replace('Tab');
      } else {
        ToastAndroid.showWithGravity(
          data.message || 'Registration failed',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      console.error('Error during registration:', error);
      ToastAndroid.showWithGravity(
        'Something went wrong',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        {/* App Header */}
        {/* <HeaderBar /> */}

        <Text style={styles.ScreenTitle}>Create Account</Text>

        {/* Name Input */}
        <View style={styles.InputContainerComponent}>
          <CustomIcon
            style={styles.InputIcon}
            name="person"
            size={FONTSIZE.size_18}
            color={COLORS.primaryLightGreyHex}
          />
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={text => setName(text)}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
        </View>

        {/* Email Input */}
        <View style={styles.InputContainerComponent}>
          <CustomIcon
            style={styles.InputIcon}
            name="mail"
            size={FONTSIZE.size_18}
            color={COLORS.primaryLightGreyHex}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
        </View>

        {/* Password Input */}
        <View style={styles.InputContainerComponent}>
          <CustomIcon
            style={styles.InputIcon}
            name="lock"
            size={FONTSIZE.size_18}
            color={COLORS.primaryLightGreyHex}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.InputContainerComponent}>
          <CustomIcon
            style={styles.InputIcon}
            name="lock"
            size={FONTSIZE.size_18}
            color={COLORS.primaryLightGreyHex}
          />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
            secureTextEntry={true}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
        </View>
        {/* Register Button */}
        <TouchableOpacity
          onPress={registerUser}
          style={styles.RegisterButton}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={COLORS.primaryWhiteHex} />
          ) : (
            <Text style={styles.RegisterButtonText}>Register</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.LoginContainer}>
          <Text style={styles.LoginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.LoginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30,
    marginTop: 50,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    margin: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  RegisterButton: {
    backgroundColor: COLORS.primaryOrangeHex,
    borderRadius: BORDERRADIUS.radius_20,
    paddingVertical: SPACING.space_15,
    marginHorizontal: SPACING.space_30,
    marginTop: SPACING.space_20,
    alignItems: 'center',
  },
  RegisterButtonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
  LoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.space_30,
  },
  LoginText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryLightGreyHex,
  },
  LoginLink: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryOrangeHex,
  },
});

export default RegisterScreen;
