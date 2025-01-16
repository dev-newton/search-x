/** @format */

import React, { useState, useRef } from "react";

import { IoMdSearch, IoMdClose, IoMdTime } from "react-icons/io";

import "./index.css";

interface SearchInputProps {
  query: string;
  setQuery: (value: string) => void;
  searchHistory: string[];
  autocompleteItems: { id: number; title: string }[];
  onSearch: (query: string) => void;
  onEnter: (query: string) => void;
  onAutocompleteClick: (title: string) => void;
  onRemoveHistory: (item: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  query,
  setQuery,
  searchHistory,
  autocompleteItems,
  onSearch,
  onEnter,
  onAutocompleteClick,
  onRemoveHistory,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEnter(query);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleBlur = () => setIsFocused(false);
  const handleFocus = () => setIsFocused(true);

  const handleClearInput = () => {
    setQuery("");
  };

  const hasAutoCompleteItems =
    isFocused && query && autocompleteItems.length > 0;

  const combinedItems = [
    ...searchHistory.map((item, index) => ({
      id: `history-${index}`,
      title: item,
      type: "history",
    })),
    ...autocompleteItems
      .map((item) => ({
        ...item,
        type: "autocomplete",
      }))
      .slice(0, 10),
  ];

  return (
    <div
      className={`search md ${
        hasAutoCompleteItems ? "border-b-0" : "border-b-6"
      }`}
    >
      <div className="search-icon-wrapper">
        <IoMdSearch className="search-icon" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyPress}
        autoFocus
      />
      {query.length > 0 && (
        <div className="close-icon-wrapper">
          <IoMdClose className="close-icon" onClick={handleClearInput} />
        </div>
      )}
      {hasAutoCompleteItems && (
        <ul className="autocomplete-list">
          {combinedItems.map((item) => (
            <li
              key={item.id}
              className="autocomplete-list-row"
              onMouseDown={() => onAutocompleteClick(item.title)}
            >
              {item.type === "history" ? (
                <IoMdTime className="history-icon" />
              ) : (
                <IoMdSearch className="search-icon" />
              )}
              <div className="title-row">
                <p className={`${item.type === "history" ? "history" : ""}`}>
                  {item.title}
                </p>
                {item.type === "history" && (
                  <button
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onRemoveHistory(item.title);
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
