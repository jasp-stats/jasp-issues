module.exports = async function ({github, context}) {
  const issue = await github.rest.issues.get({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo
  });
  
  const body = issue.data.body;
  // if any of these string are in the issue body, then there was a user upload, 
  // the first string covers all the image/video files
  const regex = /\.log\b/; // Updated regex to remove "user-attachments"
  if (!regex.test(body)) {
    const comment = "@" + issue.data.user.login +
      ", thanks for taking the time to create this report. \
      Please upload to the issue website (" 
      + issue.data.html_url +
      ", attaching to an email does not work) the **log files** from JASP. \
      For more information read our [Logging Guide](https://github.com/jasp-stats/jasp-desktop/blob/stable/Docs/user-guide/logging-howto.md) \
      page to learn where to (and how to) find JASP log files.";

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