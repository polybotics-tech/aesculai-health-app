import { GEMINI_API_KEY, GEMINI_API_MODEL, GEMINI_API_VERSION } from "@env";
import axios from "axios";
import ErrorLibrary from "../../lib/error";
import StringLibrary from "../../lib/string";

const API_KEY = GEMINI_API_KEY; //fix - fetch gemini key from env or constant later

const API_MODEL = GEMINI_API_MODEL; // gemini-1.0-pro, (gemini-pro), gemini-1.5-pro-002, gemini-2.0-flash
const API_VERSION = GEMINI_API_VERSION;

const GEMINI_URL = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${API_MODEL}:generateContent?key=${API_KEY}`;

const Helper__gemini = {
  generateChatReply: async (setLoading = () => {}, messages) => {
    try {
      setLoading(true);

      //format messages for Gemini API
      const formattedMessages = messages.map((msg) => ({
        role: msg.user ? "user" : "model",
        parts: [
          {
            text: `${msg.text}`,
          },
        ],
      }));

      /*
        prompt: "If this question is health or medically related, you must answer it as though you were a medical assistant. (But do not state that in your answer). However, if it is just a greeting or pleasantry, answer fluently and conversationally",
      */

      const response = await axios.post(GEMINI_URL, {
        contents: formattedMessages,
      });

      const aiMessage =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiMessage) {
        ErrorLibrary.extract(
          {
            message: "Connection error. Please try again.",
          },
          true
        );
        return "Sorry, I couldn't generate a response at the time. Could you resend your message?";
      }

      //return the recieved message
      return aiMessage;
    } catch (error) {
      ErrorLibrary.extract(error, false);
      return "Sorry, I couldn't generate a response at the time. Could you resend your message?";
    } finally {
      setLoading(false);
    }
  },
  searchDrugsByName: async (setLoading = () => {}, query = "") => {
    try {
      setLoading(true);

      if (!query) return null;

      const prompt = `You are a knowledgeable pharmacy assistant. A user is searching for a drug using any term — it could be a partial brand name, generic name, or manufacturer (e.g., "meropenem by pfizer" or "meronem manufactured by pfizer").

Your task is to find and return up to 30 related drugs that closely match the query: "${query}".

Return the result in this exact JSON format:

{
  "result": [
    {
      "brand_name": "",
      "manufacturer_name": "",
      "generic_names": [""]
    }
  ]
}

If no matching drugs are found, return this exact JSON:

{ "error": "Unable to find the drug - ${query}" }

 Important Note:
- Only return valid JSON.
- Do not include any markdown, explanation, or extra text.
- If the input is vague, infer the most likely related drugs using common pharmaceutical knowledge.`;

      const response = await axios.post(GEMINI_URL, {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      });

      const data = response?.data;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      const result = StringLibrary.parse_gemini_json_array_result(text);

      return result;
    } catch (error) {
      return { error: ErrorLibrary.extract(error, true) };
    } finally {
      setLoading(false);
    }
  },
  searchForDrugDetails: async (
    setLoading = () => {},
    drugName = "",
    manufacturerName = ""
  ) => {
    try {
      setLoading(true);

      if (!drugName || !manufacturerName) return null;

      const prompt = `You are a pharmacy assistant. Give detailed information about the drug "${drugName}" manufactured by "${manufacturerName}", in this exact JSON format:

{
  "brand_name": "",
  "manufacturer_name": "",
  "generic_names": [],
  "product_type": "",
  "description": "",
  "modes_of_intake": [],
  "active_ingredients": [],
  "inactive_ingredients": [],
  "possible_dosages": [],
  "uses_and_purposes": [],
  "side_effects": [],
  "stop_use_if": [],
  "do_not_use_if": [],
  "pregnancy_warnings": [],
  "infant_warnings": []
}. 

Return only the array without the Markdown formatting.`; //json format can be adjusted to fit use case later on

      const response = await axios.post(GEMINI_URL, {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      });

      const data = response?.data;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      const result = StringLibrary.parse_gemini_json_array_result(text);

      if (result?.brand_name) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    } finally {
      setLoading(false);
    }
  },
  extractDrugNameFromPhoto: async (setLoading = () => {}, base64Image = "") => {
    try {
      setLoading(true);

      if (!base64Image) return null;

      const prompt = `You are a pharmacy assistant. From the image provided, try to identify the name of the drug (brand, generic, or manufacturer) visible in the photo. Return the drug result in this exact JSON format:
      
      {
      "drug_name": "",
      "got_manufacturer_name": false,
      "manufacturer_name": ""
      }

      If no drug name is visible or it's unreadable, respond with exactly: { "error": "Unable to read drug name from photo" }

 Important Note:
- Only return valid JSON.
- Do not include any markdown, explanation, or extra text.`;

      const response = await axios.post(GEMINI_URL, {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
      });

      const data = response?.data;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      const result = StringLibrary.parse_gemini_json_array_result(text);

      return result;
    } catch (error) {
      ErrorLibrary.extract(error, true);
      return null;
    } finally {
      setLoading(false);
    }
  },
  analyzeImaging: async (setLoading = () => {}, form) => {
    try {
      setLoading(true);

      const { image, modality, region } = form;

      if (!modality || !region || !image?.base64) return null;

      const { base64 } = image;

      const prompt = `
You are a certified medical imaging analyst AI with expertise in interpreting clinical imaging scans.

You will be provided with:
- An imaging photo in base64 format
- The imaging modality (e.g., X-ray, CT Scan, MRI, Ultrasound)
- The body region being imaged (e.g., brain, chest, knee)

Analyze the provided image carefully and return a structured JSON response using this exact format:

{
  "results": {
    "ai_confidence_in_result_percentange": number (between 1 and 100),
    "descriptive_analysis": string,
    "possible_diagnosis": string,
    "analysis_details": [
      {
        "title": string,
        "details": string
      }
    ],
    "recommendations": [string]
  }
}

If you are unable to analyze the image due to low clarity, poor input quality, or uncertainty, do not guess. Instead, return this exact JSON:

{
  "error": "Reason why analysis could not be completed"
}

Make sure your output is strictly a JSON object with no explanation or markdown formatting. Be factual, medically neutral, and concise.

Base64 image: ${base64}
Modality: ${modality}
Body region: ${region}
`;
      const response = await axios.post(GEMINI_URL, {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
      });

      const data = response?.data;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      const result = StringLibrary.parse_gemini_json_array_result(text);

      return result;
    } catch (error) {
      ErrorLibrary.extract(error, true);
      return null;
    } finally {
      setLoading(false);
    }
  },
  generateAssessmentQuestion: async (
    setLoading = () => {},
    messages,
    biodata
  ) => {
    try {
      setLoading(true);

      if (!biodata) {
        const errMsg = ErrorLibrary.extract({
          message: "Bio data must be provided",
        });
        return { error: `Unable to initialize AI questionaire. ${errMsg}` };
      }

      const prompt = `
You are a clinical AI assistant designed to help medical personnel take detailed patient histories and provide diagnostic insights. 
You must follow this structured format for history taking: 
Chief Complaint, History of Present Illness (HPI), Past Medical History, Medications, Allergies, Family History, Social History, and Review of Systems.

You are talking to a medical personnel who is reporting the patient's case to you — so you should phrase your questions accordingly, e.g., 
"What is the patient's main complaint?" or "Has the patient had any history of diabetes?"

When the conversation is complete and enough information has been gathered, respond with a structured medical summary and recommendations. 

The patient is anonymized so only age, sex, weight, and height are known. And here are the available patient bio-data for you to work with: 
 - Gender (sex): ${biodata?.gender}
 - Age: ${biodata?.age}
 - Weight: ${biodata?.weight} ${biodata?.weight_unit}
 - Height: ${biodata?.height} ${biodata?.height_unit}

If any question is replied with "skip" or "SKIP", it means it may not be relevant at the moment or the patient can not provide adequate answer to that question. So go ahead, and ask the next necessary question or proceed to final analysis if needed.
`;

      const persistancePrompt = `Remember, you must respond strictly in JSON format. Depending on the stage of the interaction, your response must follow one of the two structures below:

If you want to ask the next medical question:
{
  "question": "Your next question here"
}

If you are ready to give your final analysis:
{
  "is_final_analysis": true,
  "results": {
    "ai_confidence_in_result_percentange": number(1-100),
    "descriptive_analysis": "Summary of findings",
    "possible_diagnosis": "Your differential diagnosis",
    "analysis_details": [{"title": "Section Title", "details": "Details of the section"}],
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  }
}

If an error occurs, or you're unable to continue:
{
  "error": "Short description of what went wrong"
}

Respond ONLY in one of these JSON formats. Do NOT include any additional explanation, markdown, or comments. Your entire response must be valid JSON.`;

      const reminder = `Remember, you must respond strictly in any of the earlier agreed JSON format.`;

      //format messages for Gemini API
      const formattedMessages = messages?.map((msg) => ({
        role: msg.user ? "user" : "model",
        parts: [
          {
            text: `${msg.text}`,
          },
        ],
      }));

      //append prompt and formatted messages
      const contents = [
        { role: "user", parts: [{ text: `${prompt}${persistancePrompt}` }] },
        ...formattedMessages,
        { role: "user", parts: [{ text: `${reminder}` }] },
      ];

      const response = await axios.post(GEMINI_URL, {
        contents,
      });

      const data = response?.data;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      const result = StringLibrary.parse_gemini_json_array_result(text);

      return result;
    } catch (error) {
      const errMsg = ErrorLibrary.extract(error, true);
      return { error: `Something went wrong. ${errMsg}` };
    } finally {
      setLoading(false);
    }
  },
};

export default Helper__gemini;
