import { Octicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  PolicyTextFormatComponent,
  PrimaryButton,
} from "../../components/reuseables";
import { FormComponent } from "../../components/ui";
import { PopupModalWrapper } from "../../components/wrappers";
import { useColor, useConstant, useDebounce } from "../../hooks";
import Helper__supabase from "../../hooks/helpers/supabase.api";
import { router } from "expo-router";
import HealthLibrary from "../../lib/health";
import StringLibrary from "../../lib/string";

export default function AuthRegister() {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    page: {
      gap: constant.size.m,
    },
    button: {
      marginTop: constant.size.b,
    },
  });

  //--
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [privacySigned, setPrivacySigned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const _registerNewUser = useDebounce(async () => {
    const res = await Helper__supabase.registerUser(setIsLoading, form);

    if (res) {
      setTimeout(() => {
        router.dismissTo("/(tabs)/");
      }, 2000);
    }
  });

  return (
    <View style={styles.page}>
      {/**email */}
      <FormComponent
        formType={"input"}
        inputMode={"email"}
        inputIcon={
          <Octicons name="mail" size={constant.size.m} color={color.gray100} />
        }
        label={"Email address"}
        placeholder={"Ex. johndoe@example.com"}
        name={"email"}
        form={form}
        setForm={setForm}
      />

      {/**password */}
      <FormComponent
        formType={"input"}
        inputMode={"password"}
        inputIcon={
          <Octicons name="lock" size={constant.size.m} color={color.gray100} />
        }
        label={"Password"}
        placeholder={"Enter new password"}
        name={"password"}
        form={form}
        setForm={setForm}
      />

      {/**confirm password */}
      <FormComponent
        formType={"input"}
        inputMode={"password"}
        inputIcon={
          <Octicons name="lock" size={constant.size.m} color={color.gray100} />
        }
        label={"Password"}
        placeholder={"Repeat new password"}
        name={"confirmPassword"}
        form={form}
        setForm={setForm}
      />

      {/**privacy policy */}
      <PrivacyPolicy value={privacySigned} setValue={setPrivacySigned} />

      {/**button */}
      <View style={styles.button}>
        <PrimaryButton
          title={"Create account"}
          isLoading={isLoading}
          onPress={_registerNewUser}
          disabled={Boolean(
            !form?.email ||
              !form?.password ||
              !form?.confirmPassword ||
              !privacySigned
          )}
        />
      </View>
    </View>
  );
}

const PrivacyPolicy = ({ value = false, setValue = () => {} }) => {
  const color = useColor();
  const constant = useConstant();
  const styles = StyleSheet.create({
    link: {
      color: color.primary,
      fontWeight: constant.font.weight.semibold,
    },
  });

  //--
  const [privacyIsVisible, setPrivacyIsVisible] = useState(false);
  const [termsIsVisible, setTermsIsVisible] = useState(false);

  const privacyPolicy = HealthLibrary.weird_policy_text;
  const formattedPrivacyLines =
    StringLibrary.format_app_terms_and_privacy_policy(privacyPolicy);

  const termsOfUse = HealthLibrary.weird_terms_use_text;
  const formattedTermsLines =
    StringLibrary.format_app_terms_and_privacy_policy(termsOfUse);

  return (
    <>
      <FormComponent
        formType={"checkbox"}
        value={value}
        setValue={setValue}
        label={
          <Text>
            I have read, and agree to Aesculai{" "}
            <Text style={styles.link} onPress={() => setTermsIsVisible(true)}>
              Terms of Use
            </Text>{" "}
            and{" "}
            <Text
              style={styles.link}
              onPress={() => {
                setPrivacyIsVisible(true);
              }}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        }
      />

      {/**terms popup */}
      <PopupModalWrapper
        title={"Terms of Use"}
        isVisible={termsIsVisible}
        setIsVisible={setTermsIsVisible}
      >
        <PolicyTextFormatComponent formattedLines={formattedTermsLines} />
      </PopupModalWrapper>

      {/**privacy popup */}
      <PopupModalWrapper
        title={"Privacy Policy"}
        isVisible={privacyIsVisible}
        setIsVisible={setPrivacyIsVisible}
      >
        <PolicyTextFormatComponent formattedLines={formattedPrivacyLines} />
      </PopupModalWrapper>
    </>
  );
};
