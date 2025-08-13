import "./style.css";

const unitButtons = document.querySelectorAll(".unit-btn");
unitButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        unitButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const selectedUnit = btn.dataset.unit;
        console.log("Selected unit:", selectedUnit);
    });
});

