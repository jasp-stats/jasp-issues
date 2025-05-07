

module.exports = async function ({github, context}, keywords) {
  // define an array of keyword triples, including the label and 
  // the maintainer to assign

  // get the issue info
  const issue = await github.rest.issues.get({
                        issue_number: context.issue.number,
                        owner: context.repo.owner,
                        repo: context.repo.repo
                      });
  // get the issue body
  const body = issue.data.body;
  
  // get labels and assignees
  var labelNames = [];
  for (label of issue.data.labels) {
    labelNames.push(label.name);
  }

  var assigneeNames = [];
  for (assignee of issue.data.assignees) {
    assigneeNames.push(assignee.login);
  }

  // Extract the answer(s) to the module question
  const match = body.match(/### (JASP Module|Is your feature request related to a JASP module\?)\s*\n+(.+?)\s*(\n|$)/i);

  if (match && match[2]) {
    const rawAnswers = match[2].split(/[,;\n]/).map(ans => ans.trim().toLowerCase());
    const uniqueAnswers = [...new Set(rawAnswers)];

    for (const [keyword, label, assignee] of keywords.modules) {
      const keywordLower = keyword.toLowerCase();

      if (uniqueAnswers.includes(keywordLower)) {
        if (label) {
          await github.rest.issues.addLabels({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            labels: [label]
          });
        }
        if (assignee) {
          await github.rest.issues.addAssignees({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            assignees: [assignee]
          });
        }
      }
    }
  }


  const regexOS1 = "\\#\\#\\# What OS are you seeing the problem on\\?\\s+,*.*(";
  const regexOS2 = ").*\\s+\\#\\#\\#";
  // test if OS keyword is in issue body
  for (const words of keywords.oses) {

    var regex = new RegExp(regexOS1 + words[0] + regexOS2, "i");
    let found = regex.test(body);

    // label
    if (found) {
      github.rest.issues.addLabels({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        labels: [
          words[1]
        ]
      });
    }
  }
}