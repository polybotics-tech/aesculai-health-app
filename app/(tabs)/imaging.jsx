import { Octicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  CautionComponent,
  NotFoundComponent,
  PrimaryButton,
} from "../../components/reuseables";
import { FormComponent, ImagingPhotoComponent } from "../../components/ui";
import { ScrollViewWrapper } from "../../components/wrappers";
import { useColor, useConstant, useDebounce } from "../../hooks";
import Helper__gemini from "../../hooks/helpers/gemini.api";
import Helper__storage from "../../hooks/helpers/storage.api";
import HealthLibrary from "../../lib/health";
import StringLibrary from "../../lib/string";

export default function ImagingPage() {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    holder: {
      width: "100%",
      gap: constant.size.m,
      paddingBottom: constant.size.b,
    },
    sectionTitle: {
      width: "100%",
      fontSize: constant.font.size.xb,
      fontWeight: constant.font.weight.bold,
      color: color.black,
      textAlign: "center",
    },
    sectionList: {
      width: "100%",
      marginVertical: constant.size.b,
      gap: constant.size.b,
    },
  });

  //--
  const [form, setForm] = useState({
    image: {
      uri: "",
      base64: "",
    },
    modality: "",
    region: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [analysis, setAnalysis] = useState();
  const _submitForAnalysis = useDebounce(async () => {
    const res = await Helper__gemini.analyzeImaging(setIsLoading, form);

    if (res?.results) {
      setAnalysis(res?.results);
    } else if (res?.error) {
      setAnalysis({ error: res?.error });
    } else {
      setAnalysis();
    }
  });

  //--
  const _resetAnalysis = useDebounce(() => {
    setForm({
      image: {
        uri: "",
        base64: "",
      },
      modality: "",
      region: "",
    }); //clear all entries

    setAnalysis(); //remove current analysis
  });

  //--
  const [isSaving, setIsSaving] = useState(false);
  const _downloadOrShare = useDebounce(async () => {
    await Helper__storage.save_imaging_analysis_as_pdf(
      setIsSaving,
      analysis,
      form?.image?.base64
    );
  });

  //--
  return (
    <ScrollViewWrapper>
      {/**disclaimer */}
      <CautionComponent
        title="Disclaimer"
        message="Our advanced AI system analyzes medical imagings to assist healthcare professionals in identifying abnormalities and potential concerns. However, it does not in any way replaces medical judgements, and should be used for educational purposes only."
      />

      {/**imaging component */}
      <ImagingPhotoComponent
        form={form}
        setForm={setForm}
        name="image"
        isLoading={isLoading}
      />

      {/**imagin modality and region */}
      <View style={styles.holder}>
        <FormComponent
          formType={"select"}
          label={"Imaging Modality"}
          placeholder={"Select the imaging presented"}
          name={"modality"}
          form={form}
          setForm={setForm}
          inputIcon={
            <Octicons
              name="image"
              size={constant.size.m}
              color={color.gray100}
            />
          }
          disabled={Boolean(
            isLoading ||
              analysis?.descriptive_analysis ||
              analysis?.analysis_details
          )}
          options={HealthLibrary.imaging_modalities}
        />

        <FormComponent
          formType={"select"}
          label={"Body Region"}
          placeholder={"Select the target body region"}
          name={"region"}
          form={form}
          setForm={setForm}
          inputIcon={
            <Octicons
              name="accessibility"
              size={constant.size.m}
              color={color.gray100}
            />
          }
          disabled={Boolean(
            isLoading ||
              analysis?.descriptive_analysis ||
              analysis?.analysis_details
          )}
          options={HealthLibrary.imaging_body_regions}
        />
      </View>

      {!analysis ? (
        <PrimaryButton
          title={"Analyze imaging"}
          isLoading={isLoading}
          onPress={_submitForAnalysis}
          disabled={Boolean(
            !form?.modality || !form?.region || !form?.image?.uri
          )}
        />
      ) : (
        <>
          {/**analysis section */}
          <Text style={styles.sectionTitle}>Analysis Results</Text>

          {Boolean(analysis?.error) ? (
            <View style={styles.sectionList}>
              <NotFoundComponent isLoading={false} text={analysis?.error} />

              {/**action buttons */}
              <>
                <PrimaryButton
                  title="Reset Parameters"
                  type={"secondary"}
                  onPress={_resetAnalysis}
                />
              </>
            </View>
          ) : (
            <View style={styles.sectionList}>
              {/**descriptive analysis */}
              <DescriptiveAnalysisComponent
                percentage={analysis?.ai_confidence_in_result_percentange}
                analysis={analysis?.descriptive_analysis}
              />

              {/**possible diagnosis */}
              <PossibleDiagnosisComponent
                diagnosis={analysis?.possible_diagnosis}
              />

              {/**analysis breakdown */}
              <AnalysisDetailsComponent details={analysis?.analysis_details} />

              {/**recommendations */}
              <RecommendationsComponent
                recommendations={analysis?.recommendations}
              />

              {/**action buttons */}
              <>
                <PrimaryButton
                  title="Download"
                  isLoading={isSaving}
                  onPress={_downloadOrShare}
                />
                <PrimaryButton
                  title="Reset"
                  type={"secondary"}
                  onPress={_resetAnalysis}
                />
              </>
            </View>
          )}
        </>
      )}
    </ScrollViewWrapper>
  );
}

const DescriptiveAnalysisComponent = ({ percentage, analysis }) => {
  const color = useColor();
  const constant = useConstant();

  const _format = StringLibrary.format_confidence_by_percentage(percentage);

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      padding: constant.size.m,
      gap: constant.size.s,
      borderRadius: constant.size.s,
      backgroundColor: Boolean(_format?.rating === "high")
        ? color.successFaded
        : Boolean(_format?.rating === "good")
        ? color.primaryFaded
        : color.errorFaded,
    },
    title: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.bold,
      color: Boolean(_format?.rating === "high")
        ? color.success
        : Boolean(_format?.rating === "good")
        ? color.primary
        : color.error,
    },
    description: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
      lineHeight: 20,
    },
  });

  //--
  return (
    <View style={styles.component}>
      <Text style={styles.title}>
        AI Confidence: {_format?.context} [{percentage}%]
      </Text>
      <Text style={styles.description}>{analysis}</Text>
    </View>
  );
};

const PossibleDiagnosisComponent = ({ diagnosis }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      padding: constant.size.m,
      gap: constant.size.s,
      borderRadius: constant.size.s,
      backgroundColor: color.gray50,
    },
    title: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.bold,
      color: color.black,
    },
    description: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
      lineHeight: 20,
    },
  });

  //--
  return (
    <View style={styles.component}>
      <Text style={styles.title}>Possible Diagnosis</Text>
      <Text style={styles.description}>{diagnosis}</Text>
    </View>
  );
};

const AnalysisDetailsComponent = ({ details }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      padding: constant.size.m,
      gap: constant.size.xm,
      borderRadius: constant.size.s,
      backgroundColor: color.gray50,
    },
    title: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.bold,
      color: color.black,
    },
    flexList: {
      width: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: constant.size.s,
    },
    item: {
      padding: constant.size.s,
      gap: constant.size.xs,
      borderRadius: constant.size.xs,
      backgroundColor: color.white,
    },
    name: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.semibold,
      color: color.gray200,
    },
    value: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
    },
    nobreak: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
    },
  });

  //--
  return (
    <View style={styles.component}>
      <Text style={styles.title}>Analysis Details Breakdown</Text>

      <View style={styles.flexList}>
        {details && details?.length > 0 ? (
          details?.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.name}>{item?.title}</Text>
              <Text style={styles.value}>{item?.details}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.nobreak}>No breakdown available</Text>
        )}
      </View>
    </View>
  );
};

const RecommendationsComponent = ({ recommendations }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      padding: constant.size.m,
      gap: constant.size.xm,
      borderRadius: constant.size.s,
      backgroundColor: color.gray50,
    },
    title: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.bold,
      color: color.black,
    },
    flexList: {
      width: "100%",
      gap: constant.size.m,
    },
    item: {
      width: "100%",
      flexDirection: "row",
      alignItems: "flex-start",
      gap: constant.size.xs,
    },
    value: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
    },
    nobreak: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
    },
  });

  //--
  return (
    <View style={styles.component}>
      <Text style={styles.title}>Recommendations</Text>

      <View style={styles.flexList}>
        {recommendations && recommendations?.length > 0 ? (
          recommendations?.map((item, index) => (
            <View key={index} style={styles.item}>
              <Octicons
                name="dot"
                size={constant.font.size.s}
                color={color.gray100}
              />
              <Text style={styles.value}>{item}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.nobreak}>No recommendations available</Text>
        )}
      </View>
    </View>
  );
};
