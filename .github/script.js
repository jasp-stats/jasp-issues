

module.exports = async function ({github, context}) {
  // define an array of keyword triples, including the label and 
  // the maintainer to assign
  const moduleKeywords = [
    [/\#\#\# JASP Module\s+,*.*(Unrelated).*\s+\#\#\#/, 
    "", "boutinb"],
    [/\#\#\# JASP Module\s+,*.*(ANOVA).*\s+\#\#\#/, 
    "jaspAnova", "JohnnyDoorn"],
    [/\#\#\# JASP Module\s+,*.*(Audit).*\s+\#\#\#/, 
    "jaspAudit", "koenderks"],
    [/\#\#\# JASP Module\s+,*.*(Bain).*\s+\#\#\#/, 
    "jaspBain", "koenderks"],
    [/\#\#\# JASP Module\s+,*.*(Bsts).*\s+\#\#\#/, 
    "jaspBsts", "vandenman"],
    [/\#\#\# JASP Module\s+,*.*(Circular).*\s+\#\#\#/, 
    "jaspCircular", "Kucharssim"],
    [/\#\#\# JASP Module\s+,*.*(Cochrane).*\s+\#\#\#/, 
    "jaspCochrane", "FBartos"],
    [/\#\#\# JASP Module\s+,*.*(Descriptives).*\s+\#\#\#/,
    "jaspDescriptives", "vandenman"],
    [/\#\#\# JASP Module\s+,*.*(Distributions).*\s+\#\#\#/,
    "jaspDistributions", "Kucharssim"],
    [/\#\#\# JASP Module\s+,*.*(Equivalence T-Tests).*\s+\#\#\#/,
    "jaspEquivalenceTTests", "Jillderon"],
    [/\#\#\# JASP Module\s+,*.*(Factor).*\s+\#\#\#/,
    "jaspFactor", "juliuspf"],
    [/\#\#\# JASP Module\s+,*.*(Frequencies).*\s+\#\#\#/,
    "jaspFrequencies", "FBartos"],
    [/\#\#\# JASP Module\s+,*.*(JAGS).*\s+\#\#\#/, 
    "jaspJags", "vandenman"],
    [/\#\#\# JASP Module\s+,*.*(Learn Bayes).*\s+\#\#\#/, 
    "jaspLearnBayes", "Kucharssim"],
    [/\#\#\# JASP Module\s+,*.*(Machine Learning).*\s+\#\#\#/,
    "jaspMachineLearning", "koenderks"],
    [/\#\#\# JASP Module\s+,*.*(Meta Analysis).*\s+\#\#\#/,
    "jaspMetaAnalysis", "FBartos"],
    [/\#\#\# JASP Module\s+,*.*(Mixed Models).*\s+\#\#\#/,
    "jaspMetaAnalysis", "FBartos"],
    [/\#\#\# JASP Module\s+,*.*(Network).*\s+\#\#\#/,
    "jaspNetwork", "vandenman"],
    [/\#\#\# JASP Module\s+,*.*(Process Control).*\s+\#\#\#/,
    "jaspProcessControl", "vandenman"],
    [/\#\#\# JASP Module\s+,*.*(Prophet).*\s+\#\#\#/,
    "jaspProphet", "Kucharssim"],
    [/\#\#\# JASP Module\s+,*.*(Regression).*\s+\#\#\#/,
    "jaspRegression", "Kucharssim"],
    [/\#\#\# JASP Module\s+,*.*(Reliability).*\s+\#\#\#/, 
    "jaspReliability", "juliuspf"],
    [/\#\#\# JASP Module\s+,*.*(SEM).*\s+\#\#\#/, 
    "jaspSem", "LSLindeloo"],
    [/\#\#\# JASP Module\s+,*.*(Summary Statistics).*\s+\#\#\#/,
    "jaspSummaryStatistics", "akashrajkn"],
    [/\#\#\# JASP Module\s+,*.*(T-Tests).*\s+\#\#\#/,
    "jaspTTests", "vandenman"],
    [/\#\#\# JASP Module\s+,*.*(Visual Modeling).*\s+\#\#\#/,
    "jaspVisualModeling", "dustinfife"],
    [/\#\#\# JASP Module\s+,*.*(Other Module).*\s+\#\#\#/,
    "", "Kucharssim"],
  ];

  // get the operating system keywords together
  const osKeywords = [
    [/\#\#\# What OS are you seeing the problem on\?\s+,*.*(macOS Intel).*\s+\#\#\#/,
    "OS: macOS Intel"],
    [/\#\#\# What OS are you seeing the problem on\?\s+,*.*(macOS Silicon).*\s+\#\#\#/,
    "OS: macOS Silicon"],
    [/\#\#\# What OS are you seeing the problem on\?\s+,*.*(Windows 10).*\s+\#\#\#/,
    "OS: Windows 10"], 
    [/\#\#\# What OS are you seeing the problem on\?\s+,*.*(Windows 11).*\s+\#\#\#/,
    "OS: Windows 11"],
    [/\#\#\# What OS are you seeing the problem on\?\s+,*.*(Linux|Flatpak|Ubuntu|Debian|Fedora|Arch|Manjaro|PopOs).*\s+\#\#\#/,
    "OS: Linux / Flatpak"]
  ];

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
  for (const word of moduleKeywords) {

    let found = word[0].test(body);

    // label and assign someone
    if (found) {
      github.rest.issues.addLabels({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        labels: [
          word[1]
        ]
      });
      github.rest.issues.addAssignees({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        assignees: [
          word[2]
        ]
      });
    }
    else { // is there no match but the label is already set? then remove it
      if (labelNames.includes(word[1])) {
        github.rest.issues.removeLabel({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          name: word[1]
        });
      } // same for assignees
      if (assigneeNames.includes(word[2])) {
        github.rest.issues.removeAssignees({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          assignees: [
            word[2]
          ]
        });
      }
    }
  }

  // test if OS keyword is in issue body
  for (const word of osKeywords) {

    let found = word[0].test(body);

    // label
    if (found) {
      github.rest.issues.addLabels({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        labels: [
          word[1]
        ]
      });
    }
    else { // is there no match but the label is already set? then remove it
      if (labelNames.includes(word[1])) {
        github.rest.issues.removeLabel({
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
          name: word[1]
        });
      }
    }
  }
}