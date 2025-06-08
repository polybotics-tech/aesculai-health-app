import { Feather, Octicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import * as Progress from "react-native-progress";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DrugCard } from "../../components/cards";
import {
  CautionComponent,
  ImageView,
  NotFoundComponent,
} from "../../components/reuseables";
import { FormComponent } from "../../components/ui";
import { ScrollViewWrapper } from "../../components/wrappers";
import { useAlert, useColor, useConstant, useDebounce } from "../../hooks";
import Helper__gemini from "../../hooks/helpers/gemini.api";
import ImageLibrary from "../../lib/image";

export default function DrugsPage() {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    inputCont: {
      width: "100%",
      paddingHorizontal: constant.size.m,
      paddingVertical: constant.size.s,
      backgroundColor: color.white,
      borderBottomWidth: 0.8,
      borderColor: color.gray50,
    },
    scroll: {
      backgroundColor: color.gray50,
      paddingBottom: constant.size.xxb * 3,
    },
  });

  //--
  const [drugs, setDrugs] = useState(); // state to hold drug search results
  const [meta, setMeta] = useState(); //
  const [isLoading, setIsLoading] = useState(false); // state to manage loading state

  //--
  const [form, setForm] = useState({
    q: "",
  });
  const _submitSearch = useDebounce(async (query = "") => {
    // Handle the search here
    if (!query && !form.q) return; // Prevent search if the query is empty

    const searchQuery = query || form.q; // Use the provided query or form state

    //const res = await Helper__drug.searchByName( setIsLoading, searchQuery);
    const res = await Helper__gemini.searchDrugsByName(
      setIsLoading,
      searchQuery
    );

    if (res) {
      if (res?.error) {
        setMeta(res);
        setDrugs();
        return;
      } else {
        const { result } = res;
        setDrugs([...result]); // Update the drug state with the search results array
        setMeta();
      }
    }
  });

  //check if query sent from home search bar, if so update form state
  const { q } = useLocalSearchParams();
  useEffect(() => {
    if (q && q !== form.q) {
      // If q is present in the search params and form.q is not a match, update form state
      setForm((prev) => ({ ...prev, q: q }));
      _submitSearch(q); // Trigger the search function
    }
  }, [q]);

  //function to reset search data (drugs & meta)
  const _resetData = () => {
    setDrugs();
    setMeta();
  };

  //--
  return (
    <>
      {/**on submit, redirect to drugs page */}
      <View style={styles.inputCont}>
        <FormComponent
          formType={"input"}
          inputMode={"text"}
          inputIcon={
            <Octicons
              name="search"
              size={constant.size.m}
              color={color.gray100}
            />
          }
          placeholder={"Search for drugs"}
          name={"q"}
          form={form}
          setForm={setForm}
          submitType={"search"}
          submitFunc={() => _submitSearch()}
          canClearInput={true}
          onClearInput={() => _resetData()}
        />
      </View>

      {/**search results */}
      <ScrollViewWrapper style={styles.scroll}>
        {/**display caution message when result is fetched */}
        <CautionComponent
          title="Disclaimer"
          message="The Information provided in this search result are for information purposes only and should not be considered medical insights from a professional."
        />

        {/**if drug is loading or meta contains error */}
        {meta?.error || isLoading ? (
          <NotFoundComponent
            isLoading={isLoading}
            text={!meta ? "" : `${meta?.error}`}
          />
        ) : (
          <>
            {/**list drugs */}
            {drugs && drugs?.length > 0 ? (
              drugs?.map((item, index) => <DrugCard key={index} drug={item} />)
            ) : (
              <CautionComponent
                title="Information"
                message="You can get information on drugs by search for their names or manufacturers. Alternatively, you can simply upload a photo of the drug and let Aesculai handle the rest"
              />
            )}
          </>
        )}
      </ScrollViewWrapper>

      {/**search by photo */}
      <SearchByPhotoButton setForm={setForm} searchFunc={_submitSearch} />
    </>
  );
}

const SearchByPhotoButton = ({ setForm = () => {}, searchFunc = () => {} }) => {
  const color = useColor();
  const constant = useConstant();
  const alert = useAlert();

  const styles = StyleSheet.create({
    component: {
      padding: constant.size.m,
      alignItems: "flex-end",
      gap: constant.size.m,
      position: "absolute",
      bottom: 0,
      right: 0,
    },
    preview: {
      width: 250,
      height: 150,
      borderRadius: constant.size.s,
      backgroundColor: color.black,
      overflow: "hidden",
      zIndex: 1,
    },
    overlay: {
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      gap: constant.size.s,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 3,
    },
    overlayText: {
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.primary,
    },
    progress: {
      width: 200,
    },
    removeButton: {
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: constant.size.xs,
      backgroundColor: color.white,
      position: "absolute",
      top: constant.size.s,
      right: constant.size.s,
      zIndex: 5,
    },
    button: {
      width: 160,
      height: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: constant.size.s,
      borderRadius: constant.size.s,
      backgroundColor: color.primary,
    },
    btnText: {
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.semibold,
      color: color.white,
    },
  });

  //--
  const [photoUri, setPhotoUri] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  //--pull up gallery to select photo
  const _pickImageAndConvertToBase64 = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      base64: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return { base64, uri };
    }

    setPhotoUri("");
    return null;
  };

  //--
  const _handleImageDrugSearch = useDebounce(async () => {
    const image = await _pickImageAndConvertToBase64();
    if (!image) return;

    const { uri, base64 } = image;

    setPhotoUri(uri); //display photo preview

    const res = await Helper__gemini.extractDrugNameFromPhoto(
      setIsProcessing,
      base64
    ); //extract drug name with gemini

    if (res?.error) {
      alert(`${res?.error}`).error();
      return;
    }

    const { drug_name, got_manufacturer_name, manufacturer_name } = res;

    const formattedQuery = Boolean(got_manufacturer_name)
      ? `${drug_name} manufactured by ${manufacturer_name}`
      : `${drug_name}`;

    setForm((prev) => ({ q: formattedQuery })); //update form input so user can edit if need be
    searchFunc(formattedQuery); // Now call regular search function with name
    setPhotoUri(""); //clear preview display
  });

  //--
  const _removeImage = useDebounce(() => {
    setPhotoUri("");
  });

  return (
    <View style={styles.component}>
      {/**display selected photo preview */}
      {photoUri && (
        <View style={styles.preview}>
          <ImageView
            uri={ImageLibrary.load_picker_thumbnail(photoUri)}
            scale={true}
          />

          {/**processin overlay && remove image button */}
          {isProcessing ? (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Processing Image...</Text>
              <View style={styles.progress}>
                <Progress.Bar
                  progress={0.3}
                  indeterminate={true}
                  indeterminateAnimationDuration={1000}
                  width={null}
                  height={4}
                  color={color.primary}
                  unfilledColor={color.primaryFaded}
                  borderWidth={0}
                  borderRadius={constant.size.b}
                />
              </View>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.removeButton}
              onPress={_removeImage}
            >
              <Octicons
                name="trash"
                size={constant.size.m}
                color={color.error}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/**picker button */}
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.button}
        onPress={_handleImageDrugSearch}
      >
        <Text style={styles.btnText}>Upload Photo</Text>
        {isProcessing ? (
          <ActivityIndicator size={constant.size.m} color={color.white} />
        ) : (
          <Feather name="upload" size={constant.size.m} color={color.white} />
        )}
      </TouchableOpacity>
    </View>
  );
};
