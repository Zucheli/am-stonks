import { SkillGetResponseDto } from "./skill-get-response-dto";

export interface TestDto {
    id: number;
    title: string;
    skill: SkillGetResponseDto;
}