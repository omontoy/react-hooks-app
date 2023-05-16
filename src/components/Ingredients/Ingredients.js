import React, { useCallback, useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addIngredientHandler = async (newIngredient) => {
    setLoading(true);
    try {
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
    } catch (error) {
      setError("Something went wrong !!");
    }
  };

  const removeIngredientHandler = async (ingredientId) => {
    setLoading(true);
    try {
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
    } catch (error) {
      setError("Something went wrong !!");
      setLoading(false);
    }
  };

  console.log("INGREDIENTS", userIngredients);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  const cleanError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={cleanError}>{error}</ErrorModal>}
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
