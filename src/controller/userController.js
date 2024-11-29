import { User } from "../model/userModel.js";

export const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userId = await User.createUser(username, email, password);
    res.status(201).json({ id: userId });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(400).json({ message: 'Error al crear el usuario' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.getUserByEmail(email);

    if(!user){
      return res.status(400).send({ meessage : 'El email no se encuentra registrado'})
    }

    if(user.password != password){
      return res.status(400).send({ message: 'Contraseña incorrecta'})
    }

    res.status(200).send({ message: 'logeado correctamente!'})
  } catch (error) {
    console.error('Error al logear el usuario:', error)
    res.status(500).json({message: 'Error al ingresar'})
  }
}