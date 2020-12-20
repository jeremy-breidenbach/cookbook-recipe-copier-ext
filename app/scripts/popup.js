import React from 'react'
import ReactDOM from 'react-dom'

console.log('Logged from popup')

const apiServerUrl = 'https://recipe-parser.azurewebsites.net/api/parse'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      url: '',
      isLoading: false,
      shouldDownloadImage: false,
      shouldPasteAuthor: false,
      shouldPasteNutrition: false,
      shouldPasteUrl: false
    }

    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
  }

  componentDidMount () {
    chrome.storage.sync.get([ // eslint-disable-line no-undef
      'shouldDownloadImage',
      'shouldPasteAuthor',
      'shouldPasteNutrition',
      'shouldPasteUrl'], (items) => {
      this.setState({
        shouldDownloadImage: items.shouldDownloadImage,
        shouldPasteAuthor: items.shouldPasteAuthor,
        shouldPasteNutrition: items.shouldPasteNutrition,
        shouldPasteUrl: items.shouldPasteUrl
      })
    })
  }

  handleUrlChange (event) {
    this.setState({
      url: event.target.value
    })
  }

  handleSubmitClick (event) {
    event.preventDefault()
    fetch(`${apiServerUrl}?url=${this.state.url}`) // eslint-disable-line no-undef
      .then(response => response.json())
      .then(data => {
        const request = {
          data: data,
          options: {
            shouldDownloadImage: this.state.shouldDownloadImage,
            shouldPasteAuthor: this.state.shouldPasteAuthor,
            shouldPasteNutrition: this.state.shouldPasteNutrition,
            shouldPasteUrl: this.state.shouldPasteUrl
          }
        }
        /* eslint-disable no-undef */
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, request, function (response) {
            console.log(response.status)
            window.close()
          })
        })
        /* eslint-enable no-undef */
      })
  }

  render () {
    return (
      <div className='column is-full'>
        <h4 className='title is-4'>Cookbook Recipe Copier</h4>
        <div className='field'>
          <div className='control'>
            <input type='text' className='input' name='url' id='url' value={this.state.url} onChange={this.handleUrlChange} placeholder='Recipe URL' />
          </div>
        </div>
        <div className='field'>
          <div className='control'>
            <button id='submit' className='button is-link' onClick={this.handleSubmitClick}>Copy Recipe</button>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
