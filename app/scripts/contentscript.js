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

async function getStorageValue (name) {
  const p = new Promise(function (resolve, reject) {
    chrome.storage.sync.get(name, function (items) { // eslint-disable-line no-undef
      resolve(items[name])
    })
  })

  const configOut = await p
  return configOut
}

async function formatNotes (request) {
  let notes
  const nutrition = getObjectValues(request.nutrition)

  const shouldPasteNutrition = await getStorageValue('shouldPasteNutrition')
  const shouldPasteUrl = await getStorageValue('shouldPasteUrl')

  if (shouldPasteNutrition && shouldPasteUrl) {
    notes = `${nutrition}\n${request.url}`
  } else if (shouldPasteNutrition || shouldPasteUrl) {
    notes = shouldPasteNutrition ? nutrition : request.url
  } else {
    notes = ''
  }
  console.log(notes)
  return notes
}

/* eslint-disable no-undef */
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request)

    const ingredients = _.join(request.recipeIngredient, '\n')
    const instructions = _.join(request.recipeInstructions, '\n')
    // const nutrition = getObjectValues(request.nutrition)
    // const notes = `${nutrition}\n${request.url}`
    const notes = formatNotes(request)
    const author = getStorageValue('shouldPasteAuthor') ? request.author[0].name : ''

    const codeToInsert = '(' + function (request, ingredients, instructions, notes, author) {
      const scope = angular.element($('#recipe-name')).scope()
      scope.$apply(function () {
        scope.recipe.name = request.name
        scope.recipe.yields = request.recipeYield
        scope.recipe.ingredients = ingredients
        scope.recipe.directions = instructions
        scope.recipe.notes = notes
        scope.recipe.originalAuthor = author
      })
    } + ')(' + JSON.stringify(request) + ',' + JSON.stringify(ingredients) + ',' + JSON.stringify(instructions) + ',' + JSON.stringify(notes) + ',' + JSON.stringify(author) + ')'

    const script = document.createElement('script')
    script.textContent = codeToInsert;
    (document.head || document.documentElement).appendChild(script)
    script.remove()

    sendResponse({ farewell: 'goodbye' })
  }
)
/* eslint-enable no-undef */
