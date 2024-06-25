

module.exports = async function ({github, context}) {
  // define an array of keyword triples, including the label and 
  // the maintainer to assign


  // get the issue info
  const comment = await github.rest.issues.getComment({
                              owner: context.repo.owner,
                              repo: context.repo.repo,
                              comment_id: context.payload.comment.id
                            });

  const issue = await github.rest.issues.get({
                            issue_number: context.issue.number,
                            owner: context.repo.owner,
                            repo: context.repo.repo
                          });
  // if the issue maker and the commenter are the same person, 
  // waiting for requester will be removed
  if (comment.data.user.login == issue.data.user.login) {
    github.rest.issues.removeLabel({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          name: "Waiting for requester"
        });
  };

}