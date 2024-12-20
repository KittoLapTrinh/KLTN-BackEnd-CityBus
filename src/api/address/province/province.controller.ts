import { RoleEnum } from './../../../enums/roles.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProvinceService } from './province.service';
import {
  CurrentUser,
  GetPagination,
  Pagination,
  Roles,
} from './../../../decorator';
import { JwtAuthGuard } from './../../../auth/guards';
import {
  FilterProvinceDto,
  ProvinceDeleteMultiCode,
  SaveProvinceDto,
  UpdateProvinceDto,
  ProvinceDeleteMultiId,
} from './dto';
import axios from 'axios';

@Controller('province')
@ApiTags('Province')
export class ProvinceController {
  constructor(private provinceService: ProvinceService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() dto: FilterProvinceDto,
    @GetPagination() pagination?: Pagination,
  ) {
    return this.provinceService.findAll(dto, pagination);
  }

  @Get('id/:id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    return this.provinceService.findOneById(id);
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  async findOneByCode(@Param('code') code: number) {
    return this.provinceService.findOneByCode(code);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() dto: SaveProvinceDto, @CurrentUser() user) {
    return this.provinceService.createProvince(dto, user.id);
  }

  @Patch('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateById(
    @Param('id') id: string,
    @Body() dto: UpdateProvinceDto,
    @CurrentUser() user,
  ) {
    return this.provinceService.updateById(id, dto, user.id);
  }

  @Patch('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateByCode(
    @Param('code') code: number,
    @Body() dto: UpdateProvinceDto,
    @CurrentUser() user,
  ) {
    return this.provinceService.updateByCode(code, dto, user.id);
  }

  @Delete('code/:code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteByCode(@Param('code') code: number, @CurrentUser() user) {
    return this.provinceService.deleteByCode(code, user.id);
  }

  @Delete('id/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteById(@Param('id') id: string, @CurrentUser() user) {
    return this.provinceService.deleteById(id, user.id);
  }

  @Delete('multiple/id')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleId(
    @CurrentUser() user,
    @Body() dto: ProvinceDeleteMultiId,
  ) {
    return await this.provinceService.deleteMultipleProvinceById(user.id, dto);
  }

  @Delete('multiple/code')
  @HttpCode(HttpStatus.OK)
  @Roles(RoleEnum.STAFF)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteMultipleCode(
    @CurrentUser() user,
    @Body() dto: ProvinceDeleteMultiCode,
  ) {
    return await this.provinceService.deleteMultipleProvinceByCode(
      user.id,
      dto,
    );
  }

  @Get('/crawl')
  @HttpCode(HttpStatus.OK)
  async crawlData() {
    const url = 'https://provinces.open-api.vn/api/p/';
    const data = await axios.get(url);
    data.data.forEach(async (element) => {
      const { codename, code, division_type, name } = element;
      console.log(codename, code);

      const dto: SaveProvinceDto = {
        name: name,
        codename: codename,
        code: code,
        type: division_type,
      };
      await this.provinceService.createProvince(
        dto,
        '4af43f97-b4c7-452f-8ece-bcdf00b57acb',
      );
    });

    return { demo: 'hello' };
  }
}
