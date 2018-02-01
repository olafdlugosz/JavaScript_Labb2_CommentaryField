var getButton = document.getElementById('getButton');
getButton.addEventListener('click', deep);
var sortByLikesAscendingButton = document.getElementById('LikesAscending');
sortByLikesAscendingButton.addEventListener('click', getAndSortLikesAscending);
var sortBylikesDescendingButton = document.getElementById('LikesDescending');
sortBylikesDescendingButton.addEventListener('click', getAndSortLikesDescending);

var dateAscendingButton = document.getElementById('DateAscending');
dateAscendingButton.addEventListener('click', getDateAscending);

var dateDescendingButton = document.getElementById('DateDescending');
dateDescendingButton.addEventListener('click', getDateDescending);

var addCommentButton = document.getElementById('commentButton');
addCommentButton.addEventListener('click', addComment);

var inputC = document.getElementById('inputComment');

window.document.onload = deep();

var commentSection = document.getElementById('commentSection');

function addComment() {

  httpPost('http://localhost:8080/comment', 'message=' + inputC.value + '&deep=true', buildHtmlString);

  location.reload();
}

function deep() {

  httpGet('http://localhost:8080/deep', res => {
      var JSONdata = JSON.parse(res);
      console.log(JSONdata);
      commentSection.innerHTML = buildHtmlString(JSONdata);

    });
}

function getAndSortLikesAscending() {
  httpGet('http://localhost:8080/deep', res => {
      var JSONdata = JSON.parse(res);
      console.log(JSONdata);
      let sortedJSONdataByLikesAscending = sortJSONdataByLikesAscending(JSONdata);
      commentSection.innerHTML = buildHtmlString(sortedJSONdataByLikesAscending);
    });
}

function getAndSortLikesDescending() {
  httpGet('http://localhost:8080/deep', res => {
      var JSONdata = JSON.parse(res);
      console.log(JSONdata);
      let sortedJSONdataByLikesDescending = sortJSONdataByLikesDescending(JSONdata);
      commentSection.innerHTML = buildHtmlString(sortedJSONdataByLikesDescending);
    });
}

function getDateAscending() {
  httpGet('http://localhost:8080/deep', res => {
      var JSONdata = JSON.parse(res);
      console.log(JSONdata);
      let sortByDateAscending = dateAscending(JSONdata);
      commentSection.innerHTML = buildHtmlString(sortByDateAscending);
    });
}

function getDateDescending() {
  httpGet('http://localhost:8080/deep', res => {
      var JSONdata = JSON.parse(res);
      console.log(JSONdata);
      let sortByDateDescending = dateDescending(JSONdata);
      commentSection.innerHTML = buildHtmlString(sortByDateDescending);
    });
}

function buildHtmlString(JSONdata) {
  var string = '<div>';
  for (var i = 0; i < JSONdata.length; i++) {
    const comment = JSONdata[i];
    string += '<span id="' + comment.id + 'HideSection">'
        + '<ul>'
        + '<li>'
        + '<h3>'
        + comment.commenter + ' wrote:'
        + '</h3>'
        + '<p>'
        + comment.message
        + '</p>'
        + '<span>'
        + 'likes: <span>' + comment.likes + '</span>'
        + '<button id="' + comment.id + 'likesButton"'
        + 'onclick="httpPost(\'http://localhost:8080/like/' + comment.id + '\',\'deep=true\', buildHtmlString), location.reload()">Like!</button>'
        + 'created at: <span>' + comment.creation + '</span>'
        + '</span>'
        + '<div>'
        + '<input id="' + comment.id + 'inputBox" style="border: 2px solid red">'
        + '<button id="' + comment.id + 'commentButton" onclick="answer(\'' + comment.id + '\')">Answer!</button>'
        + '<button id="' + comment.id + 'editButton" onclick="edit(\'' + comment.id + '\')">Edit!</button>'
        + '<button id="' + comment.id + 'hideButton" onclick="document.getElementById(\'' + comment.id + 'HideSection\').style.display = \'none\'">Hide!</button>'
        + '</div>';
        + '</li>';
        + '</ul>';
    if (JSONdata[i].answers.length > 0) {
      string += buildHtmlString(JSONdata[i].answers);
    }
    string + '</span>';
  }

  string += '</div>';
  return string;
}

function answer(id) {
  console.log()
  let answer = document.getElementById(id + 'inputBox').value;
  const url = 'http://localhost:8080/answer/' + id;
  const parameters = 'deep=true&message=' + answer;

  httpPost(url, parameters, buildHtmlString);
  setTimeout(location.reload(), 1500);
}
function edit(id) {
  console.log()
  let edit = document.getElementById(id + 'inputBox').value;
  const url = 'http://localhost:8080/edit/' + id;
  const parameters = 'deep=true&message=' + edit;

  httpPost(url, parameters, buildHtmlString);
  setTimeout(location.reload(), 1500);
}

function sortJSONdataByLikesAscending(JSONdata) {

  return JSONdata.sort(function (a, b) { return a.likes - b.likes; });

}

function sortJSONdataByLikesDescending(JSONdata) {
  return JSONdata.sort(function (a, b) { return b.likes - a.likes; });
}

function dateAscending(JSONdata) {

  return JSONdata.sort(function (a, b) {
      var dateA = new Date(a.creation).getTime();
      var dateB = new Date(b.creation).getTime();
      return dateA > dateB ? 1 : -1;
    });
}

function dateDescending(JSONdata) {

  return JSONdata.sort(function (a, b) {
      var dateA = new Date(a.creation).getTime();
      var dateB = new Date(b.creation).getTime();
      return dateA < dateB ? 1 : -1;
    });
}

function httpGet(URL = 'http://localhost:8080/deep', callback) {
  const http = new XMLHttpRequest();
  http.open('GET', URL, true);

  http.onreadystatechange = function () {
    if (http.readyState == 4 && http.status == 200) {

      callback(http.responseText);}
  };

  http.send(null);
}

function httpPost(URL = 'http://localhost:8080/deep', params, callback) {
  const http = new XMLHttpRequest();
  http.open('POST', URL, true);

  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

  http.onreadystatechange = function () {
      if (http.readyState == 4 && http.status == 200)
          callback(JSON.parse(http.responseText));
    };

  http.send(params);
}
