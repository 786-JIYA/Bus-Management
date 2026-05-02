const form = document.getElementById("loginForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/users/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.text();
    if (response.ok) {
      window.location.href = "/dashboard.html";
    } else {
      document.getElementById("message").innerText = data.message;
    }
  } catch (error) {
    document.getElementById("message").innerText = "Server error";
  }
});
