const fs = require('fs')
const github = require('@actions/github')

const { issue } = github.context.payload

const contents = []
contents.push('---')
contents.push(`title: '${issue.title}'`)
contents.push(`date: ${issue.created_at}`)
contents.push(
  `tags: [${issue.labels.map((v) => '"' + v.name + '"').join(', ')}]\n`,
)
contents.push('---\n')
contents.push(issue.body)

fs.writeFileSync(
  `./content/posts/issues-${issue.number}.md`,
  contents.join('\n'),
)
