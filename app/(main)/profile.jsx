import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { PrimaryButton } from "../../components/reuseables";
import {
  FormComponent,
  ProfilePhotoComponent,
  SelectionComponent,
} from "../../components/ui";
import {
  PopupModalWrapper,
  ScrollViewWrapper,
} from "../../components/wrappers";
import { useColor, useConstant, useDebounce } from "../../hooks";
import Helper__supabase from "../../hooks/helpers/supabase.api";
import { _Action_toggleTheme } from "../../redux/slice/app.slice";

export default function ProfilePage() {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    page: {
      backgroundColor: color.gray50,
    },
    userBlock: {
      width: "100%",
      marginBottom: constant.size.xxb,
      alignItems: "center",
      gap: constant.size.xb,
    },
    userDetails: {
      width: "100%",
      padding: constant.size.m,
      gap: constant.size.xs,
      backgroundColor: color.white,
      borderRadius: constant.size.m,
    },
    userName: {
      fontSize: constant.font.size.xb,
      fontWeight: constant.font.weight.bold,
      color: color.black,
      textAlign: "center",
      textTransform: "capitalize",
    },
    userMail: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
      textAlign: "center",
    },
    userRole: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.semibold,
      color: color.gray200,
      textAlign: "center",
    },
    optionList: {
      width: "100%",
      gap: constant.size.s,
      borderRadius: constant.size.m,
      overflow: "hidden",
    },
  });

  //--
  const user = useSelector((state) => state.app.user);

  //--
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [switchModalVisible, setSwitchModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  //--
  return (
    <>
      <ScrollViewWrapper style={styles.page}>
        {/**user block */}
        <View style={styles.userBlock}>
          {/**profile photo */}
          <ProfilePhotoComponent />

          {/**user data */}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.full_name}</Text>
            <Text style={styles.userMail} numberOfLines={1}>
              {user?.email}
            </Text>
            <Text style={styles.userRole}>[{user?.role}]</Text>
          </View>
        </View>

        {/** */}
        <View style={styles.optionList}>
          <OptionTab
            icon="person"
            title="Change Account Name"
            onPress={() => setEditModalVisible(true)}
          />

          <OptionTab
            icon="person-add"
            title="Update Medical Role"
            onPress={() => setRoleModalVisible(true)}
          />

          <OptionTab
            icon="moon"
            title="Switch App Theme"
            onPress={() => setSwitchModalVisible(true)}
          />

          {/**contact option & terms and condition should be added here */}

          <OptionTab
            icon="sign-out"
            title="Log Out"
            isDanger={true}
            onPress={() => setLogoutModalVisible(true)}
          />
        </View>
      </ScrollViewWrapper>

      {/**edit profile */}
      <EditProfileComponent
        isVisible={editModalVisible}
        setIsVisible={setEditModalVisible}
      />

      {/**change role */}
      <UpdateRoleComponent
        isVisible={roleModalVisible}
        setIsVisible={setRoleModalVisible}
      />

      {/**switch theme */}
      <SwitchThemeComponent
        isVisible={switchModalVisible}
        setIsVisible={setSwitchModalVisible}
      />

      {/**log out */}
      <LogoutComponent
        isVisible={logoutModalVisible}
        setIsVisible={setLogoutModalVisible}
      />
    </>
  );
}

const OptionTab = ({
  icon = "info",
  title = "",
  isDanger = false,
  onPress = () => {},
}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    option: {
      width: "100%",
      padding: constant.size.m,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: constant.size.m,
      backgroundColor: color.white,
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
      gap: constant.size.s,
    },
    icon: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: constant.size.s,
      borderWidth: 0.8,
      borderColor: isDanger ? color.error : color.gray100,
    },
    title: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: isDanger ? color.error : color.gray200,
    },
  });

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.option}
      onPress={onPress}
    >
      <View style={styles.left}>
        <View style={styles.icon}>
          <Octicons
            name={icon}
            size={constant.size.b}
            color={isDanger ? color.error : color.gray100}
          />
        </View>

        <Text style={styles.title}>{title}</Text>
      </View>

      <Octicons
        name="chevron-right"
        size={constant.size.m}
        color={isDanger ? color.error : color.gray100}
      />
    </TouchableOpacity>
  );
};

const EditProfileComponent = ({
  isVisible = false,
  setIsVisible = () => {},
}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    buttonHolder: {
      width: "100%",
      paddingVertical: constant.size.xxb * 2,
    },
  });

  //--
  const user = useSelector((state) => state.app.user);

  //--
  const [form, setForm] = useState({
    full_name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  //--
  useEffect(() => {
    if (user && !form?.full_name) {
      setForm((prev) => ({ ...prev, full_name: user?.full_name }));
    }
  }, [user]);
  //--

  const _changeName = useDebounce(async () => {
    const res = await Helper__supabase.updateUser(setIsLoading, form, user?.id);

    setIsVisible(false);
    return;
  });

  return (
    <PopupModalWrapper
      title="Profile Information"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
    >
      {/**username */}
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
        label={"Fullname"}
        placeholder={"Ex. John Doe"}
        name={"full_name"}
        form={form}
        setForm={setForm}
      />

      <View style={styles.buttonHolder}>
        <PrimaryButton
          title={"Change name"}
          isLoading={isLoading}
          onPress={_changeName}
          disabled={Boolean(!form?.full_name)}
        />
      </View>
    </PopupModalWrapper>
  );
};

const UpdateRoleComponent = ({
  isVisible = false,
  setIsVisible = () => {},
}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    buttonHolder: {
      width: "100%",
      paddingVertical: constant.size.xxb * 2,
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
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  //--
  useEffect(() => {
    if (user && !form?.role) {
      setForm((prev) => ({ ...prev, role: user?.role }));
    }
  }, [user]);
  //--

  const _changeRole = useDebounce(async () => {
    const res = await Helper__supabase.updateUser(setIsLoading, form, user?.id);

    setIsVisible(false);
    return;
  });

  return (
    <PopupModalWrapper
      title="Update Medical Role"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
    >
      {/**role selection */}
      <View style={styles.selectionBlock}>
        <Text style={styles.selectionTitle}>What is your current status?</Text>

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

      <View style={styles.buttonHolder}>
        <PrimaryButton
          title={"Update role"}
          isLoading={isLoading}
          onPress={_changeRole}
          disabled={Boolean(!form?.role)}
        />
      </View>
    </PopupModalWrapper>
  );
};

const SwitchThemeComponent = ({
  isVisible = false,
  setIsVisible = () => {},
}) => {
  const color = useColor();
  const constant = useConstant();

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.app.theme);

  const styles = StyleSheet.create({
    mode: {
      width: "100%",
      height: 42,
      marginBottom: constant.size.m,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
    },
    check: (isActive) => ({
      width: 18,
      height: 18,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: constant.size.r,
      borderWidth: 1,
      borderColor: isActive ? color.primary : color.gray100,
    }),
    checkInner: (isActive) => ({
      width: 12,
      height: 12,
      borderRadius: constant.size.r,
      backgroundColor: isActive ? color.primary : color.gray100,
    }),
  });

  //--

  const _switchTheme = async (val = "") => {
    const allowedThemes = ["light", "dark"];
    if (!val || !allowedThemes.includes(val)) return;

    //--switch theme
    dispatch(_Action_toggleTheme({ theme: val }));

    //--close modal
    setIsVisible(false);
  };

  //--
  const CheckBox = ({ value = "" }) => {
    const isActive = Boolean(value === theme);

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.check(isActive)}
        onPress={() => _switchTheme(value)}
      >
        <View style={styles.checkInner(isActive)}></View>
      </TouchableOpacity>
    );
  };

  //--
  return (
    <PopupModalWrapper
      title="Choose Theme"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
    >
      {/**light mode */}
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.mode}
        onPress={() => _switchTheme("light")}
      >
        <Text style={styles.title}>Light Mode</Text>

        <CheckBox value="light" />
      </TouchableOpacity>

      {/**dark mode */}
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.mode}
        onPress={() => _switchTheme("dark")}
      >
        <Text style={styles.title}>Dark Mode</Text>

        <CheckBox value="dark" />
      </TouchableOpacity>
    </PopupModalWrapper>
  );
};

const LogoutComponent = ({ isVisible = false, setIsVisible = () => {} }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    warning: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
      textAlign: "center",
    },
    buttonHolder: {
      width: "100%",
      marginTop: constant.size.xxb * 2,
    },
  });

  //--
  const [isLoading, setIsLoading] = useState(false);

  const _logUserOut = useDebounce(async () => {
    const res = await Helper__supabase.logout(setIsLoading);

    if (res) {
      setTimeout(() => {
        router.dismissTo("/(auth)/login/");
      }, 1500);
    }
  });

  //--
  return (
    <PopupModalWrapper
      title="Log Out Confirmation"
      isVisible={isVisible}
      setIsVisible={setIsVisible}
    >
      <Text style={styles.warning}>
        This action will erase your current session from this device. Do you
        wish to continue?
      </Text>

      <View style={styles.buttonHolder}>
        <PrimaryButton
          title={"Yes, log me out"}
          isLoading={isLoading}
          onPress={_logUserOut}
        />
      </View>
    </PopupModalWrapper>
  );
};
