import { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image} from 'react-native';
import { Container, Row, Col} from "react-native-flex-grid";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const URL = 'https://www.thecocktaildb.com/api/json/v1/1/';
const favIcon = '../assets/defaults/favicon.png'

export default function Home() {

  return (
    <ScrollView>
        <View style={{backgroundColor:'lightgray'}}>
            <View>
                <Image source={require('../assets/icons/pockettini-logo-regular-256px.png')} style={{alignSelf: 'center', marginTop: 100}}/>
            </View>
            <View>
                <Text style={{paddingTop: 100, paddingLeft: 100}}>Carousel here</Text>
            </View>
            <View>
                <Text style={{paddingTop: 100, paddingLeft: 100, fontSize: 28}}>Discover</Text>
            </View>
            <View style={{paddingTop: 100, paddingLeft: 100, paddingRight:100}}>
                <Row>
                <Col style={{backgroundColor:'lightyellow'}}>
                        <Text>Surprise me!</Text>
                        <Text style={{fontSize: 10}}>Description</Text>
                        <Image
                        source={require(favIcon)}
                        />
                    </Col>
                    <Col style={{backgroundColor:'pink'}}>
                        <Text>Coffee & tea</Text>
                        <Text style={{fontSize: 10}}>Description</Text>
                        <Image
                        source={require(favIcon)}
                        />
                    </Col>
                </Row>
                <View>
                    <Row>
                        <Col style={{backgroundColor:'lightgreen'}}>
                            <Text>Alcohol free</Text>
                            <Text style={{fontSize: 10}}>Description</Text>
                            <Image
                            source={require(favIcon)}
                            />
                        </Col>
                        <Col style={{backgroundColor:'lightblue'}}>
                            <Text>Alcoholic drinks</Text>
                            <Text style={{fontSize: 10}}>Description</Text>
                            <Image
                            source={require(favIcon)}
                            />
                        </Col>
                    </Row>
                </View>
                
            </View>
            <View>
                <Text style={{paddingTop: 100, paddingLeft: 50}}>MAP</Text>
                <Icon name="map" style={{paddingTop: 50, paddingLeft: 150, fontSize:100}}></Icon>
            </View>
        </View>
    </ScrollView>
    
  );
}