import bcrypt from 'bcrypt';
import { User } from "../model/userModel.js";
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userId = await User.createUser(username, email, password);
    res.status(201).json({ id: userId });
  } catch (error) {
    //console.error('Error al crear el usuario:', error);
    if (error.message.includes('ya está registrado')) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.getUserByEmail(email);

    if(!user){
      return res.status(400).send({ meessage : 'El email no se encuentra registrado'})
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
      return res.status(400).send({ message: 'Contraseña incorrecta'})
    }

    const token = await jwt.sign(
      {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '1h'
      }
    )

    res.cookie(
      'access_token', 
      token, 
      {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60
      }
    )
    .status(200)
    .send({ message: 'logeado correctamente!'})
  } catch (error) {
    console.error('Error al logear el usuario:', error)
    res.status(500).json({message: 'Error al ingresar'})
  }
}