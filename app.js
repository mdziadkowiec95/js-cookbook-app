var recipesController = (function () {

  var Ingredient = function (id, name, amount, unit) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.unit = unit;
  };

  var data = {

    currentRecipe: []

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
    addIngredientBtn: '.add-ingredient',
    currentRecipeList: '.current-recipe__list'
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
    document.querySelector(DOM.addIngredientBtn).addEventListener('click', addIngredient);
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13) {
        addIngredient();
      }
    });
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


  return {
    init: function () {
      document.querySelector(DOM.ingredientName).focus();

      setupEventListeners();
    }
  }

})(recipesController, UIController);


controller.init();