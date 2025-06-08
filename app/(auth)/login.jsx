import { Octicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { PrimaryButton } from "../../components/reuseables";
import { FormComponent } from "../../components/ui";
import { useColor, useConstant, useDebounce } from "../../hooks";
import Helper__supabase from "../../hooks/helpers/supabase.api";
import { router } from "expo-router";

export default function AuthLogin() {
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
  });
  const [isLoading, setIsLoading] = useState(false);

  const _attemptLogin = useDebounce(async () => {
    const res = await Helper__supabase.loginUser(setIsLoading, form);

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
        placeholder={"Enter account password"}
        name={"password"}
        form={form}
        setForm={setForm}
      />

      {/**button */}
      <View style={styles.button}>
        <PrimaryButton
          title={"Log in"}
          onPress={_attemptLogin}
          isLoading={isLoading}
          disabled={Boolean(!form?.email || !form?.password)}
        />
      </View>
    </View>
  );
}
