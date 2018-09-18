import React from 'react'

import data from '../../data/'

import './index.scss'

function getRandomColor() {
	var letters = '0123456789ABCDEF'
	var color = '#'
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

function copyToClipboard(str) {
	const element = document.createElement('input')
	element.style.position = 'absolute'
	element.style.left = '-9999px'
	element.value = str
	document.body.appendChild(element)
	element.select()
	document.execCommand('copy')
	document.body.removeChild(element)
}

const IndexPage = _ => (
	<div className="gallery">
		{data.map(item => {
			const color = [getRandomColor(), getRandomColor()]
			return (
				<div className="item" key={item}>
					<div
						className="item__content"
						style={{
							background: `${color[0]}`,
							background: `linear-gradient(to bottom, ${color[0]}, ${color[1]})`
						}}
						onClick={() => {copyToClipboard(item)}}
						>
						{item}
					</div>
				</div>
				)
		})}
	</div>
)

export default IndexPage
