import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from 'path';
import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";
import { UserRepository } from "../repositories/UserRepository";
import SendMailService from "../services/SendMailService";

class SendMailController{
 async execute(req: Request, res: Response){
   const { email , surveyId } =  req.body;

   const userRepository = await getCustomRepository(UserRepository);
   const surveyRepository = await getCustomRepository(SurveyRepository);
   const surveyUserRepository = await getCustomRepository(SurveyUserRepository);

   const user = await userRepository.findOne({
     email
   })

   if(!user){
     return res.status(400).json({
       message: "User does not exist!"
     });
   }

   const survey = await surveyRepository.findOne({
     id: surveyId
   });

   if(!survey){
    return res.status(400).json({
      message: "Survey does not exist!"
    });
   }

   const npsPath = await resolve(__dirname, "..","views", "emails", "npsMail.hbs");

   const variables = {
     name: user.name,
     title: survey.title,
     description: survey.description,
     userId: user.id,
     link: process.env.URL_MAIL
   }

   const surveyUserAlreadyExists = await surveyUserRepository.findOne({
     where: [ { userId: user.id }, { value: null } ],
     relations: ["user", "survey"]
   })

   if(surveyUserAlreadyExists){
     await SendMailService.execute(email, survey.title, variables, npsPath);
     return res.json(surveyUserAlreadyExists)
   }

   //Salvar as informações na tabela surveys_users

   const surveyUser = surveyUserRepository.create({
     userId: user.id,
     surveyId
   });

   await surveyUserRepository.save(surveyUser);

   //Enviar email para o usuário

   await SendMailService.execute(email, survey.title, variables, npsPath);

   return res.json(surveyUser);
 }
}

export { SendMailController }