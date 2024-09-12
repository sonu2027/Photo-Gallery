fetch("https://photogallerybackend.vercel.app/image")
  .then((photos) => {
    return photos.json();
  })
  .then((photos) => {
    console.log("photos: ", photos);
  })
  .catch((error) => {
    console.log("error: ", error);
  });
