import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Wallet1575410274251 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "wallet",
            columns: [
                {
                    name: "id",
                    isPrimary: true,
                    type: "int",
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: "currency",
                    type: 'int',
                },
                {
                    name: "address",
                    type: 'varchar',
                },
                {
                    name: "encryptedKey",
                    type: 'varchar',
                },
                {
                    name: "user",
                    type: 'int',
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['currency'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'currency',
                    onDelete: 'CASCADE'
                },
                {
                    columnNames: ['user'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'user',
                    onDelete: 'CASCADE'
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable("wallet");
        const foreignKeyCurrency = table.foreignKeys.find(fk => fk.columnNames.indexOf("currency") !== -1);
        const foreignKeyUser = table.foreignKeys.find(fk => fk.columnNames.indexOf("user") !== -1);
        await queryRunner.dropForeignKey("wallet", foreignKeyCurrency);
        await queryRunner.dropForeignKey("wallet", foreignKeyUser);
        await queryRunner.dropColumn("wallet", "currency");
        await queryRunner.dropColumn("wallet", "user");
        await queryRunner.dropTable("wallet");
    }

}
