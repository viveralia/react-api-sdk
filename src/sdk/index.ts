import { initQueryClient, useTsRestQueryClient } from "@ts-rest/react-query";
import { contract } from "./contract";

export const sdk = initQueryClient(contract, {
  baseUrl: "http://localhost:3001",
  baseHeaders: {},
});

export const useSDKClient = () => {
  return useTsRestQueryClient(sdk);
};
