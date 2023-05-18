import { useCallback, useReducer } from "react";

const httpReducer = (state, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...state,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
};

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const useFetch = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = () => {
    dispatchHttp({ type: "CLEAR" });
  };

  const sendRequest = useCallback(
    async (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: "SEND", identifier: reqIdentifier });
      try {
        const response = await fetch(url, {
          method: method,
          body: body,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        dispatchHttp({
          type: "RESPONSE",
          responseData: data,
          extra: reqExtra,
        });
      } catch (error) {
        dispatchHttp({
          type: "ERROR",
          errorMessage: "Something went wrong !!",
        });
      }
    },
    []
  );

  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear: clear,
  };
};

export default useFetch;
