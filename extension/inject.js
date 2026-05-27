console.log("INJECT JS RUNNING");

const oldFetch = window.fetch;

window.fetch = async (...args) => {

  const url = args[0];

  const res = await oldFetch(...args);

  try {

    if (
      typeof url === "string" &&
      url.includes("/svc/api/")
    ) {

      // clone response
      const clone = res.clone();

      const text = await clone.text();

      // useful endpoints only
      if (
        url.includes("saveAnswer") ||
        url.includes("getquestion") ||
        url.includes("gettestdetail")
      ) {

        console.log("ATPL API:", url);
        console.log("API RESPONSE:", text);

        window.postMessage({
          type: "ATPLQ_DATA",
          payload: {
            url,
            response: text
          }
        }, "*");

      }

    }

  } catch(e) {

    console.error("FETCH ERROR:", e);

  }

  return res;
};

console.log("FETCH HOOK INSTALLED");