import { User } from "../model/userModel.js";

export const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userId = await User.createUser(username, email, password);
    res.status(201).json({ id: userId });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};