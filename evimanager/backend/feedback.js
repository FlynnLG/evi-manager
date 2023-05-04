//Create Feedback request with GitHib API
import { Octokit } from "octokit"


const feedback = async() => {
    const octokit = new Octokit({
        auth: "YOUR_TOKEN"
    })

    await octokit.request('POST /repos/flynnlg/evi-manager/issues', {
        title: 'Feedback from {user}',
        body: ``,
        assignees: [
          'flynnlg',
          'octodino'
        ],
        labels: [
          'Feedback'
        ],
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
}

export default feedback