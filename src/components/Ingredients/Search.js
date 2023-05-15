import React, { useEffect, useRef, useState } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onEnteringInput } = props;
  const [inputSearch, setInputSearch] = useState("");

  const inputRef = useRef();

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

        const fetchData = async () => {
          const response = await fetch(
            "https://react-hooks-review-b7200-default-rtdb.firebaseio.com/ingredients.json" +
              query
          );
          const data = await response.json();
          console.log("data", data);

          const loadedIngredients = [];
          for (const key in data) {
            loadedIngredients.push({
              id: key,
              title: data[key].title,
              amount: data[key].amount,
            });
          }

          onEnteringInput(loadedIngredients);
        };

        fetchData();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [inputSearch, onEnteringInput, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
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
