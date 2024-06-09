import bcrypt from 'bcrypt';

const salt = 10

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (hashedPassword: string, password: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};