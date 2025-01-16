/** @format */

import { useState } from "react";

import  localDB  from "./data/search_data.json";
import SearchInput from "./components/SearchInput";
import ResultsList from "./components/ResultsList";

interface Result {
  id: number;
  title: string;
  description: string;
  url: string;
}

function App() {
  const [query, setQuery] = useState<string>("");
  const [autocompleteItems, setAutocompleteItems] = useState<Result[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1); 

  const handleSearch = (query: string) => {
    if (!query) {
      setAutocompleteItems([]);
      return;
    }

    const filtered = localDB.filter((item) =>
      item.title.toLowerCase().startsWith(query.toLowerCase())
    );
    setAutocompleteItems(filtered);
  };

  const handleAutocompleteClick = (title: string) => {
    performSearch(title);
  };

  const handleEnter = (query: string) => {
    performSearch(query);
  };

  const handleRemoveHistory = (itemToRemove: string) => {
    setSearchHistory((prevHistory) =>
      prevHistory.filter((item) => item !== itemToRemove)
    );
  };


  const performSearch = (query: string) => {
    const startTime = performance.now();

    const filtered = localDB.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    const endTime = performance.now();
    setSearchTime(endTime - startTime);

    setResults(filtered);
    setCurrentPage(1);

    if (query && !searchHistory.includes(query)) {
      setSearchHistory([...searchHistory, query]);
    }
  };

  const resetSearch = () => {
    setQuery("");
    setResults([]);
    setAutocompleteItems([]);
    setCurrentPage(1);
  };

  const metadata = `Found ${results.length} result(s) in ${searchTime.toFixed(
    2
  )} ms`;

  return (
    <div className="app">
      <div className={`main ${results.length ? "row" : "col"}`}>
        <button
          className="logo-button"
          onClick={resetSearch}
        >
          SearchX
        </button>

        <div className={`search-wrapper ${results.length ? "lg" : "md"}`}>
          <SearchInput
            query={query}
            setQuery={setQuery}
            searchHistory={searchHistory}
            autocompleteItems={autocompleteItems}
            onSearch={handleSearch}
            onEnter={handleEnter}
            onAutocompleteClick={handleAutocompleteClick}
            onRemoveHistory={handleRemoveHistory}
          />
        </div>
      </div>

      <div className="results-wrapper">
        <ResultsList results={results} metadata={metadata} currentPage={currentPage}
          setCurrentPage={setCurrentPage} itemsPerPage={10} />
      </div>
    </div>
  );
}

export default App;
