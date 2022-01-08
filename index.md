let github_link = ‘https://github_username.github.io/jsonfile.json';
$.getJSON(github_link, function(data) {
     //data is the JSON string
     console.log(data);
});
