import React, { useCallback, useReducer } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from "../UI/ErrorModal";

const ingredientsReducer = (state, action) => {
  switch (action.type) {
    case "LOAD":
      return action.ingredients;
    case "ADD":
      return [...state, action.ingredient];
    case "DELETE":
      return state.filter((ing) => ing.id !== action.id);

    default:
      return state;
  }
};

const initialIngredients = [];

const httpReducer = (state, action) => {
  switch (action.type) {
    case "SEND":
      return { ...state, loading: true };
    case "RESPONSE":
      return { ...state, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialHttp = {
  loading: false,
  error: null,
};

function Ingredients() {
  const [userIngredients, dispatchIngredients] = useReducer(
    ingredientsReducer,
    initialIngredients
  );

  const [httpState, dispatchHttp] = useReducer(httpReducer, initialHttp);

  const addIngredientHandler = async (newIngredient) => {
    dispatchHttp({ type: "SEND" });
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

        dispatchHttp({ type: "RESPONSE" });

        dispatchIngredients({
          type: "ADD",
          ingredient: { id: data.name, ...newIngredient },
        });
      }
    } catch (error) {
      dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong !!" });
    }
  };

  const removeIngredientHandler = async (ingredientId) => {
    dispatchHttp({ type: "SEND" });
    try {
      await fetch(
        `https://react-hooks-review-b7200-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
        {
          method: "DELETE",
        }
      );
      dispatchHttp({ type: "RESPONSE" });
      dispatchIngredients({ type: "DELETE", id: ingredientId });
    } catch (error) {
      dispatchHttp({ type: "ERROR" });
      dispatchHttp({ type: "RESPONSE" });
    }
  };

  console.log("INGREDIENTS", userIngredients);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatchIngredients({ type: "LOAD", ingredients: filteredIngredients });
  }, []);

  const cleanError = () => {
    dispatchHttp({ type: "CLEAR" });
  };

  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={cleanError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
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
