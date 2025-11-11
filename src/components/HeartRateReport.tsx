// components/HeartRateReport.tsx
import React, { useState, useMemo } from "react";
import { ArrowLeft, Activity, Share2, TrendingUp, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Generate consistent mock data using useMemo
  const { dateData, dates } = useMemo(() => {
    const formatDateDisplay = (date: Date) => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) return "Today";
      if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
      
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const formatDateKey = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const generateConsistentData = (date: Date, seed: number) => {
      // Use consistent base values for each day
      const baseValues = [68, 72, 65, 70, 74, 69, 71, 67]; // Fixed base BPM values for 8 days
      const baseBpm = baseValues[seed] || 68;
      
      const isToday = date.toDateString() === new Date().toDateString();
      const current = isToday ? 72 : baseBpm;
      
      // Calculate consistent derived values
      const average = baseBpm;
      const min = baseBpm - 6;
      const max = baseBpm + 17;
      
      // Consistent history pattern for each day
      const history = [
        { time: "6AM", bpm: baseBpm - 3 },
        { time: "8AM", bpm: baseBpm + 4 },
        { time: "10AM", bpm: baseBpm + 10 },
        { time: "12PM", bpm: baseBpm + 7 },
        { time: "2PM", bpm: baseBpm + 2 },
        { time: "4PM", bpm: baseBpm - 1 },
        { time: "6PM", bpm: baseBpm - 2 },
        { time: "8PM", bpm: baseBpm - 3 },
      ];

      // Consistent zones based on base BPM
      const getZones = (bpm: number) => {
        if (bpm < 68) return { rest: 40, light: 40, moderate: 15, intense: 5 };
        if (bpm < 72) return { rest: 35, light: 45, moderate: 15, intense: 5 };
        return { rest: 30, light: 45, moderate: 20, intense: 5 };
      };

      return {
        date: formatDateDisplay(date),
        current: current,
        average: average,
        min: min,
        max: max,
        resting: baseBpm - 3,
        variability: 35 + (seed * 2),
        zones: getZones(baseBpm),
        history: history
      };
    };

    // Generate dates for the past 7 days (only backward)
    const dates = [];
    for (let i = 0; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date);
    }
    dates.reverse(); // Oldest to newest

    // Create consistent data for all dates
    const dateData: { [key: string]: any } = {};
    dates.forEach((date, index) => {
      dateData[formatDateKey(date)] = generateConsistentData(date, index);
    });

    return { dateData, dates };
  }, []);

  const currentDateIndex = dates.findIndex(date => 
    date.toDateString() === selectedDate.toDateString()
  );

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const currentData = dateData[formatDateKey(selectedDate)];

  const navigateDate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentDateIndex - 1 : currentDateIndex + 1;
    if (newIndex >= 0 && newIndex < dates.length) {
      setSelectedDate(dates[newIndex]);
    }
  };

  // Generate weekly trend from dateData
  const weeklyTrend = useMemo(() => {
    return dates.map(date => {
      const data = dateData[formatDateKey(date)];
      const dayAbbr = date.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        day: dayAbbr,
        average: data.average
      };
    });
  }, [dates, dateData]);

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
        {/* Date Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateDate('prev')}
              disabled={currentDateIndex === 0}
              className="p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800 text-center">
                {currentData.date}
              </h3>
            </div>

            <button
              onClick={() => navigateDate('next')}
              disabled={currentDateIndex === dates.length - 1}
              className="p-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Date Indicator */}
          <div className="flex justify-center items-center gap-2">
            <div className="flex gap-1">
              {dates.map((date, index) => (
                <div
                  key={formatDateKey(date)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentDateIndex 
                      ? "bg-blue-600" 
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">
              {currentDateIndex + 1} of {dates.length}
            </span>
          </div>
        </div>

        {/* Current Stats */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-800">Current Reading</h2>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-gray-800">{currentData.current}</div>
            <div className="text-gray-500">BPM</div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-800">{currentData.average}</div>
              <div className="text-xs text-gray-500">Average</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">{currentData.min}</div>
              <div className="text-xs text-gray-500">Min</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">{currentData.max}</div>
              <div className="text-xs text-gray-500">Max</div>
            </div>
          </div>
        </div>

        {/* Today's Heart Rate Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Daily Heart Rate</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">Your heart rate throughout the day</p>
          <HeartRateBarChart data={currentData.history} />
          
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
          <HeartRateTrendChart data={weeklyTrend} />
        </div>

        {/* Additional Metrics */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Heart Rate Zones</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Resting Zone</span>
                <span className="font-semibold">{currentData.zones.rest}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${currentData.zones.rest}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Light Activity</span>
                <span className="font-semibold">{currentData.zones.light}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${currentData.zones.light}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Moderate Activity</span>
                <span className="font-semibold">{currentData.zones.moderate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${currentData.zones.moderate}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Intense Activity</span>
                <span className="font-semibold">{currentData.zones.intense}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${currentData.zones.intense}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Past Days Summary */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-800">Past Week</h3>
          </div>
          <div className="space-y-2">
            {dates.map(date => {
              const data = dateData[formatDateKey(date)];
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const getStatusColor = (bpm: number) => {
                if (bpm > 80) return "text-red-600 bg-red-50";
                if (bpm > 70) return "text-yellow-600 bg-yellow-50";
                return "text-green-600 bg-green-50";
              };
              
              return (
                <div 
                  key={formatDateKey(date)} 
                  className={`flex items-center justify-between py-2 px-3 rounded-lg border transition-colors ${
                    isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                    {data.date}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                      {data.average}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(data.average)}`}>
                      BPM
                    </span>
                  </div>
                </div>
              );
            })}
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