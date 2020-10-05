var currentQuestion = -1;
var category = 9;
var questions;
var token;

async function getToken(newToken) {
  if (sessionStorage.triviaToken && !newToken){
    return sessionStorage.triviaToken;
  }
  const tokenUrl = "https://opentdb.com/api_token.php?command=request";
  const tokenRespons = await fetch(tokenUrl);
  const tokenJson = await tokenRespons.json();
  sessionStorage.triviaToken = tokenJson.token;

  return tokenJson.token;
}

async function getCategories() {
  const categorysUrl = "https://opentdb.com/api_category.php";
  const categorysRespons = await fetch(categorysUrl);
  const categoryJson = await categorysRespons.json();

  return categoryJson;
}

async function getQuestions() {
  var amountOfQuestions;
  var list = [];

  const questionUrl = new URL("https://opentdb.com/api.php");
  questionUrl.searchParams.append("amount", "10");
  questionUrl.searchParams.append("category", category);
  questionUrl.searchParams.append("difficulty", "medium");
  questionUrl.searchParams.append("type", "boolean");
  questionUrl.searchParams.append("token", token);

  const questionRespons = await fetch(questionUrl.href);
  const questionJson = await questionRespons.json();

  if (questionJson.response_code == 0){
    amountOfQuestions = questionJson.results.length;

    for (i = 0; i < amountOfQuestions; i++) {
      list.push({
        question: questionJson.results[i].question,
        answer: questionJson.results[i].correct_answer,
      });
    }
  }else if (questionJson.response_code == 4){
    getToken(true).then((data) => {
      token = data;
    })
    return await getQuestions();
  }


  return list;
}

function appendQuestions() {
  currentQuestion = 0;
  console.log(currentQuestion);

  getToken(false).then((data) => {
    token = data;
    //borde set token to lokal storage

    getQuestions().then((data) => {
      updateQuestion();

      function updateQuestion() {
        currentQuestion++;
        console.log(currentQuestion);

        if (currentQuestion != data.length) {
          document.querySelector(".question").innerHTML =
            data[currentQuestion].question;
          setTextSize(currentQuestion, data);
        } else {
          console.log("dö");
        }
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
}

function setTextSize(currentQuestion, data) {
  document.querySelector(".question").style.fontSize = (
    (53 / data[currentQuestion].question.length) *
    25
  ).toString();
}

function appendCategories() {
  getCategories().then((data) => {
    console.log(data.trivia_categories.length);
    for (i = 0; i < data.trivia_categories.length - 1; i++) {
      var listItem = document.createElement("li");
      listItem.setAttribute("id", data.trivia_categories[i].id);
      listItem.onclick = function () {
        category = this.id;
        appendQuestions();
      };
      listItem.innerHTML = data.trivia_categories[i].name;
      document.querySelector(".dropdown-content").appendChild(listItem);
    }
  });
}

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.querySelector(".container").style.marginLeft = "250px";
  document.querySelector(".options-icon").style.display = "none";
  document.body.style.setProperty("--border_shadow_color_sideNav", "violet");
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.querySelector(".container").style.marginLeft = "0px";
  setTimeout(() => {
    document.querySelector(".options-icon").style.display = "block";
    document.body.style.setProperty(
      "--border_shadow_color_sideNav",
      "transparent"
    );
  }, 230);
}

appendCategories();
appendQuestions();
