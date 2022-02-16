import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCurrentUserRole = (user, role) => {

  let permission = user.roles.includes(role)

  return permission

}

// 2021/04/21: prepare for future token.scope check
export const getCurrentUserScope = async () => {
  let token = await AsyncStorage.getItem('token')
  const tokenObj = JSON.parse(token)
  const scopeSetting = String(tokenObj.scope)

  const all = 'all:report'
  const read = 'read:report'
  let permission = scopeSetting.includes(all) || scopeSetting.includes(read)

  return permission
}
