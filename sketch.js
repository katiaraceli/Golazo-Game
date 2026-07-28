let pelotaX, pelotaY;
let angulo = 0, estado = "MENU";
let velX = 0, velY = 0;
let largoMira = 75;
let potencia = 1, cargando = false;
let arqueroX; 
let posicionesArquero = []; 
let goles = 0, tirosRealizados = 0;
let tiempoInicio = 0, tiempoLimite = 15;
let mensaje = "";
let imgArquero, imgJugador;
let imgTribuna;

function preload() {
  imgArquero = loadImage('arquero1.png');
  imgJugador = loadImage('jugador10.png');
  imgTribuna = loadImage('tribuna.png'); 
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
  if (estado === "MENU") {
    dibujarMenu();
  } else {
    dibujarEscenario();
    dibujarInterfaz();
    actualizarLogica();
    
    dibujarArquero();
    dibujarJugador();
    dibujarPelota(pelotaX, pelotaY);

    if (estado === "RESULTADO") {
      fill(255, 255, 0); textSize(40); textAlign(CENTER, CENTER); text(mensaje, width/2, height/2);
    } else if (estado === "FIN") {
      fill(255); textSize(40); textAlign(CENTER, CENTER);
      let resultadoFinal = (goles >= 3) ? "¡GANASTE!" : "PERDISTE";
      text(resultadoFinal + " (" + goles + " Goles)", width/2, height/2);
    }
  } // <--- Esta llave era la que faltaba cerrar bien el "else"
}

function dibujarEscenario() {
  background(30, 70, 30);

  // Tribuna
  imageMode(CORNER);
  image(imgTribuna, 0, 0, width, height * 0.375);

  // Césped
  noStroke();
  let franjas = 20;

  for (let i = 0; i < franjas; i++) {
    fill(i % 2 === 0 ? color(40, 150, 40) : color(55, 170, 55));
    rect(
      i * (width / franjas),
      height * 0.375,
      width / franjas,
      height * 0.625
    );
  }

  // Línea superior
  stroke(255);
  strokeWeight(4);
  line(0, height * 0.375, width, height * 0.375);

dibujarArco(); // <--- Agrega esta línea al final de dibujarEscenario
}


function dibujarArco() {
  // Configuración de estilo para el arco
  noFill();
  stroke(255); // Color blanco
  strokeWeight(6); // Línea gruesa

  // 1. El poste izquierdo (vertical)
  // x: 25% del ancho, y: justo en la línea de meta hasta más arriba
  line(width * 0.25, height * 0.375, width * 0.25, height * 0.15);

  // 2. El poste derecho (vertical)
  // x: 75% del ancho, y: justo en la línea de meta hasta más arriba
  line(width * 0.75, height * 0.375, width * 0.75, height * 0.15);

  // 3. El travesaño superior (horizontal)
  // Conecta la parte superior de ambos postes
  line(width * 0.25, height * 0.15, width * 0.75, height * 0.15);

  // 4. El área chica (un rectángulo debajo de la línea de meta)
  // x: 35% del ancho, y: línea de meta, ancho: 30% del canvas, alto: 10%
  strokeWeight(4); // Línea un poco más fina para el área
  rect(width * 0.35, height * 0.375, width * 0.30, height * 0.10);
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
  
  fill(255); 
  textSize(16); // Un poquito más chico para que entre cómodo en la pantalla
  
  // Goles y Tiros centrados en la parte izquierda/centro de la pantalla de la tribuna
  textAlign(LEFT, CENTER);
  text("Goles: " + goles + " | Tiros: " + tirosRealizados + "/5", width * 0.38, height * 0.18);
  
  // Tiempo ubicado en la parte derecha de la pantalla de la tribuna
  textAlign(RIGHT, CENTER);
  text("Tiempo: " + tiempoRestante + "s", width * 0.62, height * 0.18);
  
  // Barra de potencia (esta la dejamos intacta a la derecha de la cancha)
  fill(200); 
  rect(width - 50, height * 0.4, 20, 140); 
  fill(255, 0, 0); 
  rect(width - 50, height * 0.4 + 140 - (potencia-1)*70, 20, (potencia-1)*70);
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

function mousePressed() {
  if (estado === "MENU") {
    manejarClicMenu(); // Esto llama al archivo menu.js para que arranque el juego
  } else if (estado === "APUNTANDO") {
    cargando = true;
  }
}

function mouseReleased() { 
  if (cargando) { 
    arqueroX = random(posicionesArquero); 
    estado = "PATEANDO"; 
    cargando = false; 
  } 
}