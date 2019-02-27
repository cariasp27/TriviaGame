// stores number of attemps
var attemps = 0;
// variable that stores the anmount of time for the user to guess
var count = 10;
// object for current Q&A set
var currentqa = {};
// variable used to step through quiz questions
var i = 0;
// user score
var score = 0;
// variable for storing interval
var ticktock;
// questions answerd correct/incorrect
var qcorrect = 0;
var qincorrect = 0;
// enables clicking on page
var inputwelcome = true;
// THE GAME OBJECT and subsequent methods. 
let triviagame = {

    timer: function () {
        // displays countdown timer to DOM
        $("#timer").text(count + " seconds");
        // decrease count by one
        count = count - 1;
        // if the count hits -1 for some reason, then..
        if (count <= -1) {
            // no longer allow user input 
            inputwelcome = false;
            // stop the clock
            clearInterval(ticktock);
            // alert user that time has expired
            alert("Times up! On to the next!");
            // clear display and show answer
            triviagame.clearandcorrect();
            // after 5 seconds....
            setTimeout(function () {
                // get next q&a set
                triviagame.getQ();
                // reset count down
                count = 10;
                // allow for user input
                inputwelcome = true;
                // start timer again
                triviagame.startTimer();
            }, 5000);
        };
    },
    // sets interval for timer function and stores the interval in the
    // ticktock variable
    startTimer: function () { ticktock = setInterval(triviagame.timer, 1000 * 1); },
    // clears interval
    stopTimer: function () { clearInterval(ticktock); },
    getQ: function () {
        // empty divs
        $("#pic").empty();
        $("#qarea").empty();
        $("#A").empty();
        $("#B").empty();
        $("#C").empty();
        $("#D").empty();
        // get first q&a set and store it in currentqa object
        currentqa = qa[i];
        // fill content div with data from currentqa
        $("#qarea").text(currentqa.ques);
        $("#pic").append("<img src='" + currentqa.photo + "'alt='nope' style='height:" + currentqa.h + ";width:" + currentqa.w + ";'>");
        $("#A").text(currentqa.answ.A);
        $("#B").text(currentqa.answ.B);
        $("#C").text(currentqa.answ.C);
        $("#D").text(currentqa.answ.D);
        // increase i by one to set up next question
        i = i + 1;
    },
    // clears qa data and displays correct answer
    clearandcorrect: function () {
        $("#pic").empty();
        $("#qarea").empty();
        $("#A").empty();
        $("#B").empty();
        $("#C").empty();
        $("#D").empty();
        $("#timer").text("sorry... " + currentqa.correct + " is the answer!")
    },
    // if user guessed incorrectly, then...
    nope: function () {
        // prevent further input
        inputwelcome = false;
        // stop the clock
        clearInterval(ticktock);
        // alert user that guess was wrong
        alert("Nope! Maybe next time!");
        // add one to the incorrect answered variable
        qincorrect = qincorrect + 1;
        // clear display and show answer
        triviagame.clearandcorrect();
        // so long as i is less than the index of the last question, then
        if (i < qa.length) {
            // create a 5 second timeout to read correct answer
            setTimeout(function () {
                // get next question set up
                triviagame.getQ();
                // reset countdown
                count = 10;
                // allow user input again
                inputwelcome = true;
                // start timer
                triviagame.startTimer();
            }, 5000);
        }
        // if all questions have been answered, run complete function
        else { triviagame.complete(); };
    },
    yep: function () {
        // prevent further input
        inputwelcome = false;
        // stop the clock
        clearInterval(ticktock);
        // alert user they guessed correctly
        alert("YES! " + currentqa.correct + " is the answer!");
        // add ten points to the user score plus the time remaining as bonus points
        score = (score + 10) + count;
        // add one to correct answer  variable
        qcorrect = qcorrect + 1
        // update score
        $("#numscore").text("Score:" + score)
        // so long as i is less than the index of the last question, then
        if (i < qa.length) {
            // create a 1 second timeout
            setTimeout(function () {
                // get next q&a set
                triviagame.getQ();
                // reset clock
                count = 10;
                // allow user input
                inputwelcome = true;
                // start timer
                triviagame.startTimer();
            }, 1000);
        }
        // if all questions have been answered, run complete function
        else { triviagame.complete(); };
    },
    complete: function () {
        //  stop clock
        triviagame.stopTimer();
        // alert user the quiz is complete 
        alert("You made it!");
        // clear divs
        $("#pic").empty();
        $("#qarea").empty();
        $("#A").empty();
        $("#B").empty();
        $("#C").empty();
        $("#D").empty();
        // display correct/incorrect to DOM
        $("#qarea").text("Questions Correct:" + qcorrect);
        $("#A").text("Questions Missed:" + qincorrect);
        // reset questions to first and add an attempt
        i = 0;
        attemps = attemps + 1;
        // change start button to try again and make it visible
        $("#start").text("Try Again?").css("visibility", "visible");
        // display winning text to DOM
        $("#timer").text("You Completed The Quiz!");
        // display winning image and tint text boxes for visual acuity.
        $(".tint").css("background", "url(./assets/images/tint.png)")
        $(".tint").css("color", "#04ADC5")
        $(".content").css("background", "url(./assets/images/zany.jpg)");

    }
}
$(document).ready(function () {

    // when the user clicks on te start/try again button...
    $("#start").on("click", function () {
        // if you have already attempted the quiz...
        if (attemps >= 1) {
            // clear win screen
            $(".tint").css("background", "url(#)")
            $(".tint").css("color", "black")
            $(".content").css("background", "url(#)");
            // allow input
            inputwelcome = true;
            // reset score
            score = 0;
            // display reset score
            $("#numscore").text("Score:" + score)
            // get first question
            triviagame.getQ();
            // start timer
            triviagame.startTimer();
            // hide this button
            $(this).css("visibility", "hidden");
        }
        // if this is the users first attempt, then..
        else {
            // get first question
            triviagame.getQ();
            // start countdown
            triviagame.startTimer();
            // hide this button
            $(this).css("visibility", "hidden");
            // display the score
            $("#score").css("visibility", "visible");
        }
    });
    $("#A").on("click", function () {
        // if user input is allowed, then...
        if (inputwelcome) {
            // compare answer string A to the correct answer string
            // if they are equal, then run yup method
            // if they are not equal, then run nope method.
            if ((currentqa.answ.A).localeCompare(currentqa.correct) === 0) { triviagame.yep(); }
            else { triviagame.nope(); }
        }
        else {
            return false;
        }
    });
    $("#B").on("click", function () {
        // if user input is allowed, then...
        if (inputwelcome) {
            // compare answer string B to the correct answer string
            // if they are equal, then run yup method
            // if they are not equal, then run nope method.
            if ((currentqa.answ.B).localeCompare(currentqa.correct) === 0) { triviagame.yep(); }
            else { triviagame.nope(); }
        }
        else {
            return false;
        }
    });
    $("#C").on("click", function () {
        // if user input is allowed, then...
        if (inputwelcome) {
            // compare answer string C to the correct answer string
            // if they are equal, then run yup method
            // if they are not equal, then run nope method.
            if ((currentqa.answ.C).localeCompare(currentqa.correct) === 0) { triviagame.yep(); }
            else { triviagame.nope(); }
        }
        else {
            return false;
        }
    });
    $("#D").on("click", function () {
        // if user input is allowed, then...
        if (inputwelcome) {
            // compare answer string D to the correct answer string
            // if they are equal, then run yup method
            // if they are not equal, then run nope method.
            if ((currentqa.answ.D).localeCompare(currentqa.correct) === 0) { triviagame.yep(); }
            else { triviagame.nope(); }
        }
        else {
            return false;
        }
    });
});