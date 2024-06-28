import { api } from "~/utils/api";
import { BookStatus } from "~/utils/constants/book";

const PagePending = () => {
  const { data: pendingBooks, error, isLoading, refetch } = api.books.getPending.useQuery();
  const updateStatusMutation = api.books.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const updateBookStatus = async (bookId: number, status: BookStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: bookId, status });
    } catch (err) {
      console.error('Failed to update book status:', err);
    }
  };

  if (isLoading) return <div>Loading books...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-black-light text-center text-2xl font-bold pb-4">Trenutni procesi</h1>
        <div className="w-full max-w-4xl">
          {pendingBooks && (
            <table className="border-separate p-4 border-spacing-x-12 border-spacing-y-1 border border-gray-300 rounded-lg">
              <thead>
                <tr className="text-gray-700">
                  <th className="py-2 px-4 border-b">Naslov</th>
                  <th className="py-2 px-4 border-b">Autor</th>
                  <th className="py-2 px-4 border-b">Godina</th>
                  <th className="py-2 px-4 border-b">UDK</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Akcije</th>
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
                    <td className="py-2 px-4 border-b">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          className="bg-teal-500 text-white px-4 py-2 rounded"
                          onClick={() => updateBookStatus(book.id, BookStatus.Lent)}
                        >
                          Posudi
                        </button>
                        {/* <button
                          className="bg-violet-500 text-white px-4 py-2 rounded"
                          onClick={() => updateBookStatus(book.id, BookStatus.Available)}
                        >
                          Razduži
                        </button> */}
                      </div>
                    </td>
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
