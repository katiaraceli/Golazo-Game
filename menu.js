// menu.js

function dibujarMenu() {
  background(10, 30, 10);
  
  fill(255);
  textSize(42);
  textAlign(CENTER, CENTER);
  text("¡GOLAZO!", width / 2, height * 0.35);
  
  textSize(20);
  fill(200);
  text("Haz clic en el botón para comenzar", width / 2, height * 0.45);
  
  let btnAncho = 200;
  let btnAlto = 60;
  let btnX = width / 2 - btnAncho / 2;
  let btnY = height * 0.55;
  
  if (mouseX > btnX && mouseX < btnX + btnAncho && mouseY > btnY && mouseY < btnY + btnAlto) {
    fill(0, 200, 100);
  } else {
    fill(0, 150, 70);
  }
  
  noStroke();
  rect(btnX, btnY, btnAncho, btnAlto, 10);
  
  fill(255);
  textSize(24);
  text("JUGAR", width / 2, btnY + btnAlto / 2);
}

function manejarClicMenu() {
  if (estado === "MENU") {
    let btnAncho = 200;
    let btnAlto = 60;
    let btnX = width / 2 - btnAncho / 2;
    let btnY = height * 0.55;
    
    if (mouseX > btnX && mouseX < btnX + btnAncho && mouseY > btnY && mouseY < btnY + btnAlto) {
      estado = "APUNTANDO";
      tiempoInicio = millis();
    }
  }
}