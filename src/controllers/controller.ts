import { Request, Response, Router } from "express";
import validate from "../utility/validator";
import getResponse from "../services/service";

const router = Router();

const getContact = async (req: Request, res: Response): Promise<void> => {
  const request = req.body;
  const validateResponse = validate(request);
  if (!validateResponse.isValid) {
    res.status(500).json({ message: validateResponse.message });
  }
  res.status(200).json({ contact: await getResponse(validateResponse.request) });
};

router.post("/identify", getContact);

export default router;
