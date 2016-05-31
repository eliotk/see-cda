# see-cda

A JS app featuring a timeline view w/ the goal of surfacing patterns and providing tools to explore patient health information from CDA document data.

Built to be extensible and easily add new views.

Demo: http://eliotk.github.io/see-cda

## Development

### Install

* Use a mininum of node version 4.*
* `npm install`

To start the dev server:

`webpack-dev-server --inline`

To update the demo in gh-pages:

* `git checkout gh-pages`
* `git rebase master`
* `git push origin gh-pages`
