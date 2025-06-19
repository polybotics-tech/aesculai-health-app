import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { Provider, useDispatch, useSelector } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { ToastComponent } from "../components/reuseables";
import Helper__supabase from "../hooks/helpers/supabase.api";
import ErrorLibrary from "../lib/error";
import SupabaseLibrary from "../lib/supabase";
import {
  _Action_clearSession,
  _Action_updateSession,
  _Action_updateUser,
} from "../redux/slice/app.slice";
import { _Action_clearMessage } from "../redux/slice/chat.slice";
import store from "../redux/store";

export default function RootLayout() {
  const persistor = persistStore(store);

  return (
    <Provider store={store}>
      {/**persist global states even on app reload */}
      <PersistGate loading={null} persistor={persistor}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>

        {/**This is our session manager to handle session and user global updates */}
        <SessionManager />

        {/**This will handle deep linking from outside the app */}
        <LinkingManager />

        {/**This will manage our memory cache to avoid bloating */}
        <CacheManager />

        {/**This is the custom toast manager that will handle the display of alerts */}
        <ToastManager />
      </PersistGate>
    </Provider>
  );
}

const LinkingManager = ({}) => {
  const createSessionFromUrl = async (url) => {
    try {
      const { params, errorCode } = QueryParams.getQueryParams(url);
      if (errorCode) throw new Error(errorCode);

      const { access_token, refresh_token } = params;
      if (!access_token) return;

      const { data, error } = await SupabaseLibrary.supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        ErrorLibrary.extract(error, true);
        return;
      }
      return data.session;
    } catch (error) {
      ErrorLibrary.extract(error, true);
      return;
    }
  };

  // Handle linking into app from email app.
  const url = Linking.useURL();
  useEffect(() => {
    if (url) createSessionFromUrl(url);
  }, [url]);

  return <></>;
};

const ToastManager = ({}) => {
  //creating custom toast configurations
  const toastConfig = {
    customSuccess: ({ text1, ...props }) => (
      <ToastComponent type={"success"} text={text1} props={props} />
    ),
    customPending: ({ text1, ...props }) => (
      <ToastComponent type={"pending"} text={text1} props={props} />
    ),
    customError: ({ text1, ...props }) => (
      <ToastComponent type={"error"} text={text1} props={props} />
    ),
  };

  return (
    <Toast
      autoHide={true}
      visibilityTime={7000}
      config={toastConfig}
      position="bottom"
      bottomOffset={100}
    />
  );
};

const SessionManager = ({}) => {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.app.session);

  //--subscribe to supabase auth session
  useEffect(() => {
    SupabaseLibrary.supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(_Action_updateSession({ session })); //update session globally
    });
    const { data: listener } = SupabaseLibrary.supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch(_Action_updateSession({ session })); //update session globally
      }
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  //--update global user state on session change
  const _updateUserData = async (id) => {
    await Helper__supabase.fetchUserData(id); //refetch user data
  };

  useEffect(() => {
    if (session && session?.user) {
      const id = session?.user?.id;
      _updateUserData(id);
    } else {
      dispatch(_Action_clearSession());
    }
  }, [session, _updateUserData]);

  return <></>;
};

const CacheManager = ({}) => {
  const dispatch = useDispatch();

  const chat = useSelector((state) => state.chat);
  const app = useSelector((state) => state.app);

  const _manageCachedMessages = () => {
    if (!chat) return;

    const { lastUpdated, maxCacheLimit } = chat;

    if (!lastUpdated) return;

    const daysPassed = Date.now() - lastUpdated;
    if (daysPassed > maxCacheLimit) {
      dispatch(_Action_clearMessage());
    }
  };

  const _manageCachedSession = () => {
    if (!app?.session) return;

    const { lastSignedIn, maxCacheLimit } = app;

    if (!lastSignedIn) return;

    const daysPassed = Date.now() - lastSignedIn;
    if (daysPassed > maxCacheLimit) {
      dispatch(_Action_clearSession());
    }
  };

  useEffect(() => {
    _manageCachedSession();
    _manageCachedMessages();
  }, [chat, app]);

  return <></>;
};
