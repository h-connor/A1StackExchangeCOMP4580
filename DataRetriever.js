var docReady = false;
var mostVotedQuery = '?order=desc&sort=votes&site=stackoverflow&pagesize=10&filter=!oDlfh44krmGiDjaQglwdNd8yTuMU(s-*XS.ZPceIeb5';
var newestQuery = '?order=desc&sort=creation&site=stackoverflow&pagesize=10&filter=!oDlfh44krmGiDjaQglwdNd8yTuMU(s-*XS.ZPceIeb5';
const URLquestions = 'http://api.stackexchange.com/2.2/questions';
var completedMostVotedQuery = false;
var completedNewestQuery = false;
var prevResponse;
var startTime;

$(document).ready(function () {
    var dateObj = new Date();
    var weekAgo = dateObj.getDate() - 7;

    dateObj.setDate(weekAgo);
    /*var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var dateFormat = day + month +  year;*/
    const secondsInWeek = 604800;
    var dateFormat = Math.floor(dateObj.getTime() / 1000) - secondsInWeek;

    //query = '?order=desc&sort=votes&site=stackoverflow&filter=withbody&answers=true&fromdate=' + dateFormat;
    mostVotedQuery += '&fromdate= ' + dateFormat;

    // Prevent the use of 'enter' to submit the field, they must click submit
    $(window).keydown(function (event) {
        if (event.keyCode == 13) // 13 is the keycode for the enter key
        {
            // Default is to redirect page
            event.preventDefault();
            return false;
        }
    });
});

// Once I have completed parsing and receive both responses, display the execution time
function submitExecutionTime() {
    var endTime = performance.now();

    document.getElementById('executionTime').textContent = 'Total execution time of the program (in seconds): ' + ((endTime - startTime) / 1000.0);
}

function SubmitTag() {
    var xhttp = new XMLHttpRequest();
    var xhttp2 = new XMLHttpRequest();
    prevResponse = undefined;
    completedMostVotedQuery = false;
    completedNewestQuery = false;
    var textField = document.getElementById('tag').value;
    var fullQuery1 = URLquestions + mostVotedQuery + '&tagged=' + textField.trim();
    var fullQuery2 = URLquestions + newestQuery + '&tagged=' + textField.trim();

    // Oldest Query
    xhttp.onreadystatechange = (e) => {
        if (xhttp.readyState != XMLHttpRequest.DONE)
            return; // Must have completed the request

        completedMostVotedQuery = true;

        // Complete or cache the response
        if (completedNewestQuery) {
            ParseQuestionResponse(xhttp.responseText);
            submitExecutionTime();
        }
        else {
            prevResponse = xhttp.responseText;
        }
    }

    // Newest query
    xhttp2.onreadystatechange = (e) => {
        if (xhttp2.readyState != XMLHttpRequest.DONE)
            return; // Must have completed the request

        completedNewestQuery = true;

        // Complete or cache the response
        if (completedMostVotedQuery) {
            ParseQuestionResponse(xhttp2.responseText);
            submitExecutionTime();
        }
        else {
            prevResponse = xhttp2.responseText;
        }
    }

    xhttp.open("GET", fullQuery1, true);
    xhttp2.open("GET", fullQuery2, true);

    xhttp.send();
    xhttp2.send();

    // Evaluate the response time of the requests
    startTime = performance.now();

    return false;
}

function ParseQuestionResponse(response) {
    var res = JSON.parse(response);
    var res2 = JSON.parse(prevResponse);

    var combine = res.items.concat (res2.items);

    // Now I must combine the two responses and order them by creation date
    combine.sort(function (a, b) {
        return a.creation_date < b.creation_date;
    });

    var placement = document.getElementById('results');
    placement.innerHTML = "";

    for (var i = 0; i < combine.length; i++)
    {
        var item = combine[i];

        placement.innerHTML += CreateCollapsible(item.title, item.body, item.answers, item.comments, item.score, item.creation_date)
    }

    // append onclick to each elemtn of the class 'content'
    OpenCollapsibles();
}

function OpenCollapsibles() {
    // Obtained from the link posted in the assignment description
    // https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_collapsible
    // Setting the on click trigger event of the collapsibles
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

function CreateCollapsible(title, body, answers, questionComments, upVotes, creationDate) {
    var divs = [];

    // Gather comments on the question
    if (typeof questionComments !== "undefined") // question must actually have comments
        for (var i = 0; i < questionComments.length; i++) {
            var res = '<div class="comments"><p class="commentWords">' + questionComments[i].body + '</p><p class="commentCreationDate"> Creation Date: ' + questionComments[i].creation_date + ' Votes: ' + questionComments[i].score  + '</p></div>';
            divs.push(res);
        }
    else
        divs.push('<div class="comments">No comments exist on this question</div>');

    var bodyRes = divs.join('\r\n');
    var collapseAble = '<button type="button" class="collapsible">' +
        title + '<span class="questionInfo"> Created: ' + creationDate + ' Votes: ' + upVotes + '</span></button><div class="content" >' +
        '<p class="commentBody">' + body + '</p><p class="questionCommentsTitle">Question Comments</p><div class="allComments">' +
        bodyRes +
        '</div>' +
        '<div class="questionsAndComments">' + GetAnswerResponses(answers) +
        '</div></div>';

    return collapseAble;
}

function GetAnswerResponses(response) {
    var allAnswers;
    var finalResults = '';

    // Go through each response
    if (typeof response !== "undefined") // question must actually have comments
        for (var i = 0; i < response.length; i++) {
            var item = response[i];

            finalResults += (new Answer(item.body, item.creation_date, item.score, item.comments)).toString();
        }
    else
        finalResults = '<div class="answer"> This question has no answers as of yet.</div>';

    return finalResults;
}

function Answer(body, creationDate, upvoted, comments) {

    this.body = body;
    this.comments = comments;
    this.creationDate = creationDate;
    this.upvotes = upvoted;

    this.toString = function() {
        return '<div class="answer"><p class="answerTitle">Answer</p><p class="answerResponse">' + this.body + '</p>' + this.parseComments() + '<p class="info">Creation Date: ' + this.creationDate + ' Votes: ' + this.upvotes + '</p></div >';
    }

    this.parseComments = function() {

        // IE: No comments on the answer
        if (this.comments == undefined)
            return '<p class="noComments"> There are no Comments On this Answer.</p>';

        var divs = [];

        // Gather comments on the question
        for (var i = 0; i < this.comments.length; i++) {
            var res = '<div class="comments"> <p>' + this.comments[i].body + '</p><p class="info"> Creation Date: ' + this.comments[i].creation_date + ' Votes: ' + this.comments[i].score + '</p></div>';
            divs.push(res);
        }
        var bodyRes = '<p class="answerCommentsTitle">Comments To Answer</p><div class="allComments">' + divs.join('\r\n') + '</div>';

        return bodyRes;
    }
}