

 1. // GET ALL REQUIRED DOM ELEMENTS

const form = document.getElementById("memberForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const genderSelect = document.getElementById("gender");
const membershipSelect = document.getElementById("membership");
const addressTextarea = document.getElementById("address");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const genderError = document.getElementById("genderError");
const membershipError = document.getElementById("membershipError");
const addressError = document.getElementById("addressError");

const successMessage = document.getElementById("successMessage");
const memberList = document.getElementById("memberList");
const memberCounter = document.getElementById("memberCounter");
const darkModeButton = document.getElementById("darkModeButton");


const fields = [
    {
        input: nameInput,
        error: nameError,
        name: "name"
    },
    {
        input: emailInput,
        error: emailError,
        name: "email"
    },
    {
        input: phoneInput,
        error: phoneError,
        name: "phone"
    },
    {
        input: genderSelect,
        error: genderError,
        name: "gender"
    },
    {
        input: membershipSelect,
        error: membershipError,
        name: "membership"
    },
    {
        input: addressTextarea,
        error: addressError,
        name: "address"
    }
];


console.log("DOM elements:", {
    form,
    nameInput,
    emailInput,
    phoneInput,
    genderSelect,
    membershipSelect,
    addressTextarea,
    nameError,
    emailError,
    phoneError,
    genderError,
    membershipError,
    addressError,
    successMessage,
    memberList,
    memberCounter,
    darkModeButton
});


const allElements = [
    form,
    nameInput,
    emailInput,
    phoneInput,
    genderSelect,
    membershipSelect,
    addressTextarea,
    nameError,
    emailError,
    phoneError,
    genderError,
    membershipError,
    addressError,
    successMessage,
    memberList,
    memberCounter,
    darkModeButton
];

if (allElements.some(element => element === null)) {
    throw new Error(
        "Some HTML elements are missing. Check your element IDs."
    );
}


let members = [];
let nextMemberId = 1;
let successTimer;

// 2. VALIDATE INDIVIDUAL FIELDS

function validateField(field) {
    const value = field.input.value.trim();

    let message = "";

    switch (field.name) {
        case "name":
            if (value === "") {
                message = "Full name is required.";
            } else if (value.length < 2) {
                message = "Name must contain at least 2 characters.";
            } else if (!/^[\p{L}\p{M} .'-]+$/u.test(value)) {
                message = "Enter a valid name.";
            }
            break;

        case "email":
            if (value === "") {
                message = "Email address is required.";
            } else if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ) {
                message = "Enter a valid email address.";
            } else if (
                members.some(
                    member =>
                        member.email.toLowerCase() === value.toLowerCase()
                )
            ) {
                message = "This email is already registered.";
            }
            break;

        case "phone":
            if (value === "") {
                message = "Phone number is required.";
            } else if (!/^\+?[0-9\s()-]{7,20}$/.test(value)) {
                message = "Enter a valid phone number.";
            } else if (value.replace(/\D/g, "").length < 7) {
                message = "Phone number must contain at least 7 digits.";
            }
            break;

        case "gender":
            if (value === "") {
                message = "Please select a gender.";
            }
            break;

        case "membership":
            if (value === "") {
                message = "Please select a membership type.";
            }
            break;

        case "address":
            if (value === "") {
                message = "Address is required.";
            } else if (value.length < 5) {
                message = "Address must contain at least 5 characters.";
            }
            break;
    }

    field.error.textContent = message;

    field.input.classList.toggle("invalid", message !== "");

    field.input.setAttribute(
        "aria-invalid",
        message !== "" ? "true" : "false"
    );

    if (message) {
        field.input.setAttribute("aria-describedby", field.error.id);
    } else {
        field.input.removeAttribute("aria-describedby");
    }

    return message === "";
}


// 3. CLEAR ERRORS AS USERS TYPE

fields.forEach(field => {
    const eventType =
        field.input.tagName === "SELECT" ? "change" : "input";

    field.input.addEventListener(eventType, () => {
        validateField(field);

        
        successMessage.hidden = true;

        clearTimeout(successTimer);
    });

    
    field.input.addEventListener("blur", () => {
        validateField(field);
    });
});


// 4. UPDATE THE MEMBER COUNTER

function updateMemberCounter() {
    memberCounter.textContent = members.length;
}

// =======================================
// 5. DISPLAY REGISTERED MEMBERS
// =======================================

function displayMembers() {
    memberList.replaceChildren();

    if (members.length === 0) {
        const emptyMessage = document.createElement("li");

        emptyMessage.className = "empty-message";
        emptyMessage.textContent = "No members registered yet.";

        memberList.appendChild(emptyMessage);
        updateMemberCounter();

        return;
    }

    members.forEach(member => {
        const listItem = document.createElement("li");

        listItem.className = "member-card";

        const heading = document.createElement("h3");
        heading.textContent = member.name;

        const email = document.createElement("p");
        email.textContent = `Email: ${member.email}`;

        const phone = document.createElement("p");
        phone.textContent = `Phone: ${member.phone}`;

        const gender = document.createElement("p");
        gender.textContent = `Gender: ${member.gender}`;

        const membership = document.createElement("p");
        membership.textContent = `Membership: ${member.membership}`;

        const address = document.createElement("p");
        address.textContent = `Address: ${member.address}`;

        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.className = "remove-button";
        removeButton.textContent = "Remove Member";

        
        removeButton.addEventListener("click", () => {
            removeMember(member.id);
        });

        listItem.append(
            heading,
            email,
            phone,
            gender,
            membership,
            address,
            removeButton
        );

        memberList.appendChild(listItem);
    });

    updateMemberCounter();
}


// 6. REGISTER A MEMBER

form.addEventListener("submit", function (event) {
    event.preventDefault();

    clearTimeout(successTimer);
    successMessage.hidden = true;

    
    const isFormValid = fields
        .map(field => validateField(field))
        .every(Boolean);

    if (!isFormValid) {
        const firstInvalidField = fields.find(field =>
            field.input.classList.contains("invalid")
        );

        if (firstInvalidField) {
            firstInvalidField.input.focus();
        }

        return;
    }


    const member = {
        id: nextMemberId++,
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        gender: genderSelect.value,
        membership: membershipSelect.value,
        address: addressTextarea.value.trim()
    };

    
    members.push(member);

    
    displayMembers();


    successMessage.textContent =
        `${member.name} has been registered successfully!`;

    successMessage.hidden = false;

    
    form.reset();

    
    fields.forEach(field => {
        field.error.textContent = "";
        field.input.classList.remove("invalid");
        field.input.setAttribute("aria-invalid", "false");
        field.input.removeAttribute("aria-describedby");
    });

    
    successTimer = setTimeout(() => {
        successMessage.hidden = true;
    }, 4000);
});


// 7. REMOVE A MEMBER

function removeMember(memberId) {
    const member = members.find(item => item.id === memberId);

    if (!member) {
        return;
    }

    members = members.filter(item => item.id !== memberId);

    displayMembers();

    successMessage.textContent =
        `${member.name} has been removed successfully.`;

    successMessage.hidden = false;

    clearTimeout(successTimer);

    successTimer = setTimeout(() => {
        successMessage.hidden = true;
    }, 4000);
}


// 8. DARK MODE TOGGLE

darkModeButton.addEventListener("click", () => {
    const isDarkMode = document.body.classList.toggle("dark-mode");

    darkModeButton.textContent = isDarkMode
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

    darkModeButton.setAttribute(
        "aria-pressed",
        String(isDarkMode)
    );
});


// 9. INITIALIZE THE APPLICATION

displayMembers();

console.log("Member Registration System is ready!");
