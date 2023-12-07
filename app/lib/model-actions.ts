export async function getTexCode(image: any) {
    try {
      const formData = new FormData();
      formData.append('file', image);
      const data = await fetch("http://127.0.0.1:5000/api", {
        method: "POST",
        body: JSON.stringify({ image: formData })
      });
      const res = await data.json();
      const code: string = res.message;
      console.log(res)
      return code;
    } catch (error) {
      console.log(error)
      return "Could not receive message from server."
    }
}