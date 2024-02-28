import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import path from 'path';
import 'dotenv/config';

/** 사용자 이미지 업로드
 *
 * multer , multer-s3 : 파일 업로드 모듈
 * aws-sdk : AWS 서비스 연결 모듈
 *
 */
//1. aws region 및 자격증명 설정
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});

export const s3 = new AWS.S3();

/** upload 함수 실행 시, 설정한 이름의 Bucket에 파일 업로드
 * 설정한 upload 객체를 라우터에 장착함.
 */
//2. AWS S3 multer 설정
export const upload = multer({
  /*S3 업로드 방식(메모리스토리지) : 메모리에 파일을 버퍼 형식으로 저장 후, 업로드
  req.file 또는 req.files 내 파일 데이터에 디스크스토리지 전용 속성(destination,filename,path) 대신 buffer 속성 생기며, 해당 값으로 버퍼 저장
  해당 버퍼로 S3에 업로드 → multer-s3 패키지 사용 가능
  */
  //storage: multer.memoryStorage(),
  storage: multerS3({
    s3: s3,
    //s3: new AWS.S3(), // S3 객체
    bucket: 'mybucket-s3-test99', // S3 버킷명
    acl: 'public-read', // 파일 엑세스 권한 : AllUsers그룹이 액세스 READ 권한획득
    contentType: multerS3.AUTO_CONTENT_TYPE, // multer-s3가 파일 유형을 자동으로 찾는 상수 설정
    key: function (req, file, callback) {
      // 업로드 파일이 어떤 이름으로 버킷에 저장되는가 속성
      callback(null, `imgStorage/${Date.now()}_${file.originalname}`); // 파일명: 현재시간_유저업로드파일명.이미지확장자 + imgStorage 폴더에 파일 저장
    },
  }),

  // 파일 용량 제한
  limits: { fileSize: 5 * 1024 * 1024 },

  /* 실제 하드디스크에 파일 업로드
  storage: multer.diskStorage({               // storage: 저장 공간 정보(디스크, 메모리) 
    destination: function (req, file, cb) {   // destination : 저장 경로 (요청정보, 업로드한 파일정보, 함수)
      done(null, 'uploads/');                   // upload 폴더 내 저장(S3에 반드시 존재해야함)  * done(에러 있을 경우 에러 넣기, 실제경로 또는 파일명) 
    },
    filename: function (req, file, cb) {      // filename : 저장 파일명 (파일명+날짜+확장자 형식)
      const ext = path.extname(file.originalname); // 파일 확장자
      done(null, path.basename(file.originalname,ext)+Date.now()+ext);            // 파일이름 + 날짜 + 확장자명 저장
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },      // Limits : 파일개수, 파일 사이즈 제한 → 5메가 제한 설정함
  */
});

// export const deleteImage = multer({
//   storage: multerS3({
//     s3: s3.deleteObject(),
//     bucket: 'mybucket-s3-test99', //삭제할 이미지가 존재하는 버킷명
//     key: 'imgStorage/',
//   }),
// });

/* upload 객체 변수에 미들웨어 존재 → single 미들웨어(파일 1개 업로드) 사용
   * 이미지 업로드는 특정 라우터만 사용하므로 app.use()에는 사용x 
   * 'img' : API 테스트 시 필드명 
   * upload.single('img')의 업로드 정보가 req.file 객체에, body 내용은 req.body 객체에 담김
   * single 미들웨어를 라우터 미들웨어 앞에 두면 multer 설정에 따라 파일 업로드 후, req.file 객체 생성
   * 
   * req.file 객체 예시
   *{
  fieldname: 'img',
  originalname: 'ubuntu.png',
  encoding: '7bit',
  mimetype: 'image/png',
  size: 5453,
  bucket: '{YOUR_S3_BUCKET}',
  key: 'original/1666159528777ubuntu.png',
  acl: 'private',
  contentType: 'application/octet-stream',
  contentDisposition: null,
  contentEncoding: null,
  storageClass: 'STANDARD',
  serverSideEncryption: null,
  metadata: null,
  location: 'https://{YOUR_S3_BUCKET}.s3.ap-northeast-2.amazonaws.com/original/1666159528777ubuntu.png',      ----> req.file.location : 버킷내 이미지 저장 경로 요청
  etag: '"dacb7485543f82e85fd6f54b89bb5615"',
  versionId: undefined
}
   * 
*/
