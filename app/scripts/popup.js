console.log('Logged from popup')

const apiServerUrl = 'https://recipe-parser.azurewebsites.net/api/parse'

let url
const urlElement = document.getElementById('url')
const submitElement = document.getElementById('submit')

function updateUrlValue (event) {
  url = event.target.value
}
urlElement.addEventListener('change', updateUrlValue)
urlElement.addEventListener('paste', updateUrlValue)
urlElement.addEventListener('keyup', updateUrlValue)

submitElement.addEventListener('click', (event) => {
  event.preventDefault()
  fetch(`${apiServerUrl}?url=${url}`) // eslint-disable-line no-undef
    .then(response => response.json())
    .then(data => {
      /* eslint-disable no-undef */
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, data, function (response) {
          console.log(response.farewell)
          window.close()
        })
      })
      /* eslint-enable no-undef */
    })
})

// $( document ).ready(function() {
//   let url
//   $("#url").on("change paste keyup", function() {
//     url = $(this).val()
//  })

//   $('#submit').click(function(e) {
//     $.get( `${apiServerUrl}?url=${url}`, function( data ) {
//       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, data, function(response) {
//           // console.log(response.farewell)
//           window.close()
//         })
//       })
//     })
//   })
// })
