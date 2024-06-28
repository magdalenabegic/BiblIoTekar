import React from 'react';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface ChartWidgetProps {
  title: string;
  data: Array<{ name: string; totalBooks: number }>;
  chartType: 'bar' | 'pie';
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ title, data, chartType }) => {
  const renderChart = (): React.ReactElement => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalBooks" fill="#99CFFB" barSize={60} />
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie data={data} dataKey="totalBooks" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#99CFFB" />
            <Tooltip />
          </PieChart>
        );
      default:
        return <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl h-full p-4 border border-gray-300 rounded-lg">
      <div className="flex justify-between w-full mb-4">
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartWidget;
