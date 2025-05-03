import { hash } from 'bcryptjs';
import User, { IUser } from '@/models/users.model';
import { HttpException } from '@/exceptions/HttpException';
import { addUserDto, updateUserDto } from '@/validator/user.validator';
import { dummyUsers } from '@/utils/constants';

class UserService {
  public users = User;

  public async addUser(userData: IUser, body: addUserDto['body']) {
    if (userData.role !== 'admin')
      throw new HttpException(401, 'Unauthorized to perform this operation');

    const findUser = await this.users.findOne({ email: userData.email });
    if (findUser)
      throw new HttpException(409, `This email ${body.email} already exists`);

    const hashedPassword = await hash(body.lastName.toLowerCase(), 10);
    const name = `${body.firstName} ${body.lastName}`;
    const user = await this.users.create({
      ...body,
      name,
      password: hashedPassword,
    });

    const newUser = await user.save();
    return newUser;
  }

  public async getUsers(userData: IUser) {
    if (userData.role !== 'admin')
      throw new HttpException(401, 'Unauthorized to perform this operation');

    const users = await this.users.find({});
    return users;
  }

  public async getUser(userData: IUser, userId: string) {
    if (userData.role !== 'admin')
      throw new HttpException(401, 'Unauthorized to perform this operation');

    const user = await this.users.findById(userId);

    if (!user) throw new HttpException(400, 'User does not exist');
    return user;
  }

  public async updateUser(
    userData: IUser,
    userId: string,
    body: updateUserDto['body']
  ) {
    if (userData.role !== 'admin')
      throw new HttpException(401, 'Unauthorized to perform this operation');

    const user = await this.users.findById(userId);

    if (!user) throw new HttpException(400, 'User does not exist');

    user.name =
      body.firstName || body.lastName
        ? `${body.firstName} ${body.lastName}`
        : user.name;
    user.role = body.role || user.role;
    return user;
  }

  public async deleteUser(userData: IUser, userId: string) {
    if (userData.role !== 'admin')
      throw new HttpException(401, 'Unauthorized to perform this operation');

    const user = await this.users.findByIdAndDelete(userId);

    if (!user) throw new HttpException(400, 'An error occured deleting user');
    return user;
  }

  public async seedUsers() {
    if (!Array.isArray(dummyUsers)) {
      throw new HttpException(400, 'Request body must be an array of users');
    }

    const hashedUsers = await Promise.all(
      dummyUsers.map(async (user) => {
        const hashedPassword = await hash(user.lastName.toLowerCase(), 10);
        const name = `${user.firstName} ${user.lastName}`;
        return { ...user, name, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    return createdUsers;
  }

  public async deleteAllUsers(userData: IUser) {
    if (userData.role !== 'admin') {
      throw new HttpException(401, 'Unauthorized to perform this operation');
    }

    const result = await this.users.deleteMany({});
    if (result.deletedCount === 0) {
      throw new HttpException(400, 'No users found to delete');
    }

    return { message: `${result.deletedCount} users deleted successfully` };
  }
}

export default UserService;
