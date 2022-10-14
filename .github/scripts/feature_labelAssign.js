

module.exports = async function ({github, context}) {
  // define an array of keyword triples, including the label and 
  // the maintainer to assign
  const moduleKeywords = [
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(ANOVA).*\s+\#\#\#/, 
    "Module: jaspAnova", "JohnnyDoorn"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Audit).*\s+\#\#\#/, 
    "Module: jaspAudit", "koenderks"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Bain).*\s+\#\#\#/, 
    "Module: jaspBain", "koenderks"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Bsts).*\s+\#\#\#/, 
    "Module: jaspBsts", "vandenman"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Circular).*\s+\#\#\#/, 
    "Module: jaspCircular", "Kucharssim"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Cochrane).*\s+\#\#\#/, 
    "Module: jaspCochrane", "FBartos"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Descriptives).*\s+\#\#\#/,
    "Module: jaspDescriptives", "vandenman"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Distributions).*\s+\#\#\#/,
    "Module: jaspDistributions", "Kucharssim"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Equivalence T-Tests).*\s+\#\#\#/,
    "Module: jaspEquivalenceTTests", "Jillderon"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Factor).*\s+\#\#\#/,
    "Module: jaspFactor", "juliuspf"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Frequencies).*\s+\#\#\#/,
    "Module: jaspFrequencies", "FBartos"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(JAGS).*\s+\#\#\#/, 
    "Module: jaspJags", "vandenman"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Learn Bayes).*\s+\#\#\#/, 
    "Module: jaspLearnBayes", "Kucharssim"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Machine Learning).*\s+\#\#\#/,
    "Module: jaspMachineLearning", "koenderks"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Meta Analysis).*\s+\#\#\#/,
    "Module: jaspMetaAnalysis", "FBartos"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Mixed Models).*\s+\#\#\#/,
    "Module: jaspMetaAnalysis", "FBartos"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Network).*\s+\#\#\#/,
    "Module: jaspNetwork", "vandenman"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Prophet).*\s+\#\#\#/,
    "Module: jaspProphet", "Kucharssim"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Quality Control).*\s+\#\#\#/,
    "Module: jaspQualityControl", "vandenman"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Regression).*\s+\#\#\#/,
    "Module: jaspRegression", "Kucharssim"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Reliability).*\s+\#\#\#/, 
    "Module: jaspReliability", "juliuspf"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(SEM).*\s+\#\#\#/, 
    "Module: jaspSem", "LSLindeloo"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Summary Statistics).*\s+\#\#\#/,
    "Module: jaspSummaryStatistics", "akashrajkn"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(T-Tests).*\s+\#\#\#/,
    "Module: jaspTTests", "vandenman"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Visual Modeling).*\s+\#\#\#/,
    "Module: jaspVisualModeling", "dustinfife"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(Other Module).*\s+\#\#\#/,
    "", "Kucharssim"],
    [/\#\#\# Is your feature request related to a JASP module\?\s+,*.*(_No response_).*\s+\#\#\#/,
    "", "AlexanderLyNL"]
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
}