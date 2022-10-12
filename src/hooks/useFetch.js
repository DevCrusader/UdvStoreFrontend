import { useReducer, useRef, useEffect } from "react";

const useFetch = (fetchParams) => {
  const cancelRequest = useRef(false);

  const initialState = {
    loading: false,
    error: null,
    data: null,
  };

  const fetchReducer = (state, action) => {
    switch (action.type) {
      case "loading":
        return { ...initialState, loading: true };
      case "fetched":
        return { ...initialState, data: action.payload };
      case "error":
        return {
          ...initialState,
          error: action.payload,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    const { url, options } = fetchParams;

    if (!url) return;

    cancelRequest.current = false;

    const fetchData = async () => {
      dispatch({ type: "loading" });

      const response = await fetch(url, options);
      const data = await response.json();

      if (cancelRequest.current) return;

      if (response.ok) {
        dispatch({ type: "fetched", payload: data });
      } else {
        dispatch({
          type: "error",
          payload: {
            errorCode: response.status,
            message: data,
          },
        });
      }
    };

    void fetchData();

    return () => {
      cancelRequest.current = true;
    };
  }, [fetchParams]);

  return state;
};

export default useFetch;
