# A1StackExchangeCOMP4580

### About

This application is implemented as a web app using HTML/CSSS/JS and JQuery. 

We use an http request using stack exchanges API to retrieve all information about the most recent and voted question based on the tag inputted by the user.

Casting the result as a JSON object, the requests are then merged, and parsed to the results shown on the website as collapsibles.

Github Repo: https://github.com/h-connor/A1StackExchangeCOMP4580/

Docker Repo: https://hub.docker.com/r/hryhoru3/a1_stack_exchange_comp4580

### Instructions

LocalHost:

1. Run the command docker run -dp 80:80 hryhoru3/a1_stack_exchange_comp4580. Please assure nothing else is running on this port.
2. Then type 'localhost:80/' on the url of your web browser.
3. Now you may enter the tag in the search field for the questions you would like to receive.

Second method:
1. Head over to hryhoru3/a1_stack_exchange_comp4580 on dockerHub OR pull with the command docker pull hryhoru3/a1_stack_exchange_comp4580
2. Open the file StackOverflow.html on a browser. Please assure everything is from within the same directory.
