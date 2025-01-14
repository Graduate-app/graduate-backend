import { Degree } from '../entities/degree.entity';
import { HelpingOptionsEnum } from '../enums/helping-option.enum';

export class CreateGraduandInput {
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
  phoneNumber: string;
  degree: Degree[];
  job: string;
  departamentHelping: HelpingOptionsEnum;
  profilePictureId?: number;
}
