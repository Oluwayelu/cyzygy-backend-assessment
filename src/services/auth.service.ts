import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { SECRET_KEY, CLIENT_URL } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';

import User, { IUser } from '@models/users.model';
import { isEmpty } from '@utils/util';
import { loginDto, signupDto } from '@/validator/auth.validator';

class AuthService {
  public users = User;

  public async signup(userData: signupDto['body']) {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email });
    if (findUser)
      throw new HttpException(
        409,
        `This email ${userData.email} already exists`
      );

    const hashedPassword = await hash(userData.password, 10);
    const name = `${userData.firstName} ${userData.lastName}`;
    const user = await this.users.create({
      ...userData,
      name,
      password: hashedPassword,
    });

    const newUser = await user.save();
    return newUser;
  }

  public async login(userData: loginDto['body']) {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(401, `User does not exist`);

    const isPasswordMatching: boolean = await compare(
      userData.password,
      findUser.password
    );
    if (!isPasswordMatching)
      throw new HttpException(401, 'Email/Password is incorrect');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);
    return { cookie, role: findUser.role, token: tokenData.token };
  }

  public async profile(userData: IUser) {
    const user: IUser = await this.users.findOne({ email: userData.email });
    if (!user) throw new HttpException(401, `User does not exist`);

    return user;
  }

  public async logout(userData: IUser): Promise<IUser> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: IUser = await this.users.findOne({
      email: userData.email,
      password: userData.password,
    });
    if (!findUser)
      throw new HttpException(
        409,
        `This email ${userData.email} was not found`
      );

    return findUser;
  }

  public createToken(user: IUser): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return {
      expiresIn,
      token: sign(dataStoredInToken, secretKey, { expiresIn }),
    };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
