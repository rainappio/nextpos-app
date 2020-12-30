import React, {useState, useContext, useEffect} from 'react';
import {Alert} from 'react-native'
import {NavigationActions} from 'react-navigation';
import {LocaleContext} from '../locales/LocaleContext'
import {withContext} from "../helpers/contextHelper";
import i18n from 'i18n-js'
import {store} from '../App';


let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {

  _navigator.dispatch(
    NavigationActions.navigate({
      routeName: routeName,
      params: params,
    })
  );
}


function navigateToRoute(routeName, params, callback = null) {
  const state = store.getState()
  const client = state?.client?.data
  if (checkSubscriptionAccess(routeName, client?.clientSubscriptionAccess?.restrictedFeatures)) {
    Alert.alert(
      `${i18n.t('privilegedAccessTitle')}`,
      `${i18n.t('premiumFeatureMsg')}`,
      [
        {
          text: `${i18n.t('action.yes')}`,
          onPress: () => {
            _navigator.dispatch(
              NavigationActions.navigate({
                routeName: 'SubscriptionScreen',
                params: {isRedirected: true}
              })
            );
          }
        },
        {
          text: `${i18n.t('action.no')}`,
          onPress: () => console.log('Cancelled'),
          style: 'cancel'
        }
      ]
    )

  } else {
    !!callback ? callback() :
      _navigator.dispatch(
        NavigationActions.navigate({
          routeName: routeName,
          params: params,
        })
      )
  }

}

function checkSubscriptionAccess(route, restrictedFeatures) {
  let flag = false
  restrictedFeatures?.forEach((item) => {
    if (item === 'timeCard') {
      if (route === 'ClockIn') {
        flag = true
      }
    }
    else if (item === 'orderDisplay') {
      if (route === 'OrderDisplayScreen') {
        flag = true
      }
    }
    else if (item === 'salesReport') {
      if (route === 'SalesCharts') {
        flag = true
      }
    }
    else if (item === 'customerStats') {
      if (route === 'CustomerStats') {
        flag = true
      }
    }
    else if (item === 'timeCardReport') {
      if (route === 'StaffTimeCard') {
        flag = true
      }
    }
    else if (item === 'membership') {
      if (route === 'MemberScreen') {
        flag = true
      }
    }
    else if (item === 'calendar') {
      if (route === 'CalendarScreen') {
        flag = true
      }
    }
    else if (item === 'staff') {
      if (route === 'StaffsOverview') {
        flag = true
      }
    }
    else if (item === 'roster') {
      if (route === 'RostersScreen') {
        flag = true
      }
    }
    else if (item === 'einvoice') {
      if (route === 'EinvoiceStatusScreen') {
        flag = true
      }
    }
  })
  return flag
}



// add other navigation functions that you need and export them


export default {
  navigate,
  setTopLevelNavigator,
  navigateToRoute,
  checkSubscriptionAccess
}
