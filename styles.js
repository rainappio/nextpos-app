import { StyleSheet } from 'react-native'
export default StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 62,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 20,
    position: 'relative'
  },
  childContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 8,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 20,
    position: 'relative'
  },
  rootInput: {
    height: 40,
    padding: 10
  },
  rootError: {
    color: 'red',
    fontSize: 12,
    fontStyle: 'italic'
  },
  welcomeImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  welcomeText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 20,
    letterSpacing: 2,
    lineHeight: 26,
    marginBottom: 16
  },
  gsText: {
    padding: 10,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16
  },
  text: {
    fontWeight: 'bold',
    marginTop: 22,
    marginBottom: 6
  },
  textSmall: {
    fontSize: 12
  },
  signInText: {
    color: '#F39F86',
    padding: 10,
    textAlign: 'center',
    fontSize: 16
  },
  margin_15: {
    margin: 10
  },
  grayBg: {
    backgroundColor: '#f5f5f5'
  },
  paddTop_40: {
    paddingTop: 30
  },
  paddBottom_40: {
    paddingBottom: 30
  },
  jc_alignIem_center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  flex_dir_row: {
    flexDirection: 'row'
  },
  orange_color: {
    color: '#f18d1a'
  },
  half_width: {
    width: '45%'
  },
  centerText: {
    textAlign: 'center'
  }
})
