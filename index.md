let github_link = ‘https://github.com/JakeyWasTaken/Test-API/blob/gh-pages/index.js';
$.getJSON(github_link, function(data) {
     //data is the JSON string
     console.log(data);
});
