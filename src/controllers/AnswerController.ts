import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class AnswerController{
  
  // http://localhost:3001/answers/4?u=03444a5f-7aa6-4359-9fd3-951d7c27fadc
  
  async execute(req: Request, res: Response){
    const { value } = req.params;
    const { u } = req.query;

    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await surveyUserRepository.findOne({
      id: String(u)
    })

    if(!surveyUser){
      throw new AppError("Survey does not exist!");
    }

    surveyUser.value = Number(value);

    await surveyUserRepository.save(surveyUser);

    return res.json(surveyUser);

  }
}

export { AnswerController }