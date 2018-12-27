




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

    currentRecipe: [], // current recipe Ingredient instances
    allRecipes: []  // Recipe instances

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
      // debugger;

      if (data.allRecipes.length > 0) {
        ID = data.allRecipes[data.allRecipes.length - 1].id + 1;
      } else {
        ID = 0;
      }

      curRecipeCopy = data.currentRecipe.map(function (cur) {
        return cur;
      });

      // console.log(x);

      newRecipe = new Recipe(ID, name, curRecipeCopy);


      data.allRecipes.push(newRecipe);
      console.log(data.allRecipes);

      return ID;

    },

    removeRecipe: function (recipeID) {
      recipeIDs = data.allRecipes.map(function (cur) {
        return cur.id;
      });

      data.allRecipes.splice(recipeIDs.indexOf(recipeID), 1);
    },

    clearCurRecipe: function () {
      data.currentRecipe = [];
      // console.log(data.currentRecipe);
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
    recipeList: '.recipe__list',

    newRecipeName: '.recipe__name',

    // buttons
    addIngredientBtn: '.add-ingredient',
    saveRecipeBtn: '.recipe__save',
    removingModeToggler: '.all-recipes__mode-toggler',

    allRecipes: '.all-recipes',
    // allRecipesBox: '.all-recipes__box'
    confirmWrapper: '.confirm',
    confirmButtons: '.confirm__buttons'

  }

  // variable to store current recipe. onClick append it to html
  var newRecipeList = document.createElement('ul');
  newRecipeList.className = 'recipe__list';

  return {
    getInput: function () {
      return {
        ingredient: document.querySelector(DOMstrings.ingredientName).value,
        amount: document.querySelector(DOMstrings.ingredientAmount).value,
        unit: document.querySelector(DOMstrings.ingredientUnit).value,

      }
    },

    addIngredient: function (ID, name, amount, unit) {
      var newIngredient, ing, am, btnDelete;

      newIngredient = document.createElement('li');
      newIngredient.classList.add('recipe__item');
      newIngredient.id = ID;

      ing = document.createElement('span');
      ing.className = 'recipe__ingredient';
      ing.textContent = name;

      am = document.createElement('span');
      am.className = 'recipe__amount';
      am.textContent = amount + ' ' + unit;

      btnDelete = document.createElement('button');
      btnDelete.className = 'recipe__delete btn btn-danger';
      btnDelete.textContent = '-';

      newIngredient.appendChild(ing);
      newIngredient.appendChild(am);

      newIngredient.appendChild(btnDelete);
      // debugger;
      document.querySelector(DOMstrings.recipeList).appendChild(newIngredient);

      // clear inputs
      this.clearAddInputs();

      return newIngredient;

    },

    removeIngredient: function (ingredient) {
      document.querySelector(DOMstrings.recipeList).removeChild(ingredient);
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

    resetCurRecipe: function () {
      document.querySelector(DOMstrings.newRecipeName).value = "";
      var curRec = document.querySelector(DOMstrings.recipeList);

      while (newRecipeList.hasChildNodes() && curRec.hasChildNodes()) {
        newRecipeList.removeChild(newRecipeList.lastChild);
        curRec.removeChild(curRec.lastChild);
      }
    },

    curRecipeAddChild: function (ingredient) {
      var clonedEl;

      clonedEl = ingredient.cloneNode(true);
      clonedEl.removeChild(clonedEl.lastChild);
      newRecipeList.appendChild(clonedEl)
      // console.log(newRecipe);
    },

    curRecipeDelChild: function (id) {
      for (var i = 0; i < newRecipeList.children.length; i++) {
        if (newRecipeList.children[i].id == id) {
          newRecipeList.removeChild(newRecipeList.children[i]);
        }
      }
    },

    addRecipe: function (id, name) {
      var recipeBox, nameEl, deleteRecipeBtn;

      nameEl = document.createElement('h3');
      nameEl.className = 'recipe__heading';
      nameEl.textContent = name;

      deleteRecipeBtn = document.createElement('BUTTON');
      deleteRecipeBtn.className = 'all-recipes__delete btn btn-danger';
      deleteRecipeBtn.textContent = 'x';

      // cloned current recipe LIST
      newRecipeCloned = newRecipeList.cloneNode(true);

      // creating single recipe wrapper element
      recipeBox = document.createElement('div');
      recipeBox.className = 'all-recipes__box';
      recipeBox.dataset.id = id;
      recipeBox.appendChild(nameEl); // adding name to recipe wrapper el
      recipeBox.appendChild(newRecipeCloned); // adding current recipe list to recipe wrapper el
      recipeBox.appendChild(deleteRecipeBtn);

      document.querySelector(DOMstrings.allRecipes).appendChild(recipeBox);
    },

    toggleRemovingMode: function (e) {
      var allRecipesWrapper = document.querySelector(DOMstrings.allRecipes);

      if (allRecipesWrapper.classList.contains('removing')) {
        allRecipesWrapper.classList.remove('removing');
        e.target.textContent = 'Turn ON removing MODE';
      } else {
        allRecipesWrapper.classList.add('removing');
        e.target.textContent = 'Turn OFF removing MODE';
      }

    },

    showConfirmModal: function () {
      document.querySelector(DOMstrings.confirmWrapper).classList.remove('js-hidden');
    },

    hideConfirmModal: function () {
      document.querySelector(DOMstrings.confirmWrapper).classList.add('js-hidden');
    },

    removeRecipe: function (recipeEl) {
      document.querySelector(DOMstrings.allRecipes).removeChild(recipeEl);
    },

    setSaveBtnState: function () {
      var saveBtn = document.querySelector(DOMstrings.saveRecipeBtn);

      if (document.querySelector('.recipe' + ' ' + DOMstrings.recipeList).children.length > 0) {
        saveBtn.disabled = false;
      } else {
        saveBtn.disabled = true;
      }
    },

    getDOMstrings: function () {
      return DOMstrings;
    }
  }

})();


var controller = (function (recipesCtrl, UICtrl) {

  var DOM = UICtrl.getDOMstrings();
  var clickedRecipe;

  var setupEventListeners = function () {

    // add one ingredient to current recipe
    document.querySelector(DOM.addIngredientBtn).addEventListener('click', addIngredient);
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13) {
        addIngredient();
      }
    });

    // delete one ingredient from current recipe
    document.querySelector(DOM.recipeList).addEventListener('click', deleteIngredient);

    // save current recipe to All recipes list
    document.querySelector(DOM.saveRecipeBtn).addEventListener('click', saveCurrentRecipe);

    // delete recipe from All recipes list (set up listener to '.all-recipes' wrapper)
    document.querySelector(DOM.allRecipes).addEventListener('click', showConfirmModal);
    document.querySelector(DOM.confirmButtons).addEventListener('click', deleteRecipe);


    // toggle removing recipe MODE
    document.querySelector(DOM.removingModeToggler).addEventListener('click', UICtrl.toggleRemovingMode);
  }


  var addIngredient = function () {
    var input, newItem, newItemEl;

    input = UICtrl.getInput();

    if (input.ingredient !== '' && !isNaN(parseFloat(input.amount))) {
      newItem = recipesCtrl.addItem(input.ingredient, input.amount, input.unit);

      // Add an ingredient to the current recipe UI
      newItemEl = UICtrl.addIngredient(newItem.id, input.ingredient, input.amount, input.unit);

      UICtrl.curRecipeAddChild(newItemEl);

      // set ('.recipe__save') button state to ACTIVE or DISABLED
      UICtrl.setSaveBtnState();

    }
  }

  var deleteIngredient = function (e) {

    var parent = e.target.parentNode;

    if (parent.id && e.target.tagName === 'BUTTON') {

      // remove from recipes DATA
      recipesCtrl.removeItem(parseInt(parent.id));

      // remove from the UI
      UICtrl.removeIngredient(parent);

      // remove from newRecipe temporary variable
      UICtrl.curRecipeDelChild(parseInt(parent.id));

      // set ('.recipe__save') button state to ACTIVE or DISABLED
      UICtrl.setSaveBtnState();
    }
  }

  var saveCurrentRecipe = function () {
    var name;

    name = document.querySelector(DOM.newRecipeName).value;

    if (name !== '') {

      // add current recipe to DATA structure
      var ID = recipesCtrl.addCurRecipe(name);

      // add current recipe to the UI
      UICtrl.addRecipe(ID, name);

      // clear current recipe from DATA array
      recipesCtrl.clearCurRecipe();

      // reset current recipe UI elements
      UICtrl.resetCurRecipe();

      // set ('.recipe__save') button state to ACTIVE or DISABLED
      UICtrl.setSaveBtnState();

    }
  }

  var showConfirmModal = function (e) {

    clickedRecipe = e.target.parentNode;

    if (clickedRecipe.dataset.id && e.target.tagName === 'BUTTON') {
      UICtrl.showConfirmModal();
    }

  }

  var deleteRecipe = function (e) {
    var clickedEl = e.target;

    if (clickedEl.tagName === 'BUTTON') {

      if (clickedEl.className === 'btn btn-success') {
        // remove from recipes DATA
        recipesCtrl.removeRecipe(parseInt(clickedRecipe.dataset.id));

        // remove from the UI
        UICtrl.removeRecipe(clickedRecipe);

        // hide confirm modal from the UI

        UICtrl.hideConfirmModal();

      } else if (clickedEl.className === 'btn btn-danger') {
        UICtrl.hideConfirmModal();
      }


    }
  }

  return {
    init: function () {
      // Make ingredient input focused when App starts
      document.querySelector(DOM.ingredientName).focus();

      // Disable SAVE button when App starts
      document.querySelector(DOM.saveRecipeBtn).disabled = true;

      setupEventListeners();
    }
  }

})(recipesController, UIController);


controller.init();