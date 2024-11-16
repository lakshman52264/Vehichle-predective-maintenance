import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the path to your Firebase config
import {
  FaTachometerAlt,
  FaGasPump,
  FaRoad,
  FaCar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCloud,
} from 'react-icons/fa';
import CO2FuelEfficiencyGraph from '../components/CO2FuelEfficiencyGraph';

const FuelData = () => {
  const [testDataSets, setTestDataSets] = useState([]);
  const [inputData, setInputData] = useState(null);
  const [displayData, setDisplayData] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const resultRef = useRef(null);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);

  // Fetch test data sets from Firestore
  useEffect(() => {
    const fetchTestDataSets = async () => {
      try {
        const dataCollection = collection(db, 'fuelDataTestSets');
        const snapshot = await getDocs(dataCollection);
        const dataSets = snapshot.docs.map((doc) => doc.data());
        setTestDataSets(dataSets);

        // Set initial data
        if (dataSets.length > 0) {
          setInputData(dataSets[0]);
          updateDisplayData(dataSets[0]);
        }
      } catch (error) {
        console.error('Error fetching test data sets:', error);
      }
    };

    fetchTestDataSets();
  }, []);

  const updateDisplayData = (data) => {
    setDisplayData({
      'Engine Size': { value: `${data.ENGINESIZE} L`, icon: <FaCar /> },
      'Cylinders': { value: data.CYLINDERS, icon: <FaTachometerAlt /> },
      'City Fuel Consumption': { value: `${data.FUELCONSUMPTION_CITY} L/100km`, icon: <FaGasPump /> },
      'Highway Fuel Consumption': { value: `${data.FUELCONSUMPTION_HWY} L/100km`, icon: <FaRoad /> },
      'Combined Fuel Consumption': { value: `${data.FUELCONSUMPTION_COMB} L/100km`, icon: <FaGasPump /> },
      'Combined Fuel Consumption (MPG)': { value: `${data.FUELCONSUMPTION_COMB_MPG} mpg`, icon: <FaTachometerAlt /> },
    });
  };

  const handlePredict = () => {
    // Ensure the feature names are sent in the correct order
    const orderedInputData = {
      ENGINESIZE: inputData.ENGINESIZE,
      CYLINDERS: inputData.CYLINDERS,
      FUELCONSUMPTION_CITY: inputData.FUELCONSUMPTION_CITY,
      FUELCONSUMPTION_HWY: inputData.FUELCONSUMPTION_HWY,
      FUELCONSUMPTION_COMB: inputData.FUELCONSUMPTION_COMB,
      FUELCONSUMPTION_COMB_MPG: inputData.FUELCONSUMPTION_COMB_MPG,
    };

    fetch('backened-url/predict-fuel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderedInputData),
    })
      .then((response) => response.json())
      .then((data) => {
        setPrediction(data.prediction);

        setGraphData((prevData) => [
          ...prevData,
          {
            co2: data.prediction,
            fuelEfficiency: data.prediction > 225 ? 10 : 15,
          },
        ]);

        setTimeout(() => {
          if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 200);
      })
      .catch((error) => console.error('Error fetching fuel prediction:', error));
  };

  const handleUpdateDetails = () => {
    const newIndex = (currentDataIndex + 1) % testDataSets.length;
    setInputData(testDataSets[newIndex]);
    updateDisplayData(testDataSets[newIndex]);
    setCurrentDataIndex(newIndex);
  };

  if (!inputData) {
    return <div className="text-center text-gray-600 mt-10">Loading fuel data...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Vehicle Fuel Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-4">
        {Object.entries(displayData).map(([key, { value, icon }]) => (
          <div key={key} className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
            <div className="text-3xl text-green-500 mb-2">{icon}</div>
            <h3 className="text-sm font-semibold text-gray-600">{key}</h3>
            <p className="text-lg font-medium text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handlePredict}
          className="w-full max-w-xs bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Check CO2 Emission
        </button>
        <button
          onClick={handleUpdateDetails}
          className="w-full max-w-xs bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Update Details
        </button>
      </div>

      {prediction !== null && (
        <div
          ref={resultRef}
          className="mt-8 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
        >
          <div className="flex flex-col space-y-4 w-full">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center h-full">
              <h2 className="text-lg font-bold flex items-center justify-center mb-4">
                <FaCloud className={`${prediction > 225 ? 'text-red-500' : 'text-green-500'} mr-2`} />
                CO2 Emission
              </h2>
              <p className={`text-lg ${prediction > 225 ? 'text-red-500' : 'text-green-500'}`}>
                CO2 Emission: {prediction} g/km
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center h-full">
              <h2 className="text-lg font-bold flex items-center justify-center mb-4">
                {prediction > 225 ? (
                  <FaExclamationTriangle className="text-red-500 mr-2" />
                ) : (
                  <FaCheckCircle className="text-green-500 mr-2" />
                )}
                Fuel Efficiency
              </h2>
              <p className={`text-lg ${prediction > 225 ? 'text-red-500' : 'text-green-500'}`}>
                {prediction > 225 ? 'Low Fuel Efficiency' : 'Avg Fuel Efficiency'}
              </p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center w-full">
            <div className="w-full h-64">
              <CO2FuelEfficiencyGraph data={graphData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelData;
