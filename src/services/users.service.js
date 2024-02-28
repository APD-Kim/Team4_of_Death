import CustomError from '../utils/errorHandler.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { s3 } from '../model/multer.js';
import 'dotenv/config';

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  signUp = async (email, password, name, phoneNumber, petCategory, profileImg) => {
    const user = await this.userRepository.findUserByEmail(email);
    if (user) {
      this.deleteImage(profileImg);
      throw new CustomError(409, '이미 가입된 이메일입니다.');
    }
    const findUser = await this.userRepository.findUserByPhoneNumber(phoneNumber);
    if (findUser) {
      this.deleteImage(profileImg);
      throw new CustomError(409, '이미 가입된 전화번호입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await this.userRepository.signUpWithEmail(
      email,
      hashedPassword,
      name,
      phoneNumber,
      petCategory,
      profileImg
    );
    return {
      userId: createdUser.createdUser.userId,
      name: createdUser.createdUser.name,
      email: createdUser.createdUser.email,
      phoneNumber: createdUser.createdUser.phoneNumber,
      role: createdUser.createdUser.role,
      isTrainer: createdUser.createdUser.isTrainer,
      petCategory: createdUser.createdUser.petCategory,
      profileImg: createdUser.createdUser.profileImg,
      pointId: createdUser.point.pointId,
      point: createdUser.point.point,
    };
  };
  validatePhoneNumber = async (phoneNumber) => {
    const regex = /^010-\d{4}-\d{4}$/;
    const validate = regex.test(phoneNumber);
    if (!validate) {
      throw new CustomError(400, '전화번호는 010-xxxx-xxxx로 구성되어야 합니다.');
    }
    return validate;
  };
  validUser = async (email, password) => {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) throw new CustomError(404, '이메일을 다시 한번 확인해주세요.');
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new CustomError(400, '비밀번호를 다시 한번 확인해주세요.');
    }
    return user;
  };

  signToken = async (userId) => {
    const token = jwt.sign({ userId: userId }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: userId }, process.env.SECRET_KEY, { expiresIn: '7d' });
    const bearerToken = `Bearer ${token}`;
    const bearerRefreshToken = `Bearer ${refreshToken}`;
    const saveRefreshToken = await this.userRepository.saveToken(bearerRefreshToken, userId);

    return {
      bearerToken,
      saveRefreshToken,
    };
  };

  /** 사용자 로그아웃 */
  removeToken = async (userId) => {
    const removeRefreshToken = await this.userRepository.removeToken(userId);

    return { removeRefreshToken };
  };

  /** 사용자 정보 조회 */
  findOneUser = async (userId) => {
    const user = await this.userRepository.findOneUser(userId);
    if (!user) {
      throw new CustomError(400, '사용자가 존재하지 않습니다.');
    }
    return {
      userId: user.user.userId,
      name: user.user.name,
      email: user.user.email,
      phoneNumber: user.user.phoneNumber,
      role: user.user.role,
      isTrainer: user.user.isTrainer,
      petCategory: user.user.petCategory,
      profileImg: user.user.profileImg,
      pointId: user.point.pointId,
      point: user.point.point,
    };
  };

  /** 사용자 정보 수정 */
  updateUser = async (userId, email, password, name, phoneNumber, petCategory, profileImg) => {
    const user = await this.userRepository.findOneUser(userId);
    let hashedPassword = '';

    if (!(await bcrypt.compare(password, user.user.password))) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    } else {
      hashedPassword = uuser.user.password;
    }

    const updateUser = await this.userRepository.updateUser(
      userId,
      email,
      hashedPassword,
      name,
      phoneNumber,
      petCategory,
      profileImg
    );
    return updateUser;
  };

  /** 사용자 정보 삭제 */
  deleteUser = async (userId) => {
    const user = await this.userRepository.deleteUser(userId);
    const profileImg = user.profileImg;

    this.deleteImage(profileImg);

    return user;
  };

  /** 사용자 이미지 삭제 */
  deleteImage = async (profileImg) => {
    if (!profileImg.includes(process.env.S3_DEFAULT_IMAGE_PATH)) {
      const delResult = await s3.deleteObject(
        {
          Bucket: process.env.S3_BUCKET,
          Key: profileImg,
        },
        function (err, data) {
          if (err) console.log(err, err.stack);
          else console.log(data);
        }
      );
    }
  };

  /** 사용자 이미지 업로드 1차 : 라우터에서 S3 사진업로드 처리 후, DB 저장 */
  uploadImage = async (userId, imageURL) => {
    const uploadImage = await this.userRepository.uploadImage(userId, imageURL);

    console.log(uploadImage);
    if (!uploadImage) {
      throw new CustomError(400, '이미지 파일 DB저장에 실패하였습니다.');
    }
    return uploadImage;
  };

  /** 사용자 이미지 업로드 2차 : 라우터없이 직접 S3 사진업로드 처리 후, DB저장 */
  // uploadImage = async (userId) => {
  //   const uploadImageName = '';
  //   const upload = multer({
  //     storage: multerS3({
  //       s3: s3,
  //       bucket: process.env.S3_BUCKET,
  //       acl: 'public-read',
  //       contentType: multerS3.AUTO_CONTENT_TYPE,
  //       key: function (req, file, callback) {
  //         uploadImageName = `imgStorage/${userId}_${file.originalname}_${Date.now()}`;
  //         callback(null, uploadImageName);
  //       },
  //     }),
  //     limits: { fileSize: 5 * 1024 * 1024 },
  //   });
  //   console.log('uploadImageName', uploadImageName);
  //   upload.single('uploadImageName');

  //   return uploadImageName;
  // };
}
