import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext';
import './MonthlyChart.css';

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();
  
  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:5000/api/transactions/chart/monthly');
        
        if (res.data.success) {
          const { labels, datasets } = res.data.data;
          
          setChartData({
            labels,
            datasets: [{
              label: 'Monthly Expenses',
              data: datasets[0].data,
              backgroundColor: 'rgba(231, 76, 60, 0.7)',
              borderColor: 'rgba(231, 76, 60, 1)',
              borderWidth: 1
            }]
          });
        }
      } catch (err) {
        setError('Failed to load chart data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChartData();
  }, []);
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#E2E8F0' : '#2D3748'
        }
      },
      title: {
        display: true,
        text: 'Monthly Expenses',
        color: darkMode ? '#E2E8F0' : '#2D3748',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return `$${value}`;
          },
          color: darkMode ? '#A0AEC0' : '#4A5568'
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          color: darkMode ? '#A0AEC0' : '#4A5568'
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };
  
  if (isLoading) {
    return <div className="chart-loading">Loading chart data...</div>;
  }
  
  if (error) {
    return <div className="chart-error">{error}</div>;
  }
  
  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlyChart;