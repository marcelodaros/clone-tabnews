function status(request, response) {
  response.status(200).json({ message: "Testando a api com Açentos ão!" });
}

export default status;
