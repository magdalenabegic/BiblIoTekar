import React from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const RecentBookLogsTable = () => {
  const { data: recentLogs, error } = useSWR('/api/recentBookLogs', fetcher);

  if (!recentLogs) return <div>Loading recent logs...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Book ID</th>
            <th className="px-4 py-2 border-b">Title</th>
            <th className="px-4 py-2 border-b">Author</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Date</th>
          </tr>
        </thead>
        <tbody>
          {recentLogs.map((log) => (
            <tr key={log.bookId}>
              <td className="px-4 py-2 border-b">{log.bookId}</td>
              <td className="px-4 py-2 border-b">{log.bookTitle}</td>
              <td className="px-4 py-2 border-b">{log.bookAuthor}</td>
              <td className={`px-4 py-2 border-b ${log.bookStatus === 'lent' ? 'text-red-500' : 'text-green-500'}`}>
                {log.bookStatus}
              </td>
              <td className="px-4 py-2 border-b">{new Date(log.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentBookLogsTable;
