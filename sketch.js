let pelotaX, pelotaY;
let angulo = 0, estado = "APUNTANDO";
let velX = 0, velY = 0;
let largoMira = 75;
let potencia = 1, cargando = false;
let arqueroX; 
let posicionesArquero = []; 
let goles = 0, tirosRealizados = 0;
let tiempoInicio = 0, tiempoLimite = 15;
let mensaje = "";
let imgArquero, imgJugador;

function preload() {
  imgArquero = loadImage('arquero1.png');
  imgJugador = loadImage('jugador10.png');
}

function setup() {
  let ancho = windowWidth * 0.95;
  let alto = ancho * (2/3); 
  if (alto > windowHeight * 0.95) {
    alto = windowHeight * 0.95;
    ancho = alto * (3/2);
  }
  createCanvas(ancho, alto);
  
  arqueroX = width / 2;
  posicionesArquero = [width * 0.35, width * 0.5, width * 0.65];
  pelotaX = width / 2;
  pelotaY = height * 0.70;
  tiempoInicio = millis();
}

function draw() {
  dibujarEscenario();
  dibujarInterfaz();
  actualizarLogica();
  
  dibujarArquero();
  dibujarJugador();
  dibujarPelota(pelotaX, pelotaY);
  
  // Mensajes finales
  if (estado === "RESULTADO") {
    fill(255, 255, 0); textSize(40); textAlign(CENTER); text(mensaje, width/2, height/2);
  } else if (estado === "FIN") {
    fill(255); textSize(40); textAlign(CENTER);
    let resultadoFinal = (goles >= 3) ? "¡GANASTE!" : "PERDISTE";
    text(resultadoFinal + " (" + goles + " Goles)", width/2, height/2);
  }
}

function dibujarEscenario() {
  background(10, 30, 10);

  // Fondo superior
  noStroke();
  fill(30, 30, 30);
  rect(0, 0, width, height * 0.375);

  // Césped
  let franjas = 20;

  for (let i = 0; i < franjas; i++) {
    if (i % 2 === 0) {
      fill(40, 150, 40);
    } else {
      fill(55, 170, 55);
    }

    rect(
      i * (width / franjas),
      height * 0.375,
      width / franjas,
      height * 0.625
    );
  }

  // Líneas
  stroke(255);
  strokeWeight(4);
  noFill();

  rect(width * 0.25, height * 0.125, width * 0.5, height * 0.25);
  line(0, height * 0.375, width, height * 0.375);
}

function dibujarArquero() {
  imageMode(CENTER);
  image(imgArquero, arqueroX, height * 0.375, width * 0.12, width * 0.12);
}

function dibujarPelota(x, y) {
  push(); 
  fill(255); stroke(0); strokeWeight(2); 
  ellipse(x, y, width * 0.04, width * 0.04);
  fill(0); ellipse(x, y, width * 0.015, width * 0.015); 
  pop();
}

function dibujarJugador() {
  imageMode(CENTER);
  image(imgJugador, width / 2, height * 0.85, width * 0.15, width * 0.15);
}

function dibujarInterfaz() {
  let tiempoTranscurrido = floor((millis() - tiempoInicio) / 1000);
  let tiempoRestante = max(0, tiempoLimite - tiempoTranscurrido);
  fill(255); textSize(20); textAlign(LEFT);
  text("Goles: " + goles + " | Tiros: " + tirosRealizados + "/5", 20, 30);
  text("Tiempo: " + tiempoRestante + "s", width - 120, 30);
  fill(200); rect(width - 50, height * 0.4, 20, 140); 
  fill(255, 0, 0); rect(width - 50, height * 0.4 + 140 - (potencia-1)*70, 20, (potencia-1)*70);
}

function actualizarLogica() {
  let centroX = width / 2;
  let baseY = height * 0.70;

  if (estado === "APUNTANDO") {
    let tiempoTranscurrido = floor((millis() - tiempoInicio) / 1000);
    if (tiempoLimite - tiempoTranscurrido <= 0) { mensaje = "Fuera"; registrarTiro(); }
    if (!cargando) angulo += 0.05; else if (potencia < 3) potencia += 0.05;
    
    let swing = Math.sin(angulo) * 1.5;
    let miraX = centroX + cos(swing - PI/2) * largoMira;
    let miraY = baseY + sin(swing - PI/2) * largoMira;
    
    stroke(255); strokeWeight(4); line(centroX, baseY, miraX, miraY);
    velX = ((miraX - centroX) / 10) * potencia; velY = -5 * potencia;
  } else if (estado === "PATEANDO") {
    pelotaX += velX; pelotaY += velY;
    if (pelotaY <= height * 0.375) {
      if (pelotaX > width * 0.25 && pelotaX < width * 0.75 && abs(pelotaX - arqueroX) > (width * 0.05)) { 
        goles++; mensaje = "Gol!"; 
      } else { 
        mensaje = (pelotaX > width * 0.25 && pelotaX < width * 0.75) ? "Atajado" : "Fuera"; 
      }
      registrarTiro();
    }
  }
}

function registrarTiro() {
  estado = "RESULTADO"; tirosRealizados++;
  setTimeout(() => {
    if (tirosRealizados < 5) { 
      estado = "APUNTANDO"; 
      pelotaX = width / 2; pelotaY = height * 0.70; 
      arqueroX = width / 2; potencia = 1; tiempoInicio = millis(); 
    } else { estado = "FIN"; }
  }, 1500);
}

function mousePressed() { if (estado === "APUNTANDO") cargando = true; }
function mouseReleased() { if (cargando) { arqueroX = random(posicionesArquero); estado = "PATEANDO"; cargando = false; } }