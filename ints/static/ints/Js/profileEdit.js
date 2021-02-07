document.addEventListener("DOMContentLoaded", () => {

    editAvatar();
    editUsername();

});

function editAvatar() {
    const changeAvatarImageButton = document.getElementById("edit-avatar");
    const newAvatar = document.getElementById("new-avatar");

    changeAvatarImageButton.addEventListener("click", () => {
        changeAvatarImageButton.classList.add("d-none");
        newAvatar.classList.add("d-block");

        const cancelButton = document.getElementById("cancel-avatar");
        const submitAvatarButton = document.getElementById("submit-avatar");
        const defaultAvatarButton = document.getElementById("default-avatar");

        cancelButton.addEventListener("click", () => {
            newAvatar.classList.remove("d-block");
            changeAvatarImageButton.classList.remove("d-none");
        });

        submitAvatarButton.addEventListener("click", () => {
            const newAvatarURL = document.getElementById("avatar-url");

            if (isValidURL(newAvatarURL.value)) {
                submitNewAvatar(newAvatarURL.value);
            } else {
                document.getElementById("invalid-url").classList.add("d-block");
            }

            setTimeout( () => {
                document.getElementById("invalid-url").classList.remove("d-block");
            }, 1000)

        });

        defaultAvatarButton.addEventListener("click", () => {
            const defaulAvatar = "default_user_avatar";
            submitNewAvatar(defaulAvatar);
        });

    });
}


function editUsername() {
    const editUsernameButton = document.getElementById("edit-username");
    const submitUsernameButton = document.getElementById("submit-username");

    editUsernameButton.addEventListener("click", () => {
        const editUsernameIcon = document.getElementById("icon");
        const newUsernameInputContainer = document.getElementById("new-username");
        const newUsernameInput = document.getElementById("username-input");

        toggleEditUsernameIcon(editUsernameIcon);

        if (editUsernameIcon.textContent !== "create") {
            newUsernameInputContainer.classList.remove("d-none");
        } else {            
            newUsernameInputContainer.classList.add("d-none");
        }

        submitUsernameButton.addEventListener("click", () => {
            submitNewUsername(newUsernameInput.value).then(result => {
                if (result === 409 ) {
                    invalidUsernameError();
                } else {
                    const username = document.getElementById("username");
                    username.textContent = result;
                    newUsernameInputContainer.classList.add("d-none");
                    toggleEditUsernameIcon(editUsernameIcon);
                }
                newUsernameInput.value = "";
            });
        })
        
    });
}

function toggleEditUsernameIcon(icon) {
    if (icon.textContent === "close") {
        icon.textContent = "create";
    } else {            
        icon.textContent = "close";
    }
}

function invalidUsernameError() {
    const errorMessage = document.getElementById("invalid-username");
    errorMessage.classList.remove("d-none");
    setTimeout( () => {
        errorMessage.classList.add("d-none");
    }, 1000)
}


function isValidURL(input) {
    try {
        url = new URL(input)
    } catch {
        return false;
    }
    return true;
}


function submitNewAvatar(avatarURL) {
    submitAvatarURL(avatarURL).then(() => {
        updateAvatarImage(avatarURL);
    })
}


function updateAvatarImage(avatarURL) {
    const avatarImage = document.getElementById("avatar-img");
    if (avatarURL === "default_user_avatar") {
        avatarImage.setAttribute("src", "static/ints/images/avatar/default_user_avatar.png");
    } else {
        avatarImage.setAttribute("src", avatarURL);
    }
    hideChangeAvatarInput();
}

function hideChangeAvatarInput() {
    document.getElementById("new-avatar").classList.remove("d-block");
    document.getElementById("edit-avatar").classList.remove("d-none");
}