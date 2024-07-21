"use strict"
let bullets = [];
let enemies = [];
let spikes = [];
let boss = 0;
let counter = 0;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
const SongsCount = 0;//Если хотите музыку то поменяйте значения тут на количество песен, а их названия на количество от одного до их количества
let directions = [false, false, false, false];
let Speed = 10;
var Song = new Audio();
let lvl = 1;
let exp = 0;
let atk = 40;
var ship = new Image();
var bossimg = new Image();
var enemyimg1 = new Image();
var enemyimg2 = new Image();
var spikeimg = new Image();
let shoot = true;
let bs = 20;
let defes = 0.2;
let defss = 0.3;
let es = 0.5;
let ss = 0.75;
let pts = 0;
let timescale = 1;
let lives = 100;
let opacity = 1;
let livecounter = document.getElementById('lives')
let bulletdir = [[0, -1 * bs]];
var BGgradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let hardmode = confirm("Хардмодик?")
if (document.documentElement.clientWidth > document.documentElement.clientHeight){
    canvas.style.height = '100%';
    canvas.style.left = (document.documentElement.clientWidth-canvas.width)/2;
}
else {
    canvas.style.width = '100%';
}
let cw = canvas.width;
let ch = canvas.height;
let x = cw / 2;
let y = ch - 25;
BGgradient.addColorStop(0, "#010121");
BGgradient.addColorStop(1, "#150120");
ship.src = 'pics\\ship.png';
bossimg.src = 'pics\\boss.png';
enemyimg1.src = 'pics\\enemy1.png';
enemyimg2.src = 'pics\\enemy2.png';
spikeimg.src = 'pics\\down.png';
ship.onerror = ctx.fillRect(4, 4, x - 2, y - 2);
ship.onload = function() {
    ctx.imageSmoothingEnabled = false;
}
class bullet{
    constructor(x, y, dx, dy){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
}
class enemy{
    constructor(x, y, dx, dy, hp){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.hp = hp;
        this.pic = Math.ceil(Math.random()*2)
    }
}
class spike{
    constructor(x, y, dx, dy){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
}
document.addEventListener("keydown", function (e) {
    switch (e.key){
        case "d":
        case "в":
        case "ArrowRight":
            directions[0] = true;
            break;
        case "s":
        case "ы":
        case "ArrowDown":
            directions[1] = true;
            break;
        case "a":
        case "ф":
        case "ArrowLeft":
            directions[2] = true;
            break;
        case "w":
        case "ц":
        case "ArrowUp":
            directions[3] = true;
            break;
    }
})
document.addEventListener("keyup", function (e) {
    console.log(e.key)
    switch (e.key){
        case "Control":
            shoot = !shoot;
            break;
        case "d":
        case "в":
        case "ArrowRight":
            directions[0] = false;
            break;
        case "s":
        case "ы":
        case "ArrowDown":
            directions[1] = false;
            break;
        case "a":
        case "ф":
        case "ArrowLeft":
            directions[2] = false;
            break;
        case "w":
        case "ц":
        case "ArrowUp":
            directions[3] = false;
            break;
    }
})
ship.addEventListener("load", function (){}, false,)
function randInt(max) {
    return Math.floor(Math.random() * max + 1)
}
function SongChange(){
    Song.src = String(randInt(SongsCount)) + '.mp3';
    Song.play();
}
function SpawnBullet(x, y, dx, dy) {
    bullets.unshift(new bullet(x, y, dx, dy));
}
function SpawnSpike() {
    spikes.unshift(new spike(randInt(cw), 0, 0, ss));
}
function SpawnBoss(bossHP) {
    if (boss <= 0){
        boss = bossHP;
    }
}
function SpawnEnemy(enemyHP) {
    enemies.unshift(new enemy(randInt(cw), 0, 0, es, enemyHP));
}
function levelup(){
    lvl += 1;
    bulletdir = [];
    for (let i = 1, j = lvl + 1; i < j;i++){
        bulletdir.unshift([Math.cos((i/j)*3.1415)*bs, -Math.sin((i/j)*3.1415)*bs]);
    }
}
function restart(){
    pts = 0;
    lvl = 1;
    enemies = [];
    bullets = [];
    spikes = [];
    boss = 0;
    es = 0.5;
    ss = 0.75;
    timescale = 1;
    lives = 100;
    bulletdir = [[0, -1 * bs]];
}
function Iter(){
    pts++;
    if (y > ch){
        y = ch;
    }
    if (pts%200 == 0){
        timescale = Math.log10(pts)*2;
        if (boss>0 && hardmode){
            timescale *= 2;
        }
        es = defes * timescale;
        ss = defss * timescale;
        if (pts%10000 == 0){
            SpawnBoss(12500*timescale);
        }
    }
    if (opacity > 0) {
        opacity -= 0.015625;
        livecounter.innerHTML = lives;
        livecounter.style.opacity = opacity;
    }
    if (exp > 100 * (2 ** lvl)){
        exp -= 100 * (2 ** lvl);
        levelup();
    }
    if (pts%parseInt(20-timescale) == 0){
        if (boss > 0){
            SpawnSpike();
            SpawnSpike();
            SpawnSpike();
            SpawnSpike();
            SpawnSpike();
            SpawnSpike();
        }
        else{
            SpawnEnemy(5*timescale);
            SpawnEnemy(5*timescale);
            SpawnSpike();
        }
    }
    ctx.fillStyle = BGgradient;
    ctx.fillRect(0,0,cw,ch);
    if (directions[0]) {
        x += Speed;
    }
    if (directions[1]) {
        y += Speed;
    }
    if (directions[2]) {
        x -= Speed;
    }
    if (directions[3]) {
        y -= Speed;
    }           //Передвижение кораблика
    if (shoot) {
        if (counter > 5) {
            for (let i of bulletdir){
                SpawnBullet(x, y, i[0], i[1]);
            }
            counter = 0;
        }
        counter++;
    }
    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            continue;
        }
        bullets[i].x += bullets[i].dx;
        bullets[i].y += bullets[i].dy;
        if (bullets[i].x <= 0 || bullets[i].x >= canvas.width) {
            bullets[i].dx = -bullets[i].dx;
        }
        ctx.fillStyle = '#0000ff';
        ctx.fillRect(bullets[i].x - 2, bullets[i].y - 2, 4, 4);
    }
    if (boss>0){
        ctx.drawImage(bossimg, 0, -50, cw, ch/4);
        for (let i = 0;i < bullets.length;i++) {
            if (bullets[i].y < 50) {
                bullets.splice(i, 1);
                boss -= atk;
                if (boss <= 0){
                    exp += 800;
                    exp += timescale * 50;
                }
                continue;
            }
        }
    }
    for (let i = 0; i < enemies.length; i++){
        enemies[i].y += enemies[i].dy;
        if (enemies[i].y >= ch){
            enemies.splice(i, 1);
            i--;
            lives -= 1;
            opacity = 1;
            if (lives <= 0){
                restart();
                break;
            }
            continue;
        }
        for (let j = 0;j < bullets.length;j++) {
            if (bullets[j].y < (enemies[i].y + 30) && bullets[j].y > (enemies[i].y - 30) && bullets[j].x < (enemies[i].x + 30) && bullets[j].x > (enemies[i].x - 30)) {
                bullets.splice(j, 1);
                enemies[i].hp -= atk;
                if (enemies[i].hp <= 0){
                    enemies.splice(i, 1);
                    exp += 1
                    break;
                }
            }
        }
        if (i >= enemies.length){
            break;
        }
        if (enemies[i].pic == 1){
            ctx.drawImage(enemyimg1, enemies[i].x - 25, enemies[i].y -25, 50, 50);
        }
        else {
            ctx.drawImage(enemyimg2, enemies[i].x - 25, enemies[i].y -25, 50, 50);
        }
    }
    for (let i = 0; i < spikes.length; i++){
        spikes[i].y += spikes[i].dy;
        if (spikes[i].y >= ch){
            spikes.splice(i, 1);
            continue;
        }
        if (y < (spikes[i].y + 15) && y > (spikes[i].y - 15) && x < (spikes[i].x + 10) && x > (spikes[i].x - 10)) {
            lives -= 1;
            opacity = 1;
            if (lives <= 0){
                restart();
                break;
            }
        }
        ctx.drawImage(spikeimg, spikes[i].x - 25, spikes[i].y -25, 50, 50);
    }
    ctx.fillStyle = '#770000';
    ship.onload = ctx.drawImage(ship, x - 15, y - 15, 30, 30);
    ship.onerror = ctx.fillRect(x - 2, y - 2, 4, 4);
}
setInterval(()=>{Iter()}, 20)