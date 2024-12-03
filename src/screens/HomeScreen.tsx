import React, {useEffect, useState, useRef} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import CoffeeCard from '../components/CoffeeCard';
import { BASEURL } from '../../globalConfig';

interface CoffeeItem {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  price: number;
  type: string;
  description?: string;
}

const HomeScreen = ({navigation}: any) => {
  const [coffeeList, setCoffeeList] = useState<CoffeeItem[]>([]);
  const [filteredCoffee, setFilteredCoffee] = useState<CoffeeItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const ListRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  const addToCart = useStore((state: any) => state.addToCart);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);

  useEffect(() => {
    fetchCoffeeData();
  }, []);

  const fetchCoffeeData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `${BASEURL}/app/product/getallproductlist?search=${searchText}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();
      if (data.success) {
        setCoffeeList(data.products);
        setFilteredCoffee(data.products);
      } else {
        setCoffeeList([]);
        setFilteredCoffee([]);
      }
    } catch (error) {
      console.error('Error fetching coffee data:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const searchCoffee = (text: string) => {
    if (text.trim() === '') {
      setFilteredCoffee(coffeeList);
    } else {
      const filtered = coffeeList.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredCoffee(filtered);
    }
  };

  const resetSearchCoffee = () => {
    setSearchText('');
    setFilteredCoffee(coffeeList);
  };

  const CoffeCardAddToCart = ({id, title, subtitle, image, price}: any) => {
    addToCart({
      id,
      title,
      subtitle,
      image,
      price,
    });
    calculateCartPrice();
    ToastAndroid.showWithGravity(
      `${title} is Added to Cart`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        {/* App Header */}
        <HeaderBar />

        <Text style={styles.ScreenTitle}>
          Find the best{'\n'}coffee for you
        </Text>

        {/* Search Input */}
        <View style={styles.InputContainerComponent}>
          <TouchableOpacity onPress={fetchCoffeeData}>
            <CustomIcon
              style={styles.InputIcon}
              name="search"
              size={FONTSIZE.size_18}
              color={
                searchText.length > 0
                  ? COLORS.primaryOrangeHex
                  : COLORS.primaryLightGreyHex
              }
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Find Your Coffee..."
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              searchCoffee(text);
            }}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
          {searchText.length > 0 ? (
            <TouchableOpacity onPress={resetSearchCoffee}>
              <CustomIcon
                style={styles.InputIcon}
                name="close"
                size={FONTSIZE.size_16}
                color={COLORS.primaryLightGreyHex}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Coffee Flatlist */}
        {loading ? ( // Conditional rendering for loading state
          <ActivityIndicator
            style={styles.LoadingIndicator}
            size="large"
            color={COLORS.primaryOrangeHex}
          />
        ) : (
          <FlatList
            ref={ListRef}
            horizontal
            ListEmptyComponent={
              <View style={styles.EmptyListContainer}>
                <Text style={styles.CategoryText}>No Coffee Available</Text>
              </View>
            }
            showsHorizontalScrollIndicator={false}
            data={filteredCoffee}
            contentContainerStyle={styles.FlatListContainer}
            keyExtractor={item => item._id}
            renderItem={({item}) => {
              console.log(`${'http://192.168.1.5:8080/media/'}${item.image}`);
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('Details', {itemId: item._id});
                  }}>
                  <CoffeeCard
                    id={item._id}
                    title={item.title}
                    subtitle={item.subtitle}
                    image={`${'http://192.168.1.5:8080/media/'}${item.image}`}
                    price={item.price}
                    buttonPressHandler={CoffeCardAddToCart}
                  />
                </TouchableOpacity>
              );
            }}
          />
        )}
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
  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  LoadingIndicator: {
    marginTop: SPACING.space_20,
    alignSelf: 'center',
  },
});

export default HomeScreen;
