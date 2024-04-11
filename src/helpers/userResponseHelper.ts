import { UserResponseDto } from '../use_cases/dtos/users/CreateUserDto';

const formatUserResponse = (data: UserResponseDto | UserResponseDto[]) => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      _id: item._id,
      username: item.username,
      email: item.email,
      role: item.role.name,
    }));
  }

  return {
    _id: data._id,
    username: data.username,
    email: data.email,
    role: data.role.name,
  };
};

export default formatUserResponse;
