import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { cn } from "~/utils/css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import PolicaIcon from "/src/layouts/main/assets/polica.svg";
import KutijaIcon from "/src/layouts/main/assets/kutija.svg";
import PendingIcon from "/src/layouts/main/assets/pending.svg";
import { locationsRouter } from "~/server/api/routers/locations";

const MAX_LOCATIONS = 4;

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

  const chartData = processChartData(books || []);

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

      <div className="flex flex-col items-start gap-2">
        {booksQuery.isLoading && <div>Loading books...</div>}
        {selectedLocation === 0 ? (
          <ResponsiveContainer width="100%" height={400}>
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
        ) : (
          sortedBooks?.length === 0 && <div>No books for this location</div>
        )}
      </div>
    </div>
  );
};

export default Reports;
