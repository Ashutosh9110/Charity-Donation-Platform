

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
      localStorage.setItem("visibleSection", "main");

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
      localStorage.setItem("visibleSection", "main");

      document.getElementById("loginForm").reset();
      hideAllSections();
      document.getElementById("getBothInfoSection").classList.remove("hidden");
      document.getElementById("updateProfileBtn").classList.remove("hidden");
      

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



async function loadProfile() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3000/users/profile", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  document.getElementById("profileName").value = data.user.name || "";
  document.getElementById("profilePhone").value = data.user.phone || "";
  document.getElementById("profileEmail").value = data.user.email || "";
  document.getElementById("profileSection").classList.remove("hidden");
}

document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const name = document.getElementById("profileName").value;
  const phone = document.getElementById("profilePhone").value;
  const email = document.getElementById("profileEmail").value;

  const res = await fetch("http://localhost:3000/users/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, phone, email })
  });

  const data = await res.json();
  alert(data.msg);
});





document.getElementById("donationForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const amount = parseFloat(document.getElementById("donationAmount").value);
  const message = document.getElementById("donationMessage").value;

  try {
    const res = await fetch("http://localhost:3000/donations/makeDonation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, message }),
    });

    const data = await res.json();
    alert(data.msg);
    document.getElementById("donationForm").reset();
  } catch (error) {
    alert("Error making donation");
  }
});

async function loadUserDonations() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:3000/donations/getUserDonation", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  // Always show the section first
  document.getElementById("donationSection").classList.remove("hidden");

  if (data.donations.length === 0) {
    document.getElementById("donationHistory").innerHTML = "<p>No donations made so far.</p>";
    return;
  }

  const history = data.donations.map((d) => {
    const date = new Date(d.createdAt).toLocaleString();
    return `
      <li>
        ₹${d.amount} - ${d.message || "(no message)"} 
        <small>on ${date}</small>
        <button onclick="downloadReceipt(${d.id})">Download Receipt</button>
      </li>
    `;
  }).join("");

  document.getElementById("donationHistory").innerHTML = `
    <h3>Your Donation History:</h3>
    <ul>${history}</ul>
  `;

  document.getElementById("donationHistory").scrollIntoView({ behavior: "smooth" });
}





function logout() {
  localStorage.clear();
  location.reload();
}




function hideAllSections() {
  document.getElementById("authSection").classList.add("hidden");
  document.getElementById("getBothInfoSection").classList.add("hidden");
  document.getElementById("profileSection").classList.add("hidden");
  document.getElementById("donationSection").classList.add("hidden");
}

function showProfileSection() {
  hideAllSections();
  loadProfile()
  document.getElementById("profileSection").classList.remove("hidden");
  document.getElementById("backToHomepageBtn").classList.remove("hidden");
  document.getElementById("backToHomepageBtn_donation").classList.add("hidden");

  localStorage.setItem("visibleSection", "profile");
}

function showDonationSection() {
  hideAllSections();
  document.getElementById("donationSection").classList.remove("hidden");
  document.getElementById("backToHomepageBtn").classList.add("hidden");
  document.getElementById("backToHomepageBtn_donation").classList.remove("hidden");
  document.getElementById("charitySection").classList.add("hidden");

  document.getElementById("donationHistory").innerHTML = "";
  document.getElementById("viewMyDonationsBtn").textContent = "View My Donations";

  localStorage.setItem("visibleSection", "donation");
}



function showMainOptionsSection() {
  hideAllSections();
  document.getElementById("getBothInfoSection").classList.remove("hidden");
  document.getElementById("backToHomepageBtn").classList.add("hidden");
  document.getElementById("charitySection").classList.add("hidden");

  localStorage.setItem("visibleSection", "main");
}



document.getElementById("viewMyDonationsBtn").addEventListener("click", async () => {
  const historyDiv = document.getElementById("donationHistory");
  const button = document.getElementById("viewMyDonationsBtn");

  const isHidden = historyDiv.innerHTML.trim() === "";

  if (isHidden) {
    // Hide all sections and show only donationSection
    hideAllSections();
    document.getElementById("donationSection").classList.add("hidden");

    await loadUserDonations();
    button.textContent = "Hide My Donations";
    document.getElementById("backToHomepageBtn_donation").classList.remove("hidden");
  } else {
    // Clear history and go back to main options
    historyDiv.innerHTML = "";
    button.textContent = "View My Donations";
    showMainOptionsSection();
  }
});








document.getElementById("authSection").classList.add("hidden");

window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const lastSection = localStorage.getItem("visibleSection");

  hideAllSections();
  document.getElementById("backToHomepageBtn").classList.add("hidden");

  if (token) {
    document.getElementById("updateProfileBtn").classList.remove("hidden");

    switch (lastSection) {
      case "profile":
        await loadProfile();
        document.getElementById("profileSection").classList.remove("hidden");
        document.getElementById("backToHomepageBtn").classList.remove("hidden");
        break;
        case "donation":
          document.getElementById("donationSection").classList.remove("hidden");
          document.getElementById("backToHomepageBtn_donation").classList.remove("hidden");
          await loadUserDonations();
          break;
        
      case "main":
      default:
        document.getElementById("getBothInfoSection").classList.remove("hidden");
        break;
    }
  } else {
    document.getElementById("authSection").classList.remove("hidden");
  }
});



function showCharitySection() {
  hideAllSections();
  document.getElementById("charitySection").classList.remove("hidden");
  document.getElementById("charityCategorySection").classList.add("hidden");

  localStorage.setItem("visibleSection", "charity");
}

document.getElementById("charityForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("charityName").value;
  const category = document.getElementById("charityCategory").value;
  const mission = document.getElementById("charityMission").value;
  const goals = document.getElementById("charityGoals").value;
  const projects = document.getElementById("charityProjects").value;

  try {
    const res = await fetch("http://localhost:3000/charities/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, mission, goals, projects }),
    });
    const data = await res.json();
    alert(data.message);
    document.getElementById("charityForm").reset();
    showMainOptionsSection();
  } catch (err) {
    alert("Failed to register charity");
    console.error(err);
  }
});






const categories = ["urgent", "animal", "children", "elderly", "disaster-relief", "hunger", "education"];

function showCharityCategorySection() {
  hideAllSections();
  const container = document.getElementById("charityCategories");
  container.innerHTML = "";
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.onclick = () => loadCharitiesByCategory(cat);
    container.appendChild(btn);
  });
  document.getElementById("charityCategorySection").classList.remove("hidden");
  localStorage.setItem("visibleSection", "charityCategory");
}

async function loadCharitiesByCategory(category) {
  try {
    const res = await fetch(`http://localhost:3000/charities/category/${category}`);
    const data = await res.json();
    displayCharities(data.charities);
    console.log(data);
  } catch (err) {
    alert("Failed to load charities.");
  }
}

function displayCharities(charities) {
  const list = document.getElementById("charityList");
  list.innerHTML = "";

  if (charities.length === 0) {
    list.innerHTML = "<p>No charities found in this category.</p>";
  } else {
    charities.forEach(charity => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${charity.name}</h3>
        <p><strong>Mission:</strong> ${charity.mission}</p>
        <p><strong>Goals:</strong> ${charity.goals}</p>
        <p><strong>Projects:</strong> ${charity.projects}</p>
        <input type="number" placeholder="Amount" id="amount_${charity.id}" />
        <input type="text" placeholder="Message (optional)" id="message_${charity.id}" />
        <button onclick="donateToCharity(${charity.id})">Donate</button>
        <hr/>
      `;
      list.appendChild(div);
    });
  }

  hideAllSections();
  document.getElementById("charityListSection").classList.remove("hidden");
  localStorage.setItem("visibleSection", "charityList");
}

async function donateToCharity(charityId) {
  const token = localStorage.getItem("token");
  const amount = parseFloat(document.getElementById(`amount_${charityId}`).value);
  const message = document.getElementById(`message_${charityId}`).value;

  try {
    const res = await fetch("http://localhost:3000/donations/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, message, charityId }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Server Error: ${errText}`);
    }

    const data = await res.json();

    const stripe = Stripe("pk_test_51PJrVqSBjwQBc4kUllfoT0CtGV5SOPWmKna1lrslULoK692RVIiYS6m10WTfGcPFmxXEdiH62PwcWvNLwy5xZ5XT00x7wbfeX8");
    stripe.redirectToCheckout({ sessionId: data.id });
  } catch (err) {
    alert("Failed to initiate donation payment.");
    console.error("Stripe error:", err.message || err);
  }
}


// Download Receipt Section

function downloadReceipt(donationId) {
  const token = localStorage.getItem("token");
  const url = `http://localhost:3000/donations/receipt/${donationId}`;

  fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Download failed");
      return res.blob();
    })
    .then((blob) => {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `donation-receipt-${donationId}.pdf`;
      link.click();
    })
    .catch((err) => {
      alert("Failed to download receipt.");
      console.error("Receipt download error:", err);
    });
}
