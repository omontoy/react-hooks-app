import React, { useEffect, useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientHandler = async (newIngredient) => {
    const response = await fetch(
      "https://react-hooks-review-b7200-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(newIngredient),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      setUserIngredients((prevIngredients) => [
        ...prevIngredients,
        { id: data.name, ...newIngredient },
      ]);
    }
  };

  const removeIngredientHandler = (ingredientId) => {
    setUserIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
    );
  };

  console.log(userIngredients);

  const fetchData = async () => {
    const response = await fetch(
      "https://react-hooks-review-b7200-default-rtdb.firebaseio.com/ingredients.json"
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

    setUserIngredients(loadedIngredients);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
