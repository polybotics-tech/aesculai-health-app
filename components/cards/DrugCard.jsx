import { memo, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColor, useConstant, useDebounce } from "../../hooks";
import Helper__gemini from "../../hooks/helpers/gemini.api";
import StringLibrary from "../../lib/string";
import { NotFoundComponent } from "../reuseables";
import { PopupModalWrapper } from "../wrappers";

const DrugCard = ({ drug }) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    card: {
      width: "100%",
      padding: constant.size.m,
      gap: constant.size.m,
      borderRadius: constant.size.s,
      backgroundColor: color.white,
    },
    title: {
      width: "100%",
      fontSize: constant.font.size.b,
      fontWeight: constant.font.weight.semibold,
      color: color.black,
    },
    split: {
      width: "100%",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: constant.size.m,
    },
  });

  const { brand_name, generic_names, manufacturer_name } = drug;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setShowDetails(true);
        }}
      >
        <Text style={styles.title}>{String(brand_name)}</Text>

        {/**split details */}
        <View style={styles.split}>
          <EntrySection
            title="Manufactured By"
            value={String(manufacturer_name)}
          />
          <EntrySection
            title="Generic Name"
            value={StringLibrary.convert_array_to_strings(generic_names)}
            isLeft={false}
          />
        </View>
      </TouchableOpacity>

      {brand_name && manufacturer_name && showDetails && (
        <DrugDetails
          brand_name={brand_name}
          manufacturer_name={manufacturer_name}
          isVisible={showDetails}
          setIsVisible={setShowDetails}
        />
      )}
    </>
  );
};

export default memo(DrugCard);

const EntrySection = ({
  title = "",
  value = "",
  isLeft = true,
  isFull = false,
}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    component: {
      width: isFull
        ? "100%"
        : constant.dimension.width.divide(
            constant.size.m,
            constant.size.m * 4,
            2
          ),
      gap: constant.size.xxs,
    },
    title: {
      width: "100%",
      fontSize: constant.font.size.s,
      fontWeight: constant.font.weight.semibold,
      color: color.gray200,
      textAlign: isLeft ? "left" : "right",
    },
    value: {
      width: "100%",
      fontSize: constant.font.size.m,
      fontWeight: constant.font.weight.regular,
      color: color.gray100,
      textAlign: isLeft ? "left" : "right",
    },
  });

  return Boolean(title && value) ? (
    <View style={styles.component}>
      <Text style={styles.title}>{title}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  ) : (
    <></>
  );
};

const DrugDetails = ({
  brand_name = "",
  manufacturer_name = "",
  isVisible = false,
  setIsVisible = () => {},
}) => {
  const color = useColor();
  const constant = useConstant();

  const styles = StyleSheet.create({
    title: {
      fontSize: constant.font.size.b,
      fontWeight: constant.font.weight.bold,
      color: color.black,
    },
    details: {
      width: "100%",
      paddingVertical: constant.size.m,
      marginTop: constant.size.s,
      gap: constant.size.b,
      borderTopWidth: 1,
      borderTopColor: color.gray100,
    },
  });

  //--
  const [details, setDetails] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const _fetchDrugDetails = useDebounce(async () => {
    if (!brand_name || !manufacturer_name) return;

    //const res = await Helper__drug.fetchDetailsById(setIsLoading, uuid);
    const res = await Helper__gemini.searchForDrugDetails(
      setIsLoading,
      brand_name,
      manufacturer_name
    );

    if (res) {
      setDetails(res);
    }
  });

  useEffect(() => {
    if (brand_name) {
      _fetchDrugDetails();
    }

    return () => {
      setDetails();
      setIsLoading(true);
    };
  }, [brand_name]);

  return (
    <>
      <PopupModalWrapper isVisible={isVisible} setIsVisible={setIsVisible}>
        {/**brand name */}
        <Text style={styles.title}>{brand_name}</Text>

        {/**other details */}
        <View style={styles.details}>
          {!details ? (
            <NotFoundComponent
              isLoading={isLoading}
              text="Unable to fetch drug details"
            />
          ) : (
            <>
              <EntrySection
                title="Manufactered By"
                value={details?.manufacturer_name}
                isFull={true}
              />

              <EntrySection
                title="Generic Name(s)"
                value={StringLibrary.convert_array_to_strings(
                  details?.generic_names
                )}
                isFull={true}
              />

              <EntrySection
                title="Product Type"
                value={details?.product_type}
                isFull={true}
              />

              <EntrySection
                title="Brief Description"
                value={details?.description}
                isFull={true}
              />

              <EntrySection
                title="Mode(s) of Intake"
                value={StringLibrary.convert_array_to_strings(
                  details?.modes_of_intake,
                  true
                )}
                isFull={true}
              />

              <EntrySection
                title="Active Ingredient(s)"
                value={StringLibrary.convert_array_to_strings(
                  details?.active_ingredients
                )}
                isFull={true}
              />

              <EntrySection
                title="Inactive Ingredient(s)"
                value={StringLibrary.convert_array_to_strings(
                  details?.inactive_ingredients
                )}
                isFull={true}
              />

              <EntrySection
                title="Recommended Dosages"
                value={StringLibrary.convert_array_to_strings(
                  details?.possible_dosages,
                  true
                )}
                isFull={true}
              />

              <EntrySection
                title="Uses and Purposes"
                value={StringLibrary.convert_array_to_strings(
                  details?.uses_and_purposes,
                  true
                )}
                isFull={true}
              />

              <EntrySection
                title="Possible Side Effect(s)"
                value={StringLibrary.convert_array_to_strings(
                  details?.side_effects,
                  true
                )}
                isFull={true}
              />

              <EntrySection
                title="Stop Use If"
                value={StringLibrary.convert_array_to_strings(
                  details?.stop_use_if,
                  true
                )}
                isFull={true}
              />

              <EntrySection
                title="Do Not Use If"
                value={StringLibrary.convert_array_to_strings(
                  details?.do_not_use_if,
                  true
                )}
                isFull={true}
              />

              <EntrySection
                title="Pregnancy or Breast-Feeding Warning(s)"
                value={StringLibrary.convert_array_to_strings(
                  details?.pregnancy_warnings,
                  true
                )}
                isFull={true}
              />

              <EntrySection
                title="Infant Warning(s)"
                value={StringLibrary.convert_array_to_strings(
                  details?.infant_warnings,
                  true
                )}
                isFull={true}
              />
            </>
          )}
        </View>
      </PopupModalWrapper>
    </>
  );
};
