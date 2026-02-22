export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `/assets/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl });
};
