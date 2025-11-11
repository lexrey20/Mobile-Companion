import React, { useState, useMemo } from "react";
import { ArrowLeft, Heart, Share2, TrendingUp, Clock, AlertCircle, Gauge, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface BloodPressureReportProps {
  onBack?: () => void;
}

// Blood Pressure chart component
const BloodPressureChart: React.FC<{ data: { time: string; systolic: number; diastolic: number }[] }> = ({ data }) => {
  const maxBP = Math.max(...data.map(d => Math.max(d.systolic, d.diastolic)));
  const minBP = Math.min(...data.map(d => Math.min(d.systolic, d.diastolic)));

  return (
    <div className="w-full h-40 flex items-end justify-between gap-1 mt-4">
      {data.map((reading, index) => {
        const systolicHeight = ((reading.systolic - minBP) / (maxBP - minBP)) * 80 + 20;
        const diastolicHeight = ((reading.diastolic - minBP) / (maxBP - minBP)) * 80 + 20;
        
        const getSystolicColor = (systolic: number) => {
          if (systolic < 120) return 'bg-green-400';
          if (systolic <= 129) return 'bg-yellow-400';
          if (systolic <= 139) return 'bg-orange-400';
          return 'bg-red-400';
        };

        const getDiastolicColor = (diastolic: number) => {
          if (diastolic < 80) return 'bg-green-400';
          if (diastolic <= 89) return 'bg-yellow-400';
          return 'bg-red-400';
        };

        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex gap-1 w-full justify-center">
              <div
                className={`w-1/2 rounded-t transition-all duration-300 ${getSystolicColor(reading.systolic)}`}
                style={{ height: `${systolicHeight}px` }}
              />
              <div
                className={`w-1/2 rounded-t transition-all duration-300 ${getDiastolicColor(reading.diastolic)}`}
                style={{ height: `${diastolicHeight}px` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">{reading.time}</div>
            <div className="text-xs font-semibold text-gray-700 text-center">
              {reading.systolic}/{reading.diastolic}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const BloodPressureReport: React.FC<BloodPressureReportProps> = ({ onBack }) => {
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
      const systolicBases = [118, 122, 115, 120, 125, 119, 121, 117];
      const diastolicBases = [78, 81, 75, 80, 79, 77, 82, 76];
      
      const baseSystolic = systolicBases[seed] || 120;
      const baseDiastolic = diastolicBases[seed] || 80;
      
      const isToday = date.toDateString() === new Date().toDateString();
      const currentSystolic = isToday ? 120 : baseSystolic;
      const currentDiastolic = isToday ? 80 : baseDiastolic;
      
      // Calculate consistent derived values
      const averageSystolic = baseSystolic;
      const averageDiastolic = baseDiastolic;
      const minSystolic = baseSystolic - 8;
      const minDiastolic = baseDiastolic - 6;
      const maxSystolic = baseSystolic + 15;
      const maxDiastolic = baseDiastolic + 7;
      
      // Determine status based on average
      const getStatus = (systolic: number, diastolic: number) => {
        if (systolic >= 140 || diastolic >= 90) return "high";
        if (systolic >= 130 || diastolic >= 80) return "elevated";
        return "normal";
      };

      const status = getStatus(averageSystolic, averageDiastolic);
      
      // Consistent history pattern for each day
      const history = [
        { time: "6AM", systolic: baseSystolic - 5, diastolic: baseDiastolic - 5 },
        { time: "8AM", systolic: baseSystolic + 2, diastolic: baseDiastolic + 1 },
        { time: "10AM", systolic: baseSystolic + 4, diastolic: baseDiastolic + 2 },
        { time: "12PM", systolic: baseSystolic + 6, diastolic: baseDiastolic + 3 },
        { time: "2PM", systolic: baseSystolic + 3, diastolic: baseDiastolic + 4 },
        { time: "4PM", systolic: baseSystolic + 1, diastolic: baseDiastolic + 2 },
        { time: "6PM", systolic: baseSystolic - 2, diastolic: baseDiastolic - 1 },
        { time: "8PM", systolic: baseSystolic - 4, diastolic: baseDiastolic - 3 },
      ];

      // Calculate MAP (Mean Arterial Pressure)
      const map = Math.round((2 * baseDiastolic + baseSystolic) / 3);
      
      // Pulse based on systolic
      const pulse = 65 + (seed * 2);

      // Classification and risk level
      const getClassification = (status: string) => {
        switch (status) {
          case "normal": return "Normal";
          case "elevated": return "Elevated";
          case "high": return "High";
          default: return "Normal";
        }
      };

      const getRiskLevel = (status: string) => {
        switch (status) {
          case "normal": return "Low";
          case "elevated": return "Medium";
          case "high": return "High";
          default: return "Low";
        }
      };

      return {
        date: formatDateDisplay(date),
        current: { systolic: currentSystolic, diastolic: currentDiastolic },
        average: { systolic: averageSystolic, diastolic: averageDiastolic },
        min: { systolic: minSystolic, diastolic: minDiastolic },
        max: { systolic: maxSystolic, diastolic: maxDiastolic },
        status: status,
        pulse: pulse,
        map: map,
        classification: getClassification(status),
        riskLevel: getRiskLevel(status),
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
      case "elevated": return "text-yellow-600";
      case "high": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "normal": return "Normal";
      case "elevated": return "Elevated";
      case "high": return "High";
      default: return "Unknown";
    }
  };

  const getRiskColor = (riskLevel: string) => {
    return riskLevel === "Low" ? "text-green-600" : 
           riskLevel === "Medium" ? "text-yellow-600" : "text-red-600";
  };

  // Generate weekly trend from dateData
  const weeklyTrend = useMemo(() => {
    return dates.map(date => {
      const data = dateData[formatDateKey(date)];
      const dayAbbr = date.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        day: dayAbbr,
        systolic: data.average.systolic,
        diastolic: data.average.diastolic
      };
    });
  }, [dates, dateData]);

  return (
    <div className="flex flex-col w-full h-full bg-gray-100">
      <div className="flex-shrink-0 w-full shadow-sm py-4 px-6 flex items-center gap-4 bg-blue-600 h-16">
        <button onClick={onBack} className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-white">Blood Pressure Report</h1>
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
            <Heart className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Current Reading</h2>
          </div>
          
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-gray-800">
              {currentData.current.systolic}/{currentData.current.diastolic}
            </div>
            <div className="text-gray-500">mmHg</div>
            <div className={`text-sm font-semibold mt-1 ${getStatusColor(currentData.status)}`}>
              {getStatusText(currentData.status)} • {currentData.classification}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-800">
                {currentData.average.systolic}/{currentData.average.diastolic}
              </div>
              <div className="text-xs text-gray-500">Average</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">{currentData.pulse}</div>
              <div className="text-xs text-gray-500">Pulse</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-800">{currentData.map}</div>
              <div className="text-xs text-gray-500">MAP</div>
            </div>
          </div>
        </div>

        {/* Today's Blood Pressure Chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Daily Blood Pressure</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">Systolic and diastolic readings</p>
          <BloodPressureChart data={currentData.history} />
          
          <div className="flex justify-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span className="text-gray-600">Normal</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span className="text-gray-600">Elevated</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-gray-600">High</span>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Blood Pressure Ranges</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-800">
                {currentData.min.systolic}/{currentData.min.diastolic}
              </div>
              <div className="text-xs text-gray-500">Lowest Today</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-800">
                {currentData.max.systolic}/{currentData.max.diastolic}
              </div>
              <div className="text-xs text-gray-500">Highest Today</div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">Risk Assessment</h3>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className={`text-lg font-semibold ${getRiskColor(currentData.riskLevel)} mb-1`}>
              {currentData.riskLevel} Risk
            </div>
            <p className="text-gray-600 text-sm">
              {currentData.riskLevel === "Low" 
                ? "Your blood pressure is within normal range. Continue healthy habits."
                : currentData.riskLevel === "Medium"
                ? "Your blood pressure is elevated. Consider lifestyle changes."
                : "Your blood pressure is high. Consider consulting with your healthcare provider."}
            </p>
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
              const getStatusColorClass = (status: string) => {
                switch (status) {
                  case "normal": return "text-green-600 bg-green-50";
                  case "elevated": return "text-yellow-600 bg-yellow-50";
                  case "high": return "text-red-600 bg-red-50";
                  default: return "text-gray-600 bg-gray-50";
                }
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
                      {data.average.systolic}/{data.average.diastolic}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColorClass(data.status)}`}>
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

export default BloodPressureReport;