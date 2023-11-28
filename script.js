//inputs
const categories_answer = document.querySelectorAll(".answer-1");
const difficulty_answer = document.querySelector("#difficulty");
const number_of_questions_answer = document.querySelector("#numberInput");

//buttons
const btn_start = document.querySelector("#submit-1");
const btn_submit = document.querySelector("#submit");
const btn_view_answers = document.querySelector("#view-answers");

//containers
const first_container = document.querySelector(".quiz-container2");
const questions_container = document.querySelector(".quiz-container");
const answers_container = document.querySelector(".answers-container");
const barem_container = document.querySelector(".barem");

//items
const question = document.querySelector("#question");
const options = document.querySelectorAll(".answer");
const result = document.querySelector(".results-value");
const barem_item = document.querySelector(".barem-all");

//input defaults
let category = "linux";
let difficulty = "easy";
let questions = "10";

//arrays
let userAnswers = [];
let correctanswerarray = [];
let wrongAnswers = [];

//starter values
let questionindex = 0;
let finalgrade = 0;

//get the url to send to the API through getting the user's answers of the first form
async function getURL() {
  return new Promise((resolve) => {
    btn_start.addEventListener("click", () => {
      //submit button
      difficulty = difficulty_answer.value; //drop down
      questions = number_of_questions_answer.value; //number input
      categories_answer.forEach((answer) => {
        //radio buttons
        if (answer.checked) {
          category = answer.id;
          if (category == "random") {
            let url =
              "https://quizapi.io/api/v1/questions?apiKey=YgPfmdveoIx5wN7UujeQwUTwr1cUrgn3Di47rOtd";
            resolve(url);
          } else {
            let url = `https://quizapi.io/api/v1/questions?apiKey=YgPfmdveoIx5wN7UujeQwUTwr1cUrgn3Di47rOtd&category=${category}&difficulty=${difficulty}&limit=${questions}`;
            resolve(url);
          }
        }
      });

      //URL to send to API
    });
  });
}

//get URL responce after it is submitted and send it with axios
async function processData() {
  let response;
  try {
    const url = await getURL();
    response = await axios.get(url);

    first_container.classList.add("hidden");
    questions_container.classList.remove("hidden"); //show question container
    displayQuestion(response.data); // Display the first question
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  //when user submits his answer to each question
  btn_submit.addEventListener("click", () => {
    let clickedAnswer;
    options.forEach((opt) => {
      if (opt.checked) {
        clickedAnswer = opt.id;
        userAnswers.push({ [question.dataset.id]: clickedAnswer }); //{id of question: user choice-a,b,c,d,e,f}
        console.log(userAnswers);
        displayNextQuestion(response.data);
        // Display the next question after submission
      }
    });
  });
}

function displayQuestion(questionsData) {
  const currentQuestion = questionsData[questionindex]; // Displaying the first question starting at 0
  question.innerHTML = currentQuestion.question; //show question
  question.dataset.id = currentQuestion.id; //each question having a unique identifier
  options.forEach((opt) => {
    document.querySelector(`label[for="${opt.id}"]`).innerHTML =
      questionsData[questionindex].answers[`answer_${opt.id}`]; //showing answers on each radio input
  });
  let correctAnswerKey = Object.keys(currentQuestion.correct_answers).find(
    (key) => currentQuestion.correct_answers[key] === "true" //find the key whose value id true
  );

  correctanswerarray.push({
    [currentQuestion.id]: correctAnswerKey.slice(7, 8), //format{question id:a,b,c,d,e,f}
  });
  console.log(correctanswerarray);
}

function displayNextQuestion(x) {
  if (questionindex < questions - 1) {
    questionindex++;
    displayQuestion(x);
  } else {
    grading(correctanswerarray, userAnswers, x);
  }
}

processData();
//compare 2 arrays to get the grade
function grading(answer, useranswer, x) {
  answer.map((obj, i) => {
    for (const [key, value] of Object.entries(obj)) {
      if (useranswer[i][key] == value) {
        finalgrade++;
      } else {
        wrongAnswers.push({
          [Object.keys(useranswer[i])[0]]: useranswer[i][key],
        });
      }
    }
  });
  console.log("grade", finalgrade);
  questions_container.classList.add("hidden");
  answers_container.classList.remove("hidden");
  result.innerHTML = `You scored ${finalgrade} out of ${questions}`;

  btn_view_answers.addEventListener("click", () => {
    barem_container.classList.remove("hidden");
    barem(x);
  });
  console.log(wrongAnswers);
}

//looping through the data again to show the question with the correct answer marked in green and if user gave wrong answer to display that in red
function barem(x) {
  x.forEach((questionBarem) => {
    let flagwrong = false;
    let wrongchoice;
    wrongAnswers.forEach((obj) => {
      for (const [key, value] of Object.entries(obj)) {
        console.log("xid", questionBarem.id, key);
        if (questionBarem.id == key) {
          flagwrong = true;
          wrongchoice = value;
        }
      }
    });
    let div_answer = document.createElement("div");
    console.log(questionBarem.correct_answers["answer_c_correct"]);
    div_answer.innerHTML = `
    <h2 id="barem-question ${questionBarem.id}">${questionBarem.question}</h2>
          <ul class="barem-list">
            <li id="a_barem${questionBarem.id}" class="barem_answer ${
      questionBarem.correct_answers["answer_a_correct"] == "true" ? "green" : ""
    }">
              ${
                questionBarem.answers["answer_a"] == null
                  ? "-"
                  : questionBarem.answers["answer_a"]
              }
            </li>
  
            <li id="b_barem${questionBarem.id}" class="barem_answer ${
      questionBarem.correct_answers["answer_b_correct"] == "true" ? "green" : ""
    }">
               ${
                 questionBarem.answers["answer_b"] == null
                   ? "-"
                   : questionBarem.answers["answer_b"]
               }
            </li>
  
            <li id="c_barem${questionBarem.id}" class="barem_answer ${
      questionBarem.correct_answers["answer_c_correct"] == "true" ? "green" : ""
    }">
              ${
                questionBarem.answers["answer_c"] == null
                  ? "-"
                  : questionBarem.answers["answer_c"]
              }
            </li>
  
            <li id="d_barem${questionBarem.id}" class="barem_answer ${
      questionBarem.correct_answers["answer_d_correct"] == "true" ? "green" : ""
    }">
              ${
                questionBarem.answers["answer_d"] == null
                  ? "-"
                  : questionBarem.answers["answer_d"]
              }
            </li>
            <li id="e_barem${questionBarem.id}" class="barem_answer ${
      questionBarem.correct_answers["answer_e_correct"] == "true" ? "green" : ""
    }">
               ${
                 questionBarem.answers["answer_e"] == null
                   ? "-"
                   : questionBarem.answers["answer_e"]
               }
            </li>
            <li id="f_barem${questionBarem.id}" class="barem_answer ${
      questionBarem.correct_answers["answer_f_correct"] == "true" ? "green" : ""
    }">
               ${
                 questionBarem.answers["answer_f"] == null
                   ? "-"
                   : questionBarem.answers["answer_f"]
               }
            </li>
          </ul>
   `;
    barem_item.appendChild(div_answer);
    if (flagwrong) {
      document
        .querySelector(`#${wrongchoice}_barem${questionBarem.id}`)
        .classList.add("red");
    }
  });
}
