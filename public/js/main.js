

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  const userData = { name, email, phone, password };

  try {
    const res = await fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signup successful!");
      // Redirect or reset form
      document.getElementById("signupForm").reset();
      loginSection.classList.remove("hidden");
      signupSection.classList.add("hidden");
    } else {
      alert(data.msg);
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Something went wrong.");
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("http://localhost:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    alert(data.msg);
    if (res.ok) {
      localStorage.setItem("token", data.token);

      const decoded = JSON.parse(atob(data.token.split(".")[1]));
      const currentUserId = decoded.userId;
      localStorage.setItem("currentUserId", currentUserId);

      document.getElementById("loginForm").reset();
      document.getElementById("authSection").classList.add("hidden");


      // loadMessages()
      setTimeout(() => {
        // fetchGroups();
      }, 100); // small delay to ensure token is set
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login error: " + error.msg);
  }
});

document.getElementById("switchToLogin").onclick = () => {
  loginSection.classList.remove("hidden");
  signupSection.classList.add("hidden");
};

document.getElementById("switchToSignup").onclick = () => {
  loginSection.classList.add("hidden");
  signupSection.classList.remove("hidden");
};