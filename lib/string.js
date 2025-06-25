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
  format_app_terms_and_privacy_policy: (policy = "") => {
    const lines = policy.trim().split("\n").filter(Boolean);

    return lines.map((line) => {
      let style = "regular";

      if (/^[A-Z][A-Za-z\s]+:$/.test(line)) {
        style = "bold";
      } else if (/^\d+\.\s/.test(line)) {
        style = "semibold";
      } else if (
        line.startsWith("Privacy Policy") ||
        line.startsWith("Terms of Use") ||
        line.startsWith("Last Updated:") ||
        line.startsWith("Contact Us") ||
        line.startsWith("Changes to This Privacy Policy") ||
        line.startsWith("Children's Privacy") ||
        line.startsWith("Your Rights and Choices") ||
        line.startsWith("Third-Party Services Used") ||
        line.startsWith("How We Protect Data") ||
        line.startsWith("How We Use Your Information")
      ) {
        style = "bold";
      }

      // Find links (URLs and emails)
      const parts = [];
      const regex =
        /((https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}))/gi;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push({
            text: line.slice(lastIndex, match.index),
            type: "text",
          });
        }

        parts.push({ text: match[0], type: "link" });
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < line.length) {
        parts.push({ text: line.slice(lastIndex), type: "text" });
      }

      return { style, parts };
    });
  },
};

export default StringLibrary;
