import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  AiResponseFormatComponent,
  CautionComponent,
  ImageView,
} from "../../components/reuseables";
import { useAlert, useColor, useConstant, useDebounce } from "../../hooks";
import Helper__gemini from "../../hooks/helpers/gemini.api";
import StringLibrary from "../../lib/string";
import { _Action_addMessage } from "../../redux/slice/chat.slice";
import ImageLibrary from "../../lib/image";

export default function ChatsPage() {
  const constant = useConstant();

  const styles = StyleSheet.create({
    scroll: {
      width: "100%",
      minHeight: "100%",
      gap: constant.size.m,
      padding: constant.size.m,
      paddingBottom: constant.size.set(64),
    },
  });

  //--
  const messages = useSelector((state) => state.chat.messages);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat when messages change
    if (scrollRef.current) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);
  //--
  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        ref={scrollRef}
      >
        {messages && messages.length > 0 ? (
          <>
            <CautionComponent
              title="Disclaimer"
              message="Reponses from the AI Chatbot are for information purposes only and should not be considered medical advices from a qualified professional"
            />
            {messages.map((item, index) => (
              <MessageComponent key={index} message={item} />
            ))}
          </>
        ) : (
          <NoMessageComponent />
        )}
      </ScrollView>

      <ChatInputComponent />
    </>
  );
}

const ChatInputComponent = ({}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      paddingHorizontal: constant.size.m,
      paddingVertical: constant.size.s,
      backgroundColor: color.white,
      borderTopWidth: 0.8,
      borderTopColor: color.gray50,
      position: "relative",
    },
    loadingBlock: {
      width: constant.dimension.width.full,
      height: 56,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: -56,
      left: 0,
    },
    loadingTab: {
      height: 40,
      paddingHorizontal: constant.size.xb,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: constant.size.xs,
      borderRadius: constant.size.r,
      backgroundColor: color.white,
      borderWidth: 0.8,
      borderColor: color.gray50,
    },
    loadingText: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
    },
    inputTab: {
      width: "100%",
      paddingHorizontal: constant.size.m,
      paddingVertical: constant.size.s,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: constant.size.m,
      borderRadius: constant.size.s,
      backgroundColor: color.gray50,
    },
    input: {
      height: "100%",
      width: constant.dimension.width.subtract(
        constant.size.m,
        constant.size.m * 4,
        18
      ),
      paddingVertical: constant.size.m,
      borderRadius: constant.size.s,
      backgroundColor: color.gray50,
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.black,
    },
    button: {
      width: constant.size.set(18),
      height: constant.size.set(48),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
  });

  //--
  const inputRef = useRef();
  const [input, setInput] = useState("");
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  //--
  const messages = useSelector((state) => state.chat.messages); //get all messages from the global store
  const dispatch = useDispatch(); //dispatch function to update the global store

  //--
  const _clearInput = () => {
    setInput(""); //clear text in input
    if (inputRef?.current) {
      inputRef?.current?.blur(); //remove input focus
    }
  };

  const _sendMessage = useDebounce(async () => {
    if (!input.trim()) return;

    //format message object for user
    const userMessage = { user: true, text: input.trim() };

    const updatedMessages = [...messages, userMessage]; //add the new message to the existing messages for submission to gemini for context continuity

    dispatch(_Action_addMessage({ message: userMessage })); //add user message to messages list
    _clearInput(); //clear input

    const aiReply = await Helper__gemini.generateChatReply(
      setIsGeneratingResponse,
      updatedMessages
    ); //submit messages to gemini for reply

    const aiMessage = { user: false, text: aiReply?.trim() }; //format ai response for storing

    dispatch(_Action_addMessage({ message: aiMessage })); //add ai message to messages list
  });

  //--
  return (
    <View style={styles.component}>
      {/**loading tab */}
      {isGeneratingResponse && (
        <View style={styles.loadingBlock}>
          <View style={styles.loadingTab}>
            <Feather
              name="cloud"
              size={constant.size.m}
              color={color.gray100}
            />
            <Text style={styles.loadingText}>
              Generating response, please wait...
            </Text>
          </View>
        </View>
      )}

      {/**input tab */}
      <View style={styles.inputTab}>
        <TextInput
          placeholder="Ask anything"
          placeholderTextColor={color.gray100}
          value={String(input)}
          onChangeText={(text) => setInput(text)}
          multiline={true}
          numberOfLines={5}
          style={styles.input}
          selectionColor={color.gray100}
          cursorColor={color.gray100}
          ref={inputRef}
        />

        {isGeneratingResponse ? (
          <TouchableOpacity style={styles.button} disabled={true}>
            <ActivityIndicator size={constant.size.m} color={color.gray100} />
          </TouchableOpacity>
        ) : (
          <>
            {Boolean(input) ? (
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.button}
                onPress={_sendMessage}
              >
                <Feather
                  name="send"
                  size={constant.size.m}
                  color={color.gray200}
                />
              </TouchableOpacity>
            ) : (
              <>
                {/* <TouchableOpacity style={styles.button}>
                <Feather
                  name="mic"
                  size={constant.size.m}
                  color={color.gray200}
                />
              </TouchableOpacity> */}
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const NoMessageComponent = ({}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      gap: constant.size.m,
    },
    logo: {
      width: 200,
      height: 200,
      overflow: "hidden",
    },
    details: {
      gap: constant.size.xxs,
    },
    username: {
      fontSize: constant.font.size.xb,
      fontWeight: constant.font.weight.bold,
      color: color.black,
      textAlign: "center",
      textTransform: "capitalize",
    },
    request: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
      textAlign: "center",
    },
  });

  //--
  const user = useSelector((state) => state.app.user);

  return (
    <View style={styles.component}>
      {/**ai chat logo */}
      <View style={styles.logo}>
        <ImageView uri={ImageLibrary.load_app_logo()} blur="" />
      </View>

      <View style={styles.details}>
        <Text style={styles.username}>
          Hey, {StringLibrary.extract_first_name(user?.full_name)}
        </Text>
        <Text style={styles.request}>What can I help you with today?</Text>
      </View>
    </View>
  );
};

const MessageComponent = ({ message }) => {
  const color = useColor();
  const constant = useConstant();

  const { user, text } = message;

  const styles = StyleSheet.create({
    component: {
      maxWidth: user ? constant.dimension.width.ratio(1 / 1.45) : "100%",
      paddingHorizontal: constant.size.m,
      paddingVertical: constant.size.s,
      borderRadius: constant.size.s,
      backgroundColor: user ? color.primary : color.gray50,
    },
    text: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: user ? color.white : color.gray200,
    },
  });

  //--
  const _copyToClipboard = async () => {
    await Clipboard.setStringAsync(text);

    useAlert("Message copied to clipboard").pending();
  };

  //--
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onLongPress={_copyToClipboard}
      style={[
        styles.component,
        user ? { marginLeft: "auto" } : { marginRight: "auto" },
      ]}
    >
      <Text style={styles.text}>
        <AiResponseFormatComponent response={text} />
      </Text>
    </TouchableOpacity>
  );
};
