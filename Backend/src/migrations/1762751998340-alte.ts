import { MigrationInterface, QueryRunner } from "typeorm";

export class Alte1762751998340 implements MigrationInterface {
    name = 'Alte1762751998340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`title\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` ADD \`title\` varchar(255) NOT NULL`);
    }

}
