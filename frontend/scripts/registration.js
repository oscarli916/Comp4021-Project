const Registration = function () {
  const register = function (username, name, password, onSuccess, onError) {
    const json = JSON.stringify({ username, name, password });
    fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json,
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status == "error") {
          if (onError) onError(json.error);
        } else {
          if (onSuccess) onSuccess();
        }
      })
      .catch((err) => {
        console.log("Error!");
      });
  };
  return { register };
}();
