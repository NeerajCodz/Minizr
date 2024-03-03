const trimUrl = (url) => {
    const maxLength = 15;
    if (url.length > maxLength) {
      return url.substring(0, maxLength) + "...";
    }
    return url;
  };
  
  export default trimUrl;
  