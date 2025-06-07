import axios from "axios";
import ErrorLibrary from "../../lib/error";
import HealthLibrary from "../../lib/health";

const MED_ARTICLE_URL_SEARCH_ID =
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi";
const MED_ARTICLE_URL_SUMMARY =
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi";

const ARTICLE_MAX_RES = 50; // how many to fetch per page
const PUBMED_TOTAL = 1000; // assume max possible for randomness
const MEDICAL_TERMS = HealthLibrary.medical_search_terms;

const Helper__article = {
  searchMedicalArticles: async (setLoading = () => {}, query, page = 1) => {
    try {
      setLoading(true);

      //--calculate offset
      const offset = Math.floor(
        Math.random() * (PUBMED_TOTAL - ARTICLE_MAX_RES)
      );
      const retstart = (page - 1) * ARTICLE_MAX_RES + offset;

      const term =
        query ||
        MEDICAL_TERMS[Math.floor(Math.random() * MEDICAL_TERMS.length)];

      //--search PubMed for articles related to the topic
      const searchRes = await axios.get(MED_ARTICLE_URL_SEARCH_ID, {
        params: {
          db: "pubmed",
          term: term,
          retmode: "json",
          retmax: ARTICLE_MAX_RES,
          retstart: retstart,
        },
      });

      const ids = searchRes?.data?.esearchresult?.idlist;
      if (!ids || ids.length === 0) {
        return { error: "No articles found for this topic." };
      }

      //--fetch summary details for the article IDs
      const summaryRes = await axios.get(MED_ARTICLE_URL_SUMMARY, {
        params: {
          db: "pubmed",
          id: ids.join(","),
          retmode: "json",
        },
      });

      //--format and extract articles
      const summaries = summaryRes?.data?.result;
      const articles = ids.map((id) => {
        const article = summaries?.[id];

        return {
          id,
          summary: article?.title,
          journal: article?.fulljournalname,
          source: article?.source,
          pubDate: article?.pubdate,
          authors: article?.authors?.map((a) => a.name).join(", "),
          link: `https://pubmed.ncbi.nlm.nih.gov/${id}`,
        };
      });

      return { articles };
    } catch (error) {
      const errMsg = ErrorLibrary.extract(error, true);
      return { error: `Something went wrong. `, errMsg };
    } finally {
      setLoading(false);
    }
  },
};

export default Helper__article;
