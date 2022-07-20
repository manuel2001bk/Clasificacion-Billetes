let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let snap = document.getElementById("snap");
let errorMsgElement = document.querySelector('span#errorMsg');
let categorias = ['100', '20', '200', '50',"500"];


let modelo = null;
(async () => {
  console.log("Cargando modelo...");
  modelo = await tf.loadLayersModel("./Modelo/model.json");
  console.log("Modelo cargado");
  snap.disabled = false;
})();


function predecir() {
  if (modelo != null) {
    const img = tf.browser.fromPixels(canvas);
    console.log(img);
    const imgReshaped = img.reshape([1, 150, 200, 3]);
    const output = modelo.predict(imgReshaped);
    const outputArray = output.dataSync();
    console.log(outputArray);
    const outputIndex = outputArray.indexOf(Math.max(...outputArray));
    console.log(outputIndex);
    let salida = document.getElementById("salida_billete");
    salida.innerHTML = categorias[outputIndex];
  }
}


const constraints = {
  audio: false,
  video: {
    width: 600, height: 400
  }
};

// Access webcam
async function init() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    alert("No se pudo utilizar la camara :(");
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

// Success
function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}

// Load init
init();

// Draw image
let context = canvas.getContext('2d');

snap.addEventListener("click", function () {
  context.drawImage(video, 0, 0, 200, 150);
  predecir();
});