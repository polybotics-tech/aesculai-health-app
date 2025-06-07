import { jsonrepair } from "jsonrepair";

const StringLibrary = {
  convert_array_to_strings: (array, splitNewLine = false) => {
    let string = "";

    if (array && Array.isArray(array) && array[0]) {
      array?.forEach((arr, index) => {
        if (index > 0) {
          if (splitNewLine) {
            string += `. \n${arr}`;
          } else {
            string += `, ${arr}`;
          }
        } else {
          string += `${arr}`;
        }
      });
    } else {
      string = String(array);
    }

    return string;
  },
  parse_gemini_json_array_result: (text) => {
    if (!text) return null;

    // Remove Markdown code block formatting
    const cleaned = text
      .replace(/```json/g, "") // Remove ```json
      .replace(/```/g, "") // Remove any closing ```
      .trim();

    try {
      return JSON.parse(cleaned); // Try parsing cleaned text
    } catch (err) {
      console.log("Failed to parse array:", err, "\nRaw text:", cleaned);
      const repaired = jsonrepair(cleaned); //attempt to repair
      return repaired;
    }
  },
  generate_profile_photo_path: (uri, id = "") => {
    if (!uri) return null;

    const extension = uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
    const uuid = Date.now();

    const path = `${id}/profile-avatar-${uuid}.${extension}`;
    return path;
  },
  generate_pdf_name: (type = "imaging") => {
    const PdfType = {
      imaging: "IMAGING-ANALYSIS-RESULT",
      assessment: "ASSESSMENT-ANALYSIS-RESULT",
    };

    const uuid = Date.now();

    return `${PdfType[type]}-${uuid}.pdf`;
  },
  extract_first_name: (name = "") => {
    if (!name) return "";

    const first_name = String(name)?.split(" ")[0];

    return first_name;
  },
  extract_photo_path_from_url: (url = "", bucket = "avatars") => {
    if (!url) return "";

    const path = String(url)?.split(`/${bucket}/`)?.pop();
    return path;
  },
  format_confidence_by_percentage: (percentage = 0) => {
    let percent = Number(percentage);

    if (percent >= 70) {
      return { context: "High", rating: "high" };
    }

    if (percent < 70 && percent >= 40) {
      return { context: "Acceptable", rating: "good" };
    }

    if (percent < 40 && percent >= 30) {
      return { context: "Low", rating: "bad" };
    }

    return { context: "Very Low", rating: "bad" };
  },
};

export default StringLibrary;
