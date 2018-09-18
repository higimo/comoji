import React    from 'react'
import ReactDOM from 'react-dom'

import IndexPage from './jsx/page/IndexPage'

import './scss/common.scss'

const App = (props) => (
	<IndexPage />
)

ReactDOM.render(<App />, document.getElementById('application'))
