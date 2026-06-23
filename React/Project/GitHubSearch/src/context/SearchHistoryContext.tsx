import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type SearchHistoryContextValue = {
  history: string[];
  addHistory: (username: string) => void;
  clearHistory: () => void;
};

const SearchHistoryContext = createContext<SearchHistoryContextValue | null>(
  null
);

type SearchHistoryProviderProps = {
  children: ReactNode;
};

export function SearchHistoryProvider({
  children,
}: SearchHistoryProviderProps) {
  const [history, setHistory] = useState<string[]>([]);

  function addHistory(username: string) {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return;
    }

    setHistory((currentHistory) => [trimmedUsername, ...currentHistory]);
  }

  function clearHistory() {
    setHistory([]);
  }

  return (
    <SearchHistoryContext.Provider
      value={{ history, addHistory, clearHistory }}
    >
      {children}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext);

  if (!context) {
    throw new Error(
      "useSearchHistory must be used inside SearchHistoryProvider"
    );
  }

  return context;
}
