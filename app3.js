(async () =>
    {
        // Create a new application
        const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });
    
        // Initialize the application
        // await app.init({ background: '#1099bb', resizeTo: window });
    
        // Append the application canvas to the document body
        document.body.appendChild(app.view);
    
        // load sprite sheet..
        await PIXI.Assets.load('https://pixijs.com/assets/spritesheet/monsters.json');
    
        // holder to store aliens
        const aliens = [];
        const alienFrames = ['eggHead.png', 'flowerTop.png', 'helmlok.png', 'skully.png'];
    
        let count = 0;
    
        // create an empty container
        const alienContainer = new PIXI.Container();
    
        alienContainer.x = 400;
        alienContainer.y = 300;
    
        app.stage.addChild(alienContainer);
    
        // add a bunch of aliens with textures from image paths
        for (let i = 0; i < 100; i++)
        {
            const frameName = alienFrames[i % 4];
    
            // create an alien using the frame name..
            const alien = PIXI.Sprite.from(frameName);
    
            alien.tint = Math.random() * 0xffffff;
    
            alien.x = Math.random() * 800 - 400;
            alien.y = Math.random() * 600 - 300;
            alien.anchor.x = 0.5;
            alien.anchor.y = 0.5;
            aliens.push(alien);
            alienContainer.addChild(alien);
        }
    
        // this will cache the container and its children as a single texture
        // so instead of drawing 100 sprites, it will draw a single texture!
        alienContainer.cacheAsTexture()
    })();