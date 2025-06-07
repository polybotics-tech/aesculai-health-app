import ErrorLibrary from "../../lib/error";
import ImageLibrary from "../../lib/image";
import StringLibrary from "../../lib/string";
import SupabaseLibrary from "../../lib/supabase";
import {
  _Action_clearSession,
  _Action_updateUser,
} from "../../redux/slice/app.slice";
import store from "../../redux/store";
import useAlert from "../useAlert";

const Helper__supabase = {
  registerUser: async (setLoading = () => {}, form) => {
    try {
      setLoading(true);

      const { email, password, confirmPassword } = form;

      if (!email || !password || !confirmPassword) {
        ErrorLibrary.extract(
          { message: "Fill in credentials to continue" },
          true
        );
        return null;
      }

      if (password != confirmPassword) {
        ErrorLibrary.extract(
          { message: "Confirm password does not match" },
          true
        );
        return null;
      }

      const {
        data: { session },
        error,
      } = await SupabaseLibrary.supabase.auth.signUp({
        email,
        password,
      }); //attempt sign up with supabase

      if (error) {
        ErrorLibrary.extract(error, true);
        return null;
      }

      if (!session) {
        useAlert("Check your inbox for email verification").pending();
        return true;
      }

      useAlert("Registration successful").success();
      return true;
    } catch (error) {
      ErrorLibrary.extract(error, true);
      return null;
    } finally {
      setLoading(false);
    }
  },
  loginUser: async (setLoading = () => {}, form) => {
    try {
      setLoading(true);

      const { email, password } = form;

      if (!email || !password) {
        ErrorLibrary.extract(
          { message: "Fill in credentials to continue" },
          true
        );
        return null;
      }

      const { data, error } =
        await SupabaseLibrary.supabase.auth.signInWithPassword({
          email,
          password,
        }); //attempt sign in with supabase

      if (error) {
        ErrorLibrary.extract(error, true);
        return null;
      }

      useAlert("Login successful").success();
      return true;
    } catch (error) {
      ErrorLibrary.extract(error, true);
      return null;
    } finally {
      setLoading(false);
    }
  },
  logout: async (setLoading = () => {}) => {
    try {
      setLoading(true);

      const { error } = await SupabaseLibrary.supabase.auth.signOut();

      if (error) {
        ErrorLibrary.extract(error, true);
        return null;
      }

      //clear session & user in global state
      store.dispatch(_Action_clearSession());

      useAlert("Logged out successfully").success();
      return true;
    } catch (error) {
      ErrorLibrary.extract(error, true);
      return null;
    } finally {
      setLoading(false);
    }
  },
  googleAuth: async (setLoading = () => {}, token) => {
    try {
      setLoading(true);

      if (!token) {
        ErrorLibrary.extract({ message: "Token is missing, try again" }, true);
        return null;
      }

      const { data, error } =
        await SupabaseLibrary.supabase.auth.signInWithIdToken({
          provider: "google",
          token,
        }); //attempt sign in with supabase

      if (error) {
        ErrorLibrary.extract(error, true);
        return null;
      }

      useAlert("Google authentication successful").success();
      return true;
    } catch (error) {
      ErrorLibrary.extract(error, true);
      return null;
    } finally {
      setLoading(false);
    }
  },
  fetchUserData: async (id) => {
    if (!id) {
      ErrorLibrary.extract(
        { message: "Error fetching user data. No session found." },
        true
      );
      return null;
    }

    const { data, error } = await SupabaseLibrary.supabase
      .from("profiles")
      .select("full_name, avatar_url, role, updated_at")
      .eq("id", id)
      .single();

    if (error) {
      ErrorLibrary.extract(error, true);
      return null;
    }

    //update user global state
    const email = store.getState().app.session?.user?.email;
    store.dispatch(_Action_updateUser({ user: { ...data, id, email } }));

    //--return data is needed
    return data;
  },
  updateUser: async (setLoading = () => {}, form, id) => {
    try {
      setLoading(true);

      if (!id) {
        ErrorLibrary.extract(
          { message: "Error updating user. No session found." },
          true
        );
        return null;
      }

      const updates = {
        id: id,
        updated_at: new Date(),
        ...form,
      };
      const { error } = await SupabaseLibrary.supabase
        .from("profiles")
        .upsert(updates); //attempt user update with supabase

      if (error) {
        ErrorLibrary.extract(error, true);
        return null;
      }

      const updateState = await Helper__supabase.fetchUserData(id); //refetch user data
      if (updateState) {
        useAlert("User updated successfully").success();
      }

      return true;
    } catch (error) {
      ErrorLibrary.extract(error, true);
      return null;
    } finally {
      setLoading(false);
    }
  },
  updateProfilePhoto: async (setLoading = () => {}, form, id) => {
    try {
      setLoading(true);

      if (!id) {
        ErrorLibrary.extract(
          { message: "Error updating user. No session found." },
          true
        );
        return null;
      }

      const { image } = form; //extract image from form
      if (!image) {
        ErrorLibrary.extract({ message: "Unable to process image" }, true);
        return null;
      }

      const { uri } = image;

      //generate image path by id
      const path = StringLibrary.generate_profile_photo_path(uri, id);

      const compressed = await ImageLibrary.compress_image(uri);
      const arrayBuffer = await fetch(compressed?.uri).then((res) =>
        res.arrayBuffer()
      );

      //upload new photo to supabase storage
      const { error } = await SupabaseLibrary.supabase.storage
        .from("avatars")
        .upload(path, arrayBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (error) {
        console.log("new err: ", error);
        ErrorLibrary.extract(error, true);
        return null;
      }

      //check if user has an existing avatar_url
      const existing_url = store.getState().app.user?.avatar_url;
      if (existing_url) {
        const oldPath = StringLibrary.extract_photo_path_from_url(existing_url);
        //remove photo from supabase storage by path
        await SupabaseLibrary.supabase.storage
          .from("avatars")
          .remove([`${oldPath}`]);
      }

      //request for public url of new photo from storage
      const { data } = SupabaseLibrary.supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      //update user data with the avatar public url
      await Helper__supabase.updateUser(
        () => {},
        { avatar_url: data?.publicUrl },
        id
      );
      return true;
    } catch (error) {
      ErrorLibrary.extract(error, true);
      return null;
    } finally {
      setLoading(false);
    }
  },
};

export default Helper__supabase;
