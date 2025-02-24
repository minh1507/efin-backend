import { Ethnic } from 'src/module/v1/stc/category/ethnic/ethnic.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class EthnicSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Ethnic);

    await repository.clear();

    await repository.save([
      ETHNIC_KINH,
      ETHNIC_TAY,
      ETHNIC_THAI,
      ETHNIC_HOA,
      ETHNIC_KHO_ME,
      ETHNIC_MUONG,
      ETHNIC_NUNG,
      ETHNIC_HMONG,
      ETHNIC_DAO,
      ETHNIC_GIA_RAI,
      ETHNIC_NGAI,
      ETHNIC_E_DE,
      ETHNIC_BA_NA,
      ETHNIC_XO_DANG,
      ETHNIC_SAN_CHAY,
      ETHNIC_CO_HO,
      ETHNIC_CHAM,
      ETHNIC_SAN_DIU,
      ETHNIC_HRE,
      ETHNIC_MONG,
      ETHNIC_RA_GLAI,
      ETHNIC_XTIENG,
      ETHNIC_BRU_VAN_KIEU,
      ETHNIC_THO,
      ETHNIC_GIAY,
      ETHNIC_CO_TU,
      ETHNIC_GIE_TRIENG,
      ETHNIC_MA,
      ETHNIC_KHO_MU,
      ETHNIC_CO,
      ETHNIC_TA_OI,
      ETHNIC_CHO_RO,
      ETHNIC_KHANG,
      ETHNIC_XINH_MUN,
      ETHNIC_HA_NHI,
      ETHNIC_CHU_RU,
      ETHNIC_LAO,
      ETHNIC_LA_CHI,
      ETHNIC_LA_HA,
      ETHNIC_PHU_LA,
      ETHNIC_LA_HU,
      ETHNIC_LU,
      ETHNIC_LO_LO,
      ETHNIC_CHUT,
      ETHNIC_MANG,
      ETHNIC_PA_THEN,
      ETHNIC_CO_LAO,
      ETHNIC_CONG,
      ETHNIC_BO_Y,
      ETHNIC_SI_LA,
      ETHNIC_PU_PEO,
      ETHNIC_BRAU,
      ETHNIC_O_DU,
      ETHNIC_RO_MAM,
    ]);
  }
}

export const ETHNIC_KINH = {
  code: 'KINH',
  name: 'Kinh',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_TAY = {
  code: 'TAY',
  name: 'Tày',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_THAI = {
  code: 'THAI',
  name: 'Thái',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_HOA = {
  code: 'HOA',
  name: 'Hoa',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_KHO_ME = {
  code: 'KHO_ME',
  name: 'Khơ-me',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_MUONG = {
  code: 'MUONG',
  name: 'Mường',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_NUNG = {
  code: 'NUNG',
  name: 'Nùng',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_HMONG = {
  code: 'HMONG',
  name: 'HMông',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_DAO = {
  code: 'DAO',
  name: 'Dao',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_GIA_RAI = {
  code: 'GIA_RAI',
  name: 'Gia-rai',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_NGAI = {
  code: 'NGAI',
  name: 'Ngái',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_E_DE = {
  code: 'E_DE',
  name: 'Ê-đê',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_BA_NA = {
  code: 'BA_NA',
  name: 'Ba na',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_XO_DANG = {
  code: 'XO_DANG',
  name: 'Xơ-Đăng',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_SAN_CHAY = {
  code: 'SAN_CHAY',
  name: 'Sán Chay',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_CO_HO = {
  code: 'CO_HO',
  name: 'Cơ-ho',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_CHAM = {
  code: 'CHAM',
  name: 'Chăm',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_SAN_DIU = {
  code: 'SAN_DIU',
  name: 'Sán Dìu',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_HRE = {
  code: 'HRE',
  name: 'Hrê',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_MONG = {
  code: 'MONG',
  name: 'Mnông',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_RA_GLAI = {
  code: 'RA_GLAI',
  name: 'Ra-glai',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_XTIENG = {
  code: 'XTIENG',
  name: 'Xtiêng',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_BRU_VAN_KIEU = {
  code: 'BRU_VAN_KIEU',
  name: 'Bru-Vân Kiều',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_THO = {
  code: 'THO',
  name: 'Thổ',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_GIAY = {
  code: 'GIAY',
  name: 'Giáy',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_CO_TU = {
  code: 'CO_TU',
  name: 'Cơ-tu',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_GIE_TRIENG = {
  code: 'GIE_TRIENG',
  name: 'Gié Triêng',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_MA = {
  code: 'MA',
  name: 'Mạ',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_KHO_MU = {
  code: 'KHO_MU',
  name: 'Khơ-mú',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_CO = {
  code: 'CO',
  name: 'Co',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_TA_OI = {
  code: 'TA_OI',
  name: 'Tà-ôi',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_CHO_RO = {
  code: 'CHO_RO',
  name: 'Chơ-ro',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_KHANG = {
  code: 'KHANG',
  name: 'Kháng',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_XINH_MUN = {
  code: 'XINH_MUN',
  name: 'Xinh-mun',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_HA_NHI = {
  code: 'HA_NHI',
  name: 'Hà Nhì',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_CHU_RU = {
  code: 'CHU_RU',
  name: 'Chu ru',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_LAO = {
  code: 'LAO',
  name: 'Lào',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_LA_CHI = {
  code: 'LA_CHI',
  name: 'La Chí',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_LA_HA = {
  code: 'LA_HA',
  name: 'La Ha',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_PHU_LA = {
  code: 'PHU_LA',
  name: 'Phù Lá',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_LA_HU = {
  code: 'LA_HU',
  name: 'La Hủ',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_LU = {
  code: 'LU',
  name: 'Lự',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_LO_LO = {
  code: 'LO_LO',
  name: 'Lô Lô',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_CHUT = {
  code: 'CHUT',
  name: 'Chứt',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_MANG = {
  code: 'MANG',
  name: 'Mảng',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_PA_THEN = {
  code: 'PA_THEN',
  name: 'Pà Thẻn',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_CO_LAO = {
  code: 'CO_LAO',
  name: 'Co Lao',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_CONG = {
  code: 'CONG',
  name: 'Cống',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_BO_Y = {
  code: 'BO_Y',
  name: 'Bố Y',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_SI_LA = {
  code: 'SI_LA',
  name: 'Si La',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_PU_PEO = {
  code: 'PU_PEO',
  name: 'Pu Péo',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_BRAU = {
  code: 'BRAU',
  name: 'Brâu',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_O_DU = {
  code: 'O_DU',
  name: 'Ơ Đu',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
export const ETHNIC_RO_MAM = {
  code: 'RO_MAM',
  name: 'Rơ măm',
  displayIconCreate: false,
  displayIconDelete: false,
  displayIconDetail: false,
  displayIconUpdate: false,
} as Ethnic;
