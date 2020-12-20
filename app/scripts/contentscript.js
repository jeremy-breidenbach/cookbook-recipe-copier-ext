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

function formatNotes (data, options) {
  let notes = ''
  const nutrition = getObjectValues(data.nutrition)

  const shouldPasteNutrition = options.shouldPasteNutrition
  const shouldPasteUrl = options.shouldPasteUrl

  if (shouldPasteNutrition && shouldPasteUrl) {
    notes = `${nutrition}\n${data.url}`
  } else if (shouldPasteNutrition || shouldPasteUrl) {
    notes = shouldPasteNutrition ? nutrition : data.url
  } else {
    notes = ''
  }

  return notes
}

/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request)

    const data = request.data
    const options = request.options

    const author = options.shouldPasteAuthor ? data.author[0].name : ''
    const ingredients = _.join(data.recipeIngredient, '\n')
    const instructions = _.join(data.recipeInstructions, '\n')
    const notes = formatNotes(data, options)

    const codeToInsert = '(' + function (data, ingredients, instructions, notes, author) {
      const scope = angular.element($('#recipe-name')).scope()
      scope.$apply(function () {
        scope.recipe.name = data.name
        scope.recipe.yields = data.recipeYield
        scope.recipe.ingredients = ingredients
        scope.recipe.directions = instructions
        scope.recipe.notes = notes
        scope.recipe.originalAuthor = author
      })
    } + ')(' + JSON.stringify(data) + ',' + JSON.stringify(ingredients) + ',' + JSON.stringify(instructions) + ',' + JSON.stringify(notes) + ',' + JSON.stringify(author) + ')'

    const script = document.createElement('script')
    script.textContent = codeToInsert;
    (document.head || document.documentElement).appendChild(script)
    script.remove()

    sendResponse({ status: 'Message received' })
  }
)
/* eslint-enable no-undef */
