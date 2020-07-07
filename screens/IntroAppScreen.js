import React from "react";
import {
  Image,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import { connect } from "react-redux";
import styles from "../styles";
import {modeCtrlstyles} from '../modeCtrlStyle'
import { doLogout } from "../actions";
import { getToken } from "../constants/Backend";
import { LocaleContext } from "../locales/LocaleContext";

class IntroAppScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  static contextType = LocaleContext;

  constructor(props, context) {
    super(props, context);

    context.localize({
      en: {
        createAccount: "Create Account",
        signIn: "Sign In",
      },
      zh: {
        createAccount: "註冊新帳號",
        signIn: "登入",
      },
    });
  }

  isTokenAlive = async () => {
    const tokenObj = await getToken();

    if (tokenObj !== null && tokenObj.tokenExp > Date.now()) {
      this.props.navigation.navigate("LoginSuccess");
    } else {
      this.props.dispatch(doLogout());
      this.props.navigation.navigate("Login");
    }
  };

  render() {
    let { t, theme } = this.context;

    return (
      <View style={styles.container}>
        <View style={{ flex: 3, justifyContent: "center" }}>
          <View style={[{ position: "absolute", top: 0 }]}>
            <Image
              source={
                __DEV__
                  ? require("../assets/images/logo.png")
                  : require("../assets/images/logo.png")
              }
              style={styles.welcomeImage}
            />
          </View>
          <Text style={[styles.welcomeText,theme]}>Simplify</Text>
          <Text style={[styles.welcomeText,theme]}>Your</Text>
          <Text style={[styles.welcomeText,theme]}>Selling</Text>
        </View>

        <View style={[styles.bottom]}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("CreateAcc")}
          >
            <Text style={[styles.bottomActionButton, styles.actionButton]}>
              {t("createAccount")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.isTokenAlive}>
            <Text style={[styles.bottomActionButton, styles.cancelButton]}>
              {t("signIn")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(null, mapDispatchToProps)(IntroAppScreen);
