

module.exports = async function ({github, context}) {
  // define an array of keyword triples, including the label and 
  // the maintainer to assign


  // get the issue info
  const comment = await github.rest.issues.getComment({
                          owner: context.repo.owner,
                          repo: context.repo.repo,
                          comment_id: context.payload.comment.id
                        });
  const commentBody = comment.data.body;
  const regex = /duplicate of/i;
  let found = regex.test(commentBody);
  // if "duplicate of" is in the comment body, hand out the label:
  if (found) {
    github.rest.issues.addLabels({
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      labels: [
        "duplicate"
      ]
    });
  }
}