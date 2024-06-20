import { useState } from "react";
import { api } from "~/utils/api";
const PagePending = () => {
  const { data: pendingBooks, error, isLoading } = api.books.getPending.useQuery();

  if (isLoading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error.message}</div>;


  return (<div className="flex justify-center items-center min-h-screen">
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-black-light text-center text-2xl font-bold pb-4">Procesi u tijeku</h1>
      <div className="w-full max-w-4xl">
        {pendingBooks && (
          <table className="border-separate p-4 border-spacing-x-12 border-spacing-y-1 border border-gray-300 rounded-lg">
            <thead>
              <tr className="text-gray-700">
                <th className="py-2 px-4 border-b">Naslov</th>
                <th className="py-2 px-4 border-b">Autor</th>
                <th className="py-2 px-4 border-b">
                  Godina
                </th>
                <th className="py-2 px-4 border-b">
                  UDK
                </th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {pendingBooks.map(book => (
                <tr key={book.id}>
                  <td className="py-2 px-4 border-b">{book.title}</td>
                  <td className="py-2 px-4 border-b">{book.author}</td>
                  <td className="py-2 px-4 border-b">{book.year}</td>
                  <td className="py-2 px-4 border-b">{book.udk ?? "/"}</td>
                  <td className="py-2 px-4 border-b">{book.bookStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
);
};

export default PagePending;