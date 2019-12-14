import { MigrationInterface, QueryRunner, getConnection } from "typeorm";
import { createDbRecord } from "../test/utils";
import { currencySeed } from "./currency.seed";

export class SeedCurrency1576261242869 implements MigrationInterface {

    public async up(_queryRunner: QueryRunner): Promise<any> {
        await createDbRecord('currency', currencySeed);
    }

    public async down(_queryRunner: QueryRunner): Promise<any> {
    }

}
