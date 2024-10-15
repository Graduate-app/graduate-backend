import { Test, TestingModule } from '@nestjs/testing';
import { GraduandController } from './graduand.controller';

describe('GraduandController', () => {
  let controller: GraduandController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraduandController],
    }).compile();

    controller = module.get<GraduandController>(GraduandController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
