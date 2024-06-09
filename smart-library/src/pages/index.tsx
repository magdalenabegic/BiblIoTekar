import { useCallback, useState } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import { BookStatus } from "~/utils/constants/book";
import { $tryAsync } from "~/utils/try";

type TBook = RouterOutputs["books"]["getAll"][number];

const BookRow = (props: {
  book: TBook;
  updateBooksQuery?: () => Promise<unknown>;
}) => {
  const updateBookStatusMutation = api.books.updateStatus.useMutation();

  const { book, updateBooksQuery } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [bookStatusValue, setBookStatusValue] = useState(book.bookStatus);

  const setBookStatus = useCallback(
    async (props: { status: BookStatus }) => {
      setIsLoading(true);

      const result = await $tryAsync(async () => {
        const result = await updateBookStatusMutation.mutateAsync({
          id: book.id,
          status: props.status,
        });

        setBookStatusValue(props.status);

        if (updateBooksQuery) {
          await updateBooksQuery();
        }

        return result;
      });

      setIsLoading(false);

      return result;
    },
    [book.id, updateBookStatusMutation, updateBooksQuery],
  );

  return (
    <tr key={book.id}>
      <td>{book.title}</td>
      <td>{book.author}</td>
      <td>{book.year}</td>
      <td className="text-center">{book.udk ?? "/"}</td>
      <td>
        <select
          className="w-full cursor-pointer rounded px-2 py-1"
          value={bookStatusValue}
          disabled={isLoading}
          onChange={(e) => {
            void setBookStatus({
              status: e.target.value as BookStatus,
            });
          }}
        >
          {Object.entries(BookStatus).map(([name, value]) => (
            <option key={name} value={value}>
              {name}
            </option>
          ))}
        </select>
      </td>
      <td>{book.location?.name ?? <em className="italic">Nepoznato</em>}</td>
      <td className="text-center">/</td>
    </tr>
  );
};

export default function Home() {
  const booksQuery = api.books.getAll.useQuery(undefined, {
    refetchInterval: 5000,
  });
  const books = booksQuery.data;

  if (booksQuery.isLoading) {
    return <div className="m-auto">Loading...</div>;
  }

  if (!books) {
    return <div className="m-auto">Something went wrong</div>;
  }

  if (books.length === 0) {
    return <div className="m-auto">No books</div>;
  }

  return (
    <div className="m-auto flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-3xl font-bold">Books</h1>

        <table className="border-separate border-spacing-x-4 border-spacing-y-1">
          <thead>
            <tr>
              <th>Naslov</th>
              <th>Autor</th>
              <th>Godina</th>
              <th>UDK</th>
              <th>Status</th>
              <th>Lokacija</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <BookRow
                key={book.id}
                book={book}
                updateBooksQuery={() => booksQuery.refetch()}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
