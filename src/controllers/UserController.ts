import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories/UserRepository';

class UserController{
  async create(req: Request, res: Response) {
    const {name, email} = req.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required()
    })

    /* if(!(await schema.isValid(req.body))){
      return res.status(400).json({
        error: "Validation failed!"
      })
    } */

    try {
      await schema.validate(req.body, { abortEarly: false })
    } catch (error) {
      throw new AppError(error)
    }

    const userRepository = getCustomRepository(UserRepository);

    const userAlreadyExists = await userRepository.findOne({
      email: email
    })

    if(userAlreadyExists){
      throw new AppError("User Already Exists!");
    }

    const user = userRepository.create({
      name, email
    })

    await userRepository.save(user);

    return res.status(201).json(user);
  }
}

export { UserController };