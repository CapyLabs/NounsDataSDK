import { createContext, useContext } from "react";
// import { NounsDataClient } from "../../library/dist/NounsDataClient.js";
import { NounsDataClient } from "nounsdata/dist/NounsDataClient";

/**
 * Configure NounsDataClient & create context.
 */
const nounsDataClient = new NounsDataClient()

const NounsDataContext = createContext({nounsDataClient: nounsDataClient});

export const NounsDataWrapper = ({ children }: any) => {
  return (
    <NounsDataContext.Provider value={{nounsDataClient}}>
      {children}
    </NounsDataContext.Provider>
  );
};

/**
 * Provide access to NounsDataClient.
 * @example const { nounsDataClient } = useNounsDataContext()
 * @returns NounsDataClient
 */

export const useNounsDataContext = () => useContext(NounsDataContext);