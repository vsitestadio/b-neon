const characters = document.querySelectorAll(".character");

    let current = 0;

    setInterval(function () {

        characters[current].classList.remove("active");

        current++;

        if (current >= characters.length) {
            current = 0;
        }

        characters[current].classList.add("active");

    }, 3000);