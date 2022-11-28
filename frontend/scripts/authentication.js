const Authentication = (function () {
  const signin = function (username, password, onSuccess, onError) {
    const json = JSON.stringify({ username, password });

    fetch("/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status == "error") {
          if (onError) onError(json.error);
        } else {
          user = json.user;
          if (onSuccess) onSuccess();
        }
      })
      .catch((err) => {
        console.log("Error!");
      });
  };
  return { signin };
})();
