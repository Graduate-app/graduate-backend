import { Test, TestingModule } from '@nestjs/testing';
import { GraduandService } from './graduand.service';

describe('GraduandService', () => {
  let service: GraduandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraduandService],
    }).compile();

    service = module.get<GraduandService>(GraduandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
