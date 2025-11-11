import { MigrationInterface, QueryRunner } from "typeorm";

export class Tem11p1762852867644 implements MigrationInterface {
    name = 'Tem11p1762852867644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`twofa_secret\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`is_twofa_enabled\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`twofaSecret\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isTwofaEnabled\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isTwofaEnabled\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`twofaSecret\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`is_twofa_enabled\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`twofa_secret\` varchar(255) NULL`);
    }

}
