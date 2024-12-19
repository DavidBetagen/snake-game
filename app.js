
const foods = [
    PIXI.Texture.from('assets/apple.png'),
    PIXI.Texture.from('assets/money.png'),
    PIXI.Texture.from('assets/trophy.png'),
    PIXI.Texture.from('assets/heart.png'),
    PIXI.Texture.from('assets/gift.png'),
];

let currentFoodIndex = 0;

// Create the game canvas
const app = new PIXI.Application({
    width: 1200,
    height: 1200,
    backgroundColor: '#7ed414',
});
document.body.appendChild(app.view);

// Create the snake sprite
const snakeHead = new PIXI.Sprite(PIXI.Texture.WHITE);
snakeHead.tint = 0x000000;
snakeHead.width = 40; // Set the desired width
snakeHead.height = 40; // Set the desired height
snakeHead.position.set(320, 240);
snakeHead.anchor.set(0.5);
const snakeBody = [snakeHead]; // Array of snake body segments

// Add the sprites to the stage
app.stage.addChild(...snakeBody); // Spread syntax to add all body segments

// Create the food sprite
const food = new PIXI.Sprite(foods[currentFoodIndex]);
food.width = 70; // Set the desired width
food.height = 70; // Set the desired height
food.position.set(100, 100);
food.anchor.set(0.5);

// Add the sprites to the stage
app.stage.addChild(food);

// Set up the game state
let snakeDirection = 'right';
const snakeSpeed = 5;

let gameOver = false;

// Set up the game loop
app.ticker.add(() => {
    if (gameOver) return;


    // Move the snake
    for (let i = snakeBody.length - 1; i > 0; i--) {
        // Move each body segment to the position of the one in front of it
        snakeBody[i].position.set(snakeBody[i - 1].x, snakeBody[i - 1].y);
    }
    switch (snakeDirection) {
        case 'up':
            snakeHead.y -= snakeSpeed;
            break;
        case 'down':
            snakeHead.y += snakeSpeed;
            break;
        case 'left':
            snakeHead.x -= snakeSpeed;
            break;
        case 'right':
            snakeHead.x += snakeSpeed;
            break;
    }

    // Check for collisions with the food
    if (snakeHead.getBounds().intersects(food.getBounds())) {
        // Respawn the food
        food.position.set(
            Math.random() * app.screen.width,
            Math.random() * app.screen.height
        );

        currentFoodIndex = (currentFoodIndex + 1) % foods.length;
        food.texture = foods[currentFoodIndex];


        // Add a new body segment to the end of the snake
        const newBodySegment = new PIXI.Sprite(PIXI.Texture.WHITE);
        newBodySegment.width = 40; // Set the desired width
        newBodySegment.height = 40; // Set the desired height
        newBodySegment.tint = 0x000000;
        newBodySegment.position.set(snakeBody[snakeBody.length - 1].x, snakeBody[snakeBody.length - 1].y);
        newBodySegment.anchor.set(0.5);
        snakeBody.push(newBodySegment);
        app.stage.addChild(newBodySegment);
    }

    // Check for collisions with the walls
    if (snakeHead.x < 0 || snakeHead.x > app.screen.width ||
        snakeHead.y < 0 || snakeHead.y > app.screen.height) {
        // Game over
        console.log('Game over!');
        alert('Game over!');
        gameOver = true;
    }
});

// Set up keyboard input
window.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            snakeDirection = 'up';
            break;
        case 'ArrowDown':
            snakeDirection = 'down';
            break;
        case 'ArrowLeft':
            snakeDirection = 'left';
            break;
        case 'ArrowRight':
            snakeDirection = 'right';
            break;
    }
});
