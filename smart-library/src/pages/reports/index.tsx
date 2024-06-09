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
  const booksQuery = api.books.getAll.useQuery(); // Assuming you have a query to get all books

  const locations = locationsQuery.data;
  const books = booksQuery.data;

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
        return <Image {...img(PolicaIcon as never)} alt="ikonaPolice" className="w-6 h-6" />
      case 'Plava polica':
        return <Image {...img(PolicaIcon as never)} alt="ikonaPolice" className="w-6 h-6" />
      case 'Kutija':
        return <Image {...img(KutijaIcon as never)} alt="ikonaKutije" className="w-6 h-6" />
      case 'Izvan knjižnice':
        return <Image {...img(PendingIcon as never)} alt="ikonaPending" className="w-6 h-6" />
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

  const processChartData = (books) => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const data = daysOfWeek.map(day => ({
      name: day,
      available: 0,
      lent: 0,
    }));

    books.forEach(book => {
      const day = new Date(book.added_at).getDay();
      if (book.status === "available") {
        data[day].available += 1;
      } else if (book.status === "lent") {
        data[day].lent += 1;
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

  const chartData = processChartData(books || []);
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
        <ResponsiveContainer width="50%" height={400}>
          <AreaChart
            data={chartData}
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
            <Area type="monotone" dataKey="available" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            <Area type="monotone" dataKey="lent" stackId="1" stroke="#ff7f7f" fill="#ff7f7f" />
          </AreaChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="50%" height={400}>
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
            <Bar dataKey="totalBooks" fill="#99CFEB" barSize={60}/>
          </BarChart>
        </ResponsiveContainer>
      </>
    ) : selectedLocation === locations.find(location => location.name === 'Crvena polica')?.id ? (
      <>
        <div className={styles.widget}>
          <h1>Broj knjiga po UDK-u</h1>
          <ResponsiveContainer width="100%" height={400}>
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
          <ResponsiveContainer width="100%" height={400}>
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
