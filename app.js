var recipesController = (function () {

  var Ingredient = function (id, name, amount, unit) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.unit = unit;
  };

  var Recipe = function (id, recipe) {
    this.id = id;
    this.recipe = recipe;
  };

  var data = {

    currentRecipe: [],
    allRecipes: []

  };

  return {
    addItem: function (name, amount, unit) {
      var newItem, ID;

      if (data.currentRecipe.length > 0) {
        ID = data.currentRecipe[data.currentRecipe.length - 1].id + 1;
      } else {
        ID = 0;
      }

      newItem = new Ingredient(ID, name, amount, unit);

      data.currentRecipe.push(newItem);

      return newItem;
    },

    removeItem: function (ID) {

      idArr = data.currentRecipe.map(function (cur) {
        return cur.id;
      });
      // debugger;
      data.currentRecipe.splice(idArr.indexOf(ID), 1);
    },

    addCurRecipe: function () {
      var newRecipe, ID;

      ID = 'testID';

      if (data.allRecipes.length > 0) {
        ID = data.allRecipes[data.allRecipes.length - 1].id + 1;
      } else {
        ID = 0;
      }

      newRecipe = new Recipe(ID, data.currentRecipe);

      data.allRecipes.push(newRecipe);


    },

    showData: function () {
      console.log(data);
    }
  }

})();


var UIController = (function () {

  var DOMstrings = {
    ingredientName: '.panel__name',
    ingredientAmount: '.panel__amount',
    ingredientUnit: '.panel__unit',
    currentRecipeList: '.current-recipe__list',

    // buttons
    addIngredientBtn: '.add-ingredient',
    saveRecipeBtn: '.current-recipe__save'

  }

  return {
    getInput: function () {
      return {
        ingredient: document.querySelector(DOMstrings.ingredientName).value,
        amount: document.querySelector(DOMstrings.ingredientAmount).value,
        unit: document.querySelector(DOMstrings.ingredientUnit).value,

      }
    },

    updateIngredients: function (ID, name, amount, unit) {
      var newIngredient, ing, am, uni, btnDelete;

      newIngredient = document.createElement('li');
      newIngredient.classList.add('current-recipe__item');
      newIngredient.id = ID;

      ing = document.createElement('span');
      ing.className = 'current-recipe__ingredient';
      ing.textContent = name;

      am = document.createElement('span');
      am.className = 'current-recipe__amount';
      am.textContent = amount + ' ' + unit;

      btnDelete = document.createElement('button');
      btnDelete.className = 'current-recipe__delete btn btn-danger';
      btnDelete.textContent = '-';

      newIngredient.appendChild(ing);
      newIngredient.appendChild(am);
      newIngredient.appendChild(btnDelete);

      document.querySelector(DOMstrings.currentRecipeList).appendChild(newIngredient);

      // clear inputs
      this.clearInputs();

    },

    clearInputs: function () {
      var inputs;

      inputs = document.querySelectorAll(DOMstrings.ingredientName + ',' + DOMstrings.ingredientAmount);
      // debugger;
      inputsArr = Array.prototype.slice.call(inputs);

      inputsArr.forEach(function (input) {
        input.value = '';
      });

      inputs[0].focus();
    },

    getDOMstrings: function () {
      return DOMstrings;
    }
  }


})();


var controller = (function (recipesCtrl, UICtrl) {

  var DOM = UICtrl.getDOMstrings();

  var setupEventListeners = function () {

    // add one ingredient to current recipe
    document.querySelector(DOM.addIngredientBtn).addEventListener('click', addIngredient);
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13) {
        addIngredient();
      }
    });

    // delete one ingredient from current recipe
    document.querySelector(DOM.currentRecipeList).addEventListener('click', deleteIngredient);


    document.querySelector(DOM.saveRecipeBtn).addEventListener('click', saveCurrentRecipe);

  }


  var addIngredient = function () {
    var input, newItem;

    input = UICtrl.getInput();

    if (input.ingredient !== '' && !isNaN(parseFloat(input.amount))) {
      newItem = recipesCtrl.addItem(input.ingredient, input.amount, input.unit);
      // debugger;
      UICtrl.updateIngredients(newItem.id, input.ingredient, input.amount, input.unit);
    }


  }

  var deleteIngredient = function (e) {

    var parent = e.target.parentNode;

    if (parent.id && e.target.tagName === 'BUTTON') {

      recipesCtrl.removeItem(parseInt(parent.id));
      document.querySelector(DOM.currentRecipeList).removeChild(parent);
    }
  }

  var saveCurrentRecipe = function () {

    // add current recipe to DATA structure
    recipesCtrl.addCurRecipe();
    // clear current recipe DATA array

    // add current recipe to the UI

    // clear the current-recipe UI

    //


  }


  return {
    init: function () {
      // Make ingredient input focused when App starts
      document.querySelector(DOM.ingredientName).focus();

      // Disable SAVE button when App starts
      document.querySelector(DOM.saveRecipeBtn).disabled = false;

      setupEventListeners();
    }
  }

})(recipesController, UIController);


controller.init();