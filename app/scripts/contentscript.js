import _ from 'lodash'

console.log('Logged from content script')

function getObjectValues (object) {
  let objectText = ''
  for (const property in object) {
    if (object[property] && property !== '@type') {
      objectText = objectText + `${_.startCase(property)}: ${object[property]}\n`
    }
  }
  return objectText
}

/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request)
    const ingredients = _.join(request.recipeIngredient, '\n')
    const instructions = _.join(request.recipeInstructions, '\n')
    const nutrition = getObjectValues(request.nutrition)
    const notes = `${nutrition}\n${request.url}`

    const codeToInsert = '(' + function (request, ingredients, instructions, notes) {
      const scope = angular.element($('#recipe-name')).scope()
      scope.$apply(function () {
        scope.recipe.name = request.name
        scope.recipe.yields = request.recipeYield
        scope.recipe.ingredients = ingredients
        scope.recipe.directions = instructions
        scope.recipe.notes = notes
      })
    } + ')(' + JSON.stringify(request) + ',' + JSON.stringify(ingredients) + ',' + JSON.stringify(instructions) + ',' + JSON.stringify(notes) + ')'

    const script = document.createElement('script')
    script.textContent = codeToInsert;
    (document.head || document.documentElement).appendChild(script)
    script.remove()

    sendResponse({ farewell: 'goodbye' })
  }
)
/* eslint-enable no-undef */
