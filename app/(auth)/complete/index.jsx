import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { PrimaryButton } from "../../../components/reuseables";
import { FormComponent, SelectionComponent } from "../../../components/ui";
import { useColor, useConstant, useDebounce } from "../../../hooks";
import Helper__supabase from "../../../hooks/helpers/supabase.api";

export default function CompleteUserDetails() {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    page: {
      height: constant.dimension.height.full - 260,
      gap: constant.size.m,
      justifyContent: "space-between",
    },
    button: {
      marginTop: constant.size.xb * 3,
    },
    selectionBlock: {
      width: "100%",
      gap: constant.size.m,
    },
    selectionTitle: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.semibold,
      color: color.gray200,
    },
  });

  //--
  const user = useSelector((state) => state.app.user);

  //--
  const [form, setForm] = useState({
    full_name: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  //--
  const _updateUserInfo = useDebounce(async () => {
    const res = await Helper__supabase.updateUser(setIsLoading, form, user?.id);

    if (res) {
      router.dismissTo("/(auth)/complete/photo/");
    }
  });

  return (
    <View style={styles.page}>
      <View style={{ gap: constant.size.m }}>
        {/**full_name */}
        <FormComponent
          formType={"input"}
          inputMode={"text"}
          inputIcon={
            <Octicons
              name="person"
              size={constant.size.m}
              color={color.gray100}
            />
          }
          label={"What's your name?"}
          placeholder={"Ex. John Doe"}
          name={"full_name"}
          form={form}
          setForm={setForm}
        />

        {/**role selection */}
        <View style={styles.selectionBlock}>
          <Text style={styles.selectionTitle}>
            What is your current status?
          </Text>

          <SelectionComponent
            title={"I am a Doctor"}
            description={"For medical professionals who are in service"}
            value="doctor"
            name="role"
            form={form}
            setForm={setForm}
          />

          <SelectionComponent
            title={"I am a Student"}
            description={"For students in the health-related fields"}
            value="student"
            name="role"
            form={form}
            setForm={setForm}
          />
        </View>
      </View>

      {/**button */}
      <View style={styles.button}>
        <PrimaryButton
          title={"Continue"}
          onPress={_updateUserInfo}
          isLoading={isLoading}
          disabled={Boolean(!form?.full_name || !form?.role)}
        />
      </View>
    </View>
  );
}
