import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './organization.entity';
import { Repository } from 'typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { User } from '../users/user.entity';
import { S3Service } from 'src/providers/s3/s3.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { OrganizationDto } from './dto/organization.dto';
import { PaginationResponseDto } from '../common/dto/pagination.response.dto';
import { Place } from '../places/place.entity';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {

    constructor(
        @InjectRepository(Organization) private readonly organizationRepository: Repository<Organization>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Place) private readonly placeRepository: Repository<Place>,
        private readonly s3Service: S3Service
    ) { }

    async getOrganizations(pagination: PaginationDto): Promise<PaginationResponseDto<OrganizationDto>> {
        try {
            const limit = pagination.limit ?? 10
            const page = pagination.page ?? 0

            const [organizations, total] = await this.organizationRepository.findAndCount({
                skip: limit * page,
                take: limit,
                relations: ['employees', 'place'],
                order: {
                    "created": 'desc'
                }
            })

            const totalPages = Math.ceil(total / limit)

            const organizationDto = await Promise.all(
                organizations.map(async (organization) => {
                    const logoImageKey = organization.logo;
                    let logoImageUrl: string | null = null;

                    if (logoImageKey) {
                        logoImageUrl = await this.s3Service.getPresignedUrl(logoImageKey, 'logo.jpg');
                    }
                    return new OrganizationDto({
                        id: organization.id,
                        name: organization.name,
                        logo: logoImageUrl,
                        placeId: organization.place?.id ?? undefined,
                        userId: organization.employees[0].id,
                        created: organization.created
                    })
                })
            )

            return {
                data: organizationDto,
                total,
                page: Math.floor(page / limit) + 1,
                limit,
                totalPages
            }
        } catch (error) {
            console.log(error)
            throw error
        }

    }

    async getOrganizationById(id: string): Promise<OrganizationDto> {
        const organization = await this.organizationRepository.findOne({
            where: { id },
            relations: ['employees', 'place'],
        });
        const logoImageKey = organization.logo;
        let logoImageUrl: string | null = null;

        if (logoImageKey) {
            logoImageUrl = await this.s3Service.getPresignedUrl(logoImageKey, 'logo.jpg');
        }

        return new OrganizationDto({
            id: organization.id,
            name: organization.name,
            logo: logoImageUrl,
            placeId: organization.place?.id ?? undefined,
            userId: organization.employees[0].id,
            created: organization.created
        })
    }

    async updateOrganization(id: string, dto: UpdateOrganizationDto) {
        try {
            const organization = await this.organizationRepository.findOne({
                where: { id },
                relations: ['employees', 'place'],
            });

            if (!organization) {
                throw new NotFoundException("Organization not found");
            }

            const place = await this.placeRepository.findOneByOrFail({ id: dto.placeId })
            organization.place = place
            Object.assign(organization, dto);
            await this.organizationRepository.save(organization);
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    async createOrganization(dto: CreateOrganizationDto) {
        try {
            const user = await this.userRepository.findOneByOrFail({ id: dto.userId })
            const place = await this.placeRepository.findOneByOrFail({ id: dto.placeId })
            const newOrganization = await this.organizationRepository.create({
                name: dto.name,
                employees: [user],
                place
            })
            await this.organizationRepository.save(newOrganization)
        } catch (e) {
            throw e
        }
    }

    async updateLogo(
        file: Express.Multer.File,
        organizationId: string
    ) {
        const result = await this.s3Service.upload(file)
        await this.organizationRepository.update({
            id: organizationId,
        }, {
            logo: result.Key
        })
    }

}
