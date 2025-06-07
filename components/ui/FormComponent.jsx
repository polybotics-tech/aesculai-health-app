import { Octicons } from "@expo/vector-icons";
import { forwardRef, memo, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useColor, useConstant } from "../../hooks";
import NumberLibrary from "../../lib/numbers";
import { NotFoundComponent } from "../reuseables";
import { PopupModalWrapper } from "../wrappers";

const FormComponent = forwardRef(({ ...props }, ref) => {
  const styles = StyleSheet.create({});
  // This component can be used to create forms, handle inputs, etc.

  return (
    <KeyboardAvoidingView>
      {props?.formType === "input" ? (
        <FormInput
          label={props?.label}
          placeholder={props?.placeholder}
          description={props?.description}
          hasError={props?.hasError}
          optional={props?.optional}
          disabled={props?.disabled}
          value={props?.value}
          name={props?.name}
          form={props?.form}
          setForm={props?.setForm}
          mode={props?.inputMode}
          inputIcon={props?.inputIcon}
          bgColor={props?.bgColor}
          submitType={props?.submitType}
          submitFunc={props?.submitFunc}
          canClearInput={props?.canClearInput}
          onClearInput={props.onClearInput}
          ref={ref}
        />
      ) : props?.formType === "select" ? (
        <FormSelect
          label={props?.label}
          placeholder={props?.placeholder}
          description={props?.description}
          optional={props?.optional}
          disabled={props?.disabled}
          name={props?.name}
          form={props?.form}
          setForm={props?.setForm}
          inputIcon={props?.inputIcon}
          bgColor={props?.bgColor}
          options={props?.options}
        />
      ) : props?.formType === "checkbox" ? (
        <FormCheckBox
          label={props?.label}
          value={props?.value}
          setValue={props?.setValue}
        />
      ) : (
        <></>
      )}
    </KeyboardAvoidingView>
  );
});

export default memo(FormComponent);

const FormInput = forwardRef(
  (
    {
      label = "",
      placeholder = "Type here",
      description = "",
      hasError = false,
      optional = false,
      disabled = false,
      value = "",
      name = "",
      form = [],
      setForm = () => {},
      mode = "text",
      inputIcon = <></>,
      bgColor = "",
      submitType = "done",
      submitFunc = () => {},
      canClearInput = false,
      onClearInput = () => {},
    },
    ref
  ) => {
    const color = useColor();
    const constant = useConstant();

    const styles = StyleSheet.create({
      inputContainer: {
        width: "100%",
        gap: 4,
        paddingVertical: 4,
      },
      label: {
        fontSize: constant.font.size.s,
        fontWeight: constant.font.weight.semibold,
        color: color.gray200,
      },
      optional: {
        fontSize: constant.font.size.xs,
        fontWeight: constant.font.weight.regular,
        color: color.gray100,
      },
      inputTab: {
        width: "100%",
        height: 48,
        paddingHorizontal: 16,
        borderRadius: constant.size.s,
        backgroundColor: bgColor || color.gray50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      },
      input: (isShort = false) => ({
        width: isShort
          ? constant.dimension.width.subtract(8 + 8, 32 + 32, 16 + 16)
          : constant.dimension.width.subtract(8, 32 + 32, 16),
        padding: 0,
        color: color.gray200,
        fontSize: constant.font.size.m,
        fontWeight: constant.font.weight.regular,
      }),
      infoBox: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingTop: 2,
      },
      description: {
        fontSize: constant.font.size.xs,
        fontWeight: constant.font.weight.regular,
        color: color.gray100,
        maxWidth: constant.dimension.width.subtract(4, 32, 12),
      },
    });

    //--
    const [inputMode, setInputMode] = useState(`${mode}`);

    //update form input by name
    const updateFormInput = (value) => {
      setForm({
        ...form,
        [name]: value,
      });
    };

    //clear form input by name
    const clearFormInput = () => {
      setForm({
        ...form,
        [name]: "",
      });
      onClearInput();
    };

    return (
      <View style={styles.inputContainer}>
        {label && (
          <Text style={styles.label}>
            {label}{" "}
            {optional && <Text style={styles.optional}>(optional)</Text>}
          </Text>
        )}

        <View style={styles.inputTab}>
          <>{inputIcon}</>

          <TextInput
            placeholder={placeholder}
            placeholderTextColor={color.gray100}
            style={styles.input(
              mode === "password" || Boolean(canClearInput && form[name])
            )}
            value={!disabled ? `${form[name]}` : `${value}`}
            onChangeText={(text) => {
              if (!disabled) {
                updateFormInput(
                  mode === "numeric"
                    ? NumberLibrary.format_input_number(text)
                    : text
                );
              }
            }}
            inputMode={mode}
            secureTextEntry={mode === "password" && inputMode === "password"}
            autoCapitalize="none"
            autoCorrect={false}
            cursorColor={color.gray200}
            selectionColor={color.gray200}
            editable={!disabled}
            returnKeyLabel={submitType}
            returnKeyType={submitType}
            enterKeyHint={submitType}
            onBlur={submitFunc}
            ref={ref}
          />

          {mode === "password" ? (
            <Pressable
              onPress={() => {
                setInputMode((prev) =>
                  prev === "password" ? "text" : "password"
                );
              }}
            >
              <Octicons
                name={inputMode === "password" ? "eye" : "eye-closed"}
                size={constant.size.m}
                color={color.gray200}
              />
            </Pressable>
          ) : Boolean(canClearInput && form[name]) ? (
            <Pressable onPress={() => clearFormInput()}>
              <Octicons
                name={"x"}
                size={constant.size.m}
                color={color.gray200}
              />
            </Pressable>
          ) : (
            <></>
          )}

          {}
        </View>

        {description && (
          <View style={styles.infoBox}>
            <View style={{ width: 12 }}>
              <Octicons
                name="info"
                size={12}
                color={hasError ? color.error : color.gray100}
              />
            </View>
            <Text
              style={[styles.description, hasError && { color: color.error }]}
            >
              {description}
            </Text>
          </View>
        )}
      </View>
    );
  }
);

const FormCheckBox = ({ label = "", value = false, setValue = () => {} }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: constant.size.xs,
      paddingVertical: constant.size.xs,
    },
    checkbox: {
      width: constant.font.size.b,
      height: constant.font.size.b,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: constant.size.xs,
      borderWidth: 0.8,
      borderColor: value ? color.primary : color.gray100,
      backgroundColor: value ? color.primary : "transparent",
    },
    label: {
      maxWidth: constant.dimension.width.subtract(
        constant.size.xs,
        constant.size.m * 2,
        constant.font.size.b
      ),
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
    },
  });

  const _toggleCheckbox = () => {
    setValue((prev) => !prev);
  };
  //--
  return (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.checkbox}
        onPress={_toggleCheckbox}
      >
        {value && (
          <Octicons name="check" size={constant.size.xm} color={color.white} />
        )}
      </TouchableOpacity>

      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const FormSelect = ({
  label = "",
  placeholder = "Type here",
  description = "",
  optional = false,
  disabled = false,
  name = "",
  form = [],
  setForm = () => {},
  inputIcon = <></>,
  bgColor = "",
  options = [],
}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    inputContainer: {
      width: "100%",
      gap: constant.size.xs,
      paddingVertical: constant.size.xs,
    },
    label: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.semibold,
      color: color.gray200,
    },
    optional: {
      fontSize: constant.font.size.xs,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
    },
    inputTab: {
      width: "100%",
      height: 48,
      paddingHorizontal: constant.size.m,
      borderRadius: constant.size.s,
      backgroundColor: bgColor || color.gray50,
      flexDirection: "row",
      alignItems: "center",
      gap: constant.size.s,
    },
    placeholder: {
      width: constant.dimension.width.subtract(
        constant.size.s + constant.size.s,
        constant.size.m * 4,
        constant.size.m * 2
      ),
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
    },
    value: {
      width: constant.dimension.width.subtract(
        constant.size.s + constant.size.s,
        constant.size.m * 4,
        constant.size.m * 2
      ),
      color: color.gray200,
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
    },
    dropDownIcon: {
      width: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    infoBox: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingTop: 2,
    },
    description: {
      fontSize: constant.font.size.xs,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
      maxWidth: constant.dimension.width.subtract(4, 32, 12),
    },
    searchTab: {
      width: "100%",
      paddingBottom: constant.size.set(24),
    },
    optionTab: {
      width: "100%",
      paddingBottom: constant.size.xxb,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: constant.size.m,
    },
    optionText: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.gray200,
    },
  });

  //update form input by name
  const updateFormInput = (value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  //handle drop down popup
  const [modalVisible, setModalVisible] = useState(false);

  //handle select options search
  const [filteredList, setFilteredList] = useState();
  const [searchForm, setSearchForm] = useState({
    q: "",
  });

  const _filterOptions = async () => {
    if (options) {
      let result = options?.filter(
        (item) => item?.toLowerCase()?.includes(searchForm?.q?.toLowerCase()) // case-insensitive search
      );

      setFilteredList(result);
    } else {
      setFilteredList();
    }
  };

  useEffect(() => {
    _filterOptions();
  }, [searchForm?.q]);

  return (
    <>
      {/**Selector */}
      <View style={styles.inputContainer}>
        {label && (
          <Text style={styles.label}>
            {label}{" "}
            {optional && <Text style={styles.optional}>(optional)</Text>}
          </Text>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.inputTab}
          onPress={() => setModalVisible((prev) => !prev)}
          disabled={disabled}
        >
          <>{inputIcon}</>

          {!form[name] ? (
            <Text style={styles.placeholder}>{placeholder}</Text>
          ) : (
            <Text style={styles.value}>{form[name]}</Text>
          )}

          {/**chevron icon */}
          <View style={styles.dropDownIcon}>
            <Octicons name={"chevron-down"} size={16} color={color.gray200} />
          </View>
        </TouchableOpacity>

        {description && (
          <View style={styles.infoBox}>
            <View style={{ width: 12 }}>
              <Octicons name="info" size={12} color={color.gray100} />
            </View>
            <Text style={styles.description}>{description}</Text>
          </View>
        )}
      </View>

      {/**dropdown modal */}
      <PopupModalWrapper
        isVisible={modalVisible}
        setIsVisible={setModalVisible}
        title={"Select"}
      >
        {/**search through list */}
        <View style={styles.searchTab}>
          <FormInput
            formType={"input"}
            inputMode={"text"}
            inputIcon={
              <Octicons
                name="search"
                size={constant.size.m}
                color={color.gray200}
              />
            }
            placeholder={"Type to search"}
            name={"q"}
            form={searchForm}
            setForm={setSearchForm}
            submitFunc={_filterOptions}
          />
        </View>

        {/**filtered list */}
        {filteredList && filteredList?.length > 0 ? (
          filteredList?.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionTab}
              onPress={() => {
                updateFormInput(item);
                setModalVisible(false);
              }}
            >
              <Text style={styles.optionText}>{item}</Text>

              {item === form[name] && (
                <Octicons
                  name="check"
                  size={constant.size.m}
                  color={color.primary}
                />
              )}
            </TouchableOpacity>
          ))
        ) : (
          <NotFoundComponent isLoading={false} text={"No options found"} />
        )}
      </PopupModalWrapper>
    </>
  );
};
