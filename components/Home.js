import { useEffect, useState } from 'react';
import { ScrollView, Text, View, Image} from 'react-native';
import { Container, Row, Col} from "react-native-flex-grid";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const URL = 'https://www.thecocktaildb.com/api/json/v1/1/';
const favIcon = '../assets/defaults/favicon.png'

export default function Home() {

    //Mahdollista koodia myöhempään käyttöön
    //?Yrittää hakea apista drinkkitiedot?

    /*const [recipeData, setRecipeData] = useState([])

    async function getDrink(wanted) {
                try {
                    const response = await fetch(URL + wanted);
            
                    if (response.ok) {
                    const json = await response.json();
                    if (json.drinks === undefined || json.drinks === null || json.drinks === '' || json.drinks === 0 || !json.drinks) {
                        alert("Can't find drinks")
                        return
                    }
            
                    const drinks = json.drinks;
                    setRecipeData(drinks);
            
                    } else {
                    alert('Error retrieving recipes!');
                    }
            
                } catch (err) {
                    alert(err);
                }
            }

            //Esim. alkoholittomat
    useEffect(() => {
        getDrink('filter.php?a=Alcoholic')
    }, [])*/
    

  return (
    <ScrollView>
        <View>
            <View>
                <Image source={require('../assets/icons/pockettini-logo-regular-256px.png')} style={{alignSelf: 'center', marginTop: 100, backgroundColor: 'red'}}/>
            </View>
            <View>
                <Text style={{paddingTop: 100, paddingLeft: 100}}>Carousel here</Text>
            </View>
            <View>
                <Text style={{paddingTop: 100, paddingLeft: 100, fontSize: 28}}>Featured</Text>
            </View>
            <View style={{paddingTop: 100, paddingLeft: 100}}>
                <Row>
                    <Col>
                        <Image
                        source={require(favIcon)}
                        />
                    </Col>
                    <Col>
                        <Image
                        source={require(favIcon)}
                         />
                    </Col>
                </Row>
                <View>
                    <Row>
                        <Col>
                            <Image
                            source={require(favIcon)}
                            />
                        </Col>
                        <Col>
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