import React, {
  useContext,
  useReducer,
  useState,
  useEffect,
  useRef,
} from "react";
import AuthContext from "../context/AuthContext";
import useFetch from "./useFetch";

const useAuthFetch = (fetchParams) => {
  const cancelRequest = useRef(false);

  const [_fetchParams, setFetchParams] = useState(fetchParams);

  const initialState = {
    loading: false,
    data: undefined,
    errror: undefined,
  };

  const { authTokens, updateToken } = useContext(AuthContext);

  const { loading, data, error } = useFetch(_fetchParams);

  const authFetchRefucer = (state, action) => {
    switch (action.type) {
      case "loading":
        return { ...initialState, loading: true };
      case "fetched":
        return { ...initialState, data: action.payload };
      case "error":
        return { ...initialState, error: action.payload };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(
    authFetchRefucer,
    initialState
  );

  useEffect(() => {
    if (cancelRequest.current) return;

    if (loading) {
      dispatch({ type: "loading" });
    }
  }, [loading]);

  useEffect(() => {
    if (cancelRequest.current) return;

    if (data) {
      dispatch({ type: "fetched", payload: data });
    }
  }, [data]);

  useEffect(() => {
    if (cancelRequest.current) return;

    if (error) {
      if (error.errorCode === 401) updateToken();
      else {
        dispatch({ type: "error", payload: error });
      }
    }
  }, [error]);

  useEffect(() => {
    setFetchParams({
      ...fetchParams,
      options: {
        ...fetchParams.options,
        headers: {
          ...fetchParams.options.headers,
          Authorization: "Bearer " + String(authTokens.access),
        },
      },
    });
  }, [authTokens.access, fetchParams]);

  useEffect(() => {
    return () => {
      cancelRequest.current = true;
    };
  }, []);

  return state;
};

export default useAuthFetch;
