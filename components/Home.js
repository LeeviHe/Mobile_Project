import { ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Home() {
  return (
    <ScrollView>
        <View>
            <View>
                <Text style={{paddingTop: 100, paddingLeft: 120, fontSize: 28}}>Pockettini</Text>
            </View>
            <View>
                <Text style={{paddingTop: 100, paddingLeft: 100}}>Carousel here</Text>
            </View>
            <View>
                <Text style={{paddingTop: 100, paddingLeft: 100, fontSize: 28}}>Featured</Text>
            </View>
            <View style={{paddingTop: 100, paddingLeft: 100}}>
                <View>
                    <Text>RANDOM</Text>
                </View> 
                <View>
                    <Text>CHALLENGE</Text>
                </View>
                <View>
                    <Text>ALCOHOL FREE</Text>
                </View>
                <View>
                    <Text>ALCOHOLIC</Text>
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