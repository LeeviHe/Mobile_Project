import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, ImageBackground } from 'react-native';
import { Container, Row, Col } from "react-native-flex-grid";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PageSlider } from '@pietile-native-kit/page-slider';
import styles from '../styles/styles'
import { useFonts } from 'expo-font';

const URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';
const favIcon = '../assets/defaults/favicon.png'

function Home() {
    const [selectedPage, setSelectedPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const [font] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat/static/Montserrat-Regular.ttf'),
        Raleway: require('../assets/fonts/Raleway/static/Raleway-SemiBold.ttf')
    })

    if (!font) {
        return null;
    }


    return (
        <ScrollView>

            <View style={styles.viewHelper}>
                <ImageBackground source={require('../assets/images/Carousel-cocktails-2.png')}
                    style={styles.pageBackground} resizeMode='cover'>
                    <View style={{ marginBottom: 50 }}>
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

                            <View style={styles.page}>
                                <Image style={styles.carouselImage} source={require('../assets/images/Carousel-cocktails-1.png')} />
                                <Text style={styles.H1}>Devs' Favourites</Text>
                            </View>

                            <View style={styles.page}>
                                <Image style={styles.carouselImage} source={require('../assets/images/Carousel-cocktails-2.png')} />
                                <Text style={styles.H1}>Most Popular</Text>
                            </View>

                            <View style={styles.page}>
                                <Image style={styles.carouselImage} source={require('../assets/images/Carousel-cocktails-3.png')} />
                                <Text style={styles.H1}>Latest Recipes</Text>
                            </View>

                        </PageSlider>
                    </View>

                    <View>
                        <Text style={{ paddingTop: 100, paddingLeft: 100, fontSize: 28 }}>Discover</Text>
                    </View>
                    <View style={{ paddingTop: 100, paddingLeft: 100, paddingRight: 100 }}>
                        <Row>
                            <Col style={{ backgroundColor: 'lightyellow' }}>
                                <Text>Surprise me!</Text>
                                <Text style={{ fontSize: 10 }}>Description</Text>
                                <Image
                                    source={require(favIcon)}
                                />
                            </Col>
                            <Col style={{ backgroundColor: 'pink' }}>
                                <Text>Coffee & tea</Text>
                                <Text style={{ fontSize: 10 }}>Description</Text>
                                <Image
                                    source={require(favIcon)}
                                />
                            </Col>
                        </Row>
                        <View>
                            <Row>
                                <Col style={{ backgroundColor: 'lightgreen' }}>
                                    <Text>Alcohol free</Text>
                                    <Text style={{ fontSize: 10 }}>Description</Text>
                                    <Image
                                        source={require(favIcon)}
                                    />
                                </Col>
                                <Col style={{ backgroundColor: 'lightblue' }}>
                                    <Text>Alcoholic drinks</Text>
                                    <Text style={{ fontSize: 10 }}>Description</Text>
                                    <Image
                                        source={require(favIcon)}
                                    />
                                </Col>
                            </Row>
                        </View>

                    </View>
                    <View>
                        <Text style={{ paddingTop: 100, paddingLeft: 50 }}>MAP</Text>
                        <Icon name="map" style={{ paddingTop: 50, paddingLeft: 150, fontSize: 100 }}></Icon>
                    </View>
                </ImageBackground>
            </View>
        </ScrollView >

    );
}

export default Home;