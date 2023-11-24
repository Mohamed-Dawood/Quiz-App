let questionsNum = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let spanBulletsContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submitBtn = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
let currentIndex = 0;
// when you choose right answer will increase one then in finish calc result
let rightAnswers = 0;
let countDownInterval;

//fetch Questions
function getQuestions() {
  //first line
  let myRequest = new XMLHttpRequest();
  // four line
  // onreadystatechange that mean when request statues change لما حاله الريكوست تتغير
  myRequest.onreadystatechange = function () {
    //readyState === 4 that mean request is finished and response is ready
    //status === 200 that mean response is okay
    if (this.readyState === 4 && this.status === 200) {
      // console.log(this.responseText); log to response text
      // convert responseText to js object
      let questionsObject = JSON.parse(this.responseText);
      // console.log(questionsObject);
      let questionsLength = questionsObject.length;
      // console.log(questionsLength);
      createBullets(questionsLength);
      addQuestions(questionsObject[currentIndex], questionsLength);

      //call count down in first question
      countDown(30, questionsLength);
      //submit button
      submitBtn.onclick = function () {
        let rightAnswer = questionsObject[currentIndex].right_answer;
        // console.log(rightAnswer);
        currentIndex++;
        checkAnswer(rightAnswer, questionsLength);

        quizArea.innerHTML = "";
        answerArea.innerHTML = "";
        addQuestions(questionsObject[currentIndex], questionsLength);
        handelBullets();

        //clear Interval when you submit to count from first should but before countDown
        clearInterval(countDownInterval);

        //call count down function on click
        countDown(30, questionsLength);

        //show result function
        showResult(questionsLength);
      };
    }
  };
  // second line
  myRequest.open("GET", "html-questions.json", true);
  // third line
  myRequest.send();
  // console.log(myRequest);
}
getQuestions();

function createBullets(num) {
  // questionsNum.innerHTML = num; best code is :
  questionsNum.innerText = num;

  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    if (i === 0) {
      bullet.className = "on";
    }
    spanBulletsContainer.appendChild(bullet);
  }
}
//main function response able for appear questions
function addQuestions(qObj, qLength) {
  if (currentIndex < qLength) {
    // console.log(qObj, qLength);
    //console.log(qObj);
    // console.log(qObj["title"]);
    //console.log(qObj.title);
    let qTitle = document.createElement("h2");
    let qText = (document.createTextNode = qObj.title);
    qTitle.append(qText);
    quizArea.appendChild(qTitle);

    //if you write i=0 will not appear answer 1 because you loop in i
    for (let i = 1; i <= 4; i++) {
      //create main answer div
      let answer = document.createElement("div");
      answer.className = "answer";

      let input = document.createElement("input");
      // console.log(input);
      input.type = "radio";
      input.id = `answer_${i}`;
      input.name = "questions";
      //make answer in data set
      input.dataset.answer = qObj[`answer_${i}`];

      //check first choice
      if (i === 1) {
        input.checked = true;
      }

      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      //there is a problem in html question.json you write html elements label read it as html element not text
      //to solve it write innerText instead of  innerHTML
      label.innerText = qObj[`answer_${i}`];
      //console.log(label);
      // console.log(qObj[`answer_${i}`]);

      answer.appendChild(input);
      answer.appendChild(label);
      //console.log(answer);

      answerArea.appendChild(answer);
    }
  }
}
//checkAnswer and compare checked with right answers
function checkAnswer(rAnswer, qLength) {
  let answers = document.getElementsByName("questions");
  // console.log(answers.length);
  let theChecked;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChecked = answers[i].dataset.answer;
    }
  }
  // check if the choice = right answers
  if (theChecked === rAnswer) {
    // console.log("good answer");
    rightAnswers++;
  }
  console.log(theChecked);
  console.log(rAnswer);
}
// handel bullets add on class
function handelBullets() {
  let spanBullet = document.querySelectorAll(".bullets .spans span");

  let arrayOfSpan = Array.from(spanBullet);
  // console.log(arrayOfSpan);
  arrayOfSpan.forEach((span, index) => {
    if (currentIndex == index) {
      span.className = "on";
    }
  });
}

function showResult(count) {
  let theResult;
  if (currentIndex === count) {
    // console.log("questions ended");
    quizArea.remove();
    answerArea.remove();
    submitBtn.remove();
    bullets.remove();
    results.style.display = "block";

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResult = `<span class="good">Good</span> , ${rightAnswers} from ${count}`;
    } else if (rightAnswers === count) {
      theResult = `<span class="perfect">perfect</span> , ${rightAnswers} from ${count} All Answer Is Right`;
    } else {
      theResult = `<span class="bad">bad</span> , ${rightAnswers} from ${count}`;
    }
  }
  results.innerHTML = theResult;
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      //calc input duration in minutes and second
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      //add 0 before element less than 10
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownElement.innerHTML = `${minutes} : ${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
