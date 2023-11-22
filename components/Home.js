import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image, ImageBackground } from 'react-native';
import { Container, Row, Col } from "react-native-flex-grid";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PageSlider } from '@pietile-native-kit/page-slider';
import styles from '../styles/styles'
import { colors, textStyles } from '../styles/style-constants';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';

const URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';
const favIcon = '../assets/defaults/favicon.png'

function Home() {
    const [selectedPage, setSelectedPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const [font] = useFonts({
        Montserrat: require('../assets/fonts/Montserrat/static/Montserrat-Regular.ttf'),
        Raleway: require('../assets/fonts/Raleway/static/Raleway-SemiBold.ttf'),
        RalewayReg: require('../assets/fonts/Raleway/static/Raleway-Regular.ttf')
    })

    if (!font) {
        return null;
    }

    const Card = ({ backgroundColor, title, text, img }) => (
        <Col style={[styles.cardCol, { backgroundColor: `rgba(${backgroundColor}, 0.4)` }]}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardText}>{text}</Text>
            <Image source={img} style={styles.cardImg} />
        </Col>
    );

    const cardData = [
        {
            backgroundColor: '255, 244, 141',
            title: 'Surprise me!',
            text: 'Discover something\n new and exciting',
            img: require('../assets/images/Alcoholic.png')
        },
        {
            backgroundColor: '255, 132, 63',
            title: 'Coffee & Tea',
            text: 'Brewed or steeped?',
            img: require('../assets/images/CoffeeTea-category.png')
        },
        {
            backgroundColor: '161, 193, 156',
            title: 'Alcohol free',
            text: 'Grant your liver a\n well-deserved break',
            img: require('../assets/images/Alcoholfree-category.png')
        },
        {
            backgroundColor: '153, 151, 224',
            title: 'Alcoholic drinks',
            text: "It's Happy Hour somewhere",
            img: require('../assets/images/Alcoholic.png')
        },
    ];


    return (
        <ScrollView>

            <View style={styles.container}>
                <StatusBar style='auto' />

                <ImageBackground source={require('../assets/images/Carousel-background.png')}
                    resizeMode='contain'
                    opacity={0.5}
                    blurRadius={30}>

                    <View style={{ marginBottom: 80 }}>
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
                                <Text style={textStyles.H1}>Devs' Favourites</Text>
                            </View>

                            <View style={styles.page}>
                                <Image style={styles.carouselImage} source={require('../assets/images/Carousel-cocktails-2.png')} />
                                <Text style={textStyles.H1}>Most Popular</Text>
                            </View>

                            <View style={styles.page}>
                                <Image style={styles.carouselImage} source={require('../assets/images/Carousel-cocktails-3.png')} />
                                <Text style={textStyles.H1}>Latest Recipes</Text>
                            </View>

                        </PageSlider>
                    </View>

                </ImageBackground>

                <View>
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
                <View>
                    <Text style={{ paddingTop: 100, paddingLeft: 50 }}>MAP</Text>
                    <Icon name="map" style={{ paddingTop: 50, paddingLeft: 150, fontSize: 100 }}></Icon>
                </View>
            </View>

        </ScrollView >

    );
}

export default Home;