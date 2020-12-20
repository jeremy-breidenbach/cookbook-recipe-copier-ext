import React from 'react'
import ReactDOM from 'react-dom'

console.log('Logged from options page')

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      shouldDownloadImage: false,
      shouldPasteAuthor: false,
      shouldPasteNutrition: false,
      shouldPasteUrl: false
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
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

  handleInputChange (event) {
    const target = event.target
    const value = target.checked
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleCancelClick () {
    window.close()
  }

  handleSave (event) {
    chrome.storage.sync.set({ // eslint-disable-line no-undef
      shouldDownloadImage: this.state.shouldDownloadImage,
      shouldPasteAuthor: this.state.shouldPasteAuthor,
      shouldPasteNutrition: this.state.shouldPasteNutrition,
      shouldPasteUrl: this.state.shouldPasteUrl
    }, function () {
      console.log('Options saved to Chrome storage')
      window.close()
    })
  }

  render () {
    return (
      <div className='column is-full'>
        <h4 className='title is-4'>Options</h4>
        <div className='field'>
          <div className='control'>
            <label className='checkbox' htmlFor='shouldDownloadImage'>
              <input id='shouldDownloadImage' type='checkbox' name='shouldDownloadImage' checked={this.state.shouldDownloadImage} onChange={this.handleInputChange} /> Download Recipe Image
            </label>
          </div>
        </div>
        <div className='field'>
          <div className='control'>
            <label className='checkbox' htmlFor='shouldPasteAuthor'>
              <input id='shouldPasteAuthor' type='checkbox' name='shouldPasteAuthor' checked={this.state.shouldPasteAuthor} onChange={this.handleInputChange} /> Paste Author into Recipe
            </label>
          </div>
        </div>
        <div className='field'>
          <div className='control'>
            <label className='checkbox' htmlFor='shouldPasteNutrition'>
              <input id='shouldPasteNutrition' type='checkbox' name='shouldPasteNutrition' checked={this.state.shouldPasteNutrition} onChange={this.handleInputChange} /> Paste Nutrition into Recipe
            </label>
          </div>
        </div>
        <div className='field'>
          <div className='control'>
            <label className='checkbox' htmlFor='shouldPasteUrl'>
              <input id='shouldPasteUrl' type='checkbox' name='shouldPasteUrl' checked={this.state.shouldPasteUrl} onChange={this.handleInputChange} /> Paste URL into Recipe
            </label>
          </div>
        </div>
        <div className='field is-grouped'>
          <div className='control'>
            <button id='save' className='button is-link' onClick={this.handleSave}>Save Options</button>
          </div>
          <div className='control'>
            <button className='button is-link is-light' onClick={this.handleCancelClick}>Cancel</button>
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
