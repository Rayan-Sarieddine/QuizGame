const categories_answer = document.querySelectorAll(".answer-1");
const difficulty_answer = document.querySelector("#difficulty");
const number_of_questions = document.querySelector("#numberInput");
const btn_start = document.querySelector("#submit-1");
const btn_submit = document.querySelector("#submit");
const first_container = document.querySelector(".quiz-container2");
const questions_container = document.querySelector(".quiz-container");
const question = document.querySelector("#question");
const options = document.querySelectorAll(".answer");
let category = "random";
let difficulty = "easy";
let questions = "10";

async function getURL() {
  return new Promise((resolve) => {
    btn_start.addEventListener("click", () => {
      categories_answer.forEach((ans) => {
        if (ans.checked) {
          category = ans.id;
        }
      });

      difficulty = difficulty_answer.value;
      questions = number_of_questions.value;
      first_container.classList.add("hidden");
      questions_container.classList.remove("hidden");

      let url = `https://quizapi.io/api/v1/questions?apiKey=YgPfmdveoIx5wN7UujeQwUTwr1cUrgn3Di47rOtd&category=${category}&difficulty=${difficulty}&limit=${questions}`;
      resolve(url);
    });
  });
}
let useranswers = [];
async function processData() {
  let response;

  try {
    const url = await getURL();
    response = await axios.get(url);
    displayQuestion(response.data); // Display the first question
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  btn_submit.addEventListener("click", () => {
    let uanswer;
    options.forEach((opt) => {
      if (opt.checked) {
        uanswer = opt.id;
        useranswers.push({ [question.dataset.id]: uanswer });
        console.log(useranswers);
        displayNextQuestion(response.data);
        // Display the next question after submission
      }
    });
  });
}
let questionindex = 0;
let correctanswerarray = [];
function displayQuestion(questionsData) {
  const currentQuestion = questionsData[questionindex]; // Displaying the first question
  question.innerHTML = currentQuestion.question;
  question.dataset.id = currentQuestion.id;
  options.forEach((opt) => {
    document.querySelector(`label[for="${opt.id}"]`).innerHTML =
      questionsData[questionindex].answers[`answer_${opt.id}`];
  });
  let correctAnswerKey = Object.keys(currentQuestion.correct_answers).find(
    (key) => currentQuestion.correct_answers[key] === "true"
  );

  correctanswerarray.push({
    [currentQuestion.id]: correctAnswerKey.slice(7, 8),
  });
  console.log(correctanswerarray);
}

function displayNextQuestion(x) {
  if (questionindex < questions - 1) {
    questionindex++;
    displayQuestion(x);
  } else {
    grading(correctanswerarray, useranswers, x);
  }
}

processData();
let finalgrade = 0;
const answers_container = document.querySelector(".answers-container");
function grading(answer, useranswer, x) {
  answer.map((obj, i) => {
    for (const [key, value] of Object.entries(obj)) {
      if (useranswer[i][key] == value) {
        finalgrade++;
      }
    }
  });
  console.log("grade", finalgrade);
  questions_container.classList.add("hidden");
  answers_container.classList.remove("hidden");
  document.querySelector(
    ".results-value"
  ).innerHTML = `You scored ${finalgrade} out of ${questions}`;
  document.querySelector("#view-answers").addEventListener("click", () => {
    barem(x);
  });
}
function barem(x) {
  x.forEach((questionBarem) => {
    let div_answer = document.createElement("div");
    console.log(questionBarem.correct_answers["answer_c_correct"]);
    div_answer.innerHTML = `
    <h2 id="barem-question ${questionBarem.id}">${questionBarem.question}</h2>
          <ul>
            <li id="a_barem" class="barem_answer ${
              questionBarem.correct_answers["answer_a_correct"] == "true"
                ? "green"
                : ""
            }">
              ${questionBarem.answers["answer_a"]}
            </li>
  
            <li id="b_barem" class="barem_answer ${
              questionBarem.correct_answers["answer_b_correct"] == "true"
                ? "green"
                : ""
            }">
               ${questionBarem.answers["answer_b"]}
            </li>
  
            <li id="c_barem" class="barem_answer ${
              questionBarem.correct_answers["answer_c_correct"] == "true"
                ? "green"
                : ""
            }">
              ${questionBarem.answers["answer_c"]}
            </li>
  
            <li id="d_barem" class="barem_answer ${
              questionBarem.correct_answers["answer_d_correct"] == "true"
                ? "green"
                : ""
            }">
              ${questionBarem.answers["answer_d"]}
            </li>
            <li id="e_barem" class="barem_answer ${
              questionBarem.correct_answers["answer_e_correct"] == "true"
                ? "green"
                : ""
            }">
               ${questionBarem.answers["answer_e"]}
            </li>
            <li id="fbarem" class="barem_answer ${
              questionBarem.correct_answers["answer_f_correct"] == "true"
                ? "green"
                : ""
            }">
               ${questionBarem.answers["answer_f"]}
            </li>
          </ul>
   `;
    document.querySelector(".barem-all").appendChild(div_answer);
  });
  //1-get questions data and destructure
  //2-create a div for each movie and append it in html
  //3-go through correct answers to mark them green
}
