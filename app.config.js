import 'dotenv/config';

export default ({config}) => ({
  ...config,
  extra: {
    eas: {
      "projectId": "c53c3d9d-d3df-4036-b1f1-6bf1e444e10f"
    },
    xApikey: process.env.ADMIN_APIKEY,
    host: process.env.ROOT_HOST
  }
})
