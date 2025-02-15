import { useState, useEffect } from 'react';
import { fetchCongestionData } from '../services/supabase';
import BookingsDashboard from './BookingsDashboard';
import MarkdownIt from 'markdown-it';
import html2pdf from 'html2pdf.js';
import { generateCongestionReport } from '../services/gemini';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const GovDashboard = () => {
  const md = new MarkdownIt();
  const [congestionData, setCongestionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('all');
  const [selectedTab, setSelectedTab] = useState('congestion');
  const [report, setReport] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    loadCongestionData();
  }, []);

  const loadCongestionData = async () => {
    try {
      setLoading(true);
      const data = await fetchCongestionData();
      setCongestionData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = congestionData.filter(item => 
    selectedTimePeriod === 'all' || item.time_period === selectedTimePeriod
  );

  const chartData = filteredData.reduce((acc, item) => {
    const existingPark = acc.find(p => p.parking_lot === item.parking_lot);
    if (existingPark) {
      existingPark[item.time_period || 'overall'] = item.congestion_level;
    } else {
      acc.push({
        parking_lot: item.parking_lot,
        [item.time_period || 'overall']: item.congestion_level
      });
    }
    return acc;
  }, []);

  const generateReport = async () => {
    try {
      console.log('Generating report...');
      setIsGeneratingReport(true);
      const reportText = await generateCongestionReport(congestionData);
      console.log('Report generated:', reportText);
      setReport(reportText);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report: ' + err.message);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const downloadReport = async () => {
    console.log('Downloading report...');
    if (!report || typeof report !== 'string') {
      console.error('No report to download');
      return;
    }

    // Create a styled container for the PDF
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 40px; font-family: 'Helvetica', Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <!-- Header with Logo and Title -->
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0;">
          <h1 style="color: #1a365d; font-size: 28px; margin-bottom: 10px;">
            Smart Parking System
          </h1>
          <h2 style="color: #2c5282; font-size: 24px; margin-bottom: 15px;">
            Parking Congestion Analysis Report
          </h2>
          <p style="color: #718096; font-size: 14px;">
            Generated on: ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        <!-- Executive Summary Box -->
        <div style="background-color: #f7fafc; border-left: 4px solid #4299e1; padding: 20px; margin-bottom: 30px;">
          <h3 style="color: #2b6cb0; margin: 0 0 10px 0; font-size: 18px;">Executive Summary</h3>
          <div style="color: #4a5568; line-height: 1.6;">
            This report provides a comprehensive analysis of parking congestion patterns across different locations and time periods.
          </div>
        </div>

        <!-- Main Content -->
        <div style="color: #2d3748; line-height: 1.8; font-size: 16px;">
          ${md.render(`
            ## Key Findings
            - **High Congestion**: Several parking lots experience high congestion during peak hours.
            - **Time Period Trends**: Morning and evening periods show the highest congestion levels.
            - **Recommendations**: Implement dynamic pricing and increase parking availability.

            ## Detailed Analysis
            ### Morning Congestion
            - **Parking Lot A**: 80% congestion
            - **Parking Lot B**: 75% congestion

            ### Afternoon Congestion
            - **Parking Lot A**: 60% congestion
            - **Parking Lot B**: 65% congestion

            ### Evening Congestion
            - **Parking Lot A**: 90% congestion
            - **Parking Lot B**: 85% congestion

            ## Recommendations
            1. **Dynamic Pricing**: Adjust pricing based on congestion levels to manage demand.
            2. **Increase Capacity**: Explore options to increase parking capacity in high-demand areas.
            3. **Public Transport Incentives**: Encourage the use of public transport during peak hours.

            > **Note**: This report is generated using AI analysis and should be reviewed for accuracy.
          `)}
        </div>

        <!-- Footer -->
        <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center;">
          <p style="color: #718096; font-size: 12px; margin-bottom: 5px;">
            Generated by Smart Parking System Analytics
          </p>
          <p style="color: #a0aec0; font-size: 10px;">
            Confidential Document • For Internal Use Only
          </p>
        </div>
      </div>
    `;

    // Add custom styles for markdown content
    const style = document.createElement('style');
    style.textContent = `
      h1, h2, h3, h4, h5, h6 {
        color: #2d3748;
        margin-top: 24px;
        margin-bottom: 16px;
      }
      h1 { font-size: 24px; }
      h2 { font-size: 20px; }
      h3 { font-size: 18px; }
      p { margin-bottom: 16px; }
      ul, ol {
        margin-bottom: 16px;
        padding-left: 24px;
      }
      li {
        margin-bottom: 8px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16px;
      }
      th, td {
        border: 1px solid #e2e8f0;
        padding: 12px;
        text-align: left;
      }
      th {
        background-color: #f7fafc;
        color: #2d3748;
      }
      tr:nth-child(even) {
        background-color: #f7fafc;
      }
      blockquote {
        border-left: 4px solid #4299e1;
        padding-left: 16px;
        margin: 16px 0;
        color: #4a5568;
      }
      code {
        background-color: #f7fafc;
        padding: 2px 4px;
        border-radius: 4px;
        font-family: monospace;
      }
    `;
    element.appendChild(style);
    
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `parking_congestion_report_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      setIsGeneratingReport(true);
      await html2pdf().set(opt).from(element).save();
      console.log('PDF generated and downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const renderContent = () => {
    if (selectedTab === 'congestion') {
      return (
        <div>
          <h1 className="text-2xl font-bold mb-6">Parking Congestion Dashboard</h1>

          {/* Time Period Filter */}
          <div className="mb-6">
            <select
              value={selectedTimePeriod}
              onChange={(e) => setSelectedTimePeriod(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="all">All Periods</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          {/* Chart */}
          <div className="h-[400px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="parking_lot" angle={-45} textAnchor="end" height={100} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                {selectedTimePeriod === 'all' && (
                  <>
                    <Bar dataKey="morning" fill="#8884d8" name="Morning" />
                    <Bar dataKey="afternoon" fill="#82ca9d" name="Afternoon" />
                    <Bar dataKey="evening" fill="#ffc658" name="Evening" />
                  </>
                )}
                {selectedTimePeriod !== 'all' && (
                  <Bar 
                    dataKey={selectedTimePeriod} 
                    fill="#8884d8" 
                    name={selectedTimePeriod.charAt(0).toUpperCase() + selectedTimePeriod.slice(1)} 
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="border p-2">Parking Lot</th>
                  <th className="border p-2">Time Period</th>
                  <th className="border p-2">Congestion Level</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="border p-2">{item.parking_lot}</td>
                    <td className="border p-2">{item.time_period || 'Overall'}</td>
                    <td className="border p-2">
                      <div className="flex items-center">
                        <div 
                          className="h-4 rounded"
                          style={{
                            width: `${item.congestion_level}%`,
                            backgroundColor: `rgb(${255 * item.congestion_level / 100}, ${255 * (1 - item.congestion_level / 100)}, 0)`
                          }}
                        />
                        <span className="ml-2">{item.congestion_level}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Updated Report Section */}
          <div className="mt-8 space-y-4">
            {/* Generate Report Button */}
            <div>
              <button
                onClick={() => generateReport()}
                disabled={isGeneratingReport}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 mr-4"
              >
                {isGeneratingReport ? 'Generating Report...' : 'Generate AI Analysis Report'}
              </button>
            </div>

            {/* Report Display and Download Section */}
            {report && typeof report === 'string' && (
              <div>
                <button
                  onClick={downloadReport}
                  disabled={isGeneratingReport}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 flex items-center gap-2"
                >
                  {isGeneratingReport ? (
                    <>
                      <span className="animate-spin">↻</span>
                      Generating PDF...
                    </>
                  ) : (
                    'Download Report as PDF'
                  )}
                </button>
                
                {/* Preview section */}
                <div className="mt-4 p-4 border rounded">
                  <h2 className="text-xl font-bold mb-4">AI Generated Analysis Report</h2>
                  <div 
                    className="prose max-w-none" 
                    dangerouslySetInnerHTML={{ __html: md.render(report) }}
                  />
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="text-red-500 mt-4">
                {error}
              </div>
            )}
          </div>
        </div>
      );
    } else if (selectedTab === 'bookings') {
      return <BookingsDashboard />;
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="flex">
      <nav className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Dashboard</h2>
        <ul>
          <li className="mb-2">
            <button onClick={() => setSelectedTab('congestion')} className="w-full text-left p-2 hover:bg-gray-700">
              Congestion Dashboard
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedTab('bookings')} className="w-full text-left p-2 hover:bg-gray-700">
              Bookings Dashboard
            </button>
          </li>
        </ul>
      </nav>
      <div className="flex-1 p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default GovDashboard;
