const trimUrl = (url) => {
  let maxLength;

  // Set max length based on screen size
  if (window.innerWidth > 1024) { // Laptop
      maxLength = 30;
  } else if (window.innerWidth > 600) { // Tablet
      maxLength = 20;
  } else { // Phone
      maxLength = 15;
  }

  if (url.length > maxLength) {
    return url.substring(0, maxLength) + "...";
  }
  return url;
};

export default trimUrl;
