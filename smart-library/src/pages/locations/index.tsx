import { useState } from "react";
import { api } from "~/utils/api";
import Image from "next/image";
import PolicaIcon from "/src/layouts/main/assets/polica.svg";
import KutijaIcon from "/src/layouts/main/assets/kutija.svg";
import PendingIcon from "/src/layouts/main/assets/pending.svg";
import { locationsRouter } from "~/server/api/routers/locations";

const MAX_LOCATIONS = 4;

const LocationPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<number | undefined>(undefined);

  const locationsQuery = api.locations.getAll.useQuery();
  const booksQuery = api.books.getByLocation.useQuery({ locationId: selectedLocation }, {
    enabled: !!selectedLocation, // Only run this query if a location is selected
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
        return <Image {...img(PolicaIcon as never)} alt="ikonaPolice" className="w-6 h-6"/>
      case 'Plava polica':
        return <Image {...img(PolicaIcon as never)} alt="ikonaPolice" className="w-6 h-6"/>
      case 'Kutija':
        return <Image {...img(KutijaIcon as never)} alt="ikonaKutije" className="w-6 h-6"/>
      case 'Izvan knjižnice':
        return <Image {...img(PendingIcon as never)} alt="ikonaPending" className="w-6 h-6"/>
      default:
        return null;
    }
  };

  return (
    <div className="m-20 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-left text-3xl font-bold">Pregled lokacija</h1>
        <p className="text-left">Odaberite lokaciju za koju želite vidjeti pregled literature.</p>
        <div className="flex gap-2 p-4 rounded-full bg-gray-100">
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

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-3xl font-bold">Books</h1>
        {booksQuery.isLoading && <div>Loading books...</div>}
        {books && (
          <table className="border-separate border-spacing-x-4 border-spacing-y-1">
            <thead>
              <tr>
                <th>Naslov</th>
                <th>Autor</th>
                <th>Godina</th>
                <th>UDK</th>
                <th>Status</th>
                <th>Lokacija</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
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
        {selectedLocation && books?.length === 0 && <div>No books for this location</div>}
      </div>
    </div>
  );
};

export default LocationPage;