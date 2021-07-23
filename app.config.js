import 'dotenv/config';

const Key = {
    adminkey: process.env.ADMIN_APIKEY,
    apiRoot: process.env.ROOT_HOST,
}

export default ({config}) => ({
    ...config,
    extra: {
        xApikey: Key.adminkey,
        host: Key.apiRoot
    },
})
