import 'dotenv/config';

export default ({config}) => ({
  ...config,
  extra: {
    xApikey: process.env.ADMIN_APIKEY,
    host: process.env.ROOT_HOST
  }
})
