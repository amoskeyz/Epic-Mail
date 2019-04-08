import bcrypt from 'bcrypt';

class Encrypt {
  static encrypt(password) {
    return bcrypt.hashSync(password, 10);
  }

  static compare(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}


export default Encrypt;
