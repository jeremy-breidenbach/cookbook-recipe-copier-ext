import React from 'react'
import ReactDOM from 'react-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import isUrl from 'validator/lib/isURL'
import _ from 'lodash'

console.log('Logged from popup')

const apiServerUrl = 'https://recipe-parser.azurewebsites.net/api/parse'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      shouldDownloadImage: false,
      shouldPasteAuthor: false,
      shouldPasteNutrition: false,
      shouldPasteUrl: false
    }
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

  handleSubmit (values) {
    fetch(`${apiServerUrl}?url=${values.url}`) // eslint-disable-line no-undef
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

        if (this.state.shouldDownloadImage) {
          chrome.downloads.download({ // eslint-disable-line no-undef
            url: _.isArray(data.image) ? data.image[0] : data.image,
            filename: `${data.name}.jpg`
          })
        }
      })
  }

  render () {
    return (
      <div className='column is-full'>
        <h4 className='title is-4'>Cookbook Recipe Copier</h4>
        <Formik
          initialValues={{ url: '' }}
          validate={values => {
            const errors = {}
            if (!values.url) {
              errors.url = 'Recipe URL is required'
            } else if (
              !isUrl(values.url)
            ) {
              errors.url = 'Recipe URL is invalid'
            }
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            this.handleSubmit(values)
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className='field'>
                <div className='control'>
                  <Field name='url'>
                    {({ field, form, meta }) => (
                      <input type='url' {...field} className={`input ${meta.touched && meta.error ? 'is-danger' : ''}`} id='url' placeholder='Recipe URL' />
                    )}
                  </Field>
                </div>
                <ErrorMessage name='url' component='p' className='help is-danger' />
              </div>
              <div className='field'>
                <div className='control'>
                  <button id='submit' type='submit' className={`button is-link ${isSubmitting ? 'is-loading' : ''}`}>Copy Recipe</button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
