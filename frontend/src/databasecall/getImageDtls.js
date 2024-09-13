const getImageDtls = async (imgUrl) => {
  console.log("imgUrl is: ", imgUrl);

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/image/getimagedtls`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imgUrl }),
      method: "POST",
    });
    const data=await res.json()
    console.log("data: ", data.response);
    return data.response
  } catch (error) {}
};

export { getImageDtls };
