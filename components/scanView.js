import React, {useState, useContext, useEffect} from 'react';
import {Text, View, StyleSheet, Button, Alert} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {isEInvoiceCellPhoneBarcodeValid} from 'taiwan-id-validator2'
import {LocaleContext} from '../locales/LocaleContext'


export const ScanView = (props, context) => {
    const localeContext = useContext(LocaleContext);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({type, data}) => {
        setScanned(true);
        if (isEInvoiceCellPhoneBarcodeValid(data))
            props?.successCallback(data)
        else {
            Alert.alert(
                `${localeContext.t('payment.checkCarrierId')}`,
                ` `,
                [
                    {text: `${localeContext.t('action.yes')}`, onPress: () => setScanned(false)}
                ]
            )
        }
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View
            style={props?.style ?? {
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
                margin: '5%',
                borderRadius: 10,
                paddingVertical: '10%',
                alignItems: 'center'
            }}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        </View>
    );
}
