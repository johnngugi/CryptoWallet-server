import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Currency1575406601288 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "currency",
            columns: [
                {
                    name: "id",
                    isPrimary: true,
                    type: "int",
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: "name",
                    type: 'varchar',
                },
                {
                    name: "shortName",
                    type: 'varchar',
                    isNullable: true
                },
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("currency");
    }

}
