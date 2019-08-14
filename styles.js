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
    height: 44,
    padding: 10,
    marginBottom: 10,
    borderBottomColor: '#f1f1f1',
    borderBottomWidth: 1
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
    lineHeight: 32,
    marginBottom: 16,
    marginTop: -8
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
  paddTop_30: {
    paddingTop: 30
  },
  paddBottom_30: {
    paddingBottom: 30
  },
  paddBottom_10: {
    paddingBottom: 10
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
  },
  textLeftWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10
  },
  grayText: {
    color: '#888'
  },
  mgr_20: {
    marginRight: 20
  },
  container_nocenterCnt: {
    flex: 1,
    marginTop: 62,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 20,
    position: 'relative'
  },
  mgrbtn40: {
    marginBottom: 40
  },
  pickerStyle: {
    width: '100%',
    justifyContent: 'center',
    paddingRight: 0,
    paddingLeft: 0,
    marginTop: 8
  },
  leftpadd32: {
    paddingLeft: 32
  },
  fullWidth: {
    width: '100%'
  },
  isActive: {
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#F39F86'
  }
})
