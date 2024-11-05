import { CommunityRepository } from "../repositories/community-repository";

export class CommunityService {
  private communityRepository: CommunityRepository;

  constructor() {
    this.communityRepository = new CommunityRepository();
  }

  public async list(params: {
    page: number;
    limit: number;
    category?: string;
  }) {
    const skip = (params.page - 1) * params.limit;
    return this.communityRepository.findMany({
      skip,
      take: params.limit,
      where: params.category
        ? {
            categories: {
              has: params.category,
            },
          }
        : undefined,
    });
  }

  public async create(data: {
    name: string;
    description: string;
    image?: string;
    categories: string[];
    isPrivate: boolean;
    creatorId: string;
  }) {
    const community = await this.communityRepository.create({
      ...data,
      members: {
        connect: [{ id: data.creatorId }],
      },
      admins: {
        connect: [{ id: data.creatorId }],
      },
    });

    return community;
  }

  public async join(communityId: string, userId: string) {
    const community = await this.communityRepository.findById(communityId);

    if (!community) {
      throw new Error("Comunidade não encontrada");
    }

    if (community.isPrivate) {
      throw new Error("Esta comunidade é privada");
    }

    return this.communityRepository.addMember(communityId, userId);
  }

  // ... outros métodos do service
}
