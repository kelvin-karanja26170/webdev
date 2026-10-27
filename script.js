// 
const form        = document.getElementById("regform");
const successMsg  = document.getElementById("successMsg");
const memberList  = document.getElementById("memberList");
const emptyNote   = document.getElementById("emptyNote");
const countEl     = document.getElementById("count");
const themeBtn    = document.getElementById("theme");

const fields = {
  name:     document.getElementById("name"),
  email:    document.getElementById("email"),
  password: document.getElementById("password"),
  confirm:  document.getElementById("confirm-password"),
  gender:   document.getElementById("gender"),
  dob:      document.getElementById("dob"),
  country:  document.getElementById("country"),
  phone:    document.getElementById("phone"),
  bio:      document.getElementById("bio"),
};
const errors = {
  name:     document.getElementById("nameError"),
  email:    document.getElementById("emailError"),
  password: document.getElementById("passwordError"),
  confirm:  document.getElementById("confirmError"),
  gender:   document.getElementById("genderError"),
  dob:      document.getElementById("dobError"),
  country:  document.getElementById("countryError"),
  phone:    document.getElementById("phoneError"),
  bio:      document.getElementById("bioError"),
};

// Confirm everything was found 
console.log("form:", form);
console.log("fields:", fields);
console.log("error spans:", errors);
console.log("success box:", successMsg);
console.log("member list <ul>:", memberList);
console.log("member counter:", countEl);
console.log("dark mode button:", themeBtn);

const validators = {
  name(v) {
    if (!v) return "Full name is required.";
    if (v.length < 3) return "Name must be at least 3 characters.";
    if (!/^[A-Za-z' -]+$/.test(v)) return "Name can only contain letters, spaces, ' and -.";
    return "";
  },
  email(v) {
    if (!v) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
    return "";
  },
  password(v) {
    if (!v) return "Password is required.";
    if (v.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return "Use at least one letter and one number.";
    return "";
  },
  confirm(v) {
    if (!v) return "Please confirm your password.";
    if (v !== fields.password.value) return "Passwords do not match.";
    return "";
  },
  gender(v) {
    return v ? "" : "Please select a gender.";
  },
  dob(v) {
    if (!v) return "Date of birth is required.";
    if (new Date(v) > new Date()) return "Date of birth cannot be in the future.";
    return "";
  },
  country(v) {
    if (!v) return "Country is required.";
    if (v.length < 2) return "Enter a valid country.";
    return "";
  },
  phone(v) {
    if (!v) return "Phone number is required.";
    if (!/^\+?[\d\s-]{9,15}$/.test(v)) return "Enter a valid phone number, e.g. +254 700 000 000.";
    return "";
  },
  bio(v) {
    if (!v) return "Bio is required.";
    if (v.length < 10) return "Bio must be at least 10 characters.";
    if (v.length > 200) return "Bio must be 200 characters or fewer.";
    return "";
  },
};


function validateField(key) {
  const value = fields[key].value.trim();
  // passwords are compared as typed, not trimmed
  const raw = (key === "password" || key === "confirm") ? fields[key].value : value;
  const message = validators[key](raw);
  errors[key].textContent = message;
  fields[key].classList.toggle("invalid", message !== "");
  return message === "";
}


Object.keys(fields).forEach((key) => {
  const evt = fields[key].tagName === "SELECT" ? "change" : "input";
  fields[key].addEventListener(evt, () => {
    validateField(key);
    // changing the password changes whether confirm matches
    if (key === "password" && fields.confirm.value) validateField("confirm");
  });
});


form.addEventListener("submit", (event) => {
  event.preventDefault();               // stop the page reloading
  successMsg.classList.add("hidden");

  // validate ALL fields 
  const results = Object.keys(fields).map(validateField);
  if (results.includes(false)) {
    const firstBad = Object.keys(fields).find((k) => errors[k].textContent);
    fields[firstBad].focus();
    return;
  }

  const member = {
    name:    fields.name.value.trim(),
    email:   fields.email.value.trim(),
    gender:  fields.gender.value,
    dob:     fields.dob.value,
    country: fields.country.value.trim(),
    phone:   fields.phone.value.trim(),
    bio:     fields.bio.value.trim(),
    
  };

  addMember(member);       
  updateCounter();         
  showSuccess(member.name);
});


function addMember(m) {
  const li = document.createElement("li");
  li.className = "member-item";

  const info = document.createElement("div");
  info.className = "info";

  const nameEl = document.createElement("strong");
  nameEl.textContent = m.name;

  const meta = document.createElement("span");
  meta.textContent = `${m.email} | ${m.phone} | ${m.country}`;

  info.append(nameEl, meta);

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove";
  removeBtn.textContent = "Remove";

  li.append(info, removeBtn);
  memberList.appendChild(li);
}


function updateCounter() {
  const total = memberList.querySelectorAll("li.member-item").length;
  countEl.textContent = total;
  // show the "No members yet" note only when the list is empty
  emptyNote.style.display = total === 0 ? "" : "none";
}


function showSuccess(name) {
  form.reset();
  Object.keys(fields).forEach((k) => {
    errors[k].textContent = "";
    fields[k].classList.remove("invalid");
  });
  successMsg.textContent = `${name} registered successfully!`;
  successMsg.classList.remove("hidden");
  setTimeout(() => successMsg.classList.add("hidden"), 3000);
}


memberList.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove")) {
    event.target.closest("li.member-item").remove();
    updateCounter();
  }
});


themeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
});

updateCounter(); // correct state on page load