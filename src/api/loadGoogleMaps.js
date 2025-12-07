let googleApiLoaded = false;

export function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (googleApiLoaded) {
      resolve(window.google);
      return;
    }

    // If already available
    if (window.google && window.google.maps) {
      googleApiLoaded = true;
      resolve(window.google);
      return;
    }

    // Create script tag
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      googleApiLoaded = true;
      resolve(window.google);
    };

    script.onerror = reject;

    document.body.appendChild(script);
  });
}
