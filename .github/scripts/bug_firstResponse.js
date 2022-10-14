

module.exports = async function ({github, context}) {
  const issue = await github.rest.issues.get({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo
  });
  
  const body = issue.data.body;
  // possible files endings for a screenshot or file upload:
  const regex = /\#\#\# Bug Description\s+.*\s+.*(\.png|\.jpeg|\.jpg|\.pdf|\.zip|\.rar|.csv).*\s+\#\#\#/;
  if (!regex.test(body)) {
    const comment = "@" + issue.data.user.login +
      ", thanks for taking the time to create this issue. \
      If possible (and applicable), please upload in here (" 
      + issue.data.html_url +
      ") a screenshot showcasing the problem, and/or \
      a compressed (zipped) .jasp file or the data file \
      that causes the issue. If you would prefer not to make your \
      data publicly available, you can send your file(s) directly to us,\
      issues@jasp-stats.org" ;

    github.rest.issues.createComment({
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: comment
    });
  };
}