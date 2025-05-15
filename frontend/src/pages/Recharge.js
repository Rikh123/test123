import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const packs = [
  {
    label: 'Weekly Pass - ₹120',
    value: '120',
    backgroundImage: 'https://th.bing.com/th/id/OIP.SuCCuDtXwow6zkc6uTM8ggHaHa?rs=1&pid=ImgDetMain',
  },
  {
    label: 'Twilight Pass - ₹670',
    value: '670',
    backgroundImage: 'https://th.bing.com/th/id/OIP.CDlm0WxU2uW7owLTL18qxAAAAA?rs=1&pid=ImgDetMain',
  },
  {
    label: '55 Diamonds - ₹65',
    value: '65',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '86 Diamonds - ₹100',
    value: '100',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '110 Diamonds - ₹130',
    value: '130',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '141 Diamonds - ₹165',
    value: '165',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '165 Diamonds - ₹190',
    value: '190',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '172 Diamonds - ₹199',
    value: '199',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '257 Diamonds - ₹295',
    value: '295',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '275 Diamonds - ₹305',
    value: '305',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '343 Diamonds - ₹390',
    value: '390',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '429 Diamonds - ₹490',
    value: '490',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '514 Diamonds - ₹570',
    value: '570',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '565 Diamonds - ₹630',
    value: '630',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '600 Diamonds - ₹680',
    value: '680',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '706 Diamonds - ₹790',
    value: '790',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '792 Diamonds - ₹890',
    value: '890',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '878 Diamonds - ₹990',
    value: '990',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '963 Diamonds - ₹1070',
    value: '1070',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '1049 Diamonds - ₹1160',
    value: '1160',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '1130 Diamonds - ₹1250',
    value: '1250',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '1220 Diamonds - ₹1350',
    value: '1350',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '1412 Diamonds - ₹1540',
    value: '1540',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '2195 Diamonds - ₹2330',
    value: '2330',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '3688 Diamonds - ₹3870',
    value: '3870',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '5532 Diamonds - ₹5850',
    value: '5850',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  {
    label: '9288 Diamonds - ₹9650',
    value: '9650',
    backgroundImage: 'https://th.bing.com/th/id/OIP.ra-RPqEksV7exBp_ulCMWwHaGa?rs=1&pid=ImgDetMain',
  },
  { label: '1000 (500+500) - ₹615', value: '615' },
  { label: '500 (250+250) - ₹305', value: '305' },
  { label: '300 (150+150) - ₹195', value: '195' },
  { label: '100 (50+50) - ₹65', value: '65' },
];

const Recharge = () => {
  const [mlbbId, setMlbbId] = useState('');
  const [serverId, setServerId] = useState('');
  const [pack, setPack] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ignName, setIgnName] = useState('');
  const [ignCheckLoading, setIgnCheckLoading] = useState(false);
  const [ignCheckError, setIgnCheckError] = useState('');
  const [ignVerified, setIgnVerified] = useState(false);
  const [rechargeId, setRechargeId] = useState(null);
  const [paymentUploaded, setPaymentUploaded] = useState(false);
  const navigate = useNavigate();

  // Decode userInfo from token stored in localStorage
  let userInfo = null;
  const token = localStorage.getItem('token');
  if (token) {
    try {
      userInfo = jwt_decode(token);
    } catch (error) {
      userInfo = null;
    }
  }

  // 3D card animation styles
  const cardStyle = {
    perspective: '1000px',
  };

  const cardInnerStyle = (isSelected) => ({
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    boxShadow: isSelected
      ? '0 10px 20px rgba(34, 197, 94, 0.6)'
      : '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    transform: isSelected ? 'rotateY(15deg) rotateX(10deg) scale(1.05)' : 'none',
  });

  const cardOverlayStyle = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '0.5rem',
  };

  // 3D button hover effect styles
  const buttonStyle = {
    transition: 'transform 0.3s, box-shadow 0.3s',
  };

  const buttonHoverStyle = {
    transform: 'translateZ(10px) scale(1.05)',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.3)',
  };

  const checkIgn = async () => {
    setIgnCheckError('');
    setIgnCheckLoading(true);
    setIgnVerified(false);
    setIgnName('');
    setRechargeId(null);
    setQrCode('');
    setPaymentScreenshot(null);
    setPaymentUploaded(false);
    if (!mlbbId || !serverId) {
      setIgnCheckError('Please enter MLBB User ID and Server ID to check IGN');
      setIgnCheckLoading(false);
      return;
    }
    try {
      const apiBaseUrl = window.location.protocol + '//' + window.location.hostname + ':5000';
      const res = await axios.get(
        `${apiBaseUrl}/recharge/check-ign?mlbbId=${encodeURIComponent(mlbbId)}&serverId=${encodeURIComponent(serverId)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIgnName(res.data);
      setIgnVerified(true);
    } catch (err) {
      setIgnCheckError(err.response?.data?.message || 'IGN check failed');
      setIgnVerified(false);
    } finally {
      setIgnCheckLoading(false);
    }
  };

const createRecharge = async () => {
    setError('');
    console.log('Creating recharge with pack:', pack); // Debug log
    if (!ignVerified) {
      setError('Please verify your IGN before selecting a pack');
      return;
    }
    if (!pack) {
      setError('Please select a pack');
      return;
    }
    setLoading(true);
    try {
      const apiBaseUrl = window.location.protocol + '//' + window.location.hostname + ':5000';
      const res = await axios.post(
        `${apiBaseUrl}/recharge/create`,
        { mlbbId, serverId, pack },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQrCode(res.data.qrCodeDataUrl);
      setRechargeId(res.data.rechargeId);
      setIgnName(res.data.ignName || '');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create recharge');
      setLoading(false);
    }
  };

  const uploadPaymentScreenshot = async () => {
    setError('');
    if (!paymentScreenshot) {
      setError('Please upload payment screenshot');
      return;
    }
    if (!rechargeId) {
      setError('Recharge ID missing');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('rechargeId', rechargeId);
      formData.append('paymentScreenshot', paymentScreenshot);

      const apiBaseUrl = window.location.protocol + '//' + window.location.hostname + ':5000';
      await axios.post(
        `${apiBaseUrl}/recharge/upload-payment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setPaymentUploaded(true);
      setLoading(false);
      pollPaymentStatus(rechargeId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload payment screenshot');
      setLoading(false);
    }
  };

  const pollPaymentStatus = (rechargeId) => {
    if (!rechargeId) {
      setError('Recharge ID missing for payment verification');
      return;
    }
    const interval = setInterval(async () => {
      try {
        const apiBaseUrl = window.location.protocol + '//' + window.location.hostname + ':5000';
        const res = await axios.get(
          `${apiBaseUrl}/recharge/status/${rechargeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Consider 'Processed' as success status
        if (res.data.status === 'Processed') {
          clearInterval(interval);
          navigate('/success');
        } else if (res.data.status === 'Failed') {
          clearInterval(interval);
          setError('Payment verification failed. Please contact support.');
        }
      } catch (err) {
        clearInterval(interval);
        setError('Error verifying payment status');
      }
    }, 5000); // poll every 5 seconds
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Recharge Form</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">MLBB User ID</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={mlbbId}
            onChange={(e) => {
              setMlbbId(e.target.value);
              setIgnVerified(false);
              setIgnName('');
              setIgnCheckError('');
              setRechargeId(null);
              setQrCode('');
              setPaymentScreenshot(null);
              setPaymentUploaded(false);
            }}
            disabled={loading}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Server ID</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={serverId}
            onChange={(e) => {
              setServerId(e.target.value);
              setIgnVerified(false);
              setIgnName('');
              setIgnCheckError('');
              setRechargeId(null);
              setQrCode('');
              setPaymentScreenshot(null);
              setPaymentUploaded(false);
            }}
            disabled={loading}
            required
          />
        </div>
        <div className="mb-2">
          <button
            type="button"
            onClick={checkIgn}
            disabled={ignCheckLoading || !mlbbId || !serverId || loading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {ignCheckLoading ? 'Checking IGN...' : 'Check IGN'}
          </button>
          {ignCheckError && <p className="text-red-600 mt-2">{ignCheckError}</p>}
          {ignVerified && ignName && (
            <>
              <p className="text-green-700 mt-2 font-semibold">Verified IGN: {ignName}</p>
            </>
          )}
        </div>
        {ignVerified && (
          <>
            <div className="mb-6">
              <label className="block mb-1 font-semibold">Select Pack</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto border border-gray-300 rounded p-3" style={cardStyle}>
                {packs.map((p, index) => {
                  const isSelected = pack === p.value;
                  return (
                    <div
                      key={index}
onClick={() => !loading && qrCode === '' && setPack(p.label)}
                      className={`cursor-pointer rounded-lg p-4 text-center border transition-shadow relative overflow-hidden ${
                        isSelected
                          ? 'border-green-600 bg-green-100 shadow-lg'
                          : 'border-gray-300 hover:shadow-md hover:bg-gray-50'
                      }`}
                      style={{
                        backgroundImage: p.backgroundImage ? `url(${p.backgroundImage})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        perspective: '1000px',
                      }}
                    >
                      <div style={cardInnerStyle(isSelected)}>
                        <div style={cardOverlayStyle}></div>
                        <p className="relative z-10 font-semibold text-white">{p.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {pack && qrCode === '' && (
              <button
                type="button"
                onClick={createRecharge}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded transition mb-6"
                style={{ ...buttonStyle }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = buttonHoverStyle.transform;
                  e.currentTarget.style.boxShadow = buttonHoverStyle.boxShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = buttonStyle.transform;
                  e.currentTarget.style.boxShadow = buttonStyle.boxShadow;
                }}
              >
                {loading ? 'Processing...' : 'Proceed to Pay'}
              </button>
            )}
          </>
        )}
        {qrCode && (
          <>
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Scan UPI QR Code to Pay</h3>
              <img src={qrCode} alt="UPI QR Code" className="mx-auto" />
              <p className="mt-4 text-gray-700">Recharge will be processed in 5–10 minutes.</p>
            </div>
            {!paymentUploaded && (
              <div className="mb-6">
                <label className="block mb-1 font-semibold">Upload Payment Screenshot</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                  className="w-full"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={uploadPaymentScreenshot}
                  disabled={loading || !paymentScreenshot}
                  className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition mt-4"
                >
                  {loading ? 'Uploading...' : 'Upload Payment Screenshot'}
                </button>
              </div>
            )}
            {paymentUploaded && (
              <div className="text-green-700 font-semibold text-center space-y-2">
                <p>Payment screenshot uploaded. Waiting for verification...</p>
                <p><strong>MLBB ID:</strong> {mlbbId}</p>
                <p><strong>Server ID:</strong> {serverId}</p>
                <p><strong>Pack:</strong> {pack}</p>
                <p><strong>IGN Name:</strong> {ignName}</p>
                <p><strong>User ID:</strong> {userInfo?.id || 'N/A'}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Recharge;
