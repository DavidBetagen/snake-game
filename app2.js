
(async () =>
    {
class SnakeGame {
    app = null
    title = ''
    snakeHead = null
    snakeBody = null
    snakeSize = 30
    food = null
    foodSize = 70
    score = 0
    winScore = 1
    foods = [
        {
            'texture': PIXI.Texture.from('assets/apple.png'),
            'message': 'WISH YOU HEALTHY'
        },
        {
            'texture': PIXI.Texture.from('assets/money.png'),
            'message': 'WISH YOU WEALTHY'
        },
        {
            'texture': PIXI.Texture.from('assets/trophy.png'),
            'message': 'WISH YOU SUCCESS'
        },
        {
            'texture': PIXI.Texture.from('assets/heart.png'),
            'message': 'WISH YOU LOVE'
        },
        {
            'texture': PIXI.Texture.from('assets/gift.png'),
            'message': ''
        },
    ];
    eatingEffectTexture = PIXI.Texture.from('assets/star.png')
    currentFoodIndex = 0
    snakeDirection = 'up'
    snakeSpeed = 3
    gameOver = false
    eatingMessage = ''
    borderX = 100
    borderY = 120
    blackgroundImg = null

    constructor() {
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: 1200,
            backgroundColor: 0x7ed414,
        });
        document.body.appendChild(this.app.view);

        // window.addEventListener('resize', () => {
        //     this.app.renderer.resize(window.innerWidth, 1200);
        //     backgroundSprite.width = this.app.screen.width;
        //     backgroundSprite.height = this.app.screen.height;
        // });
        this.intro()
    }
    startGame() {
        this.setBackground('assets/bg.png')
        // this.blackgroundImg.texture = PIXI.Texture.from(`assets/bg.png`);

        this.addSnake()
        this.addFood()
        this.startLoop()
    }
    intro() {
        var countIntro = 1;
        this.blackgroundImg = new PIXI.Sprite(PIXI.Texture.from(`assets/intros/0${countIntro}.png`));
        this.blackgroundImg.width = this.app.screen.width;
        this.blackgroundImg.height = this.app.screen.height;
        this.app.stage.addChild(this.blackgroundImg);
      
        var countdownInterval = setInterval(() => {
            countIntro++;
            
            if (countIntro < 9) {
                 this.blackgroundImg.texture = PIXI.Texture.from(`assets/intros/0${countIntro}.png`);
            } else {
                clearInterval(countdownInterval);
                setTimeout(this.startGame(), 1000);
            }
        }, 1000);
    }
    endCredit() {
        var count = 1;

        this.blackgroundImg = new PIXI.Sprite(PIXI.Texture.from(`assets/end_credits/02.png`));
        this.blackgroundImg.width = this.app.screen.width;
        this.blackgroundImg.height = this.app.screen.height;
        this.app.stage.addChild(this.blackgroundImg);
       
        var countdownInterval = setInterval(() => {
            count++;
            
            if (count < 3) {
                 this.blackgroundImg.texture = PIXI.Texture.from(`assets/intros/01.png`);
            } else {
                clearInterval(countdownInterval);
                setTimeout(this.stop(), 1000);
            }
        }, 1000);
    }
    setBackground(pathFile) {
        var backgroundTexture = PIXI.Texture.from(pathFile);
        this.blackgroundImg = new PIXI.Sprite(backgroundTexture);

        this.blackgroundImg.width = this.app.screen.width;
        this.blackgroundImg.height = this.app.screen.height;
        this.blackgroundImg.anchor.set(0);
        this.app.stage.addChild(this.blackgroundImg);
    }
    renderTitle(title) {
        this.title = new PIXI.Text(title, {
            fontFamily: 'PressStart2P',
            fontSize: 34,
            fill: 0x000000,
            align: 'center',
            fontWeight: 'bold'
        });
        
        this.title.x = this.app.screen.width / 2 - this.title.width / 2; // Center horizontally
        this.title.y = 200;

        this.app.stage.addChild(this.title);   
    }
    addSnake() {
        this.snakeHead = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.snakeHead.tint = 0x000000;
        this.snakeHead.width = this.snakeSize;
        this.snakeHead.height = this.snakeSize;
        this.snakeHead.position.set(200, 1000);
        this.snakeHead.anchor.set(0.5);
        this.snakeBody = [this.snakeHead];

        this.app.stage.addChild(...this.snakeBody);

        this.makeSnakeLonger();
    }
    addFood() {
        this.food = new PIXI.Sprite(this.foods[this.currentFoodIndex]['texture']);
        this.food.width = this.foodSize;
        this.food.height = this.foodSize;
        this.food.position.set(
            this.borderX + Math.random() * (this.app.screen.width - 2 * this.borderX),
            this.borderY + Math.random() * (this.app.screen.height - 2 * this.borderY)
        );
        this.food.anchor.set(0.5);

        this.app.stage.addChild(this.food);
    }

    stop() {
        // this.app.stage.removeChildren();
        // this.setBackground('assets/end-credit1.png')
        this.app.ticker.stop();
        console.log('game is stop')
    }

    end() {
        this.app.stage.removeChildren();
        this.endCredit()
    }

    startLoop() {
        this.app.ticker.add(() => {

            this.fadeOutTitle()

            if (this.gameOver) {
                this.renderTitle("Game Over!")
                this.stop();
                return;
            }

            if (this.gameIsEnd()) {
                this.end();
                return;
            }

            this.checkSnakeDirection();
            this.snakeMove();
            this.checkSnakeCollisionsTheWalls();
            this.checkSnakeEatFood();
        })
    }

    fadeOutTitle() {
        if (this.title.alpha > 0) {
            this.title.alpha -= 0.0099;
        } else {
            this.app.stage.removeChild(this.title);
        }
    }

    makeSnakeLonger() {
        for (let i = 0; i < 30; i++) {
            this.snakeGrowingUp()
        }
    }

    addNewFood() {
        this.currentFoodIndex = (this.currentFoodIndex + 1) % this.foods.length;
        this.food.texture = this.foods[this.currentFoodIndex]['texture'];

        var borderX = this.borderX + 7
        var borderY = this.borderY + 7
        this.food.position.set(
            borderX + Math.random() * (this.app.screen.width - 2 * borderX),
            borderY + Math.random() * (this.app.screen.height - 2 * borderY)
        );
    }

    snakeGrowingUp() {
        var newBodySegment = new PIXI.Sprite(PIXI.Texture.WHITE);
        newBodySegment.width = this.snakeSize
        newBodySegment.height = this.snakeSize
        newBodySegment.tint = 0x000000;
        newBodySegment.position.set(this.snakeBody[this.snakeBody.length - 1].x, this.snakeBody[this.snakeBody.length - 1].y);
        newBodySegment.anchor.set(0.5);
        this.snakeBody.push(newBodySegment);
        this.app.stage.addChild(newBodySegment);
    }
    checkSnakeEatFood() {
        if (this.snakeEating()) {
            this.score+=1
            this.snakeSpeed+=1
            this.changeTitle()
            this.showEatingEffect(this.food.x, this.food.y)
            this.snakeGrowingUp()
            if(!this.gameIsEnd()){
                this.addNewFood()
            }else{
                this.app.stage.removeChild(this.food);
            }
        }
    }

    changeTitle(){
        this.app.stage.removeChild(this.title);
        this.title = this.foods[this.currentFoodIndex]['message']
        if(this.title){
            this.renderTitle(this.title)
        }
    }

    gameIsEnd() {
        return this.score == this.winScore;
    }
    showEatingEffect(x, y) {
        var effect = new PIXI.Sprite(this.eatingEffectTexture);
        effect.width = 100;
        effect.height = 100;
        effect.position.set(x, y);
        effect.anchor.set(0.5);

        this.app.stage.addChild(effect);
        setTimeout(() => {
            this.app.stage.removeChild(effect);
        }, 200);
    }

    snakeEating() {
        if (this.snakeHead.getBounds().intersects(this.food.getBounds())) {
            return true;
        }
        return false
    }
    snakeMove() {
        for (let i = this.snakeBody.length - 1; i > 0; i--) {
            this.snakeBody[i].position.set(this.snakeBody[i - 1].x, this.snakeBody[i - 1].y);
        }
    }
    checkSnakeDirection() {
        switch (this.snakeDirection) {
            case 'up':
                this.snakeHead.y -= this.snakeSpeed;
                break;
            case 'down':
                this.snakeHead.y += this.snakeSpeed;
                break;
            case 'left':
                this.snakeHead.x -= this.snakeSpeed;
                break;
            case 'right':
                this.snakeHead.x += this.snakeSpeed;
                break;
        }
    }

    checkSnakeCollisionsTheWalls() {
        // if (this.snakeHead.x < 0 || this.snakeHead.x > this.app.screen.width ||
        //     this.snakeHead.y < 0 || this.snakeHead.y > this.app.screen.height) {
        //         this.gameOver = true;
        //         console.log('game over')
        // }
        // Check if the snake head goes outside the playable area (within the defined margins from the borders)
        if (this.snakeHead.x < this.borderX || this.snakeHead.x > this.app.screen.width - this.borderX ||
            this.snakeHead.y < this.borderY || this.snakeHead.y > this.app.screen.height - this.borderY) {
            this.gameOver = true;
            console.log('Game over');
        }
    }

    move(newDirection) {
        if (
            (this.snakeDirection === 'up' && newDirection === 'down') ||
            (this.snakeDirection === 'down' && newDirection === 'up') ||
            (this.snakeDirection === 'left' && newDirection === 'right') ||
            (this.snakeDirection === 'right' && newDirection === 'left')
        ) {
            return;
        }

        this.snakeDirection = newDirection;
    }

    moveUp() {
        this.move('up');
    }

    moveDown() {
        this.move('down');
    }

    moveLeft() {
        this.move('left');
    }

    moveRight() {
        this.move('right');
    }
} 

snake = new SnakeGame()

window.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            snake.moveUp()
            break;
        case 'ArrowDown':
            snake.moveDown()
            break;
        case 'ArrowLeft':
            snake.moveLeft()
            break;
        case 'ArrowRight':
            snake.moveRight()
            break;
    }
});

document.getElementById('up').addEventListener('click', () => snake.move('up'));
document.getElementById('down').addEventListener('click', () => snake.move('down'));
document.getElementById('left').addEventListener('click', () => snake.move('left'));
document.getElementById('right').addEventListener('click', () => snake.move('right'))

})();