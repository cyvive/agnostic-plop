require('resquire')

const root = '../..'
const plop = '..'
const {fileContains, bumpComVer} = require('../helper')
const R = require('rambdax')

const schemaLatest = R.path('version', require('^iface/schema')())

module.exports = {
	description: 'Add a new external API (REST Comptible)',
	prompts: [
		{
			type: 'list',
			name: 'name',
			message: `Existing Schema Version: ${schemaLatest}\n  Select Version to Bump`,
			choices: ['Major', 'Minor']
		}
	],
	actions: answers => {
		const newVersion = require('semver-increment')(
			answers.name === 'Major' ? [1, 0, 0] : [0, 1, 0],
			schemaLatest
		)
		const actions = []

		if (
			!fileContains({
				filePath: `${process.cwd()}/iface/schema.js`,
				text: `${newVersion}`
			})
		) {
			actions.push({
				path: `${root}/iface/schema.js`,
				pattern: '/* PlopInjection:Schema */',
				template: `schemaVersions['${newVersion}'] = {}`,
				type: 'append'
			})
			actions.push(() =>
				bumpComVer({
					type: 'schemas',
					name: '_self'
				})
			)
		}

		return actions
	}
}