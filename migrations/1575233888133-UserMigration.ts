import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class UserMigration1575233888133 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    isPrimary: true,
                    type: "int",
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: "firstName",
                    type: 'varchar',
                },
                {
                    name: "lastName",
                    type: 'varchar'
                },
                {
                    name: "emailAddress",
                    type: 'varchar',
                    length: "200",
                    isUnique: true,
                },
                {
                    name: "password",
                    type: 'varchar',
                }
            ]
        }), true);

        await queryRunner.createIndex("user", new TableIndex({
            name: "IDX_USER_ID",
            columnNames: ["id"]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("user");
    }

}
