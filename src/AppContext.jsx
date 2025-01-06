import React from "react";

const defaultValues = { idx: 33 };

export const AppContext = React.createContext(defaultValues);

export const AppContextProvider = ({ children }) => {
  const [idx, setIdx] = React.useState(defaultValues.idx);

  return (
    <AppContext.Provider
      value={{
        idx,
        setIdx,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
