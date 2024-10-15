import { Degree } from '../entities/degree.entity';
import { HelpingOptionsEnum } from '../enums/helping-option.enum';
import { MajorEnum } from '../enums/major.enum';

export class CreateGraduandInput {
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
  phoneNumber: string;
  degree: Degree[];
  major: MajorEnum;
  job: string;
  departamentHelping: HelpingOptionsEnum;
  profilePictureId?: number;
}
