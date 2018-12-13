var recipesController = (function () {

  var Ingredient = function (id, name, amount, unit) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.unit = unit;
  };

  var Recipe = function (id, name, recipe) {
    this.id = id;
    this.name = name;
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

    addCurRecipe: function (name) {
      var newRecipe, ID;

      if (data.allRecipes.length > 0) {
        ID = data.allRecipes[data.allRecipes.length - 1].id + 1;
      } else {
        ID = 0;
      }

      newRecipe = new Recipe(ID, name, data.currentRecipe);

      data.allRecipes.push(newRecipe);
      console.log(data.allRecipes);

      return ID;

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

    newRecipeName: '.current-recipe__name',

    // buttons
    addIngredientBtn: '.add-ingredient',
    saveRecipeBtn: '.current-recipe__save',
    allRecipes: '.recipes'

  }

  // variable to store current recipe. onClick append it to html
  var newRecipe = document.createElement('ul');

  return {
    getInput: function () {
      return {
        ingredient: document.querySelector(DOMstrings.ingredientName).value,
        amount: document.querySelector(DOMstrings.ingredientAmount).value,
        unit: document.querySelector(DOMstrings.ingredientUnit).value,

      }
    },

    addIngredient: function (ID, name, amount, unit) {
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
      // debugger;
      document.querySelector(DOMstrings.currentRecipeList).appendChild(newIngredient);

      // clear inputs
      this.clearAddInputs();

      return newIngredient;

    },

    clearAddInputs: function () {
      var inputs;

      inputs = document.querySelectorAll(DOMstrings.ingredientName + ',' + DOMstrings.ingredientAmount);
      // debugger;
      inputsArr = Array.prototype.slice.call(inputs);

      inputsArr.forEach(function (input) {
        input.value = '';
      });

      inputs[0].focus();
    },

    curRecipeAddChild: function (ingredient) {
      newRecipe.appendChild(ingredient)
      console.log(newRecipe);
    },

    curRecipeDelChild: function (id) {
      newRecipe.removeChild(newRecipe.children[id]);
    },

    addRecipe: function (id) {
      // var curRecipe, newRecipe;

      // curRecipeStr = document.querySelector(DOMstrings.currentRecipeList).innerHTML;

      // newRecipe = document.createElement('ul');
      newRecipe.className = 'recipes__list';
      newRecipe.setAttribute('data-id', id);
      newRecipeCloned = newRecipe.cloneNode(true);
      // newRecipe.innerHTML = curRecipeStr;
      document.querySelector(DOMstrings.allRecipes).appendChild(newRecipeCloned);

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
    var input, newItem, newItemEl, clonedEl;

    input = UICtrl.getInput();

    if (input.ingredient !== '' && !isNaN(parseFloat(input.amount))) {
      newItem = recipesCtrl.addItem(input.ingredient, input.amount, input.unit);
      // debugger;

      // Update current list element on the UI
      newItemEl = UICtrl.addIngredient(newItem.id, input.ingredient, input.amount, input.unit);
      // Removing button to display it on allRecipes section
      clonedEl = newItemEl.cloneNode(true);
      clonedEl.removeChild(clonedEl.lastChild);

      UIController.curRecipeAddChild(clonedEl);

    }
  }

  var deleteIngredient = function (e) {

    var parent = e.target.parentNode;

    if (parent.id && e.target.tagName === 'BUTTON') {

      // remove from recipes DATA
      recipesCtrl.removeItem(parseInt(parent.id));

      // remove from the UI
      document.querySelector(DOM.currentRecipeList).removeChild(parent);

      // remove from newRecipe temporary variable
      UIController.curRecipeDelChild(parseInt(parent.id));
    }
  }

  var saveCurrentRecipe = function () {
    var name;

    name = document.querySelector(DOM.newRecipeName).value;

    if (name !== '') {

      // add current recipe to DATA structure
      var ID = recipesCtrl.addCurRecipe(name);
      // clear current recipe DATA array


      // add current recipe to the UI
      UIController.addRecipe(ID);

    }
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