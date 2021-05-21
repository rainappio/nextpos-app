import React, {Component} from 'react'
import {apiRoot} from "../constants/Backend";
import SockJsClient from 'react-stomp';
import * as Device from 'expo-device';


const url = `${apiRoot}/ws`
const debugMode = false


class RealTimeOrderUpdateBase extends Component {

  constructor(props, context) {
    super(props, context)
  }

  handleOnConnection = (ref) => {
    if (this.props?.handleOnConnect || this.props?.handleOnConnect !== undefined) {
      this.props?.handleOnConnect(ref)
    }
  }

  render() {
    const {
      meta,
      topics,
      handleOnMessage,
      id,
    } = this.props;


    return (
      <SockJsClient url={url} topics={[topics]}
        onMessage={(data) => {
          handleOnMessage(data, id)
          console.log(`get device: ${Device.deviceName}-${Device.modelName}`)
        }}
        ref={(client) => {
          this.orderFormRef = client
        }}
        onConnect={() => {
          this.handleOnConnection(this.orderFormRef)
          console.log(`onConnect: ${Device.osName}-${Device.osVersion}`)
        }}
        onDisconnect={() => {
          console.log(`onDisconnect: ${Device.osName}-${Device.osVersion}`)
        }}
        debug={debugMode}
      />
    );
  }
};
export const RealTimeOrderUpdate = RealTimeOrderUpdateBase


