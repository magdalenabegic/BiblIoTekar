import { useCallback, useState, useEffect } from "react";
import { api } from "~/utils/api";
import { BookStatus } from "~/utils/constants/book";
import styles from './index.module.css';

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Image from "next/image";
import PolicaIcon from "/src/layouts/main/assets/polica.svg";
import KutijaIcon from "/src/layouts/main/assets/kutija.svg";
import PendingIcon from "/src/layouts/main/assets/pending.svg";
import { locationsRouter } from "~/server/api/routers/locations";

const MAX_LOCATIONS = 4;
const COLORS = ["#99CFEB", "#95D6C6", "#E2725B", "#C8FABB", "#6489C6"];

const Reports = () => {
  const [selectedLocation, setSelectedLocation] = useState<number | undefined>(0); // Default to 'Svi izvještaji'
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const locationsQuery = api.locations.getAll.useQuery();
  const booksQuery = api.books.getAll.useQuery();
  const timestampsQuery = api.books.getByTimestamp.useQuery();
  const bookLogsQuery = api.bookLogs.getAll.useQuery();

  const locations = locationsQuery.data;
  const books = booksQuery.data;
  const timestamps = timestampsQuery.data;
  const bookLogs = bookLogsQuery.data;

  const img = (obj: { src: string; width: number; height: number }) => ({
    src: obj.src,
    width: obj.width,
    height: obj.height,
  });

  useEffect(() => {
    // Select 'Svi izvještaji' by default
    if (!selectedLocation && locations && locations.length > 0) {
      setSelectedLocation(0);
    }
  }, [locations, selectedLocation]);

  if (locationsQuery.isLoading) {
    return <div>Loading locations...</div>;
  }

  if (!locations) {
    return <div>Failed to load locations</div>;
  }

  const getLocationIcon = (name: string) => {
    switch (name) {
      case 'Crvena polica':
        return <Image {...img(PolicaIcon as never)} alt="ikonaPolice" className="w-6 h-6" />;
      case 'Plava polica':
        return <Image {...img(PolicaIcon as never)} alt="ikonaPolice" className="w-6 h-6" />;
      case 'Kutija':
        return <Image {...img(KutijaIcon as never)} alt="ikonaKutije" className="w-6 h-6" />;
      case 'Izvan knjižnice':
        return <Image {...img(PendingIcon as never)} alt="ikonaPending" className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedBooks = books?.slice().sort((a, b) => {
    if (sortOrder === "asc") {
      return a.year - b.year;
    } else {
      return b.year - a.year;
    }
  });

  const processChartData = (logs) => {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const data = daysOfWeek.map(day => ({
      name: day,
      Lent: 0,
    }));

    logs.forEach(log => {
      const day = new Date(log.createdAt).getDay();
      if (day === 0 || day === 6) return; // Exclude weekends
      const dayIndex = day - 1; // Adjust for Monday-based index
      if (log.bookStatus === "lent") {
        data[dayIndex].Lent += 1;
      }
    });

    return data;
  };


  const processBarChartData = (books, locations) => {
    const data = locations.map(location => ({
      name: location.name,
      totalBooks: books.filter(book => book.locationId === location.id).length,
    }));

    return data;
  };

  const processPieChartData = (books, field) => {
    const dataMap = books.reduce((acc, book) => {
      const key = book[field];
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key]++;
      return acc;
    }, {});

    return Object.keys(dataMap).map(key => ({
      name: key,
      value: dataMap[key],
    }));
  };

  const chartDataTimestamps = processChartData(timestamps || []);
  const chartDataLogs = processChartData(bookLogs || []);
  const barChartData = processBarChartData(books || [], locations || []);
  const pieChartDataByUDK = processPieChartData(books?.filter(book => book.location?.name === 'Crvena polica') || [], 'udk');
  const pieChartDataByYear = processPieChartData(books?.filter(book => book.location?.name === 'Crvena polica') || [], 'year');

  return (
    <div className="m-20 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-left text-3xl text-black-dark font-bold">Pregled izvještaja</h1>
        <p className="text-left pt-2">Odaberite lokaciju za koju želite vidjeti izvještaj.</p>
        <div className="flex gap-2 pt-4 rounded-full">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${selectedLocation === 0 ? 'bg-gray-200' : 'bg-white'} border border-gray-300`}
            onClick={() => setSelectedLocation(0)}
          >
            Svi izvještaji
          </button>
          {locations.slice(0, MAX_LOCATIONS).map((location) => (
            <button
              key={location.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${selectedLocation === location.id ? 'bg-gray-200' : 'bg-white'} border border-gray-300`}
              onClick={() => setSelectedLocation(location.id)}
            >
              {getLocationIcon(location.name)} {location.name}
            </button>
          ))}
        </div>
      </div>
  
      <div className="flex flex-row items-start gap-2">
        {booksQuery.isLoading && <div>Loading books...</div>}
        {selectedLocation === 0 ? (
          <>
            <div className={styles.widget}>
              <h1>Broj knjiga po lokaciji</h1>
              <ResponsiveContainer width={600} height={400}>
                <BarChart
                  data={barChartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalBooks" fill="#99CFEB" barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
  
            <div className={styles.widget}>
              {bookLogsQuery.isLoading && <div>Loading logs...</div>}
              {!bookLogsQuery.isLoading && bookLogsQuery.data && (
                <div className="widget">
                  <h1>Broj posuđenih knjiga kroz tjedan</h1>
                  <ResponsiveContainer width={600} height={400}>
                    <AreaChart
                      data={chartDataLogs}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorLent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area type="monotone" dataKey="Available" stroke="#8884d8" fillOpacity={1} fill="url(#colorAvailable)" />
                      <Area type="monotone" dataKey="Lent" stroke="#82ca9d" fillOpacity={1} fill="url(#colorLent)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </>
        ) : selectedLocation === locations.find(location => location.name === 'Crvena polica')?.id ? (
          <>
            <div className={styles.widget}>
              <h1>Broj knjiga po UDK-u</h1>
              <ResponsiveContainer width={500} height={400}>
                <PieChart>
                  <Pie dataKey="value" data={pieChartDataByUDK} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {pieChartDataByUDK.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={styles.widget}>
              <h1>Broj knjiga po godini</h1>
              <ResponsiveContainer width={500} height={400}>
                <PieChart>
                  <Pie dataKey="value" data={pieChartDataByYear} cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label>
                    {pieChartDataByYear.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          sortedBooks?.length === 0 && <div>No books for this location</div>
        )}
      </div>
    </div>
  );  
};

export default Reports;
