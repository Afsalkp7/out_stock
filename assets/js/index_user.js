function submitUserForm() {
  const form = document.getElementById("updateUserForm");
  const formData = new FormData(form);
  fetch("/update", {
    method: "PUT",
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      window.location.href = "/user_data";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function submitPassForm() {
  const form = document.getElementById("passChangeForm");
  const formData = new FormData(form);
  fetch("/change_password", {
    method: "PUT",
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: { "Content-Type": "application/json" },
  });
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    window.location.href = "/user_data";
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}


