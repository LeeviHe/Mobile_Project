import { Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../styles/style-constants';
import styles from '../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function More({ navigation }) {
  return (
    <View style={styles.moreContainer}>

      <TouchableOpacity style={styles.moreItem}
        onPress={() => navigation.navigate('Favourites')}>
        <Icon name='heart' size={40} color={colors.mainFontColour} />
        <Text style={styles.moreText}>Favourites</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.moreItem}
        onPress={() => navigation.navigate('MyPockettinis')}>
        <Icon name='note-text' size={40} color={colors.mainFontColour} />
        <Text style={styles.moreText}>My Pockettinis</Text>
      </TouchableOpacity>
    </View >
  );
}