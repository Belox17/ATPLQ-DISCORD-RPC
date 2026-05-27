console.log("ATPLQ DOM TRACKER LOADED");

let previousStats = null;

function getStats() {

  try {

    const bodyText =
      document.body.innerText;

    // ====================
    // DEFAULT VALUES
    // ====================

    let mode =
      "Browsing Menu...";

    let subject =
      "ATPL Questions";

    let currentQuestion = 0;
    let totalQuestions = 0;

    let correctAnswers = 0;
    let wrongAnswers = 0;

    let successRate = 0;

    // ====================
    // SESSION DETECTION
    // ====================

    const hasQuestions =
      document.querySelectorAll(
        ".questionItem"
      ).length > 0;

    const progressMatch =
      bodyText.match(
        /(\d+)\s\/\s(\d+)/
      );

    const hasProgress =
      !!progressMatch;

    const inSession =
      hasQuestions ||
      hasProgress;

    // ====================
    // NOT IN SESSION
    // ====================

    if (!inSession) {

      return {

        mode:
          "Browsing Menu...",

        subject:
          "ATPL Questions",

        currentQuestion: 0,

        totalQuestions: 0,

        correctAnswers: 0,

        wrongAnswers: 0,

        successRate: 0,

        sessionId:
          "menu",

      };

    }

    // ====================
    // MODE
    // ====================

    if (
      location.pathname
        .includes("/exam/")
    ) {

      mode = "Exam";

      subject =
        "ATPL Questions Exam";

    } else {

      mode = "Study";

    }

    // ====================
    // SUBJECT
    // ====================

    // STUDY MODE
    if (mode === "Study") {

      const heading =
        document.querySelector("h1");

      if (
        heading &&
        heading.innerText
      ) {

        subject =
          heading.innerText
            .trim();

      }

    }

    // FALLBACK
    if (
      !subject ||
      subject ===
      "ATPL Questions"
    ) {

      const match =
        bodyText.match(
          /ATPL\(A\).*?\|\s(.+)/
        );

      if (
        match &&
        match[1]
      ) {

        subject =
          `ATPL(A) (EASA 2020) | ${match[1]
            .split("\n")[0]
            .trim()}`;

      }

    }

    // ====================
    // PROGRESS
    // ====================

    if (progressMatch) {

      currentQuestion =
        parseInt(
          progressMatch[1]
        );

      totalQuestions =
        parseInt(
          progressMatch[2]
        );

    }

    // ====================
    // ANSWERS
    // ====================

    const questionItems =
      document.querySelectorAll(
        ".questionItem"
      );

    questionItems.forEach((el) => {

      const classes =
        el.className;

      // GOOD
      if (
        classes.includes("true")
      ) {

        correctAnswers++;

      }

      // BAD
      if (
        classes.includes("false")
      ) {

        wrongAnswers++;

      }

    });

    // ====================
    // SUCCESS RATE
    // ====================

    const answered =
      correctAnswers +
      wrongAnswers;

    if (answered > 0) {

      successRate =
        Math.round(
          (
            correctAnswers
            / answered
          ) * 100
        );

    }

    // ====================
    // RETURN
    // ====================

    return {

      mode,

      subject,

      currentQuestion,

      totalQuestions,

      correctAnswers,

      wrongAnswers,

      successRate,

      sessionId:
        location.pathname,

    };

  } catch(e) {

    console.error(
      "GET STATS ERROR:",
      e
    );

    return null;

  }

}

async function sendStats() {

  const stats =
    getStats();

  if (!stats) return;

  const current =
    JSON.stringify(stats);

  // anti spam
  if (
    current === previousStats
  ) {

    return;

  }

  previousStats =
    current;

  console.log(
    "ATPL STATS:",
    stats
  );

  try {

    await fetch(
      "http://localhost:3000/update",
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(stats),

      }
    );

  } catch(e) {

    console.error(
      "SEND ERROR:",
      e
    );

  }

}

setInterval(
  sendStats,
  2000
);

sendStats();