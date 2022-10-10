export interface AcademicFormationGetResponseDto {
  id?: number;
  institutionName: string;
  academicFormationType: AcademicFormationType;
  description: string;
  startDate: Date;
  endDate: Date;
}

export enum AcademicFormationType {
  BACHELOR_DEGREE,
  TECHNICAL_DEGREE,
  SCHOOL,
  HIGH_SCHOOL,
}
