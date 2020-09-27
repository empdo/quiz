var currentQuestion = -1;
var questions;
var token;

async function getToken() {
  const tokenUrl = "https://opentdb.com/api_token.php?command=request";
  const tokenRespons = await fetch(tokenUrl);
  const tokenJson = await tokenRespons.json();

  return tokenJson.token;
}

async function getQuestions() {
  var amountOfQuestions;
  var list = [];

  const questionUrl = new URL("https://opentdb.com/api.php");
  questionUrl.searchParams.append("amount", "10");
  questionUrl.searchParams.append("category", "9");
  questionUrl.searchParams.append("difficulty", "medium");
  questionUrl.searchParams.append("type", "boolean");
  questionUrl.searchParams.append("token", token);

  const questionRespons = await fetch(questionUrl.href);
  const questionJson = await questionRespons.json();

  amountOfQuestions = questionJson.results.length;

  for (i = 0; i < amountOfQuestions; i++) {
    list.push({
      question: questionJson.results[i].question,
      answer: questionJson.results[i].correct_answer,
    });
  }
  return list;
}

getToken().then((data) => {
  token = data;
  //borde set token to lokal storage

  getQuestions().then((data) => {
    updateQuestion();

    function updateQuestion() {
      currentQuestion++
      console.log(currentQuestion)

      if (currentQuestion != (data.length)) {
        document.querySelector(".question").innerHTML = data[currentQuestion].question;
      }else{
        currentQuestion = -1;
        document.querySelector(".question").innerHTML = data[currentQuestion].question;
      };
      
    }

    function button_pressed() {
      console.log(this.id);
      console.log(data);

      if (
        data[currentQuestion].answer !=
        (this.id === "true_button" ? "True" : "False")
      ) {
        document.querySelector(".container").classList.add("shake_animation");
        setTimeout(() => {
          document
            .querySelector(".container")
            .classList.remove("shake_animation");
        }, 1000);
      } else {
        document.body.style.setProperty("--border_shadow_color", "#1d7407");
        setTimeout(() => {
          document.body.style.setProperty("--border_shadow_color", "violet");
        }, 300);
      }

      updateQuestion();
    }

    document.querySelectorAll(".answer_button").forEach((item) => {
      item.addEventListener("click", button_pressed);
    });
  });
});
