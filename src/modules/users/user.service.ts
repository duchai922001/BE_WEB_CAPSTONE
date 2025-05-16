import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./dtos/create.dto";
import { User } from "./user.entity";

@Injectable()
export class UserService{
    constructor(
        private readonly userRepository: UserRepository,
    ){}
    
    async create(data: CreateUserDto): Promise<User>{
        const{
            phone,
            password,
            fullName,
            email,
            avatar,
            status,
        } = data;
        const existingUser = await this.userRepository.findByPhoneOrEmail(phone, email)
        if(existingUser){
            throw new BadRequestException('Account already exists');
        }
        const newUser = await this.userRepository.create({
            phone, password, fullName, email, avatar, status
        });
        return newUser
    }
}