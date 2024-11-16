import React, { useState, useEffect, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaCarSide, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the path to your Firebase config

const DriverBehavior = () => {
  const [testCases, setTestCases] = useState([]);
  const [inputData, setInputData] = useState(null);
  const [displayData, setDisplayData] = useState(null);
  const [score, setScore] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [explanation, setExplanation] = useState(null);
  const resultRef = useRef(null);
  const [currentTestCaseIndex, setCurrentTestCaseIndex] = useState(0);

  // Fetch test cases from Firestore
  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const testCasesCollection = collection(db, 'testCases');
        const snapshot = await getDocs(testCasesCollection);
        const cases = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTestCases(cases);

        // Set the initial test case
        if (cases.length > 0) {
          setInputData(cases[0].inputData);
          setDisplayData(cases[0].displayData);
        }
      } catch (error) {
        console.error('Error fetching test cases:', error);
      }
    };

    fetchTestCases();
  }, []);

  const handleCalculateScore = () => {
    // Ensure the keys are in the correct order: jerk, sharp_turn
    const orderedInputData = {
      jerk: inputData.jerk,
      sharp_turn: inputData.sharp_turn,
    };

    fetch('backened-url/driver-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderedInputData), // Send the ordered data
    })
      .then((response) => response.json())
      .then((data) => {
        setScore(data.score);
        setExplanation(data.explanation);

        setTimeout(() => {
          if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 200);
      })
      .catch((error) => console.error('Error fetching driver score:', error));
  };

  useEffect(() => {
    if (score !== null) {
      let start = 0;
      const increment = score / 100;
      const interval = setInterval(() => {
        start += increment;
        if (start >= score) {
          start = score;
          clearInterval(interval);
        }
        setDisplayScore(start);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [score]);

  const handleUpdateDetails = () => {
    const newIndex = (currentTestCaseIndex + 1) % testCases.length;
    setInputData(testCases[newIndex].inputData);
    setDisplayData(testCases[newIndex].displayData);
    setCurrentTestCaseIndex(newIndex);
  };

  // Render a loading state if data is not ready
  if (!displayData || !inputData) {
    return <div className="text-center text-gray-600 mt-10">Loading test cases...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Vehicle Behavior Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-4">
        <div>
          <h3 className="text-xl font-semibold text-center mb-4">Acceleration</h3>
          {Object.entries(displayData.acceleration || {}).map(([key, value]) => (
            <div key={key} className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
              <FaCarSide className="text-2xl text-blue-500 mb-2" />
              <h4 className="text-sm font-semibold text-gray-600">{key}</h4>
              <p className="text-lg font-medium text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-center mb-4">Angular Velocity</h3>
          {Object.entries(displayData.angularVelocity || {}).map(([key, value]) => (
            <div key={key} className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
              <FaArrowRight className="text-2xl text-red-500 mb-2" />
              <h4 className="text-sm font-semibold text-gray-600">{key}</h4>
              <p className="text-lg font-medium text-gray-800">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-2xl font-semibold text-center my-6">Additional Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-4">
        {Object.entries(displayData.additionalMetrics || {}).map(([key, value]) => (
          <div key={key} className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
            <FaExclamationTriangle className="text-2xl text-yellow-500 mb-2" />
            <h4 className="text-sm font-semibold text-gray-600">{key}</h4>
            <p className="text-lg font-medium text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={handleCalculateScore}
          className="w-full max-w-xs bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Calculate Driver Score
        </button>
        <button
          onClick={handleUpdateDetails}
          className="w-full max-w-xs bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Update Details
        </button>
      </div>

      {score !== null && (
        <div ref={resultRef} className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Driver Score</h2>
          <div
            style={{ width: 150, height: 150, margin: '0 auto', padding: '10px', borderRadius: '50%' }}
            className="bg-white shadow-lg flex items-center justify-center border-4 border-blue-100"
          >
            <CircularProgressbar
              value={displayScore}
              text={`${Math.round(displayScore)}`}
              maxValue={100}
              styles={buildStyles({
                textColor: displayScore < 60 ? "#DC2626" : displayScore < 80 ? "#F59E0B" : "#10B981",
                pathColor: displayScore < 60 ? "#DC2626" : displayScore < 80 ? "#F59E0B" : "#10B981",
                trailColor: "#D1D5DB",
                textSize: "22px",
              })}
            />
          </div>

          <p
            className={`text-xl mt-4 font-semibold transition-all duration-300 ${
              score < 60 ? 'text-red-600' : score < 80 ? 'text-yellow-600' : 'text-green-600'
            }`}
          >
            {score < 60 ? (
              <>
                <FaExclamationTriangle className="inline mr-2 text-red-600" /> Poor Driving Behavior
              </>
            ) : score < 80 ? (
              <>
                <FaArrowRight className="inline mr-2 text-yellow-600" /> Average Driving Behavior
              </>
            ) : (
              <>
                <FaCarSide className="inline mr-2 text-green-600" /> Good Driving Behavior
              </>
            )}
          </p>

          {explanation && (
            <div className="mt-6 text-left max-w-md mx-auto bg-gray-50 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Explanation:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                {explanation.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-lg mr-2">
                      {score < 60 ? '😟' : score < 80 ? '😐' : '😊'}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DriverBehavior;
