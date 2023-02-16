import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilesService } from 'src/files/files.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepository') private userRepository: typeof User,
    private fileService: FilesService,
  ) {}
  public async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });
    return users;
  }

  public async getUserById(id: string) {
    const user = await this.userRepository.findOne<User>({
      where: { id },
    });
    if (!user) {
      throw new HttpException(
        'User with given id not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne<User>({ where: { email } });
    if (!user) {
      throw new HttpException(
        'User with given id not found',
        HttpStatus.NOT_FOUND,
      );
    }
    console.log(user.id);
    return user;
  }

  private hash(text, saltRounds): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(text, saltRounds, function (err, hash) {
        if (err) reject(err);
        else resolve(hash);
      });
    });
  }

  public async saveLink(id, activationLink) {
    const user = await this.userRepository.findOne<User>({
      where: { id },
    });
    if (!user) {
      throw new HttpException(
        'Activation link error. No user',
        HttpStatus.NOT_FOUND,
      );
    }
    user.activationLink = activationLink;
    await user.save();
    return user;
  }

  public async activate(activationLink) {
    const user = await this.userRepository.findOne<User>({
      where: { activationLink: activationLink },
    });
    if (!user) {
      throw new HttpException('Activation link error', HttpStatus.NOT_FOUND);
    }
    user.isActivated = true;
    user.activationLink = null;
    await user.save();
    return user;
  }

  public async createUser(dto: CreateUserDto, image: any) {
    const saltRounds = +process.env.SALT_ROUNDS;
    const hashedPassword = await this.hash(dto.password, saltRounds);
    let fileName = null;
    if (image) {
      fileName = await this.fileService.createFile(image, 1024, 1024);
    }
    const user = await this.userRepository.create<User>({
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
      image: fileName,
    });
    return user;
  }

  public async update(id: string, updateUserDto?: UpdateUserDto, image?: any) {
    const user = await this.userRepository.findOne<User>({ where: { id } });
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }
    let fileName = null;
    if (image) {
      fileName = await this.fileService.createFile(image, 1024, 1024);
      await this.fileService.deleteFile(user.image);
    }
    user.name = updateUserDto.name || user.name;
    user.image = fileName || user.image;
    await user.save();
    return user;
  }

  public async delete(id: string) {
    const user = await this.userRepository.findByPk<User>(id);
    await this.fileService.deleteFile(user.image);
    await user.destroy();
    return user;
  }
}
