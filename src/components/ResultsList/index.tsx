/** @format */

import "./index.css";
import Pagination from "../Pagination";

interface Result {
  id: number;
  title: string;
  description: string;
  url: string;
}

interface ResultsListProps {
  results: Result[];
  metadata: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage?: number;
}

const ResultsList: React.FC<ResultsListProps> = ({
  results,
  metadata,
  currentPage,
  setCurrentPage,
  itemsPerPage = 5,
}) => {
  const paginatedResults = results.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="results">
      {results.length > 0 && <hr />}
      {results.length > 0 && <p className="meta">{metadata}</p>}
      <ul>
        {paginatedResults.map((result) => (
          <li key={result.id}>
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              {result.title}
            </a>
            <p>{result.description}</p>
          </li>
        ))}
      </ul>

      {results.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={results.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ResultsList;
