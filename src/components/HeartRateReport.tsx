// components/HeartRateReport.tsx
import React from "react";
import { ArrowLeft, Activity, Share2, TrendingUp, Clock } from "lucide-react";

interface HeartRateReportProps {
  onBack?: () => void;
}

// Simple bar chart component for heart rate visualization
const HeartRateBarChart: React.FC<{ data: { time: string; bpm: number }[] }> = ({ data }) => {
  const maxBpm = Math.max(...data.map(d => d.bpm));
  const minBpm = Math.min(...data.map(d => d.bpm));

  return (
    <div className="w-full h-32 flex items-end justify-between gap-1 mt-4">
      {data.map((reading, index) => {
        const height = ((reading.bpm - minBpm) / (maxBpm - minBpm)) * 80 + 20;
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={`w-full rounded-t transition-all duration-300 ${
                reading.bpm > 80 ? 'bg-red-400' : 
                reading.bpm > 70 ? 'bg-yellow-400' : 'bg-green-400'
              }`}
              style={{ height: `${height}px` }}
            />
            <div className="text-xs text-gray-500 mt-1">{reading.time}</div>
            <div className="text-xs font-semibold text-gray-700">{reading.bpm}</div>
          </div>
        );
      })}
    </div>
  );
};

// Line chart for trends
const HeartRateTrendChart: React.FC<{ data: { day: string; average: number }[] }> = ({ data }) => {
  const maxAvg = Math.max(...data.map(d => d.average));
  const minAvg = Math.min(...data.map(d => d.average));

  return (
    <div className="w-full h-32 relative mt-4">
      <div className="absolute inset-0 flex items-center">
        {/* Grid lines */}
        <div className="w-full h-px bg-gray-200"></div>
      </div>
      <div className="relative h-full flex items-end">
        {data.map((day, index) => {
          const height = ((day.average - minAvg) / (maxAvg - minAvg)) * 60 + 20;
          const isLast = index === data.length - 1;
          return (
            <div key={index} className="flex-1 flex flex-col items-center relative">
              <div
                className="w-2 bg-blue-500 rounded-t transition-all duration-300"
                style={{ height: `${height}px` }}
              />
              {!isLast && (
                <div 
                  className="absolute top-1/2 left-1/2 w-full h-0.5 bg-blue-500 transform -translate-y-1/2"
                  style={{ 
                    left: '50%',
                    width: '100%',
                    zIndex: 1 
                  }}
                />
              )}
              <div className="text-xs text-gray-500 mt-1">{day.day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const HeartRateReport: React.FC<HeartRateReportProps> = ({ onBack }) => {
  // Mock data for the report
  const heartRateData = {
    current: 72,
    average: 68,
    min: 62,
    max: 85,
    resting: 65,
    variability: 42,
    zones: {
      rest: 35,
      light: 45,
      moderate: 15,
      intense: 5
    },
    todayHistory: [
      { time: "8 AM", bpm: 65 },
      { time: "10 AM", bpm: 72 },
      { time: "12 PM", bpm: 78 },
      { time: "2 PM", bpm: 75 },
      { time: "4 PM", bpm: 70 },
      { time: "6 PM", bpm: 68 },
      { time: "8 PM", bpm: 65 },
    ],
    weeklyTrend: [
      { day: "Mon", average: 66 },
      { day: "Tue", average: 68 },
      { day: "Wed", average: 70 },
      { day: "Thu", average: 67 },
      { day: "Fri", average: 72 },
      { day: "Sat", average: 69 },
      { day: "Sun", average: 65 },
    ]
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-100">
      {/* Header */}
      <div className="flex-shrink-0 w-full shadow-sm py-4 px-6 flex items-center gap-4 bg-blue-600 h-16">
        <button 
          onClick={onBack}
          className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white">Heart Rate Report</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-6">
        {/* Current Stats */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-800">Current Reading</h2>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-gray-800">{heartRateData.current}</div>
            <div className="text-gray-500">BPM</div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-800">{heartRateData.average}</div>
              <div className="text-xs text-gray-500">Average</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">{heartRateData.min}</div>
              <div className="text-xs text-gray-500">Min</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">{heartRateData.max}</div>
              <div className="text-xs text-gray-500">Max</div>
            </div>
          </div>
        </div>

        {/* Today's Heart Rate Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Today's Heart Rate</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">Your heart rate throughout the day</p>
          <HeartRateBarChart data={heartRateData.todayHistory} />
          
          <div className="flex justify-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span className="text-gray-600">Normal (≤70)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span className="text-gray-600">Elevated (71-80)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-gray-600">High (≥81)</span>
            </div>
          </div>
        </div>

        {/* Weekly Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-800">Weekly Trend</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">7-day average heart rate</p>
          <HeartRateTrendChart data={heartRateData.weeklyTrend} />
        </div>

        {/* Additional Metrics */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Heart Rate Zones</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Resting Zone</span>
                <span className="font-semibold">{heartRateData.zones.rest}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${heartRateData.zones.rest}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Light Activity</span>
                <span className="font-semibold">{heartRateData.zones.light}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${heartRateData.zones.light}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Moderate Activity</span>
                <span className="font-semibold">{heartRateData.zones.moderate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${heartRateData.zones.moderate}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Intense Activity</span>
                <span className="font-semibold">{heartRateData.zones.intense}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${heartRateData.zones.intense}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <Share2 className="w-4 h-4" />
          Share Report
        </button>
      </div>
    </div>
  );
};

export default HeartRateReport;