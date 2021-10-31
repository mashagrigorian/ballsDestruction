window.addEventListener("load", () => {
  const canvas = document.querySelector("#canvas");
  const context = canvas.getContext("2d");

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;

let points = 0;
let enemies = [];
let bullets = [];

var audio = new Audio('audio.mp3');
  audio.play();

const stabAudio = document.createElement("audio");
stabAudio.src = "http://gamecodeschool.com/wp-content/uploads/2016/07/asteroids-ship-shoot.wav";

let mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
}

let data = {
  shoot: []
}

addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("click", Shoot);
addEventListener("click", (event) => {
  stabAudio.currentTime = 0;
  stabAudio.play();
});

addEventListener("keypress", (event) => {
  if (event.code === "Space") {
    Shoot();
    stabAudio.currentTime = 0;
    stabAudio.play();
  }
});

addEventListener("keydown", (event) => {
  if (event.code === "KeyW") {
    MovePlayer(1);
  }
  if (event.code === "KeyS") {
    MovePlayer(2);
  }
});

class Circle {
  constructor(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.color = c;
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  }

  update() {
    this.draw();
  }
}

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Shoot() {
  let bullet = new Circle(player.x, player.y, 11, "#FF8C00");
  bullet.mx = mouse.x;
  bullet.my = mouse.y;

  let vx = mouse.x - bullet.x;
  let vy = mouse.y - bullet.y;
  let speed = 7;

  let dist = Math.sqrt(vx * vx + vy + vy);
  bullet.dx = vx / dist;
  bullet.dy = vy / dist;

  bullet.dx *= speed;
  bullet.dy *= speed;

  bullets.push(bullet);
}

function SpawnEnemy() {
  let enemy = new Circle(canvas.width, randomIntFromRange(20, canvas.height - 20), 20, "#FA812F");
  let level = randomIntFromRange(1, 2);
  enemy.speed = randomIntFromRange(3, 5);
  enemy.health = level;
  if (level === 2) {
    enemy.color = "#FA4032";
  }

  enemies.push(enemy);
}

let player;

function Start() {
  player = new Circle(0, canvas.height / 2, 30, "#021C1E");
}

let originalTimer = 150;
let spawnTimer = originalTimer;

function Update() {
  requestAnimationFrame(Update);
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Bullets
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];

    bullet.x += bullet.dx;
    bullet.y += bullet.dy;

    if (
      bullet.x < 0 ||
      bullet.x > canvas.width ||
      bullet.y < 0 ||
      bullet.y > canvas.height
    ) {
      bullets.splice(i, 1);
      console.log(bullets);
    }

    bullet.update();
  }

  // Enemies
  spawnTimer--;
  if (spawnTimer <= 0) {
    originalTimer = (originalTimer * 0.98 > 60) ? originalTimer * 0.98 : 60;
    spawnTimer = originalTimer;
    SpawnEnemy();
  }
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];

    enemy.x -= enemy.speed;

    if (enemy.x < 0) {
      enemies.splice(i, 1);
      points = 0;
      originalTimer = 150;
    }

    for (let j = 0; j < bullets.length; j++) {
      let bullet = bullets[j];

      let ax = bullet.x - enemy.x;
      let ay = bullet.y - enemy.y;
      let distance = Math.sqrt(ax * ax + ay * ay);

      if (distance < bullet.radius + enemy.radius) {
        enemy.health--;
        bullets.splice(j, 1);
        if (enemy.health <= 0) {
          enemies.splice(i, 1);
        }
        points += 100;
      }
    }

    enemy.update();
  }

  player.update();

  context.fillStyle = "#663399";
  context.font = "20px Cambria";
  context.textAlign = "center";
  context.fillText("Points: " + points, canvas.width / 2, 20);
}

function MovePlayer(direction) {
  switch (direction) {
    case 1:
      player.y -= 10;
      break;
    case 2:
      player.y += 10;
      break;
    default:
      break;
  }
}

Start();
Update();
});