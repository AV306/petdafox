/**
 * "PetDaFox" CODE (c) 2021 AV3_08.
 * "PetDaFox" ASSETS (c) 2021 BluFoxery.
 *
 * The CODE of this project is licensed under the
 * MIT license.
 *
 * The ASSETS (blu_idle and blu_petted) themselves
 * are the property of the artist,
 * and permission (from the artist)
 * is required to reuse or distribute them.
 *
 * Made for @blufoxery (Instagram)
 */



 var blu_idle;
 var blu_idle_eyes;
 var blu_petted;
 var hand;
 
 function preload()
 {
   // Load images in
   blu_idle = loadImage( "assets/blu/blu_idle_noeyes.png" );
   blu_idle_eyes = loadImage( "assets/blu/blu_idle_eyes.png" );
   blu_petted = loadImage( "assets/blu/blu_petted.jpeg" );
   
   hand = loadImage( "assets/hand/hand.gif" );
 }
 
 
 var isBluBeingPetted = false;
 var pets = 0;
 
 var hitboxToggle;
 
 const hitboxPos = new Vec2( 200, 220 );
 const hitboxSize = new Vec2( 200, 105 );
 const handSize = new Vec2( 210, 210 );
 
 const petDelay = 30;
 
 function setup()
 {
   createCanvas( 600, 600 );
   
   noStroke();
   
   hand.delay( petDelay );
   
   textSize( 20 );
   textAlign( LEFT, TOP )
   
   hitboxToggle = createCheckbox( "Show hitbox", false );
   hitboxToggle.style( "color: white;" );
 }
 
 function draw()
 {
   background( 255 );
   
   // Setp 1: Check inputs
   checkMouseInput();
   
   // Step 2: Render image of Blu
   renderBlu();
   
   // Step 3: Render image of hand
   renderHand();
   
   // Step 4: Update "score"
   updateScore();
   
   // Step 4a: Render hitbox
   if ( hitboxToggle.checked() ) renderDebugHitbox();
   
   text( `FPS: ${floor( 1000/deltaTime )}`, 0, height - 18 );
 }
 
 function checkMouseInput()
 {
   // Is the mouse pressed AND within the hitbox?
   if ( mouseIsPressed &&
     mouseX > hitboxPos.x && mouseX < hitboxPos.x + hitboxSize.x &&
     mouseY > hitboxPos.y && mouseY < hitboxPos.y + hitboxSize.y
   ) isBluBeingPetted = true;
   else isBluBeingPetted = false;
 }
 
 function renderBlu()
 {
   // If Blu is being petted,
   if ( isBluBeingPetted )
   {
     // Render the "petted" image and make it
     // bounce up and down a little
     // This image is scaled slightly to match the size of the idle one
     image(
       blu_petted,
       hitboxPos.x,
       hitboxPos.y + Math.sin( millis() / 40 ) * 4,
       251,
       386
     );
   }
   else // Otherwise, render the "idle" image
   {
     image(
       blu_idle,
       hitboxPos.x + 30,
       hitboxPos.y - 20,
       183,
       405
     );
     
     // Do a little bit of math
     // to make the eyes track the mouse    
     var xMod = (mouseX - width/2) / 50 + 5;
     var yMod = (mouseY - height/2) / 50;
     
     image(
       blu_idle_eyes,
       hitboxPos.x + 58 + xMod,
       hitboxPos.y + 76 + yMod,
       63,
       60
   );
   }
 }
 
 function renderHand() // FIXME: Suspected performance bottleneck
 { 
   // If Blu is being petted, animate the hand!
   if ( isBluBeingPetted )
     hand.play();
   else
     hand.pause();
   
   // Render the current frame of the hand,
   // slightly offset from the mouse
   // so that the mouse is in the middle of the image
   image(
     hand,
     mouseX - 0.5 * handSize.x,
     mouseY - 0.5 * handSize.y,
     handSize.x,
     handSize.y
   );
 }
 
 // Cooldown between pet increment
 const cooldown = 10 * petDelay;
 
 // Counter that tracks cooldown progress
 var counter = 100;
 function updateScore()
 {
   // If Blu is being petted,
   if ( isBluBeingPetted )
   {
     // and the cooldown is past,
     if ( counter >= cooldown )
     {
       // Increment pets and reset counter
       pets++;
       counter = 0;
     }
     // Otherwise increment the counter
     // at a rate independent of fps
     else counter += deltaTime;
   }
   
   fill( 0 );
   text( `Pets: ${pets}`, 0, 0 );
 }
 
 function renderDebugHitbox()
 {
   // Draw a semitransparent black rectangle
   // over the valid click area
   push();
   fill( 0, 0, 0, 128 );
   rect(
     hitboxPos.x,
     hitboxPos.y,
     hitboxSize.x,
     hitboxSize.y
   );
   pop();
 }