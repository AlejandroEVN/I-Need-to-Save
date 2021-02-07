document.addEventListener("DOMContentLoaded", () => {
    const alert = document.getElementById("invalid-credentials");

    setTimeout(() => {
        alert.classList.add("d-none");
    }, 1000);
})