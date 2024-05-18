// scripts.js

const player = document.getElementById('player');
const joystick = document.getElementById('joystick');
const joystickContainer = document.getElementById('joystick-container');
const counterDisplay = document.getElementById('counter');
const dotCounterDisplay = document.getElementById('dot-counter');

let joystickCenterX = 0;
let joystickCenterY = 0;
let playerX = 50;
let playerY = 50;
let joystickActive = false;
let dx = 0;
let dy = 0;
const joystickRadius = joystickContainer.offsetWidth / 2 - joystick.offsetWidth / 2;
let counter = 0;

const gameContainer = document.getElementById('game-container');
const gameContainerRect = gameContainer.getBoundingClientRect();
const keys = {};
const maxDots = 5;

const updateJoystickCenter = () => {
    const joystickContainerRect = joystickContainer.getBoundingClientRect();
    joystickCenterX = joystickContainerRect.left + joystickContainerRect.width / 2;
    joystickCenterY = joystickContainerRect.top + joystickContainerRect.height / 2;
};

const movePlayer = () => {
    if (joystickActive) {
        playerX += dx * 0.1;
        playerY += dy * 0.1;
    }

    if (keys['w'] || keys['arrowup']) {
        playerY -= 2;
    }
    if (keys['s'] || keys['arrowdown']) {
        playerY += 2;
    }
    if (keys['a'] || keys['arrowleft']) {
        playerX -= 2;
    }
    if (keys['d'] || keys['arrowright']) {
        playerX += 2;
    }

    playerX = Math.max(0, Math.min(playerX, gameContainerRect.width - player.clientWidth));
    playerY = Math.max(0, Math.min(playerY, gameContainerRect.height - player.clientHeight));
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;

    checkDotCollision();

    requestAnimationFrame(movePlayer);
};

const createDot = () => {
    const currentDots = document.querySelectorAll('.dot').length;
    if (currentDots < maxDots) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.left = `${Math.random() * (gameContainerRect.width - 10)}px`;
        dot.style.top = `${Math.random() * (gameContainerRect.height - 10)}px`;
        gameContainer.appendChild(dot);
        updateDotCounter();
    }
};

const checkDotCollision = () => {
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        const dotRect = dot.getBoundingClientRect();
        const playerRect = player.getBoundingClientRect();

        if (
            playerRect.left < dotRect.left + dotRect.width &&
            playerRect.left + playerRect.width > dotRect.left &&
            playerRect.top < dotRect.top + dotRect.height &&
            playerRect.top + playerRect.height > dotRect.top
        ) {
            dot.remove();
            counter++;
            counterDisplay.textContent = `Score: ${counter}`;
            updateDotCounter();
        }
    });
};

const updateDotCounter = () => {
    const currentDots = document.querySelectorAll('.dot').length;
    dotCounterDisplay.textContent = `Dots: ${currentDots}/${maxDots}`;
};

setInterval(createDot, 1000);

joystick.addEventListener('touchstart', (e) => {
    e.preventDefault();
    joystickActive = true;
    updateJoystickCenter();
});

joystick.addEventListener('touchmove', (e) => {
    if (joystickActive) {
        e.preventDefault();
        const touch = e.touches[0];
        dx = touch.clientX - joystickCenterX;
        dy = touch.clientY - joystickCenterY;

        // Calculate the distance from the center
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Constrain the joystick within the outer circle
        if (distance > joystickRadius) {
            const angle = Math.atan2(dy, dx);
            dx = joystickRadius * Math.cos(angle);
            dy = joystickRadius * Math.sin(angle);
        }

        joystick.style.transform = `translate(${dx}px, ${dy}px)`;
    }
});

joystick.addEventListener('touchend', (e) => {
    e.preventDefault();
    joystickActive = false;
    dx = 0;
    dy = 0;
    joystick.style.transform = 'translate(0, 0)';
});

const handleKeyDown = (e) => {
    keys[e.key.toLowerCase()] = true;
};

const handleKeyUp = (e) => {
    keys[e.key.toLowerCase()] = false;
};

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Start the animation loop
requestAnimationFrame(movePlayer);

// Ensure the player starts at the center
player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;
