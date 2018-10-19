import { MongoClient, Db } from 'mongodb';
import { Guid } from 'guid-typescript';

import { DBConfig, MainDBCollection } from '../../../DBModule/DBConfig';
import { DBClient } from '../../../DBModule/DBClient';
import { DBConfigEntity, MethodResponse } from '../../../CommonModule/Entities';
import { isRegExp } from 'util';
import { RegistrationDetail, User } from '../../../CommonModule/DBEntities';

class LicenseDBHandler {

}

export let LicenseDBHandle = new LicenseDBHandler();