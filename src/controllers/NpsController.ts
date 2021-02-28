import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull} from "typeorm";
import { SurveyUserRepository } from "../repositories/SurveyUserRepository";

class NpsController{
  async execute(req: Request, res: Response){
    const { surveyId } = req.params;
    const surveyUserRepository = getCustomRepository(SurveyUserRepository);

    const surveyUser = await surveyUserRepository.find({
      surveyId,
      value: Not(IsNull())
    })

    const detractors = surveyUser.filter(
      survey => survey.value >= 0 && survey.value <= 6 
    ).length; 

    const promoters = surveyUser.filter(
      survey => survey.value >= 9 && survey.value <= 10
    ).length;

    const passives = surveyUser.filter(
      survey => survey.value >= 7 && survey.value <= 8
    ).length;

    const totalAnswers = surveyUser.length;
    
    const calculate = Number(((( promoters - detractors ) / totalAnswers) * 100).toFixed(2));

    let message = "";

    const goalNps = Number(process.env.GOAL_NPS);

    if(calculate >= goalNps){
      let limit = calculate;
      let i = 1;
      for(i; limit >= goalNps; i++){
        limit = Number(((( promoters - detractors - i ) / totalAnswers) * 100).toFixed(2));
      }
      limit = calculate;
      let j = 1;
      for(j; limit >= goalNps; i++){
        limit = Number(((( promoters - detractors) / (totalAnswers + j)) * 100).toFixed(2));
      }
      message = "Muito bom, estamos dentro da meta, mas cuidado,"
                + "mais " + i + "respostas defratoras ou" + j + 
                "respostas passivas nos retirarão da meta desejada";
    } else {
      const goalPromoter = Math.ceil(Number(((goalNps/100)*totalAnswers) + detractors));
      message = "Ainda não chegamos lá, mas mais "
                 + (goalPromoter - promoters) + 
                " respostas promotoras e conseguiremos!";
    }

    return res.json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      nps: calculate,
      message
    })
    
  }
}

export { NpsController }