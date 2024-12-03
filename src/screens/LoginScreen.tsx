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
import {useStore} from '../store/store';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import { BASEURL } from '../../globalConfig';

const LoginScreen = ({setIsLoggedIn, navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const setUserDetails = useStore((state: any) => state.setUserDetails);

  const loginUser = async () => {
    if (!email || !password) {
      ToastAndroid.showWithGravity(
        'Please fill in both fields',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${BASEURL}/app/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({emailId: email, password}),
      });

      const result = await response.json();

      if (response.ok) {
        setUserDetails(result['userDetails']); // Store user details in the global state
        ToastAndroid.showWithGravity(
          'Login Successful!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        navigation.replace('Tab'); // Navigate to the Home screen
      } else {
        ToastAndroid.showWithGravity(
          result.message || 'Login failed. Please try again.',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.showWithGravity(
        'An error occurred. Please try again later.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // // Mock login function
  // const loginUser = () => {
  //   if (email === '' || password === '') {
  //     ToastAndroid.showWithGravity(
  //       'Please fill in both fields',
  //       ToastAndroid.SHORT,
  //       ToastAndroid.CENTER,
  //     );
  //   } else {
  //     ToastAndroid.showWithGravity(
  //       'Login Successful!',
  //       ToastAndroid.SHORT,
  //       ToastAndroid.CENTER,
  //     );
  //     // Navigate to the Home screen after successful login (or other action)
  //     navigation.replace('Home');
  //   }
  // };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        {/* App Header */}
        {/* <HeaderBar /> */}

        <Text style={styles.ScreenTitle}>Welcome Back</Text>

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

        {/* Login Button */}
        <TouchableOpacity
          onPress={loginUser}
          style={styles.LoginButton}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={COLORS.primaryWhiteHex} />
          ) : (
            <Text style={styles.LoginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.RegisterContainer}>
          <Text style={styles.RegisterText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.RegisterLink}>Register</Text>
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
  LoginButton: {
    backgroundColor: COLORS.primaryOrangeHex,
    borderRadius: BORDERRADIUS.radius_20,
    paddingVertical: SPACING.space_15,
    marginHorizontal: SPACING.space_30,
    marginTop: SPACING.space_20,
    alignItems: 'center',
  },
  LoginButtonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
  RegisterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.space_30,
  },
  RegisterText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryLightGreyHex,
  },
  RegisterLink: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryOrangeHex,
  },
});

export default LoginScreen;
