const axios = require('axios');

async function checkIgn(userId, zoneId) {
  if (!userId || !zoneId) {
    throw new Error('Invalid userId or zoneId');
  }

  const user_id = userId + zoneId;
  const signature = '000a7da84dfbdfc958f3392a6af11ea8';
  const url = `https://v1.apigames.id/merchant/M230314DWWH5029OR/cek-username/mobilelegend?user_id=${user_id}&signature=${signature}`;

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      const data = response.data;

      if (data.status) {
        if (data.data && data.data.username) {
          return data.data.username;
        } else {
          throw new Error('IGN not found in response data');
        }
      } else {
        throw new Error(data.message || 'Failed to fetch player data');
      }
    } catch (error) {
      if (error.code === 'ECONNRESET') {
        attempt++;
        console.error(`ECONNRESET error occurred, retrying attempt ${attempt} of ${maxRetries} after delay...`);
        await delay(1000 * attempt); // incremental delay
        if (attempt === maxRetries) {
          console.error('Max retry attempts reached for ECONNRESET error.');
          throw new Error('Failed to verify IGN due to connection reset. Please try again later.');
        }
      } else {
        console.error('Error in checkIgn:', error);
        throw new Error(error.response?.data?.message || error.message || 'Failed to verify IGN');
      }
    }
  }
}

module.exports = { checkIgn };
