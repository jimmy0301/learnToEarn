const axios = require('axios');

const { ISSUER_BASE_URL } = process.env;

const updateUserData = async ({
  userId,
  parameter,
  token,
  tokenType,
}) => {
  try {
    console.log('token', token);
    const response = await axios.patch(`${ISSUER_BASE_URL}/api/v2/users/${userId}`, parameter, { headers: { Authorization: `${tokenType} ${token}` } });

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.log(error.message);

    return '';
  }
};

module.exports = updateUserData;
