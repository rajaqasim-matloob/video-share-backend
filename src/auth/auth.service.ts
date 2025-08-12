import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { apiResponse } from 'src/shared/utils/response.util';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return apiResponse(true, 'User created successfully', 201, { id: user._id });
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new ConflictException('Invalid credentials');

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) throw new ConflictException('Invalid credentials');

    const payload = { sub: user._id, role: user.role };
    const token = this.jwtService.sign(payload,  {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1d',
    });

    return apiResponse(true, 'Login successful', 200, { access_token: token });
  }
}
