import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, ImageBackground, TouchableOpacity, TouchableHighlight, Pressable } from 'react-native';
import { Container, Row, Col } from "react-native-flex-grid";
import { PageSlider } from '@pietile-native-kit/page-slider';
import styles from '../styles/styles'
import { textStyles } from '../styles/style-constants';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors } from '../styles/style-constants'
import { URL } from '../reusables/Constants';

const MAPS_KEY = "AIzaSyAxr6uGD0CCuomLoT8JM3VtZM9uBFV6CvU"

function Home({ navigation, route }) {
    const [selectedPage, setSelectedPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [places, setPlaces] = useState([]);


    useEffect(() => {
        if (latitude !== 0 && longitude !== 0) {
            fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=100000&type=liquor_store&key=${MAPS_KEY}`)
                .then(response => response.json())
                .then(data => {
                    setPlaces(data.results);
                })
                .catch(error => {
                    console.error('Error fetching nearby places:', error);
                });
        }
    }, [latitude, longitude]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setIsLoading(false);
                console.log("Geolocation failed.");
                return;
            }

            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest });
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
            setIsLoading(false);
        })();
    }, [])

    const [font] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat/static/Montserrat-Regular.ttf'),
        MontserratBold: require('../assets/fonts/Montserrat/static/Montserrat-SemiBold.ttf'),
        Raleway: require('../assets/fonts/Raleway/static/Raleway-SemiBold.ttf'),
        RalewayReg: require('../assets/fonts/Raleway/static/Raleway-Regular.ttf')
    })

    if (!font) {
        return null;
    }

    const Card = ({ backgroundColor, title, text, img, onPress }) => (
        <TouchableOpacity onPress={onPress}>
            <Col style={[styles.cardCol, { backgroundColor: backgroundColor }]}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardText}>{text}</Text>
                <Image source={img} style={styles.cardImg} />
            </Col>
        </TouchableOpacity>
    );

    const cardData = [
        {
            backgroundColor: colors.yellow,
            title: 'Surprise me!',
            text: 'Discover something\n new and exciting',
            img: require('../assets/images/Carousel-cocktails-1.png'),
            onPress: () => navigation.navigate('CocktailsNavigator', { screen: 'Recipe', params: { id: '', condition: 'c', search: 'random.php', navigator: 'HomeNavigator', screen:'Home' } })
        },
        {
            backgroundColor: colors.brown,
            title: 'Coffee & Tea',
            text: 'Brewed or steeped?\n',
            img: require('../assets/images/CoffeeTea-category.png'),
            onPress: () => navigation.navigate('CocktailsNavigator', { screen: 'Cocktails', params: { id: 6, condition: 'c', search: 'Coffee / Tea' } })
        },
        {
            backgroundColor: colors.green,
            title: 'Alcohol free',
            text: 'Grant your liver a\n well-deserved break',
            img: require('../assets/images/Alcoholfree-category.png'),
            onPress: () => navigation.navigate('CocktailsNavigator', { screen: 'Cocktails', params: { id: 1, condition: 'a', search: 'Non Alcoholic' } })
        },
        {
            backgroundColor: colors.purple,
            title: 'Alcoholic drinks',
            text: "It's Happy Hour\n somewhere",
            img: require('../assets/images/Alcoholic.png'),
            onPress: () => navigation.navigate('CocktailsNavigator', { screen: 'Cocktails', params: { id: 0, condition: 'a', search: 'Alcoholic' } })
        },
    ];


    if (isLoading) {
        return <View style={styles.container}>
            <Text>Retrieving location...</Text>
        </View>
    } else
        return (
            <ScrollView>

                <View style={styles.container}>
                    <StatusBar style='auto' hidden={false} />

                    <ImageBackground source={require('../assets/images/Carousel-background.png')}
                        resizeMode='contain'
                        opacity={0.5}
                        blurRadius={30}>

                        <View style={{ marginBottom: 80, marginTop: 10 }}>
                            <Image source={require('../assets/logos/pockettini-logo-regular-256px-black.png')}
                                style={styles.logo} />
                        </View>

                        <View>
                            <PageSlider
                                style={styles.pageSlider}
                                selectedPage={1}
                                onSelectedPageChange={setSelectedPage}
                                mode='card'
                                peek={50}
                                pageMargin={-10}
                                onCurrentPageChange={setCurrentPage}>

                                <TouchableOpacity
                                    style={styles.page}
                                    onPress={() => navigation.navigate('CocktailsNavigator', { screen: 'Cocktails', params: { id: '', condition: 'devs', search: '' } })}>
                                    <Image style={styles.carouselImage} source={require('../assets/images/Carousel-cocktails-1.png')} />
                                    <Text style={textStyles.H1}>Devs' Favourites</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.page}
                                    onPress={() => navigation.navigate('CocktailsNavigator', { screen: 'Cocktails', params: { id: '', condition: 'popular', search: 'popular.php' } })}>
                                    <Image style={styles.carouselImage} source={require('../assets/images/Carousel-cocktails-2.png')} />
                                    <Text style={textStyles.H1}>Most Popular</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.page}
                                    onPress={() => navigation.navigate('CocktailsNavigator', { screen: 'Cocktails', params: { id: '', condition: 'latest', search: 'latest.php' } })}>
                                    <Image style={styles.carouselImage} source={require('../assets/images/Carousel-cocktails-3.png')} />
                                    <Text style={textStyles.H1}>Latest Recipes</Text>
                                </TouchableOpacity>

                            </PageSlider>
                        </View>

                    </ImageBackground>

                    <View style={{ marginBottom: 40, marginLeft: 20 }}>
                        <Text style={textStyles.H1Upper}>Discover</Text>
                    </View>

                    <View style={{ marginHorizontal: 20, gap: 10 }}>
                        <Row style={{ gap: 10 }}>

                            <Col style={{ paddingHorizontal: 0 }}>
                                <Card {...cardData[0]} />
                            </Col>

                            <Col style={{ paddingHorizontal: 0 }}>
                                <Card {...cardData[1]} />
                            </Col>
                        </Row>

                        <Row style={{ gap: 10 }}>

                            <Col style={{ paddingHorizontal: 0 }}>
                                <Card {...cardData[2]} />
                            </Col>

                            <Col style={{ paddingHorizontal: 0 }}>
                                <Card {...cardData[3]} />
                            </Col>

                        </Row>
                    </View>
                </View>

                <View style={{ marginTop: 50, marginBottom: 250 }}>
                    <View style={styles.mapView}>
                        <Image style={styles.alko} source={require('../assets/logos/small_Alko_logo.png')} />
                        <Text style={textStyles.H1Upper}>near me</Text>
                    </View>


                    <MapView style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: 0.03,
                            longitudeDelta: 0.03,
                        }}>

                        {places.map(place => (
                            <Marker
                                key={place.place_id}
                                title={place.name}
                                description={place.vicinity}
                                coordinate={{
                                    latitude: place.geometry.location.lat,
                                    longitude: place.geometry.location.lng
                                }}
                            />
                        ))}

                        <Marker
                            title='Me'
                            pinColor='green'

                            coordinate={{
                                latitude: latitude,
                                longitude: longitude
                            }}
                        />

                    </MapView>

                </View>

            </ScrollView >

        );
}

export default Home;