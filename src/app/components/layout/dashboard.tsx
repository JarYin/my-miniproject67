"use client";
import { useState, useEffect } from "react";
import { FiThermometer, FiDroplet, FiRss, FiPower } from "react-icons/fi";
import Logo from "../ui/logo";

const Dashboard = () => {
  const [isLedOn, setIsLedOn] = useState(false);
  const [isLedGreenOn, setIsLedGreenOn] = useState(false);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [ultrasonic, setUltrasonic] = useState<number | null>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch("/api/getAll");
        const data = await result.json();

        if (data.length > 0) {
          const latestData = data[data.length - 1];
          setTemperature(latestData.temperature);
          setHumidity(latestData.humidity);
          setUltrasonic(latestData.ultrasonic);

          setIsLedOn(latestData.red === "on");
          setIsLedGreenOn(latestData.green === "on");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const sendLedState = async (ledColor: string, state: string) => {
    try {
      const response = await fetch("/api/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ led: ledColor, state: state }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to toggle ${ledColor} LED: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error sending LED state:", error);
    }
  };

  const toggleLed = async () => {
    const newState = isLedOn ? "off" : "on";
    setIsLedOn(!isLedOn);
    await sendLedState("red", newState);
  };

  const toggleLedGreen = async () => {
    const newState = isLedGreenOn ? "off" : "on";
    setIsLedGreenOn(!isLedGreenOn);
    await sendLedState("green", newState);
  };
  if (ultrasonic != 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl w-full">
          {/* LED RED Control */}
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-500 mb-4">LED RED</h2>
            <button
              onClick={toggleLed}
              className={`w-full py-3 rounded-full font-medium text-white transition-all ${
                isLedOn ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {isLedOn ? "Turn Off" : "Turn On"}
            </button>
          </div>

          {/* LED GREEN Control */}
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-green-500 mb-4">
              LED GREEN
            </h2>
            <button
              onClick={toggleLedGreen}
              className={`w-full py-3 rounded-full font-medium text-white transition-all ${
                isLedGreenOn ? "bg-red-600" : "bg-green-600"
              }`}
            >
              {isLedGreenOn ? "Turn Off" : "Turn On"}
            </button>
          </div>

          {/* Temperature Data */}
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-center">
              <FiThermometer className="mr-2" />
              Temperature
            </h2>
            <p className="text-3xl font-bold">
              {temperature !== null ? `${temperature}°C` : "Loading..."}
            </p>
          </div>

          {/* Humidity Data */}
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-center">
              <FiDroplet className="mr-2" />
              Humidity
            </h2>
            <p className="text-3xl font-bold">
              {humidity !== null ? `${humidity}%` : "Loading..."}
            </p>
          </div>

          {/* Ultrasonic Data */}
          <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg p-6 text-center sm:col-span-2 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 flex items-center justify-center">
              <FiRss className="mr-2" />
              Ultrasonic
            </h2>
            <p className="text-3xl font-bold">
              {ultrasonic !== null ? `${ultrasonic} cm` : "Loading..."}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return <Logo ultrasonic={ultrasonic} />;
  }
};

export default Dashboard;
