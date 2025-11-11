import { MigrationInterface, QueryRunner } from "typeorm";

export class Temp1762852484647 implements MigrationInterface {
    name = 'Temp1762852484647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`twofa_secret\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`is_twofa_enabled\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`is_twofa_enabled\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`twofa_secret\``);
    }

}
