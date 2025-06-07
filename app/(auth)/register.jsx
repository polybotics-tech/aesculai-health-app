import { Octicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../../components/reuseables";
import { FormComponent } from "../../components/ui";
import { PopupModalWrapper } from "../../components/wrappers";
import { useColor, useConstant, useDebounce } from "../../hooks";
import Helper__supabase from "../../hooks/helpers/supabase.api";

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
    await Helper__supabase.registerUser(setIsLoading, form);
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
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <FormComponent
        formType={"checkbox"}
        value={value}
        setValue={setValue}
        label={
          <Text>
            I have read, and agree to the{" "}
            <Text
              style={styles.link}
              onPress={() => {
                setIsVisible(true);
              }}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        }
      />

      {/**privacy popup */}
      <PopupModalWrapper
        title={"Privacy Policy"}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      ></PopupModalWrapper>
    </>
  );
};
