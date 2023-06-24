import { useEffect, useReducer } from "react";

import Header from "./components/Header";
import Main from "./components/Main";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";

const initialState = {
  questions: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_QUESTIONS_READY":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "FETCH_QUESTIONS_ERROR":
      return {
        ...state,
        status: "error",
      };
    default:
      throw Error(`unhandled action type: ${action.type}`);
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status } = state;

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) =>
        dispatch({ type: "FETCH_QUESTIONS_READY", payload: data })
      )
      .catch((error) => dispatch({ type: "FETCH_QUESTIONS_ERROR" }));
  }, []);

  return (
    <div className="app">
      <Header></Header>
      <Main>
        {status === "loading" && <Loading></Loading>}
        {status === "error" && <ErrorMessage></ErrorMessage>}
        {status === "ready" && (
          <ul>
            {questions.map((question) => (
              <li key={question.id}>{question.title}</li>
            ))}
          </ul>
        )}
      </Main>
    </div>
  );
}
