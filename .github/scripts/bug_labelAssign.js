

module.exports = async function ({github, context}) {
  // define an array of keyword triples, including the label and 
  // the maintainer to assign
  const moduleKeywords = [
    [/\#\#\# JASP Module\s+,*.*(Unrelated).*\s+\#\#\#/, 
    "", "boutinb"],
    [/\#\#\# JASP Module\s+,*.*(ANOVA).*\s+\#\#\#/, 
    "Module: jaspAnova", "JohnnyDoorn"],
    [/\#\#\# JASP Module\s+,*.*(Audit).*\s+\#\#\#/, 
    "Module: jaspAudit", "koenderks"],
    [/\#\#\# JASP Module\s+,*.*(Bain).*\s+\#\#\#/, 
    "Module: jaspBain", "koenderks"],
    [/\#\#\# JASP Module\s+,*.*(Bsts).*\s+\#\#\#/, 
    "Module: jaspBsts", "vandenman"],
    [/\#\#\# JASP Module\s+,*.*(Circular).*\s+\#\#\#/, 
    "Module: jaspCircular", "Kucharssim"],
    [/\#\#\# JASP Module\s+,*.*(Cochrane).*\s+\#\#\#/, 
    "Module: jaspCochrane", "FBartos"],
    [/\#\#\# JASP Module\s+,*.*(Descriptives).*\s+\#\#\#/,
    "Module: jaspDescriptives", "vandenman"],
    [/\#\#\# JASP Module\s+,*.*(Distributions).*\s+\#\#\#/,
    "Module: jaspDistributions", "Kucharssim"],
    [/\#\#\# JASP Module\s+,*.*(Equivalence T-Tests).*\s+\#\#\#/,
    "Module: jaspEquivalenceTTests", "Jillderon"],
    [/\#\#\# JASP Module\s+,*.*(Factor).*\s+\#\#\#/,
    "Module: jaspFactor", "juliuspf"],
    [/\#\#\# JASP Module\s+,*.*(Frequencies).*\s+\#\#\#/,
    "Module: jaspFrequencies", "FBartos"],
    [/\#\#\# JASP Module\s+,*.*(JAGS).*\s+\#\#\#/, 
    "Module: jaspJags", "vandenman"],
    [/\#\#\# JASP Module\s+,*.*(Learn Bayes).*\s+\#\#\#/, 
    "Module: jaspLearnBayes", "Kucharssim"],
    [/\#\#\# JASP Module\s+,*.*(Machine Learning).*\s+\#\#\#/,
    "Module: jaspMachineLearning", "koenderks"],
    [/\#\#\# JASP Module\s+,*.*(Meta Analysis).*\s+\#\#\#/,
    "Module: jaspMetaAnalysis", "FBartos"],
    [/\#\#\# JASP Module\s+,*.*(Mixed Models).*\s+\#\#\#/,
    "Module: jaspMetaAnalysis", "FBartos"],
    [/\#\#\# JASP Module\s+,*.*(Network).*\s+\#\#\#/,
    "Module: jaspNetwork", "vandenman"],
    [/\#\#\# JASP Module\s+,*.*(Prophet).*\s+\#\#\#/,
    "Module: jaspProphet", "Kucharssim"],
    [/\#\#\# JASP Module\s+,*.*(Quality Control).*\s+\#\#\#/,
    "Module: jaspQualityControl", "vandenman"],
    [/\#\#\# JASP Module\s+,*.*(Regression).*\s+\#\#\#/,
    "Module: jaspRegression", "Kucharssim"],
    [/\#\#\# JASP Module\s+,*.*(Reliability).*\s+\#\#\#/, 
    "Module: jaspReliability", "juliuspf"],
    [/\#\#\# JASP Module\s+,*.*(SEM).*\s+\#\#\#/, 
    "Module: jaspSem", "LSLindeloo"],
    [/\#\#\# JASP Module\s+,*.*(Summary Statistics).*\s+\#\#\#/,
    "Module: jaspSummaryStatistics", "akashrajkn"],
    [/\#\#\# JASP Module\s+,*.*(T-Tests).*\s+\#\#\#/,
    "Module: jaspTTests", "vandenman"],
    [/\#\#\# JASP Module\s+,*.*(Visual Modeling).*\s+\#\#\#/,
    "Module: jaspVisualModeling", "dustinfife"],
    [/\#\#\# JASP Module\s+,*.*(Other Module).*\s+\#\#\#/,
    "", "Kucharssim"],
  ];

  // get the operating system keywords together
  const osKeywords = [
    [/\#\#\# What OS are you seeing the problem on\?\s+,*.*(macOS Intel).*\s+\#\#\#/,
    "OS: macOS Intel"],
    [/\#\#\# What OS are you seeing the problem on\?\s+,*.*(macOS Silicon).*\s+\#\#\#/,
    "OS: macOS Silicon"],
    [/\#\#\# What OS are you seeing the problem on\?\s+,*.*(Windows 10|Windows 11).*\s+\#\#\#/,
    "OS: Windows"], 
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