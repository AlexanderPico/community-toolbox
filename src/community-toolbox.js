CommunityToolbox = function CommunityToolbox(org, repo) {

  var SimpleApi = require("github-api-simple")

  var api = new SimpleApi();
  var ui = require('./ui');
  const requestP = require('request-promise');

  var options = {
    'qs': {
      'sort': 'pushed',
      'direction': 'desc', // optional, GitHub API uses 'desc' by default for 'pushed' 
      'per_page': 100 //max is 100
    }
  }

  // these are essentially examples for now; we could wrap them 
  // in externally available methods for convenience but at the 
  // moment they're not quite complex enough to merit it. 

  function getIssuesForRepo(callback, _options) {
    _options = _options || options;
    api.Issues
       .getIssuesForRepo(org, repo, _options)
       .then(callback);
  }

  function getIssuesForOrg(_org, _options) {
    _options = _options || options;
    var _url;
    if (_options.qs.labels == 'all') {
	var _url = "https://api.github.com/search/issues?q=is%3Aopen+org%3A" + _org;
    } else if (_options.qs.labels == 'nolabel') {
	var _url = "https://api.github.com/search/issues?q=is%3Aopen+org%3A" + _org + "+no%3Alabel";
    } else {
        var _url = "https://api.github.com/search/issues?q=is%3Aopen+org%3A" + _org + "+label%3A" + _options.qs.labels;
    }
    return requestP({ uri: _url });
  }

  function getCommitsForRepo(callback, _options) {
    _options = _options || options;
    api.Repositories
       .getRepoCommits(org, repo, _options)
       .then(callback);
  }

  function getRepoContributors(callback, _options) {
    _options = _options || options;
    api.Repositories
       .getRepoContributors(org, repo, _options)
       .then(callback);
  }

  function getOrgContributors(_org) {
    var _url = "https://api.github.com/orgs/" + _org + "/repos?per_page=30";
    return requestP({ uri: _url });
  }

  function getOrgRepoContributors(_org, _repo) {
    var _url = "https://api.github.com/repos/" + _org + "/" + _repo + "/contributors?per_page=100";
    return requestP({ uri: _url });
  }

  function displayIssuesForRepo(org, repo, label, selector) {
    toolbox.api.Issues
           .getIssuesForRepo(org, repo, { qs: { labels: label } })
           .then(function onGotIssues(issues) {
             issues.forEach(function(issue) {
               toolbox.ui.insertIssue(issue, selector);
             });
           });
  }

  var chart = require('./chart');

  // externally available API
  return {
    api:     api,
    ui:      ui,
    chart:   chart,
    options: options,
    getIssuesForRepo: getIssuesForRepo,
    getIssuesForOrg: getIssuesForOrg,
    getCommitsForRepo: getCommitsForRepo,
    getRepoContributors: getRepoContributors,
    getOrgContributors: getOrgContributors,
    getOrgRepoContributors: getOrgRepoContributors,
    displayIssuesForRepo: displayIssuesForRepo
  }

}

module.exports = CommunityToolbox;
