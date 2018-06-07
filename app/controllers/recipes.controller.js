// const Users = require('../models/users');
const Recipes = require('../models/recipes');

const userFieldsSelect = 'local.username';

function createRecipe(userId, recipeBody) {
  recipeBody._user = userId;
  const recipe = new Recipes(recipeBody);
  return recipe.save();
}

function getAllRecipes() {
  return Recipes
    .find({})
    .sort({ 'createdAt': -1 })
    .populate({
      path: '_user',
      select: userFieldsSelect
    });
}

function getRecipeByUser(userId) {
  return Recipes
    .find({ '_user': userId})
    .sort({ 'createdAt': -1 })
    .populate({
      path: '_user',
      select: userFieldsSelect
    });
}

function getOneRecipe(recipeId) {
  return Recipes
    .findOne({ _id: recipeId})
    .sort({ 'createdAt': -1 })
    .populate({
      path: '_user',
      select: userFieldsSelect
    });
}

function deleteOneRecipe(recipeId) {
  return Recipes
    .deleteOne({ '_id': recipeId });

}

function deleteAllRecipesForUser(userId) {
  return Recipes
    .deleteMany({ '_user': userId });
}



// used by auth for now
function updateOneRecipe(recipeId, update) {
  return Recipes
    .findOne({ _id: recipeId })
    .sort({ 'createdAt': -1 })
    .populate({
      path: '_user',
      select: userFieldsSelect
    })
    .then((doc) => {
      if (!doc) {
        return Promise.reject(new Error('Document not found!'));
      }
      // console.log(doc);
      doc = Object.assign(doc, update);
      // console.log(doc);
      return doc.save();
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

module.exports = {
  getAllRecipes,
  createRecipe,
  getRecipeByUser,
  getOneRecipe,
  deleteAllRecipesForUser,
  deleteOneRecipe,
  updateOneRecipe,
}