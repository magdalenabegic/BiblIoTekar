import { useState } from "react";
import { api } from "~/utils/api";
import { cn } from "~/utils/css";

import Image from "next/image";
import PolicaIcon from "/src/layouts/main/assets/polica.svg";
import KutijaIcon from "/src/layouts/main/assets/kutija.svg";
import PendingIcon from "/src/layouts/main/assets/pending.svg";
import { locationsRouter } from "~/server/api/routers/locations";

const LocationPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<number | undefined | null>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<"year" | "udk">("year");

  const locationsQuery = api.locations.getAll.useQuery();
  const booksQuery = api.books.getByLocation.useQuery({ locationId: selectedLocation ?? null }, {
    enabled: undefined !== selectedLocation, // Only run this query if a location is selected
    refetchInterval: 2000,
  });

  const locations = locationsQuery.data;
  const books = booksQuery.data;

  const img = (obj: { src: string; width: number; height: number }) => ({
    src: obj.src,
    width: obj.width,
    height: obj.height,
  });

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

  const handleSort = (field: "year" | "udk") => {
    if (sortField === field) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc"); // Reset to ascending when switching fields
    }
  };

  const sortedBooks = books?.slice().sort((a, b) => {
    let order = 0;

    switch (sortField) {
      case "year":
        order = (a.year ?? 0) - (b.year ?? 0);
      case "udk":
        order = a.udk?.localeCompare(b.udk ?? "") ?? 0;
    }

    if (sortOrder === "asc") {
      return order;
    } else {
      return -order;
    }
  });

  return (
    <div className="m-20 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-left text-3xl text-black-dark font-bold">Pregled lokacija</h1>
        <p className="text-left pt-2">Odaberite lokaciju za koju želite vidjeti pregled literature.</p>
        <div className="flex gap-2 pt-4 rounded-full">
          {locations.map((location) => (
            <button
              key={location.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${selectedLocation === location.id ? 'bg-gray-200' : 'bg-white'} border border-gray-300`}
              onClick={() => setSelectedLocation(location.id)}
            >
              {getLocationIcon(location.name)} {location.name}
            </button>
          ))}
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${selectedLocation === null ? 'bg-gray-200' : 'bg-white'} border border-gray-300`}
            onClick={() => setSelectedLocation(null)}
          >
            {getLocationIcon("Izvan knjižnice")} Izvan knjižnice
          </button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2">
        <h1 className="text-black-light text-center text-2xl font-bold pt-4 pb-4">Pregled literature</h1>
        {booksQuery.isLoading && <div>Loading books...</div>}
        {sortedBooks && (
          <table className="border-separate p-4 border-spacing-x-12 border-spacing-y-1 border border-gray-300 rounded-lg">
            <thead>
              <tr className="text-gray-700">
                <th>Naslov</th>
                <th>Autor</th>
                <th className="cursor-pointer" onClick={() => handleSort("year")}>
                  Godina {sortField === "year" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="cursor-pointer" onClick={() => handleSort("udk")}>
                  UDK {sortField === "udk" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Status</th>
                <th>Lokacija</th>
              </tr>
            </thead>
            <tbody>
              {sortedBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.year}</td>
                  <td className="text-center">{book.udk ?? "/"}</td>
                  <td>{book.bookStatus}</td>
                  <td>{book.location?.name ?? <em className="italic">Nepoznato</em>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {selectedLocation && sortedBooks?.length === 0 && <div>No books for this location</div>}
      </div>
    </div>
  );
};

export default LocationPage;
