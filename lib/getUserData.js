const axios = require('axios');

const { ISSUER_BASE_URL } = process.env;

const getUserData = async ({
  userId,
  token,
  tokenType,
}) => {
  try {
    console.log('token', token);
    const response = await axios.get(
      `${ISSUER_BASE_URL}/api/v2/users/${userId}`,
      { headers: { Authorization: `${tokenType} ${token}` } },
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.log(error.message);

    return '';
  }
};

module.exports = getUserData;
