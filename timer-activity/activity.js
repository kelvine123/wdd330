const countdown = document.querySelector('#countdown');
const startButton = document.querySelector('#startButton');
const pauseButton = document.querySelector('#pauseButton');
const timeInput = document.querySelector('#timeInput')

let timer;

startButton.addEventListener('click', () => {
    let count = timeInput.value;
    timer = setInterval(() => {
        if (count >= 0) {
            countdown.textContent = count;
            count--;
        } else {
            setTimeout(() => {
                countdown.textContent = "Time's out!"
            }, 500)
        }
    }, 1000)
});

pauseButton.addEventListener('click', () => {
    clearInterval(timer);
});