import { useState, useEffect } from "react";
import _ from "lodash";

const SearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState("");

  // Debounce to reduce API calls
  const debouncedSearch = _.debounce((val) => {
    onSearch(val);
  }, 500);

  useEffect(() => {
    debouncedSearch(term);
    return () => debouncedSearch.cancel();
  }, [term]);

  return (
    <input
      type="text"
      value={term}
      onChange={(e) => setTerm(e.target.value)}
      placeholder="Search products..."
      className="
        w-full px-6 md:px-8 py-4
        rounded-full
        mb-8
        bg-[var(--color-card)]
        text-[var(--color-text)]
        placeholder:text-[var(--color-muted)]
        border border-[var(--color-border)]
        shadow-sm hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
        text-lg transition
      "
    />
  );
};

export default SearchBar;