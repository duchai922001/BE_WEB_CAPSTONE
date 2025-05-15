import { Injectable } from "@nestjs/common";
import { VariableRepository } from "../variables/variable.repository";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService{
    constructor(
        private readonly variableRepository: VariableRepository,
        private readonly userRepository: UserRepository,
    ){}
    
}