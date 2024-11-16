import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PredictionResult.css';
import car from '../Assets/caro.png';
import weakBattery from '../Assets/weakb.png';
import avgBattery from '../Assets/avgb.png';
import greenBattery from '../Assets/greenb.png';
import wornOutTireFrontLeft from '../Assets/tire1.png'; 
import wornOutTireRearLeft from '../Assets/tire2.png';
import wornOutTireFrontRight from '../Assets/tire3.png';
import wornOutTireRearRight from '../Assets/tire4.png';
import brakered1 from '../Assets/brake1.png';
import brakegreen1 from '../Assets/brake1g.png';
import brakeyellow1 from '../Assets/brake1y.png';
import brakered2 from '../Assets/brake2.png';
import brakegreen2 from '../Assets/brake2g.png';
import brakeyellow2 from '../Assets/brake2y.png';
import { FaBatteryHalf, FaCarCrash, FaWrench, FaExclamationTriangle, FaTachometerAlt } from 'react-icons/fa';


const PredictionResult = () => {
  const location = useLocation();
  const { prediction, explanation } = location.state || {};

  const [batteryImage, setBatteryImage] = useState(avgBattery);
  const [tyreImage, setTyreImage] = useState('');
  const [brake1Image, setBrake1Image] = useState(brakeyellow1);
  const [brake2Image, setBrake2Image] = useState('');

  useEffect(() => {
    explanation?.forEach((item) => {
      if (item.feature === 'Battery Status') {
        switch (item.value) {
          case 'Weak':
            setBatteryImage(weakBattery);
            break;
          case 'Good':
            setBatteryImage(avgBattery);
            break;
          case 'New':
            setBatteryImage(greenBattery);
            break;
          default:
            setBatteryImage(avgBattery);
        }
      }
      if (item.feature === 'Tire Condition' && item.value === 'Worn Out') {
        setTyreImage(true);
      }

      if (item.feature === 'Brake Condition') {
        if (item.value==='Worn Out'){
          setBrake1Image(brakered1);
          setBrake2Image(brakered2);
        }
        if(item.value==='Good'){
          setBrake1Image(brakeyellow1);
          setBrake2Image(brakeyellow2);

        }
        if(item.value==='New'){
          setBrake1Image(brakegreen1);
          setBrake2Image(brakegreen2);

        }
      }

      
    });
  }, [explanation]);

  const getIcon = (feature) => {
    switch (feature) {
      case 'Battery Status':
        return <FaBatteryHalf className="text-blue-500 text-2xl mr-3" />;
      case 'Brake Condition':
        return <FaCarCrash className="text-red-500 text-2xl mr-3" />;
      case 'Tire Condition':
        return <FaTachometerAlt className="text-green-500 text-2xl mr-3" />;
      case 'Maintenance History':
        return <FaWrench className="text-yellow-500 text-2xl mr-3" />;
      case 'Reported Issues':
        return <FaExclamationTriangle className="text-orange-500 text-2xl mr-3" />;
      default:
        return <FaExclamationTriangle className="text-gray-500 text-2xl mr-3" />;
    }
  };

  return (
    <div className="max-w-screen-md mx-auto p-6 bg-gray-50 min-h-screen">
      <h2
        className={`text-2xl font-bold text-center mb-4 ${
          prediction === 'No Maintenance Needed' ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {prediction}
      </h2>
      <div className="relative text-center">
        <img src={car} alt="Car Outline" className="w-70 h-64 mx-auto" />

        <img
          src={batteryImage}
          alt="Battery Status"
          className="battery-image blink"
          style={{
            position: 'absolute',
            top: '51.5%',
            left: '35.8%',
            transform: 'translate(-50%, -50%)',
            width: '65px',
            height: '33px',
          }}
        />

        <img
          src={brake1Image}
          alt="Battery Status"
          className="battery-image blink"
          style={{
            position: 'absolute',
            top: '68%',
            left: '45.7%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '500px',
          }}
        />

<img
          src={brake2Image}
          alt="Battery Status"
          className="battery-image blink"
          style={{
            position: 'absolute',
            top: '40%',
            left: '72.7%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            height: '500px',
          }}
        />
        

{tyreImage && (
          <>
            <img
              src={wornOutTireFrontLeft}
              alt="Front Left Tire Condition"
              className="tire-image blink"
              style={{
                position: 'absolute',
                top: '67%',
                left: '44.6%',
                transform: 'translate(-50%, -50%)',
                width: '700px',
                height: '510px',
              }}
            />
            <img
              src={wornOutTireRearLeft}
              alt="Rear Left Tire Condition"
              className="tire-image blink"
              style={{
                position: 'absolute',
                top: '44.2%',
                left: '72.12%',
                transform: 'translate(-50%, -50%)',
                width: '230px',
                height: '210px',
              }}
            />
            <img
              src={wornOutTireFrontRight}
              alt="Front Right Tire Condition"
              className="tire-image blink"
              style={{
                position: 'absolute',
                top: '17%',
                left: '47.5%',
                transform: 'translate(-50%, -50%)',
                width: '700px',
                height: '530px',
              }}
            />
            <img
              src={wornOutTireRearRight}
              alt="Rear Right Tire Condition"
              className="tire-image blink"
              style={{
                position: 'absolute',
                top: '48%',
                left: '29.9%',
                transform: 'translate(-50%, -50%)',
                width: '670px',
                height: '530px',
              }}
            />
          </>
        )}

{tyreImage && (
          <>
            <img
              src={wornOutTireFrontLeft}
              alt="Front Left Tire Condition"
              className="tire-image blink"
              style={{
                position: 'absolute',
                top: '67%',
                left: '44.6%',
                transform: 'translate(-50%, -50%)',
                width: '700px',
                height: '510px',
              }}
            />
            <img
              src={wornOutTireRearLeft}
              alt="Rear Left Tire Condition"
              className="tire-image blink"
              style={{
                position: 'absolute',
                top: '44.2%',
                left: '72.12%',
                transform: 'translate(-50%, -50%)',
                width: '230px',
                height: '210px',
              }}
            />
          </>
        )}
      </div>
      

      {explanation && explanation.length > 0 && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold">Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {explanation.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition duration-200"
              >
                <div className="flex items-center">
                  {getIcon(item.feature)}
                  <h4 className="text-lg font-semibold text-gray-800">
                    {item.feature}: {item.value}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;
