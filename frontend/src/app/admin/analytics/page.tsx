'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

function AnalyticsContent() {
  const [timeRange, setTimeRange] = useState('6months');

  // Mock data
  const monthlyTrends = [
    { month: 'Jan', users: 280, cases: 32, revenue: 95000, satisfaction: 4.5 },
    { month: 'Feb', users: 295, cases: 38, revenue: 102000, satisfaction: 4.6 },
    { month: 'Mar', users: 310, cases: 35, revenue: 108000, satisfaction: 4.7 },
    { month: 'Apr', users: 318, cases: 42, revenue: 112000, satisfaction: 4.6 },
    { month: 'May', users: 328, cases: 45, revenue: 118000, satisfaction: 4.8 },
    { month: 'Jun', users: 342, cases: 48, revenue: 125000, satisfaction: 4.9 },
  ];

  const casesByCategory = [
    { category: 'Immigration', value: 45, color: '#1E40AF' },
    { category: 'Family Law', value: 32, color: '#10B981' },
    { category: 'Criminal Defense', value: 28, color: '#F59E0B' },
    { category: 'Civil Litigation', value: 22, color: '#EF4444' },
    { category: 'Corporate Law', value: 18, color: '#8B5CF6' },
    { category: 'Other', value: 12, color: '#6B7280' },
  ];

  const performanceMetrics = [
    { metric: 'Case Resolution', value: 85, fullMark: 100 },
    { metric: 'Client Satisfaction', value: 92, fullMark: 100 },
    { metric: 'Response Time', value: 78, fullMark: 100 },
    { metric: 'Team Efficiency', value: 88, fullMark: 100 },
    { metric: 'Quality Score', value: 90, fullMark: 100 },
  ];

  const regionalData = [
    { region: 'North', cases: 42, revenue: 45000 },
    { region: 'South', cases: 38, revenue: 42000 },
    { region: 'East', cases: 35, revenue: 38000 },
    { region: 'West', cases: 32, revenue: 35000 },
    { region: 'Central', cases: 45, revenue: 48000 },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
            <p className="text-gray-600 mt-1">Comprehensive system analytics and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-1000-blue"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button className="bg-1000-blue hover:bg-1000-blue/90 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8" />
            <p className="text-sm opacity-90">Total Users</p>
          </div>
          <p className="text-4xl font-bold">342</p>
          <p className="text-sm opacity-75 mt-2">↑ 12.5% from last month</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8" />
            <p className="text-sm opacity-90">Cases Handled</p>
          </div>
          <p className="text-4xl font-bold">157</p>
          <p className="text-sm opacity-75 mt-2">↑ 8.3% from last month</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-8 h-8" />
            <p className="text-sm opacity-90">Revenue</p>
          </div>
          <p className="text-4xl font-bold">$125k</p>
          <p className="text-sm opacity-75 mt-2">↑ 18.7% from last month</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <p className="text-sm opacity-90">Satisfaction</p>
          </div>
          <p className="text-4xl font-bold">4.9/5</p>
          <p className="text-sm opacity-75 mt-2">↑ 0.3 from last month</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Case Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrends}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#1E40AF" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
              <Line yAxisId="right" type="monotone" dataKey="cases" stroke="#10B981" strokeWidth={2} name="Cases" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={3} name="Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Cases by Category */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cases by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={casesByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {casesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceMetrics}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Performance" dataKey="value" stroke="#1E40AF" fill="#1E40AF" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Regional Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Regional Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cases" fill="#1E40AF" name="Cases" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Month</th>
                <th className="text-left py-3 px-4 font-semibold">Users</th>
                <th className="text-left py-3 px-4 font-semibold">Cases</th>
                <th className="text-left py-3 px-4 font-semibold">Revenue</th>
                <th className="text-left py-3 px-4 font-semibold">Satisfaction</th>
                <th className="text-left py-3 px-4 font-semibold">Growth</th>
              </tr>
            </thead>
            <tbody>
              {monthlyTrends.map((data, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{data.month}</td>
                  <td className="py-3 px-4">{data.users}</td>
                  <td className="py-3 px-4">{data.cases}</td>
                  <td className="py-3 px-4">${(data.revenue / 1000).toFixed(0)}k</td>
                  <td className="py-3 px-4">
                    <span className="flex items-center gap-1">
                      ⭐ {data.satisfaction}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-medium">↑ {idx > 0 ? ((data.users - monthlyTrends[idx - 1].users) / monthlyTrends[idx - 1].users * 100).toFixed(1) : '0.0'}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AnalyticsContent;
