import React, { useState, useMemo } from "react";
import { ArrowLeft, Droplets, Share2, TrendingUp, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface GlucoseReportProps {
  onBack?: () => void;
}

// Glucose bar chart component with fixed time labels
const GlucoseBarChart: React.FC<{ data: { time: string; glucose: number }[] }> = ({ data }) => {
  const maxGlucose = Math.max(...data.map(d => d.glucose));
  const minGlucose = Math.min(...data.map(d => d.glucose));

  return (
    <div className="w-full h-40 flex items-end justify-between gap-1 mt-4">
      {data.map((reading, index) => {
        const height = ((reading.glucose - minGlucose) / (maxGlucose - minGlucose)) * 100 + 30;
        const getBarColor = (glucose: number) => {
          if (glucose < 70) return 'bg-yellow-400';
          if (glucose <= 140) return 'bg-green-400';
          return 'bg-red-400';
        };
        
        // Use shorter time format to prevent wrapping
        const displayTime = reading.time.replace(" AM", "").replace(" PM", "");
        
        return (
          <div key={index} className="flex flex-col items-center flex-1 min-w-0">
            <div
              className={`w-full rounded-t transition-all duration-300 ${getBarColor(reading.glucose)}`}
              style={{ height: `${height}px` }}
            />
            <div className="text-xs text-gray-500 mt-2 text-center leading-tight whitespace-nowrap">
              {displayTime}
            </div>
            <div className="text-xs font-semibold text-gray-700 mt-1 text-center">
              {reading.glucose}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const GlucoseReport: React.FC<GlucoseReportProps> = ({ onBack }) => {
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
      const baseValues = [95, 98, 105, 94, 101, 108, 92, 97]; // Fixed values for 8 days
      const baseGlucose = baseValues[seed] || 95;
      
      const isToday = date.toDateString() === new Date().toDateString();
      const current = isToday ? 95 : baseGlucose;
      
      // Calculate consistent derived values
      const average = baseGlucose + 3;
      const min = baseGlucose - 10;
      const max = baseGlucose + 25;
      const status = average > 140 ? "high" : average < 70 ? "low" : "normal";
      
      // Consistent history pattern for each day
      const history = [
        { time: "6AM", glucose: baseGlucose - 8 },
        { time: "8AM", glucose: baseGlucose + 10 },
        { time: "10AM", glucose: baseGlucose + 3 },
        { time: "12PM", glucose: baseGlucose + 15 },
        { time: "2PM", glucose: baseGlucose - 5 },
        { time: "4PM", glucose: baseGlucose + 3 },
        { time: "6PM", glucose: baseGlucose + 7 },
        { time: "8PM", glucose: baseGlucose - 3 },
      ];

      return {
        date: formatDateDisplay(date),
        current: current,
        average: average,
        min: min,
        max: max,
        status: status,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-green-600";
      case "high": return "text-red-600";
      case "low": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "normal": return "Normal";
      case "high": return "High";
      case "low": return "Low";
      default: return "Unknown";
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-100">
      <div className="flex-shrink-0 w-full shadow-sm py-4 px-6 flex items-center gap-4 bg-blue-600 h-16">
        <button onClick={onBack} className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white">Glucose Report</h1>
      </div>

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

          {/* Date Indicator - No scrollbar, just show current position */}
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Droplets className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Glucose Reading</h2>
                <div className={`text-sm font-semibold ${getStatusColor(currentData.status)}`}>
                  {getStatusText(currentData.status)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-gray-800">{currentData.current}</div>
            <div className="text-gray-500">mg/dL</div>
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

        {/* Daily Glucose Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Daily Glucose</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Glucose levels throughout the day</p>
          <GlucoseBarChart data={currentData.history} />
          
          <div className="flex justify-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span className="text-gray-600">Low (&lt;70)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span className="text-gray-600">Normal (70-140)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-gray-600">High (&gt;140)</span>
            </div>
          </div>
        </div>

        {/* Past Days Summary - Now shows the same average values */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-800">Past Week</h3>
          </div>
          <div className="space-y-2">
            {dates.map(date => {
              const data = dateData[formatDateKey(date)];
              const isSelected = date.toDateString() === selectedDate.toDateString();
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
                      {data.average} {/* Now shows the same average as in the detailed view */}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(data.status)} ${
                      isSelected ? 'bg-opacity-30' : 'bg-opacity-20'
                    }`}>
                      {getStatusText(data.status)}
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

export default GlucoseReport;