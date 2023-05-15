import React, { useCallback, useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  const addIngredientHandler = async (newIngredient) => {
    setLoading(true);
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

      setLoading(false);

      setUserIngredients((prevIngredients) => [
        ...prevIngredients,
        { id: data.name, ...newIngredient },
      ]);
    }
  };

  const removeIngredientHandler = async (ingredientId) => {
    setLoading(true);
    await fetch(
      `https://react-hooks-review-b7200-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    );
    setLoading(false);

    setUserIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
    );
  };

  console.log("INGREDIENTS", userIngredients);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  return (
    <div className="App">
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={loading}
      />

      <section>
        <Search onEnteringInput={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
