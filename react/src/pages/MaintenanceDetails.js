import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the path to your Firebase config
import vehicleImage from '../Assets/v.jpg';
import {
  FaCar,
  FaTachometerAlt,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaGasPump,
  FaCogs,
  FaUserShield,
  FaCarCrash,
} from 'react-icons/fa';

const MaintenanceDetails = () => {
  const navigate = useNavigate();
  const [testCases, setTestCases] = useState([]);
  const [inputData, setInputData] = useState(null);
  const [displayData, setDisplayData] = useState({});
  const [currentTestCaseIndex, setCurrentTestCaseIndex] = useState(0);

  // Fetch test cases from Firestore
  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const testCasesCollection = collection(db, 'vehicleTestCases');
        const snapshot = await getDocs(testCasesCollection);
        const cases = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            Vehicle_Model: data.Vehicle_Model,
            Mileage: data.Mileage,
            Maintenance_History: data.Maintenance_History,
            Reported_Issues: data.Reported_Issues,
            Vehicle_Age: data.Vehicle_Age,
            Fuel_Type: data.Fuel_Type,
            Transmission_Type: data.Transmission_Type,
            Engine_Size: data.Engine_Size,
            Odometer_Reading: data.Odometer_Reading,
            Last_Service_Date: data.Last_Service_Date,
            Warranty_Expiry_Date: data.Warranty_Expiry_Date,
            Owner_Type: data.Owner_Type,
            Insurance_Premium: data.Insurance_Premium,
            Service_History: data.Service_History,
            Accident_History: data.Accident_History,
            Fuel_Efficiency: data.Fuel_Efficiency,
            Tire_Condition: data.Tire_Condition,
            Brake_Condition: data.Brake_Condition,
            Battery_Status: data.Battery_Status,
          };
        });
        setTestCases(cases);

        // Set the initial test case
        if (cases.length > 0) {
          const initialCase = cases[0];
          setInputData(initialCase);
          updateDisplayData(initialCase);
        }
      } catch (error) {
        console.error('Error fetching test cases:', error);
      }
    };

    fetchTestCases();
  }, []);

  // Update display data for the vehicle
  const updateDisplayData = (vehicle) => {
    setDisplayData({
      'Type': { value: vehicle.Vehicle_Model || 'N/A', icon: <FaCar /> },
      'Mileage': { value: `${vehicle.Mileage || 'N/A'} miles`, icon: <FaTachometerAlt /> },
      'Issues': {
        value: vehicle.Reported_Issues > 0 ? `${vehicle.Reported_Issues} issues` : 'None',
        icon: <FaExclamationTriangle />,
      },
      'Age': { value: `${vehicle.Vehicle_Age || 'N/A'} years`, icon: <FaCalendarAlt /> },
      'Fuel': { value: vehicle.Fuel_Type || 'N/A', icon: <FaGasPump /> },
      'Transmission': { value: vehicle.Transmission_Type || 'N/A', icon: <FaCogs /> },
      'Owner Type': { value: `${vehicle.Owner_Type} Owner` || 'N/A', icon: <FaUserShield /> },
      'Accident History': { value: `${vehicle.Accident_History || 'N/A'}`, icon: <FaCarCrash /> },
    });
  };

  const handlePredict = () => {
    // Ensure the correct field order in the request body
    const orderedInputData = {
      Vehicle_Model: inputData.Vehicle_Model,
      Mileage: inputData.Mileage,
      Maintenance_History: inputData.Maintenance_History,
      Reported_Issues: inputData.Reported_Issues,
      Vehicle_Age: inputData.Vehicle_Age,
      Fuel_Type: inputData.Fuel_Type,
      Transmission_Type: inputData.Transmission_Type,
      Engine_Size: inputData.Engine_Size,
      Odometer_Reading: inputData.Odometer_Reading,
      Last_Service_Date: inputData.Last_Service_Date,
      Warranty_Expiry_Date: inputData.Warranty_Expiry_Date,
      Owner_Type: inputData.Owner_Type,
      Insurance_Premium: inputData.Insurance_Premium,
      Service_History: inputData.Service_History,
      Accident_History: inputData.Accident_History,
      Fuel_Efficiency: inputData.Fuel_Efficiency,
      Tire_Condition: inputData.Tire_Condition,
      Brake_Condition: inputData.Brake_Condition,
      Battery_Status: inputData.Battery_Status,
    };

    fetch('backened-url/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderedInputData),
    })
      .then((response) => response.json())
      .then((data) => {
        navigate('/prediction-result', {
          state: {
            prediction: data.prediction,
            explanation: data.explanation,
          },
        });
      })
      .catch((error) => console.error('Error fetching prediction:', error));
  };

  const handleUpdateDetails = () => {
    const newIndex = (currentTestCaseIndex + 1) % testCases.length;
    const updatedCase = testCases[newIndex];
    setInputData(updatedCase);
    updateDisplayData(updatedCase);
    setCurrentTestCaseIndex(newIndex);
  };

  if (!inputData) {
    return <div className="text-center text-gray-600 mt-10">Loading vehicle details...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-4">Vehicle Maintenance</h1>
        <img
          src={vehicleImage}
          alt="Vehicle"
          className="w-42 h-40 object-cover rounded-full mx-auto shadow-lg"
        />
      </div>

      <h2 className="text-2xl font-semibold text-center mb-6">Vehicle Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-4">
        {Object.entries(displayData).map(([key, { value, icon }]) => (
          <div key={key} className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
            <div className="text-3xl text-blue-500 mb-2">{icon}</div>
            <h3 className="text-sm font-semibold text-gray-600">{key}</h3>
            <p className="text-lg font-medium text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handlePredict}
          className="w-full max-w-xs bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Check Maintenance
        </button>
        <button
          onClick={handleUpdateDetails}
          className="w-full max-w-xs bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Update Details
        </button>
      </div>
    </div>
  );
};

export default MaintenanceDetails;
