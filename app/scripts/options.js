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
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.checked
    const name = target.name

    this.setState({
      [name]: value
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
        <div className='field'>
          <div className='control'>
            <button id='submit' className='button is-link'>Save</button>
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
