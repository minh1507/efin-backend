interface IGlobal {
  ['CONFIG.DOMAIN']: string;
  ['CONFIG.PORT']: string;
  ['DATABASE.HOST']: string;
  ['DATABASE.NAME']: string;
  ['DATABASE.PASSWORD']: string;
  ['DATABASE.PORT']: string;
  ['DATABASE.USER']: string;
  ['SWAGGER.DESCRIPTION']: string;
  ['SWAGGER.PASSWORD']: string;
  ['SWAGGER.STATUS']: string;
  ['SWAGGER.TITLE']: string;
  ['SWAGGER.USER']: string;
  ['MINIO.ACCESS_KEY']: string;
  ['MINIO.BUCKET']: string;
  ['MINIO.END_POINT']: string;
  ['MINIO.PORT']: string;
  ['MINIO.SECRET_KEY']: string;
  ['TOKEN.SECRET.KEY']: string;
  ['TOKEN.ACCESS.KEY.EXPIRED']: string;
  ['TOKEN.REFRESH.KEY.EXPIRED']: string;
  ['REDIS.HOST']: string;
  ['REDIS.PORT']: string;
}

export default IGlobal;
