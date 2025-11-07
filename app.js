// Referencias a elementos del DOM
const openCameraBtn = document.getElementById('openCamera');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// NUEVAS REFERENCIAS DE LA TAREA
const galleryContainer = document.getElementById('galleryContainer');
const clearGalleryBtn = document.getElementById('clearGallery');

let stream = null;

// Abrir la cámara
async function openCamera() {
    try {
        // Configuramos la cámara para usar la trasera ('environment') con un tamaño ideal
        const constraints = {
            video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 320 },
                height: { ideal: 240 }
            }
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;

        // Mostrar el contenedor de la cámara
        cameraContainer.style.display = 'block';
        openCameraBtn.textContent = 'Cámara Abierta';
        openCameraBtn.disabled = true;
        takePhotoBtn.disabled = false; // Habilitar el botón de tomar foto

        console.log('Cámara abierta correctamente');
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        // Usamos un simple mensaje de texto en lugar de alert()
        console.log('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
        openCameraBtn.disabled = false;
        takePhotoBtn.disabled = true;
    }
}

// Tomar foto (MODIFICADA)
function takePhoto() {
    if (!stream) {
        // En lugar de alert, usamos un mensaje en consola/log
        console.log('Primero debes abrir la cámara'); 
        return;
    }

    // 1. Igualar dimensiones del canvas al tamaño real del video para no distorsionar
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 2. Dibujar el frame de video actual en el canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 3. Obtener la imagen codificada en Data URL (PNG)
    const imageDataURL = canvas.toDataURL('image/png');
    console.log('Foto capturada correctamente');

    // 4. Crear el elemento de imagen y añadirlo a la galería
    const newImage = document.createElement('img');
    newImage.src = imageDataURL;
    newImage.alt = `Foto capturada - ${new Date().toLocaleTimeString()}`;

    // Agrega la nueva imagen al inicio de la galería (última foto a la izquierda)
    galleryContainer.prepend(newImage); 

    // Opcional: desplaza el scroll al inicio para ver la foto recién agregada
    galleryContainer.scrollLeft = 0; 

    // 5. Cerrar la cámara inmediatamente
    closeCamera();
}

// Cerrar cámara
function closeCamera() {
    if (stream) {
        // Detener cada track (video, audio, etc.) del stream
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;

        // Restablecer el estado de la interfaz
        cameraContainer.style.display = 'none';
        openCameraBtn.textContent = 'Abrir Cámara';
        openCameraBtn.disabled = false;
        takePhotoBtn.disabled = true;

        console.log('Cámara cerrada');
    }
}

// NUEVA FUNCIONALIDAD: Limpiar galería
function clearGallery() {
    // Elimina todos los elementos hijos (las imágenes) del contenedor
    galleryContainer.innerHTML = ''; 
    console.log('Galería temporal limpiada');
}

// Eventos
openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);
window.addEventListener('beforeunload', closeCamera); // Asegura que la cámara se cierre al salir

// NUEVO EVENTO
clearGalleryBtn.addEventListener('click', clearGallery);