const Authentication = (function () {
  let user = null;

  const getUser = () => {
    return user;
  };

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
          document.getElementById("name-left").innerHTML = user.name;
          document.getElementById("username-left").innerHTML = user.username;

          if (onSuccess) onSuccess();
        }
      })
      .catch((err) => {
        console.log("Error!");
      });
  };
  return { getUser, signin };
})();
