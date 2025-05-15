const axios = require('axios');

async function testCheckIgn() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIxMjMiLCJlbWFpbCI6InVzZXIxMjNAZXhhbXBsZS5jb20iLCJpYXQiOjE3NDcxMjE5MjQsImV4cCI6MTc0NzEyNTUyNH0.JrbOT0MdD2qUnK_CDWNQjNSf6qINXmvk-eLE7L6RJjk';
  const mlbbId = '523899934';
  const serverId = '8111';

  try {
    const response = await axios.get("http://localhost:5000/recharge/check-ign?mlbbId=" + mlbbId + "&serverId=" + serverId, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    console.log('Response data:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testCheckIgn();
