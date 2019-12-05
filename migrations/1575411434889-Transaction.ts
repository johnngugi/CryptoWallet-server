import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Transaction1575411434889 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "transaction",
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
                    name: "from",
                    type: 'varchar',
                },
                {
                    name: "to",
                    type: 'varchar',
                },
                {
                    name: "amount",
                    type: 'decimal',
                    precision: 13,
                    scale: 4
                },
            ],
            foreignKeys: [
                {
                    columnNames: ['currency'],
                    referencedColumnNames: ['id'],
                    referencedTableName: 'currency',
                    onDelete: 'CASCADE'
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable("transaction");
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("currency") !== -1);
        await queryRunner.dropForeignKey("transaction", foreignKey);
        await queryRunner.dropColumn("transaction", "currency");
        await queryRunner.dropTable("transaction");
    }

}
