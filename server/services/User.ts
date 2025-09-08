import User from "../model/User";

export const createNewUser = async (
  firstname: string,
  lastname: string,
  email: string,
  phone_no: string,
  password: string,
  middlename?: string
) => {
  try {
    const newUser = await User.create({
      firstname,
      lastname,
      middlename,
      email,
      phone_no,
      password,
    });
    return newUser;
  } catch (err: any) {
    throw err;
  }
};

export const getUserById = async (id: string) => {
  try {
    const foundUser = await User.findById(id);
    return foundUser;
  } catch (err: any) {
    throw err;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const foundUser = await User.findOne({ email });
    return foundUser;
  } catch (err: any) {
    throw err;
  }
};
