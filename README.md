# Cookbook Recipe Copier

Copy a recipe from a URL and paste into Create My Cookbook

## Overview
This Chrome extension makes use of a publicly available API [Recipe scraper server](https://recipe-parser.azurewebsites.net/api) to scrape a recipe for a given URL and paste the recipe into the [CreateMyCookbook.com](https://createmycookbook.com/home) recipe form.

This extension was built with webextension-toolbox, React, Lodash, and Bulma CSS.

## Installing extension packages

	$ npm install

## Development

    npm run dev chrome
    npm run dev firefox
    npm run dev opera
    npm run dev edge

Standard JS is used as a dev dependency for code linting.

## Building the extension

    npm run build chrome
    npm run build firefox
    npm run build opera
    npm run build edge

## Environment

The build tool also defines a variable named `process.env.NODE_ENV` in your scripts. 

## Docs

* [webextension-toolbox](https://github.com/HaNdTriX/webextension-toolbox)

## Helpful Articles
* [Stack Overflow answer detailing how to update Angular](https://stackoverflow.com/a/9517879)
* [Stack Overflow answer on updating Angular value](https://stackoverflow.com/a/43969802)

## Icon
* Sourced from [flaticon](https://www.flaticon.com/free-icons/cookbook#)
* Attribution is required, their docs state the following: 

>Apps, games, desktop apps, etc
>>Paste this link on the website where your app is available for download or in the description section of the platform or marketplace you’re using.


```
<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
```