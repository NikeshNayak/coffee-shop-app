import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { COLORS, SPACING } from '../theme/theme';
import { useStore } from '../store/store';

const ProfilePic = () => {
  const userDetails = useStore((state: any) => state.userDetails);
  const firstLetter = userDetails?.name ? userDetails.name.charAt(0).toUpperCase() : '';

  return (
    <View style={styles.ImageContainer}>
      {firstLetter ? (
        <Text style={styles.Text}>{firstLetter}</Text> // Show first character
      ) : (
        <Image
          source={require('../assets/app_images/avatar.png')}
          style={styles.Image} // Fallback to image if name is not available
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ImageContainer: {
    height: SPACING.space_36,
    width: SPACING.space_36,
    borderRadius: SPACING.space_18, // Make it a circle
    borderWidth: 2,
    borderColor: COLORS.secondaryDarkGreyHex,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: COLORS.primaryGreyHex, // Set background color for text circle
  },
  Image: {
    height: SPACING.space_36,
    width: SPACING.space_36,
  },
  Text: {
    fontSize: SPACING.space_18, // Font size for the letter
    fontWeight: 'bold',
    color: COLORS.primaryWhiteHex, // Text color
  },
});

export default ProfilePic;
