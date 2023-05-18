import React, { useEffect, useRef, useState } from "react";
import useFetch from "../../hooks/useFetch";

import Card from "../UI/Card";
import ErrorModal from "../UI/ErrorModal";
import "./Search.css";

const Search = React.memo((props) => {
  const { onEnteringInput } = props;
  const [inputSearch, setInputSearch] = useState("");

  const inputRef = useRef();

  const { isLoading, error, data, sendRequest, clear } = useFetch();

  const inputChangeHandler = (e) => {
    const { value } = e.target;
    setInputSearch(value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputSearch === inputRef.current.value) {
        const query =
          inputSearch.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${inputSearch}"`;

        sendRequest(
          "https://react-hooks-review-b7200-default-rtdb.firebaseio.com/ingredients.json" +
            query,
          "GET"
        );
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [inputSearch, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }

      onEnteringInput(loadedIngredients);
    }
  }, [isLoading, error, data, onEnteringInput]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading ...</span>}
          <input
            type="text"
            onChange={inputChangeHandler}
            value={inputSearch}
            ref={inputRef}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
