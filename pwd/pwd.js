if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js") 
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}


//handling before install prompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show your custom install button
  document.getElementById('installBtn').style.display = 'block';

  document.getElementById('installBtn').addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      console.log(choice.outcome);
      deferredPrompt = null;
    });
  });
});


