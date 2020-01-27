import Devices from 'react-native-device-detection'
import tablet from './tablet'
import mobile from './mobile'

export default Devices.isTablet ? tablet : mobile