const express = require("express");
const cors = require("cors");

const state = require("./state");

require("./rpc");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/update", (req, res) => {
  try {
    const data = req.body;

    // Vérifie que le body existe
    if (!data || typeof data !== "object") {
      return res.status(400).json({
        success: false,
        error: "Invalid body"
      });
    }

    // Mise à jour sécurisée du state
    state.subject = data.subject ?? state.subject;
    state.mode = data.mode ?? state.mode;
    state.currentQuestion =
      data.currentQuestion ?? state.currentQuestion;

    state.totalQuestions =
      data.totalQuestions ?? state.totalQuestions;

    state.correctAnswers =
      data.correctAnswers ?? state.correctAnswers;

    state.wrongAnswers =
      data.wrongAnswers ?? state.wrongAnswers;

    state.successRate =
      data.successRate ?? state.successRate;

    state.sessionId =
      data.sessionId ?? state.sessionId;

    // Reset timer si nouvelle session
    if (state.lastSessionId !== state.sessionId) {
      state.startTimestamp =
        Math.floor(Date.now() / 1000);

      state.lastSessionId =
        state.sessionId;

      console.log(
        "New session detected:",
        state.sessionId
      );
    }

    console.log("NEW STATE:", state);

    return res.json({
      success: true,
      state
    });

  } catch (e) {
    console.error("Update error:", e);

    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});