import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPosts11Table1762492063322 implements MigrationInterface {
    name = 'AddPosts11Table1762492063322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Posts11\` ADD \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Posts11\` DROP COLUMN \`created_at\``);
    }

}
