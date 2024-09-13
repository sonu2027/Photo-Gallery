const markedFav = async (imgUrl) => {
    console.log("imgUrl is: ", imgUrl);
    
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/image/markedfav`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({imgUrl}),
      method: "POST",
    });
    console.log("Res: ", res);
    return true
    
  } catch (error) {
    console.log("error comes: ", error);
    
  }
};

export { markedFav };
