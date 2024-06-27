import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { OffsetDto } from './dto/offset.dto';
import { CursorDto } from './dto/cursor.dto';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: DatabaseService) {}

  async findById(id: number) {
    return this.prisma.admin.findUnique({
      where: { id: id },
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.admin.findUnique({
      where: { phone: phone },
    });
  }

  async create(adminData: Prisma.AdminCreateInput) {
    return this.prisma.admin.create({
      data: adminData,
    });
  }

  async update(id: number, updateAdminData: Prisma.AdminUpdateInput) {
    return this.prisma.admin.update({
      where: { id: id },
      data: updateAdminData,
    });
  }

  // *** This is Offset-based Pagination ***

  async findByOffset(offsetDto: OffsetDto) {
    const page = +offsetDto.page || 1;
    const limit = +offsetDto.limit || 10;

    const offset = (page - 1) * limit;
    const filters = { status: 'active' };
    const fields = {
      id: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      lastLogin: true,
      profile: true,
      createdAt: true,
    };
    // const relation = {};

    const count = await this.prisma.admin.count({ where: filters });
    const results = await this.prisma.admin.findMany({
      skip: offset,
      take: limit,
      where: filters,
      orderBy: { createdAt: 'desc' },
      select: fields,
      // include: relation,
    });

    return {
      total: count,
      data: results,
      currentPage: page,
      previousPage: page == 1 ? null : page - 1,
      nextPage: page * limit >= count ? null : page + 1,
      lastPage: Math.ceil(count / limit),
      countPerPage: limit,
    };
  }

  // Unless you need to count, here it should be like this!

  // const results = await this.prisma.admin.findMany({ ..., take: limit + 1, ... });
  // let hasNextPage = false;
  // if (results.length > limit) {
  //   hasNextPage = true;
  //   results.pop();
  // }
  // return {
  //   data: results,
  //   currentPage: page,
  //   previousPage: page == 1 ? null : page - 1,
  //   nextPage: hasNextPage ? page + 1 : null,
  //   countPerPage: limit,
  // };

  async findByCursor(cursorDto: CursorDto) {
    const cursor = cursorDto.cursor ? { id: +cursorDto.cursor } : null;
    const limit = +cursorDto.limit || 4; // Be aware of error overtaking db rows

    const filters = { status: 'active' };
    const fields = {
      id: true,
      name: true,
      phone: true,
      role: true,
      status: true,
      lastLogin: true,
      profile: true,
      createdAt: true,
    };
    // const relation = {};

    const options = { take: limit } as any;
    if (cursor) {
      options.skip = 1;
      options.cursor = cursor;
    }
    options.where = filters;
    options.orderBy = { id: 'asc' };
    options.select = fields;
    // if (relation) {
    //   options.include = relation;
    // }

    const results = await this.prisma.admin.findMany(options);

    const lastPostInResults = results.length ? results[limit - 1] : null; // Remember: zero-based index! :)
    const myCursor = results.length ? lastPostInResults.id : null;

    return {
      data: results,
      nextCursor: myCursor,
    };
  }
}
