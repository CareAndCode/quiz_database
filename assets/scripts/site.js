(() => {
    const speechSynthesis = window.speechSynthesis;
    const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
    const status = document.createElement("span");

    status.className = "speech-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    document.body.appendChild(status);

    if (!speechSynthesis || !SpeechSynthesisUtterance) {
        status.textContent = "Text-to-speech is not supported in this browser.";
        return;
    }

    let activeButton = null;

    const resetButton = button => {
        if (!button) return;
        button.textContent = "▶";
        button.setAttribute("aria-label", button.dataset.defaultLabel);
        button.title = button.dataset.defaultLabel;
    };

    const getCleanText = target => {
        const text = target.cloneNode(true);
        text.querySelectorAll(".speech-button").forEach(button => button.remove());
        return text.textContent.replace(/\s+/g, " ").trim();
    };

    const getSpeechText = target => {
        if (target.id === "question") {
            const answers = [...document.querySelectorAll(".choice-container")].map((container, index) => {
                const label = container.querySelector(".choice-prefix")?.textContent.trim()
                    || `Answer ${index + 1}`;
                const answerElement = container.querySelector(".choice-text");
                const answer = answerElement ? getCleanText(answerElement) : "";
                return `${label}: ${answer}`;
            });

            return `Question: ${getCleanText(target)}. ${answers.join(". ")}`;
        }

        return getCleanText(target);
    };

    const speak = button => {
        if (activeButton === button && speechSynthesis.speaking) {
            speechSynthesis.cancel();
            resetButton(activeButton);
            activeButton = null;
            return;
        }

        if (activeButton) resetButton(activeButton);
        speechSynthesis.cancel();

        const text = getSpeechText(button.parentElement);
        if (!text) return;

        const utterance = new SpeechSynthesisUtterance(text);
        activeButton = button;
        button.textContent = "■";
        button.setAttribute("aria-label", "Stop speaking");
        button.title = "Stop speaking";
        status.textContent = "";

        const finish = () => {
            if (activeButton !== button) return;
            resetButton(button);
            activeButton = null;
        };

        utterance.onend = finish;
        utterance.onerror = event => {
            finish();
            if (event.error !== "canceled" && event.error !== "interrupted") {
                status.textContent = "Text-to-speech could not play this text.";
            }
        };

        speechSynthesis.speak(utterance);
    };

    const addSpeechButtons = () => {
        const target = document.getElementById("question");
        if (!target || target.querySelector(".speech-button")) return;

        const button = document.createElement("button");
        const label = "Read question and answers aloud";

        button.type = "button";
        button.className = "speech-button";
        button.textContent = "▶";
        button.dataset.defaultLabel = label;
        button.setAttribute("aria-label", label);
        button.title = label;
        button.addEventListener("click", event => {
            event.stopPropagation();
            speak(button);
        });
        target.appendChild(button);
    };

    addSpeechButtons();
    new MutationObserver(addSpeechButtons).observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
