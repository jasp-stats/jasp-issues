module.exports = async function ({github, context}) {
  const issue = await github.rest.issues.get({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo
  });
  
  const body = issue.data.body;
  // if any of these string are in the issue body, then there was a user upload, 
  // the first string covers all the image/video files
  const regex = /user-attachments/;
  if (!regex.test(body)) {
    const comment = "@" + issue.data.user.login +
      ", thanks for taking the time to create this issue. \
      If possible (and applicable), please upload to the issue website (" 
      + issue.data.html_url +
      ", attaching to an email does not work) a screenshot showcasing the problem, and/or \
      a compressed (zipped) .jasp file or the data file \
      that causes the issue. If you would prefer not to make your \
      data publicly available, you can send your file(s) directly to us,\
      issues@jasp-stats.org";

    github.rest.issues.createComment({
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: comment
    });

    github.rest.issues.addLabels({
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      labels: ["Waiting for requester"]
    });
  };
}