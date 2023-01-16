const axios = require('axios');
const jwtDecode = require('jwt-decode');

const { CLIENT_ID, CLIENT_SECRET, ISSUER_BASE_URL } = process.env;

const getManagementToken = async (myCache) => {
  // https://dev-k3l3kkkaa5qlxp7w.us.auth0.com/oauth/token
  const token = myCache.get('manageAccessToken');

  if (token !== undefined) {
    const decodeResult = jwtDecode(token);
    const currentTime = parseInt(new Date() / 1000, 10);

    if (currentTime - 10 < decodeResult.exp) {
      return token;
    }
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('audience', `${ISSUER_BASE_URL}/api/v2/`);
    const response = await axios.post(
      `${ISSUER_BASE_URL}/oauth/token`,
      params,
      { headers: { 'content-type': 'application/x-www-form-urlencoded' } },
    );

    return response.data.access_token;
  } catch (error) {
    console.log(error);

    return '';
  }
};

module.exports = getManagementToken;
