const RPC =
  require("discord-rpc");

const state =
  require("./state");

const clientId =
  "1508876052275925032";

RPC.register(clientId);

const rpc =
  new RPC.Client({
    transport: "ipc",
  });

async function setActivity() {

  try {

    // ====================
    // MENU
    // ====================

    if (
  state.mode ===
  "Browsing Menu..."
) {

  await rpc.setActivity({

    details:
      "📚 Browsing Menu...",

    state:
      "Idle",

    largeImageKey:
      "atpl",

    largeImageText:
      "ATPL Questions",

    startTimestamp:
      state.startTimestamp,

    buttons: [

      {
        label:
          "Open ATPLQ",

        url:
          "https://app.atplquestions.com/"
      }

    ],

    instance: false,

  });

  return;

}

    // ====================
    // STUDY / EXAM
    // ====================

    await rpc.setActivity({

      details:
        `📚 ${state.subject}`,

      state:

  state.mode === "Exam"

    ? `📝 Questions done: ${state.currentQuestion}/${state.totalQuestions}`

    : `✅ ${state.correctAnswers} ❌ ${state.wrongAnswers} • 📈 ${state.successRate}%`,

      largeImageKey:
        "atpl",

      largeImageText:
        `Question ${state.currentQuestion}/${state.totalQuestions}`,

      smallImageKey:
        state.mode === "Exam"
          ? "exam"
          : "study",

      smallImageText:
        `${state.mode} Mode`,

      startTimestamp:
        state.startTimestamp,

      buttons: [

        {
          label:
            "Open ATPLQ",

          url:
            "https://app.atplquestions.com/"
        }

      ],

      instance: false,

    });

  } catch(e) {

    console.error(
      "RPC ERROR:",
      e
    );

  }

}

rpc.on("ready", () => {

  console.log(
    "Discord RPC connected"
  );

  setActivity();

  setInterval(() => {

    setActivity();

  }, 5000);

});

rpc.login({
  clientId
});