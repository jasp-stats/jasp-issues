

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

  // test if module keyword is in issue body
  const regexModule1 = "\\#\\#\\# JASP Module\\s+,*.*("
  const regexModule2 = ").*\\s+\\#\\#\\#";
  for (const words of keywords.modules) {
    // create the regex to match with, case insensitive
    var regex = new RegExp(regexModule1 + words[0] + regexModule2, "i");
    let found = regex.test(body);

    // label and assign someone
    if (found) {
      // checks if there is actually a label specified in the keywords
      if (words[1].length > 0) {
        github.rest.issues.addLabels({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          labels: [
            words[1]
          ]
        });
      }
      // checks if there is actually an assignee specified in the keywords
      if (words[2].length > 0) {
        github.rest.issues.addAssignees({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          assignees: [
            words[2]
          ]
        });
      }
    }
    else { // is there no match but the label is already set? then remove it
      if (labelNames.includes(words[1])) {
        github.rest.issues.removeLabel({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          name: words[1]
        });
      } // same for assignees
      if (assigneeNames.includes(words[2])) {
        github.rest.issues.removeAssignees({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          assignees: [
            words[2]
          ]
        });
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
    else { // is there no match but the label is already set? then remove it
      if (labelNames.includes(words[1])) {
        github.rest.issues.removeLabel({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          name: words[1]
        });
      }
    }
  }
}