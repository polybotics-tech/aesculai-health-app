import { RAPIDAPI_HOST, RAPIDAPI_KEY } from "@env";
import axios from "axios";
import ErrorLibrary from "../../lib/error";

//--api credentials from "rapid-api - all meds database" [https://rapidapi.com/uchihahamada/api/all-meds-database/playground/apiendpoint_4113c8e1-8b05-4011-b981-19a51a59106b]

const RAPIDAPI_KEY = RAPIDAPI_KEY;
const RAPIDAPI_HOST = RAPIDAPI_HOST;
const CONTENT_TYPE = "application/json";

const API_URL = "https://all-meds-database.p.rapidapi.com/";

//request config headers (as required by the api)
const config = {
  headers: {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": RAPIDAPI_HOST,
    "Content-Type": CONTENT_TYPE,
  },
};

const Helper__drug = {
  searchByName: async (setLoading = () => {}, drugName = "", pageNum = 1) => {
    try {
      setLoading(true);

      if (!drugName.trim()) return null; // Return null if drugName is empty

      //setup request data
      const request_data = {
        action: "search",
        q: String(drugName)?.trim(),
        page: pageNum,
      };

      const response = await axios.post(API_URL, request_data, config);

      const { count, page, results } = response?.data;

      if (results && results?.length > 0) {
        return { results, count, page };
      } else {
        return { error: "Unable to complete drug search" };
      }
    } catch (error) {
      console.log("err: ", error);
      ErrorLibrary.extract(error, true);
      return { error: "Unable to complete drug search" };
    } finally {
      setLoading(false);
    }
  },
  fetchDetailsById: async (setLoading = () => {}, uuid = "") => {
    try {
      setLoading(true);
      if (!uuid) return null;

      //setup request data
      const request_data = {
        action: "getDetails",
        q: String(uuid),
      };

      const response = await axios.post(API_URL, request_data, config);

      const { data } = response?.data;

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      //ErrorLibrary.extract(error, true);
      return null;
    } finally {
      setLoading(false);
    }
  },
};

export default Helper__drug;
