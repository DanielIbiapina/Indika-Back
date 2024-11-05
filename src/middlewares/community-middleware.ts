import { Request, Response, NextFunction } from "express";
import { CommunityRepository } from "../repositories/community-repository";

const communityRepository = new CommunityRepository();

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const userId = req.user.id;

  const community = await communityRepository.findById(id);

  if (!community) {
    return res.status(404).json({ message: "Comunidade não encontrada" });
  }

  const isAdmin = community.admins.some((admin) => admin.id === userId);

  if (!isAdmin) {
    return res.status(403).json({ message: "Sem permissão para esta ação" });
  }

  next();
};
