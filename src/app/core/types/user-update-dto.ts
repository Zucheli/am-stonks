import { AcademicFormationGetResponseDto } from "./academic-formation-dto";
import { JobExperienceGetResponseDto } from "./job-experience-get-response";
import { RoleDto } from "./role-dto";
import { SkillGetResponseDto } from "./skill-get-response-dto";
import { TestDto } from "./test-dto";
import { UserDto } from "./user-dto";

export interface UserUpdateDto extends UserDto {   
    role?: RoleDto;
    photo?: string;
    jobExperiences?: JobExperienceGetResponseDto[];
    skills?: SkillGetResponseDto[];
    academicFormation?: AcademicFormationGetResponseDto[];
    tests?: TestDto[];
}