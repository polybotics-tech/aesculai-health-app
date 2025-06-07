import { Feather, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AiResponseFormatComponent,
  CautionComponent,
  NotFoundComponent,
  PrimaryButton,
} from "../../components/reuseables";
import { FormComponent } from "../../components/ui";
import { ScrollViewWrapper } from "../../components/wrappers";
import { useColor, useConstant, useDebounce } from "../../hooks";
import Helper__gemini from "../../hooks/helpers/gemini.api";
import Helper__storage from "../../hooks/helpers/storage.api";
import HealthLibrary from "../../lib/health";
import StringLibrary from "../../lib/string";

export default function AssessmentPage() {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({});

  //--
  const [bio, setBio] = useState({
    gender: "",
    age: "",
    weight: "",
    weight_unit: "Kilogram (kg)",
    height: "",
    height_unit: "Centimeter (cm)",
  });
  const [currentStage, setCurrentStage] = useState("bio");
  const assessmentStages = ["bio", "questionaire", "analysis"];

  const [analysis, setAnalysis] = useState(); //this will store the AI's final analysis

  //--
  const _navigateStages = useDebounce((type = "next") => {
    let pos = assessmentStages?.indexOf(currentStage);

    if (type === "next" && Boolean(pos < assessmentStages?.length - 1)) {
      setCurrentStage(assessmentStages[pos + 1]);
    }

    if (type === "prev" && Boolean(pos > 0)) {
      setCurrentStage(assessmentStages[pos - 1]);
    }

    return;
  });

  //--
  useEffect(() => {
    if (analysis && currentStage != "analysis") {
      setCurrentStage("analysis");
    }
  }, [analysis]);

  return (
    <>
      <StageHeaderComponent stage={currentStage} />

      {Boolean(currentStage === "bio") ? (
        <BioDataComponent
          form={bio}
          setForm={setBio}
          proceedToNext={_navigateStages}
        />
      ) : Boolean(currentStage === "questionaire") ? (
        <ConversationalComponent bioData={bio} setAnalysis={setAnalysis} />
      ) : Boolean(currentStage === "analysis") ? (
        <FinalAnalysisReportComponent
          bioData={bio}
          setBio={setBio}
          analysis={analysis}
          setAnalysis={setAnalysis}
          setCurrentStage={setCurrentStage}
        />
      ) : (
        <></>
      )}
    </>
  );
}

const StageHeaderComponent = ({ stage }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      padding: constant.size.m,
      gap: constant.size.xs,
    },
    title: {
      fontSize: constant.font.size.xb,
      fontWeight: constant.font.weight.bold,
      color: color.black,
    },
    description: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
    },
  });

  //--
  const stageDetails = {
    bio: {
      title: "Patient Bio Data",
      description: "Personalize your assessments with the patient's bio data",
    },
    questionaire: {
      title: "Assessment Questionaire",
      description:
        "Answer more structured questions from our AI to help with the assessment and analysis",
    },
    analysis: {
      title: "Final Analysis Result",
      description:
        "Here is a summary of the analysis derived from the assessment questions you just answered",
    },
  };

  return (
    <View style={styles.component}>
      <Text style={styles.title}>{stageDetails[stage]?.title}</Text>
      <Text style={styles.description}>{stageDetails[stage]?.description}</Text>
    </View>
  );
};

const BioDataComponent = ({
  form = {},
  setForm = () => {},
  isLoading,
  proceedToNext = () => {},
}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      paddingVertical: constant.size.xxb,
    },
    navBtn: {
      width: "100%",
      marginTop: constant.size.xxb * 2,
      gap: constant.size.m,
    },
  });

  //--
  const [activeSection, setActiveSection] = useState("gender");
  const sections = ["gender", "age", "weight", "height"];
  const pos = sections?.indexOf(activeSection);
  const targetPos = (item) => sections?.indexOf(item);

  //--
  const _navigateStages = useDebounce(() => {
    if (Boolean(pos < sections?.length - 1)) {
      setActiveSection(sections[pos + 1]);
    } else {
      if (Boolean(pos === sections?.length - 1)) {
        //proceed to next
        proceedToNext();
      }
    }
    return;
  });

  return (
    <ScrollViewWrapper style={styles.component}>
      {Boolean(pos >= targetPos("gender")) && (
        <FormComponent
          formType={"select"}
          label={"Patient's Gender"}
          placeholder={"Select the patient's gender"}
          inputIcon={
            <Octicons
              name="accessibility"
              size={constant.size.m}
              color={color.gray100}
            />
          }
          options={HealthLibrary.genders}
          name={"gender"}
          form={form}
          setForm={setForm}
        />
      )}

      {/**age */}
      {Boolean(pos >= targetPos("age")) && (
        <FormComponent
          formType={"input"}
          inputMode={"numeric"}
          label={"Patient's Age"}
          placeholder={"How old is the patient?"}
          inputIcon={
            <Octicons
              name="number"
              size={constant.size.m}
              color={color.gray100}
            />
          }
          name={"age"}
          form={form}
          setForm={setForm}
        />
      )}

      {/**weight */}
      {Boolean(pos >= targetPos("weight")) && (
        <>
          <FormComponent
            formType={"select"}
            label={"Unit Measurement for Weight"}
            placeholder={"Select the weight unit"}
            inputIcon={
              <Octicons
                name="check"
                size={constant.size.m}
                color={color.gray100}
              />
            }
            options={HealthLibrary.weight_units}
            name={"weight_unit"}
            form={form}
            setForm={setForm}
          />

          <FormComponent
            formType={"input"}
            inputMode={"numeric"}
            label={"Patient's Weight"}
            placeholder={"What does the patient weigh?"}
            inputIcon={
              <MaterialCommunityIcons
                name="weight-kilogram"
                size={constant.size.m}
                color={color.gray100}
              />
            }
            name={"weight"}
            form={form}
            setForm={setForm}
          />
        </>
      )}

      {/**height */}
      {Boolean(pos >= targetPos("height")) && (
        <>
          <FormComponent
            formType={"select"}
            label={"Unit Measurement for height"}
            placeholder={"Select the height unit"}
            inputIcon={
              <Octicons
                name="check"
                size={constant.size.m}
                color={color.gray100}
              />
            }
            options={HealthLibrary.height_units}
            name={"height_unit"}
            form={form}
            setForm={setForm}
          />

          <FormComponent
            formType={"input"}
            inputMode={"numeric"}
            label={"Patient's height"}
            placeholder={"How tall is the patient?"}
            inputIcon={
              <MaterialCommunityIcons
                name="human-male-height-variant"
                size={constant.size.m}
                color={color.gray100}
              />
            }
            name={"height"}
            form={form}
            setForm={setForm}
          />
        </>
      )}

      {/**navigation buttons */}
      <View style={styles.navBtn}>
        <PrimaryButton
          title={"Next"}
          onPress={_navigateStages}
          isLoading={isLoading}
        />
      </View>
    </ScrollViewWrapper>
  );
};

const ConversationalComponent = ({ bioData, setAnalysis }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      padding: constant.size.m,
      gap: constant.size.m,
    },
    inputBlock: {
      width: "100%",
      height: 120,
      padding: constant.size.m,
      flexDirection: "row",
      alignItems: "flex-end",
      gap: constant.size.m,
      borderRadius: constant.size.m,
      backgroundColor: color.gray50,
      borderWidth: 0.8,
      borderColor: color.gray100,
    },
    inputTab: {
      width: constant.dimension.width.subtract(
        constant.size.m,
        constant.size.m * 4,
        40
      ),
      height: "100%",
    },
    input: {
      width: "100%",
      height: "100%",
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
    },
    actions: {
      height: "100%",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    skip: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.semibold,
      color: color.primary,
    },
    button: (canSend) => ({
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: canSend ? color.primary : color.gray50,
      borderRadius: constant.size.r,
      borderWidth: 0.8,
      borderColor: canSend ? color.primary : color.gray100,
    }),
    scroll: {
      paddingHorizontal: 0,
    },
    checking: {
      width: 140,
      height: 32,
      marginRight: "auto",
      marginLeft: "auto",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: constant.size.s,
      backgroundColor: color.gray50,
    },
    checkingText: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
    },
    errBlock: {
      maxWidth: "80%",
      gap: constant.size.s,
    },
    errTab: {
      maxWidth: "100%",
      padding: constant.size.m,
      borderRadius: constant.size.s,
      backgroundColor: color.errorFaded,
    },
    errMsg: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.error,
    },
    errBtn: {
      paddingVertical: constant.size.s,
      paddingHorizontal: constant.size.m,
      marginLeft: "auto",
      flexDirection: "row",
      alignItems: "center",
      gap: constant.size.s,
      borderRadius: constant.size.xs,
      backgroundColor: color.error,
    },
    errBtnText: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.semibold,
      color: color.white,
    },
  });

  //--
  const inputRef = useRef(null);
  const [input, setInput] = useState("");

  //--
  const [messages, setMessages] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  //--
  const _clearInput = useDebounce(() => {
    setInput(""); //clear text in input
    if (inputRef?.current) {
      inputRef?.current?.blur(); //remove input focus
    }
  });

  const _updateConversationWithAiResp = (text) => {
    if (!text) return;

    const newMessage = { user: false, text };

    setMessages((prev) => [...prev, newMessage]);
    return true;
  };

  //--
  const [errorMsg, setErrorMsg] = useState("");
  const _submitAnswer = useDebounce(async (query = input) => {
    //format message object for user
    let updatedMessages = [...messages];

    if (query) {
      const userMessage = { user: true, text: query.trim() };

      updatedMessages = [...messages, userMessage]; //add the new message to the existing messages for submission to gemini for context continuity
      setMessages(updatedMessages);
    }

    //clear input
    _clearInput();

    //--reach out to gemini for assessment
    const res = await Helper__gemini.generateAssessmentQuestion(
      setIsChecking,
      updatedMessages,
      bioData
    );

    //--
    if (res) {
      if (res?.error) {
        setErrorMsg(res?.error);
        return;
      }

      if (res?.question) {
        _updateConversationWithAiResp(res?.question);
        setErrorMsg("");
        return;
      }

      if (res?.is_final_analysis) {
        setAnalysis(res?.results);
        setErrorMsg("");
        return;
      }
    }
  });

  //--launch ai questionaire on mount
  useEffect(() => {
    if (!messages || messages?.length < 1) {
      _submitAnswer("");
    }
  }, []);

  return (
    <View style={styles.component}>
      {/**input box */}
      <View style={styles.inputBlock}>
        <View style={styles.inputTab}>
          <TextInput
            placeholder="Type your answer here"
            placeholderTextColor={color.gray100}
            style={styles.input}
            value={input}
            onChangeText={(text) => {
              setInput(String(text));
            }}
            multiline={true}
            ref={inputRef}
          />
        </View>

        {/**action buttons */}
        <View style={styles.actions}>
          {/**clear input */}
          {Boolean(input) ? (
            <TouchableOpacity activeOpacity={0.6} onPress={_clearInput}>
              <Octicons name="x" size={constant.size.b} color={color.gray100} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                _submitAnswer("skip");
              }}
              disabled={isChecking}
            >
              <Text style={styles.skip}>Skip</Text>
            </TouchableOpacity>
          )}

          {/**submit input */}
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.button(Boolean(input))}
            onPress={() => _submitAnswer()}
            disabled={Boolean(!input || isChecking)}
          >
            {isChecking ? (
              <ActivityIndicator
                size={constant.size.m}
                color={input ? color.white : color.gray100}
              />
            ) : (
              <Feather
                name="send"
                size={constant.size.m}
                color={input ? color.white : color.gray100}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/**conversations */}
      <ScrollViewWrapper style={styles.scroll}>
        {/**loading indicator */}
        {isChecking && (
          <View style={styles.checking}>
            <Text style={styles.checkingText}>Processing...</Text>
          </View>
        )}

        {/**error template */}
        {Boolean(errorMsg && !isChecking) && (
          <View style={styles.errBlock}>
            <View style={styles.errTab}>
              <Text style={styles.errMsg}>{errorMsg}</Text>
            </View>
            <TouchableOpacity style={styles.errBtn}>
              <Text style={styles.errBtnText}>Retry</Text>
              <Octicons
                name="sync"
                size={constant.font.size.s}
                color={color.white}
              />
            </TouchableOpacity>
          </View>
        )}

        {/**conversation list */}
        {messages && messages?.length > 0 ? (
          messages
            ?.slice()
            ?.reverse()
            ?.map((item, index) => (
              <MessageComponent key={index} index={index} message={item} />
            ))
        ) : (
          <NotFoundComponent
            isLoading={false}
            text="Conversations will appear here"
          />
        )}
      </ScrollViewWrapper>
    </View>
  );
};

const MessageComponent = ({ message = {}, index }) => {
  const color = useColor();
  const constant = useConstant();

  const { user, text } = message;
  const isLatest = Boolean(index === 0);

  const styles = StyleSheet.create({
    user: {
      component: {
        maxWidth: "70%",
        marginLeft: "auto",
        padding: constant.size.m,
        borderRadius: constant.size.s,
        backgroundColor: color.primary,
      },
      text: {
        fontSize: constant.font.size.m,
        fontWeight: constant.font.weight.regular,
        color: color.white,
      },
    },
    ai: {
      component: {
        maxWidth: isLatest ? "100%" : "70%",
        paddingVertical: constant.size.m,
      },
      text: {
        fontSize: isLatest ? constant.font.size.xb : constant.font.size.m,
        fontWeight: isLatest
          ? constant.font.weight.bold
          : constant.font.weight.regular,
        color: isLatest ? color.black : color.gray100,
      },
    },
  });

  return (
    <>
      {user ? (
        <View style={styles.user.component}>
          <Text style={styles.user.text}>{text}</Text>
        </View>
      ) : (
        <View style={styles.ai.component}>
          <Text style={styles.ai.text}>
            <AiResponseFormatComponent response={text} />
          </Text>
        </View>
      )}
    </>
  );
};

const FinalAnalysisReportComponent = ({
  bioData,
  analysis,
  setAnalysis = () => {},
  setBio = () => {},
  setCurrentStage = () => {},
}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    sectionList: {
      width: "100%",
      marginVertical: constant.size.b,
      gap: constant.size.b,
    },
  });

  //--
  const _resetAnalysis = useDebounce(() => {
    setBio({
      gender: "",
      age: "",
      weight: "",
      weight_unit: "Kilogram (kg)",
      height: "",
      height_unit: "Centimeter (cm)",
    }); //clear all entries

    setAnalysis(); //remove current analysis
    setCurrentStage("bio"); //return stage to bio data
  });

  //--
  const [isSaving, setIsSaving] = useState(false);
  const _downloadOrShare = useDebounce(async () => {
    await Helper__storage.save_assessment_analysis_as_pdf(
      setIsSaving,
      analysis,
      bioData
    );
  });

  //--
  return (
    <ScrollViewWrapper>
      {/**disclaimer */}
      <CautionComponent
        title="Disclaimer"
        message="Our advanced AI system assesses medical history based on the information provided during the questionaire, and tries to diagnose the underlying condition, as well as provide some recommendations. However, it does not in any way replaces medical judgements, and should be used for educational purposes only."
      />

      {/**analysis */}
      <View style={styles.sectionList}>
        {/**descriptive analysis */}
        <DescriptiveAnalysisComponent
          percentage={analysis?.ai_confidence_in_result_percentange}
          analysis={analysis?.descriptive_analysis}
        />

        {/**possible diagnosis */}
        <PossibleDiagnosisComponent diagnosis={analysis?.possible_diagnosis} />

        {/**analysis breakdown */}
        <AnalysisDetailsComponent details={analysis?.analysis_details} />

        {/**recommendations */}
        <RecommendationsComponent recommendations={analysis?.recommendations} />

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
    </ScrollViewWrapper>
  );
};

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
