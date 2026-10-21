const categoryInput = document.getElementById("category");
const categorySelected = document.getElementById("category-selected");
const categoryMenu = document.getElementById("category-menu");
const categoryToggle = document.getElementById("category-toggle");
const categories = [...new Set(questions.map(question => question.category))].sort();

["All categories", ...categories].forEach(category => {
    const item = document.createElement("li");
    const option = document.createElement("button");
    const value = category === "All categories" ? "" : category;

    option.type = "button";
    option.className = "dropdown-item";
    option.textContent = category;
    option.setAttribute("aria-pressed", "false");
    option.addEventListener("click", () => {
        categoryInput.value = value;
        categorySelected.textContent = category;
        categoryMenu.querySelectorAll(".dropdown-item").forEach(menuOption => {
            menuOption.setAttribute("aria-pressed", String(menuOption === option));
        });
        bootstrap.Dropdown.getOrCreateInstance(categoryToggle).hide();
    });

    item.appendChild(option);
    categoryMenu.appendChild(item);
});

categoryMenu.querySelector(".dropdown-item").setAttribute("aria-pressed", "true");
