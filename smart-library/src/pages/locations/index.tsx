import { useState } from "react";
import { api } from "~/utils/api";

const LocationPage = () => {
  const [selectedLocation, setSelectedLocation] = useState<number | undefined>(undefined);

  const locationsQuery = api.locations.getAll.useQuery();
  const booksQuery = api.books.getByLocation.useQuery({ locationId: selectedLocation }, {
    enabled: !!selectedLocation, // Only run this query if a location is selected
  });

  const locations = locationsQuery.data;
  const books = booksQuery.data;

  if (locationsQuery.isLoading) {
    return <div>Loading locations...</div>;
  }

  if (!locations) {
    return <div>Failed to load locations</div>;
  }

  return (
    <div className="m-auto flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-3xl font-bold">Locations</h1>
        <div className="flex gap-2">
          {locations.map((location) => (
            <button
              key={location.id}
              className="px-4 py-2 rounded bg-gray-200"
              onClick={() => setSelectedLocation(location.id)}
            >
              {location.id}
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
