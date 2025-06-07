import * as FileSystem from "expo-file-system";
import { printToFileAsync } from "expo-print";
import * as Sharing from "expo-sharing";
import ErrorLibrary from "../../lib/error";
import ImageLibrary from "../../lib/image";
import PdfLibrary from "../../lib/pdf";
import StringLibrary from "../../lib/string";
import useAlert from "../useAlert";

const Helper__storage = {
  save_imaging_analysis_as_pdf: async (
    setLoading = () => {},
    analysis,
    base64Image
  ) => {
    try {
      setLoading(true);

      if (!analysis || !base64Image) return null;

      const logoBase64 = await ImageLibrary.generate_logo_base64();
      //generate html content
      const htmlContent = PdfLibrary.generate_html_content__imaging_analysis(
        analysis,
        base64Image,
        logoBase64
      );

      const { uri } = await printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      const newPath =
        FileSystem.documentDirectory +
        `${StringLibrary.generate_pdf_name("imaging")}`;

      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      // Optional: allow sharing the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath);
        useAlert(`Analysis shared successfully`).success();
      } else {
        useAlert(`Analysis downloaded successfully`).success();
      }

      return newPath;
    } catch (error) {
      console.log("err: ", error);
      ErrorLibrary.extract(
        {
          message: `Analysis download error: ${error?.message}`,
        },
        true
      );
      return null;
    } finally {
      setLoading(false);
    }
  },
  save_assessment_analysis_as_pdf: async (
    setLoading = () => {},
    analysis,
    bio
  ) => {
    try {
      setLoading(true);

      if (!analysis || !bio) return null;

      const logoBase64 = await ImageLibrary.generate_logo_base64();
      //generate html content
      const htmlContent = PdfLibrary.generate_html_content__assessment_analysis(
        analysis,
        bio,
        logoBase64
      );

      const { uri } = await printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      const newPath =
        FileSystem.documentDirectory +
        `${StringLibrary.generate_pdf_name("assessment")}`;

      await FileSystem.moveAsync({
        from: uri,
        to: newPath,
      });

      // Optional: allow sharing the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(newPath);
        useAlert(`Analysis shared successfully`).success();
      } else {
        useAlert(`Analysis downloaded successfully`).success();
      }

      return newPath;
    } catch (error) {
      console.log("err: ", error);
      ErrorLibrary.extract(
        {
          message: `Analysis download error: ${error?.message}`,
        },
        true
      );
      return null;
    } finally {
      setLoading(false);
    }
  },
};

export default Helper__storage;
