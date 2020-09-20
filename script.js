var correct_answer;
var currentQuestion = -1;

async function getToken() {
  const tokenUrl = "https://opentdb.com/api_token.php?command=request";
  const tokenRespons = await fetch(tokenUrl);
  const tokenJson = await tokenRespons.json();

  return tokenJson.token;
}

async function getQuestion() {
  var amountOfQuestions = 0;

  const questionUrl = new URL("https://opentdb.com/api.php");
  questionUrl.searchParams.append("amount", "10");
  questionUrl.searchParams.append("category", "9");
  questionUrl.searchParams.append("difficulty", "medium");
  questionUrl.searchParams.append("type", "boolean");
  questionUrl.searchParams.append("token", token);

  const questionRespons = await fetch(questionUrl.href);
  const questionJson = await questionRespons.json();

  amountOfQuestions = questionJson.results.length;

  var question = questionJson.results;

  return [question, amountOfQuestions];
}

function setQuestion() {
  getQuestion().then((data) => {
    var [results, amountOfQuestions] = data;

    currentQuestion++;
    document.querySelector(".question").textContent =
      results[currentQuestion].question;
    correct_answer =
      results[currentQuestion].correct_answer === "True" ? true : false;
    //console.log(correct_answer)
  });
}
function button_pressed() {
  console.log(this.id);
  if (correct_answer != (this.id === "true_button" ? true : false)) {
    document.querySelector(".container").classList.add("shake_animation");
    setTimeout(() => {document.querySelector(".container").classList.remove("shake_animation");}, 1000);
    
  } else {
    document.body.style.setProperty("--border_shadow_color", "#1d7407");
    setTimeout(() => {document.body.style.setProperty("--border_shadow_color", "violet")}, 300)
    
  }
  setQuestion();
}

document.querySelectorAll(".answer_button").forEach((item) => {
  item.addEventListener("click", button_pressed);
});

var token = getToken().then((data) => {
  token = data;
  setQuestion();
});
